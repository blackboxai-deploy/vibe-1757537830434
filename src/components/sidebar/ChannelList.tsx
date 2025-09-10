'use client';

import { Channel } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ChannelListProps {
  channels: Channel[];
  onChannelSelect: (channelId: string) => void;
  activeChannelId: string;
}

export function ChannelList({ channels, onChannelSelect, activeChannelId }: ChannelListProps) {
  return (
    <div className="space-y-1">
      {channels.map((channel) => (
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
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <span className="text-muted-foreground">#</span>
              <span className="truncate text-sm">{channel.name}</span>
            </div>
            {channel.unreadCount > 0 && (
              <Badge variant="destructive" className="ml-auto text-xs px-1.5 py-0.5 h-5">
                {channel.unreadCount > 99 ? '99+' : channel.unreadCount}
              </Badge>
            )}
          </div>
        </Button>
      ))}
      
      {channels.length === 0 && (
        <div className="px-2 py-4 text-center">
          <p className="text-sm text-muted-foreground">No channels available</p>
        </div>
      )}
    </div>
  );
}