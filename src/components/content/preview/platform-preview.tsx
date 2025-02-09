import { Card } from '@/components/ui/card';
import { formatForPlatform } from '@/lib/formatting/platform-formatters';
import { Twitter, Linkedin } from 'lucide-react';
import type { Platform } from '@/types/distribution';

interface PlatformPreviewProps {
  content: string;
  platform: Platform;
}

export function PlatformPreview({ content, platform }: PlatformPreviewProps) {
  const formattedContent = formatForPlatform(content, platform);
  
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-3">
        {platform === 'twitter' ? (
          <Twitter className="h-5 w-5 text-blue-400" />
        ) : (
          <Linkedin className="h-5 w-5 text-blue-600" />
        )}
        <h3 className="font-medium capitalize">{platform} Preview</h3>
      </div>
      <p className="text-sm whitespace-pre-wrap">{formattedContent}</p>
    </Card>
  );
}