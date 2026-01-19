import React, { useEffect, useState } from 'react';
import { OpeningScene } from './components/OpeningScene';
import { HeroSection } from './components/HeroSection';
import { NamesSection } from './components/NamesSection';
import { InvitationMessage } from './components/InvitationMessage';
import { WeddingDetailsSection } from './components/WeddingDetailsSection';
import { MapSection } from './components/MapSection';
import { QRHubSection } from './components/QRHubSection';
import { PhotoAlbumSection } from './components/PhotoAlbumSection';
import { VideoSection } from './components/VideoSection';
import { GuestbookSection } from './components/GuestbookSection';
import { RSVPSection } from './components/RSVPSection';
import { EndingScene } from './components/EndingScene';
import { FilmGrain } from './components/FilmGrain';
import { MusicToggle } from './components/MusicToggle';
import './styles/globalsCinema.css';
import './styles/indexCinema.css';

export default function DemoThiep219k_ThiepCinema() {
  const [showContent, setShowContent] = useState(false);
  const [showOpening, setShowOpening] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
      setShowOpening(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="demo-cinema-wrapper relative min-h-screen bg-[#1C1C1C] overflow-x-hidden">
      <FilmGrain />
      <MusicToggle />
      
      {showOpening && <OpeningScene onComplete={() => setShowContent(true)} />}
      
      {showContent && (
        <div className="relative">
          <HeroSection />
          <NamesSection />
          <InvitationMessage />
          <WeddingDetailsSection />
          <MapSection />
          <QRHubSection />
          <PhotoAlbumSection />
          <VideoSection />
          <GuestbookSection />
          <RSVPSection />
          <EndingScene />
        </div>
      )}
    </div>
  );
}
