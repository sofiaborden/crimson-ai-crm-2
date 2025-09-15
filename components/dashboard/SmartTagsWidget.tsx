import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import {
  SparklesIcon,
  ArrowRightIcon,
  SettingsIcon
} from '../../constants';

interface SmartTag {
  id: string;
  name: string;
  emoji: string;
  color: 'blue' | 'green' | 'purple' | 'red' | 'orange';
  count: number;
  potentialRevenue: number;
  isActive: boolean;
}

interface SmartTagsWidgetProps {
  setView?: (view: string) => void;
  onViewSettings?: () => void;
}

const SmartTagsWidget: React.FC<SmartTagsWidgetProps> = ({ setView, onViewSettings }) => {
  // Mock data for top Smart Tags
  const smartTags: SmartTag[] = [
    {
      id: '1',
      name: 'Big Givers',
      emoji: '💰',
      color: 'green',
      count: 2847,
      potentialRevenue: 425000,
      isActive: true
    },
    {
      id: '2',
      name: 'Prime Persuadables',
      emoji: '🎯',
      color: 'purple',
      count: 1923,
      potentialRevenue: 312000,
      isActive: true
    },
    {
      id: '3',
      name: 'New & Rising Donors',
      emoji: '⚡',
      color: 'blue',
      count: 1456,
      potentialRevenue: 189000,
      isActive: true
    },
    {
      id: '4',
      name: 'Lapsed / At-Risk',
      emoji: '🕒',
      color: 'red',
      count: 3201,
      potentialRevenue: 278000,
      isActive: true
    },
    {
      id: '5',
      name: 'Not Yet Registered',
      emoji: '🚧',
      color: 'orange',
      count: 892,
      potentialRevenue: 134000,
      isActive: true
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
          border: 'border-blue-200',
          iconBg: 'bg-blue-100',
          iconText: 'text-blue-600'
        };
      case 'green':
        return {
          bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
          border: 'border-green-200',
          iconBg: 'bg-green-100',
          iconText: 'text-green-600'
        };
      case 'purple':
        return {
          bg: 'bg-gradient-to-r from-purple-50 to-violet-50',
          border: 'border-purple-200',
          iconBg: 'bg-purple-100',
          iconText: 'text-purple-600'
        };
      case 'red':
        return {
          bg: 'bg-gradient-to-r from-red-50 to-rose-50',
          border: 'border-red-200',
          iconBg: 'bg-red-100',
          iconText: 'text-red-600'
        };
      case 'orange':
        return {
          bg: 'bg-gradient-to-r from-orange-50 to-amber-50',
          border: 'border-orange-200',
          iconBg: 'bg-orange-100',
          iconText: 'text-orange-600'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-50 to-slate-50',
          border: 'border-gray-200',
          iconBg: 'bg-gray-100',
          iconText: 'text-gray-600'
        };
    }
  };

  // Calculate total potential across all active tags
  const totalPotential = smartTags.reduce((sum, tag) => sum + (tag.isActive ? tag.potentialRevenue : 0), 0);

  // Get top 4 tags by potential revenue for display
  const topTags = smartTags
    .filter(tag => tag.isActive)
    .sort((a, b) => b.potentialRevenue - a.potentialRevenue)
    .slice(0, 4);

  const handleViewAllTags = () => {
    if (onViewSettings) {
      onViewSettings();
    }
  };

  const handleTagClick = (tagId: string, tagName: string) => {
    // TODO: Implement navigation to view records with this tag
    console.log(`Viewing records for tag: ${tagName}`);
  };

  return (
    <Card className="h-full">
      <div className="p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-violet-100 to-purple-100 rounded-lg">
              <SparklesIcon className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Smart Tags</h3>
              <p className="text-sm text-gray-600">AI-powered contact labels</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-600">Total Potential</div>
            <div className="text-lg font-bold text-violet-600">
              ${(totalPotential / 1000).toFixed(0)}K
            </div>
          </div>
        </div>

        {/* Tags List - Compact Style */}
        <div className="flex-1 overflow-y-auto">
          <div className="bg-white rounded-lg border border-gray-200">
            {topTags.map((tag, index) => {
              const colors = getColorClasses(tag.color);
              return (
                <div
                  key={tag.id}
                  className={`p-3 border-b border-gray-100 last:border-b-0 transition-all hover:bg-gray-50 ${colors.bg}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <div className={`${colors.iconBg} p-1.5 rounded`}>
                        <div className="text-lg">
                          {tag.emoji}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => handleTagClick(tag.id, tag.name)}
                          className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors text-left truncate block w-full"
                        >
                          {tag.name}
                        </button>
                        <div className="text-xs text-gray-600">
                          {tag.count.toLocaleString()} • ${(tag.potentialRevenue / 1000).toFixed(0)}K potential
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTagClick(tag.id, tag.name)}
                        className="text-xs px-2 py-1 text-gray-700 hover:text-gray-900 border-gray-300 hover:border-gray-400"
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* View All Button */}
        <div className="mt-4 pt-4 border-t border-gray-200 flex-shrink-0">
          <Button
            variant="ghost"
            onClick={handleViewAllTags}
            className="w-full text-gray-700 hover:text-gray-900 flex items-center justify-center gap-2 py-3"
          >
            View All Tags
            <ArrowRightIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SmartTagsWidget;
