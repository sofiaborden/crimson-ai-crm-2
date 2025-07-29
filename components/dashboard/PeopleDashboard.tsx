import React, { useState } from 'react';
import { View } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import DonorProfileModal from '../ui/DonorProfileModal';
import SearchModal from '../search/SearchModal';
import CompactGeographicIntelligence from './CompactGeographicIntelligence';
import CompactIntelligenceCategories from './CompactIntelligenceCategories';
import { getDonorProfileByName } from '../../utils/mockDonorProfiles';
import { Donor } from '../../types';
import { useSearch } from '../../hooks/useSearch';
import {
  UsersIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  TrendingDownIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  ArrowPathRoundedSquareIcon,
  LightBulbIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  DocumentTextIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PuzzlePieceIcon,
  ArrowPathIcon,
  UserGroupIcon,
  TrophyIcon,
  CampaignIcon
} from '../../constants';

interface PeopleDashboardProps {
  setView: (view: View) => void;
  setProfileId: (id: string) => void;
}

// Mock data for the dashboard
const peopleStats = {
  totalPeople: 245678,
  totalDonors: 199138,
  peopleChange: 2.3,
  donorsChange: 1.8,
  newThisMonth: 1247,
  lapsedThisMonth: 892
};

const dataCompleteness = {
  address: { complete: 89, missing: 11, count: 27045 },
  email: { complete: 76, missing: 24, count: 58912 },
  phone: { complete: 62, missing: 38, count: 93346 },
  employer: { complete: 45, missing: 55, count: 135123 },
  registration: { complete: 78, missing: 22, count: 54049 }
};

const topCategories = {
  flags: [
    { name: 'DECEASED', count: 77076, color: 'bg-red-100 text-red-800', type: 'data_quality', action: 'Clean Database', strategy: 'Memorial Giving Program' },
    { name: 'DNM - Do Not Mail', count: 7090, color: 'bg-orange-100 text-orange-800', type: 'preference', action: 'Digital Outreach', strategy: 'Phone Program' },
    { name: 'BAD - Bad Address', count: 6979, color: 'bg-yellow-100 text-yellow-800', type: 'data_quality', action: 'Address Lookup', strategy: 'Email Focus' },
    { name: 'Grassroots - Club Members', count: 1883, color: 'bg-green-100 text-green-800', type: 'engagement', action: 'Peer-to-Peer', strategy: 'Event Invites' },
    { name: 'Auto Pull Match', count: 4064, color: 'bg-blue-100 text-blue-800', type: 'data_source', action: 'Data Enhanced', strategy: 'Verify & Engage' }
  ],
  keywords: [
    { name: 'DOOR TO DOOR', count: 75773, color: 'bg-purple-100 text-purple-800', type: 'Grassroots Activists', action: 'Volunteer Ask', strategy: 'House Parties' },
    { name: 'Recent Donor', count: 2125, color: 'bg-green-100 text-green-800', type: 'Hot Prospects', action: 'Upgrade Ask', strategy: 'Thank & Ask Again' },
    { name: 'IMMIGRATION', count: 292, color: 'bg-blue-100 text-blue-800', type: 'Issue Advocates', action: 'Policy Events', strategy: 'Targeted Appeals' },
    { name: 'VA', count: 335, color: 'bg-indigo-100 text-indigo-800', type: 'Virginia Focus', action: 'State Events', strategy: 'Local Bundler' },
    { name: 'brooketest', count: 345, color: 'bg-gray-100 text-gray-800', type: 'Test Segment', action: 'Review Data', strategy: 'Clean Records' }
  ],
  clubs: [
    { name: 'Inner Circle', count: 38, color: 'bg-purple-100 text-purple-800', avgDonation: 2500, potential: '$500K+', action: 'Major Gift', strategy: 'Board Recruitment' },
    { name: 'Eagle', count: 18, color: 'bg-blue-100 text-blue-800', avgDonation: 1800, potential: '$200K+', action: 'Legacy Society', strategy: 'Planned Giving' },
    { name: 'Majority Makers', count: 15, color: 'bg-green-100 text-green-800', avgDonation: 1200, potential: '$150K+', action: 'Leadership Circle', strategy: 'Bundling' },
    { name: 'Round Table', count: 8, color: 'bg-yellow-100 text-yellow-800', avgDonation: 950, potential: '$100K+', action: 'Exclusive Events', strategy: 'Peer Influence' },
    { name: 'Senatorial Trust', count: 5, color: 'bg-red-100 text-red-800', avgDonation: 3200, potential: '$75K+', action: 'VIP Access', strategy: 'Policy Briefings' }
  ],
  locations: {
    cities: [
      { name: 'Las Vegas, NV', count: 906, percentage: 3.7, raised: 1240000, potential: '$2.1M', action: 'Host Event', strategy: 'Local Bundler', strength: 'Gaming/Entertainment' },
      { name: 'Houston, TX', count: 830, percentage: 3.4, raised: 1180000, potential: '$1.8M', action: 'Energy Sector', strategy: 'Corporate Ask', strength: 'Oil & Gas' },
      { name: 'Orlando, FL', count: 750, percentage: 3.1, raised: 890000, potential: '$1.6M', action: 'Tourism Industry', strategy: 'Retiree Focus', strength: 'Hospitality' },
      { name: 'Tucson, AZ', count: 725, percentage: 3.0, raised: 760000, potential: '$1.4M', action: 'Desert Events', strategy: 'Snowbird Season', strength: 'Retirees' },
      { name: 'San Antonio, TX', count: 574, percentage: 2.4, raised: 650000, potential: '$1.2M', action: 'Hispanic Outreach', strategy: 'Community Leaders', strength: 'Military/Healthcare' }
    ],
    counties: [
      { name: 'LOS ANGELES (CA)', count: 1660, percentage: 6.8, raised: 2100000, potential: '$3.8M', strength: 'Entertainment/Tech', strategy: 'Celebrity Endorsements' },
      { name: 'MARICOPA (AZ)', count: 1402, percentage: 5.7, raised: 1850000, potential: '$2.9M', strength: 'Retirees/Growth', strategy: 'Snowbird Outreach' },
      { name: 'HARRIS (TX)', count: 1196, percentage: 4.9, raised: 1620000, potential: '$2.6M', strength: 'Energy/Medical', strategy: 'Corporate Partnerships' },
      { name: 'ORANGE (CA)', count: 1154, percentage: 4.7, raised: 1540000, potential: '$2.4M', strength: 'Affluent Suburbs', strategy: 'House Parties' },
      { name: 'SAN DIEGO (CA)', count: 980, percentage: 4.0, raised: 1320000, potential: '$2.1M', strength: 'Military/Biotech', strategy: 'Defense Contractors' }
    ],
    states: [
      { name: 'FL', count: 12134, percentage: 49.4, raised: 15200000 },
      { name: 'CA', count: 10623, percentage: 43.2, raised: 18900000 },
      { name: 'TX', count: 9299, percentage: 37.8, raised: 12400000 },
      { name: 'PA', count: 6299, percentage: 25.6, raised: 8900000 },
      { name: 'OH', count: 5690, percentage: 23.2, raised: 7200000 }
    ]
  }
};

const aiSegments = [
  {
    id: 'community-connectors',
    name: 'Community Connectors',
    icon: UserGroupIcon,
    count: 1247,
    potential: 89000,
    description: 'High-influence locals who can mobilize others'
  },
  {
    id: 'geographic-champions',
    name: 'Geographic Champions',
    icon: MapPinIcon,
    count: 892,
    potential: 156000,
    description: 'Key supporters in priority districts/counties'
  },
  {
    id: 'engagement-leaders',
    name: 'Engagement Leaders',
    icon: SparklesIcon,
    count: 634,
    potential: 78000,
    description: 'Highly responsive supporters ready for deeper involvement'
  },
  {
    id: 'club-ambassadors',
    name: 'Club Ambassadors',
    icon: TrophyIcon,
    count: 86,
    potential: 124000,
    description: 'Elite club members with peer influence'
  },
  {
    id: 'issue-advocates',
    name: 'Issue Advocates',
    icon: CampaignIcon,
    count: 1583,
    potential: 67000,
    description: 'Passionate about specific policy areas'
  }
];

const smartSuggestions = [
  {
    id: 1,
    type: 'donor',
    icon: CurrencyDollarIcon,
    message: 'Joseph Banks is ready for a $500 ask this month.',
    action: 'View Profile',
    priority: 'high'
  },
  {
    id: 2,
    type: 'segment',
    icon: EnvelopeIcon,
    message: '185 new donors need welcome outreach.',
    action: 'View List',
    priority: 'medium'
  },
  {
    id: 3,
    type: 'cultivation',
    icon: PhoneIcon,
    message: '7 Quiet Giants ready for personal cultivation.',
    action: 'Call List',
    priority: 'high'
  },
  {
    id: 4,
    type: 'data',
    icon: ExclamationTriangleIcon,
    message: '2,150 donors missing employer data.',
    action: 'Fix Now',
    priority: 'low'
  }
];

const PeopleDashboard: React.FC<PeopleDashboardProps> = ({ setView, setProfileId }) => {
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [showDonorProfile, setShowDonorProfile] = useState(false);
  const { isSearchOpen, searchConfig, closeSearch, searchFromCard } = useSearch();

  // Search handlers for compact components
  const handleLocationSearch = (locationType: string, locationName: string, count: number) => {
    searchFromCard(`location-${locationType}`, { locationName, count });
  };

  const handleCategorySearch = (categoryType: string, categoryName: string, count: number) => {
    searchFromCard(`category-${categoryType}`, { categoryName, count });
  };

  const handleViewProfile = () => {
    setProfileId('joseph-banks');
    setView('profile');
  };

  const handleDonorClick = (donorName: string) => {
    const donor = getDonorProfileByName(donorName);
    if (donor) {
      setSelectedDonor(donor);
      setShowDonorProfile(true);
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: string;
    change?: number;
    icon: React.ComponentType<any>;
    subtitle?: string;
    cardType?: string;
    count?: number;
  }> = ({ title, value, change, icon: Icon, subtitle, cardType, count }) => (
    <Card
      className="p-4 hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => cardType && searchFromCard(cardType, { count })}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 group-hover:text-crimson-blue transition-colors">{title}</p>
          <p className="text-2xl font-bold text-gray-900 group-hover:text-crimson-blue transition-colors">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="flex flex-col items-end">
          <Icon className="w-8 h-8 text-crimson-blue mb-2 group-hover:scale-110 transition-transform" />
          {change !== undefined && (
            <div className={`flex items-center text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? (
                <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDownIcon className="w-4 h-4 mr-1" />
              )}
              {Math.abs(change)}%
            </div>
          )}
        </div>
      </div>
      <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center text-xs text-crimson-blue">
          <MagnifyingGlassIcon className="w-3 h-3 mr-1" />
          Click to search
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">People Dashboard</h1>
        <p className="text-gray-600 mt-1">Your AI-powered command center for donor management and insights.</p>
      </div>

      {/* Core Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total People"
          value={peopleStats.totalPeople.toLocaleString()}
          change={peopleStats.peopleChange}
          icon={UsersIcon}
          subtitle={`+${peopleStats.newThisMonth.toLocaleString()} this month`}
          cardType="total-people"
          count={peopleStats.totalPeople}
        />
        <StatCard
          title="All-Time Donors"
          value={peopleStats.totalDonors.toLocaleString()}
          change={peopleStats.donorsChange}
          icon={CurrencyDollarIcon}
          subtitle="Active & lapsed combined"
          cardType="donors-only"
          count={peopleStats.totalDonors}
        />
        <StatCard
          title="New This Month"
          value={peopleStats.newThisMonth.toLocaleString()}
          icon={SparklesIcon}
          subtitle="First-time donors"
          cardType="new-donors"
          count={peopleStats.newThisMonth}
        />
        <StatCard
          title="Lapsed This Month"
          value={peopleStats.lapsedThisMonth.toLocaleString()}
          icon={ClockIcon}
          subtitle="Need re-engagement"
          cardType="lapsed-donors"
          count={peopleStats.lapsedThisMonth}
        />
      </div>

      {/* AI Smart Segments Preview */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-crimson-blue" />
                AI Smart Segments
              </h2>
              <p className="text-gray-600">Live segments powered by AI to maximize your fundraising impact.</p>
            </div>
            <Button variant="secondary" size="sm">
              <PlusIcon className="w-4 h-4 mr-2" />
              Create Custom
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {aiSegments.map((segment) => (
              <div
                key={segment.id}
                className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => searchFromCard('ai-segment', { count: segment.count, segmentId: segment.id })}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-crimson-blue/10 rounded-lg flex items-center justify-center">
                    <segment.icon className="w-5 h-5 text-crimson-blue" />
                  </div>
                  <Badge color="blue" className="text-xs">
                    ${(segment.potential / 1000).toFixed(0)}K
                  </Badge>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-crimson-blue transition-colors">
                  {segment.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{segment.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-crimson-blue">
                    {segment.count.toLocaleString()}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        searchFromCard('ai-segment', { count: segment.count, segmentId: segment.id });
                      }}
                      title="View List"
                    >
                      <EyeIcon className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="xs" title="Create Smart List">
                      <ArrowPathRoundedSquareIcon className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center text-xs text-crimson-blue">
                    <MagnifyingGlassIcon className="w-3 h-3 mr-1" />
                    Click to search segment
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Data Health & Categories */}
        <div className="lg:col-span-2 space-y-6">
          {/* Data Health Snapshot */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <ChartBarIcon className="w-6 h-6 text-crimson-blue" />
                    Data Health Snapshot
                  </h2>
                  <p className="text-gray-600">Track data completeness and potential revenue at risk.</p>
                </div>
                <Button variant="primary" size="sm">
                  <DocumentTextIcon className="w-4 h-4 mr-2" />
                  Fill the Gaps
                </Button>
              </div>

              <div className="space-y-4">
                {Object.entries(dataCompleteness).map(([field, data]) => (
                  <div key={field} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {field === 'registration' ? 'Voter Registration' : field}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {data.missing}% missing ({data.count.toLocaleString()})
                        </span>
                        <div className={`w-3 h-3 rounded-full ${
                          data.complete >= 80 ? 'bg-green-500' :
                          data.complete >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          data.complete >= 80 ? 'bg-green-500' :
                          data.complete >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${data.complete}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Compact Geographic Intelligence */}
          <CompactGeographicIntelligence
            data={topCategories.locations}
            onSearchLocation={handleLocationSearch}
          />

          {/* Compact Intelligence Categories */}
          <CompactIntelligenceCategories
            data={{
              flags: topCategories.flags,
              keywords: topCategories.keywords,
              clubs: topCategories.clubs
            }}
            onSearchCategory={handleCategorySearch}
          />


        </div>

        {/* Right Column - Smart Suggestions & Quick Wins */}
        <div className="space-y-6">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                <LightBulbIcon className="w-6 h-6 text-crimson-blue" />
                Smart Suggestions
              </h2>

              <div className="space-y-4">
                {smartSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      suggestion.priority === 'high' ? 'border-red-500 bg-red-50' :
                      suggestion.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                      'border-blue-500 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <suggestion.icon className={`w-5 h-5 mt-0.5 ${
                        suggestion.priority === 'high' ? 'text-red-600' :
                        suggestion.priority === 'medium' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 mb-2">{suggestion.message}</p>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={suggestion.type === 'donor' ? handleViewProfile : undefined}
                          className={`${
                            suggestion.priority === 'high' ? 'text-red-700 hover:bg-red-100' :
                            suggestion.priority === 'medium' ? 'text-yellow-700 hover:bg-yellow-100' :
                            'text-blue-700 hover:bg-blue-100'
                          }`}
                        >
                          {suggestion.action}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Quick Wins Sidebar */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                <SparklesIcon className="w-6 h-6 text-crimson-blue" />
                Quick Wins
              </h2>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <LightBulbIcon className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Try New Smart Segment</span>
                  </div>
                  <p className="text-sm text-blue-800 mb-3">FL + TX High-Dollar prospects ready for outreach.</p>
                  <Button variant="secondary" size="sm" className="w-full">
                    Create Segment
                  </Button>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <EyeIcon className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900">Donor Snapshot</span>
                  </div>
                  <p className="text-sm text-green-800 mb-3">Click any profile to view AI-powered insights.</p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={handleViewProfile}
                  >
                    View Example
                  </Button>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DocumentTextIcon className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-900">Clean Your Data</span>
                  </div>
                  <p className="text-sm text-purple-800 mb-3">Test 'Fill the Gaps' tool for missing data.</p>
                  <Button variant="secondary" size="sm" className="w-full">
                    Start Cleaning
                  </Button>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CurrencyDollarIcon className="w-5 h-5 text-orange-600" />
                    <span className="font-medium text-orange-900">Boost Next Ask</span>
                  </div>
                  <p className="text-sm text-orange-800 mb-3">Ready to increase your success rate?</p>
                  <Button variant="primary" size="sm" className="w-full">
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Donor Profile Modal */}
      <DonorProfileModal
        donor={selectedDonor}
        isOpen={showDonorProfile}
        onClose={() => setShowDonorProfile(false)}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={closeSearch}
        searchType={searchConfig.type}
        initialFilters={searchConfig.filters}
        searchContext={searchConfig.context}
      />
    </div>
  );
};

export default PeopleDashboard;
