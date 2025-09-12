(function() {
  const scriptTag = document.currentScript;
  const company = scriptTag.getAttribute("data-company") || "Demo Företaget";
  const agent = scriptTag.getAttribute("data-agent") || "Agent";
  const endpoint = scriptTag.getAttribute("data-endpoint");
  const accent = scriptTag.getAttribute("data-color") || "#333333";

  // Container för hela widgeten
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.bottom = "20px";
  container.style.right = "20px";
  container.style.width = "320px";
  container.style.height = "420px";
  container.style.border = `2px solid ${accent}`;
  container.style.borderRadius = "8px";
  container.style.backgroundColor = "#fff";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.overflow = "hidden";
  container.style.fontFamily = "'Open Sans', sans-serif";
  container.style.zIndex = "9999";

  // Rubrik
  const header = document.createElement("div");
  header.style.padding = "12px";
  header.style.fontFamily = "'Archivo Black', sans-serif";
  header.style.fontSize = "16px";
  header.style.textAlign = "center";
  header.style.color = accent;
  header.textContent = `${company} – ${agent}`;
  container.appendChild(header);

  // Meddelandefönster
  const messages = document.createElement("div");
  messages.style.flex = "1";
  messages.style.padding = "10px";
  messages.style.overflowY = "auto";
  messages.style.backgroundColor = "#FDF9ED";
  container.appendChild(messages);

  // Input-rad
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
  input.style.fontFamily = "'Open Sans', sans-serif";

  const button = document.createElement("button");
  button.textContent = "Skicka";
  button.style.backgroundColor = accent;
  button.style.color = "#fff";
  button.style.border = "none";
  button.style.padding = "10px 15px";
  button.style.cursor = "pointer";

  inputRow.appendChild(input);
  inputRow.appendChild(button);
  container.appendChild(inputRow);

  document.body.appendChild(container);

  // Funktion för chattbubblor
  function addMessage(sender, text, isUser = false) {
    const bubble = document.createElement("div");
    bubble.style.maxWidth = "80%";
    bubble.style.margin = "6px";
    bubble.style.padding = "8px 12px";
    bubble.style.borderRadius = "12px";
    bubble.style.fontSize = "14px";
    bubble.style.wordWrap = "break-word";

    if (isUser) {
      bubble.style.alignSelf = "flex-end";
      bubble.style.backgroundColor = "#fff";
      bubble.style.border = `1px solid ${accent}`;
      bubble.style.color = accent;
    } else {
      bubble.style.alignSelf = "flex-start";
      bubble.style.backgroundColor = "#FDF9ED";
      bubble.style.border = `1px solid ${accent}`;
      bubble.style.color = "#333333";
    }

    bubble.textContent = text;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
  }

  // Skicka meddelanden till backend
  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    addMessage("Du", text, true);
    input.value = "";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      if (!res.ok) throw new Error("Serverfel");
      const data = await res.json();
      addMessage(agent, data.reply || "(Inget svar)", false);
    } catch (err) {
      addMessage("System", "Kunde inte kontakta servern.", false);
    }
  }

  button.addEventListener("click", sendMessage);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

})();
