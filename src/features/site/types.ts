export interface StoreInfo {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
}

export interface HeroContent {
  tagline: string;
  subtitle: string;
}

export interface WhyChooseItem {
  title: string;
  desc: string;
}

export interface HowToOrderItem {
  title: string;
  desc: string;
}

export interface WhatsappConfig {
  url: string;
  floatingEnabled: boolean;
}

export interface FooterContent {
  tagline: string;
  copyright: string;
}

export interface HomepageConfig {
  latestCount: number;
  terlarisCount: number;
  bestSellerCount: number;
}

export interface OrderAccess {
  passwordHash: string;
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface SiteSettings {
  storeInfo: StoreInfo;
  hero: HeroContent;
  whyChoose: WhyChooseItem[];
  howToOrder: HowToOrderItem[];
  whatsapp: WhatsappConfig;
  footer: FooterContent;
  homepageConfig: HomepageConfig;
  orderAccess: OrderAccess;
}

export const SETTINGS_DEFAULTS: SiteSettings = {
  storeInfo: {
    name: "Yumm!",
    tagline: "Pre-order makanan viral",
    address: "",
    phone: "",
    email: "",
    hours: "",
  },
  hero: {
    tagline: "Pesan kue viral buat acara spesialmu",
    subtitle: "",
  },
  whyChoose: [],
  howToOrder: [],
  whatsapp: {
    url: "",
    floatingEnabled: false,
  },
  footer: {
    tagline: "",
    copyright: "",
  },
  homepageConfig: {
    latestCount: 2,
    terlarisCount: 2,
    bestSellerCount: 2,
  },
  orderAccess: {
    passwordHash: "",
    updatedAt: null,
    updatedBy: null,
  },
};