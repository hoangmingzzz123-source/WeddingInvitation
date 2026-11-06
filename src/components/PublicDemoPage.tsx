import { useEffect, useState } from 'react';
import { AlertCircle, Check, Clock3, LockKeyhole, Sparkles } from 'lucide-react';
import { navigateTo } from '../Router';
import { weddingTemplates } from '../data/templates';
import { getPublicDemo } from '../lib/supabaseRest';
import type { DemoPhoto, PublicInvitationDemo } from '../types/admin';
import { CustomTemplateRenderer } from './CustomTemplateRenderer';
import { SignatureDemo, type SignatureDemoCustomization } from './demos/SignatureDemos';

function dateLabel(value: string) {
  if (!value) return '';
  const [year, month, day] = value.split('-');
  return year && month && day ? `${day} · ${month} · ${year}` : value;
}

function photoPosition(photo?: DemoPhoto) {
  const percent = (value?: number) => `${Math.round(Math.max(0, Math.min(1, value ?? 0.5)) * 100)}%`;
  return `${percent(photo?.focalX)} ${percent(photo?.focalY)}`;
}

function resolveFamilyVariant(studio?: PublicInvitationDemo['payload']['studio']) {
  const side = new URLSearchParams(window.location.search).get('side')?.trim().toLowerCase();
  const brideSides = new Set(['bride', 'gai', 'nha-gai', 'nhà-gái', 'female']);
  const groomSides = new Set(['groom', 'trai', 'nha-trai', 'nhà-trai', 'male']);

  if (brideSides.has(side ?? '')) return {
    ceremonyTitle: studio?.brideCeremonyTitle || 'Lễ Vu Quy',
    receptionTitle: studio?.brideReceptionTitle || 'Đón khách nhà gái',
    heroKicker: studio?.brideHeroKicker || 'Lễ Vu Quy',
    address: studio?.brideAddress || '',
  };

  if (groomSides.has(side ?? '')) return {
    ceremonyTitle: studio?.groomCeremonyTitle || 'Lễ Thành Hôn',
    receptionTitle: studio?.groomReceptionTitle || 'Tiệc mừng thân mật',
    heroKicker: studio?.groomHeroKicker || 'Lễ Thành Hôn',
    address: studio?.groomAddress || '',
  };

  return null;
}

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

  const payload = demo?.payload;
  const photos = [...(payload?.photos ?? [])].sort((a, b) => a.order - b.order);
  const cover = photos.find((photo) => photo.role === 'cover');
  const mainPhoto = photos.find((photo) => photo.role === 'main');
  const videoPhoto = photos.find((photo) => photo.role === 'video');
  const galleryPhotos = photos.filter((photo) => photo.role === 'gallery');
  const repeatedGallery = galleryPhotos.length
    ? Array.from({ length: Math.max(4, galleryPhotos.length) }, (_, index) => galleryPhotos[index % galleryPhotos.length])
    : [];
  const studio = payload?.studio;
  const templateTier = weddingTemplates.find((template) => template.id === demo?.templateId)?.tier ?? '109k';
  const familyVariant = resolveFamilyVariant(studio);
  const customization: SignatureDemoCustomization = {
    tier: studio?.packageTier ?? templateTier,
    bride: payload?.brideName,
    groom: payload?.groomName,
    date: payload?.weddingDate,
    dateLabel: dateLabel(payload?.weddingDate ?? ''),
    time: payload?.weddingTime,
    ceremonyTime: studio?.ceremonyTime || payload?.weddingTime,
    receptionTime: studio?.receptionTime || payload?.weddingTime,
    hiddenSections: studio?.hiddenSections,
    venue: payload?.venue,
    address: familyVariant?.address || payload?.address,
    city: studio?.city ?? 'Việt Nam',
    headerMonogramText: studio?.headerMonogramText,
    story: payload?.message,
    ceremonyTitle: familyVariant?.ceremonyTitle ?? studio?.ceremonyTitle,
    receptionTitle: familyVariant?.receptionTitle ?? studio?.receptionTitle,
    heroKicker: familyVariant?.heroKicker ?? studio?.heroKicker,
    albumTitle: studio?.albumTitle,
    timeLabel: studio?.timeLabel,
    venueLabel: studio?.venueLabel,
    signatureText: studio?.signatureText,
    theme: studio?.theme,
    fontStyle: studio?.packageTier === '109k' ? 'editorial' : studio?.fontStyle,
    hero: cover?.url ?? payload?.coverUrl,
    heroPosition: cover ? photoPosition(cover) : undefined,
    mainPhoto: mainPhoto?.url,
    mainPhotoPosition: mainPhoto ? photoPosition(mainPhoto) : undefined,
    videoBackground: videoPhoto?.url,
    videoBackgroundPosition: videoPhoto ? photoPosition(videoPhoto) : undefined,
    gallery: repeatedGallery.map((photo) => photo.url ?? '').filter(Boolean),
    galleryPositions: repeatedGallery.map((photo) => photoPosition(photo)),
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
      {demo.customTemplate
        ? <CustomTemplateRenderer template={demo.customTemplate} payload={demo.payload} title={`Bản demo ${demo.customTemplate.name}`} />
        : <div className="demo-page-content demo-page-content--signature" data-template={demo.templateId}>
          <SignatureDemo
            id={demo.templateId}
            customization={customization}
            rsvpQuestions={studio?.rsvpQuestions ?? []}
            embedded
          />
        </div>}

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

