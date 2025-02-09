typescript
import type { SourceConfig } from '../types';

export class IndustrySourceManager {
  private config: SourceConfig;

  constructor(config: SourceConfig) {
    this.config = config;
  }

  getSourceConfig() {
    return {
      techBlogs: {
        sources: [
          'openai.com/blog',
          'ai.googleblog.com',
          'aws.amazon.com/blogs/machine-learning'
        ],
        updateFrequency: 'daily'
      },
      companyNews: {
        sources: ['techcrunch.com', 'venturebeat.com'],
        categories: ['artificial-intelligence', 'machine-learning'],
        updateFrequency: 'hourly'
      },
      patents: {
        source: 'google.com/patents',
        categories: ['artificial intelligence', 'machine learning'],
        updateFrequency: 'weekly'
      }
    };
  }
}
```