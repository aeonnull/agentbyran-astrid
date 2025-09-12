(function () {
  const el = document.currentScript;
  const company  = el.getAttribute("data-company")  || "Agentbyrån";
  const agent    = el.getAttribute("data-agent")    || "Agent";
  const endpoint = el.getAttribute("data-endpoint");
  const accent   = el.getAttribute("data-color")    || "#333333";
  const position = (el.getAttribute("data-position") || "bottom-right").toLowerCase();

  // === Container ===
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.width = "320px";
  container.style.maxWidth = "92vw";
  container.style.height = "420px";
  container.style.maxHeight = "70vh";
  container.style.backgroundColor = "#FDF9ED";
  container.style.border = `1px solid ${accent}`;
  container.style.borderRadius = "6px";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.fontFamily = "'Open Sans', sans-serif";
  container.style.lineHeight = "1.5";
  container.style.overflow = "hidden";
  container.style.zIndex = "9999";
  container.style.boxShadow = "none"; // anti-plast

  // Placering enligt data-position
  const [vert, horiz] = position.split("-");
  container.style[vert === "top" ? "top" : "bottom"] = "20px";
  if (horiz === "left") {
    container.style.left = "20px";
  } else {
    container.style.right = "20px";
  }

  // === Header (typografi, ingen färgplatta) ===
  const header = document.createElement("div");
  header.style.padding = "10px 12px";
  header.style.fontFamily = "'Archivo Black', sans-serif";
  header.style.fontSize = "16px";
  header.style.textAlign = "center";
  header.style.color = accent;
  header.textContent = `${company} – ${agent}`;
  container.appendChild(header);

  // === Messages (ren text, vänster/höger) ===
  const messages = document.createElement("div");
  messages.style.flex = "1";
  messages.style.padding = "10px 12px";
  messages.style.overflowY = "auto";
  messages.style.wordBreak = "break-word";
  container.appendChild(messages);

  // === Input-rad ===
  const inputRow = document.createElement("div");
  inputRow.style.display = "flex";
  inputRow.style.borderTop = `1px solid ${accent}`;

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Skriv ett meddelande...";
  input.style.flex = "1";
  input.style.padding = "10px";
  input.style.border = "none";
  input.style.outline = "none";
  input.style.backgroundColor = "#FDF9ED";
  input.style.color = accent;
  input.style.fontFamily = "'Open Sans', sans-serif";

  const button = document.createElement("button");
  button.textContent = "Skicka";
  button.style.backgroundColor = accent;
  button.style.color = "#fff";
  button.style.border = "none";
  button.style.padding = "10px 14px";
  button.style.cursor = "pointer";

  inputRow.appendChild(input);
  inputRow.appendChild(button);
  container.appendChild(inputRow);
  document.body.appendChild(container);

  function addMessage(text, isUser = false) {
    const line = document.createElement("div");
    line.style.margin = "6px 0";
    line.style.fontSize = "14px";
    line.style.color = accent;
    line.style.whiteSpace = "pre-wrap";
    line.style.textAlign = isUser ? "right" : "left";
    line.textContent = text;
    messages.appendChild(line);
    messages.scrollTop = messages.scrollHeight;
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text || !endpoint) return;
    addMessage(text, true);
    input.value = "";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });
      if (!res.ok) throw new Error("Serverfel");
      const data = await res.json();
      addMessage(data.reply || "(Inget svar)", false);
    } catch {
      addMessage("Kunde inte kontakta servern.", false);
    }
  }

  button.addEventListener("click", sendMessage);
  input.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(); });
})();
