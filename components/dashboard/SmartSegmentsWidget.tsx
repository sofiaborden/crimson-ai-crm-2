import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import {
  SparklesIcon,
  ArrowPathIcon,
  MapPinIcon,
  TrendingUpIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon
} from '../../constants';

interface SmartSegment {
  id: string;
  name: string;
  count: number;
  potential: number;
  icon: 'refresh' | 'location' | 'trending';
  color: 'blue' | 'green' | 'purple';
}

interface SmartSegmentsWidgetProps {
  setView?: (view: string) => void;
  setSegmentId?: (id: string) => void;
}

const SmartSegmentsWidget: React.FC<SmartSegmentsWidgetProps> = ({ setView, setSegmentId }) => {
  const segments: SmartSegment[] = [
    {
      id: 'comeback-crew',
      name: 'Comeback Crew',
      count: 1571,
      potential: 113000,
      icon: 'refresh',
      color: 'blue'
    },
    {
      id: 'neighborhood-mvps',
      name: 'Neighborhood MVPs',
      count: 303,
      potential: 104000,
      icon: 'location',
      color: 'green'
    },
    {
      id: 'level-up-list',
      name: 'Level-Up List',
      count: 578,
      potential: 21000,
      icon: 'trending',
      color: 'purple'
    }
  ];

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'refresh':
        return <ArrowPathIcon className="w-5 h-5" />;
      case 'location':
        return <MapPinIcon className="w-5 h-5" />;
      case 'trending':
        return <TrendingUpIcon className="w-5 h-5" />;
      default:
        return <SparklesIcon className="w-5 h-5" />;
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
          border: 'border-blue-200',
          iconBg: 'bg-blue-100',
          iconText: 'text-blue-600',
          searchIcon: 'text-blue-500'
        };
      case 'green':
        return {
          bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
          border: 'border-green-200',
          iconBg: 'bg-green-100',
          iconText: 'text-green-600',
          searchIcon: 'text-green-500'
        };
      case 'purple':
        return {
          bg: 'bg-gradient-to-r from-purple-50 to-violet-50',
          border: 'border-purple-200',
          iconBg: 'bg-purple-100',
          iconText: 'text-purple-600',
          searchIcon: 'text-purple-500'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-50 to-slate-50',
          border: 'border-gray-200',
          iconBg: 'bg-gray-100',
          iconText: 'text-gray-600',
          searchIcon: 'text-gray-500'
        };
    }
  };

  const handleViewSegment = (segmentId: string) => {
    // Navigate to fundraising page with segments view and specific segment
    setSegmentId?.(segmentId);
    setView?.('fundraising');
  };

  const handleViewAll = () => {
    // Navigate to fundraising page with segments view
    setView?.('fundraising');
  };

  return (
    <Card className="h-full">
      <div className="p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-violet-100 to-purple-100 rounded-lg">
            <SparklesIcon className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Smart Segments</h3>
            <p className="text-sm text-gray-600">AI-powered donor segments</p>
          </div>
        </div>

        {/* Segments List */}
        <div className="space-y-4 flex-1">
          {segments.map((segment) => {
            const colors = getColorClasses(segment.color);
            return (
              <div
                key={segment.id}
                className={`${colors.bg} ${colors.border} border rounded-lg p-4 transition-all hover:shadow-md`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`${colors.iconBg} p-2 rounded-lg`}>
                      <div className={colors.iconText}>
                        {getIcon(segment.icon)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-base mb-1">
                        {segment.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {segment.count.toLocaleString()} • ${(segment.potential / 1000).toFixed(0)}K potential
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {segment.color === 'green' && (
                      <div className={`p-2 rounded-lg ${colors.iconBg}`}>
                        <MagnifyingGlassIcon className={`w-4 h-4 ${colors.searchIcon}`} />
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewSegment(segment.id)}
                      className="text-gray-700 hover:text-gray-900 border-gray-300 hover:border-gray-400"
                    >
                      View
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="mt-4 pt-4 border-t border-gray-200 flex-shrink-0">
          <Button
            variant="ghost"
            onClick={handleViewAll}
            className="w-full text-gray-700 hover:text-gray-900 flex items-center justify-center gap-2 py-3"
          >
            View All {segments.length} Segments
            <ArrowRightIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SmartSegmentsWidget;
