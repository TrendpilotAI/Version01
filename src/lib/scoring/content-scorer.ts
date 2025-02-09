import { supabase } from '../supabase';
import { AIAnalyzer } from './ai-analyzer';
import { ScoreCalculator } from './score-calculator';
import type { ScoreBreakdown } from './types';

export class ContentScorer {
  private analyzer: AIAnalyzer;
  private calculator: ScoreCalculator;

  constructor(openAIKey: string) {
    this.analyzer = new AIAnalyzer(openAIKey);
    this.calculator = new ScoreCalculator({
      novelty: 0.3,
      impact: 0.3,
      timeliness: 0.2,
      actionability: 0.2
    });
  }

  async scoreContent(contentId: string, title: string, description: string): Promise<ScoreBreakdown> {
    try {
      // Get AI analysis
      const analysis = await this.analyzer.analyzeContent(title, description);

      // Calculate scores
      const scores = this.calculator.calculateScores(analysis);

      // Store the results
      await this.storeScore(contentId, scores, analysis.explanation);

      return scores;
    } catch (error) {
      console.error('Error scoring content:', error);
      throw error;
    }
  }

  private async storeScore(
    contentId: string, 
    scores: ScoreBreakdown, 
    explanation: string
  ): Promise<void> {
    const { error } = await supabase
      .from('source_content')
      .update({
        score: scores.final,
        scoring_details: {
          breakdown: scores,
          explanation
        }
      })
      .eq('id', contentId);

    if (error) throw error;
  }
}