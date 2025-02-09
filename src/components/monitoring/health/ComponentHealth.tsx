import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { HealthIndicator } from './HealthIndicator';
import type { SystemComponents } from '@/types/monitoring';

interface ComponentHealthProps {
  components: SystemComponents;
}

export function ComponentHealth({ components }: ComponentHealthProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Component Health</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <HealthIndicator 
                status={components.database} 
                label="Database Connection" 
              />
              <HealthIndicator 
                status={components.realtime} 
                label="Real-time Sync" 
              />
            </div>
            <div className="space-y-2">
              <HealthIndicator 
                status={components.auth} 
                label="Authentication" 
              />
              <HealthIndicator 
                status={components.api} 
                label="API Services" 
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}