typescript
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { ContentItem } from '@/lib/content-feed/types';

interface FeedContentProps {
  content: ContentItem[];
  isLoading: boolean;
  error: Error | null;
  onStatusUpdate: (id: string, status: ContentItem['status']) => void;
}

export function FeedContent({ content, isLoading, error, onStatusUpdate }: FeedContentProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-48 w-full mb-4" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error.message}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {content.map((item) => (
        <Card key={item.id} className="p-4">
          <div className="flex justify-between items-start mb-4">
            <Badge>{item.sourceType}</Badge>
            <Badge variant={getScoreVariant(item.score)}>
              {item.score?.toFixed(1) || 'No score'}
            </Badge>
          </div>

          <h3 className="font-medium mb-2">{item.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {item.content}
          </p>

          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {new Date(item.publishedAt).toLocaleDateString()}
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onStatusUpdate(item.id, 'approved')}
                disabled={item.status === 'approved'}
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onStatusUpdate(item.id, 'rejected')}
                disabled={item.status === 'rejected'}
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function getScoreVariant(score?: number) {
  if (!score) return 'secondary';
  if (score >= 4) return 'success';
  if (score >= 3) return 'default';
  return 'destructive';
}
