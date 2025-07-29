
import React from 'react';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  titleClassName?: string;
  onClick?: () => void;
  headerActions?: ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, titleClassName, onClick, headerActions }) => {
  const cardClasses = `bg-base-100 rounded-xl shadow-md overflow-hidden transition-all duration-300 ${onClick ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : ''} ${className}`;

  return (
    <div className={cardClasses} onClick={onClick}>
      {title && (
        <div className="p-4 sm:p-5 border-b border-base-300 flex justify-between items-center">
          <h3 className={`text-md font-semibold text-text-primary ${titleClassName}`}>{title}</h3>
          {headerActions}
        </div>
      )}
      <div className="p-4 sm:p-5">
        {children}
      </div>
    </div>
  );
};

export default Card;