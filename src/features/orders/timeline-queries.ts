import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { OrderStatus } from "./queries";
import type { OrderTimelineEntry } from "./timeline-types";

export async function getOrderTimeline(
  orderId: string
): Promise<OrderTimelineEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_order_timeline", {
    p_order_id: orderId,
  });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    fromStatus: row.from_status as OrderStatus,
    toStatus: row.to_status as OrderStatus,
    changedBy: row.changed_by,
    changedByName: row.changed_by_name,
    changedByEmail: row.changed_by_email,
    createdAt: row.created_at,
  }));
}
