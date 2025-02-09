import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Send, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface EditorHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  onSave: () => void;
  onPublish: () => void;
}

export function EditorHeader({ title, onTitleChange, onSave, onPublish }: EditorHeaderProps) {
  return (
    <div className="border-b p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4 flex-1">
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Newsletter Title"
          className="max-w-md text-lg font-semibold"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={onSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm">
              <Send className="h-4 w-4 mr-2" />
              Publish
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onPublish}>
              Publish Now
            </DropdownMenuItem>
            <DropdownMenuItem>
              Schedule...
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Publishing Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}