const productionOrigin = 'https://wedding-invitation-mp.vercel.app';

function escapeHtml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function page(title: string, description: string, url: string, image: string, status = 200) {
  const metadata = [
    ['property', 'og:type', 'website'],
    ['property', 'og:site_name', 'Wedding Invitation MP'],
    ['property', 'og:title', title],
    ['property', 'og:description', description],
    ['property', 'og:url', url],
    ['property', 'og:image', image],
    ['name', 'twitter:card', 'summary_large_image'],
    ['name', 'twitter:title', title],
    ['name', 'twitter:description', description],
    ['name', 'twitter:image', image],
    ['name', 'robots', 'noindex, nofollow'],
  ].map(([kind, key, value]) => `<meta ${kind}="${key}" content="${escapeHtml(value)}">`).join('\n');
  return new Response(`<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title><link rel="canonical" href="${escapeHtml(url)}">${metadata}</head><body><main><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p><a href="${escapeHtml(url)}">Mở thiệp</a></main></body></html>`, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex, nofollow',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

function dateLabel(value: unknown) {
  if (typeof value !== 'string') return '';
  const [year, month, day] = value.split('-');
  return year && month && day ? `${day} · ${month} · ${year}` : value;
}

export default {
  async fetch(request: Request) {
    if (request.method !== 'GET') return page('Không tìm thấy thiệp', 'Liên kết thiệp không hợp lệ.', productionOrigin, '', 404);
    const requestUrl = new URL(request.url);
    const token = requestUrl.searchParams.get('token') ?? '';
    const slug = requestUrl.searchParams.get('slug') ?? '';
    const isDemo = /^[a-f0-9]{48}$/i.test(token);
    if (!isDemo && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug)) {
      return page('Không tìm thấy thiệp', 'Liên kết thiệp không tồn tại hoặc đã hết hạn.', productionOrigin, '', 404);
    }

    try {
      const action = isDemo ? 'demo' : 'invitation';
      const response = await fetch(new URL(`/api/customer-media?action=${action}`, requestUrl.origin), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isDemo ? { token } : { slug }),
        signal: AbortSignal.timeout(12_000),
      });
      const result = await response.json().catch(() => null) as {
        payload?: Record<string, unknown>;
        templateId?: string;
      } | null;
      if (!response.ok || !result?.payload) {
        return page('Không thể mở thiệp', 'Liên kết thiệp không tồn tại hoặc đã hết hạn.', new URL(isDemo ? `/preview/${token}` : `/invite/${slug}`, productionOrigin).href, '', 404);
      }

      const payload = result.payload;
      const bride = String(payload.brideName ?? 'Cô dâu').slice(0, 100);
      const groom = String(payload.groomName ?? 'Chú rể').slice(0, 100);
      const url = new URL(isDemo ? `/preview/${token}` : `/invite/${slug}`, productionOrigin).href;
      const title = `${isDemo ? 'Bản demo thiệp cưới' : 'Thiệp cưới'} · ${bride} & ${groom}`;
      const details = [dateLabel(payload.weddingDate), String(payload.venue ?? '').slice(0, 120)]
        .filter(Boolean).join(' · ');
      const invitationText = String(payload.message ?? '').replace(/\s+/g, ' ').trim().slice(0, 180);
      const description = [invitationText, details].filter(Boolean).join(' | ')
        || `Trân trọng mời bạn đến chung vui cùng ${bride} & ${groom}.`;
      const photos = Array.isArray(payload.photos) ? payload.photos as Array<{ role?: string; url?: string }> : [];
      const cover = photos.find((photo) => photo.role === 'cover')?.url || payload.coverUrl;
      let image = 'https://thiepcuoionline.huythanhjewelry.vn/img/home-banner.webp';
      if (typeof cover === 'string') {
        try {
          const parsed = new URL(cover, productionOrigin);
          if (parsed.protocol === 'https:') image = parsed.href;
        } catch { /* Use the site-wide share image when a cover URL is invalid. */ }
      }
      return page(title, description, url, image);
    } catch {
      return page('Thiệp cưới online', 'Mở thiệp cưới cá nhân hóa từ Wedding Invitation MP.', productionOrigin, 'https://thiepcuoionline.huythanhjewelry.vn/img/home-banner.webp', 502);
    }
  },
};