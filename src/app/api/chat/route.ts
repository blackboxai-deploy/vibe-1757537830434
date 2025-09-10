import { NextRequest, NextResponse } from 'next/server';
import { ChatService } from '@/lib/chat-service';
import { ChatRequest } from '@/types/ai-models';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, model, channelId, systemPrompt } = body;

    // Validate required fields
    if (!message || !model || !channelId) {
      return NextResponse.json(
        { error: 'Missing required fields: message, model, and channelId are required' },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.length > 2000) {
      return NextResponse.json(
        { error: 'Message too long. Maximum length is 2000 characters.' },
        { status: 400 }
      );
    }

    // Create chat request
    const chatRequest: ChatRequest = {
      message,
      model,
      channelId,
      systemPrompt: systemPrompt || ChatService.getSystemPrompt(model),
    };

    // Get AI response
    const aiResponse = await ChatService.sendMessage(chatRequest);

    return NextResponse.json({
      content: aiResponse.content,
      model: aiResponse.model,
      timestamp: aiResponse.timestamp,
      usage: aiResponse.usage,
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Return appropriate error response
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    const statusCode = errorMessage.includes('API request failed') ? 502 : 500;
    
    return NextResponse.json(
      { 
        error: 'Failed to process chat request',
        details: errorMessage,
      },
      { status: statusCode }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}