
import React from 'react';
import { useState } from 'react';
import MainLayout from './components/layout/MainLayout';
import HomeDashboard from './components/dashboard/HomeDashboard';
import DonorProfile from './components/profile/DonorProfile';
import DonorProfileLayoutTest3 from './components/test/DonorProfileLayoutTest3';
import ComplianceDashboard from './components/dashboard/ComplianceDashboard';
import FundraisingDashboard from './components/dashboard/FundraisingDashboard';
import PeopleDashboard from './components/dashboard/PeopleDashboard';
import SearchDemo from './pages/SearchDemo';
import DonorProfileDemo from './pages/DonorProfileDemo';
import LayoutTestPage from './pages/layout-test';
import LayoutTest2Page from './pages/layout-test-2';
import LayoutTest3Page from './pages/layout-test-3';
import LayoutTestGrowthPage from './pages/layout-test-growth';
import LayoutTestCorePage from './pages/layout-test-core';
import LayoutTestCoreTier2Page from './pages/layout-test-core-tier-2';
import LayoutTestCoreTier2OutOfCreditsPage from './pages/layout-test-core-tier-2-out-of-credits';
import TestSelectiveRollout from './pages/test-selective-rollout';
import TestSmartBioAllProfiles from './pages/test-smart-bio-all-profiles';
import TestSmartTagsFlowIntegrationPage from './pages/test-smart-tags-flow-integration';
import SmartTagsManager2 from './components/settings/SmartTagsManager2';
import { View, Donor } from './types';
import { mockDonorProfiles } from './utils/mockDonorProfiles';
import { useTest3Layout } from './utils/profileLayoutSelector';


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [profileId, setProfileId] = useState<string | null>(null);
  const [segmentId, setSegmentId] = useState<string | null>(null);



  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeDashboard setView={setCurrentView} setProfileId={setProfileId} setSegmentId={setSegmentId} />;
      case 'profile':
        if (profileId && mockDonorProfiles[profileId]) {
          const donor = mockDonorProfiles[profileId];
          // Use Test3 layout for specific users, otherwise use production layout
          if (useTest3Layout(donor)) {
            return <DonorProfileLayoutTest3 donor={donor} />;
          } else {
            return <DonorProfile donor={donor} />;
          }
        }
        // Fallback or show an error/list if no ID matches
        return <div>Profile not found.</div>;
      case 'compliance':
        return <ComplianceDashboard />;
      case 'fundraising':
        return <FundraisingDashboard segmentId={segmentId} />;
      case 'people':
        return <PeopleDashboard setView={setCurrentView} setProfileId={setProfileId} />;
      case 'search-demo':
        return <SearchDemo />;
      case 'donor-profile-demo':
        return <DonorProfileDemo />;
      case 'layout-test':
        return <LayoutTestPage />;
      case 'layout-test-2':
        return <LayoutTest2Page />;
      case 'layout-test-3':
        return <LayoutTest3Page />;
      case 'layout-test-growth':
        return <LayoutTestGrowthPage />;
      case 'layout-test-core':
        return <LayoutTestCorePage />;
      case 'layout-test-core-tier-2':
        return <LayoutTestCoreTier2Page />;
      case 'layout-test-core-tier-2-out-of-credits':
        return <LayoutTestCoreTier2OutOfCreditsPage />;
      case 'test-selective-rollout':
        return <TestSelectiveRollout />;
      case 'test-smart-bio-all-profiles':
        return <TestSmartBioAllProfiles />;
      case 'test-smart-tags-flow-integration':
        return <TestSmartTagsFlowIntegrationPage />;
      case 'smart-tags-2':
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-8 px-4">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  🧪 Smart Tags 2 - Enhanced Testing
                </h1>
                <p className="text-gray-600">
                  Testing enhanced Smart Tags functionality with new UI improvements
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <SmartTagsManager2 />
              </div>
            </div>
          </div>
        );
      default:
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Page Coming Soon</h1>
                    <p className="text-text-secondary">This feature is under construction.</p>
                </div>
            </div>
        );
    }
  };

  return (
    <MainLayout currentView={currentView} setView={setCurrentView}>
        {renderView()}
    </MainLayout>
  );
};

export default App;