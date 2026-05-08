import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { getEnhanceWebhookUrl, replicate } from "@/lib/ai/replicate";
import { env } from "@/lib/env";

const enhanceSchema = z.object({
  imageId: z.string().min(1),
  type: z.enum(["UPSCALE", "FACE_RESTORE", "DENOISE", "SHARPEN", "BACKGROUND_REMOVE", "FULL_ENHANCE"]),
  upscaleFactor: z.number().int().min(1).max(8).optional(),
  faceRestoration: z.boolean().optional(),
  denoise: z.boolean().optional(),
  sharpening: z.boolean().optional()
});

export async function POST(request: Request) {
  const required = await requireUser();
  if ("error" in required) return required.error;

  const rate = checkRateLimit(`enhance:${required.userId}`, 20, 60_000);
  if (!rate.ok) {
    return NextResponse.json({ error: "Too many enhancement requests" }, { status: 429 });
  }

  const body = await request.json();
  const parsed = enhanceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: required.userId },
    select: { credits: true }
  });
  if (!user || user.credits < 1) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
  }

  const image = await prisma.image.findFirst({
    where: { id: parsed.data.imageId, userId: required.userId }
  });
  if (!image) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  const result = await prisma.$transaction(async (tx) => {
    const enhancement = await tx.enhancement.create({
      data: {
        imageId: image.id,
        userId: required.userId,
        type: parsed.data.type,
        status: "PROCESSING",
        upscaleFactor: parsed.data.upscaleFactor ?? 2,
        faceRestoration: parsed.data.faceRestoration ?? false,
        denoise: parsed.data.denoise ?? false,
        sharpening: parsed.data.sharpening ?? false,
        startedAt: new Date()
      }
    });

    await tx.user.update({
      where: { id: required.userId },
      data: { credits: { decrement: 1 }, aiUsage: { increment: 1 } }
    });

    return enhancement;
  });

  if (replicate && env.REPLICATE_MODEL_VERSION) {
    try {
      const webhook = getEnhanceWebhookUrl(result.id);
      const prediction = await replicate.predictions.create({
        version: env.REPLICATE_MODEL_VERSION,
        input: {
          image: image.originalUrl,
          upscale: parsed.data.upscaleFactor ?? 2
        },
        ...(webhook ? { webhook } : {})
      });

      const updated = await prisma.enhancement.update({
        where: { id: result.id },
        data: { jobId: prediction.id, status: "PROCESSING" }
      });
      return NextResponse.json({ ok: true, enhancement: updated, async: true });
    } catch {
      await prisma.enhancement.update({
        where: { id: result.id },
        data: { status: "FAILED", errorMessage: "Replicate prediction creation failed" }
      });
      return NextResponse.json({ error: "Could not start AI job" }, { status: 502 });
    }
  }

  const completed = await prisma.enhancement.update({
    where: { id: result.id },
    data: {
      status: "COMPLETED",
      completedAt: new Date(),
      processingTime: result.startedAt ? (Date.now() - result.startedAt.getTime()) / 1000 : undefined
    }
  });
  await prisma.image.update({
    where: { id: image.id },
    data: { isProcessed: true, enhancedUrl: image.originalUrl }
  });

  return NextResponse.json({ ok: true, enhancement: completed, async: false });
}
