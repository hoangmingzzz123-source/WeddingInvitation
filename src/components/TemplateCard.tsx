import { ExternalLink, Eye, Sparkles } from 'lucide-react';
import { navigateTo } from '../Router';
import { templateTierLabels, type WeddingTemplate } from '../data/templates';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface TemplateCardProps {
  template: WeddingTemplate;
  priority?: boolean;
}

export function TemplateCard({ template, priority = false }: TemplateCardProps) {
  const href = template.externalUrl ?? template.route ?? '#';
  const isExternal = Boolean(template.externalUrl);

  return (
    <article className={`template-card template-card--${template.tier}`}>
      <a
        className="template-card__link"
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        aria-label={`Xem mẫu ${template.name}${isExternal ? ' trong tab mới' : ''}`}
        onClick={(event) => {
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
