import { useEffect, useState } from 'react';
import { AlertCircle, Check, Clock3, LockKeyhole, Sparkles } from 'lucide-react';
import { navigateTo } from '../Router';
import { getPublicDemo } from '../lib/supabaseRest';
import type { PublicInvitationDemo } from '../types/admin';
import { CustomerInvitationPreview } from './CustomerInvitationPreview';

export function PublicDemoPage({ token }: { token: string }) {
  const [demo, setDemo] = useState<PublicInvitationDemo | null>(null);
  const [error, setError] = useState('');
  const [noticeAccepted, setNoticeAccepted] = useState(
    () => window.sessionStorage.getItem(`mp-demo-notice:${token}`) === 'accepted',
  );

  useEffect(() => {
    let active = true;
    getPublicDemo(token)
      .then((result) => { if (active) setDemo(result); })
      .catch((requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : 'Không thể mở bản demo.');
      });
    return () => { active = false; };
  }, [token]);

  useEffect(() => {
    document.title = demo
      ? `${demo.payload.brideName} & ${demo.payload.groomName} | Bản demo thiệp cưới`
      : 'Đang mở bản demo | Wedding Invitation MP';
  }, [demo]);

  const acceptNotice = () => {
    window.sessionStorage.setItem(`mp-demo-notice:${token}`, 'accepted');
    setNoticeAccepted(true);
  };

  if (error) {
    return (
      <main className="public-demo-state">
        <AlertCircle aria-hidden="true" />
        <p>Không thể mở bản demo</p>
        <h1>{error}</h1>
        <button type="button" onClick={() => navigateTo('/')}>Về trang chủ</button>
      </main>
    );
  }

  if (!demo) {
    return (
      <main className="public-demo-state is-loading" role="status" aria-live="polite">
        <span />
        <p>Đang chuẩn bị bản demo dành riêng cho bạn...</p>
      </main>
    );
  }

  return (
    <main className={`public-customer-demo${noticeAccepted ? ' is-ready' : ' is-obscured'}`}>
      <div className="public-demo-watermark"><Sparkles aria-hidden="true" /> Bản demo · Không phải bản chính thức</div>
      <CustomerInvitationPreview payload={demo.payload} templateId={demo.templateId} />

      {!noticeAccepted && (
        <div className="demo-consent" role="presentation">
          <section role="dialog" aria-modal="true" aria-labelledby="demo-consent-title">
            <span className="demo-consent__icon"><LockKeyhole aria-hidden="true" /></span>
            <p>Bản xem trước dành riêng cho bạn</p>
            <h1 id="demo-consent-title">Đây là bản demo thiệp cưới</h1>
            <span>
              Nội dung, hình ảnh và hiệu ứng có thể tiếp tục được tinh chỉnh trước khi xuất bản chính thức.
              Link này không được lập chỉ mục và có thể hết hạn.
            </span>
            {demo.note && <blockquote>{demo.note}</blockquote>}
            {demo.expiresAt && (
              <small><Clock3 aria-hidden="true" /> Có hiệu lực đến {new Date(demo.expiresAt).toLocaleDateString('vi-VN')}</small>
            )}
            <button type="button" onClick={acceptNotice} autoFocus>
              <Check aria-hidden="true" /> Tôi đã hiểu, xem bản demo
            </button>
          </section>
        </div>
      )}
    </main>
  );
}

