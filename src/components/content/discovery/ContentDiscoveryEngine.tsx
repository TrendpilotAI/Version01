import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, TrendingUp, Filter, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import type { SourceContent } from '@/types/content';

export function ContentDiscoveryEngine() {
  const [content, setContent] = useState<SourceContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadContent();
  }, [filter]);

  async function loadContent() {
    try {
      setLoading(true);
      let query = supabase
        .from('source_content')
        .select('*')
        .order('score', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      toast({
        title: 'Error loading content',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  const filteredContent = content.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Content Discovery</h2>
          <p className="text-muted-foreground">
            Discover and curate high-quality content
          </p>
        </div>
        <Button onClick={loadContent}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="flex space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Advanced Filters
        </Button>
      </div>

      <Tabs defaultValue="trending">
        <TabsList>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="space-y-4">
          {filteredContent.map((item) => (
            <ContentCard key={item.id} content={item} onRefresh={loadContent} />
          ))}
        </TabsContent>

        <TabsContent value="recommended">
          <div className="grid gap-4">
            {filteredContent
              .filter(item => item.score && item.score > 4)
              .map((item) => (
                <ContentCard key={item.id} content={item} onRefresh={loadContent} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="new">
          <div className="grid gap-4">
            {filteredContent
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .map((item) => (
                <ContentCard key={item.id} content={item} onRefresh={loadContent} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ContentCard({ content, onRefresh }: { content: SourceContent; onRefresh: () => void }) {
  const { toast } = useToast();

  async function updateStatus(status: 'approved' | 'rejected') {
    try {
      const { error } = await supabase
        .from('source_content')
        .update({ status })
        .eq('id', content.id);

      if (error) throw error;
      
      toast({
        title: 'Status updated',
        description: `Content has been ${status}`,
      });
      
      onRefresh();
    } catch (error) {
      toast({
        title: 'Error updating status',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <h3 className="font-semibold">{content.title}</h3>
            <p className="text-sm text-muted-foreground">{content.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={content.score >= 4 ? 'default' : 'secondary'}>
              {content.score?.toFixed(1)}
            </Badge>
            {content.status === 'pending' && (
              <Sparkles className="h-4 w-4 text-yellow-500" />
            )}
            {content.status === 'approved' && (
              <TrendingUp className="h-4 w-4 text-green-500" />
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {new Date(content.created_at).toLocaleDateString()}
          </div>
          <div className="space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateStatus('approved')}
              disabled={content.status === 'approved'}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateStatus('rejected')}
              disabled={content.status === 'rejected'}
            >
              Reject
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}