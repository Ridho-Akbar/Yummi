export interface Faq {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface FaqDraft {
  id: string | null;
  question: string;
  answer: string;
  isActive: boolean;
}
