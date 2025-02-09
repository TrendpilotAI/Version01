import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import type { ContentSource } from '@/types/content';

interface SourceListProps {
  sources: ContentSource[];
  onSourceSelect: (source: ContentSource) => void;
}

export function SourceList({ sources, onSourceSelect }: SourceListProps) {
  return (
    <div className="space-y-4">
      {sources.map((source) => (
        <Card
          key={source.id}
          className="p-4 cursor-pointer hover:bg-accent"
          onClick={() => onSourceSelect(source)}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{source.name}</h3>
              <p className="text-sm text-muted-foreground">{source.url}</p>
              <p className="text-xs text-muted-foreground">
                Last fetched: {source.last_fetched_at
                  ? formatDistanceToNow(new Date(source.last_fetched_at), { addSuffix: true })
                  : 'Never'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={source.is_active ? 'default' : 'secondary'}>
                {source.is_active ? 'Active' : 'Inactive'}
              </Badge>
              <Badge variant={source.health_status === 'active' ? 'default' : 'destructive'}>
                {source.health_status}
              </Badge>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}