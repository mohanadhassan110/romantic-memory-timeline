import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export const AmbientAudio: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Clean up on unmount
  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, []);

  const togglePlayback = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Audio playback failed:', error);
        setIsPlaying(false);
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Hidden audio element pointing to the user's music file */}
      <audio
        ref={audioRef}
        src="/music.mp3"
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      <button
        onClick={togglePlayback}
        className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border ${
          isPlaying
            ? 'bg-[#C2415C]/10 border-[#C2415C]/30 text-[#8B3A4A] shadow-sm'
            : 'bg-white/60 border-[#F4DBDE] text-[#786C6E] hover:bg-white hover:text-[#8B3A4A]'
        }`}
        title={isPlaying ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى'}
        aria-label="تبديل الموسيقى"
      >
        <span className="relative flex h-3.5 w-3.5 items-center justify-center">
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

        <span className="hidden sm:inline">
          {isPlaying ? 'الموسيقى تعمل' : 'تشغيل الموسيقى'}
        </span>

        {isPlaying ? (
          <Volume2 className="w-3.5 h-3.5 text-[#C2415C]" />
        ) : (
          <VolumeX className="w-3.5 h-3.5 text-[#786C6E]/60 group-hover:text-[#786C6E]" />
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
          className="w-16 h-1 bg-[#F4DBDE] accent-[#C2415C] rounded-lg cursor-pointer hidden md:inline-block"
          title={`مستوى الصوت: ${Math.round(volume * 100)}%`}
        />
      )}
    </div>
  );
};
