tsx
import { QuickLinks } from '../common/QuickLinks';
import { Highlights } from '../common/Highlights';
import type { NewsletterSidebarProps } from './types';

export function NewsletterSidebar({ quickLinks, highlights }: NewsletterSidebarProps) {
  return (
    <div className="space-y-6">
      <QuickLinks links={quickLinks} />
      <Highlights items={highlights} />
    </div>
  );
}
```