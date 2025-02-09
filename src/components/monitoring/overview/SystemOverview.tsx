import { StatCard } from './StatCard';
import { Activity, RefreshCw, AlertTriangle, Server } from 'lucide-react';
import type { SystemHealth, RecoveryMetrics } from '@/types/monitoring';

interface SystemOverviewProps {
  stats: SystemHealth;
  recoveryMetrics: RecoveryMetrics;
  activeIncidents: any[];
}

export function SystemOverview({ stats, recoveryMetrics, activeIncidents }: SystemOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="System Status"
        value={`${stats.metrics.uptimePercentage}%`}
        description="Uptime last 24h"
        icon={Activity}
      />
      
      <StatCard
        title="Recovery Rate"
        value={`${(recoveryMetrics.successfulRecoveries / 
          (recoveryMetrics.totalIncidents || 1) * 100).toFixed(1)}%`}
        description="Success rate"
        icon={RefreshCw}
      />
      
      <StatCard
        title="Active Incidents"
        value={activeIncidents.length.toString()}
        description="Ongoing issues"
        icon={AlertTriangle}
      />
      
      <StatCard
        title="Avg Recovery Time"
        value={`${recoveryMetrics.avgRecoveryTime.toFixed(1)}s`}
        description="Mean time to recovery"
        icon={Server}
      />
    </div>
  );
}