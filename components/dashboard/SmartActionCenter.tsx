import React, { useState } from 'react';
import {
  SparklesIcon,
  PhoneIcon,
  EnvelopeIcon,
  FireIcon,
  ClockIcon,
  TrendingUpIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  HeartIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '../../constants';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { View } from '../../types';

interface SmartAction {
  id: string;
  type: 'call' | 'email' | 'review' | 'follow-up';
  priority: 'urgent' | 'high' | 'medium';
  title: string;
  description: string;
  reason: string;
  confidence: number;
  potentialValue: number;
  estimatedTime: string;
  contactInfo?: {
    name: string;
    phone?: string;
    email?: string;
  };
}

interface DonorHealthMetric {
  label: string;
  value: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

interface SmartActionCenterProps {
  setView?: (view: View) => void;
  setProfileId?: (id: string) => void;
}

const SmartActionCenter: React.FC<SmartActionCenterProps> = ({ setView, setProfileId }) => {
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const [currentActionIndex, setCurrentActionIndex] = useState(0);

  // Combined smart actions from AI Briefing and Hot Leads
  const smartActions: SmartAction[] = [
    {
      id: '1',
      type: 'call',
      priority: 'urgent',
      title: 'Call Joseph M. Banks',
      description: 'Consistent major donor ready for upgrade ask',
      reason: 'High confidence score (92%) - Ready for upgrade',
      confidence: 92,
      potentialValue: 500,
      estimatedTime: '15 min',
      contactInfo: {
        name: 'Joseph M. Banks',
        phone: '(202) 555-0182',
        email: 'j.banks.sr@example.com'
      }
    },
    {
      id: '2',
      type: 'review',
      priority: 'high',
      title: 'Review Lapsed Major Donors',
      description: '12 major donors showing decreased engagement',
      reason: 'Needs follow-up - Risk of churn',
      confidence: 85,
      potentialValue: 2400,
      estimatedTime: '20 min'
    },
    {
      id: '3',
      type: 'call',
      priority: 'high',
      title: 'Call Sarah Chen',
      description: 'New high-value prospect from FL district',
      reason: 'High likelihood to give - New prospect',
      confidence: 78,
      potentialValue: 250,
      estimatedTime: '10 min',
      contactInfo: {
        name: 'Sarah Chen',
        phone: '(305) 555-0194',
        email: 's.chen@example.com'
      }
    },
    {
      id: '4',
      type: 'follow-up',
      priority: 'medium',
      title: 'Follow up on Q4 Appeal',
      description: 'Review non-responders from recent email campaign',
      reason: 'Engagement pattern suggests quarterly contact optimal',
      confidence: 65,
      potentialValue: 1200,
      estimatedTime: '25 min'
    }
  ];

  // Donor health metrics
  const donorHealthMetrics: DonorHealthMetric[] = [
    { label: 'Active Donors', value: '2,847', status: 'good', trend: 'up' },
    { label: 'At Risk', value: '12', status: 'warning', trend: 'stable' },
    { label: 'Avg Gift Size', value: '$87', status: 'good', trend: 'up' },
    { label: 'Response Rate', value: '18%', status: 'warning', trend: 'down' }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return <PhoneIcon className="w-4 h-4 text-blue-600" />;
      case 'email': return <EnvelopeIcon className="w-4 h-4 text-green-600" />;
      case 'review': return <ChartBarIcon className="w-4 h-4 text-purple-600" />;
      case 'follow-up': return <ClockIcon className="w-4 h-4 text-orange-600" />;
      default: return <SparklesIcon className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUpIcon className="w-3 h-3 text-green-500" />;
      case 'down': return <TrendingUpIcon className="w-3 h-3 text-red-500 rotate-180" />;
      case 'stable': return <div className="w-3 h-0.5 bg-gray-400 rounded"></div>;
      default: return null;
    }
  };

  const handleActionStart = (action: SmartAction) => {
    if (action.type === 'call' && action.contactInfo?.phone) {
      window.open(`tel:${action.contactInfo.phone}`, '_self');
    } else if (action.type === 'review') {
      setView?.('segments');
    } else if (action.type === 'follow-up') {
      setView?.('analytics');
    }
    
    // Mark as completed
    setCompletedActions(prev => [...prev, action.id]);
  };

  const handleDonorClick = (name: string) => {
    if (name.includes('Joseph')) {
      setProfileId?.('joseph-banks');
      setView?.('profile');
    }
  };

  // Filter available actions and get current action
  const availableActions = smartActions
    .filter(action => !completedActions.includes(action.id))
    .sort((a, b) => {
      const priorityOrder = { urgent: 3, high: 2, medium: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority] || b.confidence - a.confidence;
    });

  const currentAction = availableActions[currentActionIndex];

  const handlePrevious = () => {
    setCurrentActionIndex(prev => prev > 0 ? prev - 1 : availableActions.length - 1);
  };

  const handleNext = () => {
    setCurrentActionIndex(prev => prev < availableActions.length - 1 ? prev + 1 : 0);
  };

  return (
    <Card className="h-80 lg:h-80 flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 mb-3 flex-shrink-0">
        <div className="bg-crimson-blue p-1.5 rounded-lg">
          <SparklesIcon className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-bold text-gray-900">Smart Actions</h2>
          <p className="text-xs text-gray-600">Prioritized actions to maximize fundraising today</p>
        </div>
      </div>

      {/* Donor Health Snapshot */}
      <div className="mb-3 p-2.5 bg-gray-50 rounded-lg flex-shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <HeartIcon className="w-3 h-3 text-red-500" />
          <h3 className="font-semibold text-gray-900 text-xs">Donor Health Snapshot</h3>
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">
          {donorHealthMetrics.map((metric, index) => (
            <div key={index} className="text-center min-w-0">
              <div className={`text-sm sm:text-base font-bold ${getStatusColor(metric.status)} truncate`}>
                {metric.value}
              </div>
              <div className="flex items-center justify-center gap-1 text-xs text-gray-600">
                <span className="truncate text-xs">{metric.label}</span>
                <div className="flex-shrink-0">
                  {getTrendIcon(metric.trend)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Actions - Single Action with Navigation */}
      <div className="flex-1 overflow-hidden min-h-0">
        {currentAction && (
          <div className="h-full flex flex-col min-h-0">
            {/* Current Action with Inline Navigation */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 p-3 hover:shadow-md hover:border-blue-200 transition-all duration-300 flex-1 relative">
              {/* Navigation Arrows */}
              {availableActions.length > 1 && (
                <>
                  <button
                    onClick={handlePrevious}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-white/90 border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all z-10"
                  >
                    <ChevronLeftIcon className="w-3 h-3 text-gray-600" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-white/90 border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all z-10"
                  >
                    <ChevronRightIcon className="w-3 h-3 text-gray-600" />
                  </button>
                </>
              )}

              <div className="flex items-start justify-between h-full px-8">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <div className="bg-white p-1.5 rounded-lg shadow-sm border border-blue-200 flex-shrink-0">
                    {getTypeIcon(currentAction.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm truncate">
                        {currentAction.contactInfo ? (
                          <button
                            onClick={() => handleDonorClick(currentAction.contactInfo!.name)}
                            className="text-blue-600 hover:text-blue-800 underline-offset-2 hover:underline transition-colors"
                          >
                            {currentAction.title}
                          </button>
                        ) : (
                          currentAction.title
                        )}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full border font-semibold flex-shrink-0 ${getPriorityColor(currentAction.priority)}`}>
                        {currentAction.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-1 line-clamp-1">{currentAction.description}</p>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-1">{currentAction.reason}</p>
                    <div className="flex items-center gap-1 text-xs flex-wrap">
                      <span className="flex items-center gap-1 text-gray-600 bg-white px-1.5 py-0.5 rounded-full flex-shrink-0">
                        <ClockIcon className="w-3 h-3" />
                        {currentAction.estimatedTime}
                      </span>
                      <span className="font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full flex-shrink-0">
                        ${currentAction.potentialValue.toLocaleString()}
                      </span>
                      <span className="font-bold text-crimson-blue bg-blue-50 px-1.5 py-0.5 rounded-full flex-shrink-0">
                        {currentAction.confidence}%
                      </span>
                    </div>
                  </div>
                </div>
                {currentAction.contactInfo?.phone && (
                  <div className="ml-2 flex-shrink-0">
                    <button
                      onClick={() => window.open(`tel:${currentAction.contactInfo!.phone}`, '_self')}
                      className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-full hover:bg-green-700 transition-colors shadow-sm flex items-center gap-1"
                      title={`Call ${currentAction.contactInfo!.phone}`}
                    >
                      <PhoneIcon className="w-3 h-3" />
                      Call
                    </button>
                  </div>
                )}
              </div>

              {/* Action Counter at Bottom */}
              {availableActions.length > 1 && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                  <span className="text-xs text-gray-500 bg-white/80 px-2 py-1 rounded-full">
                    {currentActionIndex + 1} of {availableActions.length}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {!currentAction && (
          <div className="text-center py-8 text-gray-500">
            <p>No actions available at this time.</p>
          </div>
        )}
      </div>

      {completedActions.length > 0 && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg flex-shrink-0">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircleIcon className="w-3 h-3" />
            <span className="text-xs font-medium">
              {completedActions.length} action{completedActions.length > 1 ? 's' : ''} completed today
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default SmartActionCenter;
