import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

// Database
import { supabase } from '@/lib/supabase';

export function useContent() {
  const [content, setContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadContent();
  }, []);

  async function loadContent() {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('source_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setContent(data);
    } catch (error) {
      console.error('Error loading content:', error);
      setError(error instanceof Error ? error : new Error('Failed to load content'));
      toast({
        title: 'Error loading content',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }


  return { content, isLoading, error };
}