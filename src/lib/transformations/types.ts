```typescript
export type TransformationType = 
  | 'clean'
  | 'keywords'
  | 'language'
  | 'summarize'
  | 'sentiment'
  | 'topics';

export interface TransformationConfig {
  transformations: TransformationType[];
  options?: Record<string, any>;
}

export interface ContentItem {
  id: string;
  content: string;
  metadata?: Record<string, any>;
}

export interface TransformationResult {
  content: string;
  metadata: Record<string, any>;
  transformations: Array<{
    type: TransformationType;
    timestamp: string;
    success: boolean;
    error?: string;
  }>;
}

export interface AnalyzerResult {
  content: string;
  metadata: Record<string, any>;
}
```