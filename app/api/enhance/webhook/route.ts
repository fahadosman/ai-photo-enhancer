import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/env";

type ReplicateWebhookPayload = {
  status?: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  output?: unknown;
  error?: string;
};

function extractOutputUrl(output: unknown): string | null {
  if (typeof output === "string") return output;
  if (Array.isArray(output) && typeof output[0] === "string") return output[0];
  return null;
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const enhancementId = url.searchParams.get("enhancementId");
  const secret = url.searchParams.get("secret");

  if (!enhancementId || !secret || secret !== env.ENHANCE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized webhook" }, { status: 401 });
  }

  const payload = (await request.json()) as ReplicateWebhookPayload;
  const now = new Date();

  if (payload.status === "failed" || payload.status === "canceled") {
    await prisma.enhancement.update({
      where: { id: enhancementId },
      data: {
        status: "FAILED",
        completedAt: now,
        errorMessage: payload.error ?? "AI processing failed"
      }
    });
    return NextResponse.json({ ok: true });
  }

  if (payload.status === "succeeded") {
    const enhancement = await prisma.enhancement.findUnique({
      where: { id: enhancementId },
      select: { imageId: true, startedAt: true }
    });
    if (!enhancement) {
      return NextResponse.json({ error: "Enhancement not found" }, { status: 404 });
    }
    const outputUrl = extractOutputUrl(payload.output);
    await prisma.$transaction(async (tx) => {
      await tx.enhancement.update({
        where: { id: enhancementId },
        data: {
          status: "COMPLETED",
          completedAt: now,
          processingTime: enhancement.startedAt
            ? (now.getTime() - enhancement.startedAt.getTime()) / 1000
            : undefined
        }
      });
      await tx.image.update({
        where: { id: enhancement.imageId },
        data: { isProcessed: true, enhancedUrl: outputUrl ?? undefined }
      });
    });
  }

  return NextResponse.json({ ok: true });
}
