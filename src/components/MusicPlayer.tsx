import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Volume2, VolumeX, Settings, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { defaultWeddingMusicUrl, isSupportedWeddingMusicUrl, weddingMusicTracks } from '../data/weddingMusic';

interface MusicPlayerProps {
  autoPlay?: boolean;
  showVolumeControl?: boolean; // For 199k package
  allowCustomMusic?: boolean; // For 159k and 199k packages
  musicUrl?: string;
}

export function MusicPlayer({ 
  autoPlay = true, 
  showVolumeControl = false,
  allowCustomMusic = false,
  musicUrl: selectedMusicUrl,
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showVolume, setShowVolume] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [customMusicUrl, setCustomMusicUrl] = useState('');
  const [tempMusicUrl, setTempMusicUrl] = useState('');
  const [customMusicError, setCustomMusicError] = useState('');
  const [playbackMessage, setPlaybackMessage] = useState('');
  const [randomMusic, setRandomMusic] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Random select music on mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * weddingMusicTracks.length);
    setRandomMusic(weddingMusicTracks[randomIndex].url);
  }, []);

  // Default wedding music
  const defaultMusicUrl = selectedMusicUrl?.trim() || randomMusic || defaultWeddingMusicUrl;

  useEffect(() => {
    audioRef.current?.pause();
    setCustomMusicUrl('');
    setIsPlaying(false);
    setPlaybackMessage('');
  }, [selectedMusicUrl]);

  useEffect(() => {
    if (!defaultMusicUrl) return; // Wait for random music to be selected

    const musicUrl = customMusicUrl || defaultMusicUrl;
    const isSystemTrack = weddingMusicTracks.some((track) => track.url === musicUrl);
    if (!isSystemTrack && !isSupportedWeddingMusicUrl(musicUrl)) {
      audioRef.current?.pause();
      audioRef.current = null;
      setIsPlaying(false);
      setPlaybackMessage('Chỉ hỗ trợ nhạc có sẵn trong hệ thống hoặc link trực tiếp đến file MP3 HTTPS.');
      return;
    }

    setPlaybackMessage('');
    
    const audio = new Audio(musicUrl);
    audioRef.current = audio;
    audio.loop = true;
    audio.volume = volume;

    if (autoPlay) {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
        });
    }

    return () => {
      audio.pause();
      if (audioRef.current === audio) audioRef.current = null;
    };
  }, [customMusicUrl, defaultMusicUrl]);

  const togglePlay = () => {
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
      void audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setPlaybackMessage('');
        })
        .catch((error: unknown) => {
          setIsPlaying(false);
          setPlaybackMessage(error instanceof Error ? `Không phát được nhạc: ${error.message}` : 'Không phát được nhạc đã chọn.');
        });
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
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleApplyCustomMusic = () => {
    const url = tempMusicUrl.trim();
    if (!isSupportedWeddingMusicUrl(url)) {
      setCustomMusicError('Dùng link trực tiếp đến file MP3 qua HTTPS.');
      return;
    }
    if (url) {
      setCustomMusicUrl(url);
      setCustomMusicError('');
      setShowSettings(false);
      setIsPlaying(false);
    }
  };

  return (
    <div className="demo-music-control fixed top-20 right-4 z-50">
      <div className="flex items-center gap-2">
        {playbackMessage && <p role="status" className="absolute right-0 top-14 w-64 rounded-lg bg-white p-3 text-xs text-[#8b3e35] shadow-lg">{playbackMessage}</p>}
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
                  placeholder="Link trực tiếp đến file MP3 HTTPS"
                  value={tempMusicUrl}
                  onChange={(e) => { setTempMusicUrl(e.target.value); setCustomMusicError(''); }}
                  className="w-full"
                />
                <p className="text-xs text-[#999] mt-2">
                  💡 Hỗ trợ link trực tiếp đến file MP3 qua HTTPS
                </p>
                {customMusicError && <p className="text-xs text-red-600" role="alert">{customMusicError}</p>}
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

    </div>
  );
}
