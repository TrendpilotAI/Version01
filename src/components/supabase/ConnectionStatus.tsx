import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Database, Wifi, WifiOff } from 'lucide-react';
import { supabase, checkConnection, validateSchema } from '@/lib/supabase';

interface SchemaStatus {
  valid: boolean;
  missingTables: string[];
  existingTables: string[];
}

export function ConnectionStatus() {
  const [status, setStatus] = useState<'connected' | 'disconnected'>('disconnected');
  const [schemaStatus, setSchemaStatus] = useState<SchemaStatus | null>(null);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const checkStatus = async () => {
      try {
        const isConnected = await checkConnection();
        setStatus(isConnected ? 'connected' : 'disconnected');
        
        if (isConnected) {
          const schema = await validateSchema();
          setSchemaStatus(schema);
        }
        
        setLastChecked(new Date());
      } catch (error) {
        console.error('Connection check failed:', error);
        setStatus('disconnected');
      }
    };

    // Initial check
    checkStatus();

    // Check every 30 seconds
    interval = setInterval(checkStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge 
          variant={status === 'connected' ? 'default' : 'destructive'}
          className="flex items-center gap-1"
        >
          {status === 'connected' ? (
            <>
              <Wifi className="h-3 w-3" />
              <span>Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3" />
              <span>Disconnected</span>
            </>
          )}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-xs">
          <div className="font-medium">Database Status</div>
          <div className="text-muted-foreground">
            Last checked: {lastChecked.toLocaleTimeString()}
          </div>
          {schemaStatus && (
            <div className="mt-2">
              <div className="font-medium">Schema Status</div>
              {schemaStatus.valid ? (
                <div className="text-green-500">All required tables present</div>
              ) : (
                <div className="text-yellow-500">
                  Missing tables: {schemaStatus.missingTables.join(', ')}
                </div>
              )}
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}