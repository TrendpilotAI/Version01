```typescript
import { GithubAnalyzer } from './analyzers/GithubAnalyzer';
import { StackOverflowAnalyzer } from './analyzers/StackOverflowAnalyzer';
import { DevToolsAnalyzer } from './analyzers/DevToolsAnalyzer';
import { CloudPlatformAnalyzer } from './analyzers/CloudPlatformAnalyzer';
import type { TechSignals } from './types';

export class TechSignalDetector {
  private githubAnalyzer = new GithubAnalyzer();
  private stackOverflowAnalyzer = new StackOverflowAnalyzer();
  private devToolsAnalyzer = new DevToolsAnalyzer();
  private cloudAnalyzer = new CloudPlatformAnalyzer();

  async detectSignals(topic: string): Promise<TechSignals> {
    const [github, stackoverflow, devTools, cloud] = await Promise.all([
      this.githubAnalyzer.analyze(topic),
      this.stackOverflowAnalyzer.analyze(topic),
      this.devToolsAnalyzer.analyze(topic),
      this.cloudAnalyzer.analyze(topic)
    ]);

    return { github, stackoverflow, devTools, cloud };
  }
}
```