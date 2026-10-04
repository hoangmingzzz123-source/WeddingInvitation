import React from 'react';
import { MessageCircle } from 'lucide-react';
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
  const scrollToContact = () => {
    const footer = document.querySelector('.finalCTA-content');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  };

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

      {/* Floating Contact Button */}
      <button
        type="button"
        onClick={scrollToContact}
        className="floating-contact"
        aria-label="Mở khu vực liên hệ tư vấn"
      >
        <MessageCircle aria-hidden="true" />
        <span>Tư vấn</span>
      </button>
    </div>
  );
}
