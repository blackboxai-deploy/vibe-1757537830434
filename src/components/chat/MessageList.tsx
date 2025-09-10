'use client';

import { useEffect, useRef } from 'react';
import { Message, User, Channel } from '@/types/chat';
import { MessageItem } from './MessageItem';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MessageListProps {
  messages: Message[];
  currentUser: User;
  channel: Channel;
}

export function MessageList({ messages, channel }: MessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-4xl mb-4">
            {channel.type === 'ai-bot' ? '🤖' : '💭'}
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {channel.type === 'ai-bot' 
              ? `Start a conversation with ${channel.name}`
              : `Welcome to #${channel.name}`
            }
          </h3>
          <p className="text-sm text-muted-foreground">
            {channel.type === 'ai-bot'
              ? 'Ask questions, get help with coding, writing, analysis, and more!'
              : 'This is the beginning of your conversation in this channel.'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 px-4 py-4" ref={scrollAreaRef}>
      <div className="space-y-4">
        {messages.map((message, index) => {
          const previousMessage = messages[index - 1];
          const showAvatar = !previousMessage || 
            previousMessage.sender !== message.sender ||
            previousMessage.senderName !== message.senderName ||
            new Date(message.timestamp).getTime() - new Date(previousMessage.timestamp).getTime() > 300000; // 5 minutes

          return (
            <MessageItem
              key={message.id}
              message={message}
              showAvatar={showAvatar}
              isCurrentUser={message.sender === 'user'}
              channel={channel}
            />
          );
        })}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}