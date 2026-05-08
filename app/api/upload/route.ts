import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/security/rate-limit";

const uploadSchema = z.object({
  originalUrl: z.string().url(),
  filename: z.string().min(1).max(255),
  mimeType: z.string().min(3).max(100),
  size: z.number().int().positive().max(20 * 1024 * 1024)
});

export async function POST(request: Request) {
  const required = await requireUser();
  if ("error" in required) return required.error;

  const rate = checkRateLimit(`upload:${required.userId}`, 30, 60_000);
  if (!rate.ok) {
    return NextResponse.json({ error: "Too many uploads" }, { status: 429 });
  }

  const body = await request.json();
  const parsed = uploadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const image = await prisma.image.create({
    data: {
      userId: required.userId,
      originalUrl: parsed.data.originalUrl,
      filename: parsed.data.filename,
      mimeType: parsed.data.mimeType,
      size: parsed.data.size
    }
  });

  return NextResponse.json({ ok: true, image });
}
