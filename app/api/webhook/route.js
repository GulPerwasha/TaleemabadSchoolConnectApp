import { NextResponse } from "next/server";

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "verify_token";
const WABA_TOKEN = process.env.WABA_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const GRAPH_URL = (id) => `https://graph.facebook.com/v19.0/${id}/messages`;

async function sendMessage(to, payload) {
  if (!WABA_TOKEN || !PHONE_NUMBER_ID) {
    console.warn("Missing WABA_ACCESS_TOKEN or PHONE_NUMBER_ID; skip send");
    return;
  }
  const res = await fetch(GRAPH_URL(PHONE_NUMBER_ID), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WABA_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      ...payload,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("WA send failed", res.status, text);
  }
}

function welcomeInteractive() {
  return {
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: "Hi there! We’re excited you’re here. I can share lesson plans, training, compliance tools, and AI support. First, choose your role.",
      },
      action: {
        buttons: [
          { type: "reply", reply: { id: "role_teacher", title: "Teacher 👩‍🏫" } },
          {
            type: "reply",
            reply: { id: "role_head", title: "Headteacher / Principal 🏫" },
          },
          {
            type: "reply",
            reply: { id: "role_owner", title: "School Owner 🧑‍💼" },
          },
        ],
      },
    },
  };
}

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

// POST: receive events; send welcome on first inbound
export async function POST(req) {
  try {
    const body = await req.json();

    // Basic guard
    const entries = body.entry || [];
    for (const entry of entries) {
      const changes = entry.changes || [];
      for (const change of changes) {
        const value = change.value;
        const messages = value?.messages || [];
        for (const message of messages) {
          // ignore statuses
          if (message.status) continue;
          const from = message.from; // user phone
          // Avoid echo loops: do not respond to our own business number
          if (!from) continue;

          // If interactive reply, we could branch later; for now send welcome if no prior state.
          if (message.type === "text" || message.type === "interactive") {
            await sendMessage(from, welcomeInteractive());
          }
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Webhook error", err);
    return new NextResponse("Bad Request", { status: 400 });
  }
}

