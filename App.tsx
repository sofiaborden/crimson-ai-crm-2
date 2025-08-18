
import React from 'react';
import { useState } from 'react';
import MainLayout from './components/layout/MainLayout';
import HomeDashboard from './components/dashboard/HomeDashboard';
import DonorProfile from './components/profile/DonorProfile';
import ComplianceDashboard from './components/dashboard/ComplianceDashboard';
import FundraisingDashboard from './components/dashboard/FundraisingDashboard';
import PeopleDashboard from './components/dashboard/PeopleDashboard';
import SearchDemo from './pages/SearchDemo';
import DonorProfileDemo from './pages/DonorProfileDemo';
import { View, Donor } from './types';
import { mockDonorProfiles } from './utils/mockDonorProfiles';


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [profileId, setProfileId] = useState<string | null>(null);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeDashboard setView={setCurrentView} setProfileId={setProfileId} />;
      case 'profile':
        if (profileId && mockDonorProfiles[profileId]) {
          return <DonorProfile donor={mockDonorProfiles[profileId]} />;
        }
        // Fallback or show an error/list if no ID matches
        return <div>Profile not found.</div>;
      case 'compliance':
        return <ComplianceDashboard />;
      case 'fundraising':
        return <FundraisingDashboard />;
      case 'people':
        return <PeopleDashboard setView={setCurrentView} setProfileId={setProfileId} />;
      case 'search-demo':
        return <SearchDemo />;
      case 'donor-profile-demo':
        return <DonorProfileDemo />;
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