import { createClient } from "@/utils/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  whatsappMessage: string;
  createdAt?: string;
}

// DB row uses snake_case (Postgres convention)
interface DBProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  whatsapp_message: string;
  created_at: string;
}

// ─── Mapping helpers ──────────────────────────────────────────────────────────

function toProduct(row: DBProduct): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    category: row.category,
    image: row.image,
    whatsappMessage: row.whatsapp_message,
    createdAt: row.created_at,
  };
}

function toRow(p: Omit<Product, "id" | "createdAt">) {
  return {
    name: p.name,
    description: p.description,
    price: p.price,
    category: p.category,
    image: p.image,
    whatsapp_message: p.whatsappMessage,
  };
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────

const TABLE = "products";

/**
 * Real-time subscription — fires callback immediately with current data,
 * then on every INSERT / UPDATE / DELETE.
 * Returns an unsubscribe function.
 *
 * NOTE: Enable Realtime for the `products` table in your Supabase dashboard:
 * Database → Replication → Tables → enable `products`.
 */
export function subscribeToProducts(
  callback: (products: Product[]) => void
): () => void {
  const supabase = createClient();
  let channel: RealtimeChannel;

  const fetchAll = async () => {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) callback((data as DBProduct[]).map(toProduct));
  };

  // Initial load
  fetchAll();

  // Live updates
  channel = supabase
    .channel("products-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: TABLE },
      () => fetchAll()
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export async function addProduct(
  data: Omit<Product, "id" | "createdAt">
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from(TABLE).insert(toRow(data));
  if (error) throw error;
}

export async function updateProduct(
  id: string,
  data: Omit<Product, "id" | "createdAt">
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from(TABLE).update(toRow(data)).eq("id", id);
  if (error) throw error;
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}

// ─── Storage ──────────────────────────────────────────────────────────────────

/**
 * Uploads an image to Supabase Storage → `product-images` bucket.
 * Returns the public URL.
 *
 * Bucket setup in Supabase dashboard:
 *   Storage → New bucket → name: "product-images" → Public: ON
 */
export async function uploadProductImage(
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${Date.now()}.${ext}`;

  // Supabase JS v2 doesn't expose upload progress natively;
  // simulate 0 → 50 → 100 so the progress bar still animates.
  onProgress?.(10);

  const { data, error } = await supabase.storage
    .from("product-images")
    .upload(path, file, { upsert: false, cacheControl: "3600" });

  onProgress?.(90);

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(data.path);

  onProgress?.(100);
  return publicUrl;
}
