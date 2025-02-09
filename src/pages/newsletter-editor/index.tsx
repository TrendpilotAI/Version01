import { useState, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { EditorHeader } from './editor-header';
import { EditorContent } from './editor-content';
import { EditorSidebar } from './editor-sidebar';
import { EditorPreview } from './editor-preview';
import { AIAssistant } from '@/components/newsletter/editor/AIAssistant';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNewsletter } from '@/contexts/newsletter-context';
import { useToast } from '@/components/ui/use-toast';

export default function NewsletterEditor() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [selectedText, setSelectedText] = useState('');
  const { currentNewsletterId } = useNewsletter();
  const { toast } = useToast();

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    setSelectedText(''); // Clear selection when content changes
  }, []);

  const handleTextSelection = useCallback((selection: string) => {
    setSelectedText(selection);
  }, []);

  const handleAIGenerated = useCallback((generatedContent: string) => {
    if (selectedText) {
      // Replace selected text with AI-generated content
      const newContent = content.replace(selectedText, generatedContent);
      setContent(newContent);
      setSelectedText('');
    } else {
      // Set entire content if no selection
      setContent(generatedContent);
    }
  }, [content, selectedText]);

  const handleSave = async () => {
    try {
      // Save logic will be implemented here
      toast({
        title: 'Newsletter saved',
        description: 'Your changes have been saved successfully.'
      });
    } catch (error) {
      toast({
        title: 'Error saving newsletter',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      });
    }
  };

  const handlePublish = async () => {
    try {
      // Publish logic will be implemented here
      toast({
        title: 'Newsletter published',
        description: 'Your newsletter has been published successfully.'
      });
    } catch (error) {
      toast({
        title: 'Error publishing newsletter',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        <EditorHeader 
          title={title}
          onTitleChange={setTitle}
          onSave={handleSave}
          onPublish={handlePublish}
        />

        <Tabs defaultValue="edit" className="flex-1">
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="flex-1 h-full">
            <div className="flex h-full">
              <EditorContent
                content={content}
                onChange={handleContentChange}
                onTextSelect={handleTextSelection}
              />
              <div className="w-80 border-l p-4">
                <AIAssistant
                  onContentGenerate={handleAIGenerated}
                  selectedText={selectedText}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="flex-1 h-full">
            <EditorPreview
              title={title}
              content={content}
              mode={previewMode}
              onModeChange={setPreviewMode}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}