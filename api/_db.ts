import { put, list } from '@vercel/blob';

const TIMELINE_BLOB_PATH = 'romantic_timeline_v1.json';

export interface CoupleSettings {
  partner1: string;
  partner2: string;
  anniversaryDate: string;
  heroTitle: string;
  heroSubtitle: string;
  romanticQuote: string;
  quoteAuthor: string;
  adminPin: string;
  loveLetterTitle: string;
  loveLetterContent: string;
  loveLetterSignoff: string;
}

export interface Memory {
  id: string;
  title: string;
  date: string;
  category: string;
  location: string;
  imageUrl: string;
  caption: string;
  featured: boolean;
  milestoneNumber: number;
  createdAt: number;
}

export interface TimelineData {
  memories: Memory[];
  settings: CoupleSettings;
}

export const DEFAULT_SETTINGS: CoupleSettings = {
  partner1: 'محمد',
  partner2: 'نور',
  anniversaryDate: '2022-10-14T19:30:00',
  heroTitle: 'عالمنا الصغير • لحظات لا تُنسى',
  heroSubtitle: 'خط زمني يروي حكاية حبنا، وأيامنا الدافئة، وكل ضحكة نسجناها معاً.',
  romanticQuote: '«سأبحث عنكِ في كل حياة، وعبر كل سماء مرصعة بالنجوم.»',
  quoteAuthor: 'إلى الأبد ودائماً',
  adminPin: '1204',
  loveLetterTitle: 'إلى شريكة روحي وأجمل ما في هذا الكون،',
  loveLetterContent: `لو أخبرني أحدهم قبل سنوات أن قلبي سيجد سكينته الكاملة بين تفاصيل ابتسامتكِ، لصدقته في نفس اللحظة التي التقت فيها أعيننا لأول مرة.

كل لحظة على هذا الخط الزمني ليست مجرد صورة التقطت بكاميرا؛ بل هي معجزة صغيرة أهدانا إياها القدر. من فنجان القهوة الأول الذي تحول إلى 4 ساعات من الأحاديث الصادقة، إلى خطواتنا العفوية تحت المطر حين كنا نبتسم كالأطفال دون أي اكتراث للعالم.

شكراً لأنكِ ملاذي الآمن، ومغامرتي الأجمل، والوطن الحقيقي الذي لطالما بحثت عنه. أعدكِ أن أظل بجانبكِ دوماً، نجمع ألوان الغروب معاً، وأحبكِ في كل صباح أكثر من اليوم الذي مضى.

عيد حب وسعادة لقلبكِ يا حبيبتي، وهذه المساحة هي مجرد توثيق لبداية قصة حبنا الأبدية التي ما زلنا نكتبها معاً.`,
  loveLetterSignoff: 'بكل الحب والامتنان، دائماً وأبداً.'
};

export const DEFAULT_MEMORIES: Memory[] = [
  {
    id: 'mem-1',
    title: 'أول نظرة جمعت بيننا',
    date: '2022-10-14',
    category: 'البدايات',
    location: 'Corner Cafe، وسط المدينة',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85',
    caption: 'في ذلك المساء الخريفي الهادئ، تحول فنجان الكابتشينو البسيط إلى 4 ساعات من الأحاديث الصادقة عن الأحلام والشغف والنجوم. عدت يومها إلى بيتي وقلبي يخفق بسرعة، مدركاً أن شيئاً جميلاً قد غيّر مسار حياتي للأبد.',
    featured: true,
    milestoneNumber: 1,
    createdAt: 1665770000000,
  },
  {
    id: 'mem-2',
    title: 'غروب شاطئ المارينا',
    date: '2022-12-03',
    category: 'موعد غرامي',
    location: 'Marina Bay Waterfront',
    imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=85',
    caption: 'كان نسيم البحر شتوياً وبارداً، لكن دفء يدكِ بين يديّ كان وطناً بحد ذاته. راقبنا السماء وهي ترتدي أثواب الشفق العنبري، وتناولنا أصابع الـ Churros الساخنة بالسكر والقرفة وسط ضحكاتنا المتواصلة.',
    featured: false,
    milestoneNumber: 2,
    createdAt: 1670080000000,
  },
  {
    id: 'mem-3',
    title: 'رحلتنا العفوية الأولى بالسيارة',
    date: '2023-04-22',
    category: 'رحلة',
    location: 'Coastal Highway & Olive Hills',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=85',
    caption: 'فتحنا نوافذ السيارة كاملة ونسيم الربيع يداعب ملامحنا، ونحن نردد أغاني قائمة Road Trip المفضلة لدينا. ضللنا الطريق لمدة ساعة كاملة بين التلال الخضراء، واتفقنا بكل بهجة أنها كانت أجمل صدفة في رحلتنا.',
    featured: true,
    milestoneNumber: 3,
    createdAt: 1682170000000,
  },
  {
    id: 'mem-4',
    title: 'يوم خطوبتنا وعهد العمر الأبدي',
    date: '2023-11-20',
    category: 'محطة فارقة',
    location: 'حديقة القصر، التجمع الخامس',
    imageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=85',
    caption: 'اليوم الذي لبستِ فيه الخاتم أمام كل من نحب. كانت دموع الفرح في عينيكِ أثمن وسام عُلّق على صدري في هذه الحياة.',
    featured: true,
    milestoneNumber: 4,
    createdAt: 1700490000000,
  },
  {
    id: 'mem-5',
    title: 'شروق الشمس الأسطوري من قمة جبل موسى',
    date: '2024-03-08',
    category: 'رحلة',
    location: 'سانت كاترين',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
    caption: 'تسلقنا الجبل لست ساعات متواصلة في البرد القارس. وعندما لامست أشعة الشمس الذهبية وجهكِ في القمة، أدركت أن أي صعوبة في هذه الدنيا تهون ما دمتِ تمسكين بيدي.',
    featured: false,
    milestoneNumber: 5,
    createdAt: 1709900000000,
  },
  {
    id: 'mem-6',
    title: 'عشاؤنا السنوي الهادئ على ضوء الشموع',
    date: '2024-10-14',
    category: 'احتفال',
    location: 'مطعم سيكويا، الزمالك',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85',
    caption: 'مر عامان كأنهما رمشة عين. جلسنا نسترجع كل ضحكة وكل عثرة تجاوزناها معاً، واحتفلنا بأن حبنا يزداد كل يوم نضجاً وعمقاً وجمالاً.',
    featured: false,
    milestoneNumber: 6,
    createdAt: 1728910000000,
  }
];

export async function getTimelineData(): Promise<TimelineData> {
  try {
    const { blobs } = await list({ prefix: TIMELINE_BLOB_PATH });
    const target = blobs.find(b => b.pathname === TIMELINE_BLOB_PATH);

    if (target) {
      const res = await fetch(`${target.downloadUrl || target.url}?t=${Date.now()}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.memories)) {
          return {
            memories: data.memories,
            settings: { ...DEFAULT_SETTINGS, ...(data.settings || {}) },
          };
        }
      }
    }
  } catch (err) {
    console.error('Error reading timeline data from blob:', err);
  }

  // Fallback / Initial seed if not existing yet
  const initial: TimelineData = {
    memories: DEFAULT_MEMORIES,
    settings: DEFAULT_SETTINGS,
  };
  try {
    await saveTimelineData(initial);
  } catch (err) {
    console.error('Could not auto-seed blob:', err);
  }
  return initial;
}

export async function saveTimelineData(data: TimelineData): Promise<void> {
  await put(TIMELINE_BLOB_PATH, JSON.stringify(data, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}
