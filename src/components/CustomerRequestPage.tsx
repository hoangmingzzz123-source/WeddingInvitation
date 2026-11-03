import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2, LoaderCircle, Send, ShieldCheck } from 'lucide-react';
import { navigateTo } from '../Router';
import { weddingTemplates } from '../data/templates';
import { isSupabaseConfigured, SupabaseRequestError } from '../lib/supabaseRest';
import { CustomerPhotoUploader } from './CustomerPhotoUploader';
import { clearUploadDraft, mediaRequest, newUploadIdentity, photoUploadEnabled, readUploadDraft, saveUploadDraft, uploadPhoto, type SavedPhotoUpload, type SelectedPhoto, type UploadIdentity, type UploadReceipt, type UploadResult } from '../lib/customerPhotoUpload';

const initialForm = {
  fullName: '', email: '', phone: '', brideName: '', groomName: '', weddingDate: '', weddingTime: '18:00',
  venue: '', address: '', message: '', selectedTemplateId: '', coverUrl: '', company: '',
};

async function getRequestChallenge(identity: UploadIdentity) {
  const { challenge, waitMs } = await mediaRequest<{ challenge: string; waitMs: number }>('challenge', identity);
  await new Promise((resolve) => window.setTimeout(resolve, waitMs));
  return challenge;
}

export function CustomerRequestPage() {
  const defaultTemplate = useMemo(() => new URLSearchParams(window.location.search).get('template') ?? '', []);
  const [form, setForm] = useState({ ...initialForm, selectedTemplateId: defaultTemplate });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [photos, setPhotos] = useState<SelectedPhoto[]>([]);
  const [cover, setCover] = useState(0);
  const [progress, setProgress] = useState<Record<number, number>>({});
  const [consent, setConsent] = useState(false);
  const [inspecting, setInspecting] = useState(false);
  const [restoring, setRestoring] = useState(photoUploadEnabled);
  const [draft, setDraft] = useState<SavedPhotoUpload>();
  const [receipt, setReceipt] = useState<UploadReceipt>();
  const [processing, setProcessing] = useState(false);
  const busy = useRef(false);
  const contactIdentity = useRef<UploadIdentity>();
  useEffect(() => {
    if (!photoUploadEnabled) return;
    let active = true;
    readUploadDraft().then((saved) => {
      if (!saved || !active) return;
      setDraft(saved);
      setPhotos(saved.photos);
      setCover(saved.cover);
      setForm({ ...initialForm, ...saved.form });
      setConsent(true);
      setProgress(Object.fromEntries(saved.completed.map((index) => [index, 100])));
    }).catch(() => {}).finally(() => { if (active) setRestoring(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => { document.title = 'Gửi yêu cầu làm thiệp | Wedding Invitation MP'; }, []);

  const update = (key: keyof typeof form, value: string) => {
    contactIdentity.current = undefined;
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (form.company || busy.current || restoring || inspecting) return;
    if (!form.fullName.trim() || !form.phone.trim() || !form.brideName.trim() || !form.groomName.trim()) {
      setError('Vui lòng nhập người liên hệ, số điện thoại và tên cô dâu/chú rể.');
      return;
    }
    if (photoUploadEnabled && (!consent || photos.length < 5 || photos.length > 7)) {
      setError('Vui lòng chọn 5–7 ảnh và xác nhận đồng ý sử dụng ảnh.');
      return;
    }
    busy.current = true;
    setSubmitting(true);
    setError('');
    let initializingPhotos = photoUploadEnabled;
    try {
      if (photoUploadEnabled) {
        let current = draft ?? {
          identity: newUploadIdentity(), form, photos, cover, completed: [], expiresAt: Date.now() + 24 * 3600_000,
        };
        setDraft(current);
        await saveUploadDraft(current).catch(() => {});
        const challenge = await getRequestChallenge(current.identity);
        const result = await mediaRequest<UploadResult>('init', {
          ...current.identity, customer: current.form, consent: true, challenge,
          photos: current.photos.map(({ file }, index) => ({
            filename: file.name, size: file.size, mime: file.type, preferredCover: current.cover === index,
          })),
        });
        initializingPhotos = false;
        let completed: UploadReceipt;
        if (result.requestCode) {
          completed = { requestCode: result.requestCode, received: result.received ?? photos.length };
        } else {
          if (!result.uploads || !result.tusEndpoint || result.uploads.length !== photos.length) throw new Error('Phiên tải ảnh chưa đầy đủ.');
          const slots = result.uploads.filter((slot) => !current.completed.includes(slot.order));
          let failed = false;
          for (let start = 0; start < slots.length; start += 2) {
            const uploaded = await Promise.all(slots.slice(start, start + 2).map(async (slot) => {
              try {
                await uploadPhoto(current.photos[slot.order].file, slot, result.tusEndpoint!, (value) => {
                  setProgress((previous) => ({ ...previous, [slot.order]: value }));
                });
                return slot.order;
              } catch {
                failed = true;
                setProgress((previous) => ({ ...previous, [slot.order]: -1 }));
                return null;
              }
            }));
            current = { ...current, completed: [...current.completed, ...uploaded.filter((index): index is number => index !== null)] };
            setDraft(current);
            await saveUploadDraft(current).catch(() => {});
          }
          if (failed) throw new Error('Một số ảnh chưa tải xong. Bấm gửi lại để tiếp tục các ảnh còn thiếu.');
          setProcessing(true);
          completed = await mediaRequest<UploadReceipt>('complete', current.identity);
        }
        setReceipt(completed);
        await clearUploadDraft().catch(() => {});
      } else {
        const identity = contactIdentity.current ??= newUploadIdentity();
        const challenge = await getRequestChallenge(identity);
        const completed = await mediaRequest<UploadReceipt>('contact', { ...identity, customer: form, challenge });
        setReceipt(completed);
      }
      setSubmitted(true);
    } catch (submitError) {
      if (submitError instanceof SupabaseRequestError &&
        ([410, 422].includes(submitError.status) || (initializingPhotos && [400, 409, 413].includes(submitError.status)))) {
        await clearUploadDraft().catch(() => {});
        setDraft(undefined);
        setProgress({});
      }
      setError(submitError instanceof Error ? submitError.message : 'Chưa thể gửi yêu cầu. Vui lòng thử lại.');
    } finally {
      busy.current = false;
      setProcessing(false);
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="request-success">
        <CheckCircle2 aria-hidden="true" />
        <p>Đã gửi yêu cầu</p>
        <h1>Cảm ơn bạn, đội ngũ sẽ liên hệ sớm</h1>
        <span>Thông tin đã được chuyển vào hệ thống quản trị để tạo bản demo phù hợp.</span>
        {receipt && <span>{receipt.received > 0 && `Đã nhận ${receipt.received} ảnh · `}Mã yêu cầu <strong>{receipt.requestCode}</strong>.</span>}
        <button type="button" onClick={() => navigateTo('/templates')}>Tiếp tục xem mẫu</button>
      </main>
    );
  }

  return (
    <main className="request-page">
      <header>
        <button type="button" onClick={() => navigateTo('/')}><ArrowLeft aria-hidden="true" /> Trang chủ</button>
        <a href="/" onClick={(event) => { event.preventDefault(); navigateTo('/'); }}>Wedding Invitation <b>MP</b></a>
        <span><ShieldCheck aria-hidden="true" /> Thông tin được bảo mật</span>
      </header>
      <section className="request-page__intro">
        <p>Yêu cầu thiết kế riêng</p>
        <h1>Cho chúng tôi biết về ngày vui của bạn</h1>
        <span>Sau khi nhận thông tin, đội ngũ sẽ chuẩn bị một link demo riêng để bạn xem và góp ý.</span>
      </section>

      <form className="request-form" onSubmit={submit}>
        {!isSupabaseConfigured() && (
          <div className="request-form__warning">Hệ thống nhận yêu cầu chưa được cấu hình Supabase.</div>
        )}
        {error && <div className="request-form__error" role="alert">{error}</div>}
        <input className="request-form__honeypot" tabIndex={-1} autoComplete="off" value={form.company} onChange={(e) => update('company', e.target.value)} aria-hidden="true" />

        <fieldset disabled={Boolean(draft) || submitting || restoring}>
          <legend>Thông tin liên hệ</legend>
          <div className="request-form__grid">
            <label>Họ tên người liên hệ <b>*</b><input value={form.fullName} onChange={(e) => update('fullName', e.target.value)} /></label>
            <label>Số điện thoại <b>*</b><input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} /></label>
            <label className="is-wide">Email<input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} /></label>
          </div>
        </fieldset>

        <fieldset disabled={Boolean(draft) || submitting || restoring}>
          <legend>Thông tin thiệp cưới</legend>
          <div className="request-form__grid">
            <label>Tên cô dâu <b>*</b><input value={form.brideName} onChange={(e) => update('brideName', e.target.value)} /></label>
            <label>Tên chú rể <b>*</b><input value={form.groomName} onChange={(e) => update('groomName', e.target.value)} /></label>
            <label>Ngày cưới<input type="date" value={form.weddingDate} onChange={(e) => update('weddingDate', e.target.value)} /></label>
            <label>Giờ đón khách<input type="time" value={form.weddingTime} onChange={(e) => update('weddingTime', e.target.value)} /></label>
            <label className="is-wide">Địa điểm<input value={form.venue} onChange={(e) => update('venue', e.target.value)} /></label>
            <label className="is-wide">Địa chỉ<input value={form.address} onChange={(e) => update('address', e.target.value)} /></label>
            <label className="is-wide">Mẫu yêu thích
              <select value={form.selectedTemplateId} onChange={(e) => update('selectedTemplateId', e.target.value)}>
                <option value="">Để đội ngũ tư vấn</option>
                {weddingTemplates.filter((item) => item.route).map((template) => (
                  <option key={template.id} value={template.id}>{template.name} · {template.tier}</option>
                ))}
              </select>
            </label>
            <label className="is-wide">Lời nhắn hoặc yêu cầu<textarea rows={5} value={form.message} onChange={(e) => update('message', e.target.value)} /></label>
          </div>
        </fieldset>

        {photoUploadEnabled && <>
          <CustomerPhotoUploader photos={photos} setPhotos={setPhotos} cover={cover} setCover={setCover}
            progress={progress} frozen={Boolean(draft)} disabled={submitting || restoring} onInspect={setInspecting} />
          <label className="customer-media__consent">
            <input type="checkbox" checked={consent} disabled={submitting || Boolean(draft)} onChange={(event) => setConsent(event.target.checked)} />
            <span>Tôi đồng ý sử dụng ảnh cho yêu cầu thiết kế và bản xem trước. <a href="#photo-privacy">Chính sách bảo mật ảnh</a></span>
          </label>
          <details id="photo-privacy" className="customer-media__privacy">
            <summary>Chính sách bảo mật ảnh</summary>
            <p>Ảnh, tên và số điện thoại được dùng để xử lý yêu cầu. Ảnh gốc được lưu riêng tư trên Supabase. Khi bật đồng bộ, bản sao được lưu trong Google Drive riêng của Wedding Invitation MP.
              Quản trị viên xem ảnh trong hồ sơ. Người có link demo chỉ xem được ảnh đã chọn trong thời hạn link.
              Phiên tải chưa hoàn tất hết hạn sau 24 giờ. Với hồ sơ đã gửi, ảnh được giữ để phục vụ thiết kế và bàn giao.
              Bạn có thể liên hệ đội ngũ qua thông tin liên hệ của website, kèm mã yêu cầu, để yêu cầu xóa ảnh hoặc thu hồi quyền sử dụng.</p>
          </details>
          {processing && <p role="status">Đã tải đủ ảnh. Đang xác thực và chuẩn bị bản xem trước…</p>}
        </>}
        <button type="submit" disabled={submitting || inspecting || restoring || !isSupabaseConfigured() || (photoUploadEnabled && (photos.length < 5 || !consent))}>
          {submitting ? <LoaderCircle className="is-spinning" aria-hidden="true" /> : <Send aria-hidden="true" />}
          {submitting ? 'Đang gửi...' : draft ? 'Tiếp tục gửi ảnh' : 'Gửi yêu cầu tạo demo'}
        </button>
        <small>Bằng việc gửi form, bạn đồng ý để Wedding Invitation MP liên hệ về yêu cầu này.</small>
      </form>
    </main>
  );
}

