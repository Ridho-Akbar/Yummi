export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface SocialLinkDraft {
  id: string | null;
  platform: string;
  url: string;
  isActive: boolean;
}

export const SOCIAL_PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  { value: "twitter", label: "Twitter/X" },
  { value: "youtube", label: "YouTube" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "shopee", label: "Shopee" },
  { value: "tokopedia", label: "Tokopedia" },
  { value: "website", label: "Website" },
] as const;
