import React, { useState } from 'react';
import { Upload, Link as LinkIcon, Check, Calendar, MapPin, Tag } from 'lucide-react';
import type { Memory } from '../../types/memory';

interface MemoryFormProps {
  initialData?: Memory | null;
  onSubmit: (data: Omit<Memory, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const CATEGORIES = [
  'محطة فارقة',
  'البدايات',
  'موعد غرامي',
  'رحلة',
  'احتفال',
  'لحظة خاصة',
];

export const MemoryForm: React.FC<MemoryFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [date, setDate] = useState(
    initialData?.date || new Date().toISOString().slice(0, 10)
  );
  const [category, setCategory] = useState(initialData?.category || 'موعد غرامي');
  const [location, setLocation] = useState(initialData?.location || '');
  const [caption, setCaption] = useState(initialData?.caption || '');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Client-side image compression with Canvas
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP).');
      return;
    }

    setIsCompressing(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.82);
          setImageUrl(compressedBase64);
        }
        setIsCompressing(false);
      };
      img.onerror = () => {
        setError('فشل في معالجة ملف الصورة.');
        setIsCompressing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setError('خطأ أثناء قراءة الملف.');
      setIsCompressing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('يرجى إدخال عنوان لهذه الذكرى.');
      return;
    }
    if (!imageUrl.trim()) {
      setError('يرجى رفع صورة أو إضافة رابط للصورة.');
      return;
    }
    if (!caption.trim()) {
      setError('يرجى كتابة تفاصيل وقصة الذكرى.');
      return;
    }

    onSubmit({
      title: title.trim(),
      date,
      category,
      location: location.trim() || undefined,
      imageUrl: imageUrl.trim(),
      caption: caption.trim(),
      featured: initialData?.featured ?? false,
      milestoneNumber: initialData?.milestoneNumber,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-start">
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-xs font-semibold text-[#272021] mb-1.5">
          عنوان الذكرى *
        </label>
        <input
          type="text"
          required
          placeholder="مثال: موعد قهوة الغروب على الشاطئ"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white border border-[#F4DBDE] text-[#272021] focus:outline-none focus:border-[#C2415C] focus:ring-1 focus:ring-[#C2415C] text-start"
        />
      </div>

      {/* Date & Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#272021] mb-1.5">
            تاريخ الذكرى *
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-[#786C6E]/60 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full ps-10 pe-3.5 py-2.5 rounded-xl text-sm bg-white border border-[#F4DBDE] text-[#272021] focus:outline-none focus:border-[#C2415C] text-start"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#272021] mb-1.5">
            التصنيف *
          </label>
          <div className="relative">
            <Tag className="w-4 h-4 text-[#786C6E]/60 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full ps-10 pe-3.5 py-2.5 rounded-xl text-sm bg-white border border-[#F4DBDE] text-[#272021] focus:outline-none focus:border-[#C2415C] text-start"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-xs font-semibold text-[#272021] mb-1.5">
          المكان (اختياري)
        </label>
        <div className="relative">
          <MapPin className="w-4 h-4 text-[#786C6E]/60 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="مثال: Corner Cafe، وسط المدينة أو باريس"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full ps-10 pe-3.5 py-2.5 rounded-xl text-sm bg-white border border-[#F4DBDE] text-[#272021] focus:outline-none focus:border-[#C2415C] text-start"
          />
        </div>
      </div>

      {/* Photo Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-semibold text-[#272021]">
            صورة الذكرى *
          </label>
          <div className="flex items-center gap-1 bg-[#F4ECE1]/60 p-0.5 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setImageMode('upload')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                imageMode === 'upload'
                  ? 'bg-white text-[#8C2D3E] shadow-xs'
                  : 'text-[#786C6E] hover:text-[#272021]'
              }`}
            >
              رفع صورة
            </button>
            <button
              type="button"
              onClick={() => setImageMode('url')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                imageMode === 'url'
                  ? 'bg-white text-[#8C2D3E] shadow-xs'
                  : 'text-[#786C6E] hover:text-[#272021]'
              }`}
            >
              رابط صورة
            </button>
          </div>
        </div>

        {imageMode === 'upload' ? (
          <div className="relative border-2 border-dashed border-[#F4DBDE] hover:border-[#E28290] rounded-2xl p-6 text-center transition-colors bg-white/60">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
              <div className="w-10 h-10 rounded-full bg-[#FBECEE] text-[#C2415C] flex items-center justify-center">
                {isCompressing ? (
                  <span className="w-4 h-4 border-2 border-[#C2415C] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
              </div>
              <p className="text-xs font-medium text-[#272021]">
                {isCompressing ? 'جاري تحسين وضغط الصورة...' : 'انقر أو اسحب ملف الصورة هنا'}
              </p>
              <p className="text-[11px] text-[#786C6E]">
                يتم ضغط الصورة تلقائياً لسرعة وسلاسة التحميل عبر NFC
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <LinkIcon className="w-4 h-4 text-[#786C6E]/60 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full ps-10 pe-3.5 py-2.5 rounded-xl text-sm bg-white border border-[#F4DBDE] text-[#272021] focus:outline-none focus:border-[#C2415C] text-start"
            />
          </div>
        )}

        {/* Live Photo Preview */}
        {imageUrl && (
          <div className="mt-3 relative rounded-xl overflow-hidden border border-[#F4DBDE] w-full max-h-48 bg-[#F5EFEB]">
            <img
              src={imageUrl}
              alt="معاينة الصورة"
              className="w-full h-48 object-cover"
            />
            <button
              type="button"
              onClick={() => setImageUrl('')}
              className="absolute top-2 end-2 px-2.5 py-1 rounded-lg bg-black/60 hover:bg-black/80 text-white text-xs backdrop-blur-xs transition-colors"
            >
              تغيير الصورة
            </button>
          </div>
        )}
      </div>

      {/* Story / Caption */}
      <div>
        <label className="block text-xs font-semibold text-[#272021] mb-1.5">
          تفاصيل الذكرى والرسالة الوجدانية *
        </label>
        <textarea
          required
          rows={4}
          placeholder="صِف كيف كان شعورك في ذلك اليوم، التفاصيل الصغيرة، وما جعل تلك اللحظة استثنائية في قلبك..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white border border-[#F4DBDE] text-[#272021] focus:outline-none focus:border-[#C2415C] leading-relaxed resize-y text-start font-arabic"
        />
        <span className="text-[11px] text-[#786C6E] block text-end mt-1 font-mono">
          {caption.length} حرف
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F4DBDE]">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl border border-[#F4DBDE] text-xs font-medium text-[#786C6E] hover:bg-white transition-colors"
        >
          إلغاء
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C2415C] to-[#E28290] text-white text-xs font-medium shadow-md hover:from-[#A82D45] hover:to-[#C2415C] transition-all flex items-center gap-1.5"
        >
          <Check className="w-4 h-4" />
          <span>{initialData ? 'تحديث الذكرى' : 'حفظ الذكرى'}</span>
        </button>
      </div>
    </form>
  );
};
