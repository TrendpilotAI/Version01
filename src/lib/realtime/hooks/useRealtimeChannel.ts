import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import { ConnectionError } from '../errors';

export function useRealtimeChannel(
  channelName: string,
  table: string,
  filter: string,
  handler: (payload: any) => void
) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const newChannel = supabase.channel(channelName)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table,
          filter
        }, handler)
        .subscribe((status) => {
          if (status === 'CLOSED') {
            throw new ConnectionError(channelName);
          }
        });

      setChannel(newChannel);

      return () => {
        newChannel.unsubscribe();
      };
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Channel setup failed'));
    }
  }, [channelName, table, filter]);

  return { channel, error };
}