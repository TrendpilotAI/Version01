import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Database, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { checkConnection, validateSchema } from '@/lib/supabase';

export function ConnectionTest() {
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<'untested' | 'success' | 'error'>('untested');
  const { toast } = useToast();

  const testConnection = async () => {
    setTesting(true);
    try {
      const result = await testSupabaseConnection();
      if (!result.success) {
        throw new Error(result.message);
      }

      setStatus('success');
      toast({
        title: 'Connection Successful',
        description: result.message,
      });
    } catch (error) {
      setStatus('error');
      toast({
        title: 'Connection Failed',
        description: error instanceof Error ? error.message : 'Failed to connect to database',
        variant: 'destructive',
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Connection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {status === 'untested' ? (
              <Badge variant="secondary">Not Tested</Badge>
            ) : status === 'success' ? (
              <Badge className="bg-green-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            ) : (
              <Badge variant="destructive">
                <XCircle className="h-3 w-3 mr-1" />
                Error
              </Badge>
            )}
          </div>
          <Button 
            variant="outline" 
            onClick={testConnection}
            disabled={testing}
          >
            {testing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              'Test Connection'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}