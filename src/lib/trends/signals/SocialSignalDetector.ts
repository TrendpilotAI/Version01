```typescript
import { DiscussionAnalyzer } from './analyzers/DiscussionAnalyzer';
import { SentimentAnalyzer } from './analyzers/SentimentAnalyzer';
import { InfluenceAnalyzer } from './analyzers/InfluenceAnalyzer';
import type { SocialSignals } from './types';

export class SocialSignalDetector {
  private discussionAnalyzer = new DiscussionAnalyzer();
  private sentimentAnalyzer = new SentimentAnalyzer();
  private influenceAnalyzer = new InfluenceAnalyzer();

  async detectSignals(topic: string): Promise<SocialSignals> {
    const [discussion, sentiment, influence] = await Promise.all([
      this.discussionAnalyzer.analyze(topic),
      this.sentimentAnalyzer.analyze(topic),
      this.influenceAnalyzer.analyze(topic)
    ]);

    return { discussion, sentiment, influence };
  }
}
```