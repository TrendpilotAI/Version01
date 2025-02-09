import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSourceIntegration } from '@/hooks/useSourceIntegration';

export function ConnectionManager() {
  const { sources, setupSync, isLoading } = useSourceIntegration('default-workspace-id');

  const handleSync = async (sourceId: string) => {
    try {
      await setupSync(sourceId, 'default-destination');
    } catch (error) {
      console.error('Failed to setup sync:', error);
    }
  };

  return (
    <div className="space-y-4">
      {sources.map((source) => (
        <Card key={source.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{source.name}</CardTitle>
              <Badge variant={source.isConnected ? 'default' : 'secondary'}>
                {source.isConnected ? 'Connected' : 'Not Connected'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Last synced: {source.lastSyncedAt ? new Date(source.lastSyncedAt).toLocaleString() : 'Never'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Status: {source.status}
                </p>
              </div>
              <Button
                onClick={() => handleSync(source.id)}
                disabled={isLoading || source.isConnected}
              >
                {source.isConnected ? 'Syncing...' : 'Start Sync'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}