import { supabase } from '../supabase';
import type { ScoreBreakdown } from './types';

export class LearningSystem {
  private workspaceId: string;
  private baselineScores: Record<string, number>;
  private patternData: Record<string, any>;

  constructor(workspaceId: string) {
    this.workspaceId = workspaceId;
    this.baselineScores = {};
    this.patternData = {};
  }

  async initialize() {
    const { data } = await supabase
      .from('scoring_settings')
      .select('baseline_scores, pattern_data')
      .eq('workspace_id', this.workspaceId)
      .single();

    if (data) {
      this.baselineScores = data.baseline_scores;
      this.patternData = data.pattern_data;
    }
  }

  async trackAction(
    contentId: string,
    actionType: string,
    originalScore: number,
    scoringDetails: ScoreBreakdown
  ) {
    // Record the action
    await supabase.from('user_actions').insert({
      workspace_id: this.workspaceId,
      content_id: contentId,
      action_type: actionType,
      original_score: originalScore,
      scoring_details: scoringDetails
    });

    // Update pattern data
    this.updatePatterns(actionType, scoringDetails);
  }

  private async updatePatterns(actionType: string, scores: ScoreBreakdown) {
    // Simple pattern recognition - can be enhanced
    const patterns = { ...this.patternData };
    
    if (!patterns[actionType]) {
      patterns[actionType] = {
        count: 0,
        averages: {}
      };
    }

    patterns[actionType].count++;
    
    // Update running averages
    Object.entries(scores).forEach(([metric, score]) => {
      if (metric !== 'final') {
        if (!patterns[actionType].averages[metric]) {
          patterns[actionType].averages[metric] = score;
        } else {
          const oldAvg = patterns[actionType].averages[metric];
          const count = patterns[actionType].count;
          patterns[actionType].averages[metric] = 
            (oldAvg * (count - 1) + score) / count;
        }
      }
    });

    // Save updated patterns
    await supabase
      .from('scoring_settings')
      .update({ pattern_data: patterns })
      .eq('workspace_id', this.workspaceId);

    this.patternData = patterns;
  }

  getRecommendedWeights(): Record<string, number> {
    // Analyze patterns to suggest weight adjustments
    const weights: Record<string, number> = {
      novelty: 1,
      impact: 1,
      timeliness: 1,
      actionability: 1
    };

    if (Object.keys(this.patternData).length === 0) {
      return weights;
    }

    // Calculate weights based on successful content patterns
    const approvedPatterns = this.patternData['approved'];
    if (approvedPatterns?.averages) {
      const total = Object.values(approvedPatterns.averages).reduce((a, b) => a + b, 0);
      Object.entries(approvedPatterns.averages).forEach(([metric, score]) => {
        weights[metric] = (score as number) / total * 4; // Normalize to sum to 4
      });
    }

    return weights;
  }
}