import { NextResponse } from "next/server";

const WABA_TOKEN = process.env.WABA_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const GRAPH_URL = (id) => `https://graph.facebook.com/v19.0/${id}/messages`;

export async function POST(req) {
  if (!WABA_TOKEN || !PHONE_NUMBER_ID) {
    return NextResponse.json(
      { error: "Missing WABA_ACCESS_TOKEN or PHONE_NUMBER_ID" },
      { status: 400 }
    );
  }

  const { to, template_name = "funnel_nudge_n1", link } = await req.json();
  if (!to) {
    return NextResponse.json({ error: "Missing 'to' number" }, { status: 400 });
  }

  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name: template_name,
      language: { code: "en" },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: link || "https://tb-compliance-manager.replit.app/auth",
            },
          ],
        },
      ],
    },
  };

  try {
    const res = await fetch(GRAPH_URL(PHONE_NUMBER_ID), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WABA_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    if (!res.ok) {
      // Return the exact error body from Meta for debugging
      return NextResponse.json(
        { error: text || "Upstream error", status: res.status },
        { status: res.status }
      );
    }

    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }
    return NextResponse.json({ sent: true, data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

