export type Language = 'en' | 'mr' | 'hi' | 'gu';

export type ServiceDomain = 'jyotish' | 'pooja' | 'vastu';
export type ConsultationMode = 'online' | 'ashram';

export interface PoojaService {
  id: string;
  nameEn: string;
  nameMr: string;
  nameHi?: string;
  nameGu?: string;
  category: 'shanti' | 'mahayajna' | 'samskara' | 'abhishek' | 'pitru';
  categoryLabelEn: string;
  categoryLabelMr: string;
  categoryLabelHi: string;
  categoryLabelGu: string;
  descriptionEn: string;
  descriptionMr: string;
  descriptionHi?: string;
  descriptionGu?: string;
  longDescriptionEn: string;
  longDescriptionMr: string;
  duration: string;
  pandits: string;
  samagri: string;
  mode: ('online' | 'ashram')[];
  price: number;
  priceLabel: string;
  image: string;
  lineage: string;
  benefits: string[];
  includedItems: string[];
}

export interface GurukulCourse {
  id: string;
  titleEn: string;
  titleMr: string;
  titleHi: string;
  titleGu?: string;
  category: 'residential' | 'weekend' | 'paurohitya' | 'online';
  categoryLabel: string;
  categoryLabelGu?: string;
  categoryLabelHi?: string;
  categoryLabelMr?: string;
  duration: string;
  descriptionEn: string;
  descriptionMr: string;
  descriptionHi?: string;
  descriptionGu?: string;
  eligibility: string;
  seva: string;
  status: string;
  lessonsCount: number;
  completedLessons?: number;
  acharya: string;
  syllabusHighlights: string[];
  isFeaturedAudio?: boolean;
}

export interface FamilyMemberItem {
  id?: string;
  name: string;
  relation: string;
  nakshatra: string;
}

export interface DevoteeProfile {
  id: string;
  code: string; // e.g. #CVP-7829
  name: string;
  gotra: string;
  nakshatra: string;
  charan: string;
  rashi: string;
  phone: string;
  email: string;
  address: string;
  dob: string;
  tob: string;
  pob: string;
  kuladaivat: string;
  panNumber?: string;
  familyMembers: FamilyMemberItem[];
}

export interface TaxReceipt {
  receiptNo: string;
  date: string;
  dateIso: string;
  purpose: string;
  purposeMr: string;
  purposeHi?: string;
  purposeGu?: string;
  mode: string;
  amount: number;
  status: string;
  fy: string;
  category: 'anushthan' | 'gurukul' | 'goseva' | 'library';
  donorName: string;
  donorPan: string;
}

export interface RitualRecord {
  id: string;
  title: string;
  titleMr: string;
  type: string;
  status: 'active' | 'upcoming' | 'completed';
  statusLabel: string;
  dayProgress?: string; // e.g. "दिवस ३ / ७"
  japaCompleted?: number;
  japaTotal?: number;
  chiefHotri: string;
  assistantPandits: string;
  sankalpaIntent: string;
  todaySession: string;
  liveStreamAvailable: boolean;
  trackingNumber?: string;
  trackingStatus?: string;
  trackingSteps?: { label: string; date: string; done: boolean }[];
  date: string;
  amount: number;
  recordingDuration?: string;
  shlokaBlessing?: string;
}

export interface AstrologyQuestionItem {
  id: string;
  category: string;
  question: string;
  status: string;
  refBhav: string;
  answer?: string;
}

export interface JyotishConsultation {
  id: string;
  acharyName: string;
  acharyaTitle: string;
  experience: string;
  date: string;
  time: string;
  duration: string;
  mode: string;
  location: string;
  status: 'confirmed' | 'pending' | 'completed';
  subject: string;
  questions: AstrologyQuestionItem[];
}
