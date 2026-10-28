# Vietnamese demo refresh

Changes:
- Keep signature navigation in normal document flow; remove negative hero overlap and reserve a separate row for music controls. Anchor destinations allow room for the sticky navigation. The compact RSVP button keeps its accessible label and visible arrow.
- Replace remote demo photography, shared defaults, fallback photographs and catalogue previews with 40 locally hosted Vietnamese wedding photographs. The library is split into eight coherent stories: lễ gia tiên, Song Hỷ, Hội An, studio Hà Nội, sân vườn, biển, nghi lễ hiện đại and di sản.
- Assign every demo a matching photo story. Beach layouts now use coastal photographs, vintage layouts use Hội An, traditional layouts use ceremony imagery, and editorial layouts use studio or garden collections. Catalogue thumbnails use the same story as their demo.
- Add Sen Ngọc (`/demo/sen-ngoc`), Hỷ Sự Đỏ Son (`/demo/hy-su-do-son`) and Thương Nhau Phố Hội (`/demo/pho-hoi`), with different palettes, framing and layout. Each is registered in the router, catalogue and demo shell.
- Remove two accidental log lines at the start of site.css.

Sources: https://traothiep.vn/mau-thiep/thiep-cuoi and https://m-invite.com/ were reviewed for style directions only. No source code, template artwork or photographs were copied from those sites.

Photo source records: `public/images/vietnam/sources.json`. Photos are used as illustrative assets under the Pexels license (https://www.pexels.com/license/); names and event information are fictional. The image migration record is `docs/demo-photo-migration.json`.

Validation: `npm run build` (includes TypeScript), `node scripts/check-demo-assets.mjs`, and contact-sheet inspection of all source photographs. Browser layout verification could not run in the workspace because Chromium was unavailable and the browser download returned an invalid archive. Check the following before deploying:

- At 360, 390, 430 and 1440 pixels: open Olive Garden, each new demo, and the other signature templates. Check title/header spacing, music controls, RSVP icon, anchor links and page overflow.
- Check gallery lightbox, RSVP and the existing 219k demo opening screens.

## Apply the accompanying patch

Start from the master commit listed in the delivery README. The patch includes binary photo assets and new files:

```sh
git switch -c fix/vietnamese-demo-refresh
git apply --check wedding-demo-refresh.patch
git apply wedding-demo-refresh.patch
npm ci
npm run build
node scripts/check-demo-assets.mjs
```

Deployment remains a separate step after the branch review.
