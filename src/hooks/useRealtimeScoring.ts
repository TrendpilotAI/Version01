import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { createRealtimeManager } from '@/lib/realtime/RealtimeManager';
import { CHANNELS } from '@/lib/realtime/constants';
import type { RealtimeScore, LearningEvent } from '@/types/scoring';

export function useRealtimeScoring(workspaceId: string) {
  const [scores, setScores] = useState<RealtimeScore[]>([]);
  const [events, setEvents] = useState<LearningEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const manager = createRealtimeManager(workspaceId, {
      errorConfig: {
        maxRetries: 3,
        retryDelay: 2000,
      }
    });

    // Setup score updates channel
    manager.setupChannel(CHANNELS.SCORES, (payload: any) => {
      const { new: newScore } = payload;
      setScores(prev => {
        const updated = [...prev];
        const index = updated.findIndex(s => s.id === newScore.id);
        
        if (index >= 0) {
          updated[index] = newScore;
        } else {
          updated.unshift(newScore);
        }
        
        return updated.slice(0, 50);
      });

      // Notify on significant changes
      if (payload.old && Math.abs(newScore.score - payload.old.score) > 1) {
        toast({
          title: "Significant Score Change",
          description: `Content score changed from ${payload.old.score} to ${newScore.score}`,
        });
      }
    });

    // Setup learning events channel
    manager.setupChannel(CHANNELS.LEARNING, (payload: any) => {
      const { new: event } = payload;
      setEvents(prev => {
        const updated = [event, ...prev];
        return updated.slice(0, 10);
      });

      toast({
        title: "Learning Event",
        description: `System learned from ${event.action_type} action`,
      });
    });

    setIsConnected(true);

    return () => {
      manager.cleanup();
    };
  }, [workspaceId]);

  return {
    scores,
    events,
    isConnected,
  };
}