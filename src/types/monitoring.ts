export type HealthStatus = 'healthy' | 'warning' | 'error';

export interface SystemComponents {
  database: HealthStatus;
  realtime: HealthStatus;
  auth: HealthStatus;
  api: HealthStatus;
}

export interface SystemMetrics {
  responseTime: Array<{ timestamp: string; value: number }>;
  errorRate: Array<{ timestamp: string; value: number }>;
  recoveryRate: Array<{ timestamp: string; value: number }>;
  uptimePercentage: number;
}

export interface SystemHealth {
  overall: HealthStatus;
  components: SystemComponents;
  metrics: SystemMetrics;
}

export interface RecoveryMetrics {
  totalIncidents: number;
  successfulRecoveries: number;
  failedRecoveries: number;
  avgRecoveryTime: number;
}

export interface Incident {
  id: string;
  description: string;
  startTime: string;
  status: 'active' | 'resolved';
  severity: 'critical' | 'warning' | 'info';
}