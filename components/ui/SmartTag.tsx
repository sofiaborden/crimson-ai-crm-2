import React from 'react';
import { SparklesIcon } from '../../constants';

interface SmartTagProps {
  name: string;
  emoji: string;
  color: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showAI?: boolean;
  className?: string;
  onClick?: () => void;
}

const SmartTag: React.FC<SmartTagProps> = ({ 
  name, 
  emoji, 
  color, 
  size = 'md', 
  showAI = true, 
  className = '',
  onClick 
}) => {
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3 h-3',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const emojiSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full font-medium transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md hover:scale-105' : ''
      } ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: `${color}15`,
        border: `1px solid ${color}40`,
        color: color
      }}
      onClick={onClick}
    >
      <span className={emojiSizes[size]}>{emoji}</span>
      <span className="font-medium truncate">{name}</span>
      {showAI && (
        <SparklesIcon
          className={`${iconSizes[size]} opacity-70 flex-shrink-0`}
          style={{ color: color }}
        />
      )}
    </div>
  );
};

export default SmartTag;
