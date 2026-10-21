import { History } from "lucide-react";
import { ICON_SIZE } from "@/lib/icons";
import type { SettingsAuditLog } from "@/features/site/audit-queries";

interface AuditLogListProps {
  logs: SettingsAuditLog[];
}

const KEY_LABELS: Record<string, string> = {
  store_info: "Info Toko",
  hero: "Hero Section",
  why_choose: "Kenapa Pilih Kami",
  how_to_order: "Cara Pesan",
  whatsapp: "Konfigurasi WhatsApp",
  footer: "Footer",
  homepage_config: "Konfigurasi Homepage",
  order_access: "Sandi Akses Order",
};

const ACTION_LABELS: Record<string, string> = {
  update: "diperbarui",
  update_password: "sandi diperbarui",
  create: "dibuat",
  delete: "dihapus",
};

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AuditLogList({ logs }: AuditLogListProps) {
  if (logs.length === 0) {
    return (
      <div className="rounded-yumm border border-dashed border-neutral-200 px-4 py-8 text-center">
        <p className="text-sm text-ink-muted">
          Belum ada riwayat perubahan pengaturan.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {logs.map((log) => {
        const keyLabel = KEY_LABELS[log.key] ?? log.key;
        const actionLabel = ACTION_LABELS[log.action] ?? log.action;
        const actorName =
          log.changedByName ?? log.changedByEmail ?? "Tidak diketahui";

        return (
          <div
            key={log.id}
            className="flex items-start gap-3 rounded-yumm border border-neutral-100 bg-white px-4 py-3"
          >
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yumm-lilac/15 text-yumm-lilac">
              <History size={14} strokeWidth={2.5} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-ink">
                <span className="font-display font-semibold">{keyLabel}</span>{" "}
                <span className="text-ink-muted">{actionLabel}</span>
              </p>
              <p className="mt-0.5 text-xs text-ink-muted">
                oleh <span className="font-medium">{actorName}</span>
              </p>
            </div>
            <span className="shrink-0 text-[11px] text-ink-muted">
              {formatDateTime(log.createdAt)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
