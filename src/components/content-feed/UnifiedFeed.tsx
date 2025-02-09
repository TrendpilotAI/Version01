typescript
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { FeedFilters } from './FeedFilters';
import { FeedContent } from './FeedContent';
import { FeedStats } from './FeedStats';
import { useContentFeed } from '@/hooks/useContentFeed';
import type { ContentFeedConfig } from '@/lib/content-feed/types';

interface UnifiedFeedProps {
  workspaceId: string;
}

export function UnifiedFeed({ workspaceId }: UnifiedFeedProps) {
  const [config, setConfig] = useState<ContentFeedConfig>({
    sources: [],
    filters: {
      status: ['pending', 'approved'],
      minScore: 0,
    },
    sort: {
      field: 'created_at',
      direction: 'desc',
    },
    pagination: {
      page: 1,
      pageSize: 20,
    },
  });

  const {
    content,
    stats,
    isLoading,
    error,
    loadContent,
    updateStatus,
  } = useContentFeed(workspaceId, config);

  const handleFilterChange = (newConfig: ContentFeedConfig) => {
    setConfig(newConfig);
    loadContent(newConfig);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats && <FeedStats stats={stats} />}
      </div>

      <Card className="p-6">
        <FeedFilters
          config={config}
          onChange={handleFilterChange}
        />
        
        <div className="mt-6">
          <FeedContent
            content={content}
            isLoading={isLoading}
            error={error}
            onStatusUpdate={updateStatus}
          />
        </div>
      </Card>
    </div>
  );
}
