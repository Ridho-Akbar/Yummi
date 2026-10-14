export type HomepageCategory = "latest" | "terlaris" | "best_seller";

export interface HomepagePin {
  id: string;
  category: HomepageCategory;
  productId: string;
  sortOrder: number;
}

export interface HomepageProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  minOrderQty: number;
  category: HomepageCategory;
}

export interface HomepageData {
  latest: HomepageProduct[];
  terlaris: HomepageProduct[];
  bestSeller: HomepageProduct[];
}

export const HOMEPAGE_CATEGORY_INFO: Record<
  HomepageCategory,
  { label: string; description: string }
> = {
  latest: {
    label: "Terbaru",
    description: "Produk yang baru ditambahkan ke katalog.",
  },
  best_seller: {
    label: "Best Seller",
    description: "Produk paling banyak dipesan sepanjang masa.",
  },
  terlaris: {
    label: "Terlaris",
    description: "Produk paling banyak dipesan dalam 30 hari terakhir.",
  },
};
