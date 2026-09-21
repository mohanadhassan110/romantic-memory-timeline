import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Calendar, ChevronDown, Mail } from 'lucide-react';
import type { CoupleSettings } from '../../types/memory';
import { useRelationshipTime } from '../../hooks/useRelationshipTime';

interface HeroProps {
  settings: CoupleSettings;
  onOpenLetter: () => void;
  onScrollToTimeline: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  onOpenLetter,
  onScrollToTimeline,
}) => {
  const time = useRelationshipTime(settings.anniversaryDate);

  const formattedAnniversary = new Date(settings.anniversaryDate).toLocaleDateString('ar-EG', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 px-4 overflow-hidden flex flex-col items-center text-center">
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[540px] h-[320px] sm:h-[540px] bg-gradient-to-tr from-[#FBECEE] via-[#F4ECE1] to-[#FDF4F5] rounded-full blur-3xl opacity-70 -z-10 pointer-events-none" />

      {/* Top Tag */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/85 border border-[#E28290]/30 text-[#8C2D3E] text-xs font-semibold tracking-wider mb-6 shadow-xs backdrop-blur-md"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span>كبسولة ذكرياتنا الرقمية</span>
      </motion.div>

      {/* Couple Names Monogram / Rings */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="relative flex items-center justify-center mb-6"
      >
        <div className="relative flex items-center -space-x-3 rtl:space-x-reverse">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#FAF7F2] to-[#FFFDF9] border-2 border-[#E28290] shadow-md flex items-center justify-center text-2xl sm:text-3xl font-bold font-amiri text-[#8C2D3E]">
            {settings.partner1.charAt(0)}
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#C2415C] to-[#E28290] border-2 border-white shadow-lg flex items-center justify-center text-white z-10">
            <Heart className="w-4 h-4 fill-white animate-pulse" />
          </div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#FAF7F2] to-[#FFFDF9] border-2 border-[#D4AF37] shadow-md flex items-center justify-center text-2xl sm:text-3xl font-bold font-amiri text-[#A8811E]">
            {settings.partner2.charAt(0)}
          </div>
        </div>
      </motion.div>

      {/* Main Title & Subtitle */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-4xl sm:text-6xl md:text-7xl font-bold font-arabic tracking-tight text-[#272021] max-w-3xl mb-4 leading-tight"
      >
        <bdi dir="auto" className="bidi-plain">{settings.heroTitle}</bdi>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="text-base sm:text-lg text-[#786C6E] max-w-xl mb-6 font-normal leading-relaxed"
      >
        <bdi dir="auto" className="bidi-plain">{settings.heroSubtitle}</bdi>
      </motion.p>

      {/* Romantic Quote Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="relative px-6 py-3.5 rounded-2xl bg-white/65 border border-[#F4DBDE] max-w-lg mb-10 shadow-xs backdrop-blur-sm"
      >
        <p className="font-amiri text-lg sm:text-xl text-[#8C2D3E] leading-relaxed">
          <bdi dir="auto">{settings.romanticQuote}</bdi>
        </p>
        {settings.quoteAuthor && (
          <span className="text-xs text-[#A8811E] font-semibold block mt-1 tracking-wider">
            — {settings.quoteAuthor}
          </span>
        )}
      </motion.div>

      {/* Live Relationship Counter Ticker */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="w-full max-w-2xl px-2 mb-10"
      >
        <div className="glass-card rounded-3xl p-5 sm:p-7 shadow-lg border border-[#E28290]/30 relative overflow-hidden">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider text-[#8C2D3E] mb-4">
            <Calendar className="w-3.5 h-3.5 text-[#C2415C]" />
            <span>رحلتنا معاً يوماً بيوم</span>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
            {/* Days */}
            <div className="bg-white/85 rounded-2xl p-2.5 sm:p-4 border border-[#F4DBDE]/70 shadow-xs">
              <div className="text-2xl sm:text-4xl md:text-5xl font-bold font-arabic text-[#8C2D3E]">
                {time.days.toLocaleString('ar-EG')}
              </div>
              <div className="text-xs text-[#786C6E] mt-1 font-medium">
                يوم
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white/85 rounded-2xl p-2.5 sm:p-4 border border-[#F4DBDE]/70 shadow-xs">
              <div className="text-2xl sm:text-4xl md:text-5xl font-bold font-arabic text-[#A8811E]">
                {String(time.hours).padStart(2, '0')}
              </div>
              <div className="text-xs text-[#786C6E] mt-1 font-medium">
                ساعة
              </div>
            </div>

            {/* Minutes */}
            <div className="bg-white/85 rounded-2xl p-2.5 sm:p-4 border border-[#F4DBDE]/70 shadow-xs">
              <div className="text-2xl sm:text-4xl md:text-5xl font-bold font-arabic text-[#C2415C]">
                {String(time.minutes).padStart(2, '0')}
              </div>
              <div className="text-xs text-[#786C6E] mt-1 font-medium">
                دقيقة
              </div>
            </div>

            {/* Seconds */}
            <div className="bg-white/85 rounded-2xl p-2.5 sm:p-4 border border-[#F4DBDE]/70 shadow-xs">
              <div className="text-2xl sm:text-4xl md:text-5xl font-bold font-arabic text-[#D97762]">
                {String(time.seconds).padStart(2, '0')}
              </div>
              <div className="text-xs text-[#786C6E] mt-1 font-medium">
                ثانية
              </div>
            </div>
          </div>

          <p className="text-xs text-[#786C6E] mt-4 font-normal">
            منذ أن أشرقت شمس حكايتنا في{' '}
            <span className="font-semibold text-[#272021]">{formattedAnniversary}</span>
          </p>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
      >
        <button
          onClick={onScrollToTimeline}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-[#C2415C] to-[#E28290] text-white font-medium text-sm shadow-md hover:shadow-lg hover:from-[#A82D45] hover:to-[#C2415C] transition-all duration-300 flex items-center gap-2 group"
        >
          <span>تصفح ذكرياتنا</span>
          <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
        </button>

        <button
          onClick={onOpenLetter}
          className="px-6 py-3 rounded-full bg-white/90 border border-[#E28290]/40 text-[#7C2335] font-medium text-sm shadow-xs hover:bg-[#FBECEE] hover:border-[#E28290] transition-all duration-300 flex items-center gap-2"
        >
          <Mail className="w-4 h-4 text-[#C2415C]" />
          <span>فتح رسالة الحب</span>
        </button>
      </motion.div>
    </section>
  );
};
