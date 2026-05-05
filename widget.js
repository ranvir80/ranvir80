(function() {
'use strict';

// ===== CONFIGURATION =====
const API_ENDPOINT = 'https://webai.pardeshiranvir156.workers.dev';
const TURNSTILE_SITEKEY = '0x4AAAAAADIuUSieP368XCOf';
const STORAGE_KEY_USER = 'chatbot_user_data_v3';
const STORAGE_KEY_HISTORY = 'chatbot_history_v3';

// ===== STATE =====
let userData = null;
let sessionToken = null;
let turnstileToken = null;
let chatHistory = [];
let isOpen = false;
let floatingMessageInterval = null;
let isTyping = false;

// ===== MARKDOWN PARSER =====
function parseMarkdown(text) {
    if (!text) return '';
    
    // Escape HTML
    let html = text.replace(/&/g, '&amp;')
                   .replace(/</g, '&lt;')
                   .replace(/>/g, '&gt;')
                   .replace(/"/g, '&quot;')
                   .replace(/'/g, '&#039;');

    // Code Blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, function(match, lang, code) {
        const language = lang ? lang.trim() : 'text';
        const cleanCode = code.trim();
        return `<div class="cb-code-block">
            <div class="cb-code-header">
                <span class="cb-code-lang">${language}</span>
                <button class="cb-copy-btn" onclick="window.cbCopyCode(this)">Copy</button>
            </div>
            <pre><code>${cleanCode}</code></pre>
        </div>`;
    });

    // Inline Code
    html = html.replace(/`([^`]+)`/g, '<code class="cb-inline-code">$1</code>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Newlines
    html = html.replace(/\n/g, '<br>');

    return html;
}

// Global copy function
window.cbCopyCode = function(btn) {
    const codeBlock = btn.closest('.cb-code-block').querySelector('code');
    const text = codeBlock.innerText;
    navigator.clipboard.writeText(text).then(() => {
        const originalText = btn.innerText;
        btn.innerText = 'Copied!';
        btn.style.color = '#4caf50';
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.color = '';
        }, 2000);
    });
};

// ===== STYLES =====
const styles = `
.cb-container * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
.cb-container { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }

/* Floating Button - White Circle, Black Icon */
.cb-button-wrapper {
    position: fixed; bottom: 20px; right: 20px; z-index: 9998;
}
.cb-button {
    width: 60px; height: 60px;
    border-radius: 50%;
    background: #ffffff;
    color: #000000;
    border: 1px solid #eaeaea;
    cursor: pointer;
    font-size: 26px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    position: relative;
    z-index: 2;
}
.cb-button:hover { transform: scale(1.1); box-shadow: 0 6px 25px rgba(0,0,0,0.2); }
.cb-button:active { transform: scale(0.95); }

/* Pulse Animation */
.cb-pulse-ring {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 60px; height: 60px;
    border-radius: 50%;
    border: 1px solid rgba(0,0,0,0.1);
    animation: cbPulse 3s infinite;
    z-index: 1;
}
.cb-pulse-ring:nth-child(2) { animation-delay: 1s; }
.cb-pulse-ring:nth-child(3) { animation-delay: 2s; }
@keyframes cbPulse {
    0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
    100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
}

/* Tooltip */
.cb-tooltip {
    position: absolute; bottom: 70px; right: 0;
    background: rgba(255,255,255,0.95);
    color: #333; padding: 8px 14px;
    border-radius: 8px;
    font-size: 13px; font-weight: 500;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    opacity: 0; transform: translateY(10px);
    pointer-events: none;
    transition: all 0.3s ease;
    white-space: nowrap;
}
.cb-tooltip.show { opacity: 1; transform: translateY(0); }

/* Chat Window */
.cb-window {
    position: fixed; bottom: 90px; right: 20px;
    width: 380px; max-width: calc(100vw - 40px);
    height: 550px; max-height: calc(100vh - 120px);
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
    display: flex; flex-direction: column;
    overflow: hidden;
    opacity: 0; transform: translateY(20px) scale(0.95);
    pointer-events: none;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    z-index: 9999;
    border: 1px solid #f0f0f0;
}
.cb-window.open {
    opacity: 1; transform: translateY(0) scale(1);
    pointer-events: all;
}

/* Mobile Full Screen */
@media (max-width: 768px) {
    .cb-window {
        bottom: 0; right: 0; left: 0; top: 0;
        width: 100vw; height: 100dvh;
        max-width: 100vw; max-height: 100dvh;
        border-radius: 0;
    }
    .cb-button-wrapper { bottom: 15px; right: 15px; }
}

/* Header */
.cb-header {
    background: #000; color: #fff;
    padding: 16px 20px;
    display: flex; justify-content: space-between; align-items: center;
    flex-shrink: 0;
}
.cb-title { font-size: 16px; font-weight: 600; letter-spacing: 0.5px; }
.cb-close {
    background: none; border: none; color: #fff;
    font-size: 24px; cursor: pointer;
    opacity: 0.8; transition: opacity 0.2s;
}
.cb-close:hover { opacity: 1; }

/* Body */
.cb-body {
    flex: 1; overflow-y: auto;
    padding: 20px;
    background: #fafafa;
    scroll-behavior: smooth;
}
.cb-body::-webkit-scrollbar { width: 6px; }
.cb-body::-webkit-scrollbar-thumb { background: #ddd; border-radius: 3px; }

/* Forms */
.cb-form {
    background: #fff; padding: 24px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    display: flex; flex-direction: column; gap: 16px;
}
.cb-input-group label {
    display: block; font-size: 13px; font-weight: 600;
    color: #333; margin-bottom: 6px;
}
.cb-input-group input {
    width: 100%; padding: 12px 14px;
    border: 1px solid #ddd; border-radius: 8px;
    font-size: 16px; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    background: #fff; color: #000;
    -webkit-appearance: none;
}
.cb-input-group input:focus {
    border-color: #000; box-shadow: 0 0 0 3px rgba(0,0,0,0.05);
}
.cb-submit-btn {
    background: #000; color: #fff;
    border: none; padding: 14px;
    border-radius: 8px; font-size: 15px; font-weight: 600;
    cursor: pointer; transition: background 0.2s;
}
.cb-submit-btn:hover { background: #333; }
.cb-submit-btn:disabled { background: #ccc; cursor: not-allowed; }
.cb-error {
    color: #d32f2f; font-size: 12px;
    background: #ffebee; padding: 8px;
    border-radius: 4px; text-align: center;
    display: none;
}

/* Messages */
.cb-messages { display: flex; flex-direction: column; gap: 16px; }
.cb-msg {
    display: flex; align-items: flex-end;
    animation: cbSlideUp 0.3s ease forwards;
    opacity: 0; transform: translateY(10px);
}
@keyframes cbSlideUp { to { opacity: 1; transform: translateY(0); } }

.cb-msg.user { justify-content: flex-end; }
.cb-msg.bot { justify-content: flex-start; }

.cb-bubble {
    max-width: 85%;
    padding: 12px 16px;
    border-radius: 18px;
    font-size: 14px; line-height: 1.6;
    word-wrap: break-word;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.cb-msg.user .cb-bubble {
    background: #000; color: #fff;
    border-bottom-right-radius: 4px;
}
.cb-msg.bot .cb-bubble {
    background: #fff; color: #333;
    border: 1px solid #eee;
    border-bottom-left-radius: 4px;
}

/* Error Bubble */
.cb-msg.error .cb-bubble {
    background: #ffebee; color: #c62828;
    border: 1px solid #ffcdd2;
    text-align: center; font-size: 13px;
}

/* Markdown Styles */
.cb-bubble strong { font-weight: 700; }
.cb-bubble em { font-style: italic; }
.cb-inline-code {
    background: rgba(0,0,0,0.06);
    padding: 2px 4px; border-radius: 4px;
    font-family: monospace; font-size: 0.9em;
    color: #d32f2f;
}
.cb-code-block {
    background: #1e1e1e; border-radius: 8px;
    margin: 10px 0; overflow: hidden;
    font-family: monospace; font-size: 13px;
}
.cb-code-header {
    display: flex; justify-content: space-between;
    padding: 8px 12px; background: #2d2d2d;
    border-bottom: 1px solid #333;
}
.cb-code-lang { color: #aaa; font-size: 11px; text-transform: uppercase; }
.cb-copy-btn {
    background: transparent; border: 1px solid #555;
    color: #ccc; font-size: 10px; padding: 2px 8px;
    border-radius: 4px; cursor: pointer;
}
.cb-copy-btn:hover { background: #444; color: #fff; }
.cb-code-block pre {
    margin: 0; padding: 12px;
    overflow-x: auto; color: #d4d4d4;
}

/* Typing Indicator */
.cb-typing {
    display: flex; gap: 4px;
    padding: 12px 16px;
    background: #fff; border: 1px solid #eee;
    border-radius: 18px; border-bottom-left-radius: 4px;
    width: fit-content;
}
.cb-typing span {
    width: 6px; height: 6px;
    background: #999; border-radius: 50%;
    animation: cbBounce 1.4s infinite ease-in-out;
}
.cb-typing span:nth-child(1) { animation-delay: -0.32s; }
.cb-typing span:nth-child(2) { animation-delay: -0.16s; }
@keyframes cbBounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
}

/* Input Area */
.cb-input-area {
    padding: 16px;
    background: #fff;
    border-top: 1px solid #f0f0f0;
    display: flex; gap: 10px; align-items: flex-end;
    flex-shrink: 0;
}
.cb-textarea {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid #ddd;
    border-radius: 24px;
    font-size: 16px; /* Prevents iOS zoom */
    outline: none;
    resize: none;
    max-height: 100px;
    min-height: 44px;
    line-height: 1.4;
    background: #fafafa;
    transition: all 0.2s;
    -webkit-appearance: none;
}
.cb-textarea:focus {
    background: #fff;
    border-color: #000;
    box-shadow: 0 0 0 3px rgba(0,0,0,0.05);
}
.cb-send-btn {
    width: 44px; height: 44px;
    background: #000; color: #fff;
    border: none; border-radius: 50%;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    transition: transform 0.2s, background 0.2s;
}
.cb-send-btn:hover:not(:disabled) { background: #333; transform: scale(1.05); }
.cb-send-btn:disabled { background: #eee; color: #ccc; cursor: not-allowed; }

.cb-footer {
    padding: 8px;
    text-align: center;
    font-size: 10px; color: #aaa;
    background: #fff;
    border-top: 1px solid #f0f0f0;
}
`;

// ===== UTILS =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function scrollToBottom() {
    const body = document.querySelector('.cb-body');
    if (body) {
        setTimeout(() => {
            body.scrollTop = body.scrollHeight;
        }, 50);
    }
}

// ===== STORAGE =====
function loadState() {
    const userStr = localStorage.getItem(STORAGE_KEY_USER);
    const histStr = localStorage.getItem(STORAGE_KEY_HISTORY);
    
    if (userStr) {
        try {
            userData = JSON.parse(userStr);
            sessionToken = localStorage.getItem('cb_session_token');
        } catch(e) {}
    }
    
    if (histStr) {
        try {
            chatHistory = JSON.parse(histStr);
        } catch(e) {
            chatHistory = [];
        }
    }
}

function saveState() {
    if (userData) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
        localStorage.setItem('cb_session_token', sessionToken);
    }
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(chatHistory));
}

// ===== TURNSTILE LOADER =====
function loadTurnstileScript(callback) {
    if (typeof turnstile !== 'undefined') {
        callback();
        return;
    }
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = callback;
    document.head.appendChild(script);
}

function renderTurnstile() {
    const container = document.getElementById('cb-turnstile');
    if (!container) return;
    
    loadTurnstileScript(() => {
        if (container.hasChildNodes()) return; // Already rendered
        
        turnstile.render('#cb-turnstile', {
            sitekey: TURNSTILE_SITEKEY,
            callback: (t) => { 
                turnstileToken = t; 
            },
            'error-callback': () => {
                console.error('Turnstile error');
            }
        });
    });
}

// ===== UI RENDERING =====
function renderMessages() {
    const container = document.querySelector('.cb-messages');
    if (!container) return;
    
    container.innerHTML = '';
    
    chatHistory.forEach(msg => {
        const el = document.createElement('div');
        el.className = `cb-msg ${msg.role}`;
        
        if (msg.role === 'error') {
             el.innerHTML = `<div class="cb-bubble">⚠️ ${escapeHtml(msg.content)}</div>`;
        } else {
            const content = msg.role === 'bot' ? parseMarkdown(msg.content) : escapeHtml(msg.content);
            el.innerHTML = `<div class="cb-bubble">${content}</div>`;
        }
        container.appendChild(el);
    });
    
    scrollToBottom();
}

function addMessageToUI(role, content) {
    const container = document.querySelector('.cb-messages');
    if (!container) return;

    const el = document.createElement('div');
    el.className = `cb-msg ${role}`;
    
    if (role === 'error') {
         el.innerHTML = `<div class="cb-bubble">⚠️ ${escapeHtml(content)}</div>`;
    } else {
        const parsed = role === 'bot' ? parseMarkdown(content) : escapeHtml(content);
        el.innerHTML = `<div class="cb-bubble">${parsed}</div>`;
    }
    
    container.appendChild(el);
    scrollToBottom();
}

function showTypingIndicator() {
    const container = document.querySelector('.cb-messages');
    if (!container) return;
    
    const el = document.createElement('div');
    el.className = 'cb-msg bot';
    el.id = 'cb-typing-el';
    el.innerHTML = `
        <div class="cb-typing">
            <span></span><span></span><span></span>
        </div>
    `;
    container.appendChild(el);
    scrollToBottom();
    isTyping = true;
}

function hideTypingIndicator() {
    const el = document.getElementById('cb-typing-el');
    if (el) el.remove();
    isTyping = false;
}

// ===== API LOGIC =====
async function sendMessage() {
    const input = document.querySelector('.cb-textarea');
    const btn = document.querySelector('.cb-send-btn');
    
    if (!input || !btn || isTyping) return;
    
    const text = input.value.trim();
    if (!text) return;
    
    // UI Update
    input.value = '';
    input.style.height = 'auto';
    btn.disabled = true;
    
    // Add User Message
    chatHistory.push({ role: 'user', content: text });
    addMessageToUI('user', text);
    saveState();
    
    showTypingIndicator();
    
    try {
        const res = await fetch(`${API_ENDPOINT}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionToken}`
            },
            body: JSON.stringify({ message: text })
        });
        
        hideTypingIndicator();
        
        if (!res.ok) {
            if (res.status === 429) {
                throw new Error('RATE_LIMIT');
            }
            if (res.status === 401) {
                localStorage.clear();
                location.reload();
                return;
            }
            throw new Error('NETWORK_ERROR');
        }
        
        const data = await res.json();
        const reply = data.reply || "I couldn't generate a response.";
        
        chatHistory.push({ role: 'bot', content: reply });
        addMessageToUI('bot', reply);
        saveState();
        
    } catch (err) {
        hideTypingIndicator();
        let errorMsg = "Connection failed. Please try again.";
        if (err.message === 'RATE_LIMIT') {
            errorMsg = "You're sending messages too fast. Please wait a moment.";
        }
        
        chatHistory.push({ role: 'error', content: errorMsg });
        addMessageToUI('error', errorMsg);
        saveState();
    } finally {
        btn.disabled = false;
        input.focus();
    }
}

// ===== INITIALIZATION FLOW =====
function initRegistration() {
    const body = document.querySelector('.cb-body');
    body.innerHTML = `
        <div class="cb-form">
            <div class="cb-input-group">
                <label>Name</label>
                <input type="text" id="cb-name" placeholder="Your Name" autocomplete="name">
            </div>
            <div class="cb-input-group">
                <label>Email</label>
                <input type="email" id="cb-email" placeholder="your@email.com" autocomplete="email">
            </div>
            <div id="cb-turnstile" style="margin-top: 10px;"></div>
            <div class="cb-error" id="cb-reg-error"></div>
            <button class="cb-submit-btn" id="cb-reg-btn">Start Chatting</button>
        </div>
    `;
    
    // Render Turnstile immediately
    renderTurnstile();
    
    document.getElementById('cb-reg-btn').onclick = async () => {
        const name = document.getElementById('cb-name').value.trim();
        const email = document.getElementById('cb-email').value.trim();
        const errEl = document.getElementById('cb-reg-error');
        const btn = document.getElementById('cb-reg-btn');
        
        errEl.style.display = 'none';
        
        if (!name || !email) {
            errEl.innerText = "Please fill in all fields.";
            errEl.style.display = 'block';
            return;
        }
        if (!isValidEmail(email)) {
            errEl.innerText = "Invalid email address.";
            errEl.style.display = 'block';
            return;
        }
        if (!turnstileToken) {
            errEl.innerText = "Please complete the security check.";
            errEl.style.display = 'block';
            return;
        }
        
        btn.disabled = true;
        btn.innerText = "Connecting...";
        
        try {
            const res = await fetch(`${API_ENDPOINT}/init`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, captchaToken: turnstileToken })
            });
            
            if (!res.ok) throw new Error("Registration failed");
            
            const data = await res.json();
            userData = { name, email, userId: data.userId };
            sessionToken = data.sessionToken;
            saveState();
            
            initChatInterface();
            
            // Welcome Message
            const welcomeMsg = `Hi ${name}! 👋 I'm your AI assistant.`;
            chatHistory.push({ role: 'bot', content: welcomeMsg });
            addMessageToUI('bot', welcomeMsg);
            saveState();
            
        } catch (e) {
            errEl.innerText = "Error connecting. Try again.";
            errEl.style.display = 'block';
            btn.disabled = false;
            btn.innerText = "Start Chatting";
        }
    };
}

function initChatInterface() {
    const body = document.querySelector('.cb-body');
    const footer = document.querySelector('.cb-footer');
    
    // Remove existing input if any
    const oldInput = document.querySelector('.cb-input-area');
    if (oldInput) oldInput.remove();
    
    body.innerHTML = '<div class="cb-messages"></div>';
    renderMessages(); // Load history
    
    const inputArea = document.createElement('div');
    inputArea.className = 'cb-input-area';
    inputArea.innerHTML = `
        <textarea class="cb-textarea" placeholder="Type a message..." rows="1"></textarea>
        <button class="cb-send-btn">➤</button>
    `;
    
    body.parentNode.insertBefore(inputArea, footer);
    
    const textarea = inputArea.querySelector('.cb-textarea');
    const sendBtn = inputArea.querySelector('.cb-send-btn');
    
    // Auto-resize textarea
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
    
    // Send on Click
    sendBtn.onclick = sendMessage;
    
    // Send on Enter
    textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
}

function toggleWidget() {
    isOpen = !isOpen;
    const win = document.querySelector('.cb-window');
    const tooltip = document.querySelector('.cb-tooltip');
    
    if (isOpen) {
        win.classList.add('open');
        tooltip.classList.remove('show');
        
        // Focus input after animation
        setTimeout(() => {
            const inp = document.querySelector('.cb-textarea');
            if (inp) inp.focus();
        }, 300);
    } else {
        win.classList.remove('open');
    }
}

// ===== MAIN BUILD =====
function buildWidget() {
    // Inject Styles
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
    
    // Create DOM
    const container = document.createElement('div');
    container.className = 'cb-container';
    
    container.innerHTML = `
        <div class="cb-button-wrapper">
            <div class="cb-pulse-ring"></div>
            <div class="cb-pulse-ring"></div>
            <div class="cb-pulse-ring"></div>
            <button class="cb-button" aria-label="Open Chat">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </button>
            <div class="cb-tooltip">Need help? 💬</div>
        </div>
        
        <div class="cb-window">
            <div class="cb-header">
                <span class="cb-title">Assistant</span>
                <button class="cb-close">×</button>
            </div>
            <div class="cb-body"></div>
            <div class="cb-footer">Powered by Lonely Spart</div>
        </div>
    `;
    
    document.body.appendChild(container);
    
    // Event Listeners
    container.querySelector('.cb-button').onclick = toggleWidget;
    container.querySelector('.cb-close').onclick = toggleWidget;
    
    // Tooltip Loop
    setInterval(() => {
        if (!isOpen) {
            const tt = container.querySelector('.cb-tooltip');
            tt.classList.add('show');
            setTimeout(() => tt.classList.remove('show'), 4000);
        }
    }, 15000);
    
    // Init Logic
    loadState();
    if (sessionToken) {
        initChatInterface();
    } else {
        initRegistration();
    }
}

// Start
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildWidget);
} else {
    buildWidget();
}

})();