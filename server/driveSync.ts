import { createHash } from 'node:crypto';
import { ASSETS, ORIGINALS, db, photosFor, supabase } from './customerMedia.js';

const driveApi = 'https://www.googleapis.com/drive/v3';

class DriveError extends Error {
  constructor(message: string, public retryable = false) { super(message); }
}

async function driveSession() {
  const client_id = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const client_secret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const refresh_token = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
  const root = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
  if (!client_id || !client_secret || !refresh_token || !root || !/^[\w-]+$/.test(root)) {
    throw new DriveError('Thiếu cấu hình kết nối Google Drive.');
  }
  const token = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', body: new URLSearchParams({ client_id, client_secret, refresh_token, grant_type: 'refresh_token' }),
    signal: AbortSignal.timeout(20_000),
  });
  if (!token.ok) throw new DriveError('Không thể làm mới quyền Google Drive. Kiểm tra kết nối owner.', token.status >= 500 || token.status === 429);
  const { access_token } = await token.json();
  const call = async (url: string, options: RequestInit = {}, allow: number[] = []) => {
    const response = await fetch(url, {
      ...options, headers: { Authorization: 'Bearer ' + access_token, ...options.headers },
      signal: AbortSignal.timeout(45_000), redirect: 'error',
    });
    if (!response.ok && !allow.includes(response.status)) {
      const details = await response.json().catch(() => ({}));
      const reasons = (details.error?.errors ?? []).map((error: { reason?: string }) => error.reason);
      const retry = response.status >= 500 || response.status === 429
        || reasons.some((reason: string) => ['rateLimitExceeded','userRateLimitExceeded'].includes(reason));
      throw new DriveError(retry ? 'Google Drive đang quá tải.' : 'Google Drive từ chối lưu ảnh. Kiểm tra quyền và dung lượng.', retry);
    }
    return response;
  };
  return { root, call };
}

async function requirePrivateRoot({ root, call }: Awaited<ReturnType<typeof driveSession>>) {
  let pageToken = '';
  do {
    const query = new URLSearchParams({ fields: 'nextPageToken,permissions(type)', pageSize: '100' });
    if (pageToken) query.set('pageToken', pageToken);
    const response = await call(`${driveApi}/files/${root}/permissions?${query}`);
    const list = await response.json();
    if (list.permissions?.some((permission: { type: string }) => ['anyone', 'domain'].includes(permission.type))) {
      throw new DriveError('Thư mục gốc Drive phải được chia sẻ giới hạn.');
    }
    pageToken = list.nextPageToken ?? '';
  } while (pageToken);
}

const jsonOptions = (body: object) => ({
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
});

export async function checkDrive() {
  if (process.env.GOOGLE_DRIVE_ENABLED !== 'true') return { connected: false, message: 'Đồng bộ Drive đang tắt.' };
  try {
    const drive = await driveSession();
    await requirePrivateRoot(drive);
    const { root, call } = drive;
    const response = await call(`${driveApi}/files/${root}?fields=mimeType,trashed,capabilities(canAddChildren)`);
    const folder = await response.json();
    const connected = folder.mimeType === 'application/vnd.google-apps.folder' && !folder.trashed && folder.capabilities?.canAddChildren === true;
    return { connected, message: connected ? 'Google Drive đã kết nối.' : 'Tài khoản không có quyền ghi vào thư mục gốc.' };
  } catch {
    return { connected: false, message: 'Không thể kết nối thư mục Google Drive.' };
  }
}

interface Job { customer_id: string; lease_id: string; attempts: number }

export async function syncDrive() {
  const [job] = await db<Job[]>('rpc/claim_drive_sync', {});
  if (!job) return;
  const cid = job.customer_id;
  const customerPath = `customers?id=eq.${cid}`;
  const settle = (status: string, error: string | null, next = new Date().toISOString()) =>
    db('rpc/settle_drive_sync', { p_customer: cid, p_lease: job.lease_id, p_status: status, p_error: error, p_next: next });
  try {
    if (job.attempts > 5) throw new DriveError('Đã đạt số lần thử đồng bộ.');
    const drive = await driveSession();
    await requirePrivateRoot(drive);
    const { root, call } = drive;
    const generateId = async () => {
      const result = await call(driveApi + '/files/generateIds?count=1&space=drive');
      const id = (await result.json()).ids?.[0];
      if (typeof id !== 'string' || !/^[\w-]+$/.test(id)) throw new DriveError('Google Drive chưa cấp mã tệp.', true);
      return id;
    };
    const [customer] = await db<{ drive_folder_name: string; drive_folder_id: string | null }[]>(customerPath + '&select=drive_folder_name,drive_folder_id');
    const folderId = customer.drive_folder_id ?? await generateId();
    if (!customer.drive_folder_id) await db(customerPath, { drive_folder_id: folderId }, 'PATCH');
    await call(driveApi + '/files', jsonOptions({
      id: folderId, name: customer.drive_folder_name, mimeType: 'application/vnd.google-apps.folder',
      parents: [root], appProperties: { customerId: cid },
    }), [409]);
    const folder = await (await call(`${driveApi}/files/${folderId}?fields=trashed,parents,appProperties,mimeType`)).json();
    if (folder.trashed || !folder.parents?.includes(root) || folder.appProperties?.customerId !== cid
      || folder.mimeType !== 'application/vnd.google-apps.folder') throw new DriveError('Thư mục Drive không khớp hồ sơ.');
    const photos = await photosFor(cid);
    if (photos.length < 5 || photos.some((photo) => !photo.web_storage_path)) throw new DriveError('Hồ sơ thiếu ảnh đã xác thực.');
    for (const photo of photos) {
      const photoPath = `customer_photos?id=eq.${photo.id}&customer_id=eq.${cid}`;
      const fileId = photo.drive_file_id ?? await generateId();
      if (!photo.drive_file_id) await db(photoPath, { drive_file_id: fileId }, 'PATCH');
      const fields = 'id,md5Checksum,webViewLink,trashed,parents,appProperties';
      let remote = await call(`${driveApi}/files/${fileId}?fields=${fields}`, {}, [404]);
      const matches = (file: { id?: string; trashed?: boolean; parents?: string[]; appProperties?: { photoId?: string }; md5Checksum?: string }, checksum: string) =>
        file.id === fileId && !file.trashed && file.parents?.includes(folderId)
        && file.appProperties?.photoId === photo.id && file.md5Checksum === checksum;
      if (remote.ok && photo.drive_md5 && matches(await remote.clone().json(), photo.drive_md5)) continue;
      const source = await supabase(`/storage/v1/object/authenticated/${ORIGINALS}/${photo.original_storage_path}`);
      const bytes = Buffer.from(await source.arrayBuffer());
      if (createHash('sha256').update(bytes).digest('hex') !== photo.checksum_sha256) {
        throw new DriveError('Ảnh gốc đã thay đổi sau khi xác thực.');
      }
      if (remote.status === 404) {
        const ext = photo.original_storage_path.split('.').pop();
        const name = `${String(photo.sort_order + 1).padStart(2, '0')}_${photo.preferred_cover ? 'cover' : 'photo'}.${ext}`;
        const upload = await call(`https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&fields=${fields}`, {
          ...jsonOptions({ id: fileId, name, parents: [folderId], appProperties: { photoId: photo.id } }),
          headers: { 'Content-Type': 'application/json', 'X-Upload-Content-Type': photo.original_mime, 'X-Upload-Content-Length': String(bytes.length) },
        }, [409]);
        if (upload.status === 409) {
          remote = await call(`${driveApi}/files/${fileId}?fields=${fields}`);
        } else {
          const location = upload.headers.get('location');
          if (!location || !location.startsWith('https://www.googleapis.com/upload/drive/')) throw new DriveError('Phiên tải Drive không hợp lệ.', true);
          remote = await call(location, { method: 'PUT', headers: { 'Content-Type': photo.original_mime }, body: new Uint8Array(bytes) });
        }
      }
      const file = await remote.json();
      if (!matches(file, createHash('md5').update(bytes).digest('hex'))) {
        throw new DriveError('Tệp trên Drive thiếu hoặc không khớp ảnh gốc.');
      }
      await db(photoPath, { drive_md5: file.md5Checksum, drive_web_view_link: file.webViewLink ?? null }, 'PATCH');
    }
    await settle('ready', null);
  } catch (error) {
    const retry = job.attempts < 5 && (!(error instanceof DriveError) || error.retryable);
    await settle(retry ? 'retrying' : 'failed',
      error instanceof DriveError ? error.message : 'Đồng bộ ảnh tạm thời thất bại.',
      new Date(Date.now() + 60_000 * 2 ** Math.min(job.attempts, 5)).toISOString());
  }
}

export async function deleteDriveCustomer(
  customerId: string,
  folderId: string | null,
  photos: Array<{ id: string; drive_file_id: string | null }>,
) {
  if (!folderId && photos.every((photo) => !photo.drive_file_id)) return;
  if (!folderId || !/^[\w-]+$/.test(folderId)) throw new DriveError('Không xác định được thư mục ảnh trên Google Drive.');

  const drive = await driveSession();
  await requirePrivateRoot(drive);
  const { root, call } = drive;
  const folderResponse = await call(
    `${driveApi}/files/${folderId}?fields=trashed,parents,appProperties,mimeType`, {}, [404],
  );
  const folder = folderResponse.ok ? await folderResponse.json() : null;
  if (folder && (folder.trashed || !folder.parents?.includes(root)
    || folder.appProperties?.customerId !== customerId
    || folder.mimeType !== 'application/vnd.google-apps.folder')) {
    throw new DriveError('Thư mục Drive không khớp hồ sơ khách hàng.');
  }

  for (const photo of photos) {
    if (!photo.drive_file_id) continue;
    if (!/^[\w-]+$/.test(photo.drive_file_id)) throw new DriveError('Mã ảnh trên Google Drive không hợp lệ.');
    const response = await call(
      `${driveApi}/files/${photo.drive_file_id}?fields=trashed,parents,appProperties`, {}, [404],
    );
    if (!response.ok) continue;
    const file = await response.json();
    if (file.trashed) continue;
    if (!file.parents?.includes(folderId) || file.appProperties?.photoId !== photo.id) {
      throw new DriveError('Ảnh trên Drive không khớp hồ sơ khách hàng.');
    }
    await call(`${driveApi}/files/${photo.drive_file_id}`, { method: 'DELETE' }, [404]);
  }

  if (folder) await call(`${driveApi}/files/${folderId}`, { method: 'DELETE' }, [404]);
}

export async function cleanupUploads() {
  const cutoff = new Date(Date.now() - 3 * 3600_000).toISOString();
  const stale = await db<{ id: string; customer_id: string }[]>(
    `photo_upload_sessions?completed_at=is.null&cleaned_at=is.null&expires_at=lt.${cutoff}&select=id,customer_id&limit=3`,
  );
  for (const row of stale) {
    const photos = await photosFor(row.customer_id);
    await supabase(`/storage/v1/object/${ORIGINALS}`, {
      method: 'DELETE', body: JSON.stringify({ prefixes: photos.map((photo) => photo.original_storage_path) }),
    });
    for (const photo of photos) {
      const prefix = `requests/${row.customer_id}/${photo.id}`;
      const listed = await supabase(`/storage/v1/object/list/${ASSETS}`, { method: 'POST', body: JSON.stringify({ prefix }) });
      const files = await listed.json() as { name: string }[];
      if (files.length) await supabase(`/storage/v1/object/${ASSETS}`, {
        method: 'DELETE', body: JSON.stringify({ prefixes: files.map((file) => prefix + '/' + file.name) }),
      });
    }
    await db(`customers?id=eq.${row.customer_id}`, { photo_sync_status: 'abandoned' }, 'PATCH');
    await db(`photo_upload_sessions?id=eq.${row.id}`, { cleaned_at: new Date().toISOString() }, 'PATCH');
  }
}
