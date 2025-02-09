import type { CriteriaDescription } from './types';

export const criteriaDescriptions: Record<string, CriteriaDescription> = {
  novelty: {
    title: "Novelty Score",
    description: "Measures how unique and groundbreaking the content is",
    low: "Common knowledge",
    high: "Breakthrough insight"
  },
  impact: {
    title: "Impact Score",
    description: "Evaluates potential business and industry impact",
    low: "Minor effect",
    high: "Major disruption"
  },
  timeliness: {
    title: "Timeliness Score",
    description: "Assesses current relevance and urgency",
    low: "Can wait",
    high: "Urgent now"
  },
  actionability: {
    title: "Actionability Score",
    description: "Measures how practical and implementable the insights are",
    low: "Theoretical",
    high: "Immediately useful"
  }
};