import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { weddingTemplates } from '../data/templates';
import { weddingMusicUrlForTrack } from '../data/weddingMusic';
import { mediaRequest } from '../lib/customerPhotoUpload';
import type { CustomInvitationTemplate, DemoPhoto, InvitationPayload, InvitationStudioConfig } from '../types/admin';
import { orderedInvitationNames, resolveInvitationSide } from '../utils/invitationSide';
import { SignatureDemo, type SignatureDemoCustomization, type SignatureRsvpPayload, type SignatureWishEntry, type SignatureWishPayload } from './demos/SignatureDemos';
import { CustomTemplateRenderer } from './CustomTemplateRenderer';

interface PublishedPayload extends InvitationPayload {
  photos: Array<DemoPhoto & { url: string }>;
  wishes: SignatureWishEntry[];
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
    const [first, second] = orderedInvitationNames(invitation.payload.brideName, invitation.payload.groomName);
    document.title = `${first} & ${second} | Thiệp cưới`;
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
    const [first, second] = orderedInvitationNames(payload.brideName, payload.groomName);
    return <CustomTemplateRenderer template={invitation.customTemplate} payload={payload} title={`Thiệp cưới ${first} & ${second}`} />;
  }
  const studio = payload.studio;
  const selectedPhotos = [...(payload.photos ?? [])].sort((a, b) => a.order - b.order);
  const cover = selectedPhotos.find((photo) => photo.role === 'cover');
  const mainPhoto = selectedPhotos.find((photo) => photo.role === 'main');
  const videoPhoto = selectedPhotos.find((photo) => photo.role === 'video');
  const galleryPhotos = selectedPhotos.filter((photo) => photo.role === 'gallery');
  const templateTier = weddingTemplates.find((item) => item.id === templateId)?.tier ?? '109k';
  const familyVariant = resolveInvitationSide(studio);
  const customization: SignatureDemoCustomization = {
    tier: studio?.packageTier ?? templateTier,
    bride: payload.brideName,
    groom: payload.groomName,
    date: familyVariant?.weddingDate || payload.weddingDate,
    dateLabel: dateLabel(familyVariant?.weddingDate || payload.weddingDate),
    ceremonyDateLabel: dateLabel(familyVariant?.ceremonyDate || familyVariant?.weddingDate || payload.weddingDate),
    receptionDateLabel: dateLabel(familyVariant?.receptionDate || familyVariant?.weddingDate || payload.weddingDate),
    time: payload.weddingTime,
    ceremonyTime: familyVariant?.ceremonyTime || studio?.ceremonyTime || payload.weddingTime,
    receptionTime: familyVariant?.receptionTime || studio?.receptionTime || payload.weddingTime,
    hiddenSections: studio?.hiddenSections,
    venue: familyVariant?.venue || payload.venue,
    address: familyVariant?.receptionAddress || payload.address,
    ceremonyAddress: familyVariant?.ceremonyAddress || payload.address,
    receptionAddress: familyVariant?.receptionAddress || payload.address,
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
    musicUrl: studio?.packageTier === '109k'
      ? undefined
      : studio?.musicUrl ?? weddingMusicUrlForTrack(studio?.musicTrack, studio?.customMusicUrl),
    videoLink: studio?.videoLink,
    qrSeparateSides: studio?.qrSeparateSides,
    qrAccounts: studio?.qrAccounts,
    hero: cover?.url ?? payload.coverUrl,
    heroPosition: cover ? position(cover) : undefined,
    mainPhoto: mainPhoto?.url,
    mainPhotoPosition: mainPhoto ? position(mainPhoto) : undefined,
    videoBackground: videoPhoto?.url,
    videoBackgroundPosition: videoPhoto ? position(videoPhoto) : undefined,
    gallery: galleryPhotos.map((photo) => photo.url),
    galleryPositions: galleryPhotos.map((photo) => position(photo)),
  };

  const submitRsvp = async (payload: SignatureRsvpPayload) => {
    await mediaRequest<{ ok: boolean }>('submit-invitation-rsvp', { slug, ...payload });
  };
  const submitWish = async (payload: SignatureWishPayload) => {
    await mediaRequest<{ ok: boolean }>('submit-invitation-wish', { slug, ...payload });
  };

  return <div className="demo-page-content demo-page-content--signature" data-template={templateId}>
    <SignatureDemo id={templateId} customization={customization} rsvpQuestions={studio?.rsvpQuestions ?? []}
      showPhotoDisclaimer={false} initialWishes={payload.wishes ?? []}
      onRsvpSubmit={submitRsvp} onWishSubmit={submitWish} />
  </div>;
}