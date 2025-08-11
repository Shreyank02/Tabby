class ChatBot {
    constructor() {
        this.API_BASE_URL = 'http://127.0.0.1:8000'; // using 127.0.0.1 for extension safety
        this.status = 'loading';
        this.messages = [];
        this.currentUrl = '';
        this.sessionId = '';
        this.isTyping = false;

        // Get DOM elements
        this.elements = {
            status: document.getElementById('status'),
            statusText: document.getElementById('status-text'),
            urlDisplay: document.getElementById('url-display'),
            messagesContainer: document.getElementById('messages'),
            inputField: document.getElementById('input-field'),
            sendButton: document.getElementById('send-button'),
            retryButton: document.getElementById('retry-button')
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeChatbot();
    }

    setupEventListeners() {
        this.elements.sendButton.addEventListener('click', () => this.sendMessage());

        this.elements.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        this.elements.retryButton.addEventListener('click', () => this.initializeChatbot());
    }

    async initializeChatbot() {
        try {
            this.setStatus('loading', 'Loading webpage...');
            this.elements.retryButton.style.display = 'none';

            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            const url = tab?.url || "";

            console.log("[DEBUG] Current tab URL:", url);

            if (!url || url.startsWith('chrome://') || url.startsWith('chrome-extension://')) {
                this.setStatus('error', 'Error occurred');
                this.addMessage('bot', 'This extension cannot work on Chrome internal pages. Please navigate to a regular webpage.');
                this.elements.retryButton.style.display = 'block';
                return;
            }

            this.currentUrl = url;
            this.updateUrlDisplay();

            this.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

            const payload = {
                session_id: this.sessionId,
                url: url
            };

            console.log("[DEBUG] Sending to /load-url:", payload);

            const response = await fetch(`${this.API_BASE_URL}/load-url`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                console.error("[ERROR] Backend responded with error:", result);
                throw new Error(result.detail || `Failed to load URL: ${response.statusText}`);
            }

            console.log("[DEBUG] /load-url success:", result);

            this.setStatus('ready', 'Ready to chat!');
            this.addMessage('bot', 'Hi! I\'ve analyzed this webpage and I\'m ready to answer your questions about it. What would you like to know?');
            this.enableInput();

        } catch (error) {
            console.error('Error initializing chatbot:', error);
            this.setStatus('error', 'Error occurred');
            this.addMessage('bot', `Failed to initialize: ${error.message}`);
            this.elements.retryButton.style.display = 'block';
        }
    }

    async sendMessage() {
        const message = this.elements.inputField.value.trim();
        if (!message || this.isTyping) return;

        this.elements.inputField.value = '';
        this.disableInput();

        this.addMessage('user', message);
        this.showTypingIndicator();

        try {
            const payload = {
                session_id: this.sessionId,
                question: message
            };

            console.log("[DEBUG] Sending to /ask:", payload);

            const response = await fetch(`${this.API_BASE_URL}/ask`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                console.error("[ERROR] Backend responded with error:", data);
                throw new Error(data.detail || `Failed to get response: ${response.statusText}`);
            }

            console.log("[DEBUG] /ask success:", data);

            this.hideTypingIndicator();
            this.addMessage('bot', data.answer);

        } catch (error) {
            console.error('Error sending message:', error);
            this.hideTypingIndicator();
            this.addMessage('bot', `Error: ${error.message}`);
        } finally {
            this.enableInput();
        }
    }

    setStatus(status, text) {
        this.status = status;
        this.elements.status.className = `status ${status}`;
        this.elements.statusText.textContent = text;
    }

    updateUrlDisplay() {
        if (this.currentUrl) {
            this.elements.urlDisplay.textContent = '📄 ' + new URL(this.currentUrl).hostname;
            this.elements.urlDisplay.style.display = 'block';
        }
    }

    addMessage(type, text) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = text;

        this.elements.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();

        this.messages.push({ type, text });
    }

    showTypingIndicator() {
        this.isTyping = true;
        const typingElement = document.createElement('div');
        typingElement.id = 'typing-indicator';
        typingElement.className = 'message bot typing-indicator';

        const textSpan = document.createElement('span');
        textSpan.textContent = 'Tabby is thinking';

        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'typing-dots';

        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            dotsContainer.appendChild(dot);
        }

        typingElement.appendChild(textSpan);
        typingElement.appendChild(dotsContainer);

        this.elements.messagesContainer.appendChild(typingElement);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.isTyping = false;
        const typingElement = document.getElementById('typing-indicator');
        if (typingElement) typingElement.remove();
    }

    enableInput() {
        if (this.status === 'ready') {
            this.elements.inputField.disabled = false;
            this.elements.sendButton.disabled = false;
            this.elements.inputField.focus();
        }
    }

    disableInput() {
        this.elements.inputField.disabled = true;
        this.elements.sendButton.disabled = true;
    }

    scrollToBottom() {
        this.elements.messagesContainer.scrollTop = this.elements.messagesContainer.scrollHeight;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ChatBot();
});
