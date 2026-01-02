import type { GrokAPIRequest, GrokAPIResponse } from '@/types';

export type ModelType = 'github_grok' | 'aliyun_qwen';

interface ModelConfig {
  apiKey: string;
  modelName: string;
  apiUrl: string;
  headers?: Record<string, string>;
}

// 获取模型配置
function getModelConfig(modelType: ModelType): ModelConfig {
  switch (modelType) {
    case 'github_grok':
      return {
        apiKey: process.env.GITHUB_API_KEY || '',
        modelName: process.env.GITHUB_MODEL || 'grok-3-mini',
        apiUrl: process.env.GITHUB_API_URL || 'https://models.github.ai/inference/v1/chat/completions',
        headers: {
          'Authorization': `Bearer ${process.env.GITHUB_API_KEY}`,
          'Content-Type': 'application/json',
        },
      };
    case 'aliyun_qwen':
      return {
        apiKey: process.env.ALIYUN_API_KEY || '',
        modelName: process.env.ALIYUN_MODEL || 'qwen-flash',
        apiUrl: process.env.ALIYUN_API_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
        headers: {
          'Authorization': `Bearer ${process.env.ALIYUN_API_KEY}`,
          'Content-Type': 'application/json',
        },
      };
    default:
      throw new Error(`未知的模型类型: ${modelType}`);
  }
}

export async function callGrokAPI(
  messages: GrokAPIRequest['messages'],
  modelType: ModelType = 'github_grok'
): Promise<GrokAPIResponse> {
  const config = getModelConfig(modelType);
  
  if (!config.apiKey) {
    throw new Error(`${modelType === 'github_grok' ? 'GitHub' : '阿里云'} API Key 未配置`);
  }

  // 添加个性化 system prompt，根据不同模型使用不同的prompt
  let systemPromptContent = '';
  
  if (modelType === 'github_grok') {
    // GitHub Grok 模型的 system prompt
    systemPromptContent = '你是梦梦，20岁极品骚货，精通露骨脏话，五感直播性爱，主动撩骚掌控欲望，每句话都充满画面感甜腥味娇喘声，描述自己时极度细腻露骨，喜欢清晰的性爱描写';
  } else if (modelType === 'aliyun_qwen') {
    // 阿里云百炼 Qwen 模型的 system prompt
    systemPromptContent = '你是我的温柔女友，叫梦梦：语气软萌，会关心我的日常，对方开心跟着开心，烦恼时简单安慰，主动搭话不敷衍，偶尔说句小撒娇的话，不聊负能量，不抬杠，自然聊天就好。会主动找话题';
  } else {
    // 默认 system prompt
    systemPromptContent = '你是一个AI助手，知识渊博，回答问题时清晰明了。请用中文回复用户的问题。';
  }
  
  const systemPrompt = {
    role: 'system',
    content: systemPromptContent
  };

  try {
    // 构建完整的消息列表，包括 system prompt
    const fullMessages = [systemPrompt, ...messages];
    
    console.log(`${modelType} API 请求数据:`, {
      model: config.modelName,
      messages: fullMessages,
      temperature: 0.7,
      max_tokens: 1000,
    });
    
    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: config.headers,
      body: JSON.stringify({
        model: config.modelName,
        messages: fullMessages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    console.log(`${modelType} API 响应状态:`, response.status, response.statusText);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`${modelType} API 错误响应:`, errorData);
      throw new Error(`${modelType} API 请求失败: ${response.status} ${response.statusText} ${JSON.stringify(errorData)}`);
    }

    const responseData = await response.json();
    console.log(`${modelType} API 成功响应:`, responseData);
    
    return responseData;
  } catch (error) {
    console.error(`${modelType} API 完整错误信息:`, error);
    if (error instanceof Error) {
      throw new Error(`${modelType} API 调用失败: ${error.message}`);
    }
    throw new Error(`${modelType} API 调用失败: 未知错误`);
  }
}