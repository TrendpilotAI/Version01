```typescript
import { extractKeywords } from '../utils/keywords';
import { detectLanguage } from '../utils/language';
import { cleanText } from '../utils/text';
import type { AnalyzerResult, TransformationType } from '../types';

export class LocalAnalyzer {
  canHandle(type: TransformationType): boolean {
    return ['clean', 'keywords', 'language'].includes(type);
  }

  async analyze(content: any, type: TransformationType): Promise<AnalyzerResult> {
    switch (type) {
      case 'clean':
        return this.cleanContent(content);
      case 'keywords':
        return this.extractKeywords(content);
      case 'language':
        return this.detectLanguage(content);
      default:
        throw new Error(`Unsupported transformation type: ${type}`);
    }
  }

  private async cleanContent(content: any): Promise<AnalyzerResult> {
    const cleaned = cleanText(content.content);
    return {
      content: cleaned,
      metadata: {
        originalLength: content.content.length,
        cleanedLength: cleaned.length
      }
    };
  }

  private async extractKeywords(content: any): Promise<AnalyzerResult> {
    const keywords = extractKeywords(content.content);
    return {
      content: content.content,
      metadata: {
        keywords,
        keywordCount: keywords.length
      }
    };
  }

  private async detectLanguage(content: any): Promise<AnalyzerResult> {
    const language = detectLanguage(content.content);
    return {
      content: content.content,
      metadata: {
        language,
        confidence: language.confidence
      }
    };
  }
}
```