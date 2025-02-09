export interface CriteriaDescription {
  title: string;
  description: string;
  low: string;
  high: string;
}

export interface ScoringCriteria {
  novelty: number;
  impact: number;
  timeliness: number;
  actionability: number;
}