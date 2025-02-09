```typescript
import { DeepseekR1 } from 'deepseek-ai';

// Initialize DeepSeek R1 with API key
const deepseekR1 = new DeepseekR1({
  apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
  dangerouslyAllowBrowser: true
});

// Helper function for text generation with R1
export async function generateWithR1(prompt: string, options: {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  context?: string;
} = {}) {
  try {
    const completion = await deepseekR1.generate({
      prompt,
      model: options.model || 'deepseek-r1-chat',
      temperature: options.temperature || 0.7,
      max_tokens: options.max_tokens || 1000,
      context: options.context,
    });

    return completion.text;
  } catch (error) {
    console.error('DeepSeek R1 error:', error);
    throw error;
  }
}

// Text transformation functions
export const textTransformations = {
  summarize: async (text: string) => {
    return generateWithR1(text, {
      model: 'deepseek-r1-chat',
      temperature: 0.3,
      context: 'Create a concise summary of the following text while preserving key information.'
    });
  },

  shorten: async (text: string) => {
    return generateWithR1(text, {
      model: 'deepseek-r1-chat',
      temperature: 0.3,
      context: 'Make this text shorter and more concise while maintaining its core message.'
    });
  },

  enhance: async (text: string) => {
    return generateWithR1(text, {
      model: 'deepseek-r1-chat',
      temperature: 0.7,
      context: 'Enhance this text to make it more engaging, professional, and impactful.'
    });
  },

  bullets: async (text: string) => {
    return generateWithR1(text, {
      model: 'deepseek-r1-chat',
      temperature: 0.3,
      context: 'Convert this text into clear, well-organized bullet points.'
    });
  },

  emojify: async (text: string) => {
    return generateWithR1(text, {
      model: 'deepseek-r1-chat',
      temperature: 0.7,
      context: 'Add relevant and engaging emojis to this text to make it more expressive.'
    });
  },

  original: async (text: string) => {
    return generateWithR1(text, {
      model: 'deepseek-r1-chat',
      temperature: 0.9,
      context: 'Rewrite this text in a unique and original way while maintaining its meaning.'
    });
  }
};
```