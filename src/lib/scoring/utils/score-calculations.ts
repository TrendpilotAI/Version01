import type { ScoreBreakdown } from '../types';

export function calculateAverageScores(scores: ScoreBreakdown[]): ScoreBreakdown {
  const initial = {
    novelty: 0,
    impact: 0,
    timeliness: 0,
    actionability: 0,
    final: 0
  };

  if (scores.length === 0) return initial;

  const totals = scores.reduce((acc, score) => ({
    novelty: acc.novelty + score.novelty,
    impact: acc.impact + score.impact,
    timeliness: acc.timeliness + score.timeliness,
    actionability: acc.actionability + score.actionability,
    final: acc.final + score.final
  }), initial);

  return {
    novelty: totals.novelty / scores.length,
    impact: totals.impact / scores.length,
    timeliness: totals.timeliness / scores.length,
    actionability: totals.actionability / scores.length,
    final: totals.final / scores.length
  };
}

export function calculateDistribution(scores: ScoreBreakdown[]): Array<{
  range: string;
  count: number;
}> {
  return Array.from({ length: 10 }, (_, i) => ({
    range: `${(i * 0.5).toFixed(1)}-${((i + 1) * 0.5).toFixed(1)}`,
    count: scores.filter(s => 
      s.final >= i * 0.5 && s.final < (i + 1) * 0.5
    ).length
  }));
}