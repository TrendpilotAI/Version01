import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';
import type { ScoringSettings } from '@/types/content';

export function ScoringConfig() {
  const [autoLearn, setAutoLearn] = useState(false);
  const [settings, setSettings] = useState<ScoringSettings['criteria']>({
    novelty: 3,
    impact: 3,
    timeliness: 3,
    actionability: 3,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Scoring Configuration</h2>
          <p className="text-muted-foreground">
            Configure how content is scored and ranked
          </p>
        </div>
        <Button>
          <Wand2 className="h-4 w-4 mr-2" />
          Auto-configure
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-learning</Label>
              <p className="text-sm text-muted-foreground">
                Automatically adjust weights based on user interactions
              </p>
            </div>
            <Switch
              checked={autoLearn}
              onCheckedChange={setAutoLearn}
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Novelty Weight</Label>
              <Slider
                value={[settings.novelty]}
                max={5}
                step={0.5}
                onValueChange={([value]) => {
                  setSettings({ ...settings, novelty: value });
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Impact Weight</Label>
              <Slider
                value={[settings.impact]}
                max={5}
                step={0.5}
                onValueChange={([value]) => {
                  setSettings({ ...settings, impact: value });
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Timeliness Weight</Label>
              <Slider
                value={[settings.timeliness]}
                max={5}
                step={0.5}
                onValueChange={([value]) => {
                  setSettings({ ...settings, timeliness: value });
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Actionability Weight</Label>
              <Slider
                value={[settings.actionability]}
                max={5}
                step={0.5}
                onValueChange={([value]) => {
                  setSettings({ ...settings, actionability: value });
                }}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-medium mb-4">Scoring Templates</h3>
          {/* TODO: Add scoring templates */}
        </Card>
      </div>
    </div>
  );
}