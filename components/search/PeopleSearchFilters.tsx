import React, { useState, useEffect } from 'react';
import { FunnelIcon, XMarkIcon } from '../../constants';
import Button from '../ui/Button';

interface FilterProps {
  onFiltersChange: (filters: any) => void;
  initialFilters?: any;
  compact?: boolean;
}

const PeopleSearchFilters: React.FC<FilterProps> = ({ 
  onFiltersChange, 
  initialFilters = {}, 
  compact = false 
}) => {
  const [filters, setFilters] = useState({
    totalGiving: { min: '', max: '', period: '12months' },
    giftCount: { min: '', max: '' },
    lastGiftDate: { within: '', before: '' },
    firstGiftDate: { within: '', before: '' },
    location: { states: [], cities: [], zipCodes: [] },
    demographics: { ageRange: [18, 80], gender: '', occupation: '' },
    engagement: { score: { min: '', max: '' }, level: '' },
    voterRegistration: '',
    politicalEngagement: '',
    ...initialFilters
  });

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters]); // Removed onFiltersChange from dependencies to prevent infinite loop

  const handleFilterChange = (category: string, field: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleSimpleFilterChange = (field: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      totalGiving: { min: '', max: '', period: '12months' },
      giftCount: { min: '', max: '' },
      lastGiftDate: { within: '', before: '' },
      firstGiftDate: { within: '', before: '' },
      location: { states: [], cities: [], zipCodes: [] },
      demographics: { ageRange: [18, 80], gender: '', occupation: '' },
      engagement: { score: { min: '', max: '' }, level: '' },
      voterRegistration: '',
      politicalEngagement: ''
    });
  };

  if (compact) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900">Filter Criteria</h4>
          <Button size="sm" variant="secondary" onClick={clearFilters}>
            Clear All
          </Button>
        </div>
        
        {/* Compact version with key filters only */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Giving</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.totalGiving.min}
                onChange={(e) => handleFilterChange('totalGiving', 'min', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.totalGiving.max}
                onChange={(e) => handleFilterChange('totalGiving', 'max', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              placeholder="State, City, or ZIP"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FunnelIcon className="w-5 h-5 text-crimson-blue" />
          <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
        </div>
        <Button size="sm" variant="secondary" onClick={clearFilters}>
          <XMarkIcon className="w-4 h-4 mr-2" />
          Clear All
        </Button>
      </div>

      {/* Giving Filters */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Giving History</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Giving Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min $"
                value={filters.totalGiving.min}
                onChange={(e) => handleFilterChange('totalGiving', 'min', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
              />
              <input
                type="number"
                placeholder="Max $"
                value={filters.totalGiving.max}
                onChange={(e) => handleFilterChange('totalGiving', 'max', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
            <select
              value={filters.totalGiving.period}
              onChange={(e) => handleFilterChange('totalGiving', 'period', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
            >
              <option value="6months">Last 6 months</option>
              <option value="12months">Last 12 months</option>
              <option value="24months">Last 24 months</option>
              <option value="lifetime">Lifetime</option>
            </select>
          </div>
        </div>
      </div>

      {/* Demographics */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Demographics</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.demographics.ageRange[0]}
                onChange={(e) => handleFilterChange('demographics', 'ageRange', [parseInt(e.target.value) || 18, filters.demographics.ageRange[1]])}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.demographics.ageRange[1]}
                onChange={(e) => handleFilterChange('demographics', 'ageRange', [filters.demographics.ageRange[0], parseInt(e.target.value) || 80])}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              value={filters.demographics.gender}
              onChange={(e) => handleFilterChange('demographics', 'gender', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
            >
              <option value="">Any</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
            <input
              type="text"
              placeholder="e.g., Healthcare, Education"
              value={filters.demographics.occupation}
              onChange={(e) => handleFilterChange('demographics', 'occupation', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
            />
          </div>
        </div>
      </div>

      {/* Political Engagement */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Political Profile</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Voter Registration</label>
            <select
              value={filters.voterRegistration}
              onChange={(e) => handleSimpleFilterChange('voterRegistration', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
            >
              <option value="">Any</option>
              <option value="registered">Registered</option>
              <option value="unregistered">Not Registered</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Political Engagement</label>
            <select
              value={filters.politicalEngagement}
              onChange={(e) => handleSimpleFilterChange('politicalEngagement', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
            >
              <option value="">Any</option>
              <option value="high">High</option>
              <option value="moderate">Moderate</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeopleSearchFilters;
