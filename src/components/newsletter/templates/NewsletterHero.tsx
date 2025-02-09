tsx
import { Image } from '../common/Image';
import type { NewsletterHeroProps } from './types';

export function NewsletterHero({ title, subtitle, image }: NewsletterHeroProps) {
  return (
    <div className="py-8">
      <h1 className="font-arial text-2xl font-bold text-center mb-4 max-w-[600px] mx-auto">
        {title}
      </h1>
      {subtitle && (
        <p className="font-arial text-lg text-gray-600 text-center mb-6 max-w-[500px] mx-auto">
          {subtitle}
        </p>
      )}
      {image && (
        <Image
          src={image.url}
          alt={image.alt}
          width={600}
          height={300}
          className="w-full rounded-lg"
        />
      )}
    </div>
  );
}
```