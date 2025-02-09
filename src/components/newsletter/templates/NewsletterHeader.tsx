tsx
import { Image } from '../common/Image';
import type { NewsletterHeaderProps } from './types';

export function NewsletterHeader({ logo, issueNumber, date }: NewsletterHeaderProps) {
  return (
    <div className="py-6 text-center border-b">
      <Image
        src={logo.url}
        alt={logo.alt}
        width={200}
        height={60}
        className="mx-auto mb-4"
      />
      <div className="text-sm text-gray-500">
        Issue #{issueNumber} • {date}
      </div>
    </div>
  );
}
```