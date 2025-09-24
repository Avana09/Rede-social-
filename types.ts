export enum View {
  FEED = 'FEED',
  CHAT = 'CHAT',
  PROFILE = 'PROFILE',
  SETTINGS = 'SETTINGS',
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export enum PostLayout {
  COMFORTABLE = 'comfortable',
  COMPACT = 'compact',
}


export interface User {
  name: string;
  avatarUrl: string;
  handle: string;
}

export interface Story {
  id: number;
  user: User;
  imageUrl: string;
}

export interface Post {
  id: number;
  user: User;
  timestamp: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  shares: number;
}

export enum ChatMessageSender {
    USER = 'user',
    AI = 'ai',
    OTHER = 'other',
}

// For AI Assistant Chat
export interface ChatMessage {
    id: string;
    sender: ChatMessageSender;
    text: string;
}


// For User-to-User Chat
export interface UserContact {
  id: string;
  name: string;
  avatarUrl: string;
  isAi?: boolean;
  status?: string;
  lastMessage?: string;
  lastMessageTime?: string;
}

export enum UserMessageType {
    TEXT = 'text',
    AUDIO = 'audio',
}

export interface UserTextMessage {
    id: string;
    sender: ChatMessageSender;
    type: UserMessageType.TEXT;
    text: string;
    timestamp: string;
}

export interface UserAudioMessage {
    id: string;
    sender: ChatMessageSender;
    type: UserMessageType.AUDIO;
    audioUrl: string;
    duration: number; // in seconds
    timestamp: string;
}

export type UserChatMessage = UserTextMessage | UserAudioMessage;