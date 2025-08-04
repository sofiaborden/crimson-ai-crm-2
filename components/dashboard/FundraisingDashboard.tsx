import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import SegmentsDashboard from './SegmentsDashboard';
import ComprehensiveAnalytics from './ComprehensiveAnalytics';
import PerformanceAnalytics from './PerformanceAnalytics';
import DonorProfileModal from '../ui/DonorProfileModal';
import { getDonorProfileByName } from '../../utils/mockDonorProfiles';
import { Donor } from '../../types';
import {
  ArrowTrendingUpIcon,
  UsersIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  ArrowDownTrayIcon
} from '../../constants';

type FundraisingView = 'overview' | 'segments' | 'campaigns' | 'analytics' | 'performance';

const FundraisingDashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<FundraisingView>('overview');
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [showDonorProfile, setShowDonorProfile] = useState(false);

  const handleDonorClick = (donorName: string) => {
    const donor = getDonorProfileByName(donorName);
    if (donor) {
      setSelectedDonor(donor);
      setShowDonorProfile(true);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'segments':
        return <SegmentsDashboard />;
      case 'analytics':
        return <ComprehensiveAnalytics onSegmentClick={handleDonorClick} />;
      case 'performance':
        return <PerformanceAnalytics />;
      case 'overview':
      default:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">Fundraising Overview</h2>
              <p className="text-text-secondary">Your at-a-glance dashboard for key metrics and next actions.</p>
            </div>

            {/* Top 4 KPIs - Clickable */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <Card className="text-center cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105" onClick={() => setCurrentView('analytics')}>
                <CurrencyDollarIcon className="w-6 h-6 lg:w-8 lg:h-8 text-green-600 mx-auto mb-2" />
                <h3 className="text-xl lg:text-2xl font-bold text-text-primary">$481,500</h3>
                <p className="text-xs lg:text-sm text-text-secondary">Total Raised</p>
                <div className="flex items-center justify-center mt-2 text-xs text-green-700">
                  <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
                  <span>View details</span>
                </div>
              </Card>

              <Card className="text-center cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105" onClick={() => setCurrentView('analytics')}>
                <SparklesIcon className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="text-xl lg:text-2xl font-bold text-text-primary">$713K</h3>
                <p className="text-xs lg:text-sm text-text-secondary">ML Potential</p>
                <div className="flex items-center justify-center mt-2 text-xs text-blue-700">
                  <SparklesIcon className="w-3 h-3 mr-1" />
                  <span>View predictions</span>
                </div>
              </Card>

              <Card className="text-center cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105" onClick={() => setCurrentView('segments')}>
                <UsersIcon className="w-6 h-6 lg:w-8 lg:h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="text-xl lg:text-2xl font-bold text-text-primary">7,667</h3>
                <p className="text-xs lg:text-sm text-text-secondary">Donors</p>
                <div className="flex items-center justify-center mt-2 text-xs text-purple-700">
                  <UsersIcon className="w-3 h-3 mr-1" />
                  <span>View segments</span>
                </div>
              </Card>

              <Card className="text-center cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105" onClick={() => setCurrentView('segments')}>
                <ArrowTrendingUpIcon className="w-6 h-6 lg:w-8 lg:h-8 text-orange-600 mx-auto mb-2" />
                <h3 className="text-xl lg:text-2xl font-bold text-text-primary">4</h3>
                <p className="text-xs lg:text-sm text-text-secondary">Active Segments</p>
                <div className="flex items-center justify-center mt-2 text-xs text-orange-700">
                  <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
                  <span>Manage segments</span>
                </div>
              </Card>
            </div>

            {/* Smart Alert */}
            <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="w-6 h-6 text-orange-600 mr-3" />
                  <div>
                    <h4 className="font-semibold text-orange-900">Smart Alert: Untapped Opportunity</h4>
                    <p className="text-sm text-orange-700">92% untapped potential in Comeback Crew segment — $125K opportunity</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700"
                  onClick={() => setCurrentView('analytics')}
                >
                  View in Analytics
                </Button>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card title="Recent Activity">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-sm">Major Gift: $5,000 from Joseph B.</h5>
                      <p className="text-xs text-gray-500 truncate">2 hours ago • Neighborhood MVPs segment</p>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleDonorClick('Joseph Banks')}
                    >
                      View
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-sm">Comeback Crew: +47 new donors</h5>
                      <p className="text-xs text-gray-500 truncate">Yesterday • AI segment updated</p>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setCurrentView('segments')}
                    >
                      View
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-sm">Q4 Appeal: Email sent to 2,156 donors</h5>
                      <p className="text-xs text-gray-500 truncate">2 days ago • 18% open rate</p>
                    </div>
                    <Button size="sm" variant="secondary">
                      View
                    </Button>
                  </div>
                </div>
              </Card>
          </div>
        );
      case 'campaigns':
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-xl font-bold text-text-primary">Campaigns Coming Soon</h3>
              <p className="text-text-secondary">Campaign management features are under development.</p>
            </div>
          </div>
        );

    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Fundraising</h1>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={currentView === 'overview' ? 'primary' : 'secondary'}
            onClick={() => setCurrentView('overview')}
          >
            Overview
          </Button>
          <Button 
            variant={currentView === 'segments' ? 'primary' : 'secondary'}
            onClick={() => setCurrentView('segments')}
          >
            AI Segments
          </Button>
          <Button 
            variant={currentView === 'campaigns' ? 'primary' : 'secondary'}
            onClick={() => setCurrentView('campaigns')}
          >
            Campaigns
          </Button>
          <Button
            variant={currentView === 'analytics' ? 'primary' : 'secondary'}
            onClick={() => setCurrentView('analytics')}
          >
            Analytics
          </Button>

          <Button
            variant={currentView === 'performance' ? 'primary' : 'secondary'}
            onClick={() => setCurrentView('performance')}
          >
            📊 Performance
          </Button>
        </div>
      </div>
      
      {renderView()}

      {/* Donor Profile Modal */}
      <DonorProfileModal
        donor={selectedDonor}
        isOpen={showDonorProfile}
        onClose={() => setShowDonorProfile(false)}
      />
    </div>
  );
};

export default FundraisingDashboard;
