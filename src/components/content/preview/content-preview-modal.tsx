import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PlatformPreview } from './platform-preview';
import { validateContent } from '@/lib/validation/content-validator';
import type { Platform } from '@/types/distribution';

interface ContentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  platforms: Platform[];
  onConfirm: () => void;
}

export function ContentPreviewModal({
  isOpen,
  onClose,
  content,
  platforms,
  onConfirm,
}: ContentPreviewModalProps) {
  const validationResults = platforms.map(platform => ({
    platform,
    ...validateContent(content, platform)
  }));

  const hasErrors = validationResults.some(result => !result.isValid);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Preview Content</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {validationResults.map(result => (
            !result.isValid && (
              <Alert key={result.platform} variant="destructive">
                <AlertDescription>
                  {result.errors.join(', ')}
                </AlertDescription>
              </Alert>
            )
          ))}

          <div className="grid gap-4 md:grid-cols-2">
            {platforms.map(platform => (
              <PlatformPreview
                key={platform}
                content={content}
                platform={platform}
              />
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onConfirm} disabled={hasErrors}>
              Confirm & Schedule
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}