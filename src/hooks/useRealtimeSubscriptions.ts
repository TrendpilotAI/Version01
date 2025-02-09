import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { validateScore, validateLearningEvent } from '@/lib/realtime/validators';
import { ValidationError, ConnectionError } from '@/lib/realtime/errors';
import type { RealtimeScore, LearningEvent } from '@/types/scoring';

export function useRealtimeSubscriptions(workspaceId: string) {
  const [realtimeScores, setRealtimeScores] = useState<RealtimeScore[]>([]);
  const [learningEvents, setLearningEvents] = useState<LearningEvent[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 2000;

    const setupSubscription = async () => {
      try {
        // Check connection first
        const isConnected = await supabase.realtime.getInitialStatus();
        if (isConnected !== 'connected') {
          throw new ConnectionError('realtime');
        }

        const scoreChannel = supabase.channel('score-changes')
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'source_content',
            filter: `workspace_id=eq.${workspaceId}`
          }, handleScoreChange)
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              console.log('Connected to score changes');
              retryCount = 0; // Reset retry count on successful connection
            } else if (status === 'CLOSED' && retryCount < maxRetries) {
              retryCount++;
              setTimeout(setupSubscription, retryDelay * Math.pow(2, retryCount));
            } else if (status === 'CLOSED') {
              throw new ConnectionError('score-changes');
            }
          });

        const learningChannel = supabase.channel('learning-events')
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'user_actions',
            filter: `workspace_id=eq.${workspaceId}`
          }, handleLearningEvent)
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              console.log('Connected to learning events');
            } else if (status === 'CLOSED' && retryCount < maxRetries) {
              retryCount++;
              setTimeout(setupSubscription, retryDelay * Math.pow(2, retryCount));
            } else if (status === 'CLOSED') {
              throw new ConnectionError('learning-events');
            }
          });

        return () => {
          scoreChannel.unsubscribe();
          learningChannel.unsubscribe();
        };
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to setup subscriptions'));
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(setupSubscription, retryDelay * Math.pow(2, retryCount));
        } else {
          toast({
            title: 'Connection Error',
            description: 'Failed to connect to realtime updates. Please refresh the page.',
            variant: 'destructive',
          });
        }
      }
    };

    setupSubscription();
  }, [workspaceId, toast]);

  const handleScoreChange = async (payload: any) => {
    try {
      const { new: newScore, old: oldScore } = payload;
      
      if (!validateScore(newScore)) {
        throw new ValidationError('score-change', 'Invalid score data received');
      }
      
      setRealtimeScores(prev => {
        const updated = [...prev];
        const index = updated.findIndex(s => s.id === newScore.id);
        
        if (index >= 0) {
          updated[index] = newScore;
        } else {
          updated.unshift(newScore);
        }
        
        return updated.slice(0, 50);
      });

      if (oldScore && Math.abs(newScore.score - oldScore.score) > 1) {
        toast({
          title: "Significant Score Change",
          description: `Content score changed from ${oldScore.score} to ${newScore.score}`,
        });
      }
    } catch (err) {
      console.error('Error handling score change:', err);
    }
  };

  const handleLearningEvent = async (payload: any) => {
    try {
      const { new: event } = payload;
      
      if (!validateLearningEvent(event)) {
        throw new ValidationError('learning-event', 'Invalid learning event data');
      }
      
      setLearningEvents(prev => {
        const updated = [event, ...prev];
        return updated.slice(0, 10);
      });

      toast({
        title: "Learning Event",
        description: `System learned from ${event.action_type} action`,
      });
    } catch (err) {
      console.error('Error handling learning event:', err);
    }
  };

  return { realtimeScores, learningEvents, error };
}