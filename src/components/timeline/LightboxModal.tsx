import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Calendar, MapPin, Tag } from 'lucide-react';
import type { Memory } from '../../types/memory';

interface LightboxModalProps {
  memory: Memory | null;
  memories: Memory[];
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  memory,
  memories,
  onClose,
  onNavigate,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!memory) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate('next');
      if (e.key === 'ArrowRight') onNavigate('prev');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [memory, onClose, onNavigate]);

  if (!memory) return null;

  const currentIndex = memories.findIndex((m) => m.id === memory.id);
  const formattedDate = new Date(memory.date).toLocaleDateString('ar-EG', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-4xl max-h-[92vh] bg-[#FFFDF9] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-[#E28290]/40"
        >
          {/* Close button (Logical End) */}
          <button
            onClick={onClose}
            className="absolute top-4 end-4 z-30 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
            aria-label="إغلاق معاينة الصورة"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Image Section */}
          <div className="relative flex-1 bg-[#1A1415] flex items-center justify-center min-h-[300px] md:min-h-[500px]">
            <img
              src={memory.imageUrl}
              alt={memory.title}
              className="max-h-[50vh] md:max-h-[85vh] w-full object-contain"
            />

            {/* Previous Button (In RTL, start is right) */}
            {memories.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('prev');
                }}
                className="absolute start-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white transition-all backdrop-blur-xs"
                aria-label="الذكرى السابقة"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Next Button (In RTL, end is left) */}
            {memories.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('next');
                }}
                className="absolute end-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white transition-all backdrop-blur-xs"
                aria-label="الذكرى التالية"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Counter pill */}
            <div className="absolute bottom-3 start-3 px-3 py-1 rounded-full bg-black/50 text-white text-xs font-arabic backdrop-blur-xs">
              {currentIndex + 1} من {memories.length}
            </div>
          </div>

          {/* Story Details Panel */}
          <div className="w-full md:w-[380px] p-6 flex flex-col justify-between overflow-y-auto max-h-[40vh] md:max-h-[85vh] bg-[#FFFDF9] text-start">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#C2415C]/10 text-[#8C2D3E] border border-[#C2415C]/20">
                  <Tag className="w-3 h-3" />
                  {memory.category}
                </span>
                <span className="text-xs text-[#A8811E] font-bold font-arabic">
                  محطة #{memory.milestoneNumber ?? currentIndex + 1}
                </span>
              </div>

              <h2 className="text-2xl font-bold font-arabic text-[#272021] mb-2 leading-tight text-start">
                <bdi dir="auto" className="bidi-plain">{memory.title}</bdi>
              </h2>

              <div className="space-y-1 text-xs text-[#786C6E] mb-5">
                <div className="flex items-center gap-1.5 text-[#8C2D3E] font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formattedDate}</span>
                </div>
                {memory.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <bdi dir="auto" className="bidi-plain">{memory.location}</bdi>
                  </div>
                )}
              </div>

              <div className="relative text-start">
                <p className="text-sm text-[#4A4042] leading-relaxed whitespace-pre-line font-normal">
                  <bdi dir="auto" className="bidi-plain block">{memory.caption}</bdi>
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#F4DBDE] text-center">
              <span className="font-amiri text-sm text-[#786C6E]">
                «لتخليد كل خطوة في رحلتنا معاً»
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
