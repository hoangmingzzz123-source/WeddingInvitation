export type WeddingMusicTrackId = 'default' | 'library-1' | 'library-2' | 'library-3' | 'library-4' | 'library-5' | 'library-6' | 'library-7' | 'library-8' | 'le-duong' | 'custom';

export const defaultWeddingMusicUrl = '/audio/Le_duong.mp3';

export const weddingMusicTracks = [
  { id: 'library-1', label: 'Khúc nhạc 01', url: 'https://www.youtube.com/watch?v=AfNbehFKJ7o&list=RDAfNbehFKJ7o&start_radio=1' },
  { id: 'library-2', label: 'Khúc nhạc 02', url: 'https://www.youtube.com/watch?v=IOe0tNoUGv8&list=RDIOe0tNoUGv8&start_radio=1' },
  { id: 'library-3', label: 'Khúc nhạc 03', url: 'https://www.youtube.com/watch?v=jgW4C528hHs&list=RDjgW4C528hHs&start_radio=1' },
  { id: 'library-4', label: 'Khúc nhạc 04', url: 'https://www.youtube.com/watch?v=_8ldAdQd9WU&list=RD_8ldAdQd9WU&start_radio=1' },
  { id: 'library-5', label: 'Khúc nhạc 05', url: 'https://www.youtube.com/watch?v=BnfaIDwb-y0&list=RD_8ldAdQd9WU&index=5' },
  { id: 'library-6', label: 'Khúc nhạc 06', url: 'https://www.youtube.com/watch?v=WCm2elbTEZQ&list=RD_8ldAdQd9WU&index=13' },
  { id: 'library-7', label: 'Khúc nhạc 07', url: 'https://www.youtube.com/watch?v=jdzj6tYAnjY&list=RD_8ldAdQd9WU&index=19' },
  { id: 'library-8', label: 'Khúc nhạc 08', url: 'https://www.youtube.com/watch?v=JgTZvDbaTtg&list=RDJgTZvDbaTtg&start_radio=1' },
  { id: 'le-duong', label: 'Lễ đường · MP3', url: defaultWeddingMusicUrl },
] as const;

export function weddingMusicUrlForTrack(track: WeddingMusicTrackId | undefined, customUrl?: string) {
  if (!track || track === 'default') return undefined;
  if (track === 'custom') return customUrl?.trim() || undefined;
  return weddingMusicTracks.find((item) => item.id === track)?.url;
}
