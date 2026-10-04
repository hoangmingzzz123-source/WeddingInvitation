import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import {
  ArrowLeft,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Heart,
  Info,
  Keyboard,
  Layers3,
  Maximize2,
  Minimize2,
  Share2,
  Sparkles,
  X,
} from 'lucide-react';
import { navigateTo } from '../Router';
import { templateTierLabels, weddingTemplates } from '../data/templates';
import { trackEvent } from '../utils/analytics';
import {
  isTemplateFavorite,
  TEMPLATE_FAVORITES_EVENT,
  toggleTemplateFavorite,
} from '../utils/templateFavorites';
import { InvitationCreationLauncher } from './InvitationCreationDialog';

interface DemoSection {
  element: HTMLElement;
  label: string;
}

const demoAccents: Record<string, string> = {
  'luxury-gold-cinematic': '#d5ae58',
  'luxury-gold-frame': '#c99a44',
  'vintage-film': '#c6a77d',
  'art-deco-royal': '#d8b762',
  'art-deco-royal-basic': '#c6a554',
  'romantic-watercolor': '#c8788d',
  'cinematic-love-story': '#d36b53',
  'bloom-crystal-3d': '#9c7ae4',
  'bloom-crystal-3d-basic': '#8d79c9',
  'modern-dark-blue': '#668bd7',
  'minimal-elegant': '#8a9aaa',
  'minimal-elegant-basic': '#9b8b7c',
  'minimal-slide-clean': '#3b9a8a',
  'tropical-sunset': '#ef8666',
  'classic-minimalist': '#a08062',
  'blush-floral': '#d78ca8',
  'soft-fade-floral': '#bd7f98',
  'vietnamese-traditional': '#d84743',
  'vintage-grain': '#af7b4f',
  'green-elegance': '#557d65',
};

function getSectionLabel(section: HTMLElement, index: number) {
  const explicitLabel = section.dataset.sectionTitle || section.getAttribute('aria-label');
  const heading = section.querySelector<HTMLElement>('h1, h2, h3');
  const label = explicitLabel || heading?.innerText || `Phần ${index + 1}`;
  const normalized = label.replace(/\s+/g, ' ').trim();
  return normalized.length > 36 ? `${normalized.slice(0, 33)}…` : normalized;
}

export function DemoShell({ route, children }: { route: string; children: ReactNode }) {
  const template = weddingTemplates.find((item) => item.route === route);
  const internalTemplates = useMemo(
    () => weddingTemplates.filter((item) => Boolean(item.route)),
    [],
  );
  const templateIndex = internalTemplates.findIndex((item) => item.route === route);
  const previousTemplate = internalTemplates[(templateIndex - 1 + internalTemplates.length) % internalTemplates.length];
  const nextTemplate = internalTemplates[(templateIndex + 1) % internalTemplates.length];
  const [sections, setSections] = useState<DemoSection[]>([]);
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showOverview, setShowOverview] = useState(false);
  const [isFavorite, setIsFavorite] = useState(() => template ? isTemplateFavorite(template.id) : false);
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));
  const [toastMessage, setToastMessage] = useState('');
  const toastTimer = useRef<number | null>(null);
  const accent = template ? demoAccents[template.id] ?? '#d9b764' : '#d9b764';
  const shellStyle = { '--demo-accent': accent } as CSSProperties;

  const showToast = useCallback((message: string) => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setToastMessage(message);
    toastTimer.current = window.setTimeout(() => setToastMessage(''), 2800);
  }, []);

  const openTemplate = useCallback((destination: typeof previousTemplate, direction: 'previous' | 'next') => {
    if (!destination?.route) return;
    trackEvent('demo_template_navigate', {
      from_template_id: template?.id,
      to_template_id: destination.id,
      direction,
    });
    navigateTo(destination.route);
  }, [template?.id]);

  const toggleFavorite = useCallback(() => {
    if (!template) return;
    const nextFavoriteState = toggleTemplateFavorite(template.id);
    setIsFavorite(nextFavoriteState);
    showToast(nextFavoriteState ? 'Đã lưu mẫu vào danh sách yêu thích' : 'Đã bỏ mẫu khỏi danh sách yêu thích');
    trackEvent('template_favorite_toggle', {
      template_id: template.id,
      is_favorite: nextFavoriteState,
      source: 'demo_toolbar',
    });
  }, [showToast, template]);

  const shareDemo = useCallback(async () => {
    const shareData = {
      title: template?.name ?? 'Mẫu thiệp cưới Wedding Invitation MP',
      text: template?.description ?? 'Khám phá mẫu thiệp cưới online này.',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        showToast('Đã mở bảng chia sẻ mẫu thiệp');
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        showToast('Đã sao chép liên kết mẫu thiệp');
      } else {
        window.prompt('Sao chép liên kết mẫu thiệp:', shareData.url);
      }
      trackEvent('demo_share', { template_id: template?.id });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      showToast('Chưa thể chia sẻ. Hãy thử sao chép liên kết trên trình duyệt.');
    }
  }, [showToast, template]);

  const toggleFullscreen = useCallback(async () => {
    try {
      const willEnterFullscreen = !document.fullscreenElement;
      if (!willEnterFullscreen) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      else {
        showToast('Trình duyệt này chưa hỗ trợ chế độ toàn màn hình');
        return;
      }
      trackEvent('demo_fullscreen_toggle', {
        template_id: template?.id,
        is_fullscreen: willEnterFullscreen,
      });
    } catch {
      showToast('Không thể mở toàn màn hình trên thiết bị này');
    }
  }, [showToast, template?.id]);

  useEffect(() => {
    setShowOverview(false);
    setSections([]);
    setActiveSection(0);
    setIsFavorite(template ? isTemplateFavorite(template.id) : false);
    if (template) {
      trackEvent('demo_view', { template_id: template.id, template_tier: template.tier });
    }

    let frame = 0;
    let pageSections: HTMLElement[] = [];

    const updatePosition = () => {
      frame = 0;
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollableHeight > 0 ? Math.min(window.scrollY / scrollableHeight, 1) : 0);

      if (!pageSections.length) return;
      let currentSection = 0;
      const focusLine = window.innerHeight * 0.42;
      pageSections.forEach((section, index) => {
        if (section.getBoundingClientRect().top <= focusLine) currentSection = index;
      });
      setActiveSection(currentSection);
    };

    const handleScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updatePosition);
    };

    const initializeSections = () => {
      pageSections = Array.from(document.querySelectorAll<HTMLElement>('.demo-shell section'));
      setSections(pageSections.map((element, index) => ({
        element,
        label: getSectionLabel(element, index),
      })));
      updatePosition();
    };

    const initializeTimer = window.setTimeout(initializeSections, 120);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.clearTimeout(initializeTimer);
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [route, template]);

  useEffect(() => {
    const syncFavorite = () => setIsFavorite(template ? isTemplateFavorite(template.id) : false);
    const syncFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.matches('input, textarea, select, [contenteditable="true"]');

      if (event.key === 'Escape') setShowOverview(false);
      if (isTyping) return;

      if (event.altKey && event.key === 'ArrowLeft') {
        event.preventDefault();
        openTemplate(previousTemplate, 'previous');
      } else if (event.altKey && event.key === 'ArrowRight') {
        event.preventDefault();
        openTemplate(nextTemplate, 'next');
      } else if (!event.altKey && !event.ctrlKey && !event.metaKey && event.key.toLowerCase() === 'f') {
        event.preventDefault();
        toggleFavorite();
      } else if (event.key === '?') {
        showToast('Phím tắt: F lưu mẫu · Alt + ←/→ đổi mẫu · I xem thông tin');
      } else if (!event.altKey && !event.ctrlKey && !event.metaKey && event.key.toLowerCase() === 'i') {
        setShowOverview(true);
      }
    };

    window.addEventListener(TEMPLATE_FAVORITES_EVENT, syncFavorite);
    window.addEventListener('storage', syncFavorite);
    document.addEventListener('fullscreenchange', syncFullscreen);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener(TEMPLATE_FAVORITES_EVENT, syncFavorite);
      window.removeEventListener('storage', syncFavorite);
      document.removeEventListener('fullscreenchange', syncFullscreen);
      window.removeEventListener('keydown', handleKeyDown);
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, [nextTemplate, openTemplate, previousTemplate, showToast, template, toggleFavorite]);

  const scrollToSection = (section: DemoSection, index: number) => {
    setActiveSection(index);
    section.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    trackEvent('demo_section_navigate', {
      template_id: template?.id,
      section_name: section.label,
      section_index: index,
    });
  };

  return (
    <div className="demo-shell" style={shellStyle}>
      <div className="demo-toolbar">
        <button type="button" onClick={() => navigateTo('/templates')}>
          <ArrowLeft aria-hidden="true" />
          <span>Thư viện</span>
        </button>

        <button
          type="button"
          className="demo-toolbar__overview"
          onClick={() => setShowOverview(true)}
          aria-label={`Xem thông tin mẫu ${template?.name ?? 'thiệp cưới'}`}
        >
          <Sparkles aria-hidden="true" />
          <span><small>Đang xem demo</small>{template?.name ?? 'Mẫu thiệp cưới'}</span>
          <Info aria-hidden="true" />
        </button>

        <InvitationCreationLauncher>
          {(openOptions) => (
            <button type="button" className="demo-toolbar__cta" onClick={openOptions}>Tạo thiệp từ mẫu này</button>
          )}
        </InvitationCreationLauncher>

        <span className="demo-toolbar__progress" aria-hidden="true">
          <i style={{ transform: `scaleX(${scrollProgress})` }} />
        </span>
      </div>

      {sections.length > 1 && (
        <nav className="demo-section-nav" aria-label="Mục trong mẫu thiệp">
          <strong>{String(activeSection + 1).padStart(2, '0')}<small>/{String(sections.length).padStart(2, '0')}</small></strong>
          <div>
            {sections.map((section, index) => (
              <button
                type="button"
                key={`${section.label}-${index}`}
                className={activeSection === index ? 'is-active' : ''}
                onClick={() => scrollToSection(section, index)}
                aria-label={`Đi tới ${section.label}`}
                aria-current={activeSection === index ? 'step' : undefined}
              >
                <i />
                <span>{section.label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}

      <div className="demo-action-dock" role="toolbar" aria-label="Công cụ mẫu thiệp">
        <button
          type="button"
          className={isFavorite ? 'is-active' : ''}
          onClick={toggleFavorite}
          aria-label={isFavorite ? 'Bỏ lưu mẫu này' : 'Lưu mẫu yêu thích'}
          aria-pressed={isFavorite}
          data-tooltip={isFavorite ? 'Đã lưu' : 'Lưu mẫu'}
        >
          <Heart aria-hidden="true" fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
        <button type="button" onClick={shareDemo} aria-label="Chia sẻ mẫu" data-tooltip="Chia sẻ">
          <Share2 aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? 'Thoát toàn màn hình' : 'Xem toàn màn hình'}
          data-tooltip={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
        >
          {isFullscreen ? <Minimize2 aria-hidden="true" /> : <Maximize2 aria-hidden="true" />}
        </button>
        <button
          type="button"
          onClick={() => showToast('Phím tắt: F lưu mẫu · Alt + ←/→ đổi mẫu · I xem thông tin')}
          aria-label="Xem phím tắt"
          data-tooltip="Phím tắt"
        >
          <Keyboard aria-hidden="true" />
        </button>
      </div>

      <button
        type="button"
        className={`demo-back-top${scrollProgress > 0.08 ? ' is-visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Về đầu mẫu thiệp"
      >
        <ArrowUp aria-hidden="true" />
      </button>

      <div className={`demo-toast${toastMessage ? ' is-visible' : ''}`} role="status" aria-live="polite">
        {toastMessage}
      </div>

      {children}

      {showOverview && (
        <div
          className="demo-overview__backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowOverview(false);
          }}
        >
          <section
            className="demo-overview"
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-overview-title"
          >
            <button
              type="button"
              className="demo-overview__close"
              onClick={() => setShowOverview(false)}
              aria-label="Đóng thông tin mẫu"
            >
              <X aria-hidden="true" />
            </button>

            <div className="demo-overview__eyebrow">
              <Layers3 aria-hidden="true" />
              <span>{template ? templateTierLabels[template.tier] : 'Mẫu thiệp cưới'}</span>
              <i />
              <span>{template?.style}</span>
            </div>
            <h2 id="demo-overview-title">{template?.name ?? 'Mẫu thiệp cưới'}</h2>
            <p>{template?.description}</p>

            <div className="demo-overview__features">
              {template?.features.map((feature) => <span key={feature}>{feature}</span>)}
            </div>

            <InvitationCreationLauncher>
              {(openOptions) => (
                <button type="button" className="demo-overview__cta" onClick={openOptions}>
                  Tạo thiệp theo mẫu này <ChevronRight aria-hidden="true" />
                </button>
              )}
            </InvitationCreationLauncher>

            <div className="demo-overview__switcher">
              <button type="button" onClick={() => openTemplate(previousTemplate, 'previous')}>
                <ChevronLeft aria-hidden="true" />
                <span><small>Mẫu trước</small>{previousTemplate.name}</span>
              </button>
              <button type="button" onClick={() => openTemplate(nextTemplate, 'next')}>
                <span><small>Mẫu tiếp theo</small>{nextTemplate.name}</span>
                <ChevronRight aria-hidden="true" />
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
