import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { Button } from '../common/Button';

export interface CourseFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onReset: () => void;
}

const CATEGORIES = [
  'All',
  'Data & Analytics',
  'Software Engineering',
  'Business & Office Productivity',
  'Core Engineering',
  'Enterprise Solutions',
];

export const CourseFilters: React.FC<CourseFiltersProps> = ({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onReset,
}) => {
  const isFiltered = search || selectedCategory !== 'All';

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-xs flex flex-col gap-4">
      {/* Search Input */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search course title, focus area, student outcome..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-gray-50/50"
          />
        </div>

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            className="shrink-0 text-gray-500"
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar pt-2 border-t border-gray-100">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 shrink-0 mr-1">Category:</span>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-3 py-1 text-xs font-medium rounded-pill whitespace-nowrap cursor-pointer transition-all ${
              selectedCategory === cat
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
