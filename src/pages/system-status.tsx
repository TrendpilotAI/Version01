import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Mail, TrendingUp } from 'lucide-react';
import { SystemStatus } from '@/components/monitoring/SystemStatus';
import { ConnectionTest } from '@/components/supabase/ConnectionTest';
import { ConfigurationStatus } from '@/components/config/ConfigurationStatus';
import { FeatureScorecard } from '@/components/analysis/FeatureScorecard';

export default function SystemStatusPage() {
  const stats = {
    newsletters: 0,
    subscribers: 0,
    growth: 0,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">System Status</h1>
          <p className="text-muted-foreground mt-1">
            Monitor system health and performance metrics
          </p>
        </div>

        <SystemStatus />
        <ConfigurationStatus />
        <ConnectionTest />
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Newsletters
              </CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.newsletters}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Subscribers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.subscribers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Growth
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.growth}%</div>
            </CardContent>
          </Card>
        </div>

        <FeatureScorecard />
      </div>
    </DashboardLayout>
  );
}