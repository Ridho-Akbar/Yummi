import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types";
import type {
  HomepageCategory,
  HomepagePin,
  HomepageProduct,
  HomepageData,
} from "./types";

// ============================================
// ADMIN QUERIES
// ============================================

export async function getAllPins(): Promise<HomepagePin[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("homepage_pins")
    .select("*")
    .order("category")
    .order("sort_order");

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    category: row.category as HomepageCategory,
    productId: row.product_id,
    sortOrder: row.sort_order,
  }));
}

export async function getAllProductsForPin(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_available", true)
    .order("name");

  if (error) throw error;
  return data ?? [];
}

// ============================================
// SHARED HELPERS
// ============================================

function mapToHomepageProduct(
  product: Product,
  category: HomepageCategory
): HomepageProduct {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    imageUrl: product.image_url,
    minOrderQty: product.min_order_qty,
    category,
  };
}

async function fetchProductsByIds(
  ids: string[],
  category: HomepageCategory
): Promise<HomepageProduct[]> {
  if (ids.length === 0) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .in("id", ids)
    .eq("is_available", true);

  if (error) throw error;

  // preserve original order
  const map = new Map((data ?? []).map((p) => [p.id, p]));
  const ordered: HomepageProduct[] = [];
  for (const id of ids) {
    const product = map.get(id);
    if (product) ordered.push(mapToHomepageProduct(product, category));
  }
  return ordered;
}

async function getTopSellingProducts(
  category: HomepageCategory,
  days: number | null,
  limit: number,
  excludeIds: Set<string> = new Set()
): Promise<HomepageProduct[]> {
  if (limit <= 0) return [];

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_top_selling_products", {
    p_days: days,
    p_limit: limit + excludeIds.size + 5,
  });

  if (error) {
    console.error("[getTopSellingProducts] rpc error:", error);
    return [];
  }

  const ids = (data ?? [])
    .map((row) => row.product_id as string)
    .filter((id) => !excludeIds.has(id))
    .slice(0, limit);

  return fetchProductsByIds(ids, category);
}

async function getLatestProducts(
  limit: number,
  excludeIds: Set<string> = new Set()
): Promise<HomepageProduct[]> {
  if (limit <= 0) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_available", true)
    .order("created_at", { ascending: false })
    .limit(limit + excludeIds.size + 5);

  if (error) throw error;

  return (data ?? [])
    .filter((p) => !excludeIds.has(p.id))
    .slice(0, limit)
    .map((p) => mapToHomepageProduct(p, "latest"));
}

async function resolveCategory(
  category: HomepageCategory,
  pinnedIds: string[],
  totalCount: number,
  fallback: (
    needed: number,
    exclude: Set<string>
  ) => Promise<HomepageProduct[]>
): Promise<HomepageProduct[]> {
  if (totalCount <= 0) return [];

  const pinnedSlice = pinnedIds.slice(0, totalCount);
  const pinnedProducts = await fetchProductsByIds(pinnedSlice, category);

  if (pinnedProducts.length >= totalCount) {
    return pinnedProducts.slice(0, totalCount);
  }

  const excludeSet = new Set(pinnedProducts.map((p) => p.id));
  const needed = totalCount - pinnedProducts.length;
  const fallbackProducts = await fallback(needed, excludeSet);

  return [...pinnedProducts, ...fallbackProducts].slice(0, totalCount);
}

// ============================================
// PUBLIC QUERY
// ============================================

export async function getHomepageData(): Promise<HomepageData> {
  const supabase = await createClient();

  const { data: configRow } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "homepage_config")
    .maybeSingle();

  const config = (configRow?.value as Record<string, number> | null) ?? {};
  const latestCount = config.latestCount ?? 2;
  const terlarisCount = config.terlarisCount ?? 2;
  const bestSellerCount = config.bestSellerCount ?? 2;

  const pins = await getAllPins();

  const pinnedLatest = pins
    .filter((p) => p.category === "latest")
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((p) => p.productId);

  const pinnedTerlaris = pins
    .filter((p) => p.category === "terlaris")
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((p) => p.productId);

  const pinnedBestSeller = pins
    .filter((p) => p.category === "best_seller")
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((p) => p.productId);

  const [latest, terlaris, bestSeller] = await Promise.all([
    resolveCategory(
      "latest",
      pinnedLatest,
      latestCount,
      (needed, exclude) => getLatestProducts(needed, exclude)
    ),
    resolveCategory(
      "terlaris",
      pinnedTerlaris,
      terlarisCount,
      (needed, exclude) =>
        getTopSellingProducts("terlaris", 30, needed, exclude)
    ),
    resolveCategory(
      "best_seller",
      pinnedBestSeller,
      bestSellerCount,
      (needed, exclude) =>
        getTopSellingProducts("best_seller", null, needed, exclude)
    ),
  ]);

  return { latest, terlaris, bestSeller };
}
