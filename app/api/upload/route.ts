import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/db/prisma";
import { getUserIdOrDemo } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function POST(request: Request) {
  const required = await getUserIdOrDemo();

  const rate = checkRateLimit(`upload:${required.userId}`, 30, 60_000);
  if (!rate.ok) {
    return NextResponse.json({ error: "Too many uploads" }, { status: 429 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only images are allowed" }, { status: 400 });
  }
  if (file.size > 20 * 1024 * 1024) {
    return NextResponse.json({ error: "Image too large (max 20MB)" }, { status: 400 });
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  const ext = path.extname(file.name) || ".jpg";
  const filename = `${randomUUID()}${ext.toLowerCase()}`;
  const filePath = path.join(uploadsDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);
  const originalUrl = `/uploads/${filename}`;

  const image = await prisma.image.create({
    data: {
      userId: required.userId,
      originalUrl,
      filename: file.name,
      mimeType: file.type,
      size: file.size
    }
  });

  return NextResponse.json({ ok: true, image });
}
