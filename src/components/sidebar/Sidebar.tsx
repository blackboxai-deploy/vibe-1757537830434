'use client';

import { Channel, User } from '@/types/chat';
import { ChannelList } from './ChannelList';
import { AIBotList } from './AIBotList';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

interface SidebarProps {
  channels: Channel[];
  onChannelSelect: (channelId: string) => void;
  activeChannelId: string;
  user: User;
}

export function Sidebar({ channels, onChannelSelect, activeChannelId, user }: SidebarProps) {
  const { theme, setTheme } = useTheme();

  const regularChannels = channels.filter(channel => channel.type !== 'ai-bot');
  const aiBotChannels = channels.filter(channel => channel.type === 'ai-bot');

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="w-64 bg-muted/20 border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-foreground">AI Chat</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </Button>
        </div>
        
        {/* User Info */}
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user.name}
            </p>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${
                user.status === 'online' ? 'bg-green-500' : 
                user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
              }`} />
              <span className="text-xs text-muted-foreground capitalize">
                {user.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {/* Regular Channels */}
          <div className="mb-6">
            <div className="flex items-center px-2 py-1 mb-2">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Channels
              </h2>
            </div>
            <ChannelList
              channels={regularChannels}
              onChannelSelect={onChannelSelect}
              activeChannelId={activeChannelId}
            />
          </div>

          <Separator className="mb-4" />

          {/* AI Bots */}
          <div className="mb-6">
            <div className="flex items-center justify-between px-2 py-1 mb-2">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                AI Assistants
              </h2>
              <Badge variant="secondary" className="text-xs">
                {aiBotChannels.length}
              </Badge>
            </div>
            <AIBotList
              channels={aiBotChannels}
              onChannelSelect={onChannelSelect}
              activeChannelId={activeChannelId}
            />
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          <p>Multiple AI models available</p>
          <p className="mt-1">Choose an assistant to start chatting</p>
        </div>
      </div>
    </div>
  );
}