(function() {
  'use strict';

  // Ladda in Google Fonts för Archivo Black & Open Sans
  const fontLink = document.createElement("link");
  fontLink.href = "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Open+Sans&display=swap";
  fontLink.rel = "stylesheet";
  document.head.appendChild(fontLink);

  // Hämta konfiguration från HTML-attribut
  const scripts = document.querySelectorAll('script[data-company]');
  const currentScript = scripts[scripts.length - 1];

  const config = {
    company: currentScript.getAttribute('data-company') || 'Ditt Företag',
    agent: currentScript.getAttribute('data-agent') || 'assistent',
    endpoint: currentScript.getAttribute('data-endpoint') || '',
    primaryColor: "#333333",   // Textfärg
    backgroundColor: "#FDF9ED", // Bakgrund
    position: currentScript.getAttribute('data-position') || 'bottom-right'
  };

  // Skapa widget-knapp
  const button = document.createElement('div');
  button.innerText = '💬';
  button.style.position = 'fixed';
  button.style[config.position.split('-')[0]] = '20px';
  button.style[config.position.split('-')[1]] = '20px';
  button.style.background = config.primaryColor;
  button.style.color = 'white';
  button.style.borderRadius = '50%';
  button.style.width = '50px';
  button.style.height = '50px';
  button.style.display = 'flex';
  button.style.alignItems = 'center';
  button.style.justifyContent = 'center';
  button.style.cursor = 'pointer';
  button.style.zIndex = '9999';
  document.body.appendChild(button);

  // Skapa chat-fönster
  const chatWindow = document.createElement('div');
  chatWindow.style.position = 'fixed';
  chatWindow.style.bottom = '80px';
  chatWindow.style.right = '20px';
  chatWindow.style.width = '300px';
  chatWindow.style.height = '400px';
  chatWindow.style.background = config.backgroundColor;
  chatWindow.style.border = `2px solid ${config.primaryColor}`;
  chatWindow.style.borderRadius = '10px';
  chatWindow.style.display = 'none';
  chatWindow.style.flexDirection = 'column';
  chatWindow.style.fontFamily = "'Open Sans', sans-serif";
  chatWindow.style.color = config.primaryColor;
  chatWindow.style.zIndex = '9999';

  // Rubrik
  const header = document.createElement('div');
  header.innerText = config.company + " – " + config.agent;
  header.style.background = config.primaryColor;
  header.style.color = 'white';
  header.style.padding = '10px';
  header.style.fontFamily = "'Archivo Black', sans-serif";
  header.style.textAlign = 'center';
  chatWindow.appendChild(header);

  // Meddelanderuta
  const messages = document.createElement('div');
  messages.style.flex = '1';
  messages.style.padding = '10px';
  messages.style.overflowY = 'auto';
  chatWindow.appendChild(messages);

  // Input-fält
  const inputWrapper = document.createElement('div');
  inputWrapper.style.display = 'flex';
  inputWrapper.style.borderTop = `1px solid ${config.primaryColor}`;

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Skriv ett meddelande...';
  input.style.flex = '1';
  input.style.border = 'none';
  input.style.padding = '10px';
  input.style.fontFamily = "'Open Sans', sans-serif";
  inputWrapper.appendChild(input);

  const sendBtn = document.createElement('button');
  sendBtn.innerText = 'Skicka';
  sendBtn.style.background = config.primaryColor;
  sendBtn.style.color = 'white';
  sendBtn.style.border = 'none';
  sendBtn.style.padding = '10px';
  sendBtn.style.cursor = 'pointer';
  inputWrapper.appendChild(sendBtn);

  chatWindow.appendChild(inputWrapper);
  document.body.appendChild(chatWindow);

  // Öppna/stäng chatten
  button.addEventListener('click', () => {
    chatWindow.style.display = chatWindow.style.display === 'none' ? 'flex' : 'none';
  });

  // Skicka meddelanden
  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    const userMsg = document.createElement('div');
    userMsg.innerText = "Du: " + text;
    messages.appendChild(userMsg);

    input.value = '';

    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });

    const data = await response.json();
    const botMsg = document.createElement('div');
    botMsg.innerText = config.agent + ": " + (data.reply || "Inget svar.");
    messages.appendChild(botMsg);

    messages.scrollTop = messages.scrollHeight;
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keypress', e => {
    if (e.key === 'Enter') sendMessage();
  });

})();
