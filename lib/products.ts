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
  let pollInterval: NodeJS.Timeout;

  const fetchAll = async () => {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false });
      
    if (error) {
      console.error("Supabase fetch error (Check RLS policies):", error);
      return;
    }
    
    if (data) {
      callback((data as DBProduct[]).map(toProduct));
    }
  };

  // Initial load
  fetchAll();

  // Polling fallback (every 5 seconds) in case Realtime isn't enabled in the dashboard
  pollInterval = setInterval(() => {
    fetchAll();
  }, 5000);

  // Live updates via Supabase Realtime
  channel = supabase
    .channel("products-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: TABLE },
      () => fetchAll()
    )
    .subscribe();

  return () => {
    clearInterval(pollInterval);
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
  onProgress?.(10);

  const body = new FormData();
  body.append("file", file);

  onProgress?.(40);

  const res = await fetch("/api/upload", { method: "POST", body });

  onProgress?.(85);

  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error ?? `Upload failed (${res.status})`);
  }

  const { url } = await res.json();
  onProgress?.(100);
  return url as string;
}
