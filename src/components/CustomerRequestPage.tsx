import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, LoaderCircle, Send, ShieldCheck } from 'lucide-react';
import { navigateTo } from '../Router';
import { weddingTemplates } from '../data/templates';
import { isSupabaseConfigured, submitCustomerRequest } from '../lib/supabaseRest';

const initialForm = {
  fullName: '', email: '', phone: '', brideName: '', groomName: '', weddingDate: '', weddingTime: '18:00',
  venue: '', address: '', message: '', selectedTemplateId: '', coverUrl: '', company: '',
};

export function CustomerRequestPage() {
  const defaultTemplate = useMemo(() => new URLSearchParams(window.location.search).get('template') ?? '', []);
  const [form, setForm] = useState({ ...initialForm, selectedTemplateId: defaultTemplate });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { document.title = 'Gửi yêu cầu làm thiệp | Wedding Invitation MP'; }, []);

  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (form.company) return;
    if (!form.fullName.trim() || !form.phone.trim() || !form.brideName.trim() || !form.groomName.trim()) {
      setError('Vui lòng nhập người liên hệ, số điện thoại và tên cô dâu/chú rể.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await submitCustomerRequest(form);
      setSubmitted(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Chưa thể gửi yêu cầu. Vui lòng thử lại.');
    } finally {
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

        <fieldset>
          <legend>Thông tin liên hệ</legend>
          <div className="request-form__grid">
            <label>Họ tên người liên hệ <b>*</b><input value={form.fullName} onChange={(e) => update('fullName', e.target.value)} /></label>
            <label>Số điện thoại <b>*</b><input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} /></label>
            <label className="is-wide">Email<input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} /></label>
          </div>
        </fieldset>

        <fieldset>
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

        <button type="submit" disabled={submitting || !isSupabaseConfigured()}>
          {submitting ? <LoaderCircle className="is-spinning" aria-hidden="true" /> : <Send aria-hidden="true" />}
          {submitting ? 'Đang gửi...' : 'Gửi yêu cầu tạo demo'}
        </button>
        <small>Bằng việc gửi form, bạn đồng ý để Wedding Invitation MP liên hệ về yêu cầu này.</small>
      </form>
    </main>
  );
}

