import React from 'react';
import { BRANCHES, PROJECT_TYPES } from '../../utils/constants';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { Button } from '../common/Button';

export interface ProjectFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedBranch: string;
  onBranchChange: (branch: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  onReset: () => void;
}

export const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  search,
  onSearchChange,
  selectedBranch,
  onBranchChange,
  selectedType,
  onTypeChange,
  onReset,
}) => {
  const isFiltered = search || selectedBranch !== 'All' || selectedType !== 'All';

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-xs flex flex-col gap-4">
      {/* Top Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search projects by title, technology, micro-controller..."
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

      {/* Type Segmented Tabs */}
      <div className="flex flex-col gap-3 pt-2 border-t border-gray-100 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 shrink-0">Type:</span>
          <div className="inline-flex p-1 bg-gray-100 rounded-pill shrink-0 overflow-x-auto max-w-full no-scrollbar">
            {PROJECT_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => onTypeChange(type)}
                className={`px-3 py-1 text-xs font-medium rounded-pill whitespace-nowrap transition-all cursor-pointer ${
                  selectedType === type
                    ? 'bg-white text-brand-700 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {type} {type !== 'All' ? 'Projects' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Branch Selector Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 shrink-0 mr-1">Branch:</span>
          <button
            onClick={() => onBranchChange('All')}
            className={`px-3 py-1 text-xs font-medium rounded-pill whitespace-nowrap cursor-pointer transition-all ${
              selectedBranch === 'All'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Branches
          </button>
          {BRANCHES.map((b) => (
            <button
              key={b}
              onClick={() => onBranchChange(b)}
              className={`px-3 py-1 text-xs font-medium rounded-pill whitespace-nowrap cursor-pointer transition-all ${
                selectedBranch === b
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
