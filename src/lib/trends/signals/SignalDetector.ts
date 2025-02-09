```typescript
import { TechSignalDetector } from './TechSignalDetector';
import { ResearchSignalDetector } from './ResearchSignalDetector';
import { IndustrySignalDetector } from './IndustrySignalDetector';
import { SocialSignalDetector } from './SocialSignalDetector';
import { RegulatorySignalDetector } from './RegulatorySignalDetector';
import type { 
  TechSignals, 
  ResearchSignals, 
  IndustrySignals,
  SocialSignals,
  RegulatorySignals 
} from './types';

export class SignalDetector {
  private techDetector = new TechSignalDetector();
  private researchDetector = new ResearchSignalDetector();
  private industryDetector = new IndustrySignalDetector();
  private socialDetector = new SocialSignalDetector();
  private regulatoryDetector = new RegulatorySignalDetector();

  async detectSignals(topic: string) {
    const [
      techSignals,
      researchSignals,
      industrySignals,
      socialSignals,
      regulatorySignals
    ] = await Promise.all([
      this.techDetector.detectSignals(topic),
      this.researchDetector.detectSignals(topic),
      this.industryDetector.detectSignals(topic),
      this.socialDetector.detectSignals(topic),
      this.regulatoryDetector.detectSignals(topic)
    ]);

    return {
      techSignals,
      researchSignals,
      industrySignals,
      socialSignals,
      regulatorySignals
    };
  }
}
```