import type { Database } from "./database";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Schedule = Database["public"]["Tables"]["schedule"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type PublicOrder = Database["public"]["Views"]["public_orders"]["Row"];

export type OrderStatus = Order["status"];