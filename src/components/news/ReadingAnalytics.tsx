tsx
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/lib/supabase';
import { Clock, TrendingUp, BookOpen, Hash } from 'lucide-react';

interface ReadingStats {
  totalArticles: number;
  readingStreak: number;
  avgArticlesPerDay: number;
  topSources: { name: string; count: number }[];
  readingTimes: { hour: number; count: number }[];
  topTags: { name: string; count: number }[];
}

export function ReadingAnalytics() {
  const [stats, setStats] = useState<ReadingStats>({
    totalArticles: 0,
    readingStreak: 0,
    avgArticlesPerDay: 0,
    topSources: [],
    readingTimes: [],
    topTags: [],
  });

  useEffect(() => {
    loadReadingStats();
  }, []);

  const loadReadingStats = async () => {
    try {
      // Get reading history
      const { data: history } = await supabase
        .from('reading_history')
        .select('*')
        .order('read_at', { ascending: false });

      if (!history) return;

      // Calculate stats
      const totalArticles = history.length;
      
      // Calculate reading times distribution
      const readingTimes = history.reduce((acc: Record<number, number>, item) => {
        const hour = new Date(item.read_at).getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {});

      // Calculate top sources
      const sources = history.reduce((acc: Record<string, number>, item) => {
        const source = item.article_data.source.name;
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      }, {});

      // Get tagged articles
      const { data: taggedArticles } = await supabase
        .from('saved_article_tags')
        .select(`
          article_tags (
            name
          )
        `);

      // Calculate top tags
      const tags = (taggedArticles || []).reduce((acc: Record<string, number>, item: any) => {
        const tagName = item.article_tags?.name;
        if (tagName) {
          acc[tagName] = (acc[tagName] || 0) + 1;
        }
        return acc;
      }, {});

      setStats({
        totalArticles,
        readingStreak: calculateReadingStreak(history),
        avgArticlesPerDay: calculateAvgArticlesPerDay(history),
        topSources: Object.entries(sources)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5),
        readingTimes: Object.entries(readingTimes)
          .map(([hour, count]) => ({ hour: parseInt(hour), count }))
          .sort((a, b) => a.hour - b.hour),
        topTags: Object.entries(tags)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5),
      });
    } catch (error) {
      console.error('Error loading reading stats:', error);
    }
  };

  const calculateReadingStreak = (history: any[]): number => {
    let streak = 0;
    let currentDate = new Date();
    
    for (let i = 0; i < history.length; i++) {
      const readDate = new Date(history[i].read_at);
      if (isSameDay(currentDate, readDate)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (!isSameDay(currentDate, readDate) && !isConsecutiveDay(currentDate, readDate)) {
        break;
      }
    }
    
    return streak;
  };

  const calculateAvgArticlesPerDay = (history: any[]): number => {
    if (history.length < 2) return history.length;
    
    const firstDate = new Date(history[history.length - 1].read_at);
    const lastDate = new Date(history[0].read_at);
    const days = Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return Number((history.length / days).toFixed(1));
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.toDateString() === date2.toDateString();
  };

  const isConsecutiveDay = (date1: Date, date2: Date): boolean => {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Total Articles</h3>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold">{stats.totalArticles}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Reading Streak</h3>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold">{stats.readingStreak} days</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Avg Articles/Day</h3>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold">{stats.avgArticlesPerDay}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Top Tags</h3>
            </div>
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {stats.topTags.map((tag) => (
                  <Badge key={tag.name} variant="secondary">
                    {tag.name} ({tag.count})
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Reading Times</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.readingTimes}>
                  <XAxis
                    dataKey="hour"
                    tickFormatter={(hour) => `${hour}:00`}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(hour) => `${hour}:00`}
                    formatter={(value) => [value, 'articles']}
                  />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.topSources}
                  layout="vertical"
                  margin={{ left: 100 }}
                >
                  <XAxis type="number" />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={100}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--primary))"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```