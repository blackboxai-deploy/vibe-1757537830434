export interface AIModel {
  id: string;
  name: string;
  displayName: string;
  description: string;
  capabilities: string[];
  avatar: string;
  color: string;
  provider: string;
  isAvailable: boolean;
}

export interface AIResponse {
  content: string;
  model: string;
  timestamp: Date;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ChatRequest {
  message: string;
  model: string;
  channelId: string;
  threadId?: string;
  systemPrompt?: string;
}

export interface ModelCapability {
  text: boolean;
  image: boolean;
  code: boolean;
  reasoning: boolean;
  creative: boolean;
}