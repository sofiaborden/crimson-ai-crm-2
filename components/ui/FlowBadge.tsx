import React from 'react';
import { ArrowPathIcon, EyeIcon, PencilIcon, XMarkIcon } from '../../constants';

interface FlowBadgeProps {
  flowName: string;
  flowType: 'dynamic' | 'static';
  isActive: boolean;
  size?: 'sm' | 'md';
  showActions?: boolean;
  onView?: () => void;
  onEdit?: () => void;
  onRemove?: () => void;
  className?: string;
}

const FlowBadge: React.FC<FlowBadgeProps> = ({
  flowName,
  flowType,
  isActive,
  size = 'md',
  showActions = false,
  onView,
  onEdit,
  onRemove,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4'
  };

  const baseClasses = `inline-flex items-center gap-2 rounded-lg font-medium transition-all duration-200 border ${sizeClasses[size]}`;
  
  const statusClasses = isActive
    ? 'bg-blue-50 border-blue-200 text-blue-800'
    : 'bg-gray-50 border-gray-200 text-gray-600';

  const typeIcon = flowType === 'dynamic' ? '⚡' : '📌';

  return (
    <div className={`${baseClasses} ${statusClasses} ${className}`}>
      {/* Flow Type Icon */}
      <span className="text-xs">{typeIcon}</span>
      
      {/* Flow Icon */}
      <ArrowPathIcon className={`${iconSizes[size]} flex-shrink-0`} />
      
      {/* Flow Name */}
      <span className="font-medium truncate max-w-32">{flowName}</span>
      
      {/* Status Indicator */}
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
        isActive ? 'bg-green-500' : 'bg-gray-400'
      }`} />
      
      {/* Action Buttons */}
      {showActions && (
        <div className="flex items-center gap-1 ml-1 border-l border-current border-opacity-20 pl-2">
          {onView && (
            <button
              onClick={onView}
              className="p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
              title="View flow details"
            >
              <EyeIcon className="w-3 h-3" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
              title="Edit flow"
            >
              <PencilIcon className="w-3 h-3" />
            </button>
          )}
          {onRemove && (
            <button
              onClick={onRemove}
              className="p-1 hover:bg-red-100 hover:text-red-600 rounded transition-colors"
              title="Remove flow association"
            >
              <XMarkIcon className="w-3 h-3" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FlowBadge;
