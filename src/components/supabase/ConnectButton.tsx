import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { checkConnection, validateSchema } from '@/lib/supabase';
import { Database, Loader2 } from 'lucide-react';

export function ConnectButton() {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        throw new Error('Please configure your Supabase URL and anonymous key in the environment variables.');
      }
      
      // Test connection
      const isConnected = await checkConnection();
      if (!isConnected) {
        throw new Error('Failed to connect to database');
      }

      // Validate schema
      const schema = await validateSchema();
      
      if (!schema.valid) {
        toast({
          title: 'Schema Validation Warning',
          description: `Missing tables: ${schema.missingTables.join(', ')}`,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Connected to Supabase',
        description: 'Database connection and schema validation successful',
      });
    } catch (error) {
      toast({
        title: 'Connection Error',
        description: error instanceof Error ? error.message : 'Failed to connect to Supabase',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Button 
      onClick={handleConnect}
      className="bg-[#3ECF8E] hover:bg-[#3ECF8E]/90 text-white"
      disabled={isConnecting}
    >
      {isConnecting ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Database className="mr-2 h-4 w-4" />
      )}
      {isConnecting ? 'Connecting...' : 'Connect to Supabase'}
    </Button>
  );
}