import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import type { Incident } from '@/types/monitoring';

interface IncidentTimelineProps {
  incidents: Incident[];
}

export function IncidentTimeline({ incidents }: IncidentTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Incident Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
          <div className="space-y-6">
            {incidents.map((incident) => (
              <div key={incident.id} className="relative pl-8">
                <div className="absolute left-2.5 top-2 w-3 h-3 rounded-full bg-primary" />
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-medium">{incident.description}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(incident.startTime))} ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}