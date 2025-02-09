```typescript
import { GithubStatsCollector } from './collectors/GithubStatsCollector';
import { StackOverflowAnalyzer } from './analyzers/StackOverflowAnalyzer';
import { HackathonTracker } from './trackers/HackathonTracker';
import type { DevActivityMetrics } from '../types';

export class DevActivityAnalyzer {
  private githubCollector = new GithubStatsCollector();
  private stackOverflowAnalyzer = new StackOverflowAnalyzer();
  private hackathonTracker = new HackathonTracker();

  async analyzeDevActivity(topic: string): Promise<DevActivityMetrics> {
    const [github, stackoverflow, hackathons] = await Promise.all([
      this.githubCollector.collectStats(topic),
      this.stackOverflowAnalyzer.getTrends(topic),
      this.hackathonTracker.getActivity(topic)
    ]);

    return {
      githubStats: github,
      stackOverflowTrends: stackoverflow,
      hackathonProjects: hackathons
    };
  }
}
```