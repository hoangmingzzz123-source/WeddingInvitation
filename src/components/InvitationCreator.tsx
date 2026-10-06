import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  AudioLines,
  CalendarDays,
  Check,
  Clipboard,
  Clock3,
  Download,
  ExternalLink,
  Heart,
  ImagePlus,
  Link2,
  MapPin,
  MessageCircleHeart,
  Play,
  Palette,
  Pencil,
  QrCode,
  Save,
  Share2,
  Sparkles,
  Trash2,
  UserPlus,
  UsersRound,
  Video,
  Volume2,
  VolumeX,
  WandSparkles,
  X,
} from 'lucide-react';
import { navigateTo } from '../Router';
import { getWeddingPackage, weddingPackages } from '../data/packages';
import type { TemplateTier } from '../data/templates';
import weddingTrack from '../asset/Le_duong.mp3';

const STORAGE_KEY = 'mp-wedding-demo-draft-v1';
const RSVP_STORAGE_PREFIX = 'mp-wedding-demo-rsvps-v1:';

type InvitationTheme = 'champagne' | 'blush' | 'emerald';
type InvitationFont = 'editorial' | 'modern' | 'classic';
type InvitationQuestion = 'transport' | 'meal';

interface InvitationGuest {
  id: string;
  name: string;
  greeting: 'formal' | 'friendly';
}

interface InvitationRsvp {
  guestId: string;
  name: string;
  attending: 'yes' | 'no';
  guestCount: number;
  answers: Partial<Record<InvitationQuestion, string>>;
  submittedAt: string;
}

interface InvitationDraft {
  id: string;
  packageTier: TemplateTier;
  brideName: string;
  groomName: string;
  weddingDate: string;
  weddingTime: string;
  venue: string;
  address: string;
  message: string;
  theme: InvitationTheme;
  fontStyle: InvitationFont;
  cover: string;
  albumPhotos: string[];
  guests: InvitationGuest[];
  rsvpQuestions: InvitationQuestion[];
}

const coverOptions = [
  {
    id: 'reception',
    label: 'Tiệc cưới thanh lịch',
    url: 'https://images.unsplash.com/photo-1769812343590-485512e27838?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'rings',
    label: 'Nhẫn cưới tối giản',
    url: 'https://images.unsplash.com/photo-1741207154948-66f7fa63c35a?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'flowers',
    label: 'Hoa cưới lãng mạn',
    url: 'https://images.unsplash.com/photo-1664530140722-7e3bdbf2b870?auto=format&fit=crop&w=1600&q=85',
  },
] as const;

const MAX_EMBEDDED_IMAGE_CHARS = 720_000;
const MAX_SINGLE_IMAGE_CHARS = 180_000;
const MAX_IMAGE_FILE_BYTES = 15 * 1024 * 1024;

const themeOptions: Array<{ id: InvitationTheme; name: string; description: string }> = [
  { id: 'champagne', name: 'Champagne', description: 'Ấm áp · Sang trọng' },
  { id: 'blush', name: 'Blush Rose', description: 'Nhẹ nhàng · Lãng mạn' },
  { id: 'emerald', name: 'Emerald', description: 'Hiện đại · Tinh tế' },
];

const defaultDraft: InvitationDraft = {
  id: '',
  packageTier: '109k',
  brideName: '',
  groomName: '',
  weddingDate: '',
  weddingTime: '18:00',
  venue: '',
  address: '',
  message: 'Trân trọng mời bạn đến chung vui trong ngày hạnh phúc của chúng mình.',
  theme: 'champagne',
  fontStyle: 'editorial',
  cover: coverOptions[0].url,
  albumPhotos: [],
  guests: [],
  rsvpQuestions: [],
};

const creationSteps = [
  { title: 'Đôi bạn', heading: 'Ai là nhân vật chính?', hint: 'Bắt đầu bằng tên hai bạn để thiệp mang dấu ấn riêng.' },
  { title: 'Thời gian', heading: 'Chọn ngày vui', hint: 'Thêm ngày và giờ để khách mời dễ sắp xếp.' },
  { title: 'Địa điểm', heading: 'Hẹn nhau ở đâu?', hint: 'Cho khách biết tên sảnh tiệc và cách tìm đến nơi.' },
  { title: 'Lời mời', heading: 'Gửi một lời thật riêng', hint: 'Viết lời nhắn theo cách của hai bạn, hoặc chọn một gợi ý có sẵn.' },
  { title: 'Thiết kế', heading: 'Chọn mẫu và bảng màu', hint: 'Thử màu, kiểu chữ, tải ảnh bìa và thêm ảnh album. Bạn có thể đổi thiết kế hoặc gói mà không nhập lại thông tin.' },
  { title: 'Khách mời', heading: 'Chuẩn bị lời mời riêng', hint: 'Thêm tên khách, tạo link cá nhân hóa và chọn thông tin cần hỏi trong RSVP.' },
  { title: 'Rà soát', heading: 'Sẵn sàng gửi lời mời chưa?', hint: 'Kiểm tra lại thông tin một lượt. Bạn vẫn có thể quay lại chỉnh sửa.' },
];

const invitationMessageIdeas = [
  'Trân trọng mời bạn đến chung vui trong ngày hạnh phúc của chúng mình.',
  'Ngày vui sẽ trọn vẹn hơn khi có bạn ở bên. Hẹn gặp bạn nhé!',
  'Hai chúng mình sắp về chung một nhà. Mời bạn đến nâng ly chúc mừng!',
];

function isInvitationTheme(value: unknown): value is InvitationTheme {
  return value === 'champagne' || value === 'blush' || value === 'emerald';
}

function isTemplateTier(value: unknown): value is TemplateTier {
  return value === '109k' || value === '159k' || value === '199k';
}

function isInvitationFont(value: unknown): value is InvitationFont {
  return value === 'editorial' || value === 'modern' || value === 'classic';
}

function isUploadedImage(value: unknown): value is string {
  return typeof value === 'string'
    && /^data:image\/(?:jpeg|png|webp);base64,/i.test(value)
    && value.length <= MAX_SINGLE_IMAGE_CHARS;
}

function getAlbumPhotoLimit(tier: TemplateTier) {
  if (tier === '109k') return 10;
  if (tier === '159k') return 30;
  return Number.POSITIVE_INFINITY;
}

function normalizeAlbumPhotos(value: unknown, availableChars: number) {
  if (!Array.isArray(value)) return [];
  const photos: string[] = [];
  let usedChars = 0;
  for (const photo of value) {
    if (!isUploadedImage(photo) || usedChars + photo.length > availableChars) continue;
    photos.push(photo);
    usedChars += photo.length;
  }
  return photos;
}

function compressInvitationImage(file: File, maxDimension: number) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return Promise.reject(new Error('Hãy chọn ảnh JPG, PNG hoặc WebP.'));
  }
  if (file.size > MAX_IMAGE_FILE_BYTES) {
    return Promise.reject(new Error('Ảnh gốc cần nhỏ hơn 15 MB.'));
  }

  const objectUrl = URL.createObjectURL(file);
  return new Promise<string>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
      let resizeScale = scale;

      for (let attempt = 0; attempt < 7; attempt += 1) {
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.naturalWidth * resizeScale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * resizeScale));
        const context = canvas.getContext('2d');
        if (!context) {
          reject(new Error('Không thể xử lý ảnh trên trình duyệt này.'));
          return;
        }
        context.fillStyle = '#fff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        for (const quality of [0.78, 0.68, 0.58]) {
          const result = canvas.toDataURL('image/jpeg', quality);
          if (result.length <= MAX_SINGLE_IMAGE_CHARS) {
            resolve(result);
            return;
          }
        }
        resizeScale *= 0.82;
      }

      reject(new Error('Ảnh này quá phức tạp để nén. Hãy thử ảnh khác.'));
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Không thể mở ảnh này. Hãy thử JPG, PNG hoặc WebP.'));
    };
    image.src = objectUrl;
  });
}

function normalizeDraft(value: Partial<InvitationDraft> | null | undefined): InvitationDraft {
  const allowedQuestions: InvitationQuestion[] = ['transport', 'meal'];
  const cover = coverOptions.some((option) => option.url === value?.cover)
    ? value!.cover!
    : isUploadedImage(value?.cover) ? value!.cover! : defaultDraft.cover;
  const coverChars = cover.startsWith('data:image/') ? cover.length : 0;
  return {
    ...defaultDraft,
    ...value,
    id: typeof value?.id === 'string' && value.id ? value.id : createId('wedding'),
    packageTier: isTemplateTier(value?.packageTier) ? value.packageTier : defaultDraft.packageTier,
    theme: isInvitationTheme(value?.theme) ? value.theme : defaultDraft.theme,
    fontStyle: isInvitationFont(value?.fontStyle) ? value.fontStyle : defaultDraft.fontStyle,
    cover,
    albumPhotos: normalizeAlbumPhotos(value?.albumPhotos, MAX_EMBEDDED_IMAGE_CHARS - coverChars),
    guests: Array.isArray(value?.guests)
      ? value.guests
        .filter((guest): guest is InvitationGuest => Boolean(guest && typeof guest.id === 'string' && typeof guest.name === 'string'))
        .map((guest) => ({ id: guest.id, name: guest.name.slice(0, 80), greeting: guest.greeting === 'formal' ? 'formal' : 'friendly' }))
      : [],
    rsvpQuestions: Array.isArray(value?.rsvpQuestions)
      ? [...new Set(value.rsvpQuestions.filter((question): question is InvitationQuestion => allowedQuestions.includes(question)))]
      : [],
  };
}

function createId(prefix: string) {
  const suffix = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}-${suffix}`;
}

function encodeDraft(draft: InvitationDraft) {
  const bytes = new TextEncoder().encode(JSON.stringify(draft));
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

function encodePublicDraft(draft: InvitationDraft) {
  return encodeDraft({ ...draft, guests: [] });
}

function decodeDraft(value: string | null) {
  if (!value) return null;

  try {
    const normalized = value.replaceAll('-', '+').replaceAll('_', '/');
    const binary = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='));
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return normalizeDraft(JSON.parse(new TextDecoder().decode(bytes)) as Partial<InvitationDraft>);
  } catch {
    return null;
  }
}

function readSavedDraft() {
  try {
    const savedDraft = localStorage.getItem(STORAGE_KEY);
    return savedDraft ? normalizeDraft(JSON.parse(savedDraft) as Partial<InvitationDraft>) : normalizeDraft(defaultDraft);
  } catch {
    return normalizeDraft(defaultDraft);
  }
}

function saveDraft(draft: InvitationDraft) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // The live demo still works when storage is unavailable.
  }
}

function readInvitationRsvps(invitationId: string): InvitationRsvp[] {
  try {
    const stored = localStorage.getItem(`${RSVP_STORAGE_PREFIX}${invitationId}`);
    const rows = stored ? JSON.parse(stored) as InvitationRsvp[] : [];
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
}

function saveInvitationRsvp(invitationId: string, response: InvitationRsvp) {
  const current = readInvitationRsvps(invitationId);
  const next = [...current.filter((row) => row.guestId !== response.guestId), response];
  try {
    localStorage.setItem(`${RSVP_STORAGE_PREFIX}${invitationId}`, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('mp-wedding-demo-rsvp-updated', { detail: { invitationId } }));
  } catch {
    // Keep the current preview usable if storage is unavailable.
  }
  return next;
}

function invitationUrl(draft: InvitationDraft, guest?: InvitationGuest) {
  const url = new URL('/tao-thiep/preview', window.location.origin);
  url.searchParams.set('data', encodePublicDraft(draft));
  if (guest) {
    url.searchParams.set('guestId', guest.id);
    url.searchParams.set('guestName', guest.name);
    url.searchParams.set('greeting', guest.greeting);
  }
  return url.toString();
}

function exportRsvpsCsv(draft: InvitationDraft, rsvps: InvitationRsvp[]) {
  const byGuest = new Map(rsvps.map((response) => [response.guestId, response]));
  const questionLabels: Record<InvitationQuestion, string> = { transport: 'Xe đưa đón', meal: 'Chế độ ăn' };
  const questions = draft.rsvpQuestions;
  const rows = [
    ['Khách mời', 'Trạng thái', 'Số người', ...questions.map((question) => questionLabels[question]), 'Thời gian phản hồi'],
    ...draft.guests.map((guest) => {
      const response = byGuest.get(guest.id);
      return [
        guest.name,
        response ? (response.attending === 'yes' ? 'Sẽ tham dự' : 'Không tham dự') : 'Chưa phản hồi',
        response ? String(response.guestCount) : '',
        ...questions.map((question) => response?.answers[question] ?? ''),
        response?.submittedAt ?? '',
      ];
    }),
  ];
  const csv = `\uFEFF${rows.map((row) => row.map((cell) => {
    const value = String(cell);
    const safeValue = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
    return `"${safeValue.replaceAll('"', '""')}"`;
  }).join(',')).join('\r\n')}`;
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `khach-moi-${draft.id}.csv`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function formatWeddingDate(value: string) {
  if (!value) return 'Ngày cưới của chúng mình';
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function InvitationPreview({
  draft,
  compact = false,
  guest,
  existingRsvp,
  onRsvpSaved,
}: {
  draft: InvitationDraft;
  compact?: boolean;
  guest?: InvitationGuest | null;
  existingRsvp?: InvitationRsvp;
  onRsvpSaved?: (response: InvitationRsvp) => void;
}) {
  const [rsvpSent, setRsvpSent] = useState(Boolean(existingRsvp));
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [customTrack, setCustomTrack] = useState('');
  const [guestNote, setGuestNote] = useState('');
  const [guestNotes, setGuestNotes] = useState(['Chúc hai bạn mãi hạnh phúc!']);
  const [activePhoto, setActivePhoto] = useState<number | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const selectedPackage = getWeddingPackage(draft.packageTier);
  const isPremium = draft.packageTier !== '109k';
  const isDiamond = draft.packageTier === '199k';
  const activeQuestions = isPremium ? draft.rsvpQuestions : [];
  const appliedFontStyle = isPremium ? draft.fontStyle : 'editorial';
  const albumLimit = getAlbumPhotoLimit(draft.packageTier);
  const uploadedGallery = draft.albumPhotos.slice(0, albumLimit);
  const gallery = uploadedGallery.length ? uploadedGallery : coverOptions.map((cover) => cover.url);
  const destination = [draft.venue, draft.address].filter(Boolean).join(', ');
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;

  useEffect(() => () => {
    if (customTrack) URL.revokeObjectURL(customTrack);
  }, [customTrack]);

  useEffect(() => {
    setRsvpSent(Boolean(existingRsvp));
  }, [existingRsvp]);

  const submitRsvp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = guest?.name || String(form.get('name') ?? '').trim();
    const response: InvitationRsvp = {
      guestId: guest?.id ?? createId('public-guest'),
      name,
      attending: form.get('attending') === 'no' ? 'no' : 'yes',
      guestCount: isPremium ? Number(form.get('guestCount') ?? 1) : 1,
      answers: {
        ...(activeQuestions.includes('transport') ? { transport: String(form.get('transport') ?? '') } : {}),
        ...(activeQuestions.includes('meal') ? { meal: String(form.get('meal') ?? '') } : {}),
      },
      submittedAt: new Date().toISOString(),
    };
    if (!compact) {
      const updated = saveInvitationRsvp(draft.id, response);
      onRsvpSaved?.(updated.find((row) => row.guestId === response.guestId) ?? response);
    }
    setRsvpSent(true);
  };

  const toggleMusic = async () => {
    if (!audioRef.current) return;
    try {
      if (musicPlaying) audioRef.current.pause();
      else await audioRef.current.play();
      setMusicPlaying(!musicPlaying);
    } catch {
      setMusicPlaying(false);
    }
  };

  const shareInvitation = async () => {
    const shareData = {
      title: `${draft.brideName || 'Cô dâu'} & ${draft.groomName || 'Chú rể'}`,
      text: 'Mời bạn xem thiệp cưới của chúng mình.',
      url: invitationUrl(draft, guest ?? undefined),
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else if (navigator.clipboard) await navigator.clipboard.writeText(shareData.url);
    } catch {
      if (navigator.clipboard) await navigator.clipboard.writeText(shareData.url);
    }
  };

  const addGuestNote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!guestNote.trim()) return;
    setGuestNotes((current) => [guestNote.trim(), ...current].slice(0, 3));
    setGuestNote('');
  };

  return (
    <article className={`generated-invitation generated-invitation--${draft.theme} generated-invitation--font-${appliedFontStyle} generated-invitation--tier-${draft.packageTier}${compact ? ' is-compact' : ''}`}>
      <div className="generated-invitation__cover" style={{ backgroundImage: `url("${draft.cover}")` }}>
        <div className="generated-invitation__overlay" />
        <div className="generated-invitation__cover-content">
          <span className="generated-invitation__monogram" aria-hidden="true">
            {(draft.brideName || 'C').charAt(0)}<Heart />{(draft.groomName || 'R').charAt(0)}
          </span>
          <p>Wedding invitation</p>
          {guest && <p className="generated-invitation__guest-greeting">{guest.greeting === 'formal' ? 'Trân trọng kính mời' : 'Thân mời'} {guest.name}</p>}
          <h2><span>{draft.brideName || 'Cô dâu'}</span><i>&amp;</i><span>{draft.groomName || 'Chú rể'}</span></h2>
          <time>{formatWeddingDate(draft.weddingDate)}</time>
          <button type="button" className="generated-invitation__music" onClick={toggleMusic} aria-pressed={musicPlaying}>
            {musicPlaying ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
            {musicPlaying ? 'Tắt nhạc' : 'Bật nhạc nền'}
          </button>
          {isPremium && !compact && (
            <label className="generated-invitation__music-upload">
              <AudioLines aria-hidden="true" /> Chọn nhạc nền riêng
              <input
                type="file"
                accept="audio/*"
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0];
                  if (!file) return;
                  audioRef.current?.pause();
                  setMusicPlaying(false);
                  setCustomTrack(URL.createObjectURL(file));
                }}
              />
            </label>
          )}
          {customTrack && !compact && <small className="generated-invitation__music-note">Nhạc này chỉ phát thử trên thiết bị hiện tại.</small>}
          <audio ref={audioRef} src={customTrack || weddingTrack} loop preload="none" />
        </div>
      </div>

      <div className="generated-invitation__body">
        <span className="generated-invitation__tier">{selectedPackage.name} · {selectedPackage.price}</span>
        <p className="generated-invitation__quote">“{draft.message || defaultDraft.message}”</p>
        <div className="generated-invitation__details">
          <div><Clock3 aria-hidden="true" /><span><small>Thời gian</small>{draft.weddingTime || '18:00'}</span></div>
          <div><MapPin aria-hidden="true" /><span><small>Địa điểm</small>{draft.venue || 'Địa điểm tổ chức'}</span></div>
        </div>
        {draft.address && <p className="generated-invitation__address">{draft.address}</p>}
        <a className="generated-invitation__map-link" href={mapUrl} target="_blank" rel="noopener noreferrer">
          <MapPin aria-hidden="true" /> Xem địa điểm trên Google Maps
        </a>
        <span className="generated-invitation__divider" aria-hidden="true">✦</span>
        <p className="generated-invitation__thanks">Sự hiện diện của bạn là niềm vui của chúng mình</p>
      </div>

      {isPremium && (
        <section className="generated-invitation__story" aria-label="Câu chuyện và album">
          <p className="generated-invitation__section-label">OUR STORY</p>
          <h3>Một hành trình, nhiều kỷ niệm</h3>
          <p className="generated-invitation__story-copy">Từ ngày đầu gặp gỡ đến lời hẹn trăm năm, mỗi khoảnh khắc đều đáng được lưu giữ.</p>
          <div className="generated-invitation__gallery" aria-label={`Album ảnh, tối đa ${isDiamond ? 'không giới hạn' : '30'} hình`}>
            {(compact ? gallery.slice(0, 4) : gallery).map((src, index) => (
              <button key={`${index}-${src.slice(0, 32)}`} type="button" onClick={() => setActivePhoto(index)} aria-label={`Xem ảnh ${index + 1}`}>
                <img src={src} alt={`Ảnh cưới ${index + 1}`} loading="lazy" />
              </button>
            ))}
          </div>
          <span className="generated-invitation__gallery-limit">Album {isDiamond ? 'không giới hạn' : 'tối đa 30 ảnh'}</span>
          {!compact && <button type="button" className="generated-invitation__share" onClick={shareInvitation}><ExternalLink aria-hidden="true" /> Chia sẻ thiệp</button>}
        </section>
      )}

      {!isPremium && (
        <section className="generated-invitation__basic-gallery" aria-label="Album ảnh demo">
          <p className="generated-invitation__section-label">OUR ALBUM</p>
          <h3>Những khoảnh khắc của chúng mình</h3>
          <div className="generated-invitation__gallery" aria-label="Album ảnh demo, tối đa 10 hình">
            {(compact ? gallery.slice(0, 3) : gallery).map((src, index) => (
              <button key={`${index}-${src.slice(0, 32)}`} type="button" onClick={() => setActivePhoto(index)} aria-label={`Xem ảnh ${index + 1}`}>
                <img src={src} alt={`Ảnh cưới ${index + 1}`} loading="lazy" />
              </button>
            ))}
          </div>
          <span className="generated-invitation__gallery-limit">Album cơ bản · tối đa 10 ảnh</span>
        </section>
      )}

      {isDiamond && (
        <section className="generated-invitation__diamond" aria-label="Tính năng gói Diamond">
          <div className="generated-invitation__video-card" style={{ backgroundImage: `linear-gradient(0deg, rgba(20,18,23,.72), rgba(20,18,23,.08)), url("${gallery[1] ?? gallery[0]}")` }}>
            <button type="button" onClick={() => setVideoOpen(true)} aria-label="Mở video cưới demo"><Play fill="currentColor" aria-hidden="true" /></button>
            <span><Video aria-hidden="true" /> VIDEO CƯỚI</span>
          </div>
          <div className="generated-invitation__gift-card">
            <div><QrCode aria-hidden="true" /><h3>Mừng cưới online</h3><p>Mã QR minh họa · Không dùng để thanh toán</p></div>
            <svg viewBox="0 0 100 100" role="img" aria-label="Mã QR mô phỏng">
              <rect width="100" height="100" rx="4" fill="white" />
              <path d="M5 5h30v30H5zM11 11v18h18V11zM65 5h30v30H65zM71 11v18h18V11zM5 65h30v30H5zM11 71v18h18V71z" fill="currentColor" fillRule="evenodd" />
              <path d="M43 8h8v8h-8zM52 22h10v8H52zM41 42h8v8h-8zM57 41h8v8h-8zM73 42h9v8h-9zM42 56h10v8H42zM58 54h8v12h-8zM73 59h10v8H73zM88 45h8v8h-8zM43 74h8v8h-8zM58 73h9v8h-9zM72 74h8v8h-8zM85 84h11v11H85zM54 88h10v8H54z" fill="currentColor" />
            </svg>
          </div>
          <div className="generated-invitation__guestbook">
            <div><MessageCircleHeart aria-hidden="true" /><span><strong>Sổ lưu bút</strong><small>Gửi đôi bạn một lời chúc</small></span></div>
            <form onSubmit={addGuestNote}>
              <label className="visually-hidden" htmlFor={compact ? 'preview-guest-note' : 'full-guest-note'}>Lời chúc</label>
              <input id={compact ? 'preview-guest-note' : 'full-guest-note'} value={guestNote} onChange={(event) => setGuestNote(event.target.value)} placeholder="Viết lời chúc..." maxLength={100} />
              <button type="submit" aria-label="Gửi lời chúc"><Heart aria-hidden="true" /></button>
            </form>
            {guestNotes.map((note, index) => <p key={`${note}-${index}`}><span>{['🤍', '✨', '🌿'][index]}</span>{note}</p>)}
          </div>
        </section>
      )}

      <section className="generated-invitation__rsvp" aria-label="Xác nhận tham dự">
        {!rsvpSent ? (
          <form onSubmit={submitRsvp}>
            <p className="generated-invitation__section-label">PLEASE REPLY</p>
            <h3>{isDiamond ? 'Hồi đáp & gửi lời chúc' : 'Bạn sẽ đến chứ?'}</h3>
            <label>Tên của bạn<input name="name" required placeholder="Họ và tên" autoComplete="name" defaultValue={guest?.name ?? ''} readOnly={Boolean(guest)} /></label>
            <label>{isPremium ? 'Xác nhận tham dự' : 'Bạn có thể đến chung vui không?'}<select name="attending" defaultValue="yes"><option value="yes">Có, mình sẽ đến</option><option value="no">Rất tiếc, mình bận</option></select></label>
            {isPremium && <label>Số người tham dự<select name="guestCount" defaultValue="1"><option value="1">1 người</option><option value="2">2 người</option><option value="3">3 người</option><option value="4">4 người</option></select></label>}
            {activeQuestions.includes('transport') && <label>Cần xe đưa đón?<select name="transport" defaultValue="Không cần"><option>Không cần</option><option>Cần xe đưa đón</option></select></label>}
            {activeQuestions.includes('meal') && <label>Chế độ ăn<select name="meal" defaultValue="Không yêu cầu"><option>Không yêu cầu</option><option>Ăn chay</option><option>Có dị ứng / lưu ý</option></select></label>}
            <button type="submit"><Check aria-hidden="true" /> Xác nhận tham dự</button>
          </form>
        ) : (
          <div className="generated-invitation__rsvp-success" role="status"><Check aria-hidden="true" /><h3>Cảm ơn bạn!</h3><p>Chúng mình rất mong được gặp bạn.</p></div>
        )}
      </section>

      {!compact && <div className="generated-invitation__feature-list" aria-label={`Tính năng ${selectedPackage.name}`}>
        {selectedPackage.features.map((feature) => <span key={feature}><Check aria-hidden="true" /> {feature}</span>)}
      </div>}

      {activePhoto !== null && (
        <div className="generated-invitation__lightbox" role="dialog" aria-modal="true" aria-label={`Ảnh cưới ${activePhoto + 1}`} onClick={() => setActivePhoto(null)}>
          <button type="button" onClick={() => setActivePhoto(null)} aria-label="Đóng ảnh"><X aria-hidden="true" /></button>
          <img src={gallery[activePhoto]} alt={`Ảnh cưới ${activePhoto + 1}`} onClick={(event) => event.stopPropagation()} />
        </div>
      )}
      {videoOpen && (
        <div className="generated-invitation__lightbox" role="dialog" aria-modal="true" aria-label="Video cưới minh họa" onClick={() => setVideoOpen(false)}>
          <button type="button" onClick={() => setVideoOpen(false)} aria-label="Đóng video"><X aria-hidden="true" /></button>
          <iframe src="https://www.youtube-nocookie.com/embed/VvkYROIh5qc?autoplay=1" title="Video cưới minh họa" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen onClick={(event) => event.stopPropagation()} />
        </div>
      )}
    </article>
  );
}

function InvitationGuestDashboard({ draft, rsvps }: { draft: InvitationDraft; rsvps: InvitationRsvp[] }) {
  const guestIds = new Set(draft.guests.map((guest) => guest.id));
  const currentRsvps = rsvps.filter((response) => guestIds.has(response.guestId) || response.guestId.startsWith('public-guest-'));
  const responseByGuest = new Map(currentRsvps.map((response) => [response.guestId, response]));
  const answeredGuests = draft.guests.filter((guest) => responseByGuest.has(guest.id)).length;
  const yesResponses = currentRsvps.filter((response) => response.attending === 'yes');
  const expectedGuests = yesResponses.reduce((total, response) => total + response.guestCount, 0);
  const outstanding = Math.max(0, draft.guests.length - answeredGuests);

  const copyGeneralLink = async () => {
    const link = invitationUrl(draft);
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      window.prompt('Sao chép link thiệp chung:', link);
    }
  };

  const copyGuestLink = async (guest: InvitationGuest) => {
    const link = invitationUrl(draft, guest);
    try {
      if (navigator.share) {
        await navigator.share({ title: `${draft.brideName} & ${draft.groomName}`, text: `Thiệp cưới gửi riêng cho ${guest.name}`, url: link });
      } else {
        await navigator.clipboard.writeText(link);
      }
    } catch {
      try {
        await navigator.clipboard.writeText(link);
      } catch {
        window.prompt(`Sao chép link dành cho ${guest.name}:`, link);
      }
    }
  };

  return (
    <section className="invitation-guest-dashboard" aria-labelledby="invitation-guest-dashboard-title">
      <header className="invitation-guest-dashboard__header">
        <div>
          <p><UsersRound aria-hidden="true" /> KHÁCH MỜI &amp; RSVP</p>
          <h2 id="invitation-guest-dashboard-title">Theo dõi lời hồi đáp</h2>
          <span>Link mỗi khách có sẵn tên và lời chào để bạn gửi riêng.</span>
        </div>
        <div className="invitation-guest-dashboard__actions">
          <button type="button" onClick={() => void copyGeneralLink()}><Link2 aria-hidden="true" /> Link chung</button>
          <button type="button" onClick={() => navigateTo('/yeu-cau-thiep')}><ExternalLink aria-hidden="true" /> Xuất bản</button>
          {draft.packageTier === '199k'
            ? <button type="button" className="is-primary" onClick={() => exportRsvpsCsv(draft, rsvps)}><Download aria-hidden="true" /> Tải CSV</button>
            : <span className="invitation-guest-dashboard__upgrade">Xuất CSV · Diamond</span>}
        </div>
      </header>

      <div className="invitation-guest-dashboard__stats" aria-label="Tổng quan khách mời">
        <div><strong>{draft.guests.length}</strong><span>Đã mời</span></div>
        <div><strong>{currentRsvps.length}</strong><span>Đã phản hồi</span></div>
        <div><strong>{outstanding}</strong><span>Chưa phản hồi</span></div>
        <div><strong>{expectedGuests}</strong><span>Sẽ tham dự</span></div>
      </div>

      {draft.guests.length ? (
        <ul className="invitation-guest-dashboard__list">
          {draft.guests.map((guest) => {
            const response = responseByGuest.get(guest.id);
            const invitation = invitationUrl(draft, guest);
            return (
              <li key={guest.id}>
                <span className="invitation-guest-dashboard__avatar">{guest.name.charAt(0).toLocaleUpperCase('vi')}</span>
                <span className="invitation-guest-dashboard__name"><strong>{guest.name}</strong><small>{guest.greeting === 'formal' ? 'Trân trọng kính mời' : 'Thân mời'}</small></span>
                <span className={`invitation-guest-dashboard__status${response ? ` is-${response.attending}` : ''}`}>
                  {response ? (response.attending === 'yes' ? `Sẽ đến · ${response.guestCount}` : 'Không tham dự') : 'Chưa phản hồi'}
                </span>
                <a href={invitation} target="_blank" rel="noopener noreferrer" aria-label={`Xem link của ${guest.name}`}>Xem thiệp</a>
                <button type="button" onClick={() => void copyGuestLink(guest)} aria-label={`Chia sẻ link của ${guest.name}`}><Share2 aria-hidden="true" /></button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="invitation-guest-dashboard__empty">
          <UsersRound aria-hidden="true" />
          <strong>Chưa có khách trong danh sách</strong>
          <span>Thêm khách ở bước Khách mời để tạo link riêng và theo dõi phản hồi.</span>
        </div>
      )}

      <p className="invitation-guest-dashboard__notice">Đây là bản demo lưu RSVP trên trình duyệt hiện tại; khách mở link từ thiết bị khác chưa đồng bộ phản hồi lên đây.</p>
    </section>
  );
}

export function InvitationCreatorPage() {
  const [draft, setDraft] = useState<InvitationDraft>(readSavedDraft);
  const [errors, setErrors] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [saveStatus, setSaveStatus] = useState('Bản nháp được lưu tự động');
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestGreeting, setNewGuestGreeting] = useState<InvitationGuest['greeting']>('friendly');
  const [guestLinkMessage, setGuestLinkMessage] = useState('');
  const [imageUploadStatus, setImageUploadStatus] = useState('');
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  useEffect(() => {
    document.title = 'Tự tạo demo thiệp cưới | Wedding Invitation MP';
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      saveDraft(draft);
      setSaveStatus('Đã lưu bản nháp');
    }, 350);
    setSaveStatus('Đang lưu...');
    return () => window.clearTimeout(timeout);
  }, [draft]);

  const updateDraft = <Key extends keyof InvitationDraft>(key: Key, value: InvitationDraft[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    if (errors.length) setErrors([]);
  };

  const uploadCoverPhoto = async (file: File) => {
    setIsUploadingImages(true);
    setImageUploadStatus('Đang tối ưu ảnh bìa...');
    try {
      const photo = await compressInvitationImage(file, 1600);
      const albumChars = draft.albumPhotos.reduce((total, item) => total + item.length, 0);
      if (photo.length + albumChars > MAX_EMBEDDED_IMAGE_CHARS) {
        throw new Error('Album đang dùng gần hết dung lượng ảnh. Hãy xóa bớt ảnh rồi thử lại.');
      }
      updateDraft('cover', photo);
      setImageUploadStatus('Đã cập nhật ảnh bìa. Ảnh sẽ hiện trong hero và bản xem trước.');
    } catch (error) {
      setImageUploadStatus(error instanceof Error ? error.message : 'Không thể tải ảnh lên.');
    } finally {
      setIsUploadingImages(false);
    }
  };

  const uploadAlbumPhotos = async (files: File[]) => {
    const photoLimit = getAlbumPhotoLimit(draft.packageTier);
    const availableCount = Math.max(0, photoLimit - draft.albumPhotos.length);
    if (!availableCount) {
      setImageUploadStatus(`Gói này đã đạt giới hạn ${photoLimit} ảnh album.`);
      return;
    }

    setIsUploadingImages(true);
    setImageUploadStatus('Đang tối ưu ảnh album...');
    try {
      const currentCoverChars = draft.cover.startsWith('data:image/') ? draft.cover.length : 0;
      let usedChars = currentCoverChars + draft.albumPhotos.reduce((total, item) => total + item.length, 0);
      const nextPhotos = [...draft.albumPhotos];
      const selectedFiles = files.slice(0, availableCount);
      let skipped = files.length - selectedFiles.length;

      for (const [index, file] of selectedFiles.entries()) {
        try {
          const photo = await compressInvitationImage(file, 1200);
          if (usedChars + photo.length > MAX_EMBEDDED_IMAGE_CHARS) {
            skipped += selectedFiles.length - index;
            break;
          }
          nextPhotos.push(photo);
          usedChars += photo.length;
        } catch {
          skipped += 1;
        }
      }

      const added = nextPhotos.length - draft.albumPhotos.length;
      if (added) updateDraft('albumPhotos', nextPhotos);
      setImageUploadStatus(added
        ? `Đã thêm ${added} ảnh vào album${skipped ? `; ${skipped} ảnh chưa thêm vì giới hạn gói hoặc dung lượng` : ''}.`
        : 'Chưa thêm ảnh. Có thể đã hết dung lượng dành cho ảnh trong link demo.');
    } finally {
      setIsUploadingImages(false);
    }
  };

  const removeAlbumPhoto = (index: number) => {
    updateDraft('albumPhotos', draft.albumPhotos.filter((_, photoIndex) => photoIndex !== index));
    setImageUploadStatus('Đã xóa ảnh khỏi album.');
  };

  const addGuest = () => {
    const name = newGuestName.trim();
    if (!name) return;
    updateDraft('guests', [...draft.guests, { id: createId('guest'), name, greeting: newGuestGreeting }]);
    setNewGuestName('');
    setGuestLinkMessage('');
  };

  const copyGuestLink = async (guest: InvitationGuest) => {
    const link = invitationUrl(draft, guest);
    try {
      if (navigator.share) {
        await navigator.share({ title: `${draft.brideName} & ${draft.groomName}`, text: `Thiệp cưới gửi riêng cho ${guest.name}`, url: link });
        setGuestLinkMessage(`Đã mở menu chia sẻ cho ${guest.name}.`);
      } else {
        await navigator.clipboard.writeText(link);
        setGuestLinkMessage(`Đã sao chép link dành cho ${guest.name}.`);
      }
    } catch {
      try {
        await navigator.clipboard.writeText(link);
        setGuestLinkMessage(`Đã sao chép link dành cho ${guest.name}.`);
      } catch {
        window.prompt(`Sao chép link dành cho ${guest.name}:`, link);
      }
    }
  };

  const toggleRsvpQuestion = (question: InvitationQuestion) => {
    updateDraft(
      'rsvpQuestions',
      draft.rsvpQuestions.includes(question)
        ? draft.rsvpQuestions.filter((item) => item !== question)
        : [...draft.rsvpQuestions, question],
    );
  };

  const validateStep = (step: number) => {
    const missingFields: string[] = [];
    if (step === 0) {
      if (!draft.brideName.trim()) missingFields.push('Tên cô dâu');
      if (!draft.groomName.trim()) missingFields.push('Tên chú rể');
    }
    if (step === 1 && !draft.weddingDate) missingFields.push('Ngày cưới');
    if (step === 2 && !draft.venue.trim()) missingFields.push('Địa điểm tổ chức');

    if (missingFields.length) {
      setErrors(missingFields);
      return false;
    }

    setErrors([]);
    return true;
  };

  const generateDemo = () => {
    const firstMissingStep = !draft.brideName.trim() || !draft.groomName.trim()
      ? 0
      : !draft.weddingDate
        ? 1
        : !draft.venue.trim()
          ? 2
          : -1;

    if (firstMissingStep >= 0) {
      setCurrentStep(firstMissingStep);
      validateStep(firstMissingStep);
      document.querySelector('.creator-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    saveDraft(draft);
    navigateTo(`/tao-thiep/preview?data=${encodePublicDraft(draft)}&manage=1`);
  };

  const advanceStep = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep === creationSteps.length - 1) generateDemo();
    else setCurrentStep((step) => step + 1);
  };

  const activeStep = creationSteps[currentStep];

  return (
    <main className="creator-page">
      <header className="creator-header">
        <button type="button" onClick={() => navigateTo('/')}>
          <ArrowLeft aria-hidden="true" />
          Trang chủ
        </button>
        <a href="/" onClick={(event) => { event.preventDefault(); navigateTo('/'); }}>
          Wedding Invitation <span>MP</span>
        </a>
        <span className="creator-save-status"><Save aria-hidden="true" /> {saveStatus}</span>
      </header>

      <section className="creator-intro">
        <div>
          <p><WandSparkles aria-hidden="true" /> Studio demo online</p>
          <h1>Thiệp cưới của hai bạn, bắt đầu từ vài lựa chọn nhỏ</h1>
          <span>Đi qua 7 bước ngắn, xem thiết kế thành hình ngay bên cạnh và tạo link demo để gửi người thân xem thử.</span>
        </div>
        <div className="creator-progress" aria-label={`Bước ${currentStep + 1} trên ${creationSteps.length}: ${activeStep.title}`}>
          <strong>0{currentStep + 1}<small> / 0{creationSteps.length}</small></strong>
          <span>{activeStep.title}</span>
          <div><i style={{ width: `${((currentStep + 1) / creationSteps.length) * 100}%` }} /></div>
        </div>
      </section>

      <section className="creator-package-section" aria-labelledby="creator-package-title">
        <div className="creator-package-section__heading">
          <div>
            <p><Sparkles aria-hidden="true" /> Chọn trải nghiệm</p>
            <h2 id="creator-package-title">Gói thiệp phù hợp với ngày vui</h2>
          </div>
          <span>Tính năng trong bản xem trước sẽ thay đổi theo gói.</span>
        </div>
        <div className="creator-package-grid">
          {weddingPackages.map((weddingPackage) => (
            <button
              type="button"
              key={weddingPackage.id}
              className={`creator-package-card${draft.packageTier === weddingPackage.id ? ' is-selected' : ''}${weddingPackage.popular ? ' is-popular' : ''}`}
              onClick={() => updateDraft('packageTier', weddingPackage.id)}
              aria-pressed={draft.packageTier === weddingPackage.id}
            >
              {weddingPackage.popular && <span className="creator-package-card__ribbon">Được chọn nhiều</span>}
              <span className="creator-package-card__topline">{draft.packageTier === weddingPackage.id ? <Check aria-hidden="true" /> : <Palette aria-hidden="true" />} {draft.packageTier === weddingPackage.id ? 'Đang chọn' : 'Chọn gói'}</span>
              <strong>{weddingPackage.name}</strong>
              <span className="creator-package-card__price">{weddingPackage.price}</span>
              <span className="creator-package-card__summary">{weddingPackage.summary}</span>
              <span className="creator-package-highlights">{weddingPackage.features.map((feature) => <span key={feature}><Check aria-hidden="true" />{feature}</span>)}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="creator-workspace">
        <form className="creator-form" onSubmit={(event) => { event.preventDefault(); advanceStep(); }}>
          {errors.length > 0 && (
            <div className="creator-errors" role="alert">
              <strong>Thiếu một chút nữa thôi:</strong> {errors.join(', ')}.
            </div>
          )}

          <nav className="creator-stepper" aria-label="Các bước tạo thiệp">
            {creationSteps.map((step, index) => (
              <button
                key={step.title}
                type="button"
                className={`${index === currentStep ? 'is-current' : ''}${index < currentStep ? ' is-complete' : ''}`}
                onClick={() => { if (index < currentStep) { setCurrentStep(index); setErrors([]); } }}
                disabled={index > currentStep}
                aria-current={index === currentStep ? 'step' : undefined}
              >
                <i>{index < currentStep ? <Check aria-hidden="true" /> : `0${index + 1}`}</i>
                <span>{step.title}</span>
              </button>
            ))}
          </nav>

          <motion.fieldset
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
          >
            <legend><span>0{currentStep + 1}</span> {activeStep.heading}</legend>
            <p className="creator-step-hint">{activeStep.hint}</p>

            {currentStep === 0 && (
              <div className="creator-fields creator-fields--two">
                <label>
                  Tên cô dâu <b>*</b>
                  <input autoFocus value={draft.brideName} onChange={(event) => updateDraft('brideName', event.target.value)} placeholder="Ví dụ: Hà Phương" />
                </label>
                <label>
                  Tên chú rể <b>*</b>
                  <input value={draft.groomName} onChange={(event) => updateDraft('groomName', event.target.value)} placeholder="Ví dụ: Hoàng Minh" />
                </label>
              </div>
            )}

            {currentStep === 1 && (
              <div className="creator-fields creator-fields--two">
                <label>
                  <CalendarDays aria-hidden="true" /> Ngày cưới <b>*</b>
                  <input autoFocus type="date" value={draft.weddingDate} onChange={(event) => updateDraft('weddingDate', event.target.value)} />
                </label>
                <label>
                  <Clock3 aria-hidden="true" /> Giờ đón khách
                  <input type="time" value={draft.weddingTime} onChange={(event) => updateDraft('weddingTime', event.target.value)} />
                </label>
              </div>
            )}

            {currentStep === 2 && (
              <div className="creator-fields">
                <label>
                  Tên địa điểm <b>*</b>
                  <input autoFocus value={draft.venue} onChange={(event) => updateDraft('venue', event.target.value)} placeholder="Ví dụ: Riverside Palace" />
                </label>
                <label>
                  Địa chỉ chi tiết
                  <input value={draft.address} onChange={(event) => updateDraft('address', event.target.value)} placeholder="Số nhà, đường, quận/huyện, tỉnh/thành" />
                </label>
                <p className="creator-field-note"><MapPin aria-hidden="true" /> Địa chỉ sẽ giúp khách mời tìm đường thuận tiện hơn.</p>
              </div>
            )}

            {currentStep === 3 && (
              <div className="creator-fields">
                <label>
                  Lời nhắn gửi khách mời
                  <textarea autoFocus rows={4} maxLength={180} value={draft.message} onChange={(event) => updateDraft('message', event.target.value)} placeholder="Viết vài dòng theo cách của hai bạn..." />
                  <small>{draft.message.length}/180 ký tự</small>
                </label>
                <div className="creator-message-ideas" aria-label="Gợi ý lời mời">
                  <span>Gợi ý nhanh</span>
                  {invitationMessageIdeas.map((idea, index) => (
                    <button type="button" key={idea} onClick={() => updateDraft('message', idea)}>
                      {['Trang trọng', 'Thân mật', 'Vui tươi'][index]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <>
                <div className="creator-theme-grid">
                  {themeOptions.map((theme) => (
                    <button
                      type="button"
                      key={theme.id}
                      className={`creator-theme creator-theme--${theme.id}${draft.theme === theme.id ? ' is-active' : ''}`}
                      onClick={() => updateDraft('theme', theme.id)}
                      aria-pressed={draft.theme === theme.id}
                    >
                      <i><Palette aria-hidden="true" /></i>
                      <strong>{theme.name}</strong>
                      <small>{theme.description}</small>
                      {draft.theme === theme.id && <Check aria-hidden="true" />}
                    </button>
                  ))}
                </div>

                {draft.packageTier !== '109k' && (
                  <div className="creator-font-section">
                    <p>Kiểu chữ trong thiệp</p>
                    <div className="creator-font-grid" role="group" aria-label="Chọn kiểu chữ">
                      {[
                        { id: 'editorial', name: 'Editorial', sample: 'Aa' },
                        { id: 'modern', name: 'Modern', sample: 'Aa' },
                        { id: 'classic', name: 'Classic', sample: 'Aa' },
                      ].map((font) => (
                        <button
                          type="button"
                          key={font.id}
                          className={`creator-font-option creator-font-option--${font.id}${draft.fontStyle === font.id ? ' is-active' : ''}`}
                          onClick={() => updateDraft('fontStyle', font.id as InvitationFont)}
                          aria-pressed={draft.fontStyle === font.id}
                        >
                          <span>{font.sample}</span><strong>{font.name}</strong>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <p className="creator-cover-label">Ảnh bìa</p>
                <div className="creator-cover-grid">
                  {draft.cover.startsWith('data:image/') && (
                    <div className="creator-cover-uploaded">
                      <img src={draft.cover} alt="Ảnh bìa đã tải lên" />
                      <span>Ảnh của bạn · đang dùng</span>
                      <button type="button" onClick={() => updateDraft('cover', coverOptions[0].url)}>Dùng ảnh gợi ý</button>
                    </div>
                  )}
                  {coverOptions.map((cover) => (
                    <button
                      type="button"
                      key={cover.id}
                      className={draft.cover === cover.url ? 'is-active' : ''}
                      onClick={() => updateDraft('cover', cover.url)}
                      aria-pressed={draft.cover === cover.url}
                    >
                      <img src={cover.url} alt="" loading="lazy" />
                      <span>{cover.label}</span>
                      {draft.cover === cover.url && <Check aria-hidden="true" />}
                    </button>
                  ))}
                </div>

                <label className={`creator-image-upload${isUploadingImages ? ' is-disabled' : ''}`}>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={isUploadingImages}
                    onChange={(event) => {
                      const file = event.currentTarget.files?.[0];
                      event.currentTarget.value = '';
                      if (file) void uploadCoverPhoto(file);
                    }}
                  />
                  <span className="creator-image-upload__icon"><ImagePlus aria-hidden="true" /></span>
                  <span><strong>{isUploadingImages ? 'Đang xử lý ảnh...' : 'Tải ảnh bìa của bạn'}</strong><small>Ảnh sẽ thay thế hero và hiện ngay trong bản xem trước.</small></span>
                </label>

                <div className="creator-album-uploader">
                  <div className="creator-album-uploader__heading">
                    <div><strong>Ảnh album</strong><span>{draft.albumPhotos.length} ảnh · {Number.isFinite(getAlbumPhotoLimit(draft.packageTier)) ? `tối đa ${getAlbumPhotoLimit(draft.packageTier)}` : 'không giới hạn'} theo gói</span></div>
                    <label className={`creator-image-upload creator-image-upload--compact${isUploadingImages || draft.albumPhotos.length >= getAlbumPhotoLimit(draft.packageTier) ? ' is-disabled' : ''}`}>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        disabled={isUploadingImages || draft.albumPhotos.length >= getAlbumPhotoLimit(draft.packageTier)}
                        onChange={(event) => {
                          const files = Array.from(event.currentTarget.files ?? []);
                          event.currentTarget.value = '';
                          if (files.length) void uploadAlbumPhotos(files);
                        }}
                      />
                      <ImagePlus aria-hidden="true" /><span>Thêm ảnh</span>
                    </label>
                  </div>
                  {draft.albumPhotos.length ? (
                    <div className="creator-album-thumbnails">
                      {draft.albumPhotos.map((photo, index) => (
                        <div key={`${photo.slice(0, 48)}-${index}`}>
                          <img src={photo} alt={`Ảnh album ${index + 1}`} />
                          <button type="button" onClick={() => removeAlbumPhoto(index)} aria-label={`Xóa ảnh album ${index + 1}`}><X aria-hidden="true" /></button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="creator-album-empty">Tải ảnh cưới lên để xem chúng xuất hiện ngay trong album thiệp.</p>
                  )}
                  {imageUploadStatus && <p className="creator-image-upload-status" role="status" aria-live="polite">{imageUploadStatus}</p>}
                  <p className="creator-image-upload-status">Ảnh JPG, PNG hoặc WebP · tối đa 15 MB mỗi ảnh · tự nén tổng ảnh tối đa 720 KB cho link demo.</p>
                </div>
              </>
            )}

            {currentStep === 5 && (
              <div className="creator-guests-editor">
                <div className="creator-guests-editor__intro">
                  <span><UserPlus aria-hidden="true" /></span>
                  <div>
                    <strong>{draft.packageTier === '109k' ? 'Lời mời riêng theo từng khách' : 'Tạo link riêng có tên khách'}</strong>
                    <p>{draft.packageTier === '109k' ? 'Tính năng khách mời cá nhân hóa có trong gói Premium trở lên. Nội dung thiệp của bạn vẫn được giữ nguyên.' : 'Mỗi khách nhận một link riêng và thấy lời chào dành cho mình trên thiệp.'}</p>
                  </div>
                </div>

                {draft.packageTier !== '109k' && (
                  <>
                    <div className="creator-guest-add">
                      <label>
                        Tên khách mời
                        <input value={newGuestName} onChange={(event) => setNewGuestName(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addGuest(); } }} placeholder="Ví dụ: Gia đình cô Lan" maxLength={80} />
                      </label>
                      <label>
                        Cách xưng hô
                        <select value={newGuestGreeting} onChange={(event) => setNewGuestGreeting(event.target.value as InvitationGuest['greeting'])}>
                          <option value="friendly">Thân mời</option>
                          <option value="formal">Trân trọng kính mời</option>
                        </select>
                      </label>
                      <button type="button" onClick={addGuest} disabled={!newGuestName.trim()}><UserPlus aria-hidden="true" /> Thêm khách</button>
                    </div>

                    <div className="creator-rsvp-question-picker">
                      <div><strong>Câu hỏi RSVP thêm</strong><span>Khách có thể trả lời ngay trên thiệp.</span></div>
                      <label><input type="checkbox" checked={draft.rsvpQuestions.includes('transport')} onChange={() => toggleRsvpQuestion('transport')} /> Xe đưa đón</label>
                      <label><input type="checkbox" checked={draft.rsvpQuestions.includes('meal')} onChange={() => toggleRsvpQuestion('meal')} /> Chế độ ăn</label>
                    </div>

                    {draft.guests.length > 0 ? (
                      <ul className="creator-guest-list">
                        {draft.guests.map((guest) => (
                          <li key={guest.id}>
                            <span className="creator-guest-list__avatar">{guest.name.charAt(0).toLocaleUpperCase('vi')}</span>
                            <span className="creator-guest-list__name"><strong>{guest.name}</strong><small>{guest.greeting === 'formal' ? 'Trân trọng kính mời' : 'Thân mời'}</small></span>
                            <button type="button" onClick={() => void copyGuestLink(guest)} aria-label={`Chia sẻ link cho ${guest.name}`}><Share2 aria-hidden="true" /><span>Chia sẻ</span></button>
                            <button type="button" className="creator-guest-list__remove" onClick={() => updateDraft('guests', draft.guests.filter((item) => item.id !== guest.id))} aria-label={`Xóa ${guest.name}`}><Trash2 aria-hidden="true" /></button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="creator-guests-empty"><strong>Danh sách đang trống</strong><span>Thêm khách để tạo lời mời cá nhân hóa.</span></div>
                    )}
                    {guestLinkMessage && <p className="creator-guest-status" role="status">{guestLinkMessage}</p>}
                  </>
                )}

                {draft.packageTier === '109k' && (
                  <div className="creator-guests-locked">
                    <strong>Nâng lên Premium để mở quản lý khách</strong>
                    <span>{draft.guests.length ? `${draft.guests.length} khách đã nhập sẽ được giữ lại khi đổi lên Premium.` : 'Gói này vẫn có link thiệp chung và RSVP Có/Không cơ bản.'}</span>
                    <button type="button" onClick={() => updateDraft('packageTier', '159k')}>Xem tính năng Premium</button>
                  </div>
                )}

                <p className="creator-local-note">Bản demo lưu danh sách và phản hồi trong trình duyệt này. Link mời có tên khách không chứa cả danh sách khách.</p>
              </div>
            )}

            {currentStep === 6 && (
              <div className="creator-review">
                <img src={draft.cover} alt="" />
                <div className="creator-review__rows">
                  <div><span>Cô dâu &amp; chú rể</span><strong>{draft.brideName || 'Cô dâu'} &amp; {draft.groomName || 'Chú rể'}</strong><button type="button" onClick={() => setCurrentStep(0)} aria-label="Sửa tên đôi bạn"><Pencil aria-hidden="true" /></button></div>
                  <div><span>Ngày &amp; giờ</span><strong>{formatWeddingDate(draft.weddingDate)} · {draft.weddingTime || '18:00'}</strong><button type="button" onClick={() => setCurrentStep(1)} aria-label="Sửa ngày và giờ"><Pencil aria-hidden="true" /></button></div>
                  <div><span>Địa điểm</span><strong>{draft.venue || 'Chưa thêm địa điểm'}{draft.address ? ` · ${draft.address}` : ''}</strong><button type="button" onClick={() => setCurrentStep(2)} aria-label="Sửa địa điểm"><Pencil aria-hidden="true" /></button></div>
                  <div><span>Phong cách</span><strong>{themeOptions.find((theme) => theme.id === draft.theme)?.name}</strong><button type="button" onClick={() => setCurrentStep(4)} aria-label="Sửa phong cách"><Pencil aria-hidden="true" /></button></div>
                  <div><span>Ảnh thiệp</span><strong>{draft.cover.startsWith('data:image/') ? 'Ảnh bìa riêng' : 'Ảnh bìa gợi ý'} · {draft.albumPhotos.length ? `${draft.albumPhotos.length} ảnh album` : 'album gợi ý'}</strong><button type="button" onClick={() => setCurrentStep(4)} aria-label="Sửa ảnh bìa và album"><Pencil aria-hidden="true" /></button></div>
                  <div><span>Gói thiệp</span><strong>{getWeddingPackage(draft.packageTier).name} · {getWeddingPackage(draft.packageTier).price}</strong><button type="button" onClick={() => document.querySelector('.creator-package-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' })} aria-label="Sửa gói thiệp"><Pencil aria-hidden="true" /></button></div>
                  <div><span>Khách mời</span><strong>{draft.packageTier === '109k' ? 'Link chung' : `${draft.guests.length} lời mời riêng`}</strong><button type="button" onClick={() => setCurrentStep(5)} aria-label="Sửa danh sách khách"><Pencil aria-hidden="true" /></button></div>
                </div>
                <blockquote>“{draft.message || defaultDraft.message}”</blockquote>
              </div>
            )}
          </motion.fieldset>

          <div className="creator-step-actions">
            <button type="button" className="creator-step-back" onClick={() => { setErrors([]); setCurrentStep((step) => Math.max(0, step - 1)); }} disabled={currentStep === 0}>
              <ArrowLeft aria-hidden="true" /> Quay lại
            </button>
            <button type="submit" className="creator-generate">
              {currentStep === creationSteps.length - 1 ? <><Sparkles aria-hidden="true" /> Xem thiệp &amp; tạo link</> : <>Tiếp tục <ArrowRight aria-hidden="true" /></>}
            </button>
          </div>
          <p className="creator-privacy">Bản nháp được lưu trên thiết bị này. Link demo chứa nội dung thiệp để bạn gửi người thân xem thử.</p>
        </form>

        <aside className="creator-preview-panel" aria-label="Xem trước thiệp">
          <div className="creator-preview-panel__top">
            <span><i /> Xem trước trực tiếp</span>
            <small>{getWeddingPackage(draft.packageTier).name}</small>
          </div>
          <motion.div layout className="creator-phone">
            <InvitationPreview draft={draft} compact />
          </motion.div>
          <p>Mọi thay đổi được hiển thị ngay trên bản xem trước.</p>
        </aside>
      </div>
    </main>
  );
}

export function GeneratedInvitationPage() {
  const [copied, setCopied] = useState(false);
  const [rsvps, setRsvps] = useState<InvitationRsvp[]>([]);
  const query = useMemo(() => new URLSearchParams(window.location.search), []);
  const isManager = query.get('manage') === '1' && !query.has('guestId');
  const draft = useMemo(() => {
    const sharedDraft = decodeDraft(query.get('data'));
    if (isManager) {
      const savedDraft = readSavedDraft();
      return sharedDraft?.id === savedDraft.id ? savedDraft : sharedDraft ?? savedDraft;
    }
    return sharedDraft ?? readSavedDraft();
  }, [isManager, query]);
  const guest = useMemo<InvitationGuest | null>(() => {
    const guestName = query.get('guestName')?.trim().slice(0, 80);
    if (!guestName) return null;
    return {
      id: query.get('guestId') || createId('public-guest'),
      name: guestName,
      greeting: query.get('greeting') === 'formal' ? 'formal' : 'friendly',
    };
  }, [query]);
  const selectedPackage = getWeddingPackage(draft.packageTier);

  useEffect(() => {
    setRsvps(readInvitationRsvps(draft.id));
    const refresh = () => setRsvps(readInvitationRsvps(draft.id));
    window.addEventListener('mp-wedding-demo-rsvp-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('mp-wedding-demo-rsvp-updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [draft.id]);

  useEffect(() => {
    document.title = `${draft.brideName || 'Cô dâu'} & ${draft.groomName || 'Chú rể'} | Demo thiệp cưới`;
  }, [draft.brideName, draft.groomName]);

  const copyLink = async () => {
    const link = invitationUrl(draft);
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt('Sao chép link thiệp chung:', link);
    }
  };

  return (
    <main className={`invitation-preview-page invitation-preview-page--${draft.theme}`}>
      <header className="preview-toolbar">
        {isManager
          ? <button type="button" onClick={() => navigateTo('/tao-thiep')}><ArrowLeft aria-hidden="true" /> Chỉnh sửa</button>
          : <span className="preview-toolbar__recipient">{guest ? `Thiệp gửi riêng cho ${guest.name}` : 'Lời mời cưới online'}</span>}
        <span><Sparkles aria-hidden="true" /> {selectedPackage.name} · {selectedPackage.price}</span>
        <button type="button" onClick={copyLink}>
          <Clipboard aria-hidden="true" /> {copied ? 'Đã sao chép' : 'Sao chép link chung'}
        </button>
      </header>

      <section className={`preview-stage${isManager ? ' preview-stage--manage' : ''}`}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="preview-stage__invitation"
        >
          <InvitationPreview
            draft={draft}
            guest={guest}
            existingRsvp={guest ? rsvps.find((response) => response.guestId === guest.id) : undefined}
            onRsvpSaved={() => setRsvps(readInvitationRsvps(draft.id))}
          />
        </motion.div>

        {isManager && draft.packageTier !== '109k' ? (
          <InvitationGuestDashboard draft={draft} rsvps={rsvps} />
        ) : <aside className="preview-publish-card">
          <span><WandSparkles aria-hidden="true" /></span>
          <p>Bản xem trước · {selectedPackage.name}</p>
          <h1>Biến thiết kế này thành website cưới hoàn chỉnh</h1>
          <p className="preview-publish-card__summary">Bản demo đang bật các tính năng theo gói {selectedPackage.name} ({selectedPackage.price}):</p>
          <ul>{selectedPackage.features.map((feature) => <li key={feature}><Check aria-hidden="true" /> {feature}</li>)}</ul>
          <button type="button" onClick={() => navigateTo('/yeu-cau-thiep')}>
            Điền form để xuất bản <ExternalLink aria-hidden="true" />
          </button>
          <small>RSVP, guestbook và QR trong bản này là tương tác minh họa. Đính kèm link demo trong form để đội ngũ giữ đúng phong cách bạn đã chọn.</small>
        </aside>}
      </section>
    </main>
  );
}
