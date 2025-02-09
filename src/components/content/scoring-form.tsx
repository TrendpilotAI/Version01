import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import type { ScoringSettings } from '@/types/content';

interface ScoringFormProps {
  settings: ScoringSettings;
  onSave: (criteria: ScoringSettings['criteria']) => Promise<void>;
}

export function ScoringForm({ settings, onSave }: ScoringFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(settings.criteria);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Novelty</Label>
          <Slider
            defaultValue={[settings.criteria.novelty]}
            max={5}
            step={1}
            onValueChange={([value]) => {
              settings.criteria.novelty = value;
            }}
          />
        </div>

        <div className="space-y-2">
          <Label>Impact</Label>
          <Slider
            defaultValue={[settings.criteria.impact]}
            max={5}
            step={1}
            onValueChange={([value]) => {
              settings.criteria.impact = value;
            }}
          />
        </div>

        <div className="space-y-2">
          <Label>Timeliness</Label>
          <Slider
            defaultValue={[settings.criteria.timeliness]}
            max={5}
            step={1}
            onValueChange={([value]) => {
              settings.criteria.timeliness = value;
            }}
          />
        </div>

        <div className="space-y-2">
          <Label>Actionability</Label>
          <Slider
            defaultValue={[settings.criteria.actionability]}
            max={5}
            step={1}
            onValueChange={([value]) => {
              settings.criteria.actionability = value;
            }}
          />
        </div>
      </div>

      <Button type="submit">Save Settings</Button>
    </form>
  );
}