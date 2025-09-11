<!DOCTYPE html>

<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AgentByrån Widget</title>
</head>
<body>

<!-- Detta är bara för demo - kunden ser bara chatboxen -->

<div style="height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; font-family: Arial;">
    <div style="background: white; padding: 30px; border-radius: 15px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
        <h2>🤖 AgentByrån Widget Demo</h2>
        <p>Klicka på chat-bubblan för att testa!</p>
        <p style="color: #666; font-size: 12px;">Denna sida är bara för demo - kunden ser bara chatboxen</p>
    </div>
</div>

<!-- AGENTBYRÅN WIDGET - Detta är koden som körs -->

<script>
(function() {
    'use strict';
    
    // Hämta konfiguration från HTML-attribut
    const scripts = document.querySelectorAll('script[data-company]');
    const currentScript = scripts[scripts.length - 1];
    
    const config = {
        company: currentScript.getAttribute('data-company') || 'Ditt Företag',
        agent: currentScript.getAttribute('data-agent') || 'assistent',
        apikey: currentScript.getAttribute('data-apikey') || '',
        primaryColor: currentScript.getAttribute('data-color') || '#2563eb',
        position: currentScript.getAttribute('data-position') || 'bottom-right'
    };
    
    // Agent-personligheter
    const agentTypes = {
        'säljare': {
            name: 'Sara - Säljassistent',
            prompt: 'Du är Sara, en vänlig säljassistent för ' + config.company + '. Du hjälper besökare att hitta rätt produkter och svarar på frågor om priser och leveranser. Var entusiastisk men professionell.',
            welcomeMsg: 'Hej! Jag är Sara från ' + config.company + '. Vad kan jag hjälpa dig med idag? 😊'
        },
        'kundtjänst': {
            name: 'Alex - Kundtjänst',
            prompt: 'Du är Alex, en hjälpsam kundtjänstmedarbetare för ' + config.company + '. Du löser problem, svarar på frågor och hjälper kunder vidare. Var tålmodig och lösningsorienterad.',
            welcomeMsg: 'Hej! Jag är Alex från kundtjänst. Hur kan jag hjälpa dig? 🛠️'
        },
        'support': {
            name: 'Tech-Support',
            prompt: 'Du är en teknisk supportspecialist för ' + config.company + '. Du hjälper med tekniska frågor, felsökning och vägledning. Var tydlig och strukturerad i dina svar.',
            welcomeMsg: 'Hej! Jag hjälper dig med teknisk support. Vad behöver du hjälp med? 💻'
        },
        'assistent': {
            name: 'Assistent',
            prompt: 'Du är en allmän assistent för ' + config.company + '. Du svarar på frågor och hjälper besökare med information om företaget och dess tjänster.',
            welcomeMsg: 'Hej! Välkommen till ' + config.company + '. Vad kan jag hjälpa dig med? 👋'
        }
    };
    
    const currentAgent = agentTypes[config.agent] || agentTypes['assistent'];
    
    // Skapa chat-widget CSS
    const style = document.createElement('style');
    style.textContent = `
        .agentbyran-chat-widget {
            position: fixed;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .agentbyran-chat-button {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: ${config.primaryColor};
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            transition: all 0.3s ease;
        }
        
        .agentbyran-chat-button:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(0,0,0,0.25);
        }
        
        .agentbyran-chat-window {
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.12);
            display: none;
            flex-direction: column;
            overflow: hidden;
            position: absolute;
        }
        
        .agentbyran-chat-header {
            background: ${config.primaryColor};
            color: white;
            padding: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .agentbyran-chat-title {
            font-weight: 600;
            font-size: 16px;
        }
        
        .agentbyran-chat-close {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .agentbyran-chat-messages {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        .agentbyran-message {
            max-width: 80%;
            padding: 12px 16px;
            border-radius: 18px;
            word-wrap: break-word;
            line-height: 1.4;
        }
        
        .agentbyran-message.user {
            background: #e5e7eb;
            color: #374151;
            align-self: flex-end;
            margin-left: auto;
        }
        
        .agentbyran-message.bot {
            background: ${config.primaryColor};
            color: white;
            align-self: flex-start;
        }
        
        .agentbyran-chat-input-container {
            padding: 15px;
            border-top: 1px solid #e5e7eb;
            display: flex;
            gap: 10px;
        }
        
        .agentbyran-chat-input {
            flex: 1;
            border: 1px solid #d1d5db;
            border-radius: 20px;
            padding: 10px 15px;
            font-size: 14px;
            outline: none;
        }
        
        .agentbyran-chat-input:focus {
            border-color: ${config.primaryColor};
        }
        
        .agentbyran-send-button {
            background: ${config.primaryColor};
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
        }
        
        .agentbyran-loading {
            display: flex;
            gap: 4px;
            padding: 12px 16px;
        }
        
        .agentbyran-loading-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: white;
            animation: agentbyran-loading 1.4s ease-in-out infinite both;
        }
        
        .agentbyran-loading-dot:nth-child(1) { animation-delay: -0.32s; }
        .agentbyran-loading-dot:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes agentbyran-loading {
            0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
            40% { opacity: 1; transform: scale(1); }
        }
        
        /* Positionering */
        .agentbyran-position-bottom-right {
            bottom: 20px;
            right: 20px;
        }
        
        .agentbyran-position-bottom-right .agentbyran-chat-window {
            bottom: 70px;
            right: 0;
        }
        
        .agentbyran-position-bottom-left {
            bottom: 20px;
            left: 20px;
        }
        
        .agentbyran-position-bottom-left .agentbyran-chat-window {
            bottom: 70px;
            left: 0;
        }
        
        @media (max-width: 480px) {
            .agentbyran-chat-window {
                width: calc(100vw - 40px);
                height: calc(100vh - 100px);
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                bottom: auto;
                right: auto;
            }
        }
    `;
    
    document.head.appendChild(style);
    
    // Skapa widget-element
    const widget = document.createElement('div');
    widget.className = `agentbyran-chat-widget agentbyran-position-${config.position}`;
    
    widget.innerHTML = `
        <button class="agentbyran-chat-button">
            💬
        </button>
        <div class="agentbyran-chat-window">
            <div class="agentbyran-chat-header">
                <div class="agentbyran-chat-title">${currentAgent.name}</div>
                <button class="agentbyran-chat-close">×</button>
            </div>
            <div class="agentbyran-chat-messages"></div>
            <div class="agentbyran-chat-input-container">
                <input type="text" class="agentbyran-chat-input" placeholder="Skriv ditt meddelande...">
                <button class="agentbyran-send-button">➤</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(widget);
    
    // Widget-funktionalitet
    const chatButton = widget.querySelector('.agentbyran-chat-button');
    const chatWindow = widget.querySelector('.agentbyran-chat-window');
    const closeButton = widget.querySelector('.agentbyran-chat-close');
    const messagesContainer = widget.querySelector('.agentbyran-chat-messages');
    const inputField = widget.querySelector('.agentbyran-chat-input');
    const sendButton = widget.querySelector('.agentbyran-send-button');
    
    let isOpen = false;
    let conversation = [];
    
    // Visa välkomstmeddelande
    function showWelcomeMessage() {
        addMessage(currentAgent.welcomeMsg, 'bot');
    }
    
    // Lägg till meddelande
    function addMessage(text, sender) {
        const messageEl = document.createElement('div');
        messageEl.className = `agentbyran-message ${sender}`;
        messageEl.textContent = text;
        messagesContainer.appendChild(messageEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Spara i konversation
        conversation.push({role: sender === 'user' ? 'user' : 'assistant', content: text});
    }
    
    // Visa laddning
    function showLoading() {
        const loadingEl = document.createElement('div');
        loadingEl.className = 'agentbyran-message bot';
        loadingEl.innerHTML = `
            <div class="agentbyran-loading">
                <div class="agentbyran-loading-dot"></div>
                <div class="agentbyran-loading-dot"></div>
                <div class="agentbyran-loading-dot"></div>
            </div>
        `;
        messagesContainer.appendChild(loadingEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return loadingEl;
    }
    
    // Skicka meddelande till API
    async function sendToAPI(message) {
        if (!config.apikey) {
            return 'Fel: API-nyckel saknas. Kontakta webbplatsens administratör.';
        }
        
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.apikey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {role: 'system', content: currentAgent.prompt},
                        ...conversation.slice(-10), // Begränsa historik
                        {role: 'user', content: message}
                    ],
                    max_tokens: 500,
                    temperature: 0.7
                })
            });
            
            const data = await response.json();
            
            if (data.error) {
                return `Fel: ${data.error.message}`;
            }
            
            return data.choices[0].message.content;
            
        } catch (error) {
            console.error('API Error:', error);
            return 'Ursäkta, jag har problem med anslutningen just nu. Försök igen om ett ögonblick.';
        }
    }
    
    // Hantera meddelanden
    async function handleMessage(message) {
        if (!message.trim()) return;
        
        addMessage(message, 'user');
        inputField.value = '';
        
        const loadingEl = showLoading();
        const response = await sendToAPI(message);
        messagesContainer.removeChild(loadingEl);
        
        addMessage(response, 'bot');
    }
    
    // Event listeners
    chatButton.addEventListener('click', () => {
        isOpen = !isOpen;
        chatWindow.style.display = isOpen ? 'flex' : 'none';
        if (isOpen && conversation.length === 0) {
            showWelcomeMessage();
        }
    });
    
    closeButton.addEventListener('click', () => {
        isOpen = false;
        chatWindow.style.display = 'none';
    });
    
    sendButton.addEventListener('click', () => {
        handleMessage(inputField.value);
    });
    
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleMessage(inputField.value);
        }
    });
    
    // Klicka utanför för att stänga (mobil)
    document.addEventListener('click', (e) => {
        if (isOpen && !widget.contains(e.target)) {
            isOpen = false;
            chatWindow.style.display = 'none';
        }
    });
    
})();
</script>

<!-- DEMO: Så här använder kunden widgeten -->

<script src="https://DITT-GITHUB-ANVÄNDARNAMN.github.io/agentbyran-widget.js" 
        data-company="Demo Företag"
        data-agent="säljare" 
        data-apikey="SÄTT_IN_RIKTIG_NYCKEL_HÄR"
        data-color="#2563eb"
        data-position="bottom-right">
</script>

</body>
</html>
