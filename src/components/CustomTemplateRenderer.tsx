import { useEffect, useState } from 'react';
import type { CustomInvitationTemplate, InvitationPayload } from '../types/admin';

function escapeHtml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function photoPosition(x?: number, y?: number) {
  const percent = (value?: number) => `${Math.round(Math.max(0, Math.min(1, value ?? 0.5)) * 100)}%`;
  return `${percent(x)} ${percent(y)}`;
}

function imageUrl(value: string) {
  try {
    const url = new URL(value, window.location.origin);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch { return ''; }
}

function buildSrcDoc(template: CustomInvitationTemplate, payload: InvitationPayload, sourceHtml: string) {
  const photos = [...(payload.photos ?? [])].sort((a, b) => a.order - b.order);
  const cover = photos.find((photo) => photo.role === 'cover');
  const mainPhoto = photos.find((photo) => photo.role === 'main');
  const videoPhoto = photos.find((photo) => photo.role === 'video');
  const gallery = photos.filter((photo) => photo.role === 'gallery');
  const studio = payload.studio;
  const parsedDate = payload.weddingDate ? new Date(`${payload.weddingDate}T00:00:00`) : null;
  const weddingDateLabel = parsedDate && !Number.isNaN(parsedDate.getTime())
    ? new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(parsedDate)
    : payload.weddingDate;
  const values: Record<string, string> = {
    brideName: payload.brideName,
    groomName: payload.groomName,
    weddingDate: payload.weddingDate,
    weddingDateLabel,
    weddingTime: payload.weddingTime,
    venue: payload.venue,
    address: payload.address,
    message: payload.message,
    story: payload.message,
    city: studio?.city ?? '',
    headerMonogramText: studio?.headerMonogramText ?? '',
    packageTier: studio?.packageTier ?? '',
    ceremonyTitle: studio?.ceremonyTitle ?? '',
    receptionTitle: studio?.receptionTitle ?? '',
    heroKicker: studio?.heroKicker ?? '',
    albumTitle: studio?.albumTitle ?? '',
    timeLabel: studio?.timeLabel ?? '',
    venueLabel: studio?.venueLabel ?? '',
    signatureText: studio?.signatureText ?? '',
    coverUrl: imageUrl(cover?.url ?? payload.coverUrl),
    coverPosition: photoPosition(cover?.focalX, cover?.focalY),
    mainUrl: imageUrl(mainPhoto?.url ?? ''),
    mainPosition: photoPosition(mainPhoto?.focalX, mainPhoto?.focalY),
    videoUrl: imageUrl(videoPhoto?.url ?? ''),
    videoPosition: photoPosition(videoPhoto?.focalX, videoPhoto?.focalY),
  };
  for (let index = 0; index < 7; index += 1) {
    const photo = gallery[index];
    values[`gallery${index + 1}Url`] = imageUrl(photo?.url ?? '');
    values[`gallery${index + 1}Position`] = photoPosition(photo?.focalX, photo?.focalY);
  }
  const expanded = sourceHtml.replace(/\{\{([A-Za-z0-9]+)\}\}/g, (match, key: string) =>
    key in values ? escapeHtml(values[key]) : match);
  const storageOrigin = new URL(template.assetBaseUrl).origin;
  const csp = [
    "default-src 'none'",
    `script-src 'unsafe-inline' ${storageOrigin}`,
    `style-src 'unsafe-inline' ${storageOrigin}`,
    `img-src data: blob: ${storageOrigin}`,
    `font-src data: ${storageOrigin}`,
    `media-src ${storageOrigin}`,
    "connect-src 'none'",
    "form-action 'none'",
    "frame-src 'none'",
    "object-src 'none'",
    `base-uri ${storageOrigin}`,
  ].join('; ');
  const headContent = `<base href="${escapeHtml(template.assetBaseUrl)}"><meta http-equiv="Content-Security-Policy" content="${escapeHtml(csp)}">`;
  if (/<head\b[^>]*>/i.test(expanded)) return expanded.replace(/<head\b[^>]*>/i, (head) => `${head}${headContent}`);
  return `<!doctype html><html><head>${headContent}</head><body>${expanded}</body></html>`;
}

export function CustomTemplateRenderer({ template, payload, title, compact = false }: {
  template: CustomInvitationTemplate;
  payload: InvitationPayload;
  title: string;
  compact?: boolean;
}) {
  const [html, setHtml] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setHtml('');
    setError('');
    const entryUrl = new URL(template.entryFile.split('/').map(encodeURIComponent).join('/'), template.assetBaseUrl).href;
    fetch(entryUrl)
      .then(async (response) => {
        if (!response.ok) throw new Error('Không tải được file HTML của gói mẫu.');
        return response.text();
      })
      .then((source) => { if (active) setHtml(source); })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Không thể tải gói mẫu.');
      });
    return () => { active = false; };
  }, [template.id, template.entryFile, template.assetBaseUrl]);

  if (error) return <div className="custom-template-state" role="alert">{error}</div>;
  if (!html) return <div className="custom-template-state" role="status">Đang tải mẫu {template.name}...</div>;

  return <iframe
    className={`custom-template-frame${compact ? ' is-compact' : ''}`}
    title={title}
    sandbox="allow-scripts"
    referrerPolicy="no-referrer"
    srcDoc={buildSrcDoc(template, payload, html)}
  />;
}