```typescript
import { supabase } from '@/lib/supabase';
import type { TrendPattern, EarlySignal } from './types';

export class HistoricalTrendMatcher {
  async findSimilarPatterns(signals: EarlySignal[]): Promise<TrendPattern[]> {
    try {
      // Get historical trends from Supabase
      const { data: historicalTrends } = await supabase
        .from('historical_trends')
        .select('*');

      if (!historicalTrends) return [];

      // Calculate pattern similarity scores
      const scoredPatterns = historicalTrends.map(trend => ({
        ...trend,
        similarityScore: this.calculateSimilarity(signals, trend.signals)
      }));

      // Sort by similarity and return top matches
      return scoredPatterns
        .sort((a, b) => b.similarityScore - a.similarityScore)
        .slice(0, 5);
    } catch (error) {
      console.error('Error finding similar patterns:', error);
      return [];
    }
  }

  private calculateSimilarity(currentSignals: EarlySignal[], historicalSignals: EarlySignal[]): number {
    // Implement similarity calculation using signal attributes
    return Math.random(); // Placeholder
  }
}
```