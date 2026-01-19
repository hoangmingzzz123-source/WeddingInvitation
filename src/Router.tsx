import React, { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { ClassicMinimalist } from './components/demos/ClassicMinimalist';
import { BlushFloral } from './components/demos/BlushFloral';
import { BlushFloralEnhanced } from './components/demos/BlushFloralEnhanced';
import { BloomCrystal3D } from './components/demos/BloomCrystal3D';
import { BloomCrystal3DEnhanced } from './components/demos/BloomCrystal3DEnhanced';
import { SoftFadeFloral } from './components/demos/SoftFadeFloral';
import { MinimalSlideClean } from './components/demos/MinimalSlideClean';
import { LuxuryGoldCinematic } from './components/demos/LuxuryGoldCinematic';
import { LuxuryGoldCinematicEnhanced } from './components/demos/LuxuryGoldCinematicEnhanced';
import { ArtDecoRoyal } from './components/demos/ArtDecoRoyal';
import { ArtDecoRoyalEnhanced } from './components/demos/ArtDecoRoyalEnhanced';
import { VintageGrain } from './components/demos/VintageGrain';
import { GreenElegance } from './components/demos/GreenElegance';
import { CinematicLoveStory } from './components/demos/CinematicLoveStory';
import { CinematicLoveStoryEnhanced } from './components/demos/CinematicLoveStoryEnhanced';
import { MinimalElegant } from './components/demos/MinimalElegant';
import { MinimalElegantEnhanced } from './components/demos/MinimalElegantEnhanced';
import { VietnameseTraditional } from './components/demos/VietnameseTraditional';
import { VietnameseTraditionalEnhanced } from './components/demos/VietnameseTraditionalEnhanced';
import DemoThiep219k_Thiep1 from './Demo/Demo219k/Demo1/App';
import { TemplatesPage } from './components/TemplatesPage';

// Browser history-based router
export function Router() {
  const [currentRoute, setCurrentRoute] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Route mapping
  const routes: Record<string, React.ReactNode> = {
    '/': <HomePage />,
    '/templates': <TemplatesPage />,
    '/demo/classic-minimalist': <ClassicMinimalist />,
    '/demo/blush-floral': <BlushFloral />,
    '/demo/soft-fade-floral': <SoftFadeFloral />,
    '/demo/minimal-slide-clean': <MinimalSlideClean />,
    '/demo/modern-dark-blue': <BlushFloralEnhanced />,
    '/demo/luxury-gold-frame': <LuxuryGoldCinematic />,
    '/demo/luxury-gold-cinematic': <LuxuryGoldCinematicEnhanced />,
    '/demo/vintage-film': <CinematicLoveStoryEnhanced />,
    '/demo/romantic-watercolor': <VietnameseTraditionalEnhanced /> ,
    '/demo/bloom-crystal-3d': <BloomCrystal3DEnhanced />,
    '/demo/tropical-sunset': <DemoThiep219k_Thiep1 />,
    '/demo/art-deco-royal': <ArtDecoRoyalEnhanced />,
    '/demo/vintage-grain': <VintageGrain />,
    '/demo/green-elegance': <GreenElegance />,
    '/demo/cinematic-love-story': <CinematicLoveStory />,
    '/demo/minimal-elegant': <MinimalElegantEnhanced />,
    '/demo/vietnamese-traditional': <VietnameseTraditional />,
    '/demo/bloom-crystal-3d-basic': <BloomCrystal3D />,
    '/demo/art-deco-royal-basic': <ArtDecoRoyal />,
    '/demo/minimal-elegant-basic': <MinimalElegant />,
  };

  return <>{routes[currentRoute] || <HomePage />}</>;
}

// Navigation helper function
export function navigateTo(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}