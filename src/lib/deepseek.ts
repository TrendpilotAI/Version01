import OpenAI from 'openai';

if (!config.deepseek.isConfigured) {
  throw new Error('VITE_DEEPSEEK_API_KEY environment variable is missing');
}

const deepseek = new OpenAI({
  apiKey: config.deepseek.key,
  baseURL: 'https://api.deepseek.com/v1',
  dangerouslyAllowBrowser: true, // Enable browser usage
  defaultHeaders: {
    'Content-Type': 'application/json'
  },
  defaultQuery: {
    stream: false
  }
});

export async function generateWithDeepseek(prompt: string, options: {
  model?: string;
  temperature?: number;
  max_tokens?: number;
} = {}) {
  try {
    if (!prompt.trim()) {
      throw new Error('Empty prompt provided');
    }

    const completion = await deepseek.chat.completions.create({
      model: options.model || 'deepseek-r1-chat',
      messages: [
        { role: "system", content: "You are a helpful assistant" },
        { role: "user", content: prompt }
      ],
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 1000
    });

    if (!completion.choices[0]?.message?.content) {
      throw new Error('No content generated');
    }

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('DeepSeek error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate content');
  }
}

export async function generateCode(prompt: string, options: {
  language?: string;
  temperature?: number;
} = {}) {
  const enhancedPrompt = `Generate ${options.language || 'typescript'} code for: ${prompt}\nOnly return the code, no explanations.`;

  try {
    const completion = await deepseek.chat.completions.create({
      model: 'deepseek-r1-chat',
      messages: [
        { role: "system", content: "You are a code generation assistant" },
        { role: "user", content: enhancedPrompt }
      ],
      temperature: options.temperature ?? 0.3,
      max_tokens: 2000
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('DeepSeek code generation error:', error);
    throw error;
  }
}

export async function analyzeContent(content: string, type: 'score' | 'summarize' | 'keywords' = 'score'): Promise<any> {
  try {
    let prompt = '';
    let model = 'deepseek-r1-chat';
    let temperature = 0.3;

    switch (type) {
      case 'score':
        prompt = `Score this content from 0-5 based on relevance and quality. Return only the numeric score.
        Content: ${content}`;
        break;
      case 'summarize':
        prompt = `Summarize this content concisely:
        Content: ${content}`;
        break;
      case 'keywords':
        prompt = `Extract key topics and themes from this content. Return as comma-separated list.
        Content: ${content}`;
        break;
    }

    const completion = await deepseek.chat.completions.create({
      model,
      messages: [
        { role: "system", content: "You are a helpful assistant" },
        { role: "user", content: prompt }
      ],
      temperature,
      max_tokens: 1000,
      stream: false
    });

    if (type === 'score') {
      return parseFloat(completion.choices[0].message.content) || 0;
    }

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('DeepSeek analysis error:', error);
    throw error;
  }
}