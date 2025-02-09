import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { SystemHealth, RecoveryMetrics, Incident } from '@/types/monitoring';

export function useSystemHealth(workspaceId: string) {
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    overall: 'healthy',
    components: {
      database: 'healthy',
      realtime: 'healthy',
      auth: 'healthy',
      api: 'healthy'
    },
    metrics: {
      responseTime: [],
      errorRate: [],
      recoveryRate: [],
      uptimePercentage: 99.9
    }
  });

  const [recoveryMetrics, setRecoveryMetrics] = useState<RecoveryMetrics>({
    totalIncidents: 0,
    successfulRecoveries: 0,
    failedRecoveries: 0,
    avgRecoveryTime: 0
  });

  const [activeIncidents, setActiveIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    // Set up realtime subscription for system health updates
    const healthChannel = supabase.channel('system_health')
      .on('broadcast', { event: 'health_update' }, payload => {
        setSystemHealth(payload.health);
      })
      .subscribe();

    // Set up subscription for incidents
    const incidentChannel = supabase.channel('incidents')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'incidents',
        filter: `workspace_id=eq.${workspaceId}`
      }, payload => {
        // Update incidents based on changes
        if (payload.eventType === 'INSERT') {
          setActiveIncidents(prev => [...prev, payload.new]);
        } else if (payload.eventType === 'UPDATE') {
          setActiveIncidents(prev => 
            prev.map(incident => 
              incident.id === payload.new.id ? payload.new : incident
            )
          );
        }
      })
      .subscribe();

    return () => {
      healthChannel.unsubscribe();
      incidentChannel.unsubscribe();
    };
  }, [workspaceId]);

  return {
    systemHealth,
    recoveryMetrics,
    activeIncidents
  };
}