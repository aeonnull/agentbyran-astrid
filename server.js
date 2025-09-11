import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// POST /ask tar emot frågor från widgeten
app.post("/ask", async (req, res) => {
  try {
    const { message } = req.body;

    // Skicka frågan vidare till Claude
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229",
        max_tokens: 500,
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await response.json();

    // Skicka tillbaka Claudes svar till widgeten
    res.json({ reply: data.content[0].text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Något gick fel." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server kör på port ${PORT}`);
});
