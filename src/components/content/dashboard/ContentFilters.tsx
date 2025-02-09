import { Button } from '@/components/ui/button';

interface ContentFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function ContentFilters({ activeFilter, onFilterChange }: ContentFiltersProps) {
  const filters = [
    { id: 'all', label: 'All Content' },
    { id: 'pending', label: 'Pending' },
    { id: 'approved', label: 'Approved' },
    { id: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="flex gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={activeFilter === filter.id ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange(filter.id)}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}