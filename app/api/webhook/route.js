import { NextResponse } from "next/server";

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "verify_token";

// GET: verification handshake for Meta
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

// POST: receive events (logged only in this mock)
export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Webhook event:", JSON.stringify(body));
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Webhook error", err);
    return new NextResponse("Bad Request", { status: 400 });
  }
}

