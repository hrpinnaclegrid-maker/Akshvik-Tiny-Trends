import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Try saving locally to public/WebsiteImages (works during local development)
    try {
      const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
      const uploadDir = path.join(process.cwd(), "public", "WebsiteImages");
      await mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);
      return NextResponse.json({ url: `/WebsiteImages/${filename}` });
    } catch (fsError: any) {
      // In serverless environments like Vercel, the local filesystem is read-only.
      // Fallback safely to a base64 Data URL so the uploaded image displays perfectly across the app.
      console.warn("Filesystem write unavailable (serverless/read-only), returning base64 Data URL fallback:", fsError?.message);
      const mimeType = file.type || "image/jpeg";
      const base64 = buffer.toString("base64");
      const dataUrl = `data:${mimeType};base64,${base64}`;
      return NextResponse.json({ url: dataUrl });
    }
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload file" }, { status: 500 });
  }
}
