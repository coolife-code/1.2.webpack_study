import { NextRequest, NextResponse } from 'next/server';
import { callGrokAPI, ModelType } from '@/lib/grokApi';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, modelType = 'github_grok' } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: '无效的请求格式' }, { status: 400 });
    }

    const response = await callGrokAPI(messages, modelType as ModelType);
    return NextResponse.json(response);
  } catch (error) {
    console.error('聊天 API 错误:', error);
    return NextResponse.json({ error: '聊天服务暂时不可用' }, { status: 500 });
  }
}