tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ContentFeedConfig } from '@/lib/content-feed/types';

interface FeedFiltersProps {
  config: ContentFeedConfig;
  onChange: (config: ContentFeedConfig) => void;
}

export function FeedFilters({ config, onChange }: FeedFiltersProps) {
  const handleStatusChange = (status: string[]) => {
    onChange({
      ...config,
      filters: {
        ...config.filters,
        status,
      },
    });
  };

  const handleScoreChange = (score: string) => {
    onChange({
      ...config,
      filters: {
        ...config.filters,
        minScore: parseFloat(score),
      },
    });
  };

  const handleSortChange = (field: string) => {
    onChange({
      ...config,
      sort: {
        field,
        direction: config.sort?.direction || 'desc',
      },
    });
  };

  return (
    <div className="flex flex-wrap gap-4">
      <div className="w-48">
        <Select
          value={config.filters?.status?.[0] || 'all'}
          onValueChange={(value) => handleStatusChange([value])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Content</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-48">
        <Input
          type="number"
          placeholder="Min Score"
          value={config.filters?.minScore || ''}
          onChange={(e) => handleScoreChange(e.target.value)}
          min={0}
          max={5}
          step={0.1}
        />
      </div>

      <div className="w-48">
        <Select
          value={config.sort?.field || 'created_at'}
          onValueChange={handleSortChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Date Added</SelectItem>
            <SelectItem value="published_at">Publish Date</SelectItem>
            <SelectItem value="score">Score</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
