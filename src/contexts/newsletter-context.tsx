import { createContext, useContext, useState, useEffect } from 'react';
import { getNewsletters } from '@/lib/api';
import { testSupabaseConnection } from '@/lib/test-connection';
import { useToast } from '@/components/ui/use-toast';

interface NewsletterContextType {
  currentNewsletterId: string | null;
  setCurrentNewsletterId: (id: string) => void;
}

const NewsletterContext = createContext<NewsletterContextType>({
  currentNewsletterId: null,
  setCurrentNewsletterId: () => {},
});

export function NewsletterProvider({ children }: { children: React.ReactNode }) {
  const [currentNewsletterId, setCurrentNewsletterId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function loadDefaultNewsletter() {
      try {
        // First check Supabase connection
        const connectionTest = await testSupabaseConnection();
        if (!connectionTest.success) {
          toast({
            title: 'Connection Error',
            description: connectionTest.message,
            variant: 'destructive',
          });
          return;
        }

        const newsletters = await getNewsletters('default-workspace-id');
        if (newsletters.length > 0) {
          setCurrentNewsletterId(newsletters[0].id);
        }
      } catch (error) {
        console.error('Failed to load default newsletter:', error);
        // Don't show error toast here as it's handled by the connection test
      }
    }

    if (!currentNewsletterId) {
      loadDefaultNewsletter();
    }
  }, [currentNewsletterId, toast]);

  return (
    <NewsletterContext.Provider value={{ currentNewsletterId, setCurrentNewsletterId }}>
      {children}
    </NewsletterContext.Provider>
  );
}

export function useNewsletter() {
  const context = useContext(NewsletterContext);
  if (!context) {
    throw new Error('useNewsletter must be used within a NewsletterProvider');
  }
  return context;
}