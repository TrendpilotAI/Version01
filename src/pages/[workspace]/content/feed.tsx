tsx
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { UnifiedFeed } from '@/components/content-feed/UnifiedFeed';
import { useParams } from 'react-router-dom';

export default function ContentFeedPage() {
  const { workspace } = useParams<{ workspace: string }>();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Content Feed</h1>
          <p className="text-muted-foreground mt-1">
            View and manage content from all your sources
          </p>
        </div>

        <UnifiedFeed workspaceId={workspace || 'default'} />
      </div>
    </DashboardLayout>
  );
}
```