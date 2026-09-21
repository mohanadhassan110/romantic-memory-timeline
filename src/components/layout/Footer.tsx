import React from 'react';
import { Heart, Key, ArrowUp, Radio } from 'lucide-react';
import type { CoupleSettings } from '../../types/memory';

interface FooterProps {
  settings: CoupleSettings;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenAdmin,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full mt-20 border-t border-[#F4DBDE]/70 bg-[#FAF7F2]/90 backdrop-blur-sm py-12 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-6">
        {/* Heart Icon & Message */}
        <div className="flex items-center gap-2 text-sm text-[#786C6E]">
          <span>صُنع بكل الحب والوفاء</span>
          <Heart className="w-4 h-4 text-[#C2415C] fill-[#C2415C] animate-pulse" />
          <span>
            من <strong className="text-[#272021] font-semibold">{settings.partner1}</strong> إلى{' '}
            <strong className="text-[#272021] font-semibold">{settings.partner2}</strong>
          </span>
        </div>

        {/* NFC Card Meta Stamp */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/75 border border-[#F4DBDE] text-xs text-[#786C6E]">
          <Radio className="w-3.5 h-3.5 text-[#C2415C]" />
          <span>بطاقة NFC الذكية متصلة • مرري هاتفكِ في أي وقت لتسترجعي ذكرياتنا</span>
        </div>

        {/* Action Row */}
        <div className="flex items-center gap-4 text-xs">
          {/* Scroll to Top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-[#786C6E] hover:text-[#272021] transition-colors py-1 px-2.5 rounded-md"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>العودة للأعلى</span>
          </button>

          <span className="text-[#F4DBDE]">|</span>

          {/* Discreet Admin Link */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 text-[#786C6E]/60 hover:text-[#8C2D3E] transition-colors py-1 px-2.5 rounded-md group"
            title="لوحة التحكم: إدارة الذكريات"
          >
            <Key className="w-3.5 h-3.5 text-[#786C6E]/50 group-hover:text-[#C2415C] transition-colors" />
            <span className="group-hover:underline">المفتاح السري للإدارة</span>
          </button>
        </div>

        <p className="text-xs text-[#786C6E]/70 font-light">
          «لحظاتنا معاً» — هدية رقمية مخصصة ومخلدة للأبد.
        </p>
      </div>
    </footer>
  );
};
