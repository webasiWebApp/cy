import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const BUCKET = "product-images";

export async function POST(request: Request) {
  // Authenticate the caller
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse the uploaded file
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${Date.now()}.${ext}`;

  const { data, error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (uploadError) {
    console.error("[upload] Supabase Storage error:", uploadError);
    return NextResponse.json(
      { error: uploadError.message },
      { status: 400 }
    );
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(data.path);

  return NextResponse.json({ url: publicUrl });
}
