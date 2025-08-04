import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import ActionsDropdown from '../ui/ActionsDropdown';
import { 
  TrendingUpIcon, 
  TrendingDownIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  UserGroupIcon,
  BoltIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  EyeIcon,
  ChartBarIcon,
  LightBulbIcon,
  SettingsIcon
} from '../../constants';

interface SegmentAnalytics {
  id: string;
  name: string;
  icon: string;
  raised: number;
  goal: number;
  progressPercent: number;
  predictedPotential: number;
  potentialReached: number;
  conversion: number;
  avgGift: number;
  donorCount: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  bestDay: string;
  bestTime: string;
  topChannel: string;
  avgResponse: number;
  suggestedAction: string;
  priority: 'high' | 'medium' | 'low';
  monthlyData: { month: string; raised: number; predicted: number }[];
}

const segmentAnalytics: SegmentAnalytics[] = [
  {
    id: 'major-donors',
    name: 'Major Donors ($1K+)',
    icon: 'star',
    raised: 245000,
    goal: 400000,
    progressPercent: 61,
    predictedPotential: 390000,
    potentialReached: 63,
    conversion: 12.5,
    avgGift: 850,
    donorCount: 847,
    trend: 'up',
    trendValue: 23,
    bestDay: 'Tuesday',
    bestTime: '2-4 PM',
    topChannel: 'Phone',
    avgResponse: 18.5,
    suggestedAction: 'Launch year-end tax benefit campaign',
    priority: 'high',
    monthlyData: [
      { month: 'Oct', raised: 45000, predicted: 42000 },
      { month: 'Nov', raised: 67000, predicted: 65000 },
      { month: 'Dec', raised: 89000, predicted: 85000 },
      { month: 'Jan', raised: 44000, predicted: 48000 }
    ]
  },
  {
    id: 'young-professionals',
    name: 'Young Professionals',
    icon: 'users',
    raised: 42000,
    goal: 120000,
    progressPercent: 35,
    predictedPotential: 98000,
    potentialReached: 43,
    conversion: 8.2,
    avgGift: 125,
    donorCount: 1243,
    trend: 'down',
    trendValue: -15,
    bestDay: 'Thursday',
    bestTime: '6-8 PM',
    topChannel: 'Text',
    avgResponse: 24.3,
    suggestedAction: 'Switch to social media and text outreach',
    priority: 'high',
    monthlyData: [
      { month: 'Oct', raised: 15000, predicted: 18000 },
      { month: 'Nov', raised: 12000, predicted: 16000 },
      { month: 'Dec', raised: 8000, predicted: 14000 },
      { month: 'Jan', raised: 7000, predicted: 12000 }
    ]
  },
  {
    id: 'recurring-donors',
    name: 'Recurring Donors',
    icon: 'refresh',
    raised: 186000,
    goal: 210000,
    progressPercent: 89,
    predictedPotential: 198000,
    potentialReached: 94,
    conversion: 15.8,
    avgGift: 95,
    donorCount: 2156,
    trend: 'up',
    trendValue: 8,
    bestDay: 'Monday',
    bestTime: '10-12 PM',
    topChannel: 'Email',
    avgResponse: 22.1,
    suggestedAction: 'Maintain current strategy, add upgrade asks',
    priority: 'medium',
    monthlyData: [
      { month: 'Oct', raised: 42000, predicted: 41000 },
      { month: 'Nov', raised: 45000, predicted: 44000 },
      { month: 'Dec', raised: 52000, predicted: 48000 },
      { month: 'Jan', raised: 47000, predicted: 46000 }
    ]
  },
  {
    id: 'lapsed-donors',
    name: 'Lapsed Donors',
    icon: 'clock',
    raised: 8500,
    goal: 150000,
    progressPercent: 6,
    predictedPotential: 125000,
    potentialReached: 7,
    conversion: 3.1,
    avgGift: 75,
    donorCount: 3421,
    trend: 'down',
    trendValue: -8,
    bestDay: 'Saturday',
    bestTime: '11-1 PM',
    topChannel: 'Mail',
    avgResponse: 45.2,
    suggestedAction: 'Launch personalized reactivation campaign',
    priority: 'high',
    monthlyData: [
      { month: 'Oct', raised: 3000, predicted: 8000 },
      { month: 'Nov', raised: 2500, predicted: 7500 },
      { month: 'Dec', raised: 2000, predicted: 7000 },
      { month: 'Jan', raised: 1000, predicted: 6500 }
    ]
  }
];

interface ComprehensiveAnalyticsProps {
  onSegmentClick?: (segmentId: string, segmentName: string) => void;
}

const ComprehensiveAnalytics: React.FC<ComprehensiveAnalyticsProps> = ({ onSegmentClick }) => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [sortField, setSortField] = useState<keyof SegmentAnalytics>('progressPercent');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showAudienceInsights, setShowAudienceInsights] = useState(false);

  // Calculate totals
  const totalRaised = segmentAnalytics.reduce((sum, s) => sum + s.raised, 0);
  const totalPredicted = segmentAnalytics.reduce((sum, s) => sum + s.predictedPotential, 0);
  const overallProgress = Math.round((totalRaised / totalPredicted) * 100);
  const avgConversion = segmentAnalytics.reduce((sum, s) => sum + s.conversion, 0) / segmentAnalytics.length;

  const handleSort = (field: keyof SegmentAnalytics) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedSegments = [...segmentAnalytics].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const multiplier = sortDirection === 'asc' ? 1 : -1;

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return (aValue - bValue) * multiplier;
    }
    return String(aValue).localeCompare(String(bValue)) * multiplier;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      'high': 'bg-red-100 text-red-800 border-red-200',
      'medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'low': 'bg-green-100 text-green-800 border-green-200'
    };
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${styles[priority as keyof typeof styles]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const getSegmentIcon = (iconType: string) => {
    const iconProps = "w-5 h-5 text-gray-600";
    switch (iconType) {
      case 'star':
        return <SparklesIcon className={iconProps} />;
      case 'users':
        return <UserGroupIcon className={iconProps} />;
      case 'refresh':
        return <ArrowTrendingUpIcon className={iconProps} />;
      case 'clock':
        return <ClockIcon className={iconProps} />;
      default:
        return <UserGroupIcon className={iconProps} />;
    }
  };

  const getTrendIcon = (trend: string, value: number) => {
    if (trend === 'up') {
      return (
        <div className="flex items-center text-green-600">
          <TrendingUpIcon className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">+{value}%</span>
        </div>
      );
    } else if (trend === 'down') {
      return (
        <div className="flex items-center text-red-600">
          <TrendingDownIcon className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">{value}%</span>
        </div>
      );
    }
    return (
      <div className="flex items-center text-gray-600">
        <span className="text-sm font-medium">Stable</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Analytics Dashboard</h2>
          <p className="text-text-secondary">ML-powered insights and performance tracking</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-crimson-blue"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <Button
            variant="secondary"
            onClick={() => setShowAudienceInsights(!showAudienceInsights)}
          >
            {showAudienceInsights ? 'Hide' : 'Show'} Audience Insights
          </Button>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105" onClick={() => onSegmentClick?.('all-segments', 'All Segments Performance')}>
          <div className="flex items-center justify-center mb-2">
            <CurrencyDollarIcon className="w-6 h-6 lg:w-8 lg:h-8 text-green-600 mr-2" />
            <div className="text-left">
              <h3 className="text-xl lg:text-2xl font-bold text-green-700">{formatCurrency(totalRaised)}</h3>
              <p className="text-xs lg:text-sm text-green-600">Total Raised</p>
            </div>
          </div>
          <div className="w-full bg-green-200 rounded-full h-2 mt-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-green-600 mt-1">{overallProgress}% of ML-predicted potential</p>
          <div className="flex items-center justify-center mt-2 text-xs text-green-700">
            <EyeIcon className="w-3 h-3 mr-1" />
            <span>View details</span>
          </div>
        </Card>

        <Card className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105" onClick={() => onSegmentClick?.('ml-predictions', 'ML Predictions')}>
          <div className="flex items-center justify-center mb-2">
            <SparklesIcon className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600 mr-2" />
            <div className="text-left">
              <h3 className="text-xl lg:text-2xl font-bold text-blue-700">{formatCurrency(totalPredicted)}</h3>
              <p className="text-xs lg:text-sm text-blue-600">ML Predicted Potential</p>
            </div>
          </div>
          <p className="text-xs text-blue-600">{formatCurrency(totalPredicted - totalRaised)} remaining opportunity</p>
          <div className="flex items-center justify-center mt-2 text-xs text-blue-700">
            <SparklesIcon className="w-3 h-3 mr-1" />
            <span>View predictions</span>
          </div>
        </Card>

        <Card className="text-center bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105" onClick={() => onSegmentClick?.('conversion-analysis', 'Conversion Analysis')}>
          <div className="flex items-center justify-center mb-2">
            <ChartBarIcon className="w-6 h-6 lg:w-8 lg:h-8 text-purple-600 mr-2" />
            <div className="text-left">
              <h3 className="text-xl lg:text-2xl font-bold text-purple-700">{avgConversion.toFixed(1)}%</h3>
              <p className="text-xs lg:text-sm text-purple-600">Avg Conversion Rate</p>
            </div>
          </div>
          <p className="text-xs text-purple-600">Across all segments</p>
          <div className="flex items-center justify-center mt-2 text-xs text-purple-700">
            <ChartBarIcon className="w-3 h-3 mr-1" />
            <span>View analysis</span>
          </div>
        </Card>

        <Card className="text-center bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105" onClick={() => onSegmentClick?.('high-potential', 'High-Potential Donors')}>
          <div className="flex items-center justify-center mb-2">
            <UserGroupIcon className="w-6 h-6 lg:w-8 lg:h-8 text-orange-600 mr-2" />
            <div className="text-left">
              <h3 className="text-xl lg:text-2xl font-bold text-orange-700">{segmentAnalytics.reduce((sum, s) => sum + s.donorCount, 0).toLocaleString()}</h3>
              <p className="text-xs lg:text-sm text-orange-600">Total Donors</p>
            </div>
          </div>
          <div className="flex items-center justify-center mt-2 text-xs text-orange-700">
            <UserGroupIcon className="w-3 h-3 mr-1" />
            <span>View high-potential</span>
          </div>
        </Card>
      </div>

      {/* Performance Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 cursor-pointer hover:shadow-md transition-shadow" onClick={() => onSegmentClick?.('lapsed-donors', 'Lapsed Donors')}>
          <div className="flex items-center gap-3">
            <TrendingUpIcon className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">Growth Opportunities</h3>
              <p className="text-sm text-green-600">Lapsed donors show $125K potential</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-green-700">
                <EyeIcon className="w-3 h-3" />
                <span>Review donor list</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 cursor-pointer hover:shadow-md transition-shadow" onClick={() => onSegmentClick?.('recurring-donors', 'Recurring Donors')}>
          <div className="flex items-center gap-3">
            <CheckCircleIcon className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-800">Top Performers</h3>
              <p className="text-sm text-blue-600">Recurring donors at 94% potential</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-blue-700">
                <ChartBarIcon className="w-3 h-3" />
                <span>View segment details</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 cursor-pointer hover:shadow-md transition-shadow" onClick={() => onSegmentClick?.('major-donors', 'Major Donors')}>
          <div className="flex items-center gap-3">
            <LightBulbIcon className="w-8 h-8 text-purple-600" />
            <div>
              <h3 className="font-semibold text-purple-800">Quick Wins</h3>
              <p className="text-sm text-purple-600">Major donors ready for upgrade</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-purple-700">
                <SettingsIcon className="w-3 h-3" />
                <span>Optimize approach</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 cursor-pointer hover:shadow-md transition-shadow" onClick={() => onSegmentClick?.('young-professionals', 'Young Professionals')}>
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="w-8 h-8 text-orange-600" />
            <div>
              <h3 className="font-semibold text-orange-800">Areas for Improvement</h3>
              <p className="text-sm text-orange-600">Young professionals need attention</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-orange-700">
                <UserGroupIcon className="w-3 h-3" />
                <span>Review contacts</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Segment Performance Table */}
        <div className="xl:col-span-3">
          <Card title="Segment Performance Breakdown">
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('name')}>
                      <div className="flex items-center gap-1">
                        <span className="hidden sm:inline">Segment</span>
                        <span className="sm:hidden">Seg</span>
                        {sortField === 'name' && (sortDirection === 'asc' ? <ChevronUpIcon className="w-3 h-3 sm:w-4 sm:h-4" /> : <ChevronDownIcon className="w-3 h-3 sm:w-4 sm:h-4" />)}
                      </div>
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('raised')}>
                      <div className="flex items-center gap-1">
                        Raised
                        {sortField === 'raised' && (sortDirection === 'asc' ? <ChevronUpIcon className="w-3 h-3 sm:w-4 sm:h-4" /> : <ChevronDownIcon className="w-3 h-3 sm:w-4 sm:h-4" />)}
                      </div>
                    </th>
                    <th className="hidden md:table-cell px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('progressPercent')}>
                      <div className="flex items-center gap-1">
                        Progress
                        {sortField === 'progressPercent' && (sortDirection === 'asc' ? <ChevronUpIcon className="w-3 h-3 sm:w-4 sm:h-4" /> : <ChevronDownIcon className="w-3 h-3 sm:w-4 sm:h-4" />)}
                      </div>
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('conversion')}>
                      <div className="flex items-center gap-1">
                        <span className="hidden sm:inline">Conversion</span>
                        <span className="sm:hidden">Conv</span>
                        {sortField === 'conversion' && (sortDirection === 'asc' ? <ChevronUpIcon className="w-3 h-3 sm:w-4 sm:h-4" /> : <ChevronDownIcon className="w-3 h-3 sm:w-4 sm:h-4" />)}
                      </div>
                    </th>
                    <th className="hidden lg:table-cell px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('avgGift')}>
                      <div className="flex items-center gap-1">
                        Avg Gift
                        {sortField === 'avgGift' && (sortDirection === 'asc' ? <ChevronUpIcon className="w-3 h-3 sm:w-4 sm:h-4" /> : <ChevronDownIcon className="w-3 h-3 sm:w-4 sm:h-4" />)}
                      </div>
                    </th>
                    <th className="hidden xl:table-cell px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ML Potential
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedSegments.map((segment) => (
                    <tr key={segment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-2 sm:px-4 py-3 sm:py-4">
                        <div className="flex items-center">
                          <div className="mr-2 sm:mr-3">{getSegmentIcon(segment.icon)}</div>
                          <div className="min-w-0 flex-1">
                            <button
                              onClick={() => onSegmentClick?.(segment.id, segment.name)}
                              className="text-xs sm:text-sm font-medium text-crimson-blue hover:text-crimson-dark-blue underline-offset-2 hover:underline transition-colors text-left truncate block w-full"
                            >
                              <span className="hidden sm:inline">{segment.name}</span>
                              <span className="sm:hidden">{segment.name.split(' ')[0]}</span>
                            </button>
                            <div className="text-xs text-gray-500">{segment.donorCount.toLocaleString()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4">
                        <div className="text-xs sm:text-sm font-medium text-gray-900">{formatCurrency(segment.raised)}</div>
                        <div className="text-xs text-gray-500 hidden sm:block">of {formatCurrency(segment.goal)} goal</div>
                      </td>
                      <td className="hidden md:table-cell px-2 sm:px-4 py-3 sm:py-4">
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className={`h-2 rounded-full ${
                                segment.progressPercent >= 80 ? 'bg-green-500' :
                                segment.progressPercent >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(segment.progressPercent, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{segment.progressPercent}%</span>
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4">
                        <div className="text-xs sm:text-sm font-medium text-gray-900">{segment.conversion}%</div>
                        <div className="text-xs text-gray-500 hidden sm:block">{getTrendIcon(segment.trend, segment.trendValue)}</div>
                      </td>
                      <td className="hidden lg:table-cell px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">
                        {formatCurrency(segment.avgGift)}
                      </td>
                      <td className="hidden xl:table-cell px-2 sm:px-4 py-3 sm:py-4">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(segment.predictedPotential)}</div>
                        <div className="text-xs text-gray-500">{segment.potentialReached}% reached</div>
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4">
                        <ActionsDropdown
                          segmentId={segment.id}
                          segmentName={segment.name}
                          donorCount={segment.donorCount}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Detailed Segment Stats */}
          <Card title="Detailed Performance Breakdown" className="mt-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Segment</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Best Day</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Best Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Top Channel</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Response</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Suggested Action</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedSegments.map((segment) => (
                    <tr key={`${segment.id}-details`} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="mr-3">{getSegmentIcon(segment.icon)}</div>
                          <span className="text-sm font-medium text-gray-900">{segment.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{segment.bestDay}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{segment.bestTime}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {segment.topChannel === 'Phone' && <PhoneIcon className="w-4 h-4 text-blue-500" />}
                          {segment.topChannel === 'Email' && <EnvelopeIcon className="w-4 h-4 text-green-500" />}
                          {segment.topChannel === 'Text' && <span className="text-purple-500">📱</span>}
                          {segment.topChannel === 'Mail' && <span className="text-orange-500">📮</span>}
                          <span className="text-sm text-gray-900">{segment.topChannel}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{segment.avgResponse}%</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 max-w-xs truncate" title={segment.suggestedAction}>
                          {segment.suggestedAction}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {getPriorityBadge(segment.priority)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Audience Insights Sidebar */}
        {showAudienceInsights && (
          <div className="xl:col-span-1">
            <Card title="Audience Insights">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Peak Engagement</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarIcon className="w-4 h-4" />
                    <span>November & December</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Preferred Channel</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <PhoneIcon className="w-4 h-4" />
                    <span>Phone (65%)</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Top Locations</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPinIcon className="w-4 h-4" />
                    <span>TX, IL, FL</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Best Response Time</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ClockIcon className="w-4 h-4" />
                    <span>2-4 PM weekdays</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComprehensiveAnalytics;
