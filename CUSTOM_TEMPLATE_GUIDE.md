# Custom invitation template ZIP

## Starter package

The ready-to-edit starter is in `public/custom-template-starter/`. Create a ZIP with its contents at the archive root, not with an extra parent folder:

```text
manifest.json
index.html
styles.css
script.js       # optional
assets/         # optional images, fonts, and icons
```

`manifest.json` is required and has this shape:

```json
{
  "version": 1,
  "name": "Garden invitation",
  "entry": "index.html"
}
```

The entry HTML can link local files with relative paths. Use the supported placeholders below where the couple's content or uploaded photos should appear. Photo position placeholders return CSS values such as `50% 65%` and can be used in `object-position` or `background-position`.

```html
<h1>{{brideName}} &amp; {{groomName}}</h1>
<p>{{weddingDate}} · {{weddingTime}}</p>
<p>{{venue}} · {{address}}</p>
<p>{{message}}</p>
<img src="{{coverUrl}}" style="object-position:{{coverPosition}}" alt="">
<img src="{{gallery1Url}}" style="object-position:{{gallery1Position}}" alt="">
```

Available text placeholders: `brideName`, `groomName`, `weddingDate`, `weddingDateLabel`, `weddingTime`, `venue`, `address`, `message` (alias: `story`), `city`, `packageTier`, `ceremonyTitle`, `receptionTitle`, `heroKicker`, `albumTitle`, `timeLabel`, `venueLabel`, and `signatureText`.

Photo placeholders: `coverUrl`, `coverPosition`, and `gallery1Url` through `gallery7Url`, each with a matching `galleryNPosition` token. Unselected images are replaced with an empty URL.

## Upload limits and behavior

- ZIP archive: maximum 4 MiB.
- Expanded contents: maximum 12 MiB total, 60 files, and 2 MiB per file.
- Supported file types: HTML, CSS, JS, JSON, Markdown, JPEG, PNG, WebP, SVG, WOFF/WOFF2, TTF, and OTF.
- `manifest.json` must be at the ZIP root and is limited to 32 KiB.
- The entry page cannot contain `iframe`, `object`, `embed`, or `base` elements.
- Custom HTML runs in a sandboxed iframe without same-origin access. Its CSP blocks network requests, form submission, nested frames, and external scripts/styles. Keep JavaScript self-contained and use local assets.
- RSVP forms in a static package do not submit to the Wedding Invitation MP RSVP system automatically. Use the built-in templates for integrated RSVP, or connect a separately approved RSVP workflow.
- Admin Studio currently uses the customer photo library for preview and the public invitation. Use the `coverUrl` and gallery placeholders to position those selected images.

After upload, select the package in Studio, choose/crop the customer photos, then create the preview. The selected package ID is saved with the demo and reused by the published slug.

## Vercel domain setting

`VITE_PUBLIC_INVITATION_DOMAIN` is optional. Leave it empty to use `https://your-site-domain/invite/slug`. To use `https://slug.your-domain`, set it to the domain you own, without a scheme or trailing slash, for example:

```env
VITE_PUBLIC_INVITATION_DOMAIN=wedding-invitation-mp.vn
```

Add both the root domain and `*.wedding-invitation-mp.vn` to the Vercel project and configure the wildcard DNS record as Vercel instructs. The built-in `wedding-invitation-mp.vercel.app` hostname cannot be used as a customer wildcard domain.