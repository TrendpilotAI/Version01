```typescript
import { AcademicAnalyzer } from './analyzers/AcademicAnalyzer';
import { IndustryResearchAnalyzer } from './analyzers/IndustryResearchAnalyzer';
import { ResearchLabAnalyzer } from './analyzers/ResearchLabAnalyzer';
import type { ResearchSignals } from './types';

export class ResearchSignalDetector {
  private academicAnalyzer = new AcademicAnalyzer();
  private industryAnalyzer = new IndustryResearchAnalyzer();
  private labAnalyzer = new ResearchLabAnalyzer();

  async detectSignals(topic: string): Promise<ResearchSignals> {
    const [academic, industry, labs] = await Promise.all([
      this.academicAnalyzer.analyze(topic),
      this.industryAnalyzer.analyze(topic),
      this.labAnalyzer.analyze(topic)
    ]);

    return { academic, industry, labs };
  }
}
```