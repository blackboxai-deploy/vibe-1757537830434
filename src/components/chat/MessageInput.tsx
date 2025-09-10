'use client';

import { useState, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function MessageInput({ onSendMessage, placeholder = "Type a message...", disabled = false }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  return (
    <div className="p-4 border-t border-border bg-background">
      <div className="flex items-end space-x-2">
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder={disabled ? "AI assistant is currently unavailable" : placeholder}
            disabled={disabled}
            className={cn(
              "min-h-[20px] max-h-32 resize-none",
              "focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            rows={1}
            style={{
              height: 'auto',
              minHeight: '40px'
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = target.scrollHeight + 'px';
            }}
          />
          
          {/* Character count for long messages */}
          {message.length > 1000 && (
            <div className="absolute -top-6 right-0 text-xs text-muted-foreground">
              {message.length}/2000
            </div>
          )}
        </div>
        
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          size="sm"
          className="px-4 h-10 shrink-0"
        >
          Send
        </Button>
      </div>
      
      {/* Helpful hints */}
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span>Press Enter to send, Shift+Enter for new line</span>
        </div>
        
        {disabled && (
          <div className="flex items-center space-x-1 text-destructive">
            <div className="w-2 h-2 rounded-full bg-destructive"></div>
            <span>Offline</span>
          </div>
        )}
      </div>
    </div>
  );
}