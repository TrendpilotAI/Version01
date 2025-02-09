import { Slider } from '@/components/ui/slider';
import type { CriteriaDescription } from './types';

interface CriteriaSliderProps {
  name: string;
  value: number;
  description: CriteriaDescription;
  onChange: (value: number) => void;
}

export function CriteriaSlider({ name, value, description, onChange }: CriteriaSliderProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">{description.title}</h3>
        <p className="text-sm text-gray-500">{description.description}</p>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{description.low}</span>
          <span>{description.high}</span>
        </div>
        
        <Slider
          value={[value]}
          min={1}
          max={5}
          step={0.1}
          onValueChange={([newValue]) => onChange(newValue)}
        />
        
        <div className="flex justify-center">
          <span className="text-sm font-medium">Weight: {value.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}