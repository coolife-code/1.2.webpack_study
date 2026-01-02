import { useState, useRef, useEffect } from 'react';
import type { Message } from '@/types';

export default function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('github_grok');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 获取最近三条对话历史作为模型记忆
  const getRecentMessages = () => {
    const recent = messages.slice(-6); // 保留最近3轮对话（6条消息）
    return recent.map(msg => ({ role: msg.role, content: msg.content }));
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputMessage.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...getRecentMessages(), { role: 'user', content: inputMessage.trim() }],
          modelType: selectedModel,
        }),
      });

      if (!response.ok) {
        throw new Error('API 请求失败');
      }

      const data = await response.json();
      console.log('前端收到的API响应:', data);
      
      // 确保响应格式正确
      let assistantContent = '';
      if (data.choices && data.choices.length > 0) {
        const choice = data.choices[0];
        if (choice.message && typeof choice.message === 'object') {
          assistantContent = choice.message.content || '抱歉，我没有理解您的请求。';
        } else if (typeof choice.message === 'string') {
          assistantContent = choice.message;
        }
      } else {
        assistantContent = '抱歉，我暂时无法提供响应。';
      }
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: assistantContent,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('聊天错误:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: '抱歉，我暂时无法回复您的消息，请稍后再试。',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    sendMessage,
    messagesEndRef,
    selectedModel,
    setSelectedModel,
  };
}