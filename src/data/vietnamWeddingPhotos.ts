const vietnamPhoto = (id: number) => `/images/vietnam/wedding-${id}.webp`;

/**
 * Curated photo stories for the demo invitations.
 *
 * Keeping the collections named by context prevents a Hoi An portrait from
 * appearing in a beach invitation, or a tea ceremony from appearing in a
 * modern studio set. Source and license details live next to the image files
 * in public/images/vietnam/sources.json.
 */
export const VIETNAM_WEDDING_THEMES = {
  giaTien: [10568535, 10568538, 10568551, 19476299, 19476296].map(vietnamPhoto),
  songHy: [34481882, 34481898, 38743756, 38776686, 38766155].map(vietnamPhoto),
  hoiAn: [35841823, 35343290, 36630693, 13114531, 35083788].map(vietnamPhoto),
  hanoiStudio: [19956242, 19956238, 19956232, 33884990, 33884967].map(vietnamPhoto),
  garden: [36647826, 36647742, 36647824, 36647816, 9061879].map(vietnamPhoto),
  coastal: [7216412, 12409630, 14350265, 33324146, 3702868].map(vietnamPhoto),
  modernCeremony: [23369886, 33986841, 38776688, 30311762, 23369888].map(vietnamPhoto),
  heritage: [34668070, 34668057, 35343297, 34949949, 19791963].map(vietnamPhoto),
} as const;

export type VietnamWeddingTheme = keyof typeof VIETNAM_WEDDING_THEMES;

export const getVietnamWeddingTheme = (theme: VietnamWeddingTheme): string[] =>
  [...VIETNAM_WEDDING_THEMES[theme]];
