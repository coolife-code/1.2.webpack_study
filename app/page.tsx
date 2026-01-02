'use client';

import ChatHistory from '@/components/ChatHistory';
import ChatInput from '@/components/ChatInput';
import ModelSelector from '@/components/ModelSelector';
import useChat from '@/hooks/useChat';

export default function Home() {
  const { 
    messages, 
    inputMessage, 
    setInputMessage, 
    isLoading, 
    sendMessage, 
    messagesEndRef,
    selectedModel,
    setSelectedModel 
  } = useChat();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 标题栏 */}
      <header className="bg-blue-600 text-white py-4 px-6 shadow-md">
        <h1 className="text-2xl font-bold text-center">AI 对话</h1>
      </header>

      {/* 聊天主区域 - 弹性网格布局 */}
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col max-w-4xl">
        {/* 模型选择器 */}
        <div className="mb-4">
          <ModelSelector 
            selectedModel={selectedModel} 
            onModelChange={setSelectedModel} 
          />
        </div>

        <div className="bg-white rounded-xl shadow-lg flex flex-col h-[calc(100vh-280px)]">
          {/* 聊天历史 */}
          <ChatHistory messages={messages} />
          <div ref={messagesEndRef} />

          {/* 聊天输入 */}
          <ChatInput
            message={inputMessage}
            setMessage={setInputMessage}
            onSend={sendMessage}
            isLoading={isLoading}
          />
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-100 text-gray-600 py-3 px-6 text-center text-sm">
        <p>由 {selectedModel === 'github_grok' ? 'GitHub Models Grok' : '阿里云百炼 Qwen'} API 驱动</p>
      </footer>
    </div>
  );
}