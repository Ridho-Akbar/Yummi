import type { OrderStatus } from "./queries";

export interface OrderTimelineEntry {
  id: string;
  fromStatus: OrderStatus;
  toStatus: OrderStatus;
  changedBy: string | null;
  changedByName: string | null;
  changedByEmail: string | null;
  createdAt: string;
}
