import React, { useEffect, useState } from 'react';
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToContact = () => {
    const footer = document.querySelector('.finalCTA-content');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  };

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

      {/* Floating Contact Button */}
      <button
        onClick={scrollToContact}
        className="fixed bottom-8 right-8 z-50 w-24 h-24 bg-gradient-to-br from-[#FFD700] via-[#FFA500] to-[#FF8C00] hover:from-[#FFED4E] hover:via-[#FFD700] hover:to-[#FFA500] text-[#8B4513] rounded-full shadow-[0_10px_40px_rgba(255,215,0,0.8)] hover:shadow-[0_15px_50px_rgba(255,215,0,1)] flex items-center justify-center transition-all duration-300 hover:scale-110 group ring-4 ring-[#FFED4E] animate-pulse hover:animate-none"
        aria-label="Liên hệ"
      >
        <MessageCircle className="w-10 h-10 group-hover:animate-bounce drop-shadow-lg" strokeWidth={3} />
        <span className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FF8C00] text-[#8B4513] px-6 py-3 rounded-full text-base font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-2xl border-2 border-[#FFED4E] group-hover:-translate-y-2">
          Liên hệ ngay
        </span>
      </button>
    </div>
  );
}