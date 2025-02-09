import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus } from 'lucide-react';
import { sourceDefinitions } from '@/lib/integrations/airbyte/sourceConfigs';
import { SourceConfigDialog } from './SourceConfigDialog';
import { NewsSourceConfig } from './sources/NewsSourceConfig';
import type { SourceType } from '@/lib/integrations/airbyte/types';

export function SourceCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<SourceType | null>(null);

  const filteredSources = Object.values(sourceDefinitions).filter(source =>
    source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    source.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredSources.map((source) => (
          <Card key={source.id} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{source.icon}</span>
                    <h3 className="font-medium">{source.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {source.description}
                  </p>
                </div>
                <Badge>{source.category}</Badge>
              </div>
              
              <Button
                className="mt-4 w-full"
                onClick={() => setSelectedSource(source)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Source
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <SourceConfigDialog
        source={selectedSource}
        open={!!selectedSource}
        onOpenChange={() => setSelectedSource(null)}
      >
        {selectedSource?.id === 'newsio-source' && (
          <NewsSourceConfig
            sourceType="newsio"
            onConfigured={() => setSelectedSource(null)}
          />
        )}
        {selectedSource?.id === 'newsdata-source' && (
          <NewsSourceConfig
            sourceType="newsdata"
            onConfigured={() => setSelectedSource(null)}
          />
        )}
      </SourceConfigDialog>
    </div>
  );
}