import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export const AmbientAudio: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const timerRef = useRef<number | null>(null);
  const isPlayingRef = useRef(false);

  // Pentatonic romantic notes in Hz (C4, D4, E4, G4, A4, C5, D5, E5, G5)
  const notes = [
    261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99,
  ];

  // Chords progression: Cmaj9 -> Am9 -> Fmaj7 -> Gsus4
  const chords = [
    [261.63, 329.63, 392.0, 493.88, 587.33], // Cmaj9
    [220.0, 261.63, 329.63, 392.0, 493.88],  // Am9
    [174.61, 261.63, 329.63, 349.23, 523.25],// Fmaj7
    [196.0, 293.66, 392.0, 440.0, 587.33]    // Gsus4
  ];

  const playChime = (freq: number, timeOffset = 0, duration = 2.4) => {
    if (!audioCtxRef.current || !gainNodeRef.current) return;
    const ctx = audioCtxRef.current;
    const startTime = ctx.currentTime + timeOffset;

    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    // Gentle warm tone using sine + subtle triangle overtone
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    // Filter to give soft vintage vinyl/rhodes warmth
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, startTime);

    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.exponentialRampToValueAtTime(0.22, startTime + 0.08); // soft attack
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration); // smooth decay

    osc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(gainNodeRef.current);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
  };

  const startAmbientLoop = () => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtxClass();
      const masterGain = audioCtxRef.current.createGain();
      masterGain.gain.setValueAtTime(volume * 0.5, audioCtxRef.current.currentTime);
      masterGain.connect(audioCtxRef.current.destination);
      gainNodeRef.current = masterGain;
    }

    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    isPlayingRef.current = true;
    let chordIndex = 0;

    const scheduleNextPhrase = () => {
      if (!isPlayingRef.current || !audioCtxRef.current) return;

      const currentChord = chords[chordIndex % chords.length];
      chordIndex++;

      // Arpeggiate current chord with gentle romantic spacing
      currentChord.forEach((freq, idx) => {
        const jitter = Math.random() * 0.1;
        playChime(freq, idx * 0.55 + jitter, 3.2);
      });

      // Also pick 1 gentle high harmonic twinkle
      const randomHigh = notes[Math.floor(Math.random() * notes.length)];
      playChime(randomHigh * 1.5, 1.8 + Math.random() * 0.8, 2.5);

      // Repeat next phrase in ~3.8 seconds
      timerRef.current = window.setTimeout(scheduleNextPhrase, 3600);
    };

    scheduleNextPhrase();
  };

  const stopAmbientLoop = () => {
    isPlayingRef.current = false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      stopAmbientLoop();
      setIsPlaying(false);
    } else {
      startAmbientLoop();
      setIsPlaying(true);
    }
  };

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume * 0.5, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAmbientLoop();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={togglePlayback}
        className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border ${
          isPlaying
            ? 'bg-[#C2415C]/10 border-[#C2415C]/30 text-[#8B3A4A] shadow-sm'
            : 'bg-white/60 border-[#F4DBDE] text-[#786C6E] hover:bg-white hover:text-[#8B3A4A]'
        }`}
        title={isPlaying ? 'إيقاف الموسيقى الهادئة' : 'تشغيل الموسيقى الهادئة'}
        aria-label="تبديل الموسيقى الهادئة"
      >
        <span className="relative flex h-3.5 w-3.5 items-center justify-center">
          {isPlaying ? (
            <span className="flex h-full w-full items-center justify-center space-x-0.5 rtl:space-x-reverse">
              <span className="w-0.5 h-3 bg-[#C2415C] rounded-full animate-bounce" style={{ animationDuration: '0.6s' }}></span>
              <span className="w-0.5 h-2 bg-[#C2415C] rounded-full animate-bounce" style={{ animationDuration: '0.9s', animationDelay: '0.15s' }}></span>
              <span className="w-0.5 h-3.5 bg-[#C2415C] rounded-full animate-bounce" style={{ animationDuration: '0.7s', animationDelay: '0.3s' }}></span>
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
          title={`Volume: ${Math.round(volume * 100)}%`}
        />
      )}
    </div>
  );
};
