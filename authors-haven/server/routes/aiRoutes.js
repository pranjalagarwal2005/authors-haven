const express = require("express");
const Groq = require("groq-sdk");
const Research = require("../models/Research");

const router = express.Router();

router.post("/", async (req, res) => {
  const { question, projectId } = req.body;

  if (!question) {
    return res.json({ answer: "Please enter a prompt." });
  }

  if (!process.env.GROQ_API_KEY) {
    console.error("Missing GROQ_API_KEY in environment variables");
    return res.json({ answer: "Server Error: AI API Key is missing." });
  }

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful AI search assistant. Provide clear and organized responses. IMPORTANT: Do NOT use any asterisks (*) for formatting. Use ALL CAPS for subheadings instead.",
        },
        {
          role: "user",
          content: question,
        },
      ],
      model: "llama-3.1-8b-instant",
    });

    let text = chatCompletion.choices[0]?.message?.content || "";

    // Formatting: remove asterisks and capitalize subheadings
    text = text.replace(/\*\*(.*?)\*\*/g, (_, p1) => p1.toUpperCase())
      .replace(/^#{1,6}\s*(.*)$/gm, (_, p1) => p1.toUpperCase())
      .replace(/\*/g, "");

    if (projectId) {
      await Research.create({
        projectId,
        prompt: question,
        response: text,
      });
    }

    res.json({ answer: text });
  } catch (err) {
    console.error("AI Generation Error:", err);
    res.json({ answer: "AI failed: " + (err.message || String(err)) });
  }
});

module.exports = router;

