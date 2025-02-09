```typescript
export interface TrendPrediction {
  predictedScore: number;
  confidence: number;
  similarHistoricalTrends: any[];
  earlySignals: EarlySignal[];
  timeToMainstream: number;
}

export interface EarlySignal {
  type: string;
  strength: number;
  source: string;
  timestamp: Date;
}

export interface AggregatedContent {
  id: string;
  source: string;
  content: string;
  metadata: Record<string, any>;
  timestamp: Date;
}

export interface SourceConfig {
  github?: GitHubConfig;
  arxiv?: ArxivConfig;
  blogs?: BlogConfig;
  vc?: VCConfig;
  patents?: PatentConfig;
}

export interface CompetitorInsight {
  competitor: string;
  publishingPattern: any;
  topicFocus: string[];
  engagementMetrics: any;
  gaps: TopicGap[];
}

export interface TopicGap {
  topic: string;
  coverage: number;
  opportunity: number;
  competitors: string[];
}

export interface ContentScore {
  technicalDepth: number;
  industryImpact: number;
  regulatoryImpact: number;
  firstMoverAdvantage: number;
  investmentPotential: number;
  confidence: number;
}

export interface ScoringCriteria {
  technicalWeight: number;
  industryWeight: number;
  regulatoryWeight: number;
  firstMoverWeight: number;
}

export interface OptimizationResult {
  headlines: string[];
  optimalTiming: Date;
  audienceSegments: any[];
  platformVersions: ContentVariant[];
  socialSnippets: Record<string, string>;
}

export interface ContentVariant {
  platform: string;
  content: string;
  format: string;
  targetSegment: string;
}
```