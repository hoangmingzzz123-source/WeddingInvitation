import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import {
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  Check,
  Gift,
  Heart,
  MapPin,
  Send,
  Sparkles,
  Sun,
} from 'lucide-react';
import { UNSPLASH_IMAGES } from '../../utils/imageConstants';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MusicPlayer } from '../MusicPlayer';

const gallery = [
  UNSPLASH_IMAGES.couplerBeachSunset,
  UNSPLASH_IMAGES.weddingCeremony,
  UNSPLASH_IMAGES.weddingCoupleDancing,
  UNSPLASH_IMAGES.storyChapter3,
  UNSPLASH_IMAGES.weddingVenue,
];

const events = [
  {
    label: 'Lễ thành hôn',
    time: '16:30 · Thứ Bảy',
    date: '19 tháng 12, 2026',
    venue: 'Bãi biển Mỹ Khê',
    address: 'Võ Nguyên Giáp, Sơn Trà, Đà Nẵng',
  },
  {
    label: 'Tiệc mừng',
    time: '18:00 · Thứ Bảy',
    date: '19 tháng 12, 2026',
    venue: 'The Ocean Terrace',
    address: 'Đường Trường Sa, Ngũ Hành Sơn, Đà Nẵng',
  },
];

export function TropicalSunset() {
  const [rsvpSent, setRsvpSent] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestCount, setGuestCount] = useState('2');
  const [rsvpNote, setRsvpNote] = useState('');
  const [wish, setWish] = useState('');
  const [wishes, setWishes] = useState([
    { name: 'Mai Anh', message: 'Chúc hai bạn luôn giữ được nụ cười rạng rỡ như ngày hôm nay!' },
    { name: 'Quốc Bảo', message: 'Hẹn gặp hai bạn trong buổi hoàng hôn thật đẹp ở Đà Nẵng nhé.' },
  ]);

  const submitRsvp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRsvpSent(true);
  };

  const submitWish = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = wish.trim();
    if (!guestName.trim() || !message) return;
    setWishes((current) => [{ name: guestName.trim(), message }, ...current]);
    setWish('');
  };

  return (
    <main className="tropical-demo">
      <MusicPlayer autoPlay={false} showVolumeControl={false} allowCustomMusic />

      <nav className="tropical-nav" aria-label="Điều hướng thiệp cưới">
        <a href="#tropical-cover" className="tropical-nav__brand" aria-label="Minh và Hương">
          M<span>&</span>H
        </a>
        <div>
          <a href="#tropical-story">Câu chuyện</a>
          <a href="#tropical-gallery">Album</a>
          <a href="#tropical-details">Lịch trình</a>
          <a href="#tropical-rsvp">Xác nhận</a>
        </div>
        <a className="tropical-nav__invite" href="#tropical-rsvp">Gửi lời hồi đáp <ArrowUpRight aria-hidden="true" /></a>
      </nav>

      <section id="tropical-cover" className="tropical-cover" aria-labelledby="tropical-title">
        <div className="tropical-cover__sun" aria-hidden="true"><Sun /></div>
        <div className="tropical-cover__copy">
          <p className="tropical-kicker"><Sparkles aria-hidden="true" /> A sunset celebration · Đà Nẵng</p>
          <p className="tropical-cover__eyebrow">THÂN MỜI BẠN ĐẾN CHUNG VUI</p>
          <h1 id="tropical-title">Minh <i>&</i><br />Hương</h1>
          <p className="tropical-cover__description">
            Một buổi chiều bên biển, những người thân yêu và lời hẹn cùng nhau đi hết một đời.
          </p>
          <div className="tropical-cover__date"><span>THỨ BẢY</span><strong>19 <small>THÁNG 12</small></strong><span>HAI NGHÌN KHÔNG TRĂM HAI MƯƠI SÁU</span></div>
          <a href="#tropical-details" className="tropical-link">Xem lịch trình <ArrowDown aria-hidden="true" /></a>
        </div>
        <div className="tropical-cover__photo-wrap">
          <div className="tropical-cover__photo-frame">
            <ImageWithFallback src={gallery[0]} alt="Cô dâu chú rể bên bờ biển lúc hoàng hôn" className="tropical-cover__photo" />
          </div>
          <span className="tropical-cover__caption">THE BEGINNING OF FOREVER · 2026</span>
          <span className="tropical-cover__seal" aria-hidden="true">M<span>&</span>H</span>
        </div>
        <div className="tropical-cover__bottom" aria-hidden="true"><span>SCROLL TO CELEBRATE</span><i /></div>
      </section>

      <section id="tropical-story" className="tropical-story" aria-labelledby="tropical-story-title">
        <div className="tropical-story__image">
          <ImageWithFallback src={gallery[1]} alt="Khoảnh khắc trong hành trình của Minh và Hương" className="tropical-story__photo" />
          <span className="tropical-story__image-tag">CHAPTER 01 · US</span>
        </div>
        <div className="tropical-story__copy">
          <p className="tropical-kicker">Một cuộc gặp gỡ, nhiều năm thương mến</p>
          <h2 id="tropical-story-title">Từ một lời chào<br /><i>đến lời hẹn trăm năm.</i></h2>
          <p>Chúng mình gặp nhau vào một ngày rất đỗi bình thường. Rồi những chuyến đi, bữa tối muộn và bao câu chuyện nhỏ đã khiến hai thế giới trở thành một.</p>
          <p>Ngày 19 tháng 12, chúng mình muốn kể tiếp câu chuyện ấy bên bờ biển Đà Nẵng — cùng gia đình, bạn bè và những người đã luôn ở cạnh.</p>
          <div className="tropical-story__signature">Minh <span>&</span> Hương</div>
        </div>
      </section>

      <section id="tropical-gallery" className="tropical-gallery" aria-labelledby="tropical-gallery-title">
        <header className="tropical-heading">
          <p className="tropical-kicker">A little piece of us</p>
          <h2 id="tropical-gallery-title">Những ngày <i>đáng nhớ</i></h2>
          <span>Vài khoảnh khắc chúng mình muốn lưu lại cùng bạn.</span>
        </header>
        <div className="tropical-gallery__grid">
          {gallery.slice(1).map((photo, index) => (
            <motion.figure
              key={photo}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className={`tropical-gallery__item tropical-gallery__item--${index + 1}`}
            >
              <ImageWithFallback src={photo} alt={`Ảnh kỷ niệm ${index + 1} của Minh và Hương`} className="tropical-gallery__photo" />
              <figcaption>MEMORY NO. 0{index + 1}</figcaption>
            </motion.figure>
          ))}
          <div className="tropical-gallery__note"><Heart aria-hidden="true" /><span>Always better<br />together.</span></div>
        </div>
      </section>

      <section id="tropical-details" className="tropical-details" aria-labelledby="tropical-details-title">
        <div className="tropical-details__inner">
          <header className="tropical-heading tropical-heading--light">
            <p className="tropical-kicker">Save the date · 19.12.2026</p>
            <h2 id="tropical-details-title">Hẹn gặp bạn <i>bên biển</i></h2>
            <span>Chúng mình rất mong được đón bạn trong ngày vui.</span>
          </header>
          <div className="tropical-event-grid">
            {events.map((item, index) => (
              <article className="tropical-event" key={item.label}>
                <span className="tropical-event__number">0{index + 1}</span>
                <p>{item.label}</p>
                <h3>{item.time}</h3>
                <span className="tropical-event__date"><CalendarDays aria-hidden="true" />{item.date}</span>
                <div className="tropical-event__place"><MapPin aria-hidden="true" /><span><strong>{item.venue}</strong><small>{item.address}</small></span></div>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.venue}, ${item.address}`)}`} target="_blank" rel="noreferrer">
                  Mở bản đồ <ArrowUpRight aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
          <div className="tropical-details__note"><Sparkles aria-hidden="true" /> Trang phục gợi ý: linen, màu trung tính và sắc hoàng hôn.</div>
        </div>
      </section>

      <section className="tropical-gift" aria-labelledby="tropical-gift-title">
        <div className="tropical-gift__card">
          <span className="tropical-gift__icon"><Gift aria-hidden="true" /></span>
          <p className="tropical-kicker">Your presence is our present</p>
          <h2 id="tropical-gift-title">Sự hiện diện của bạn<br /><i>là món quà quý nhất.</i></h2>
          <p>Nếu muốn gửi lời chúc mừng riêng, thiệp cá nhân hóa có thể thêm QR mừng cưới cho cô dâu và chú rể tại đây.</p>
          <div className="tropical-gift__sample"><Gift aria-hidden="true" /><span><strong>Khu vực QR mừng cưới</strong><small>Hiển thị khi cặp đôi thêm thông tin tài khoản</small></span></div>
        </div>
      </section>

      <section id="tropical-rsvp" className="tropical-rsvp" aria-labelledby="tropical-rsvp-title">
        <div className="tropical-rsvp__intro">
          <p className="tropical-kicker">We saved you a seat</p>
          <h2 id="tropical-rsvp-title">Bạn sẽ đến<br /><i>chung vui chứ?</i></h2>
          <p>Cho chúng mình biết trước ngày 05.12.2026 để chuẩn bị đón tiếp chu đáo nhé.</p>
          <div className="tropical-rsvp__date">19<span>DEC</span>26</div>
        </div>
        <div className="tropical-rsvp__form-wrap">
          {rsvpSent ? (
            <div className="tropical-success" role="status"><span><Check aria-hidden="true" /></span><h3>Cảm ơn bạn!</h3><p>Thông tin xác nhận đã được ghi nhận trong bản demo này. Hẹn gặp bạn bên biển nhé.</p></div>
          ) : (
            <form className="tropical-form" onSubmit={submitRsvp}>
              <label>Họ và tên<input required value={guestName} onChange={(event) => setGuestName(event.target.value)} placeholder="Tên của bạn" autoComplete="name" /></label>
              <label>Số người tham dự<select value={guestCount} onChange={(event) => setGuestCount(event.target.value)}><option value="1">1 người</option><option value="2">2 người</option><option value="3">3 người</option><option value="4">4 người</option></select></label>
              <label>Lời nhắn gửi<textarea value={rsvpNote} onChange={(event) => setRsvpNote(event.target.value)} placeholder="Một lời chúc thật đẹp..." rows={3} /></label>
              <button type="submit">Xác nhận tham dự <ArrowUpRight aria-hidden="true" /></button>
              <small>Thông tin chỉ dùng để gia đình chuẩn bị cho buổi tiệc.</small>
            </form>
          )}
        </div>
      </section>

      <section className="tropical-wishes" aria-labelledby="tropical-wishes-title">
        <header className="tropical-heading">
          <p className="tropical-kicker">Leave a little love</p>
          <h2 id="tropical-wishes-title">Gửi đôi lời <i>thương mến</i></h2>
        </header>
        <form className="tropical-wishes__form" onSubmit={submitWish}>
          <label className="visually-hidden" htmlFor="tropical-wish">Lời chúc</label>
          <input id="tropical-wish" value={wish} onChange={(event) => setWish(event.target.value)} placeholder="Viết lời chúc của bạn..." />
          <button type="submit" aria-label="Gửi lời chúc" disabled={!guestName.trim() || !wish.trim()}><Send aria-hidden="true" /></button>
        </form>
        <p className="tropical-wishes__hint">Nhập tên ở phần xác nhận tham dự để ký tên lời chúc.</p>
        <div className="tropical-wishes__list" aria-live="polite">
          {wishes.map((item, index) => <article key={`${item.name}-${index}`}><span>“</span><p>{item.message}</p><small>{item.name}</small></article>)}
        </div>
      </section>

      <footer className="tropical-footer">
        <span>WITH LOVE, ALWAYS</span>
        <p>Minh <i>&</i> Hương</p>
        <span>19 · 12 · 2026 — ĐÀ NẴNG</span>
        <a href="#tropical-cover" aria-label="Về đầu thiệp"><ArrowDown aria-hidden="true" /></a>
      </footer>
    </main>
  );
}
