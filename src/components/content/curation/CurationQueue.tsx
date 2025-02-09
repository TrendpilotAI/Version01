import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowUp, 
  ArrowDown, 
  CheckCircle, 
  XCircle,
  Clock
} from 'lucide-react';
import type { SourceContent } from '@/types/content';

export function CurationQueue() {
  const [queue, setQueue] = useState<SourceContent[]>([]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Curation Queue</h2>
          <p className="text-muted-foreground">
            Review and process content in your queue
          </p>
        </div>
        <Button>Process All</Button>
      </div>

      <div className="grid gap-4">
        {queue.map((item, index) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={item.score >= 4 ? 'default' : 'secondary'}>
                    {item.score?.toFixed(1)}
                  </Badge>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" disabled={index === 0}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    disabled={index === queue.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button size="sm" variant="outline">
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}