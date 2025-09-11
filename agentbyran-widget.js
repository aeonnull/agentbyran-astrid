(function() {
  'use strict';

  // Hämta inställningar från HTML-attribut
  const scripts = document.querySelectorAll('script[data-company]');
  const currentScript = scripts[scripts.length - 1];

  const config = {
    company: currentScript.getAttribute('data-company') || 'Ditt Företag',
    agent: currentScript.getAttribute('data-agent') || 'assistent',
    endpoint: currentScript.getAttribute('data-endpoint') || '',
    primaryColor: currentScript.getAttribute('data-color') || '#2563eb',
    position: currentScript.getAttribute('data-position') || 'bottom-right',
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
  const chat = document.createElement('div');
  chat.style.position = 'fixed';
  chat.style.bottom = '80px';
  chat.style.right = '20px';
  chat.style.width = '300px';
  chat.style.height = '400px';
  chat.style.background = 'white';
  chat.style.border = '1px solid #ccc';
  chat.style.borderRadius = '10px';
  chat.style.display = 'none';
  chat.style.flexDirection = 'column';
  chat.style.overflow = 'hidden';
  chat.style.zIndex = '9999';

  const messages = document.createElement('div');
  messages.style.flex = '1';
  messages.style.padding = '10px';
  messages.style.overflowY = 'auto';
  chat.appendChild(messages);

  const inputWrapper = document.createElement('div');
  inputWrapper.style.display = 'flex';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Skriv ett meddelande...';
  input.style.flex = '1';
  input.style.padding = '10px';
  inputWrapper.appendChild(input);

  const send = document.createElement('button');
  send.innerText = 'Skicka';
  send.style.background = config.primaryColor;
  send.style.color = 'white';
  send.style.border = 'none';
  send.style.padding = '10px';
  inputWrapper.appendChild(send);

  chat.appendChild(inputWrapper);
  document.body.appendChild(chat);

  // Öppna/stäng
  button.onclick = () => {
    chat.style.display = chat.style.display === 'none' ? 'flex' : 'none';
  };

  // Skicka meddelande
  send.onclick = async () => {
    const text = input.value.trim();
    if (!text) return;
    input.value = '';

    // Lägg till användarens meddelande
    const userMsg = document.createElement('div');
    userMsg.innerText = 'Du: ' + text;
    userMsg.style.margin = '5px 0';
    messages.appendChild(userMsg);

    // Skicka till backend
    try {
      const res = await fetch(config.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();

      const botMsg = document.createElement('div');
      botMsg.innerText = config.agent + ': ' + (data.reply || 'Inget svar...');
      botMsg.style.margin = '5px 0';
      botMsg.style.fontWeight = 'bold';
      messages.appendChild(botMsg);
    } catch (e) {
      const errorMsg = document.createElement('div');
      errorMsg.innerText = '⚠️ Fel: kunde inte kontakta servern';
      errorMsg.style.color = 'red';
      messages.appendChild(errorMsg);
    }
  };
})();
