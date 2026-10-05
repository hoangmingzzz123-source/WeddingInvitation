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
  ExternalLink,
  Heart,
  MapPin,
  MessageCircleHeart,
  Play,
  Palette,
  Pencil,
  QrCode,
  Save,
  Sparkles,
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

const REQUEST_FORM_URL = 'https://forms.gle/2qBNf4tHBiq6vavZ6';
const STORAGE_KEY = 'mp-wedding-demo-draft-v1';

type InvitationTheme = 'champagne' | 'blush' | 'emerald';
type InvitationFont = 'editorial' | 'modern' | 'classic';

interface InvitationDraft {
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

const themeOptions: Array<{ id: InvitationTheme; name: string; description: string }> = [
  { id: 'champagne', name: 'Champagne', description: 'Ấm áp · Sang trọng' },
  { id: 'blush', name: 'Blush Rose', description: 'Nhẹ nhàng · Lãng mạn' },
  { id: 'emerald', name: 'Emerald', description: 'Hiện đại · Tinh tế' },
];

const defaultDraft: InvitationDraft = {
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
};

const creationSteps = [
  { title: 'Đôi bạn', heading: 'Ai là nhân vật chính?', hint: 'Bắt đầu bằng tên hai bạn để thiệp mang dấu ấn riêng.' },
  { title: 'Thời gian', heading: 'Chọn ngày vui', hint: 'Thêm ngày và giờ để khách mời dễ sắp xếp.' },
  { title: 'Địa điểm', heading: 'Hẹn nhau ở đâu?', hint: 'Cho khách biết tên sảnh tiệc và cách tìm đến nơi.' },
  { title: 'Lời mời', heading: 'Gửi một lời thật riêng', hint: 'Viết lời nhắn theo cách của hai bạn, hoặc chọn một gợi ý có sẵn.' },
  { title: 'Phong cách', heading: 'Chọn không khí cho tấm thiệp', hint: 'Thử bảng màu và ảnh bìa, bản xem trước sẽ đổi ngay.' },
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

function normalizeDraft(value: Partial<InvitationDraft> | null | undefined): InvitationDraft {
  return {
    ...defaultDraft,
    ...value,
    packageTier: isTemplateTier(value?.packageTier) ? value.packageTier : defaultDraft.packageTier,
    theme: isInvitationTheme(value?.theme) ? value.theme : defaultDraft.theme,
    fontStyle: isInvitationFont(value?.fontStyle) ? value.fontStyle : defaultDraft.fontStyle,
    cover: coverOptions.some((cover) => cover.url === value?.cover) ? value!.cover! : defaultDraft.cover,
  };
}

function encodeDraft(draft: InvitationDraft) {
  const bytes = new TextEncoder().encode(JSON.stringify(draft));
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
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
    return savedDraft ? normalizeDraft(JSON.parse(savedDraft) as Partial<InvitationDraft>) : defaultDraft;
  } catch {
    return defaultDraft;
  }
}

function saveDraft(draft: InvitationDraft) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // The live demo still works when storage is unavailable.
  }
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

function InvitationPreview({ draft, compact = false }: { draft: InvitationDraft; compact?: boolean }) {
  const [rsvpSent, setRsvpSent] = useState(false);
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
  const appliedFontStyle = isPremium ? draft.fontStyle : 'editorial';
  const gallery = coverOptions.map((cover) => cover.url);
  const destination = [draft.venue, draft.address].filter(Boolean).join(', ');
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;

  useEffect(() => () => {
    if (customTrack) URL.revokeObjectURL(customTrack);
  }, [customTrack]);

  const submitRsvp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
      url: window.location.href,
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
            {gallery.map((src, index) => (
              <button key={src} type="button" onClick={() => setActivePhoto(index)} aria-label={`Xem ảnh ${index + 1}`}>
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
            {gallery.slice(0, 3).map((src, index) => (
              <button key={src} type="button" onClick={() => setActivePhoto(index)} aria-label={`Xem ảnh ${index + 1}`}>
                <img src={src} alt={`Ảnh cưới ${index + 1}`} loading="lazy" />
              </button>
            ))}
          </div>
          <span className="generated-invitation__gallery-limit">Album cơ bản · tối đa 10 ảnh</span>
        </section>
      )}

      {isDiamond && (
        <section className="generated-invitation__diamond" aria-label="Tính năng gói Diamond">
          <div className="generated-invitation__video-card" style={{ backgroundImage: `linear-gradient(0deg, rgba(20,18,23,.72), rgba(20,18,23,.08)), url("${gallery[1]}")` }}>
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
            <label>Tên của bạn<input name="name" required placeholder="Họ và tên" autoComplete="name" /></label>
            <label>{isPremium ? 'Xác nhận tham dự' : 'Bạn có thể đến chung vui không?'}<select name="attending" defaultValue="yes"><option value="yes">Có, mình sẽ đến</option><option value="no">Rất tiếc, mình bận</option></select></label>
            {isPremium && <label>Email<input type="email" name="email" placeholder="email@example.com" autoComplete="email" /></label>}
            {isPremium && <label>Số khách<select name="guests" defaultValue="1"><option value="1">1 khách</option><option value="2">2 khách</option><option value="3">3 khách</option></select></label>}
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

export function InvitationCreatorPage() {
  const [draft, setDraft] = useState<InvitationDraft>(readSavedDraft);
  const [errors, setErrors] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [saveStatus, setSaveStatus] = useState('Bản nháp được lưu tự động');

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
    navigateTo(`/tao-thiep/preview?data=${encodeDraft(draft)}`);
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
          <span>Đi qua 6 bước ngắn, xem thiết kế thành hình ngay bên cạnh và tạo link demo để gửi người thân xem thử.</span>
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
              </>
            )}

            {currentStep === 5 && (
              <div className="creator-review">
                <img src={draft.cover} alt="" />
                <div className="creator-review__rows">
                  <div><span>Cô dâu &amp; chú rể</span><strong>{draft.brideName || 'Cô dâu'} &amp; {draft.groomName || 'Chú rể'}</strong><button type="button" onClick={() => setCurrentStep(0)} aria-label="Sửa tên đôi bạn"><Pencil aria-hidden="true" /></button></div>
                  <div><span>Ngày &amp; giờ</span><strong>{formatWeddingDate(draft.weddingDate)} · {draft.weddingTime || '18:00'}</strong><button type="button" onClick={() => setCurrentStep(1)} aria-label="Sửa ngày và giờ"><Pencil aria-hidden="true" /></button></div>
                  <div><span>Địa điểm</span><strong>{draft.venue || 'Chưa thêm địa điểm'}{draft.address ? ` · ${draft.address}` : ''}</strong><button type="button" onClick={() => setCurrentStep(2)} aria-label="Sửa địa điểm"><Pencil aria-hidden="true" /></button></div>
                  <div><span>Phong cách</span><strong>{themeOptions.find((theme) => theme.id === draft.theme)?.name}</strong><button type="button" onClick={() => setCurrentStep(4)} aria-label="Sửa phong cách"><Pencil aria-hidden="true" /></button></div>
                  <div><span>Gói thiệp</span><strong>{getWeddingPackage(draft.packageTier).name} · {getWeddingPackage(draft.packageTier).price}</strong><button type="button" onClick={() => document.querySelector('.creator-package-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' })} aria-label="Sửa gói thiệp"><Pencil aria-hidden="true" /></button></div>
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
  const draft = useMemo(() => {
    const sharedDraft = decodeDraft(new URLSearchParams(window.location.search).get('data'));
    return sharedDraft ?? readSavedDraft();
  }, []);
  const selectedPackage = getWeddingPackage(draft.packageTier);

  useEffect(() => {
    document.title = `${draft.brideName || 'Cô dâu'} & ${draft.groomName || 'Chú rể'} | Demo thiệp cưới`;
  }, [draft.brideName, draft.groomName]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt('Sao chép đường link demo:', window.location.href);
    }
  };

  return (
    <main className={`invitation-preview-page invitation-preview-page--${draft.theme}`}>
      <header className="preview-toolbar">
        <button type="button" onClick={() => navigateTo('/tao-thiep')}>
          <ArrowLeft aria-hidden="true" /> Chỉnh sửa
        </button>
        <span><Sparkles aria-hidden="true" /> {selectedPackage.name} · {selectedPackage.price}</span>
        <button type="button" onClick={copyLink}>
          <Clipboard aria-hidden="true" /> {copied ? 'Đã sao chép' : 'Sao chép link'}
        </button>
      </header>

      <section className="preview-stage">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="preview-stage__invitation"
        >
          <InvitationPreview draft={draft} />
        </motion.div>

        <aside className="preview-publish-card">
          <span><WandSparkles aria-hidden="true" /></span>
          <p>Bản xem trước · {selectedPackage.name}</p>
          <h1>Biến thiết kế này thành website cưới hoàn chỉnh</h1>
          <p className="preview-publish-card__summary">Bản demo đang bật các tính năng theo gói {selectedPackage.name} ({selectedPackage.price}):</p>
          <ul>{selectedPackage.features.map((feature) => <li key={feature}><Check aria-hidden="true" /> {feature}</li>)}</ul>
          <button type="button" onClick={() => window.open(REQUEST_FORM_URL, '_blank', 'noopener,noreferrer')}>
            Điền form để xuất bản <ExternalLink aria-hidden="true" />
          </button>
          <small>RSVP, guestbook và QR trong bản này là tương tác minh họa. Đính kèm link demo trong form để đội ngũ giữ đúng phong cách bạn đã chọn.</small>
        </aside>
      </section>
    </main>
  );
}
