"use client";

import { useEffect, useMemo, useState } from "react";

const flows = {
  app_lp: {
    name: "Flow A — App LP & Training (Teacher-first)",
    script: [
      {
        bot: true,
        text: "Hi! I’m your assistant for lesson plans, teacher training, and school tools. I’ll send something useful right now.\nWhat’s your role?",
        buttons: ["Teacher", "Principal", "School Owner"],
      },
      {
        bot: true,
        text: "Which city is your school in?",
        buttons: [
          "Lahore",
          "Karachi",
          "Islamabad",
          "Rawalpindi",
          "Faisalabad",
          "Peshawar",
          "Quetta",
          "Multan",
          "Other",
        ],
      },
      {
        bot: true,
        text: "Type your full school name (no abbreviations).",
        expectsInput: true,
        suggested: "City Star School",
      },
      {
        bot: true,
        text: "Here’s a Grade 4 Math lesson plan for Page 45:\nhttps://tb-compliance-manager.replit.app/auth/lp/grade4-math-45.pdf",
      },
      {
        bot: true,
        text: "60-sec tip for your Grade 4 Math class:\nhttps://tb-compliance-manager.replit.app/auth/training/grade4-math-tip.mp4",
      },
      {
        bot: true,
        text: "Get full access to all LPs and training. Register your school here:",
        buttons: ["Register on Web", "Get another LP"],
        links: {
          "Register on Web":
            "https://tb-compliance-manager.replit.app/auth?utm_source=whatsapp&utm_medium=bot&utm_campaign=app_lp",
        },
      },
      {
        bot: true,
        text: "Reminder N1 (45m): Your LP/training is ready—unlock full access by registering.",
        buttons: ["Register on Web"],
        links: {
          "Register on Web":
            "https://tb-compliance-manager.replit.app/auth?utm_source=whatsapp&utm_medium=bot&utm_campaign=app_lp",
        },
      },
      {
        bot: true,
        text: "Reminder N2 (24h): Keep getting new LPs weekly—register now.",
        buttons: ["Register on Web"],
        links: {
          "Register on Web":
            "https://tb-compliance-manager.replit.app/auth?utm_source=whatsapp&utm_medium=bot&utm_campaign=app_lp",
        },
      },
      {
        bot: true,
        text: "Reminder N3 (48h): Need help? We can set this up for your school.",
        buttons: ["Register on Web", "Talk to us"],
        links: {
          "Register on Web":
            "https://tb-compliance-manager.replit.app/auth?utm_source=whatsapp&utm_medium=bot&utm_campaign=app_lp",
        },
      },
    ],
  },
  web_reg: {
    name: "Flow B — Website → School Registration (Principal/Owner)",
    script: [
      {
        bot: true,
        text: "Hi! I’m your assistant for lesson plans, training, and school tools.\nWhat’s your role?",
        buttons: ["Teacher", "Principal", "School Owner"],
      },
      {
        bot: true,
        text: "Which city is your school in?",
        buttons: [
          "Lahore",
          "Karachi",
          "Islamabad",
          "Rawalpindi",
          "Faisalabad",
          "Peshawar",
          "Quetta",
          "Multan",
          "Other",
        ],
      },
      {
        bot: true,
        text: "Type your full school name (no abbreviations).",
        expectsInput: true,
        suggested: "Lighthouse Academy",
      },
      {
        bot: true,
        text: "Here’s a preview: Ops Checklist + LP pack for your school:\nhttps://tb-compliance-manager.replit.app/auth/starter-pack/preview.pdf",
      },
      {
        bot: true,
        text: "Register your school to get the full pack.",
        buttons: ["Register on Web", "Talk to us"],
        links: {
          "Register on Web":
            "https://tb-compliance-manager.replit.app/auth?utm_source=whatsapp&utm_medium=bot&utm_campaign=web_reg",
        },
      },
      {
        bot: true,
        text: "Reminder N1 (45m): Your starter pack is ready—unlock full access by registering.",
        buttons: ["Register on Web"],
        links: {
          "Register on Web":
            "https://tb-compliance-manager.replit.app/auth?utm_source=whatsapp&utm_medium=bot&utm_campaign=web_reg",
        },
      },
    ],
  },
  lp_gen: {
    name: "Flow C — WhatsApp → LP Generator from Book Page",
    script: [
      {
        bot: true,
        text: "Hi! I’m your assistant for lesson plans, teacher training, and school tools. I’ll send something useful right now.\nWhat’s your role?",
        buttons: ["Teacher", "Principal", "School Owner"],
      },
      {
        bot: true,
        text: "Which city is your school in?",
        buttons: [
          "Lahore",
          "Karachi",
          "Islamabad",
          "Rawalpindi",
          "Faisalabad",
          "Peshawar",
          "Quetta",
          "Multan",
          "Other",
        ],
      },
      {
        bot: true,
        text: "Type your full school name (no abbreviations).",
        expectsInput: true,
        suggested: "City Star School",
      },
      {
        bot: true,
        text: "Send your book page, grade, and subject.",
        expectsInput: true,
        suggested: "Pg 45, Grade 4 Math",
      },
      {
        bot: true,
        text: "Here’s a Grade 4 Math lesson plan for Page 45:\nhttps://tb-compliance-manager.replit.app/auth/lp/grade4-math-45.pdf",
      },
      {
        bot: true,
        text: "Does this fit your class? Need easier or harder?",
        buttons: ["Easier", "Harder", "Looks good"],
      },
      {
        bot: true,
        text: "Get full access to all LPs and training. Register your school here:",
        buttons: ["Register on Web", "Get another LP"],
        links: {
          "Register on Web":
            "https://tb-compliance-manager.replit.app/auth?utm_source=whatsapp&utm_medium=bot&utm_campaign=lp_gen",
        },
      },
      {
        bot: true,
        text: "Reminder N1 (45m): Your LP is ready—unlock full access by registering.",
        buttons: ["Register on Web"],
        links: {
          "Register on Web":
            "https://tb-compliance-manager.replit.app/auth?utm_source=whatsapp&utm_medium=bot&utm_campaign=lp_gen",
        },
      },
      {
        bot: true,
        text: "Reminder N2 (24h): Keep getting new LPs weekly—register now.",
        buttons: ["Register on Web"],
        links: {
          "Register on Web":
            "https://tb-compliance-manager.replit.app/auth?utm_source=whatsapp&utm_medium=bot&utm_campaign=lp_gen",
        },
      },
    ],
  },
  rumi: {
    name: "Flow D — WhatsApp → Rumi Teaching Support",
    script: [
      {
        bot: true,
        text: "Here’s a quick answer from Rumi: Try a 3-step worked example with manipulatives, then pair practice.",
        buttons: ["Open Rumi", "See LP sample"],
        links: {
          "Open Rumi":
            "https://hellorumi.ai/?source=rumi&phone=USER_PHONE&role=teacher&city=Lahore&school=City%20Star%20School",
        },
      },
      {
        bot: true,
        text: "Which city is your school in?",
        buttons: [
          "Lahore",
          "Karachi",
          "Islamabad",
          "Rawalpindi",
          "Faisalabad",
          "Peshawar",
          "Quetta",
          "Multan",
          "Other",
        ],
      },
      {
        bot: true,
        text: "Type your full school name (no abbreviations).",
        expectsInput: true,
        suggested: "City Star School",
      },
      {
        bot: true,
        text: "Open Rumi for instant teaching help.",
        buttons: ["Open Rumi", "See LP sample"],
        links: {
          "Open Rumi":
            "https://hellorumi.ai/?source=rumi&phone=USER_PHONE&role=teacher&city=Lahore&school=City%20Star%20School",
        },
      },
      {
        bot: true,
        text: "Here’s a Grade 4 Math lesson plan for Page 45:\nhttps://tb-compliance-manager.replit.app/auth/lp/grade4-math-45.pdf",
      },
      {
        bot: true,
        text: "Get full access to all LPs and training. Register your school here:",
        buttons: ["Register on Web"],
        links: {
          "Register on Web":
            "https://tb-compliance-manager.replit.app/auth?utm_source=whatsapp&utm_medium=bot&utm_campaign=rumi",
        },
      },
    ],
  },
};

export default function PreviewPage() {
  const [currentFlowKey, setCurrentFlowKey] = useState("lp_gen");
  const [stepIndex, setStepIndex] = useState(0);
  const [messages, setMessages] = useState([]);

  const currentFlow = useMemo(() => flows[currentFlowKey], [currentFlowKey]);
  const currentStep = currentFlow.script[stepIndex];

  useEffect(() => {
    // Reset messages and show first bot step
    setMessages([{ bot: true, text: currentFlow.script[0].text }]);
    setStepIndex(0);
  }, [currentFlowKey]);

  const appendMessage = (entry) => {
    setMessages((m) => [...m, entry]);
  };

  const advanceStep = () => {
    const next = stepIndex + 1;
    setStepIndex(next);
    const nextStep = currentFlow.script[next];
    if (nextStep && nextStep.bot) {
      appendMessage({ bot: true, text: nextStep.text });
    }
  };

  const handleUserReply = (text, link) => {
    const display = link ? `${text} (${link})` : text;
    appendMessage({ bot: false, text: display });
    advanceStep();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const input = new FormData(e.currentTarget).get("userInput").trim();
    if (!input) return;
    handleUserReply(input, null);
    e.currentTarget.reset();
  };

  const resetFlow = () => {
    setStepIndex(0);
    setMessages([{ bot: true, text: currentFlow.script[0].text }]);
  };

  const renderButtons = () => {
    if (!currentStep || !currentStep.buttons || currentStep.buttons.length === 0) {
      return null;
    }
    return currentStep.buttons.map((title) => {
      const link = currentStep.links?.[title];
      return (
        <button
          key={title}
          type="button"
          className="secondary"
          onClick={() => handleUserReply(title, link)}
        >
          {title}
        </button>
      );
    });
  };

  return (
    <div className="app">
      <header>
        <h1>Unified Educator Funnel — Mock Chat</h1>
        <div className="controls">
          <label htmlFor="flowSelect">Flow</label>
          <select
            id="flowSelect"
            value={currentFlowKey}
            onChange={(e) => setCurrentFlowKey(e.target.value)}
          >
            {Object.entries(flows).map(([key, flow]) => (
              <option key={key} value={key}>
                {flow.name}
              </option>
            ))}
          </select>
          <button type="button" onClick={resetFlow}>
            Reset Flow
          </button>
        </div>
      </header>

      <main>
        <div className="chat">
          {messages.map((msg, idx) => (
            <div key={idx} className={`bubble ${msg.bot ? "bot" : "user"}`}>
              {msg.text}
            </div>
          ))}
          {!currentStep && (
            <div className="bubble bot">End of preview. Reset to replay.</div>
          )}
        </div>

        <div className="buttons">{renderButtons()}</div>

        <form className="input-form" onSubmit={handleSubmit}>
          <input
            name="userInput"
            id="userInput"
            type="text"
            placeholder={
              currentStep?.expectsInput && currentStep?.suggested
                ? `e.g., ${currentStep.suggested}`
                : "Type reply or click a button"
            }
            autoComplete="off"
          />
          <button type="submit">Send</button>
        </form>
      </main>

      <footer>
        <p>Local preview only. No messages are sent to WhatsApp.</p>
      </footer>
    </div>
  );
}

