import { useEffect, useState } from 'react';
import { mediaRequest, uploadAdditionalCustomerPhotos } from '../../lib/customerPhotoUpload';
import type { DemoPhoto } from '../../types/admin';

interface Library {
  photos: Array<{ id: string; name: string; preferredCover: boolean; url: string }>;
  requestCode?: string;
  folderId?: string;
  driveEnabled: boolean;
  status: string;
  error?: string;
}
const labels: Record<string, string> = {
  storage_ready: 'Đã lưu ảnh trên Supabase', queued: 'Chờ đồng bộ', syncing: 'Đang đồng bộ', retrying: 'Chờ thử lại', failed: 'Lỗi đồng bộ', ready: 'Đã lưu Drive',
};

function defaultSelection(photos: Library['photos']): DemoPhoto[] {
  const available = photos.slice(0, 7);
  const cover = available.find((photo) => photo.preferredCover) ?? available[0];
  if (!cover) return [];
  return [cover, ...available.filter((photo) => photo.id !== cover.id)].map((photo, order) => ({
    photoId: photo.id, url: photo.url, role: order === 0 ? 'cover' : 'gallery', order,
  }));
}

const rolePriority: Record<DemoPhoto['role'], number> = { cover: 0, main: 1, video: 2, gallery: 3 };

function orderedSelection(photos: DemoPhoto[]) {
  return [...photos]
    .sort((first, second) => rolePriority[first.role] - rolePriority[second.role]
      || first.order - second.order)
    .map((photo, order) => ({ ...photo, order }));
}

export function CustomerPhotoLibrary({ customerId, accessToken, selection, onSelect, onLoad, disabled }: {
  customerId: string;
  accessToken: string;
  selection: DemoPhoto[];
  onSelect: (photos: DemoPhoto[]) => void;
  onLoad: (customerId: string, photos: DemoPhoto[]) => void;
  disabled: boolean;
}) {
  const [library, setLibrary] = useState<Library>();
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0);
  const [busy, setBusy] = useState(false);
  const [health, setHealth] = useState('');
  const [viewing, setViewing] = useState<string>();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  useEffect(() => {
    let active = true;
    const refresh = () => mediaRequest<Library>('library', { customerId }, accessToken)
      .then((result) => {
        if (!active) return;
        setLibrary(result);
        setError('');
        onLoad(customerId, defaultSelection(result.photos));
      })
      .catch((error) => { if (active) setError(error.message); });
    void refresh();
    const timer = window.setInterval(refresh, 30_000);
    return () => { active = false; window.clearInterval(timer); };
  }, [customerId, accessToken, onLoad, version]);
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
  const addPhotos = async (files: FileList | null) => {
    if (!files?.length) return;
    const selectedFiles = Array.from(files);
    if ((library?.photos.length ?? 0) + selectedFiles.length > 30) {
      setError('Thư viện khách hàng tối đa 30 ảnh.');
      return;
    }
    setUploading(true);
    setError('');
    setUploadProgress(`Đang chuẩn bị ${selectedFiles.length} ảnh...`);
    try {
      const result = await uploadAdditionalCustomerPhotos(selectedFiles, customerId, accessToken, (completed, total) => {
        setUploadProgress(`Đang tải ảnh ${completed}/${total}...`);
      });
      setHealth(`Đã thêm ${result.added} ảnh vào thư viện khách hàng.`);
      setUploadProgress('');
      setVersion((value) => value + 1);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Không thể tải thêm ảnh.');
      setUploadProgress('');
    } finally { setUploading(false); }
  };
  const choose = (id: string, role: DemoPhoto['role'] | '') => {
    const photo = library?.photos.find((item) => item.id === id);
    if (!photo) return;
    const current = selection.find((item) => item.photoId === id);
    if (current?.role === 'cover' && role !== 'cover') {
      setError('Hãy chọn ảnh bìa mới trước khi đổi vị trí ảnh bìa hiện tại.');
      return;
    }
    if (!role) {
      onSelect(orderedSelection(selection.filter((item) => item.photoId !== id)));
      return;
    }
    if (!current && selection.length >= 7) {
      setError('Mỗi demo hiện hỗ trợ tối đa 7 ảnh: 1 ảnh bìa và 6 ảnh album.');
      return;
    }
    const specialRole = role === 'cover' || role === 'main' || role === 'video';
    const withoutCurrent = selection.filter((item) => item.photoId !== id);
    const nextSelection = specialRole
      ? withoutCurrent.map((item) => item.role === role ? { ...item, role: 'gallery' as const } : item)
      : withoutCurrent;
    onSelect(orderedSelection([...nextSelection, {
      ...current, photoId: id, role, order: current?.order ?? selection.length, url: photo.url,
    }]));
  };
  const setGalleryOrder = (id: string, position: number) => {
    const next = selection.filter((item) => item.role === 'gallery').sort((first, second) => first.order - second.order);
    const index = next.findIndex((item) => item.photoId === id);
    const destination = position - 1;
    if (index < 0 || destination < 0 || destination >= next.length || index === destination) return;
    const [photo] = next.splice(index, 1);
    next.splice(destination, 0, photo);
    const reorderedGallery = next.map((item, order) => ({ ...item, order }));
    onSelect(orderedSelection([...selection.filter((item) => item.role !== 'gallery'), ...reorderedGallery]));
  };
  const gallerySelection = selection.filter((item) => item.role === 'gallery').sort((first, second) => first.order - second.order);
  return (
    <fieldset className="customer-media" disabled={disabled || uploading}>
      <legend>Ảnh khách hàng ({library?.photos.length ?? 0}/30)</legend>
      <p aria-live="polite">{library?.requestCode} · {labels[library?.status ?? ''] ?? 'Đang tải'}</p>
      {(error || library?.error) && <p role="alert">{error || library?.error}</p>}
      {health && <p role="status">{health}</p>}
      {uploadProgress && <p role="status">{uploadProgress}</p>}
      <div className="customer-media__actions">
        {(library?.photos.length ?? 0) < 30 && <label className="customer-media__upload">Thêm ảnh
          <input type="file" multiple accept="image/jpeg,image/png,image/webp" disabled={uploading}
            onChange={(event) => { void addPhotos(event.currentTarget.files); event.currentTarget.value = ''; }} />
        </label>}
        {library?.folderId && /^[\w-]+$/.test(library.folderId) && (
          <a href={`https://drive.google.com/drive/folders/${library.folderId}`} target="_blank" rel="noopener noreferrer">Mở thư mục Google Drive</a>
        )}
        {library?.driveEnabled && <button type="button" disabled={busy} onClick={() => void run('drive-health')}>Kiểm tra kết nối Drive</button>}
        {library?.driveEnabled && ['failed','retrying'].includes(library?.status ?? '') && <button type="button" disabled={busy} onClick={() => void run('retry')}>Đồng bộ lại</button>}
        {!!library?.photos.length && <button type="button" onClick={() => onSelect(defaultSelection(library.photos))}>Dùng tối đa 7 ảnh cho demo</button>}
        {error && <button type="button" onClick={() => setVersion((value) => value + 1)}>Tải lại ảnh</button>}
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
            <label>Vị trí ảnh
              <select aria-label={`Vị trí ảnh ${photo.name}`} value={selected?.role ?? ''}
                disabled={!selected && selection.length >= 7}
                onChange={(event) => choose(photo.id, event.target.value as DemoPhoto['role'] | '')}>
                <option value="">Không sử dụng</option>
                <option value="cover">Ảnh bìa</option>
                <option value="main">Ảnh chính</option>
                <option value="video">Ảnh nền video</option>
                <option value="gallery">Album</option>
              </select>
            </label>
            {selected?.role === 'gallery' && <label>Thứ tự album
              <select aria-label={`Thứ tự album ảnh ${photo.name}`} value={gallerySelection.findIndex((item) => item.photoId === photo.id) + 1}
                onChange={(event) => setGalleryOrder(photo.id, Number(event.target.value))}>
                {gallerySelection.map((item, position) => <option key={item.photoId} value={position + 1}>{position + 1}</option>)}
              </select>
            </label>}
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
