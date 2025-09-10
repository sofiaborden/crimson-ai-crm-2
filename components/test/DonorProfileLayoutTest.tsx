import React, { useState } from 'react';
import { Donor } from '../../types';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import SmartTag from '../ui/SmartTag';
import {
  ClockIcon,
  PhoneIcon,
  BrainIcon,
  LightBulbIcon,
  MailIcon,
  MapPinIcon,
  UserIcon,
  CalendarIcon,
  TrendingUpIcon,
  StarIcon,
  CheckCircleIcon
} from '../../constants';

interface DonorProfileLayoutTestProps {
  donor: Donor;
}

const DonorProfileLayoutTest: React.FC<DonorProfileLayoutTestProps> = ({ donor }) => {
  const [activeAITab, setActiveAITab] = useState<'insights' | 'bio'>('insights');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getGiftReadiness = () => {
    if (donor.name === 'Joseph Banks') {
      return { window: 'Next 30 Days', color: 'text-green-600' };
    }
    return { window: 'Next 90 Days', color: 'text-yellow-600' };
  };

  const giftReadiness = getGiftReadiness();

  return (
    <div className="space-y-6">
      {/* Header Panel - Donor Profile Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center text-white font-bold text-xl">
              {donor.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{donor.name}</h1>
                {donor.name === 'Joseph Banks' && (
                  <SmartTag 
                    label="Level-Up List" 
                    color="purple" 
                    icon={<StarIcon className="w-3 h-3" />}
                  />
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{donor.address}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MailIcon className="w-4 h-4" />
                  <span>{donor.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <PhoneIcon className="w-4 h-4" />
                  <span>{donor.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Layout: Activity Timeline + Tabular AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Activity Timeline */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="bg-green-500 rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Gift Received</p>
                <p className="text-sm text-gray-600">$2,500 contribution via online portal</p>
                <p className="text-xs text-gray-500 mt-1">2 days ago</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="bg-blue-500 rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Email Opened</p>
                <p className="text-sm text-gray-600">Opened "Q4 Impact Report" campaign</p>
                <p className="text-xs text-gray-500 mt-1">1 week ago</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="bg-purple-500 rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Event Attendance</p>
                <p className="text-sm text-gray-600">Attended "Community Leadership Dinner"</p>
                <p className="text-xs text-gray-500 mt-1">2 weeks ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tabular AI Insights */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Tab Headers */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveAITab('insights')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeAITab === 'insights'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                AI Insights
              </button>
              <button
                onClick={() => setActiveAITab('bio')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeAITab === 'bio'
                    ? 'border-purple-500 text-purple-600 bg-purple-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                AI Smart Bio
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeAITab === 'insights' ? (
              <div className="space-y-4">
                {/* Giving Overview */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(donor.givingOverview?.totalRaised || 0)}
                    </p>
                    <p className="text-sm text-gray-600">Total Given</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(24500)}
                    </p>
                    <p className="text-sm text-gray-600">Potential</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(5000)}
                    </p>
                    <p className="text-sm text-gray-600">Suggested Ask</p>
                  </div>
                </div>

                {/* Capacity Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Capacity</span>
                    <span className="text-sm text-gray-600">62%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '62%' }}></div>
                  </div>
                </div>

                {/* Gift Readiness */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ClockIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Gift Readiness:</span>
                    <span className={`text-sm font-semibold ${giftReadiness.color}`}>
                      {giftReadiness.window}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button 
                    variant="primary" 
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <PhoneIcon className="w-4 h-4" />
                    DialR
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <MapPinIcon className="w-4 h-4" />
                    TargetPath
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Bio Generator */}
                <div className="bg-gradient-to-br from-gray-50 to-purple-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <BrainIcon className="w-4 h-4 text-purple-600" />
                    <h4 className="text-sm font-semibold text-gray-900">AI Research</h4>
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs">Perplexity</Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-700 text-sm mb-3">
                      Generate an AI-researched donor bio
                    </p>
                    <Button 
                      variant="primary" 
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2 mx-auto"
                    >
                      <BrainIcon className="w-4 h-4" />
                      Create Bio
                    </Button>
                  </div>
                </div>

                {/* Key Insights */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Insights</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <LightBulbIcon className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Strong community leader with board positions</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <TrendingUpIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Increasing gift frequency over past 2 years</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <UserIcon className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">High engagement with email campaigns</p>
                    </div>
                  </div>
                </div>

                {/* Engagement Strategy */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Engagement Strategy</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Schedule face-to-face meeting within 30 days</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <MailIcon className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Send personalized impact report</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CalendarIcon className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Invite to exclusive donor event</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorProfileLayoutTest;
