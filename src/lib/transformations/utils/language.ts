```typescript
interface LanguageResult {
  code: string;
  name: string;
  confidence: number;
}

export function detectLanguage(text: string): LanguageResult {
  // Simple language detection based on character frequency
  const langPatterns = {
    en: /^[a-zA-Z\s.,!?'"()-]+$/,
    es: /[áéíóúñ¿¡]/i,
    fr: /[éèêëàâçîïôûùüÿ]/i,
    de: /[äöüß]/i
  };

  for (const [code, pattern] of Object.entries(langPatterns)) {
    if (pattern.test(text)) {
      return {
        code,
        name: getLanguageName(code),
        confidence: 0.8
      };
    }
  }

  return {
    code: 'en',
    name: 'English',
    confidence: 0.5
  };
}

function getLanguageName(code: string): string {
  const languages: Record<string, string> = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German'
  };
  return languages[code] || 'Unknown';
}
```