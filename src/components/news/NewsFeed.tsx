import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Bookmark, BookmarkCheck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { newsapi } from '@/lib/news/newsapi-client';
import { generateWithDeepseek } from '@/lib/deepseek';
import { supabase } from '@/lib/supabase';
import { AdvancedSearch } from './AdvancedSearch';
import type { Article } from '@/lib/news/types';

export function NewsFeed() {
  const [articles, setArticles] = useState<(Article & { score?: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedArticles, setSavedArticles] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    query: '',
    category: '',
    language: 'en',
    country: '',
    fromDate: undefined,
    toDate: undefined,
    sortBy: 'publishedAt' as const,
    sortOrder: 'desc' as const,
    minScore: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadArticles();
    loadSavedArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    try {
      let response;
      
      if (filters.query) {
        response = await newsapi.getEverything({
          q: filters.query,
          language: filters.language,
          from: filters.fromDate?.toISOString(),
          to: filters.toDate?.toISOString(),
          sortBy: filters.sortBy,
          pageSize: 20
        });
      } else {
        response = await newsapi.getTopHeadlines({
          category: filters.category || undefined,
          country: filters.country || undefined,
          language: filters.language,
          pageSize: 20
        });
      }

      // Score articles using DeepSeek
      const scoredArticles = await Promise.all(
        response.articles!.map(async (article) => {
          const score = await scoreArticle(article);
          return { ...article, score };
        })
      );

      // Filter by minimum score
      let filteredArticles = scoredArticles.filter(
        article => (article.score || 0) >= filters.minScore
      );

      // Sort articles
      filteredArticles.sort((a, b) => {
        const aValue = a[filters.sortBy === 'publishedAt' ? 'publishedAt' : 'score'] || 0;
        const bValue = b[filters.sortBy === 'publishedAt' ? 'publishedAt' : 'score'] || 0;
        return filters.sortOrder === 'desc' ? 
          (bValue > aValue ? 1 : -1) : 
          (aValue > bValue ? 1 : -1);
      });

      setArticles(filteredArticles);
    } catch (error) {
      console.error('Error loading articles:', error);
      toast({
        title: 'Error loading articles',
        description: 'Failed to load news articles',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSavedArticles = async () => {
    try {
      const { data } = await supabase
        .from('saved_articles')
        .select('url');

      if (data) {
        setSavedArticles(new Set(data.map(item => item.url)));
      }
    } catch (error) {
      console.error('Error loading saved articles:', error);
    }
  };

  const scoreArticle = async (article: Article): Promise<number> => {
    try {
      const prompt = `Score this article from 0-5 based on relevance and quality. Only return the numeric score.
      Title: ${article.title}
      Description: ${article.description}
      Source: ${article.source.name}`;

      const response = await generateWithDeepseek(prompt);
      const score = parseFloat(response);
      return isNaN(score) ? 0 : score;
    } catch (error) {
      console.error('Error scoring article:', error);
      return 0;
    }
  };

  const handleSaveArticle = async (article: Article) => {
    try {
      const { error } = await supabase
        .from('saved_articles')
        .insert([{
          article_data: article,
          url: article.url
        }]);

      if (error) throw error;

      setSavedArticles(prev => new Set([...prev, article.url]));
      toast({
        title: 'Article saved',
        description: 'Article has been added to your saved articles'
      });
    } catch (error) {
      toast({
        title: 'Error saving article',
        description: 'Failed to save article',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Quick search..."
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && loadArticles()}
          />
          <Button onClick={loadArticles}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <AdvancedSearch
          filters={filters}
          onFiltersChange={setFilters}
          onSearch={loadArticles}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Card key={article.url} className="overflow-hidden">
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">
                    {article.source.name}
                  </Badge>
                  {article.score !== undefined && (
                    <Badge variant={article.score >= 4 ? 'default' : 'secondary'}>
                      Score: {article.score.toFixed(1)}
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {article.description}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => window.open(article.url, '_blank')}
                  >
                    Read Article
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleSaveArticle(article)}
                    disabled={savedArticles.has(article.url)}
                  >
                    {savedArticles.has(article.url) ? (
                      <BookmarkCheck className="h-4 w-4 text-primary" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}