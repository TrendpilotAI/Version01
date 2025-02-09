import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings2, Trash2, RefreshCw } from 'lucide-react';
import { sourceDefinitions } from '@/lib/airbyte/sourceDefinitions';
import type { AirbyteSource } from '@/lib/airbyte/types';

interface SourceListProps {
  sources: AirbyteSource[];
  onDelete: (sourceId: string) => void;
  onRefresh: (sourceId: string) => void;
  onConfigure: (sourceId: string) => void;
}

export function SourceList({ sources, onDelete, onRefresh, onConfigure }: SourceListProps) {
  return (
    <div className="space-y-4">
      {sources.map((source) => {
        const definition = sourceDefinitions[source.sourceDefinitionId];
        
        return (
          <Card key={source.sourceId} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{definition?.icon || '📦'}</span>
                  <div>
                    <h3 className="font-medium">{source.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {definition?.description || 'Custom source'}
                    </p>
                  </div>
                </div>
                <Badge>
                  {definition?.category || 'custom'}
                </Badge>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRefresh(source.sourceId)}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onConfigure(source.sourceId)}
                >
                  <Settings2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(source.sourceId)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}