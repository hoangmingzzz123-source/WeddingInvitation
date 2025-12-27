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

// Simple hash-based router
export function Router() {
  const [currentRoute, setCurrentRoute] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(window.location.hash || '#/');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Route mapping
  const routes: Record<string, React.ReactNode> = {
    '#/': <HomePage />,
    '#/demo/classic-minimalist': <ClassicMinimalist />,
    '#/demo/blush-floral': <BlushFloral />,
    '#/demo/soft-fade-floral': <SoftFadeFloral />,
    '#/demo/minimal-slide-clean': <MinimalSlideClean />,
    '#/demo/modern-dark-blue': <BlushFloralEnhanced />,
    '#/demo/luxury-gold-frame': <LuxuryGoldCinematic />,
    '#/demo/luxury-gold-cinematic': <LuxuryGoldCinematicEnhanced />,
    '#/demo/vintage-film': <CinematicLoveStoryEnhanced />,
    '#/demo/romantic-watercolor': <VietnameseTraditionalEnhanced /> ,
    '#/demo/bloom-crystal-3d': <BloomCrystal3DEnhanced />,
    // '#/demo/bloom-crystal-3d-enhanced': <BloomCrystal3DEnhanced />,
    '#/demo/tropical-sunset': <DemoThiep219k_Thiep1 />,
    '#/demo/art-deco-royal': <ArtDecoRoyalEnhanced />,
    // '#/demo/art-deco-royal-enhanced': <ArtDecoRoyalEnhanced />,
    '#/demo/vintage-grain': <VintageGrain />,
    '#/demo/green-elegance': <GreenElegance />,
    '#/demo/cinematic-love-story': <CinematicLoveStory />,
    // '#/demo/cinematic-love-story-enhanced': <CinematicLoveStoryEnhanced />,
    '#/demo/minimal-elegant': <MinimalElegantEnhanced />,
    '#/demo/vietnamese-traditional': <VietnameseTraditional />,
    // '#/demo/vietnamese-traditional-enhanced': <VietnameseTraditionalEnhanced />,
  };

  return <>{routes[currentRoute] || <HomePage />}</>;
}