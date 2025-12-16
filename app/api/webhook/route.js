import { NextResponse } from "next/server";

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "verify_token";
const WABA_TOKEN = process.env.WABA_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const GRAPH_URL = (id) => `https://graph.facebook.com/v19.0/${id}/messages`;

// ============================================================================
// STATE MANAGEMENT (In-memory - Replace with DB for production)
// ============================================================================
const userStates = new Map();

function getUserState(phone) {
  if (!userStates.has(phone)) {
    userStates.set(phone, {
      state: "new",
      role: null,
      name: null,
      school: null,
      currentFlow: null,
      lastInteraction: Date.now(),
    });
  }
  return userStates.get(phone);
}

function updateUserState(phone, updates) {
  const state = getUserState(phone);
  Object.assign(state, updates, { lastInteraction: Date.now() });
  userStates.set(phone, state);
}

// ============================================================================
// MESSAGING UTILITY
// ============================================================================
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

async function sendText(to, text) {
  await sendMessage(to, {
    type: "text",
    text: { body: text },
  });
}

// ============================================================================
// CORE MESSAGES
// ============================================================================

function getIntroductionMessage() {
  return {
    type: "text",
    text: {
      body: `Hello! 👋

Welcome to Taleemabad — your partner in improving teaching, learning, and school management.

We help schools with digital tools, teacher support, lesson plans, and classroom resources.

Before we continue, please tell me your role:

• Teacher
• Principal
• School Owner

(Reply with one option.)`,
    },
  };
}

function getRoleSelectionButtons() {
  return {
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: "Please select your role:",
      },
      action: {
        buttons: [
          { type: "reply", reply: { id: "role_teacher", title: "Teacher" } },
          { type: "reply", reply: { id: "role_principal", title: "Principal" } },
          { type: "reply", reply: { id: "role_owner", title: "School Owner" } },
        ],
      },
    },
  };
}

function getMainMenu(userName = "") {
  const greeting = userName ? `${userName}, how` : "How";
  return {
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: `Great, thank you! I'll personalize your experience based on your role.

${greeting} can I help you today?

1) Install the Taleemabad App (Lesson plans, trainings, digital tools)
2) Register Your School (attendance, requisitions, dashboards)
3) Generate a Lesson Plan from a Book Photo
4) Get Teaching Support from Rumi (topic guidance, teaching help)

Just reply with 1, 2, 3, or 4.`,
      },
      action: {
        buttons: [
          { type: "reply", reply: { id: "menu_1", title: "1 - Install App" } },
          { type: "reply", reply: { id: "menu_2", title: "2 - Register" } },
          { type: "reply", reply: { id: "menu_3", title: "3 - Lesson Plan" } },
        ],
      },
    },
  };
}

function getSecondaryMenuButtons() {
  return {
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: "Or choose:",
      },
      action: {
        buttons: [
          { type: "reply", reply: { id: "menu_4", title: "4 - Rumi AI" } },
        ],
      },
    },
  };
}

// ============================================================================
// FLOW 1: APP INSTALLATION
// ============================================================================
async function startAppInstallationFlow(phone, userState) {
  updateUserState(phone, { currentFlow: "app_install", state: "flow_started" });

  if (!userState.name) {
    await sendText(phone, "Perfect! Before I share the app link, what's your name?");
    updateUserState(phone, { state: "awaiting_name" });
    return;
  }

  if (!userState.school) {
    await sendText(
      phone,
      `Thanks, ${userState.name}! What's the name of your school?`
    );
    updateUserState(phone, { state: "awaiting_school" });
    return;
  }

  await completeAppInstallationFlow(phone, userState);
}

async function completeAppInstallationFlow(phone, userState) {
  const appUrl = `https://tb-compliance-manager.replit.app/auth?utm_source=whatsapp&utm_medium=bot&utm_campaign=app_install&role=${userState.role}&school=${encodeURIComponent(userState.school)}`;

  await sendText(
    phone,
    `Excellent, ${userState.name}!

The Taleemabad App gives you access to:
✅ 1000+ Lesson Plans
✅ Teacher Training Videos
✅ Classroom Management Tools
✅ Digital Resources

Install the app here: ${appUrl}`
  );

  await sendText(
    phone,
    "Type *Menu* anytime to return to the main options."
  );

  updateUserState(phone, { state: "flow_completed", currentFlow: null });
}

// ============================================================================
// FLOW 2: WEBSITE REGISTRATION
// ============================================================================
async function startWebsiteRegistrationFlow(phone, userState) {
  updateUserState(phone, { currentFlow: "web_registration", state: "flow_started" });

  if (!userState.name) {
    await sendText(phone, "Great choice! First, what's your name?");
    updateUserState(phone, { state: "awaiting_name" });
    return;
  }

  if (!userState.school) {
    await sendText(
      phone,
      `Thank you, ${userState.name}! What's the name of your school?`
    );
    updateUserState(phone, { state: "awaiting_school" });
    return;
  }

  await completeWebsiteRegistrationFlow(phone, userState);
}

async function completeWebsiteRegistrationFlow(phone, userState) {
  const regUrl = `https://tb-compliance-manager.replit.app/auth?utm_source=whatsapp&utm_medium=bot&utm_campaign=web_registration&role=${userState.role}&school=${encodeURIComponent(userState.school)}&name=${encodeURIComponent(userState.name)}`;

  await sendText(
    phone,
    `Perfect, ${userState.name}!

Register your school to access:
📊 Attendance Management
📝 Requisition System
📈 Performance Dashboards
🎓 Teacher & Student Analytics

Complete your registration here: ${regUrl}`
  );

  await sendText(
    phone,
    "Once registered, you'll receive login credentials via SMS.\n\nType *Menu* anytime to return."
  );

  updateUserState(phone, { state: "flow_completed", currentFlow: null });
}

// ============================================================================
// FLOW 3: LP GENERATION FROM BOOK PHOTO
// ============================================================================
async function startLPGenerationFlow(phone, userState) {
  updateUserState(phone, { currentFlow: "lp_generation", state: "flow_started" });

  if (!userState.name) {
    await sendText(phone, "Wonderful! Let's get started. What's your name?");
    updateUserState(phone, { state: "awaiting_name" });
    return;
  }

  if (!userState.school) {
    await sendText(
      phone,
      `Thanks, ${userState.name}! Which school do you teach at?`
    );
    updateUserState(phone, { state: "awaiting_school" });
    return;
  }

  await completeLPGenerationFlow(phone, userState);
}

async function completeLPGenerationFlow(phone, userState) {
  const rumiUrl = `https://hellorumi.ai/?source=lp_generation&role=${userState.role}&school=${encodeURIComponent(userState.school)}&name=${encodeURIComponent(userState.name)}`;

  await sendText(
    phone,
    `Great, ${userState.name}!

To generate a lesson plan from a book photo, I'll connect you with our AI assistant Rumi.

Rumi will:
📸 Analyze your book page photo
📝 Generate a custom lesson plan
🎯 Align it with your curriculum

Open Rumi here: ${rumiUrl}`
  );

  await sendText(
    phone,
    "Simply take a photo of any textbook page and Rumi will create a detailed lesson plan for you!\n\nType *Menu* anytime to return."
  );

  updateUserState(phone, { state: "flow_completed", currentFlow: null });
}

// ============================================================================
// FLOW 4: RUMI TEACHING SUPPORT
// ============================================================================
async function startRumiSupportFlow(phone, userState) {
  updateUserState(phone, { currentFlow: "rumi_support", state: "flow_started" });

  if (!userState.name) {
    await sendText(phone, "Excellent! First, may I know your name?");
    updateUserState(phone, { state: "awaiting_name" });
    return;
  }

  if (!userState.school) {
    await sendText(
      phone,
      `Thank you, ${userState.name}! Which school are you with?`
    );
    updateUserState(phone, { state: "awaiting_school" });
    return;
  }

  await completeRumiSupportFlow(phone, userState);
}

async function completeRumiSupportFlow(phone, userState) {
  const rumiUrl = `https://hellorumi.ai/?source=teaching_support&role=${userState.role}&school=${encodeURIComponent(userState.school)}&name=${encodeURIComponent(userState.name)}`;

  await sendText(
    phone,
    `Perfect, ${userState.name}!

Rumi is our AI teaching assistant. Ask Rumi about:
💡 Lesson planning tips
📖 Subject-specific guidance
🎨 Creative teaching methods
❓ Student questions & explanations
🧪 Activity ideas

Connect with Rumi here: ${rumiUrl}`
  );

  await sendText(
    phone,
    "Rumi is available 24/7 to help you become an even better teacher!\n\nType *Menu* anytime to return."
  );

  updateUserState(phone, { state: "flow_completed", currentFlow: null });
}

// ============================================================================
// MESSAGE HANDLER
// ============================================================================
async function handleUserMessage(phone, messageText, interactiveId) {
  const userState = getUserState(phone);
  const text = messageText?.toLowerCase().trim() || "";

  // Global commands
  if (text === "menu" || text === "main menu" || text === "start") {
    updateUserState(phone, { state: "role_captured", currentFlow: null });
    await sendMessage(phone, getMainMenu(userState.name));
    await sendMessage(phone, getSecondaryMenuButtons());
    return;
  }

  // Handle new users or role selection
  if (userState.state === "new" || !userState.role) {
    if (
      interactiveId === "role_teacher" ||
      text.includes("teacher") ||
      text === "1"
    ) {
      updateUserState(phone, { role: "teacher", state: "role_captured" });
      await sendMessage(phone, getMainMenu());
      await sendMessage(phone, getSecondaryMenuButtons());
      return;
    }

    if (
      interactiveId === "role_principal" ||
      text.includes("principal") ||
      text === "2"
    ) {
      updateUserState(phone, { role: "principal", state: "role_captured" });
      await sendMessage(phone, getMainMenu());
      await sendMessage(phone, getSecondaryMenuButtons());
      return;
    }

    if (
      interactiveId === "role_owner" ||
      text.includes("owner") ||
      text === "3"
    ) {
      updateUserState(phone, { role: "owner", state: "role_captured" });
      await sendMessage(phone, getMainMenu());
      await sendMessage(phone, getSecondaryMenuButtons());
      return;
    }

    // No role yet, send introduction
    await sendMessage(phone, getIntroductionMessage());
    await sendMessage(phone, getRoleSelectionButtons());
    return;
  }

  // Handle menu selection
  if (
    userState.state === "role_captured" ||
    userState.state === "flow_completed"
  ) {
    if (interactiveId === "menu_1" || text === "1") {
      await startAppInstallationFlow(phone, userState);
      return;
    }
    if (interactiveId === "menu_2" || text === "2") {
      await startWebsiteRegistrationFlow(phone, userState);
      return;
    }
    if (interactiveId === "menu_3" || text === "3") {
      await startLPGenerationFlow(phone, userState);
      return;
    }
    if (interactiveId === "menu_4" || text === "4") {
      await startRumiSupportFlow(phone, userState);
      return;
    }

    // Invalid menu selection
    await sendText(
      phone,
      "Sorry, I didn't catch that! Please choose one of these options:\n\n1) Install App\n2) Register School\n3) Generate Lesson Plan\n4) Teaching Support (Rumi)\n\nJust reply with 1, 2, 3, or 4."
    );
    return;
  }

  // Handle name capture
  if (userState.state === "awaiting_name") {
    if (text.length < 2) {
      await sendText(phone, "Please enter your full name.");
      return;
    }
    updateUserState(phone, { name: messageText.trim() });

    // Check if school is also needed
    if (!userState.school) {
      await sendText(
        phone,
        `Thank you, ${messageText.trim()}! What's the name of your school?`
      );
      updateUserState(phone, { state: "awaiting_school" });
      return;
    }

    // Complete the flow
    await completeCurrentFlow(phone, userState);
    return;
  }

  // Handle school capture
  if (userState.state === "awaiting_school") {
    if (text.length < 3) {
      await sendText(
        phone,
        "Please enter your full school name (at least 3 characters)."
      );
      return;
    }
    updateUserState(phone, { school: messageText.trim() });
    await completeCurrentFlow(phone, userState);
    return;
  }

  // Fallback
  await sendText(
    phone,
    "I'm not sure what you mean. Type *Menu* to see your options."
  );
}

async function completeCurrentFlow(phone, userState) {
  const currentState = getUserState(phone);
  switch (currentState.currentFlow) {
    case "app_install":
      await completeAppInstallationFlow(phone, currentState);
      break;
    case "web_registration":
      await completeWebsiteRegistrationFlow(phone, currentState);
      break;
    case "lp_generation":
      await completeLPGenerationFlow(phone, currentState);
      break;
    case "rumi_support":
      await completeRumiSupportFlow(phone, currentState);
      break;
    default:
      await sendMessage(phone, getMainMenu(currentState.name));
      await sendMessage(phone, getSecondaryMenuButtons());
  }
}

// ============================================================================
// WEBHOOK ENDPOINTS
// ============================================================================

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

// POST: receive events from WhatsApp
export async function POST(req) {
  try {
    const body = await req.json();

    const entries = body.entry || [];
    for (const entry of entries) {
      const changes = entry.changes || [];
      for (const change of changes) {
        const value = change.value;
        const messages = value?.messages || [];

        for (const message of messages) {
          if (message.status) continue;

          const from = message.from;
          if (!from) continue;

          const messageText = message.text?.body || "";
          const interactiveId =
            message.interactive?.button_reply?.id ||
            message.interactive?.list_reply?.id ||
            "";

          // Handle the message
          await handleUserMessage(from, messageText, interactiveId);
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Webhook error", err);
    return new NextResponse("Bad Request", { status: 400 });
  }
}

