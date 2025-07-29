import React from 'react';
import { ReactNode } from 'react';
import { View } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { SparklesIcon, LightBulbIcon, CheckCircleIcon, ArrowTrendingUpIcon, UsersIcon, PuzzlePieceIcon, ArrowPathIcon, MapPinIcon, TrendingUpIcon, MagnifyingGlassIcon } from '../../constants';
import RealTimeDonationTracker from './RealTimeDonationTracker';
import AIDailyBriefing from './AIDailyBriefing';
import QuickActionsBar from './QuickActionsBar';
import HotLeadsSection from './HotLeadsSection';
import SearchModal from '../search/SearchModal';
import { useSearch } from '../../hooks/useSearch';

interface HomeDashboardProps {
  setView: (view: View) => void;
  setProfileId: (id: string) => void;
}

const ActionTile: React.FC<{ title: string; subtitle: ReactNode; cta: string; icon: ReactNode; onClick?: () => void; }> = ({ title, subtitle, cta, icon, onClick }) => (
  <Card className="flex flex-col h-full hover:shadow-lg transition-all duration-300" onClick={onClick}>
    <div className="flex-grow">
      <div className="flex items-start gap-4">
        <div className="text-crimson-blue bg-crimson-blue/10 p-3 rounded-xl shadow-sm">
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-lg text-text-primary leading-tight">{title}</h4>
          <p className="text-sm text-text-secondary mt-2 leading-relaxed">{subtitle}</p>
        </div>
      </div>
    </div>
    <div className="mt-6">
      <Button variant="secondary" size="sm" className="w-full font-medium">{cta}</Button>
    </div>
  </Card>
);

const QuickStat: React.FC<{
  label: string;
  value: string;
  onClick?: () => void;
  cardType?: string;
}> = ({ label, value, onClick, cardType }) => (
    <div
      className={`bg-white p-4 rounded-xl border border-gray-200 shadow-sm transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:shadow-lg hover:border-crimson-blue hover:-translate-y-1 group' : ''
      }`}
      onClick={onClick}
    >
        <p className={`text-xs font-semibold uppercase tracking-wide ${
          onClick ? 'text-gray-500 group-hover:text-crimson-blue' : 'text-gray-500'
        } transition-colors duration-300`}>
          {label}
        </p>
        <p className={`text-xl font-bold mt-2 ${
          onClick ? 'text-gray-900 group-hover:text-crimson-blue' : 'text-gray-900'
        } transition-colors duration-300`}>
          {value}
        </p>
        {onClick && (
          <div className="mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex items-center text-xs text-crimson-blue font-medium">
              <MagnifyingGlassIcon className="w-3 h-3 mr-1" />
              Click to search
            </div>
          </div>
        )}
    </div>
);

const HomeDashboard: React.FC<HomeDashboardProps> = ({ setView, setProfileId }) => {
  const { isSearchOpen, searchConfig, closeSearch, searchFromCard } = useSearch();

  const handleViewProfile = () => {
    setProfileId('joseph-banks');
    setView('profile');
  };

  const handleCleanData = () => {
    setView('compliance');
  }

  // Search handlers for quick stats
  const handleTotalDonorsClick = () => {
    searchFromCard('donors-only', { count: 199138 });
  };

  const handlePledgesClick = () => {
    searchFromCard('pledges-outstanding', { amount: 220510 });
  };

  const handleActiveVotersClick = () => {
    searchFromCard('active-voters', { count: 78, percentage: true });
  };

  const handleMissingContactClick = () => {
    searchFromCard('missing-contact', { count: 12, percentage: true });
  };

  return (
    <div className="space-y-6">
      {/* Modern Quick Stats Header */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <QuickStat
          label="Total Donors"
          value="199,138"
          onClick={handleTotalDonorsClick}
          cardType="donors-only"
        />
        <QuickStat
          label="Pledges Outstanding"
          value="$220,510"
          onClick={handlePledgesClick}
          cardType="pledges-outstanding"
        />
        <QuickStat
          label="Average Gift"
          value="$87.50"
        />
        <QuickStat
          label="% Active Voters"
          value="78%"
          onClick={handleActiveVotersClick}
          cardType="active-voters"
        />
        <QuickStat
          label="% Missing Contact"
          value="12%"
          onClick={handleMissingContactClick}
          cardType="missing-contact"
        />
      </div>

      {/* Compact Real-Time Donation Tracker */}
      <RealTimeDonationTracker />

      {/* Enhanced Quick Actions Bar - Always Visible */}
      <QuickActionsBar />

      {/* Three-Column Layout for Better Space Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: AI Daily Briefing */}
        <div className="lg:col-span-1">
          <AIDailyBriefing setView={setView} setProfileId={setProfileId} />
        </div>

        {/* Column 2: Hot Leads Section */}
        <div className="lg:col-span-1">
          <HotLeadsSection />
        </div>

        {/* Column 3: AI Curated Segments */}
        <div className="lg:col-span-1">
          <Card title="AI Curated Segments" className="hover:shadow-lg transition-shadow duration-300">
            <div className="space-y-3">
              <div
                className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:shadow-md hover:border-blue-200 transition-all duration-300 cursor-pointer group"
                onClick={() => searchFromCard('ai-segment', { count: 1571, segmentId: 'comeback-crew' })}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm border border-blue-200 group-hover:bg-blue-50 transition-colors">
                    <ArrowPathIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-gray-900 group-hover:text-blue-900">Comeback Crew</h5>
                    <p className="text-sm text-gray-600">1,571 • $113K potential</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MagnifyingGlassIcon className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Button variant="secondary" size="sm" className="text-sm px-3 py-1 font-medium">View</Button>
                </div>
              </div>
              <div
                className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-md hover:border-green-200 transition-all duration-300 cursor-pointer group"
                onClick={() => searchFromCard('ai-segment', { count: 303, segmentId: 'neighborhood-mvps' })}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm border border-green-200 group-hover:bg-green-50 transition-colors">
                    <MapPinIcon className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-gray-900 group-hover:text-green-900">Neighborhood MVPs</h5>
                    <p className="text-sm text-gray-600">303 • $104K potential</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MagnifyingGlassIcon className="w-4 h-4 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Button variant="secondary" size="sm" className="text-sm px-3 py-1 font-medium">View</Button>
                </div>
              </div>
              <div
                className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-100 hover:shadow-md hover:border-purple-200 transition-all duration-300 cursor-pointer group"
                onClick={() => searchFromCard('ai-segment', { count: 578, segmentId: 'level-up-list' })}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm border border-purple-200 group-hover:bg-purple-50 transition-colors">
                    <TrendingUpIcon className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-xs text-gray-900 group-hover:text-purple-900">Level-Up List</h5>
                    <p className="text-xs text-gray-600">578 • $21K potential</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <MagnifyingGlassIcon className="w-3 h-3 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Button variant="secondary" size="sm" className="text-xs px-2 py-1">View</Button>
                </div>
              </div>
              <Button variant="secondary" className="w-full mt-2 text-xs py-1.5" onClick={() => setView('fundraising')}>
                View All 8 Segments →
              </Button>
            </div>
          </Card>
        </div>
      </div>

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

export default HomeDashboard;
