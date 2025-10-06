import React from 'react';
import DonorProfileLayoutTestGrowth from '../components/test/DonorProfileLayoutTestGrowth';
import { getDonorProfileByName } from '../utils/mockDonorProfiles';

const LayoutTestGrowthPage: React.FC = () => {
  // Get Joseph Banks profile for testing Growth tier
  const donor = getDonorProfileByName('Joseph M. Banks');

  if (!donor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Test Profile Not Found</h1>
          <p className="text-gray-600">Could not load Joseph Banks profile for Growth tier testing</p>
        </div>
      </div>
    );
  }

  return <DonorProfileLayoutTestGrowth donor={donor} />;
};

export default LayoutTestGrowthPage;
