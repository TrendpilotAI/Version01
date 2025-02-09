import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, CheckCircle, Clock, BarChart2 } from 'lucide-react';

export function MetricsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Content Score</h3>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold">4.2</div>
            <p className="text-xs text-muted-foreground">+0.3 from last week</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Approved</h3>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Pending</h3>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">Needs review</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Engagement</h3>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">Average rate</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}