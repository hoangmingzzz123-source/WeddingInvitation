import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { REAL_WEDDING_TEMPLATE_ID, REAL_WEDDING_URL, weddingTemplates } from './data/templates';

const productionUrl = 'https://wedding-invitation-mp.vercel.app';
const invitationDomain = (import.meta.env.VITE_PUBLIC_INVITATION_DOMAIN ?? '').toLowerCase().replace(/^\.+|\.+$/g, '');

function getCurrentRoute() {
  const hostname = window.location.hostname.toLowerCase();
  if (invitationDomain && hostname.endsWith(`.${invitationDomain}`)) {
    const slug = hostname.slice(0, -(invitationDomain.length + 1));
    if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return `/invite/${slug}`;
  }
  return window.location.pathname;
}

function updateMeta(selector: string, attribute: string, value: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute(attribute, value);
}

const HomePage = lazy(() => import('./components/HomePage').then((module) => ({ default: module.HomePage })));
const TemplatesPage = lazy(() => import('./components/TemplatesPage').then((module) => ({ default: module.TemplatesPage })));
const FeaturesPage = lazy(() => import('./components/FeaturesPage').then((module) => ({ default: module.FeaturesPage })));
const InvitationCreatorPage = lazy(() => import('./components/InvitationCreator').then((module) => ({ default: module.InvitationCreatorPage })));
const LiveInvitationPreviewPage = lazy(() => import('./components/InvitationCreator').then((module) => ({ default: module.LiveInvitationPreviewPage })));
const GeneratedInvitationPage = lazy(() => import('./components/InvitationCreator').then((module) => ({ default: module.GeneratedInvitationPage })));
const CustomerRequestPage = lazy(() => import('./components/CustomerRequestPage').then((module) => ({ default: module.CustomerRequestPage })));
const PublicDemoPage = lazy(() => import('./components/PublicDemoPage').then((module) => ({ default: module.PublicDemoPage })));
const PublishedInvitationPage = lazy(() => import('./components/PublishedInvitationPage').then((module) => ({ default: module.PublishedInvitationPage })));
const AdminLoginPage = lazy(() => import('./components/admin/AdminPages').then((module) => ({ default: module.AdminLoginPage })));
const AdminSetPasswordPage = lazy(() => import('./components/admin/AdminPages').then((module) => ({ default: module.AdminSetPasswordPage })));
const AdminDashboardPage = lazy(() => import('./components/admin/AdminPages').then((module) => ({ default: module.AdminDashboardPage })));
const DemoShell = lazy(() => import('./components/DemoShell').then((module) => ({ default: module.DemoShell })));
const SignatureDemo = lazy(() => import('./components/demos/SignatureDemos').then((module) => ({ default: module.SignatureDemo })));

function RouteLoader() {
  return (
    <div className="route-loader" role="status" aria-live="polite">
      <span />
      <p>Đang mở mẫu thiệp...</p>
    </div>
  );
}

function RealWeddingRedirect() {
  useEffect(() => {
    window.location.replace(REAL_WEDDING_URL);
  }, []);

  return (
    <main className="route-loader">
      <p>Đang mở thiệp Hà Phương &amp; Hoàng Minh...</p>
      <a href={REAL_WEDDING_URL}>Mở website thiệp cưới</a>
    </main>
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
  const [currentRoute, setCurrentRoute] = useState(getCurrentRoute);

  useEffect(() => {
    const handlePopState = () => setCurrentRoute(getCurrentRoute());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    const demoTemplate = weddingTemplates.find((template) => template.route === currentRoute);
    const invitationSlug = /^\/invite\/([a-z0-9-]+)$/i.exec(currentRoute)?.[1];
    let title = 'Wedding Invitation MP | Thiệp cưới online';
    let description = 'Thư viện thiệp cưới online cá nhân hóa, tối ưu điện thoại với album, RSVP, bản đồ và âm nhạc.';

    if (currentRoute === '/') {
      title = 'Wedding Invitation MP | Thiệp cưới online';
    } else if (currentRoute === '/templates') {
      title = 'Thư viện mẫu thiệp cưới | Wedding Invitation MP';
      description = `Khám phá ${weddingTemplates.length} mẫu thiệp cưới online hiện đại, responsive và giàu tương tác.`;
    } else if (currentRoute === '/tinh-nang') {
      title = 'Tính năng thiệp cưới online | Wedding Invitation MP';
      description = 'Khám phá thiệp cưới cá nhân hóa, link riêng cho hai bên gia đình và khách mời, RSVP, bản đồ, album ảnh và các gói thiệp.';
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
    } else if (invitationSlug) {
      title = 'Thiệp cưới | Wedding Invitation MP';
      description = 'Thiệp cưới cá nhân hóa dành cho khách mời.';
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
    const publicUrl = invitationSlug && invitationDomain
      ? `https://${invitationSlug}.${invitationDomain}`
      : currentRoute.startsWith('/preview/') ? productionUrl : productionUrl + currentRoute;
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
      ?.setAttribute('href', publicUrl);
    updateMeta('meta[name="description"]', 'content', description);
    updateMeta('meta[property="og:title"]', 'content', title);
    updateMeta('meta[property="og:description"]', 'content', description);
    updateMeta('meta[property="og:url"]', 'content', publicUrl);
    updateMeta('meta[name="twitter:title"]', 'content', title);
    updateMeta('meta[name="twitter:description"]', 'content', description);
    const isIndexableRoute = currentRoute === '/'
      || currentRoute === '/templates'
      || currentRoute === '/tinh-nang'
      || currentRoute === '/tao-thiep'
      || currentRoute === '/yeu-cau-thiep'
      || Boolean(demoTemplate);
    updateMeta(
      'meta[name="robots"]',
      'content',
      isIndexableRoute ? 'index, follow, max-image-preview:large' : 'noindex, nofollow',
    );
  }, [currentRoute]);

  const demoRoutes = Object.fromEntries(
    weddingTemplates
      .filter((template) => Boolean(template.route))
      .map((template) => [template.route!, <SignatureDemo key={template.id} id={template.id} />]),
  ) as Record<string, ReactNode>;

  const routes: Record<string, ReactNode> = {
    '/': <HomePage />,
    '/templates': <TemplatesPage />,
    '/tinh-nang': <FeaturesPage />,
    '/tao-thiep': new URLSearchParams(window.location.search).get('template') === REAL_WEDDING_TEMPLATE_ID
      ? <RealWeddingRedirect />
      : <InvitationCreatorPage />,
    '/demo/ha-phuong-hoang-minh-2026': <RealWeddingRedirect />,
    '/tao-thiep/live': <LiveInvitationPreviewPage />,
    '/tao-thiep/preview': <GeneratedInvitationPage />,
    '/yeu-cau-thiep': <CustomerRequestPage />,
    '/admin/login': <AdminLoginPage />,
    '/admin/setup-password': <AdminSetPasswordPage />,
    '/admin': <AdminDashboardPage />,
    ...demoRoutes,
  };

  const previewToken = /^\/preview\/([a-f0-9]{48})$/i.exec(currentRoute)?.[1];
  const publishedSlug = /^\/invite\/([a-z0-9-]+)$/i.exec(currentRoute)?.[1];
  const page = previewToken
    ? <PublicDemoPage key={previewToken} token={previewToken} />
    : publishedSlug ? <PublishedInvitationPage key={publishedSlug} slug={publishedSlug} />
      : Object.hasOwn(routes, currentRoute) ? routes[currentRoute] : <NotFoundPage />;

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
