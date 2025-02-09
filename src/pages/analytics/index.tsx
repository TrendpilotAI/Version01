import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function Analytics() {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">Analytics</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Analytics Disabled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The analytics module is currently disabled. Please contact your administrator for more information.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}