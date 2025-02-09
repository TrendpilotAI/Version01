tsx
import { cn } from '@/lib/utils';

interface CallToActionProps {
  text: string;
  url: string;
  variant?: 'primary' | 'secondary';
}

export function CallToAction({ text, url, variant = 'primary' }: CallToActionProps) {
  return (
    <a
      href={url}
      className={cn(
        "inline-block px-6 py-3 rounded-lg font-medium text-center transition-colors",
        variant === 'primary' 
          ? "bg-primary text-white hover:bg-primary/90"
          : "bg-gray-100 text-gray-900 hover:bg-gray-200"
      )}
    >
      {text}
    </a>
  );
}
```