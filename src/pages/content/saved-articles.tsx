tsx
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Search, Tag, Trash2, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import type { Article } from '@/lib/news/types';

interface SavedArticle {
  id: string;
  article_data: Article;
  tags: { id: string; name: string; color: string }[];
  created_at: string;
}

interface ArticleTag {
  id: string;
  name: string;
  color: string;
}

export default function SavedArticles() {
  const [articles, setArticles] = useState<SavedArticle[]>([]);
  const [tags, setTags] = useState<ArticleTag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSavedArticles();
    loadTags();
  }, [selectedTag]);

  const loadSavedArticles = async () => {
    try {
      let query = supabase
        .from('saved_articles')
        .select(`
          id,
          article_data,
          created_at,
          saved_article_tags(
            article_tags(id, name, color)
          )
        `)
        .order('created_at', { ascending: false });

      if (selectedTag) {
        query = query.contains('saved_article_tags.article_tags.id', [selectedTag]);
      }

      const { data, error } = await query;

      if (error) throw error;

      const articles = data.map(article => ({
        ...article,
        tags: article.saved_article_tags
          .map((sat: any) => sat.article_tags)
          .filter(Boolean)
      }));

      setArticles(articles);
    } catch (error) {
      console.error('Error loading saved articles:', error);
      toast({
        title: 'Error loading articles',
        description: 'Failed to load saved articles',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const { data, error } = await supabase
        .from('article_tags')
        .select('*')
        .order('name');

      if (error) throw error;
      setTags(data);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const handleRemoveArticle = async (articleId: string) => {
    try {
      const { error } = await supabase
        .from('saved_articles')
        .delete()
        .eq('id', articleId);

      if (error) throw error;

      setArticles(prev => prev.filter(article => article.id !== articleId));
      toast({
        title: 'Article removed',
        description: 'Article has been removed from your saved articles'
      });
    } catch (error) {
      toast({
        title: 'Error removing article',
        description: 'Failed to remove article',
        variant: 'destructive'
      });
    }
  };

  const filteredArticles = articles.filter(article =>
    article.article_data.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.article_data.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Saved Articles</h1>
          <p className="text-muted-foreground mt-1">
            Manage your saved articles and reading list
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex gap-2">
            <Input
              placeholder="Search saved articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button>
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Tags</SelectItem>
              {tags.map(tag => (
                <SelectItem key={tag.id} value={tag.id}>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    {tag.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="overflow-hidden">
                {article.article_data.urlToImage && (
                  <img
                    src={article.article_data.urlToImage}
                    alt={article.article_data.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">
                      {article.article_data.source.name}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {new Date(article.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2 line-clamp-2">
                    {article.article_data.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {article.article_data.description}
                  </p>
                  
                  {article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.map(tag => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          className="flex items-center gap-1"
                          style={{ borderColor: tag.color }}
                        >
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: tag.color }}
                          />
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => window.open(article.article_data.url, '_blank')}
                    >
                      Read Article
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveArticle(article.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
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