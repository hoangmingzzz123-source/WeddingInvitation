export type WeddingMusicTrackId = 'default' | 'le-duong' | 'goi-con-tim' | 'custom';

export const defaultWeddingMusicUrl = '/audio/Le_duong.mp3';

export const weddingMusicTracks = [
  { id: 'le-duong', label: 'Lễ đường · MP3', url: defaultWeddingMusicUrl },
  { id: 'goi-con-tim', label: 'Gói Con Tim Làm Quà · MP3', url: '/audio/goi_con_tim_lam_qua.mp3' },
] as const;

export function isSupportedWeddingMusicUrl(value: string) {
  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:'
      && !url.username
      && !url.password
      && /\.mp3$/i.test(url.pathname);
  } catch {
    return false;
  }
}

export function weddingMusicUrlForTrack(track: WeddingMusicTrackId | undefined, customUrl?: string) {
  if (!track || track === 'default') return undefined;
  if (track === 'custom') return customUrl && isSupportedWeddingMusicUrl(customUrl) ? customUrl.trim() : undefined;
  return weddingMusicTracks.find((item) => item.id === track)?.url;
}
