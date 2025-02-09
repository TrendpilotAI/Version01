import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Monitor, Smartphone } from 'lucide-react';

interface EditorPreviewProps {
  title: string;
  content: string;
  mode: 'desktop' | 'mobile';
  onModeChange: (mode: 'desktop' | 'mobile') => void;
}

export function EditorPreview({ title, content, mode, onModeChange }: EditorPreviewProps) {
  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex justify-end space-x-2 mb-4">
        <Button
          size="sm"
          variant={mode === 'desktop' ? 'default' : 'outline'}
          onClick={() => onModeChange('desktop')}
        >
          <Monitor className="h-4 w-4 mr-2" />
          Desktop
        </Button>
        <Button
          size="sm"
          variant={mode === 'mobile' ? 'default' : 'outline'}
          onClick={() => onModeChange('mobile')}
        >
          <Smartphone className="h-4 w-4 mr-2" />
          Mobile
        </Button>
      </div>

      <Card className={`flex-1 overflow-auto ${mode === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
        <div className="max-w-3xl mx-auto p-8">
          <h1 className="text-3xl font-bold mb-6">{title || 'Untitled Newsletter'}</h1>
          <div 
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </Card>
    </div>
  );
}