import { useState } from 'react';

// Components
import { ContentHeader } from './ContentHeader';
import { ContentFilters } from './ContentFilters';
import { ContentGrid } from './ContentGrid';

// Hooks
import { useContent } from '@/hooks/useContent';

export function ContentDashboard() {
  const [filter, setFilter] = useState('all');
  const { content, isLoading } = useContent();

  return (
    <div className="space-y-6">
      <ContentHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9">
          <ContentFilters activeFilter={filter} onFilterChange={setFilter} />
          <div className="mt-4">
            <ContentGrid content={content} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}