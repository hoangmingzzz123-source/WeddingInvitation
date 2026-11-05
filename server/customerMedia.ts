export const ORIGINALS = 'customer-photos-original';
export const ASSETS = 'customer-demo-assets';
export const EXPORTS = 'customer-demo-exports';
export const CUSTOM_TEMPLATES = 'custom-invitation-templates';

export class MediaError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export const supabaseUrl = () => (process.env.SUPABASE_URL ?? '').replace(/\/$/, '');

export async function supabase(path: string, init: RequestInit = {}) {
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key || !supabaseUrl()) throw new MediaError(503, 'Kho ảnh chưa được cấu hình.');
  const response = await fetch(supabaseUrl() + path, {
    signal: AbortSignal.timeout(45_000),
    ...init,
    headers: {
      apikey: key,
      ...(key.startsWith('eyJ') ? { Authorization: 'Bearer ' + key } : {}),
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });
  if (!response.ok) {
    const status = response.status;
    if (status === 429) throw new MediaError(429, 'Có quá nhiều yêu cầu. Vui lòng thử lại sau.');
    if (status === 403) throw new MediaError(403, 'Không có quyền thực hiện thao tác này.');
    if (status === 404) throw new MediaError(404, 'Không tìm thấy dữ liệu trong kho ảnh.');
    if (status === 409 || status === 410) throw new MediaError(status, 'Phiên tải ảnh đã thay đổi hoặc hết hạn.');
    throw new MediaError(502, 'Không thể xử lý dữ liệu trong kho ảnh.');
  }
  return response;
}

export async function db<T>(path: string, data?: unknown, method = 'POST'): Promise<T> {
  const result = await supabase('/rest/v1/' + path, data === undefined
    ? {} : { method, body: JSON.stringify(data) });
  const raw = await result.text();
  return raw ? JSON.parse(raw) : null;
}

export async function requireAdmin(request: Request) {
  const authorization = request.headers.get('authorization');
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!authorization?.startsWith('Bearer ') || !key) throw new MediaError(401, 'Vui lòng đăng nhập quản trị.');
  const result = await fetch(supabaseUrl() + '/rest/v1/rpc/is_admin', {
    method: 'POST', headers: { apikey: key, Authorization: authorization, 'Content-Type': 'application/json' },
    body: '{}',
  });
  if (!result.ok || await result.json() !== true) throw new MediaError(403, 'Tài khoản không có quyền quản trị.');
}

export interface PhotoRow {
  id: string;
  customer_id: string;
  original_name: string;
  original_mime: string;
  original_size: number;
  original_storage_path: string;
  web_storage_path: string | null;
  checksum_sha256: string | null;
  drive_file_id: string | null;
  drive_md5: string | null;
  sort_order: number;
  preferred_cover: boolean;
}

export interface PhotoRef {
  photoId: string;
  role: 'cover' | 'gallery';
  order: number;
  focalX?: number;
  focalY?: number;
  alt?: string;
}

export function photosFor(customerId: string) {
  return db<PhotoRow[]>(`customer_photos?customer_id=eq.${encodeURIComponent(customerId)}&order=sort_order`);
}

export async function selectedPhotos(customerId: string, refs: PhotoRef[]) {
  if (!Array.isArray(refs) || refs.length > 7 || refs.some((ref) => !ref || typeof ref.photoId !== 'string'
    || !['cover', 'gallery'].includes(ref.role) || !Number.isInteger(ref.order))
    || new Set(refs.map(({ photoId }) => photoId)).size !== refs.length
    || refs.filter(({ role }) => role === 'cover').length > 1) {
    throw new MediaError(422, 'Danh sách ảnh của demo không hợp lệ.');
  }
  if (!refs.length) return [];
  const rows = await photosFor(customerId);
  return refs.map((ref) => {
    const row = rows.find((photo) => photo.id === ref.photoId && photo.web_storage_path);
    if (!row) throw new MediaError(422, 'Ảnh đã chọn không thuộc hồ sơ hoặc chưa sẵn sàng.');
    const { photoId, role, order, focalX, focalY, alt } = ref;
    return { ref: { photoId, role, order, focalX, focalY, alt: typeof alt === 'string' ? alt.slice(0, 180) : undefined }, path: row.web_storage_path! };
  }).sort((a, b) => a.ref.order - b.ref.order);
}

export async function signAsset(bucket: string, path: string, expiresIn = 900, download?: string) {
  const response = await supabase(`/storage/v1/object/sign/${bucket}/${path}`, {
    method: 'POST', body: JSON.stringify({ expiresIn }),
  });
  const { signedURL } = await response.json() as { signedURL: string };
  if (!signedURL?.startsWith('/object/sign/')) throw new MediaError(502, 'Kho ảnh không trả về link hợp lệ.');
  const url = new URL('/storage/v1' + signedURL, supabaseUrl());
  if (download) url.searchParams.set('download', download);
  return url.href;
}
