```typescript
import { GovernmentAnalyzer } from './analyzers/GovernmentAnalyzer';
import { StandardsAnalyzer } from './analyzers/StandardsAnalyzer';
import { InternationalAnalyzer } from './analyzers/InternationalAnalyzer';
import type { RegulatorySignals } from './types';

export class RegulatorySignalDetector {
  private governmentAnalyzer = new GovernmentAnalyzer();
  private standardsAnalyzer = new StandardsAnalyzer();
  private internationalAnalyzer = new InternationalAnalyzer();

  async detectSignals(topic: string): Promise<RegulatorySignals> {
    const [government, standards, international] = await Promise.all([
      this.governmentAnalyzer.analyze(topic),
      this.standardsAnalyzer.analyze(topic),
      this.internationalAnalyzer.analyze(topic)
    ]);

    return { government, standards, international };
  }
}
```