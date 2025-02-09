import { useState, useCallback } from 'react';
import { MAX_ITEMS } from '../constants';
import type { RealtimeScore, LearningEvent } from '@/types/scoring';

export function useRealtimeData() {
  const [scores, setScores] = useState<RealtimeScore[]>([]);
  const [events, setEvents] = useState<LearningEvent[]>([]);

  const updateScores = useCallback((newScore: RealtimeScore) => {
    setScores(prev => {
      const updated = [...prev];
      const index = updated.findIndex(s => s.id === newScore.id);
      
      if (index >= 0) {
        updated[index] = newScore;
      } else {
        updated.unshift(newScore);
      }
      
      return updated.slice(0, MAX_ITEMS.SCORES);
    });
  }, []);

  const updateEvents = useCallback((newEvent: LearningEvent) => {
    setEvents(prev => {
      const updated = [newEvent, ...prev];
      return updated.slice(0, MAX_ITEMS.EVENTS);
    });
  }, []);

  return {
    scores,
    events,
    updateScores,
    updateEvents
  };
}