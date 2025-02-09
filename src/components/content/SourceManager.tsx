import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Activity } from 'lucide-react';
import { getContentSources } from '@/lib/api/content';
import type { ContentSource } from '@/types/content';

interface SourceManagerProps {
  selectedSource: ContentSource | null;
  onSourceSelect: (source: ContentSource) => void;
}

export function SourceManager({ selectedSource, onSourceSelect }: SourceManagerProps) {
  const [sources, setSources] = useState<ContentSource[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadSources();
  }, []);

  async function loadSources() {
    const data = await getContentSources('default-workspace-id');
    setSources(data);
    
    // Extract unique categories
    const uniqueCategories = [...new Set(data.map(source => source.category))];
    setCategories(uniqueCategories);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Content Sources</h2>
          <p className="text-muted-foreground">
            Manage and monitor your content sources
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sources.map((source) => (
          <Card
            key={source.id}
            className={`p-4 cursor-pointer transition-colors ${
              selectedSource?.id === source.id ? 'border-primary' : ''
            }`}
            onClick={() => onSourceSelect(source)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium">{source.name}</h3>
                <p className="text-sm text-muted-foreground">{source.url}</p>
              </div>
              <Switch
                checked={source.is_active}
                onCheckedChange={() => {/* TODO: Toggle source active state */}}
              />
            </div>

            <div className="flex items-center justify-between">
              <Badge>{source.category}</Badge>
              <div className="flex items-center space-x-1">
                <Activity className="h-4 w-4" />
                <span className={`text-sm ${
                  source.health_status === 'active' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {source.health_status}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}