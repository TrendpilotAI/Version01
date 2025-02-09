import { SystemOverview } from './overview/SystemOverview';
import { ComponentHealth } from './health/ComponentHealth';
import { PerformanceMetrics } from './metrics/PerformanceMetrics';
import { useSystemHealth } from '@/hooks/useSystemHealth';

interface SystemMonitoringDashboardProps {
  workspaceId: string;
}

export default function SystemMonitoringDashboard({ workspaceId }: SystemMonitoringDashboardProps) {
  const { 
    systemHealth, 
    recoveryMetrics, 
    activeIncidents 
  } = useSystemHealth(workspaceId);

  return (
    <div className="space-y-6 p-6">
      <SystemOverview 
        stats={systemHealth} 
        recoveryMetrics={recoveryMetrics} 
        activeIncidents={activeIncidents} 
      />
      
      <ComponentHealth components={systemHealth.components} />
      
      <PerformanceMetrics data={systemHealth.metrics.responseTime} />
    </div>
  );
}