import "server-only";

interface OrderExportRow {
  order_code: string;
  order_date: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string | null;
  items: { name?: string; qty?: number; price?: number }[];
  total: number;
  status: string;
  payment_status: string;
  amount_paid: number;
  note: string | null;
  created_at: string;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Dikonfirmasi",
  done: "Selesai",
  cancelled: "Dibatalkan",
};

const PAYMENT_LABELS: Record<string, string> = {
  unpaid: "Belum bayar",
  dp: "DP",
  paid: "Lunas",
};

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (
    str.includes(",") ||
    str.includes('"') ||
    str.includes("\n") ||
    str.includes("\r")
  ) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dd = String(d).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  return `${dd}/${mm}/${y}`;
}

function formatDateTime(iso: string): string {
  const date = new Date(iso);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
}

function formatItems(items: OrderExportRow["items"]): string {
  if (!Array.isArray(items)) return "";
  return items
    .map((item) => {
      const name = item.name ?? "Produk tidak dikenal";
      const qty = item.qty ?? 0;
      return `${name} x${qty}`;
    })
    .join("; ");
}

export function buildOrdersCsv(rows: OrderExportRow[]): string {
  const headers = [
    "Kode Pesanan",
    "Tanggal Acara",
    "Nama Pelanggan",
    "No HP",
    "Alamat",
    "Produk",
    "Total",
    "Status Pesanan",
    "Status Bayar",
    "Jumlah Dibayar",
    "Sisa",
    "Catatan",
    "Dibuat Pada",
  ];

  const lines: string[] = [headers.map(csvEscape).join(",")];

  for (const row of rows) {
    const total = Number(row.total) || 0;
    const paid = Number(row.amount_paid) || 0;
    const remaining = total - paid;

    lines.push(
      [
        csvEscape(row.order_code),
        csvEscape(formatDate(row.order_date)),
        csvEscape(row.customer_name),
        csvEscape(row.customer_phone),
        csvEscape(row.customer_address ?? ""),
        csvEscape(formatItems(row.items)),
        csvEscape(total),
        csvEscape(STATUS_LABELS[row.status] ?? row.status),
        csvEscape(PAYMENT_LABELS[row.payment_status] ?? row.payment_status),
        csvEscape(paid),
        csvEscape(remaining > 0 ? remaining : 0),
        csvEscape(row.note ?? ""),
        csvEscape(formatDateTime(row.created_at)),
      ].join(",")
    );
  }

  // CRLF line ending for Excel compatibility
  return lines.join("\r\n");
}
