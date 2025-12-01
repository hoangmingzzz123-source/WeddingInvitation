import React, { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { ClassicMinimalist } from './components/demos/ClassicMinimalist';
import { BlushFloral } from './components/demos/BlushFloral';
import { BloomCrystal3D } from './components/demos/BloomCrystal3D';
import { SoftFadeFloral } from './components/demos/SoftFadeFloral';
import { MinimalSlideClean } from './components/demos/MinimalSlideClean';
import { LuxuryGoldCinematic } from './components/demos/LuxuryGoldCinematic';
import { ArtDecoRoyal } from './components/demos/ArtDecoRoyal';
import { VintageGrain } from './components/demos/VintageGrain';
import { GreenElegance } from './components/demos/GreenElegance';

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
    '#/demo/modern-dark-blue': <MinimalSlideClean />,
    '#/demo/luxury-gold-frame': <LuxuryGoldCinematic />,
    '#/demo/luxury-gold-cinematic': <LuxuryGoldCinematic />,
    '#/demo/vintage-film': <VintageGrain />,
    '#/demo/romantic-watercolor': <BlushFloral />,
    '#/demo/bloom-crystal-3d': <BloomCrystal3D />,
    '#/demo/tropical-sunset': <BloomCrystal3D />,
    '#/demo/art-deco-royal': <ArtDecoRoyal />,
    '#/demo/vintage-grain': <VintageGrain />,
    '#/demo/green-elegance': <GreenElegance />,
  };

  return <>{routes[currentRoute] || <HomePage />}</>;
}