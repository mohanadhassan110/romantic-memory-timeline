import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, KeyRound, X, AlertCircle } from 'lucide-react';

interface AdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  correctPin: string;
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  correctPin,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === correctPin.trim()) {
      setError(false);
      setPin('');
      onSuccess();
    } else {
      setError(true);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* PIN Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={
            error
              ? { x: [-10, 10, -8, 8, -4, 4, 0], opacity: 1, scale: 1, y: 0 }
              : { opacity: 1, scale: 1, y: 0 }
          }
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 w-full max-w-sm bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E28290]/40 text-start"
        >
          {/* Close button (Logical End) */}
          <button
            onClick={onClose}
            className="absolute top-4 end-4 p-2 rounded-full text-[#786C6E] hover:text-[#272021] hover:bg-[#FBECEE] transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8C2D3E] to-[#C2415C] text-white mx-auto flex items-center justify-center shadow-md mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-arabic text-[#272021]">
              الوصول السري للإدارة
            </h3>
            <p className="text-xs text-[#786C6E] mt-1 leading-relaxed">
              أدخل رمز PIN السري لتعديل الذكريات وإعدادات الهدية.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#786C6E]/60 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  maxLength={12}
                  autoFocus
                  placeholder="رمز PIN السري..."
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    if (error) setError(false);
                  }}
                  className={`w-full ps-10 pe-4 py-2.5 rounded-xl text-center tracking-widest text-lg font-mono bg-white border ${
                    error ? 'border-red-400 ring-1 ring-red-400' : 'border-[#F4DBDE]'
                  } focus:outline-none focus:border-[#C2415C] focus:ring-1 focus:ring-[#C2415C]`}
                />
              </div>

              {error && (
                <div className="flex items-center justify-center gap-1 text-xs text-red-600 mt-2">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>رمز PIN غير صحيح. يرجى المحاولة ثانية.</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#C2415C] to-[#E28290] text-white font-medium text-sm shadow-md hover:from-[#A82D45] hover:to-[#C2415C] transition-all"
            >
              فتح لوحة التحكم
            </button>
          </form>

          {/* Quick Demo Hint */}
          <div className="mt-5 pt-4 border-t border-[#F4DBDE] text-center">
            <span className="text-[11px] text-[#786C6E]/80">
              الرمز التجريبي: <strong className="text-[#8C2D3E] font-mono">{correctPin}</strong>
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
