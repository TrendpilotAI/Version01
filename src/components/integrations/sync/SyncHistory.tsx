import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { AirbyteClient } from '@/lib/airbyte/client';
import type { AirbyteSyncJob } from '@/lib/airbyte/types';

interface SyncHistoryProps {
  connectionId: string;
}

export function SyncHistory({ connectionId }: SyncHistoryProps) {
  const [syncJobs, setSyncJobs] = useState<AirbyteSyncJob[]>([]);
  const [loading, setLoading] = useState(true);
  const client = new AirbyteClient();

  useEffect(() => {
    loadSyncJobs();
  }, [connectionId]);

  const loadSyncJobs = async () => {
    try {
      const jobs = await client.getSyncJobs(connectionId);
      setSyncJobs(jobs);
    } catch (error) {
      console.error('Failed to load sync jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'succeeded':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      case 'running':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sync History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {syncJobs.map((job) => (
              <Card key={job.jobId}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(job.startedAt), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Records Synced</p>
                      <p className="font-medium">{job.recordsSynced.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Data Synced</p>
                      <p className="font-medium">{formatBytes(job.bytesSynced)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Started</p>
                      <p className="font-medium">
                        {new Date(job.startedAt).toLocaleString()}
                      </p>
                    </div>
                    {job.endedAt && (
                      <div>
                        <p className="text-muted-foreground">Ended</p>
                        <p className="font-medium">
                          {new Date(job.endedAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}