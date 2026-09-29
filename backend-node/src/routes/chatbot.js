const express = require("express");
const router  = express.Router();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `You are an expert Agricultural Plant Disease Assistant for the AI Based Leaf Disease Detection System.
Your role is to help farmers and gardeners with:
- Plant disease identification and symptoms
- Medicine names and dosages for plant diseases
- Treatment steps and application methods
- Prevention and crop management tips
- General farming and agriculture advice

Keep responses:
- Short and clear (2-4 sentences max unless detailed info needed)
- Practical and actionable
- Friendly and simple to understand
- Focused on agriculture and plant health topics only

If asked about non-agricultural topics, politely redirect to plant/farming topics.`;

router.post("/", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ error: "Message is required." });
    }

    const contents = [
      ...history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      })),
      {
        role: "user",
        parts: [{ text: message.trim() }]
      }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
        { role: "model", parts: [{ text: "Understood! I am your Agricultural Plant Disease Assistant. How can I help you today?" }] },
        ...contents
      ]
    });

    const reply = response.text?.trim() || "I'm sorry, I couldn't process that. Please try again.";
    res.json({ reply });

  } catch (err) {
    console.error("Chatbot error:", err.message);
    // Fallback if Gemini API key not set
    res.json({
      reply: "🌿 I'm your Plant Disease Assistant! Ask me about plant diseases, medicines, treatment steps, or farming tips. (Note: Connect Gemini API key for full AI responses)"
    });
  }
});

module.exports = router;
