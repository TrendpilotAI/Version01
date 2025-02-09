import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SyncMonitor } from './SyncMonitor';
import { SyncHistory } from './SyncHistory';
import { SyncLogs } from './SyncLogs';

interface SyncDashboardProps {
  connectionId: string;
}

export function SyncDashboard({ connectionId }: SyncDashboardProps) {
  const [activeTab, setActiveTab] = useState('monitor');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Sync Dashboard</h2>
        <p className="text-muted-foreground">
          Monitor and manage your content synchronization
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="monitor">Monitor</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="monitor">
          <SyncMonitor connectionId={connectionId} />
        </TabsContent>

        <TabsContent value="history">
          <SyncHistory connectionId={connectionId} />
        </TabsContent>

        <TabsContent value="logs">
          <SyncLogs connectionId={connectionId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}