import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <Card className="p-6 max-w-md mx-auto mt-12">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Something went wrong</h2>
        <pre className="text-sm bg-muted p-4 rounded overflow-auto">
          {error.message}
        </pre>
        <Button onClick={resetErrorBoundary}>Try again</Button>
      </div>
    </Card>
  );
}

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
}