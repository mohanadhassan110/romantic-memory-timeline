export type MemoryCategory = 'All' | 'Milestone' | 'First' | 'Date' | 'Trip' | 'Celebration' | 'Special' | string;

export interface Memory {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  category: string;
  location?: string;
  imageUrl: string;
  caption: string;
  featured?: boolean;
  milestoneNumber?: number;
  createdAt: number;
}

export interface CoupleSettings {
  partner1: string;
  partner2: string;
  anniversaryDate: string; // YYYY-MM-DDTHH:mm:ss or YYYY-MM-DD
  heroTitle: string;
  heroSubtitle: string;
  romanticQuote: string;
  quoteAuthor?: string;
  adminPin: string;
  loveLetterTitle: string;
  loveLetterContent: string;
  loveLetterSignoff: string;
}

export interface TimeTogether {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
}
