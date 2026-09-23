import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export const AmbientAudio: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasInteractedRef = useRef(false);

  // Sync volume safely (iOS Safari throws or ignores setting volume via JS)
  useEffect(() => {
    if (audioRef.current) {
      try {
        audioRef.current.volume = volume;
      } catch {
        // Ignored on mobile devices where volume is hardware-only
      }
    }
  }, [volume]);

  // Mobile Autoplay on first touch/click anywhere on the screen
  useEffect(() => {
    const handleFirstTouch = () => {
      if (hasInteractedRef.current) return;
      hasInteractedRef.current = true;

      const audio = audioRef.current;
      if (audio && audio.paused) {
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Browser autoplay restrictions still in effect, user can click the toggle button
          });
      }

      cleanupListeners();
    };

    const cleanupListeners = () => {
      window.removeEventListener('touchstart', handleFirstTouch);
      window.removeEventListener('touchend', handleFirstTouch);
      window.removeEventListener('click', handleFirstTouch);
      window.removeEventListener('scroll', handleFirstTouch);
    };

    window.addEventListener('touchstart', handleFirstTouch, { passive: true });
    window.addEventListener('touchend', handleFirstTouch, { passive: true });
    window.addEventListener('click', handleFirstTouch, { passive: true });
    window.addEventListener('scroll', handleFirstTouch, { passive: true });

    return () => {
      cleanupListeners();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Direct synchronous user gesture playback (required for iOS Safari & Android Chrome)
  const togglePlayback = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    hasInteractedRef.current = true;

    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      setIsPlaying(false);
    } else {
      // Must call .play() synchronously in the event handler for iOS Safari
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.warn('Playback attempt failed, reloading audio:', err);
            try {
              audio.load();
              audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
            } catch {
              setIsPlaying(false);
            }
          });
      }
    }
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {/* HTML5 Audio optimized for Mobile (iOS Safari & Android) */}
      <audio
        ref={audioRef}
        loop
        playsInline
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      >
        <source src="/music.mp3" type="audio/mpeg" />
      </audio>

      <button
        onClick={togglePlayback}
        onTouchEnd={(e) => {
          // Prevent double firing on touch devices while ensuring instant responsiveness
          togglePlayback(e);
          e.preventDefault();
        }}
        className={`group relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border select-none cursor-pointer active:scale-95 touch-manipulation min-h-[32px] ${
          isPlaying
            ? 'bg-[#C2415C]/10 border-[#C2415C]/40 text-[#8B3A4A] shadow-xs'
            : 'bg-white/80 border-[#F4DBDE] text-[#786C6E] hover:bg-white hover:text-[#8B3A4A]'
        }`}
        title={isPlaying ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى'}
        aria-label="تبديل الموسيقى"
      >
        <span className="relative flex h-3.5 w-3.5 items-center justify-center shrink-0">
          {isPlaying ? (
            <span className="flex h-full w-full items-center justify-center space-x-0.5 rtl:space-x-reverse">
              <span
                className="w-0.5 h-3 bg-[#C2415C] rounded-full animate-bounce"
                style={{ animationDuration: '0.6s' }}
              ></span>
              <span
                className="w-0.5 h-2 bg-[#C2415C] rounded-full animate-bounce"
                style={{ animationDuration: '0.9s', animationDelay: '0.15s' }}
              ></span>
              <span
                className="w-0.5 h-3.5 bg-[#C2415C] rounded-full animate-bounce"
                style={{ animationDuration: '0.7s', animationDelay: '0.3s' }}
              ></span>
            </span>
          ) : (
            <Music className="w-3.5 h-3.5 text-[#C2415C]" />
          )}
        </span>

        <span className="text-[11px] sm:text-xs">
          {isPlaying ? 'الموسيقى تعمل' : 'تشغيل الموسيقى'}
        </span>

        {isPlaying ? (
          <Volume2 className="w-3.5 h-3.5 text-[#C2415C] shrink-0" />
        ) : (
          <VolumeX className="w-3.5 h-3.5 text-[#786C6E]/60 group-hover:text-[#786C6E] shrink-0" />
        )}
      </button>

      {isPlaying && (
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-14 sm:w-16 h-1 bg-[#F4DBDE] accent-[#C2415C] rounded-lg cursor-pointer hidden md:inline-block"
          title={`مستوى الصوت: ${Math.round(volume * 100)}%`}
        />
      )}
    </div>
  );
};
