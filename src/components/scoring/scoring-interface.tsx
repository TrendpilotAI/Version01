import { useState, useEffect } from 'react';
import { ScoringConfig } from './scoring-config';
import { RecentScores } from './recent-scores';
import { supabase } from '@/lib/supabase';
import type { ScoringCriteria } from './types';

interface ScoringInterfaceProps {
  workspaceId: string;
}

export default function ScoringInterface({ workspaceId }: ScoringInterfaceProps) {
  const [criteria, setCriteria] = useState<ScoringCriteria>({
    novelty: 3,
    impact: 3,
    timeliness: 3,
    actionability: 3
  });

  useEffect(() => {
    loadScoringSettings();
  }, [workspaceId]);

  const loadScoringSettings = async () => {
    const { data } = await supabase
      .from('scoring_settings')
      .select('*')
      .eq('workspace_id', workspaceId)
      .single();

    if (data) {
      setCriteria(data.criteria);
    }
  };

  const updateScoring = async () => {
    await supabase
      .from('scoring_settings')
      .upsert({
        workspace_id: workspaceId,
        criteria,
        updated_at: new Date()
      });
  };

  return (
    <div className="space-y-6">
      <ScoringConfig
        criteria={criteria}
        onCriteriaChange={setCriteria}
        onSave={updateScoring}
      />
      <RecentScores workspaceId={workspaceId} />
    </div>
  );
}