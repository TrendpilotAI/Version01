tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Layout, FileText, Plus } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
}

const templates: Template[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and simple design focused on content',
    thumbnail: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=300&h=200&fit=crop'
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with bold typography',
    thumbnail: 'https://images.unsplash.com/photo-1586880244406-556ebe35f282?w=300&h=200&fit=crop'
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    description: 'Traditional newsletter layout with sections',
    thumbnail: 'https://images.unsplash.com/photo-1586880244548-5a6d8df01c2d?w=300&h=200&fit=crop'
  }
];

interface TemplateLibraryProps {
  onSelect: (templateId: string) => void;
}

export function TemplateLibrary({ onSelect }: TemplateLibraryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layout className="h-5 w-5" />
          Template Library
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="grid gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="overflow-hidden">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-32 object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="font-medium mb-1">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {template.description}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full"
                      onClick={() => onSelect(template.id)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Use Template
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
