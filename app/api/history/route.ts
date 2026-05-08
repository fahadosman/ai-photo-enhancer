import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/session";

export async function GET(request: Request) {
  const required = await requireUser();
  if ("error" in required) return required.error;

  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));
  const pageSize = Math.min(50, Math.max(1, Number(url.searchParams.get("pageSize") ?? "10")));
  const skip = (page - 1) * pageSize;

  const [items, total] = await Promise.all([
    prisma.enhancement.findMany({
      where: { userId: required.userId },
      orderBy: { createdAt: "desc" },
      include: {
        image: {
          select: { id: true, originalUrl: true, enhancedUrl: true, filename: true }
        }
      },
      skip,
      take: pageSize
    }),
    prisma.enhancement.count({ where: { userId: required.userId } })
  ]);

  return NextResponse.json({
    ok: true,
    data: items,
    meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) }
  });
}
