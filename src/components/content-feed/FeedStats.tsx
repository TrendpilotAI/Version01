tsx
import { Card } from '@/components/ui/card';
import { Activity, CheckCircle, Clock, BarChart2 } from 'lucide-react';
import type { ContentFeedStats } from '@/lib/content-feed/types';

interface FeedStatsProps {
  stats: ContentFeedStats;
}

export function FeedStats({ stats }: FeedStatsProps) {
  return (
    <>
      <Card className="p-6">
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Total Content</h3>
        </div>
        <p className="text-2xl font-bold mt-2">{stats.totalItems}</p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <h3 className="text-sm font-medium">Approved</h3>
        </div>
        <p className="text-2xl font-bold mt-2">{stats.approvedItems}</p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-yellow-500" />
          <h3 className="text-sm font-medium">Pending</h3>
        </div>
        <p className="text-2xl font-bold mt-2">{stats.pendingItems}</p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-2">
          <BarChart2 className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">Avg Score</h3>
        </div>
        <p className="text-2xl font-bold mt-2">
          {stats.averageScore.toFixed(1)}
        </p>
      </Card>
    </>
  );
}
