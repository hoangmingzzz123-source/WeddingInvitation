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
      return weddingTemplates.filter((template) => template.homepageFeatured).slice(0, 6);
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
          <p><Sparkles aria-hidden="true" /> Tuyển chọn đặc sắc</p>
          <h2 id="home-gallery-title">Mỗi mẫu là một thế giới riêng</h2>
          <span>
            Những thiết kế nổi bật nhất được chọn từ thư viện: điện ảnh, truyền thống Việt,
            màu nước và cả nét vẽ tay. Xem thiệp thực tế hoặc cá nhân hóa các mẫu demo ngay trong Studio.
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
