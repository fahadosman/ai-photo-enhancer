import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/session";

export async function GET() {
  const required = await requireAdmin();
  if ("error" in required) return required.error;

  const [users, enhancements, images, activeSubs] = await Promise.all([
    prisma.user.count(),
    prisma.enhancement.count(),
    prisma.image.count(),
    prisma.subscription.count({ where: { status: "ACTIVE" } })
  ]);

  return NextResponse.json({ ok: true, stats: { users, enhancements, images, activeSubs } });
}
