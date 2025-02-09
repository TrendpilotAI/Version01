tsx
import { Image } from './Image';
import type { ArticleProps } from '../templates/types';

export function Article({ title, content, image, callToAction }: ArticleProps) {
  return (
    <article className="space-y-4">
      {image && (
        <Image
          src={image.url}
          alt={image.alt}
          width={400}
          height={200}
          className="w-full rounded"
        />
      )}
      <h2 className="font-arial text-xl font-bold">{title}</h2>
      <div className="font-arial text-base text-gray-600 leading-relaxed">
        {content}
      </div>
      {callToAction}
    </article>
  );
}
```