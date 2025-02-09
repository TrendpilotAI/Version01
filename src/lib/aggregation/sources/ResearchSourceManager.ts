typescript
import type { SourceConfig } from '../types';

export class ResearchSourceManager {
  private config: SourceConfig;

  constructor(config: SourceConfig) {
    this.config = config;
  }

  getSourceConfig() {
    return {
      arxiv: {
        url: 'https://arxiv.org/api/',
        categories: ['cs.AI', 'cs.LG', 'stat.ML'],
        updateFrequency: 'daily'
      },
      papers: {
        url: 'https://paperswithcode.com/api/',
        categories: ['all'],
        updateFrequency: 'daily'
      },
      conferences: {
        sources: ['neurips', 'icml', 'iclr'],
        updateFrequency: 'weekly'
      }
    };
  }
}
```