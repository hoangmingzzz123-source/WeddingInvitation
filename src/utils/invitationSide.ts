import type { InvitationStudioConfig } from '../types/admin';

export interface InvitationSideDetails {
  venue: string;
  ceremonyTitle: string;
  receptionTitle: string;
  heroKicker: string;
  ceremonyTime: string;
  receptionTime: string;
  ceremonyAddress: string;
  receptionAddress: string;
}

export function resolveInvitationSide(
  studio?: InvitationStudioConfig,
  sideValue = new URLSearchParams(window.location.search).get('side')?.trim().toLowerCase() ?? '',
): InvitationSideDetails | null {
  const brideSides = new Set(['bride', 'gai', 'nha-gai', 'nhà-gái', 'female']);
  const groomSides = new Set(['groom', 'trai', 'nha-trai', 'nhà-trai', 'male']);

  if (brideSides.has(sideValue)) {
    const ceremonyAddress = studio?.brideAddress || '';
    return {
      venue: studio?.brideVenue || '',
      ceremonyTitle: studio?.brideCeremonyTitle || 'Lễ Vu Quy',
      receptionTitle: studio?.brideReceptionTitle || 'Đón khách nhà gái',
      heroKicker: studio?.brideHeroKicker || 'Lễ Vu Quy',
      ceremonyTime: studio?.brideCeremonyTime || studio?.ceremonyTime || '',
      receptionTime: studio?.brideReceptionTime || studio?.receptionTime || '',
      ceremonyAddress,
      receptionAddress: studio?.brideReceptionAddress || ceremonyAddress,
    };
  }

  if (groomSides.has(sideValue)) {
    const ceremonyAddress = studio?.groomAddress || '';
    return {
      venue: studio?.groomVenue || '',
      ceremonyTitle: studio?.groomCeremonyTitle || 'Lễ Thành Hôn',
      receptionTitle: studio?.groomReceptionTitle || 'Tiệc mừng thân mật',
      heroKicker: studio?.groomHeroKicker || 'Lễ Thành Hôn',
      ceremonyTime: studio?.groomCeremonyTime || studio?.ceremonyTime || '',
      receptionTime: studio?.groomReceptionTime || studio?.receptionTime || '',
      ceremonyAddress,
      receptionAddress: studio?.groomReceptionAddress || ceremonyAddress,
    };
  }

  return null;
}
