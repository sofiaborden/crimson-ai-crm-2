
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

const mockDonor: Donor = {
    id: 'joseph-banks',
    name: 'Joseph M. Banks, Sr.',
    photoUrl: 'https://i.pravatar.cc/150?u=joseph-banks',
    email: 'j.banks.sr@example.com',
    phone: '(202) 555-0182',
    address: 'Phoenix, AZ',
    contactInfo: {
        home: '(202) 555-0182',
        work: '(202) 555-0199',
        email: 'j.banks.sr@example.com',
        website: 'https://example.com'
    },
    aiBadges: ['Gold Donor', 'High Likelihood to Give'],
    predictiveAsk: 500,
    recurrencePrediction: 'Quarterly',
    suggestedAction: 'Invite to Q3 Major Donor Dinner',
    givingOverview: {
        totalRaised: 14698,
        consecutiveGifts: 4,
        tier: 'Gold',
        topGifts: [
            { name: 'Gala 21', value: 5000 },
            { name: 'Q4 Appeal', value: 2500 },
            { name: 'Gala 22', value: 5000 },
            { name: 'Spring Mail', value: 1000 },
            { name: 'Q1 E-Appeal', value: 1198 }
        ]
    },
    aiSnapshot: 'Joseph is a high-income Republican in his mid-50s from Arizona. He consistently gives to major fundraising pushes. Likely ready for a $500 ask, ideally before August 15.'
};


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [profileId, setProfileId] = useState<string | null>(null);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeDashboard setView={setCurrentView} setProfileId={setProfileId} />;
      case 'profile':
        if (profileId === 'joseph-banks') {
          return <DonorProfile donor={mockDonor} />;
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