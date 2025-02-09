import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CriteriaSlider } from './criteria-slider';
import { criteriaDescriptions } from './criteria-descriptions';
import type { ScoringCriteria } from './types';

interface ScoringConfigProps {
  criteria: ScoringCriteria;
  onCriteriaChange: (criteria: ScoringCriteria) => void;
  onSave: () => Promise<void>;
}

export function ScoringConfig({ criteria, onCriteriaChange, onSave }: ScoringConfigProps) {
  const handleCriteriaChange = (key: keyof ScoringCriteria, value: number) => {
    onCriteriaChange({
      ...criteria,
      [key]: value
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scoring Algorithm Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {(Object.keys(criteria) as Array<keyof ScoringCriteria>).map((key) => (
          <CriteriaSlider
            key={key}
            name={key}
            value={criteria[key]}
            description={criteriaDescriptions[key]}
            onChange={(value) => handleCriteriaChange(key, value)}
          />
        ))}

        <Button 
          className="w-full" 
          onClick={onSave}
        >
          Update Scoring Settings
        </Button>
      </CardContent>
    </Card>
  );
}