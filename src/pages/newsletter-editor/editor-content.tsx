import { useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Link, List, Image as ImageIcon } from 'lucide-react';

interface EditorContentProps {
  content: string;
  onChange: (content: string) => void;
  onTextSelect: (text: string) => void;
}

export function EditorContent({ content, onChange, onTextSelect }: EditorContentProps) {
  const handleFormat = useCallback((format: string) => {
    // Format text based on selection
    const selection = window.getSelection();
    if (!selection || !selection.toString()) return;

    const selectedText = selection.toString();
    let formattedText = '';

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'link':
        formattedText = `[${selectedText}](url)`;
        break;
      case 'list':
        formattedText = selectedText
          .split('\n')
          .map(line => `- ${line}`)
          .join('\n');
        break;
      default:
        return;
    }

    const newContent = content.substring(0, selection.anchorOffset) +
      formattedText +
      content.substring(selection.focusOffset);

    onChange(newContent);
  }, [content, onChange]);

  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      onTextSelect(selection.toString());
    } else {
      onTextSelect('');
    }
  }, [onTextSelect]);

  return (
    <div className="flex-1 p-4">
      <div className="mb-4 flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFormat('bold')}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFormat('italic')}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFormat('link')}
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFormat('list')}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
      </div>

      <Card className="h-[calc(100vh-12rem)]">
        <textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          onSelect={handleSelectionChange}
          className="w-full h-full p-4 resize-none border-0 focus:outline-none"
          placeholder="Start writing your newsletter content here..."
        />
      </Card>
    </div>
  );
}