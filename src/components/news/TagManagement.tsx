tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { Tag, Plus, X } from 'lucide-react';

interface ArticleTag {
  id: string;
  name: string;
  color: string;
}

export function TagManagement() {
  const [tags, setTags] = useState<ArticleTag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#6366f1');
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const loadTags = async () => {
    const { data, error } = await supabase
      .from('article_tags')
      .select('*')
      .order('name');

    if (error) {
      toast({
        title: 'Error loading tags',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    setTags(data);
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      toast({
        title: 'Tag name required',
        description: 'Please enter a name for the tag',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('article_tags')
        .insert([
          {
            name: newTagName.trim(),
            color: newTagColor,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setTags([...tags, data]);
      setNewTagName('');
      setNewTagColor('#6366f1');
      toast({
        title: 'Tag created',
        description: `Tag "${newTagName}" has been created`,
      });
    } catch (error) {
      toast({
        title: 'Error creating tag',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    try {
      const { error } = await supabase
        .from('article_tags')
        .delete()
        .eq('id', tagId);

      if (error) throw error;

      setTags(tags.filter(tag => tag.id !== tagId));
      toast({
        title: 'Tag deleted',
        description: 'Tag has been deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error deleting tag',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={() => loadTags()}>
          <Tag className="h-4 w-4 mr-2" />
          Manage Tags
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Tags</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Create New Tag</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
              />
              <Input
                type="color"
                value={newTagColor}
                onChange={(e) => setNewTagColor(e.target.value)}
                className="w-20"
              />
              <Button onClick={handleCreateTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Existing Tags</Label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  className="flex items-center gap-2"
                  style={{ borderColor: tag.color }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  {tag.name}
                  <button
                    onClick={() => handleDeleteTag(tag.id)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```