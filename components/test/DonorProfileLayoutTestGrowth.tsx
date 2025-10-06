import React, { useState } from 'react';
import DonorProfileLayoutTest3 from './DonorProfileLayoutTest3';
import { Donor } from '../../types';
import {
  SparklesIcon,
  TrendingUpIcon,
  UserGroupIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  InformationCircleIcon
} from '../../constants';

interface DonorProfileLayoutTestGrowthProps {
  donor: Donor;
}

// Growth-tier AI Insights component
const GrowthAIInsights: React.FC<{ donor: Donor }> = ({ donor }) => {
  const [showUpgradeTooltip, setShowUpgradeTooltip] = useState(false);

  // Generate Growth-tier insights based on donor data
  const getGrowthInsights = (donor: Donor) => {
    const insights = [
      {
        icon: TrendingUpIcon,
        text: "This donor is in your top 10% of likely re-engagers this quarter.",
        confidence: "Moderate",
        action: "Consider outreach before next campaign."
      },
      {
        icon: UserGroupIcon,
        text: "Giving potential higher than 85% of similar supporters.",
        confidence: "Moderate",
        action: "Consider mid-level upgrade approach."
      },
      {
        icon: CalendarIcon,
        text: "Frequent event attendee – likely to respond to invites.",
        confidence: "Good",
        action: "Include in next event invitation list."
      },
      {
        icon: ArrowTrendingUpIcon,
        text: "Recency suggests high engagement – consider a personalized ask.",
        confidence: "Moderate",
        action: "Schedule personalized outreach within 2 weeks."
      }
    ];

    // Return a random insight for demo purposes
    return insights[Math.floor(Math.random() * insights.length)];
  };

  const insight = getGrowthInsights(donor);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-4 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Header with Growth badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SparklesIcon className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            Growth
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
              <div className="font-medium mb-1">Growth vs Enterprise</div>
              <div className="text-gray-300">
                Growth models use your CRM data with moderate predictive accuracy (~65%). 
                Enterprise models are enhanced with national donor behavior data for higher accuracy (~80%).
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Insight */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <insight.icon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-gray-900 font-medium mb-1">{insight.text}</p>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-600">AI Confidence:</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {insight.confidence}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Suggested Action:</span> {insight.action}
            </p>
          </div>
        </div>

        {/* Upgrade CTA */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">
                Want specific ask amounts & gift readiness scores?
              </p>
              <p className="text-xs text-blue-700">
                Upgrade to Enterprise for 80% accuracy and detailed predictions
              </p>
            </div>
            <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors">
              Upgrade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DonorProfileLayoutTestGrowth: React.FC<DonorProfileLayoutTestGrowthProps> = ({ donor }) => {
  return (
    <DonorProfileLayoutTest3 
      donor={donor} 
      customAIInsights={<GrowthAIInsights donor={donor} />}
    />
  );
};

export default DonorProfileLayoutTestGrowth;
