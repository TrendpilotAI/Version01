import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { 
  Wand2, 
  Loader2, 
  SplitSquareVertical, 
  List as ListIcon, 
  Sparkles,
  Scissors,
  SmilePlus
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { generateWithDeepseek } from '@/lib/deepseek';

interface AIAssistantProps {
  onContentGenerate: (content: string) => void;
  selectedText?: string;
}

type TextOperation = 'summarize' | 'shorten' | 'enhance' | 'bullets' | 'emojify' | 'original';

const TEXT_OPERATIONS: Record<TextOperation, { icon: any; label: string }> = {
  summarize: { icon: SplitSquareVertical, label: 'Summarize' },
  shorten: { icon: Scissors, label: 'Shorten' },
  enhance: { icon: Sparkles, label: 'Enhance' },
  bullets: { icon: ListIcon, label: 'Make Bullets' },
  emojify: { icon: SmilePlus, label: 'Add Emojis' },
  original: { icon: Wand2, label: 'Make Original' }
};

export function AIAssistant({ onContentGenerate, selectedText }: AIAssistantProps) {
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateContent = async () => {
    if (!prompt) {
      toast({
        title: 'Please enter a topic or prompt',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const content = await generateWithDeepseek(`Generate newsletter content about: ${prompt}\nTone: ${tone}`, {
        model: 'deepseek-r1-chat',
        temperature: 0.7
      });
      onContentGenerate(content || '');
      toast({ title: 'Content generated successfully' });
    } catch (error) {
      toast({
        title: 'Failed to generate content',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTextOperation = useCallback(async (operation: TextOperation) => {
    if (!selectedText) {
      toast({
        title: 'No text selected',
        description: 'Please select some text to apply the operation',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const prompts: Record<TextOperation, string> = {
        summarize: `Summarize this text concisely: ${selectedText}`,
        shorten: `Make this text shorter while keeping the key points: ${selectedText}`,
        enhance: `Enhance this text to make it more engaging and professional: ${selectedText}`,
        bullets: `Convert this text into bullet points: ${selectedText}`,
        emojify: `Add relevant emojis to this text: ${selectedText}`,
        original: `Rewrite this text to make it more original and unique: ${selectedText}`
      };

      const result = await generateWithDeepseek(prompts[operation], {
        model: 'deepseek-r1-chat',
        temperature: operation === 'original' ? 0.8 : 0.3
      });

      onContentGenerate(result || '');
      toast({ title: 'Text transformed successfully' });
    } catch (error) {
      toast({
        title: 'Operation failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  }, [selectedText, onContentGenerate, toast]);

  return (
    <Card className="p-4 space-y-4">
      {selectedText ? (
        <>
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(TEXT_OPERATIONS) as [TextOperation, { icon: any; label: string }][]).map(([op, { icon: Icon, label }]) => (
              <Button
                key={op}
                variant="outline"
                className="flex flex-col items-center py-4"
                onClick={() => handleTextOperation(op)}
                disabled={isGenerating}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs">{label}</span>
              </Button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="prompt">Topic or Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Enter a topic or specific instructions..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone">Writing Tone</Label>
            <Input
              id="tone"
              placeholder="Professional, Casual, etc."
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            />
          </div>

          <Button 
            className="w-full" 
            onClick={generateContent}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Content
              </>
            )}
          </Button>
        </>
      )}
    </Card>
  );
}