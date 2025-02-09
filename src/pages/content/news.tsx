tsx
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { NewsFeed } from '@/components/news/NewsFeed';

export default function NewsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">News Feed</h1>
          <p className="text-muted-foreground mt-1">
            Browse and curate news from multiple sources
          </p>
        </div>

        <NewsFeed />
      </div>
    </DashboardLayout>
  );
}
```