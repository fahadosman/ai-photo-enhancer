import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/session";

const checkoutSchema = z.object({
  plan: z.enum(["PRO", "BUSINESS"])
});

export async function POST(request: Request) {
  const required = await requireUser();
  if ("error" in required) return required.error;

  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  // TODO: create Paddle checkout transaction with SDK and plan mapping.
  return NextResponse.json({
    ok: true,
    plan: parsed.data.plan,
    checkoutUrl: null
  });
}
