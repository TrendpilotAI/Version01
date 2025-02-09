import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { AirbyteClient } from '@/lib/airbyte/client';
import { SourceList } from './SourceList';
import { SourceConfigForm } from './SourceConfigForm';
import type { AirbyteSource } from '@/lib/airbyte/types';

export function SourceManager() {
  const [sources, setSources] = useState<AirbyteSource[]>([]);
  const [selectedSourceType, setSelectedSourceType] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const client = new AirbyteClient();

  useEffect(() => {
    loadSources();
  }, []);

  const loadSources = async () => {
    try {
      const { data } = await client.getSourceDefinitions();
      setSources(data);
    } catch (error) {
      toast({
        title: 'Error loading sources',
        description: error instanceof Error ? error.message : 'Failed to load sources',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (sourceId: string) => {
    try {
      // Delete source logic will be implemented
      toast({
        title: 'Source deleted',
        description: 'The source has been removed successfully'
      });
      loadSources();
    } catch (error) {
      toast({
        title: 'Error deleting source',
        description: error instanceof Error ? error.message : 'Failed to delete source',
        variant: 'destructive'
      });
    }
  };

  const handleRefresh = async (sourceId: string) => {
    try {
      // Refresh source logic will be implemented
      toast({
        title: 'Source refreshed',
        description: 'The source has been refreshed successfully'
      });
    } catch (error) {
      toast({
        title: 'Error refreshing source',
        description: error instanceof Error ? error.message : 'Failed to refresh source',
        variant: 'destructive'
      });
    }
  };

  const handleConfigure = (sourceId: string) => {
    // Configure source logic will be implemented
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Content Sources</h2>
          <p className="text-muted-foreground">
            Manage your content sources and integrations
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Source
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configure Content Source</DialogTitle>
            </DialogHeader>
            {selectedSourceType && (
              <SourceConfigForm
                sourceType={selectedSourceType}
                onConfigured={() => {
                  setIsDialogOpen(false);
                  setSelectedSourceType(null);
                  loadSources();
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <SourceList
            sources={sources}
            onDelete={handleDelete}
            onRefresh={handleRefresh}
            onConfigure={handleConfigure}
          />
        </CardContent>
      </Card>
    </div>
  );
}