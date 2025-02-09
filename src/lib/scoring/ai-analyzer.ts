import OpenAI from 'openai';
import type { ContentAnalysis } from './types';

export class AIAnalyzer {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async analyzeContent(title: string, description: string): Promise<ContentAnalysis> {
    const prompt = `Analyze this content for a newsletter:
    Title: ${title}
    Content: ${description}
    
    Provide scores (1-5) and explanations for:
    1. Novelty: How new/unique is this development?
    2. Impact: What's the potential business impact?
    3. Timeliness: How relevant is this right now?
    4. Actionability: Can readers take action on this?`;

    const completion = await this.openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: "You are an expert at analyzing content relevance and impact." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
    });

    const analysis = completion.choices[0].message.content;
    return this.parseAnalysis(analysis);
  }

  private parseAnalysis(analysis: string): ContentAnalysis {
    // Simple parsing logic - can be enhanced
    return {
      novelty: this.extractScore(analysis, 'Novelty'),
      impact: this.extractScore(analysis, 'Impact'),
      timeliness: this.extractScore(analysis, 'Timeliness'),
      actionability: this.extractScore(analysis, 'Actionability'),
      explanation: analysis
    };
  }

  private extractScore(text: string, metric: string): number {
    const regex = new RegExp(`${metric}.*?(\\d)`, 'i');
    const match = text.match(regex);
    return match ? parseInt(match[1], 10) : 3;
  }
}