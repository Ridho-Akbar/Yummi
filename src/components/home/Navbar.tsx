"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SignInButton } from "@/components/auth/SignInButton";
import { UserMenu } from "@/components/auth/UserMenu";
import type { CurrentUser } from "@/lib/auth";

interface NavbarProps {
  user: CurrentUser | null;
  storeName: string; // Prop baru untuk nama toko
}

export function Navbar({ user, storeName }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/menu", label: "Menu Hari Ini" },
    { href: "/#kalender", label: "Jadwal" },
    { href: "/documentation/features", label: "Tentang Kami" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-100 bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        
        {/* Logo Dinamis */}
        <Link
          href="/"
          className="font-display text-2xl font-bold text-yumm-pink"
          onClick={() => setIsOpen(false)}
        >
          {storeName}
        </Link>

        {/* TENGAH: Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href.split("#")[0]));
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 font-display text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-yumm-pink/10 text-yumm-pink"
                    : "text-ink-muted hover:bg-surface-muted hover:text-ink"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* KANAN: CTA & User (Desktop) */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/order"
            className="rounded-full bg-yumm-pink px-6 py-2.5 font-display text-sm font-semibold text-white shadow-md shadow-yumm-pink/20 transition-all hover:-translate-y-0.5 hover:bg-yumm-coral"
          >
            Pesan Pre-Order
          </Link>
          {user ? <UserMenu user={user} /> : <SignInButton label="Masuk" />}
        </div>

        {/* MOBILE: Hamburger Button */}
        <div className="flex items-center gap-3 md:hidden">
          <Link
            href="/order"
            className="rounded-full bg-yumm-pink px-4 py-1.5 font-display text-xs font-semibold text-white"
          >
            Pesan
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-yumm p-2 text-ink-muted hover:bg-surface-muted"
            aria-label="Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE: Dropdown Menu */}
      {isOpen && (
        <div className="border-t border-neutral-100 bg-white px-4 py-4 shadow-lg md:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "rounded-yumm px-4 py-3 font-display text-sm font-semibold transition-colors",
                  pathname === link.href
                    ? "bg-yumm-pink/10 text-yumm-pink"
                    : "text-ink hover:bg-surface-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="my-2 border-t border-neutral-100" />
            <div className="px-4 py-2">
              {user ? <UserMenu user={user} /> : <SignInButton label="Masuk" />}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}