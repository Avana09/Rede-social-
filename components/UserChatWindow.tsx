import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UserContact, UserChatMessage, ChatMessageSender, UserMessageType } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import { SendIcon, PhoneIcon, VideoIcon, MicrophoneIcon, StopIcon } from './icons/Icons';

const mockMessages: UserChatMessage[] = [
    { id: '1', sender: ChatMessageSender.OTHER, type: UserMessageType.TEXT, text: "Hey, how's it going?", timestamp: "10:00 AM" },
    { id: '2', sender: ChatMessageSender.USER, type: UserMessageType.TEXT, text: "Pretty good! Just working on that new project. You?", timestamp: "10:01 AM" },
    { id: '3', sender: ChatMessageSender.OTHER, type: UserMessageType.TEXT, text: "Same here. It's coming along nicely.", timestamp: "10:01 AM" },
];

const AudioMessageBubble: React.FC<{ message: { audioUrl: string, duration: number } }> = ({ message }) => {
    const { t } = useSettings();
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };
    
    useEffect(() => {
        const audio = audioRef.current;
        const handleTimeUpdate = () => {
            if (audio) {
                setProgress((audio.currentTime / audio.duration) * 100);
            }
        };
        const handleEnded = () => setIsPlaying(false);

        audio?.addEventListener('timeupdate', handleTimeUpdate);
        audio?.addEventListener('ended', handleEnded);
        return () => {
            audio?.removeEventListener('timeupdate', handleTimeUpdate);
            audio?.removeEventListener('ended', handleEnded);
        };
    }, []);

    return (
        <div className="flex items-center space-x-2">
            <audio ref={audioRef} src={message.audioUrl} preload="metadata"></audio>
            <button onClick={togglePlay} className="text-inherit">
                {isPlaying ? <StopIcon className="w-5 h-5" /> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>}
            </button>
            <div className="w-32 h-1 bg-gray-400/50 rounded-full">
                <div className="h-1 bg-current rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="text-xs w-10">{new Date(message.duration * 1000).toISOString().substr(14, 5)}</span>
        </div>
    );
};

const MessageBubble: React.FC<{ message: UserChatMessage }> = ({ message }) => {
    const isUser = message.sender === ChatMessageSender.USER;
    const bubbleStyles = isUser ? 'bg-primary text-on-primary rounded-br-none' : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none';
    
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-md p-3 rounded-2xl ${bubbleStyles}`}>
                {message.type === UserMessageType.TEXT ? <p>{message.text}</p> : <AudioMessageBubble message={message} />}
            </div>
        </div>
    );
};


const UserChatWindow: React.FC<{ contact: UserContact, onInitiateCall: (contact: UserContact) => void }> = ({ contact, onInitiateCall }) => {
    const { t } = useSettings();
    const [messages, setMessages] = useState<UserChatMessage[]>(mockMessages);
    const [input, setInput] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const recordingInterval = useRef<number | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(scrollToBottom, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        const newMessage: UserChatMessage = {
            id: Date.now().toString(),
            sender: ChatMessageSender.USER,
            type: UserMessageType.TEXT,
            text: input,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, newMessage]);
        setInput('');
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            mediaRecorder.current = recorder;
            const audioChunks: Blob[] = [];

            recorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };

            recorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                const newMessage: UserChatMessage = {
                    id: Date.now().toString(),
                    sender: ChatMessageSender.USER,
                    type: UserMessageType.AUDIO,
                    audioUrl,
                    duration: recordingTime,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, newMessage]);

                // Clean up stream
                stream.getTracks().forEach(track => track.stop());
            };
            
            recorder.start();
            setIsRecording(true);
            setRecordingTime(0);
            recordingInterval.current = window.setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (error) {
            console.error("Error starting recording:", error);
            alert("Microphone access was denied. Please allow microphone access in your browser settings.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current && isRecording) {
            mediaRecorder.current.stop();
            setIsRecording(false);
            if (recordingInterval.current) {
                clearInterval(recordingInterval.current);
            }
        }
    };
    

    return (
        <div className="flex flex-col h-full bg-gray-100 dark:bg-black">
            <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-10">
                <div className="flex items-center space-x-4">
                    <img src={contact.avatarUrl} alt={contact.name} className="w-10 h-10 rounded-full object-cover"/>
                    <div>
                        <h2 className="text-lg font-bold">{contact.name}</h2>
                        <p className="text-sm text-green-500">{contact.status}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <button onClick={() => onInitiateCall(contact)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600" aria-label={t('audioCall')}>
                        <PhoneIcon />
                    </button>
                     <button onClick={() => onInitiateCall(contact)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600" aria-label={t('videoCall')}>
                        <VideoIcon />
                    </button>
                </div>
            </header>
             <div className="flex-1 overflow-y-auto p-4">
                {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
                <div ref={messagesEndRef} />
            </div>
             <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-black">
                <div className="flex items-center bg-white dark:bg-gray-800 rounded-full p-2">
                    {isRecording ? (
                        <div className="flex-1 flex items-center px-4 space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-red-500 font-semibold">{t('recording')}</span>
                            <span className="text-gray-500 dark:text-gray-400">{new Date(recordingTime * 1000).toISOString().substr(14, 5)}</span>
                        </div>
                    ) : (
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={t('typeAMessage')}
                            className="flex-1 bg-transparent px-4 focus:outline-none placeholder-gray-500 dark:placeholder-gray-400"
                        />
                    )}
                    
                    {input.trim() ? (
                         <button
                            onClick={handleSend}
                            className="bg-primary p-2 rounded-full text-white hover:bg-primary-hover transition-colors"
                            aria-label="Send message"
                        >
                            <SendIcon />
                        </button>
                    ) : (
                        <button
                            onMouseDown={startRecording}
                            onMouseUp={stopRecording}
                            onTouchStart={startRecording}
                            onTouchEnd={stopRecording}
                            className={`p-2 rounded-full transition-colors ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-primary'}`}
                            aria-label={isRecording ? t('releaseToSend') : t('holdToRecord')}
                        >
                            <MicrophoneIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserChatWindow;
