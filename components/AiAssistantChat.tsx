import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat as GeminiChat } from "@google/genai";
import { SendIcon } from './icons/Icons';
import { ChatMessage, ChatMessageSender } from '../types';
import { useSettings } from '../contexts/SettingsContext';

const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.sender === ChatMessageSender.USER;
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-md p-3 rounded-2xl ${isUser ? 'bg-primary text-on-primary rounded-br-none' : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'}`}>
                <p>{message.text}</p>
            </div>
        </div>
    );
};


const AiAssistantChat: React.FC = () => {
    const { t } = useSettings();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [geminiChat, setGeminiChat] = useState<GeminiChat | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        setMessages([ { id: '1', sender: ChatMessageSender.AI, text: t('aiWelcome') } ])
     }, [t]);

    useEffect(() => {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const chat = ai.chats.create({
                model: 'gemini-2.5-flash',
                 config: {
                    systemInstruction: 'You are a helpful and friendly AI assistant for Inovira, a social media app. Keep your responses concise and engaging.',
                },
            });
            setGeminiChat(chat);
        } catch (error) {
            console.error("Failed to initialize Gemini AI:", error);
            setMessages(prev => [...prev, {id: 'error-1', sender: ChatMessageSender.AI, text: "Sorry, I'm having trouble connecting right now."}]);
        }
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = useCallback(async () => {
        if (!input.trim() || isLoading || !geminiChat) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            sender: ChatMessageSender.USER,
            text: input,
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const stream = await geminiChat.sendMessageStream({ message: input });
            let aiResponseText = '';
            const aiMessageId = `ai-${Date.now()}`;
            
            setMessages(prev => [...prev, { id: aiMessageId, sender: ChatMessageSender.AI, text: '' }]);

            for await (const chunk of stream) {
                aiResponseText += chunk.text;
                setMessages(prev => prev.map(msg => 
                    msg.id === aiMessageId ? { ...msg, text: aiResponseText } : msg
                ));
            }
        } catch (error) {
            console.error("Gemini API error:", error);
            setMessages(prev => [...prev, {id: `error-${Date.now()}`, sender: ChatMessageSender.AI, text: "Oops! Something went wrong. Please try again."}]);
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading, geminiChat]);

    return (
        <div className="flex flex-col h-full bg-gray-100 dark:bg-black">
            <header className="p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-10">
                <h1 className="text-xl font-bold">{t('aiAssistant')}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('poweredByGemini')}</p>
            </header>
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}
                {isLoading && messages[messages.length-1]?.sender === ChatMessageSender.USER && (
                    <div className="flex justify-start mb-4">
                        <div className="max-w-md p-3 rounded-2xl bg-white dark:bg-gray-700 rounded-bl-none">
                            <div className="flex items-center space-x-2">
                                <span className="h-2 w-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="h-2 w-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="h-2 w-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-black">
                <div className="flex items-center bg-white dark:bg-gray-800 rounded-full p-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={t('typeAMessage')}
                        className="flex-1 bg-transparent px-4 focus:outline-none placeholder-gray-500 dark:placeholder-gray-400"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="bg-primary p-2 rounded-full text-white disabled:bg-gray-400 dark:disabled:bg-gray-600 hover:bg-primary-hover transition-colors"
                        aria-label="Send message"
                    >
                        <SendIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AiAssistantChat;