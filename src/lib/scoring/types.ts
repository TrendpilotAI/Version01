export interface ContentAnalysis {
  novelty: number;
  impact: number;
  timeliness: number;
  actionability: number;
  explanation: string;
}

export interface ScoringWeights {
  novelty: number;
  impact: number;
  timeliness: number;
  actionability: number;
}

export interface ScoreBreakdown {
  novelty: number;
  impact: number;
  timeliness: number;
  actionability: number;
  final: number;
}