import { ArrowDown, ArrowRight, Check, Heart, MapPin, MessageCircle, Music2, Users, Video } from 'lucide-react';
import { weddingPackages } from '../data/packages';
import { InvitationCreationLauncher } from './InvitationCreationDialog';
import './FeaturesPage.css';

const featureItems = [
  {
    number: '01',
    icon: Heart,
    title: 'Một tấm thiệp mang câu chuyện của hai bạn',
    description: 'Chọn thiết kế, thay tên, ngày cưới, lời mời, ảnh và phong cách. Thiệp hiển thị rõ ràng trên điện thoại lẫn máy tính.',
    tone: 'rose',
  },
  {
    number: '02',
    icon: Users,
    title: 'Một link, hai cách đón tiếp hai gia đình',
    description: 'Dùng cùng link và thêm lựa chọn theo phía nhận thiệp. Mỗi bên có thể có tiêu đề lễ, tiêu đề tiệc và địa chỉ riêng.',
    tone: 'green',
  },
  {
    number: '03',
    icon: MessageCircle,
    title: 'Lời mời riêng cho từng khách',
    description: 'Tạo link có tên và lời chào dành riêng cho khách mời. Khách phản hồi tham dự, còn bạn theo dõi RSVP theo từng người.',
    tone: 'gold',
  },
  {
    number: '04',
    icon: MapPin,
    title: 'Thông tin ngày vui trong cùng một nơi',
    description: 'Giờ, địa điểm, địa chỉ và bản đồ giúp khách xem lịch trình và tìm đường ngay từ thiệp.',
    tone: 'blue',
  },
  {
    number: '05',
    icon: Music2,
    title: 'Ảnh, nhạc và những chi tiết đáng nhớ',
    description: 'Chọn ảnh bìa, sắp xếp album và thêm nhạc hoặc các phần tương tác theo mẫu thiệp và gói đã chọn.',
    tone: 'plum',
  },
  {
    number: '06',
    icon: Video,
    title: 'RSVP để chuẩn bị chu đáo hơn',
    description: 'Tùy gói, khách có thể xác nhận tham dự, số người, nhu cầu đưa đón hoặc chế độ ăn; phản hồi được tổng hợp để bạn tiện theo dõi.',
    tone: 'coral',
  },
];

export function FeaturesPage() {
  return (
    <main className="features-page">
      <header className="features-nav">
        <a className="features-brand" href="/" aria-label="Wedding Invitation MP, trang chủ">
          <span className="features-brand__mark">MP</span>
          <span>Wedding Invitation<small>THIỆP CƯỚI ONLINE</small></span>
        </a>
        <nav aria-label="Điều hướng">
          <a href="/">Trang chủ</a>
          <a href="/templates">Mẫu thiệp</a>
          <a href="#packages">Gói thiệp</a>
        </nav>
        <InvitationCreationLauncher>
          {(openOptions) => <button className="features-nav__cta" type="button" onClick={openOptions}>Tạo thiệp <ArrowRight aria-hidden="true" /></button>}
        </InvitationCreationLauncher>
      </header>

      <section className="features-hero" aria-labelledby="features-title">
        <img src="/images/vietnam/wedding-19476296.webp" alt="Cặp đôi trong trang phục cưới truyền thống Việt Nam" fetchPriority="high" />
        <div className="features-hero__shade" />
        <div className="features-hero__content">
          <p className="features-eyebrow"><span /> THIỆP CƯỚI, THEO CÁCH CỦA HAI BẠN</p>
          <h1 id="features-title">Ngày vui của mình.<br /><em>Lời mời dành cho mọi người.</em></h1>
          <p className="features-hero__lede">Từ một tấm thiệp chung đến lời mời riêng cho từng khách, mọi thông tin cần thiết đều nằm trong một đường link dễ gửi.</p>
          <div className="features-hero__actions">
            <a className="features-button features-button--light" href="#ways-to-invite">Khám phá cách gửi <ArrowDown aria-hidden="true" /></a>
            <a className="features-button features-button--outline" href="/templates">Xem mẫu thiệp <ArrowRight aria-hidden="true" /></a>
          </div>
        </div>
        <span className="features-hero__caption">MỘT CÂU CHUYỆN · NHIỀU CÁCH GỬI</span>
      </section>

      <section className="features-intro" id="ways-to-invite" aria-labelledby="ways-title">
        <div className="features-intro__label"><span>01</span><i /></div>
        <div className="features-intro__copy">
          <p className="features-eyebrow features-eyebrow--dark">GỬI THIỆP ĐÚNG NGƯỜI</p>
          <h2 id="ways-title">Một ngày vui,<br />nhiều lời mời riêng.</h2>
        </div>
        <p className="features-intro__body">Chia sẻ một trang thiệp thống nhất, nhưng vẫn có thể điều chỉnh cách xưng lễ, địa chỉ và lời chào theo từng nhóm khách.</p>
      </section>

      <section className="features-family" aria-labelledby="family-title">
        <div className="features-family__copy">
          <p className="features-eyebrow features-eyebrow--dark">CHO HAI BÊN GIA ĐÌNH</p>
          <h2 id="family-title">Cùng một link.<br />Đúng lễ từng nhà.</h2>
          <p>Thiết lập nội dung riêng cho nhà trai và nhà gái trong Studio. Mỗi link mở cùng một thiết kế, nhưng hiển thị đúng tiêu đề lễ, tên tiệc và địa chỉ tương ứng.</p>
          <div className="features-family__links">
            <span><i>01</i> Nhà trai </span>
            <span><i>02</i> Nhà gái </span>
          </div>
        </div>
        <div className="features-family__visual" aria-label="Ví dụ nội dung thiệp hai bên gia đình">
          <article className="features-family__invite features-family__invite--groom">
            <span>NHÀ TRAI</span><i />
            <strong>Lễ Thành Hôn</strong>
            <small>Đón khách tại địa chỉ nhà trai</small>
          </article>
          <article className="features-family__invite features-family__invite--bride">
            <span>NHÀ GÁI</span><i />
            <strong>Lễ Vu Quy</strong>
            <small>Đón khách tại địa chỉ nhà gái</small>
          </article>
          <div className="features-family__connector"><Heart aria-hidden="true" /></div>
        </div>
      </section>

      <section className="features-guest" aria-labelledby="guest-title">
        <div className="features-guest__photo">
          <img src="/images/vietnam-modern/ao-dai-02.webp" alt="Cô dâu và chú rể trong bộ áo dài cưới" loading="lazy" />
          <span>THÂN MỜI GIA ĐÌNH ANH MINH</span>
        </div>
        <div className="features-guest__copy">
          <p className="features-eyebrow features-eyebrow--dark">CHO TỪNG KHÁCH MỜI</p>
          <h2 id="guest-title">Không chỉ là<br />“gửi một tấm thiệp”.</h2>
          <p>Ở gói Premium trở lên, tạo lời mời có tên khách và lời chào cá nhân hóa. Link riêng giúp khách mở đúng lời mời của mình và gửi RSVP thuận tiện.</p>
          <ul>
            <li><Check aria-hidden="true" /> Lời chào theo tên khách</li>
            <li><Check aria-hidden="true" /> RSVP gắn với khách mời</li>
            <li><Check aria-hidden="true" /> Theo dõi phản hồi tập trung</li>
          </ul>
          <a className="features-text-link" href="#packages">Xem gói có link khách mời <ArrowRight aria-hidden="true" /></a>
        </div>
      </section>

      <section className="features-overview" aria-labelledby="overview-title">
        <div className="features-section-heading">
          <p className="features-eyebrow features-eyebrow--dark">MỌI CHI TIẾT TRONG MỘT TẤM THIỆP</p>
          <h2 id="overview-title">Đẹp để ngắm.<br /><em>Tiện để dùng.</em></h2>
        </div>
        <div className="features-overview__grid">
          {featureItems.map(({ number, icon: Icon, title, description, tone }) => (
            <article className={`features-item features-item--${tone}`} key={number}>
              <div><span>{number}</span><Icon aria-hidden="true" /></div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="features-packages" id="packages" aria-labelledby="packages-title">
        <div className="features-section-heading">
          <p className="features-eyebrow">CHỌN VỪA ĐỦ CHO NGÀY VUI</p>
          <h2 id="packages-title">Ba gói thiệp.<br /><em>Một câu chuyện của bạn.</em></h2>
        </div>
        <div className="features-packages__grid">
          {weddingPackages.map((weddingPackage, index) => (
            <article className={`features-package${weddingPackage.popular ? ' is-popular' : ''}`} key={weddingPackage.id}>
              <div className="features-package__top"><span>0{index + 1} / 03</span>{weddingPackage.popular && <b>ĐƯỢC CHỌN NHIỀU</b>}</div>
              <h3>{weddingPackage.name}</h3>
              <p>{weddingPackage.summary}</p>
              <strong className="features-package__price">{weddingPackage.price}</strong>
              <ul>{weddingPackage.features.map((feature) => <li key={feature}><Check aria-hidden="true" />{feature}</li>)}</ul>
              <InvitationCreationLauncher>
                {(openOptions) => <button className="features-package__button" type="button" onClick={openOptions}>Chọn gói này <ArrowRight aria-hidden="true" /></button>}
              </InvitationCreationLauncher>
            </article>
          ))}
        </div>
      </section>

      <section className="features-last-call" aria-labelledby="last-call-title">
        <p className="features-eyebrow">BẮT ĐẦU TỪ MỘT LỜI MỜI</p>
        <h2 id="last-call-title">Cùng kể câu chuyện<br /><em>ngày vui của bạn.</em></h2>
        <div>
          <InvitationCreationLauncher>
            {(openOptions) => <button className="features-button features-button--light" type="button" onClick={openOptions}>Bắt đầu tạo thiệp <ArrowRight aria-hidden="true" /></button>}
          </InvitationCreationLauncher>
          <a className="features-button features-button--outline" href="/templates">Khám phá thư viện mẫu</a>
        </div>
      </section>

      <footer className="features-footer">
        <a className="features-brand" href="/" aria-label="Wedding Invitation MP, trang chủ">
          <span className="features-brand__mark">MP</span>
          <span>Wedding Invitation<small>THIỆP CƯỚI ONLINE</small></span>
        </a>
        <span>Thiệp cưới online, gửi trọn lời thương.</span>
        <a href="mailto:wedding.invitation.mp@gmail.com">Liên hệ tư vấn <ArrowRight aria-hidden="true" /></a>
      </footer>
    </main>
  );
}