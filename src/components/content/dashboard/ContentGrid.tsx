import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ContentGridProps {
  content: any[];
  isLoading: boolean;
}

export function ContentGrid({ content, isLoading }: ContentGridProps) {
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

  return (
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
          <div className="flex items-center justify-between">
            <Badge variant={getScoreVariant(item.score)}>
              {item.score?.toFixed(1) || 'No score'}
            </Badge>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {/* TODO: Approve content */}}
                disabled={item.status === 'approved'}
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {/* TODO: Reject content */}}
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

function getScoreVariant(score: number) {
  if (!score) return 'secondary';
  if (score >= 4) return 'success';
  if (score >= 3) return 'default';
  return 'destructive';
}