import "server-only";

const API_BASE = "https://api.telegram.org";

interface SendResult {
  ok: boolean;
  error?: string;
}

export async function sendTelegramMessage(
  text: string,
  options?: {
    parseMode?: "HTML" | "Markdown";
    disableNotification?: boolean;
  }
): Promise<SendResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn(
      "[telegram] TELEGRAM_BOT_TOKEN atau TELEGRAM_CHAT_ID belum di-set."
    );
    return { ok: false, error: "Konfigurasi Telegram belum lengkap." };
  }

  try {
    const res = await fetch(`${API_BASE}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: options?.parseMode ?? "HTML",
        disable_notification: options?.disableNotification ?? false,
        disable_web_page_preview: true,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[telegram] Gagal kirim:", res.status, body);
      return { ok: false, error: `HTTP ${res.status}` };
    }

    return { ok: true };
  } catch (err) {
    console.error("[telegram] Network error:", err);
    return { ok: false, error: "Network error" };
  }
}

interface NewOrderNotification {
  orderCode: string;
  customerName: string;
  customerPhone: string;
  orderDate: string;
  total: number;
  items: { name: string; qty: number }[];
  note: string | null;
  isAnonymous: boolean;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatRupiah(amount: number): string {
  return "Rp" + amount.toLocaleString("id-ID");
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function notifyNewOrder(
  order: NewOrderNotification,
  siteUrl: string
): Promise<SendResult> {
  const itemsList = order.items
    .map((i) => `  • ${escapeHtml(i.name)} × ${i.qty}`)
    .join("\n");

  const lines = [
    "<b>🍰 Pesanan Baru Masuk!</b>",
    "",
    `<b>Kode:</b> <code>${escapeHtml(order.orderCode)}</code>`,
    `<b>Nama:</b> ${escapeHtml(order.customerName)}${order.isAnonymous ? " (anonim)" : ""}`,
    `<b>HP:</b> ${escapeHtml(order.customerPhone)}`,
    `<b>Tanggal acara:</b> ${escapeHtml(formatDate(order.orderDate))}`,
    `<b>Total:</b> ${formatRupiah(order.total)}`,
    "",
    "<b>Produk:</b>",
    itemsList,
  ];

  if (order.note) {
    lines.push("", "<b>Catatan:</b>", `<i>${escapeHtml(order.note)}</i>`);
  }

  const adminUrl = `${siteUrl}/admin/orders/${order.orderCode}`;
    lines.push("", `🔗 ${adminUrl}`);

  return sendTelegramMessage(lines.join("\n"));
}

interface StatusChangeNotification {
  orderCode: string;
  customerName: string;
  fromStatus: string;
  toStatus: string;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Dikonfirmasi",
  done: "Selesai",
  cancelled: "Dibatalkan",
};

export async function notifyStatusChange(
  data: StatusChangeNotification,
  siteUrl: string
): Promise<SendResult> {
  const fromLabel = STATUS_LABELS[data.fromStatus] ?? data.fromStatus;
  const toLabel = STATUS_LABELS[data.toStatus] ?? data.toStatus;

  const lines = [
    "<b>📝 Status pesanan berubah</b>",
    "",
    `<b>Kode:</b> <code>${escapeHtml(data.orderCode)}</code>`,
    `<b>Pelanggan:</b> ${escapeHtml(data.customerName)}`,
    `<b>Status:</b> ${fromLabel} → ${toLabel}`,
    "",
    `🔗 ${siteUrl}/admin/orders/${data.orderCode}`,
  ];

  return sendTelegramMessage(lines.join("\n"), { disableNotification: true });
}