import { SupabaseRequestError } from './supabaseRest';

const storageUrl = String(import.meta.env.VITE_SUPABASE_URL ?? '').replace(/\/$/, '');
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const photoMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
export const MiB = 1024 * 1024;

export async function mediaRequest<T>(action: string, body: object, accessToken?: string): Promise<T> {
  const response = await fetch('/api/customer-media?action=' + action, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(accessToken ? { Authorization: 'Bearer ' + accessToken } : {}) },
    body: JSON.stringify(body),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || !result) {
    const trace = response.headers.get('x-vercel-error') && response.headers.get('x-vercel-id');
    const fallback = 'Máy chủ tải ảnh tạm thời không phản hồi. Vui lòng thử lại.';
    throw new SupabaseRequestError(result?.message ?? (trace ? `${fallback} Mã lỗi ${trace}.` : fallback), response.status);
  }
  return result as T;
}

interface UploadSlot { photoId: string; order: number; path: string; signedUploadToken: string }
export interface UploadReceipt { requestCode: string; received: number }
export interface UploadResult extends Partial<UploadReceipt> { uploads?: UploadSlot[]; tusEndpoint?: string }
export interface SelectedPhoto { file: File; checksum: string; small: boolean }
export interface UploadIdentity { idempotencyKey: string; submissionToken: string }

export function newUploadIdentity(): UploadIdentity {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return { idempotencyKey: crypto.randomUUID(), submissionToken: Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('') };
}

export async function inspectPhoto(file: File): Promise<SelectedPhoto> {
  if (/\.hei[cf]$/i.test(file.name) || /^image\/hei[cf]/i.test(file.type)) throw new Error('Hãy chuyển ảnh HEIC/HEIF sang JPEG trước khi tải.');
  if (!photoMimeTypes.includes(file.type) || !file.size || file.size > 15 * MiB) {
    throw new Error('Chỉ nhận JPEG, PNG hoặc WebP từ 1 byte đến 15 MiB.');
  }
  const bitmap = await createImageBitmap(file).catch(() => { throw new Error('Ảnh không mở được.'); });
  const small = Math.max(bitmap.width, bitmap.height) < 900;
  bitmap.close();
  const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
  return { file, checksum: Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join(''), small };
}

const bucket = 'customer-photos-original';
export async function uploadPhoto(file: File, slot: UploadSlot, endpoint: string, onProgress: (value: number) => void) {
  if (file.size > 6 * MiB) {
    const { Upload } = await import('tus-js-client');
    return new Promise<void>((resolve, reject) => {
      const upload = new Upload(file, {
        endpoint, chunkSize: 6 * MiB, retryDelays: [0, 1000, 3000, 7000],
        uploadDataDuringCreation: true, removeFingerprintOnSuccess: true,
        fingerprint: async () => 'wedding-photo:' + slot.photoId,
        headers: { 'x-signature': slot.signedUploadToken, apikey: key },
        metadata: { bucketName: bucket, objectName: slot.path, contentType: file.type },
        onProgress: (sent, total) => onProgress(Math.min(99, Math.floor(sent / total * 100))),
        onSuccess: () => { onProgress(100); resolve(); },
        onError: (error) => {
          if ('originalResponse' in error && error.originalResponse?.getStatus() === 409) { onProgress(100); resolve(); }
          else reject(new Error('Không tải được ảnh. Vui lòng thử lại.'));
        },
      });
      upload.findPreviousUploads().then((uploads) => {
        if (uploads[0]) upload.resumeFromPreviousUpload(uploads[0]);
        upload.start();
      }).catch(reject);
    });
  }
  return new Promise<void>((resolve, reject) => {
    let attempts = 0;
    const send = () => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', `${storageUrl}/storage/v1/object/upload/sign/${bucket}/${slot.path}?token=${encodeURIComponent(slot.signedUploadToken)}`);
      xhr.setRequestHeader('apikey', key);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.timeout = 90_000;
      xhr.upload.onprogress = (event) => onProgress(Math.min(99, Math.floor(event.loaded / file.size * 100)));
      const fail = () => {
        if (attempts++ < 3) window.setTimeout(send, 1000 * 2 ** attempts + Math.random() * 500);
        else reject(new Error('Không tải được ảnh. Vui lòng thử lại.'));
      };
      xhr.onerror = fail;
      xhr.ontimeout = fail;
      xhr.onload = () => {
        let duplicate = xhr.status === 409;
        try { duplicate ||= JSON.parse(xhr.responseText)?.error === 'Duplicate'; } catch { /* response may be empty */ }
        if ((xhr.status >= 200 && xhr.status < 300) || duplicate) { onProgress(100); resolve(); }
        else if (xhr.status === 429 || xhr.status >= 500) fail();
        else reject(new Error('Kho ảnh từ chối tệp. Vui lòng thử lại.'));
      };
      xhr.send(file);
    };
    send();
  });
}

export interface SavedPhotoUpload {
  identity: UploadIdentity;
  form: Record<string, string>;
  photos: SelectedPhoto[];
  cover: number;
  completed: number[];
  expiresAt: number;
}

async function draftStore<T>(mode: IDBTransactionMode, operation: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('wedding-photo-upload', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('draft');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  try {
    return await new Promise<T>((resolve, reject) => {
      const transaction = db.transaction('draft', mode);
      const request = operation(transaction.objectStore('draft'));
      transaction.oncomplete = () => resolve(request.result);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally { db.close(); }
}

export const saveUploadDraft = (draft: SavedPhotoUpload) => draftStore('readwrite', (store) => store.put(draft, 'active'));
export const clearUploadDraft = () => draftStore('readwrite', (store) => store.delete('active'));
export const readUploadDraft = async (): Promise<SavedPhotoUpload | undefined> => {
  const draft = await draftStore('readonly', (store) => store.get('active'));
  if (draft && draft.expiresAt <= Date.now()) { await clearUploadDraft(); return undefined; }
  return draft;
};
