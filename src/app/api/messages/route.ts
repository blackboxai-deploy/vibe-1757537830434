import { NextRequest, NextResponse } from 'next/server';
import { Message } from '@/types/chat';

// In-memory message storage (in production, use a database)
const messageStore: { [channelId: string]: Message[] } = {};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get('channelId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!channelId) {
      return NextResponse.json(
        { error: 'channelId is required' },
        { status: 400 }
      );
    }

    const channelMessages = messageStore[channelId] || [];
    const paginatedMessages = channelMessages
      .slice(offset, offset + limit)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return NextResponse.json({
      messages: paginatedMessages,
      total: channelMessages.length,
      hasMore: offset + limit < channelMessages.length,
    });

  } catch (error) {
    console.error('Messages GET API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    // Validate message structure
    if (!message || !message.id || !message.channelId || !message.content) {
      return NextResponse.json(
        { error: 'Invalid message structure' },
        { status: 400 }
      );
    }

    // Initialize channel if it doesn't exist
    if (!messageStore[message.channelId]) {
      messageStore[message.channelId] = [];
    }

    // Add message to store
    messageStore[message.channelId].push({
      ...message,
      timestamp: new Date(message.timestamp),
    });

    return NextResponse.json(
      { success: true, messageId: message.id },
      { status: 201 }
    );

  } catch (error) {
    console.error('Messages POST API error:', error);
    return NextResponse.json(
      { error: 'Failed to save message' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get('channelId');
    const messageId = searchParams.get('messageId');

    if (!channelId || !messageId) {
      return NextResponse.json(
        { error: 'channelId and messageId are required' },
        { status: 400 }
      );
    }

    if (messageStore[channelId]) {
      messageStore[channelId] = messageStore[channelId].filter(
        msg => msg.id !== messageId
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Messages DELETE API error:', error);
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}