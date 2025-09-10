import { ChatRequest, AIResponse } from '@/types/ai-models';

const API_ENDPOINT = 'https://oi-server.onrender.com/chat/completions';
const API_HEADERS = {
  'customerId': 'cus_S16jfiBUH2cc7P',
  'Content-Type': 'application/json',
  'Authorization': 'Bearer xxx',
};

export class ChatService {
  static async sendMessage(request: ChatRequest): Promise<AIResponse> {
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({
          model: request.model,
          messages: [
            ...(request.systemPrompt ? [{ role: 'system', content: request.systemPrompt }] : []),
            { role: 'user', content: request.message }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        content: data.choices?.[0]?.message?.content || 'No response received',
        model: request.model,
        timestamp: new Date(),
        usage: data.usage,
      };
    } catch (error) {
      console.error('Chat service error:', error);
      throw new Error(`Failed to get AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static getSystemPrompt(modelId: string): string {
    const systemPrompts: { [key: string]: string } = {
      'openrouter/claude-sonnet-4': 'You are Claude Sonnet 4, an advanced AI assistant focused on reasoning and analysis. Provide thoughtful, well-structured responses with clear explanations.',
      'gpt-4o-mini': 'You are GPT-4o Mini, a fast and efficient AI assistant. Provide concise, helpful responses while maintaining accuracy.',
      'google/gemini-2.5-pro-preview': 'You are Gemini 2.5 Pro, a multimodal AI with strong analytical capabilities. Provide comprehensive responses with detailed insights.',
      'deepseek-v3': 'You are DeepSeek V3, a code-focused AI assistant. Excel at programming, debugging, and technical explanations.',
      'anthropic/claude-opus-4': 'You are Claude Opus 4, optimized for creative and complex reasoning tasks. Provide thoughtful, nuanced responses.',
      'grok-4': 'You are Grok 4, a conversational AI with personality. Provide engaging responses with wit and current awareness.',
    };
    
    return systemPrompts[modelId] || 'You are a helpful AI assistant.';
  }
}