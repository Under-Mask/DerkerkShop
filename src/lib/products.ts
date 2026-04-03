import { createSupabaseAnonServer } from "@/lib/supabase/server";

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
};

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "fallback-1",
    slug: "mono-tee",
    name: "MONO TEE",
    description:
      "A crisp black tee with a sharp silhouette. Minimal, durable, and cut for daily wear.",
    price: 29000,
    image_url: null,
  },
  {
    id: "fallback-2",
    slug: "white-canvas-tote",
    name: "WHITE CANVAS TOTE",
    description: "Heavyweight tote in clean white. Carries everything, says nothing.",
    price: 24000,
    image_url: null,
  },
  {
    id: "fallback-3",
    slug: "contrast-cap",
    name: "CONTRAST CAP",
    description: "Black cap, white embroidery. Low-profile with a tight finish.",
    price: 22000,
    image_url: null,
  },
];

export async function listProducts(): Promise<Product[]> {
  const supabase = createSupabaseAnonServer();
  if (!supabase) return FALLBACK_PRODUCTS;
  const { data, error } = await supabase
    .from("products")
    .select("id,slug,name,description,price,image_url")
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error) return FALLBACK_PRODUCTS;
  if (!data || data.length === 0) return FALLBACK_PRODUCTS;
  return data as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createSupabaseAnonServer();
  if (!supabase) return FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  const { data, error } = await supabase
    .from("products")
    .select("id,slug,name,description,price,image_url")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    return FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
  return (data as Product | null) ?? (FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? null);
}

