import React from 'react';
import DonorProfileLayoutTest3 from '../components/test/DonorProfileLayoutTest3';
import { getDonorProfileByName } from '../utils/mockDonorProfiles';

const LayoutTest3Page: React.FC = () => {
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

  return <DonorProfileLayoutTest3 donor={donor} />;
};

export default LayoutTest3Page;
