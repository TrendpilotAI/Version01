import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSourceConfig } from '@/hooks/useSourceConfig';
import type { SourceType } from '@/lib/integrations/airbyte/types';

interface SourceConfigDialogProps {
  source: SourceType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SourceConfigDialog({ source, open, onOpenChange }: SourceConfigDialogProps) {
  const { configureSource, isConfiguring } = useSourceConfig('default-workspace-id');

  if (!source) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const config = Object.fromEntries(formData.entries());
    
    try {
      await configureSource(source.id, config);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to configure source:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure {source.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {source.configFields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                id={field.name}
                name={field.name}
                type={field.type}
                required={field.required}
              />
            </div>
          ))}

          <Button type="submit" disabled={isConfiguring} className="w-full">
            {isConfiguring ? 'Configuring...' : 'Configure Source'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}