import { createHash, createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import sharp from 'sharp';
import { ASSETS, ORIGINALS, MediaError, db, photosFor, requireAdmin, selectedPhotos, signAsset, supabase, supabaseUrl, type PhotoRef } from '../server/customerMedia';
import { checkDrive, syncDrive, cleanupUploads } from '../server/driveSync';

const MiB = 1024 * 1024;
const formats: Record<string, [string, string]> = {
  'image/jpeg': ['jpg', 'jpeg'], 'image/png': ['png', 'png'], 'image/webp': ['webp', 'webp'],
};
const hash = (value: string | Buffer) => createHash('sha256').update(value).digest('hex');
const uuid = (value: unknown) => {
  if (typeof value !== 'string' || !/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(value)) {
    throw new MediaError(400, 'Mã yêu cầu không hợp lệ.');
  }
  return value.toLowerCase();
};
const clean = (value: unknown, max: number) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
const flag = (name: string) => process.env[name] === 'true';

const challengeDelay = 1500;
const challengeTTL = 5 * 60_000;

function uploadIdentity(body: Record<string, unknown>) {
  const id = uuid(body.idempotencyKey);
  const token = clean(body.submissionToken, 128);
  if (!/^[a-f0-9]{64}$/.test(token)) throw new MediaError(400, 'Token tải ảnh không hợp lệ.');
  return { id, token };
}

function uploadDigest(purpose: string, value: string) {
  const secret = process.env.UPLOAD_ABUSE_SECRET || process.env.SUPABASE_SECRET_KEY;
  if (!secret) throw new MediaError(503, 'Kho ảnh chưa được cấu hình.');
  return createHmac('sha256', secret).update(purpose + ':' + value).digest('hex');
}

function uploadIp(request: Request) {
  return request.headers.get('x-vercel-forwarded-for')?.split(',')[0].trim() || 'unknown';
}

function checkUploadRequest(request: Request) {
  const origin = request.headers.get('origin');
  const site = request.headers.get('sec-fetch-site');
  if ((origin && origin !== new URL(request.url).origin) || (site && site !== 'same-origin' && site !== 'none')) {
    throw new MediaError(403, 'Yêu cầu tải ảnh phải được gửi từ trang thiệp.');
  }
}

function uploadChallenge(id: string, token: string, timestamp: number) {
  return uploadDigest('challenge', JSON.stringify([id, hash(token), timestamp]));
}

function verifyChallenge(body: Record<string, unknown>, id: string, token: string) {
  const [time, signature] = clean(body.challenge, 100).split('.');
  const timestamp = Number(time);
  const age = Date.now() - timestamp;
  if (!Number.isSafeInteger(timestamp) || age < challengeDelay || age > challengeTTL
    || !/^[a-f0-9]{64}$/.test(signature ?? '')
    || !timingSafeEqual(Buffer.from(signature), Buffer.from(uploadChallenge(id, token, timestamp)))) {
    throw new MediaError(403, 'Phiên xác minh đã hết hạn hoặc chưa hợp lệ. Vui lòng bấm gửi lại.');
  }
}

function hourlyUploadLimit() {
  const limit = Number(process.env.UPLOAD_LIMIT_PER_HOUR);
  return Number.isInteger(limit) && limit >= 1 && limit <= 500 ? limit : 60;
}

interface UploadSession {
  customer_id: string;
  fingerprint: string;
  completed_at: string | null;
  expires_at: string;
}
async function session(id: string, token: string) {
  const [row] = await db<UploadSession[]>(`photo_upload_sessions?id=eq.${id}&token_hash=eq.${hash(token)}&select=customer_id,fingerprint,completed_at,expires_at`);
  return row;
}

async function customer(id: string) {
  const [row] = await db<{ request_code: string; drive_folder_id: string | null; photo_sync_status: string }[]>(
    `customers?id=eq.${id}&select=request_code,drive_folder_id,photo_sync_status`,
  );
  if (!row) throw new MediaError(404, 'Không tìm thấy hồ sơ.');
  return row;
}

async function init(request: Request, body: Record<string, unknown>) {
  const { id, token } = uploadIdentity(body);
  const raw = body.customer as Record<string, unknown> | undefined;
  if (!raw || typeof raw !== 'object' || raw.company) throw new MediaError(400, 'Thông tin yêu cầu không hợp lệ.');
  if (body.consent !== true) throw new MediaError(400, 'Vui lòng xác nhận đồng ý sử dụng ảnh.');
  const limits = { fullName: 120, email: 180, phone: 30, brideName: 80, groomName: 80, weddingDate: 10,
    weddingTime: 5, venue: 180, address: 300, message: 1000, selectedTemplateId: 100 };
  const fields = Object.fromEntries(Object.entries(limits).map(([key, limit]) => [key, clean(raw[key], limit)]));
  fields.phone = fields.phone.replace(/[\s().-]/g, '').replace(/^(?:\+84|0084)/, '0');
  const date = new Date(fields.weddingDate + 'T00:00:00Z');
  const invalidDate = fields.weddingDate && (!/^\d{4}-\d{2}-\d{2}$/.test(fields.weddingDate)
    || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== fields.weddingDate
    || fields.weddingDate.startsWith('0000-'));
  if (!/^\d{9,15}$/.test(fields.phone) || fields.fullName.length < 2 || !fields.brideName || !fields.groomName
    || invalidDate
    || (fields.weddingTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(fields.weddingTime))) {
    throw new MediaError(400, 'Thông tin liên hệ hoặc ngày giờ cưới chưa hợp lệ.');
  }
  const inputPhotos = body.photos;
  if (!Array.isArray(inputPhotos) || inputPhotos.length < 5 || inputPhotos.length > 7) {
    throw new MediaError(400, 'Vui lòng chọn từ 5 đến 7 ảnh.');
  }
  const cover = inputPhotos.findIndex((photo) => photo?.preferredCover === true);
  const photos = inputPhotos.map((photo, order) => {
    const mime = clean(photo?.mime, 30);
    if (!Object.hasOwn(formats, mime) || !Number.isInteger(photo?.size) || photo.size < 1 || photo.size > 15 * MiB) {
      throw new MediaError(400, 'Chỉ nhận JPEG, PNG, WebP tối đa 15 MiB mỗi ảnh.');
    }
    return { mime, size: photo.size, filename: clean(photo.filename, 180), order, cover: order === Math.max(0, cover), ext: formats[mime][0] };
  });
  if (photos.reduce((sum, photo) => sum + photo.size, 0) > 80 * MiB) throw new MediaError(413, 'Tổng dung lượng vượt 80 MiB.');
  verifyChallenge(body, id, token);
  const fingerprint = hash(JSON.stringify([fields, photos]));
  const args = {
    p_id: id, p_hash: hash(token), p_fingerprint: fingerprint,
    p_ip: uploadDigest('ip', uploadIp(request)), p_phone: uploadDigest('phone', fields.phone),
    p_hourly_limit: hourlyUploadLimit(), p_customer: fields,
  };
  const existing = await session(id, token);
  if (existing && existing.fingerprint !== fingerprint) throw new MediaError(409, 'Thông tin yêu cầu đã thay đổi.');
  if (existing?.completed_at) return json({ requestCode: (await customer(existing.customer_id)).request_code, received: photos.length });
  if (existing && new Date(existing.expires_at) <= new Date()) throw new MediaError(410, 'Phiên tải ảnh đã hết hạn.');
  let customerId = existing?.customer_id;
  if (!customerId) {
    customerId = await db<string>('rpc/init_photo_request_limited', { ...args, p_photos: photos });
  }
  const uploads = await Promise.all((await photosFor(customerId)).map(async (photo) => {
    const response = await supabase(`/storage/v1/object/upload/sign/${ORIGINALS}/${photo.original_storage_path}`, {
      method: 'POST', body: '{}',
    });
    const signed = await response.json() as { token?: string; url?: string };
    const signedUploadToken = signed.token ?? (signed.url ? new URL(signed.url, supabaseUrl()).searchParams.get('token') : null);
    if (!signedUploadToken) throw new MediaError(502, 'Kho ảnh chưa cấp token tải lên.');
    return { photoId: photo.id, order: photo.sort_order, path: photo.original_storage_path, signedUploadToken };
  }));
  const storage = new URL(supabaseUrl());
  const tusOrigin = storage.hostname.endsWith('.supabase.co')
    ? `https://${storage.hostname.replace(/\.supabase\.co$/, '.storage.supabase.co')}`
    : storage.origin;
  return json({ uploads, tusEndpoint: tusOrigin + '/storage/v1/upload/resumable' }, 201);
}

async function complete(id: string, token: string) {
  const row = await session(id, token);
  if (!row) throw new MediaError(403, 'Phiên tải ảnh không hợp lệ.');
  const photos = await photosFor(row.customer_id);
  if (row.completed_at) return json({ requestCode: (await customer(row.customer_id)).request_code, received: photos.length });
  if (new Date(row.expires_at) <= new Date()) throw new MediaError(410, 'Phiên tải ảnh đã hết hạn.');
  if (photos.length < 5 || photos.length > 7) throw new MediaError(400, 'Ảnh tải lên chưa đầy đủ.');
  const lease = randomUUID();
  const locked = await db<boolean>('rpc/claim_photo_validation', { p_id: id, p_hash: hash(token), p_lease: lease });
  if (!locked) throw new MediaError(409, 'Ảnh đang được xác thực. Vui lòng thử lại sau.');
  try {
    return await validateAndComplete(id, token, lease, row.customer_id, photos);
  } finally {
    await db(`photo_upload_sessions?id=eq.${id}&validation_lease=eq.${lease}`, {
      validation_lease: null, validation_until: null,
    }, 'PATCH').catch(() => {});
  }
}

async function validateAndComplete(id: string, token: string, lease: string, customerId: string, photos: Awaited<ReturnType<typeof photosFor>>) {
  const results: Array<{ id: string; path: string; checksum: string }> = [];
  const seen = new Set<string>();
  for (const photo of photos) {
    const position = photo.sort_order + 1;
    const source = await supabase(`/storage/v1/object/authenticated/${ORIGINALS}/${photo.original_storage_path}`);
    const bytes = Buffer.from(await source.arrayBuffer());
    if (bytes.length !== photo.original_size) throw new MediaError(422, `Dung lượng ảnh số ${position} không khớp.`);
    const checksum = hash(bytes);
    if (seen.has(checksum)) throw new MediaError(422, `Ảnh số ${position} trùng nội dung với ảnh khác.`);
    seen.add(checksum);
    const image = sharp(bytes, { limitInputPixels: 80_000_000, failOn: 'warning' });
    let web: Buffer;
    try {
      const meta = await image.metadata();
      if (meta.format !== formats[photo.original_mime]?.[1] || (meta.pages ?? 1) !== 1) throw new Error('format');
      web = await image.rotate().resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 }).toBuffer();
    } catch {
      throw new MediaError(422, `Ảnh số ${position} bị lỗi hoặc không đúng định dạng JPEG, PNG, WebP.`);
    }
    const path = `requests/${customerId}/${photo.id}/${checksum}.webp`;
    await supabase(`/storage/v1/object/${ASSETS}/${path}`, {
      method: 'POST', headers: { 'Content-Type': 'image/webp', 'x-upsert': 'true' }, body: new Uint8Array(web),
    });
    results.push({ id: photo.id, path, checksum });
  }
  const requestCode = await db<string>('rpc/complete_photo_request', {
    p_id: id, p_hash: hash(token), p_lease: lease, p_results: results, p_sync_drive: flag('GOOGLE_DRIVE_ENABLED'),
  });
  return json({ requestCode, received: photos.length }, 202);
}

async function publicDemo(token: string) {
  if (!/^[a-f0-9]{48}$/i.test(token)) throw new MediaError(404, 'Link demo không hợp lệ.');
  const [demo] = await db<Array<{ id: string; customer_id: string; template_id: string; note: string; expires_at: string | null; payload: Record<string, unknown> & { photos?: PhotoRef[] } }>>(
    `invitation_demos?public_token=eq.${token}&status=eq.published&select=id,customer_id,template_id,note,expires_at,payload`,
  );
  if (!demo || (demo.expires_at && new Date(demo.expires_at) <= new Date())) {
    throw new MediaError(404, 'Link demo không tồn tại hoặc đã hết hạn.');
  }
  const { customer_id, payload: storedPayload, ...details } = demo;
  const payload = storedPayload ?? {};
  const selected = await selectedPhotos(customer_id, payload.photos ?? []);
  const ttl = demo.expires_at ? Math.max(1, Math.min(900, Math.floor((Date.parse(demo.expires_at) - Date.now()) / 1000))) : 900;
  const photos = await Promise.all(selected.map(async ({ ref, path }) => ({
    ...ref, url: await signAsset(ASSETS, path, ttl),
  })));
  const publicFields = ['brideName', 'groomName', 'weddingDate', 'weddingTime', 'venue', 'address', 'message', 'coverUrl'];
  const invitation = Object.fromEntries(publicFields.map((key) => [key, String(payload[key] ?? (key === 'weddingTime' ? '18:00' : ''))]));
  return json({ ...details, payload: { ...invitation, photos } });
}

export default {
  async fetch(request: Request) {
    const action = new URL(request.url).searchParams.get('action');
    try {
      if (request.method === 'GET' && action === 'worker') {
        const key = process.env.CRON_SECRET;
        const supplied = request.headers.get('authorization') ?? '';
        const expected = `Bearer ${key}`;
        if (!key || Buffer.byteLength(supplied) !== Buffer.byteLength(expected)
          || !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) throw new MediaError(401, 'Không có quyền chạy đồng bộ.');
        if (flag('GOOGLE_DRIVE_ENABLED')) await syncDrive();
        await cleanupUploads();
        return json({ ok: true });
      }
      if (request.method !== 'POST') throw new MediaError(405, 'Phương thức không hợp lệ.');
      if (['challenge', 'init', 'complete', 'status'].includes(action ?? '')) checkUploadRequest(request);
      if (action === 'contact') throw new MediaError(403, 'Vui lòng gửi yêu cầu kèm ảnh.');
      const raw = await request.text();
      if (raw.length > 32_768) throw new MediaError(413, 'Dữ liệu yêu cầu quá lớn.');
      let body: Record<string, unknown>;
      try { body = JSON.parse(raw); } catch { throw new MediaError(400, 'Dữ liệu yêu cầu không hợp lệ.'); }
      if (!body || typeof body !== 'object' || Array.isArray(body)) throw new MediaError(400, 'Dữ liệu yêu cầu không hợp lệ.');
      if (action === 'challenge') {
        const { id, token } = uploadIdentity(body);
        const timestamp = Date.now();
        return json({ challenge: timestamp + '.' + uploadChallenge(id, token, timestamp), waitMs: challengeDelay });
      }
      if (action === 'init') return await init(request, body);
      if (action === 'complete' || action === 'status') {
        const { id, token } = uploadIdentity(body);
        if (action === 'complete') return await complete(id, token);
        const row = await session(id, token);
        if (!row) throw new MediaError(403, 'Phiên tải ảnh không hợp lệ.');
        const details = await customer(row.customer_id);
        return json({ requestCode: details.request_code, status: details.photo_sync_status });
      }
      if (action === 'demo') return await publicDemo(clean(body.token, 64));
      await requireAdmin(request);
      const driveEnabled = flag('GOOGLE_DRIVE_ENABLED');
      if (!driveEnabled && (action === 'drive-health' || action === 'retry')) {
        throw new MediaError(503, 'Đồng bộ Drive chưa được bật.');
      }
      if (action === 'drive-health') return json(await checkDrive());
      const id = uuid(body.customerId);
      if (action === 'retry') {
        const response = await fetch(supabaseUrl() + '/rest/v1/rpc/retry_drive_sync', {
          method: 'POST',
          headers: { apikey: process.env.SUPABASE_PUBLISHABLE_KEY!, Authorization: request.headers.get('authorization')!, 'Content-Type': 'application/json' },
          body: JSON.stringify({ p_customer: id }),
        });
        if (!response.ok) throw new MediaError(response.status === 403 ? 403 : 502, 'Không thể lên lịch đồng bộ lại.');
        if (await response.json() !== true) throw new MediaError(409, 'Yêu cầu chưa cần đồng bộ lại.');
        return json({ ok: true });
      }
      if (action !== 'library') throw new MediaError(404, 'Không tìm thấy chức năng.');
      const [details, rows, jobs] = await Promise.all([
        customer(id), photosFor(id), driveEnabled ? db<Array<{ status: string; last_error: string | null }>>(`drive_sync_jobs?customer_id=eq.${id}&select=status,last_error`) : [],
      ]);
      const photos = await Promise.all(rows.filter((photo) => photo.web_storage_path).map(async (photo) => ({
        id: photo.id, name: photo.original_name, preferredCover: photo.preferred_cover,
        url: await signAsset(ASSETS, photo.web_storage_path!),
      })));
      const status = !driveEnabled && photos.length ? 'storage_ready' : jobs[0]?.status ?? details.photo_sync_status;
      return json({ photos, requestCode: details.request_code, folderId: details.drive_folder_id, status, driveEnabled, error: jobs[0]?.last_error });
    } catch (error) {
      if (error instanceof MediaError) return json({ code: `MEDIA_${error.status}`, message: error.message }, error.status);
      return json({ code: 'MEDIA_500', message: 'Không thể xử lý yêu cầu ảnh. Vui lòng thử lại.' }, 500);
    }
  },
};
