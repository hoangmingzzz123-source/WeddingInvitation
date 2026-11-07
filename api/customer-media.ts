import { createHash, createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { unzipSync } from 'fflate';
import { ASSETS, CUSTOM_TEMPLATES, EXPORTS, ORIGINALS, MediaError, db, photosFor, requireAdmin, selectedPhotos, signAsset, supabase, supabaseUrl, type PhotoRef } from '../server/customerMedia.js';
import { checkDrive, syncDrive, cleanupUploads, deleteDriveCustomer } from '../server/driveSync.js';
import { isSupportedWeddingMusicUrl, weddingMusicTracks } from '../src/data/weddingMusic.js';

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
const publicStudioKeys = ['packageTier', 'city', 'headerMonogramText', 'ceremonyTime', 'receptionTime', 'ceremonyTitle', 'receptionTitle', 'brideCeremonyTitle', 'brideReceptionTitle', 'brideCeremonyTime', 'brideReceptionTime', 'brideHeroKicker', 'brideAddress', 'brideReceptionAddress', 'brideVenue', 'groomCeremonyTitle', 'groomReceptionTitle', 'groomCeremonyTime', 'groomReceptionTime', 'groomHeroKicker', 'groomAddress', 'groomReceptionAddress', 'groomVenue', 'heroKicker', 'albumTitle', 'timeLabel', 'venueLabel', 'signatureText', 'theme', 'fontStyle', 'rsvpQuestions'];
const invitationSections = new Set(['story', 'events', 'timeline', 'album', 'video', 'qr', 'guestbook', 'venue', 'rsvp']);
const templateMimeTypes: Record<string, string> = {
  html: 'text/html; charset=utf-8', css: 'text/css; charset=utf-8', js: 'application/javascript; charset=utf-8',
  json: 'application/json; charset=utf-8', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
  webp: 'image/webp', svg: 'image/svg+xml', woff: 'font/woff', woff2: 'font/woff2', ttf: 'font/ttf', otf: 'font/otf',
  md: 'text/markdown; charset=utf-8',
};
const templateExtensions = new Set(Object.keys(templateMimeTypes));
const maxTemplateZipBytes = 4 * MiB;
const maxTemplateExpandedBytes = 12 * MiB;
const maxTemplateFileBytes = 2 * MiB;

function templateAssetBase(id: string) {
  return `${supabaseUrl()}/storage/v1/object/public/${CUSTOM_TEMPLATES}/${id}/`;
}

async function customTemplateRecord(id: string) {
  const [template] = await db<Array<{ id: string; name: string; entry_file: string; manifest: Record<string, unknown> }>>(
    `custom_invitation_templates?id=eq.${uuid(id)}&select=id,name,entry_file,manifest&limit=1`,
  );
  return template ? {
    id: template.id,
    name: template.name,
    entryFile: template.entry_file,
    manifest: template.manifest,
    assetBaseUrl: templateAssetBase(template.id),
  } : null;
}

async function customTemplateForPayload(payload: Record<string, unknown>) {
  return typeof payload.customTemplateId === 'string'
    ? customTemplateRecord(payload.customTemplateId)
    : null;
}

async function listCustomTemplates(customerIdValue?: unknown) {
  const customerId = customerIdValue ? uuid(customerIdValue) : '';
  const scope = customerId
    ? `&or=(owner_customer_id.is.null,owner_customer_id.eq.${customerId})`
    : '&owner_customer_id=is.null';
  const rows = await db<Array<{ id: string; name: string; entry_file: string; manifest: Record<string, unknown>; created_at: string }>>(
    `custom_invitation_templates?select=id,name,entry_file,manifest,created_at&order=created_at.desc${scope}`,
  );
  return rows.map((row) => ({
    id: row.id, name: row.name, entryFile: row.entry_file, manifest: row.manifest,
    createdAt: row.created_at, assetBaseUrl: templateAssetBase(row.id),
  }));
}

function safeTemplatePath(value: string) {
  const path = value;
  return Boolean(path) && !path.includes('\\') && !path.startsWith('/') && !path.includes(':')
    && path.split('/').every((part) => Boolean(part) && part !== '.' && part !== '..')
    && /^[a-zA-Z0-9._/-]+$/.test(path);
}

async function uploadCustomTemplate(request: Request) {
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > maxTemplateZipBytes + 128 * 1024) throw new MediaError(413, 'ZIP mẫu cần nhỏ hơn 4 MiB.');
  const form = await request.formData();
  const archive = form.get('file');
  if (!(archive instanceof File) || !archive.name.toLowerCase().endsWith('.zip') || !archive.size || archive.size > maxTemplateZipBytes) {
    throw new MediaError(400, 'Hãy tải lên file ZIP có dung lượng tối đa 4 MiB.');
  }

  let fileCount = 0;
  let expandedBytes = 0;
  const seenPaths = new Set<string>();
  let extracted: Record<string, Uint8Array>;
  try {
    extracted = unzipSync(new Uint8Array(await archive.arrayBuffer()), {
      filter: (file) => {
        const path = file.name;
        if (path.endsWith('/')) return false;
        fileCount += 1;
        const size = file.originalSize;
        expandedBytes += size;
        const extension = path.split('.').pop()?.toLowerCase() ?? '';
        if (fileCount > 60 || !Number.isSafeInteger(size) || size < 0 || !safeTemplatePath(path) || seenPaths.has(path)
          || path === 'invitation.config.json' || path === 'mp-invitation-export.json' || path.startsWith('customer-assets/')
          || !templateExtensions.has(extension)
          || size > maxTemplateFileBytes || expandedBytes > maxTemplateExpandedBytes) {
          throw new MediaError(422, 'ZIP có đường dẫn, định dạng hoặc dung lượng file không được hỗ trợ.');
        }
        seenPaths.add(path);
        return true;
      },
    });
  } catch (error) {
    if (error instanceof MediaError) throw error;
    throw new MediaError(422, 'Không đọc được ZIP mẫu. Hãy kiểm tra file nén và thử lại.');
  }

  const manifestBytes = extracted['manifest.json'];
  if (!manifestBytes || manifestBytes.length > 32 * 1024) throw new MediaError(422, 'ZIP cần có manifest.json tối đa 32 KiB.');
  let manifest: Record<string, unknown>;
  try { manifest = JSON.parse(new TextDecoder().decode(manifestBytes)) as Record<string, unknown>; }
  catch { throw new MediaError(422, 'manifest.json không phải JSON hợp lệ.'); }
  const entryFile = typeof manifest.entry === 'string' ? manifest.entry : 'index.html';
  if (manifest.version !== 1 || typeof manifest.name !== 'string' || !manifest.name.trim()
    || manifest.name.length > 80 || !safeTemplatePath(entryFile) || !entryFile.toLowerCase().endsWith('.html')
    || !extracted[entryFile]) {
    throw new MediaError(422, 'manifest.json cần version: 1, name và entry trỏ tới file HTML có trong ZIP.');
  }
  const html = new TextDecoder().decode(extracted[entryFile]);
  if (/<\s*(iframe|object|embed)\b/i.test(html) || /<\s*base\b/i.test(html)) {
    throw new MediaError(422, 'Mẫu không được chứa iframe, object, embed hoặc base tag.');
  }

  const id = randomUUID();
  const paths = Object.keys(extracted);
  for (const path of paths) {
    const extension = path.split('.').pop()?.toLowerCase() ?? '';
    await supabase(`/storage/v1/object/${CUSTOM_TEMPLATES}/${id}/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': templateMimeTypes[extension], 'x-upsert': 'true' },
      body: extracted[path].buffer.slice(
        extracted[path].byteOffset,
        extracted[path].byteOffset + extracted[path].byteLength,
      ) as ArrayBuffer,
    });
  }
  const cleanManifest = { version: 1, name: manifest.name.trim(), entry: entryFile };
  await db('custom_invitation_templates', {
    id, name: cleanManifest.name, entry_file: entryFile, manifest: cleanManifest,
    file_paths: paths,
  });
  return json({
    id, name: cleanManifest.name, entryFile, manifest: cleanManifest,
    assetBaseUrl: templateAssetBase(id),
  }, 201);
}

async function initAdminPhotoUpload(body: Record<string, unknown>) {
  const customerId = uuid(body.customerId);
  const files = body.files;
  if (!Array.isArray(files) || !files.length || files.length > 10) {
    throw new MediaError(400, 'Chọn từ 1 đến 10 ảnh mỗi lần tải.');
  }
  const [customerRow] = await db<Array<{ id: string }>>(`customers?id=eq.${customerId}&select=id&limit=1`);
  if (!customerRow) throw new MediaError(404, 'Không tìm thấy khách hàng.');
  const existing = await photosFor(customerId);
  if (existing.length + files.length > 30) throw new MediaError(413, 'Thư viện khách hàng tối đa 30 ảnh.');

  const normalized = files.map((value, index) => {
    const file = value as Record<string, unknown>;
    const mime = clean(file.mime, 30);
    const size = Number(file.size);
    if (!Object.hasOwn(formats, mime) || !Number.isInteger(size) || size < 1 || size > 15 * MiB) {
      throw new MediaError(400, `Ảnh số ${index + 1} cần là JPEG, PNG hoặc WebP tối đa 15 MiB.`);
    }
    return { name: clean(file.name, 180) || `anh-${index + 1}.${formats[mime][0]}`, mime, size, id: randomUUID() };
  });
  if (normalized.reduce((total, file) => total + file.size, 0) > 80 * MiB) {
    throw new MediaError(413, 'Tổng dung lượng mỗi lần tải tối đa 80 MiB.');
  }

  const uploads = await Promise.all(normalized.map(async (file, index) => {
    const path = `requests/${customerId}/${file.id}/original.${formats[file.mime][0]}`;
    const response = await supabase(`/storage/v1/object/upload/sign/${ORIGINALS}/${path}`, {
      method: 'POST', body: '{}',
    });
    const signed = await response.json() as { token?: string; url?: string };
    const signedUploadToken = signed.token ?? (signed.url ? new URL(signed.url, supabaseUrl()).searchParams.get('token') : null);
    if (!signedUploadToken) throw new MediaError(502, 'Kho ảnh chưa cấp token tải lên.');
    return { photoId: file.id, order: existing.length + index, path, signedUploadToken, name: file.name, mime: file.mime, size: file.size };
  }));
  const storage = new URL(supabaseUrl());
  const tusOrigin = storage.hostname.endsWith('.supabase.co')
    ? `https://${storage.hostname.replace(/\.supabase\.co$/, '.storage.supabase.co')}`
    : storage.origin;
  return json({ uploads, tusEndpoint: `${tusOrigin}/storage/v1/upload/resumable` });
}

async function completeAdminPhotoUpload(body: Record<string, unknown>) {
  const customerId = uuid(body.customerId);
  const uploads = body.uploads;
  if (!Array.isArray(uploads) || !uploads.length || uploads.length > 10) {
    throw new MediaError(400, 'Danh sách ảnh tải lên không hợp lệ.');
  }
  const specs = uploads.map((value, index) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new MediaError(400, 'Thông tin ảnh tải lên không hợp lệ.');
    const upload = value as Record<string, unknown>;
    const photoId = uuid(upload.photoId);
    const mime = clean(upload.mime, 30);
    if (!formats[mime]) throw new MediaError(400, 'Định dạng ảnh tải lên không hợp lệ.');
    return {
      photoId, mime, format: formats[mime], size: Number(upload.size),
      name: clean(upload.name, 180) || `anh-${index + 1}.${formats[mime][0]}`,
    };
  });
  if (new Set(specs.map((item) => item.photoId)).size !== specs.length) throw new MediaError(400, 'Danh sách ảnh bị trùng mã.');
  const originalPaths = specs.map(({ photoId, format }) => `requests/${customerId}/${photoId}/original.${format[0]}`);
  const [customerRow] = await db<Array<{ id: string }>>(`customers?id=eq.${customerId}&select=id&limit=1`);
  if (!customerRow) throw new MediaError(404, 'Không tìm thấy khách hàng.');
  const existing = await photosFor(customerId);
  if (existing.length + specs.length > 30) throw new MediaError(413, 'Thư viện khách hàng tối đa 30 ảnh.');
  const existingChecksums = new Set(existing.map((photo) => photo.checksum_sha256).filter(Boolean));
  const batchChecksums = new Set<string>();
  const firstSortOrder = Math.max(-1, ...existing.map((photo) => photo.sort_order)) + 1;
  const sharp = await loadSharp();
  const rows: Array<Record<string, unknown>> = [];
  const addedAssetPaths: string[] = [];

  try {
    for (const [index, upload] of specs.entries()) {
      const { photoId, mime, format } = upload;
      const originalPath = originalPaths[index];
      const source = await supabase(`/storage/v1/object/authenticated/${ORIGINALS}/${originalPath}`);
      const bytes = Buffer.from(await source.arrayBuffer());
      if (!bytes.length || bytes.length > 15 * MiB || bytes.length !== upload.size) {
        throw new MediaError(422, `Dung lượng ảnh số ${index + 1} không khớp.`);
      }
      const checksum = hash(bytes);
      if (existingChecksums.has(checksum) || batchChecksums.has(checksum)) {
        throw new MediaError(422, `Ảnh số ${index + 1} trùng nội dung với ảnh đã có.`);
      }
      batchChecksums.add(checksum);
      let web: Buffer;
      try {
        const image = sharp(bytes, { limitInputPixels: 80_000_000, failOn: 'warning' });
        const meta = await image.metadata();
        if (meta.format !== format[1] || (meta.pages ?? 1) !== 1) throw new Error('format');
        web = await image.rotate().resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 82 }).toBuffer();
      } catch {
        throw new MediaError(422, `Ảnh số ${index + 1} bị lỗi hoặc không đúng định dạng JPEG, PNG, WebP.`);
      }
      const webPath = `requests/${customerId}/${photoId}/${checksum}.webp`;
      await supabase(`/storage/v1/object/${ASSETS}/${webPath}`, {
        method: 'POST', headers: { 'Content-Type': 'image/webp', 'x-upsert': 'true' }, body: new Uint8Array(web),
      });
      addedAssetPaths.push(webPath);
      rows.push({
        id: photoId, customer_id: customerId, original_name: upload.name,
        original_mime: mime, original_size: bytes.length, original_storage_path: originalPath,
        web_storage_path: webPath, checksum_sha256: checksum, sort_order: firstSortOrder + index, preferred_cover: false,
      });
    }

    await db('customer_photos', rows);
    const driveEnabled = flag('GOOGLE_DRIVE_ENABLED');
    const totalPhotos = existing.length + rows.length;
    if (driveEnabled && totalPhotos >= 5) {
      try {
        await supabase('/rest/v1/drive_sync_jobs?on_conflict=customer_id', {
          method: 'POST', headers: { Prefer: 'resolution=merge-duplicates' },
          body: JSON.stringify({ customer_id: customerId, status: 'queued', attempts: 0, next_attempt_at: new Date().toISOString(), locked_until: null, lease_id: null, last_error: null }),
        });
        await db(`customers?id=eq.${customerId}`, { photo_sync_status: 'queued' }, 'PATCH');
      } catch {
        await db(`customers?id=eq.${customerId}`, { photo_sync_status: 'storage_ready' }, 'PATCH').catch(() => undefined);
      }
    } else {
      await db(`customers?id=eq.${customerId}`, { photo_sync_status: 'storage_ready' }, 'PATCH').catch(() => undefined);
    }
    await db('photo_admin_audit', rows.map(() => ({ customer_id: customerId, actor_id: null, action: 'admin-photo-upload' }))).catch(() => undefined);
    return json({ added: rows.length, driveEnabled });
  } catch (error) {
    await Promise.all([
      removeStorageFiles(ORIGINALS, originalPaths).catch(() => undefined),
      removeStorageFiles(ASSETS, addedAssetPaths).catch(() => undefined),
    ]);
    throw error;
  }
}

async function initInvitationZipUpdate(body: Record<string, unknown>) {
  const customerId = uuid(body.customerId);
  const demoId = uuid(body.demoId);
  const size = Number(body.size);
  if (!Number.isInteger(size) || size < 1 || size > 32 * MiB) {
    throw new MediaError(413, 'File ZIP cần nhỏ hơn 32 MiB.');
  }
  const [customerRow] = await db<Array<{ id: string }>>(`customers?id=eq.${customerId}&select=id&limit=1`);
  const [demo] = await db<Array<{ id: string }>>(`invitation_demos?id=eq.${demoId}&customer_id=eq.${customerId}&select=id&limit=1`);
  if (!customerRow || !demo) throw new MediaError(404, 'Không tìm thấy khách hàng hoặc demo.');
  const path = `exports/${customerId}/${demoId}/imports/${randomUUID()}.zip`;
  const response = await supabase(`/storage/v1/object/upload/sign/${EXPORTS}/${path}`, {
    method: 'POST', body: '{}',
  });
  const signed = await response.json() as { token?: string; url?: string };
  const signedUploadToken = signed.token ?? (signed.url ? new URL(signed.url, supabaseUrl()).searchParams.get('token') : null);
  if (!signedUploadToken) throw new MediaError(502, 'Kho lưu trữ chưa cấp quyền tải ZIP.');
  return json({ path, signedUploadToken });
}

async function cancelInvitationZipUpdate(body: Record<string, unknown>) {
  const customerId = uuid(body.customerId);
  const demoId = uuid(body.demoId);
  const path = clean(body.path, 240);
  const prefix = `exports/${customerId}/${demoId}/imports/`;
  if (!path.startsWith(prefix) || !new RegExp(`^exports/${customerId}/${demoId}/imports/[a-f0-9-]{36}\\.zip$`, 'i').test(path)) {
    throw new MediaError(400, 'Đường dẫn ZIP không khớp khách hàng và demo đã chọn.');
  }
  await supabase(`/storage/v1/object/${EXPORTS}`, { method: 'DELETE', body: JSON.stringify({ prefixes: [path] }) });
  return json({ ok: true });
}

async function applyInvitationZipUpdate(body: Record<string, unknown>) {
  const customerId = uuid(body.customerId);
  const demoId = uuid(body.demoId);
  const path = clean(body.path, 240);
  const expectedPrefix = `exports/${customerId}/${demoId}/imports/`;
  if (!path.startsWith(expectedPrefix) || !new RegExp(`^exports/${customerId}/${demoId}/imports/[a-f0-9-]{36}\\.zip$`, 'i').test(path)) {
    throw new MediaError(400, 'Đường dẫn ZIP không khớp khách hàng và demo đã chọn.');
  }
  try {
    return await applyInvitationZipUpdateArchive(customerId, demoId, path);
  } finally {
    await supabase(`/storage/v1/object/${EXPORTS}`, { method: 'DELETE', body: JSON.stringify({ prefixes: [path] }) }).catch(() => undefined);
  }
}

async function applyInvitationZipUpdateArchive(customerId: string, demoId: string, path: string) {
  const [customerRow] = await db<Array<{ id: string; bride_name: string; groom_name: string }>>(
    `customers?id=eq.${customerId}&select=id,bride_name,groom_name&limit=1`,
  );
  const [demo] = await db<Array<{ id: string; customer_id: string; payload: Record<string, unknown> }>>(
    `invitation_demos?id=eq.${demoId}&customer_id=eq.${customerId}&select=id,customer_id,payload&limit=1`,
  );
  if (!customerRow || !demo) throw new MediaError(404, 'Không tìm thấy khách hàng hoặc demo.');

  const archiveResponse = await supabase(`/storage/v1/object/authenticated/${EXPORTS}/${path}`);
  const archive = new Uint8Array(await archiveResponse.arrayBuffer());
  if (!archive.length || archive.length > 32 * MiB) throw new MediaError(413, 'File ZIP cần nhỏ hơn 32 MiB.');

  let expandedBytes = 0;
  let fileCount = 0;
  let extracted: Record<string, Uint8Array>;
  try {
    extracted = unzipSync(archive, {
      filter: (file) => {
        const filePath = file.name;
        if (filePath.endsWith('/')) return false;
        fileCount += 1;
        expandedBytes += file.originalSize;
        const extension = filePath.split('.').pop()?.toLowerCase() ?? '';
        if (fileCount > 100 || !Number.isSafeInteger(file.originalSize) || file.originalSize < 0
          || file.originalSize > 4 * MiB || expandedBytes > 48 * MiB || !safeTemplatePath(filePath)
          || !templateExtensions.has(extension)) {
          throw new MediaError(422, 'ZIP có đường dẫn, định dạng hoặc dung lượng file không được hỗ trợ.');
        }
        return true;
      },
    });
  } catch (error) {
    if (error instanceof MediaError) throw error;
    throw new MediaError(422, 'Không đọc được ZIP. Hãy dùng file ZIP vừa tải từ hồ sơ demo này.');
  }

  let metadata: { version?: unknown; customerId?: unknown; demoId?: unknown; entryFile?: unknown };
  try { metadata = JSON.parse(new TextDecoder().decode(extracted['mp-invitation-export.json'])) as typeof metadata; }
  catch { throw new MediaError(422, 'ZIP không có metadata hợp lệ. Hãy xuất lại code từ demo đang chọn.'); }
  const entryFile = typeof metadata.entryFile === 'string' ? metadata.entryFile : '';
  if (metadata.version !== 1 || metadata.customerId !== customerId || metadata.demoId !== demoId
    || !safeTemplatePath(entryFile) || !entryFile.toLowerCase().endsWith('.html') || !extracted[entryFile]
    || !extracted['invitation.config.json'] || !Object.keys(extracted).some((filePath) => filePath.toLowerCase().endsWith('.css'))) {
    throw new MediaError(422, 'ZIP không thuộc demo này hoặc thiếu HTML, CSS hay cấu hình. Hãy xuất lại code từ demo đang chọn.');
  }
  const html = new TextDecoder().decode(extracted[entryFile]);
  if (/<\s*(iframe|object|embed)\b/i.test(html) || /<\s*base\b/i.test(html)) {
    throw new MediaError(422, 'HTML không được chứa iframe, object, embed hoặc base tag.');
  }

  const revisionId = randomUUID();
  const paths = Object.keys(extracted).filter((filePath) =>
    filePath !== 'mp-invitation-export.json' && filePath !== 'invitation.config.json');
  const name = `Bản chỉnh sửa ${String(customerRow.bride_name || '')} & ${String(customerRow.groom_name || '')}`.slice(0, 80);
  try {
    for (const filePath of paths) {
      const extension = filePath.split('.').pop()?.toLowerCase() ?? '';
      await supabase(`/storage/v1/object/${CUSTOM_TEMPLATES}/${revisionId}/${filePath}`, {
        method: 'POST', headers: { 'Content-Type': templateMimeTypes[extension], 'x-upsert': 'true' },
        body: extracted[filePath].buffer.slice(
          extracted[filePath].byteOffset,
          extracted[filePath].byteOffset + extracted[filePath].byteLength,
        ) as ArrayBuffer,
      });
    }
    await db('custom_invitation_templates', {
      id: revisionId, name, entry_file: entryFile,
      manifest: { version: 1, name, entry: entryFile }, file_paths: paths,
      owner_customer_id: customerId, owner_demo_id: demoId,
    });
    await db(`invitation_demos?id=eq.${demoId}&customer_id=eq.${customerId}`, {
      payload: { ...demo.payload, customTemplateId: revisionId },
    }, 'PATCH');
  } catch (error) {
    await supabase(`/rest/v1/custom_invitation_templates?id=eq.${revisionId}`, { method: 'DELETE' }).catch(() => undefined);
    await removeStorageFiles(CUSTOM_TEMPLATES, await storageFiles(CUSTOM_TEMPLATES, `${revisionId}/`).catch(() => []));
    throw error;
  }

  const previousRevisionId = typeof demo.payload.customTemplateId === 'string' ? demo.payload.customTemplateId : '';
  if (previousRevisionId && previousRevisionId !== revisionId) {
    const [previous] = await db<Array<{ id: string }>>(
      `custom_invitation_templates?id=eq.${encodeURIComponent(previousRevisionId)}&owner_customer_id=eq.${customerId}&owner_demo_id=eq.${demoId}&select=id&limit=1`,
    );
    if (previous) {
      await removeStorageFiles(CUSTOM_TEMPLATES, await storageFiles(CUSTOM_TEMPLATES, `${previous.id}/`).catch(() => []));
      await supabase(`/rest/v1/custom_invitation_templates?id=eq.${previous.id}`, { method: 'DELETE' });
    }
  }
  return json({ ok: true, name, revisionId });
}

async function storageFiles(bucket: string, prefix: string) {
  const entries: Array<{ name?: string; id?: string | null }> = [];
  for (let offset = 0; ; offset += 1000) {
    const response = await supabase(`/storage/v1/object/list/${bucket}`, {
      method: 'POST', body: JSON.stringify({ prefix, limit: 1000, offset, sortBy: { column: 'name', order: 'asc' } }),
    });
    const page = await response.json() as Array<{ name?: string; id?: string | null }>;
    entries.push(...page);
    if (page.length < 1000) break;
  }
  const files: string[] = [];
  for (const entry of entries) {
    if (typeof entry.name !== 'string') continue;
    const path = prefix + entry.name;
    if (entry.id === null) files.push(...await storageFiles(bucket, `${path}/`));
    else files.push(path);
  }
  return files;
}

async function removeStorageFiles(bucket: string, paths: string[]) {
  for (let index = 0; index < paths.length; index += 100) {
    await supabase(`/storage/v1/object/${bucket}`, {
      method: 'DELETE', body: JSON.stringify({ prefixes: paths.slice(index, index + 100) }),
    });
  }
}

async function deleteCustomer(customerIdValue: unknown) {
  const customerId = uuid(customerIdValue);
  const [customerRow] = await db<Array<{ id: string; drive_folder_id: string | null }>>(
    `customers?id=eq.${customerId}&select=id,drive_folder_id&limit=1`,
  );
  if (!customerRow) throw new MediaError(404, 'Không tìm thấy khách hàng cần xóa.');

  const [photos, ownedRevisions] = await Promise.all([
    photosFor(customerId),
    db<Array<{ id: string }>>(`custom_invitation_templates?owner_customer_id=eq.${customerId}&select=id`),
  ]);
  const [originalFiles, assetFiles, exportFiles, revisionFiles] = await Promise.all([
    storageFiles(ORIGINALS, `requests/${customerId}/`),
    storageFiles(ASSETS, `requests/${customerId}/`),
    storageFiles(EXPORTS, `exports/${customerId}/`),
    Promise.all(ownedRevisions.map((revision) => storageFiles(CUSTOM_TEMPLATES, `${revision.id}/`))),
  ]);

  await Promise.all([
    removeStorageFiles(ORIGINALS, originalFiles),
    removeStorageFiles(ASSETS, assetFiles),
    removeStorageFiles(EXPORTS, exportFiles),
    removeStorageFiles(CUSTOM_TEMPLATES, revisionFiles.flat()),
  ]);
  await deleteDriveCustomer(customerId, customerRow.drive_folder_id, photos);
  await supabase(`/rest/v1/photo_admin_audit?customer_id=eq.${customerId}`, { method: 'DELETE' });
  await supabase(`/rest/v1/customers?id=eq.${customerId}`, { method: 'DELETE' });
  return json({ ok: true });
}

async function deleteCustomerDemo(body: Record<string, unknown>) {
  const customerId = uuid(body.customerId);
  const demoId = uuid(body.demoId);
  const [demo] = await db<Array<{ id: string }>>(
    `invitation_demos?id=eq.${demoId}&customer_id=eq.${customerId}&select=id&limit=1`,
  );
  if (!demo) throw new MediaError(404, 'Không tìm thấy demo cần xóa.');
  const revisions = await db<Array<{ id: string }>>(
    `custom_invitation_templates?owner_customer_id=eq.${customerId}&owner_demo_id=eq.${demoId}&select=id`,
  );
  const [exportFiles, revisionFiles] = await Promise.all([
    storageFiles(EXPORTS, `exports/${customerId}/${demoId}/`),
    Promise.all(revisions.map((revision) => storageFiles(CUSTOM_TEMPLATES, `${revision.id}/`))),
  ]);
  await Promise.all([
    removeStorageFiles(EXPORTS, exportFiles),
    removeStorageFiles(CUSTOM_TEMPLATES, revisionFiles.flat()),
  ]);
  await supabase(`/rest/v1/invitation_demos?id=eq.${demoId}&customer_id=eq.${customerId}`, { method: 'DELETE' });
  return json({ ok: true });
}

async function submitInvitationRsvp(body: Record<string, unknown>) {
  const slug = invitationSlug(body.slug);
  const [published] = await db<Array<{ demo_id: string }>>(
    `published_invitations?slug=eq.${encodeURIComponent(slug)}&select=demo_id&limit=1`,
  );
  if (!published) throw new MediaError(404, 'Thiệp không tồn tại hoặc chưa được xuất bản.');
  const name = clean(body.name, 120);
  if (!name) throw new MediaError(400, 'Vui lòng nhập họ tên.');
  const attending = body.attending === 'no' ? 'no' : body.attending === 'yes' ? 'yes' : '';
  if (!attending) throw new MediaError(400, 'Trạng thái tham dự không hợp lệ.');
  const guestCount = attending === 'yes' ? Number(body.guestCount) : 0;
  if (!Number.isInteger(guestCount) || guestCount < 0 || guestCount > 20 || (attending === 'yes' && guestCount < 1)) {
    throw new MediaError(400, 'Số khách không hợp lệ.');
  }
  const rawAnswers = body.answers && typeof body.answers === 'object' && !Array.isArray(body.answers)
    ? body.answers as Record<string, unknown> : {};
  const answers = Object.fromEntries(['transport', 'meal'].flatMap((key) => {
    const value = clean(rawAnswers[key], 40);
    return value ? [[key, value]] : [];
  }));
  await db('invitation_rsvps', {
    demo_id: published.demo_id,
    guest_name: name,
    attending,
    guest_count: guestCount,
    email: clean(body.email, 254) || null,
    message: clean(body.message, 1000) || null,
    answers,
  });
  return json({ ok: true });
}

async function adminInvitationRsvps(body: Record<string, unknown>) {
  const demoId = uuid(body.demoId);
  const [demo] = await db<Array<{ id: string }>>(`invitation_demos?id=eq.${demoId}&select=id&limit=1`);
  if (!demo) throw new MediaError(404, 'Không tìm thấy thiệp.');
  const responses = await db<Array<Record<string, unknown>>>(
    `invitation_rsvps?demo_id=eq.${demoId}&select=id,guest_name,attending,guest_count,email,message,answers,created_at&order=created_at.desc`,
  );
  return json(responses.map((row) => ({
    id: row.id, name: row.guest_name, attending: row.attending, guestCount: row.guest_count,
    email: row.email, message: row.message, answers: row.answers, submittedAt: row.created_at,
  })));
}

async function deleteInvitationRsvp(body: Record<string, unknown>) {
  const demoId = uuid(body.demoId);
  const rsvpId = uuid(body.rsvpId);
  const [response] = await db<Array<{ id: string }>>(
    `invitation_rsvps?id=eq.${rsvpId}&demo_id=eq.${demoId}&select=id&limit=1`,
  );
  if (!response) throw new MediaError(404, 'Không tìm thấy lời hồi đáp.');
  await supabase(`/rest/v1/invitation_rsvps?id=eq.${rsvpId}&demo_id=eq.${demoId}`, { method: 'DELETE' });
  return json({ ok: true });
}

async function createInvitationRsvpShare(body: Record<string, unknown>) {
  const demoId = uuid(body.demoId);
  const [demo] = await db<Array<{ id: string }>>(`invitation_demos?id=eq.${demoId}&select=id&limit=1`);
  if (!demo) throw new MediaError(404, 'Không tìm thấy thiệp.');
  const token = randomUUID();
  const response = await supabase('/rest/v1/invitation_rsvp_shares?on_conflict=demo_id', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ demo_id: demoId, token }),
  });
  return json({ token });
}

async function publicInvitationRsvps(tokenValue: unknown) {
  if (typeof tokenValue !== 'string' || !/^[a-f0-9-]{36}$/i.test(tokenValue)) {
    throw new MediaError(404, 'Link xem RSVP không hợp lệ.');
  }
  const token = tokenValue.toLowerCase();
  const [share] = await db<Array<{ demo_id: string }>>(
    `invitation_rsvp_shares?token=eq.${encodeURIComponent(token)}&select=demo_id&limit=1`,
  );
  if (!share) throw new MediaError(404, 'Link xem RSVP không tồn tại hoặc đã được thay mới.');
  const [[demo], responses] = await Promise.all([
    db<Array<{ payload: Record<string, unknown> }>>(`invitation_demos?id=eq.${share.demo_id}&select=payload&limit=1`),
    db<Array<Record<string, unknown>>>(
      `invitation_rsvps?demo_id=eq.${share.demo_id}&select=id,guest_name,attending,guest_count,answers,created_at&order=created_at.desc`,
    ),
  ]);
  return json({
    couple: `${String(demo?.payload?.brideName ?? 'Cô dâu')} & ${String(demo?.payload?.groomName ?? 'Chú rể')}`,
    responses: responses.map((row) => ({
      id: row.id, name: row.guest_name, attending: row.attending, guestCount: row.guest_count,
      answers: row.answers, submittedAt: row.created_at,
    })),
  });
}

async function submitInvitationWish(body: Record<string, unknown>) {
  const slug = invitationSlug(body.slug);
  const [published] = await db<Array<{ demo_id: string }>>(
    `published_invitations?slug=eq.${encodeURIComponent(slug)}&select=demo_id&limit=1`,
  );
  if (!published) throw new MediaError(404, 'Thiệp không tồn tại hoặc chưa được xuất bản.');
  const name = clean(body.name, 80);
  const message = clean(body.message, 500);
  if (!name || !message) throw new MediaError(400, 'Vui lòng nhập tên và lời chúc.');
  await db('invitation_wishes', { demo_id: published.demo_id, guest_name: name, message });
  return json({ ok: true });
}

async function adminInvitationWishes(body: Record<string, unknown>) {
  const demoId = uuid(body.demoId);
  const [demo] = await db<Array<{ id: string }>>(`invitation_demos?id=eq.${demoId}&select=id&limit=1`);
  if (!demo) throw new MediaError(404, 'Không tìm thấy thiệp.');
  const wishes = await db<Array<Record<string, unknown>>>(
    `invitation_wishes?demo_id=eq.${demoId}&select=id,guest_name,message,created_at&order=created_at.desc`,
  );
  return json(wishes.map((row) => ({
    id: row.id, name: row.guest_name, message: row.message, submittedAt: row.created_at,
  })));
}

async function deleteInvitationWish(body: Record<string, unknown>) {
  const demoId = uuid(body.demoId);
  const wishId = uuid(body.wishId);
  const [wish] = await db<Array<{ id: string }>>(
    `invitation_wishes?id=eq.${wishId}&demo_id=eq.${demoId}&select=id&limit=1`,
  );
  if (!wish) throw new MediaError(404, 'Không tìm thấy lời chúc.');
  await supabase(`/rest/v1/invitation_wishes?id=eq.${wishId}&demo_id=eq.${demoId}`, { method: 'DELETE' });
  return json({ ok: true });
}

async function createInvitationWishesShare(body: Record<string, unknown>) {
  const demoId = uuid(body.demoId);
  const [demo] = await db<Array<{ id: string }>>(`invitation_demos?id=eq.${demoId}&select=id&limit=1`);
  if (!demo) throw new MediaError(404, 'Không tìm thấy thiệp.');
  const token = randomUUID();
  await supabase('/rest/v1/invitation_wish_shares?on_conflict=demo_id', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ demo_id: demoId, token }),
  });
  return json({ token });
}

async function publicInvitationWishes(tokenValue: unknown) {
  if (typeof tokenValue !== 'string' || !/^[a-f0-9-]{36}$/i.test(tokenValue)) {
    throw new MediaError(404, 'Link xem lời chúc không hợp lệ.');
  }
  const [share] = await db<Array<{ demo_id: string }>>(
    `invitation_wish_shares?token=eq.${encodeURIComponent(tokenValue.toLowerCase())}&select=demo_id&limit=1`,
  );
  if (!share) throw new MediaError(404, 'Link xem lời chúc không tồn tại hoặc đã được thay mới.');
  const [[demo], wishes] = await Promise.all([
    db<Array<{ payload: Record<string, unknown> }>>(`invitation_demos?id=eq.${share.demo_id}&select=payload&limit=1`),
    db<Array<Record<string, unknown>>>(
      `invitation_wishes?demo_id=eq.${share.demo_id}&select=id,guest_name,message,created_at&order=created_at.desc`,
    ),
  ]);
  return json({
    couple: `${String(demo?.payload?.brideName ?? 'Cô dâu')} & ${String(demo?.payload?.groomName ?? 'Chú rể')}`,
    wishes: wishes.map((row) => ({
      id: row.id, name: row.guest_name, message: row.message, submittedAt: row.created_at,
    })),
  });
}

function publicStudio(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const config = value as Record<string, unknown>;
  const musicUrl = config.packageTier === '109k' ? ''
    : config.musicTrack === 'custom' ? safeMusicUrl(config.customMusicUrl)
      : safeMusicUrl(weddingMusicTracks.find((track) => track.id === config.musicTrack)?.url);
  const videoLink = safeVideoUrl(config.videoLink);
  return {
    ...Object.fromEntries(publicStudioKeys.filter((key) => key in config).map((key) => [key, config[key]])),
    ...(musicUrl ? { musicUrl } : {}),
    ...(videoLink ? { videoLink } : {}),
    ...(Array.isArray(config.hiddenSections)
      ? { hiddenSections: config.hiddenSections.filter((section): section is string => typeof section === 'string' && invitationSections.has(section)) }
      : {}),
  };
}

function safeVideoUrl(value: unknown) {
  if (typeof value !== 'string' || value.length > 2048) return '';
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password) return '';
    return url.href;
  } catch {
    return '';
  }
}

function safeMusicUrl(value: unknown) {
  if (typeof value !== 'string' || value.length > 2048) return '';
  if (['/audio/Le_duong.mp3', '/audio/goi_con_tim_lam_qua.mp3'].includes(value)) return value;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password) return '';
    if (isSupportedWeddingMusicUrl(url.href)) return url.href;
    return '';
  } catch {
    return '';
  }
}

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

async function loadSharp() {
  try {
    return (await import('sharp')).default;
  } catch {
    throw new MediaError(503, 'Dịch vụ xử lý ảnh không khả dụng. Vui lòng thử lại sau.');
  }
}

async function validateAndComplete(id: string, token: string, lease: string, customerId: string, photos: Awaited<ReturnType<typeof photosFor>>) {
  const sharp = await loadSharp();
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
  const studio = publicStudio(payload.studio);
  return json({ ...details, customTemplate: await customTemplateForPayload(payload), payload: { ...invitation, photos, studio, customTemplateId: payload.customTemplateId } });
}

function invitationSlug(value: unknown) {
  const slug = clean(value, 80).toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new MediaError(400, 'Đường dẫn thiệp không hợp lệ.');
  return slug;
}

function slugifyInvitation(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 64) || 'thiep-cuoi';
}

async function publishInvitation(body: Record<string, unknown>) {
  const customerId = uuid(body.customerId);
  const demoId = uuid(body.demoId);
  const [customerRow] = await db<Array<{ id: string; status: string; bride_name: string; groom_name: string }>>(
    `customers?id=eq.${customerId}&select=id,status,bride_name,groom_name&limit=1`,
  );
  const [demo] = await db<Array<{ id: string; customer_id: string }>>(
    `invitation_demos?id=eq.${demoId}&customer_id=eq.${customerId}&select=id,customer_id&limit=1`,
  );
  if (!customerRow || !demo) throw new MediaError(404, 'Không tìm thấy hồ sơ hoặc demo đã chọn.');
  if (!['confirmed', 'completed'].includes(customerRow.status)) {
    throw new MediaError(409, 'Chỉ có thể tạo link chính thức sau khi khách xác nhận đặt mẫu.');
  }

  const existing = () => db<Array<{ slug: string }>>(
    `published_invitations?demo_id=eq.${demoId}&select=slug&limit=1`,
  );
  const [published] = await existing();
  if (published) return json({ slug: published.slug });

  const baseSlug = slugifyInvitation(`${customerRow.bride_name}-${customerRow.groom_name}`);
  const [collision] = await db<Array<{ demo_id: string }>>(
    `published_invitations?slug=eq.${encodeURIComponent(baseSlug)}&select=demo_id&limit=1`,
  );
  const slug = collision ? `${baseSlug}-${customerId.slice(0, 6)}` : baseSlug;
  try {
    await db('published_invitations', { slug, customer_id: customerId, demo_id: demoId });
  } catch {
    const [raced] = await existing();
    if (raced) return json({ slug: raced.slug });
    throw new MediaError(409, 'Tên link này vừa được sử dụng. Hãy thử tạo lại.');
  }
  return json({ slug });
}

async function publicInvitation(slugValue: unknown) {
  const slug = invitationSlug(slugValue);
  const [published] = await db<Array<{ customer_id: string; demo_id: string }>>(
    `published_invitations?slug=eq.${encodeURIComponent(slug)}&select=customer_id,demo_id&limit=1`,
  );
  if (!published) throw new MediaError(404, 'Thiệp này không tồn tại.');
  const [[demo], [customerRow]] = await Promise.all([
    db<Array<{ id: string; template_id: string; payload: Record<string, unknown> }>>(
      `invitation_demos?id=eq.${published.demo_id}&select=id,template_id,payload&limit=1`,
    ),
    db<Array<{ status: string }>>(`customers?id=eq.${published.customer_id}&select=status&limit=1`),
  ]);
  if (!demo || !customerRow || !['confirmed', 'completed'].includes(customerRow.status)) {
    throw new MediaError(404, 'Thiệp này không còn được xuất bản.');
  }
  const payload = demo.payload ?? {};
  const refs = (Array.isArray(payload.photos) ? payload.photos : []) as PhotoRef[];
  const selected = await selectedPhotos(published.customer_id, refs);
  const photos = selected.map(({ ref }) => ({
    ...ref,
    url: `/api/customer-media?action=invitation-photo&slug=${encodeURIComponent(slug)}&photoId=${encodeURIComponent(ref.photoId)}`,
  }));
  const publicFields = ['brideName', 'groomName', 'weddingDate', 'weddingTime', 'venue', 'address', 'message', 'coverUrl'];
  const invitation = Object.fromEntries(publicFields.map((key) => [key, String(payload[key] ?? (key === 'weddingTime' ? '18:00' : ''))]));
  const studio = publicStudio(payload.studio);
  return json({ templateId: demo.template_id, customTemplate: await customTemplateForPayload(payload), payload: { ...invitation, studio, photos, customTemplateId: payload.customTemplateId } });
}

async function publicInvitationPhoto(slugValue: unknown, photoIdValue: unknown) {
  const slug = invitationSlug(slugValue);
  const photoId = uuid(photoIdValue);
  const [published] = await db<Array<{ customer_id: string; demo_id: string }>>(
    `published_invitations?slug=eq.${encodeURIComponent(slug)}&select=customer_id,demo_id&limit=1`,
  );
  if (!published) throw new MediaError(404, 'Ảnh thiệp không tồn tại.');
  const [[demo], [customerRow]] = await Promise.all([
    db<Array<{ payload: Record<string, unknown> }>>(`invitation_demos?id=eq.${published.demo_id}&select=payload&limit=1`),
    db<Array<{ status: string }>>(`customers?id=eq.${published.customer_id}&select=status&limit=1`),
  ]);
  if (!customerRow || !['confirmed', 'completed'].includes(customerRow.status)) throw new MediaError(404, 'Thiệp này không còn được xuất bản.');
  const refs = (Array.isArray(demo?.payload?.photos) ? demo.payload.photos : []) as PhotoRef[];
  const selected = await selectedPhotos(published.customer_id, refs);
  const photo = selected.find(({ ref }) => ref.photoId === photoId);
  if (!photo) throw new MediaError(404, 'Ảnh thiệp không tồn tại.');
  const image = await supabase(`/storage/v1/object/authenticated/${ASSETS}/${photo.path}`);
  return new Response(image.body, { headers: { 'Content-Type': 'image/webp', 'Cache-Control': 'public, max-age=3600' } });
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
      if (request.method === 'GET' && action === 'invitation-photo') {
        const url = new URL(request.url);
        return await publicInvitationPhoto(url.searchParams.get('slug'), url.searchParams.get('photoId'));
      }
      if (request.method === 'GET' && action === 'invitation-rsvps-share') {
        const url = new URL(request.url);
        return await publicInvitationRsvps(url.searchParams.get('token'));
      }
      if (request.method === 'GET' && action === 'invitation-wishes-share') {
        const url = new URL(request.url);
        return await publicInvitationWishes(url.searchParams.get('token'));
      }
      if (request.method !== 'POST') throw new MediaError(405, 'Phương thức không hợp lệ.');
      if (['challenge', 'init', 'complete', 'status'].includes(action ?? '')) checkUploadRequest(request);
      if (action === 'contact') throw new MediaError(403, 'Vui lòng gửi yêu cầu kèm ảnh.');
      if (action === 'upload-template') {
        await requireAdmin(request);
        return await uploadCustomTemplate(request);
      }
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
      if (action === 'invitation') return await publicInvitation(body.slug);
      if (action === 'submit-invitation-rsvp') return await submitInvitationRsvp(body);
      if (action === 'submit-invitation-wish') return await submitInvitationWish(body);
      await requireAdmin(request);
      if (action === 'invitation-rsvps-admin') return await adminInvitationRsvps(body);
      if (action === 'delete-invitation-rsvp') return await deleteInvitationRsvp(body);
      if (action === 'create-invitation-rsvp-share') return await createInvitationRsvpShare(body);
      if (action === 'invitation-wishes-admin') return await adminInvitationWishes(body);
      if (action === 'delete-invitation-wish') return await deleteInvitationWish(body);
      if (action === 'create-invitation-wishes-share') return await createInvitationWishesShare(body);
      if (action === 'admin-photo-init') return await initAdminPhotoUpload(body);
      if (action === 'admin-photo-complete') return await completeAdminPhotoUpload(body);
      if (action === 'init-invitation-zip-update') return await initInvitationZipUpdate(body);
      if (action === 'cancel-invitation-zip-update') return await cancelInvitationZipUpdate(body);
      if (action === 'apply-invitation-zip-update') return await applyInvitationZipUpdate(body);
      if (action === 'delete-customer') return await deleteCustomer(body.customerId);
      if (action === 'delete-demo') return await deleteCustomerDemo(body);
      if (action === 'publish-invitation') return await publishInvitation(body);
      if (action === 'templates') return json(await listCustomTemplates(body.customerId));
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
