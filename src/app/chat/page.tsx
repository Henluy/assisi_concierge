'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Volume2, Globe, MapPin, User } from 'lucide-react';

type Message = {
    role: 'user' | 'assistant';
    content: string;
    audio?: string; // base64
};

export default function ChatPage() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "👋 Bonjour ! Je suis votre Concierge IA à Assise. Comment puis-je vous aider ?" }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [language, setLanguage] = useState('fr');

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg, language })
            });

            const data = await res.json();

            if (data.error) throw new Error(data.error);

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.text,
                audio: data.audio
            }]);

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ Une erreur est survenue." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const playAudio = (base64Audio: string) => {
        const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
        audio.play();
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Header */}
            <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                        <User size={24} />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg">Assisi AI Concierge</h1>
                        <p className="text-xs text-green-600 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> En ligne
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Globe size={18} className="text-gray-500" />
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-gray-100 border text-sm rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="fr">Français 🇫🇷</option>
                        <option value="en">English 🇬🇧</option>
                        <option value="it">Italiano 🇮🇹</option>
                        <option value="es">Español 🇪🇸</option>
                        <option value="de">Deutsch 🇩🇪</option>
                    </select>
                </div>
            </header>

            {/* Chat Area */}
            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] sm:max-w-[70%] p-4 rounded-2xl shadow-sm text-sm sm:text-base leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                            }`}>
                            {msg.content}

                            {/* Audio Player Button */}
                            {msg.audio && (
                                <button
                                    onClick={() => playAudio(msg.audio!)}
                                    className="mt-3 flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-3 rounded-full transition-colors text-xs font-medium w-full sm:w-auto"
                                >
                                    <Volume2 size={16} /> Écouter l'Audioguide
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-200 text-gray-500 p-3 rounded-2xl rounded-bl-none animate-pulse text-sm">
                            Écrit...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </main>

            {/* Input Area */}
            <footer className="bg-white border-t p-4 pb-8 sm:pb-4 sticky bottom-0">
                <div className="max-w-4xl mx-auto flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={`Posez une question en ${language === 'en' ? 'English' : language === 'it' ? 'Italiano' : 'Français'}...`}
                        className="flex-1 bg-gray-100 border-0 rounded-full px-5 py-3 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all placeholder-gray-400"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full w-12 h-12 flex items-center justify-center transition-all shadow-md active:scale-95"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </footer>
        </div>
    );
}
