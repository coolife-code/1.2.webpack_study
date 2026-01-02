export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatHistory {
  messages: Message[];
}

export interface GrokAPIRequest {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export interface GrokAPIResponse {
  choices: Array<{
    message: {
      role: 'assistant';
      content: string;
    };
  }>;
}