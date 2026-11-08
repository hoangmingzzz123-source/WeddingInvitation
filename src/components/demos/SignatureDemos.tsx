import { useEffect, useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  Heart,
  MapPin,
  MessageCircleHeart,
  Play,
  X,
} from 'lucide-react';
import { MusicPlayer } from '../MusicPlayer';
import { weddingTemplates, type TemplateTier } from '../../data/templates';
import type { InvitationHiddenSection } from '../../types/admin';
import { isGroomInvitationSide, orderedInvitationNames, currentInvitationSide } from '../../utils/invitationSide';
import { buildVietQrUrl, isValidWeddingQrAccount, type WeddingQrAccount, type WeddingQrAccounts } from '../../data/vietQr';
import {
  VIETNAM_WEDDING_THEMES,
  type VietnamWeddingTheme,
} from '../../data/vietnamWeddingPhotos';

export type SignatureDemoId = string;
export type SignatureTheme = 'template' | 'champagne' | 'blush' | 'emerald';
export type SignatureFont = 'editorial' | 'modern' | 'classic';
export type SignatureRsvpQuestion = 'transport' | 'meal';

export interface SignatureDemoCustomization {
  tier?: TemplateTier;
  bride?: string;
  groom?: string;
  date?: string;
  dateLabel?: string;
  ceremonyDateLabel?: string;
  receptionDateLabel?: string;
  time?: string;
  ceremonyTime?: string;
  receptionTime?: string;
  hiddenSections?: InvitationHiddenSection[];
  ceremonyAddress?: string;
  receptionAddress?: string;
  venue?: string;
  address?: string;
  city?: string;
  headerMonogramText?: string;
  story?: string;
  ceremonyTitle?: string;
  receptionTitle?: string;
  heroKicker?: string;
  albumTitle?: string;
  timeLabel?: string;
  venueLabel?: string;
  signatureText?: string;
  theme?: SignatureTheme;
  fontStyle?: SignatureFont;
  musicUrl?: string;
  videoLink?: string;
  qrSeparateSides?: boolean;
  qrAccounts?: WeddingQrAccounts;
  hero?: string;
  heroPosition?: string;
  mainPhoto?: string;
  mainPhotoPosition?: string;
  videoBackground?: string;
  videoBackgroundPosition?: string;
  gallery?: string[];
  galleryPositions?: string[];
}

export interface SignatureRsvpPayload {
  name: string;
  attending: 'yes' | 'no';
  guestCount: number;
  answers: Partial<Record<SignatureRsvpQuestion, string>>;
  email?: string;
  message?: string;
  side?: 'groom' | 'bride' | null;
}

export interface SignatureWishPayload {
  name: string;
  message: string;
  side?: 'groom' | 'bride' | null;
}

export interface SignatureWishEntry extends SignatureWishPayload {
  id: string;
  submittedAt: string;
}

interface SignatureDemoProps {
  id: SignatureDemoId;
  customization?: SignatureDemoCustomization;
  embedded?: boolean;
  showMusicPlayer?: boolean;
  startMusicOnFirstInteraction?: boolean;
  staticExport?: boolean;
  guestName?: string;
  guestGreeting?: 'formal' | 'friendly';
  rsvpQuestions?: SignatureRsvpQuestion[];
  existingSubmitted?: boolean;
  initialWishes?: SignatureWishEntry[];
  onRsvpSubmit?: (payload: SignatureRsvpPayload) => void | Promise<void>;
  onWishSubmit?: (payload: SignatureWishPayload) => void | Promise<void>;
}

interface SignatureDemoContent {
  id: SignatureDemoId;
  visualStyle?: string;
  tier: TemplateTier;
  label: string;
  bride: string;
  groom: string;
  date: string;
  dateLabel: string;
  time: string;
  venue: string;
  address: string;
  city: string;
  story: string;
  hero: string;
  gallery: string[];
}

const photoStory = (theme: VietnamWeddingTheme, offset = 0) => {
  const collection = VIETNAM_WEDDING_THEMES[theme];
  const photos = collection.map((_, index) => collection[(index + offset) % collection.length]);
  const [hero, ...gallery] = photos;
  return { hero, gallery };
};

const demos: Record<string, SignatureDemoContent> = {
  'sen-ngoc': {
    id: 'sen-ngoc', tier: '159k', label: 'SEN NGỌC · THANH ÂM HẠNH PHÚC',
    bride: 'An Nhiên', groom: 'Minh Khôi', date: '2027-11-20', dateLabel: '20 · 11 · 2027', time: '17:30',
    venue: 'Nhà vườn An Hiên', address: 'Địa điểm minh họa · vui lòng thay khi tạo thiệp', city: 'Huế',
    story: 'Từ một lời chào thân quen, chúng mình đã cùng đi qua những mùa thương nhớ. Nay xin gửi thiệp hồng, kính mời gia đình và bạn bè cùng nâng chén trà, chia sẻ niềm vui trong ngày hai nhà sum họp.',
    ...photoStory('heritage'),
  },
  'hy-su-do-son': {
    id: 'hy-su-do-son', tier: '159k', label: 'HỶ SỰ · TRĂM NĂM GIAI LÃO',
    bride: 'Thanh Trúc', groom: 'Đức Anh', date: '2027-11-20', dateLabel: '20 · 11 · 2027', time: '17:30',
    venue: 'Không gian tiệc Hỷ Viên', address: 'Địa điểm minh họa · vui lòng thay khi tạo thiệp', city: 'Hà Nội',
    story: 'Từ một lời chào thân quen, chúng mình đã cùng đi qua những mùa thương nhớ. Nay xin gửi thiệp hồng, kính mời gia đình và bạn bè cùng nâng chén trà, chia sẻ niềm vui trong ngày hai nhà sum họp.',
    ...photoStory('songHy'),
  },
  'pho-hoi': {
    id: 'pho-hoi', tier: '159k', label: 'PHỐ HỘI · MÌNH VỀ CHUNG NHÀ',
    bride: 'Hoài An', groom: 'Tuấn Kiệt', date: '2027-11-20', dateLabel: '20 · 11 · 2027', time: '17:30',
    venue: 'Vườn Nhà Hội', address: 'Địa điểm minh họa · vui lòng thay khi tạo thiệp', city: 'Hội An',
    story: 'Từ một lời chào thân quen, chúng mình đã cùng đi qua những mùa thương nhớ. Nay xin gửi thiệp hồng, kính mời gia đình và bạn bè cùng nâng chén trà, chia sẻ niềm vui trong ngày hai nhà sum họp.',
    ...photoStory('hoiAn'),
  },
  'verdant-veil': {
    id: 'verdant-veil', visualStyle: 'verdant-veil', tier: '199k', label: 'VERDANT VEIL · OUR MEMORIES',
    bride: 'Minh Thư', groom: 'Quang Anh', date: '2027-12-20', dateLabel: '20 · 12 · 2027', time: '17:30',
    venue: 'Verdant Garden', address: '12 Đặng Thai Mai, Tây Hồ', city: 'Hà Nội',
    story: 'Từ một lời chào rất khẽ, chúng mình đã đi cùng nhau qua nhiều mùa. Giữa khu vườn xanh và những người thân yêu, chúng mình muốn bắt đầu một chương mới thật bình yên.',
    ...photoStory('garden', 1),
  },
  'tui-minh-cuoi-roi': {
    id: 'tui-minh-cuoi-roi', visualStyle: 'playful-handdrawn', tier: '199k', label: 'TIN VUI NÈ · TỤI MÌNH CƯỚI RỒI!',
    bride: 'Ngọc Diệp', groom: 'Gia Huy', date: '2027-12-11', dateLabel: '11 · 12 · 2027', time: '18:00',
    venue: 'JW Marriott Hanoi', address: '8 Đỗ Đức Dục, Nam Từ Liêm', city: 'Hà Nội',
    story: 'Tụi mình đã cùng ăn thật nhiều món ngon, đi thật nhiều nơi và cười qua vô số chuyện nhỏ. Giờ thì tụi mình cưới nhau rồi — rất mong bạn đến quẩy và nâng ly cùng tụi mình!',
    ...photoStory('hanoiStudio', 1),
  },

  'art-deco-royal-basic': {
    id: 'art-deco-royal-basic', tier: '159k', label: 'THE GARDEN EDIT',
    bride: 'Ngọc Hà', groom: 'Bảo Long', date: '2027-03-13', dateLabel: '13 · 03 · 2027', time: '18:00',
    venue: 'The Garden Pavilion', address: '24 Quảng An, Tây Hồ', city: 'Hà Nội',
    story: 'Chúng mình gặp nhau trong một buổi chiều đầy nắng, rồi cùng vun đắp những ngày bình dị thành điều đẹp đẽ. Mong bạn có mặt để mở đầu chương mới ấy cùng chúng mình.',
    ...photoStory('garden'),
  },
  'art-deco-royal': {
    id: 'art-deco-royal', visualStyle: 'art-deco-royal-basic', tier: '199k', label: 'THE OLIVE GARDEN',
    bride: 'Ngọc Hà', groom: 'Bảo Long', date: '2027-03-13', dateLabel: '13 · 03 · 2027', time: '18:00',
    venue: 'The Garden Pavilion', address: '24 Quảng An, Tây Hồ', city: 'Hà Nội',
    story: 'Chúng mình gặp nhau trong một buổi chiều đầy nắng, rồi cùng vun đắp những ngày bình dị thành điều đẹp đẽ. Mong bạn có mặt để mở đầu chương mới ấy cùng chúng mình.',
    ...photoStory('garden', 2),
  },
  'luxury-gold-cinematic': {
    id: 'luxury-gold-cinematic', tier: '159k', label: 'A NIGHT TO REMEMBER',
    bride: 'Minh Anh', groom: 'Quang Huy', date: '2027-11-12', dateLabel: '12 · 11 · 2027', time: '18:30',
    venue: 'The Imperial Palace', address: '12 Nguyễn Huệ, Quận 1', city: 'TP. Hồ Chí Minh',
    story: 'Có những cuộc gặp khiến mọi khung hình sau đó đều trở nên đáng nhớ. Câu chuyện của chúng mình bắt đầu bằng một buổi chiều nhiều nắng và sẽ tiếp tục vào ngày hạnh phúc này.',
    ...photoStory('modernCeremony'),
  },
  'luxury-gold-frame': {
    id: 'luxury-gold-frame', tier: '159k', label: 'A CELEBRATION OF LOVE',
    bride: 'Khánh Linh', groom: 'Tuấn Anh', date: '2027-10-18', dateLabel: '18 · 10 · 2027', time: '17:30',
    venue: 'Riverside Palace', address: '360D Bến Vân Đồn, Quận 4', city: 'TP. Hồ Chí Minh',
    story: 'Một tình yêu bình yên, bền bỉ và luôn có chỗ cho tiếng cười. Sau những chuyến đi cùng nhau, chúng mình muốn bắt đầu chặng đường tiếp theo bên những người thân yêu nhất.',
    ...photoStory('hanoiStudio'),
  },
  'bloom-crystal-3d': {
    id: 'bloom-crystal-3d', tier: '199k', label: 'A LITTLE MORE MAGIC',
    bride: 'Mai Chi', groom: 'Đức Anh', date: '2027-12-18', dateLabel: '18 · 12 · 2027', time: '16:00',
    venue: 'The Glass Garden', address: '88 Nguyễn Du, Hai Bà Trưng', city: 'Hà Nội',
    story: 'Chúng mình tin những điều đẹp nhất thường lớn lên từ sự dịu dàng. Cảm ơn bạn đã là một phần trong câu chuyện; hãy cùng chúng mình viết chương mới dưới ánh đèn và những đóa hoa.',
    ...photoStory('hanoiStudio', 2),
  },
  'modern-dark-blue': {
    id: 'modern-dark-blue', tier: '109k', label: 'SAVE OUR DATE',
    bride: 'Lan Anh', groom: 'Minh Quân', date: '2027-09-06', dateLabel: '06 · 09 · 2027', time: '17:00',
    venue: 'Grand Convention Center', address: '15 Lê Duẩn, Quận 1', city: 'TP. Hồ Chí Minh',
    story: 'Một ngày thật đẹp đang đến gần. Chúng mình đã sẵn sàng cho lời hứa mới và sẽ vui hơn thật nhiều nếu có bạn cùng chung vui.',
    ...photoStory('modernCeremony', 2),
  },
  'minimal-elegant': {
    id: 'minimal-elegant', tier: '199k', label: 'TOGETHER, IN EVERY SEASON',
    bride: 'Thảo Vy', groom: 'Gia Bảo', date: '2027-05-22', dateLabel: '22 · 05 · 2027', time: '17:30',
    venue: 'The Atelier Garden', address: '27 Xuân Diệu, Tây Hồ', city: 'Hà Nội',
    story: 'Không cần điều gì quá lớn lao. Chỉ cần một mái nhà, những bữa cơm dài và người mình muốn kể nghe mọi chuyện. Chúng mình rất mong được gặp bạn trong ngày vui.',
    ...photoStory('hanoiStudio', 3),
  },
  'song-hy-contemporary': {
    id: 'song-hy-contemporary', tier: '159k', label: 'THIỆP HỒNG · SONG HỶ',
    bride: 'Minh Châu', groom: 'Đình Phúc', date: '2027-10-24', dateLabel: '24 · 10 · 2027', time: '17:30',
    venue: 'Gốm Sứ Palace', address: '45 Hàng Bông, Hoàn Kiếm', city: 'Hà Nội',
    story: 'Từ những lần trò chuyện bên tách trà đến một lời hẹn trăm năm, chúng mình đã cùng nhau đi qua nhiều mùa đáng nhớ. Ngày vui sẽ đẹp hơn khi có gia đình và bạn bè cùng chứng kiến.',
    ...photoStory('songHy', 2),
  },
  'riviera-blue': {
    id: 'riviera-blue', tier: '109k', label: 'A LITTLE LOVE BY THE SEA',
    bride: 'Hải Yến', groom: 'Trọng Nhân', date: '2027-06-19', dateLabel: '19 · 06 · 2027', time: '16:30',
    venue: 'La Mer Garden', address: '12 Võ Nguyên Giáp, Sơn Trà', city: 'Đà Nẵng',
    story: 'Chúng mình gặp nhau trong một chuyến đi và từ đó đã cùng nhau góp nhặt những ngày nhiều nắng. Hẹn gặp bạn bên biển để cùng nâng ly chúc mừng khởi đầu mới.',
    ...photoStory('coastal'),
  },
  'hoa-moc-editorial': {
    id: 'hoa-moc-editorial', tier: '159k', label: 'A GARDEN GATHERING',
    bride: 'Thùy Dương', groom: 'Hoàng Nam', date: '2027-04-10', dateLabel: '10 · 04 · 2027', time: '17:00',
    venue: 'Mộc Garden House', address: '18 Ngõ 36 Đào Tấn, Ba Đình', city: 'Hà Nội',
    story: 'Chúng mình yêu những điều mộc mạc: một khu vườn sau mưa, bữa tối kéo dài và câu chuyện chẳng cần vội kết thúc. Thật vui nếu bạn dành buổi chiều này để ở bên chúng mình.',
    ...photoStory('garden', 3),
  },
  'summer-postcard': {
    id: 'summer-postcard', tier: '199k', label: 'GREETINGS FROM OUR WEDDING',
    bride: 'Ngọc Mai', groom: 'Anh Khoa', date: '2027-08-08', dateLabel: '08 · 08 · 2027', time: '17:00',
    venue: 'The Coast Retreat', address: '24 Trần Phú, Nha Trang', city: 'Khánh Hòa',
    story: 'Chúng mình muốn ngày cưới giống như một chuyến đi mùa hè: đầy nắng, nhiều tiếng cười và có những người mình thương ở bên. Tấm thiệp này là lời nhắn nhỏ, mong bạn nhận lời ghé chơi.',
    ...photoStory('coastal', 2),
  },
};

function fallbackTheme(id: string): VietnamWeddingTheme {
  if (/(traditional|song-hy|hy-su|sen-ngoc|pho-hoi)/.test(id)) return 'songHy';
  if (/(riviera|summer|tropical)/.test(id)) return 'coastal';
  if (/(cinema|cinematic|dark|gold|vintage)/.test(id)) return 'modernCeremony';
  return 'hanoiStudio';
}

function fallbackStyle(id: string) {
  if (/verdant/.test(id)) return 'verdant-veil';
  if (/tui-minh|handdrawn|playful/.test(id)) return 'playful-handdrawn';
  if (/(traditional|song-hy|hy-su|sen-ngoc)/.test(id)) return 'song-hy-contemporary';
  if (/tropical/.test(id)) return 'tropical-sunset';
  if (/riviera/.test(id)) return 'riviera-blue';
  if (/bloom|crystal/.test(id)) return 'bloom-crystal-3d';
  if (/minimal-slide/.test(id)) return 'minimal-slide-clean';
  if (/minimal|classic/.test(id)) return 'minimal-elegant';
  if (/(watercolor|soft-fade|rose-storybook|blush)/.test(id)) return 'romantic-watercolor';
  if (/vintage/.test(id)) return 'vintage-film';
  if (/(floral|green)/.test(id)) return 'hoa-moc-editorial';
  if (/postcard/.test(id)) return 'summer-postcard';
  if (/(cinema|cinematic|dark|gold)/.test(id)) return 'luxury-gold-cinematic';
  return 'art-deco-royal-basic';
}

function fallbackDemo(id: string): SignatureDemoContent {
  const template = weddingTemplates.find((item) => item.id === id);
  const names = [
    ['Khánh An', 'Minh Quân'],
    ['Ngọc Mai', 'Đức Anh'],
    ['Thảo Nhi', 'Hoàng Nam'],
    ['Hải Yến', 'Gia Huy'],
  ];
  const identitySeed = Math.abs([...id].reduce((total, character) => total + character.charCodeAt(0), 0));
  const namePair = names[identitySeed % names.length];
  return {
    id,
    visualStyle: fallbackStyle(id),
    tier: template?.tier ?? '159k',
    label: template?.style.toLocaleUpperCase('vi') ?? 'A VIETNAMESE LOVE STORY',
    bride: namePair[0],
    groom: namePair[1],
    date: '2027-11-20',
    dateLabel: '20 · 11 · 2027',
    time: '17:30',
    venue: 'The Atelier Wedding Hall',
    address: 'Địa điểm minh họa · thay đổi trong Studio',
    city: fallbackTheme(id) === 'coastal' ? 'Đà Nẵng' : 'Việt Nam',
    story: 'Từ những ngày bình dị, chúng mình đã cùng vun đắp một hành trình nhiều yêu thương. Thật hạnh phúc khi được chia sẻ ngày khởi đầu mới với gia đình và những người bạn thân quý.',
    ...photoStory(fallbackTheme(id), identitySeed % 4),
  };
}

function SmallLabel({ children }: { children: string }) {
  return <p className="signature-eyebrow">{children}</p>;
}

function GuestBook({
  couple,
  initialWishes = [],
  onSubmit,
}: {
  couple: string;
  initialWishes?: SignatureWishEntry[];
  onSubmit?: (payload: SignatureWishPayload) => void | Promise<void>;
}) {
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState<Array<SignatureWishEntry | SignatureWishPayload>>(() => initialWishes.length
    ? initialWishes
    : onSubmit ? [] : [{ name: 'Bạn bè', message: 'Chúc hai bạn mãi hạnh phúc nhé!' }]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const addNote = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !note.trim() || submitting) return;
    const wish = { name: name.trim(), message: note.trim(), side: currentInvitationSide() };
    setSubmitting(true);
    setError('');
    try {
      await onSubmit?.(wish);
      setNotes((current) => [{ ...wish, id: crypto.randomUUID(), submittedAt: new Date().toISOString() }, ...current]);
      setName('');
      setNote('');
    } catch {
      setError('Chưa gửi được lời chúc. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="signature-guestbook">
      <div className="signature-guestbook__heading">
        <MessageCircleHeart aria-hidden="true" />
        <div><h3>Sổ lưu bút</h3><p>Gửi một lời chúc đến {couple}</p></div>
      </div>
      <form onSubmit={addNote}>
        <label className="visually-hidden" htmlFor="signature-guestbook-name">Tên của bạn</label>
        <input id="signature-guestbook-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Tên của bạn" maxLength={80} required />
        <label className="visually-hidden" htmlFor="signature-guestbook-note">Lời chúc</label>
        <textarea id="signature-guestbook-note" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Viết lời chúc của bạn..." maxLength={500} required />
        <button type="submit" disabled={submitting}>{submitting ? '...' : 'Gửi'}</button>
      </form>
      {error && <p className="signature-guestbook__error" role="alert">{error}</p>}
      <ul aria-label="Danh sách lời chúc">{notes.map((item, index) => (
        <li key={'id' in item ? item.id : `${item.name}-${item.message}-${index}`}>
          <span aria-hidden="true">{['🤍', '✨', '🌿'][index % 3]}</span>
          <span>
            <strong>{item.name}</strong>
            {item.message}
            {item.side && <small>{item.side === 'groom' ? 'Nhà trai' : 'Nhà gái'}</small>}
            {'submittedAt' in item && <time>{new Date(item.submittedAt).toLocaleString('vi-VN')}</time>}
          </span>
        </li>
      ))}</ul>
    </div>
  );
}

function DemoQrImage({ account, failed, onError }: { account?: WeddingQrAccount; failed: boolean; onError: () => void }) {
  const qrUrl = isValidWeddingQrAccount(account) ? buildVietQrUrl(account) : '';

  return (
    <div className="signature-qr" aria-label={qrUrl && !failed ? 'Mã QR chuyển khoản' : 'Mã QR minh họa'}>
      {qrUrl && !failed
        ? <img src={qrUrl} alt="Mã QR chuyển khoản qua VietQR" loading="lazy" onError={onError} />
        : <svg viewBox="0 0 100 100" role="img" aria-hidden="true">
          <rect width="100" height="100" rx="5" fill="white" />
          <path d="M6 6h30v30H6zM12 12v18h18V12zM64 6h30v30H64zM70 12v18h18V12zM6 64h30v30H6zM12 70v18h18V70z" fill="currentColor" fillRule="evenodd" />
          <path d="M44 8h8v8h-8zM48 22h12v8H48zM42 40h8v8h-8zM56 40h8v8h-8zM72 42h8v8h-8zM40 56h10v8H40zM56 54h8v12h-8zM70 58h10v8H70zM88 46h8v8h-8zM42 74h8v8h-8zM56 72h8v8h-8zM70 72h8v8h-8zM84 82h12v10H84zM54 88h10v8H54z" fill="currentColor" />
        </svg>}
    </div>
  );
}

function SignatureGiftCard({ account, title }: { account?: WeddingQrAccount; title: string }) {
  const hasAccountDetails = Boolean(account && (account.bankName || account.accountNumber || account.accountName));
  const isConfigured = isValidWeddingQrAccount(account);
  const [qrFailed, setQrFailed] = useState(false);
  const qrUrl = isConfigured ? buildVietQrUrl(account) : '';
  useEffect(() => setQrFailed(false), [qrUrl]);
  return (
    <div className="signature-gift-card">
      <SmallLabel>A LITTLE WISH</SmallLabel>
      <h2>Gửi lời chúc &amp; mừng cưới</h2>
      <p>{title}</p>
      <DemoQrImage account={account} failed={qrFailed} onError={() => setQrFailed(true)} />
      {hasAccountDetails && (!isConfigured || qrFailed) && <dl className="signature-gift-card__account">
        {account?.bankName && <div><dt>Ngân hàng</dt><dd>{account.bankName}</dd></div>}
        {account?.accountNumber && <div><dt>Số tài khoản</dt><dd>{account.accountNumber}</dd></div>}
        {account?.accountName && <div><dt>Chủ tài khoản</dt><dd>{account.accountName}</dd></div>}
      </dl>}
      <span className="signature-demo-note">{isConfigured
        ? 'VietQR · Kiểm tra thông tin trước khi chuyển khoản'
        : hasAccountDetails
          ? 'QR demo không quét được · vui lòng dùng thông tin tài khoản'
          : 'QR DEMO · KHÔNG DÙNG ĐỂ CHUYỂN KHOẢN'}</span>
    </div>
  );
}

function replyDeadline(dateValue: string) {
  const deadline = new Date(`${dateValue}T00:00:00`);
  deadline.setDate(deadline.getDate() - 14);
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(deadline);
}

function timeAfter(timeValue: string, minutes: number) {
  const [hour = 0, minute = 0] = timeValue.split(':').map(Number);
  const total = (hour * 60 + minute + minutes) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

function safeHttpsUrl(value?: string) {
  if (!value?.trim()) return undefined;
  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' ? url.href : undefined;
  } catch {
    return undefined;
  }
}

function youtubeVideoId(value: string) {
  try {
    const url = new URL(value);
    if (url.hostname === 'youtu.be') {
      const videoId = url.pathname.slice(1).split('/')[0];
      return /^[\w-]{11}$/.test(videoId) ? videoId : undefined;
    }
    if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(url.hostname)) {
      const videoId = url.searchParams.get('v')
        ?? /^\/(?:embed|shorts|live)\/([^/]+)/.exec(url.pathname)?.[1];
      return videoId && /^[\w-]{11}$/.test(videoId) ? videoId : undefined;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

export function SignatureDemo({
  id,
  customization,
  embedded = false,
  showMusicPlayer = false,
  startMusicOnFirstInteraction = false,
  staticExport = false,
  guestName,
  guestGreeting = 'formal',
  rsvpQuestions = [],
  existingSubmitted = false,
  initialWishes = [],
  onRsvpSubmit,
  onWishSubmit,
}: SignatureDemoProps) {
  const baseDemo = demos[id] ?? fallbackDemo(id);
  const demo: SignatureDemoContent = {
    ...baseDemo,
    tier: customization?.tier ?? baseDemo.tier,
    bride: customization?.bride || baseDemo.bride,
    groom: customization?.groom || baseDemo.groom,
    date: customization?.date || baseDemo.date,
    dateLabel: customization?.dateLabel || baseDemo.dateLabel,
    time: customization?.time || baseDemo.time,
    venue: customization?.venue || baseDemo.venue,
    address: customization?.address || baseDemo.address,
    city: customization?.city || baseDemo.city,
    story: customization?.story || baseDemo.story,
    hero: customization?.hero || baseDemo.hero,
    gallery: customization?.gallery?.length ? customization.gallery : baseDemo.gallery,
  };
  const [submitted, setSubmitted] = useState(existingSubmitted);
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [rsvpError, setRsvpError] = useState('');
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const mapAddress = customization?.receptionAddress || demo.address || demo.venue;
  const mapQuery = encodeURIComponent([mapAddress, demo.city].filter(Boolean).join(', '));
  const videoLink = safeHttpsUrl(customization?.videoLink);
  const youtubeId = videoLink ? youtubeVideoId(videoLink) : undefined;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;
  const coupleNames = orderedInvitationNames(demo.bride, demo.groom);
  const couple = `${coupleNames[0]} & ${coupleNames[1]}`;
  const locationLabel = demo.city.toLocaleLowerCase('vi') === 'việt nam' ? 'Việt Nam' : `${demo.city} · Việt Nam`;
  const premium = demo.tier !== '109k';
  const diamond = demo.tier === '199k';
  const isSectionVisible = (section: InvitationHiddenSection) => !customization?.hiddenSections?.includes(section);
  const qrSide = currentInvitationSide();
  const giftCards: Array<{ key: 'shared' | 'groom' | 'bride'; title: string; account?: WeddingQrAccount }> =
    customization?.qrSeparateSides
      ? qrSide
        ? [{ key: qrSide, title: qrSide === 'groom' ? 'Mã mừng cưới nhà trai' : 'Mã mừng cưới nhà gái', account: customization.qrAccounts?.[qrSide] }]
        : [
          { key: 'groom', title: 'Mã mừng cưới nhà trai', account: customization.qrAccounts?.groom },
          { key: 'bride', title: 'Mã mừng cưới nhà gái', account: customization.qrAccounts?.bride },
        ]
      : [{ key: 'shared', title: 'Mã mừng cưới dùng chung', account: customization?.qrAccounts?.shared }];
  const visibleExtraCount = Number(diamond && isSectionVisible('video'))
    + Number(diamond && isSectionVisible('qr'))
    + Number(diamond && isSectionVisible('guestbook'));
  const visibleVideoQrCount = Number(diamond && isSectionVisible('video'))
    + Number(diamond && isSectionVisible('qr'));
  const firstSectionTarget = premium && isSectionVisible('story') ? '#cau-chuyen'
    : isSectionVisible('events') ? '#su-kien'
      : isSectionVisible('album') ? '#album'
        : isSectionVisible('venue') ? '#dia-diem' : '#trang-chu';
  const ceremonyTitle = customization?.ceremonyTitle || 'Lễ thành hôn';
  const receptionTitle = customization?.receptionTitle || 'Tiệc mừng thân mật';
  const headerMonogramText = customization?.headerMonogramText?.trim();
  const orderedHeaderMonogramText = headerMonogramText && isGroomInvitationSide() && headerMonogramText.includes('&')
    ? (() => {
      const [left, ...right] = headerMonogramText.split('&');
      return `${right.join('&').trim()} & ${left.trim()}`;
    })()
    : headerMonogramText;
  const appearanceClasses = [
    `signature-demo signature-demo--${demo.id}`,
    demo.visualStyle ? `signature-demo--${demo.visualStyle}` : '',
    customization?.theme && customization.theme !== 'template' ? `signature-demo--theme-${customization.theme}` : '',
    customization?.fontStyle ? `signature-demo--font-${customization.fontStyle}` : '',
    embedded ? 'signature-demo--embedded' : '',
  ].filter(Boolean).join(' ');

  useEffect(() => {
    setSubmitted(existingSubmitted);
  }, [existingSubmitted]);

  const submitRsvp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmittingRsvp) return;
    const formData = new FormData(event.currentTarget);
    const attending = formData.get('attending') === 'no' ? 'no' : 'yes';
    setIsSubmittingRsvp(true);
    setRsvpError('');
    try {
      await onRsvpSubmit?.({
        name: guestName || String(formData.get('name') || '').trim(),
        attending,
        guestCount: attending === 'yes' ? Number(formData.get('guests') || 1) : 0,
        email: String(formData.get('email') || '').trim(),
        message: String(formData.get('message') || '').trim(),
        answers: {
          ...(rsvpQuestions.includes('transport') ? { transport: String(formData.get('transport') || '') } : {}),
          ...(rsvpQuestions.includes('meal') ? { meal: String(formData.get('meal') || '') } : {}),
        },
        side: currentInvitationSide(),
      });
      setSubmitted(true);
    } catch {
      setRsvpError('Chưa gửi được lời hồi đáp. Vui lòng thử lại.');
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  return (
    <main className={appearanceClasses}>
      {(!embedded || showMusicPlayer) && <MusicPlayer autoPlay={false} startOnFirstInteraction={startMusicOnFirstInteraction} showVolumeControl={diamond} allowCustomMusic={premium} musicUrl={premium ? customization?.musicUrl : undefined} />}

      <nav className="signature-nav" aria-label="Điều hướng thiệp cưới">
        <a className="signature-nav__monogram" href="#trang-chu" aria-label={`Đầu thiệp ${orderedHeaderMonogramText || couple}`}>
          {orderedHeaderMonogramText
            ? orderedHeaderMonogramText.split(/(&)/g).map((part, index) => part === '&'
              ? <i key={`amp-${index}`}>&amp;</i>
              : <span className="signature-nav__monogram-text" key={`text-${index}`}>{part}</span>)
            : <><span className="signature-nav__monogram-text">{coupleNames[0].charAt(0)}</span><i>&amp;</i><span className="signature-nav__monogram-text">{coupleNames[1].charAt(0)}</span></>}
        </a>
        <div className="signature-nav__links">
          {premium && isSectionVisible('story') && <a href="#cau-chuyen">Câu chuyện</a>}
          {isSectionVisible('events') && <a href="#su-kien">Ngày vui</a>}
          {isSectionVisible('album') && <a href="#album">Album</a>}
          {isSectionVisible('venue') && <a href="#dia-diem">Địa điểm</a>}
        </div>
        {isSectionVisible('rsvp') && <a className="signature-nav__rsvp" href="#xac-nhan" aria-label="Hồi âm tham dự">Hồi âm</a>}
      </nav>

      <section className={`signature-hero signature-hero--${demo.visualStyle ?? demo.id}`} id="trang-chu" aria-label="Thiệp mời cưới">
        <div className="signature-hero__ornament" aria-hidden="true" />
        <div className="signature-hero__layout">
          <div className="signature-hero__image">
            <img src={demo.hero} alt={`Ảnh cưới Việt Nam minh họa cho ${couple}`} fetchPriority="high" style={customization?.heroPosition ? { objectPosition: customization.heroPosition } : undefined} />
            <span className="signature-hero__image-note">{locationLabel}</span>
          </div>
          <motion.div
            className="signature-hero__content"
            initial={staticExport ? false : { opacity: 0, y: 20 }}
            animate={staticExport ? false : { opacity: 1, y: 0 }}
            transition={staticExport ? undefined : { duration: 0.7 }}
          >
            <SmallLabel>{customization?.heroKicker || demo.label}</SmallLabel>
            <h1><span>{coupleNames[0]}</span><i>&amp;</i><span>{coupleNames[1]}</span></h1>
            <p className="signature-hero__invitation">
              {guestName
                ? `${guestGreeting === 'friendly' ? 'Thân mời' : 'Trân trọng kính mời'} ${guestName} đến chung vui`
                : 'Trân trọng kính mời bạn đến chung vui'}
            </p>
            <p className="signature-hero__date">{demo.dateLabel}</p>
            <div className="signature-hero__actions">
              <a href={firstSectionTarget}>Khám phá thiệp</a>
              {isSectionVisible('rsvp') && <a href="#xac-nhan">Gửi lời hồi đáp</a>}
            </div>
          </motion.div>
        </div>
        <span className="signature-photo-disclaimer">
          {customization
            ? 'Bản thiệp cá nhân hóa · Hình ảnh có thể thay đổi trước khi xuất bản'
            : 'Ảnh minh họa · Tên và thông tin trong demo là hư cấu'}
        </span>
        <span className="signature-hero__side-note" aria-hidden="true">A day made for us · {demo.dateLabel}</span>
      </section>

      {!premium && customization?.mainPhoto && (
        <section className="signature-main-photo" aria-label="Ảnh chính">
          <img src={customization.mainPhoto} alt={`Ảnh chính của ${couple}`} style={customization.mainPhotoPosition ? { objectPosition: customization.mainPhotoPosition } : undefined} />
        </section>
      )}

      {premium && isSectionVisible('story') && (
        <section className="signature-story" id="cau-chuyen" aria-labelledby="signature-story-title">
          <div className="signature-story__copy">
            <SmallLabel>OUR STORY</SmallLabel>
            <h2 id="signature-story-title">Hai trái tim,<br /><em>một hành trình.</em></h2>
            <p>{demo.story}</p>
          </div>
          <figure className="signature-story__photo">
            <img src={customization?.mainPhoto || demo.gallery[1]} alt={`${couple} trong buổi chụp ảnh cưới`} loading="lazy" style={customization?.mainPhotoPosition ? { objectPosition: customization.mainPhotoPosition } : customization?.galleryPositions?.[1] ? { objectPosition: customization.galleryPositions[1] } : undefined} />
            <figcaption>{coupleNames[0]} <i>&amp;</i> {coupleNames[1]}</figcaption>
          </figure>
        </section>
      )}

      {isSectionVisible('events') && <section className="signature-events" id="su-kien" aria-labelledby="signature-events-title">
        <header className="signature-section-heading">
          <SmallLabel>SAVE THE DATE</SmallLabel>
          <h2 id="signature-events-title">Hẹn gặp bạn trong ngày vui</h2>
          <p>Một ngày thật đẹp sẽ trọn vẹn hơn khi có bạn ở bên.</p>
        </header>
        <div className="signature-event-grid">
          <article className="signature-event-card signature-event-card--primary">
            <span className="signature-event-card__number">01 / CEREMONY</span>
            <CalendarDays aria-hidden="true" />
            <h3>{ceremonyTitle}</h3>
            <p>{customization?.ceremonyDateLabel || demo.dateLabel}</p>
            <span><Clock3 aria-hidden="true" /> {customization?.timeLabel ? `${customization.timeLabel}: ` : ''}{customization?.ceremonyTime || demo.time}</span>
            <span><MapPin aria-hidden="true" /> {demo.venue}</span>
          </article>
          <article className="signature-event-card">
            <span className="signature-event-card__number">02 / RECEPTION</span>
            <Heart aria-hidden="true" />
            <h3>{receptionTitle}</h3>
            <p>{customization?.receptionDateLabel || demo.dateLabel}</p>
            <span><Clock3 aria-hidden="true" /> {customization?.receptionTime || demo.time} · Đón khách</span>
            <span><MapPin aria-hidden="true" /> {demo.venue}</span>
          </article>
        </div>
      </section>}

      {demo.visualStyle === 'playful-handdrawn' && isSectionVisible('timeline') && (
        <section className="signature-playful-guide" aria-labelledby="signature-playful-guide-title">
          <header className="signature-section-heading">
            <SmallLabel>NHỚ NHA!</SmallLabel>
            <h2 id="signature-playful-guide-title">Tối hôm ấy</h2>
            <p>Một chiếc lịch trình nhỏ để bạn không bỏ lỡ phần vui nhất.</p>
          </header>
          <div className="signature-playful-guide__timeline">
            {[
              [demo.time, 'Đón khách & đồ uống chào'],
              [timeAfter(demo.time, 30), 'Làm lễ'],
              [timeAfter(demo.time, 60), 'Khai tiệc & lời chúc'],
              [timeAfter(demo.time, 150), 'Điệu nhảy đầu tiên'],
            ].map(([time, label]) => (
              <div key={label}><strong>{time}</strong><span>{label}</span></div>
            ))}
          </div>
          <div className="signature-playful-guide__cards">
            <article>
              <span aria-hidden="true">◯ ◯ ●</span>
              <h3>Mặc gì?</h3>
              <p>Thoải mái là chính. Kem, hồng phấn và xanh olive sẽ lên hình rất xinh.</p>
            </article>
            <article>
              <span aria-hidden="true">🥂</span>
              <h3>Quầy đồ uống</h3>
              <p>Mojito, espresso martini, vang và những lựa chọn không cồn.</p>
            </article>
            <article>
              <span aria-hidden="true">🍽</span>
              <h3>Thực đơn</h3>
              <p>Khai vị theo mùa, món chính ấm áp và một chiếc bánh cưới thật ngon.</p>
            </article>
          </div>
        </section>
      )}

      {isSectionVisible('album') && <section className="signature-gallery" id="album" aria-labelledby="signature-gallery-title">
        <header className="signature-section-heading">
          <SmallLabel>THE ALBUM</SmallLabel>
          <h2 id="signature-gallery-title">{customization?.albumTitle || 'Những khoảnh khắc thương'}</h2>
          <p>{diamond ? 'Một album mở rộng để lưu giữ trọn vẹn câu chuyện của chúng mình.' : 'Một vài khung hình yêu thích trước ngày chung đôi.'}</p>
        </header>
        <div className="signature-gallery__grid">
          {demo.gallery.map((src, index) => (
            <button key={src} type="button" onClick={() => setLightbox(index)} aria-label={`Phóng to ảnh ${index + 1}`}>
              <img src={src} alt={`Khoảnh khắc ${index + 1} của ${couple}`} loading="lazy" style={customization?.galleryPositions?.[index] ? { objectPosition: customization.galleryPositions[index] } : undefined} />
              <span>0{index + 1}</span>
            </button>
          ))}
        </div>
      </section>}

      {diamond && visibleExtraCount > 0 && (
        <section className={`signature-extras${visibleVideoQrCount === 1 ? ' signature-extras--single-feature' : ''}`} aria-label="Tính năng cao cấp">
          {isSectionVisible('video') && <div className="signature-video-card">
            {videoPlaying && videoLink
              ? youtubeId
                ? <iframe
                  className="signature-video-card__player"
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&playsinline=1&rel=0`}
                  title="Video cưới"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
                : <video className="signature-video-card__player" src={videoLink} controls autoPlay playsInline aria-label="Video cưới" />
              : <>
                <img src={customization?.videoBackground || demo.gallery[2]} alt="Ảnh bìa video cưới" loading="lazy" style={customization?.videoBackgroundPosition ? { objectPosition: customization.videoBackgroundPosition } : customization?.galleryPositions?.[2] ? { objectPosition: customization.galleryPositions[2] } : undefined} />
                {videoLink
                  ? <button className="signature-video-card__play" type="button" onClick={() => setVideoPlaying(true)} aria-label="Phát video cưới"><Play fill="currentColor" aria-hidden="true" /></button>
                  : isSectionVisible('album') && <button type="button" onClick={() => document.getElementById('album')?.scrollIntoView({ behavior: 'smooth' })} aria-label="Xem album cưới"><Play fill="currentColor" aria-hidden="true" /></button>}
                <div><SmallLabel>OUR MOMENTS</SmallLabel><h2>Một câu chuyện bằng những khung hình</h2></div>
              </>}
          </div>}
          {isSectionVisible('qr') && giftCards.map((card) => <SignatureGiftCard key={card.key} account={card.account} title={card.title} />)}
          {isSectionVisible('guestbook') && <GuestBook couple={couple} initialWishes={initialWishes} onSubmit={onWishSubmit} />}
        </section>
      )}

      {isSectionVisible('venue') && <section className="signature-venue" id="dia-diem" aria-labelledby="signature-venue-title">
        <div>
          <SmallLabel>{customization?.venueLabel || 'THE PLACE'}</SmallLabel>
          <h2 id="signature-venue-title">Chúng mình đợi bạn tại đây</h2>
          <h3>{demo.venue}</h3>
          <p>{customization?.receptionAddress || demo.address}{demo.city ? `, ${demo.city}` : ''}</p>
          <div className="signature-venue__actions">
            <a href={directionsLink} target="_blank" rel="noopener noreferrer">Chỉ đường <ArrowUpRight aria-hidden="true" /></a>
            <a href={mapLink} target="_blank" rel="noopener noreferrer">Mở Google Maps</a>
          </div>
        </div>
        <div className="signature-venue__map">
          <iframe title={`Bản đồ đến ${mapAddress}`} src={`https://www.google.com/maps?q=${mapQuery}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          <span><MapPin aria-hidden="true" /> {demo.city}</span>
        </div>
      </section>}

      {isSectionVisible('rsvp') && <section className="signature-rsvp" id="xac-nhan" aria-labelledby="signature-rsvp-title">
        {!submitted ? (
          <form onSubmit={submitRsvp}>
            <SmallLabel>PLEASE REPLY</SmallLabel>
            <h2 id="signature-rsvp-title">Bạn sẽ đến chứ?</h2>
            <p>Vui lòng hồi đáp trước ngày {replyDeadline(demo.date)} để chúng mình chuẩn bị chu đáo.</p>
            <label>Họ và tên<input name="name" required placeholder="Tên của bạn" autoComplete="name" defaultValue={guestName} readOnly={Boolean(guestName)} /></label>
            <label>Bạn sẽ tham dự chứ?<select name="attending" defaultValue="yes"><option value="yes">Có, mình sẽ đến</option><option value="no">Rất tiếc, mình bận</option></select></label>
            {premium ? (
              <div className="signature-rsvp__fields">
                <label>Email<input type="email" name="email" placeholder="email@example.com" autoComplete="email" /></label>
                <label>Số khách<select name="guests" defaultValue="1"><option value="1">1 khách</option><option value="2">2 khách</option><option value="3">3 khách</option><option value="4">4 khách</option></select></label>
              </div>
            ) : null}
            {premium && rsvpQuestions.length > 0 ? (
              <div className="signature-rsvp__fields signature-rsvp__fields--preferences">
                {rsvpQuestions.includes('transport') && (
                  <label>Xe đưa đón<select name="transport" defaultValue="none"><option value="none">Không cần xe</option><option value="outbound">Cần xe lượt đi</option><option value="roundtrip">Cần xe hai chiều</option></select></label>
                )}
                {rsvpQuestions.includes('meal') && (
                  <label>Chế độ ăn<select name="meal" defaultValue="regular"><option value="regular">Thực đơn thông thường</option><option value="vegetarian">Ăn chay</option><option value="allergy">Có dị ứng thực phẩm</option></select></label>
                )}
              </div>
            ) : null}
            {diamond && (
              <div className="signature-rsvp__fields">
                <label className="signature-rsvp__wide">Lời nhắn<textarea name="message" rows={3} placeholder="Gửi đôi bạn một lời chúc..." /></label>
              </div>
            )}
            {rsvpError && <p className="signature-rsvp__error" role="alert">{rsvpError}</p>}
            <button type="submit" disabled={isSubmittingRsvp}>{isSubmittingRsvp ? 'Đang gửi...' : 'Gửi lời hồi đáp'}</button>
          </form>
        ) : (
          <div className="signature-rsvp__success" role="status">
            <span><Check aria-hidden="true" /></span>
            <SmallLabel>WE SAVED YOUR REPLY</SmallLabel>
            <h2 id="signature-rsvp-title">Cảm ơn bạn!</h2>
            <p>Chúng mình rất mong được gặp bạn trong ngày vui.</p>
          </div>
        )}
      </section>}

      <footer className="signature-footer">
        <span>{coupleNames[0]} <i>&amp;</i> {coupleNames[1]}</span>
        <p>{customization?.signatureText || `Made with love · ${demo.dateLabel}`}</p>
        <a href="#trang-chu">Về đầu thiệp</a>
      </footer>

      {lightbox !== null && (
        <div className="signature-lightbox" role="dialog" aria-modal="true" aria-label={`Ảnh ${lightbox + 1}`} onClick={() => setLightbox(null)}>
          <button type="button" onClick={() => setLightbox(null)} aria-label="Đóng ảnh"><X aria-hidden="true" /></button>
          <img src={demo.gallery[lightbox]} alt={`Khoảnh khắc ${lightbox + 1} của ${couple}`} style={customization?.galleryPositions?.[lightbox] ? { objectPosition: customization.galleryPositions[lightbox] } : undefined} onClick={(event) => event.stopPropagation()} />
        </div>
      )}

    </main>
  );
}
