tsx
import { Article } from '../common/Article';
import { CallToAction } from '../common/CallToAction';
import type { NewsletterContentProps } from './types';

export function NewsletterContent({ articles }: NewsletterContentProps) {
  return (
    <div className="space-y-8">
      {articles.map((article, index) => (
        <Article
          key={article.id}
          title={article.title}
          content={article.content}
          image={article.image}
          callToAction={
            <CallToAction
              text={article.ctaText}
              url={article.ctaUrl}
              variant={index === 0 ? 'primary' : 'secondary'}
            />
          }
        />
      ))}
    </div>
  );
}
```