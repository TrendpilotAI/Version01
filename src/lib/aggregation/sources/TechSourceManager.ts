typescript
import type { SourceConfig } from '../types';

export class TechSourceManager {
  private config: SourceConfig;

  constructor(config: SourceConfig) {
    this.config = config;
  }

  getSourceConfig() {
    return {
      github: {
        topics: ['artificial-intelligence', 'machine-learning'],
        updateFrequency: 'daily'
      },
      devBlogs: {
        sources: ['pytorch.org/blog', 'tensorflow.org/blog'],
        updateFrequency: 'daily'
      },
      documentation: {
        sources: ['docs.openai.com', 'huggingface.co/docs'],
        updateFrequency: 'daily'
      }
    };
  }
}
```