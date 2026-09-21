import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Heart, Maximize2, Tag } from 'lucide-react';
import type { Memory } from '../../types/memory';

interface TimelineItemProps {
  memory: Memory;
  index: number;
  isEven: boolean;
  onSelectPhoto: (memory: Memory) => void;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  memory,
  index,
  isEven,
  onSelectPhoto,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Format date using Arabic locale
  const formattedDate = new Date(memory.date).toLocaleDateString('ar-EG', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const shouldTruncate = memory.caption.length > 150;
  const displayedCaption = isExpanded || !shouldTruncate
    ? memory.caption
    : `${memory.caption.slice(0, 140)}...`;

  const categoryColors: Record<string, string> = {
    // Arabic Categories
    'محطة فارقة': 'bg-[#C2415C]/10 text-[#8C2D3E] border-[#C2415C]/20',
    'البدايات': 'bg-[#D4AF37]/15 text-[#8C6D1F] border-[#D4AF37]/30',
    'موعد غرامي': 'bg-[#E28290]/15 text-[#7C2335] border-[#E28290]/30',
    'رحلة': 'bg-[#D97762]/15 text-[#9C3822] border-[#D97762]/30',
    'احتفال': 'bg-[#8C2D3E]/10 text-[#8C2D3E] border-[#8C2D3E]/25',
    'لحظة خاصة': 'bg-rose-50 text-rose-800 border-rose-200',
    // Fallback English
    Milestone: 'bg-[#C2415C]/10 text-[#8C2D3E] border-[#C2415C]/20',
    First: 'bg-[#D4AF37]/15 text-[#8C6D1F] border-[#D4AF37]/30',
    Date: 'bg-[#E28290]/15 text-[#7C2335] border-[#E28290]/30',
    Trip: 'bg-[#D97762]/15 text-[#9C3822] border-[#D97762]/30',
    Celebration: 'bg-[#8C2D3E]/10 text-[#8C2D3E] border-[#8C2D3E]/25',
    Special: 'bg-rose-50 text-rose-800 border-rose-200',
  };

  return (
    <div className="relative mb-12 sm:mb-16 md:mb-20 last:mb-0">
      {/* Central Node Badge */}
      {/* Mobile: starts at physical right (start-4). Desktop: center (start-1/2) */}
      <div className="absolute start-4 md:start-1/2 -translate-x-1/2 rtl:translate-x-1/2 top-4 z-20 flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <span className="absolute w-10 h-10 rounded-full bg-[#E28290]/30 animate-ping opacity-60" />
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#C2415C] to-[#E28290] border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-bold font-arabic">
            {memory.milestoneNumber ?? index + 1}
          </div>
        </div>
      </div>

      {/* Content Layout Container */}
      <div
        className={`flex flex-col md:flex-row items-center w-full ${
          isEven ? 'md:flex-row-reverse' : ''
        }`}
      >
        {/* Card Side: On mobile, ps-12 pads away from the right vertical line */}
        <div
          className={`w-full ps-12 md:ps-0 md:w-[46%] ${
            isEven ? 'md:pe-8' : 'md:ps-8'
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card glass-card-hover rounded-3xl overflow-hidden border border-[#F4DBDE] transition-all duration-300 text-start"
          >
            {/* Memory Photo with Lightbox zoom button */}
            <div
              className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden cursor-pointer group bg-[#F5EFEB]"
              onClick={() => onSelectPhoto(memory)}
              title="انقر لعرض الصورة بدقة عالية"
            >
              <img
                src={memory.imageUrl}
                alt={memory.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80';
                }}
              />

              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4 text-white">
                <span className="text-xs font-medium tracking-wide flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5" />
                  عرض بدقة عالية
                </span>
                <span className="text-xs opacity-90 font-light">تكبير</span>
              </div>

              {/* Category Badge over photo (Logical Start) */}
              <div className="absolute top-3 start-3 z-10">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide border shadow-xs backdrop-blur-md ${
                    categoryColors[memory.category] || categoryColors['لحظة خاصة']
                  } bg-white/95`}
                >
                  <Tag className="w-3 h-3" />
                  {memory.category}
                </span>
              </div>

              {/* Milestone sequence stamp on photo (Logical End) */}
              <div className="absolute top-3 end-3 z-10">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-arabic font-bold text-white bg-black/40 backdrop-blur-xs border border-white/20">
                  محطة #{memory.milestoneNumber ?? index + 1}
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-6 text-start">
              {/* Meta Date & Location */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#786C6E] mb-2.5">
                <span className="flex items-center gap-1.5 font-medium text-[#8C2D3E]">
                  <Calendar className="w-3.5 h-3.5 text-[#C2415C]" />
                  <span>{formattedDate}</span>
                </span>
                {memory.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <bdi dir="auto" className="bidi-plain">{memory.location}</bdi>
                  </span>
                )}
              </div>

              {/* Title with BiDi protection */}
              <h3 className="text-xl sm:text-2xl font-bold font-arabic text-[#272021] leading-snug mb-3 text-start">
                <bdi dir="auto" className="bidi-plain">{memory.title}</bdi>
              </h3>

              {/* Caption / Story with BiDi protection and generous line-height */}
              <div className="text-sm text-[#4A3E40] leading-relaxed font-normal whitespace-pre-line text-start">
                <bdi dir="auto" className="bidi-plain block">
                  {displayedCaption}
                </bdi>
              </div>

              {shouldTruncate && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                  className="mt-2 text-xs font-semibold text-[#C2415C] hover:text-[#8C2D3E] underline-offset-4 hover:underline transition-colors block text-start"
                >
                  {isExpanded ? 'عرض أقل' : 'اقرأ المزيد...'}
                </button>
              )}

              {/* Bottom Subtle Heart Stamp */}
              <div className="mt-4 pt-3 border-t border-[#F4DBDE]/50 flex items-center justify-between text-xs text-[#786C6E]">
                <span className="italic font-amiri text-sm text-[#A8811E]">
                  لحظة ستبقى خالدة في الوجدان
                </span>
                <Heart className="w-3.5 h-3.5 text-[#E28290] fill-[#E28290]/30" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Opposite Empty Column to balance desktop grid */}
        <div className="hidden md:block md:w-[46%]" />
      </div>
    </div>
  );
};
