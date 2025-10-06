import React from 'react';
import DonorProfileLayoutTestCoreTier2OutOfCredits from '../components/test/DonorProfileLayoutTestCoreTier2OutOfCredits';
import { mockDonorProfiles } from '../utils/mockDonorProfiles';

const LayoutTestCoreTier2OutOfCreditsPage: React.FC = () => {
  // Use Jeff Wernsing's profile as the test donor
  const testDonor = {
    ...mockDonorProfiles['jeff-wernsing'],
    name: 'Test Core Tier 2 - Out of Credits'
  };

  return <DonorProfileLayoutTestCoreTier2OutOfCredits donor={testDonor} />;
};

export default LayoutTestCoreTier2OutOfCreditsPage;
