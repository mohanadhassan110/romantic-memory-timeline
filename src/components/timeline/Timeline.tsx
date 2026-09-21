import React, { useState } from 'react';
import { Sparkles, Search, HeartHandshake } from 'lucide-react';
import type { Memory, MemoryCategory } from '../../types/memory';
import { TimelineItem } from './TimelineItem';

interface TimelineProps {
  memories: Memory[];
  onSelectPhoto: (memory: Memory) => void;
}

const CATEGORIES: { label: string; value: MemoryCategory }[] = [
  { label: 'الكل', value: 'All' },
  { label: 'محطات فارقة', value: 'محطة فارقة' },
  { label: 'البدايات', value: 'البدايات' },
  { label: 'مواعيد غرامية', value: 'موعد غرامي' },
  { label: 'رحلات', value: 'رحلة' },
  { label: 'لحظات خاصة', value: 'لحظة خاصة' },
];

export const Timeline: React.FC<TimelineProps> = ({
  memories,
  onSelectPhoto,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MemoryCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMemories = memories.filter((m) => {
    // Map category matching smoothly for bilingual or Arabic categories
    const categoryMatches =
      selectedCategory === 'All' ||
      m.category === selectedCategory ||
      (selectedCategory === 'محطة فارقة' && m.category === 'Milestone') ||
      (selectedCategory === 'البدايات' && m.category === 'First') ||
      (selectedCategory === 'موعد غرامي' && m.category === 'Date') ||
      (selectedCategory === 'رحلة' && m.category === 'Trip') ||
      (selectedCategory === 'لحظة خاصة' && (m.category === 'Special' || m.category === 'Celebration'));

    const searchLower = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !searchLower ||
      m.title.toLowerCase().includes(searchLower) ||
      m.caption.toLowerCase().includes(searchLower) ||
      (m.location && m.location.toLowerCase().includes(searchLower));

    return categoryMatches && matchesSearch;
  });

  return (
    <section id="timeline-section" className="relative py-12 md:py-20 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-10 md:mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C2415C]/10 text-[#8C2D3E] text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#C2415C]" />
          <span>الخط الزمني لقصتنا</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold font-arabic text-[#272021] tracking-tight">
          كل فصل عشناه معاً
        </h2>
        <p className="text-sm sm:text-base text-[#786C6E] max-w-lg mx-auto mt-2 leading-relaxed">
          من الابتسامات العفوية البسيطة إلى المغامرات التي غيرت مسار حياتنا، محفوظة للأبد.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-12 flex flex-col sm:flex-row items-center justify-between gap-4 glass-card rounded-2xl p-3 sm:p-4 border border-[#F4DBDE]">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#C2415C] to-[#E28290] text-white shadow-xs'
                    : 'bg-white/70 text-[#786C6E] hover:bg-white hover:text-[#8C2D3E]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search Input (Logical Alignment) */}
        <div className="relative w-full sm:w-60">
          <Search className="w-4 h-4 text-[#786C6E]/60 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="ابحث في ذكرياتنا..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full ps-10 pe-3.5 py-2 rounded-full text-xs bg-white/80 border border-[#F4DBDE] text-[#272021] placeholder-[#786C6E]/60 focus:outline-none focus:border-[#E28290] focus:ring-1 focus:ring-[#E28290] text-start"
          />
        </div>
      </div>

      {/* Timeline Stem & List */}
      <div className="relative">
        {/* Vertical Guide Line:
            On mobile: start-4 (physical right in RTL).
            On desktop: start-1/2 centered with translate. */}
        <div className="absolute top-2 bottom-6 start-4 md:start-1/2 -translate-x-1/2 rtl:translate-x-1/2 w-0.5 bg-gradient-to-b from-[#C2415C] via-[#E28290] to-[#D4AF37]/50 rounded-full" />

        {filteredMemories.length > 0 ? (
          <div className="relative z-10">
            {filteredMemories.map((memory, index) => (
              <TimelineItem
                key={memory.id}
                memory={memory}
                index={index}
                isEven={index % 2 === 1}
                onSelectPhoto={onSelectPhoto}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass-card rounded-3xl p-8 border border-dashed border-[#F4DBDE] max-w-md mx-auto">
            <HeartHandshake className="w-10 h-10 text-[#E28290] mx-auto mb-3" />
            <h3 className="text-lg font-bold font-arabic text-[#272021]">
              لم يتم العثور على ذكريات
            </h3>
            <p className="text-xs text-[#786C6E] mt-1">
              {searchQuery
                ? `لا توجد ذكريات تطابق "${searchQuery}". جرب كلمة بحث أخرى.`
                : 'لا توجد ذكريات ضمن هذا التصنيف حالياً.'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-1.5 rounded-full text-xs font-medium bg-[#C2415C] text-white hover:bg-[#A82D45] transition-colors"
            >
              عرض كل الذكريات
            </button>
          </div>
        )}

        {/* Timeline Finish / Future Promise Milestone */}
        {filteredMemories.length > 0 && (
          <div className="relative z-10 flex flex-col items-center justify-center pt-8">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F6ECC4] border-4 border-white shadow-lg flex items-center justify-center text-[#8C6D1F]">
              <Sparkles className="w-5 h-5" />
            </div>
            <p className="font-amiri text-base text-[#8C2D3E] mt-3">
              «وللقصة بقية... في كل غدٍ ينتظرنا»
            </p>
            <span className="text-[11px] tracking-wider text-[#786C6E] mt-0.5">
              فصول لا تنتهي من الحب
            </span>
          </div>
        )}
      </div>
    </section>
  );
};
