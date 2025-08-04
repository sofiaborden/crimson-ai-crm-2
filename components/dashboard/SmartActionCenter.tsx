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
  CheckCircleIcon
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

  // Get top 4-5 actions, prioritizing urgent and high priority
  const topActions = smartActions
    .filter(action => !completedActions.includes(action.id))
    .sort((a, b) => {
      const priorityOrder = { urgent: 3, high: 2, medium: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority] || b.confidence - a.confidence;
    })
    .slice(0, 5);

  return (
    <Card>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-crimson-blue/10 p-3 rounded-xl shadow-sm">
          <SparklesIcon className="w-5 h-5 text-crimson-blue" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Smart Actions & Prospects</h2>
          <p className="text-sm text-gray-600 mt-1">Prioritized actions to maximize fundraising today</p>
        </div>
      </div>

      {/* Donor Health Snapshot */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <HeartIcon className="w-4 h-4 text-red-500" />
          <h3 className="font-semibold text-gray-900 text-sm">Donor Health Snapshot</h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {donorHealthMetrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className={`text-lg font-bold ${getStatusColor(metric.status)}`}>
                {metric.value}
              </div>
              <div className="flex items-center justify-center gap-1 text-xs text-gray-600">
                <span>{metric.label}</span>
                {getTrendIcon(metric.trend)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Actions */}
      <div className="space-y-4">
        {topActions.map((action, index) => (
          <div key={action.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-4 hover:shadow-md hover:border-blue-200 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="bg-white p-2 rounded-xl shadow-sm border border-blue-200">
                  {getTypeIcon(action.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900 text-sm">
                      {action.contactInfo ? (
                        <button
                          onClick={() => handleDonorClick(action.contactInfo!.name)}
                          className="text-blue-600 hover:text-blue-800 underline-offset-2 hover:underline transition-colors"
                        >
                          {action.title}
                        </button>
                      ) : (
                        action.title
                      )}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full border font-semibold ${getPriorityColor(action.priority)}`}>
                      {action.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{action.description}</p>
                  <p className="text-xs text-gray-600 mb-3">{action.reason}</p>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1 text-gray-600 bg-white px-2 py-1 rounded-full">
                      <ClockIcon className="w-3 h-3" />
                      {action.estimatedTime}
                    </span>
                    <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      ${action.potentialValue.toLocaleString()}
                    </span>
                    <span className="font-bold text-crimson-blue bg-blue-50 px-2 py-1 rounded-full">
                      {action.confidence}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {action.contactInfo?.phone && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => window.open(`tel:${action.contactInfo!.phone}`, '_self')}
                  >
                    <PhoneIcon className="w-3 h-3" />
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={() => handleActionStart(action)}
                  className="bg-crimson-blue text-white hover:bg-crimson-dark-blue"
                >
                  Start
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {completedActions.length > 0 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircleIcon className="w-4 h-4" />
            <span className="text-sm font-medium">
              {completedActions.length} action{completedActions.length > 1 ? 's' : ''} completed today
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default SmartActionCenter;
