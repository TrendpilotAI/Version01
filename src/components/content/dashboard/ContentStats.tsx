import { Card, CardContent } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Clock, CheckCircle } from 'lucide-react';

interface ContentStats {
  pending: number;
  approved: number;
  rejected: number;
  avgScore: number;
}

export function ContentStats({ stats }: { stats: ContentStats }) {
  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Pending</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{stats.pending}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <h3 className="text-sm font-medium">Approved</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{stats.approved}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <ArrowDown className="h-4 w-4 text-red-500" />
            <h3 className="text-sm font-medium">Rejected</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{stats.rejected}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <ArrowUp className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">Avg Score</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{stats.avgScore.toFixed(1)}</p>
        </CardContent>
      </Card>
    </>
  );
}