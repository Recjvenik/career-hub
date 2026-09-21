import React from 'react';
import { FolderSearch, FilterX } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No results found',
  message = 'Try adjusting your search criteria or clearing active filters.',
  actionLabel = 'Clear Filters',
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 bg-white rounded-xl border border-dashed border-gray-200 my-4">
      <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 mb-3">
        <FolderSearch className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 max-w-sm">{message}</p>
      {onAction && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onAction}
          icon={<FilterX className="w-4 h-4" />}
          className="mt-4"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
