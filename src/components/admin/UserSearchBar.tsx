"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_SIZE } from "@/lib/icons";
import type { UserRole } from "@/features/users/types";

interface UserSearchBarProps {
  initialQuery: string;
  initialRole: UserRole | undefined;
}

const ROLE_FILTERS: { value: UserRole | undefined; label: string }[] = [
  { value: undefined, label: "Semua" },
  { value: "superadmin", label: "Superadmin" },
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
];

export function UserSearchBar({
  initialQuery,
  initialRole,
}: UserSearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [role, setRole] = useState<UserRole | undefined>(initialRole);
  const isFirstRender = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (role) params.set("role", role);
      const qs = params.toString();
      router.replace(qs ? `/admin/users?${qs}` : "/admin/users");
    }, 350);

    return () => clearTimeout(timer);
  }, [query, role, router]);

  useEffect(() => {
    function isTypingTarget(target: EventTarget | null): boolean {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target.isContentEditable
      );
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "/" && !isTypingTarget(e.target)) {
        e.preventDefault();
        inputRef.current?.focus();
        return;
      }
      if (e.key === "Escape") {
        const input = inputRef.current;
        if (input && document.activeElement === input) {
          if (query) setQuery("");
          else input.blur();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [query]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          inputMode="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama atau email... (tekan / untuk fokus)"
          className="w-full rounded-yumm border border-neutral-200 bg-white px-4 py-3 pl-11 pr-14 font-body text-sm text-ink placeholder:text-ink-muted/60 focus:border-yumm-pink focus:outline-hidden focus:ring-2 focus:ring-yumm-pink/20"
        />
        <Search
          size={ICON_SIZE.md}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink-muted transition-colors hover:bg-surface-muted"
            aria-label="Hapus pencarian"
          >
            <X size={ICON_SIZE.sm} />
          </button>
        ) : (
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-neutral-200 bg-surface-muted px-2 py-0.5 font-mono text-[10px] font-semibold text-ink-muted sm:inline-block">
            /
          </kbd>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {ROLE_FILTERS.map((filter) => {
          const active = role === filter.value;
          return (
            <button
              key={filter.label}
              type="button"
              onClick={() => setRole(filter.value)}
              className={cn(
                "rounded-full px-4 py-1.5 font-display text-xs font-semibold transition-colors",
                active
                  ? "bg-yumm-pink text-white"
                  : "bg-white text-ink-muted hover:text-ink"
              )}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}