# Custom invitation starter

Edit `index.html` and `styles.css`, then create a ZIP with these files at the archive root:

- `manifest.json`
- `index.html`
- `styles.css`
- optional `script.js` and `assets/`

Use placeholders such as `{{brideName}}`, `{{message}}`, `{{coverUrl}}`, `{{coverPosition}}`, `{{gallery1Url}}`, and `{{gallery1Position}}`. See the full token list and package limits in `CUSTOM_TEMPLATE_GUIDE.md` in the project.

The ZIP needs `manifest.json` with `version: 1`, a `name`, and an `entry` pointing to the HTML page. Keep all asset references relative to the HTML file. The package is rendered in a sandbox; network requests and RSVP form submissions are blocked.