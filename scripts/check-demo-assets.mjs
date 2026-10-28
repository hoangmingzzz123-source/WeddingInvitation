import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import assert from 'node:assert/strict';
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(`${dir}/${e.name}`) : [`${dir}/${e.name}`]);
const files = [
  ...walk('src/components/demos'),
  ...walk('src/Demo'),
  'src/utils/imageConstants.ts',
  'src/data/vietnamWeddingPhotos.ts',
  'src/components/InvitationCreator.tsx',
  'src/components/figma/ImageWithFallback.tsx',
];
let references = 0;
for (const path of files.filter(p => /\.(tsx?|css)$/.test(p))) {
  const text = readFileSync(path, 'utf8');
  assert(!/https?:\/\/images\.unsplash\.com/.test(text), `Remote Unsplash photo in ${path}`);
  for (const [src] of text.matchAll(/\/images\/vietnam\/[\w-]+\.webp/g)) {
    assert(existsSync(`public${src}`), `Missing ${src} in ${path}`); references++;
  }
}
const router = readFileSync('src/Router.tsx','utf8');
const catalogue = readFileSync('src/data/templates.ts','utf8');
const photoManifest = JSON.parse(readFileSync('public/images/vietnam/sources.json', 'utf8'));
assert.equal(Object.keys(photoManifest.themes).length, 8, 'Expected 8 Vietnamese wedding photo themes');
assert(photoManifest.photos.length >= 40, 'Expected at least 40 Vietnamese wedding photographs');
for (const photo of photoManifest.photos) {
  const path = `public/images/vietnam/${photo.file}`;
  assert(existsSync(path), `Missing manifest photo ${path}`);
  assert(statSync(path).size > 0, `Empty manifest photo ${path}`);
}

for (const id of ['sen-ngoc','hy-su-do-son','pho-hoi']) {
  assert(router.includes(`'/demo/${id}'`), `Missing route ${id}`);
  assert(catalogue.includes(`id: '${id}'`), `Missing catalogue entry ${id}`);
}

const internalTemplateIds = [...catalogue.matchAll(/route: '\/demo\/([^']+)'/g)]
  .map(([, id]) => id);
for (const id of internalTemplateIds) {
  for (const width of [480, 800]) {
    const path = `public/images/templates/${id}-${width}.webp`;
    assert(existsSync(path), `Missing template preview ${path}`);
    assert(statSync(path).size > 0, `Empty template preview ${path}`);
  }
}

console.log(`Verified ${references} direct references, ${photoManifest.photos.length} themed photos, and ${internalTemplateIds.length} template preview sets.`);
