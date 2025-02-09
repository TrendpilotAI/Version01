typescript
import type { SourceConfig } from '../types';

export class SocialSourceManager {
  private config: SourceConfig;

  constructor(config: SourceConfig) {
    this.config = config;
  }

  getSourceConfig() {
    return {
      twitter: {
        followAccounts: ['OpenAI', 'DeepMind', 'GoogleAI'],
        hashtags: ['#AI', '#MachineLearning'],
        updateFrequency: 'realtime'
      },
      reddit: {
        subreddits: ['artificial', 'MachineLearning', 'AIdev'],
        updateFrequency: 'hourly'
      },
      hackernews: {
        keywords: ['AI', 'machine learning', 'deep learning'],
        updateFrequency: 'hourly'
      }
    };
  }
}
```