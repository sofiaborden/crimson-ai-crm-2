import React, { useState } from 'react';
import DonorProfileLayoutTest3 from './DonorProfileLayoutTest3';
import { Donor } from '../../types';
import {
  SparklesIcon,
  LockClosedIcon,
  InformationCircleIcon,
  ArrowTrendingUpIcon
} from '../../constants';

interface DonorProfileLayoutTestCoreProps {
  donor: Donor;
}

// Core-tier AI Insights component (locked/placeholder)
const CoreAIInsights: React.FC<{ donor: Donor }> = ({ donor }) => {
  const [showUpgradeTooltip, setShowUpgradeTooltip] = useState(false);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-4 shadow-sm relative overflow-hidden">
      {/* Header with Core badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SparklesIcon className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
            Core
          </span>
        </div>
        <div 
          className="relative"
          onMouseEnter={() => setShowUpgradeTooltip(true)}
          onMouseLeave={() => setShowUpgradeTooltip(false)}
        >
          <InformationCircleIcon className="w-4 h-4 text-gray-400 cursor-help" />
          {showUpgradeTooltip && (
            <div className="absolute right-0 top-6 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-10">
              <div className="font-medium mb-1">AI Insights Tiers</div>
              <div className="text-gray-300 space-y-1">
                <div><strong>Core:</strong> Basic features only</div>
                <div><strong>Growth:</strong> CRM-based predictions (~65% accuracy)</div>
                <div><strong>Enterprise:</strong> Enhanced with national data (~80% accuracy)</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Locked Content with Preview */}
      <div className="space-y-4">
        {/* Blurred preview of what's available */}
        <div className="relative">
          <div className="filter blur-sm pointer-events-none select-none">
            <div className="flex items-start gap-3 mb-3">
              <ArrowTrendingUpIcon className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-gray-900 font-medium mb-1">
                  This donor is in your top 10% of likely re-engagers this quarter.
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-600">AI Confidence:</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    High
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Suggested Ask Amount:</span> $2,500 - $5,000
                </p>
              </div>
            </div>
          </div>
          
          {/* Lock overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm">
            <div className="text-center">
              <LockClosedIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700 mb-1">Insights Not Available</p>
              <p className="text-xs text-gray-500">Upgrade to unlock AI predictions</p>
            </div>
          </div>
        </div>

        {/* Upgrade CTA */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg p-4">
          <div className="text-center space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                Unlock AI-Powered Donor Insights
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                AI Insights are available in Growth and Enterprise subscriptions. 
                Get predictive donor behavior analysis, personalized ask amounts, and campaign readiness scores.
              </p>
            </div>
            
            <div className="flex gap-2 justify-center">
              <button className="px-4 py-2 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 transition-colors">
                Upgrade to Growth
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors">
                Upgrade to Enterprise
              </button>
            </div>
            
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex justify-between">
                <span>Growth: CRM-based predictions</span>
                <span className="font-medium">~65% accuracy</span>
              </div>
              <div className="flex justify-between">
                <span>Enterprise: Enhanced with national data</span>
                <span className="font-medium">~80% accuracy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DonorProfileLayoutTestCore: React.FC<DonorProfileLayoutTestCoreProps> = ({ donor }) => {
  return (
    <DonorProfileLayoutTest3 
      donor={donor} 
      customAIInsights={<CoreAIInsights donor={donor} />}
    />
  );
};

export default DonorProfileLayoutTestCore;
