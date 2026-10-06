import { CalendarDays, Heart, MapPin, Sparkles } from 'lucide-react';
import type { CSSProperties } from 'react';
import { weddingTemplates } from '../data/templates';
import type { InvitationPayload } from '../types/admin';

interface TemplateVisual {
  accent: string;
  accentSoft: string;
  ink: string;
  paper: string;
  heading: string;
  mood: string;
}

const defaultVisual: TemplateVisual = {
  accent: '#b58a45',
  accentSoft: '#f1dfbd',
  ink: '#332a22',
  paper: '#fffaf2',
  heading: '"Playfair Display", serif',
  mood: 'Thanh lịch · Tinh tế',
};

const templateVisuals: Record<string, Partial<TemplateVisual>> = {
  'luxury-gold-cinematic': { accent: '#c9a14f', ink: '#f7edcf', paper: '#17130f', mood: 'Điện ảnh · Sang trọng' },
  'luxury-gold-frame': { accent: '#b4873e', accentSoft: '#ead6ae', paper: '#fffdf8', mood: 'Editorial · Cao cấp' },
  'vintage-film': { accent: '#a97749', accentSoft: '#d7bd99', ink: '#38291f', paper: '#eee2cf', mood: 'Hoài niệm · Film' },
  'art-deco-royal': { accent: '#d4ad55', ink: '#f4e5bc', paper: '#101522', mood: 'Art Deco · Hoàng gia' },
  'art-deco-royal-basic': { accent: '#c6a554', ink: '#f7ebca', paper: '#182033', mood: 'Art Deco · Trang nhã' },
  'romantic-watercolor': { accent: '#bf7086', accentSoft: '#f1cbd6', ink: '#68404a', paper: '#fff8fa', mood: 'Màu nước · Lãng mạn' },
  'cinematic-love-story': { accent: '#be624f', accentSoft: '#e9b6a9', ink: '#f8eee9', paper: '#221916', mood: 'Cinematic · Love story' },
  'bloom-crystal-3d': { accent: '#8f73cf', accentSoft: '#d9cef4', ink: '#3c3157', paper: '#f8f5ff', mood: 'Pha lê · 3D' },
  'bloom-crystal-3d-basic': { accent: '#8873b9', accentSoft: '#ded5ee', ink: '#4a3e5f', paper: '#fbf9ff', mood: '3D · Tối giản' },
  'modern-dark-blue': { accent: '#6d91de', accentSoft: '#bed0f4', ink: '#edf3ff', paper: '#111b31', mood: 'Hiện đại · Navy' },
  'minimal-elegant': { accent: '#8e7867', accentSoft: '#d8cdc4', ink: '#34302c', paper: '#faf8f5', mood: 'Tối giản · Editorial' },
  'minimal-elegant-basic': { accent: '#9b8b7c', accentSoft: '#ddd3ca', ink: '#413a34', paper: '#fdfbf8', mood: 'Clean · Tối giản' },
  'minimal-slide-clean': { accent: '#348f80', accentSoft: '#bfe0d9', ink: '#193d37', paper: '#f3fbf9', mood: 'Clean · Hiện đại' },
  'tropical-sunset': { accent: '#e97758', accentSoft: '#ffc6aa', ink: '#563126', paper: '#fff6ef', mood: 'Nhiệt đới · Hoàng hôn' },
  'classic-minimalist': { accent: '#97775b', accentSoft: '#d9c4ae', ink: '#40352d', paper: '#fcf8f2', mood: 'Cổ điển · Tối giản' },
  'blush-floral': { accent: '#cc7e99', accentSoft: '#f1c6d4', ink: '#67414e', paper: '#fff8fb', mood: 'Hoa lá · Pastel' },
  'soft-fade-floral': { accent: '#b97891', accentSoft: '#e8c8d4', ink: '#63444f', paper: '#fffafd', mood: 'Dịu dàng · Trong trẻo' },
  'vietnamese-traditional': { accent: '#d6433f', accentSoft: '#f0b28f', ink: '#fff5d8', paper: '#741e22', mood: 'Truyền thống Việt · Song Hỷ' },
  'vintage-grain': { accent: '#a97043', accentSoft: '#d8b590', ink: '#493126', paper: '#efe1ce', mood: 'Retro · Film grain' },
  'green-elegance': { accent: '#52765f', accentSoft: '#bfd0c3', ink: '#263d30', paper: '#f4f8f2', mood: 'Botanical · Thanh lịch' },
};

function formatWeddingDate(value: string) {
  if (!value) return 'Ngày cưới sẽ được cập nhật';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  }).format(date);
}

export function getTemplateVisual(templateId: string): TemplateVisual {
  return { ...defaultVisual, ...templateVisuals[templateId] };
}

export function CustomerInvitationPreview({
  payload,
  templateId,
  compact = false,
}: {
  payload: InvitationPayload;
  templateId: string;
  compact?: boolean;
}) {
  const template = weddingTemplates.find((item) => item.id === templateId);
  const visual = getTemplateVisual(templateId);
  const coverUrl = payload.coverUrl || template?.thumbnail || '';
  const style = {
    '--customer-accent': visual.accent,
    '--customer-accent-soft': visual.accentSoft,
    '--customer-ink': visual.ink,
    '--customer-paper': visual.paper,
    '--customer-heading': visual.heading,
  } as CSSProperties;

  return (
    <article className={`customer-invitation${compact ? ' is-compact' : ''}`} style={style}>
      <section className="customer-invitation__hero" style={{ backgroundImage: `url("${coverUrl}")` }}>
        <div className="customer-invitation__shade" />
        <div className="customer-invitation__hero-content">
          <span className="customer-invitation__kicker"><Sparkles aria-hidden="true" /> Wedding invitation</span>
          <h1>
            <span>{payload.brideName || 'Cô dâu'}</span>
            <Heart aria-hidden="true" />
            <span>{payload.groomName || 'Chú rể'}</span>
          </h1>
          <time>{formatWeddingDate(payload.weddingDate)}</time>
        </div>
      </section>

      <section className="customer-invitation__details">
        <p className="customer-invitation__mood">{visual.mood}</p>
        <blockquote>“{payload.message || 'Trân trọng mời bạn đến chung vui trong ngày hạnh phúc của chúng mình.'}”</blockquote>
        <div className="customer-invitation__detail-grid">
          <div>
            <CalendarDays aria-hidden="true" />
            <span><small>Thời gian</small>{payload.weddingTime || '18:00'} · {formatWeddingDate(payload.weddingDate)}</span>
          </div>
          <div>
            <MapPin aria-hidden="true" />
            <span><small>Địa điểm</small>{payload.venue || 'Địa điểm tổ chức'}{payload.address ? ` · ${payload.address}` : ''}</span>
          </div>
        </div>
        <div className="customer-invitation__signature">
          <i />
          <span>Sự hiện diện của bạn là niềm vui của chúng mình</span>
          <i />
        </div>
      </section>
    </article>
  );
}

