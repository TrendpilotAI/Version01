import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Filter,
  Calendar as CalendarIcon,
  Languages,
  Globe,
  SortAsc,
  SortDesc,
} from 'lucide-react';

interface SearchFilters {
  query: string;
  category: string;
  language: string;
  country: string;
  fromDate: Date | undefined;
  toDate: Date | undefined;
  sortBy: 'relevancy' | 'popularity' | 'publishedAt';
  sortOrder: 'asc' | 'desc';
  minScore: number;
}

interface AdvancedSearchProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
}

export function AdvancedSearch({ filters, onFiltersChange, onSearch }: AdvancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleApplyFilters = () => {
    setIsOpen(false);
    onSearch();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Advanced Filters
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px]">
        <SheetHeader>
          <SheetTitle>Advanced Search</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label>Keywords</Label>
            <Input
              placeholder="Search terms..."
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={filters.category}
              onValueChange={(value) => handleFilterChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Language</Label>
            <Select
              value={filters.language}
              onValueChange={(value) => handleFilterChange('language', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
                <Languages className="h-4 w-4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Country</Label>
            <Select
              value={filters.country}
              onValueChange={(value) => handleFilterChange('country', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
                <Globe className="h-4 w-4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="gb">United Kingdom</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date Range</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">From</Label>
                <Calendar
                  mode="single"
                  selected={filters.fromDate}
                  onSelect={(date) => handleFilterChange('fromDate', date)}
                  disabled={(date) =>
                    date > new Date() || (filters.toDate ? date > filters.toDate : false)
                  }
                />
              </div>
              <div>
                <Label className="text-xs">To</Label>
                <Calendar
                  mode="single"
                  selected={filters.toDate}
                  onSelect={(date) => handleFilterChange('toDate', date)}
                  disabled={(date) =>
                    date > new Date() || (filters.fromDate ? date < filters.fromDate : false)
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sort By</Label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => handleFilterChange('sortBy', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevancy">Relevance</SelectItem>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="publishedAt">Date Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Sort Order</Label>
            <Select
              value={filters.sortOrder}
              onValueChange={(value) => handleFilterChange('sortOrder', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">
                  <div className="flex items-center">
                    <SortDesc className="h-4 w-4 mr-2" />
                    Descending
                  </div>
                </SelectItem>
                <SelectItem value="asc">
                  <div className="flex items-center">
                    <SortAsc className="h-4 w-4 mr-2" />
                    Ascending
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Minimum Score</Label>
            <Input
              type="number"
              min="0"
              max="5"
              step="0.5"
              value={filters.minScore}
              onChange={(e) => handleFilterChange('minScore', parseFloat(e.target.value))}
            />
          </div>

          <Button className="w-full" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}