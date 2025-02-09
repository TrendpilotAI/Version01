import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SourceManager } from './SourceManager';
import { ContentCuration } from './ContentCuration';
import { ScoringConfig } from './ScoringConfig';
import { Distribution } from './Distribution';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import type { ContentSource, SourceContent } from '@/types/content';

export function Dashboard() {
  const [selectedSource, setSelectedSource] = useState<ContentSource | null>(null);
  const [realtimeContent, setRealtimeContent] = useState<SourceContent[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Set up realtime subscription for content updates
    const subscription = supabase
      .channel('content_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'source_content',
        },
        (payload) => {
          setRealtimeContent((current) => {
            const updated = [...current];
            const index = updated.findIndex((item) => item.id === payload.new.id);
            
            if (index !== -1) {
              updated[index] = payload.new as SourceContent;
            } else {
              updated.push(payload.new as SourceContent);
            }
            
            return updated;
          });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="curation">
        <TabsList>
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="curation">Curation</TabsTrigger>
          <TabsTrigger value="scoring">Scoring</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="sources">
          <SourceManager
            selectedSource={selectedSource}
            onSourceSelect={setSelectedSource}
          />
        </TabsContent>

        <TabsContent value="curation">
          <ContentCuration
            selectedSource={selectedSource}
            content={realtimeContent}
          />
        </TabsContent>

        <TabsContent value="scoring">
          <ScoringConfig />
        </TabsContent>

        <TabsContent value="distribution">
          <Distribution content={realtimeContent} />
        </TabsContent>
      </Tabs>
    </div>
  );
}