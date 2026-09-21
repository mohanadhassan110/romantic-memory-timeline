import React from 'react';
import { Heart, Mail, Shield } from 'lucide-react';
import { AmbientAudio } from '../audio/AmbientAudio';
import type { CoupleSettings } from '../../types/memory';

interface NavbarProps {
  settings: CoupleSettings;
  onOpenLetter: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onOpenLetter,
  onOpenAdmin,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-all duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Couple Monogram */}
        <div
          className="flex items-center gap-2.5 group cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#C2415C] to-[#E28290] flex items-center justify-center shadow-sm text-white transition-transform group-hover:scale-105 duration-300">
            <Heart className="w-4 h-4 fill-white" />
          </div>
          <div className="flex flex-col text-start">
            <span className="font-bold font-arabic text-sm sm:text-base tracking-wide text-[#272021] flex items-center gap-1.5">
              <span>{settings.partner1}</span>
              <span className="text-[#C2415C] text-xs font-normal">و</span>
              <span>{settings.partner2}</span>
            </span>
            <span className="text-[10px] text-[#786C6E] tracking-wider font-medium">
              هدية رقمية مخلدة
            </span>
          </div>
        </div>

        {/* Right / Left Actions (Logical End) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Ambient Music */}
          <AmbientAudio />

          {/* Secret Love Letter Button */}
          <button
            onClick={onOpenLetter}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#FFFDF9] border border-[#F4DBDE] text-[#7C2335] shadow-xs hover:bg-[#FBECEE] hover:border-[#E28290] transition-all duration-300"
            title="قراءة رسالة الحب"
          >
            <Mail className="w-3.5 h-3.5 text-[#C2415C]" />
            <span className="hidden sm:inline">رسالة حب</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E28290] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C2415C]"></span>
            </span>
          </button>

          {/* Admin shortcut button in navbar */}
          <button
            onClick={onOpenAdmin}
            className="p-2 rounded-full text-[#786C6E]/60 hover:text-[#7C2335] hover:bg-[#FBECEE]/60 transition-colors"
            title="إدارة الذكريات (لوحة التحكم)"
            aria-label="إعدادات الإدارة"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
