'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { ChatArea } from '@/components/chat/ChatArea';
import { Channel, Message, User } from '@/types/chat';
import { AI_MODELS } from '@/lib/ai-models';

// Mock data for initial state
const defaultUser: User = {
  id: 'user-1',
  name: 'You',
  status: 'online',
};

const defaultChannels: Channel[] = [
  {
    id: 'general',
    name: 'general',
    type: 'public',
    description: 'General discussion',
    unreadCount: 0,
    isActive: false,
  },
  {
    id: 'random',
    name: 'random',
    type: 'public',
    description: 'Random conversations',
    unreadCount: 0,
    isActive: false,
  },
  ...AI_MODELS.map(model => ({
    id: model.id,
    name: model.displayName,
    type: 'ai-bot' as const,
    description: model.description,
    aiModel: model.id,
    unreadCount: 0,
    isActive: false,
  })),
];

export default function HomePage() {
  const [channels, setChannels] = useState<Channel[]>(defaultChannels);
  const [activeChannelId, setActiveChannelId] = useState<string>('general');
  const [messages, setMessages] = useState<{ [channelId: string]: Message[] }>({});
  const [user] = useState<User>(defaultUser);

  // Set first channel as active on mount
  useEffect(() => {
    if (channels.length > 0) {
      setChannels(prev => prev.map(channel => ({
        ...channel,
        isActive: channel.id === activeChannelId
      })));
    }
  }, [activeChannelId]);

  const handleChannelSelect = (channelId: string) => {
    setActiveChannelId(channelId);
    setChannels(prev => prev.map(channel => ({
      ...channel,
      isActive: channel.id === channelId,
      unreadCount: channel.id === channelId ? 0 : channel.unreadCount
    })));
  };

  const handleSendMessage = async (content: string, channelId: string) => {
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      content,
      sender: 'user',
      senderName: user.name,
      timestamp: new Date(),
      channelId,
    };

    // Add user message
    setMessages(prev => ({
      ...prev,
      [channelId]: [...(prev[channelId] || []), userMessage],
    }));

    // If it's an AI bot channel, send to AI
    const channel = channels.find(ch => ch.id === channelId);
    if (channel?.type === 'ai-bot' && channel.aiModel) {
      try {
        // Add typing indicator
        const typingMessage: Message = {
          id: `msg-${Date.now()}-typing`,
          content: 'Thinking...',
          sender: 'ai',
          senderName: channel.name,
          timestamp: new Date(),
          channelId,
          isTyping: true,
        };

        setMessages(prev => ({
          ...prev,
          [channelId]: [...(prev[channelId] || []), typingMessage],
        }));

        // Make AI API call
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content,
            model: channel.aiModel,
            channelId,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get AI response');
        }

        const aiResponse = await response.json();

        // Remove typing message and add AI response
        const aiMessage: Message = {
          id: `msg-${Date.now()}-ai`,
          content: aiResponse.content,
          sender: 'ai',
          senderName: channel.name,
          timestamp: new Date(),
          channelId,
        };

        setMessages(prev => ({
          ...prev,
          [channelId]: [
            ...(prev[channelId] || []).filter(msg => !msg.isTyping),
            aiMessage,
          ],
        }));
      } catch (error) {
        console.error('Failed to get AI response:', error);
        // Remove typing message and add error message
        const errorMessage: Message = {
          id: `msg-${Date.now()}-error`,
          content: 'Sorry, I encountered an error. Please try again.',
          sender: 'ai',
          senderName: channel.name,
          timestamp: new Date(),
          channelId,
        };

        setMessages(prev => ({
          ...prev,
          [channelId]: [
            ...(prev[channelId] || []).filter(msg => !msg.isTyping),
            errorMessage,
          ],
        }));
      }
    }
  };

  const activeChannel = channels.find(channel => channel.id === activeChannelId);

  return (
    <>
      <Sidebar
        channels={channels}
        onChannelSelect={handleChannelSelect}
        activeChannelId={activeChannelId}
        user={user}
      />
      <ChatArea
        channel={activeChannel}
        messages={messages[activeChannelId] || []}
        onSendMessage={handleSendMessage}
        user={user}
      />
    </>
  );
}