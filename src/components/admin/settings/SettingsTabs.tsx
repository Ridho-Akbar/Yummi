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
  ImageIcon,
  HelpCircle,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
  {
    title: "Profil & Kontak",
    items: [
      { key: "store", label: "Info Toko", Icon: Store, desc: "Nama, alamat, jam buka" },
      { key: "whatsapp", label: "WhatsApp", Icon: MessageCircle, desc: "Nomor chat & tombol" },
      { key: "social", label: "Sosial Media", Icon: Share2, desc: "Instagram, TikTok, dll" },
    ],
  },
  {
    title: "Halaman Depan",
    items: [
      { key: "hero", label: "Bagian Hero", Icon: Sparkles, desc: "Judul utama paling atas" },
      { key: "why", label: "Kenapa Pilih", Icon: Heart, desc: "Alasan pelanggan memilih" },
      { key: "how", label: "Cara Pesan", Icon: ListOrdered, desc: "Langkah-langkah pesan" },
      { key: "homepage", label: "Pengaturan Produk", Icon: LayoutGrid, desc: "Jumlah produk yang tampil" },
      { key: "pins", label: "Pin Produk", Icon: Star, desc: "Pilih produk unggulan" },
      { key: "faq", label: "FAQ", Icon: HelpCircle, desc: "Pertanyaan umum pelanggan" },
      { key: "footer", label: "Footer", Icon: PanelBottom, desc: "Teks paling bawah" },
    ],
  },
  {
    title: "Halaman Menu",
    items: [
      { key: "carousel", label: "Carousel Menu", Icon: ImageIcon, desc: "Gambar promo halaman menu" },
    ],
  },
  {
    title: "Sistem & Keamanan",
    items: [
      { key: "security", label: "Keamanan", Icon: Lock, desc: "Sandi akses pesanan" },
      { key: "audit", label: "Riwayat", Icon: History, desc: "Catatan perubahan" },
    ],
  },
];

interface SettingsTabsProps {
  current: string;
}

export function SettingsTabs({ current }: SettingsTabsProps) {
  return (
    <>
      {/* MOBILE: Horizontal Scroll */}
      <div className="scrollbar-none -mx-1 flex gap-1.5 overflow-x-auto pb-2 lg:hidden">
        {NAV_GROUPS.flatMap((g) => g.items).map((tab) => {
          const active = current === tab.key;
          return (
            <Link
              key={tab.key}
              href={`/admin/settings?tab=${tab.key}`}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2",
                "font-display text-xs font-semibold transition-colors",
                active
                  ? "bg-yumm-pink text-white shadow-md shadow-yumm-pink/20"
                  : "bg-white text-ink-muted hover:bg-surface-muted hover:text-ink"
              )}
            >
              <tab.Icon size={14} strokeWidth={active ? 2.5 : 2} />
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* DESKTOP: Vertical Sidebar dengan Scroll Mandiri */}
      <nav className="scrollbar-yumm sticky top-8 hidden max-h-[calc(100vh-6rem)] w-64 shrink-0 flex-col gap-6 overflow-y-auto pb-8 pr-2 lg:flex">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="space-y-1">
            <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
              {group.title}
            </h3>
            {group.items.map((tab) => {
              const active = current === tab.key;
              return (
                <Link
                  key={tab.key}
                  href={`/admin/settings?tab=${tab.key}`}
                  className={cn(
                    "group flex items-start gap-3 rounded-yumm px-3 py-2.5 transition-colors",
                    active ? "bg-yumm-pink/10" : "hover:bg-white"
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors",
                      active
                        ? "bg-yumm-pink text-white"
                        : "bg-surface-muted text-ink-muted group-hover:bg-neutral-200"
                    )}
                  >
                    <tab.Icon size={14} strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <p
                      className={cn(
                        "font-display text-sm font-bold",
                        active ? "text-yumm-pink" : "text-ink"
                      )}
                    >
                      {tab.label}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-tight text-ink-muted">
                      {tab.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </>
  );
}