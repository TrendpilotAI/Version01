import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { CurationService } from '@/lib/content/curation-service';
import type { SourceContent } from '@/types/content';

export function useCurationQueue() {
  const [queue, setQueue] = useState<SourceContent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadQueue();
  }, []);

  async function loadQueue() {
    try {
      setLoading(true);
      const items = await CurationService.getQueuedContent();
      setQueue(items);
    } catch (error) {
      toast({
        title: 'Error loading queue',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: 'approved' | 'rejected') {
    try {
      await CurationService.updateContentStatus(id, status);
      setQueue(queue.filter(item => item.id !== id));
      toast({
        title: 'Status updated',
        description: `Content has been ${status}`,
      });
    } catch (error) {
      toast({
        title: 'Error updating status',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  }

  async function reorderQueue(fromIndex: number, toIndex: number) {
    const newQueue = [...queue];
    const [movedItem] = newQueue.splice(fromIndex, 1);
    newQueue.splice(toIndex, 0, movedItem);
    
    setQueue(newQueue);

    try {
      await CurationService.updateQueueOrder(
        newQueue.map((item, index) => ({
          id: item.id,
          position: index,
        }))
      );
    } catch (error) {
      toast({
        title: 'Error reordering queue',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
      // Revert the queue order on error
      loadQueue();
    }
  }

  return {
    queue,
    loading,
    updateStatus,
    reorderQueue,
    refresh: loadQueue,
  };
}