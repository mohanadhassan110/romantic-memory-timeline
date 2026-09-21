import React, { useState } from 'react';
import { Check, Sparkles, Heart, Key, Save } from 'lucide-react';
import type { CoupleSettings } from '../../types/memory';

interface SettingsFormProps {
  settings: CoupleSettings;
  onSave: (newSettings: Partial<CoupleSettings>) => void;
}

export const SettingsForm: React.FC<SettingsFormProps> = ({
  settings,
  onSave,
}) => {
  const [formData, setFormData] = useState<CoupleSettings>({ ...settings });
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-start">
      {showSavedFeedback && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>تم حفظ إعدادات الشريكين والهدية بنجاح!</span>
        </div>
      )}

      {/* Couple Identity */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold font-arabic text-[#8C2D3E] flex items-center gap-2">
          <Heart className="w-4 h-4 text-[#C2415C]" />
          <span>هوية الشريكين والأسماء</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#272021] mb-1">
              اسمك / الشريك الأول (مُعد الهدية)
            </label>
            <input
              type="text"
              required
              value={formData.partner1}
              onChange={(e) =>
                setFormData({ ...formData, partner1: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white border border-[#F4DBDE] text-[#272021] focus:outline-none focus:border-[#C2415C] text-start font-arabic"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#272021] mb-1">
              اسمها / الشريك الثاني (مُستلمة الهدية)
            </label>
            <input
              type="text"
              required
              value={formData.partner2}
              onChange={(e) =>
                setFormData({ ...formData, partner2: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white border border-[#F4DBDE] text-[#272021] focus:outline-none focus:border-[#C2415C] text-start font-arabic"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#272021] mb-1">
            تاريخ ووقت الذكرى السنوية (يُشغّل العداد المباشر)
          </label>
          <input
            type="datetime-local"
            required
            value={formData.anniversaryDate.slice(0, 16)}
            onChange={(e) =>
              setFormData({ ...formData, anniversaryDate: e.target.value })
            }
            className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white border border-[#F4DBDE] text-[#272021] focus:outline-none focus:border-[#C2415C] text-start"
          />
          <span className="text-[11px] text-[#786C6E] mt-1 block">
            يحسب العداد المباشر الأيام والساعات والدقائق والثواني بدقة منذ هذا التوقيت.
          </span>
        </div>
      </div>

      {/* Hero Header & Romance */}
      <div className="space-y-4 pt-4 border-t border-[#F4DBDE]">
        <h4 className="text-sm font-bold font-arabic text-[#8C2D3E] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>عرض الواجهة والعبارات الرومانسية</span>
        </h4>

        <div>
          <label className="block text-xs font-semibold text-[#272021] mb-1">
            عنوان الواجهة الرئيسي
          </label>
          <input
            type="text"
            required
            value={formData.heroTitle}
            onChange={(e) =>
              setFormData({ ...formData, heroTitle: e.target.value })
            }
            className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white border border-[#F4DBDE] text-[#272021] focus:outline-none focus:border-[#C2415C] text-start font-arabic"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#272021] mb-1">
            الوصف / عبارة الترحيب
          </label>
          <textarea
            rows={2}
            value={formData.heroSubtitle}
            onChange={(e) =>
              setFormData({ ...formData, heroSubtitle: e.target.value })
            }
            className="w-full px-3.5 py-2 rounded-xl text-sm bg-white border border-[#F4DBDE] text-[#272021] focus:outline-none focus:border-[#C2415C] text-start font-arabic leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#272021] mb-1">
              العبارة الرومانسية المقتبسة
            </label>
            <input
              type="text"
              value={formData.romanticQuote}
              onChange={(e) =>
                setFormData({ ...formData, romanticQuote: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white border border-[#F4DBDE] text-[#272021] focus:outline-none focus:border-[#C2415C] text-start font-arabic"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#272021] mb-1">
              قائل العبارة / التوقيع
            </label>
            <input
              type="text"
              value={formData.quoteAuthor || ''}
              onChange={(e) =>
                setFormData({ ...formData, quoteAuthor: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white border border-[#F4DBDE] text-[#272021] focus:outline-none focus:border-[#C2415C] text-start font-arabic"
            />
          </div>
        </div>
      </div>

      {/* Love Letter Customization */}
      <div className="space-y-4 pt-4 border-t border-[#F4DBDE]">
        <h4 className="text-sm font-bold font-arabic text-[#8C2D3E] flex items-center gap-2">
          <Heart className="w-4 h-4 text-[#C2415C]" />
          <span>رسالة الحب المختومة بالشمع</span>
        </h4>

        <div>
          <label className="block text-xs font-semibold text-[#272021] mb-1">
            عنوان / افتتاحية الرسالة
          </label>
          <input
            type="text"
            value={formData.loveLetterTitle}
            onChange={(e) =>
              setFormData({ ...formData, loveLetterTitle: e.target.value })
            }
            className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white border border-[#F4DBDE] text-[#272021] focus:outline-none focus:border-[#C2415C] text-start font-arabic"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#272021] mb-1">
            نص رسالة الحب
          </label>
          <textarea
            rows={6}
            value={formData.loveLetterContent}
            onChange={(e) =>
              setFormData({ ...formData, loveLetterContent: e.target.value })
            }
            className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white border border-[#F4DBDE] text-[#272021] focus:outline-none focus:border-[#C2415C] leading-loose text-start font-arabic"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#272021] mb-1">
            خاتمة وتوقيع الرسالة
          </label>
          <input
            type="text"
            value={formData.loveLetterSignoff}
            onChange={(e) =>
              setFormData({ ...formData, loveLetterSignoff: e.target.value })
            }
            className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white border border-[#F4DBDE] text-[#272021] focus:outline-none focus:border-[#C2415C] text-start font-arabic"
          />
        </div>
      </div>

      {/* Security PIN */}
      <div className="space-y-4 pt-4 border-t border-[#F4DBDE]">
        <h4 className="text-sm font-bold font-arabic text-[#8C2D3E] flex items-center gap-2">
          <Key className="w-4 h-4 text-[#A8811E]" />
          <span>الأمان ورمز الدخول</span>
        </h4>

        <div className="max-w-xs">
          <label className="block text-xs font-semibold text-[#272021] mb-1">
            رمز PIN السري للإدارة
          </label>
          <input
            type="text"
            required
            maxLength={12}
            value={formData.adminPin}
            onChange={(e) =>
              setFormData({ ...formData, adminPin: e.target.value })
            }
            className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white border border-[#F4DBDE] text-[#272021] font-mono tracking-wider focus:outline-none focus:border-[#C2415C] text-start"
          />
          <span className="text-[11px] text-[#786C6E] mt-1 block">
            الرمز الذي تدخله للوصول إلى لوحة التحكم.
          </span>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4 border-t border-[#F4DBDE] flex justify-end">
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C2415C] to-[#E28290] text-white text-xs font-medium shadow-md hover:from-[#A82D45] hover:to-[#C2415C] transition-all flex items-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          <span>حفظ التغييرات</span>
        </button>
      </div>
    </form>
  );
};
