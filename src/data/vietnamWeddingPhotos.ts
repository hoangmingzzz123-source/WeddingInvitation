const modernPhoto = (story: 'atelier' | 'ao-dai' | 'city' | 'coast', index: number) =>
  `/images/vietnam-modern/${story}-${String(index).padStart(2, '0')}.webp`;

const story = (name: 'atelier' | 'ao-dai' | 'city' | 'coast') =>
  [0, 1, 2, 3].map((index) => modernPhoto(name, index));

const mix = (
  primary: 'atelier' | 'ao-dai' | 'city' | 'coast',
  secondary: 'atelier' | 'ao-dai' | 'city' | 'coast',
) => [
  modernPhoto(primary, 0),
  modernPhoto(primary, 1),
  modernPhoto(primary, 2),
  modernPhoto(secondary, 3),
];

/**
 * Curated photo stories for the demo invitations.
 *
 * Keeping the collections named by context prevents a Hoi An portrait from
 * appearing in a beach invitation, or a tea ceremony from appearing in a
 * modern studio set. These are AI-generated fictional adults; the prompt and
 * generation notes live next to the image files in
 * public/images/vietnam-modern/sources.json.
 */
export const VIETNAM_WEDDING_THEMES = {
  giaTien: story('ao-dai'),
  songHy: mix('ao-dai', 'city'),
  hoiAn: mix('ao-dai', 'coast'),
  hanoiStudio: story('atelier'),
  garden: mix('atelier', 'coast'),
  coastal: story('coast'),
  modernCeremony: story('city'),
  heritage: mix('ao-dai', 'atelier'),
} as const;

export type VietnamWeddingTheme = keyof typeof VIETNAM_WEDDING_THEMES;

export const getVietnamWeddingTheme = (theme: VietnamWeddingTheme): string[] =>
  [...VIETNAM_WEDDING_THEMES[theme]];
