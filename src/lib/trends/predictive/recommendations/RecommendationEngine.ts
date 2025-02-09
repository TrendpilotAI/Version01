```typescript
import type { Recommendation } from '../types';

export class RecommendationEngine {
  generateRecommendation(score: number): Recommendation {
    if (score > 0.8) {
      return {
        action: "IMMEDIATE_COVERAGE",
        reasoning: "High potential trend with strong early signals",
        approach: [
          "Be first to provide deep analysis",
          "Focus on future implications",
          "Include expert opinions",
          "Highlight potential controversies"
        ]
      };
    }

    if (score > 0.6) {
      return {
        action: "MONITOR_CLOSELY",
        reasoning: "Emerging trend with growing signals",
        approach: [
          "Prepare preliminary analysis",
          "Track key developments",
          "Identify unique angles",
          "Build expert network"
        ]
      };
    }

    return {
      action: "KEEP_WATCHING",
      reasoning: "Early stage with uncertain potential",
      approach: [
        "Monitor signal strength",
        "Track adoption metrics",
        "Identify potential catalysts"
      ]
    };
  }
}
```