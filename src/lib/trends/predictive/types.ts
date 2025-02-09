```typescript
export interface TrendAnalysis {
  score: number;
  confidence: number;
  timeToMainstream: number;
  drivers: string[];
  barriers: string[];
}

export interface TrendPattern {
  id: string;
  name: string;
  signals: EarlySignal[];
  outcome: {
    success: boolean;
    timeToMainstream: number;
    peakInterest: number;
  };
  similarityScore?: number;
}

export interface EarlySignal {
  type: 'github' | 'social' | 'tech' | 'patent';
  source: string;
  strength: number;
  timestamp: string;
  metadata: Record<string, any>;
}

export interface TrendPrediction {
  score: number;
  confidence: number;
  timeToMainstream: number;
  similarPatterns: TrendPattern[];
  signals: EarlySignal[];
  analysis: TrendAnalysis;
}
```