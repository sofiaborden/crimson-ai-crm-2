import React from 'react';
import Button from './Button';

interface ActionButtonProps {
  type: 'call' | 'email' | 'calendar' | 'campaign' | 'export';
  phoneNumber?: string;
  email?: string;
  subject?: string;
  body?: string;
  eventTitle?: string;
  eventDate?: string;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
  onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  type,
  phoneNumber,
  email,
  subject,
  body,
  eventTitle,
  eventDate,
  children,
  className,
  size = 'sm',
  variant = 'primary',
  onClick
}) => {
  const handleClick = () => {
    switch (type) {
      case 'call':
        if (phoneNumber) {
          window.open(`tel:${phoneNumber}`, '_self');
          // Track call attempt
          console.log(`Call initiated to ${phoneNumber}`);
        }
        break;
      
      case 'email':
        if (email) {
          const mailtoLink = `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}${body ? `&body=${encodeURIComponent(body)}` : ''}`;
          window.open(mailtoLink, '_self');
          // Track email attempt
          console.log(`Email initiated to ${email}`);
        }
        break;
      
      case 'calendar':
        if (eventTitle && eventDate) {
          // Create calendar event (simplified - in real app would integrate with calendar APIs)
          const startDate = new Date(eventDate);
          const endDate = new Date(startDate.getTime() + 30 * 60000); // 30 minutes later
          
          const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;
          window.open(googleCalendarUrl, '_blank');
          console.log(`Calendar event created: ${eventTitle}`);
        }
        break;
      
      case 'campaign':
        // Handle campaign launch
        console.log('Campaign launched');
        break;
      
      case 'export':
        // Handle export
        console.log('Export initiated');
        break;
    }
    
    if (onClick) {
      onClick();
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
};

export default ActionButton;
