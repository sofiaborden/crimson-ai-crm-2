import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import SegmentsDashboard from './SegmentsDashboard';
import ROITrackingDashboard from './ROITrackingDashboard';
import PerformanceAnalytics from './PerformanceAnalytics';
import DonorProfileModal from '../ui/DonorProfileModal';
import { getDonorProfileByName } from '../../utils/mockDonorProfiles';
import { Donor } from '../../types';
import { ArrowTrendingUpIcon, UsersIcon, SparklesIcon } from '../../constants';

type FundraisingView = 'overview' | 'segments' | 'campaigns' | 'analytics' | 'roi' | 'performance';

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
      case 'roi':
        return <ROITrackingDashboard />;
      case 'performance':
        return <PerformanceAnalytics />;
      case 'overview':
      default:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">Fundraising Dashboard</h2>
              <p className="text-text-secondary">Manage campaigns, segments, and track fundraising performance.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="text-center">
                <ArrowTrendingUpIcon className="w-8 h-8 text-crimson-blue mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-text-primary">$847,293</h3>
                <p className="text-sm text-text-secondary">Total Raised This Year</p>
              </Card>
              <Card className="text-center">
                <SparklesIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-text-primary">~$280,700</h3>
                <p className="text-sm text-text-secondary">AI Segment Potential</p>
              </Card>
              <Card className="text-center">
                <UsersIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-text-primary">3,938</h3>
                <p className="text-sm text-text-secondary">Donors in AI Segments</p>
              </Card>
              <Card className="text-center">
                <ArrowTrendingUpIcon className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-text-primary">8</h3>
                <p className="text-sm text-text-secondary">Active AI Segments</p>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card title="Quick Actions" className="lg:col-span-1">
                <div className="space-y-3">
                  <Button 
                    className="w-full" 
                    onClick={() => setCurrentView('segments')}
                  >
                    View AI Segments
                  </Button>
                  <Button variant="secondary" className="w-full">Create Campaign</Button>
                  <Button variant="secondary" className="w-full">Import Donors</Button>
                  <Button variant="secondary" className="w-full">Export Reports</Button>
                </div>
              </Card>

              <Card title="Recent Activity" className="lg:col-span-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-base-50 rounded-lg">
                    <div>
                      <h5 className="font-semibold">Email Campaign: Q3 Appeal</h5>
                      <p className="text-sm text-text-secondary">Sent to 2,847 donors • 18% open rate</p>
                    </div>
                    <Button size="sm" variant="secondary">View Details</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-base-50 rounded-lg">
                    <div>
                      <h5 className="font-semibold">Segment: Comeback Crew</h5>
                      <p className="text-sm text-text-secondary">Updated with 47 new donors</p>
                    </div>
                    <Button size="sm" variant="secondary">View Segment</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-base-50 rounded-lg">
                    <div>
                      <h5 className="font-semibold">Major Gift: $5,000</h5>
                      <p className="text-sm text-text-secondary">
                        From{' '}
                        <button
                          onClick={() => handleDonorClick('Joseph Banks')}
                          className="text-blue-600 hover:text-blue-800 underline-offset-2 hover:underline transition-colors"
                        >
                          Joseph Banks
                        </button>
                        {' '}• Neighborhood MVPs segment
                      </p>
                    </div>
                    <Button size="sm" variant="secondary">View Donor</Button>
                  </div>
                </div>
              </Card>
            </div>
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
      case 'analytics':
        return <PerformanceAnalytics />;
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
            variant={currentView === 'roi' ? 'primary' : 'secondary'}
            onClick={() => setCurrentView('roi')}
          >
            💰 ROI
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
