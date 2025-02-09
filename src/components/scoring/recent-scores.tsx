import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScoreChart } from './score-chart';
import { ScoreList } from './score-list';
import { supabase } from '@/lib/supabase';
import type { ScoreBreakdown } from '@/lib/scoring/types';

interface RecentScoresProps {
  workspaceId: string;
}

export function RecentScores({ workspaceId }: RecentScoresProps) {
  const [scores, setScores] = useState<Array<{
    id: string;
    title: string;
    breakdown: ScoreBreakdown;
  }>>([]);

  useEffect(() => {
    loadRecentScores();
  }, [workspaceId]);

  const loadRecentScores = async () => {
    const { data } = await supabase
      .from('source_content')
      .select('id, title, score, scoring_details')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) {
      setScores(data.map(item => ({
        id: item.id,
        title: item.title,
        breakdown: item.scoring_details.breakdown
      })));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Content Scores</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart">
          <TabsList>
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
          <TabsContent value="chart">
            <ScoreChart scores={scores.map(s => s.breakdown)} />
          </TabsContent>
          <TabsContent value="list">
            <ScoreList scores={scores} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}