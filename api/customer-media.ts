import { createHash, createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { unzipSync } from 'fflate';
import { ASSETS, CUSTOM_TEMPLATES, EXPORTS, ORIGINALS, MediaError, db, photosFor, requireAdmin, selectedPhotos, signAsset, supabase, supabaseUrl, type PhotoRef } from '../server/customerMedia.js';
import { checkDrive, syncDrive, cleanupUploads, deleteDriveCustomer } from '../server/driveSync.js';

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
const publicStudioKeys = ['packageTier', 'city', 'ceremonyTitle', 'receptionTitle', 'heroKicker', 'albumTitle', 'timeLabel', 'venueLabel', 'signatureText', 'theme', 'fontStyle', 'rsvpQuestions'];
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

async function listCustomTemplates() {
  const rows = await db<Array<{ id: string; name: string; entry_file: string; manifest: Record<string, unknown>; created_at: string }>>(
    'custom_invitation_templates?select=id,name,entry_file,manifest,created_at&order=created_at.desc',
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
          || path === 'invitation.config.json' || path.startsWith('customer-assets/')
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

  const photos = await photosFor(customerId);
  const [originalFiles, assetFiles, exportFiles] = await Promise.all([
    Promise.all(photos.map((photo) => storageFiles(ORIGINALS, `requests/${customerId}/${photo.id}/`))),
    Promise.all(photos.map((photo) => storageFiles(ASSETS, `requests/${customerId}/${photo.id}/`))),
    storageFiles(EXPORTS, `exports/${customerId}/`),
  ]);

  await Promise.all([
    removeStorageFiles(ORIGINALS, originalFiles.flat()),
    removeStorageFiles(ASSETS, assetFiles.flat()),
    removeStorageFiles(EXPORTS, exportFiles),
  ]);
  await deleteDriveCustomer(customerId, customerRow.drive_folder_id, photos);
  await supabase(`/rest/v1/photo_admin_audit?customer_id=eq.${customerId}`, { method: 'DELETE' });
  await supabase(`/rest/v1/customers?id=eq.${customerId}`, { method: 'DELETE' });
  return json({ ok: true });
}

function publicStudio(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const config = value as Record<string, unknown>;
  return Object.fromEntries(publicStudioKeys.filter((key) => key in config).map((key) => [key, config[key]]));
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
      await requireAdmin(request);
      if (action === 'delete-customer') return await deleteCustomer(body.customerId);
      if (action === 'publish-invitation') return await publishInvitation(body);
      if (action === 'templates') return json(await listCustomTemplates());
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
