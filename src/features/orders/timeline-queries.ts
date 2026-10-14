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


  interface TimelineRow {
    id: string;
    from_status: string;
    to_status: string;
    changed_by: string | null;
    changed_by_name: string | null;
    changed_by_email: string | null;
    created_at: string;
  }
  
  return (data ?? []).map((row: TimelineRow) => ({
    id: row.id,
    fromStatus: row.from_status as OrderStatus,
    toStatus: row.to_status as OrderStatus,
    changedBy: row.changed_by,
    changedByName: row.changed_by_name,
    changedByEmail: row.changed_by_email,
    createdAt: row.created_at,
  }));
}
