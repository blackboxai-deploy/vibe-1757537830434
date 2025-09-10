import { AIModel } from '@/types/ai-models';

export const AI_MODELS: AIModel[] = [
  {
    id: 'openrouter/claude-sonnet-4',
    name: 'claude-sonnet-4',
    displayName: 'Claude Sonnet 4',
    description: 'Advanced reasoning and coding tasks with improved accuracy',
    capabilities: ['Advanced Reasoning', 'Code Generation', 'Analysis', 'Writing'],
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/925d8f93-aca4-45c7-ae3f-393431f30616.png',
    color: 'bg-purple-500',
    provider: 'Anthropic',
    isAvailable: true,
  },
  {
    id: 'gpt-4o-mini',
    name: 'gpt-4o-mini',
    displayName: 'GPT-4o Mini',
    description: 'Fast and efficient responses for general tasks',
    capabilities: ['General Chat', 'Quick Responses', 'Summarization'],
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/9c8b5acf-565b-487b-84ad-867ef3a405d4.png',
    color: 'bg-green-500',
    provider: 'OpenAI',
    isAvailable: true,
  },
  {
    id: 'google/gemini-2.5-pro-preview',
    name: 'gemini-2.5-pro-preview',
    displayName: 'Gemini 2.5 Pro',
    description: 'Multimodal capabilities with advanced understanding',
    capabilities: ['Multimodal', 'Image Analysis', 'Code', 'Research'],
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/84c73a45-c43f-475f-a2a0-e30ae98a136a.png',
    color: 'bg-blue-500',
    provider: 'Google',
    isAvailable: true,
  },
  {
    id: 'deepseek-v3',
    name: 'deepseek-v3',
    displayName: 'DeepSeek V3',
    description: 'Code-focused AI with strong programming capabilities',
    capabilities: ['Code Generation', 'Debugging', 'Architecture', 'Review'],
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c9ebc633-da44-4d74-853d-a892c3230477.png',
    color: 'bg-orange-500',
    provider: 'DeepSeek',
    isAvailable: true,
  },
  {
    id: 'anthropic/claude-opus-4',
    name: 'claude-opus-4',
    displayName: 'Claude Opus 4',
    description: 'Creative writing and complex reasoning tasks',
    capabilities: ['Creative Writing', 'Complex Analysis', 'Research', 'Storytelling'],
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/db254844-651d-409e-94cc-c1d2e0858a14.png',
    color: 'bg-pink-500',
    provider: 'Anthropic',
    isAvailable: true,
  },
  {
    id: 'grok-4',
    name: 'grok-4',
    displayName: 'Grok 4',
    description: 'Conversational AI with personality and wit',
    capabilities: ['Conversational', 'Humor', 'Current Events', 'Analysis'],
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e215dda0-3660-433a-9f5b-342d6206479e.png',
    color: 'bg-indigo-500',
    provider: 'xAI',
    isAvailable: true,
  },
];

export const DEFAULT_MODEL = AI_MODELS[0]; // Claude Sonnet 4

export const getModelById = (id: string): AIModel | undefined => {
  return AI_MODELS.find(model => model.id === id);
};

export const getAvailableModels = (): AIModel[] => {
  return AI_MODELS.filter(model => model.isAvailable);
};