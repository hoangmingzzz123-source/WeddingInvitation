export type WeddingMusicTrackId = 'default' | 'library-1' | 'library-2' | 'library-3' | 'library-4' | 'library-5' | 'library-6' | 'library-7' | 'library-8' | 'le-duong' | 'goi-con-tim' | 'custom';

export const defaultWeddingMusicUrl = '/audio/Le_duong.mp3';

export const weddingMusicTracks = [
  { id: 'library-1', label: 'Ngày Đầu Tiên · Đức Phúc', url: 'https://www.youtube.com/watch?v=AfNbehFKJ7o' },
  { id: 'library-2', label: 'Em Đồng Ý (I Do) · Đức Phúc, 911 & Khắc Hưng', url: 'https://www.youtube.com/watch?v=IOe0tNoUGv8' },
  { id: 'library-3', label: 'Bài Này Không Để Đi Diễn · Anh Tú Atus', url: 'https://www.youtube.com/watch?v=jgW4C528hHs' },
  { id: 'library-4', label: 'Cưới Thôi · Masew, Masiu, B Ray & TAP', url: 'https://www.youtube.com/watch?v=_8ldAdQd9WU' },
  { id: 'library-5', label: 'Xứng Đôi Cưới Thôi · Lê Thiện Hiếu', url: 'https://www.youtube.com/watch?v=BnfaIDwb-y0' },
  { id: 'library-6', label: 'Chăm Hoa · MONO', url: 'https://www.youtube.com/watch?v=WCm2elbTEZQ' },
  { id: 'library-7', label: 'Cưới Đi · 2T & Changg', url: 'https://www.youtube.com/watch?v=jdzj6tYAnjY' },
  { id: 'library-8', label: 'Một Đời · 14 Casper & Bon Nghiêm', url: 'https://www.youtube.com/watch?v=JgTZvDbaTtg' },
  { id: 'le-duong', label: 'Lễ đường · MP3', url: defaultWeddingMusicUrl },
  { id: 'goi-con-tim', label: 'Gói Con Tim Làm Quà · MP3', url: '/audio/goi_con_tim_lam_qua.mp3' },
] as const;

export function youtubeVideoIdFromUrl(value: string) {
  const trimmed = value.trim();
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'https:' || url.username || url.password) return undefined;
    if (url.hostname === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0];
      return id && /^[\w-]{11}$/.test(id) ? id : undefined;
    }
    if (!['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(url.hostname)) return undefined;
    const id = url.searchParams.get('v')
      ?? /^\/(?:embed|shorts|live)\/([\w-]{11})(?:\/|$)/.exec(url.pathname)?.[1];
    return id && /^[\w-]{11}$/.test(id) ? id : undefined;
  } catch {
    return undefined;
  }
}

export function isSupportedWeddingMusicUrl(value: string) {
  const trimmed = value.trim();
  if (youtubeVideoIdFromUrl(trimmed)) return true;
  try {
    const url = new URL(trimmed);
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
  if (track === 'custom') return customUrl?.trim() || undefined;
  return weddingMusicTracks.find((item) => item.id === track)?.url;
}
