import React from 'react';
import DonorProfileLayoutTestCoreTier2 from '../components/test/DonorProfileLayoutTestCoreTier2';
import { mockDonorProfiles } from '../utils/mockDonorProfiles';

const LayoutTestCoreTier2Page: React.FC = () => {
  // Create a test donor profile for Core Tier 2 testing
  const testDonor = {
    ...mockDonorProfiles['jeff-wernsing'],
    name: 'Test Core Tier 2',
    id: 'test-core-tier-2'
  };

  return <DonorProfileLayoutTestCoreTier2 donor={testDonor} />;
};

export default LayoutTestCoreTier2Page;
