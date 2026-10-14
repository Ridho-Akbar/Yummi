import type { RoleChangeLog } from "@/features/users/types";

interface RoleChangeLogListProps {
  logs: RoleChangeLog[];
}

export function RoleChangeLogList({ logs }: RoleChangeLogListProps) {
  if (logs.length === 0) {
    return (
      <p className="text-sm text-ink-muted">
        Belum ada perubahan role yang tercatat.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {logs.map((log) => (
        <div
          key={log.id}
          className="rounded-yumm border border-neutral-100 px-4 py-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm font-semibold text-ink">
                {log.userDisplayName ?? log.userEmail ?? "Tanpa nama"}
              </p>
              <p className="mt-0.5 text-xs text-ink-muted">
                {log.newRole === "admin" ? "Dijadikan admin" : "Akses admin dicabut"}{" "}
                oleh {log.changedByDisplayName ?? log.changedByEmail ?? "sistem"}
              </p>
            </div>
            <span className="shrink-0 text-[11px] text-ink-muted">
              {new Date(log.createdAt).toLocaleString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}