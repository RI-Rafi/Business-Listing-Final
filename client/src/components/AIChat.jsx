import { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../lib/api';
import useAuthStore from '../state/authStore';

function AIChat({ context }) {
    const { user } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hey! I\'m ReX - your neighbourhood partner with a brain and a sense of humor 😎 Need food? Movies? Or just someone to roast your choices while helping you find the best spots? Let\'s go!' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    // Quick action suggestions
    const quickActions = [
        { label: '🍔 Food', query: 'Show me restaurants' },
        { label: '🎬 Movies', query: 'Find cinemas' },
        { label: '💇 Salon', query: 'I need a haircut' },
        { label: '📱 Tech', query: 'Show electronics stores' },
    ];

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSubmit = async (e, predefinedMessage = null) => {
        if (e) e.preventDefault();
        const messageToSend = predefinedMessage || input;
        if (!messageToSend.trim()) return;

        setInput('');
        setError(null);
        setMessages(prev => [...prev, { role: 'user', content: messageToSend }]);
        setLoading(true);

        try {
            const response = await chatAPI.chat({
                message: messageToSend,
                context: {
                    sessionId: user?._id || 'guest',
                    ...context
                }
            });

            setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);
        } catch (error) {
            console.error('Chat error:', error);
            setError('Connection hiccup! Try again?');
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Oops! My circuits got tangled. Mind trying that again? 🤕'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickAction = (query) => {
        handleSubmit(null, query);
    };

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full shadow-2xl hover:scale-110 flex items-center justify-center text-3xl z-50 transition-all duration-300 hover:shadow-blue-500/50 animate-bounce"
                    title="Chat with ReX - Your Smart Assistant"
                >
                    🤖
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-80 md:w-96 h-[550px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 overflow-hidden animate-slide-up">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <span className="text-3xl">🤖</span>
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">ReX AI</h3>
                                <p className="text-xs text-blue-100">Smart, sarcastic, but actually helpful 😏</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-blue-100 hover:text-white text-2xl font-bold transition-colors w-8 h-8 flex items-center justify-center hover:bg-blue-500 rounded-full"
                        >
                            ×
                        </button>
                    </div>

                    {/* Quick Actions */}
                    {messages.length <= 2 && (
                        <div className="bg-blue-50 p-3 border-b border-blue-100">
                            <p className="text-xs text-gray-600 mb-2 font-medium">Quick Actions:</p>
                            <div className="flex gap-2 flex-wrap">
                                {quickActions.map((action, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleQuickAction(action.query)}
                                        className="px-3 py-1.5 bg-white border border-blue-200 text-sm rounded-full hover:bg-blue-100 hover:border-blue-300 transition-colors"
                                    >
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white flex flex-col gap-3">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user'
                                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white self-end rounded-br-sm'
                                    : 'bg-white border border-gray-200 text-gray-800 self-start rounded-bl-sm'
                                    }`}
                            >
                                <div className="whitespace-pre-wrap">{msg.content}</div>
                            </div>
                        ))}
                        {loading && (
                            <div className="self-start bg-gray-100 text-gray-600 px-4 py-2 rounded-2xl text-xs flex items-center gap-2 shadow-sm">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                                <span>ReX is thinking...</span>
                            </div>
                        )}
                        {error && (
                            <div className="self-center bg-red-50 text-red-600 px-3 py-2 rounded-lg text-xs border border-red-200">
                                {error}
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-200 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask anything..."
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center gap-1"
                        >
                            <span>Send</span>
                            <span>→</span>
                        </button>
                    </form>
                </div>
            )}

            <style jsx>{`
                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out;
                }
            `}</style>
        </>
    );
}

export default AIChat;
