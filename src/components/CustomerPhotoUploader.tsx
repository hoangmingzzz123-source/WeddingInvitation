import { useEffect, useState } from 'react';
import { MiB, inspectPhoto, type SelectedPhoto } from '../lib/customerPhotoUpload';

function Thumbnail({ photo }: { photo: SelectedPhoto }) {
  const [url, setUrl] = useState('');
  useEffect(() => {
    const next = URL.createObjectURL(photo.file);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [photo.file]);
  return url ? <img src={url} alt={photo.file.name} /> : null;
}

export function CustomerPhotoUploader({ photos, setPhotos, cover, setCover, progress, frozen, disabled, onInspect }: {
  photos: SelectedPhoto[];
  setPhotos: (photos: SelectedPhoto[]) => void;
  cover: number;
  setCover: (index: number) => void;
  progress: Record<number, number>;
  frozen: boolean;
  disabled: boolean;
  onInspect: (inspecting: boolean) => void;
}) {
  const [issues, setIssues] = useState<string[]>([]);
  const [inspecting, setInspecting] = useState(false);
  async function add(files: FileList | null) {
    if (!files || frozen || disabled || inspecting) return;
    setInspecting(true);
    onInspect(true);
    const accepted = [...photos];
    const errors: string[] = [];
    try {
      for (const file of Array.from(files)) {
        try {
          if (accepted.length >= 7) throw new Error('Đã đạt giới hạn 7 ảnh.');
          if (accepted.reduce((total, photo) => total + photo.file.size, file.size) > 80 * MiB) throw new Error('Tổng dung lượng vượt 80 MiB.');
          const photo = await inspectPhoto(file);
          if (accepted.some((item) => item.checksum === photo.checksum)) throw new Error('Trùng nội dung với ảnh đã chọn.');
          accepted.push(photo);
        } catch (error) {
          errors.push(file.name + ' · ' + (error instanceof Error ? error.message : 'Không thể đọc ảnh.'));
        }
      }
      setPhotos(accepted);
      setIssues(errors);
    } finally { setInspecting(false); onInspect(false); }
  }
  const move = (index: number, delta: number) => {
    const next = [...photos];
    [next[index], next[index + delta]] = [next[index + delta], next[index]];
    setPhotos(next);
    if (cover === index) setCover(index + delta);
    else if (cover === index + delta) setCover(index);
  };
  return (
    <fieldset className="customer-media" disabled={disabled}>
      <legend>Ảnh cưới của hai bạn *</legend>
      <p>Tải 5–7 ảnh JPEG, PNG hoặc WebP. Tối đa 15 MiB mỗi ảnh và 80 MiB tổng cộng.</p>
      {!frozen && (
        <label className="customer-media__drop" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); void add(event.dataTransfer.files); }}>
          Chọn ảnh hoặc kéo thả vào đây
          <input type="file" multiple accept="image/jpeg,image/png,image/webp,.heic,.heif" disabled={inspecting || photos.length >= 7}
            onChange={(event) => { void add(event.currentTarget.files); event.currentTarget.value = ''; }} />
        </label>
      )}
      <p aria-live="polite">{inspecting ? 'Đang kiểm tra ảnh…' : `${photos.length}/7 ảnh · ${Object.values(progress).filter((value) => value === 100).length} đã tải`}
        {photos.length < 5 ? ` · Cần thêm ít nhất ${5 - photos.length} ảnh` : ''}</p>
      {issues.length > 0 && <ul role="alert">{issues.map((issue, index) => <li key={index}>{issue}</li>)}</ul>}
      <div className="customer-media__grid">
        {photos.map((photo, index) => (
          <div className="customer-media__card" key={photo.checksum}>
            <Thumbnail photo={photo} />
            <strong title={photo.file.name}>{photo.file.name}</strong>
            <small>{(photo.file.size / MiB).toFixed(1)} MiB {photo.small && '· Ảnh dưới 900px'}</small>
            <span>{progress[index] === 100 ? 'Đã tải' : progress[index] === -1 ? 'Cần thử lại' : progress[index] >= 0 ? `Đang tải ${progress[index]}%` : 'Chờ tải'}</span>
            <label><input type="radio" name="preferred-cover" checked={cover === index} disabled={frozen} onChange={() => setCover(index)} /> Ưu tiên làm bìa</label>
            {!frozen && <div className="customer-media__actions">
              <button type="button" disabled={index === 0} onClick={() => move(index, -1)} aria-label={`Đưa ảnh ${index + 1} lên`}>↑</button>
              <button type="button" disabled={index === photos.length - 1} onClick={() => move(index, 1)} aria-label={`Đưa ảnh ${index + 1} xuống`}>↓</button>
              <button type="button" onClick={() => {
                setPhotos(photos.filter((_, position) => position !== index));
                setCover(cover === index ? 0 : cover - Number(cover > index));
              }} aria-label={`Bỏ ảnh ${index + 1}`}>×</button>
            </div>}
          </div>
        ))}
      </div>
    </fieldset>
  );
}
