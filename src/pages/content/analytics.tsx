tsx
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ReadingAnalytics } from '@/components/news/ReadingAnalytics';

export default function ReadingAnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reading Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track your reading habits and content engagement
          </p>
        </div>

        <ReadingAnalytics />
      </div>
    </DashboardLayout>
  );
}
```