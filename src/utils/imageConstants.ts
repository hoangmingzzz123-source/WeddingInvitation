/**
 * Image URLs Constants
 * Centralized image URLs for the wedding invitation website
 */
import videoCover from '../asset/videoCover.png';
import { VIETNAM_WEDDING_THEMES } from '../data/vietnamWeddingPhotos';

const {
  coastal,
  garden,
  giaTien,
  hanoiStudio,
  heritage,
  hoiAn,
  modernCeremony,
  songHy,
} = VIETNAM_WEDDING_THEMES;

// Gallery Images - Wedding Photos
export const GALLERY_IMAGES = {
  // Standard gallery photos (used in multiple templates)
  studio_couple: hanoiStudio[0],
  tuarts_couple_1: hanoiStudio[1],
  tuarts_couple_2: modernCeremony[0],
  encrypted_couple: hoiAn[0],
  demxanh_studio: garden[0],
  tuarts_bride: heritage[0],
  tuarts_couple_3: giaTien[0],
};

// Home/Hero Images
export const HERO_IMAGES = {
  banner: videoCover,
};

// Template Gallery Images - Featured Templates
export const TEMPLATE_GALLERY_IMAGES = {
  classicMinimalist: giaTien[0],
  blushFloral: garden[1],
  bloomCrystal: hanoiStudio[2],
  minimalElegant: hanoiStudio[3],
  luxuryGold: modernCeremony[1],
  
  // 159k Package
  studio_elegant: hanoiStudio[4],
  tuarts_elegant: heritage[1],
  vintage_style: hoiAn[1],
  vietnamese_dress: giaTien[1],
  
  // 199k Package
  korean_studio: hanoiStudio[1],
  luxe_venue: modernCeremony[2],
  photo_session: garden[2],
};

// Testimonials/Avatar Images
export const TESTIMONIAL_AVATARS = {
  bride_1: heritage[2],
  groom_1: hanoiStudio[0],
  couple_1: garden[3],
};

// Unsplash Images - Love Story & Timeline
export const UNSPLASH_IMAGES = {
  // Cinematic Love Story - Timeline
  storyChapter1: modernCeremony[0],
  storyChapter2: modernCeremony[1],
  storyChapter3: modernCeremony[2],
  storyChapter4: modernCeremony[3],
  
  // Cinematic Love Story - Gallery
  couplerBeachSunset: coastal[0],
  weddingCeremony: modernCeremony[1],
  weddingDecoration: songHy[2],
  weddingCoupleDancing: garden[0],
  weddingVenue: modernCeremony[4],
  
  // Vietnamese Traditional - Gallery
  vietnameseGallery1: giaTien[0],
  vietnameseGallery2: giaTien[1],
  vietnameseGallery3: giaTien[2],
  vietnameseGallery4: songHy[0],
  vietnameseGallery5: songHy[1],
  vietnameseGallery6: songHy[2],
  
  // Art Deco Royal & Minimal Slide Clean
  coupleInPark: garden[0],
  brideBouquet: garden[1],
  weddingRings: modernCeremony[0],
  brideAndGroom: hanoiStudio[0],
  weddingTable: modernCeremony[2],
  couplesPortrait: hanoiStudio[2],
};

// Demo1/Figma Gallery Images
export const DEMO1_GALLERY_IMAGES = {
  coupleBeachSunset: coastal[0],
  coupleHolding: garden[0],
  decorationFlowers: garden[1],
  weddingVenue: garden[2],
  weddingCeremony: garden[3],
  coupleDancing: garden[4],
};

// Classic Minimalist Special Images
export const CLASSIC_MINIMALIST_IMAGES = {
  weddingParty: giaTien[0],
  flowerCeremony: giaTien[1],
  weddingVenue: giaTien[2],
  couplesPhoto: giaTien[3],
  vietnameseDress: giaTien[4],
  studioPhoto: hanoiStudio[0],
};

// Special Images for Different Templates
export const SPECIAL_TEMPLATE_IMAGES = {
  minimalSlideClean: hoiAn[0],
  modernDarkBlue: modernCeremony[0],
  romanticWatercolor: heritage[0],
  tropicalSunset: coastal[1],
  vintageGrain: hoiAn[1],
};

/**
 * Helper function to get a set of gallery images
 * @param count - Number of images to return
 * @returns Array of gallery image URLs
 */
export const getGalleryImages = (count: number = 6): string[] => {
  const images = [
    GALLERY_IMAGES.studio_couple,
    GALLERY_IMAGES.tuarts_couple_1,
    GALLERY_IMAGES.tuarts_couple_2,
    GALLERY_IMAGES.encrypted_couple,
    GALLERY_IMAGES.demxanh_studio,
    GALLERY_IMAGES.tuarts_couple_3,
  ];
  return images.slice(0, count);
};

/**
 * Helper function to get cinematic love story images
 * @returns Array of story chapter images
 */
export const getLoveStoryImages = (): string[] => [
  UNSPLASH_IMAGES.storyChapter1,
  UNSPLASH_IMAGES.storyChapter2,
  UNSPLASH_IMAGES.storyChapter3,
  UNSPLASH_IMAGES.storyChapter4,
];

// Additional Premium Gallery Images - Wedding Photos
export const PREMIUM_GALLERY_IMAGES = {
  pinimg_1: giaTien[0],
  pinimg_2: giaTien[1],
  xanhwedding_studio: hanoiStudio[0],
  pinimg_3: hoiAn[0],
  afamilycdn_1: songHy[0],
  pinimg_4: garden[0],
  pinimg_5: coastal[0],
  toplist_beewedding: modernCeremony[0],
  tuart_studio: hanoiStudio[1],
  pinimg_6: hanoiStudio[2],
  noah_wedding_concept: garden[1],
  mimosa_wedding: heritage[0],
  pinimg_7: hoiAn[1],
  pinimg_8: coastal[1],
  calibridal_wedding: modernCeremony[1],
  googleusercontent_concept: hanoiStudio[3],
  hstudio_aodai: heritage[1],
  anhvien_mimosa_korea: hanoiStudio[4],
  pinimg_9: giaTien[2],
  pinimg_10: songHy[1],
  pinimg_11: garden[2],
  pinimg_12: coastal[2],
  pinimg_13: hoiAn[2],
  pinimg_14: modernCeremony[2],
  pinimg_15: heritage[2],
  pinimg_16: songHy[2],
  pinimg_17: garden[3],
};
