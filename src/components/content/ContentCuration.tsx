import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart2,
  ThumbsUp,
  ThumbsDown,
  Share2,
} from 'lucide-react';
import type { ContentSource, SourceContent } from '@/types/content';

interface ContentCurationProps {
  selectedSource: ContentSource | null;
  content: SourceContent[];
}

export function ContentCuration({ selectedSource, content }: ContentCurationProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Content Curation</h2>
          {selectedSource && (
            <p className="text-muted-foreground">
              Curating content from {selectedSource.name}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {content.map((item) => (
          <Card key={item.id} className="p-4">
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            )}
            
            <h3 className="font-medium mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {item.description}
            </p>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <BarChart2 className="h-4 w-4" />
                <span className="font-medium">
                  {item.score?.toFixed(1) || 'N/A'}
                </span>
              </div>
              <Badge variant={item.status === 'approved' ? 'default' : 'secondary'}>
                {item.status}
              </Badge>
            </div>

            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => {/* TODO: Approve content */}}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => {/* TODO: Reject content */}}
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {/* TODO: Share content */}}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}