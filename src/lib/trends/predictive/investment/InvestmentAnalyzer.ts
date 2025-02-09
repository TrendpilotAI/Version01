```typescript
import { VCTracker } from './trackers/VCTracker';
import { StartupAnalyzer } from './analyzers/StartupAnalyzer';
import { MarketAnalyzer } from './analyzers/MarketAnalyzer';
import type { InvestmentMetrics } from '../types';

export class InvestmentAnalyzer {
  private vcTracker = new VCTracker();
  private startupAnalyzer = new StartupAnalyzer();
  private marketAnalyzer = new MarketAnalyzer();

  async analyzeInvestorInterest(topic: string): Promise<InvestmentMetrics> {
    const [vc, startups, market] = await Promise.all([
      this.vcTracker.getInvestments(topic),
      this.startupAnalyzer.getActivity(topic),
      this.marketAnalyzer.getSignals(topic)
    ]);

    return {
      vcInvestments: vc,
      startupActivity: startups,
      marketSignals: market
    };
  }
}
```