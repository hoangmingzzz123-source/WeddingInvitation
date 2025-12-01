import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from './ui/button';

interface MapSectionProps {
  location: string;
  address: string;
  mapUrl?: string;
  premium?: boolean; // For 399k package with enhanced features
}

export function MapSection({ 
  location, 
  address, 
  mapUrl = 'https://maps.google.com',
  premium = false 
}: MapSectionProps) {
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl text-[#C29B43] text-center mb-8"
          style={{ fontFamily: '"Playfair Display", serif' }}
        >
          Bản Đồ Địa Điểm Tổ Chức
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl shadow-2xl"
          style={{
            border: '2px solid #C29B43',
            background: 'linear-gradient(135deg, rgba(194, 155, 67, 0.05) 0%, rgba(255, 255, 255, 0.05) 100%)',
          }}
        >
          {/* Map Type Toggle - Premium Only */}
          {premium && (
            <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-lg">
              <button
                onClick={() => setMapType('roadmap')}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  mapType === 'roadmap' 
                    ? 'bg-[#C29B43] text-white' 
                    : 'text-[#666] hover:bg-gray-100'
                }`}
              >
                Map
              </button>
              <button
                onClick={() => setMapType('satellite')}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  mapType === 'satellite' 
                    ? 'bg-[#C29B43] text-white' 
                    : 'text-[#666] hover:bg-gray-100'
                }`}
              >
                Satellite
              </button>
            </div>
          )}

          {/* Map Container */}
          <div className="relative aspect-video bg-gradient-to-br from-[#FAF7F2] to-white">
            {/* Placeholder map - In real app, use Google Maps iframe */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Animated Pin */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  delay: 0.5,
                  duration: 0.6,
                  repeat: 3,
                  repeatType: "reverse"
                }}
                className="relative"
              >
                <MapPin className="w-16 h-16 text-[#C29B43]" fill="#C29B43" />
                
                {/* Pulsing glow for premium */}
                {premium && (
                  <motion.div
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 bg-[#C29B43] rounded-full blur-xl"
                  />
                )}
              </motion.div>
            </div>

            {/* Overlay with location info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="text-white"
              >
                <h3 className="text-2xl mb-2">{location}</h3>
                <p className="text-sm opacity-90">{address}</p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-6"
        >
          <Button
            onClick={() => window.open(mapUrl, '_blank')}
            className="bg-[#C29B43] hover:bg-[#A88434] text-white px-8 py-3 rounded-full shadow-lg"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Mở Google Maps
          </Button>

          {premium && (
            <Button
              onClick={() => {
                // Open Apple Maps on iOS, Google Maps on others
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                const url = isIOS 
                  ? 'maps://?' 
                  : mapUrl;
                window.open(url, '_blank');
              }}
              variant="outline"
              className="border-2 border-[#C29B43] text-[#C29B43] hover:bg-[#C29B43] hover:text-white px-8 py-3 rounded-full"
            >
              Mở Apple Maps
            </Button>
          )}
        </motion.div>
      </div>
    </section>
  );
}
