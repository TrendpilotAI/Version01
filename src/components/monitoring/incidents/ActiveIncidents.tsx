import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Incident } from '@/types/monitoring';

interface ActiveIncidentsProps {
  incidents: Incident[];
}

export function ActiveIncidents({ incidents }: ActiveIncidentsProps) {
  const getIcon = (severity: Incident['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Incidents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {incidents.map((incident) => (
            <Alert 
              key={incident.id}
              variant={incident.severity === 'critical' ? 'destructive' : 'default'}
            >
              {getIcon(incident.severity)}
              <AlertDescription>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{incident.description}</p>
                    <p className="text-sm text-muted-foreground">
                      Started {formatDistanceToNow(new Date(incident.startTime))} ago
                    </p>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}