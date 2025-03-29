import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: Request) {
  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const { messages, systemPrompt } = await request.json();

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1024,
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      system: systemPrompt,
    });

    return NextResponse.json({
      message: response.content[0].text,
      id: response.id,
    });
  } catch (error) {
    console.error('Error calling Anthropic:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
} 