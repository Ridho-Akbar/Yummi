import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getReportData } from "@/features/reports/queries";
import { buildReportCsv } from "@/features/reports/export";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const now = new Date();

  const rawYear = Number(searchParams.get("year"));
  const rawMonth = Number(searchParams.get("month"));

  const year =
    Number.isInteger(rawYear) && rawYear >= 2000 && rawYear <= 2100
      ? rawYear
      : now.getFullYear();

  const month =
    Number.isInteger(rawMonth) && rawMonth >= 0 && rawMonth <= 11
      ? rawMonth
      : now.getMonth();

  let csv: string;
  try {
    const data = await getReportData(year, month);
    csv = buildReportCsv(data);
  } catch (err) {
    console.error("[reports/export] Failed to build report:", err);
    return NextResponse.json(
      { error: "Gagal membuat laporan." },
      { status: 500 }
    );
  }

  const monthLabel = String(month + 1).padStart(2, "0");
  const filename = `laporan-${year}-${monthLabel}.csv`;

  return new NextResponse("\uFEFF" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
