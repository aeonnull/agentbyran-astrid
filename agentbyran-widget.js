(function () {
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

  // Lägg till Google Fonts för Archivo Black och Open Sans
  const fontLink = document.createElement('link');
  fontLink.href = "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Open+Sans&display=swap";
  fontLink.rel = "stylesheet";
  document.head.appendChild(fontLink);

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

  // Skapa widget-fönster
  const widget = document.createElement('div');
  widget.style.position = 'fixed';
  widget.style.bottom = '80px';
  widget.style.right = '20px';
  widget.style.width = '300px';
  widget.style.height = '400px';
  widget.style.background = '#FDF9ED';
  widget.style.border = '1px solid #333333';
  widget.style.borderRadius = '10px';
  widget.style.display = 'none';
  widget.style.flexDirection = 'column';
  widget.style.fontFamily = "'Open Sans', sans-serif"; // ← Brödtext
  widget.style.zIndex = '9999';

  // Rubrik
  const header = document.createElement('div');
  header.innerText = `${config.company} – ${config.agent}`;
  header.style.background = '#333333';
  header.style.color = 'white';
  header.style.padding = '10px';
  header.style.borderTopLeftRadius = '10px';
  header.style.borderTopRightRadius = '10px';
  header.style.fontFamily = "'Archivo Black', sans-serif"; // ← Rubrik
  widget.appendChild(header);

  // Meddelandefönster
  const messages = document.createElement('div');
  messages.style.flex = '1';
  messages.style.padding = '10px';
  messages.style.overflowY = 'auto';
  messages.style.fontFamily = "'Open Sans', sans-serif"; // ← Text i chatten
  widget.appendChild(messages);

  // Inputfält
  const inputContainer = document.createElement('div');
  inputContainer.style.display = 'flex';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Skriv ett meddelande...';
  input.style.flex = '1';
  input.style.padding = '10px';
  input.style.border = 'none';
  input.style.outline = 'none';
  input.style.fontFamily = "'Open Sans', sans-serif";

  const sendButton = document.createElement('button');
  sendButton.innerText = 'Skicka';
  sendButton.style.background = config.primaryColor;
  sendButton.style.color = 'white';
  sendButton.style.border = 'none';
  sendButton.style.padding = '10px';
  sendButton.style.cursor = 'pointer';
  sendButton.style.fontFamily = "'Open Sans', sans-serif";

  inputContainer.appendChild(input);
  inputContainer.appendChild(sendButton);
  widget.appendChild(inputContainer);

  document.body.appendChild(widget);

  // Öppna/stänga widget
  button.addEventListener('click', () => {
    widget.style.display = widget.style.display === 'none' ? 'flex' : 'none';
  });

  // Skicka meddelande
  sendButton.addEventListener('click', async () => {
    const userMessage = input.value.trim();
    if (!userMessage) return;

    const userDiv = document.createElement('div');
    userDiv.innerText = `Du: ${userMessage}`;
    messages.appendChild(userDiv);

    input.value = '';

    try {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await response.json();

      const agentDiv = document.createElement('div');
      agentDiv.innerText = `${config.agent}: ${data.reply || 'Inget svar'}`;
      messages.appendChild(agentDiv);

    } catch (error) {
      const errorDiv = document.createElement('div');
      errorDiv.innerText = 'Fel: Kunde inte kontakta servern.';
      messages.appendChild(errorDiv);
    }

    messages.scrollTop = messages.scrollHeight;
  });
})();
