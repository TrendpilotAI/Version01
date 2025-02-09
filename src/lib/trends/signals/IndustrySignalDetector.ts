```typescript
import { InvestmentAnalyzer } from './analyzers/InvestmentAnalyzer';
import { CorporateAnalyzer } from './analyzers/CorporateAnalyzer';
import { MarketAnalyzer } from './analyzers/MarketAnalyzer';
import type { IndustrySignals } from './types';

export class IndustrySignalDetector {
  private investmentAnalyzer = new InvestmentAnalyzer();
  private corporateAnalyzer = new CorporateAnalyzer();
  private marketAnalyzer = new MarketAnalyzer();

  async detectSignals(topic: string): Promise<IndustrySignals> {
    const [investment, corporate, market] = await Promise.all([
      this.investmentAnalyzer.analyze(topic),
      this.corporateAnalyzer.analyze(topic),
      this.marketAnalyzer.analyze(topic)
    ]);

    return { investment, corporate, market };
  }
}
```