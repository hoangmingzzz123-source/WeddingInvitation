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
const DemoShell = lazy(() => import('./components/DemoShell').then((module) => ({ default: module.DemoShell })));
const ClassicMinimalist = lazy(() => import('./components/demos/ClassicMinimalist').then((module) => ({ default: module.ClassicMinimalist })));
const BlushFloral = lazy(() => import('./components/demos/BlushFloral').then((module) => ({ default: module.BlushFloral })));
const BlushFloralEnhanced = lazy(() => import('./components/demos/BlushFloralEnhanced').then((module) => ({ default: module.BlushFloralEnhanced })));
const BloomCrystal3D = lazy(() => import('./components/demos/BloomCrystal3D').then((module) => ({ default: module.BloomCrystal3D })));
const BloomCrystal3DEnhanced = lazy(() => import('./components/demos/BloomCrystal3DEnhanced').then((module) => ({ default: module.BloomCrystal3DEnhanced })));
const SoftFadeFloral = lazy(() => import('./components/demos/SoftFadeFloral').then((module) => ({ default: module.SoftFadeFloral })));
const MinimalSlideClean = lazy(() => import('./components/demos/MinimalSlideClean').then((module) => ({ default: module.MinimalSlideClean })));
const LuxuryGoldCinematic = lazy(() => import('./components/demos/LuxuryGoldCinematic').then((module) => ({ default: module.LuxuryGoldCinematic })));
const LuxuryGoldCinematicEnhanced = lazy(() => import('./components/demos/LuxuryGoldCinematicEnhanced').then((module) => ({ default: module.LuxuryGoldCinematicEnhanced })));
const ArtDecoRoyal = lazy(() => import('./components/demos/ArtDecoRoyal').then((module) => ({ default: module.ArtDecoRoyal })));
const VintageGrain = lazy(() => import('./components/demos/VintageGrain').then((module) => ({ default: module.VintageGrain })));
const GreenElegance = lazy(() => import('./components/demos/GreenElegance').then((module) => ({ default: module.GreenElegance })));
const CinematicLoveStory = lazy(() => import('./components/demos/CinematicLoveStory').then((module) => ({ default: module.CinematicLoveStory })));
const CinematicLoveStoryEnhanced = lazy(() => import('./components/demos/CinematicLoveStoryEnhanced').then((module) => ({ default: module.CinematicLoveStoryEnhanced })));
const MinimalElegant = lazy(() => import('./components/demos/MinimalElegant').then((module) => ({ default: module.MinimalElegant })));
const MinimalElegantEnhanced = lazy(() => import('./components/demos/MinimalElegantEnhanced').then((module) => ({ default: module.MinimalElegantEnhanced })));
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
    '/demo/classic-minimalist': <ClassicMinimalist />,
    '/demo/blush-floral': <BlushFloral />,
    '/demo/soft-fade-floral': <SoftFadeFloral />,
    '/demo/minimal-slide-clean': <MinimalSlideClean />,
    '/demo/modern-dark-blue': <BlushFloralEnhanced />,
    '/demo/luxury-gold-frame': <LuxuryGoldCinematic />,
    '/demo/luxury-gold-cinematic': <LuxuryGoldCinematicEnhanced />,
    '/demo/vintage-film': <CinematicLoveStoryEnhanced />,
    '/demo/romantic-watercolor': <VietnameseTraditionalEnhanced />,
    '/demo/bloom-crystal-3d': <BloomCrystal3DEnhanced />,
    '/demo/tropical-sunset': <DemoThiep219kThiep1 />,
    '/demo/art-deco-royal': <DemoThiep219kCinema />,
    '/demo/vintage-grain': <VintageGrain />,
    '/demo/green-elegance': <GreenElegance />,
    '/demo/cinematic-love-story': <CinematicLoveStory />,
    '/demo/minimal-elegant': <MinimalElegantEnhanced />,
    '/demo/vietnamese-traditional': <DemoThiep219kTraditional />,
    '/demo/bloom-crystal-3d-basic': <BloomCrystal3D />,
    '/demo/art-deco-royal-basic': <ArtDecoRoyal />,
    '/demo/minimal-elegant-basic': <MinimalElegant />,
  };

  const page = routes[currentRoute] ?? <NotFoundPage />;

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
