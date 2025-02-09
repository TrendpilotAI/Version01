import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { AirbyteClient } from '@/lib/airbyte/client';
import type { AirbyteSyncJob } from '@/lib/airbyte/types';

interface SyncMonitorProps {
  connectionId: string;
}

export function SyncMonitor({ connectionId }: SyncMonitorProps) {
  const [currentJob, setCurrentJob] = useState<AirbyteSyncJob | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const { toast } = useToast();
  const client = new AirbyteClient();

  useEffect(() => {
    if (isPolling) {
      const interval = setInterval(pollSyncStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [isPolling, connectionId]);

  const pollSyncStatus = async () => {
    try {
      const jobs = await client.getSyncJobs(connectionId);
      const latestJob = jobs[0];
      
      if (latestJob?.status === 'running') {
        setCurrentJob(latestJob);
      } else {
        setIsPolling(false);
        setCurrentJob(null);
      }
    } catch (error) {
      console.error('Failed to poll sync status:', error);
      setIsPolling(false);
    }
  };

  const handleStartSync = async () => {
    try {
      // Start sync logic will be implemented
      setIsPolling(true);
      toast({
        title: 'Sync started',
        description: 'Content sync has been initiated'
      });
    } catch (error) {
      toast({
        title: 'Failed to start sync',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      });
    }
  };

  const handleStopSync = async () => {
    try {
      // Stop sync logic will be implemented
      setIsPolling(false);
      toast({
        title: 'Sync stopped',
        description: 'Content sync has been stopped'
      });
    } catch (error) {
      toast({
        title: 'Failed to stop sync',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Sync Status</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={currentJob ? handleStopSync : handleStartSync}
            >
              {currentJob ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Stop Sync
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Sync
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={pollSyncStatus}
              disabled={isPolling}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {currentJob ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Badge>Syncing</Badge>
              <span className="text-sm text-muted-foreground">
                Started {new Date(currentJob.startedAt).toLocaleString()}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{currentJob.recordsSynced.toLocaleString()} records</span>
              </div>
              <Progress value={75} /> {/* TODO: Calculate actual progress */}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Data Synced</p>
                <p className="font-medium">{formatBytes(currentJob.bytesSynced)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Sync Duration</p>
                <p className="font-medium">
                  {formatDuration(new Date(currentJob.startedAt))}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No active sync
          </div>
        )}
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

function formatDuration(startTime: Date): string {
  const duration = Date.now() - startTime.getTime();
  const minutes = Math.floor(duration / 60000);
  const seconds = Math.floor((duration % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}