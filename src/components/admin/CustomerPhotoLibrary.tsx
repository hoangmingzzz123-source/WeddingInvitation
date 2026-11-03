import { useEffect, useState } from 'react';
import { mediaRequest } from '../../lib/customerPhotoUpload';
import type { DemoPhoto } from '../../types/admin';

interface Library {
  photos: Array<{ id: string; name: string; preferredCover: boolean; url: string }>;
  requestCode?: string;
  folderId?: string;
  status: string;
  error?: string;
}
const labels: Record<string, string> = {
  queued: 'Chờ đồng bộ', syncing: 'Đang đồng bộ', retrying: 'Chờ thử lại', failed: 'Lỗi đồng bộ', ready: 'Đã lưu Drive',
};

export function CustomerPhotoLibrary({ customerId, accessToken, selection, onSelect, disabled }: {
  customerId: string;
  accessToken: string;
  selection: DemoPhoto[];
  onSelect: (photos: DemoPhoto[]) => void;
  disabled: boolean;
}) {
  const [library, setLibrary] = useState<Library>();
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0);
  const [busy, setBusy] = useState(false);
  const [health, setHealth] = useState('');
  const [viewing, setViewing] = useState<string>();
  useEffect(() => {
    let active = true;
    const refresh = () => mediaRequest<Library>('library', { customerId }, accessToken)
      .then((result) => { if (active) { setLibrary(result); setError(''); } })
      .catch((error) => { if (active) setError(error.message); });
    void refresh();
    const timer = window.setInterval(refresh, 30_000);
    return () => { active = false; window.clearInterval(timer); };
  }, [customerId, accessToken, version]);
  const run = async (action: string) => {
    setBusy(true);
    setError('');
    try {
      const result = await mediaRequest<{ message?: string }>(action, { customerId }, accessToken);
      if (result.message) setHealth(result.message);
      setVersion((value) => value + 1);
    } catch (error) { setError(error instanceof Error ? error.message : 'Không thể xử lý ảnh.'); }
    finally { setBusy(false); }
  };
  if (!library && !error) return <p role="status">Đang tải ảnh hồ sơ…</p>;
  if (library?.status === 'none' && !library.photos.length) return <p>Hồ sơ này chưa có ảnh tải lên. Bạn có thể dùng ảnh bìa URL.</p>;
  const choose = (id: string, role: DemoPhoto['role']) => {
    const photo = library?.photos.find((item) => item.id === id);
    if (!photo) return;
    const current = selection.find((item) => item.photoId === id);
    if (role === 'gallery' && current?.role === 'gallery') {
      onSelect(selection.filter((item) => item.photoId !== id).map((item, order) => ({ ...item, order })));
      return;
    }
    const rest = selection.filter((item) => item.photoId !== id).map((item) =>
      role === 'cover' && item.role === 'cover' ? { ...item, role: 'gallery' as const } : item);
    const next: DemoPhoto = { ...current, photoId: id, role, order: 0, url: photo.url };
    onSelect((role === 'cover' ? [next, ...rest] : [...rest, next]).map((item, order) => ({ ...item, order })));
  };
  const move = (id: string, delta: number) => {
    const next = [...selection];
    const index = next.findIndex((item) => item.photoId === id);
    const destination = index + delta;
    if (index < 0 || next[destination]?.role !== 'gallery') return;
    [next[index], next[destination]] = [next[destination], next[index]];
    onSelect(next.map((item, order) => ({ ...item, order })));
  };
  return (
    <fieldset className="customer-media" disabled={disabled}>
      <legend>Ảnh khách hàng ({library?.photos.length ?? 0}/7)</legend>
      <p aria-live="polite">{library?.requestCode} · {labels[library?.status ?? ''] ?? 'Đang tải'}</p>
      {(error || library?.error) && <p role="alert">{error || library?.error}</p>}
      {health && <p role="status">{health}</p>}
      <div className="customer-media__actions">
        {library?.folderId && /^[\w-]+$/.test(library.folderId) && (
          <a href={`https://drive.google.com/drive/folders/${library.folderId}`} target="_blank" rel="noopener noreferrer">Mở thư mục Google Drive</a>
        )}
        <button type="button" disabled={busy} onClick={() => void run('drive-health')}>Kiểm tra kết nối Drive</button>
        {['failed','retrying'].includes(library?.status ?? '') && <button type="button" disabled={busy} onClick={() => void run('retry')}>Đồng bộ lại</button>}
        {!!library?.photos.length && <button type="button" onClick={() => {
          const cover = library.photos.find((photo) => photo.preferredCover) ?? library.photos[0];
          onSelect([cover, ...library.photos.filter((photo) => photo.id !== cover.id)].map((photo, order) => ({
            photoId: photo.id, url: photo.url, role: order === 0 ? 'cover' : 'gallery', order,
          })));
        }}>Dùng ảnh khách cho demo</button>}
        {!!selection.length && <button type="button" onClick={() => onSelect([])}>Bỏ lựa chọn</button>}
      </div>
      <div className="customer-media__grid">
        {library?.photos.map((photo, index) => {
          const selected = selection.find((item) => item.photoId === photo.id);
          return <div className="customer-media__card" key={photo.id}>
            <button type="button" className="customer-media__image-button" onClick={() => setViewing(photo.url)} aria-label={`Xem ảnh ${index + 1}`}>
              <img src={photo.url} alt={`Ảnh khách ${index + 1}`} loading="lazy" />
            </button>
            <strong title={photo.name}>{photo.name}</strong>
            <div className="customer-media__actions">
              <button type="button" aria-pressed={selected?.role === 'cover'} onClick={() => choose(photo.id, 'cover')}>Ảnh bìa</button>
              <button type="button" aria-pressed={selected?.role === 'gallery'} disabled={selected?.role === 'cover'}
                onClick={() => choose(photo.id, 'gallery')}>Album</button>
            </div>
            {selected?.role === 'gallery' && <div className="customer-media__actions">
              <button type="button" onClick={() => move(photo.id, -1)} aria-label="Đưa ảnh lên">↑</button>
              <button type="button" onClick={() => move(photo.id, 1)} aria-label="Đưa ảnh xuống">↓</button>
            </div>}
            {selected && (['focalX','focalY'] as const).map((axis) => (
              <label key={axis}>{axis === 'focalX' ? 'Canh ngang' : 'Canh dọc'}
                <input type="range" min="0" max="1" step="0.05" value={selected[axis] ?? 0.5}
                  onChange={(event) => onSelect(selection.map((item) => item.photoId === photo.id ? { ...item, [axis]: Number(event.target.value) } : item))} />
              </label>
            ))}
          </div>;
        })}
      </div>
      {viewing && <PhotoLightbox url={viewing} alt="Ảnh khách hàng" onClose={() => setViewing(undefined)} />}
    </fieldset>
  );
}

export function PhotoLightbox({ url, alt, onClose }: { url: string; alt: string; onClose: () => void }) {
  return <dialog className="customer-media__lightbox" ref={(element) => {
    if (element && !element.open) element.showModal();
  }} onCancel={onClose}>
    <button type="button" onClick={onClose} autoFocus>Đóng ảnh</button>
    <img src={url} alt={alt} />
  </dialog>;
}
