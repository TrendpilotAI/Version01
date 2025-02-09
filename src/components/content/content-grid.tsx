import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, ExternalLink, Loader2 } from 'lucide-react';
import type { SourceContent } from '@/types/content';

interface ContentGridProps {
  content: SourceContent[];
  loading?: boolean;
  onStatusUpdate: (id: string, status: 'approved' | 'rejected') => Promise<void>;
}

export function ContentGrid({ content, loading, onStatusUpdate }: ContentGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-4 space-y-4">
            <div className="h-48 bg-muted animate-pulse rounded-md" />
            <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
          </Card>
        ))}
      </div>
    );
  }

  if (content.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No content available</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {content.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          {item.image_url && (
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Badge variant={getScoreVariant(item.score)}>
                Score: {item.score?.toFixed(1) || 'N/A'}
              </Badge>
              <Badge variant={getStatusVariant(item.status)}>
                {item.status}
              </Badge>
            </div>
            <h3 className="font-medium mb-2 line-clamp-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
              {item.description}
            </p>
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(item.url, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Source
              </Button>
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
          </div>
        </Card>
      ))}
    </div>
  );
}

function getScoreVariant(score: number | null) {
  if (!score) return 'secondary';
  if (score >= 4) return 'success';
  if (score >= 3) return 'default';
  return 'destructive';
}

function getStatusVariant(status: string) {
  switch (status) {
    case 'approved':
      return 'success';
    case 'rejected':
      return 'destructive';
    default:
      return 'secondary';
  }
}