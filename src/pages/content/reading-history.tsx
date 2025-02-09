tsx
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import type { Article } from '@/lib/news/types';

interface ReadingHistoryItem {
  id: string;
  article_data: Article;
  read_at: string;
}

export default function ReadingHistory() {
  const [history, setHistory] = useState<ReadingHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadReadingHistory();
  }, []);

  const loadReadingHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('reading_history')
        .select('*')
        .order('read_at', { ascending: false });

      if (error) throw error;
      setHistory(data);
    } catch (error) {
      console.error('Error loading reading history:', error);
      toast({
        title: 'Error loading history',
        description: 'Failed to load reading history',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter(item =>
    item.article_data.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.article_data.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reading History</h1>
          <p className="text-muted-foreground mt-1">
            Track your article reading history
          </p>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Search reading history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredHistory.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                {item.article_data.urlToImage && (
                  <img
                    src={item.article_data.urlToImage}
                    alt={item.article_data.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">
                      {item.article_data.source.name}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {new Date(item.read_at).toLocaleString()}
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2 line-clamp-2">
                    {item.article_data.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {item.article_data.description}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(item.article_data.url, '_blank')}
                  >
                    Read Again
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
```