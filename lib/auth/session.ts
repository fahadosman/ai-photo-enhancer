import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";

export async function requireUser() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  return { userId };
}

export async function getUserIdOrDemo() {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) return { userId: session.user.id };

  const demo = await prisma.user.upsert({
    where: { email: "demo@local.ai-photo-enhancer" },
    update: {},
    create: {
      email: "demo@local.ai-photo-enhancer",
      name: "Demo User",
      credits: 100000
    },
    select: { id: true }
  });
  return { userId: demo.id };
}

export async function requireAdmin() {
  const required = await requireUser();
  if ("error" in required) return required;
  const user = await prisma.user.findUnique({
    where: { id: required.userId },
    select: { role: true }
  });
  if (user?.role !== "ADMIN") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return required;
}
