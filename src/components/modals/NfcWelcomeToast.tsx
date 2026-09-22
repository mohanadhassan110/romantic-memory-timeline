import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Radio } from 'lucide-react';
import confetti from 'canvas-confetti';

interface NfcWelcomeToastProps {
  partner2: string;
}

export const NfcWelcomeToast: React.FC<NfcWelcomeToastProps> = ({ partner2 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show toast after a slight moment on page load
    const timer = setTimeout(() => {
      setIsVisible(true);

      // Gentle celebratory romantic confetti burst
      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.15 },
          colors: ['#E28290', '#C2415C', '#D4AF37', '#F6ECC4'],
          disableForReducedMotion: true,
        });
      } catch {
        // silent fallback
      }
    }, 900);

    // Auto dismiss after 8.5 seconds
    const autoDismiss = setTimeout(() => {
      setIsVisible(false);
    }, 8500);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoDismiss);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-20 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 z-50 w-[92%] max-w-md pointer-events-auto text-start"
        >
          <div className="glass-modal rounded-2xl p-4 shadow-xl border border-[#E28290]/40 flex items-start gap-3 relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 end-0 w-24 h-24 bg-gradient-to-br from-[#E28290]/20 to-transparent rounded-full blur-xl pointer-events-none" />

            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FBECEE] to-[#F4ECE1] border border-[#E28290]/30 flex items-center justify-center shrink-0 text-[#C2415C]">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>

            <div className="flex-1 pe-4 text-start">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8C2D3E] tracking-wider mb-0.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>تم الاتصال ببطاقة NFC</span>
              </div>
              <p className="text-sm font-semibold text-[#272021]">
                أهلاً بكِ في عالمنا الصغير، يا {partner2}.
              </p>
              <p className="text-xs text-[#786C6E] mt-0.5 leading-relaxed">
                هدية رقمية مخلدة صُنعت بكل الحب، خصيصاً من أجلكِ.
              </p>
            </div>

            <button
              onClick={() => setIsVisible(false)}
              className="text-[#786C6E]/60 hover:text-[#272021] p-1 rounded-md transition-colors"
              aria-label="إغلاق التنبيه"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
