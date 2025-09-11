import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// Här tar vi emot frågorna från widgeten
app.post("/ask", async (req, res) => {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-opus-20240229",
        max_tokens: 256,
        messages: [{ role: "user", content: req.body.question }]
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Något gick fel på servern" });
  }
});

// Render kör på en dynamisk port (process.env.PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servern körs på port ${PORT}`);
});
