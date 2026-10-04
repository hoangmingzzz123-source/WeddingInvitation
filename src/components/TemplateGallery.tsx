import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { navigateTo } from '../Router';
import {
  templateTierLabels,
  weddingTemplates,
  type TemplateTier,
} from '../data/templates';
import { TemplateCard } from './TemplateCard';

type GalleryFilter = 'all' | TemplateTier;

const filters: GalleryFilter[] = ['all', '109k', '159k', '199k'];

export function TemplateGallery() {
  const [activeFilter, setActiveFilter] = useState<GalleryFilter>('all');

  useEffect(() => {
    const syncFilterFromUrl = () => {
      const source = `${window.location.hash} ${window.location.search}`;
      const matchedTier = filters.find((tier) => tier !== 'all' && source.includes(tier));
      if (matchedTier) setActiveFilter(matchedTier);
    };

    window.addEventListener('hashchange', syncFilterFromUrl);
    syncFilterFromUrl();
    return () => window.removeEventListener('hashchange', syncFilterFromUrl);
  }, []);

  const visibleTemplates = useMemo(() => {
    if (activeFilter === 'all') {
      return weddingTemplates.filter((template) => template.featured).slice(0, 6);
    }

    return weddingTemplates.filter((template) => template.tier === activeFilter).slice(0, 6);
  }, [activeFilter]);

  const openFullCatalog = () => {
    const query = activeFilter === 'all' ? '' : `?filter=${activeFilter}`;
    navigateTo(`/templates${query}`);
  };

  return (
    <section id="templates" className="home-gallery" aria-labelledby="home-gallery-title">
      <div className="home-gallery__inner">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6 }}
          className="home-section-heading"
        >
          <p><Sparkles aria-hidden="true" /> Thư viện mẫu</p>
          <h2 id="home-gallery-title">Thiết kế đẹp ở mọi khoảnh khắc</h2>
          <span>
            Từ phong cách tối giản đến điện ảnh, mỗi mẫu đều được tối ưu cho điện thoại và
            có thể cá nhân hóa theo câu chuyện của hai bạn.
          </span>
        </motion.div>

        <div className="home-gallery__filters" aria-label="Lọc mẫu thiệp theo gói">
          {filters.map((filter) => {
            const isActive = filter === activeFilter;
            const label = filter === 'all' ? 'Nổi bật' : templateTierLabels[filter];
            return (
              <button
                key={filter}
                type="button"
                className={isActive ? 'is-active' : ''}
                aria-pressed={isActive}
                onClick={() => setActiveFilter(filter)}
              >
                {label}
              </button>
            );
          })}
        </div>

        <motion.div layout className="home-gallery__grid">
          {visibleTemplates.map((template, index) => (
            <motion.div
              layout
              key={template.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
            >
              <TemplateCard template={template} />
            </motion.div>
          ))}
        </motion.div>

        <div className="home-gallery__footer">
          <p>{weddingTemplates.length} mẫu đang hoạt động · thêm thiết kế mới thường xuyên</p>
          <button type="button" onClick={openFullCatalog}>
            Xem toàn bộ thư viện
            <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
