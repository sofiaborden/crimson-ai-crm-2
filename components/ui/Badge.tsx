
import React from 'react';
import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, color = 'blue', className = '' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-crimson-blue',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-crimson-red',
    gray: 'bg-slate-100 text-slate-600',
  };

  const combinedClasses = `text-xs font-medium me-2 px-2.5 py-0.5 rounded-full ${colorClasses[color]} ${className}`;

  return <span className={combinedClasses}>{children}</span>;
};

export default Badge;