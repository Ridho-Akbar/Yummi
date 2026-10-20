import "server-only";
import { createClient } from "@/lib/supabase/server";

export interface CarouselImage {
  id: string;
  imageUrl: string;
  sortOrder: number;
}

export async function getActiveCarouselImages(): Promise<CarouselImage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("carousel_images")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    imageUrl: row.image_url,
    sortOrder: row.sort_order,
  }));
}