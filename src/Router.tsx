import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { weddingTemplates } from './data/templates';

const productionUrl = 'https://wedding-invitation-five-orpin.vercel.app';

function updateMeta(selector: string, attribute: string, value: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute(attribute, value);
}

const HomePage = lazy(() => import('./components/HomePage').then((module) => ({ default: module.HomePage })));
const TemplatesPage = lazy(() => import('./components/TemplatesPage').then((module) => ({ default: module.TemplatesPage })));
const InvitationCreatorPage = lazy(() => import('./components/InvitationCreator').then((module) => ({ default: module.InvitationCreatorPage })));
const GeneratedInvitationPage = lazy(() => import('./components/InvitationCreator').then((module) => ({ default: module.GeneratedInvitationPage })));
const CustomerRequestPage = lazy(() => import('./components/CustomerRequestPage').then((module) => ({ default: module.CustomerRequestPage })));
const PublicDemoPage = lazy(() => import('./components/PublicDemoPage').then((module) => ({ default: module.PublicDemoPage })));
const AdminLoginPage = lazy(() => import('./components/admin/AdminPages').then((module) => ({ default: module.AdminLoginPage })));
const AdminDashboardPage = lazy(() => import('./components/admin/AdminPages').then((module) => ({ default: module.AdminDashboardPage })));
const DemoShell = lazy(() => import('./components/DemoShell').then((module) => ({ default: module.DemoShell })));
const SignatureDemo = lazy(() => import('./components/demos/SignatureDemos').then((module) => ({ default: module.SignatureDemo })));
const ClassicMinimalist = lazy(() => import('./components/demos/ClassicMinimalist').then((module) => ({ default: module.ClassicMinimalist })));
const BlushFloral = lazy(() => import('./components/demos/BlushFloral').then((module) => ({ default: module.BlushFloral })));
const BloomCrystal3D = lazy(() => import('./components/demos/BloomCrystal3D').then((module) => ({ default: module.BloomCrystal3D })));
const SoftFadeFloral = lazy(() => import('./components/demos/SoftFadeFloral').then((module) => ({ default: module.SoftFadeFloral })));
const MinimalSlideClean = lazy(() => import('./components/demos/MinimalSlideClean').then((module) => ({ default: module.MinimalSlideClean })));
const RomanticWatercolor = lazy(() => import('./components/demos/RomanticWatercolor').then((module) => ({ default: module.RomanticWatercolor })));
const TropicalSunset = lazy(() => import('./components/demos/TropicalSunset').then((module) => ({ default: module.TropicalSunset })));
const VintageGrain = lazy(() => import('./components/demos/VintageGrain').then((module) => ({ default: module.VintageGrain })));
const GreenElegance = lazy(() => import('./components/demos/GreenElegance').then((module) => ({ default: module.GreenElegance })));
const CinematicLoveStory = lazy(() => import('./components/demos/CinematicLoveStory').then((module) => ({ default: module.CinematicLoveStory })));
const CinematicLoveStoryEnhanced = lazy(() => import('./components/demos/CinematicLoveStoryEnhanced').then((module) => ({ default: module.CinematicLoveStoryEnhanced })));
const MinimalElegant = lazy(() => import('./components/demos/MinimalElegant').then((module) => ({ default: module.MinimalElegant })));
const VietnameseTraditionalEnhanced = lazy(() => import('./components/demos/VietnameseTraditionalEnhanced').then((module) => ({ default: module.VietnameseTraditionalEnhanced })));
const DemoThiep219kThiep1 = lazy(() => import('./Demo/Demo219k/Demo1/App'));
const DemoThiep219kTraditional = lazy(() => import('./Demo/Demo219k/Traditional/App'));
const DemoThiep219kCinema = lazy(() => import('./Demo/Demo219k/Cinema/App'));

function RouteLoader() {
  return (
    <div className="route-loader" role="status" aria-live="polite">
      <span />
      <p>Đang mở mẫu thiệp...</p>
    </div>
  );
}

function NotFoundPage() {
  return (
    <main className="not-found-page">
      <p>404</p>
      <h1>Trang bạn tìm không còn ở đây</h1>
      <span>Hãy quay về thư viện để tiếp tục khám phá các mẫu thiệp.</span>
      <button type="button" onClick={() => navigateTo('/templates')}>Xem thư viện mẫu</button>
    </main>
  );
}

export function Router() {
  const [currentRoute, setCurrentRoute] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setCurrentRoute(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    const demoTemplate = weddingTemplates.find((template) => template.route === currentRoute);
    let title = 'Wedding Invitation MP | Thiệp cưới online';
    let description = 'Thư viện thiệp cưới online cá nhân hóa, tối ưu điện thoại với album, RSVP, bản đồ và âm nhạc.';

    if (currentRoute === '/') {
      title = 'Wedding Invitation MP | Thiệp cưới online';
    } else if (currentRoute === '/templates') {
      title = 'Thư viện mẫu thiệp cưới | Wedding Invitation MP';
      description = `Khám phá ${weddingTemplates.length} mẫu thiệp cưới online hiện đại, responsive và giàu tương tác.`;
    } else if (currentRoute === '/tao-thiep') {
      title = 'Tự tạo demo thiệp cưới | Wedding Invitation MP';
      description = 'Tạo nhanh bản demo thiệp cưới online từ thông tin và phong cách của bạn.';
    } else if (currentRoute === '/tao-thiep/preview') {
      title = 'Demo thiệp cưới | Wedding Invitation MP';
      description = 'Bản xem trước thiệp cưới online được cá nhân hóa.';
    } else if (currentRoute === '/yeu-cau-thiep') {
      title = 'Gửi yêu cầu làm thiệp | Wedding Invitation MP';
      description = 'Gửi thông tin ngày cưới để nhận bản demo thiệp online được cá nhân hóa.';
    } else if (currentRoute.startsWith('/preview/')) {
      title = 'Bản demo riêng | Wedding Invitation MP';
      description = 'Bản xem trước thiệp cưới dành riêng cho khách hàng.';
    } else if (currentRoute.startsWith('/admin')) {
      title = 'Quản trị | Wedding Invitation MP';
      description = 'Khu vực quản trị nội bộ.';
    } else if (demoTemplate) {
      title = `${demoTemplate.name} | Mẫu thiệp cưới MP`;
      description = demoTemplate.description;
    } else {
      title = 'Không tìm thấy trang | Wedding Invitation MP';
      description = 'Trang bạn tìm không tồn tại. Khám phá thư viện mẫu thiệp cưới online của Wedding Invitation MP.';
    }

    document.title = title;
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
      ?.setAttribute('href', `${productionUrl}${currentRoute === '/' ? '/' : currentRoute}`);
    updateMeta('meta[name="description"]', 'content', description);
    updateMeta('meta[property="og:title"]', 'content', title);
    updateMeta('meta[property="og:description"]', 'content', description);
    updateMeta('meta[property="og:url"]', 'content', `${productionUrl}${currentRoute === '/' ? '/' : currentRoute}`);
    updateMeta('meta[name="twitter:title"]', 'content', title);
    updateMeta('meta[name="twitter:description"]', 'content', description);
    const isIndexableRoute = currentRoute === '/'
      || currentRoute === '/templates'
      || currentRoute === '/tao-thiep'
      || currentRoute === '/yeu-cau-thiep'
      || Boolean(demoTemplate);
    updateMeta(
      'meta[name="robots"]',
      'content',
      isIndexableRoute ? 'index, follow, max-image-preview:large' : 'noindex, nofollow',
    );
  }, [currentRoute]);

  const routes: Record<string, ReactNode> = {
    '/': <HomePage />,
    '/templates': <TemplatesPage />,
    '/tao-thiep': <InvitationCreatorPage />,
    '/tao-thiep/preview': <GeneratedInvitationPage />,
    '/yeu-cau-thiep': <CustomerRequestPage />,
    '/admin/login': <AdminLoginPage />,
    '/admin': <AdminDashboardPage />,
    '/demo/classic-minimalist': <ClassicMinimalist />,
    '/demo/blush-floral': <BlushFloral />,
    '/demo/soft-fade-floral': <SoftFadeFloral />,
    '/demo/minimal-slide-clean': <MinimalSlideClean />,
    '/demo/modern-dark-blue': <SignatureDemo id="modern-dark-blue" />,
    '/demo/luxury-gold-frame': <SignatureDemo id="luxury-gold-frame" />,
    '/demo/luxury-gold-cinematic': <SignatureDemo id="luxury-gold-cinematic" />,
    '/demo/vintage-film': <CinematicLoveStoryEnhanced />,
    '/demo/romantic-watercolor': <RomanticWatercolor />,
    '/demo/bloom-crystal-3d': <SignatureDemo id="bloom-crystal-3d" />,
    '/demo/tropical-sunset': <TropicalSunset />,
    '/demo/art-deco-royal': <SignatureDemo id="art-deco-royal" />,
    '/demo/vintage-grain': <VintageGrain />,
    '/demo/green-elegance': <GreenElegance />,
    '/demo/cinematic-love-story': <CinematicLoveStory />,
    '/demo/minimal-elegant': <SignatureDemo id="minimal-elegant" />,
    '/demo/vietnamese-traditional': <VietnameseTraditionalEnhanced />,
    '/demo/bloom-crystal-3d-basic': <BloomCrystal3D />,
    '/demo/art-deco-royal-basic': <SignatureDemo id="art-deco-royal-basic" />,
    '/demo/minimal-elegant-basic': <MinimalElegant />,
    '/demo/rose-storybook-219k': <DemoThiep219kThiep1 />,
    '/demo/vietnamese-traditional-219k': <DemoThiep219kTraditional />,
    '/demo/burgundy-cinema-219k': <DemoThiep219kCinema />,
    '/demo/song-hy-contemporary': <SignatureDemo id="song-hy-contemporary" />,
    '/demo/riviera-blue': <SignatureDemo id="riviera-blue" />,
    '/demo/hoa-moc-editorial': <SignatureDemo id="hoa-moc-editorial" />,
    '/demo/summer-postcard': <SignatureDemo id="summer-postcard" />,
  };

  const previewToken = currentRoute.startsWith('/preview/')
    ? decodeURIComponent(currentRoute.slice('/preview/'.length))
    : '';
  const page = previewToken ? <PublicDemoPage token={previewToken} /> : routes[currentRoute] ?? <NotFoundPage />;

  return (
    <Suspense fallback={<RouteLoader />}>
      {currentRoute.startsWith('/demo/') ? <DemoShell route={currentRoute}>{page}</DemoShell> : page}
    </Suspense>
  );
}

export function navigateTo(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
