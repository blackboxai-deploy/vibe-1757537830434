'use client';

import { Channel, Message, User } from '@/types/chat';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { getModelById } from '@/lib/ai-models';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface ChatAreaProps {
  channel?: Channel;
  messages: Message[];
  onSendMessage: (content: string, channelId: string) => void;
  user: User;
}

export function ChatArea({ channel, messages, onSendMessage, user }: ChatAreaProps) {
  if (!channel) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to AI Chat</h2>
          <p className="text-muted-foreground">
            Select a channel or AI assistant from the sidebar to start chatting
          </p>
        </div>
      </div>
    );
  }

  const model = channel.aiModel ? getModelById(channel.aiModel) : null;
  const isAIBot = channel.type === 'ai-bot';

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-border bg-muted/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isAIBot && model ? (
              <Avatar className="h-8 w-8">
                <AvatarFallback className={cn(
                  "text-sm text-white",
                  model.color
                )}>
                  {model.displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                <span className="text-sm font-medium">#</span>
              </div>
            )}
            
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                {isAIBot ? `${channel.name}` : `#${channel.name}`}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isAIBot && model 
                  ? `${model.provider} • ${model.description}`
                  : channel.description || 'Channel conversation'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isAIBot && model && (
              <>
                <Badge variant={model.isAvailable ? 'default' : 'secondary'}>
                  {model.isAvailable ? 'Available' : 'Offline'}
                </Badge>
                {model.capabilities.slice(0, 2).map((capability, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {capability}
                  </Badge>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <MessageList 
          messages={messages} 
          currentUser={user}
          channel={channel}
        />
        
        <Separator />
        
        <MessageInput
          onSendMessage={(content) => onSendMessage(content, channel.id)}
          placeholder={
            isAIBot 
              ? `Message ${channel.name}...` 
              : `Message #${channel.name}...`
          }
          disabled={isAIBot && !!model && !model.isAvailable}
        />
      </div>
    </div>
  );
}