const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "verify_token";

app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Webhook verification (Meta)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified");
    res.status(200).send(challenge);
    return;
  }

  res.sendStatus(403);
});

// Webhook event receiver (logs only in this mock)
app.post("/webhook", (req, res) => {
  console.log("Webhook event:", JSON.stringify(req.body));
  res.sendStatus(200);
});

// Serve static preview UI
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Local preview running at http://localhost:${PORT}`);
});

