/**
 * Chatbot functionality for Naya Sawera Foundation website
 * Handles chat interface, message sending, and AI responses
 */

class NayaSaweraChatbot {
    constructor() {
        this.isOpen = false;
        this.isTyping = false;
        this.messageHistory = [];
        this.apiEndpoint = '/chatbot';
        
        this.initializeChatbot();
        this.bindEvents();
        this.loadWelcomeMessage();
    }
    
    initializeChatbot() {
        this.chatContainer = document.getElementById('chatbot-container');
        this.chatToggle = document.getElementById('chatbot-toggle');
        this.chatPopup = document.getElementById('chatbot-popup');
        this.chatClose = document.getElementById('chatbot-close');
        this.chatMessages = document.getElementById('chatbot-messages');
        this.chatInput = document.getElementById('chatbot-input');
        this.chatSend = document.getElementById('chatbot-send');
        
        if (!this.chatContainer) {
            console.warn('Chatbot container not found');
            return;
        }
        
        // Set initial state
        this.chatPopup.classList.add('hidden');
    }
    
    bindEvents() {
        if (!this.chatToggle) return;
        
        // Toggle chat popup
        this.chatToggle.addEventListener('click', () => this.toggleChat());
        
        // Close chat popup
        if (this.chatClose) {
            this.chatClose.addEventListener('click', () => this.closeChat());
        }
        
        // Send message events
        if (this.chatSend) {
            this.chatSend.addEventListener('click', () => this.sendMessage());
        }
        
        if (this.chatInput) {
            this.chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
            
            // Auto-resize input
            this.chatInput.addEventListener('input', () => this.autoResizeInput());
        }
        
        // Close chat when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && 
                !this.chatContainer.contains(e.target) && 
                !e.target.closest('#chatbot-container')) {
                this.closeChat();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeChat();
            }
        });
    }
    
    loadWelcomeMessage() {
        const welcomeMessages = [
            "Hello! I'm here to help you learn more about Naya Sawera Foundation.",
            "You can ask me about our programs, how to donate, volunteer opportunities, or anything else!",
            "What would you like to know?"
        ];
        
        welcomeMessages.forEach((message, index) => {
            setTimeout(() => {
                this.addMessage(message, 'bot');
            }, index * 1000);
        });
    }
    
    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }
    
    openChat() {
        this.isOpen = true;
        this.chatPopup.classList.remove('hidden');
        this.chatToggle.setAttribute('aria-expanded', 'true');
        
        // Focus on input
        if (this.chatInput) {
            setTimeout(() => this.chatInput.focus(), 100);
        }
        
        // Announce to screen readers
        this.announceToScreenReader('Chat opened');
        
        // Scroll to bottom
        this.scrollToBottom();
    }
    
    closeChat() {
        this.isOpen = false;
        this.chatPopup.classList.add('hidden');
        this.chatToggle.setAttribute('aria-expanded', 'false');
        
        // Return focus to toggle button
        this.chatToggle.focus();
        
        // Announce to screen readers
        this.announceToScreenReader('Chat closed');
    }
    
    async sendMessage() {
        const message = this.chatInput.value.trim();
        
        if (!message || this.isTyping) {
            return;
        }
        
        // Add user message
        this.addMessage(message, 'user');
        
        // Clear input
        this.chatInput.value = '';
        this.autoResizeInput();
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Send to backend
            const response = await this.sendToBackend(message);
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add bot response
            this.addMessage(response, 'bot');
            
        } catch (error) {
            console.error('Chatbot error:', error);
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Show error message
            this.addMessage('Sorry, I encountered an error. Please try again or contact us directly.', 'bot');
        }
        
        // Scroll to bottom
        this.scrollToBottom();
    }
    
    async sendToBackend(message) {
        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        return data.response || 'Sorry, I didn\'t understand that.';
    }
    
    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = `chat-bubble ${sender}`;
        bubbleDiv.textContent = text;
        
        // Add timestamp
        const timestamp = new Date().toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'text-xs text-gray-500 mt-1';
        timeDiv.textContent = timestamp;
        
        messageDiv.appendChild(bubbleDiv);
        messageDiv.appendChild(timeDiv);
        
        // Add to chat
        this.chatMessages.appendChild(messageDiv);
        
        // Store in history
        this.messageHistory.push({
            text: text,
            sender: sender,
            timestamp: new Date()
        });
        
        // Announce to screen readers
        if (sender === 'bot') {
            this.announceToScreenReader(text);
        }
        
        // Scroll to bottom
        this.scrollToBottom();
        
        // Add fade-in animation
        requestAnimationFrame(() => {
            messageDiv.classList.add('fade-in');
        });
    }
    
    showTypingIndicator() {
        this.isTyping = true;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot typing-indicator';
        typingDiv.id = 'typing-indicator';
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'chat-bubble bot';
        bubbleDiv.innerHTML = `
            <div class="loading-dots">
                <div class="loading-dot"></div>
                <div class="loading-dot" style="animation-delay: 0.2s;"></div>
                <div class="loading-dot" style="animation-delay: 0.4s;"></div>
            </div>
        `;
        
        typingDiv.appendChild(bubbleDiv);
        this.chatMessages.appendChild(typingDiv);
        
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        this.isTyping = false;
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    autoResizeInput() {
        if (!this.chatInput) return;
        
        this.chatInput.style.height = 'auto';
        this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 120) + 'px';
    }
    
    scrollToBottom() {
        if (this.chatMessages) {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
    }
    
    announceToScreenReader(message) {
        if (window.NayaSawera && window.NayaSawera.announceToScreenReader) {
            window.NayaSawera.announceToScreenReader(message);
        }
    }
    
    // Quick response buttons
    addQuickResponses(responses) {
        const quickResponsesDiv = document.createElement('div');
        quickResponsesDiv.className = 'quick-responses flex flex-wrap gap-2 mt-2 p-2';
        
        responses.forEach(response => {
            const button = document.createElement('button');
            button.className = 'quick-response-btn bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm transition-colors';
            button.textContent = response;
            button.onclick = () => {
                this.chatInput.value = response;
                this.sendMessage();
                quickResponsesDiv.remove();
            };
            
            quickResponsesDiv.appendChild(button);
        });
        
        this.chatMessages.appendChild(quickResponsesDiv);
        this.scrollToBottom();
    }
    
    // Predefined quick responses for common queries
    showQuickResponses() {
        const commonQuestions = [
            "How can I donate?",
            "How do I volunteer?",
            "What programs do you have?",
            "How can I contact you?",
            "Tell me about your mission"
        ];
        
        this.addQuickResponses(commonQuestions);
    }
    
    // Clear chat history
    clearChat() {
        if (this.chatMessages) {
            this.chatMessages.innerHTML = '';
        }
        this.messageHistory = [];
        this.loadWelcomeMessage();
    }
    
    // Export chat history
    exportChatHistory() {
        const chatData = {
            timestamp: new Date().toISOString(),
            messages: this.messageHistory
        };
        
        const blob = new Blob([JSON.stringify(chatData, null, 2)], { 
            type: 'application/json' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `naya-sawera-chat-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Handle connectivity issues
    handleOffline() {
        this.addMessage('You appear to be offline. Please check your connection and try again.', 'bot');
    }
    
    handleOnline() {
        this.addMessage('Connection restored! How can I help you?', 'bot');
    }
}

// FAQ responses for fallback
const FAQ_RESPONSES = {
    donate: "You can donate to our causes through our Events page. We accept online donations and all contributions go directly to the programs and communities we serve.",
    volunteer: "We welcome volunteers! You can register for volunteer opportunities on our Events page. We have various programs where you can contribute your time and skills.",
    mission: "Our mission is to empower communities through education, healthcare, and sustainable development initiatives. We work to create lasting positive change in underserved areas.",
    contact: "You can reach us at info@nayasawera.org or through our contact form. We're always happy to answer your questions!",
    programs: "We run programs in education (school building, skill development), healthcare (mobile clinics, medical camps), and community empowerment initiatives.",
    reports: "You can report incidents or issues through our Report Incident page. All reports are confidential and reviewed by our team.",
    products: "We offer products made by our community members through our skill development programs. Check out our Products page to support local artisans!"
};

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if chatbot elements exist
    if (document.getElementById('chatbot-container')) {
        window.chatbot = new NayaSaweraChatbot();
        
        // Handle online/offline events
        window.addEventListener('offline', () => {
            if (window.chatbot) {
                window.chatbot.handleOffline();
            }
        });
        
        window.addEventListener('online', () => {
            if (window.chatbot) {
                window.chatbot.handleOnline();
            }
        });
        
        // Add chatbot to global scope for debugging
        if (typeof window !== 'undefined') {
            window.NayaSawera = window.NayaSawera || {};
            window.NayaSawera.chatbot = window.chatbot;
        }
    }
});

// Enhanced error handling for chatbot
window.addEventListener('error', function(e) {
    if (e.filename && e.filename.includes('chatbot.js')) {
        console.error('Chatbot error:', e.error);
        
        if (window.chatbot && window.chatbot.isOpen) {
            window.chatbot.addMessage('I encountered an error. Please refresh the page or contact us directly.', 'bot');
        }
    }
});

// Service Worker registration for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NayaSaweraChatbot;
}
