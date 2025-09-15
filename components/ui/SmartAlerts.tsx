import React, { useState, useEffect } from 'react';
import Card from './Card';
import Button from './Button';
import { BellIcon, XMarkIcon } from '../../constants';

interface Alert {
  id: string;
  type: 'hot_lead' | 'optimal_timing' | 'follow_up' | 'milestone';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: Date;
  actionLabel?: string;
  actionCallback?: () => void;
}

const SmartAlerts: React.FC = () => {
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'hot_lead',
      title: '🔥 Hot Lead Alert',
      message: 'Joseph Banks (Quiet Giants) hasn\'t been contacted in 8 months. Potential: $2,400',
      priority: 'high',
      timestamp: new Date(),
      actionLabel: 'Call Now',
      actionCallback: () => window.open('tel:+15551234567', '_self')
    },
    {
      id: '2',
      type: 'fatigue_risk',
      title: '⚠️ Monitor Fatigue',
      message: '234 Over Performers giving 40% above capacity - monitor for donor fatigue',
      priority: 'medium',
      timestamp: new Date(Date.now() - 2 * 60000),
      actionLabel: 'Monitor Fatigue',
      actionCallback: () => console.log('Monitor fatigue for over performers')
    },
    {
      id: '3',
      type: 'expansion_ready',
      title: '📈 Ready to Upgrade',
      message: '86 donors ready for expansion with $121K potential - upgrade ask strategy',
      priority: 'medium',
      timestamp: new Date(Date.now() - 5 * 60000),
      actionLabel: 'Monitor Fatigue',
      actionCallback: () => console.log('Monitor fatigue for expansion candidates')
    },
    {
      id: '4',
      type: 'optimal_timing',
      title: '⏰ Optimal Timing',
      message: 'Tuesday 10 AM is the best time to contact Comeback Crew (40% higher response)',
      priority: 'medium',
      timestamp: new Date(Date.now() - 10 * 60000),
      actionLabel: 'Schedule',
      actionCallback: () => console.log('Schedule campaign')
    },
    {
      id: '5',
      type: 'follow_up',
      title: '📞 Follow-up Reminder',
      message: '12 donors from Level-Up List need follow-up calls this week',
      priority: 'medium',
      timestamp: new Date(Date.now() - 15 * 60000),
      actionLabel: 'View List',
      actionCallback: () => console.log('View follow-up list')
    },
    {
      id: '6',
      type: 'milestone',
      title: '🎉 Milestone Reached',
      message: 'Neighborhood MVPs segment generated $15,000 this month!',
      priority: 'low',
      timestamp: new Date(Date.now() - 30 * 60000),
      actionLabel: 'View Report',
      actionCallback: () => console.log('View milestone report')
    }
  ]);

  const [isVisible, setIsVisible] = useState(true);

  const dismissAlert = (alertId: string) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityTextColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-800';
      case 'medium': return 'text-yellow-800';
      case 'low': return 'text-green-800';
      default: return 'text-gray-800';
    }
  };

  if (!isVisible || alerts.length === 0) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          className="bg-crimson-blue hover:bg-crimson-red text-white rounded-full p-3 shadow-lg"
        >
          <BellIcon className="w-5 h-5" />
          {alerts.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {alerts.length}
            </span>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-80">
      <Card className="shadow-xl border-2 border-crimson-blue">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BellIcon className="w-5 h-5 text-crimson-blue" />
            <h3 className="font-bold text-crimson-blue">Smart Alerts</h3>
            <span className="bg-crimson-blue text-white text-xs rounded-full px-2 py-1">
              {alerts.length}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="p-1"
          >
            <XMarkIcon className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border ${getPriorityColor(alert.priority)}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className={`font-semibold text-sm ${getPriorityTextColor(alert.priority)}`}>
                  {alert.title}
                </h4>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
              <p className={`text-xs ${getPriorityTextColor(alert.priority)} mb-2`}>
                {alert.message}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {alert.timestamp.toLocaleTimeString()}
                </span>
                {alert.actionLabel && alert.actionCallback && (
                  <Button
                    size="sm"
                    onClick={alert.actionCallback}
                    className="text-xs"
                  >
                    {alert.actionLabel}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-200">
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => setShowAllAlerts(true)}
          >
            View All Alerts
          </Button>
        </div>
      </Card>

      {/* All Alerts Modal */}
      {showAllAlerts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">All Smart Alerts</h2>
              <button
                onClick={() => setShowAllAlerts(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border ${getPriorityColor(alert.priority)}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className={`font-semibold ${getPriorityTextColor(alert.priority)}`}>
                        {alert.title}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {alert.timestamp.toLocaleString()}
                      </span>
                    </div>
                    <p className={`text-sm ${getPriorityTextColor(alert.priority)} mb-3`}>
                      {alert.message}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                        alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {alert.priority.charAt(0).toUpperCase() + alert.priority.slice(1)} Priority
                      </span>
                      {alert.actionLabel && alert.actionCallback && (
                        <Button
                          size="sm"
                          onClick={alert.actionCallback}
                          className="text-sm"
                        >
                          {alert.actionLabel}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartAlerts;
