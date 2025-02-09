import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import type { HealthStatus } from '@/types/monitoring';

interface HealthIndicatorProps {
  status: HealthStatus;
  label: string;
}

export function HealthIndicator({ status, label }: HealthIndicatorProps) {
  return (
    <div className="flex items-center space-x-2">
      {status === 'healthy' ? (
        <CheckCircle className="h-5 w-5 text-green-500" />
      ) : status === 'warning' ? (
        <AlertTriangle className="h-5 w-5 text-yellow-500" />
      ) : (
        <AlertTriangle className="h-5 w-5 text-red-500" />
      )}
      <span>{label}</span>
      <Badge 
        variant={status === 'healthy' ? 'success' : status === 'warning' ? 'warning' : 'destructive'}
      >
        {status}
      </Badge>
    </div>
  );
}