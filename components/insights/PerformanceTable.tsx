import React, { useState } from 'react';
import ActionsDropdown from '../ui/ActionsDropdown';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon,
  BellIcon,
  FireIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  CalendarIcon,
  MapPinIcon,
  SparklesIcon
} from '../../constants';

interface SegmentPerformance {
  id: string;
  segment: string;
  donorCount: number;
  actionStatus: 'needs-action' | 'in-progress' | 'completed';
  completionRate: number;
  revenueRealized: number;
  revenueInProgress: number;
  revenuePotential: number;
  lastActionDate: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  insight: string;
  recommendedAction: string;
  priority: 'high' | 'medium' | 'low';
  // New fields for enhanced insights
  fatigueRisk: 'none' | 'low' | 'medium' | 'high';
  cooldownDays: number;
  recentContactFrequency: number; // contacts per month
  preferredChannel: 'phone' | 'email' | 'mail' | 'text';
  channelPreference: number; // percentage preference
  expansionPotential: 'none' | 'low' | 'medium' | 'high';
  upgradeReadiness: number; // percentage
  lastContactDays: number;
  peakEngagementMonth: string;
}

const segmentData: SegmentPerformance[] = [
  {
    id: 'major-donors',
    segment: "Major Donors ($1K+)",
    donorCount: 847,
    actionStatus: 'in-progress',
    completionRate: 68,
    revenueRealized: 245000,
    revenueInProgress: 89000,
    revenuePotential: 156000,
    lastActionDate: '2025-01-02',
    trend: 'up',
    trendValue: 23,
    insight: "Responding well to policy-focused messaging. Holiday season driving 40% higher average gifts.",
    recommendedAction: "Double down on issue-based appeals with year-end tax benefits. Push segment to MailChimp for targeted policy messaging campaign.",
    priority: 'high',
    fatigueRisk: 'low',
    cooldownDays: 0,
    recentContactFrequency: 2.1,
    preferredChannel: 'phone',
    channelPreference: 72,
    expansionPotential: 'high',
    upgradeReadiness: 85,
    lastContactDays: 2,
    peakEngagementMonth: 'December',
  },
  {
    id: 'young-professionals',
    segment: "Young Professionals",
    donorCount: 1243,
    actionStatus: 'needs-action',
    completionRate: 34,
    revenueRealized: 42000,
    revenueInProgress: 18000,
    revenuePotential: 78000,
    lastActionDate: '2024-12-18',
    trend: 'down',
    trendValue: -15,
    insight: "Digital-first communication. Election fatigue affecting email frequency.",
    recommendedAction: "Shift to text messaging and social media outreach. Focus on issue-based content rather than donation asks.",
    priority: 'high',
    fatigueRisk: 'high',
    cooldownDays: 21,
    recentContactFrequency: 4.2,
    preferredChannel: 'text',
    channelPreference: 68,
    expansionPotential: 'medium',
    upgradeReadiness: 45,
    lastContactDays: 18,
    peakEngagementMonth: 'November',
  },
  {
    id: 'recurring-donors',
    segment: "Recurring Donors",
    donorCount: 2156,
    actionStatus: 'completed',
    completionRate: 92,
    revenueRealized: 186000,
    revenueInProgress: 12000,
    revenuePotential: 24000,
    lastActionDate: '2025-01-01',
    trend: 'up',
    trendValue: 8,
    insight: "Monthly givers stable through election cycle. Holiday messaging resonating well.",
    recommendedAction: "Prefers email outreach. 78% Not contacted in past 30 days",
    priority: 'medium',
    fatigueRisk: 'none',
    cooldownDays: 0,
    recentContactFrequency: 1.8,
    preferredChannel: 'email',
    channelPreference: 78,
    expansionPotential: 'low',
    upgradeReadiness: 25,
    lastContactDays: 3,
    peakEngagementMonth: 'December',
  },
  {
    id: 'lapsed-donors',
    segment: "Lapsed Donors (6-24mo)",
    donorCount: 3421,
    actionStatus: 'needs-action',
    completionRate: 12,
    revenueRealized: 8500,
    revenueInProgress: 0,
    revenuePotential: 125000,
    lastActionDate: '2024-11-28',
    trend: 'down',
    trendValue: -8,
    insight: "Reactivation campaigns showing low response. Need personalized approach.",
    recommendedAction: "78% Not contacted in past 30 days",
    priority: 'high',
    fatigueRisk: 'low',
    cooldownDays: 0,
    recentContactFrequency: 0.5,
    preferredChannel: 'mail',
    channelPreference: 65,
    expansionPotential: 'medium',
    upgradeReadiness: 35,
    lastContactDays: 38,
    peakEngagementMonth: 'October',
  },
  {
    id: 'event-attendees',
    segment: "Event Attendees",
    donorCount: 892,
    actionStatus: 'in-progress',
    completionRate: 56,
    revenueRealized: 67000,
    revenueInProgress: 23000,
    revenuePotential: 45000,
    lastActionDate: '2024-12-30',
    trend: 'stable',
    trendValue: 5,
    insight: "Strong engagement post-events. Converting well to monthly giving.",
    recommendedAction: "Prefers phone outreach",
    priority: 'medium',
    fatigueRisk: 'low',
    cooldownDays: 7,
    recentContactFrequency: 2.8,
    preferredChannel: 'phone',
    channelPreference: 82,
    expansionPotential: 'high',
    upgradeReadiness: 70,
    lastContactDays: 5,
    peakEngagementMonth: 'November',
  },
  {
    id: 'over-performers',
    segment: "Over-Performers",
    donorCount: 234,
    actionStatus: 'in-progress',
    completionRate: 78,
    revenueRealized: 125000,
    revenueInProgress: 45000,
    revenuePotential: 25000,
    lastActionDate: '2024-12-20',
    trend: 'stable',
    trendValue: 5,
    insight: "Giving 40% above predicted capacity. Monitor for fatigue, focus on stewardship and recognition.",
    recommendedAction: "Implement thank-you campaign and donor spotlight program. Cool-down period recommended before next major ask.",
    priority: 'medium',
    fatigueRisk: 'medium',
    cooldownDays: 14,
    recentContactFrequency: 3.5,
    preferredChannel: 'phone',
    channelPreference: 82,
    expansionPotential: 'low',
    upgradeReadiness: 25,
    lastContactDays: 16,
    peakEngagementMonth: 'December',
  },
  {
    id: 'under-performers',
    segment: "Under-Performers",
    donorCount: 1876,
    actionStatus: 'needs-action',
    completionRate: 8,
    revenueRealized: 12000,
    revenueInProgress: 0,
    revenuePotential: 245000,
    lastActionDate: '2024-11-15',
    trend: 'down',
    trendValue: -12,
    insight: "Giving 60% below capacity — $245K untapped potential. High wealth indicators but low engagement patterns.",
    recommendedAction: "Diagnostic campaign needed to understand barriers. Consider wealth screening refresh and personalized outreach strategy.",
    priority: 'high',
    fatigueRisk: 'none',
    cooldownDays: 0,
    recentContactFrequency: 0.8,
    preferredChannel: 'mail',
    channelPreference: 58,
    expansionPotential: 'high',
    upgradeReadiness: 75,
    lastContactDays: 51,
    peakEngagementMonth: 'September',
  }
];

interface PerformanceTableProps {
  onSegmentClick?: (segmentId: string, segmentName: string) => void;
}

const PerformanceTable: React.FC<PerformanceTableProps> = ({ onSegmentClick }) => {
  const [sortField, setSortField] = useState<keyof SegmentPerformance>('completionRate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<'all' | 'needs-action' | 'in-progress' | 'completed'>('all');
  const [showOnlyNeedsAttention, setShowOnlyNeedsAttention] = useState(false);

  const handleSort = (field: keyof SegmentPerformance) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedData = segmentData
    .filter(segment => {
      if (filterStatus !== 'all' && segment.actionStatus !== filterStatus) return false;
      if (showOnlyNeedsAttention && segment.priority !== 'high') return false;
      return true;
    })
    .sort((a, b) => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Segment Performance Details</h2>
        <p className="text-text-secondary">Detailed performance metrics and insights for all segments</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-crimson-blue"
          >
            <option value="all">All Status</option>
            <option value="needs-action">Needs Action</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showOnlyNeedsAttention}
              onChange={(e) => setShowOnlyNeedsAttention(e.target.checked)}
              className="w-4 h-4 text-crimson-blue border-gray-300 rounded focus:ring-crimson-blue"
            />
            High Priority Only
          </label>

          <div className="text-sm text-gray-500">
            Showing {filteredAndSortedData.length} of {segmentData.length} segments
          </div>
        </div>
      </div>

      {/* Performance Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('segment')}>
                  <div className="flex items-center gap-1">
                    Segment
                    {sortField === 'segment' && (
                      sortDirection === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('donorCount')}>
                  <div className="flex items-center gap-1">
                    Donors
                    {sortField === 'donorCount' && (
                      sortDirection === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('actionStatus')}>
                  <div className="flex items-center gap-1">
                    Status
                    {sortField === 'actionStatus' && (
                      sortDirection === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('completionRate')}>
                  <div className="flex items-center gap-1">
                    Completion
                    {sortField === 'completionRate' && (
                      sortDirection === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('revenueRealized')}>
                  <div className="flex items-center gap-1">
                    Revenue Realized
                    {sortField === 'revenueRealized' && (
                      sortDirection === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedData.map((segment) => (
                <tr key={segment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <button
                        onClick={() => onSegmentClick?.(segment.id, segment.segment)}
                        className="text-sm font-medium text-crimson-blue hover:text-crimson-dark-blue underline-offset-2 hover:underline transition-colors text-left"
                      >
                        {segment.segment}
                      </button>
                      <div className="text-xs text-gray-500 mt-1">{segment.insight}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => onSegmentClick?.(segment.id, segment.segment)}
                      className="text-crimson-blue hover:text-crimson-dark-blue transition-colors font-medium"
                    >
                      {segment.donorCount.toLocaleString()}
                    </button>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      segment.actionStatus === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                      segment.actionStatus === 'in-progress' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      'bg-red-100 text-red-800 border-red-200'
                    }`}>
                      {segment.actionStatus === 'needs-action' ? 'Needs Action' :
                       segment.actionStatus === 'in-progress' ? 'In Progress' : 'Completed'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${
                            segment.completionRate >= 80 ? 'bg-green-500' :
                            segment.completionRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${segment.completionRate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{segment.completionRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(segment.revenueRealized)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTable;
