import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import {
  ArrowDown,
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
import type { TemplateTier } from '../../data/templates';

export type SignatureDemoId =
  | 'art-deco-royal'
  | 'art-deco-royal-basic'
  | 'luxury-gold-cinematic'
  | 'luxury-gold-frame'
  | 'bloom-crystal-3d'
  | 'modern-dark-blue'
  | 'minimal-elegant';

interface SignatureDemoContent {
  id: SignatureDemoId;
  visualStyle?: 'art-deco-royal-basic';
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

const photo = (id: string, width = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=88`;

const demos: Record<SignatureDemoId, SignatureDemoContent> = {
  'art-deco-royal-basic': {
    id: 'art-deco-royal-basic', tier: '159k', label: 'THE GARDEN EDIT',
    bride: 'Ngọc Hà', groom: 'Bảo Long', date: '2027-03-13', dateLabel: '13 · 03 · 2027', time: '18:00',
    venue: 'The Garden Pavilion', address: '24 Quảng An, Tây Hồ', city: 'Hà Nội',
    story: 'Chúng mình gặp nhau trong một buổi chiều đầy nắng, rồi cùng vun đắp những ngày bình dị thành điều đẹp đẽ. Mong bạn có mặt để mở đầu chương mới ấy cùng chúng mình.',
    hero: photo('photo-1537633552985-df8429e8048b'),
    gallery: [photo('photo-1519225421980-715cb0215aed', 900), photo('photo-1606800052052-a08af7148866', 900), photo('photo-1583939003579-730e3918a45a', 900), photo('photo-1465495976277-4387d4b0b4c6', 900)],
  },
  'art-deco-royal': {
    id: 'art-deco-royal', visualStyle: 'art-deco-royal-basic', tier: '199k', label: 'THE OLIVE GARDEN',
    bride: 'Ngọc Hà', groom: 'Bảo Long', date: '2027-03-13', dateLabel: '13 · 03 · 2027', time: '18:00',
    venue: 'The Garden Pavilion', address: '24 Quảng An, Tây Hồ', city: 'Hà Nội',
    story: 'Chúng mình gặp nhau trong một buổi chiều đầy nắng, rồi cùng vun đắp những ngày bình dị thành điều đẹp đẽ. Mong bạn có mặt để mở đầu chương mới ấy cùng chúng mình.',
    hero: photo('photo-1537633552985-df8429e8048b'),
    gallery: [photo('photo-1519225421980-715cb0215aed', 900), photo('photo-1606800052052-a08af7148866', 900), photo('photo-1583939003579-730e3918a45a', 900), photo('photo-1465495976277-4387d4b0b4c6', 900)],
  },
  'luxury-gold-cinematic': {
    id: 'luxury-gold-cinematic', tier: '159k', label: 'A NIGHT TO REMEMBER',
    bride: 'Minh Anh', groom: 'Quang Huy', date: '2027-11-12', dateLabel: '12 · 11 · 2027', time: '18:30',
    venue: 'The Imperial Palace', address: '12 Nguyễn Huệ, Quận 1', city: 'TP. Hồ Chí Minh',
    story: 'Có những cuộc gặp khiến mọi khung hình sau đó đều trở nên đáng nhớ. Câu chuyện của chúng mình bắt đầu bằng một buổi chiều nhiều nắng và sẽ tiếp tục vào ngày hạnh phúc này.',
    hero: photo('photo-1511285560929-80b456fea0bc'),
    gallery: [photo('photo-1519225421980-715cb0215aed', 900), photo('photo-1591604466107-ec97de577aff', 900), photo('photo-1606800052052-a08af7148866', 900), photo('photo-1519741497674-611481863552', 900)],
  },
  'luxury-gold-frame': {
    id: 'luxury-gold-frame', tier: '159k', label: 'A CELEBRATION OF LOVE',
    bride: 'Khánh Linh', groom: 'Tuấn Anh', date: '2027-10-18', dateLabel: '18 · 10 · 2027', time: '17:30',
    venue: 'Riverside Palace', address: '360D Bến Vân Đồn, Quận 4', city: 'TP. Hồ Chí Minh',
    story: 'Một tình yêu bình yên, bền bỉ và luôn có chỗ cho tiếng cười. Sau những chuyến đi cùng nhau, chúng mình muốn bắt đầu chặng đường tiếp theo bên những người thân yêu nhất.',
    hero: photo('photo-1532712938310-34cb3982ef74'),
    gallery: [photo('photo-1519741497674-611481863552', 900), photo('photo-1583939003579-730e3918a45a', 900), photo('photo-1465495976277-4387d4b0b4c6', 900), photo('photo-1519225421980-715cb0215aed', 900)],
  },
  'bloom-crystal-3d': {
    id: 'bloom-crystal-3d', tier: '199k', label: 'A LITTLE MORE MAGIC',
    bride: 'Mai Chi', groom: 'Đức Anh', date: '2027-12-18', dateLabel: '18 · 12 · 2027', time: '16:00',
    venue: 'The Glass Garden', address: '88 Nguyễn Du, Hai Bà Trưng', city: 'Hà Nội',
    story: 'Chúng mình tin những điều đẹp nhất thường lớn lên từ sự dịu dàng. Cảm ơn bạn đã là một phần trong câu chuyện; hãy cùng chúng mình viết chương mới dưới ánh đèn và những đóa hoa.',
    hero: photo('photo-1523438885200-e635ba2c371e'),
    gallery: [photo('photo-1591604466107-ec97de577aff', 900), photo('photo-1519741497674-611481863552', 900), photo('photo-1465495976277-4387d4b0b4c6', 900), photo('photo-1606800052052-a08af7148866', 900)],
  },
  'modern-dark-blue': {
    id: 'modern-dark-blue', tier: '109k', label: 'SAVE OUR DATE',
    bride: 'Lan Anh', groom: 'Minh Quân', date: '2027-09-06', dateLabel: '06 · 09 · 2027', time: '17:00',
    venue: 'Grand Convention Center', address: '15 Lê Duẩn, Quận 1', city: 'TP. Hồ Chí Minh',
    story: 'Một ngày thật đẹp đang đến gần. Chúng mình đã sẵn sàng cho lời hứa mới và sẽ vui hơn thật nhiều nếu có bạn cùng chung vui.',
    hero: photo('photo-1529636798458-92182e662485'),
    gallery: [photo('photo-1519741497674-611481863552', 900), photo('photo-1519225421980-715cb0215aed', 900), photo('photo-1465495976277-4387d4b0b4c6', 900), photo('photo-1583939003579-730e3918a45a', 900)],
  },
  'minimal-elegant': {
    id: 'minimal-elegant', tier: '199k', label: 'TOGETHER, IN EVERY SEASON',
    bride: 'Thảo Vy', groom: 'Gia Bảo', date: '2027-05-22', dateLabel: '22 · 05 · 2027', time: '17:30',
    venue: 'The Atelier Garden', address: '27 Xuân Diệu, Tây Hồ', city: 'Hà Nội',
    story: 'Không cần điều gì quá lớn lao. Chỉ cần một mái nhà, những bữa cơm dài và người mình muốn kể nghe mọi chuyện. Chúng mình rất mong được gặp bạn trong ngày vui.',
    hero: photo('photo-1537633552985-df8429e8048b'),
    gallery: [photo('photo-1519225421980-715cb0215aed', 900), photo('photo-1591604466107-ec97de577aff', 900), photo('photo-1519741497674-611481863552', 900), photo('photo-1606800052052-a08af7148866', 900)],
  },
};

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
        <button type="submit" aria-label="Gửi lời chúc"><ArrowUpRight aria-hidden="true" /></button>
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

export function SignatureDemo({ id }: { id: SignatureDemoId }) {
  const demo = demos[id];
  const [submitted, setSubmitted] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const mapQuery = encodeURIComponent(`${demo.venue}, ${demo.address}, ${demo.city}`);
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;
  const couple = `${demo.bride} & ${demo.groom}`;
  const premium = demo.tier !== '109k';
  const diamond = demo.tier === '199k';

  const submitRsvp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className={`signature-demo signature-demo--${demo.id}${demo.visualStyle ? ` signature-demo--${demo.visualStyle}` : ''}`}>
      <MusicPlayer autoPlay={false} showVolumeControl={diamond} allowCustomMusic={premium} />

      <nav className="signature-nav" aria-label="Điều hướng thiệp cưới">
        <a className="signature-nav__monogram" href="#trang-chu" aria-label={`Đầu thiệp ${couple}`}>
          {demo.bride.charAt(0)}<i>&amp;</i>{demo.groom.charAt(0)}
        </a>
        <div className="signature-nav__links">
          <a href={premium ? '#cau-chuyen' : '#su-kien'}>{premium ? 'Câu chuyện' : 'Địa điểm'}</a>
          <a href="#su-kien">Ngày vui</a>
          <a href="#album">Album</a>
        </div>
        <a className="signature-nav__rsvp" href="#xac-nhan">Xác nhận tham dự <ArrowUpRight aria-hidden="true" /></a>
      </nav>

      <section className={`signature-hero signature-hero--${demo.visualStyle ?? demo.id}`} id="trang-chu" aria-label="Thiệp mời cưới">
        <div className="signature-hero__ornament" aria-hidden="true" />
        <div className="signature-hero__layout">
          <div className="signature-hero__image">
            <img src={demo.hero} alt={`Ảnh cưới của ${couple}`} fetchPriority="high" />
            <span className="signature-hero__image-note">{demo.city} · Việt Nam</span>
          </div>
          <motion.div
            className="signature-hero__content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <SmallLabel>{demo.label}</SmallLabel>
            <h1><span>{demo.bride}</span><i>&amp;</i><span>{demo.groom}</span></h1>
            <p className="signature-hero__invitation">Trân trọng kính mời bạn đến chung vui</p>
            <p className="signature-hero__date">{demo.dateLabel}</p>
            <div className="signature-hero__actions">
              <a href="#su-kien">Khám phá thiệp <ArrowDown aria-hidden="true" /></a>
              <a href="#xac-nhan">Gửi lời hồi đáp</a>
            </div>
          </motion.div>
        </div>
        <span className="signature-hero__side-note" aria-hidden="true">A day made for us · {demo.dateLabel}</span>
      </section>

      {premium && (
        <section className="signature-story" id="cau-chuyen" aria-labelledby="signature-story-title">
          <div className="signature-story__copy">
            <SmallLabel>OUR STORY</SmallLabel>
            <h2 id="signature-story-title">Hai trái tim,<br /><em>một hành trình.</em></h2>
            <p>{demo.story}</p>
            <a className="signature-text-link" href="#su-kien">Cùng đón ngày vui <ArrowUpRight aria-hidden="true" /></a>
          </div>
          <div className="signature-story__photo">
            <img src={demo.gallery[1]} alt={`${couple} trong buổi chụp ảnh cưới`} loading="lazy" />
            <span>{demo.bride} <i>×</i> {demo.groom}</span>
          </div>
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
            <h3>Lễ thành hôn</h3>
            <p>{demo.dateLabel}</p>
            <span><Clock3 aria-hidden="true" /> {demo.time}</span>
            <span><MapPin aria-hidden="true" /> {demo.venue}</span>
          </article>
          <article className="signature-event-card">
            <span className="signature-event-card__number">02 / RECEPTION</span>
            <Heart aria-hidden="true" />
            <h3>Tiệc mừng thân mật</h3>
            <p>{demo.dateLabel}</p>
            <span><Clock3 aria-hidden="true" /> {demo.time} · Đón khách</span>
            <span><MapPin aria-hidden="true" /> {demo.city}</span>
          </article>
        </div>
      </section>

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
            <button type="button" onClick={() => setShowVideo(true)} aria-label="Xem video cưới mẫu"><Play fill="currentColor" aria-hidden="true" /></button>
            <div><SmallLabel>OUR FILM</SmallLabel><h2>Một thước phim của riêng đôi mình</h2></div>
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
            <label>Họ và tên<input name="name" required placeholder="Tên của bạn" autoComplete="name" /></label>
            {premium ? (
              <div className="signature-rsvp__fields">
                <label>Email<input type="email" name="email" placeholder="email@example.com" autoComplete="email" /></label>
                <label>Số khách<select name="guests" defaultValue="1"><option value="1">1 khách</option><option value="2">2 khách</option><option value="3">3 khách</option><option value="4">4 khách</option></select></label>
              </div>
            ) : (
              <label>Bạn sẽ tham dự chứ?<select name="attending" defaultValue="yes"><option value="yes">Có, mình sẽ đến</option><option value="no">Rất tiếc, mình bận</option></select></label>
            )}
            {diamond && (
              <div className="signature-rsvp__fields">
                <label className="signature-rsvp__wide">Lời nhắn<textarea name="message" rows={3} placeholder="Gửi đôi bạn một lời chúc..." /></label>
              </div>
            )}
            <button type="submit">Xác nhận tham dự <ArrowUpRight aria-hidden="true" /></button>
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
        <a href="#trang-chu" aria-label="Về đầu thiệp"><ArrowDown aria-hidden="true" /></a>
      </footer>

      {lightbox !== null && (
        <div className="signature-lightbox" role="dialog" aria-modal="true" aria-label={`Ảnh ${lightbox + 1}`} onClick={() => setLightbox(null)}>
          <button type="button" onClick={() => setLightbox(null)} aria-label="Đóng ảnh"><X aria-hidden="true" /></button>
          <img src={demo.gallery[lightbox]} alt={`Khoảnh khắc ${lightbox + 1} của ${couple}`} onClick={(event) => event.stopPropagation()} />
        </div>
      )}

      {showVideo && (
        <div className="signature-lightbox" role="dialog" aria-modal="true" aria-label="Video cưới mẫu" onClick={() => setShowVideo(false)}>
          <button type="button" onClick={() => setShowVideo(false)} aria-label="Đóng video"><X aria-hidden="true" /></button>
          <iframe src="https://www.youtube-nocookie.com/embed/VvkYROIh5qc?autoplay=1" title="Video cưới mẫu" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen onClick={(event) => event.stopPropagation()} />
        </div>
      )}
    </main>
  );
}
