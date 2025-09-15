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
  const [sortField, setSortField] = useState<'name' | 'description' | 'count' | 'potentialRevenue' | 'inProgressRevenue' | 'realizedRevenue' | null>(null);
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
      icon: <UserGroupIcon className="w-5 h-5" />,
      lastUpdated: 'Just now',
      trend: 'stable' as const,
      isAI: false
    };

    setSegments(prev => [newSegment, ...prev]);
  };

  const handleSort = (field: 'name' | 'description' | 'count' | 'potentialRevenue' | 'inProgressRevenue' | 'realizedRevenue') => {
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
      case 'description':
        aValue = a.originalName.toLowerCase();
        bValue = b.originalName.toLowerCase();
        break;
      case 'count':
        aValue = a.count;
        bValue = b.count;
        break;
      case 'potentialRevenue':
        aValue = a.potentialRevenue;
        bValue = b.potentialRevenue;
        break;
      case 'inProgressRevenue':
        aValue = a.inProgressRevenue;
        bValue = b.inProgressRevenue;
        break;
      case 'realizedRevenue':
        aValue = a.realizedRevenue;
        bValue = b.realizedRevenue;
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

      {/* Segment Performance Summary - Keep the useful summary */}
      <div>
        <AudienceInsights onSegmentClick={handleSegmentClick} />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-text-primary">Smart Segments</h2>
      </div>



      {/* Removed Quick Actions section */}



      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Smart Segments</h3>
          <ActionButton
            type="export"
            className="bg-crimson-blue text-white hover:bg-crimson-dark-blue border border-crimson-blue font-medium shadow-sm"
            size="sm"
          >
            <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
            Export All Segments
          </ActionButton>
        </div>
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
                <th
                  className="text-left py-3 px-4 font-semibold text-text-primary cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleSort('description')}
                >
                  <div className="flex items-center gap-1">
                    Description
                    {sortField === 'description' && (
                      <span className="text-crimson-blue">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
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
                <th
                  className="text-center py-3 px-4 font-semibold text-text-primary cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleSort('potentialRevenue')}
                >
                  <div className="flex items-center justify-center gap-1">
                    <CurrencyDollarIcon className="w-4 h-4" />
                    Potential
                    {sortField === 'potentialRevenue' && (
                      <span className="text-crimson-blue">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="text-center py-3 px-4 font-semibold text-text-primary cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleSort('inProgressRevenue')}
                >
                  <div className="flex items-center justify-center gap-1">
                    <ClockIcon className="w-4 h-4" />
                    In Progress
                    {sortField === 'inProgressRevenue' && (
                      <span className="text-crimson-blue">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="text-center py-3 px-4 font-semibold text-text-primary cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleSort('realizedRevenue')}
                >
                  <div className="flex items-center justify-center gap-1">
                    <CheckCircleIcon className="w-4 h-4" />
                    Realized
                    {sortField === 'realizedRevenue' && (
                      <span className="text-crimson-blue">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
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
                      <span className="font-bold text-lg text-crimson-blue cursor-help">
                        ${segment.potentialRevenue.toLocaleString()}
                      </span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-2 px-3 whitespace-nowrap z-10">
                        Total estimated revenue from all {segment.count} donors
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="group relative">
                      <span className="font-bold text-lg text-yellow-600 cursor-help">
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





      {/* Removed Segment Performance panel */}

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
