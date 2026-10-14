import "server-only";
import { createClient } from "@/lib/supabase/server";
import {
  SETTINGS_DEFAULTS,
  type SiteSettings,
  type StoreInfo,
  type HeroContent,
  type WhyChooseItem,
  type HowToOrderItem,
  type WhatsappConfig,
  type FooterContent,
  type HomepageConfig,
  type OrderAccess,
} from "./types";

async function readSettings(): Promise<Record<string, unknown>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value");

  if (error) throw error;

  const map: Record<string, unknown> = {};
  for (const row of data ?? []) {
    map[row.key] = row.value;
  }
  return map;
}

function mergeSettings(raw: Record<string, unknown>): SiteSettings {
  return {
    storeInfo: {
      ...SETTINGS_DEFAULTS.storeInfo,
      ...(raw.store_info as Partial<StoreInfo> | undefined),
    },
    hero: {
      ...SETTINGS_DEFAULTS.hero,
      ...(raw.hero as Partial<HeroContent> | undefined),
    },
    whyChoose: Array.isArray(raw.why_choose)
      ? (raw.why_choose as WhyChooseItem[])
      : SETTINGS_DEFAULTS.whyChoose,
    howToOrder: Array.isArray(raw.how_to_order)
      ? (raw.how_to_order as HowToOrderItem[])
      : SETTINGS_DEFAULTS.howToOrder,
    whatsapp: {
      ...SETTINGS_DEFAULTS.whatsapp,
      ...(raw.whatsapp as Partial<WhatsappConfig> | undefined),
    },
    footer: {
      ...SETTINGS_DEFAULTS.footer,
      ...(raw.footer as Partial<FooterContent> | undefined),
    },
    homepageConfig: {
      ...SETTINGS_DEFAULTS.homepageConfig,
      ...(raw.homepage_config as Partial<HomepageConfig> | undefined),
    },
    orderAccess: {
      ...SETTINGS_DEFAULTS.orderAccess,
      ...(raw.order_access as Partial<OrderAccess> | undefined),
    },
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const raw = await readSettings();
  return mergeSettings(raw);
}

export async function getSiteSettingsRaw(): Promise<Record<string, unknown>> {
  return readSettings();
}

export async function getOrderPasswordHash(): Promise<string> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "order_access")
    .maybeSingle();

  const value = (data?.value as { passwordHash?: string } | null) ?? null;
  return value?.passwordHash ?? "";
}
