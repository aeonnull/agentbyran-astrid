// Lägg till Google Fonts för Archivo Black och Open Sans
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Open+Sans&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

// Skapa själva chat-fönstret
const chatWindow = document.createElement("div");
chatWindow.style.position = "fixed";
chatWindow.style.bottom = "80px";
chatWindow.style.right = "20px";
chatWindow.style.width = "350px";
chatWindow.style.height = "450px";
chatWindow.style.background = "#FDF9ED"; // din bakgrundsfärg
chatWindow.style.border = "1px solid #333333";
chatWindow.style.borderRadius = "12px";
chatWindow.style.display = "none";
chatWindow.style.flexDirection = "column";
chatWindow.style.fontFamily = "'Open Sans', sans-serif"; // brödtexten
chatWindow.style.color = "#333333";
chatWindow.style.overflow = "hidden";
chatWindow.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";

// Rubrik högst upp
const header = document.createElement("div");
header.innerText = "Agent Astrid";
header.style.fontFamily = "'Archivo Black', sans-serif"; // rubrikfont
header.style.fontSize = "18px";
header.style.fontWeight = "bold";
header.style.background = "#333333"; // mörkgrå header
header.style.color = "#FDF9ED";       // ljus text
header.style.padding = "12px";
chatWindow.appendChild(header);

// Meddelandefält
const messages = document.createElement("div");
messages.style.flex = "1";
messages.style.padding = "10px";
messages.style.overflowY = "auto";
chatWindow.appendChild(messages);

// Input-fält
const inputWrapper = document.createElement("div");
inputWrapper.style.display = "flex";
inputWrapper.style.borderTop = "1px solid #ccc";

const input = document.createElement("input");
input.type = "text";
input.placeholder = "Skriv ett meddelande...";
input.style.flex = "1";
input.style.border = "none";
input.style.padding = "10px";
input.style.fontFamily = "'Open Sans', sans-serif";

const sendBtn = document.createElement("button");
sendBtn.innerText = "Skicka";
sendBtn.style.background = "#333333";
sendBtn.style.color = "#FDF9ED";
sendBtn.style.border = "none";
sendBtn.style.padding = "10px 15px";
sendBtn.style.cursor = "pointer";
sendBtn.style.fontFamily = "'Archivo Black', sans-serif";

inputWrapper.appendChild(input);
inputWrapper.appendChild(sendBtn);
chatWindow.appendChild(inputWrapper);

document.body.appendChild(chatWindow);

// Chat-bubblan (knappen nere till höger)
const button = document.createElement("div");
button.innerText = "💬";
button.style.position = "fixed";
button.style.bottom = "20px";
button.style.right = "20px";
button.style.width = "60px";
button.style.height = "60px";
button.style.background = "#333333"; // samma mörkgrå
button.style.color = "#FDF9ED";      // samma ljusa färg
button.style.borderRadius = "50%";
button.style.display = "flex";
button.style.alignItems = "center";
button.style.justifyContent = "center";
button.style.cursor = "pointer";
button.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";
button.style.fontSize = "24px";
document.body.appendChild(button);

// Toggle öppna/stäng chatten
button.addEventListener("click", () => {
  chatWindow.style.display =
    chatWindow.style.display === "none" ? "flex" : "none";
});
