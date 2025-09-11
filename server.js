import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Tar emot från widgeten
app.post("/ask", async (req, res) => {
  try {
    const userMessage = req.body.message || "";

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307", // billig & snabb
        max_tokens: 300,
        messages: [{ role: "user", content: userMessage }]
      })
    });

    const data = await r.json();
    const text =
      Array.isArray(data?.content) && data.content[0]?.text
        ? data.content[0].text
        : "Jag fick inget svar från modellen.";

    // Viktigt: widgeten väntar på { reply: "..." }
    res.json({ reply: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Fel i servern." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server kör på port ${PORT}`));
