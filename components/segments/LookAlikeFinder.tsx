import React, { useState } from 'react';
import { UserGroupIcon, SparklesIcon } from '../../constants';

interface LookAlikeFinderProps {
  seedDonor: string;
}

const LookAlikeFinder: React.FC<LookAlikeFinderProps> = ({ seedDonor }) => {
  const [matches, setMatches] = useState([]);
  
  const findLookAlikes = () => {
    // Find donors with similar: giving patterns, demographics, engagement
    // Score by: capacity, recency, frequency, geographic proximity
  };

  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2">
        <UserGroupIcon className="w-5 h-5" />
        Find Look-Alikes for {seedDonor}
      </h3>
      {/* Results with similarity scores */}
    </div>
  );
};