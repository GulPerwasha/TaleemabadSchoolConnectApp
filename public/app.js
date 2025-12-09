const flows = {
  app_lp: {
    name: "Flow A — App LP & Training (Teacher-first)",
    script: [
      { bot: true, text: "Hi! I’m your assistant for lesson plans, teacher training, and school tools. I’ll send something useful right now.\nWhat’s your role?", buttons: ["Teacher", "Principal", "School Owner"] },
      { bot: true, text: "Which city is your school in?", buttons: ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Peshawar", "Quetta", "Multan", "Other"] },
      { bot: true, text: "Type your full school name (no abbreviations).", expectsInput: true, suggested: "City Star School" },
      { bot: true, text: "Here’s a Grade 4 Math lesson plan for Page 45:\nhttps://tb-compliance-manager.replit.app/auth/lp/grade4-math-45.pdf" },
      { bot: true, text: "60-sec tip for your Grade 4 Math class:\nhttps://tb-compliance-manager.replit.app/auth/training/grade4-math-tip.mp4" },
      { bot: true, text: "Get full access to all LPs and training. Register your school here:", buttons: ["Register on Web", "Get another LP"], links: { "Register on Web": "https://tb-compliance-manager.replit.app/auth?utm_source=whatsapp&utm_medium=bot&utm_campaign=app_lp" } },
      { bot: true, text: "Reminder N1 (45m): Your LP/training is ready—unlock full access by registering.", buttons: ["Register on Web"], links: { "Register on Web": "https://tb-compliance-manager.replit.app/auth?utm_source=whatsapp&utm_medium=bot&utm_campaign=app_lp" } },
      { bot: true, text: "Reminder N2 (24h): Keep getting new LPs weekly—register now.", buttons: ["Register on Web"], links: { "Register on Web": "https://tb-compliance-manager.replit.app/auth?utm_source=whatsapp&utm_medium=bot&utm_campaign=app_lp" } },
      { bot: true, text: "Reminder N3 (48h): Need help? We can set this up for your school.", buttons: ["Register on Web", "Talk to us"], links: { "Register on Web": "https://tb-compliance-manager.replit.app/auth?utm_source=whatsapp&utm_medium=bot&utm_campaign=app_lp" } }
    ]
  },
  web_reg: {
    name: "Flow B — Website → School Registration (Principal/Owner)",
    script: [
      { bot: true, text: "Hi! I’m your assistant for lesson plans, training, and school tools.\nWhat’s your role?", buttons: ["Teacher", "Principal", "School Owner"] },
      { bot: true, text: "Which city is your school in?", buttons: ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Peshawar", "Quetta", "Multan", "Other"] },
      { bot: true, text: "Type your full school name (no abbreviations).", expectsInput: true, suggested: "Lighthouse Academy" },
      { bot: true, text: "Here’s a preview: Ops Checklist + LP pack for your school:\nhttps://tb-compliance-manager.replit.app/auth/starter-pack/preview.pdf" },
      { bot: true, text: "Register your school to get the full pack.", buttons: ["Register on Web", "Talk to us"], links: { "Register on Web": "https://tb-compliance-manager.replit.app/auth?utm_source=whatsapp&utm_medium=bot&utm_campaign=web_reg" } },
      { bot: true, text: "Reminder N1 (45m): Your starter pack is ready—unlock full access by registering.", buttons: ["Register on Web"], links: { "Register on Web": "https://tb-compliance-manager.replit.app/auth?utm_source=whatsapp&utm_medium=bot&utm_campaign=web_reg" } }
    ]
  },
  lp_gen: {
    name: "Flow C — WhatsApp → LP Generator from Book Page",
    script: [
      { bot: true, text: "Hi! I’m your assistant for lesson plans, teacher training, and school tools. I’ll send something useful right now.\nWhat’s your role?", buttons: ["Teacher", "Principal", "School Owner"] },
      { bot: true, text: "Which city is your school in?", buttons: ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Peshawar", "Quetta", "Multan", "Other"] },
      { bot: true, text: "Type your full school name (no abbreviations).", expectsInput: true, suggested: "City Star School" },
      { bot: true, text: "Send your book page, grade, and subject.", expectsInput: true, suggested: "Pg 45, Grade 4 Math" },
      { bot: true, text: "Here’s a Grade 4 Math lesson plan for Page 45:\nhttps://tb-compliance-manager.replit.app/auth/lp/grade4-math-45.pdf" },
      { bot: true, text: "Does this fit your class? Need easier or harder?", buttons: ["Easier", "Harder", "Looks good"] },
      { bot: true, text: "Get full access to all LPs and training. Register your school here:", buttons: ["Register on Web", "Get another LP"], links: { "Register on Web": "https://tb-compliance-manager.replit.app/auth?utm_source=whatsapp&utm_medium=bot&utm_campaign=lp_gen" } },
      { bot: true, text: "Reminder N1 (45m): Your LP is ready—unlock full access by registering.", buttons: ["Register on Web"], links: { "Register on Web": "https://tb-compliance-manager.replit.app/auth?utm_source=whatsapp&utm_medium=bot&utm_campaign=lp_gen" } },
      { bot: true, text: "Reminder N2 (24h): Keep getting new LPs weekly—register now.", buttons: ["Register on Web"], links: { "Register on Web": "https://tb-compliance-manager.replit.app/auth?utm_source=whatsapp&utm_medium=bot&utm_campaign=lp_gen" } }
    ]
  },
  rumi: {
    name: "Flow D — WhatsApp → Rumi Teaching Support",
    script: [
      { bot: true, text: "Here’s a quick answer from Rumi: Try a 3-step worked example with manipulatives, then pair practice.", buttons: ["Open Rumi", "See LP sample"], links: { "Open Rumi": "https://hellorumi.ai/?source=rumi&phone=USER_PHONE&role=teacher&city=Lahore&school=City%20Star%20School" } },
      { bot: true, text: "Which city is your school in?", buttons: ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Peshawar", "Quetta", "Multan", "Other"] },
      { bot: true, text: "Type your full school name (no abbreviations).", expectsInput: true, suggested: "City Star School" },
      { bot: true, text: "Open Rumi for instant teaching help.", buttons: ["Open Rumi", "See LP sample"], links: { "Open Rumi": "https://hellorumi.ai/?source=rumi&phone=USER_PHONE&role=teacher&city=Lahore&school=City%20Star%20School" } },
      { bot: true, text: "Here’s a Grade 4 Math lesson plan for Page 45:\nhttps://tb-compliance-manager.replit.app/auth/lp/grade4-math-45.pdf" },
      { bot: true, text: "Get full access to all LPs and training. Register your school here:", buttons: ["Register on Web"], links: { "Register on Web": "https://tb-compliance-manager.replit.app/auth?utm_source=whatsapp&utm_medium=bot&utm_campaign=rumi" } }
    ]
  }
};

const chatEl = document.getElementById("chat");
const buttonsEl = document.getElementById("buttons");
const flowSelect = document.getElementById("flowSelect");
const resetBtn = document.getElementById("resetBtn");
const inputForm = document.getElementById("inputForm");
const userInput = document.getElementById("userInput");

let currentFlowKey = "lp_gen";
let stepIndex = 0;

function populateFlowSelect() {
  Object.entries(flows).forEach(([key, flow]) => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = flow.name;
    flowSelect.appendChild(opt);
  });
  flowSelect.value = currentFlowKey;
}

function clearChat() {
  chatEl.innerHTML = "";
  buttonsEl.innerHTML = "";
}

function addBubble(text, isBot) {
  const div = document.createElement("div");
  div.className = `bubble ${isBot ? "bot" : "user"}`;
  div.textContent = text;
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
}

function renderButtons(step) {
  buttonsEl.innerHTML = "";
  if (!step.buttons || step.buttons.length === 0) return;
  step.buttons.forEach((title) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "secondary";
    btn.textContent = title;
    btn.onclick = () => handleUserReply(title, step.links?.[title]);
    buttonsEl.appendChild(btn);
  });
}

function renderStep() {
  const flow = flows[currentFlowKey];
  const step = flow.script[stepIndex];
  if (!step) {
    addBubble("End of preview. Reset to replay.", true);
    buttonsEl.innerHTML = "";
    return;
  }
  addBubble(step.text, true);
  renderButtons(step);
  if (step.expectsInput) {
    userInput.placeholder = step.suggested ? `e.g., ${step.suggested}` : "Type your reply";
    userInput.focus();
  } else {
    userInput.placeholder = "Type reply or click a button";
  }
}

function handleUserReply(text, link) {
  const display = link ? `${text} (${link})` : text;
  addBubble(display, false);
  stepIndex += 1;
  renderStep();
}

inputForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const val = userInput.value.trim();
  if (!val) return;
  handleUserReply(val, null);
  userInput.value = "";
});

flowSelect.addEventListener("change", () => {
  currentFlowKey = flowSelect.value;
  stepIndex = 0;
  clearChat();
  renderStep();
});

resetBtn.addEventListener("click", () => {
  stepIndex = 0;
  clearChat();
  renderStep();
});

// Initialize
populateFlowSelect();
clearChat();
renderStep();

