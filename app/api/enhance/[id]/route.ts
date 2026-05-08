import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/session";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const required = await requireUser();
  if ("error" in required) return required.error;
  const { id } = await params;

  const enhancement = await prisma.enhancement.findFirst({
    where: { id, userId: required.userId },
    include: {
      image: { select: { id: true, originalUrl: true, enhancedUrl: true, filename: true } }
    }
  });
  if (!enhancement) {
    return NextResponse.json({ error: "Enhancement not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, enhancement });
}
