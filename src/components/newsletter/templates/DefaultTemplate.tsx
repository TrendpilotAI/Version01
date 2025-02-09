tsx
import { NewsletterHeader } from './NewsletterHeader';
import { NewsletterHero } from './NewsletterHero';
import { NewsletterContent } from './NewsletterContent';
import { NewsletterSidebar } from './NewsletterSidebar';
import { NewsletterFooter } from './NewsletterFooter';
import type { NewsletterTemplateProps } from './types';

export function DefaultTemplate({ content, personalizations }: NewsletterTemplateProps) {
  return (
    <div className="w-[600px] mx-auto bg-white font-sans">
      <NewsletterHeader 
        logo={content.logo} 
        issueNumber={content.issueNumber}
        date={content.date}
      />
      
      <NewsletterHero
        title={content.title}
        subtitle={content.subtitle}
        image={content.heroImage}
      />

      <div className="flex gap-6">
        <div className="flex-1">
          <NewsletterContent articles={content.articles} />
        </div>
        <div className="w-48">
          <NewsletterSidebar 
            quickLinks={content.quickLinks}
            highlights={content.highlights}
          />
        </div>
      </div>

      <NewsletterFooter
        companyInfo={content.companyInfo}
        socialLinks={content.socialLinks}
        unsubscribeUrl={content.unsubscribeUrl}
      />
    </div>
  );
}
```