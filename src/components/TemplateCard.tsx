import { useEffect, useState } from 'react';
import { ExternalLink, Eye, Heart, Sparkles } from 'lucide-react';
import { navigateTo } from '../Router';
import { templateTierLabels, type WeddingTemplate } from '../data/templates';
import { trackEvent } from '../utils/analytics';
import {
  isTemplateFavorite,
  TEMPLATE_FAVORITES_EVENT,
  toggleTemplateFavorite,
} from '../utils/templateFavorites';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface TemplateCardProps {
  template: WeddingTemplate;
  priority?: boolean;
}

export function TemplateCard({ template, priority = false }: TemplateCardProps) {
  const href = template.externalUrl ?? template.route ?? '#';
  const isExternal = Boolean(template.externalUrl);
  const [isFavorite, setIsFavorite] = useState(() => isTemplateFavorite(template.id));

  useEffect(() => {
    const syncFavorite = () => setIsFavorite(isTemplateFavorite(template.id));
    window.addEventListener(TEMPLATE_FAVORITES_EVENT, syncFavorite);
    window.addEventListener('storage', syncFavorite);
    return () => {
      window.removeEventListener(TEMPLATE_FAVORITES_EVENT, syncFavorite);
      window.removeEventListener('storage', syncFavorite);
    };
  }, [template.id]);

  const toggleFavorite = () => {
    const nextFavoriteState = toggleTemplateFavorite(template.id);
    setIsFavorite(nextFavoriteState);
    trackEvent('template_favorite_toggle', {
      template_id: template.id,
      is_favorite: nextFavoriteState,
      source: 'template_card',
    });
  };

  return (
    <article className={`template-card template-card--${template.tier}${template.realWedding ? ' template-card--real' : ''}`}>
      <button
        type="button"
        className={`template-card__favorite${isFavorite ? ' is-active' : ''}`}
        onClick={toggleFavorite}
        aria-label={isFavorite ? `Bỏ lưu mẫu ${template.name}` : `Lưu mẫu ${template.name}`}
        aria-pressed={isFavorite}
        title={isFavorite ? 'Bỏ khỏi mẫu đã lưu' : 'Lưu mẫu yêu thích'}
      >
        <Heart aria-hidden="true" fill={isFavorite ? 'currentColor' : 'none'} />
      </button>
      <a
        className="template-card__link"
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        aria-label={`Xem mẫu ${template.name}${isExternal ? ' trong tab mới' : ''}`}
        onClick={(event) => {
          trackEvent('template_open', {
            template_id: template.id,
            template_tier: template.tier,
            is_external: isExternal,
          });
          if (!isExternal && template.route) {
            event.preventDefault();
            navigateTo(template.route);
          }
        }}
      >
        <div className="template-card__media">
          <ImageWithFallback
            src={template.thumbnail}
            alt={`Ảnh xem trước mẫu thiệp ${template.name}`}
            className="template-card__image"
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
          />
          <div className="template-card__shade" />

          <div className="template-card__badges">
            {template.realWedding && (
              <span className="template-card__badge template-card__badge--real">
                <Sparkles aria-hidden="true" />
                Mẫu thực tế
              </span>
            )}
            <span className="template-card__badge template-card__badge--tier">
              {templateTierLabels[template.tier]}
            </span>
          </div>

          <span className="template-card__preview">
            {isExternal ? <ExternalLink aria-hidden="true" /> : <Eye aria-hidden="true" />}
            {isExternal ? 'Mở website mẫu' : 'Xem demo'}
          </span>
        </div>

        <div className="template-card__content">
          <p className="template-card__eyebrow">{template.style}</p>
          <h3>{template.name}</h3>
          <p className="template-card__description">{template.description}</p>
          <div className="template-card__features" aria-label="Tính năng nổi bật">
            {template.features.slice(0, 4).map((feature) => (
              <span key={feature}>{feature}</span>
            ))}
          </div>
        </div>
      </a>
    </article>
  );
}
