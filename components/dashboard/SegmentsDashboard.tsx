import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import ActionButton from '../ui/ActionButton';
import ActionsDropdown from '../ui/ActionsDropdown';
import SmartAlerts from '../ui/SmartAlerts';
import CallScriptGenerator from '../ui/CallScriptGenerator';
import PredictiveScoring from '../ui/PredictiveScoring';
import DonorListView from '../ui/DonorListView';
import SmartListBuilder from '../ui/SmartListBuilder';
import CampaignBuilder from '../ui/CampaignBuilder';
import AudienceInsights from '../insights/AudienceInsights';

import {
  ArrowPathIcon,
  LightBulbIcon,
  ArrowPathRoundedSquareIcon,
  MapPinIcon,
  SparklesIcon,
  EyeIcon,
  ChartBarIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ArrowDownTrayIcon,
  ListBulletIcon,
  DocumentTextIcon,
  ClockIcon,
  FunnelIcon,
  SettingsIcon,
  XMarkIcon,
  ChevronDownIcon,
  UserGroupIcon,
  TrophyIcon,
  HeartIcon,
  StarIcon,
  BookmarkIcon,
  UserIcon,
  TrendingUpIcon,
  UsersIcon,
  CheckCircleIcon
} from '../../constants';

interface Segment {
  id: string;
  funName: string;
  originalName: string;
  description: string;
  count: number;
  potentialRevenue: number;
  inProgressRevenue: number;
  realizedRevenue: number;
  suggestedAction: string;
  icon: React.ReactElement;
  lastUpdated?: string;
  trend?: 'up' | 'down' | 'stable';
  isAI?: boolean; // Flag to indicate AI-generated vs manually created
}

const initialSegments: Segment[] = [
  {
    id: 'comeback-crew',
    funName: 'Comeback Crew',
    originalName: 'Lapsed Donors',
    description: 'Launch call/text reactivation campaign.',
    count: 1571,
    potentialRevenue: 113000,
    inProgressRevenue: 18500, // 247 donors in DialR campaigns
    realizedRevenue: 4200, // 58 donors converted so far
    suggestedAction: 'Launch call/text reactivation campaign targeting $72 avg gift. Add to DialR for personalized outreach or push to MailChimp for win-back series.',
    icon: <ArrowPathIcon className="w-5 h-5" />,
    lastUpdated: '2 hours ago',
    trend: 'up',
    isAI: true
  },
  {
    id: 'level-up-list',
    funName: 'Level-Up List',
    originalName: 'Mid-Level Upgrade Candidates ($100–$500 avg gift)',
    description: 'Send upgrade ask emails & calls.',
    count: 578,
    potentialRevenue: 21300,
    inProgressRevenue: 8900, // 89 donors in active campaigns
    realizedRevenue: 2100, // 12 donors upgraded
    suggestedAction: 'Send upgrade ask emails & calls targeting $250+ gifts (current avg: $180). Push to MailChimp for A/B testing different ask amounts.',
    icon: <TrendingUpIcon className="w-5 h-5" />,
    lastUpdated: '4 hours ago',
    trend: 'up',
    isAI: true
  },
  {
    id: 'frequent-flyers',
    funName: 'Frequent Flyers',
    originalName: 'Small Dollar, High Frequency (5+ gifts)',
    description: 'Invite to monthly giving program.',
    count: 346,
    potentialRevenue: 9200,
    inProgressRevenue: 1800, // 72 donors in monthly giving signup flow
    realizedRevenue: 650, // 26 donors converted to monthly
    suggestedAction: 'Invite to monthly giving program with $25/month ask (based on $27 avg gift). Create targeted segment for sustained giving conversion.',
    icon: <HeartIcon className="w-5 h-5" />,
    lastUpdated: '1 day ago',
    trend: 'stable',
    isAI: true
  },
  {
    id: 'new-faces',
    funName: 'New Faces Welcome',
    originalName: 'New Donors (Last 90 Days)',
    description: 'Send welcome series + 2nd gift ask.',
    count: 185,
    potentialRevenue: 6500,
    inProgressRevenue: 2200, // 62 donors in welcome sequence
    realizedRevenue: 1100, // 31 donors made 2nd gift
    suggestedAction: 'Send welcome series + 2nd gift ask within 7 days (optimal conversion window). Push to MailChimp for automated welcome sequence.',
    icon: <StarIcon className="w-5 h-5" />,
    lastUpdated: '6 hours ago',
    trend: 'up',
    isAI: true
  },
  {
    id: 'neighborhood-mvps',
    funName: 'Neighborhood MVPs',
    originalName: 'Potential Major Donors by ZIP ($250+ avg gift)',
    description: 'Schedule major donor calls/events.',
    count: 303,
    potentialRevenue: 104000,
    inProgressRevenue: 15200, // 38 donors with scheduled meetings
    realizedRevenue: 8900, // 18 donors made major gifts
    suggestedAction: 'Schedule major donor calls/events targeting $500+ gifts (capacity analysis shows $343 avg potential). Add to DialR for gift officer assignment.',
    icon: <MapPinIcon className="w-5 h-5" />,
    lastUpdated: '3 hours ago',
    trend: 'up',
    isAI: true
  },
  {
    id: 'first-gift-friends',
    funName: 'First Gift Friends',
    originalName: 'First-Time Donors',
    description: 'Send thank you + 2nd ask appeal.',
    count: 181,
    potentialRevenue: 5900,
    inProgressRevenue: 1200, // 37 donors in thank you sequence
    realizedRevenue: 800, // 24 donors made 2nd gift
    suggestedAction: 'Send thank you + 2nd ask appeal within 48 hours (highest conversion rate). Push to MailChimp for automated stewardship sequence.',
    icon: <UserIcon className="w-5 h-5" />,
    lastUpdated: '5 hours ago',
    trend: 'up',
    isAI: true
  },
  {
    id: 'quiet-giants',
    funName: 'Quiet Giants',
    originalName: 'Low Engagement, High Capacity ($500+ avg, low # gifts)',
    description: 'Assign to gift officer for personalized outreach.',
    count: 7,
    potentialRevenue: 6000,
    inProgressRevenue: 3400, // 4 donors assigned to gift officers
    realizedRevenue: 1700, // 2 donors made major gifts
    suggestedAction: 'Assign to gift officer for personalized outreach targeting $857 avg capacity. Create high-priority segment for immediate follow-up.',
    icon: <TrophyIcon className="w-5 h-5" />,
    lastUpdated: '1 day ago',
    trend: 'up',
    isAI: true
  },
  {
    id: 'next-gift-predictors',
    funName: 'Next Gift Predictors',
    originalName: 'Recurrence Prediction Cohort (likely to give again soon)',
    description: 'Send renewal reminders + stewardship call.',
    count: 767,
    potentialRevenue: 14800,
    inProgressRevenue: 4200, // 218 donors in renewal campaigns
    realizedRevenue: 2800, // 145 donors renewed
    suggestedAction: 'Send renewal reminders + stewardship calls within next 30 days (predicted giving window). Add to DialR for systematic outreach.',
    icon: <BookmarkIcon className="w-5 h-5" />,
    lastUpdated: '8 hours ago',
    trend: 'stable',
    isAI: true
  },
  {
    id: 'over-performers',
    funName: 'Hidden Gems',
    originalName: 'Over-Performers (Giving 40%+ above predicted capacity)',
    description: 'Upgrade to major gift cultivation.',
    count: 234,
    potentialRevenue: 89000,
    inProgressRevenue: 22500, // 45 donors in major gift cultivation
    realizedRevenue: 12300, // 21 donors upgraded
    suggestedAction: 'Upgrade ask strategy targeting $500+ gifts (current avg: $285). Create VIP segment for exclusive stewardship and major gift cultivation.',
    icon: <SparklesIcon className="w-5 h-5" />,
    lastUpdated: '2 hours ago',
    trend: 'up',
    isAI: true
  },
  {
    id: 'under-performers',
    funName: 'Missed Opportunities',
    originalName: 'Under-Performers (Giving 60%+ below predicted capacity)',
    description: 'Diagnostic campaign to identify barriers.',
    count: 1876,
    potentialRevenue: 156000,
    inProgressRevenue: 18700, // 225 donors in diagnostic campaigns
    realizedRevenue: 5200, // 62 donors re-engaged
    suggestedAction: 'Diagnostic campaign to identify barriers. A/B test messaging approaches and create re-engagement segment for targeted outreach.',
    icon: <UserGroupIcon className="w-5 h-5" />,
    lastUpdated: '12 hours ago',
    trend: 'down',
    isAI: true
  }
];

interface SegmentsDashboardProps {
  selectedSegmentId?: string | null;
}

const SegmentsDashboard: React.FC<SegmentsDashboardProps> = ({ selectedSegmentId }) => {
  const [showCallScript, setShowCallScript] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState({ id: '', name: '' });
  const [showPredictiveScoring, setShowPredictiveScoring] = useState(false);
  const [segments, setSegments] = useState<Segment[]>(initialSegments);
  const [showDonorList, setShowDonorList] = useState(false);
  const [showSmartListBuilder, setShowSmartListBuilder] = useState(false);
  const [showCampaignBuilder, setShowCampaignBuilder] = useState(false);

  // Sorting state
  const [sortField, setSortField] = useState<'name' | 'count' | 'revenue' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Load custom segments on mount and listen for new ones
  useEffect(() => {
    const loadCustomSegments = () => {
      const customSegments = JSON.parse(localStorage.getItem('customSegments') || '[]');
      const customSegmentObjects = customSegments.map((seg: any) => ({
        id: `custom-${seg.createdAt}`,
        funName: seg.name,
        originalName: seg.name,
        description: seg.description,
        count: seg.count,
        potentialRevenue: Math.round(seg.count * 75),
        inProgressRevenue: 0,
        realizedRevenue: 0,
        suggestedAction: `Custom segment: ${seg.description || 'Manual segment created from search results'}`,
        icon: <UserGroupIcon className="w-5 h-5" />,
        lastUpdated: 'Just now',
        trend: 'stable' as const,
        isAI: false
      }));

      setSegments([...customSegmentObjects, ...initialSegments]);
    };

    const handleNewSegment = (event: CustomEvent) => {
      loadCustomSegments(); // Reload all segments
    };

    const handleOpenSegment = (event: CustomEvent) => {
      const { segmentId, segmentName } = event.detail;
      setSelectedSegment({ id: segmentId, name: segmentName });
      setShowDonorList(true);
    };

    loadCustomSegments();
    window.addEventListener('newSegmentCreated', handleNewSegment as EventListener);
    window.addEventListener('openSegment', handleOpenSegment as EventListener);

    return () => {
      window.removeEventListener('newSegmentCreated', handleNewSegment as EventListener);
      window.removeEventListener('openSegment', handleOpenSegment as EventListener);
    };
  }, []);

  // Auto-open segment if selectedSegmentId is provided
  useEffect(() => {
    if (selectedSegmentId) {
      const segment = segments.find(s => s.id === selectedSegmentId);
      if (segment) {
        setSelectedSegment({ id: segment.id, name: segment.funName });
        setShowDonorList(true);
      }
    }
  }, [selectedSegmentId, segments]);

  const handleSegmentClick = (segmentId: string, segmentName: string) => {
    setSelectedSegment({ id: segmentId, name: segmentName });
    setShowDonorList(true);
  };

  const addNewSegment = (segmentData: {
    name: string;
    description: string;
    count: number;
    isOneTime: boolean;
  }) => {
    const newSegment: Segment = {
      id: `custom-${Date.now()}`,
      funName: segmentData.name,
      originalName: segmentData.name,
      description: segmentData.description,
      count: segmentData.count,
      potentialRevenue: Math.round(segmentData.count * 75), // Estimate $75 avg potential
      inProgressRevenue: 0,
      realizedRevenue: 0,
      suggestedAction: `Custom segment: ${segmentData.description || 'Manual segment created from search results'}`,
      icon: <UserGroupIcon className="w-5 h-5" />,
      lastUpdated: 'Just now',
      trend: 'stable' as const,
      isAI: false
    };

    setSegments(prev => [newSegment, ...prev]);
  };

  const handleSort = (field: 'name' | 'count' | 'revenue') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Sort segments based on current sort field and direction
  const sortedSegments = [...segments].sort((a, b) => {
    if (!sortField) return 0;

    let aValue, bValue;
    switch (sortField) {
      case 'name':
        aValue = a.funName.toLowerCase();
        bValue = b.funName.toLowerCase();
        break;
      case 'count':
        aValue = a.count;
        bValue = b.count;
        break;
      case 'revenue':
        aValue = a.potentialRevenue;
        bValue = b.potentialRevenue;
        break;
      default:
        return 0;
    }

    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Smart Alerts */}
      <SmartAlerts />

      {/* Segment Performance - Top Priority */}
      <div>
        <AudienceInsights onSegmentClick={handleSegmentClick} />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-text-primary">Smart Segments</h2>
      </div>



      {/* Quick Actions Bar */}
      <Card className="bg-gradient-to-r from-crimson-blue to-crimson-red text-white">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              <SparklesIcon className="w-5 h-5" />
              Quick Actions
            </h3>
            <p className="text-sm opacity-90">Take immediate action on your highest-value segments</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ActionButton
              type="call"
              phoneNumber="+15551234567"
              className="bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 font-medium shadow-sm"
              size="sm"
            >
              <PhoneIcon className="w-4 h-4 mr-1" />
              Call Top 10 Major Donors
            </ActionButton>
            <ActionButton
              type="email"
              email="comeback-crew@campaign.com"
              subject="We Miss You! Come Back to Our Campaign"
              body="Hi there! We noticed you haven't been active lately and wanted to reach out..."
              className="bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 font-medium shadow-sm"
              size="sm"
            >
              <EnvelopeIcon className="w-4 h-4 mr-1" />
              Email Comeback Crew (1,571)
            </ActionButton>
            <Button
              className="bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 font-medium shadow-sm"
              size="sm"
              onClick={() => setShowPredictiveScoring(!showPredictiveScoring)}
            >
              <CurrencyDollarIcon className="w-4 h-4 mr-1" />
              Generate Ask Amounts
            </Button>
            <ActionButton
              type="export"
              className="bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 font-medium shadow-sm"
              size="sm"
            >
              <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
              Export All Segments
            </ActionButton>
          </div>
        </div>
      </Card>



      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-base-300">
                <th
                  className="text-left py-3 px-4 font-semibold text-text-primary cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Segment
                    {sortField === 'name' && (
                      <span className="text-crimson-blue">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="text-left py-3 px-4 font-semibold text-text-primary">Description</th>
                <th
                  className="text-center py-3 px-4 font-semibold text-text-primary cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleSort('count')}
                >
                  <div className="flex items-center justify-center gap-1">
                    Donor Count
                    {sortField === 'count' && (
                      <span className="text-crimson-blue">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="text-center py-3 px-4 font-semibold text-text-primary">
                  <div className="flex items-center justify-center gap-1">
                    <CurrencyDollarIcon className="w-4 h-4" />
                    Potential
                  </div>
                </th>
                <th className="text-center py-3 px-4 font-semibold text-text-primary">
                  <div className="flex items-center justify-center gap-1">
                    <ClockIcon className="w-4 h-4" />
                    In Progress
                  </div>
                </th>
                <th className="text-center py-3 px-4 font-semibold text-text-primary">
                  <div className="flex items-center justify-center gap-1">
                    <CheckCircleIcon className="w-4 h-4" />
                    Realized
                  </div>
                </th>
                <th className="text-left py-3 px-4 font-semibold text-text-primary">Suggested Action</th>
                <th className="text-center py-3 px-4 font-semibold text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedSegments.map((segment) => (
                <tr key={segment.id} className="border-b border-base-200 hover:bg-base-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="text-crimson-blue w-5 h-5 flex items-center justify-center">
                        {segment.isAI ? (
                          <SparklesIcon className="w-5 h-5 text-purple-600" title="AI-Generated Segment" />
                        ) : (
                          <UserGroupIcon className="w-5 h-5 text-gray-600" title="Manual Segment" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSegmentClick(segment.id, segment.funName)}
                            className="font-semibold text-crimson-blue hover:text-crimson-dark-blue underline-offset-2 hover:underline transition-colors text-left"
                          >
                            {segment.funName}
                          </button>
                          {segment.id === 'over-performers' && (
                            <div className="group relative">
                              <ClockIcon className="w-4 h-4 text-amber-600" />
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-2 px-3 whitespace-nowrap z-10">
                                Monitor Fatigue active until Dec 15, 2024
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="group relative">
                      <p className="text-sm text-text-secondary cursor-help">
                        {segment.originalName}
                      </p>
                      <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-2 px-3 whitespace-nowrap z-10">
                        Based on donor behavior analysis including gift history, frequency, and engagement patterns
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => handleSegmentClick(segment.id, segment.funName)}
                      className="font-bold text-lg text-crimson-blue hover:text-crimson-dark-blue transition-colors"
                    >
                      {segment.count.toLocaleString()}
                    </button>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="group relative">
                      <span className="font-bold text-lg text-blue-600 cursor-help">
                        ${segment.potentialRevenue.toLocaleString()}
                      </span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-2 px-3 whitespace-nowrap z-10">
                        Total estimated revenue from all {segment.count} donors
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="group relative">
                      <span className="font-bold text-lg text-orange-600 cursor-help">
                        ${segment.inProgressRevenue.toLocaleString()}
                      </span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-2 px-3 whitespace-nowrap z-10">
                        Revenue from donors in active campaigns/outreach
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="group relative flex items-center justify-center gap-2">
                      <span className="font-bold text-lg text-green-600 cursor-help">
                        ${segment.realizedRevenue.toLocaleString()}
                      </span>
                      {segment.trend && (
                        <span className={`text-sm ${segment.trend === 'up' ? 'text-green-500' : segment.trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
                          {segment.trend === 'up' ? '↗️' : segment.trend === 'down' ? '↘️' : '➡️'}
                        </span>
                      )}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-2 px-3 whitespace-nowrap z-10">
                        Actual revenue converted from this segment
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <p className="text-sm text-text-secondary">{segment.suggestedAction}</p>
                      {segment.lastUpdated && (
                        <p className="text-xs text-gray-400">Updated {segment.lastUpdated}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <ActionsDropdown
                      segmentId={segment.id}
                      segmentName={segment.funName}
                      donorCount={segment.count}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>





      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Segment Performance" className="lg:col-span-2">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
              <div>
                <h5 className="font-semibold text-green-800">Highest Potential Revenue</h5>
                <p className="text-sm text-green-600">Comeback Crew - ~$113,000 potential</p>
              </div>
              <SparklesIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div>
                <h5 className="font-semibold text-blue-800">Major Gift Opportunity</h5>
                <p className="text-sm text-blue-600">Neighborhood MVPs - ~$104,000 potential</p>
              </div>
              <SparklesIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div>
                <h5 className="font-semibold text-orange-800">Biggest Missed Opportunity</h5>
                <p className="text-sm text-orange-600">Under-Performers - $156,000 untapped potential</p>
              </div>
              <CurrencyDollarIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div>
                <h5 className="font-semibold text-purple-800">Hidden Gems</h5>
                <p className="text-sm text-purple-600">Over-Performers - 234 donors ready for major gift asks</p>
              </div>
              <SparklesIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div>
                <h5 className="font-semibold text-purple-800">Largest Segment</h5>
                <p className="text-sm text-purple-600">Comeback Crew - 1,571 donors</p>
              </div>
              <SparklesIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div>
                <h5 className="font-semibold text-orange-800">High-Value, Low Volume</h5>
                <p className="text-sm text-orange-600">Quiet Giants - 7 donors, ~$6,000 potential</p>
              </div>
              <SparklesIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card title="Power Actions">
            <div className="space-y-3">
              <ActionButton
                type="email"
                email="all-segments@campaign.com"
                subject="Multi-Segment Campaign Launch"
                body="Launching coordinated campaign across all segments..."
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white flex items-center justify-center gap-2"
              >
                <SparklesIcon className="w-4 h-4" />
                Launch Multi-Segment Campaign
              </ActionButton>
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex items-center justify-center gap-2"
                onClick={() => setShowPredictiveScoring(!showPredictiveScoring)}
              >
                <CurrencyDollarIcon className="w-4 h-4" />
                Generate All Ask Amounts
              </Button>
              <ActionButton
                type="export"
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white flex items-center justify-center gap-2"
              >
                <PhoneIcon className="w-4 h-4" />
                Create Call Lists
              </ActionButton>
              <ActionButton
                type="export"
                variant="secondary"
                className="w-full flex items-center justify-center gap-2"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Export to Excel
              </ActionButton>
              <Button
                variant="secondary"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => {
                  setSelectedSegment({ id: 'all', name: 'All Segments' });
                  setShowCallScript(true);
                }}
              >
                <EnvelopeIcon className="w-4 h-4" />
                Email Templates
              </Button>
            </div>
          </Card>
          
          <Card title="AI Recommendations">
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-yellow-800"><strong>Priority Action:</strong> Call "Neighborhood MVPs" first - highest revenue per donor (~$343 each).</p>
                  </div>
                  <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs">Do It</Button>
                </div>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-blue-800"><strong>Best Timing:</strong> "Comeback Crew" shows 40% higher engagement on Tuesdays at 10 AM.</p>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs">Schedule</Button>
                </div>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-green-800"><strong>Smart Combo:</strong> Combine "First Gift Friends" + "New Faces Welcome" for 67% higher retention.</p>
                  </div>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs">Create</Button>
                </div>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-purple-800"><strong>Hot Lead:</strong> 3 "Quiet Giants" haven't been contacted in 6+ months. Immediate opportunity!</p>
                  </div>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs">Call Now</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Predictive Scoring */}
      {showPredictiveScoring && (
        <PredictiveScoring
          segmentId={selectedSegment.id || 'all'}
          segmentName={selectedSegment.name || 'All Segments'}
          isOpen={showPredictiveScoring}
          onClose={() => setShowPredictiveScoring(false)}
        />
      )}

      {/* Call Script Generator Modal */}
      <CallScriptGenerator
        segmentId={selectedSegment.id}
        segmentName={selectedSegment.name}
        isOpen={showCallScript}
        onClose={() => setShowCallScript(false)}
      />

      {/* Donor List View Modal */}
      {showDonorList && (
        <DonorListView
          segmentId={selectedSegment.id}
          segmentName={selectedSegment.name}
          isOpen={showDonorList}
          onClose={() => setShowDonorList(false)}
          segmentData={(() => {
            const segment = segments.find(s => s.id === selectedSegment.id);
            return segment ? {
              potentialRevenue: segment.potentialRevenue,
              inProgressRevenue: segment.inProgressRevenue,
              realizedRevenue: segment.realizedRevenue,
              suggestedAction: segment.suggestedAction,
              trend: segment.trend,
              lastUpdated: segment.lastUpdated
            } : undefined;
          })()}
        />
      )}

      {/* Smart List Builder Modal */}
      {showSmartListBuilder && (
        <SmartListBuilder
          segmentId={selectedSegment.id}
          segmentName={selectedSegment.name}
          isOpen={showSmartListBuilder}
          onClose={() => setShowSmartListBuilder(false)}
        />
      )}

      {/* Campaign Builder Modal */}
      {showCampaignBuilder && (
        <CampaignBuilder
          segmentId={selectedSegment.id}
          segmentName={selectedSegment.name}
          isOpen={showCampaignBuilder}
          onClose={() => setShowCampaignBuilder(false)}
        />
      )}


    </div>
  );
};

export default SegmentsDashboard;
