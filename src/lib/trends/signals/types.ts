```typescript
export interface TechSignals {
  github: GithubMetrics;
  stackoverflow: StackOverflowMetrics;
  devTools: DevToolsMetrics;
  cloud: CloudMetrics;
}

export interface ResearchSignals {
  academic: AcademicMetrics;
  industry: IndustryResearchMetrics;
  labs: LabMetrics;
}

export interface IndustrySignals {
  investment: InvestmentMetrics;
  corporate: CorporateMetrics;
  market: MarketMetrics;
}

export interface SocialSignals {
  discussion: DiscussionMetrics;
  sentiment: SentimentMetrics;
  influence: InfluenceMetrics;
}

export interface RegulatorySignals {
  government: GovernmentMetrics;
  standards: StandardsMetrics;
  international: InternationalMetrics;
}

// Individual metric interfaces...
export interface GithubMetrics {
  repoGrowth: number;
  issueDiscussions: number;
  starHistory: number;
  forkActivity: number;
}

// Add other metric interfaces...
```