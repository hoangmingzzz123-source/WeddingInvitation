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
<p>{{ceremonyTitle}}: {{ceremonyTime}}</p>
<p>{{receptionTitle}}: {{receptionTime}}</p>
<p>{{venue}} · {{address}}</p>
<p>{{message}}</p>
<img src="{{coverUrl}}" style="object-position:{{coverPosition}}" alt="">
<img src="{{mainUrl}}" style="object-position:{{mainPosition}}" alt="">
<div class="video" style="background-image:url('{{videoUrl}}');background-position:{{videoPosition}}"></div>
<a href="{{videoLink}}">Xem video cưới</a>
<img src="{{gallery1Url}}" style="object-position:{{gallery1Position}}" alt="">
```

Available text placeholders: `brideName`, `groomName`, `headerMonogramText` (custom text in the header monogram; empty means use the initials), `weddingDate`, `weddingDateLabel`, `ceremonyDate`, `ceremonyDateLabel`, `receptionDate`, `receptionDateLabel`, `weddingTime`, `ceremonyTime`, `receptionTime`, `ceremonyAddress`, `receptionAddress`, `venue` (selected by `?side=bride` or `?side=groom`, falling back to the shared venue), `brideVenue`, `groomVenue`, `address`, `message` (alias: `story`), `city`, `packageTier`, `ceremonyTitle`, `receptionTitle`, `heroKicker`, `brideCeremonyTitle`, `brideReceptionTitle`, `brideCeremonyTime`, `brideReceptionTime`, `brideWeddingDate`, `brideWeddingDateLabel`, `brideCeremonyDate`, `brideCeremonyDateLabel`, `brideReceptionDate`, `brideReceptionDateLabel`, `brideCeremonyAddress`, `brideReceptionAddress`, `groomCeremonyTitle`, `groomReceptionTitle`, `groomCeremonyTime`, `groomReceptionTime`, `groomWeddingDate`, `groomWeddingDateLabel`, `groomCeremonyDate`, `groomCeremonyDateLabel`, `groomReceptionDate`, `groomReceptionDateLabel`, `groomCeremonyAddress`, `groomReceptionAddress`, `albumTitle`, `timeLabel`, `venueLabel`, `signatureText`, and `videoLink`.

Studio supports separate header, ceremony, and reception dates for each family side. Empty side-specific dates fall back to the shared wedding date (or that side's header date for ceremony/reception). The `weddingDate`, `ceremonyDate`, and `receptionDate` placeholders resolve for the current `?side=`; family-specific placeholders are available regardless of side.

To let Studio hide optional sections in a custom template, mark each section wrapper with `data-invitation-section`. Supported values are `story`, `events`, `timeline`, `album`, `video`, `qr`, `guestbook`, `venue`, and `rsvp`. For example: `<section data-invitation-section="album">...</section>`. Hidden marked sections are hidden in both the custom-template preview and exported HTML.

Photo placeholders: `coverUrl`/`coverPosition` for the hero, `mainUrl`/`mainPosition` for the primary story photo, `videoUrl`/`videoPosition` for the video panel, and `gallery1Url` through `gallery7Url`, each with a matching `galleryNPosition` token. The admin library role menu assigns these positions; remaining selected photos are album images. Each demo can use at most seven selected photos. Unselected image roles are replaced with an empty URL.

## Upload limits and behavior

- ZIP archive: maximum 4 MiB.
- Expanded contents: maximum 12 MiB total, 60 files, and 2 MiB per file.
- Supported file types: HTML, CSS, JS, JSON, Markdown, JPEG, PNG, WebP, SVG, WOFF/WOFF2, TTF, and OTF.
- `manifest.json` must be at the ZIP root and is limited to 32 KiB.
- The entry page cannot contain `iframe`, `object`, `embed`, or `base` elements.
- Custom HTML runs in a sandboxed iframe without same-origin access. Its CSP blocks network requests, form submission, nested frames, and external scripts/styles. Keep JavaScript self-contained and use local assets.
- RSVP forms in a static package do not submit to the Wedding Invitation MP RSVP system automatically. Use the built-in templates for integrated RSVP, or connect a separately approved RSVP workflow.
- Admin Studio uses the customer photo library for preview and the public invitation. Use the role-specific photo placeholders to position selected images; gallery placeholders only include photos assigned to Album.

After upload, select the package in Studio, choose/crop the customer photos, then create the preview. The selected package ID is saved with the demo and reused by the published slug.

## Edit an exported customer invitation

From the admin demo row, export a fresh ZIP, edit `index.html`, `styles.css`, or local assets, then use **Cập nhật từ ZIP** on that same demo. The archive is checked against its embedded customer/demo marker and becomes a private revision for that invitation; its preview and published URL use the new revision. Older ZIPs without the marker must be exported again. Keep files at the archive root and within the existing ZIP size and file-type limits.

## Vercel domain setting

The admin publish action always creates a path-based URL such as `https://your-site-domain/invite/slug`. `VITE_PUBLIC_INVITATION_DOMAIN` is optional and enables routing published invitations from a custom wildcard domain you own, without a scheme or trailing slash, for example:

```env
VITE_PUBLIC_INVITATION_DOMAIN=wedding-invitation-mp.vn
```

Add both the root domain and `*.wedding-invitation-mp.vn` to the Vercel project and configure the wildcard DNS record as Vercel instructs. The built-in `wedding-invitation-mp.vercel.app` hostname cannot be used as a customer wildcard domain. The admin-generated path URL remains available regardless of this setting.