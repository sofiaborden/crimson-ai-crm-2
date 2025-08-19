import React from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '../../constants';

interface SortableHeaderProps {
  label: string;
  sortKey: string;
  currentSort: {
    key: string;
    direction: 'asc' | 'desc';
  } | null;
  onSort: (key: string) => void;
  className?: string;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({
  label,
  sortKey,
  currentSort,
  onSort,
  className = ''
}) => {
  const isActive = currentSort?.key === sortKey;
  const direction = currentSort?.direction;

  return (
    <button
      onClick={() => onSort(sortKey)}
      className={`flex items-center gap-1 text-left font-medium text-gray-700 hover:text-gray-900 transition-colors ${className}`}
    >
      <span>{label}</span>
      <div className="flex flex-col">
        <ChevronUpIcon 
          className={`w-3 h-3 transition-colors ${
            isActive && direction === 'asc' 
              ? 'text-crimson-blue' 
              : 'text-gray-400'
          }`} 
        />
        <ChevronDownIcon 
          className={`w-3 h-3 -mt-1 transition-colors ${
            isActive && direction === 'desc' 
              ? 'text-crimson-blue' 
              : 'text-gray-400'
          }`} 
        />
      </div>
    </button>
  );
};

export default SortableHeader;
