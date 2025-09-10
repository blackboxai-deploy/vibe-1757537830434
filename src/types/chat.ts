export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  senderName: string;
  timestamp: Date;
  channelId: string;
  threadId?: string;
  reactions?: MessageReaction[];
  isTyping?: boolean;
}

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface Channel {
  id: string;
  name: string;
  type: 'public' | 'private' | 'ai-bot';
  description?: string;
  aiModel?: string;
  lastMessage?: Message;
  unreadCount: number;
  isActive: boolean;
}

export interface ChatState {
  channels: Channel[];
  activeChannelId: string;
  messages: { [channelId: string]: Message[] };
  currentUser: User;
  typingUsers: { [channelId: string]: string[] };
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
}

export interface Thread {
  parentMessageId: string;
  messages: Message[];
  isOpen: boolean;
}