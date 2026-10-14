"use client";

import Link from "next/link";
import {
  Store,
  Sparkles,
  Heart,
  ListOrdered,
  MessageCircle,
  PanelBottom,
  LayoutGrid,
  Share2,
  Lock,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "store", label: "Info Toko", Icon: Store },
  { key: "hero", label: "Hero", Icon: Sparkles },
  { key: "why", label: "Kenapa Pilih", Icon: Heart },
  { key: "how", label: "Cara Pesan", Icon: ListOrdered },
  { key: "whatsapp", label: "WhatsApp", Icon: MessageCircle },
  { key: "social", label: "Sosial Media", Icon: Share2 },
  { key: "footer", label: "Footer", Icon: PanelBottom },
  { key: "homepage", label: "Homepage", Icon: LayoutGrid },
  { key: "security", label: "Keamanan", Icon: Lock },
  { key: "audit", label: "Riwayat", Icon: History },
];

interface SettingsTabsProps {
  current: string;
}

export function SettingsTabs({ current }: SettingsTabsProps) {
  return (
    <div className="scrollbar-yumm -mx-1 flex gap-1 overflow-x-auto rounded-yumm border border-neutral-200 bg-white p-1 sm:flex-wrap sm:overflow-visible">
      {TABS.map((tab) => {
        const active = current === tab.key;
        return (
          <Link
            key={tab.key}
            href={`/admin/settings?tab=${tab.key}`}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-yumm px-4 py-2",
              "font-display text-xs font-semibold transition-colors",
              active
                ? "bg-yumm-pink text-white"
                : "text-ink-muted hover:bg-surface-muted hover:text-ink"
            )}
          >
            <tab.Icon size={14} strokeWidth={active ? 2.5 : 2} />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}