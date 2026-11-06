import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { weddingTemplates } from '../data/templates';
import { mediaRequest } from '../lib/customerPhotoUpload';
import type { CustomInvitationTemplate, DemoPhoto, InvitationPayload, InvitationStudioConfig } from '../types/admin';
import { SignatureDemo, type SignatureDemoCustomization } from './demos/SignatureDemos';
import { CustomTemplateRenderer } from './CustomTemplateRenderer';

interface PublishedPayload extends InvitationPayload {
  photos: Array<DemoPhoto & { url: string }>;
  studio?: InvitationStudioConfig;
}

interface PublishedInvitation {
  templateId: string;
  payload: PublishedPayload;
  customTemplate?: CustomInvitationTemplate | null;
}

function dateLabel(value: string) {
  if (!value) return '';
  const [year, month, day] = value.split('-');
  return year && month && day ? `${day} · ${month} · ${year}` : value;
}

function position(photo?: DemoPhoto) {
  const percent = (value?: number) => `${Math.round(Math.max(0, Math.min(1, value ?? 0.5)) * 100)}%`;
  return `${percent(photo?.focalX)} ${percent(photo?.focalY)}`;
}

function resolveFamilyVariant(studio?: InvitationStudioConfig) {
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

export function PublishedInvitationPage({ slug }: { slug: string }) {
  const [invitation, setInvitation] = useState<PublishedInvitation | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    mediaRequest<PublishedInvitation>('invitation', { slug })
      .then((result) => { if (active) setInvitation(result); })
      .catch((requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : 'Không thể mở thiệp.');
      });
    return () => { active = false; };
  }, [slug]);

  useEffect(() => {
    if (!invitation) return;
    document.title = `${invitation.payload.brideName} & ${invitation.payload.groomName} | Thiệp cưới`;
  }, [invitation]);

  if (error) return (
    <main className="public-demo-state">
      <AlertCircle aria-hidden="true" />
      <p>Không thể mở thiệp</p>
      <h1>{error}</h1>
    </main>
  );

  if (!invitation) return (
    <main className="public-demo-state is-loading" role="status" aria-live="polite">
      <span />
      <p>Đang mở thiệp cưới...</p>
    </main>
  );

  const { payload, templateId } = invitation;
  if (invitation.customTemplate) {
    return <CustomTemplateRenderer template={invitation.customTemplate} payload={payload} title={`Thiệp cưới ${payload.brideName} & ${payload.groomName}`} />;
  }
  const studio = payload.studio;
  const selectedPhotos = [...(payload.photos ?? [])].sort((a, b) => a.order - b.order);
  const cover = selectedPhotos.find((photo) => photo.role === 'cover');
  const mainPhoto = selectedPhotos.find((photo) => photo.role === 'main');
  const videoPhoto = selectedPhotos.find((photo) => photo.role === 'video');
  const galleryPhotos = selectedPhotos.filter((photo) => photo.role === 'gallery');
  const repeatedGallery = galleryPhotos.length
    ? Array.from({ length: Math.max(4, galleryPhotos.length) }, (_, index) => galleryPhotos[index % galleryPhotos.length])
    : [];
  const templateTier = weddingTemplates.find((item) => item.id === templateId)?.tier ?? '109k';
  const familyVariant = resolveFamilyVariant(studio);
  const customization: SignatureDemoCustomization = {
    tier: studio?.packageTier ?? templateTier,
    bride: payload.brideName,
    groom: payload.groomName,
    date: payload.weddingDate,
    dateLabel: dateLabel(payload.weddingDate),
    time: payload.weddingTime,
    venue: payload.venue,
    address: familyVariant?.address || payload.address,
    city: studio?.city ?? 'Việt Nam',
    headerMonogramText: studio?.headerMonogramText,
    story: payload.message,
    ceremonyTitle: familyVariant?.ceremonyTitle ?? studio?.ceremonyTitle,
    receptionTitle: familyVariant?.receptionTitle ?? studio?.receptionTitle,
    heroKicker: familyVariant?.heroKicker ?? studio?.heroKicker,
    albumTitle: studio?.albumTitle,
    timeLabel: studio?.timeLabel,
    venueLabel: studio?.venueLabel,
    signatureText: studio?.signatureText,
    theme: studio?.theme,
    fontStyle: studio?.packageTier === '109k' ? 'editorial' : studio?.fontStyle,
    hero: cover?.url ?? payload.coverUrl,
    heroPosition: cover ? position(cover) : undefined,
    mainPhoto: mainPhoto?.url,
    mainPhotoPosition: mainPhoto ? position(mainPhoto) : undefined,
    videoBackground: videoPhoto?.url,
    videoBackgroundPosition: videoPhoto ? position(videoPhoto) : undefined,
    gallery: repeatedGallery.map((photo) => photo.url),
    galleryPositions: repeatedGallery.map((photo) => position(photo)),
  };

  return <SignatureDemo id={templateId} customization={customization} rsvpQuestions={studio?.rsvpQuestions ?? []} />;
}