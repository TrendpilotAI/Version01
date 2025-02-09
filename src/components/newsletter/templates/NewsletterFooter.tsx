tsx
import { SocialLinks } from '../common/SocialLinks';
import type { NewsletterFooterProps } from './types';

export function NewsletterFooter({ companyInfo, socialLinks, unsubscribeUrl }: NewsletterFooterProps) {
  return (
    <footer className="mt-12 pt-8 border-t text-sm text-gray-500">
      <SocialLinks links={socialLinks} className="mb-6" />
      
      <div className="text-center space-y-4">
        <div>
          <p>{companyInfo.name}</p>
          <p>{companyInfo.address}</p>
        </div>

        <div className="text-xs">
          <a href={unsubscribeUrl} className="text-gray-400 hover:text-gray-600">
            Unsubscribe from these emails
          </a>
        </div>
      </div>
    </footer>
  );
}
```