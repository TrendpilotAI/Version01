```typescript
import { supabase } from '@/lib/supabase';
import type { ContentItem, ContentFeedConfig, ContentFeedStats } from './types';

export class ContentFeedManager {
  constructor(private workspaceId: string) {}

  async getFeedContent(config: ContentFeedConfig): Promise<ContentItem[]> {
    try {
      let query = supabase
        .from('source_content')
        .select('*')
        .eq('workspace_id', this.workspaceId);

      // Apply source filtering
      if (config.sources?.length) {
        query = query.in('source_id', config.sources);
      }

      // Apply status filtering
      if (config.filters?.status?.length) {
        query = query.in('status', config.filters.status);
      }

      // Apply score filtering
      if (config.filters?.minScore !== undefined) {
        query = query.gte('score', config.filters.minScore);
      }

      // Apply date filtering
      if (config.filters?.dateRange?.start) {
        query = query.gte('created_at', config.filters.dateRange.start);
      }
      if (config.filters?.dateRange?.end) {
        query = query.lte('created_at', config.filters.dateRange.end);
      }

      // Apply sorting
      if (config.sort) {
        query = query.order(config.sort.field, {
          ascending: config.sort.direction === 'asc'
        });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      if (config.pagination) {
        const { page, pageSize } = config.pagination;
        const start = (page - 1) * pageSize;
        const end = start + pageSize - 1;
        query = query.range(start, end);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching feed content:', error);
      throw error;
    }
  }

  async getFeedStats(): Promise<ContentFeedStats> {
    try {
      const { data, error } = await supabase
        .from('source_content')
        .select('*')
        .eq('workspace_id', this.workspaceId);

      if (error) throw error;

      const stats: ContentFeedStats = {
        totalItems: data.length,
        approvedItems: data.filter(item => item.status === 'approved').length,
        pendingItems: data.filter(item => item.status === 'pending').length,
        averageScore: data.reduce((acc, item) => acc + (item.score || 0), 0) / data.length,
        sourceBreakdown: data.reduce((acc, item) => {
          acc[item.source_id] = (acc[item.source_id] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };

      return stats;
    } catch (error) {
      console.error('Error fetching feed stats:', error);
      throw error;
    }
  }

  async updateContentStatus(contentId: string, status: ContentItem['status']) {
    try {
      const { data, error } = await supabase
        .from('source_content')
        .update({ status })
        .eq('id', contentId)
        .eq('workspace_id', this.workspaceId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating content status:', error);
      throw error;
    }
  }
}
```