import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  const signature = request.headers.get("paddle-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }
  if (!env.PADDLE_WEBHOOK_SECRET_KEY) {
    return NextResponse.json(
      { error: "Paddle webhook secret not configured" },
      { status: 500 }
    );
  }

  const payload = await request.text();
  if (!payload) {
    return NextResponse.json({ error: "Empty payload" }, { status: 400 });
  }

  // TODO: verify signature with Paddle SDK and persist events idempotently.
  return NextResponse.json({ ok: true, received: true });
}
