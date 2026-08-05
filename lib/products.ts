import { createClient } from "@/utils/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

// ─── Types ────────────────────────────────────────────────────────────────────

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  images?: string[];
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
  images?: string[] | string | null;
  whatsapp_message: string;
  created_at: string;
}

// ─── Mapping helpers ──────────────────────────────────────────────────────────

function toProduct(row: DBProduct): Product {
  let imagesArr: string[] = [];

  if (Array.isArray(row.images)) {
    imagesArr = row.images.filter(Boolean);
  } else if (typeof row.images === "string" && row.images.trim()) {
    try {
      const parsed = JSON.parse(row.images);
      if (Array.isArray(parsed)) imagesArr = parsed.filter(Boolean);
      else imagesArr = [row.images];
    } catch {
      imagesArr = [row.images];
    }
  }

  const rawImage = typeof row.image === "string" ? row.image.trim() : "";

  if (imagesArr.length === 0 && rawImage) {
    if (rawImage.startsWith("[")) {
      try {
        const parsed = JSON.parse(rawImage);
        if (Array.isArray(parsed)) imagesArr = parsed.filter(Boolean);
        else imagesArr = [rawImage];
      } catch {
        imagesArr = [rawImage];
      }
    } else {
      imagesArr = [rawImage];
    }
  }

  const primaryImage = imagesArr[0] || (rawImage.startsWith("[") ? "" : rawImage);

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    category: row.category,
    image: primaryImage,
    images: imagesArr.length > 0 ? imagesArr : (primaryImage ? [primaryImage] : []),
    whatsappMessage: row.whatsapp_message,
    createdAt: row.created_at,
  };
}

function toRow(p: Omit<Product, "id" | "createdAt">) {
  const imagesList = p.images && p.images.length > 0 ? p.images : (p.image ? [p.image] : []);
  const primaryImage = imagesList[0] || p.image || "";

  return {
    name: p.name,
    description: p.description,
    price: p.price,
    category: p.category,
    image: primaryImage,
    images: imagesList,
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
  const row = toRow(data);
  let { error } = await supabase.from(TABLE).insert(row);

  if (error && (error.message?.includes("images") || error.code === "PGRST204" || error.code === "42703")) {
    const imagesList = data.images && data.images.length > 0 ? data.images : (data.image ? [data.image] : []);
    const encodedImage = imagesList.length > 1 ? JSON.stringify(imagesList) : (imagesList[0] || data.image || "");
    const { images, ...fallbackRow } = { ...row, image: encodedImage };
    const { error: retryError } = await supabase.from(TABLE).insert(fallbackRow);
    if (retryError) throw retryError;
    return;
  }
  if (error) throw error;
}

export async function updateProduct(
  id: string,
  data: Omit<Product, "id" | "createdAt">
): Promise<void> {
  const supabase = createClient();
  const row = toRow(data);
  let { error } = await supabase.from(TABLE).update(row).eq("id", id);

  if (error && (error.message?.includes("images") || error.code === "PGRST204" || error.code === "42703")) {
    const imagesList = data.images && data.images.length > 0 ? data.images : (data.image ? [data.image] : []);
    const encodedImage = imagesList.length > 1 ? JSON.stringify(imagesList) : (imagesList[0] || data.image || "");
    const { images, ...fallbackRow } = { ...row, image: encodedImage };
    const { error: retryError } = await supabase.from(TABLE).update(fallbackRow).eq("id", id);
    if (retryError) throw retryError;
    return;
  }
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

export async function uploadMultipleProductImages(
  files: File[],
  onProgress?: (pct: number) => void
): Promise<string[]> {
  if (!files.length) return [];
  onProgress?.(10);
  const results: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const url = await uploadProductImage(files[i]);
    results.push(url);
    onProgress?.(Math.round(((i + 1) / files.length) * 90));
  }
  onProgress?.(100);
  return results;
}
