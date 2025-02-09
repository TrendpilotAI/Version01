tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { CheckSquare, Trash2, Download, Tag } from 'lucide-react';
import type { SavedArticle } from '@/types/content';

interface BulkActionsProps {
  selectedArticles: SavedArticle[];
  onSelectionChange: (articles: SavedArticle[]) => void;
  onArticlesDeleted: () => void;
}

export function BulkActions({ selectedArticles, onSelectionChange, onArticlesDeleted }: BulkActionsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleBulkDelete = async () => {
    if (!selectedArticles.length) return;

    try {
      const { error } = await supabase
        .from('saved_articles')
        .delete()
        .in('id', selectedArticles.map(a => a.id));

      if (error) throw error;

      onArticlesDeleted();
      onSelectionChange([]);
      toast({
        title: 'Articles deleted',
        description: `${selectedArticles.length} articles have been deleted`,
      });
    } catch (error) {
      toast({
        title: 'Error deleting articles',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleExport = async () => {
    if (!selectedArticles.length) return;

    setIsExporting(true);
    try {
      const exportData = selectedArticles.map(article => ({
        title: article.article_data.title,
        description: article.article_data.description,
        url: article.article_data.url,
        source: article.article_data.source.name,
        publishedAt: article.article_data.publishedAt,
        tags: article.tags.map(t => t.name).join(', '),
      }));

      const csv = [
        ['Title', 'Description', 'URL', 'Source', 'Published At', 'Tags'],
        ...exportData.map(row => Object.values(row)),
      ]
        .map(row => row.map(value => `"${value}"`).join(','))
        .join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `saved-articles-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Export complete',
        description: `${selectedArticles.length} articles exported to CSV`,
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant="secondary">
        {selectedArticles.length} selected
      </Badge>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={!selectedArticles.length}>
            <CheckSquare className="h-4 w-4 mr-2" />
            Bulk Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleBulkDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExport} disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            Export to CSV
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
