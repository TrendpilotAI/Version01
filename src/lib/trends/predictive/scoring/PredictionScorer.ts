```typescript
import type { SignalMetrics, AcademicMetrics, DevActivityMetrics, InvestmentMetrics } from '../types';

export class PredictionScorer {
  private weights = {
    earlySigs: 0.3,
    academicInterest: 0.2,
    devActivity: 0.25,
    investorInterest: 0.25
  };

  calculateScore(signals: {
    earlySigs: SignalMetrics;
    academicInterest: AcademicMetrics;
    devActivity: DevActivityMetrics;
    investorInterest: InvestmentMetrics;
  }): number {
    return Object.entries(signals).reduce((score, [key, value]) => {
      return score + (this.normalizeSignal(value) * this.weights[key as keyof typeof this.weights]);
    }, 0);
  }

  private normalizeSignal(signal: Record<string, number>): number {
    const values = Object.values(signal);
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }
}
```