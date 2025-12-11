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

function teacherFlowMessages() {
  return [
    {
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          text: "Great! Thanks for teaching. I’ll share a free lesson plan now—what grade/subject?",
        },
        action: {
          buttons: [
            { type: "reply", reply: { id: "grade_1_3", title: "Grade 1-3" } },
            { type: "reply", reply: { id: "grade_4_6", title: "Grade 4-6" } },
            { type: "reply", reply: { id: "grade_7_8", title: "Grade 7-8" } },
          ],
        },
      },
    },
    {
      type: "text",
      text: {
        preview_url: true,
        body: "Here’s a sample lesson plan for your class:\nhttps://tb-compliance-manager.replit.app/auth/lp/sample.pdf",
      },
    },
    {
      type: "text",
      text: {
        preview_url: false,
        body: "What’s your school name? And which city are you in? (Reply with both.)",
      },
    },
    {
      type: "interactive",
      interactive: {
        type: "button",
        body: { text: "Want the full library and AI help?" },
        action: {
          buttons: [
            {
              type: "url",
              url: "https://tb-compliance-manager.replit.app/auth?utm_source=whatsapp&utm_medium=bot&utm_campaign=teacher_app",
              title: "Install App 📱",
            },
            {
              type: "url",
              url: "https://hellorumi.ai/?source=teacher&role=teacher",
              title: "Open Rumi 🤖",
            },
            { type: "reply", reply: { id: "more_lp", title: "Another LP" } },
          ],
        },
      },
    },
  ];
}

function headFlowMessages() {
  return [
    {
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          text: "Welcome! I’ll share compliance and starter resources right away. Which do you want first?",
        },
        action: {
          buttons: [
            { type: "reply", reply: { id: "compliance_hub", title: "View Compliance Hub" } },
            { type: "reply", reply: { id: "starter_pack", title: "Starter Pack" } },
          ],
        },
      },
    },
    {
      type: "text",
      text: {
        preview_url: false,
        body: "What’s your school name? And which city? (Reply with both.)",
      },
    },
    {
      type: "text",
      text: {
        preview_url: false,
        body: "About how many students? Which board/type? (e.g., 500, Cambridge)",
      },
    },
    {
      type: "interactive",
      interactive: {
        type: "button",
        body: { text: "Here you go—open the hub or AI support." },
        action: {
          buttons: [
            {
              type: "url",
              url: "https://tb-compliance-manager.replit.app/auth?utm_source=whatsapp&utm_medium=bot&utm_campaign=head_compliance",
              title: "Compliance Hub 🏫",
            },
            {
              type: "url",
              url: "https://tb-compliance-manager.replit.app/auth?utm_source=whatsapp&utm_medium=bot&utm_campaign=head_starter",
              title: "Starter Pack 📘",
            },
            {
              type: "url",
              url: "https://hellorumi.ai/?source=head&role=head",
              title: "Open Rumi 🤖",
            },
          ],
        },
      },
    },
  ];
}

async function sendSequence(to, messages) {
  for (const msg of messages) {
    await sendMessage(to, msg);
  }
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

          const interactiveId =
            message.interactive?.button_reply?.id ||
            message.interactive?.list_reply?.id;

          if (interactiveId === "role_teacher") {
            await sendSequence(from, teacherFlowMessages());
            continue;
          }
          if (interactiveId === "role_head" || interactiveId === "role_owner") {
            await sendSequence(from, headFlowMessages());
            continue;
          }

          // default: send role selection welcome
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

