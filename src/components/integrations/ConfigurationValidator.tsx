import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { validateConfig } from '@/lib/config-validator';

export function ConfigurationValidator() {
  const [results, setResults] = useState<ReturnType<typeof validateConfig> | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const validate = async () => {
    setLoading(true);
    try {
      const validationResults = validateConfig();
      setResults(validationResults);
      
      if (validationResults.valid) {
        toast({
          title: 'Configuration Valid',
          description: 'All required services are properly configured'
        });
      } else {
        toast({
          title: 'Configuration Issues Found',
          description: 'Some services require configuration',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Validation failed:', error);
      toast({
        title: 'Validation Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validate();
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Configuration Validation</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={validate}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Validate
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {results && (
          <div className="space-y-4">
            {Object.entries(results.services).map(([service, status]) => (
              <div key={service} className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium capitalize">{service}</h3>
                  {status.message && (
                    <p className="text-sm text-muted-foreground">
                      {status.message}
                    </p>
                  )}
                </div>
                <Badge 
                  variant={status.configured ? 'default' : 'destructive'}
                  className="flex items-center gap-1"
                >
                  {status.configured ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  {status.configured ? 'Valid' : 'Invalid'}
                </Badge>
              </div>
            ))}

            {results.environment.isDev && (
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Environment: {results.environment.mode}</p>
                  <p>Development Mode: {results.environment.isDev ? 'Yes' : 'No'}</p>
                  <p>Production Mode: {results.environment.isProd ? 'Yes' : 'No'}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}