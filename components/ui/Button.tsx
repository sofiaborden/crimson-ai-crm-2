
import React from 'react';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className = '', variant = 'primary', size = 'md' }) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variantClasses = {
    primary: 'bg-crimson-blue text-white hover:bg-crimson-dark-blue shadow-sm',
    secondary: 'bg-base-200 text-text-primary hover:bg-base-300 border border-slate-200',
    danger: 'bg-crimson-red text-white hover:bg-red-700 shadow-sm'
  };

  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  return (
    <button onClick={onClick} className={combinedClasses}>
      {children}
    </button>
  );
};

export default Button;