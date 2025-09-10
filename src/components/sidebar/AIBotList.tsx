'use client';

import { Channel } from '@/types/chat';
import { getModelById } from '@/lib/ai-models';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AIBotListProps {
  channels: Channel[];
  onChannelSelect: (channelId: string) => void;
  activeChannelId: string;
}

export function AIBotList({ channels, onChannelSelect, activeChannelId }: AIBotListProps) {
  return (
    <div className="space-y-1">
      {channels.map((channel) => {
        const model = channel.aiModel ? getModelById(channel.aiModel) : null;
        
        return (
          <Button
            key={channel.id}
            variant="ghost"
            className={cn(
              "w-full justify-start px-2 py-2 h-auto text-left font-normal",
              channel.id === activeChannelId && "bg-muted text-foreground"
            )}
            onClick={() => onChannelSelect(channel.id)}
          >
            <div className="flex items-center space-x-3 w-full">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className={cn(
                    "text-xs text-white",
                    model?.color || "bg-gray-500"
                  )}>
                    {model?.displayName.charAt(0) || 'AI'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{channel.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {model?.provider || 'AI Assistant'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                {model?.isAvailable ? (
                  <div className="w-2 h-2 rounded-full bg-green-500" title="Available" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-red-500" title="Unavailable" />
                )}
                
                {channel.unreadCount > 0 && (
                  <Badge variant="destructive" className="text-xs px-1.5 py-0.5 h-5">
                    {channel.unreadCount > 99 ? '99+' : channel.unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          </Button>
        );
      })}
      
      {channels.length === 0 && (
        <div className="px-2 py-4 text-center">
          <p className="text-sm text-muted-foreground">No AI assistants available</p>
        </div>
      )}
    </div>
  );
}