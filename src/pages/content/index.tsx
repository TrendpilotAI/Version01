import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { SourceList } from '@/components/content/source-list';
import { ContentGrid } from '@/components/content/content-grid';
import { ScoringForm } from '@/components/content/scoring-form';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import {
  getContentSources,
  getSourceContent,
  updateContentStatus,
  getScoringSettings,
  fetchInitialContent,
  updateScoringSettings,
} from '@/lib/api/content';
import type { ContentSource, SourceContent, ScoringSettings } from '@/types/content';
import { useToast } from '@/components/ui/use-toast';

export default function ContentCuration() {
  const [sources, setSources] = useState<ContentSource[]>([]);
  const [selectedSource, setSelectedSource] = useState<ContentSource | null>(null);
  const [content, setContent] = useState<SourceContent[]>([]);
  const [scoringSettings, setScoringSettings] = useState<ScoringSettings | null>(null);
  const [loading, setLoading] = useState({
    sources: true,
    content: false,
    fetching: false
  });
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(prev => ({ ...prev, sources: true }));
        const sourcesData = await getContentSources('default-workspace-id');
        setSources(sourcesData);

        const settings = await getScoringSettings('default-workspace-id');
        setScoringSettings(settings);
      } catch (error) {
        console.error('Failed to load initial data:', error);
        toast({
          title: 'Error loading sources',
          description: error instanceof Error ? error.message : 'Failed to load content sources',
          variant: 'destructive'
        });
      } finally {
        setLoading(prev => ({ ...prev, sources: false }));
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    if (selectedSource) {
      loadSourceContent(selectedSource.id);
    }
  }, [selectedSource]);

  async function loadSourceContent(sourceId: string) {
    try {
      setLoading(prev => ({ ...prev, content: true }));
      const contentData = await getSourceContent(sourceId);
      setContent(contentData);
    } catch (error) {
      console.error('Failed to load content:', error);
      toast({
        title: 'Error loading content',
        description: error instanceof Error ? error.message : 'Failed to load source content',
        variant: 'destructive'
      });
    } finally {
      setLoading(prev => ({ ...prev, content: false }));
    }
  }

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateContentStatus(id, status);
      if (selectedSource) {
        loadSourceContent(selectedSource.id);
      }
      toast({ title: 'Content status updated' });
    } catch (error) {
      toast({
        title: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const handleScoringUpdate = async (criteria: ScoringSettings['criteria']) => {
    try {
      await updateScoringSettings('default-workspace-id', criteria);
      toast({ title: 'Scoring settings updated' });
    } catch (error) {
      toast({
        title: 'Failed to update scoring settings',
        variant: 'destructive',
      });
    }
  };

  const handleFetchInitialContent = async () => {
    try {
      setLoading(prev => ({ ...prev, fetching: true }));
      const count = await fetchInitialContent('default-workspace-id');
      toast({
        title: 'Content fetched successfully',
        description: `${count} articles have been imported`
      });
      // Reload sources and content
      const sourcesData = await getContentSources('default-workspace-id');
      setSources(sourcesData);
      if (sourcesData.length > 0) {
        await loadSourceContent(sourcesData[0].id);
      }
    } catch (error) {
      toast({
        title: 'Failed to fetch content',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      });
    } finally {
      setLoading(prev => ({ ...prev, fetching: false }));
    }
  };
  if (sources.length === 0 && !loading.sources) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">Content Curation</h2>
              <p className="text-muted-foreground mt-1">
                Get started by adding content sources or fetching initial content
              </p>
            </div>
          </div>
          
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">No Content Sources Found</h3>
              <p className="text-muted-foreground max-w-sm">
                Start by fetching some initial content or adding your first content source
              </p>
              <div className="flex gap-4">
                <Button onClick={handleFetchInitialContent} disabled={loading.fetching}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading.fetching ? 'animate-spin' : ''}`} />
                  {loading.fetching ? 'Fetching...' : 'Fetch Initial Content'}
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Source Manually
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Content Source</DialogTitle>
                    </DialogHeader>
                    {/* TODO: Add source form */}
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold">Content Curation</h2>
            <p className="text-muted-foreground mt-1">
              Discover, evaluate, and curate content for your audience
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={handleFetchInitialContent}
              disabled={loading.fetching}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading.fetching ? 'animate-spin' : ''}`} />
              {loading.fetching ? 'Fetching...' : 'Fetch Content'}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Source
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Content Source</DialogTitle>
                </DialogHeader>
                {/* TODO: Add source form */}
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Sources</h3>
              <Badge variant="secondary">{sources.length}</Badge>
            </div>
            {loading.sources ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
            <SourceList
              sources={sources}
              onSourceSelect={setSelectedSource}
            />
            )}
          </div>

          <div className="col-span-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Content</h3>
              <Badge variant="secondary">{content.length} items</Badge>
            </div>
            {loading.content ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
            <ContentGrid
              content={content}
              onStatusUpdate={handleStatusUpdate}
            />
            )}
          </div>

          <div className="col-span-3">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-medium">Scoring Settings</h3>
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            {scoringSettings && (
              <ScoringForm
                settings={scoringSettings}
                onSave={handleScoringUpdate}
              />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}