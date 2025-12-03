import { useState, useEffect } from 'react';
import { Cover } from './components/Cover';
import { Welcome } from './components/Welcome';
import { LoveStory } from './components/LoveStory';
import { WeddingInfo } from './components/WeddingInfo';
import { Gallery } from './components/Gallery';
import { RSVP } from './components/RSVP';
import { Footer } from './components/Footer';
import './styles/globals.css';

export default function DemoThiep219k_Thiep1() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-rose-50">
      {showContent && (
        <>
          <Cover />
          <Welcome />
          <LoveStory />
          <WeddingInfo />
          <Gallery />
          <RSVP />
          <Footer />
        </>
      )}
    </div>
  );
}
