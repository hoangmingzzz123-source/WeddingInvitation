import { randomUUID } from 'node:crypto';
import { ASSETS, CUSTOM_TEMPLATES, EXPORTS, MediaError, db, selectedPhotos, signAsset, supabase, type PhotoRef } from '../server/customerMedia.js';
import { renderSignatureInvitation } from '../server/signatureExport.js';
import { weddingTemplates } from '../src/data/templates.js';
import type { SignatureDemoCustomization, SignatureRsvpQuestion } from '../src/components/demos/SignatureDemos.js';

type JsonRecord = Record<string, unknown>;

interface ZipEntry {
  name: string;
  data: Uint8Array;
  crc: number;
  offset: number;
}

const encoder = new TextEncoder();

function env(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing server environment variable: ${name}`);
  return value;
}

function jsonResponse(message: string, status: number) {
  return Response.json({ message }, { status, headers: { 'Cache-Control': 'no-store' } });
}

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function templateRelativePath(entryFile: string, target: string) {
  const entryParts = entryFile.split('/').slice(0, -1);
  const targetParts = target.split('/');
  let shared = 0;
  while (shared < entryParts.length && entryParts[shared] === targetParts[shared]) shared += 1;
  return [...Array(entryParts.length - shared).fill('..'), ...targetParts.slice(shared)].join('/') || './';
}

async function buildCustomTemplateFiles(templateId: string, demo: JsonRecord, customerAssets: Array<PhotoRef & { src: string }>) {
  const [template] = await db<Array<{ id: string; name: string; entry_file: string; file_paths: string[] }>>(
    `custom_invitation_templates?id=eq.${encodeURIComponent(templateId)}&select=id,name,entry_file,file_paths&limit=1`,
  );
  if (!template || !Array.isArray(template.file_paths) || !template.file_paths.includes(template.entry_file)) {
    throw new MediaError(422, 'Không tìm thấy gói mẫu ZIP đã chọn.');
  }
  const files = await Promise.all(template.file_paths.map(async (filePath) => {
    if (!/^[a-zA-Z0-9._/-]+$/.test(filePath) || filePath.split('/').some((part) => !part || part === '.' || part === '..')) {
      throw new MediaError(422, 'Gói mẫu chứa đường dẫn file không hợp lệ.');
    }
    const response = await supabase(`/storage/v1/object/authenticated/${CUSTOM_TEMPLATES}/${template.id}/${filePath}`);
    return { name: filePath, content: new Uint8Array(await response.arrayBuffer()) };
  }));
  const entry = files.find((file) => file.name === template.entry_file);
  if (!entry || typeof entry.content === 'string') throw new MediaError(422, 'Không tìm thấy trang HTML chính của mẫu.');

  const payload = (demo.payload ?? {}) as JsonRecord;
  const studio = (payload.studio ?? {}) as JsonRecord;
  const cover = customerAssets.find((photo) => photo.role === 'cover');
  const mainPhoto = customerAssets.find((photo) => photo.role === 'main');
  const videoPhoto = customerAssets.find((photo) => photo.role === 'video');
  const gallery = customerAssets.filter((photo) => photo.role === 'gallery').sort((a, b) => a.order - b.order);
  const imagePosition = (photo?: PhotoRef) => {
    const percent = (value?: number) => `${(Number.isFinite(value) ? Math.max(0, Math.min(1, value!)) : 0.5) * 100}%`;
    return `${percent(photo?.focalX)} ${percent(photo?.focalY)}`;
  };
  const replacements: Record<string, string> = {
    brideName: String(payload.brideName ?? ''), groomName: String(payload.groomName ?? ''),
    weddingDate: String(payload.weddingDate ?? ''), weddingDateLabel: formatDate(payload.weddingDate), weddingTime: String(payload.weddingTime ?? ''),
    venue: String(payload.venue ?? ''), address: String(payload.address ?? ''), message: String(payload.message ?? ''),
    city: String(studio.city ?? ''), packageTier: String(studio.packageTier ?? ''),
    heroCoupleText: String(studio.heroCoupleText ?? ''),
    ceremonyTitle: String(studio.ceremonyTitle ?? ''), receptionTitle: String(studio.receptionTitle ?? ''),
    heroKicker: String(studio.heroKicker ?? ''), albumTitle: String(studio.albumTitle ?? ''),
    timeLabel: String(studio.timeLabel ?? ''), venueLabel: String(studio.venueLabel ?? ''),
    signatureText: String(studio.signatureText ?? ''),
    story: String(payload.message ?? ''),
    coverUrl: cover ? templateRelativePath(template.entry_file, cover.src) : safeUrl(payload.coverUrl),
    coverPosition: imagePosition(cover),
    mainUrl: mainPhoto ? templateRelativePath(template.entry_file, mainPhoto.src) : '',
    mainPosition: imagePosition(mainPhoto),
    videoUrl: videoPhoto ? templateRelativePath(template.entry_file, videoPhoto.src) : '',
    videoPosition: imagePosition(videoPhoto),
  };
  for (let index = 0; index < 7; index += 1) {
    const photo = gallery[index];
    replacements[`gallery${index + 1}Url`] = photo ? templateRelativePath(template.entry_file, photo.src) : '';
    replacements[`gallery${index + 1}Position`] = imagePosition(photo);
  }
  const renderedHtml = new TextDecoder().decode(entry.content)
    .replace(/\{\{([A-Za-z0-9]+)\}\}/g, (match, key: string) => key in replacements ? escapeHtml(replacements[key]) : match);
  const config = JSON.stringify({ templateId, templateName: template.name, ...payload }, null, 2);
  return [
    ...files.map((file) => file.name === template.entry_file ? { ...file, content: renderedHtml } : file),
    { name: 'invitation.config.json', content: config },
  ];
}

function publicAppOrigin() {
  const configuredOrigin = process.env.PUBLIC_APP_URL;
  const deploymentHost = process.env.VERCEL_URL;
  const origin = configuredOrigin || (deploymentHost && /^[a-z0-9.-]+(?::\d+)?$/i.test(deploymentHost)
    ? `https://${deploymentHost}`
    : 'https://wedding-invitation-mp.vercel.app');
  const url = new URL(origin);
  if (!['http:', 'https:'].includes(url.protocol)) throw new MediaError(503, 'Địa chỉ website không hợp lệ để đóng gói giao diện.');
  return url.origin;
}

async function loadBuiltInvitationStyles(origin: string) {
  const pageResponse = await fetch(new URL('/', origin), { signal: AbortSignal.timeout(15_000) });
  if (!pageResponse.ok) throw new MediaError(502, 'Không tải được stylesheet của mẫu thiệp.');
  const pageHtml = await pageResponse.text();
  const stylesheetTag = pageHtml.match(/<link\b[^>]*>/gi)?.find((tag) =>
    /\brel=["']stylesheet["']/i.test(tag) && /\bhref=["'][^"']+\.css(?:\?[^"']*)?["']/i.test(tag));
  const href = stylesheetTag?.match(/\bhref=["']([^"']+)["']/i)?.[1];
  if (!href) throw new MediaError(502, 'Không tìm thấy stylesheet đã build để đóng gói.');
  const stylesheetUrl = new URL(href, origin);
  if (stylesheetUrl.origin !== origin || !/^\/assets\/[a-zA-Z0-9._-]+\.css$/.test(stylesheetUrl.pathname)) {
    throw new MediaError(502, 'Đường dẫn stylesheet của mẫu không hợp lệ.');
  }
  const stylesheetResponse = await fetch(stylesheetUrl, { signal: AbortSignal.timeout(15_000) });
  if (!stylesheetResponse.ok) throw new MediaError(502, 'Không tải được stylesheet của mẫu thiệp.');
  let css = await stylesheetResponse.text();
  const fontPaths = new Set<string>();
  css = css.replace(/url\(\s*(["']?)\/fonts\/([a-zA-Z0-9._-]+)\1\s*\)/g, (_match, _quote: string, filename: string) => {
    fontPaths.add(filename);
    return `url("fonts/${filename}")`;
  });
  css = css.replace(/url\(\s*(["']?)\/images\/([^)'"\s]+)\1\s*\)/g, (_match, _quote: string, path: string) =>
    `url("${origin}/images/${path}")`);
  if (fontPaths.size > 12) throw new MediaError(502, 'Stylesheet tham chiếu quá nhiều font không xác định.');
  const fonts = await Promise.all([...fontPaths].map(async (filename) => {
    const response = await fetch(new URL(`/fonts/${filename}`, origin), { signal: AbortSignal.timeout(15_000) });
    if (!response.ok) throw new MediaError(502, 'Không tải được font của mẫu thiệp.');
    return { name: `fonts/${filename}`, content: new Uint8Array(await response.arrayBuffer()) };
  }));
  return { css, fonts };
}

async function buildSignatureTemplateFiles(customer: JsonRecord, demo: JsonRecord, assets: Array<PhotoRef & { src: string }>) {
  const payload = (demo.payload ?? {}) as JsonRecord;
  const studio = (payload.studio ?? {}) as Record<string, unknown>;
  const templateId = String(demo.template_id || customer.selected_template_id || 'classic-minimalist');
  const templateTier = weddingTemplates.find((template) => template.id === templateId)?.tier ?? '109k';
  const cover = assets.find((photo) => photo.role === 'cover');
  const mainPhoto = assets.find((photo) => photo.role === 'main');
  const videoPhoto = assets.find((photo) => photo.role === 'video');
  const gallery = assets.filter((photo) => photo.role === 'gallery').sort((first, second) => first.order - second.order);
  const repeatedGallery = gallery.length
    ? Array.from({ length: Math.max(4, gallery.length) }, (_, index) => gallery[index % gallery.length])
    : [];
  const dateValue = String(payload.weddingDate || customer.wedding_date || '');
  const dateParts = dateValue.split('-');
  const dateLabel = dateParts.length === 3 ? `${dateParts[2]} · ${dateParts[1]} · ${dateParts[0]}` : dateValue;
  const position = (photo?: PhotoRef) => {
    const percent = (value?: number) => `${Math.round((Number.isFinite(value) ? Math.max(0, Math.min(1, value!)) : 0.5) * 100)}%`;
    return `${percent(photo?.focalX)} ${percent(photo?.focalY)}`;
  };
  const customization: SignatureDemoCustomization = {
    tier: ['109k', '159k', '199k'].includes(String(studio.packageTier)) ? studio.packageTier as '109k' | '159k' | '199k' : templateTier,
    bride: String(payload.brideName || customer.bride_name || ''),
    groom: String(payload.groomName || customer.groom_name || ''),
    date: dateValue,
    dateLabel,
    time: String(payload.weddingTime || customer.wedding_time || ''),
    venue: String(payload.venue || customer.venue || ''),
    address: String(payload.address || customer.address || ''),
    city: String(studio.city ?? 'Việt Nam'),
    heroCoupleText: typeof studio.heroCoupleText === 'string' ? studio.heroCoupleText : undefined,
    story: String(payload.message || customer.message || ''),
    ceremonyTitle: typeof studio.ceremonyTitle === 'string' ? studio.ceremonyTitle : undefined,
    receptionTitle: typeof studio.receptionTitle === 'string' ? studio.receptionTitle : undefined,
    heroKicker: typeof studio.heroKicker === 'string' ? studio.heroKicker : undefined,
    albumTitle: typeof studio.albumTitle === 'string' ? studio.albumTitle : undefined,
    timeLabel: typeof studio.timeLabel === 'string' ? studio.timeLabel : undefined,
    venueLabel: typeof studio.venueLabel === 'string' ? studio.venueLabel : undefined,
    signatureText: typeof studio.signatureText === 'string' ? studio.signatureText : undefined,
    theme: ['template', 'champagne', 'blush', 'emerald'].includes(String(studio.theme)) ? studio.theme as SignatureDemoCustomization['theme'] : undefined,
    fontStyle: studio.packageTier === '109k' ? 'editorial' : ['editorial', 'modern', 'classic'].includes(String(studio.fontStyle)) ? studio.fontStyle as SignatureDemoCustomization['fontStyle'] : undefined,
    hero: cover?.src ?? safeUrl(payload.coverUrl || customer.cover_url),
    heroPosition: cover ? position(cover) : undefined,
    mainPhoto: mainPhoto?.src,
    mainPhotoPosition: mainPhoto ? position(mainPhoto) : undefined,
    videoBackground: videoPhoto?.src,
    videoBackgroundPosition: videoPhoto ? position(videoPhoto) : undefined,
    gallery: repeatedGallery.map((photo) => photo.src),
    galleryPositions: repeatedGallery.map((photo) => position(photo)),
  };
  const rawQuestions = Array.isArray(studio.rsvpQuestions) ? studio.rsvpQuestions : [];
  const rsvpQuestions = rawQuestions.filter((question): question is SignatureRsvpQuestion => question === 'transport' || question === 'meal');
  const origin = publicAppOrigin();
  const { css, fonts } = await loadBuiltInvitationStyles(origin);
  const markup = renderSignatureInvitation(templateId, customization, rsvpQuestions)
    .replaceAll('src="/images/', `src="${origin}/images/`)
    .replaceAll('href="/images/', `href="${origin}/images/`);
  const title = `${String(payload.brideName || customer.bride_name || 'Cô dâu')} & ${String(payload.groomName || customer.groom_name || 'Chú rể')}`;
  const html = `<!doctype html>\n<html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="Thiệp cưới ${escapeHtml(title)}"><title>${escapeHtml(title)}</title><link rel="stylesheet" href="styles.css"></head><body>${markup}<script src="script.js"></script></body></html>`;
  const script = `document.querySelectorAll('a[href^="#"]').forEach((link)=>link.addEventListener('click',(event)=>{const target=document.querySelector(link.getAttribute('href'));if(target){event.preventDefault();target.scrollIntoView({behavior:'smooth'});}}));\ndocument.querySelectorAll('.signature-rsvp form').forEach((form)=>form.addEventListener('submit',(event)=>{event.preventDefault();const success=document.createElement('p');success.className='signature-rsvp__success';success.setAttribute('role','status');success.textContent='Cảm ơn bạn đã gửi lời hồi đáp!';form.replaceWith(success);}));`;
  const config = JSON.stringify({ templateId, ...payload, photos: assets.map(({ photoId: _photoId, ...photo }) => photo) }, null, 2);
  const readme = `# Thiệp cưới ${title}\n\nMẫu: ${templateId}\n\nĐây là bản xuất từ renderer của mẫu đã chọn. Sửa styles.css để đổi giao diện hoặc sửa index.html để đổi nội dung/bố cục.\n\n## Chạy thử\n\nMở index.html hoặc chạy npx serve .\n`;
  return [
    { name: 'index.html', content: html },
    { name: 'styles.css', content: css },
    { name: 'script.js', content: script },
    { name: 'invitation.config.json', content: config },
    ...fonts,
    { name: 'README.md', content: readme },
  ];
}

function safeUrl(value: unknown) {
  const rawUrl = String(value ?? '').trim();
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return '';
    return url.href
      .replaceAll('"', '%22')
      .replaceAll("'", '%27')
      .replaceAll('(', '%28')
      .replaceAll(')', '%29')
      .replaceAll('\\', '%5C');
  } catch {
    return '';
  }
}

function slugify(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'thiep-cuoi';
}

function formatDate(value: unknown) {
  const date = new Date(`${String(value ?? '')}T00:00:00`);
  if (Number.isNaN(date.getTime())) return 'Ngày cưới sẽ được cập nhật';
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  }).format(date);
}

function crc32(data: Uint8Array) {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function dosDateTime(date = new Date()) {
  const year = Math.max(1980, date.getFullYear());
  const time = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const day = ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { time, day };
}

function concatBytes(parts: Uint8Array[]) {
  const output = new Uint8Array(parts.reduce((total, part) => total + part.length, 0));
  let offset = 0;
  parts.forEach((part) => { output.set(part, offset); offset += part.length; });
  return output;
}

function makeHeader(size: number, fill: (view: DataView) => void) {
  const bytes = new Uint8Array(size);
  fill(new DataView(bytes.buffer));
  return bytes;
}

export function createZip(files: Array<{ name: string; content: string | Uint8Array }>) {
  const entries: ZipEntry[] = [];
  const localParts: Uint8Array[] = [];
  let localOffset = 0;
  const { time, day } = dosDateTime();

  files.forEach((file) => {
    const name = encoder.encode(file.name);
    const data = typeof file.content === 'string' ? encoder.encode(file.content) : file.content;
    const crc = crc32(data);
    const header = makeHeader(30, (view) => {
      view.setUint32(0, 0x04034b50, true);
      view.setUint16(4, 20, true);
      view.setUint16(6, 0x0800, true);
      view.setUint16(8, 0, true);
      view.setUint16(10, time, true);
      view.setUint16(12, day, true);
      view.setUint32(14, crc, true);
      view.setUint32(18, data.length, true);
      view.setUint32(22, data.length, true);
      view.setUint16(26, name.length, true);
      view.setUint16(28, 0, true);
    });
    entries.push({ name: file.name, data, crc, offset: localOffset });
    localParts.push(header, name, data);
    localOffset += header.length + name.length + data.length;
  });

  const centralParts: Uint8Array[] = [];
  entries.forEach((entry) => {
    const name = encoder.encode(entry.name);
    const header = makeHeader(46, (view) => {
      view.setUint32(0, 0x02014b50, true);
      view.setUint16(4, 20, true);
      view.setUint16(6, 20, true);
      view.setUint16(8, 0x0800, true);
      view.setUint16(10, 0, true);
      view.setUint16(12, time, true);
      view.setUint16(14, day, true);
      view.setUint32(16, entry.crc, true);
      view.setUint32(20, entry.data.length, true);
      view.setUint32(24, entry.data.length, true);
      view.setUint16(28, name.length, true);
      view.setUint16(30, 0, true);
      view.setUint16(32, 0, true);
      view.setUint16(34, 0, true);
      view.setUint16(36, 0, true);
      view.setUint32(38, 0, true);
      view.setUint32(42, entry.offset, true);
    });
    centralParts.push(header, name);
  });

  const central = concatBytes(centralParts);
  const end = makeHeader(22, (view) => {
    view.setUint32(0, 0x06054b50, true);
    view.setUint16(4, 0, true);
    view.setUint16(6, 0, true);
    view.setUint16(8, entries.length, true);
    view.setUint16(10, entries.length, true);
    view.setUint32(12, central.length, true);
    view.setUint32(16, localOffset, true);
    view.setUint16(20, 0, true);
  });

  return concatBytes([...localParts, central, end]);
}

const themeMap: Record<string, { accent: string; soft: string; ink: string; paper: string }> = {
  'art-deco-royal': { accent: '#d4ad55', soft: '#6d5727', ink: '#f4e5bc', paper: '#101522' },
  'luxury-gold-cinematic': { accent: '#c9a14f', soft: '#6b5425', ink: '#f7edcf', paper: '#17130f' },
  'modern-dark-blue': { accent: '#6d91de', soft: '#253e71', ink: '#edf3ff', paper: '#111b31' },
  'vietnamese-traditional': { accent: '#f0c36d', soft: '#a83834', ink: '#fff5d8', paper: '#741e22' },
  'green-elegance': { accent: '#52765f', soft: '#bfd0c3', ink: '#263d30', paper: '#f4f8f2' },
  'blush-floral': { accent: '#cc7e99', soft: '#f1c6d4', ink: '#67414e', paper: '#fff8fb' },
};

export function buildFiles(customer: JsonRecord, demo: JsonRecord, assets: Array<PhotoRef & { src: string }> = []) {
  const payload = (demo.payload ?? {}) as JsonRecord;
  const studio = (payload.studio ?? {}) as JsonRecord;
  const bride = escapeHtml(payload.brideName || customer.bride_name || 'Cô dâu');
  const groom = escapeHtml(payload.groomName || customer.groom_name || 'Chú rể');
  const date = escapeHtml(formatDate(payload.weddingDate || customer.wedding_date));
  const time = escapeHtml(payload.weddingTime || customer.wedding_time || '18:00');
  const venue = escapeHtml(payload.venue || customer.venue || 'Địa điểm tổ chức');
  const address = escapeHtml(payload.address || customer.address || '');
  const message = escapeHtml(payload.message || customer.message || 'Trân trọng mời bạn đến chung vui trong ngày hạnh phúc của chúng mình.');
  const coverPhoto = assets.find((photo) => photo.role === 'cover');
  const cover = coverPhoto?.src ?? safeUrl(payload.coverUrl || customer.cover_url);
  const position = (photo: PhotoRef) => {
    const percent = (value?: number) => (Number.isFinite(value) ? Math.max(0, Math.min(1, value!)) : 0.5) * 100 + '%';
    return percent(photo.focalX) + ' ' + percent(photo.focalY);
  };
  const gallery = assets.filter((photo) => photo.role === 'gallery');
  const templateId = String(demo.template_id || customer.selected_template_id || 'classic-minimalist');
  const paletteMap = {
    champagne: { accent: '#bc8e43', soft: '#ead7ad', ink: '#5b4323', paper: '#fff8e8' },
    blush: { accent: '#c4778a', soft: '#f1c6d4', ink: '#70404c', paper: '#fff2f4' },
    emerald: { accent: '#3e8068', soft: '#b8d8ca', ink: '#234d3e', paper: '#edf7f1' },
  } as const;
  const themeName = String(studio.theme ?? 'template');
  const theme = {
    ...(themeMap[templateId] ?? { accent: '#b58a45', soft: '#f1dfbd', ink: '#332a22', paper: '#fffaf2' }),
    ...(themeName !== 'template' && themeName in paletteMap
      ? paletteMap[themeName as keyof typeof paletteMap]
      : {}),
  };
  const fontStyle = studio.fontStyle === 'modern' ? '"Be Vietnam Pro", sans-serif'
    : studio.fontStyle === 'classic' ? 'Georgia, serif' : '"Playfair Display", serif';
  const packageTier = ['109k', '159k', '199k'].includes(String(studio.packageTier)) ? String(studio.packageTier) : '109k';
  const ceremonyTitle = escapeHtml(String(studio.ceremonyTitle || 'Trân trọng kính mời'));
  const receptionTitle = escapeHtml(String(studio.receptionTitle || 'Tiệc mừng thân mật'));
  const heroKicker = escapeHtml(String(studio.heroKicker || 'Wedding invitation'));
  const albumTitle = escapeHtml(String(studio.albumTitle || 'Album kỷ niệm'));
  const timeLabel = escapeHtml(String(studio.timeLabel || 'Thời gian'));
  const venueLabel = escapeHtml(String(studio.venueLabel || 'Địa điểm'));
  const signatureText = escapeHtml(String(studio.signatureText || 'Sự hiện diện của bạn là niềm vui của chúng mình'));
  const studioConfig = {
    packageTier,
    city: String(studio.city ?? 'Việt Nam'),
    ceremonyTitle: String(studio.ceremonyTitle ?? 'Lễ thành hôn'),
    receptionTitle: String(studio.receptionTitle ?? 'Tiệc mừng thân mật'),
    heroKicker: String(studio.heroKicker ?? 'Wedding invitation'),
    albumTitle: String(studio.albumTitle ?? 'Album kỷ niệm'),
    timeLabel: String(studio.timeLabel ?? 'Thời gian'),
    venueLabel: String(studio.venueLabel ?? 'Địa điểm'),
    signatureText: String(studio.signatureText ?? 'Sự hiện diện của bạn là niềm vui của chúng mình'),
    theme: String(studio.theme ?? 'template'),
    fontStyle: String(studio.fontStyle ?? 'editorial'),
    guests: Array.isArray(studio.guests) ? studio.guests : [],
    rsvpQuestions: Array.isArray(studio.rsvpQuestions) ? studio.rsvpQuestions : [],
  };
  const title = `${bride} & ${groom}`;
  const mapQuery = encodeURIComponent(`${venue} ${address}`);

  const html = `<!doctype html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Thiệp cưới của ${title}" />
  <title>${title} | Wedding Invitation</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <main>
    <section class="hero"${cover ? ` style="--cover:url('${escapeHtml(cover)}')${coverPhoto ? `;background-position:${position(coverPhoto)}` : ''}"` : ''}>
      <div class="shade"></div>
      <div class="hero-content">
        <p>${heroKicker}</p>
        <h1><span>${bride}</span><i>&amp;</i><span>${groom}</span></h1>
        <time>${date}</time>
        <a href="#details" aria-label="Xem thông tin lễ cưới">Khám phá <b>↓</b></a>
      </div>
    </section>
    <section class="details" id="details">
      <p class="eyebrow">${ceremonyTitle}</p>
      <blockquote>“${message}”</blockquote>
      <div class="grid">
        <article><small>${receptionTitle}</small><h2>${time}</h2><p>${timeLabel}: ${date}</p></article>
        <article><small>${venueLabel}</small><h2>${venue}</h2><p>${address || 'Địa chỉ sẽ được cập nhật'}</p></article>
      </div>
      <a class="map" href="https://www.google.com/maps/search/?api=1&query=${mapQuery}" target="_blank" rel="noreferrer">Mở bản đồ</a>
      <footer><i></i><span>${signatureText}</span><i></i></footer>
    </section>
    ${gallery.length ? `<section class="album"><h2>${albumTitle}</h2><div class="album-grid">${gallery.map((photo, index) =>
      `<a href="${photo.src}"><img src="${photo.src}" alt="${escapeHtml(photo.alt || `Ảnh cưới ${index + 1}`)}" loading="lazy" style="object-position:${position(photo)}"></a>`,
    ).join('')}</div></section>` : ''}
  </main>
  <script src="script.js"></script>
</body>
</html>`;

  const css = `:root{--accent:${theme.accent};--soft:${theme.soft};--ink:${theme.ink};--paper:${theme.paper}}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--paper);color:var(--ink);font-family:"Be Vietnam Pro",sans-serif}.hero{min-height:100svh;position:relative;display:grid;place-items:center;text-align:center;background:linear-gradient(135deg,var(--paper),var(--soft));background-image:var(--cover);background-size:cover;background-position:center;overflow:hidden}.shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,8,7,.25),rgba(10,8,7,.65))}.hero-content{position:relative;z-index:1;color:#fff;padding:32px}.hero-content>p,.eyebrow{text-transform:uppercase;letter-spacing:.28em;font-size:.72rem}.hero h1{font:500 clamp(3rem,12vw,8rem)/.9 "Playfair Display",serif;margin:24px 0;text-shadow:0 12px 35px rgba(0,0,0,.35)}.hero h1 span{display:block}.hero h1 i{display:block;color:var(--accent);font-size:.5em;margin:.18em 0}.hero time{display:block;letter-spacing:.14em}.hero a{display:inline-flex;gap:12px;margin-top:48px;color:#fff;text-decoration:none;border:1px solid rgba(255,255,255,.45);padding:13px 22px;border-radius:999px;backdrop-filter:blur(12px)}.details{min-height:100svh;display:grid;place-items:center;align-content:center;padding:90px max(24px,7vw);text-align:center}.eyebrow{color:var(--accent);font-weight:600}.details blockquote{font:italic 500 clamp(1.7rem,4vw,3.7rem)/1.35 "Playfair Display",serif;max-width:900px;margin:28px auto 58px}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px;width:min(900px,100%)}.grid article{padding:34px;border:1px solid color-mix(in srgb,var(--accent),transparent 68%);background:color-mix(in srgb,var(--paper),#fff 12%);border-radius:24px}.grid small{text-transform:uppercase;letter-spacing:.2em;color:var(--accent)}.grid h2{font:600 1.8rem "Playfair Display",serif;margin:14px 0 8px}.grid p{opacity:.72;margin:0}.map{display:inline-block;margin:36px 0;color:var(--paper);background:var(--accent);padding:14px 24px;border-radius:999px;text-decoration:none;font-weight:600}.details footer{display:flex;align-items:center;gap:18px;margin-top:48px;font:italic 500 1rem "Playfair Display",serif}.details footer i{width:48px;height:1px;background:var(--accent)}@media(max-width:680px){.grid{grid-template-columns:1fr}.hero h1{font-size:3.4rem}.details{padding:72px 20px}.details footer i{width:24px}}`;

  const script = `document.documentElement.classList.add('js');\ndocument.querySelectorAll('a[href^="#"]').forEach((link)=>link.addEventListener('click',(event)=>{const target=document.querySelector(link.getAttribute('href'));if(target){event.preventDefault();target.scrollIntoView({behavior:'smooth'});}}));`;

  const config = JSON.stringify({ templateId, ...payload, packageTier, studio: studioConfig, coverUrl: coverPhoto?.src ?? payload.coverUrl, photos: assets.map(({ photoId: _id, ...photo }) => photo) }, null, 2);
  const readme = `# Thiệp cưới ${String(payload.brideName || '')} & ${String(payload.groomName || '')}\n\nMẫu: ${templateId}\n\n## Chạy thử\n\nMở file \`index.html\` hoặc chạy một static server:\n\n\`\`\`bash\nnpx serve .\n\`\`\`\n\nDữ liệu gốc nằm trong \`invitation.config.json\`.\n`;

  return [
    { name: 'index.html', content: html },
    { name: 'styles.css', content: css + `.hero h1,.details blockquote,.grid h2,footer{font-family:${fontStyle}}.album{padding:48px 24px;text-align:center}.album>h2{font-family:${fontStyle}}.album-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;max-width:900px;margin:auto}.album-grid img{width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:12px}` },
    { name: 'script.js', content: script },
    { name: 'invitation.config.json', content: config },
    { name: 'README.md', content: readme },
  ];
}

const uuid = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;

export default {
  async fetch(request: Request) {
    if (request.method !== 'POST') return jsonResponse('Method not allowed.', 405);

    try {
      const supabaseUrl = env('SUPABASE_URL').replace(/\/$/, '');
      const publishableKey = env('SUPABASE_PUBLISHABLE_KEY');
      const authorization = request.headers.get('authorization') ?? '';
      const accessToken = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
      if (!accessToken) return jsonResponse('Bạn cần đăng nhập quản trị.', 401);

      const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
        headers: { apikey: publishableKey, Authorization: `Bearer ${accessToken}` },
        signal: AbortSignal.timeout(15_000),
      });
      if (!userResponse.ok) return jsonResponse('Phiên đăng nhập không hợp lệ hoặc đã hết hạn.', 401);
      const user = await userResponse.json() as { id?: string };
      if (!user.id) return jsonResponse('Không xác định được người dùng.', 401);

      const admins = await db<JsonRecord[]>(`admin_users?user_id=eq.${encodeURIComponent(user.id)}&select=user_id&limit=1`);
      if (!admins.length) return jsonResponse('Tài khoản không có quyền xuất source code.', 403);

      const body = await request.json().catch(() => null) as { customerId?: unknown; demoId?: unknown } | null;
      if (typeof body?.customerId !== 'string' || typeof body.demoId !== 'string'
        || !uuid.test(body.customerId) || !uuid.test(body.demoId)) {
        return jsonResponse('Mã hồ sơ hoặc demo không hợp lệ.', 400);
      }
      const [customers, demos] = await Promise.all([
        db<JsonRecord[]>(`customers?id=eq.${body.customerId}&limit=1`),
        db<JsonRecord[]>(`invitation_demos?id=eq.${body.demoId}&customer_id=eq.${body.customerId}&limit=1`),
      ]);
      if (!customers.length || !demos.length) return jsonResponse('Không tìm thấy hồ sơ khách hàng hoặc demo.', 404);
      const customer = customers[0];
      const demo = demos[0];
      if (!['confirmed', 'completed'].includes(String(customer.status))) {
        return jsonResponse('Chỉ được xuất code sau khi khách đã xác nhận đặt mẫu.', 409);
      }

      const refs = (demo.payload as { photos?: PhotoRef[] } | undefined)?.photos ?? [];
      const selected = await selectedPhotos(String(customer.id), refs);
      const customTemplateId = (demo.payload as { customTemplateId?: unknown } | undefined)?.customTemplateId;
      const customTemplate = typeof customTemplateId === 'string' && uuid.test(customTemplateId) ? customTemplateId : null;
      let entryFile = 'index.html';
      if (customTemplate) {
        const [template] = await db<Array<{ entry_file: string }>>(
          `custom_invitation_templates?id=eq.${encodeURIComponent(customTemplate)}&select=entry_file&limit=1`,
        );
        if (!template) return jsonResponse('Không tìm thấy mẫu đang dùng cho demo.', 422);
        entryFile = template.entry_file;
      }
      const assets: Array<PhotoRef & { src: string }> = [];
      const binaryFiles: Array<{ name: string; content: Uint8Array }> = [];
      let galleryIndex = 0;
      for (const { ref, path } of selected) {
        const name = ref.role === 'cover' ? 'cover'
          : ref.role === 'main' ? 'main'
            : ref.role === 'video' ? 'video-background'
              : `gallery-${String(++galleryIndex).padStart(2, '0')}`;
        const src = `${customTemplate ? 'customer-assets' : 'assets'}/${name}.webp`;
        const response = await supabase(`/storage/v1/object/authenticated/${ASSETS}/${path}`);
        binaryFiles.push({ name: src, content: new Uint8Array(await response.arrayBuffer()) });
        assets.push({ ...ref, src });
      }
      const outputFiles = customTemplate
        ? await buildCustomTemplateFiles(customTemplate, demo, assets)
        : await buildSignatureTemplateFiles(customer, demo, assets);
      const exportMetadata = {
        version: 1,
        customerId: String(customer.id),
        demoId: String(demo.id),
        entryFile,
      };
      const zip = createZip([
        ...outputFiles,
        ...binaryFiles,
        { name: 'mp-invitation-export.json', content: JSON.stringify(exportMetadata, null, 2) },
      ]);
      const filename = `${slugify(`${String(customer.bride_name ?? '')}-${String(customer.groom_name ?? '')}`)}.zip`;
      let downloadUrl: string | undefined;
      if (assets.length || zip.byteLength > 4_000_000) {
        const path = `exports/${customer.id}/${demo.id}/${randomUUID()}.zip`;
        await supabase(`/storage/v1/object/${EXPORTS}/${path}`, {
          method: 'POST', headers: { 'Content-Type': 'application/zip' }, body: Uint8Array.from(zip),
        });
        downloadUrl = await signAsset(EXPORTS, path, 600, filename);
      }
      await db('rpc/record_invitation_export', { p_customer: body.customerId, p_demo: body.demoId, p_actor: user.id });

      if (downloadUrl) return Response.json({ downloadUrl }, { headers: { 'Cache-Control': 'no-store' } });
      return new Response(Uint8Array.from(zip), {
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Cache-Control': 'no-store',
        },
      });
    } catch (error) {
      if (error instanceof MediaError) return jsonResponse(error.message, error.status);
      console.error('export-invitation failed', error);
      return jsonResponse('Không thể tạo file ZIP. Kiểm tra cấu hình server và thử lại.', 500);
    }
  },
};
