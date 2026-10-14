import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: "Format tanggal tidak valid." },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc(
    "get_product_capacity_for_date",
    { p_order_date: date }
  );

  if (error) {
    console.error("[api/capacity] RPC error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil kapasitas." },
      { status: 500 }
    );
  }

  const capacities: Record<
    string,
    {
      productId: string;
      dailyCapacity: number;
      usedQty: number;
      remaining: number;
    }
  > = {};

  for (const row of data ?? []) {
    capacities[row.product_id] = {
      productId: row.product_id,
      dailyCapacity: row.daily_capacity,
      usedQty: row.used_qty,
      remaining: row.remaining,
    };
  }

  return NextResponse.json(
    { capacities },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
