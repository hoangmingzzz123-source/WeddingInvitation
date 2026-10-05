import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clipboard,
  Clock3,
  ExternalLink,
  Heart,
  MapPin,
  Palette,
  Pencil,
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
