```typescript
export interface ContentItem {
  id: string;
  sourceId: string;
  sourceType: string;
  title: string;
  content: string;
  url?: string;
  author?: string;
  publishedAt: string;
  metadata: Record<string, any>;
  score?: number;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ContentFeedConfig {
  sources: string[];
  filters?: {
    status?: string[];
    minScore?: number;
    dateRange?: {
      start?: string;
      end?: string;
    };
  };
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  pagination?: {
    page: number;
    pageSize: number;
  };
}

export interface ContentFeedStats {
  totalItems: number;
  approvedItems: number;
  pendingItems: number;
  averageScore: number;
  sourceBreakdown: Record<string, number>;
}
```