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
  CalendarIcon,
  ChartBarIcon,
  UserGroupIcon,
  TrendingUpIcon,
  ArrowTrendingUpIcon,
  MapPinIcon,
  BellIcon,
  FireIcon,
  SparklesIcon
} from '../../constants.tsx';

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
  geographicCluster: string;
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
    geographicCluster: 'TX, IL, FL'
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
    trendValue: 15,
    insight: "Prefer digital-first communication. Election fatigue affecting small-dollar frequency.",
    recommendedAction: "Shift to social media and text campaigns with lighter touch. Create targeted segment in CRM for digital-first outreach strategy.",
    priority: 'high',
    fatigueRisk: 'high',
    cooldownDays: 14,
    recentContactFrequency: 4.2,
    preferredChannel: 'email',
    channelPreference: 68,
    expansionPotential: 'medium',
    upgradeReadiness: 45,
    lastContactDays: 18,
    peakEngagementMonth: 'October',
    geographicCluster: 'CA, NY, WA'
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
    recommendedAction: "Expand monthly giving program with holiday upgrade asks. Add segment to DialR for personalized upgrade calls targeting $50+ increase.",
    priority: 'medium',
    fatigueRisk: 'none',
    cooldownDays: 0,
    recentContactFrequency: 1.5,
    preferredChannel: 'email',
    channelPreference: 78,
    expansionPotential: 'high',
    upgradeReadiness: 72,
    lastContactDays: 1,
    peakEngagementMonth: 'November',
    geographicCluster: 'TX, FL, OH'
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
    trendValue: 5,
    insight: "Reactivation campaigns showing low response. Need personalized approach.",
    recommendedAction: "Launch targeted win-back campaign with impact stories. Create segment for A/B testing personalized vs. general messaging approaches.",
    priority: 'high',
    fatigueRisk: 'none',
    cooldownDays: 0,
    recentContactFrequency: 0.8,
    preferredChannel: 'mail',
    channelPreference: 65,
    expansionPotential: 'low',
    upgradeReadiness: 25,
    lastContactDays: 51,
    peakEngagementMonth: 'September',
    geographicCluster: 'PA, MI, WI'
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
    trendValue: 2,
    insight: "Strong engagement post-events. Converting well to monthly giving.",
    recommendedAction: "Follow up with monthly giving conversion campaign within 48 hours. Push segment to MailChimp for automated 3-email conversion series.",
    priority: 'medium',
    fatigueRisk: 'low',
    cooldownDays: 0,
    recentContactFrequency: 2.8,
    preferredChannel: 'phone',
    channelPreference: 58,
    expansionPotential: 'high',
    upgradeReadiness: 68,
    lastContactDays: 8,
    peakEngagementMonth: 'March',
    geographicCluster: 'DC, VA, MD'
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
    geographicCluster: 'NY, CT, NJ'
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
    trendValue: 28,
    insight: "Giving 60% below capacity — $245K untapped potential. High wealth indicators but low engagement patterns.",
    recommendedAction: "Diagnostic campaign to identify barriers. A/B test messaging approaches and create re-engagement segment for targeted outreach.",
    priority: 'high',
    fatigueRisk: 'none',
    cooldownDays: 0,
    recentContactFrequency: 0.5,
    preferredChannel: 'email',
    channelPreference: 45,
    expansionPotential: 'high',
    upgradeReadiness: 65,
    lastContactDays: 51,
    peakEngagementMonth: 'June',
    geographicCluster: 'AZ, NV, CO'
  }
];

interface AudienceInsightsProps {
  onSegmentClick?: (segmentId: string, segmentName: string) => void;
}

const AudienceInsights: React.FC<AudienceInsightsProps> = ({ onSegmentClick }) => {
  const [sortField, setSortField] = useState<keyof SegmentPerformance>('completionRate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<'all' | 'needs-action' | 'in-progress' | 'completed'>('all');
  const [showOnlyNeedsAttention, setShowOnlyNeedsAttention] = useState(false);
  const [isTrackerExpanded, setIsTrackerExpanded] = useState(true);

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
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      'needs-action': 'bg-red-100 text-red-800 border-red-200',
      'in-progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'completed': 'bg-green-100 text-green-800 border-green-200'
    };

    const labels = {
      'needs-action': 'Needs Action',
      'in-progress': 'In Progress',
      'completed': 'Completed'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getTrendIcon = (trend: string, value: number) => {
    if (trend === 'up') {
      return <span className="text-green-600 flex items-center gap-1"><TrendingUpIcon className="w-3 h-3" /> +{value}%</span>;
    } else if (trend === 'down') {
      return <span className="text-red-600 flex items-center gap-1"><TrendingUpIcon className="w-3 h-3 rotate-180" /> -{value}%</span>;
    } else {
      return <span className="text-gray-600 flex items-center gap-1"><TrendingUpIcon className="w-3 h-3 rotate-90" /> {value}%</span>;
    }
  };

  const getFatigueRiskBadge = (risk: string, cooldownDays: number) => {
    const styles = {
      'none': 'bg-green-100 text-green-800 border-green-200',
      'low': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'medium': 'bg-orange-100 text-orange-800 border-orange-200',
      'high': 'bg-red-100 text-red-800 border-red-200'
    };

    const icons = {
      'none': <span className="w-2 h-2 bg-green-500 rounded-full" />,
      'low': <ClockIcon className="w-3 h-3" />,
      'medium': <ExclamationTriangleIcon className="w-3 h-3" />,
      'high': <BellIcon className="w-3 h-3" />
    };

    const labels = {
      'none': 'No Risk',
      'low': 'Low Risk',
      'medium': `Cool-down ${cooldownDays}d`,
      'high': `Cool-down ${cooldownDays}d`
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${styles[risk as keyof typeof styles]}`}>
        {icons[risk as keyof typeof icons]}
        {labels[risk as keyof typeof labels]}
      </span>
    );
  };

  const getChannelIcon = (channel: string) => {
    const icons = {
      'phone': <PhoneIcon className="w-3 h-3 text-blue-600" />,
      'email': <EnvelopeIcon className="w-3 h-3 text-green-600" />,
      'mail': <EnvelopeIcon className="w-3 h-3 text-purple-600" />,
      'text': <EnvelopeIcon className="w-3 h-3 text-orange-600" />
    };
    return icons[channel as keyof typeof icons] || icons.email;
  };

  const getExpansionBadge = (potential: string, readiness: number) => {
    const styles = {
      'none': 'bg-gray-100 text-gray-800',
      'low': 'bg-blue-100 text-blue-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-green-100 text-green-800'
    };

    const icons = {
      'none': <span className="w-2 h-2 bg-gray-400 rounded-full" />,
      'low': <SparklesIcon className="w-3 h-3" />,
      'medium': <TrendingUpIcon className="w-3 h-3" />,
      'high': <FireIcon className="w-3 h-3" />
    };

    if (potential === 'none') return null;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${styles[potential as keyof typeof styles]}`}>
        {icons[potential as keyof typeof icons]}
        {readiness}% Ready
      </span>
    );
  };

  const SortableHeader = ({ field, children }: { field: keyof SegmentPerformance; children: React.ReactNode }) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          sortDirection === 'asc' ?
            <ChevronUpIcon className="w-3 h-3" /> :
            <ChevronDownIcon className="w-3 h-3" />
        )}
      </div>
    </th>
  );

  return (
    <div className="space-y-4">
      {/* Segment Performance - Streamlined */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-gray-200 shadow-sm">
        <div
          className="p-5 cursor-pointer hover:bg-blue-100/30 transition-colors rounded-lg"
          onClick={() => setIsTrackerExpanded(!isTrackerExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Segment Performance</h2>
                <p className="text-sm text-gray-600">Revenue opportunities & insights</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">$281K</div>
                <div className="text-xs text-gray-600">Total Potential</div>
              </div>
              <ChevronUpIcon
                className={`w-5 h-5 text-gray-600 transition-transform ${isTrackerExpanded ? 'rotate-180' : ''}`}
              />
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        {isTrackerExpanded && (
          <div className="px-5 pb-5">
            {/* Compact Revenue Tracker */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-gray-900">Revenue Pipeline</h3>
                <button className="bg-crimson-blue hover:bg-crimson-dark-blue text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <SparklesIcon className="w-3 h-3" />
                  Start Campaign
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">$42K</div>
                  <div className="text-xs text-gray-600">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-red-600">$239K</div>
                  <div className="text-xs text-gray-600">Untapped</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">15%</div>
                  <div className="text-xs text-gray-600">Progress</div>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-2 rounded-full transition-all duration-500 bg-gradient-to-r from-green-500 to-blue-500" style={{ width: '15%' }}></div>
              </div>
            </div>

            {/* Quick Insights Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Over-Performers */}
              <div
                className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:shadow-md hover:bg-green-50 hover:border-green-300 transition-all"
                onClick={() => onSegmentClick?.('over-performers')}
              >
                <div className="flex items-center gap-2 mb-2">
                  <FireIcon className="w-4 h-4 text-green-500" />
                  <h3 className="text-sm font-semibold text-gray-900">Over-Performers</h3>
                </div>
                <div className="text-lg font-bold text-gray-900">234</div>
                <div className="text-xs text-gray-600">40% above capacity</div>
                <div className="text-xs text-orange-600 mt-1">⚠️ Monitor fatigue</div>
              </div>

              {/* Expansion Opportunities */}
              <div
                className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:shadow-md hover:bg-blue-50 hover:border-blue-300 transition-all"
                onClick={() => onSegmentClick?.('expansion-opportunities')}
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUpIcon className="w-4 h-4 text-blue-500" />
                  <h3 className="text-sm font-semibold text-gray-900">Expansion</h3>
                </div>
                <div className="text-lg font-bold text-gray-900">86</div>
                <div className="text-xs text-gray-600">$121K potential</div>
                <div className="text-xs text-blue-600 mt-1">📈 Ready to upgrade</div>
              </div>

              {/* Under-Performers - Untapped Potential */}
              <div
                className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:shadow-md hover:bg-gray-50 transition-all"
                onClick={() => onSegmentClick?.('under-performers')}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                    <h3 className="text-sm font-semibold text-gray-900">Under-Performers</h3>
                  </div>
                  <div className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                    High Risk
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">1,876 donors</div>
                <div className="text-sm text-gray-600 mb-2">Giving 60% below capacity — $245K untapped potential</div>
                <div className="text-xs text-gray-500">Diagnostic campaign needed</div>
              </div>

              {/* Audience Insights */}
              <div
                className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:shadow-md hover:bg-gray-50 transition-all"
                onClick={() => onSegmentClick?.('audience-insights')}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ChartBarIcon className="w-5 h-5 text-purple-500" />
                    <h3 className="text-sm font-semibold text-gray-900">Audience Insights</h3>
                  </div>
                  <button className="text-purple-600 text-xs font-medium hover:text-purple-800">
                    View Details →
                  </button>
                </div>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-3 h-3" />
                    <span>Peak engagement: November & December</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="w-3 h-3" />
                    <span>Preferred channel: Phone (65%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-3 h-3" />
                    <span>Top states: TX, IL, FL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>








    </div>
  );
};

export default AudienceInsights;
