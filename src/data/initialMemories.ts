import type { CoupleSettings, Memory } from '../types/memory';

export const INITIAL_SETTINGS: CoupleSettings = {
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

export const INITIAL_MEMORIES: Memory[] = [
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
    title: 'رقصتنا على ضوء الشموع في المطبخ',
    date: '2023-08-19',
    category: 'لحظة خاصة',
    location: 'منزلنا الدافئ',
    imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
    caption: 'انقطعت الكهرباء فجأة إثر عاصفة صيفية ماطرة. بدلاً من التذمر، أشعلنا 4 شموع برائحة الفانيليا، وشغلنا موسيقى Jazz هادئة عبر الهاتف، ورقصنا حفاة فوق الأرضية الخشبية حتى غلبنا النعاس بابتسامة دافئة.',
    featured: false,
    milestoneNumber: 4,
    createdAt: 1692450000000,
  },
  {
    id: 'mem-5',
    title: 'احتفالنا بمرور 365 يوماً معاً',
    date: '2023-10-14',
    category: 'محطة فارقة',
    location: 'مطعم The Glasshouse Bistro',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=85',
    caption: 'عام كامل من الحب الصادق والدعم غير المشروط مرّ كأنه طرفة عين. رفعنا نخب الذكريات تحت أضواء الفوانيس الهادئة، وأهديتني بطاقتكِ المكتوبة بخط يدكِ الرقيق التي ما زلت أحتفظ بها في محفظتي أينما ذهبت.',
    featured: true,
    milestoneNumber: 5,
    createdAt: 1697290000000,
  },
  {
    id: 'mem-6',
    title: 'تحت سماء مرصعة بالشهب والنجوم',
    date: '2024-06-15',
    category: 'رحلة',
    location: 'محمية Pine Ridge الطبيعية',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
    caption: 'ملتفين بغطاء صوفي سميك وسط هواء الجبل العليل ورائحة الصنوبر. عددنا 7 شهب مضيئة شقت عتمة السماء، وهمسنا معاً بنفس الأمنية في ذات الثانية: أن نظل نختار بعضنا البعض في كل يوم تشرق فيه الشمس.',
    featured: true,
    milestoneNumber: 6,
    createdAt: 1718460000000,
  }
];
