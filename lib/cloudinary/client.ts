import { v2 as cloudinary } from "cloudinary";
import { env } from "@/lib/env";

if (env.CLOUDINARY_URL) {
  cloudinary.config({ cloudinary_url: env.CLOUDINARY_URL });
}

export function createUploadSignature(params: Record<string, string | number>) {
  const apiSecret = cloudinary.config().api_secret;
  if (!apiSecret) throw new Error("Cloudinary api secret not configured");
  return cloudinary.utils.api_sign_request(params, apiSecret);
}

export { cloudinary };
