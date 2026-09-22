import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Sparkles, Copy, Check } from 'lucide-react';
import type { CoupleSettings } from '../../types/memory';
import confetti from 'canvas-confetti';

interface SecretLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CoupleSettings;
}

export const SecretLetterModal: React.FC<SecretLetterModalProps> = ({
  isOpen,
  onClose,
  settings,
}) => {
  const [isSealBroken, setIsSealBroken] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleBreakSeal = () => {
    setIsSealBroken(true);
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C2415C', '#E28290', '#D4AF37'],
      });
    } catch {
      // silent
    }
  };

  const handleCopy = () => {
    const text = `${settings.loveLetterTitle}\n\n${settings.loveLetterContent}\n\n— ${settings.partner1}\n${settings.loveLetterSignoff}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Envelope Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-xl my-auto text-start"
        >
          {!isSealBroken ? (
            /* Closed Wax Sealed Envelope State */
            <div className="bg-[#FFFDF9] rounded-3xl p-8 sm:p-10 shadow-2xl border-2 border-[#E28290]/40 text-center relative overflow-hidden">
              {/* Close Button (Logical End) */}
              <button
                onClick={onClose}
                className="absolute top-4 end-4 p-2 rounded-full text-[#786C6E] hover:text-[#272021] hover:bg-[#FBECEE] transition-colors"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Postal Stamp & Cancellation */}
              <div className="flex justify-between items-start mb-8 border-b border-[#F4DBDE] pb-4">
                <div className="text-start font-arabic text-xs text-[#786C6E] leading-relaxed">
                  <span className="block font-bold text-[#8C2D3E]">
                    بريد جوي • تسليم خاص ومخلد
                  </span>
                  <span>من: {settings.partner1}</span>
                  <br />
                  <span>إلى: {settings.partner2}</span>
                </div>

                <div className="w-12 h-14 border-2 border-dashed border-[#C2415C]/40 rounded-md flex flex-col items-center justify-center p-1 bg-[#FBECEE]/50">
                  <Heart className="w-5 h-5 text-[#C2415C] fill-[#C2415C]" />
                  <span className="text-[10px] font-bold text-[#8C2D3E] mt-1 font-arabic">
                    حب
                  </span>
                </div>
              </div>

              <div className="py-6">
                <div
                  onClick={handleBreakSeal}
                  className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#8C2D3E] via-[#C2415C] to-[#E28290] mx-auto flex items-center justify-center shadow-xl cursor-pointer hover:scale-105 transition-transform relative group"
                  title="انقر لكسر الختم"
                >
                  <Heart className="w-9 h-9 text-white fill-white" />
                  <div className="absolute inset-0 rounded-full border-2 border-[#D4AF37] opacity-60 animate-ping pointer-events-none" />
                </div>

                <h3 className="text-2xl font-bold font-arabic text-[#272021] mt-6 mb-2">
                  رسالة من أعماق قلبي
                </h3>
                <p className="text-sm text-[#786C6E] max-w-sm mx-auto mb-6 leading-relaxed">
                  مختومة بعهد أبدي. اضغطي على الختم الشمعي لفك الختم وقراءة الرسالة المكتوبة خصيصاً لكِ.
                </p>

                <button
                  onClick={handleBreakSeal}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-[#C2415C] to-[#E28290] text-white font-medium text-sm shadow-md hover:shadow-lg transition-all duration-200"
                >
                  كسر الختم الشمعي
                </button>
              </div>
            </div>
          ) : (
            /* Open Letter Unfolded Parchment Paper State */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-10 shadow-2xl border border-[#E28290]/50 relative max-h-[85vh] overflow-y-auto text-start"
            >
              {/* Close Button (Logical End) */}
              <button
                onClick={onClose}
                className="absolute top-4 end-4 p-2 rounded-full text-[#786C6E] hover:text-[#272021] hover:bg-[#FBECEE] transition-colors"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Decorative Header */}
              <div className="text-center pb-4 border-b border-[#F4DBDE] mb-6">
                <Sparkles className="w-5 h-5 text-[#D4AF37] mx-auto mb-1" />
                <span className="text-xs tracking-wider text-[#8C2D3E] font-bold">
                  رسالة حب أبدية
                </span>
              </div>

              {/* Salutation with BiDi */}
              <h3 className="text-xl sm:text-2xl font-bold font-amiri text-[#8C2D3E] mb-4 text-start leading-snug">
                <bdi dir="auto" className="bidi-plain">{settings.loveLetterTitle}</bdi>
              </h3>

              {/* Body Content with Arabic Amiri calligraphy font and generous line height */}
              <div className="font-amiri text-lg sm:text-xl text-[#3B3032] leading-loose whitespace-pre-line space-y-4 font-normal text-start">
                <bdi dir="auto" className="bidi-plain block">
                  {settings.loveLetterContent}
                </bdi>
              </div>

              {/* Signoff */}
              <div className="mt-8 pt-6 border-t border-[#F4DBDE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-start">
                  <p className="font-amiri italic text-base text-[#786C6E]">
                    <bdi dir="auto">{settings.loveLetterSignoff}</bdi>
                  </p>
                  <p className="text-lg font-amiri font-bold text-[#8C2D3E] mt-0.5">
                    {settings.partner1}
                  </p>
                </div>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-[#FBECEE] text-[#8C2D3E] hover:bg-[#F4DBDE] transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>تم النسخ إلى الحافظة</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ رسالة الحب</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
