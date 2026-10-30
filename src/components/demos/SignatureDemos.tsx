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
  time?: string;
  venue?: string;
  address?: string;
  city?: string;
  story?: string;
  ceremonyTitle?: string;
  receptionTitle?: string;
  theme?: SignatureTheme;
  fontStyle?: SignatureFont;
  hero?: string;
  gallery?: string[];
}

export interface SignatureRsvpPayload {
  name: string;
  attending: 'yes' | 'no';
  guestCount: number;
  answers: Partial<Record<SignatureRsvpQuestion, string>>;
}

interface SignatureDemoProps {
  id: SignatureDemoId;
  customization?: SignatureDemoCustomization;
  embedded?: boolean;
  guestName?: string;
  guestGreeting?: 'formal' | 'friendly';
  rsvpQuestions?: SignatureRsvpQuestion[];
  existingSubmitted?: boolean;
  onRsvpSubmit?: (payload: SignatureRsvpPayload) => void;
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
  'ha-phuong-hoang-minh-2026': {
    id: 'ha-phuong-hoang-minh-2026', visualStyle: 'verdant-veil', tier: '199k', label: 'VERDANT VEIL · OUR MEMORIES',
    bride: 'Hà Phương', groom: 'Hoàng Minh', date: '2026-12-20', dateLabel: '20 · 12 · 2026', time: '17:30',
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
  if (/ha-phuong-hoang-minh|verdant/.test(id)) return 'verdant-veil';
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

function GuestBook({ couple }: { couple: string }) {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState(['Chúc hai bạn mãi hạnh phúc nhé!']);

  const addNote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!note.trim()) return;
    setNotes((current) => [note.trim(), ...current].slice(0, 3));
    setNote('');
  };

  return (
    <div className="signature-guestbook">
      <div className="signature-guestbook__heading">
        <MessageCircleHeart aria-hidden="true" />
        <div><h3>Sổ lưu bút</h3><p>Gửi một lời chúc đến {couple}</p></div>
      </div>
      <form onSubmit={addNote}>
        <label className="visually-hidden" htmlFor="signature-guestbook-note">Lời chúc</label>
        <input id="signature-guestbook-note" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Viết lời chúc của bạn..." maxLength={100} />
        <button type="submit">Gửi</button>
      </form>
      <ul>{notes.map((item, index) => <li key={`${item}-${index}`}><span aria-hidden="true">{['🤍', '✨', '🌿'][index]}</span>{item}</li>)}</ul>
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

export function SignatureDemo({
  id,
  customization,
  embedded = false,
  guestName,
  guestGreeting = 'formal',
  rsvpQuestions = [],
  existingSubmitted = false,
  onRsvpSubmit,
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
  const [lightbox, setLightbox] = useState<number | null>(null);
  const mapQuery = encodeURIComponent(`${demo.venue}, ${demo.address}, ${demo.city}`);
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;
  const couple = `${demo.bride} & ${demo.groom}`;
  const locationLabel = demo.city.toLocaleLowerCase('vi') === 'việt nam' ? 'Việt Nam' : `${demo.city} · Việt Nam`;
  const premium = demo.tier !== '109k';
  const diamond = demo.tier === '199k';
  const ceremonyTitle = customization?.ceremonyTitle || 'Lễ thành hôn';
  const receptionTitle = customization?.receptionTitle || 'Tiệc mừng thân mật';
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

  const submitRsvp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const attending = formData.get('attending') === 'no' ? 'no' : 'yes';
    onRsvpSubmit?.({
      name: guestName || String(formData.get('name') || '').trim(),
      attending,
      guestCount: attending === 'yes' ? Number(formData.get('guests') || 1) : 0,
      answers: {
        ...(rsvpQuestions.includes('transport') ? { transport: String(formData.get('transport') || '') } : {}),
        ...(rsvpQuestions.includes('meal') ? { meal: String(formData.get('meal') || '') } : {}),
      },
    });
    setSubmitted(true);
  };

  return (
    <main className={appearanceClasses}>
      {!embedded && <MusicPlayer autoPlay={false} showVolumeControl={diamond} allowCustomMusic={premium} />}

      <nav className="signature-nav" aria-label="Điều hướng thiệp cưới">
        <a className="signature-nav__monogram" href="#trang-chu" aria-label={`Đầu thiệp ${couple}`}>
          {demo.bride.charAt(0)}<i>&amp;</i>{demo.groom.charAt(0)}
        </a>
        <div className="signature-nav__links">
          <a href={premium ? '#cau-chuyen' : '#su-kien'}>{premium ? 'Câu chuyện' : 'Địa điểm'}</a>
          <a href="#su-kien">Ngày vui</a>
          <a href="#album">Album</a>
        </div>
        <a className="signature-nav__rsvp" href="#xac-nhan" aria-label="Hồi âm tham dự">Hồi âm</a>
      </nav>

      <section className={`signature-hero signature-hero--${demo.visualStyle ?? demo.id}`} id="trang-chu" aria-label="Thiệp mời cưới">
        <div className="signature-hero__ornament" aria-hidden="true" />
        <div className="signature-hero__layout">
          <div className="signature-hero__image">
            <img src={demo.hero} alt={`Ảnh cưới Việt Nam minh họa cho ${couple}`} fetchPriority="high" />
            <span className="signature-hero__image-note">{locationLabel}</span>
          </div>
          <motion.div
            className="signature-hero__content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <SmallLabel>{demo.label}</SmallLabel>
            <h1><span>{demo.bride}</span><i>&amp;</i><span>{demo.groom}</span></h1>
            <p className="signature-hero__invitation">
              {guestName
                ? `${guestGreeting === 'friendly' ? 'Thân mời' : 'Trân trọng kính mời'} ${guestName} đến chung vui`
                : 'Trân trọng kính mời bạn đến chung vui'}
            </p>
            <p className="signature-hero__date">{demo.dateLabel}</p>
            <div className="signature-hero__actions">
              <a href="#su-kien">Khám phá thiệp</a>
              <a href="#xac-nhan">Gửi lời hồi đáp</a>
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

      {premium && (
        <section className="signature-story" id="cau-chuyen" aria-labelledby="signature-story-title">
          <div className="signature-story__copy">
            <SmallLabel>OUR STORY</SmallLabel>
            <h2 id="signature-story-title">Hai trái tim,<br /><em>một hành trình.</em></h2>
            <p>{demo.story}</p>
          </div>
          <figure className="signature-story__photo">
            <img src={demo.gallery[1]} alt={`${couple} trong buổi chụp ảnh cưới`} loading="lazy" />
            <figcaption>{demo.bride} <i>&amp;</i> {demo.groom}</figcaption>
          </figure>
        </section>
      )}

      <section className="signature-events" id="su-kien" aria-labelledby="signature-events-title">
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
            <p>{demo.dateLabel}</p>
            <span><Clock3 aria-hidden="true" /> {demo.time}</span>
            <span><MapPin aria-hidden="true" /> {demo.venue}</span>
          </article>
          <article className="signature-event-card">
            <span className="signature-event-card__number">02 / RECEPTION</span>
            <Heart aria-hidden="true" />
            <h3>{receptionTitle}</h3>
            <p>{demo.dateLabel}</p>
            <span><Clock3 aria-hidden="true" /> {demo.time} · Đón khách</span>
            <span><MapPin aria-hidden="true" /> {demo.city}</span>
          </article>
        </div>
      </section>

      {demo.visualStyle === 'playful-handdrawn' && (
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

      <section className="signature-gallery" id="album" aria-labelledby="signature-gallery-title">
        <header className="signature-section-heading">
          <SmallLabel>THE ALBUM</SmallLabel>
          <h2 id="signature-gallery-title">Những khoảnh khắc thương</h2>
          <p>{diamond ? 'Một album mở rộng để lưu giữ trọn vẹn câu chuyện của chúng mình.' : 'Một vài khung hình yêu thích trước ngày chung đôi.'}</p>
        </header>
        <div className="signature-gallery__grid">
          {demo.gallery.map((src, index) => (
            <button key={src} type="button" onClick={() => setLightbox(index)} aria-label={`Phóng to ảnh ${index + 1}`}>
              <img src={src} alt={`Khoảnh khắc ${index + 1} của ${couple}`} loading="lazy" />
              <span>0{index + 1}</span>
            </button>
          ))}
        </div>
      </section>

      {diamond && (
        <section className="signature-extras" aria-label="Tính năng cao cấp">
          <div className="signature-video-card">
            <img src={demo.gallery[2]} alt="Ảnh bìa video cưới" loading="lazy" />
            <button type="button" onClick={() => document.getElementById('album')?.scrollIntoView({ behavior: 'smooth' })} aria-label="Xem album cưới"><Play fill="currentColor" aria-hidden="true" /></button>
            <div><SmallLabel>OUR MOMENTS</SmallLabel><h2>Một câu chuyện bằng những khung hình</h2></div>
          </div>
          <div className="signature-gift-card">
            <SmallLabel>A LITTLE WISH</SmallLabel>
            <h2>Gửi lời chúc &amp; mừng cưới</h2>
            <p>Nếu muốn gửi lời chúc, bạn có thể dùng mã QR mô phỏng trong bản demo này.</p>
            <div className="signature-qr" aria-label="Mã QR minh họa, không dùng để thanh toán">
              <svg viewBox="0 0 100 100" role="img" aria-hidden="true">
                <rect width="100" height="100" rx="5" fill="white" />
                <path d="M6 6h30v30H6zM12 12v18h18V12zM64 6h30v30H64zM70 12v18h18V12zM6 64h30v30H6zM12 70v18h18V70z" fill="currentColor" fillRule="evenodd" />
                <path d="M44 8h8v8h-8zM48 22h12v8H48zM42 40h8v8h-8zM56 40h8v8h-8zM72 42h8v8h-8zM40 56h10v8H40zM56 54h8v12h-8zM70 58h10v8H70zM88 46h8v8h-8zM42 74h8v8h-8zM56 72h8v8h-8zM70 72h8v8h-8zM84 82h12v10H84zM54 88h10v8H54z" fill="currentColor" />
              </svg>
            </div>
            <span className="signature-demo-note">QR DEMO · KHÔNG DÙNG ĐỂ THANH TOÁN</span>
          </div>
          <GuestBook couple={couple} />
        </section>
      )}

      <section className="signature-venue" aria-labelledby="signature-venue-title">
        <div>
          <SmallLabel>THE PLACE</SmallLabel>
          <h2 id="signature-venue-title">Chúng mình đợi bạn tại đây</h2>
          <h3>{demo.venue}</h3>
          <p>{demo.address}, {demo.city}</p>
          <div className="signature-venue__actions">
            <a href={directionsLink} target="_blank" rel="noopener noreferrer">Chỉ đường <ArrowUpRight aria-hidden="true" /></a>
            <a href={mapLink} target="_blank" rel="noopener noreferrer">Mở Google Maps</a>
          </div>
        </div>
        <div className="signature-venue__map">
          <iframe title={`Bản đồ đến ${demo.venue}`} src={`https://www.google.com/maps?q=${mapQuery}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          <span><MapPin aria-hidden="true" /> {demo.city}</span>
        </div>
      </section>

      <section className="signature-rsvp" id="xac-nhan" aria-labelledby="signature-rsvp-title">
        <div className="signature-rsvp__ornament" aria-hidden="true">✳</div>
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
            <button type="submit">Gửi lời hồi đáp</button>
          </form>
        ) : (
          <div className="signature-rsvp__success" role="status">
            <span><Check aria-hidden="true" /></span>
            <SmallLabel>WE SAVED YOUR REPLY</SmallLabel>
            <h2 id="signature-rsvp-title">Cảm ơn bạn!</h2>
            <p>Chúng mình rất mong được gặp bạn trong ngày vui.</p>
          </div>
        )}
      </section>

      <footer className="signature-footer">
        <span>{demo.bride} <i>&amp;</i> {demo.groom}</span>
        <p>Made with love · {demo.dateLabel}</p>
        <a href="#trang-chu">Về đầu thiệp</a>
      </footer>

      {lightbox !== null && (
        <div className="signature-lightbox" role="dialog" aria-modal="true" aria-label={`Ảnh ${lightbox + 1}`} onClick={() => setLightbox(null)}>
          <button type="button" onClick={() => setLightbox(null)} aria-label="Đóng ảnh"><X aria-hidden="true" /></button>
          <img src={demo.gallery[lightbox]} alt={`Khoảnh khắc ${lightbox + 1} của ${couple}`} onClick={(event) => event.stopPropagation()} />
        </div>
      )}

    </main>
  );
}
