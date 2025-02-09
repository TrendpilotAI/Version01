import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { LearningEvent } from '@/types/scoring';

interface LearningEventsProps {
  events: LearningEvent[];
}

export const LearningEvents: React.FC<LearningEventsProps> = ({ events }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Learning Events</span>
          <Badge>{events.length} Events</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {events.map((event) => (
            <div 
              key={event.id}
              className="flex justify-between items-center p-2 bg-gray-50 rounded"
            >
              <span className="capitalize">{event.action_type}</span>
              <span className="text-sm text-gray-500">
                {new Date(event.created_at).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};