(function() {
  const scriptTag = document.currentScript;
  const company = scriptTag.getAttribute("data-company") || "Demo Företaget";
  const agent = scriptTag.getAttribute("data-agent") || "säljare";
  const endpoint = scriptTag.getAttribute("data-endpoint");
  const color = scriptTag.getAttribute("data-color") || "#333333";
  const position = scriptTag.getAttribute("data-position") || "bottom-right";

  // Skapa widget-container
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.bottom = "20px";
  container.style.right = "20px";
  container.style.width = "300px";
  container.style.height = "400px";
  container.style.border = `2px solid ${color}`;
  container.style.borderRadius = "8px";
  container.style.backgroundColor = "#fff";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.overflow = "hidden";
  container.style.fontFamily = "'Open Sans', sans-serif";
  container.style.zIndex = "9999";

  // Titel
  const header = document.createElement("div");
  header.style.backgroundColor = color;
  header.style.color = "#fff";
  header.style.padding = "10px";
  header.style.fontWeight = "bold";
  header.textContent = `${company} – ${agent}`;
  container.appendChild(header);

  // Meddelandefönster
  const messages = document.createElement("div");
  messages.style.flex = "1";
  messages.style.padding = "10px";
  messages.style.overflowY = "auto";
  container.appendChild(messages);

  // Input-rad
  const inputRow = document.createElement("div");
  inputRow.style.display = "flex";
  inputRow.style.borderTop = "1px solid #ccc";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Skriv ett meddelande...";
  input.style.flex = "1";
  input.style.padding = "10px";
  input.style.border = "none";
  input.style.outline = "none";

  const button = document.createElement("button");
  button.textContent = "Skicka";
  button.style.backgroundColor = color;
  button.style.color = "#fff";
  button.style.border = "none";
  button.style.padding = "10px";
  button.style.cursor = "pointer";

  inputRow.appendChild(input);
  inputRow.appendChild(button);
  container.appendChild(inputRow);

  document.body.appendChild(container);

  // Funktion för att lägga till meddelanden
  function addMessage(sender, text) {
    const msg = document.createElement("div");
    msg.style.margin = "5px 0";
    msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  // Skicka meddelanden till backend
  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    addMessage("Du", text);
    input.value = "";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      if (!res.ok) throw new Error("Serverfel");
      const data = await res.json();
      addMessage(agent, data.reply || "(Inget svar)");
    } catch (err) {
      addMessage("System", "Kunde inte kontakta servern.");
    }
  }

  button.addEventListener("click", sendMessage);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

})();
