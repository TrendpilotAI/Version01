typescript
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ContentFeedManager } from '@/lib/content-feed/ContentFeedManager';
import type { ContentItem, ContentFeedConfig, ContentFeedStats } from '@/lib/content-feed/types';

export function useContentFeed(workspaceId: string, initialConfig: ContentFeedConfig) {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [stats, setStats] = useState<ContentFeedStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const feedManager = new ContentFeedManager(workspaceId);

  useEffect(() => {
    loadContent(initialConfig);
    loadStats();
  }, [workspaceId]);

  const loadContent = async (config: ContentFeedConfig) => {
    setIsLoading(true);
    try {
      const items = await feedManager.getFeedContent(config);
      setContent(items);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load content'));
      toast({
        title: 'Error loading content',
        description: 'Failed to load content feed',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const feedStats = await feedManager.getFeedStats();
      setStats(feedStats);
    } catch (err) {
      console.error('Error loading feed stats:', err);
    }
  };

  const updateStatus = async (contentId: string, status: ContentItem['status']) => {
    try {
      await feedManager.updateContentStatus(contentId, status);
      
      // Update local state
      setContent(prev => prev.map(item => 
        item.id === contentId ? { ...item, status } : item
      ));
      
      // Refresh stats
      loadStats();

      toast({
        title: 'Status updated',
        description: `Content ${status} successfully`,
      });
    } catch (err) {
      toast({
        title: 'Error updating status',
        description: 'Failed to update content status',
        variant: 'destructive',
      });
    }
  };

  return {
    content,
    stats,
    isLoading,
    error,
    loadContent,
    updateStatus,
  };
}
```