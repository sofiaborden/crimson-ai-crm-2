import React, { useState } from 'react';
import { ExclamationTriangleIcon, EyeIcon, CalendarIcon, HeartIcon } from '../../constants';
import Card from '../ui/Card';

const MissedOpportunityAlerts = () => {
  const [alerts] = useState([
    {
      id: 'lapsed-annual',
      type: 'lapsed_annual',
      title: 'Annual Donors Missing',
      count: 47,
      description: 'Donors who gave last year but not this year',
      urgency: 'high',
      potentialValue: 23500,
      action: 'Send reactivation campaign',
      icon: <CalendarIcon className="w-5 h-5" />
    },
    {
      id: 'high-capacity-zero',
      type: 'capacity_unused',
      title: 'High-Capacity, Zero Engagement',
      count: 12,
      description: 'Wealth score >80, no donations or interactions',
      urgency: 'high',
      potentialValue: 45000,
      action: 'Personal outreach required',
      icon: <ExclamationTriangleIcon className="w-5 h-5" />
    },
    {
      id: 'event-no-donation',
      type: 'event_attendees',
      title: 'Event Attendees, No Donations',
      count: 28,
      description: 'Attended events but never made financial contribution',
      urgency: 'medium',
      potentialValue: 8400,
      action: 'Follow-up donation ask',
      icon: <EyeIcon className="w-5 h-5" />
    },
    {
      id: 'volunteers-no-giving',
      type: 'volunteer_gap',
      title: 'Volunteers Not Giving',
      count: 15,
      description: 'Active volunteers with no financial contributions',
      urgency: 'medium',
      potentialValue: 4500,
      action: 'Volunteer appreciation + ask',
      icon: <HeartIcon className="w-5 h-5" />
    }
  ]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card title="🚨 Missed Opportunities" className="space-y-4">
      {alerts.map((alert) => (
        <div key={alert.id} className={`p-4 rounded-lg border ${getUrgencyColor(alert.urgency)}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-white shadow-sm">
                {alert.icon}
              </div>
              <div>
                <h4 className="font-semibold text-sm">{alert.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{alert.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs">
                  <span className="font-bold">{alert.count} people</span>
                  <span className="font-bold text-green-600">
                    ${alert.potentialValue.toLocaleString()} potential
                  </span>
                </div>
              </div>
            </div>
            <button className="text-xs bg-white px-3 py-1 rounded-full font-medium hover:shadow-sm">
              {alert.action}
            </button>
          </div>
        </div>
      ))}
    </Card>
  );
};