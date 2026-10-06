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
  return Response.json({ message }, { status });
}

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
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

export function createZip(files: Array<{ name: string; content: string }>) {
  const entries: ZipEntry[] = [];
  const localParts: Uint8Array[] = [];
  let localOffset = 0;
  const { time, day } = dosDateTime();

  files.forEach((file) => {
    const name = encoder.encode(file.name);
    const data = encoder.encode(file.content);
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

export function buildFiles(customer: JsonRecord, demo: JsonRecord) {
  const payload = (demo.payload ?? {}) as JsonRecord;
  const bride = escapeHtml(payload.brideName || customer.bride_name || 'Cô dâu');
  const groom = escapeHtml(payload.groomName || customer.groom_name || 'Chú rể');
  const date = escapeHtml(formatDate(payload.weddingDate || customer.wedding_date));
  const time = escapeHtml(payload.weddingTime || customer.wedding_time || '18:00');
  const venue = escapeHtml(payload.venue || customer.venue || 'Địa điểm tổ chức');
  const address = escapeHtml(payload.address || customer.address || '');
  const message = escapeHtml(payload.message || customer.message || 'Trân trọng mời bạn đến chung vui trong ngày hạnh phúc của chúng mình.');
  const cover = safeUrl(payload.coverUrl || customer.cover_url);
  const templateId = String(demo.template_id || customer.selected_template_id || 'classic-minimalist');
  const theme = themeMap[templateId] ?? { accent: '#b58a45', soft: '#f1dfbd', ink: '#332a22', paper: '#fffaf2' };
  const title = `${bride} & ${groom}`;
  const mapQuery = encodeURIComponent(`${venue} ${address}`);

  const html = `<!doctype html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Thiệp cưới của ${title}" />
  <title>${title} | Wedding Invitation</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,500;0,600;1,500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <main>
    <section class="hero"${cover ? ` style="--cover:url('${cover}')"` : ''}>
      <div class="shade"></div>
      <div class="hero-content">
        <p>Wedding invitation</p>
        <h1><span>${bride}</span><i>&amp;</i><span>${groom}</span></h1>
        <time>${date}</time>
        <a href="#details" aria-label="Xem thông tin lễ cưới">Khám phá <b>↓</b></a>
      </div>
    </section>
    <section class="details" id="details">
      <p class="eyebrow">Trân trọng kính mời</p>
      <blockquote>“${message}”</blockquote>
      <div class="grid">
        <article><small>Thời gian</small><h2>${time}</h2><p>${date}</p></article>
        <article><small>Địa điểm</small><h2>${venue}</h2><p>${address || 'Địa chỉ sẽ được cập nhật'}</p></article>
      </div>
      <a class="map" href="https://www.google.com/maps/search/?api=1&query=${mapQuery}" target="_blank" rel="noreferrer">Mở bản đồ</a>
      <footer><i></i><span>Sự hiện diện của bạn là niềm vui của chúng mình</span><i></i></footer>
    </section>
  </main>
  <script src="script.js"></script>
</body>
</html>`;

  const css = `:root{--accent:${theme.accent};--soft:${theme.soft};--ink:${theme.ink};--paper:${theme.paper}}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--paper);color:var(--ink);font-family:"Be Vietnam Pro",sans-serif}.hero{min-height:100svh;position:relative;display:grid;place-items:center;text-align:center;background:linear-gradient(135deg,var(--paper),var(--soft));background-image:var(--cover);background-size:cover;background-position:center;overflow:hidden}.shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,8,7,.25),rgba(10,8,7,.65))}.hero-content{position:relative;z-index:1;color:#fff;padding:32px}.hero-content>p,.eyebrow{text-transform:uppercase;letter-spacing:.28em;font-size:.72rem}.hero h1{font:500 clamp(3rem,12vw,8rem)/.9 "Playfair Display",serif;margin:24px 0;text-shadow:0 12px 35px rgba(0,0,0,.35)}.hero h1 span{display:block}.hero h1 i{display:block;color:var(--accent);font-size:.5em;margin:.18em 0}.hero time{display:block;letter-spacing:.14em}.hero a{display:inline-flex;gap:12px;margin-top:48px;color:#fff;text-decoration:none;border:1px solid rgba(255,255,255,.45);padding:13px 22px;border-radius:999px;backdrop-filter:blur(12px)}.details{min-height:100svh;display:grid;place-items:center;align-content:center;padding:90px max(24px,7vw);text-align:center}.eyebrow{color:var(--accent);font-weight:600}.details blockquote{font:italic 500 clamp(1.7rem,4vw,3.7rem)/1.35 "Playfair Display",serif;max-width:900px;margin:28px auto 58px}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px;width:min(900px,100%)}.grid article{padding:34px;border:1px solid color-mix(in srgb,var(--accent),transparent 68%);background:color-mix(in srgb,var(--paper),#fff 12%);border-radius:24px}.grid small{text-transform:uppercase;letter-spacing:.2em;color:var(--accent)}.grid h2{font:600 1.8rem "Playfair Display",serif;margin:14px 0 8px}.grid p{opacity:.72;margin:0}.map{display:inline-block;margin:36px 0;color:var(--paper);background:var(--accent);padding:14px 24px;border-radius:999px;text-decoration:none;font-weight:600}.details footer{display:flex;align-items:center;gap:18px;margin-top:48px;font:italic 500 1rem "Playfair Display",serif}.details footer i{width:48px;height:1px;background:var(--accent)}@media(max-width:680px){.grid{grid-template-columns:1fr}.hero h1{font-size:3.4rem}.details{padding:72px 20px}.details footer i{width:24px}}`;

  const script = `document.documentElement.classList.add('js');\ndocument.querySelectorAll('a[href^="#"]').forEach((link)=>link.addEventListener('click',(event)=>{const target=document.querySelector(link.getAttribute('href'));if(target){event.preventDefault();target.scrollIntoView({behavior:'smooth'});}}));`;

  const config = JSON.stringify({ templateId, brideName: payload.brideName, groomName: payload.groomName, weddingDate: payload.weddingDate, weddingTime: payload.weddingTime, venue: payload.venue, address: payload.address, message: payload.message, coverUrl: payload.coverUrl }, null, 2);
  const readme = `# Thiệp cưới ${String(payload.brideName || '')} & ${String(payload.groomName || '')}\n\nMẫu: ${templateId}\n\n## Chạy thử\n\nMở file \`index.html\` hoặc chạy một static server:\n\n\`\`\`bash\nnpx serve .\n\`\`\`\n\nDữ liệu gốc nằm trong \`invitation.config.json\`.\n`;

  return [
    { name: 'index.html', content: html },
    { name: 'styles.css', content: css },
    { name: 'script.js', content: script },
    { name: 'invitation.config.json', content: config },
    { name: 'README.md', content: readme },
  ];
}

async function supabaseFetch(url: string, secret: string, path: string, init: RequestInit = {}) {
  return fetch(`${url}${path}`, {
    ...init,
    headers: {
      apikey: secret,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });
}

export default {
  async fetch(request: Request) {
    if (request.method !== 'POST') return jsonResponse('Method not allowed.', 405);

    try {
      const supabaseUrl = env('SUPABASE_URL').replace(/\/$/, '');
      const publishableKey = env('SUPABASE_PUBLISHABLE_KEY');
      const secretKey = env('SUPABASE_SECRET_KEY');
      const authorization = request.headers.get('authorization') ?? '';
      const accessToken = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
      if (!accessToken) return jsonResponse('Bạn cần đăng nhập quản trị.', 401);

      const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
        headers: { apikey: publishableKey, Authorization: `Bearer ${accessToken}` },
      });
      if (!userResponse.ok) return jsonResponse('Phiên đăng nhập không hợp lệ hoặc đã hết hạn.', 401);
      const user = await userResponse.json() as { id?: string };
      if (!user.id) return jsonResponse('Không xác định được người dùng.', 401);

      const adminResponse = await supabaseFetch(
        supabaseUrl, secretKey,
        `/rest/v1/admin_users?user_id=eq.${encodeURIComponent(user.id)}&select=user_id&limit=1`,
      );
      const admins = await adminResponse.json() as JsonRecord[];
      if (!adminResponse.ok || !admins.length) return jsonResponse('Tài khoản không có quyền xuất source code.', 403);

      const body = await request.json() as { customerId?: string; demoId?: string };
      if (!body.customerId || !body.demoId) return jsonResponse('Thiếu customerId hoặc demoId.', 400);

      const [customerResponse, demoResponse] = await Promise.all([
        supabaseFetch(supabaseUrl, secretKey, `/rest/v1/customers?id=eq.${encodeURIComponent(body.customerId)}&select=*&limit=1`),
        supabaseFetch(supabaseUrl, secretKey, `/rest/v1/invitation_demos?id=eq.${encodeURIComponent(body.demoId)}&select=*&limit=1`),
      ]);
      const customers = await customerResponse.json() as JsonRecord[];
      const demos = await demoResponse.json() as JsonRecord[];
      if (!customerResponse.ok || !demoResponse.ok || !customers.length || !demos.length) {
        return jsonResponse('Không tìm thấy hồ sơ khách hàng hoặc demo.', 404);
      }
      const customer = customers[0];
      const demo = demos[0];
      if (String(demo.customer_id) !== String(customer.id)) return jsonResponse('Demo không thuộc khách hàng này.', 400);
      if (!['confirmed', 'completed'].includes(String(customer.status))) {
        return jsonResponse('Chỉ được xuất code sau khi khách đã xác nhận đặt mẫu.', 409);
      }

      const zip = createZip(buildFiles(customer, demo));
      const now = new Date().toISOString();
      await Promise.all([
        supabaseFetch(supabaseUrl, secretKey, `/rest/v1/customers?id=eq.${encodeURIComponent(body.customerId)}`, {
          method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ exported_at: now }),
        }),
        supabaseFetch(supabaseUrl, secretKey, '/rest/v1/code_exports', {
          method: 'POST', headers: { Prefer: 'return=minimal' },
          body: JSON.stringify({ customer_id: body.customerId, demo_id: body.demoId, exported_by: user.id }),
        }),
      ]);

      const filename = `${slugify(`${String(customer.bride_name ?? '')}-${String(customer.groom_name ?? '')}`)}.zip`;
      return new Response(zip, {
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Cache-Control': 'no-store',
        },
      });
    } catch (error) {
      console.error('export-invitation failed', error);
      return jsonResponse('Không thể tạo file ZIP. Kiểm tra cấu hình server và thử lại.', 500);
    }
  },
};
