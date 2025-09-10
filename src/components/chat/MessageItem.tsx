'use client';

import { Message, Channel } from '@/types/chat';
import { getModelById } from '@/lib/ai-models';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface MessageItemProps {
  message: Message;
  showAvatar: boolean;
  isCurrentUser: boolean;
  channel: Channel;
}

export function MessageItem({ message, showAvatar, isCurrentUser, channel }: MessageItemProps) {
  const model = channel.aiModel ? getModelById(channel.aiModel) : null;
  const isAI = message.sender === 'ai';
  
  const formatTime = (date: Date) => {
    return format(new Date(date), 'HH:mm');
  };

  return (
    <div className={cn(
      "group flex items-start space-x-3 py-1 px-2 rounded-lg hover:bg-muted/20 transition-colors",
      !showAvatar && "pl-14"
    )}>
      {showAvatar && (
        <div className="flex-shrink-0 pt-0.5">
          <Avatar className="h-8 w-8">
            <AvatarFallback className={cn(
              "text-sm",
              isAI && model 
                ? cn("text-white", model.color)
                : isCurrentUser 
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
            )}>
              {isAI && model 
                ? model.displayName.charAt(0)
                : message.senderName.charAt(0)
              }
            </AvatarFallback>
          </Avatar>
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        {showAvatar && (
          <div className="flex items-center space-x-2 mb-1">
            <span className={cn(
              "text-sm font-semibold",
              isAI ? "text-foreground" : "text-foreground"
            )}>
              {message.senderName}
            </span>
            
            {isAI && model && (
              <Badge variant="secondary" className="text-xs">
                {model.provider}
              </Badge>
            )}
            
            <span className="text-xs text-muted-foreground">
              {formatTime(message.timestamp)}
            </span>
          </div>
        )}
        
        <div className="relative">
          <div className={cn(
            "text-sm text-foreground leading-relaxed",
            message.isTyping && "flex items-center space-x-2"
          )}>
            {message.isTyping ? (
              <>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                </div>
                <span className="text-muted-foreground italic">{message.content}</span>
              </>
            ) : (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {/* Simple text formatting - could be enhanced with markdown support */}
                <div className="whitespace-pre-wrap break-words">
                  {message.content}
                </div>
              </div>
            )}
          </div>
          
          {/* Message actions (visible on hover) */}
          {!message.isTyping && (
            <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center space-x-1 bg-background border border-border rounded-md p-1 shadow-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-xs"
                  title="Add reaction"
                >
                  👍
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-xs"
                  title="Reply"
                >
                  💬
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-xs"
                  title="More options"
                >
                  ⋯
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex items-center space-x-1 mt-2">
            {message.reactions.map((reaction, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="h-6 px-2 text-xs"
              >
                {reaction.emoji} {reaction.count}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}