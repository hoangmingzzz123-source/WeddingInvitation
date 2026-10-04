import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clipboard,
  Clock3,
  ExternalLink,
  Heart,
  MapPin,
  Palette,
  Save,
  Sparkles,
  WandSparkles,
} from 'lucide-react';
import { navigateTo } from '../Router';

const REQUEST_FORM_URL = 'https://forms.gle/2qBNf4tHBiq6vavZ6';
const STORAGE_KEY = 'mp-wedding-demo-draft-v1';

type InvitationTheme = 'champagne' | 'blush' | 'emerald';

interface InvitationDraft {
  brideName: string;
  groomName: string;
  weddingDate: string;
  weddingTime: string;
  venue: string;
  address: string;
  message: string;
  theme: InvitationTheme;
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
  brideName: '',
  groomName: '',
  weddingDate: '',
  weddingTime: '18:00',
  venue: '',
  address: '',
  message: 'Trân trọng mời bạn đến chung vui trong ngày hạnh phúc của chúng mình.',
  theme: 'champagne',
  cover: coverOptions[0].url,
};

function isInvitationTheme(value: unknown): value is InvitationTheme {
  return value === 'champagne' || value === 'blush' || value === 'emerald';
}

function normalizeDraft(value: Partial<InvitationDraft> | null | undefined): InvitationDraft {
  return {
    ...defaultDraft,
    ...value,
    theme: isInvitationTheme(value?.theme) ? value.theme : defaultDraft.theme,
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
  return (
    <article className={`generated-invitation generated-invitation--${draft.theme}${compact ? ' is-compact' : ''}`}>
      <div className="generated-invitation__cover" style={{ backgroundImage: `url("${draft.cover}")` }}>
        <div className="generated-invitation__overlay" />
        <div className="generated-invitation__cover-content">
          <span className="generated-invitation__monogram" aria-hidden="true">
            {(draft.brideName || 'C').charAt(0)}
            <Heart />
            {(draft.groomName || 'R').charAt(0)}
          </span>
          <p>Wedding invitation</p>
          <h2>
            <span>{draft.brideName || 'Cô dâu'}</span>
            <i>&amp;</i>
            <span>{draft.groomName || 'Chú rể'}</span>
          </h2>
          <time>{formatWeddingDate(draft.weddingDate)}</time>
        </div>
      </div>

      <div className="generated-invitation__body">
        <p className="generated-invitation__quote">“{draft.message || defaultDraft.message}”</p>
        <div className="generated-invitation__details">
          <div>
            <Clock3 aria-hidden="true" />
            <span><small>Thời gian</small>{draft.weddingTime || '18:00'}</span>
          </div>
          <div>
            <MapPin aria-hidden="true" />
            <span><small>Địa điểm</small>{draft.venue || 'Địa điểm tổ chức'}</span>
          </div>
        </div>
        {draft.address && <p className="generated-invitation__address">{draft.address}</p>}
        <span className="generated-invitation__divider" aria-hidden="true">✦</span>
        <p className="generated-invitation__thanks">Sự hiện diện của bạn là niềm vui của chúng mình</p>
      </div>
    </article>
  );
}

export function InvitationCreatorPage() {
  const [draft, setDraft] = useState<InvitationDraft>(readSavedDraft);
  const [errors, setErrors] = useState<string[]>([]);
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

  const completedFields = useMemo(() => (
    [draft.brideName, draft.groomName, draft.weddingDate, draft.venue].filter(Boolean).length
  ), [draft]);

  const updateDraft = <Key extends keyof InvitationDraft>(key: Key, value: InvitationDraft[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    if (errors.length) setErrors([]);
  };

  const generateDemo = () => {
    const missingFields: string[] = [];
    if (!draft.brideName.trim()) missingFields.push('Tên cô dâu');
    if (!draft.groomName.trim()) missingFields.push('Tên chú rể');
    if (!draft.weddingDate) missingFields.push('Ngày cưới');
    if (!draft.venue.trim()) missingFields.push('Địa điểm');

    if (missingFields.length) {
      setErrors(missingFields);
      document.querySelector('.creator-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    saveDraft(draft);
    navigateTo(`/tao-thiep/preview?data=${encodeDraft(draft)}`);
  };

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
          <h1>Tự tay tạo một lời mời mang dấu ấn của hai bạn</h1>
          <span>Nhập thông tin bên trái và xem thiệp thay đổi tức thì. Không cần đăng nhập hay kỹ năng thiết kế.</span>
        </div>
        <div className="creator-progress" aria-label={`${completedFields} trên 4 thông tin chính đã hoàn thành`}>
          <strong>{completedFields}/4</strong>
          <span>thông tin chính</span>
          <div><i style={{ width: `${completedFields * 25}%` }} /></div>
        </div>
      </section>

      <div className="creator-workspace">
        <form className="creator-form" onSubmit={(event) => { event.preventDefault(); generateDemo(); }}>
          {errors.length > 0 && (
            <div className="creator-errors" role="alert">
              <strong>Vui lòng bổ sung:</strong> {errors.join(', ')}.
            </div>
          )}

          <fieldset>
            <legend><span>01</span> Thông tin đôi bạn</legend>
            <div className="creator-fields creator-fields--two">
              <label>
                Tên cô dâu <b>*</b>
                <input value={draft.brideName} onChange={(event) => updateDraft('brideName', event.target.value)} placeholder="Ví dụ: Hà Phương" />
              </label>
              <label>
                Tên chú rể <b>*</b>
                <input value={draft.groomName} onChange={(event) => updateDraft('groomName', event.target.value)} placeholder="Ví dụ: Hoàng Minh" />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend><span>02</span> Thời gian &amp; địa điểm</legend>
            <div className="creator-fields creator-fields--two">
              <label>
                <CalendarDays aria-hidden="true" /> Ngày cưới <b>*</b>
                <input type="date" value={draft.weddingDate} onChange={(event) => updateDraft('weddingDate', event.target.value)} />
              </label>
              <label>
                <Clock3 aria-hidden="true" /> Giờ đón khách
                <input type="time" value={draft.weddingTime} onChange={(event) => updateDraft('weddingTime', event.target.value)} />
              </label>
              <label className="creator-field--wide">
                Tên địa điểm <b>*</b>
                <input value={draft.venue} onChange={(event) => updateDraft('venue', event.target.value)} placeholder="Ví dụ: Riverside Palace" />
              </label>
              <label className="creator-field--wide">
                Địa chỉ
                <input value={draft.address} onChange={(event) => updateDraft('address', event.target.value)} placeholder="Địa chỉ chi tiết của buổi tiệc" />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend><span>03</span> Lời mời</legend>
            <label>
              Thông điệp gửi khách mời
              <textarea rows={4} maxLength={180} value={draft.message} onChange={(event) => updateDraft('message', event.target.value)} />
              <small>{draft.message.length}/180 ký tự</small>
            </label>
          </fieldset>

          <fieldset>
            <legend><span>04</span> Phong cách</legend>
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

            <p className="creator-cover-label">Chọn ảnh cover</p>
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
          </fieldset>

          <button type="submit" className="creator-generate">
            <Sparkles aria-hidden="true" />
            Tạo demo &amp; lấy liên kết
          </button>
          <p className="creator-privacy">Thông tin chỉ được lưu trên thiết bị và nằm trong link khi bạn chủ động chia sẻ.</p>
        </form>

        <aside className="creator-preview-panel" aria-label="Xem trước thiệp">
          <div className="creator-preview-panel__top">
            <span><i /> Xem trước trực tiếp</span>
            <small>Mobile</small>
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
        <span><Sparkles aria-hidden="true" /> Demo online của bạn</span>
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
          <p>Ưng ý với bản demo?</p>
          <h1>Biến thiết kế này thành website cưới hoàn chỉnh</h1>
          <ul>
            <li><Check aria-hidden="true" /> Album ảnh &amp; câu chuyện tình yêu</li>
            <li><Check aria-hidden="true" /> RSVP, bản đồ và QR mừng cưới</li>
            <li><Check aria-hidden="true" /> Tên miền và hỗ trợ cá nhân hóa</li>
          </ul>
          <button type="button" onClick={() => window.open(REQUEST_FORM_URL, '_blank', 'noopener,noreferrer')}>
            Điền form để xuất bản <ExternalLink aria-hidden="true" />
          </button>
          <small>Đính kèm link demo này trong form để đội ngũ giữ đúng phong cách bạn đã chọn.</small>
        </aside>
      </section>
    </main>
  );
}

