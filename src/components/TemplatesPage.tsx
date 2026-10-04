import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowUp, Filter, Search, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { navigateTo } from '../Router';
import {
  templateTierLabels,
  weddingTemplates,
  type TemplateTier,
} from '../data/templates';
import { TemplateCard } from './TemplateCard';
import { InvitationCreationLauncher } from './InvitationCreationDialog';

type TierFilter = 'all' | TemplateTier;

const tierOrder: TierFilter[] = ['all', '109k', '159k', '199k'];

function readInitialTier(): TierFilter {
  const tier = new URLSearchParams(window.location.search).get('filter');
  return tier === '109k' || tier === '159k' || tier === '199k' ? tier : 'all';
}

export function TemplatesPage() {
  const [selectedTier, setSelectedTier] = useState<TierFilter>(readInitialTier);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    document.title = 'Thư viện mẫu thiệp cưới | Wedding Invitation MP';
    const handleScroll = () => setShowBackToTop(window.scrollY > 640);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredTemplates = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase('vi');

    return weddingTemplates.filter((template) => {
      const matchesTier = selectedTier === 'all' || template.tier === selectedTier;
      const matchesSearch =
        !normalizedSearch ||
        [template.name, template.style, template.description, ...template.features]
          .join(' ')
          .toLocaleLowerCase('vi')
          .includes(normalizedSearch);

      return matchesTier && matchesSearch;
    });
  }, [searchTerm, selectedTier]);

  const selectTier = (tier: TierFilter) => {
    setSelectedTier(tier);
    const url = tier === 'all' ? '/templates' : `/templates?filter=${tier}`;
    window.history.replaceState({}, '', url);
  };

  return (
    <main className="templates-page">
      <header className="templates-header">
        <div className="templates-header__inner">
          <button className="templates-back" type="button" onClick={() => navigateTo('/')}>
            <ArrowLeft aria-hidden="true" />
            <span>Trang chủ</span>
          </button>
          <a
            className="templates-brand"
            href="/"
            onClick={(event) => {
              event.preventDefault();
              navigateTo('/');
            }}
          >
            Wedding Invitation <span>MP</span>
          </a>
          <InvitationCreationLauncher>
            {(openOptions) => (
              <button type="button" className="templates-contact" onClick={openOptions}>
                Tạo thiệp riêng
              </button>
            )}
          </InvitationCreationLauncher>
        </div>
      </header>

      <section className="templates-hero" aria-labelledby="templates-title">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="templates-hero__content"
        >
          <p className="templates-kicker">
            <Sparkles aria-hidden="true" />
            Bộ sưu tập được tuyển chọn
          </p>
          <h1 id="templates-title">Chọn một thiết kế kể đúng câu chuyện của bạn</h1>
          <p>
            Khám phá {weddingTemplates.length} mẫu thiệp tối ưu cho điện thoại, từ tối giản,
            truyền thống đến trải nghiệm điện ảnh giàu tương tác.
          </p>
          <div className="templates-hero__stats" aria-label="Tổng quan thư viện mẫu">
            <span><strong>{weddingTemplates.length}</strong> mẫu đang hoạt động</span>
            <span><strong>3</strong> mức ngân sách</span>
            <span><strong>100%</strong> responsive</span>
          </div>
          <div className="templates-hero__actions">
            <button type="button" onClick={() => document.querySelector('.templates-catalog')?.scrollIntoView({ behavior: 'smooth' })}>
              Khám phá bộ sưu tập
            </button>
            <InvitationCreationLauncher>
              {(openOptions) => (
                <button type="button" onClick={openOptions}>Tự tạo demo miễn phí</button>
              )}
            </InvitationCreationLauncher>
          </div>
        </motion.div>
      </section>

      <section className="templates-catalog" aria-label="Danh sách mẫu thiệp">
        <div className="templates-toolbar">
          <label className="templates-search">
            <Search aria-hidden="true" />
            <span className="visually-hidden">Tìm mẫu thiệp</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm theo tên, phong cách, tính năng..."
            />
          </label>

          <div className="templates-filters" aria-label="Lọc theo gói">
            {tierOrder.map((tier) => {
              const count = tier === 'all'
                ? weddingTemplates.length
                : weddingTemplates.filter((template) => template.tier === tier).length;
              const isActive = selectedTier === tier;
              const label = tier === 'all' ? 'Tất cả' : templateTierLabels[tier];

              return (
                <button
                  key={tier}
                  type="button"
                  className={isActive ? 'is-active' : ''}
                  aria-pressed={isActive}
                  onClick={() => selectTier(tier)}
                >
                  {tier === 'all' && <Filter aria-hidden="true" />}
                  {label}
                  <span>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="templates-results" aria-live="polite">
          <p>
            Hiển thị <strong>{filteredTemplates.length}</strong> mẫu
            {searchTerm && <> cho “{searchTerm.trim()}”</>}
          </p>
        </div>

        {filteredTemplates.length > 0 ? (
          <motion.div layout className="templates-grid">
            {filteredTemplates.map((template, index) => (
              <motion.div
                layout
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(index * 0.035, 0.28) }}
              >
                <TemplateCard template={template} priority={index < 3} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="templates-empty">
            <Search aria-hidden="true" />
            <h2>Chưa tìm thấy mẫu phù hợp</h2>
            <p>Thử một từ khóa khác hoặc xem lại toàn bộ bộ sưu tập.</p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                selectTier('all');
              }}
            >
              Xem tất cả mẫu
            </button>
          </div>
        )}
      </section>

      {showBackToTop && (
        <button
          type="button"
          className="templates-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Quay lại đầu trang"
        >
          <ArrowUp aria-hidden="true" />
        </button>
      )}
    </main>
  );
}
