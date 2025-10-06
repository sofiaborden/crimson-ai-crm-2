import React, { useState } from 'react';
import DonorProfileLayoutTest3 from '../components/test/DonorProfileLayoutTest3';
import DonorProfileLayoutTestCoreTier2 from '../components/test/DonorProfileLayoutTestCoreTier2';
import DonorProfileLayoutTestCoreTier2OutOfCredits from '../components/test/DonorProfileLayoutTestCoreTier2OutOfCredits';
import { mockDonorProfiles } from '../utils/mockDonorProfiles';

const TestSmartBioAllProfiles: React.FC = () => {
  const [selectedProfile, setSelectedProfile] = useState('jeff-wernsing');
  const [selectedLayout, setSelectedLayout] = useState<'enterprise' | 'core' | 'core-out'>('enterprise');

  const profileOptions = [
    { id: 'jeff-wernsing', name: 'Jeff Wernsing' },
    { id: 'sofia-borden', name: 'Sofia Borden' },
    { id: 'jack-simms', name: 'Jack Simms' },
    { id: 'rachel-gideon', name: 'Rachel Gideon' },
    { id: 'chris-milam', name: 'Chris Milam' },
    { id: 'tom-newhouse', name: 'Tom Newhouse' },
    { id: 'joseph-banks', name: 'Joseph Banks' },
    { id: 'margaret-banks', name: 'Margaret Banks' },
    { id: 'sarah-j', name: 'Sarah Johnson' },
    { id: 'michael-r', name: 'Michael Rodriguez' },
    { id: 'jennifer-l', name: 'Jennifer Liu' },
    { id: 'david-k', name: 'David Kim' },
    { id: 'lisa-m', name: 'Lisa Martinez' }
  ];

  const layoutOptions = [
    { id: 'enterprise', name: 'Enterprise (AI Insights)', component: DonorProfileLayoutTest3 },
    { id: 'core', name: 'Core Tier 2 (Pulse Check - 5 Credits)', component: DonorProfileLayoutTestCoreTier2 },
    { id: 'core-out', name: 'Core Tier 2 (Pulse Check - Out of Credits)', component: DonorProfileLayoutTestCoreTier2OutOfCredits }
  ];

  const selectedDonor = mockDonorProfiles[selectedProfile];
  const SelectedComponent = layoutOptions.find(l => l.id === selectedLayout)?.component || DonorProfileLayoutTest3;

  if (!selectedDonor) {
    return <div className="p-8 text-center text-red-600">Profile not found: {selectedProfile}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Test Controls */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Smart Bio Test - All Profiles & Layouts</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Profile Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Donor Profile:
              </label>
              <select
                value={selectedProfile}
                onChange={(e) => setSelectedProfile(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {profileOptions.map(profile => (
                  <option key={profile.id} value={profile.id}>
                    {profile.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Layout Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Layout Version:
              </label>
              <select
                value={selectedLayout}
                onChange={(e) => setSelectedLayout(e.target.value as 'enterprise' | 'core' | 'core-out')}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {layoutOptions.map(layout => (
                  <option key={layout.id} value={layout.id}>
                    {layout.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Current Selection Info */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Testing:</strong> {profileOptions.find(p => p.id === selectedProfile)?.name} 
              {' '} on {' '}
              <strong>{layoutOptions.find(l => l.id === selectedLayout)?.name}</strong>
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Navigate to the AI Insights/Pulse Check panel → Smart Bio tab → Click "Generate AI-researched donor bio" to test
            </p>
          </div>
        </div>
      </div>

      {/* Profile Component */}
      <SelectedComponent donor={selectedDonor} />
    </div>
  );
};

export default TestSmartBioAllProfiles;
