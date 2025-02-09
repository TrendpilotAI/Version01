```typescript
import { GitHubSource } from './sources/GitHubSource';
import { ArxivSource } from './sources/ArxivSource';
import { BlogSource } from './sources/BlogSource';
import { VCSource } from './sources/VCSource';
import { PatentSource } from './sources/PatentSource';
import type { AggregatedContent, SourceConfig } from '../types';

export class ContentAggregator {
  private sources: Map<string, any>;

  constructor(config: SourceConfig) {
    this.sources = new Map([
      ['github', new GitHubSource(config.github)],
      ['arxiv', new ArxivSource(config.arxiv)],
      ['blogs', new BlogSource(config.blogs)],
      ['vc', new VCSource(config.vc)],
      ['patents', new PatentSource(config.patents)]
    ]);
  }

  async aggregateContent(): Promise<AggregatedContent[]> {
    const contentPromises = Array.from(this.sources.values())
      .map(source => source.fetchContent());
    
    const results = await Promise.all(contentPromises);
    return this.mergeAndDeduplicate(results);
  }

  private mergeAndDeduplicate(results: any[]): AggregatedContent[] {
    // Implement smart merging and deduplication logic
    return [];
  }
}
```