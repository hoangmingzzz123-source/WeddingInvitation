import { OpeningSection } from './components/OpeningSection';
import { WeddingDateSection } from './components/WeddingDateSection';
import { MapSection } from './components/MapSection';
import { DressCodeSection } from './components/DressCodeSection';
import { QRSection } from './components/QRSection';
import { AlbumSection } from './components/AlbumSection';
import { VideoSection } from './components/VideoSection';
import { WishesSection } from './components/WishesSection';
import { RSVPSection } from './components/RSVPSection';
import { MusicPlayer } from './components/MusicPlayer';
import { Footer } from './components/Footer';
import { FloatingParticles } from './components/FloatingParticles';
import './styles/globalsTraditional.css';
import './styles/indexTraditional.css';

export default function DemoThiep219k_ThiepTraditional() {
  return (
    <div className="demo-traditional-wrapper min-h-screen relative">
      {/* Floating particles background */}
      <FloatingParticles />

      {/* Opening / Cover */}
      <OpeningSection />

      {/* Wedding Date Info */}
      <WeddingDateSection />

      {/* Venue Map */}
      <MapSection />

      {/* Dress Code */}
      <DressCodeSection />

      {/* QR Hub */}
      <QRSection />

      {/* Photo Album */}
      <AlbumSection />

      {/* Video */}
      <VideoSection />

      {/* Wishes */}
      <WishesSection />

      {/* RSVP */}
      <RSVPSection />

      {/* Footer */}
      <Footer />

      {/* Music Player */}
      <MusicPlayer />
    </div>
  );
}