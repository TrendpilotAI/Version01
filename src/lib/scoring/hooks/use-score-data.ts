import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { ScoreBreakdown } from '../types';

interface ScoreData {
  id: string;
  title: string;
  breakdown: ScoreBreakdown;
  date: Date;
}

export function useScoreData(workspaceId: string) {
  const [scores, setScores] = useState<ScoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadScores();
    setupRealtimeSubscription();

    return () => {
      supabase.channel('score_updates').unsubscribe();
    };
  }, [workspaceId]);

  async function loadScores() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('source_content')
        .select('id, title, scoring_details, created_at')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setScores(data.map(item => ({
        id: item.id,
        title: item.title,
        breakdown: item.scoring_details.breakdown,
        date: new Date(item.created_at)
      })));
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  function setupRealtimeSubscription() {
    supabase
      .channel('score_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'source_content',
          filter: `workspace_id=eq.${workspaceId}`
        },
        loadScores
      )
      .subscribe();
  }

  return { scores, loading, error };
}