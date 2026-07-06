import { useState, useRef, useEffect, useCallback } from 'react';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            text: "Hello! 👋 Welcome to Precision Accounting. I'm your AI assistant. How can I help you today?",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [conversationContext, setConversationContext] = useState([]);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const quickReplies = [
        { label: '📋 Our Services', query: 'What services do you offer?' },
        { label: '📞 Contact Info', query: 'How can I contact you?' },
        { label: '💰 Tax Help', query: 'I need help with taxes' },
        { label: '💬 Get a Quote', query: 'I want to get a quote' },
    ];

    // Knowledge base for intelligent responses
    const knowledgeBase = {
        services: {
            audit: {
                name: 'Audit & Assurance',
                description: 'Comprehensive audit services including statutory audits, internal audits, tax audits, compliance reviews, and risk assessment.',
                benefits: ['Stakeholder confidence', 'Enhanced credibility', 'Regulatory compliance']
            },
            tax: {
                name: 'Tax Services',
                description: 'Strategic tax planning, GST compliance, income tax returns, tax audit & assessment, and international tax advisory.',
                benefits: ['Maximize savings', 'Full compliance', 'Expert guidance']
            },
            advisory: {
                name: 'Financial Advisory',
                description: 'Expert guidance on mergers & acquisitions, business transformations, and strategic financial planning.',
                benefits: ['Strategic insights', 'M&A support', 'Growth planning']
            },
            bookkeeping: {
                name: 'Bookkeeping',
                description: 'Day-to-day transaction recording, bank reconciliation, financial statements, accounts payable/receivable management.',
                benefits: ['Accurate records', 'Real-time access', 'Cloud-based solutions']
            },
            payroll: {
                name: 'Payroll Services',
                description: 'Efficient payroll processing with full compliance, employee self-service, and automated calculations.',
                benefits: ['On-time payments', 'Compliance assured', 'Employee satisfaction']
            },
            consulting: {
                name: 'Business Consulting',
                description: 'Strategic insights to help your business grow, overcome challenges, and achieve long-term success.',
                benefits: ['Growth strategies', 'Problem solving', 'Expert advice']
            }
        },
        contact: {
            phone: '+91 8920473074',
            email: 'reliableprofessionals.co@gmail.com',
            address: '56, New Layal Pur, Dixit Gali, Delhi -110051',
            hours: 'Monday-Friday: 9 AM - 6 PM, Saturday: 10 AM - 2 PM'
        },
        company: {
            name: 'Precision Accounting',
            tagline: 'Precision in Every Number. Excellence in Every Solution.',
            team: ['Athrav Kumar', 'Padmana Chopra', 'Paras Gupta', 'Sanjay A', 'Tasleem Shah']
        }
    };

    // Intelligent response generator
    const generateResponse = useCallback((userMessage, context) => {
        const message = userMessage.toLowerCase().trim();
        const words = message.split(/\s+/);

        // Intent detection with scoring
        const intents = {
            greeting: 0,
            services: 0,
            specificService: null,
            contact: 0,
            pricing: 0,
            hours: 0,
            team: 0,
            thanks: 0,
            help: 0,
            careers: 0,
            location: 0,
            gst: 0,
            itr: 0,
            consultation: 0
        };

        // Greeting patterns
        if (/^(hi|hello|hey|good\s*(morning|afternoon|evening)|greetings|namaste)/i.test(message)) {
            intents.greeting = 10;
        }

        // Service detection
        const serviceKeywords = ['service', 'offer', 'provide', 'do you', 'what can', 'help with'];
        serviceKeywords.forEach(keyword => {
            if (message.includes(keyword)) intents.services += 3;
        });

        // Specific service detection
        if (/audit|assurance/i.test(message)) {
            intents.specificService = 'audit';
            intents.services += 5;
        }
        if (/tax|gst|itr|income\s*tax|filing/i.test(message)) {
            intents.specificService = 'tax';
            intents.services += 5;
            if (/gst/i.test(message)) intents.gst = 5;
            if (/itr|income\s*tax\s*return/i.test(message)) intents.itr = 5;
        }
        if (/advisory|advice|guidance|consult/i.test(message)) {
            intents.specificService = 'advisory';
            intents.services += 5;
        }
        if (/bookkeep|accounting|ledger|record/i.test(message)) {
            intents.specificService = 'bookkeeping';
            intents.services += 5;
        }
        if (/payroll|salary|wages|employee\s*pay/i.test(message)) {
            intents.specificService = 'payroll';
            intents.services += 5;
        }
        if (/consult|strategy|business\s*help/i.test(message)) {
            intents.specificService = 'consulting';
            intents.services += 5;
        }

        // Contact detection
        const contactKeywords = ['contact', 'reach', 'call', 'phone', 'email', 'mail', 'number'];
        contactKeywords.forEach(keyword => {
            if (message.includes(keyword)) intents.contact += 3;
        });

        // Location detection
        if (/address|location|office|where|visit|meet/i.test(message)) {
            intents.location = 5;
            intents.contact += 2;
        }

        // Pricing detection
        if (/price|cost|fee|charge|quote|rate|how much|expensive|cheap|afford/i.test(message)) {
            intents.pricing = 8;
        }

        // Hours detection
        if (/hour|timing|open|close|available|when|schedule/i.test(message)) {
            intents.hours = 8;
        }

        // Team detection
        if (/team|who|people|staff|employee|member|about you/i.test(message)) {
            intents.team = 5;
        }

        // Thanks detection
        if (/thank|thanks|thx|appreciate|helpful/i.test(message)) {
            intents.thanks = 10;
        }

        // Help detection
        if (/help|assist|support|guide|need/i.test(message)) {
            intents.help = 3;
        }

        // Careers detection
        if (/career|job|hiring|work|vacancy|opening|join|recruit/i.test(message)) {
            intents.careers = 8;
        }

        // Consultation detection
        if (/book|appointment|schedule|meet|consultation|free\s*consult/i.test(message)) {
            intents.consultation = 8;
        }

        // Find highest scoring intent
        let maxIntent = 'help';
        let maxScore = 0;
        Object.entries(intents).forEach(([intent, score]) => {
            if (typeof score === 'number' && score > maxScore) {
                maxScore = score;
                maxIntent = intent;
            }
        });

        // Generate response based on intent
        let response = '';

        if (intents.greeting >= 10) {
            const greetings = [
                "Hello! 👋 Great to connect with you! I'm here to help with any questions about our accounting and financial services. What would you like to know?",
                "Hi there! 😊 Welcome! I'm ready to assist you with information about our services, pricing, or help schedule a consultation. How can I help?",
                "Hey! 👋 Thanks for reaching out to Precision Accounting. I'm your AI assistant - ask me anything about our services!"
            ];
            response = greetings[Math.floor(Math.random() * greetings.length)];
        }
        else if (intents.thanks >= 10) {
            const thanksResponses = [
                "You're welcome! 😊 Is there anything else I can help you with today?",
                "Happy to help! 🙌 Feel free to ask if you have more questions. Have a great day!",
                "My pleasure! Don't hesitate to reach out anytime. Is there anything else you'd like to know?"
            ];
            response = thanksResponses[Math.floor(Math.random() * thanksResponses.length)];
        }
        else if (intents.specificService && intents.services > 0) {
            const service = knowledgeBase.services[intents.specificService];
            response = `**${service.name}** 📋\n\n${service.description}\n\n**Key Benefits:**\n${service.benefits.map(b => `✅ ${b}`).join('\n')}\n\nWould you like to schedule a free consultation to discuss your specific needs?`;
        }
        else if (intents.gst >= 5) {
            response = "**GST Services** 📊\n\nWe provide comprehensive GST support:\n\n✅ GST Registration\n✅ GSTR-1, GSTR-3B, GSTR-9 Filing\n✅ Input Tax Credit Optimization\n✅ GST Audit & Assessment\n✅ E-way Bill Management\n\n📅 **Monthly Filing Deadlines:**\n• GSTR-1: 11th of every month\n• GSTR-3B: 20th of every month\n\nNeed help with your GST filing? Contact us!";
        }
        else if (intents.itr >= 5) {
            response = "**Income Tax Return (ITR) Services** 📝\n\nWe handle all ITR types:\n\n✅ ITR-1 (Sahaj) for Salaried Individuals\n✅ ITR-2 for Capital Gains/Foreign Income\n✅ ITR-3 for Business/Profession\n✅ ITR-4 (Sugam) for Presumptive Income\n✅ ITR-5, 6, 7 for Companies/Firms\n\n📅 **Due Date:** July 31, 2026\n\nBook your tax consultation today!";
        }
        else if (intents.services >= 3) {
            response = "**Our Services** 💼\n\nWe offer comprehensive financial solutions:\n\n📊 **Audit & Assurance** - Statutory, internal & tax audits\n📑 **Tax Services** - Tax planning, GST, ITR filing\n💼 **Financial Advisory** - M&A, business strategy\n📒 **Bookkeeping** - Day-to-day accounting\n💰 **Payroll** - Salary processing & compliance\n🎯 **Business Consulting** - Growth strategies\n\nWhich service would you like to know more about?";
        }
        else if (intents.contact >= 3 || intents.location >= 5) {
            const contact = knowledgeBase.contact;
            response = `**Contact Us** 📞\n\n📍 **Address:** ${contact.address}\n\n📱 **Phone:** ${contact.phone}\n\n📧 **Email:** ${contact.email}\n\n🕐 **Hours:** ${contact.hours}\n\nYou can also fill out our contact form on the website for a callback!`;
        }
        else if (intents.pricing >= 5) {
            response = "**Pricing & Quotes** 💰\n\nOur pricing is tailored to your specific needs. Factors we consider:\n\n• Business size & complexity\n• Scope of services required\n• Frequency of support needed\n\n**Get a Free Quote:**\n1️⃣ Call us: +91 8920473074\n2️⃣ Email: reliableprofessionals.co@gmail.com\n3️⃣ Fill our contact form\n\n✨ **Free Initial Consultation** - Let's discuss your needs!";
        }
        else if (intents.hours >= 5) {
            response = "**Business Hours** 🕐\n\n📅 **Monday - Friday:** 9:00 AM - 6:00 PM\n📅 **Saturday:** 10:00 AM - 2:00 PM\n📅 **Sunday:** Closed\n\n📧 Email support available 24/7!\n📱 For urgent matters, call: +91 8920473074\n\nWould you like to schedule an appointment?";
        }
        else if (intents.team >= 5) {
            response = "**Our Team** 👥\n\nPrecision Accounting has a dedicated team of professionals:\n\n👨‍💼 **Athrav Kumar** - Accounting & Finance Specialist\n👩‍💼 **Padmana Chopra** - Operations Head\n👨‍💻 **Paras Gupta** - Software Engineer\n👨‍💻 **Sanjay A** - Full Stack Developer\n👩‍💼 **Tasleem Shah** - Lead Generation & Admin\n\nVisit our About page to learn more about each team member!";
        }
        else if (intents.careers >= 5) {
            response = "**Join Our Team** 🚀\n\nWe're always looking for talented professionals!\n\n**Open Positions:**\n• Chartered Accountants\n• Tax Consultants\n• Audit Associates\n• Software Developers\n\n📧 Send your resume to: reliableprofessionals.co@gmail.com\n\nVisit our Careers page for current openings!";
        }
        else if (intents.consultation >= 5) {
            response = "**Book a Consultation** 📅\n\n**Free Initial Consultation Available!**\n\nSchedule your consultation:\n\n1️⃣ **Call:** +91 8920473074\n2️⃣ **Email:** reliableprofessionals.co@gmail.com\n3️⃣ **Visit:** Contact page on our website\n\nDuring consultation, we'll:\n✅ Understand your needs\n✅ Recommend suitable services\n✅ Provide a customized quote\n\nWhat's the best time for you?";
        }
        else {
            // Default intelligent response based on context
            const defaultResponses = [
                "I'd be happy to help! 😊 Here's what I can assist you with:\n\n• **Services** - Learn about our offerings\n• **Pricing** - Get a custom quote\n• **Contact** - Reach our team\n• **Tax Help** - GST, ITR, tax planning\n\nJust ask your question, or call us at +91 8920473074!",
                "Thanks for your message! Let me help you. Try asking about:\n\n📋 Our services (audit, tax, bookkeeping)\n💰 Pricing and quotes\n📞 How to contact us\n📅 Booking a consultation\n\nWhat would you like to know?",
            ];
            response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        }

        // Update context
        setConversationContext(prev => [...prev.slice(-4), { user: userMessage, intent: maxIntent }]);

        return response;
    }, []);

    const handleSendMessage = useCallback((message = inputValue) => {
        if (!message.trim()) return;

        const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Add user message
        const userMessage = {
            type: 'user',
            text: message,
            time: userTime
        };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Generate response with realistic typing delay
        const responseText = generateResponse(message, conversationContext);
        const typingDelay = Math.min(500 + responseText.length * 5, 2000);

        setTimeout(() => {
            const botResponse = {
                type: 'bot',
                text: responseText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, typingDelay);
    }, [inputValue, generateResponse, conversationContext]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleQuickReply = (query) => {
        handleSendMessage(query);
    };

    // Format message text with markdown-like styling
    const formatMessage = (text) => {
        return text.split('\n').map((line, i) => {
            // Bold text
            let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            return <p key={i} dangerouslySetInnerHTML={{ __html: formattedLine }} />;
        });
    };

    return (
        <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
            {/* Chat Toggle Button */}
            <button
                className="chatbot-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
            >
                {isOpen ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <>
                        <svg className="chat-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                            <circle cx="8" cy="10" r="1.5" />
                            <circle cx="12" cy="10" r="1.5" />
                            <circle cx="16" cy="10" r="1.5" />
                        </svg>
                        <span className="chat-pulse"></span>
                    </>
                )}
            </button>

            {/* Chat Window */}
            <div className="chatbot-window">
                {/* Header */}
                <div className="chatbot-header">
                    <div className="chatbot-header-info">
                        <div className="chatbot-avatar">
                            <span>◆</span>
                        </div>
                        <div className="chatbot-header-text">
                            <h4>Precision AI Assistant</h4>
                            <span className="chatbot-status">
                                <span className="status-dot"></span>
                                Online • Instant Response
                            </span>
                        </div>
                    </div>
                    <button
                        className="chatbot-close"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close chat"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Messages */}
                <div className="chatbot-messages">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`chatbot-message ${message.type}`}
                        >
                            {message.type === 'bot' && (
                                <div className="message-avatar">◆</div>
                            )}
                            <div className="message-content">
                                <div className="message-bubble">
                                    {formatMessage(message.text)}
                                </div>
                                <span className="message-time">{message.time}</span>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="chatbot-message bot">
                            <div className="message-avatar">◆</div>
                            <div className="message-content">
                                <div className="message-bubble typing">
                                    <span className="typing-dot"></span>
                                    <span className="typing-dot"></span>
                                    <span className="typing-dot"></span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies */}
                {messages.length <= 2 && (
                    <div className="chatbot-quick-replies">
                        {quickReplies.map((reply, index) => (
                            <button
                                key={index}
                                className="quick-reply-btn"
                                onClick={() => handleQuickReply(reply.query)}
                            >
                                {reply.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input */}
                <div className="chatbot-input">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Ask me anything..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button
                        className="send-btn"
                        onClick={() => handleSendMessage()}
                        disabled={!inputValue.trim()}
                        aria-label="Send message"
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
