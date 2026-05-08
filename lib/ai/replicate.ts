import Replicate from "replicate";
import { env } from "@/lib/env";

export const replicate = env.REPLICATE_API_TOKEN
  ? new Replicate({ auth: env.REPLICATE_API_TOKEN })
  : null;

export function getEnhanceWebhookUrl(enhancementId: string): string | null {
  if (!env.NEXT_PUBLIC_APP_URL || !env.ENHANCE_WEBHOOK_SECRET) return null;
  const base = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  const search = new URLSearchParams({
    enhancementId,
    secret: env.ENHANCE_WEBHOOK_SECRET
  });
  return `${base}/api/enhance/webhook?${search.toString()}`;
}
