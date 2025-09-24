import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { UserContact, ChatMessageSender } from '../types';
import AiAssistantChat from './AiAssistantChat';
import UserChatWindow from './UserChatWindow';
import CallView from './CallView';
import { RobotIcon, MessageIcon } from './icons/Icons';

const mockContacts: UserContact[] = [
    { id: 'ai-assistant', name: 'AI Assistant', avatarUrl: '', isAi: true, status: 'Online', lastMessage: "How can I help you today?", lastMessageTime: "Now" },
    { id: '1', name: 'Elena Rodriguez', avatarUrl: 'https://picsum.photos/id/1027/200/200', status: 'Online', lastMessage: "Great, thanks for asking!", lastMessageTime: "5m" },
    { id: '2', name: 'Aisha Khan', avatarUrl: 'https://picsum.photos/id/1011/200/200', status: 'Offline', lastMessage: "Talk to you later!", lastMessageTime: "2h" },
    { id: '3', name: 'Liam Smith', avatarUrl: 'https://picsum.photos/id/1012/200/200', status: 'Online', lastMessage: "Just sent the file.", lastMessageTime: "1h" },
];

const Chat: React.FC = () => {
    const { t } = useSettings();
    const [selectedContact, setSelectedContact] = useState<UserContact | null>(null);
    const [activeCall, setActiveCall] = useState<UserContact | null>(null);

    const handleSelectContact = (contact: UserContact) => {
        setSelectedContact(contact);
    };

    const handleInitiateCall = (contact: UserContact) => {
        setActiveCall(contact);
    };

    const handleEndCall = () => {
        setActiveCall(null);
    };

    const WelcomeScreen = () => (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-100 dark:bg-black">
            <MessageIcon className="w-24 h-24 text-gray-400 dark:text-gray-600 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{t('startAConversation')}</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">{t('selectContactToChat')}</p>
        </div>
    );
    
    return (
        <div className="flex h-full">
            {activeCall && <CallView contact={activeCall} onEndCall={handleEndCall} />}
            <aside className="w-full md:w-1/3 lg:w-1/4 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                 <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <input type="text" placeholder={t('searchContacts')} className="w-full bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <ul className="overflow-y-auto flex-1">
                    {mockContacts.map(contact => (
                        <li key={contact.id}>
                            <button 
                                onClick={() => handleSelectContact(contact)} 
                                className={`w-full text-left p-4 flex items-center space-x-4 transition-colors duration-200 ${selectedContact?.id === contact.id ? 'bg-primary/10 dark:bg-primary/20' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
                            >
                                <div className="relative">
                                    {contact.isAi ? (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                            <RobotIcon className="w-7 h-7 text-white"/>
                                        </div>
                                    ) : (
                                        <img src={contact.avatarUrl} alt={contact.name} className="w-12 h-12 rounded-full object-cover" />
                                    )}
                                    {contact.status === 'Online' && !contact.isAi && <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></span>}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{contact.name}</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">{contact.lastMessageTime}</p>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{contact.lastMessage}</p>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>
            <main className="hidden md:flex flex-1 flex-col">
                {selectedContact ? (
                    selectedContact.isAi ? <AiAssistantChat /> : <UserChatWindow contact={selectedContact} onInitiateCall={handleInitiateCall} />
                ) : <WelcomeScreen />}
            </main>
        </div>
    );
};

export default Chat;