"use client";

import { useEffect, useMemo, useState } from "react";

const flows = {
  teacher: {
    name: "Teacher Flow",
    script: [
      {
        bot: true,
        text: "Hi there! We’re excited you’re here. I can share lesson plans, training, and AI support. First, choose your role.",
        buttons: ["Teacher 👩‍🏫", "Headteacher / Principal 🏫", "School Owner 🧑‍💼"],
      },
      {
        bot: true,
        text: "Great! Thanks for teaching. I’ll share a free lesson plan now—what grade/subject?",
        buttons: ["Grade 1-3", "Grade 4-6", "Grade 7-8", "Other"],
      },
      {
        bot: true,
        text: "Here’s a sample lesson plan for your class:\nhttps://tb-compliance-manager.replit.app/auth/lp/sample.pdf",
      },
      {
        bot: true,
        text: "What’s your school name? And which city are you in?",
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
        expectsInput: true,
        suggested: "City Star School",
      },
      {
        bot: true,
        text: "Want the full library and AI help?",
        buttons: ["Install App 📱", "Open Rumi 🤖", "Another LP"],
        links: {
          "Install App 📱":
            "https://tb-compliance-manager.replit.app/auth?utm_source=whatsapp&utm_medium=bot&utm_campaign=teacher_app",
          "Open Rumi 🤖":
            "https://hellorumi.ai/?source=teacher&phone=USER_PHONE&role=teacher&city=Lahore&school=City%20Star%20School",
        },
      },
      {
        bot: true,
        text: "Nudge (45m): Want to continue where you left off?",
        buttons: ["Yes, continue", "Start over"],
      },
      {
        bot: true,
        text: "Nudge (24h): Ready to get full access?",
        buttons: ["Yes, continue", "Start over"],
      },
    ],
  },
  head: {
    name: "Headteacher / Principal / Owner Flow",
    script: [
      {
        bot: true,
        text: "Hi there! We’re excited you’re here. I can share compliance tools, starter packs, and AI support. First, choose your role.",
        buttons: ["Teacher 👩‍🏫", "Headteacher / Principal 🏫", "School Owner 🧑‍💼"],
      },
      {
        bot: true,
        text: "Welcome! I’ll share compliance and starter resources right away. Which do you want first?",
        buttons: ["View Compliance Hub", "Starter Pack"],
      },
      {
        bot: true,
        text: "What’s your school name? And which city?",
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
        expectsInput: true,
        suggested: "Lighthouse Academy",
      },
      {
        bot: true,
        text: "About how many students? Which board/type?",
        buttons: ["Cambridge", "Matric", "IB", "Other"],
      },
      {
        bot: true,
        text: "Here you go—open the hub or AI support.",
        buttons: ["Compliance Hub 🏫", "Starter Pack 📘", "Open Rumi 🤖"],
        links: {
          "Compliance Hub 🏫":
            "https://tb-compliance-manager.replit.app/auth?utm_source=whatsapp&utm_medium=bot&utm_campaign=head_compliance",
          "Starter Pack 📘":
            "https://tb-compliance-manager.replit.app/auth?utm_source=whatsapp&utm_medium=bot&utm_campaign=head_starter",
          "Open Rumi 🤖":
            "https://hellorumi.ai/?source=head&phone=USER_PHONE&role=head&city=Lahore&school=School",
        },
      },
      {
        bot: true,
        text: "Nudge (45m): Want to continue where you left off?",
        buttons: ["Yes, continue", "Start over"],
      },
      {
        bot: true,
        text: "Nudge (24h): Ready to get full access?",
        buttons: ["Yes, continue", "Start over"],
      },
    ],
  },
};

export default function PreviewPage() {
  const [currentFlowKey, setCurrentFlowKey] = useState("teacher");
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

