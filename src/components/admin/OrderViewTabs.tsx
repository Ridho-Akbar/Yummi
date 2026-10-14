"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const COOKIE_NAME = "yumm_order_view";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

interface OrderViewTabsProps {
  current: "calendar" | "list";
}

export function OrderViewTabs({ current }: OrderViewTabsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function rememberView(view: "calendar" | "list") {
    if (typeof document !== "undefined") {
      document.cookie = `${COOKIE_NAME}=${view};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax`;
    }
  }

  const calendarParams = new URLSearchParams();
  const y = searchParams.get("year");
  const m = searchParams.get("month");
  if (y) calendarParams.set("year", y);
  if (m) calendarParams.set("month", m);

  const listParams = new URLSearchParams();
  listParams.set("view", "list");
  const q = searchParams.get("q");
  const status = searchParams.get("status");
  const date = searchParams.get("date");
  if (q) listParams.set("q", q);
  if (status) listParams.set("status", status);
  if (date) listParams.set("date", date);

  const calendarHref = calendarParams.toString()
    ? `${pathname}?${calendarParams}`
    : pathname;
  const listHref = `${pathname}?${listParams}`;

  return (
    <div className="inline-flex rounded-yumm border border-neutral-200 bg-white p-1">
      <TabLink
        href={calendarHref}
        active={current === "calendar"}
        onClick={() => rememberView("calendar")}
      >
        Kalender
      </TabLink>
      <TabLink
        href={listHref}
        active={current === "list"}
        onClick={() => rememberView("list")}
      >
        Daftar
      </TabLink>
    </div>
  );
}

interface TabLinkProps {
  href: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function TabLink({ href, active, onClick, children }: TabLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "rounded-yumm px-5 py-2 font-display text-sm font-semibold transition-colors",
        active
          ? "bg-yumm-pink text-white"
          : "text-ink-muted hover:bg-surface-muted hover:text-ink"
      )}
    >
      {children}
    </Link>
  );
}