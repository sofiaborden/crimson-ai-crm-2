import React, { useState } from 'react';
import { ReactNode } from 'react';
import { View } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { SparklesIcon, LightBulbIcon, CheckCircleIcon, ArrowTrendingUpIcon, UsersIcon, PuzzlePieceIcon, ArrowPathIcon, MapPinIcon, TrendingUpIcon, MagnifyingGlassIcon, ArrowDownTrayIcon, HeartIcon, CalendarIcon, ChartBarIcon, CurrencyDollarIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, BookmarkIcon, DocumentTextIcon, XMarkIcon } from '../../constants';
import RealTimeDonationTracker from './RealTimeDonationTracker';
import SmartActionCenter from './SmartActionCenter';
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
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [showSearchesModal, setShowSearchesModal] = useState(false);

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
    <div className="space-y-8">
      {/* Daily Updates Section with Background */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        {/* Welcome Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hi Sofia! Here's your Daily Updates:</h1>
          </div>
          <div className="flex gap-3">
            {/* Secondary Action Buttons */}
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-gray-600 hover:text-crimson-blue hover:border-crimson-blue transition-colors"
              onClick={() => setShowSearchesModal(true)}
            >
              <BookmarkIcon className="w-4 h-4" />
              <span className="hidden sm:inline">My Saved Searches</span>
              <span className="sm:hidden">Searches</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-gray-600 hover:text-crimson-blue hover:border-crimson-blue transition-colors"
              onClick={() => setShowReportsModal(true)}
            >
              <DocumentTextIcon className="w-4 h-4" />
              <span className="hidden sm:inline">My Reports</span>
              <span className="sm:hidden">Reports</span>
            </Button>

            {/* Primary Action Buttons */}
            <Button
              variant="primary"
              className="flex items-center gap-2 bg-crimson-blue hover:bg-crimson-dark-blue"
              onClick={() => searchFromCard('people-search', { count: 245678 })}
            >
              <MagnifyingGlassIcon className="w-4 h-4" />
              People Search
            </Button>
            <Button
              variant="secondary"
              className="flex items-center gap-2 border-gray-300 hover:border-crimson-blue hover:text-crimson-blue transition-colors"
              onClick={() => {
                // TODO: Implement import functionality
                alert('Import functionality coming soon!');
              }}
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              Import
            </Button>
          </div>
        </div>

        {/* Top Row - Compact Smart Actions and Live Donation Tracker */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-1">
            <SmartActionCenter setView={setView} setProfileId={setProfileId} />
          </div>
          <div className="lg:col-span-1">
            <RealTimeDonationTracker showPopoutButton={true} />
          </div>
        </div>
      </div>

      {/* Fundraiser Portfolio - Streamlined Layout */}
      <Card className="bg-gradient-to-r from-gray-50 to-white border-l-4 border-l-crimson-blue">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-crimson-blue rounded-lg flex items-center justify-center">
                <UsersIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Fundraiser Portfolio</h2>
                <p className="text-sm text-gray-600">Your team's performance overview</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-gray-600 hover:text-crimson-blue hover:border-crimson-blue"
            >
              <MagnifyingGlassIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Search Fundraisers</span>
              <span className="sm:hidden">Search</span>
            </Button>
          </div>

          {/* Compact Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">Total Raised</div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-xl font-bold text-green-600">$1.28M</div>
              <div className="text-xs text-gray-500 mt-1">8 active fundraisers</div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">Open Moves</div>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
              <div className="text-xl font-bold text-blue-600">27</div>
              <div className="text-xs text-gray-500 mt-1">Active opportunities</div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">Tasks Due</div>
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              </div>
              <div className="text-xl font-bold text-orange-600">70</div>
              <div className="text-xs text-gray-500 mt-1">Need attention</div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">Pledges</div>
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              </div>
              <div className="text-xl font-bold text-purple-600">$260K</div>
              <div className="text-xs text-gray-500 mt-1">Outstanding</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Dashboard Grid - Enhanced Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Total Donors */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-l-blue-600">
          <div className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <UsersIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Total Donors</h2>
                <p className="text-sm text-gray-600">Victory metrics overview</p>
              </div>
            </div>

            <div className="flex items-center gap-6 mb-4">
              {/* Main Number */}
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">3.44M</div>
                <div className="text-xs text-gray-600 uppercase tracking-wide">Total Donors</div>
              </div>

              {/* Compact Breakdown */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">Victory</span>
                  </div>
                  <span className="text-sm font-medium text-blue-600">96%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">Primary 2024</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">3.37%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">General 2024</span>
                  </div>
                  <span className="text-sm font-medium text-orange-600">1.01%</span>
                </div>
              </div>
            </div>

            {/* Quick Stats - Interactive Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 pt-4 border-t border-gray-200">
              <div
                className="p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer group"
                onClick={handleTotalDonorsClick}
              >
                <div className="text-xs font-medium text-gray-600 mb-1 group-hover:text-blue-600 transition-colors">DONORS</div>
                <div className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">199K</div>
                <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MagnifyingGlassIcon className="w-3 h-3 text-blue-500 mx-auto" />
                </div>
              </div>
              <div
                className="p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 cursor-pointer group"
                onClick={handlePledgesClick}
              >
                <div className="text-xs font-medium text-gray-600 mb-1 group-hover:text-purple-600 transition-colors">PLEDGES</div>
                <div className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">$221K</div>
                <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MagnifyingGlassIcon className="w-3 h-3 text-purple-500 mx-auto" />
                </div>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="text-xs font-medium text-gray-600 mb-1">AVG GIFT</div>
                <div className="text-lg font-bold text-gray-900">$87.50</div>
              </div>
              <div
                className="p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-green-300 hover:bg-green-50 transition-all duration-200 cursor-pointer group"
                onClick={handleActiveVotersClick}
              >
                <div className="text-xs font-medium text-gray-600 mb-1 group-hover:text-green-600 transition-colors">ACTIVE</div>
                <div className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">78%</div>
                <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MagnifyingGlassIcon className="w-3 h-3 text-green-500 mx-auto" />
                </div>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="text-xs font-medium text-gray-600 mb-1">MISSING</div>
                <div className="text-lg font-bold text-gray-900">12%</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Right Column - Today's Schedule */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-l-green-600">
          <div className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <CalendarIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Today's Schedule</h2>
                <p className="text-sm text-gray-600">Monday, August 18, 2025</p>
              </div>
            </div>

            {/* Today's Activities */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-green-200 hover:shadow-sm transition-shadow">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm">Mr. Joseph M. Banks Sr. Meeting</div>
                  <div className="text-xs text-gray-600 mt-1">10:00 AM • Major Donor Meeting</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-200 hover:shadow-sm transition-shadow">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm">Follow up call - Sarah Mitchell</div>
                  <div className="text-xs text-gray-600 mt-1">2:00 PM • Pledge Follow-up</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-orange-200 hover:shadow-sm transition-shadow">
                <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm">Complete donor research task</div>
                  <div className="text-xs text-gray-600 mt-1">4:00 PM • Research & Analysis</div>
                </div>
              </div>
            </div>

            {/* Quick Calendar View */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">August 2025</span>
                <div className="flex items-center gap-1">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <ChevronLeftIcon className="w-3 h-3 text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <ChevronRightIcon className="w-3 h-3 text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-xs">
                <div className="text-center text-gray-500 font-medium">S</div>
                <div className="text-center text-gray-500 font-medium">M</div>
                <div className="text-center text-gray-500 font-medium">T</div>
                <div className="text-center text-gray-500 font-medium">W</div>
                <div className="text-center text-gray-500 font-medium">T</div>
                <div className="text-center text-gray-500 font-medium">F</div>
                <div className="text-center text-gray-500 font-medium">S</div>
                <div className="text-center p-1 text-gray-400">27</div>
                <div className="text-center p-1 text-gray-400">28</div>
                <div className="text-center p-1 text-gray-400">29</div>
                <div className="text-center p-1 text-gray-400">30</div>
                <div className="text-center p-1 text-gray-400">31</div>
                <div className="text-center p-1">1</div>
                <div className="text-center p-1">2</div>
                <div className="text-center p-1">3</div>
                <div className="text-center p-1">4</div>
                <div className="text-center p-1">5</div>
                <div className="text-center p-1">6</div>
                <div className="text-center p-1">7</div>
                <div className="text-center p-1">8</div>
                <div className="text-center p-1">9</div>
                <div className="text-center p-1">10</div>
                <div className="text-center p-1">11</div>
                <div className="text-center p-1">12</div>
                <div className="text-center p-1">13</div>
                <div className="text-center p-1">14</div>
                <div className="text-center p-1">15</div>
                <div className="text-center p-1">16</div>
                <div className="text-center p-1">17</div>
                <div className="text-center p-1 bg-green-600 text-white rounded font-medium">18</div>
                <div className="text-center p-1">19</div>
                <div className="text-center p-1">20</div>
                <div className="text-center p-1">21</div>
                <div className="text-center p-1">22</div>
                <div className="text-center p-1">23</div>
                <div className="text-center p-1">24</div>
                <div className="text-center p-1">25</div>
                <div className="text-center p-1">26</div>
                <div className="text-center p-1">27</div>
                <div className="text-center p-1">28</div>
                <div className="text-center p-1">29</div>
                <div className="text-center p-1">30</div>
                <div className="text-center p-1">31</div>
              </div>
            </div>
          </div>
        </Card>
      </div>



      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={closeSearch}
        searchType={searchConfig.type}
        initialFilters={searchConfig.filters}
        searchContext={searchConfig.context}
        onSegmentClick={(segmentId, segmentName) => {
          closeSearch();
          setView('fundraising');
          // Trigger segment click after navigation
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('openSegment', {
              detail: { segmentId, segmentName }
            }));
          }, 100);
        }}
      />

      {/* My Saved Searches Modal */}
      {showSearchesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <BookmarkIcon className="w-6 h-6 text-crimson-blue" />
                <h2 className="text-xl font-bold text-gray-900">My Saved Searches</h2>
              </div>
              <button
                onClick={() => setShowSearchesModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-3">
                {[
                  { name: 'Major Donors $1000+', count: '2,847', lastRun: '2 hours ago', type: 'People' },
                  { name: 'Lapsed Donors (6+ months)', count: '1,234', lastRun: '1 day ago', type: 'People' },
                  { name: 'PAC Lewis 1000 or more left to give', count: '567', lastRun: '3 days ago', type: 'People' },
                  { name: 'Fire Money by Date Range', count: '890', lastRun: '1 week ago', type: 'Donations' },
                  { name: 'High-Value Prospects', count: '445', lastRun: '2 weeks ago', type: 'People' }
                ].map((search, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors group"
                    onClick={() => {
                      setShowSearchesModal(false);
                      searchFromCard('people-search', { count: parseInt(search.count.replace(',', '')) });
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-crimson-blue rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 group-hover:text-crimson-blue transition-colors">
                          {search.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {search.count} results • {search.type} • Last run: {search.lastRun}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 group-hover:text-crimson-blue transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* My Reports Modal */}
      {showReportsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <DocumentTextIcon className="w-6 h-6 text-crimson-blue" />
                <h2 className="text-xl font-bold text-gray-900">My Reports</h2>
              </div>
              <button
                onClick={() => setShowReportsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-3">
                {[
                  { name: 'Income Report by Package (Aggregate)', type: 'Financial', lastRun: '1 hour ago', status: 'Ready' },
                  { name: 'Donors by HPC in Date Range', type: 'Donor Analysis', lastRun: '3 hours ago', status: 'Ready' },
                  { name: 'Adjustment List', type: 'Compliance', lastRun: '1 day ago', status: 'Ready' },
                  { name: 'Best Efforts Count', type: 'Compliance', lastRun: '2 days ago', status: 'Ready' },
                  { name: 'Dupe Checker (Individuals)', type: 'Data Quality', lastRun: '1 week ago', status: 'Ready' }
                ].map((report, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors group"
                    onClick={() => {
                      setShowReportsModal(false);
                      // TODO: Implement report opening functionality
                      alert(`Opening report: ${report.name}`);
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-crimson-blue rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 group-hover:text-crimson-blue transition-colors">
                          {report.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {report.type} • Last run: {report.lastRun}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {report.status}
                      </span>
                      <ChartBarIcon className="w-4 h-4 text-gray-400 group-hover:text-crimson-blue transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeDashboard;
