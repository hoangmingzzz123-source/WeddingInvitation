import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Archive,
  ArrowLeft,
  ArrowRight,
  Check,
  Clipboard,
  Download,
  ExternalLink,
  FileArchive,
  LayoutDashboard,
  Link2,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Mail,
  MessageCircleHeart,
  Plus,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  UserRound,
  Users,
  WandSparkles,
} from 'lucide-react';
import { navigateTo } from '../../Router';
import { weddingTemplates } from '../../data/templates';
import { weddingPackages } from '../../data/packages';
import { isSupportedWeddingMusicUrl, weddingMusicTracks, weddingMusicUrlForTrack } from '../../data/weddingMusic';
import {
  clearAdminSession,
  createCustomer,
  createDemo,
  getAdminProfile,
  isSupabaseConfigured,
  listCustomers,
  listDemos,
  listPublishedInvitations,
  readAdminSession,
  readAuthCallbackSession,
  refreshAdminSession,
  setAdminPassword,
  signInAdmin,
  updateCustomer,
  updateDemo,
} from '../../lib/supabaseRest';
import {
  customerStatusLabels,
  emptyInvitationPayload,
  type AdminProfile,
  type AdminSession,
  type CustomerRecord,
  type CustomerStatus,
  type CustomInvitationTemplate,
  type DemoPhoto,
  type InvitationDemoRecord,
  type InvitationHiddenSection,
  type InvitationStudioConfig,
  type PublishedInvitationRecord,
} from '../../types/admin';
import type { AuthCallbackSession } from '../../lib/supabaseRest';
import { mediaRequest, uploadCustomTemplate, uploadEditedInvitationZip } from '../../lib/customerPhotoUpload';
import { CustomTemplateRenderer } from '../CustomTemplateRenderer';
import { SignatureDemo, type SignatureDemoCustomization } from '../demos/SignatureDemos';
import { CustomerPhotoLibrary } from './CustomerPhotoLibrary';

const customerStatuses = Object.keys(customerStatusLabels) as CustomerStatus[];
const publicInvitationDomain = (import.meta.env.VITE_PUBLIC_INVITATION_DOMAIN ?? '').trim().toLowerCase().replace(/^\.+|\.+$/g, '');

function publicInvitationUrl(slug: string) {
  return publicInvitationDomain
    ? `https://${slug}.${publicInvitationDomain}`
    : `${window.location.origin}/invite/${slug}`;
}

function shareLinkCacheKey(type: 'rsvp' | 'wishes', demoId: string) {
  return `mp-admin-share-link:${type}:${demoId}`;
}

type CustomerEditor = Omit<CustomerRecord, 'id' | 'createdAt' | 'updatedAt' | 'confirmedAt' | 'exportedAt'>;

const emptyCustomer: CustomerEditor = {
  ...emptyInvitationPayload,
  fullName: '',
  email: '',
  phone: '',
  status: 'new',
  source: 'admin',
  notes: '',
  selectedTemplateId: '',
};

function customerToEditor(customer: CustomerRecord): CustomerEditor {
  return {
    fullName: customer.fullName,
    brideName: customer.brideName,
    groomName: customer.groomName,
    email: customer.email,
    phone: customer.phone,
    status: customer.status,
    source: customer.source,
    notes: customer.notes,
    weddingDate: customer.weddingDate,
    weddingTime: customer.weddingTime,
    venue: customer.venue,
    address: customer.address,
    message: customer.message,
    selectedTemplateId: customer.selectedTemplateId,
    coverUrl: customer.coverUrl,
  };
}

function formatDate(value: string) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(new Date(value));
}

function dateDots(value: string) {
  return value ? value.split('-').reverse().join(' · ') : '';
}

function photoPosition(photo?: DemoPhoto) {
  const percent = (value?: number) => `${Math.round(Math.max(0, Math.min(1, value ?? 0.5)) * 100)}%`;
  return `${percent(photo?.focalX)} ${percent(photo?.focalY)}`;
}

const defaultStudioConfig: InvitationStudioConfig = {
  packageTier: '109k',
  city: 'Việt Nam',
  headerMonogramText: '',
  ceremonyTime: '',
  receptionTime: '',
  ceremonyTitle: 'Lễ thành hôn',
  receptionTitle: 'Tiệc mừng thân mật',
  brideCeremonyTitle: 'Lễ Vu Quy',
  brideReceptionTitle: 'Đón khách nhà gái',
  brideCeremonyTime: '',
  brideReceptionTime: '',
  brideHeroKicker: 'Lễ Vu Quy',
  brideAddress: '',
  brideReceptionAddress: '',
  groomCeremonyTitle: 'Lễ Thành Hôn',
  groomReceptionTitle: 'Tiệc mừng thân mật',
  groomCeremonyTime: '',
  groomReceptionTime: '',
  groomHeroKicker: 'Lễ Thành Hôn',
  groomAddress: '',
  groomReceptionAddress: '',
  heroKicker: 'Wedding invitation',
  albumTitle: 'Album kỷ niệm',
  timeLabel: 'Thời gian',
  venueLabel: 'Địa điểm',
  brideVenue: '',
  groomVenue: '',
  signatureText: 'Sự hiện diện của bạn là niềm vui của chúng mình',
  theme: 'template',
  fontStyle: 'editorial',
  musicTrack: 'default',
  customMusicUrl: '',
  videoLink: '',
  guests: [],
  rsvpQuestions: [],
};

function musicUrlForStudio(config: InvitationStudioConfig) {
  if (config.packageTier === '109k') return undefined;
  return weddingMusicUrlForTrack(config.musicTrack, config.customMusicUrl);
}

function AdminStudioEditor({
  customer,
  config,
  onConfigChange,
  onCustomerChange,
  onSave,
  saving,
  customTemplates,
  onTemplateUpload,
  templateUploading,
  mediaLibrary,
  mediaCount,
  preview,
  previewLabel,
}: {
  customer: CustomerEditor;
  config: InvitationStudioConfig;
  onConfigChange: (config: InvitationStudioConfig) => void;
  onCustomerChange: (key: 'brideName' | 'groomName' | 'weddingDate' | 'weddingTime' | 'venue' | 'address' | 'message' | 'selectedTemplateId', value: string) => void;
  onSave: () => void;
  saving: boolean;
  customTemplates: CustomInvitationTemplate[];
  onTemplateUpload: (file: File) => void;
  templateUploading: boolean;
  mediaLibrary: ReactNode;
  mediaCount: number;
  preview: ReactNode;
  previewLabel: string;
}) {
  const [step, setStep] = useState(0);
  const [guestName, setGuestName] = useState('');
  const [templateError, setTemplateError] = useState('');
  const studioSteps = [
    'Chọn mẫu', 'Chọn gói', 'Đôi bạn', 'Thời gian', 'Địa điểm', 'Nội dung', 'Ảnh & album',
    config.packageTier === '109k' ? 'RSVP cơ bản' : 'Khách mời & RSVP', 'Phong cách', 'Nhạc nền', 'Xem lại',
  ];
  const studioStepDetails = [
    ['Chọn mẫu thiệp', 'Chọn thiết kế trước; mẫu sẽ đề xuất gói phù hợp để bạn bắt đầu.'],
    ['Chọn gói thiệp', 'Xem đầy đủ quyền lợi và các phần sẽ xuất hiện theo gói.'],
    ['Ai là nhân vật chính?', 'Điền tên hai bạn để cá nhân hóa lời mời.'],
    ['Chọn ngày vui', 'Xác nhận ngày và giờ đón khách trên thiệp.'],
    ['Hẹn nhau ở đâu?', 'Thiết lập địa chỉ riêng nhà trai và nhà gái; link ?side=groom hoặc ?side=bride sẽ mở bản đồ đúng địa chỉ.'],
    ['Gửi một lời thật riêng', 'Viết lời mời hoặc câu chuyện; các phần hiển thị được dựng theo mẫu và gói.'],
    ['Chọn ảnh cho thiệp', 'Chọn ảnh bìa, album, thứ tự và vị trí ảnh trong thư viện khách.'],
    [config.packageTier === '109k' ? 'Hồi đáp tham dự' : 'Cá nhân hóa khách mời', config.packageTier === '109k'
      ? 'Gói Cơ bản có RSVP Có / Không và không bật câu hỏi nâng cao.'
      : 'Thêm khách để tạo lời mời riêng và chọn thông tin cần hỏi trong RSVP.'],
    ['Hoàn thiện phong cách', 'Tùy chỉnh bảng màu và kiểu chữ theo quyền lợi của gói.'],
    ['Chọn nhạc nền', config.packageTier === '109k' ? 'Gói Basic sử dụng nhạc nền mặc định.' : 'Chọn nhạc mẫu có sẵn hoặc thêm link YouTube / MP3 riêng.'],
    ['Rà soát cấu hình', 'Kiểm tra nội dung, ảnh, các phần theo mẫu và quyền lợi gói trước khi lưu.'],
  ] as const;
  const selectedTemplate = weddingTemplates.find((template) => template.id === customer.selectedTemplateId);
  const selectedTemplateName = selectedTemplate?.name
    ?? customTemplates.find((template) => template.id === customer.selectedTemplateId)?.name
    ?? 'Chưa chọn mẫu';
  const selectedPackage = weddingPackages.find((item) => item.id === config.packageTier) ?? weddingPackages[0];
  const updateConfig = <Key extends keyof InvitationStudioConfig>(key: Key, value: InvitationStudioConfig[Key]) => {
    onConfigChange({ ...config, [key]: value });
  };
  const sectionOptions: Array<{ id: InvitationHiddenSection; label: string; available: boolean }> = [
    { id: 'story', label: 'Câu chuyện', available: config.packageTier !== '109k' },
    { id: 'events', label: 'Lịch trình', available: true },
    { id: 'timeline', label: 'Timeline đặc biệt', available: customer.selectedTemplateId === 'tui-minh-cuoi-roi' },
    { id: 'album', label: 'Album ảnh', available: true },
    { id: 'video', label: 'Video', available: config.packageTier === '199k' },
    { id: 'qr', label: 'QR mừng cưới', available: config.packageTier === '199k' },
    { id: 'guestbook', label: 'Sổ lưu bút', available: config.packageTier === '199k' },
    { id: 'venue', label: 'Địa điểm & bản đồ', available: true },
    { id: 'rsvp', label: 'RSVP', available: true },
  ];
  const addGuest = () => {
    const name = guestName.trim();
    if (!name) return;
    updateConfig('guests', [...config.guests, {
      id: crypto.randomUUID(), name, greeting: 'friendly',
    }]);
    setGuestName('');
  };

  return (
    <section className="admin-studio-editor" aria-label="Trình chỉnh sửa Studio">
      <header className="admin-studio-editor__heading">
        <div><p>Studio theo hồ sơ khách</p><h3>{customer.brideName || 'Cô dâu'} &amp; {customer.groomName || 'Chú rể'}</h3></div>
        <div className="admin-studio-editor__progress-copy"><strong>{String(step + 1).padStart(2, '0')}</strong><span>/ {String(studioSteps.length).padStart(2, '0')} bước</span></div>
      </header>
      <div className="admin-studio-editor__progress" role="progressbar" aria-label="Tiến độ chỉnh sửa" aria-valuemin={1} aria-valuemax={studioSteps.length} aria-valuenow={step + 1}>
        <i style={{ width: `${((step + 1) / studioSteps.length) * 100}%` }} />
      </div>
      <nav className="admin-studio-editor__steps" aria-label="Các bước Studio">
        {studioSteps.map((label, index) => <button type="button" key={label} className={`${index === step ? 'is-current' : ''}${index < step ? ' is-complete' : ''}`}
          aria-current={index === step ? 'step' : undefined} onClick={() => setStep(index)}><i>{String(index + 1).padStart(2, '0')}</i><span>{label}</span></button>)}
      </nav>
      <div className="admin-studio-editor__workspace">
       <div className="admin-studio-editor__body">
        <div className="admin-studio-editor__step-intro">
          <span>BƯỚC {String(step + 1).padStart(2, '0')}</span>
          <h4>{studioStepDetails[step][0]}</h4>
          <p>{studioStepDetails[step][1]}</p>
        </div>
        {step === 0 && <div className="admin-form-grid">
          <label className="is-wide">Mẫu thiệp<select value={customer.selectedTemplateId} onChange={(event) => {
            const templateId = event.target.value;
            onCustomerChange('selectedTemplateId', templateId);
            const suggestedTier = weddingTemplates.find((template) => template.id === templateId)?.tier;
            if (suggestedTier) updateConfig('packageTier', suggestedTier);
          }}>
            <option value="">Chọn mẫu</option>{weddingTemplates.filter((item) => item.route).map((template) => <option key={template.id} value={template.id}>{template.name}</option>)}
            {customTemplates.map((template) => <option key={template.id} value={template.id}>Mẫu riêng · {template.name}</option>)}
          </select></label>
          {selectedTemplate && <p className="admin-studio-editor__hint is-wide">Mẫu này đề xuất gói {selectedTemplate.tier}. Bạn có thể chọn gói khác ở bước kế tiếp.</p>}
          <div className="admin-custom-template-upload is-wide">
            <label htmlFor="admin-custom-template-zip">Tải gói mẫu ZIP (tối đa 4 MiB)</label>
            <input id="admin-custom-template-zip" type="file" accept=".zip,application/zip" disabled={templateUploading}
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = '';
                if (!file) return;
                if (file.size > 4 * 1024 * 1024) { setTemplateError('ZIP mẫu cần nhỏ hơn 4 MiB.'); return; }
                setTemplateError('');
                onTemplateUpload(file);
              }} />
            <small>Cần manifest.json và index.html; có thể kèm styles.css, script.js và assets/. Dùng placeholder như {'{{brideName}}'}, {'{{packageTier}}'}, {'{{coverUrl}}'}, {'{{gallery1Url}}'}. <a href="/custom-template-starter/README.md" target="_blank" rel="noreferrer">Hướng dẫn &amp; mẫu starter</a></small>
            {templateUploading && <small role="status">Đang kiểm tra và tải gói mẫu...</small>}
            {templateError && <small role="alert">{templateError}</small>}
          </div>
        </div>}
        {step === 1 && <div className="admin-studio-package-selection">
          <fieldset className="admin-studio-packages"><legend>Chọn gói</legend>{weddingPackages.map((item) => <label key={item.id}>
            <input type="radio" name="admin-studio-package" checked={config.packageTier === item.id} onChange={() => updateConfig('packageTier', item.id)} />
            <span><b>{item.name}</b><small>{item.price}</small></span>
          </label>)}</fieldset>
          <section className="admin-studio-package-summary" aria-live="polite">
            <div><h5>{selectedPackage.name}</h5><strong>{selectedPackage.price}</strong></div>
            <p>{selectedPackage.summary}</p>
            <ul>{selectedPackage.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
          </section>
        </div>}
        {step === 2 && <div className="admin-form-grid">
          <label>Tên cô dâu<input value={customer.brideName} onChange={(event) => onCustomerChange('brideName', event.target.value)} /></label>
          <label>Tên chú rể<input value={customer.groomName} onChange={(event) => onCustomerChange('groomName', event.target.value)} /></label>
        </div>}
        {step === 3 && <div className="admin-form-grid">
          <label>Ngày cưới<input type="date" value={customer.weddingDate} onChange={(event) => onCustomerChange('weddingDate', event.target.value)} /></label>
          <label>Giờ làm lễ<input type="time" value={config.ceremonyTime} onChange={(event) => updateConfig('ceremonyTime', event.target.value)} /></label>
          <label>Giờ đón khách<input type="time" value={config.receptionTime} onChange={(event) => updateConfig('receptionTime', event.target.value)} /></label>
        </div>}
        {step === 4 && <div className="admin-form-grid">
          <label className="is-wide">Địa điểm<input value={customer.venue} onChange={(event) => onCustomerChange('venue', event.target.value)} /></label>
          <label className="is-wide">Địa chỉ chung<input value={customer.address} onChange={(event) => onCustomerChange('address', event.target.value)} /><small>Dùng làm địa chỉ dự phòng nếu chưa nhập địa chỉ riêng cho từng bên.</small></label>
          <label>Thành phố<input value={config.city} onChange={(event) => updateConfig('city', event.target.value)} /></label>
          <fieldset className="admin-studio-family-fields"><legend>Nhà trai · ?side=groom</legend><div>
            <label className="is-wide">Tên địa điểm<input value={config.groomVenue ?? ''} onChange={(event) => updateConfig('groomVenue', event.target.value)} placeholder="Để trống để dùng địa điểm chung" /></label>
            <label className="is-wide">Địa chỉ làm lễ<input value={config.groomAddress} onChange={(event) => updateConfig('groomAddress', event.target.value)} placeholder="Để trống để dùng địa chỉ chung" /></label>
            <label className="is-wide">Địa chỉ tiệc / reception<input value={config.groomReceptionAddress} onChange={(event) => updateConfig('groomReceptionAddress', event.target.value)} placeholder="Để trống để dùng địa chỉ làm lễ nhà trai" /></label>
          </div></fieldset>
          <fieldset className="admin-studio-family-fields"><legend>Nhà gái · ?side=bride</legend><div>
            <label className="is-wide">Tên địa điểm<input value={config.brideVenue ?? ''} onChange={(event) => updateConfig('brideVenue', event.target.value)} placeholder="Để trống để dùng địa điểm chung" /></label>
            <label className="is-wide">Địa chỉ làm lễ<input value={config.brideAddress} onChange={(event) => updateConfig('brideAddress', event.target.value)} placeholder="Để trống để dùng địa chỉ chung" /></label>
            <label className="is-wide">Địa chỉ tiệc / reception<input value={config.brideReceptionAddress} onChange={(event) => updateConfig('brideReceptionAddress', event.target.value)} placeholder="Để trống để dùng địa chỉ làm lễ nhà gái" /></label>
          </div></fieldset>
        </div>}
        {step === 5 && <div className="admin-form-grid">
          <label className="is-wide">Story / lời mời<textarea rows={5} value={customer.message} onChange={(event) => onCustomerChange('message', event.target.value)} /></label>
          <label>Tiêu đề lễ<input value={config.ceremonyTitle} onChange={(event) => updateConfig('ceremonyTitle', event.target.value)} /></label>
          <label>Tiêu đề tiệc<input value={config.receptionTitle} onChange={(event) => updateConfig('receptionTitle', event.target.value)} /></label>
          <fieldset className="admin-studio-sections is-wide"><legend>Hiển thị trên thiệp</legend><div>
            {sectionOptions.map(({ id, label, available }) => <label key={id}>
              <input type="checkbox" checked={!config.hiddenSections?.includes(id)} disabled={!available}
                onChange={(event) => updateConfig('hiddenSections', event.target.checked
                  ? (config.hiddenSections ?? []).filter((section) => section !== id)
                  : [...(config.hiddenSections ?? []), id])} />
              <span>{label}{!available ? ' · Chưa có trong gói/mẫu này' : ''}</span>
            </label>)}
          </div></fieldset>
          {config.packageTier === '199k' && !config.hiddenSections?.includes('video') && <label className="is-wide">Link video cưới<input type="url" value={config.videoLink ?? ''} onChange={(event) => updateConfig('videoLink', event.target.value)} placeholder="https://youtu.be/... hoặc link video MP4" />
            <small>Nút phát video ngay trong khung. Dùng link YouTube hoặc link trực tiếp tới video qua HTTPS.</small></label>}
          <label className="is-wide">Chữ viết tắt trên header<input value={config.headerMonogramText} onChange={(event) => updateConfig('headerMonogramText', event.target.value)} placeholder="Để trống để dùng chữ cái đầu tên hai bạn" maxLength={40} /><small>Ví dụ: N &amp; M · N &lt;3 M · Nhàn &amp; Mai</small></label>
          <details className="admin-studio-copy-fields is-wide">
            <summary>Nội dung riêng cho nhà trai / nhà gái</summary>
            <small>Link nhà trai thêm <code>?side=groom</code>; link nhà gái thêm <code>?side=bride</code>. Mỗi bên có giờ và nội dung riêng.</small>
            <div className="admin-form-grid">
              <fieldset className="admin-studio-family-fields"><legend>Nhà trai</legend><div>
                <label>Tiêu đề lễ<input value={config.groomCeremonyTitle} onChange={(event) => updateConfig('groomCeremonyTitle', event.target.value)} /></label>
                <label>Giờ làm lễ<input type="time" value={config.groomCeremonyTime} onChange={(event) => updateConfig('groomCeremonyTime', event.target.value)} /></label>
                <label>Tiêu đề tiệc<input value={config.groomReceptionTitle} onChange={(event) => updateConfig('groomReceptionTitle', event.target.value)} /></label>
                <label>Giờ đón khách<input type="time" value={config.groomReceptionTime} onChange={(event) => updateConfig('groomReceptionTime', event.target.value)} /></label>
              </div></fieldset>
              <fieldset className="admin-studio-family-fields"><legend>Nhà gái</legend><div>
                <label>Tiêu đề lễ<input value={config.brideCeremonyTitle} onChange={(event) => updateConfig('brideCeremonyTitle', event.target.value)} /></label>
                <label>Giờ làm lễ<input type="time" value={config.brideCeremonyTime} onChange={(event) => updateConfig('brideCeremonyTime', event.target.value)} /></label>
                <label>Tiêu đề tiệc<input value={config.brideReceptionTitle} onChange={(event) => updateConfig('brideReceptionTitle', event.target.value)} /></label>
                <label>Giờ đón khách<input type="time" value={config.brideReceptionTime} onChange={(event) => updateConfig('brideReceptionTime', event.target.value)} /></label>
              </div></fieldset>
              <label className="is-wide">Nhà trai · Chữ trên ảnh bìa<input value={config.groomHeroKicker} onChange={(event) => updateConfig('groomHeroKicker', event.target.value)} /></label>
              <label className="is-wide">Nhà gái · Chữ trên ảnh bìa<input value={config.brideHeroKicker} onChange={(event) => updateConfig('brideHeroKicker', event.target.value)} /></label>
            </div>
          </details>
          <details className="admin-studio-copy-fields is-wide">
            <summary>Chỉnh các text khác trên thiệp</summary>
            <div className="admin-form-grid">
              <label>Chữ trên ảnh bìa<input value={config.heroKicker} onChange={(event) => updateConfig('heroKicker', event.target.value)} /></label>
              <label>Tiêu đề album<input value={config.albumTitle} onChange={(event) => updateConfig('albumTitle', event.target.value)} /></label>
              <label>Nhãn thời gian<input value={config.timeLabel} onChange={(event) => updateConfig('timeLabel', event.target.value)} /></label>
              <label>Nhãn địa điểm<input value={config.venueLabel} onChange={(event) => updateConfig('venueLabel', event.target.value)} /></label>
              <label className="is-wide">Câu kết thiệp<input value={config.signatureText} onChange={(event) => updateConfig('signatureText', event.target.value)} /></label>
            </div>
          </details>
        </div>}
        {step === 6 && <div className="admin-studio-media-step">{mediaLibrary}</div>}
        {step === 7 && (config.packageTier === '109k' ? <div className="admin-studio-guests-locked">
          <strong>Gói Cơ bản gồm RSVP Có / Không</strong>
          <span>Danh sách khách riêng, số khách và câu hỏi xe/ăn sẽ mở ở gói Premium. Nội dung đã nhập được giữ lại khi đổi gói.</span>
          <div><button type="button" onClick={() => updateConfig('packageTier', '159k')}>Chọn 159K Premium</button><button type="button" onClick={() => updateConfig('packageTier', '199k')}>Chọn 199K Diamond</button></div>
        </div> : <div className="admin-studio-guests">
          <div className="admin-studio-guests__add"><label htmlFor="admin-studio-guest">Thêm khách mời</label><div><input id="admin-studio-guest" value={guestName} onChange={(event) => setGuestName(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addGuest(); } }} placeholder="Tên khách" /><button type="button" onClick={addGuest} disabled={!guestName.trim()}><Users aria-hidden="true" /> Thêm</button></div></div>
          <div className="admin-studio-guests__list">{config.guests.map((guest) => <div key={guest.id}><span>{guest.name}</span><select aria-label={`Lời chào cho ${guest.name}`} value={guest.greeting} onChange={(event) => updateConfig('guests', config.guests.map((item) => item.id === guest.id ? { ...item, greeting: event.target.value as 'formal' | 'friendly' } : item))}><option value="friendly">Thân mời</option><option value="formal">Trân trọng kính mời</option></select><button type="button" aria-label={`Xóa ${guest.name}`} onClick={() => updateConfig('guests', config.guests.filter((item) => item.id !== guest.id))}>×</button></div>)}</div>
          <fieldset className="admin-studio-rsvp"><legend>Câu hỏi RSVP</legend><label><input type="checkbox" checked={config.rsvpQuestions.includes('transport')} onChange={() => updateConfig('rsvpQuestions', config.rsvpQuestions.includes('transport') ? config.rsvpQuestions.filter((item) => item !== 'transport') : [...config.rsvpQuestions, 'transport'])} /> Xe đưa đón</label><label><input type="checkbox" checked={config.rsvpQuestions.includes('meal')} onChange={() => updateConfig('rsvpQuestions', config.rsvpQuestions.includes('meal') ? config.rsvpQuestions.filter((item) => item !== 'meal') : [...config.rsvpQuestions, 'meal'])} /> Chế độ ăn</label></fieldset>
        </div>)}
        {step === 8 && <div className="admin-form-grid">
          <label>Bảng màu<select value={config.theme} onChange={(event) => updateConfig('theme', event.target.value as InvitationStudioConfig['theme'])}>
            <option value="template">Nguyên bản</option><option value="champagne">Champagne</option><option value="blush">Blush Rose</option><option value="emerald">Emerald</option>
          </select></label>
          {config.packageTier === '109k' ? <p className="admin-studio-editor__hint">Tùy chỉnh kiểu chữ là quyền lợi từ gói Premium; lựa chọn hiện tại được giữ lại nếu bạn hạ gói.</p> : <label>Kiểu chữ<select value={config.fontStyle} onChange={(event) => updateConfig('fontStyle', event.target.value as InvitationStudioConfig['fontStyle'])}>
            <option value="editorial">Editorial</option><option value="modern">Hiện đại</option><option value="classic">Cổ điển</option>
          </select></label>}
        </div>}
        {step === 9 && (config.packageTier === '109k' ? <div className="admin-studio-guests-locked">
          <strong>Nhạc nền theo gói Basic</strong>
          <span>Gói Basic dùng nhạc mẫu mặc định. Chọn nhạc riêng có trong gói Premium và Diamond.</span>
        </div> : <div className="admin-form-grid admin-studio-music">
          <label className="is-wide">Nguồn nhạc<select value={config.musicTrack ?? 'default'} onChange={(event) => updateConfig('musicTrack', event.target.value as InvitationStudioConfig['musicTrack'])}>
            <option value="default">Nhạc nền mặc định</option>
            {weddingMusicTracks.map((track) => <option key={track.id} value={track.id}>{track.label}</option>)}
            <option value="custom">Link nhạc riêng</option>
          </select></label>
          {config.musicTrack === 'custom' && <label className="is-wide">Link YouTube hoặc MP3<input type="text" inputMode="url" value={config.customMusicUrl ?? ''} onChange={(event) => updateConfig('customMusicUrl', event.target.value)} placeholder="https://youtu.be/... hoặc link MP3" />
            <small>Dán link YouTube (watch, youtu.be, shorts, live) hoặc link trực tiếp đến file MP3 qua HTTPS.</small>
            {config.customMusicUrl?.trim() && !isSupportedWeddingMusicUrl(config.customMusicUrl) && <small role="alert" className="admin-studio-editor__error">Link chưa được hỗ trợ. Hãy dùng link video YouTube hoặc URL file .mp3 HTTPS.</small>}</label>}
          <p className="admin-studio-editor__hint is-wide">Nhạc được lưu vào cấu hình và phát trên thiệp đã xuất bản. Trình duyệt có thể yêu cầu khách bấm nút phát.</p>
        </div>)}
        {step === 10 && <dl className="admin-studio-review">
          <div><dt>Đôi bạn</dt><dd>{customer.brideName || 'Cô dâu'} &amp; {customer.groomName || 'Chú rể'}</dd></div>
          <div><dt>Thời gian</dt><dd>{customer.weddingDate || 'Chưa chọn ngày'} · Lễ {config.ceremonyTime || customer.weddingTime || '18:00'} · Đón khách {config.receptionTime || customer.weddingTime || '18:00'}</dd></div>
          <div><dt>Địa điểm</dt><dd>{customer.venue || 'Chưa thêm địa điểm'} · {customer.address}</dd></div>
          <div><dt>Thiết kế</dt><dd>{selectedTemplateName} · {selectedPackage.name} · {config.theme}{config.packageTier !== '109k' ? ` · ${config.fontStyle}` : ''}</dd></div>
          <div><dt>Nhạc nền</dt><dd>{config.packageTier === '109k' || config.musicTrack === 'default' ? 'Mặc định' : config.musicTrack === 'custom' ? config.customMusicUrl || 'Link riêng chưa nhập' : weddingMusicTracks.find((track) => track.id === config.musicTrack)?.label ?? 'Mặc định'}</dd></div>
          <div><dt>Các phần trong gói</dt><dd>{selectedPackage.features.join(' · ')}</dd></div>
          <div><dt>Ảnh</dt><dd>{mediaCount} ảnh đã chọn</dd></div>
          <div><dt>Khách mời &amp; RSVP</dt><dd>{config.packageTier === '109k' ? 'RSVP Có / Không' : `${config.guests.length} khách · ${config.rsvpQuestions.length} câu hỏi thêm`}</dd></div>
        </dl>}
       </div>
       <aside className="admin-studio-editor__preview" aria-label="Xem trước trực tiếp">
         <div><span><i /> Preview trực tiếp</span><small>{previewLabel}</small></div>
         {preview}
       </aside>
      </div>
      <footer className="admin-studio-editor__actions">
        <button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0}><ArrowLeft aria-hidden="true" /> Trước</button>
        {step < studioSteps.length - 1
          ? <button type="button" className="is-primary" onClick={() => setStep((current) => Math.min(studioSteps.length - 1, current + 1))}>Tiếp theo <ArrowRight aria-hidden="true" /></button>
          : <button type="button" className="is-primary" onClick={onSave} disabled={saving}><Save aria-hidden="true" /> {saving ? 'Đang lưu...' : 'Lưu cấu hình vào demo'}</button>}
      </footer>
    </section>
  );
}

export function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Đăng nhập quản trị | Wedding Invitation MP';
    const existingSession = readAdminSession();
    if (existingSession) {
      getAdminProfile(existingSession)
        .then(() => navigateTo('/admin'))
        .catch(() => clearAdminSession());
    }
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInAdmin(email.trim(), password);
      navigateTo('/admin');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Không thể đăng nhập.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <button type="button" className="admin-login-card__back" onClick={() => navigateTo('/')}>
          <ArrowLeft aria-hidden="true" /> Về website
        </button>
        <div className="admin-login-card__brand"><ShieldCheck aria-hidden="true" /></div>
        <p>Khu vực nội bộ</p>
        <h1>Wedding Invitation MP</h1>
        <span>Đăng nhập bằng tài khoản quản trị đã được cấp quyền.</span>
        {!isSupabaseConfigured() && (
          <div className="admin-alert">Supabase chưa được cấu hình trong biến môi trường.</div>
        )}
        {error && <div className="admin-alert is-error" role="alert">{error}</div>}
        <form onSubmit={submit}>
          <label><Mail aria-hidden="true" /> Email<input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
          <label><LockKeyhole aria-hidden="true" /> Mật khẩu<input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
          <button type="submit" disabled={loading || !isSupabaseConfigured()}>
            {loading ? <LoaderCircle className="is-spinning" aria-hidden="true" /> : <LockKeyhole aria-hidden="true" />}
            {loading ? 'Đang xác minh...' : 'Đăng nhập quản trị'}
          </button>
        </form>
        <small>Route này không xuất hiện trên website công khai. Dữ liệu vẫn được bảo vệ bằng Supabase Auth và RLS.</small>
      </section>
    </main>
  );
}

export function AdminSetPasswordPage() {
  const [callbackSession, setCallbackSession] = useState<AuthCallbackSession | null>(null);
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Thiết lập mật khẩu quản trị | Wedding Invitation MP';
    try {
      const session = readAuthCallbackSession();
      setCallbackSession(session);
    } catch (callbackError) {
      setError(callbackError instanceof Error ? callbackError.message : 'Liên kết không hợp lệ.');
    } finally {
      window.history.replaceState({}, '', '/admin/setup-password');
    }
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!callbackSession) return;
    if (password.length < 10) {
      setError('Mật khẩu cần có ít nhất 10 ký tự.');
      return;
    }
    if (password !== confirmation) {
      setError('Hai mật khẩu chưa trùng khớp.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await setAdminPassword(callbackSession, password);
      navigateTo('/admin');
    } catch (setupError) {
      setError(setupError instanceof Error ? setupError.message : 'Không thể thiết lập mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <button type="button" className="admin-login-card__back" onClick={() => navigateTo('/admin/login')}>
          <ArrowLeft aria-hidden="true" /> Về trang đăng nhập
        </button>
        <div className="admin-login-card__brand"><ShieldCheck aria-hidden="true" /></div>
        <p>Kích hoạt tài khoản</p>
        <h1>Tạo mật khẩu quản trị</h1>
        <span>Mật khẩu được gửi trực tiếp tới Supabase qua kết nối bảo mật và không được lưu trên website.</span>
        {error && <div className="admin-alert is-error" role="alert">{error}</div>}
        {callbackSession && (
          <form onSubmit={submit}>
            <label>
              <LockKeyhole aria-hidden="true" /> Mật khẩu mới
              <input
                type="password"
                autoComplete="new-password"
                minLength={10}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            <label>
              <LockKeyhole aria-hidden="true" /> Nhập lại mật khẩu
              <input
                type="password"
                autoComplete="new-password"
                minLength={10}
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                required
              />
            </label>
            <small className="admin-password-hint">Ít nhất 10 ký tự; nên kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt.</small>
            <button type="submit" disabled={loading}>
              {loading ? <LoaderCircle className="is-spinning" aria-hidden="true" /> : <ShieldCheck aria-hidden="true" />}
              {loading ? 'Đang thiết lập...' : 'Tạo mật khẩu và vào quản trị'}
            </button>
          </form>
        )}
        {!callbackSession && (
          <button type="button" className="admin-login-card__fallback" onClick={() => navigateTo('/admin/login')}>
            Quay lại đăng nhập
          </button>
        )}
        <small>Không chia sẻ liên kết kích hoạt hoặc mật khẩu với bất kỳ ai.</small>
      </section>
    </main>
  );
}

interface AdminRsvpRecord {
  id: string;
  name: string;
  attending: 'yes' | 'no';
  guestCount: number;
  email?: string | null;
  message?: string | null;
  answers: Record<string, string>;
  submittedAt: string;
}

function AdminDemoRsvpPanel({ demoId, accessToken }: { demoId: string; accessToken: string }) {
  const [open, setOpen] = useState(false);
  const [responses, setResponses] = useState<AdminRsvpRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [error, setError] = useState('');
  const [shareStatus, setShareStatus] = useState('');
  const [shareLink, setShareLink] = useState('');

  useEffect(() => {
    try {
      setShareLink(window.localStorage.getItem(shareLinkCacheKey('rsvp', demoId)) ?? '');
    } catch (cacheError) {
      setError(cacheError instanceof Error ? `Không tải được link RSVP đã lưu: ${cacheError.message}` : 'Không tải được link RSVP đã lưu.');
    }
  }, [demoId]);

  const loadResponses = async () => {
    setLoading(true);
    setError('');
    try {
      const rows = await mediaRequest<AdminRsvpRecord[]>('invitation-rsvps-admin', { demoId }, accessToken);
      setResponses(rows);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Không tải được RSVP.');
    } finally {
      setLoading(false);
    }
  };

  const toggleOpen = () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen) void loadResponses();
  };

  const deleteResponse = async (response: AdminRsvpRecord) => {
    if (!window.confirm(`Xóa lời hồi đáp của ${response.name}? Thao tác này không thể hoàn tác.`)) return;
    setDeletingId(response.id);
    setError('');
    try {
      await mediaRequest<{ ok: boolean }>('delete-invitation-rsvp', { demoId, rsvpId: response.id }, accessToken);
      setResponses((current) => current.filter((item) => item.id !== response.id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Không xóa được RSVP.');
    } finally {
      setDeletingId('');
    }
  };

  const createShareLink = async () => {
    setShareStatus('');
    setError('');
    try {
      const { token } = await mediaRequest<{ token: string }>('create-invitation-rsvp-share', { demoId }, accessToken);
      const link = `${window.location.origin}/rsvp/${token}`;
      setShareLink(link);
      try {
        window.localStorage.setItem(shareLinkCacheKey('rsvp', demoId), link);
      } catch (cacheError) {
        setError(cacheError instanceof Error ? `Không lưu được link RSVP vào bộ nhớ trình duyệt: ${cacheError.message}` : 'Không lưu được link RSVP vào bộ nhớ trình duyệt.');
      }
      try {
        await navigator.clipboard.writeText(link);
        setShareStatus('Đã sao chép link xem chỉ đọc. Tạo link mới sẽ vô hiệu hóa link trước đó.');
      } catch {
        setShareStatus('Link RSVP đã được lưu bên dưới nhưng chưa sao chép. Bạn có thể sao chép lại bất cứ lúc nào.');
      }
    } catch (shareError) {
      setError(shareError instanceof Error ? shareError.message : 'Không tạo được link xem RSVP.');
    }
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setShareStatus('Đã sao chép link xem RSVP.');
      setError('');
    } catch (copyError) {
      setError(copyError instanceof Error ? `Không thể sao chép link RSVP: ${copyError.message}` : 'Không thể sao chép link RSVP.');
    }
  };

  return (
    <section className="admin-demo-rsvp" aria-label="Quản lý RSVP của thiệp">
      <header>
        <button type="button" onClick={toggleOpen} aria-expanded={open}>
          <Users aria-hidden="true" /> {open ? 'Ẩn RSVP' : 'Xem RSVP'}
        </button>
        {open && <button type="button" onClick={() => void createShareLink()}><Link2 aria-hidden="true" /> Tạo link xem</button>}
      </header>
      {open && <>
        {shareStatus && <p className="admin-demo-rsvp__status" role="status">{shareStatus}</p>}
        {error && <p className="admin-demo-rsvp__error" role="alert">{error}</p>}
        {shareLink && <label className="admin-demo-rsvp__share-link">
          <span>Link xem RSVP đã tạo</span>
          <div><input readOnly value={shareLink} aria-label="Link xem RSVP đã tạo" /><button type="button" onClick={() => void copyShareLink()} aria-label="Sao chép link xem RSVP"><Clipboard aria-hidden="true" /></button><a href={shareLink} target="_blank" rel="noreferrer" aria-label="Mở link xem RSVP"><ExternalLink aria-hidden="true" /></a></div>
        </label>}
        {loading ? <p className="admin-demo-rsvp__empty"><LoaderCircle className="is-spinning" /> Đang tải hồi đáp...</p>
          : responses.length ? <ul>
            {responses.map((response) => (
              <li key={response.id}>
                <div className="admin-demo-rsvp__response">
                  <strong>{response.name}</strong>
                  <span>{response.attending === 'yes' ? `Sẽ tham dự · ${response.guestCount} khách` : 'Không thể tham dự'}</span>
                  <small>{new Date(response.submittedAt).toLocaleString('vi-VN')}{response.email ? ` · ${response.email}` : ''}</small>
                  {Object.entries(response.answers ?? {}).map(([key, value]) => (
                    <small key={key}>{key === 'transport' ? 'Xe đưa đón' : key === 'meal' ? 'Chế độ ăn' : key}: {value}</small>
                  ))}
                  {response.message && <p>{response.message}</p>}
                </div>
                <button type="button" className="is-danger" disabled={Boolean(deletingId)} onClick={() => void deleteResponse(response)} aria-label={`Xóa hồi đáp của ${response.name}`}>
                  {deletingId === response.id ? <LoaderCircle className="is-spinning" /> : <Trash2 aria-hidden="true" />}
                </button>
              </li>
            ))}
          </ul> : <p className="admin-demo-rsvp__empty">Chưa có lời hồi đáp nào.</p>}
      </>}
    </section>
  );
}

interface AdminWishRecord {
  id: string;
  name: string;
  message: string;
  submittedAt: string;
}

function AdminDemoWishesPanel({ demoId, accessToken }: { demoId: string; accessToken: string }) {
  const [open, setOpen] = useState(false);
  const [wishes, setWishes] = useState<AdminWishRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [error, setError] = useState('');
  const [shareStatus, setShareStatus] = useState('');
  const [shareLink, setShareLink] = useState('');

  useEffect(() => {
    try {
      setShareLink(window.localStorage.getItem(shareLinkCacheKey('wishes', demoId)) ?? '');
    } catch (cacheError) {
      setError(cacheError instanceof Error ? `Không tải được link lời chúc đã lưu: ${cacheError.message}` : 'Không tải được link lời chúc đã lưu.');
    }
  }, [demoId]);

  const loadWishes = async () => {
    setLoading(true);
    setError('');
    try {
      setWishes(await mediaRequest<AdminWishRecord[]>('invitation-wishes-admin', { demoId }, accessToken));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Không tải được lời chúc.');
    } finally {
      setLoading(false);
    }
  };

  const toggleOpen = () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen) void loadWishes();
  };

  const deleteWish = async (wish: AdminWishRecord) => {
    if (!window.confirm(`Xóa lời chúc của ${wish.name}? Thao tác này không thể hoàn tác.`)) return;
    setDeletingId(wish.id);
    setError('');
    try {
      await mediaRequest<{ ok: boolean }>('delete-invitation-wish', { demoId, wishId: wish.id }, accessToken);
      setWishes((current) => current.filter((item) => item.id !== wish.id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Không xóa được lời chúc.');
    } finally {
      setDeletingId('');
    }
  };

  const createShareLink = async () => {
    setShareStatus('');
    setError('');
    try {
      const { token } = await mediaRequest<{ token: string }>('create-invitation-wishes-share', { demoId }, accessToken);
      const link = `${window.location.origin}/wishes/${token}`;
      setShareLink(link);
      try {
        window.localStorage.setItem(shareLinkCacheKey('wishes', demoId), link);
      } catch (cacheError) {
        setError(cacheError instanceof Error ? `Không lưu được link lời chúc vào bộ nhớ trình duyệt: ${cacheError.message}` : 'Không lưu được link lời chúc vào bộ nhớ trình duyệt.');
      }
      try {
        await navigator.clipboard.writeText(link);
        setShareStatus('Đã sao chép link xem sổ lưu bút. Link cũ sẽ mất hiệu lực khi tạo link mới.');
      } catch {
        setShareStatus('Link lời chúc đã được lưu bên dưới nhưng chưa sao chép. Bạn có thể sao chép lại bất cứ lúc nào.');
      }
    } catch (shareError) {
      setError(shareError instanceof Error ? shareError.message : 'Không tạo được link xem sổ lưu bút.');
    }
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setShareStatus('Đã sao chép link xem lời chúc.');
      setError('');
    } catch (copyError) {
      setError(copyError instanceof Error ? `Không thể sao chép link lời chúc: ${copyError.message}` : 'Không thể sao chép link lời chúc.');
    }
  };

  return (
    <section className="admin-demo-rsvp admin-demo-wishes" aria-label="Quản lý lời chúc của thiệp">
      <header>
        <button type="button" onClick={toggleOpen} aria-expanded={open}>
          <MessageCircleHeart aria-hidden="true" /> {open ? 'Ẩn lời chúc' : 'Xem lời chúc'}
        </button>
        {open && <button type="button" onClick={() => void createShareLink()}><Link2 aria-hidden="true" /> Tạo link xem</button>}
      </header>
      {open && <>
        {shareStatus && <p className="admin-demo-rsvp__status" role="status">{shareStatus}</p>}
        {error && <p className="admin-demo-rsvp__error" role="alert">{error}</p>}
        {shareLink && <label className="admin-demo-rsvp__share-link">
          <span>Link xem lời chúc đã tạo</span>
          <div><input readOnly value={shareLink} aria-label="Link xem lời chúc đã tạo" /><button type="button" onClick={() => void copyShareLink()} aria-label="Sao chép link xem lời chúc"><Clipboard aria-hidden="true" /></button><a href={shareLink} target="_blank" rel="noreferrer" aria-label="Mở link xem lời chúc"><ExternalLink aria-hidden="true" /></a></div>
        </label>}
        {loading ? <p className="admin-demo-rsvp__empty"><LoaderCircle className="is-spinning" /> Đang tải lời chúc...</p>
          : wishes.length ? <ul>
            {wishes.map((wish) => (
              <li key={wish.id}>
                <div className="admin-demo-rsvp__response">
                  <strong>{wish.name}</strong>
                  <small>{new Date(wish.submittedAt).toLocaleString('vi-VN')}</small>
                  <p>{wish.message}</p>
                </div>
                <button type="button" className="is-danger" disabled={Boolean(deletingId)} onClick={() => void deleteWish(wish)} aria-label={`Xóa lời chúc của ${wish.name}`}>
                  {deletingId === wish.id ? <LoaderCircle className="is-spinning" /> : <Trash2 aria-hidden="true" />}
                </button>
              </li>
            ))}
          </ul> : <p className="admin-demo-rsvp__empty">Chưa có lời chúc nào.</p>}
      </>}
    </section>
  );
}

export function AdminDashboardPage() {
  const [session, setSession] = useState<AdminSession | null>(readAdminSession);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [demos, setDemos] = useState<InvitationDemoRecord[]>([]);
  const [publishedInvitations, setPublishedInvitations] = useState<PublishedInvitationRecord[]>([]);
  const [customTemplates, setCustomTemplates] = useState<CustomInvitationTemplate[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [editor, setEditor] = useState<CustomerEditor>(emptyCustomer);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | CustomerStatus>('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [demoNote, setDemoNote] = useState('Đây là bản demo để khách hàng xem trước và góp ý trước khi xuất bản chính thức.');
  const [demoExpiry, setDemoExpiry] = useState(() => {
    const nextWeek = new Date(Date.now() + 7 * 86_400_000);
    return nextWeek.toISOString().slice(0, 10);
  });
  const [mediaSelection, setMediaSelection] = useState<{ customerId: string; photos: DemoPhoto[] }>();
  const [zipTargetDemoId, setZipTargetDemoId] = useState('');
  const [studioConfig, setStudioConfig] = useState<InvitationStudioConfig>(defaultStudioConfig);
  const [studioOpen, setStudioOpen] = useState(false);
  const [templateUploading, setTemplateUploading] = useState(false);
  const zipInputRef = useRef<HTMLInputElement>(null);
  const publishAttempt = useRef<{ fingerprint: string; id: string }>();
  const publishing = useRef(false);

  const selectedCustomer = customers.find((customer) => customer.id === selectedCustomerId) ?? null;
  const demoPhotos = mediaSelection?.customerId === selectedCustomerId ? mediaSelection.photos : [];
  const customerDemos = demos.filter((demo) => demo.customerId === selectedCustomerId);
  const activeRevisionId = customerDemos.find((demo) => demo.templateId === editor.selectedTemplateId
    && typeof demo.payload.customTemplateId === 'string')?.payload.customTemplateId;
  const selectedCustomTemplate = customTemplates.find((template) => template.id === editor.selectedTemplateId)
    ?? customTemplates.find((template) => template.id === activeRevisionId);
  const selectedTemplateName = selectedCustomTemplate?.name
    ?? weddingTemplates.find((template) => template.id === editor.selectedTemplateId)?.name
    ?? 'Chọn mẫu thiệp';
  const studioCover = demoPhotos.find((photo) => photo.role === 'cover' && photo.url);
  const studioMainPhoto = demoPhotos.find((photo) => photo.role === 'main' && photo.url);
  const studioVideoPhoto = demoPhotos.find((photo) => photo.role === 'video' && photo.url);
  const studioGallery = demoPhotos.filter((photo) => photo.role === 'gallery' && photo.url).sort((a, b) => a.order - b.order);
  const repeatedStudioGallery = studioGallery.length
    ? Array.from({ length: Math.max(4, studioGallery.length) }, (_, index) => studioGallery[index % studioGallery.length])
    : [];
  const studioPreviewCustomization: SignatureDemoCustomization = {
    tier: studioConfig.packageTier,
    bride: editor.brideName,
    groom: editor.groomName,
    date: editor.weddingDate,
    dateLabel: dateDots(editor.weddingDate),
    time: editor.weddingTime,
    ceremonyTime: studioConfig.ceremonyTime || editor.weddingTime,
    receptionTime: studioConfig.receptionTime || editor.weddingTime,
    venue: editor.venue,
    address: editor.address,
    city: studioConfig.city,
    headerMonogramText: studioConfig.headerMonogramText,
    story: editor.message,
    hiddenSections: studioConfig.hiddenSections,
    ceremonyTitle: studioConfig.ceremonyTitle,
    receptionTitle: studioConfig.receptionTitle,
    heroKicker: studioConfig.heroKicker,
    albumTitle: studioConfig.albumTitle,
    timeLabel: studioConfig.timeLabel,
    venueLabel: studioConfig.venueLabel,
    signatureText: studioConfig.signatureText,
    theme: studioConfig.theme,
    fontStyle: studioConfig.packageTier === '109k' ? 'editorial' : studioConfig.fontStyle,
    musicUrl: musicUrlForStudio(studioConfig),
    videoLink: studioConfig.videoLink,
    hero: (studioCover?.url ?? editor.coverUrl) || undefined,
    heroPosition: studioCover ? photoPosition(studioCover) : undefined,
    mainPhoto: studioMainPhoto?.url,
    mainPhotoPosition: studioMainPhoto ? photoPosition(studioMainPhoto) : undefined,
    videoBackground: studioVideoPhoto?.url,
    videoBackgroundPosition: studioVideoPhoto ? photoPosition(studioVideoPhoto) : undefined,
    gallery: repeatedStudioGallery.map((photo) => photo.url!).filter(Boolean),
    galleryPositions: repeatedStudioGallery.map((photo) => photoPosition(photo)),
  };
  const studioPreview = selectedCustomTemplate ? <CustomTemplateRenderer
    compact
    template={selectedCustomTemplate}
    title={`Xem trước mẫu riêng ${selectedCustomTemplate.name}`}
    payload={{
      brideName: editor.brideName, groomName: editor.groomName, weddingDate: editor.weddingDate,
      weddingTime: editor.weddingTime, venue: editor.venue, address: editor.address,
      message: editor.message, coverUrl: editor.coverUrl, photos: demoPhotos, studio: studioConfig,
      customTemplateId: selectedCustomTemplate.id,
    }}
  /> : <div className="admin-studio-signature-preview">
    <SignatureDemo
      id={editor.selectedTemplateId || 'classic-minimalist'}
      customization={studioPreviewCustomization}
      rsvpQuestions={studioConfig.rsvpQuestions}
      embedded
      showMusicPlayer
    />
  </div>;

  const loadCustomerPhotos = useCallback((customerId: string, photos: DemoPhoto[]) => {
    setMediaSelection((current) => {
      if (current?.customerId !== customerId) return { customerId, photos };
      const freshUrls = new Map(photos.map((photo) => [photo.photoId, photo.url]));
      return { customerId, photos: current.photos.map((photo) => ({
        ...photo, url: freshUrls.get(photo.photoId) ?? photo.url,
      })) };
    });
  }, []);

  const loadData = useCallback(async (preferredCustomerId?: string) => {
    const existingSession = readAdminSession();
    if (!existingSession) {
      navigateTo('/admin/login');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const activeSession = await refreshAdminSession(existingSession);
      const [nextProfile, nextCustomers, nextDemos, nextPublishedInvitations, nextCustomTemplates] = await Promise.all([
        getAdminProfile(activeSession), listCustomers(activeSession), listDemos(activeSession), listPublishedInvitations(activeSession),
        mediaRequest<CustomInvitationTemplate[]>('templates', {
          customerId: preferredCustomerId ?? selectedCustomerId,
        }, activeSession.accessToken),
      ]);
      setSession(activeSession);
      setProfile(nextProfile);
      setCustomers(nextCustomers);
      setDemos(nextDemos);
      setPublishedInvitations(nextPublishedInvitations);
      setCustomTemplates(nextCustomTemplates);
      const nextSelectedId = preferredCustomerId
        ?? selectedCustomerId
        ?? nextCustomers[0]?.id
        ?? null;
      setSelectedCustomerId(nextSelectedId);
      const nextSelected = nextCustomers.find((item) => item.id === nextSelectedId);
      if (nextSelected) setEditor(customerToEditor(nextSelected));
    } catch (loadError) {
      clearAdminSession();
      setError(loadError instanceof Error ? loadError.message : 'Không thể tải dữ liệu quản trị.');
      window.setTimeout(() => navigateTo('/admin/login'), 1400);
    } finally {
      setLoading(false);
    }
  }, [selectedCustomerId]);

  useEffect(() => {
    document.title = 'Quản trị khách hàng | Wedding Invitation MP';
    void loadData();
    // Only bootstrap once; subsequent reloads are explicit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedCustomer || isNewCustomer) return;
    setEditor(customerToEditor(selectedCustomer));
  }, [isNewCustomer, selectedCustomer]);

  useEffect(() => {
    if (!session || !selectedCustomerId) return;
    let active = true;
    mediaRequest<CustomInvitationTemplate[]>('templates', { customerId: selectedCustomerId }, session.accessToken)
      .then((templates) => { if (active) setCustomTemplates(templates); })
      .catch(() => undefined);
    return () => { active = false; };
  }, [session?.accessToken, selectedCustomerId]);

  useEffect(() => {
    if (!selectedCustomer) return;
    const savedConfig = customerDemos[0]?.payload.studio;
    setStudioConfig(savedConfig ? {
      ...defaultStudioConfig,
      ...savedConfig,
      headerMonogramText: savedConfig.headerMonogramText || defaultStudioConfig.headerMonogramText,
      heroKicker: savedConfig.heroKicker || defaultStudioConfig.heroKicker,
      albumTitle: savedConfig.albumTitle || defaultStudioConfig.albumTitle,
      timeLabel: savedConfig.timeLabel || defaultStudioConfig.timeLabel,
      venueLabel: savedConfig.venueLabel || defaultStudioConfig.venueLabel,
      signatureText: savedConfig.signatureText || defaultStudioConfig.signatureText,
      guests: Array.isArray(savedConfig.guests) ? savedConfig.guests : [],
      rsvpQuestions: Array.isArray(savedConfig.rsvpQuestions) ? savedConfig.rsvpQuestions : [],
      ceremonyTime: savedConfig.ceremonyTime || selectedCustomer.weddingTime || '',
      receptionTime: savedConfig.receptionTime || selectedCustomer.weddingTime || '',
    } : {
      ...defaultStudioConfig,
      packageTier: weddingTemplates.find((item) => item.id === selectedCustomer.selectedTemplateId)?.tier ?? '109k',
      ceremonyTime: selectedCustomer.weddingTime,
      receptionTime: selectedCustomer.weddingTime,
    });
  }, [selectedCustomerId, demos]);

  const filteredCustomers = useMemo(() => {
    const search = searchTerm.trim().toLocaleLowerCase('vi');
    return customers.filter((customer) => {
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
      const matchesSearch = !search || [
        customer.fullName, customer.brideName, customer.groomName, customer.phone, customer.email,
      ].join(' ').toLocaleLowerCase('vi').includes(search);
      return matchesStatus && matchesSearch;
    });
  }, [customers, searchTerm, statusFilter]);

  const stats = useMemo(() => ({
    total: customers.length,
    waiting: customers.filter((customer) => customer.status === 'new' || customer.status === 'contacted').length,
    demos: customers.filter((customer) => customer.status === 'demo_ready').length,
    confirmed: customers.filter((customer) => customer.status === 'confirmed' || customer.status === 'completed').length,
  }), [customers]);

  const updateEditor = <Key extends keyof CustomerEditor>(key: Key, value: CustomerEditor[Key]) => {
    setEditor((current) => ({ ...current, [key]: value }));
  };

  const showMessage = (value: string) => {
    setMessage(value);
    window.setTimeout(() => setMessage(''), 3200);
  };

  const uploadTemplatePackage = async (file: File) => {
    if (!session || templateUploading) return;
    setTemplateUploading(true);
    setError('');
    try {
      const activeSession = await refreshAdminSession(readAdminSession() ?? session);
      const uploaded = await uploadCustomTemplate(file, activeSession.accessToken);
      setCustomTemplates((current) => [uploaded, ...current.filter((template) => template.id !== uploaded.id)]);
      updateEditor('selectedTemplateId', uploaded.id);
      showMessage(`Đã tải mẫu riêng “${uploaded.name}” và chọn cho hồ sơ này.`);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Không thể tải gói mẫu ZIP lên.');
    } finally { setTemplateUploading(false); }
  };

  const saveCustomer = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!session) return;
    if (!editor.fullName.trim() || !editor.phone.trim()) {
      setError('Người liên hệ và số điện thoại là bắt buộc.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const activeSession = await refreshAdminSession(readAdminSession() ?? session);
      const saved = isNewCustomer || !selectedCustomer
        ? await createCustomer(activeSession, editor)
        : await updateCustomer(activeSession, selectedCustomer.id, editor);
      setIsNewCustomer(false);
      await loadData(saved.id);
      showMessage('Đã lưu thông tin khách hàng.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Không thể lưu khách hàng.');
    } finally {
      setSaving(false);
    }
  };

  const publishDemo = async () => {
    if (!session || !selectedCustomer || mediaSelection?.customerId !== selectedCustomer.id || publishing.current) return;
    if (!editor.selectedTemplateId) {
      setError('Hãy chọn mẫu thiệp trước khi tạo demo.');
      return;
    }
    if (demoPhotos.length && !demoPhotos.some((photo) => photo.role === 'cover')) {
      setError('Hãy chọn một ảnh bìa cho demo.');
      return;
    }
    const expiry = demoExpiry ? new Date(`${demoExpiry}T23:59:59`) : null;
    if (expiry && !(expiry.getTime() > Date.now())) {
      setError('Ngày hết hạn của demo phải ở trong tương lai.');
      return;
    }
    publishing.current = true;
    setActionLoading('demo');
    setError('');
    try {
      const activeSession = await refreshAdminSession(readAdminSession() ?? session);
      if (JSON.stringify(customerToEditor(selectedCustomer)) !== JSON.stringify(editor)) {
        await updateCustomer(activeSession, selectedCustomer.id, editor);
      }
      const expiresAt = expiry?.toISOString() ?? null;
      const input = {
        customerId: selectedCustomer.id,
        templateId: editor.selectedTemplateId,
        note: demoNote,
        expiresAt,
        payload: {
          brideName: editor.brideName,
          groomName: editor.groomName,
          weddingDate: editor.weddingDate,
          weddingTime: editor.weddingTime,
          venue: editor.venue,
          address: editor.address,
          message: editor.message,
          coverUrl: editor.coverUrl,
          ...(demoPhotos.length ? { photos: demoPhotos.map(({ url: _url, ...photo }) => photo) } : {}),
          studio: { ...studioConfig, musicUrl: musicUrlForStudio(studioConfig) },
          customTemplateId: selectedCustomTemplate?.id ?? null,
        },
      };
      const fingerprint = JSON.stringify(input);
      if (publishAttempt.current?.fingerprint !== fingerprint) {
        publishAttempt.current = { fingerprint, id: crypto.randomUUID() };
      }
      const demo = await createDemo(activeSession, { ...input, id: publishAttempt.current.id });
      if (!['confirmed', 'completed'].includes(editor.status)) {
        await updateCustomer(activeSession, selectedCustomer.id, { status: 'demo_ready', selectedTemplateId: editor.selectedTemplateId });
      }
      await loadData(selectedCustomer.id);
      await copyPreviewLink(demo.publicToken);
      showMessage('Đã tạo demo và sao chép link preview.');
      publishAttempt.current = undefined;
    } catch (demoError) {
      setError(demoError instanceof Error ? demoError.message : 'Không thể tạo demo.');
    } finally {
      publishing.current = false;
      setActionLoading('');
    }
  };

  const saveStudioConfig = async () => {
    if (!session || !selectedCustomer || actionLoading) return;
    const demo = customerDemos[0];
    if (!demo) {
      await publishDemo();
      return;
    }
    setActionLoading(`studio:${demo.id}`);
    setError('');
    try {
      const activeSession = await refreshAdminSession(readAdminSession() ?? session);
      await updateCustomer(activeSession, selectedCustomer.id, editor);
      const photos = demoPhotos.length
        ? demoPhotos.map(({ url: _url, ...photo }) => photo)
        : demo.payload.photos ?? [];
      await updateDemo(activeSession, demo.id, {
        templateId: editor.selectedTemplateId,
        payload: {
          ...demo.payload,
          brideName: editor.brideName,
          groomName: editor.groomName,
          weddingDate: editor.weddingDate,
          weddingTime: editor.weddingTime,
          venue: editor.venue,
          address: editor.address,
          message: editor.message,
          coverUrl: editor.coverUrl,
          photos,
          studio: { ...studioConfig, musicUrl: musicUrlForStudio(studioConfig) },
        },
      });
      await loadData(selectedCustomer.id);
      setStudioOpen(false);
      showMessage('Đã lưu cấu hình Studio vào demo. Link preview hiện tại vẫn được giữ nguyên.');
    } catch (studioError) {
      setError(studioError instanceof Error ? studioError.message : 'Không thể lưu cấu hình Studio.');
    } finally {
      setActionLoading('');
    }
  };

  const copyPreviewLink = async (token: string) => {
    const url = `${window.location.origin}/preview/${token}`;
    try { await navigator.clipboard.writeText(url); } catch { window.prompt('Sao chép link preview:', url); }
  };

  const copyInvitationLink = async (slug: string) => {
    const url = publicInvitationUrl(slug);
    try { await navigator.clipboard.writeText(url); } catch { window.prompt('Sao chép link thiệp chính thức:', url); }
  };

  const saveCurrentDemoSettings = async (activeSession: AdminSession, demo: InvitationDemoRecord) => {
    if (!selectedCustomer) return;
    const photos = mediaSelection?.customerId === selectedCustomer.id
      ? demoPhotos.map(({ url: _url, ...photo }) => photo)
      : demo.payload.photos ?? [];
    await updateDemo(activeSession, demo.id, {
      templateId: editor.selectedTemplateId || demo.templateId,
      payload: {
        ...demo.payload,
        brideName: editor.brideName,
        groomName: editor.groomName,
        weddingDate: editor.weddingDate,
        weddingTime: editor.weddingTime,
        venue: editor.venue,
        address: editor.address,
        message: editor.message,
        coverUrl: editor.coverUrl,
        photos,
        studio: { ...studioConfig, musicUrl: musicUrlForStudio(studioConfig) },
        customTemplateId: selectedCustomTemplate?.id ?? null,
      },
    });
  };

  const publishLiveDemo = async (demo: InvitationDemoRecord) => {
    if (!session || !selectedCustomer || !['confirmed', 'completed'].includes(selectedCustomer.status)) return;
    setActionLoading(`publish:${demo.id}`);
    setError('');
    try {
      const activeSession = await refreshAdminSession(readAdminSession() ?? session);
      await updateCustomer(activeSession, selectedCustomer.id, { ...editor, status: selectedCustomer.status });
      await saveCurrentDemoSettings(activeSession, demo);
      const result = await mediaRequest<{ slug: string }>('publish-invitation', {
        customerId: selectedCustomer.id, demoId: demo.id,
      }, activeSession.accessToken);
      await loadData(selectedCustomer.id);
      await copyInvitationLink(result.slug);
      showMessage('Đã tạo link thiệp chính thức và sao chép vào clipboard.');
    } catch (publishError) {
      setError(publishError instanceof Error ? publishError.message : 'Không thể tạo link thiệp chính thức.');
    } finally { setActionLoading(''); }
  };

  const confirmOrder = async () => {
    if (!session || !selectedCustomer) return;
    setActionLoading('confirm');
    try {
      const activeSession = await refreshAdminSession(readAdminSession() ?? session);
      const demo = customerDemos[0];
      await updateCustomer(activeSession, selectedCustomer.id, { ...editor, status: 'confirmed' });
      if (demo) await saveCurrentDemoSettings(activeSession, demo);
      const liveLink = demo
        ? await mediaRequest<{ slug: string }>('publish-invitation', {
          customerId: selectedCustomer.id, demoId: demo.id,
        }, activeSession.accessToken)
        : null;
      await loadData(selectedCustomer.id);
      if (liveLink) {
        await copyInvitationLink(liveLink.slug);
        showMessage('Đã xác nhận, tạo link thiệp chính thức và sao chép link.');
      } else {
        showMessage('Đã xác nhận khách đặt mẫu. Chọn demo để tạo link thiệp chính thức hoặc xuất ZIP.');
      }
    } catch (confirmError) {
      setError(confirmError instanceof Error ? confirmError.message : 'Không thể xác nhận đơn.');
    } finally { setActionLoading(''); }
  };

  const removeDemo = async (demo: InvitationDemoRecord) => {
    if (!session || actionLoading) return;
    const confirmed = window.confirm('Xóa demo này? Link preview và link thiệp chính thức gắn với demo sẽ ngừng hoạt động.');
    if (!confirmed) return;
    setActionLoading(`delete:${demo.id}`);
    setError('');
    try {
      const activeSession = await refreshAdminSession(readAdminSession() ?? session);
      await mediaRequest<{ ok: boolean }>('delete-demo', {
        customerId: demo.customerId, demoId: demo.id,
      }, activeSession.accessToken);
      await loadData(selectedCustomerId ?? undefined);
      showMessage('Đã xóa demo và các link đang trỏ tới demo này.');
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Không thể xóa demo.');
    } finally { setActionLoading(''); }
  };

  const removeCustomer = async () => {
    if (!session || !selectedCustomer || actionLoading || saving) return;
    const customer = selectedCustomer;
    const displayName = customer.brideName && customer.groomName
      ? `${customer.brideName} & ${customer.groomName}`
      : customer.fullName;
    const confirmed = window.confirm(
      `Xóa khách hàng ${displayName}? Thao tác này sẽ xóa hồ sơ, ảnh trên máy chủ và Google Drive, demo, link preview/thiệp chính thức và ZIP đã xuất. Không thể hoàn tác. Mẫu tùy chỉnh dùng chung sẽ được giữ lại.`,
    );
    if (!confirmed) return;

    setActionLoading(`delete-customer:${customer.id}`);
    setError('');
    try {
      const activeSession = await refreshAdminSession(readAdminSession() ?? session);
      await mediaRequest<{ ok: boolean }>('delete-customer', { customerId: customer.id }, activeSession.accessToken);

      const nextCustomers = customers.filter((item) => item.id !== customer.id);
      const nextCustomer = nextCustomers[0] ?? null;
      setCustomers(nextCustomers);
      setDemos((current) => current.filter((demo) => demo.customerId !== customer.id));
      setPublishedInvitations((current) => current.filter((invitation) => invitation.customerId !== customer.id));
      setMediaSelection((current) => current?.customerId === customer.id ? undefined : current);
      if (selectedCustomerId === customer.id) {
        setSelectedCustomerId(nextCustomer?.id ?? null);
        setEditor(nextCustomer ? customerToEditor(nextCustomer) : emptyCustomer);
        setIsNewCustomer(false);
        setStudioOpen(false);
      }
      showMessage(`Đã xóa khách hàng ${displayName} cùng dữ liệu liên quan.`);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Không thể xóa khách hàng.');
    } finally { setActionLoading(''); }
  };

  const expireDemo = async (demo: InvitationDemoRecord) => {
    if (!session) return;
    const reopening = demo.status === 'expired';
    const now = Date.now();
    const needsNewExpiry = reopening && demo.expiresAt && Date.parse(demo.expiresAt) <= now;
    const newExpiry = demoExpiry ? new Date(`${demoExpiry}T23:59:59`) : null;
    if (needsNewExpiry && (!newExpiry || !(newExpiry.getTime() > now))) {
      setError('Link đã quá hạn. Hãy chọn ngày hết hạn mới trong phần tạo demo rồi mở lại link.');
      return;
    }
    setError('');
    setActionLoading(`expire:${demo.id}`);
    try {
      const activeSession = await refreshAdminSession(readAdminSession() ?? session);
      await updateDemo(activeSession, demo.id, {
        status: reopening ? 'published' : 'expired',
        ...(needsNewExpiry && newExpiry ? { expiresAt: newExpiry.toISOString() } : {}),
      });
      await loadData(selectedCustomerId ?? undefined);
      showMessage(demo.status === 'expired' ? 'Đã mở lại link demo.' : 'Đã khóa link demo.');
    } catch (demoError) {
      setError(demoError instanceof Error ? demoError.message : 'Không thể cập nhật link demo.');
    } finally { setActionLoading(''); }
  };

  const applyPhotosToDemo = async (demo: InvitationDemoRecord) => {
    if (!session || !selectedCustomer || demo.customerId !== selectedCustomer.id || !demoPhotos.length || actionLoading) return;
    if (!demoPhotos.some((photo) => photo.role === 'cover')) {
      setError('Hãy chọn một ảnh bìa trước khi áp dụng ảnh.');
      return;
    }
    setActionLoading(`photos:${demo.id}`);
    setError('');
    try {
      const activeSession = await refreshAdminSession(readAdminSession() ?? session);
      await updateDemo(activeSession, demo.id, {
        payload: { ...demo.payload, photos: demoPhotos.map(({ url: _url, ...photo }) => photo) },
      });
      await loadData(selectedCustomer.id);
      showMessage('Đã cập nhật ảnh cho link preview và các lần xuất ZIP tiếp theo.');
    } catch (photoError) {
      setError(photoError instanceof Error ? photoError.message : 'Không thể cập nhật ảnh demo.');
    } finally {
      setActionLoading('');
    }
  };

  const exportZip = async (demo: InvitationDemoRecord) => {
    if (!session || !selectedCustomer) return;
    setActionLoading(`export:${demo.id}`);
    setError('');
    try {
      const activeSession = await refreshAdminSession(readAdminSession() ?? session);
      const response = await fetch('/api/export-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${activeSession.accessToken}` },
        body: JSON.stringify({ customerId: selectedCustomer.id, demoId: demo.id }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({ message: 'Không thể xuất file ZIP.' }));
        throw new Error(payload.message || 'Không thể xuất file ZIP.');
      }
      const fromStorage = response.headers.get('content-type')?.includes('application/json');
      const href = fromStorage ? (await response.json() as { downloadUrl: string }).downloadUrl : URL.createObjectURL(await response.blob());
      const link = document.createElement('a');
      link.href = href;
      link.download = `thiep-cuoi-${selectedCustomer.brideName}-${selectedCustomer.groomName}.zip`
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9.-]+/g, '-').toLowerCase();
      link.click();
      if (!fromStorage) window.setTimeout(() => URL.revokeObjectURL(href), 30_000);
      await loadData(selectedCustomer.id);
      showMessage('Đã xuất source code thiệp cưới thành file ZIP.');
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : 'Không thể xuất file ZIP.');
    } finally { setActionLoading(''); }
  };

  const importEditedZip = async (demo: InvitationDemoRecord, file: File) => {
    if (!session || !selectedCustomer || demo.customerId !== selectedCustomer.id || actionLoading) return;
    setActionLoading(`import:${demo.id}`);
    setError('');
    try {
      const activeSession = await refreshAdminSession(readAdminSession() ?? session);
      const result = await uploadEditedInvitationZip(file, selectedCustomer.id, demo.id, activeSession.accessToken);
      await loadData(selectedCustomer.id);
      showMessage(`Đã cập nhật thiệp từ ZIP: ${result.name}. Preview và link thiệp chính thức dùng bản mới.`);
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : 'Không thể cập nhật thiệp từ ZIP.');
    } finally { setActionLoading(''); }
  };

  const signOut = () => {
    clearAdminSession();
    setSession(null);
    navigateTo('/admin/login');
  };

  const startNewCustomer = () => {
    setIsNewCustomer(true);
    setSelectedCustomerId(null);
    setEditor(emptyCustomer);
    setError('');
  };

  if (loading && !customers.length) {
    return <main className="admin-loading" role="status"><LoaderCircle className="is-spinning" /><span>Đang tải trung tâm quản trị...</span></main>;
  }

  return (
    <main className="admin-app">
      <aside className="admin-sidebar">
        <a href="/admin" onClick={(event) => { event.preventDefault(); navigateTo('/admin'); }}>
          <span><Sparkles aria-hidden="true" /></span>
          <b>Wedding MP</b>
          <small>Studio Console</small>
        </a>
        <nav aria-label="Điều hướng quản trị">
          <button type="button" className="is-active"><LayoutDashboard aria-hidden="true" /> Tổng quan</button>
          <button type="button" onClick={() => document.querySelector('.admin-customer-list')?.scrollIntoView()}><Users aria-hidden="true" /> Khách hàng</button>
          <button type="button" onClick={() => document.querySelector('.admin-demo-panel')?.scrollIntoView()}><WandSparkles aria-hidden="true" /> Demo khách</button>
        </nav>
        <div className="admin-sidebar__profile">
          <span><UserRound aria-hidden="true" /></span>
          <div><b>{profile?.displayName ?? 'Quản trị viên'}</b><small>{profile?.email}</small></div>
          <button type="button" onClick={signOut} aria-label="Đăng xuất"><LogOut aria-hidden="true" /></button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div><p>Trung tâm vận hành</p><h1>Khách hàng &amp; demo thiệp cưới</h1></div>
          <div>
            <button type="button" onClick={() => void loadData(selectedCustomerId ?? undefined)}><RefreshCw aria-hidden="true" /> Làm mới</button>
            <button type="button" className="is-primary" onClick={startNewCustomer}><Plus aria-hidden="true" /> Thêm khách</button>
          </div>
        </header>

        {message && <div className="admin-toast" role="status"><Check aria-hidden="true" /> {message}</div>}
        {error && <div className="admin-alert is-error" role="alert">{error}<button type="button" onClick={() => setError('')}>×</button></div>}

        <section className="admin-stats" aria-label="Thống kê khách hàng">
          <article><span><Users /></span><div><small>Tổng khách hàng</small><strong>{stats.total}</strong></div></article>
          <article><span><UserRound /></span><div><small>Đang tư vấn</small><strong>{stats.waiting}</strong></div></article>
          <article><span><WandSparkles /></span><div><small>Đang xem demo</small><strong>{stats.demos}</strong></div></article>
          <article><span><FileArchive /></span><div><small>Đã xác nhận</small><strong>{stats.confirmed}</strong></div></article>
        </section>

        <section className="admin-workspace">
          <div className="admin-customer-list">
            <div className="admin-panel-heading"><div><p>CRM khách hàng</p><h2>Danh sách yêu cầu</h2></div><span>{filteredCustomers.length}</span></div>
            <div className="admin-list-tools">
              <label><Search aria-hidden="true" /><input placeholder="Tìm tên, SĐT, email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | CustomerStatus)}>
                <option value="all">Tất cả trạng thái</option>
                {customerStatuses.map((status) => <option key={status} value={status}>{customerStatusLabels[status]}</option>)}
              </select>
            </div>
            <div className="admin-customer-list__items">
              {filteredCustomers.map((customer) => (
                <button
                  type="button"
                  key={customer.id}
                  className={selectedCustomerId === customer.id && !isNewCustomer ? 'is-active' : ''}
                  onClick={() => { setIsNewCustomer(false); setSelectedCustomerId(customer.id); setEditor(customerToEditor(customer)); }}
                >
                  <span className="admin-customer-avatar">{(customer.brideName || customer.fullName || '?').charAt(0)}</span>
                  <span><b>{customer.brideName && customer.groomName ? `${customer.brideName} & ${customer.groomName}` : customer.fullName}</b><small>{customer.phone || customer.email || 'Chưa có liên hệ'}</small></span>
                  <i className={`status-${customer.status}`}>{customerStatusLabels[customer.status]}</i>
                  <time>{formatDate(customer.createdAt)}</time>
                </button>
              ))}
              {!filteredCustomers.length && <div className="admin-empty"><Users /><p>Chưa có khách hàng phù hợp bộ lọc.</p></div>}
            </div>
          </div>

          <div className="admin-customer-detail">
            <div className="admin-panel-heading">
              <div><p>{isNewCustomer ? 'Hồ sơ mới' : 'Thông tin khách hàng'}</p><h2>{isNewCustomer ? 'Thêm khách hàng' : selectedCustomer ? `${selectedCustomer.brideName} & ${selectedCustomer.groomName}` : 'Chọn một khách hàng'}</h2></div>
              {selectedCustomer && <span className={`status-${selectedCustomer.status}`}>{customerStatusLabels[selectedCustomer.status]}</span>}
            </div>

            {(isNewCustomer || selectedCustomer) ? (
              <form className="admin-customer-form" onSubmit={saveCustomer}>
                <div className="admin-form-grid">
                  <label>Người liên hệ <b>*</b><input value={editor.fullName} onChange={(e) => updateEditor('fullName', e.target.value)} /></label>
                  <label>Số điện thoại <b>*</b><input value={editor.phone} onChange={(e) => updateEditor('phone', e.target.value)} /></label>
                  <label>Email<input type="email" value={editor.email} onChange={(e) => updateEditor('email', e.target.value)} /></label>
                  <label>Nguồn khách<input value={editor.source} onChange={(e) => updateEditor('source', e.target.value)} /></label>
                  <label>Tên cô dâu<input value={editor.brideName} onChange={(e) => updateEditor('brideName', e.target.value)} /></label>
                  <label>Tên chú rể<input value={editor.groomName} onChange={(e) => updateEditor('groomName', e.target.value)} /></label>
                  <label>Ngày cưới<input type="date" value={editor.weddingDate} onChange={(e) => updateEditor('weddingDate', e.target.value)} /></label>
                  <label>Giờ đón khách<input type="time" value={editor.weddingTime} onChange={(e) => updateEditor('weddingTime', e.target.value)} /></label>
                  <label className="is-wide">Địa điểm<input value={editor.venue} onChange={(e) => updateEditor('venue', e.target.value)} /></label>
                  <label className="is-wide">Địa chỉ<input value={editor.address} onChange={(e) => updateEditor('address', e.target.value)} /></label>
                  <label className="is-wide">Lời mời<textarea rows={3} value={editor.message} onChange={(e) => updateEditor('message', e.target.value)} /></label>
                  <label className="is-wide">Ảnh cover URL<input type="url" value={editor.coverUrl} onChange={(e) => updateEditor('coverUrl', e.target.value)} placeholder="Để trống để dùng thumbnail của mẫu" /></label>
                  <label>Mẫu thiệp
                    <select value={editor.selectedTemplateId} onChange={(e) => updateEditor('selectedTemplateId', e.target.value)}>
                      <option value="">Chọn mẫu</option>
                      {weddingTemplates.filter((item) => item.route).map((template) => <option key={template.id} value={template.id}>{template.name}</option>)}
                    </select>
                  </label>
                  <label>Trạng thái
                    <select value={editor.status} onChange={(e) => updateEditor('status', e.target.value as CustomerStatus)}>
                      {customerStatuses.map((status) => <option key={status} value={status}>{customerStatusLabels[status]}</option>)}
                    </select>
                  </label>
                  <label className="is-wide">Ghi chú nội bộ<textarea rows={3} value={editor.notes} onChange={(e) => updateEditor('notes', e.target.value)} /></label>
                </div>
                <div className="admin-form-actions">
                  {isNewCustomer && <button type="button" onClick={() => { setIsNewCustomer(false); setSelectedCustomerId(customers[0]?.id ?? null); }}>Hủy</button>}
                  {selectedCustomer && !isNewCustomer && <button type="button" className="is-danger" onClick={() => void removeCustomer()} disabled={Boolean(actionLoading) || saving}>
                    {actionLoading === `delete-customer:${selectedCustomer.id}` ? <LoaderCircle className="is-spinning" /> : <Trash2 />} Xóa khách hàng
                  </button>}
                  <button type="submit" className="is-primary" disabled={saving}>{saving ? <LoaderCircle className="is-spinning" /> : <Save />} {saving ? 'Đang lưu...' : 'Lưu hồ sơ'}</button>
                </div>
              </form>
            ) : <div className="admin-empty is-large"><UserRound /><p>Chọn khách hàng để xem và chỉnh sửa hồ sơ.</p></div>}
          </div>
        </section>

        {selectedCustomer && !isNewCustomer && (
          <section className="admin-demo-panel">
            <div className="admin-panel-heading"><div><p>Demo Studio</p><h2>Tạo và quản lý link preview</h2></div><div className="admin-demo-panel__heading-actions"><span>{customerDemos.length} demo</span><button type="button" className="is-primary" onClick={() => setStudioOpen((open) => !open)}><WandSparkles aria-hidden="true" /> {studioOpen ? 'Đóng Studio' : 'Mở Studio'}</button></div></div>
            {studioOpen && <AdminStudioEditor
              customer={editor}
              config={studioConfig}
              onConfigChange={setStudioConfig}
              onCustomerChange={(key, value) => updateEditor(key, value)}
              onSave={() => void saveStudioConfig()}
              saving={actionLoading.startsWith('studio:') || actionLoading === 'demo'}
              customTemplates={customTemplates}
              onTemplateUpload={(file) => void uploadTemplatePackage(file)}
              templateUploading={templateUploading}
              mediaLibrary={session ? <CustomerPhotoLibrary key={selectedCustomer.id} customerId={selectedCustomer.id}
                accessToken={session.accessToken} selection={demoPhotos} onLoad={loadCustomerPhotos} disabled={Boolean(actionLoading)}
                onSelect={(photos) => setMediaSelection({ customerId: selectedCustomer.id, photos })} /> : null}
              mediaCount={demoPhotos.length}
              preview={studioPreview}
              previewLabel={selectedTemplateName}
            />}
            <div className="admin-demo-builder">
              {!studioOpen && <div className="admin-demo-preview">{studioPreview}</div>}
              <div className="admin-demo-controls">
                <label>Ghi chú hiển thị trên popup<textarea rows={4} value={demoNote} onChange={(e) => setDemoNote(e.target.value)} /></label>
                <label>Ngày hết hạn<input type="date" value={demoExpiry} onChange={(e) => setDemoExpiry(e.target.value)} /></label>
                <button type="button" className="is-primary" onClick={publishDemo} disabled={Boolean(actionLoading) || mediaSelection?.customerId !== selectedCustomer.id}>
                  {actionLoading === 'demo' ? <LoaderCircle className="is-spinning" /> : <Link2 />} Tạo link preview
                </button>
                <button type="button" onClick={confirmOrder} disabled={selectedCustomer.status === 'confirmed' || selectedCustomer.status === 'completed' || actionLoading === 'confirm'}>
                  <Check /> {selectedCustomer.status === 'confirmed' || selectedCustomer.status === 'completed' ? 'Khách đã xác nhận' : 'Xác nhận khách đặt mẫu'}
                </button>
              </div>
            </div>

            <div className="admin-demo-list">
              <input ref={zipInputRef} className="admin-demo-zip-input" type="file" accept=".zip,application/zip"
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0];
                  const demo = customerDemos.find((item) => item.id === zipTargetDemoId);
                  event.currentTarget.value = '';
                  if (file && demo) void importEditedZip(demo, file);
                }} />
              {customerDemos.map((demo) => {
                const previewUrl = `${window.location.origin}/preview/${demo.publicToken}`;
                const canExport = selectedCustomer.status === 'confirmed' || selectedCustomer.status === 'completed';
                const publishedSlug = publishedInvitations.find((item) => item.demoId === demo.id)?.slug;
                const invitationUrl = publishedSlug ? publicInvitationUrl(publishedSlug) : '';
                return (
                  <article key={demo.id}>
                    <span className={demo.status === 'published' ? 'is-live' : ''}><i /> {demo.status === 'published' ? 'Đang hoạt động' : 'Đã khóa'}</span>
                    <div><b>{weddingTemplates.find((item) => item.id === demo.templateId)?.name ?? customTemplates.find((item) => item.id === demo.templateId)?.name ?? demo.templateId}</b><small>Tạo {formatDate(demo.createdAt)}{demo.expiresAt ? ` · Hết hạn ${formatDate(demo.expiresAt)}` : ''}</small></div>
                    <label><input readOnly value={previewUrl} /><button type="button" onClick={() => void copyPreviewLink(demo.publicToken)} aria-label="Sao chép link"><Clipboard /></button><a href={previewUrl} target="_blank" rel="noreferrer" aria-label="Mở preview"><ExternalLink /></a></label>
                    {publishedSlug && <label className="admin-demo-live-link"><input readOnly value={invitationUrl} aria-label="Link thiệp chính thức" /><button type="button" onClick={() => void copyInvitationLink(publishedSlug)} aria-label="Sao chép link thiệp"><Clipboard /></button><a href={invitationUrl} target="_blank" rel="noreferrer" aria-label="Mở thiệp chính thức"><ExternalLink /></a></label>}
                    <small className="admin-demo-zip-hint">Tải ZIP mới nhất, sửa index.html hoặc styles.css, rồi nạp lại vào đúng demo để cập nhật preview và link thiệp.</small>
                    <div className="admin-demo-list__actions">
                      <button type="button" onClick={() => void expireDemo(demo)}><Archive /> {demo.status === 'expired' ? 'Mở lại' : 'Khóa link'}</button>
                      {canExport && !publishedSlug && <button type="button" onClick={() => void publishLiveDemo(demo)} disabled={Boolean(actionLoading)}>
                        {actionLoading === `publish:${demo.id}` ? <LoaderCircle className="is-spinning" /> : <Link2 />} Tạo link thiệp thực tế
                      </button>}
                      {!!demoPhotos.length && <button type="button" disabled={Boolean(actionLoading)} onClick={() => void applyPhotosToDemo(demo)}>
                        {actionLoading === `photos:${demo.id}` ? <LoaderCircle className="is-spinning" /> : <Check />} Áp dụng ảnh đã chọn
                      </button>}
                      <button type="button" className="is-primary" disabled={!canExport || Boolean(actionLoading)} title={canExport ? 'Xuất source code ZIP' : 'Cần xác nhận khách đặt mẫu trước'} onClick={() => void exportZip(demo)}>
                        {actionLoading === `export:${demo.id}` ? <LoaderCircle className="is-spinning" /> : <Download />} Xuất code ZIP
                      </button>
                      <button type="button" disabled={Boolean(actionLoading)} title="Tải ZIP đã chỉnh sửa để cập nhật thiệp" onClick={() => {
                        setZipTargetDemoId(demo.id);
                        zipInputRef.current?.click();
                      }}>
                        {actionLoading === `import:${demo.id}` ? <LoaderCircle className="is-spinning" /> : <Upload />} Cập nhật từ ZIP
                      </button>
                      <button type="button" className="is-danger" disabled={Boolean(actionLoading)} onClick={() => void removeDemo(demo)} title="Xóa demo và các link gắn với demo">
                        {actionLoading === `delete:${demo.id}` ? <LoaderCircle className="is-spinning" /> : <Trash2 />} Xóa demo
                      </button>
                    </div>
                    {session && <AdminDemoRsvpPanel demoId={demo.id} accessToken={session.accessToken} />}
                    {session && <AdminDemoWishesPanel demoId={demo.id} accessToken={session.accessToken} />}
                  </article>
                );
              })}
              {!customerDemos.length && <div className="admin-empty"><WandSparkles /><p>Chưa có demo. Chọn mẫu và tạo link preview đầu tiên.</p></div>}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
