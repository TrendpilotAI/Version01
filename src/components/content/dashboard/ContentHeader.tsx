import { Plus, Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ContentHeader() {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">Content Curation</h1>
        <p className="text-muted-foreground mt-1">
          Manage and curate content across your channels
        </p>
      </div>
      
      <div className="flex gap-3">
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Import
        </Button>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Content
        </Button>
      </div>
    </div>
  );
}