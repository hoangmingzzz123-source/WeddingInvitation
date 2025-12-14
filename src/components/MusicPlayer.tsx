import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Volume2, VolumeX, Settings, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import Le_duong from '../asset/Le_duong.mp3';

interface MusicPlayerProps {
  autoPlay?: boolean;
  showVolumeControl?: boolean; // For 199k package
  allowCustomMusic?: boolean; // For 159k and 199k packages
}

export function MusicPlayer({ 
  autoPlay = true, 
  showVolumeControl = false,
  allowCustomMusic = false 
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showVolume, setShowVolume] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [customMusicUrl, setCustomMusicUrl] = useState('');
  const [tempMusicUrl, setTempMusicUrl] = useState('');
  const [isYouTube, setIsYouTube] = useState(false);
  const [youtubeEmbedId, setYoutubeEmbedId] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Default wedding music
  const defaultMusicUrl = Le_duong;

  // Helper function to extract YouTube video ID
  const getYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  // Check if URL is a Spotify link
  const isSpotifyUrl = (url: string): boolean => {
    return url.includes('spotify.com');
  };

  // Convert Spotify URL to embed format
  const getSpotifyEmbedUrl = (url: string): string | null => {
    const trackMatch = url.match(/track\/([a-zA-Z0-9]+)/);
    if (trackMatch) {
      return `https://open.spotify.com/embed/track/${trackMatch[1]}`;
    }
    return null;
  };

  useEffect(() => {
    const musicUrl = customMusicUrl || defaultMusicUrl;
    
    // Check if it's a YouTube link
    const ytId = getYouTubeId(musicUrl);
    if (ytId && customMusicUrl) {
      setIsYouTube(true);
      setYoutubeEmbedId(ytId);
      return;
    }

    // For regular audio files
    setIsYouTube(false);
    
    // Create audio element
    audioRef.current = new Audio();
    audioRef.current.src = musicUrl;
    audioRef.current.loop = true;
    audioRef.current.volume = volume;

    // Try to autoplay if allowed
    if (autoPlay) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          console.log('Autoplay blocked');
        });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [customMusicUrl]);

  const togglePlay = () => {
    // For YouTube player
    if (isYouTube && iframeRef.current) {
      const iframe = iframeRef.current;
      if (isPlaying) {
        iframe.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        setIsPlaying(false);
      } else {
        iframe.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        setIsPlaying(true);
      }
      return;
    }

    // For regular audio
    if (!audioRef.current) return;

    if (isPlaying) {
      // Fade out
      const fadeOut = setInterval(() => {
        if (audioRef.current && audioRef.current.volume > 0.05) {
          audioRef.current.volume -= 0.05;
        } else {
          clearInterval(fadeOut);
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.volume = volume;
          }
        }
      }, 30);
      setIsPlaying(false);
    } else {
      // Fade in
      audioRef.current.volume = 0;
      audioRef.current.play();
      const fadeIn = setInterval(() => {
        if (audioRef.current && audioRef.current.volume < volume - 0.05) {
          audioRef.current.volume += 0.05;
        } else {
          clearInterval(fadeIn);
          if (audioRef.current) {
            audioRef.current.volume = volume;
          }
        }
      }, 30);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleApplyCustomMusic = () => {
    if (tempMusicUrl) {
      setCustomMusicUrl(tempMusicUrl);
      setShowSettings(false);
      setIsPlaying(false);
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50">
      <div className="flex items-center gap-2">
        {/* Volume Control */}
        {showVolumeControl && (
          <AnimatePresence>
            {showVolume && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-lg"
              >
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume * 100}
                  onChange={(e) => handleVolumeChange(Number(e.target.value) / 100)}
                  className="w-24 accent-[#C29B43]"
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Settings Button - For Custom Music */}
        {allowCustomMusic && (
          <motion.button
            onClick={() => setShowSettings(!showSettings)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
            style={{
              border: '2px solid rgba(194, 155, 67, 0.3)',
            }}
          >
            <Settings className="w-5 h-5 text-[#C29B43]" />
          </motion.button>
        )}

        {/* Music Button */}
        <motion.button
          onClick={togglePlay}
          onMouseEnter={() => showVolumeControl && setShowVolume(true)}
          onMouseLeave={() => setShowVolume(false)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
          style={{
            border: '2px solid rgba(194, 155, 67, 0.3)',
          }}
        >
          <motion.div
            animate={{
              rotate: isPlaying ? 360 : 0,
            }}
            transition={{
              duration: 6,
              repeat: isPlaying ? Infinity : 0,
              ease: "linear",
            }}
          >
            {isPlaying ? (
              <Volume2 className="w-5 h-5 text-[#C29B43]" />
            ) : (
              <VolumeX className="w-5 h-5 text-[#666]" />
            )}
          </motion.div>
        </motion.button>

        {/* Visualizer */}
        {showVolumeControl && isPlaying && (
          <div className="flex items-center gap-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-[#C29B43] rounded-full"
                animate={{
                  height: [8, 16, 8],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Custom Music Settings Dialog */}
      <AnimatePresence>
        {showSettings && allowCustomMusic && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="absolute top-16 right-0 w-80 bg-white rounded-2xl shadow-2xl p-6 border border-[#C29B43]/20"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg text-[#C29B43]" style={{ fontFamily: '"Playfair Display", serif' }}>
                Chọn nhạc riêng
              </h3>
              <button onClick={() => setShowSettings(false)}>
                <X className="w-5 h-5 text-[#666]" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-[#666] mb-2 block">
                  Dán link nhạc
                </label>
                <Input
                  type="text"
                  placeholder="YouTube, Spotify, hoặc link MP3"
                  value={tempMusicUrl}
                  onChange={(e) => setTempMusicUrl(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-[#999] mt-2">
                  💡 Hỗ trợ: YouTube, Spotify, MP3, Google Drive, Dropbox
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={handleApplyCustomMusic}
                  className="w-full bg-[#C29B43] hover:bg-[#A88434] text-white"
                  disabled={!tempMusicUrl}
                >
                  Áp dụng
                </Button>
                <Button
                  onClick={() => {
                    setTempMusicUrl('');
                    setCustomMusicUrl('');
                    setShowSettings(false);
                  }}
                  variant="outline"
                  className="w-full border-[#C29B43] text-[#C29B43]"
                >
                  Dùng nhạc mặc định
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden YouTube Player */}
      {isYouTube && youtubeEmbedId && (
        <iframe
          ref={iframeRef}
          style={{ display: 'none' }}
          src={`https://www.youtube.com/embed/${youtubeEmbedId}?enablejsapi=1&autoplay=${autoPlay ? 1 : 0}&loop=1&playlist=${youtubeEmbedId}`}
          allow="autoplay; encrypted-media"
        />
      )}
    </div>
  );
}