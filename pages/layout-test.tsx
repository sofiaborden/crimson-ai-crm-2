import React from 'react';
import DonorProfileLayoutTest from '../components/test/DonorProfileLayoutTest';
import { getDonorProfileByName } from '../utils/mockDonorProfiles';

const LayoutTestPage: React.FC = () => {
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

  return <DonorProfileLayoutTest donor={donor} />;
};

export default LayoutTestPage;
