import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  metadata?: Record<string, any>;
}

interface SyncLogsProps {
  connectionId: string;
}

export function SyncLogs({ connectionId }: SyncLogsProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadLogs();
  }, [connectionId]);

  const loadLogs = async () => {
    try {
      // Load logs logic will be implemented
      setLogs([
        {
          timestamp: new Date().toISOString(),
          level: 'info',
          message: 'Starting sync process',
        },
        {
          timestamp: new Date().toISOString(),
          level: 'info',
          message: 'Connected to source',
          metadata: { source: 'newsapi' }
        },
        {
          timestamp: new Date().toISOString(),
          level: 'warn',
          message: 'Rate limit approaching',
          metadata: { remaining: 100 }
        }
      ]);
    } catch (error) {
      console.error('Failed to load logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportLogs = async () => {
    try {
      const logText = logs.map(log => 
        `[${log.timestamp}] ${log.level.toUpperCase()}: ${log.message}${
          log.metadata ? ` ${JSON.stringify(log.metadata)}` : ''
        }`
      ).join('\n');

      const blob = new Blob([logText], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sync-logs-${connectionId}-${new Date().toISOString()}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Logs exported',
        description: 'Sync logs have been downloaded successfully'
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: error instanceof Error ? error.message : 'Failed to export logs',
        variant: 'destructive'
      });
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'bg-red-500';
      case 'warn':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Sync Logs</CardTitle>
          <Button variant="outline" size="sm" onClick={handleExportLogs}>
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {logs.map((log, index) => (
              <div
                key={index}
                className="p-2 rounded bg-muted/50 font-mono text-sm"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={getLevelColor(log.level)}>
                    {log.level.toUpperCase()}
                  </Badge>
                  <span className="text-muted-foreground">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <p>{log.message}</p>
                {log.metadata && (
                  <pre className="mt-1 text-xs text-muted-foreground">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}