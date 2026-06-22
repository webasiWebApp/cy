// Vercel Blob has been removed. Image uploads now go directly to
// Supabase Storage via uploadProductImage() in lib/products.ts.
import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ message: "Storage is handled by Supabase." });
}
