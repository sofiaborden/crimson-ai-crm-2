import React from 'react';
import DonorProfileLayoutTest2 from '../components/test/DonorProfileLayoutTest2';
import { getDonorProfileByName } from '../utils/mockDonorProfiles';

const LayoutTest2Page: React.FC = () => {
  // Get Joseph Banks profile for testing
  const donor = getDonorProfileByName('Joseph M. Banks');

  if (!donor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Test Profile Not Found</h1>
          <p className="text-gray-600">Could not load Joseph Banks profile for testing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">🧪 Layout Test 2: Tabular AI Insights</h1>
          <p className="text-gray-600">
            Testing the tabular AI Insights approach with "AI Insights" and "AI Smart Bio" tabs in the top panel.
            AI Research content moved from lower tabs to the AI Smart Bio tab.
          </p>
        </div>

        <DonorProfileLayoutTest2 donor={donor} />
      </div>
    </div>
  );
};

export default LayoutTest2Page;
