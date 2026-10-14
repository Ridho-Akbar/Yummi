import Link from "next/link";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams: Record<string, string | undefined>;
}

export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  function buildHref(page: number): string {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value && key !== "page") params.set(key, value);
    }
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `${baseUrl}?${qs}` : baseUrl;
  }

  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <nav
      className="flex items-center justify-center gap-1 pt-4"
      aria-label="Pagination"
    >
      <PageLink
        href={buildHref(currentPage - 1)}
        disabled={currentPage <= 1}
        label="←"
      />
      {pages.map((page, index) =>
        page === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="px-3 py-2 text-sm text-ink-muted"
          >
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={buildHref(page)}
            className={cn(
              "rounded-yumm px-3.5 py-2 font-display text-sm font-semibold transition-colors",
              page === currentPage
                ? "bg-yumm-pink text-white"
                : "bg-white text-ink-muted hover:text-ink"
            )}
          >
            {page}
          </Link>
        )
      )}
      <PageLink
        href={buildHref(currentPage + 1)}
        disabled={currentPage >= totalPages}
        label="→"
      />
    </nav>
  );
}

function PageLink({
  href,
  disabled,
  label,
}: {
  href: string;
  disabled: boolean;
  label: string;
}) {
  if (disabled) {
    return (
      <span className="rounded-yumm bg-white px-3.5 py-2 font-display text-sm font-semibold text-ink-muted/40">
        {label}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className="rounded-yumm bg-white px-3.5 py-2 font-display text-sm font-semibold text-ink-muted transition-colors hover:text-ink"
    >
      {label}
    </Link>
  );
}

function getVisiblePages(
  current: number,
  total: number
): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");

  pages.push(total);

  return pages;
}
