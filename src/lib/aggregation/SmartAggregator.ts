typescript
import { ResearchSourceManager } from './sources/ResearchSourceManager';
import { IndustrySourceManager } from './sources/IndustrySourceManager';
import { SocialSourceManager } from './sources/SocialSourceManager';
import { TechSourceManager } from './sources/TechSourceManager';
import { ContentCache } from './ContentCache';
import { ContentProcessor } from './ContentProcessor';
import type { SourceConfig, ContentItem, FilterOptions } from './types';

export class SmartAggregator {
  private sourceManagers: Map<string, any>;
  private cache: ContentCache;
  private processor: ContentProcessor;

  constructor(config: SourceConfig) {
    this.sourceManagers = new Map([
      ['research', new ResearchSourceManager(config)],
      ['industry', new IndustrySourceManager(config)],
      ['social', new SocialSourceManager(config)],
      ['tech', new TechSourceManager(config)]
    ]);
    this.cache = new ContentCache();
    this.processor = new ContentProcessor();
  }

  async aggregateContent(topic: string, options: FilterOptions = {}) {
    try {
      const content = await this.fetchFromAllSources(topic);
      const uniqueContent = await this.processor.deduplicateContent(content);
      const scoredContent = await this.processor.scoreContent(uniqueContent);
      return this.filterContent(scoredContent, options);
    } catch (error) {
      console.error('Error aggregating content:', error);
      throw error;
    }
  }

  private async fetchFromAllSources(topic: string): Promise<ContentItem[]> {
    const contentPromises = Array.from(this.sourceManagers.values())
      .map(manager => this.fetchFromSource(topic, manager));
    
    const results = await Promise.all(contentPromises);
    return results.flat();
  }

  private async fetchFromSource(topic: string, manager: any): Promise<ContentItem[]> {
    const cacheKey = `${manager.constructor.name}-${topic}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const content = await manager.fetchContent(topic);
    this.cache.set(cacheKey, content);
    return content;
  }

  private filterContent(content: ContentItem[], options: FilterOptions): ContentItem[] {
    return content.filter(item => {
      if (options.minRelevance && item.scores?.relevance < options.minRelevance) {
        return false;
      }
      if (options.minQuality && item.scores?.quality < options.minQuality) {
        return false;
      }
      if (options.dateRange && !this.isWithinDateRange(item.publishedAt, options.dateRange)) {
        return false;
      }
      return true;
    });
  }

  private isWithinDateRange(date: string, range: { start: Date; end: Date }): boolean {
    const publishDate = new Date(date);
    return publishDate >= range.start && publishDate <= range.end;
  }
}
```