typescript
export type SourceCategory = 
  | 'ai_ml'
  | 'business'
  | 'tech'
  | 'custom';

export type SourceType = {
  id: string;
  name: string;
  category: SourceCategory;
  icon: string;
  description: string;
  configFields: SourceConfigField[];
  transformations: TransformationType[];
};

export type SourceConfigField = {
  name: string;
  label: string;
  type: 'text' | 'password' | 'select' | 'number';
  required: boolean;
  options?: { label: string; value: string }[];
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
  };
};

export type TransformationType = 
  | 'summarization'
  | 'keyPointExtraction'
  | 'entityRecognition'
  | 'sentimentAnalysis'
  | 'topicClassification'
  | 'languageTranslation';

export interface SyncConfig {
  schedule: {
    frequency: 'realtime' | 'minutes' | 'hourly' | 'daily';
    interval?: number;
  };
  filters: {
    keywords?: string[];
    excludeKeywords?: string[];
    minScore?: number;
    languages?: string[];
    dateRange?: {
      start?: string;
      end?: string;
    };
  };
  transformations: {
    type: TransformationType;
    config: Record<string, any>;
  }[];
}

export interface SourceHealth {
  status: 'healthy' | 'warning' | 'error';
  lastCheck: string;
  message?: string;
  metrics: {
    successRate: number;
    avgResponseTime: number;
    errorCount: number;
  };
}
