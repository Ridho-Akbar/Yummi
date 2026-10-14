import "server-only";
import type { ReportData } from "./types";

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

function row(cells: unknown[]): string {
  return cells.map(csvEscape).join(",");
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dd = String(d).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  return `${dd}/${mm}/${y}`;
}

function formatRupiah(value: number): string {
  return value.toLocaleString("id-ID");
}

export function buildReportCsv(data: ReportData): string {
  const lines: string[] = [];

  // Header
  lines.push(row(["Laporan Yumm!"]));
  lines.push(row([`Periode: ${data.periodLabel}`]));
  lines.push(
    row([`Rentang: ${formatDate(data.startDate)} - ${formatDate(data.endDate)}`])
  );
  lines.push("");

  // Ringkasan
  lines.push(row(["RINGKASAN"]));
  lines.push(row(["Metrik", "Nilai"]));
  lines.push(row(["Total Pesanan", data.periodOrderCount]));
  lines.push(row(["Total Pendapatan", formatRupiah(data.periodRevenue)]));
  lines.push("");

  // Pendapatan 12 bulan terakhir
  lines.push(row(["PENDAPATAN 12 BULAN TERAKHIR"]));
  lines.push(row(["Bulan", "Jumlah Pesanan", "Pendapatan"]));
  for (const m of data.monthlyRevenue) {
    lines.push(
      row([m.monthLabel, m.orderCount, formatRupiah(m.revenue)])
    );
  }
  lines.push("");

  // Produk terlaris
  lines.push(row([`PRODUK TERLARIS — ${data.periodLabel}`]));
  lines.push(
    row(["Peringkat", "Nama Produk", "Total Qty", "Total Pendapatan"])
  );
  if (data.topProducts.length === 0) {
    lines.push(row(["-", "Belum ada produk terjual", 0, 0]));
  } else {
    data.topProducts.forEach((p, idx) => {
      lines.push(
        row([
          idx + 1,
          p.productName,
          p.totalQty,
          formatRupiah(p.totalRevenue),
        ])
      );
    });
  }
  lines.push("");

  // Pelanggan teratas
  lines.push(row([`PELANGGAN TERATAS — ${data.periodLabel}`]));
  lines.push(
    row([
      "Peringkat",
      "Nama Pelanggan",
      "No HP",
      "Jumlah Pesanan",
      "Total Belanja",
    ])
  );
  if (data.topCustomers.length === 0) {
    lines.push(row(["-", "Belum ada pelanggan", "-", 0, 0]));
  } else {
    data.topCustomers.forEach((c, idx) => {
      lines.push(
        row([
          idx + 1,
          c.customerName,
          c.customerPhone,
          c.orderCount,
          formatRupiah(c.totalSpent),
        ])
      );
    });
  }

  return lines.join("\r\n");
}