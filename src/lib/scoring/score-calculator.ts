import type { ContentAnalysis, ScoringWeights, ScoreBreakdown } from './types';

export class ScoreCalculator {
  private weights: ScoringWeights;

  constructor(weights: ScoringWeights) {
    this.weights = weights;
  }

  calculateScores(analysis: ContentAnalysis): ScoreBreakdown {
    const scores = {
      novelty: analysis.novelty * this.weights.novelty,
      impact: analysis.impact * this.weights.impact,
      timeliness: analysis.timeliness * this.weights.timeliness,
      actionability: analysis.actionability * this.weights.actionability,
      final: 0
    };

    scores.final = this.calculateFinalScore(scores);
    return scores;
  }

  private calculateFinalScore(scores: Omit<ScoreBreakdown, 'final'>): number {
    const totalWeight = Object.values(this.weights).reduce((sum, weight) => sum + weight, 0);
    
    return Object.entries(scores).reduce((total, [metric, score]) => {
      const weight = this.weights[metric as keyof ScoringWeights] / totalWeight;
      return total + (score * weight);
    }, 0);
  }
}