typescript
export interface SourceConfig {
  updateFrequency?: 'realtime' | 'hourly' | 'daily' | 'weekly';
  categories?: string[];
  sources?: string[];
  keywords?: string[];
}

export interface ContentItem {
  id: string;
  source: string;
  title: string;
  content: string;
  url?: string;
  publishedAt: string;
  metadata: Record<string, any>;
  scores?: ContentScores;
}

export interface ContentScores {
  relevance: number;
  freshness: number;
  quality: number;
  uniqueness: number;
}

export interface FilterOptions {
  minRelevance?: number;
  minQuality?: number;
  contentTypes?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}
```