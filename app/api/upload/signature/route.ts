import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { cloudinary, createUploadSignature } from "@/lib/cloudinary/client";

export async function POST() {
  const required = await requireUser();
  if ("error" in required) return required.error;

  const rate = checkRateLimit(`upload-signature:${required.userId}`, 60, 60_000);
  if (!rate.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "ai-photo-enhancer/uploads";
  const paramsToSign = { timestamp, folder };
  const signature = createUploadSignature(paramsToSign);
  const cfg = cloudinary.config();

  return NextResponse.json({
    ok: true,
    timestamp,
    folder,
    signature,
    apiKey: cfg.api_key,
    cloudName: cfg.cloud_name
  });
}
