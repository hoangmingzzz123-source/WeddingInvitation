import React, { useEffect, useState } from 'react';
import { Navigation } from './Navigation';
import { HeroSection } from './HeroSection';
import { PricingPackages } from './PricingPackages';
import { TemplateGallery } from './TemplateGallery';
import { Features } from './Features';
import { VideoSection } from './VideoSection';
import { Testimonials } from './Testimonials';
import { FinalCTA } from './FinalCTA';
import { FloatingPetals } from './FloatingPetals';
import { WhyChooseUs } from './WhyChooseUs';
import { EnhancedFooter } from './EnhancedFooter';

export function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#FAF7F2]">
      <FloatingPetals />
      
      <Navigation />
      <HeroSection />
      <PricingPackages />
      <TemplateGallery />
      <WhyChooseUs />
      <Features />
      <VideoSection />
      <Testimonials />
      <FinalCTA />
      <EnhancedFooter />
    </div>
  );
}