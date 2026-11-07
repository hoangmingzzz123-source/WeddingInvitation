import type { WeddingMusicTrackId } from '../data/weddingMusic';

export type CustomerStatus = 'new' | 'contacted' | 'demo_ready' | 'confirmed' | 'completed';

export type DemoStatus = 'draft' | 'published' | 'expired';

export interface DemoPhoto {
  photoId: string;
  role: 'cover' | 'main' | 'video' | 'gallery';
  order: number;
  focalX?: number;
  focalY?: number;
  alt?: string;
  url?: string;
}

export type InvitationHiddenSection = 'story' | 'events' | 'timeline' | 'album' | 'video' | 'qr' | 'guestbook' | 'venue' | 'rsvp';

export interface InvitationStudioConfig {
  packageTier: '109k' | '159k' | '199k';
  city: string;
  headerMonogramText: string;
  ceremonyTime: string;
  receptionTime: string;
  ceremonyTitle: string;
  receptionTitle: string;
  brideCeremonyTitle: string;
  brideReceptionTitle: string;
  brideCeremonyTime: string;
  brideReceptionTime: string;
  brideHeroKicker: string;
  brideAddress: string;
  brideReceptionAddress: string;
  groomCeremonyTitle: string;
  groomReceptionTitle: string;
  groomCeremonyTime: string;
  groomReceptionTime: string;
  groomHeroKicker: string;
  groomAddress: string;
  groomReceptionAddress: string;
  heroKicker: string;
  albumTitle: string;
  timeLabel: string;
  venueLabel: string;
  brideVenue?: string;
  groomVenue?: string;
  signatureText: string;
  hiddenSections?: InvitationHiddenSection[];
  theme: 'template' | 'champagne' | 'blush' | 'emerald';
  fontStyle: 'editorial' | 'modern' | 'classic';
  musicTrack?: WeddingMusicTrackId;
  customMusicUrl?: string;
  musicUrl?: string;
  videoLink?: string;
  guests: Array<{ id: string; name: string; greeting: 'formal' | 'friendly' }>;
  rsvpQuestions: Array<'transport' | 'meal'>;
}

export interface InvitationPayload {
  brideName: string;
  groomName: string;
  weddingDate: string;
  weddingTime: string;
  venue: string;
  address: string;
  message: string;
  coverUrl: string;
  photos?: DemoPhoto[];
  studio?: InvitationStudioConfig;
  customTemplateId?: string | null;
}

export interface CustomInvitationTemplate {
  id: string;
  name: string;
  entryFile: string;
  manifest: { version: 1; name: string; entry: string };
  assetBaseUrl: string;
  createdAt?: string;
}

export interface CustomerRecord extends InvitationPayload {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  source: string;
  notes: string;
  selectedTemplateId: string;
  confirmedAt: string | null;
  exportedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InvitationDemoRecord {
  id: string;
  customerId: string;
  templateId: string;
  publicToken: string;
  status: DemoStatus;
  note: string;
  expiresAt: string | null;
  payload: InvitationPayload;
  createdAt: string;
  updatedAt: string;
}

export interface PublishedInvitationRecord {
  slug: string;
  customerId: string;
  demoId: string;
  createdAt: string;
}

export interface PublicInvitationDemo {
  id: string;
  templateId: string;
  note: string;
  expiresAt: string | null;
  payload: InvitationPayload;
  customTemplate?: CustomInvitationTemplate | null;
}

export interface AdminProfile {
  userId: string;
  email: string;
  displayName: string;
}

export interface AdminSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  userId: string;
  email: string;
}

export const emptyInvitationPayload: InvitationPayload = {
  brideName: '',
  groomName: '',
  weddingDate: '',
  weddingTime: '18:00',
  venue: '',
  address: '',
  message: 'Trân trọng mời bạn đến chung vui trong ngày hạnh phúc của chúng mình.',
  coverUrl: '',
};

export const customerStatusLabels: Record<CustomerStatus, string> = {
  new: 'Khách mới',
  contacted: 'Đã liên hệ',
  demo_ready: 'Đã có demo',
  confirmed: 'Đã xác nhận',
  completed: 'Đã bàn giao',
};
