import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import {
  SparklesIcon,
  PhoneIcon,
  MailIcon,
  EnvelopeIcon,
  UserIcon,
  ClockIcon,
  HeartIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '../../constants';

interface SmartAction {
  id: string;
  type: 'call' | 'email' | 'review' | 'follow-up' | 'discovery';
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
  segment?: string;
  count?: number;
}

interface SmartActionCenterProps {
  setView?: (view: string) => void;
  setProfileId?: (id: string) => void;
}

const SmartActionCenter: React.FC<SmartActionCenterProps> = ({ setView, setProfileId }) => {
  const [currentActionIndex, setCurrentActionIndex] = useState(0);
  const [showLookalikeModal, setShowLookalikeModal] = useState(false);
  const [lookalikeData, setLookalikeData] = useState<{segment: string, count: number} | null>(null);

  const smartActions: SmartAction[] = [
    {
      id: '1',
      type: 'call',
      priority: 'urgent',
      title: 'Call Joseph Banks',
      description: 'Follow up on major gift opportunity',
      reason: 'Missed last 2 scheduled calls, high capacity donor',
      confidence: 92,
      potentialValue: 25000,
      estimatedTime: '15 min',
      contactInfo: {
        name: 'Joseph Banks',
        phone: '(555) 123-4567',
        email: 'joseph.banks@email.com'
      }
    },
    {
      id: '2',
      type: 'discovery',
      priority: 'high',
      title: '500 Donor Lookalikes for Major Donor Segment',
      description: 'Review potential major donors in Donor Discovery',
      reason: 'AI identified high-similarity prospects',
      confidence: 87,
      potentialValue: 15000,
      estimatedTime: '30 min',
      segment: 'Major Donors',
      count: 500
    },
    {
      id: '3',
      type: 'email',
      priority: 'high',
      title: 'Email Maria Rodriguez',
      description: 'Send personalized stewardship message',
      reason: 'Recent $5K gift, perfect timing for cultivation',
      confidence: 85,
      potentialValue: 8000,
      estimatedTime: '10 min',
      contactInfo: {
        name: 'Maria Rodriguez',
        email: 'maria.rodriguez@email.com'
      }
    }
  ];

  const completedActions = [
    { id: 'c1', title: 'Called David Chen', completedAt: new Date() },
    { id: 'c2', title: 'Sent thank you to Sarah Wilson', completedAt: new Date() }
  ];

  const donorHealthMetrics = [
    { label: 'At Risk', value: '12', status: 'warning', trend: 'down' },
    { label: 'Engaged', value: '156', status: 'good', trend: 'up' },
    { label: 'New', value: '23', status: 'neutral', trend: 'stable' },
    { label: 'Lapsed', value: '8', status: 'bad', trend: 'down' }
  ];

  const availableActions = smartActions.filter(action => !completedActions.some(completed => completed.id === action.id));
  const currentAction = availableActions[currentActionIndex];

  const handlePrevious = () => {
    setCurrentActionIndex(prev => prev > 0 ? prev - 1 : availableActions.length - 1);
  };

  const handleNext = () => {
    setCurrentActionIndex(prev => prev < availableActions.length - 1 ? prev + 1 : 0);
  };

  const handleDonorClick = (name: string) => {
    if (name.includes('Joseph')) {
      setProfileId?.('joseph-banks');
      setView?.('profile');
    }
  };

  const handleDiscoveryClick = (segment: string, count: number) => {
    setLookalikeData({ segment, count });
    setShowLookalikeModal(true);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return <PhoneIcon className="w-4 h-4 text-green-600" />;
      case 'email': return <MailIcon className="w-4 h-4 text-blue-600" />;
      case 'review': return <UserIcon className="w-4 h-4 text-blue-600" />;
      case 'follow-up': return <ClockIcon className="w-4 h-4 text-orange-600" />;
      case 'discovery': return <UserGroupIcon className="w-4 h-4 text-indigo-600" />;
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
      case 'bad': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUpIcon className="w-3 h-3 text-green-500" />;
      case 'down': return <TrendingDownIcon className="w-3 h-3 text-red-500" />;
      default: return <div className="w-3 h-3 flex items-center justify-center text-gray-400 font-bold">—</div>;
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300">
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-blue-100 rounded-lg">
            <SparklesIcon className="w-4 h-4 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-gray-900">Smart Actions</h3>
            <p className="text-xs text-gray-600">AI-powered fundraising recommendations</p>
          </div>
        </div>

        {/* Donor Health Snapshot - Compact */}
        <div className="mb-3 p-2 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <HeartIcon className="w-3 h-3 text-red-500" />
            <h4 className="font-medium text-gray-900 text-xs">Donor Health Snapshot</h4>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {donorHealthMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className={`text-sm font-bold ${getStatusColor(metric.status)}`}>
                  {metric.value}
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-xs text-gray-600">{metric.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Actions */}
        <div className="bg-white rounded-lg border border-blue-100 flex-1 min-h-0 overflow-hidden relative">
          {/* Fixed Navigation Arrows - Positioned Lower */}
          {availableActions.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-3 top-16 p-1.5 bg-white/95 border border-blue-200 rounded-full shadow-sm hover:shadow-md transition-all z-20 backdrop-blur-sm"
              >
                <ChevronLeftIcon className="w-3 h-3 text-blue-600" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-3 top-16 p-1.5 bg-white/95 border border-blue-200 rounded-full shadow-sm hover:shadow-md transition-all z-20 backdrop-blur-sm"
              >
                <ChevronRightIcon className="w-3 h-3 text-blue-600" />
              </button>
            </>
          )}

          {currentAction && (
            <div className="h-full flex flex-col">
              <div className="p-4 flex-1 overflow-y-auto pb-2">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex-shrink-0">
                    {getTypeIcon(currentAction.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-semibold text-gray-900 text-base leading-tight">
                        {currentAction.type === 'discovery' ? (
                          <button
                            onClick={() => handleDiscoveryClick(currentAction.segment!, currentAction.count!)}
                            className="text-blue-600 hover:text-blue-800 underline-offset-2 hover:underline transition-colors text-left"
                          >
                            {currentAction.title}
                          </button>
                        ) : currentAction.contactInfo ? (
                          <button
                            onClick={() => handleDonorClick(currentAction.contactInfo!.name)}
                            className="text-blue-600 hover:text-blue-800 underline-offset-2 hover:underline transition-colors text-left"
                          >
                            {currentAction.title}
                          </button>
                        ) : (
                          currentAction.title
                        )}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${getPriorityColor(currentAction.priority)}`}>
                        {currentAction.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">{currentAction.description}</p>
                    <p className="text-xs text-gray-600 mb-3 leading-relaxed">{currentAction.reason}</p>
                  </div>
                </div>

                {/* Simplified Metrics - Single Row */}
                <div className="flex items-center justify-between mb-3 p-3 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-emerald-700 font-medium text-xs">Potential Value</p>
                    <p className="text-emerald-900 font-bold text-lg">${currentAction.potentialValue.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 text-xs">Time Est.</p>
                    <p className="text-gray-900 font-semibold">{currentAction.estimatedTime}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-blue-600 text-xs opacity-75">Confidence</p>
                    <p className="text-blue-700 text-sm font-medium">{currentAction.confidence}%</p>
                  </div>
                </div>

                {/* Action Button and Additional Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {currentAction.count && (
                      <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        {currentAction.count} prospects
                      </span>
                    )}
                    {/* Pagination Indicator - moved here to save space */}
                    {availableActions.length > 1 && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {currentActionIndex + 1} of {availableActions.length}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Action buttons for all action types */}
                    {currentAction.type === 'call' && currentAction.contactInfo?.phone && (
                      <button
                        onClick={() => window.open(`tel:${currentAction.contactInfo!.phone}`, '_self')}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm flex items-center gap-2"
                        title={`Call ${currentAction.contactInfo!.phone}`}
                      >
                        <PhoneIcon className="w-4 h-4" />
                        Call Now
                      </button>
                    )}
                    {currentAction.type === 'email' && currentAction.contactInfo?.email && (
                      <button
                        onClick={() => window.open(`mailto:${currentAction.contactInfo!.email}`, '_self')}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm flex items-center gap-2"
                        title={`Email ${currentAction.contactInfo!.email}`}
                      >
                        <EnvelopeIcon className="w-4 h-4" />
                        Send Email
                      </button>
                    )}
                    {currentAction.type === 'discovery' && (
                      <button
                        onClick={() => handleDiscoveryClick(currentAction.segment!, currentAction.count!)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm flex items-center gap-2"
                      >
                        <MagnifyingGlassIcon className="w-4 h-4" />
                        View Prospects
                      </button>
                    )}
                    {(currentAction.type === 'review' || currentAction.type === 'follow-up') && (
                      <button
                        onClick={() => handleDonorClick(currentAction.contactInfo?.name || currentAction.title)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm flex items-center gap-2"
                      >
                        <CheckCircleIcon className="w-4 h-4" />
                        Take Action
                      </button>
                    )}
                  </div>
                </div>
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
          <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircleIcon className="w-3 h-3" />
              <span className="text-xs font-medium">
                {completedActions.length} action{completedActions.length > 1 ? 's' : ''} completed today
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Lookalike Modal */}
      {showLookalikeModal && lookalikeData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <UserGroupIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Donor Discovery</h3>
                  <p className="text-sm text-gray-600">{lookalikeData.count} lookalikes for {lookalikeData.segment}</p>
                </div>
              </div>
              <button
                onClick={() => setShowLookalikeModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-blue-900">AI-Powered Prospect Discovery</h4>
                    <p className="text-sm text-blue-700">These prospects share similar characteristics with your {lookalikeData.segment} donors, including giving patterns, demographics, and engagement behaviors.</p>
                  </div>
                </div>
              </div>

              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg font-medium">Loading {lookalikeData.count} donor prospects...</p>
                <p className="text-sm text-gray-500 mt-2">This feature will be fully integrated with the Donor Discovery system</p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowLookalikeModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowLookalikeModal(false);
                    // Navigate to donor discovery page
                    setView?.('donor-discovery');
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Go to Donor Discovery
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default SmartActionCenter;
