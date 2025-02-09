import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { scheduleDistribution } from '@/lib/api/distribution';
import type { Platform } from '@/types/distribution';

interface DistributionSchedulerProps {
  newsletterId: string;
  onScheduled: () => void;
}

export function DistributionScheduler({ newsletterId, onScheduled }: DistributionSchedulerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [platforms, setPlatforms] = useState<Platform[]>([]);

  const handleSchedule = async () => {
    try {
      await scheduleDistribution(newsletterId, platforms, selectedDate);
      onScheduled();
    } catch (error) {
      console.error('Failed to schedule distribution:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="font-medium">Select Platforms</h3>
        <Select
          onValueChange={(value: Platform) => 
            setPlatforms(prev => [...prev, value])
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="twitter">Twitter</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Schedule Date</h3>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
        />
      </div>

      <Button 
        onClick={handleSchedule}
        disabled={!selectedDate || platforms.length === 0}
      >
        Schedule Distribution
      </Button>
    </div>
  );
}