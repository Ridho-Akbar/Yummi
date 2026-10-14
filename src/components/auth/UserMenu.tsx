"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { signOut } from "@/features/auth/actions";
import type { CurrentUser } from "@/lib/auth";

interface UserMenuProps {
  user: CurrentUser;
}

export function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = (user.displayName ?? user.email ?? "U")
    .charAt(0)
    .toUpperCase();

  const isAdmin = user.role === "admin" || user.role === "superadmin";
  const isSuperadmin = user.role === "superadmin";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-surface-muted"
        aria-label="Menu pengguna"
      >
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={user.displayName ?? "Avatar"}
            width={36}
            height={36}
            className="rounded-full"
          />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-yumm-lilac font-display text-sm font-semibold text-white">
            {initials}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-yumm border border-neutral-200 bg-white p-2 shadow-lg">
          <div className="px-3 py-2">
            <div className="flex items-center gap-2">
              <p className="truncate font-display text-sm font-semibold text-ink">
                {user.displayName ?? "Tanpa nama"}
              </p>
              {isSuperadmin && (
                <span className="shrink-0 rounded-full bg-yumm-coral px-1.5 py-0.5 font-display text-[9px] font-bold uppercase tracking-wide text-white">
                  Super
                </span>
              )}
            </div>
            <p className="truncate text-xs text-ink-muted">{user.email}</p>
          </div>
          <hr className="my-1 border-neutral-100" />
          {isAdmin && (
            <a
              href="/admin"
              className="block rounded-lg px-3 py-2 text-sm text-ink transition-colors hover:bg-surface-muted"
            >
              Dashboard Admin
            </a>
          )}
          <form action={signOut}>
            <button
              type="submit"
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-yumm-coral transition-colors hover:bg-surface-muted"
            >
              Keluar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
