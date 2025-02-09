import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface BaseChartProps {
  title: string;
  loading?: boolean;
  error?: Error | null;
  children: React.ReactNode;
}

export function BaseChart({ title, loading, error, children }: BaseChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : error ? (
          <div className="h-[300px] flex items-center justify-center text-destructive">
            {error.message}
          </div>
        ) : (
          <div className="h-[300px]">
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
}