```typescript
export function cleanText(text: string): string {
  return text
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove URLs
    .replace(/https?:\/\/[^\s]+/g, '')
    // Remove special characters
    .replace(/[^\w\s.,!?'"()-]/g, '')
    // Remove multiple punctuation
    .replace(/([.,!?])\1+/g, '$1')
    // Trim whitespace
    .trim();
}
```