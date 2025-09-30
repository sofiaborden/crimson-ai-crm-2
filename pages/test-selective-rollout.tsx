import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import DonorProfileModal from '../components/ui/DonorProfileModal';
import { getDonorProfileByName } from '../utils/mockDonorProfiles';
import { useTest3Layout, getTest3RolloutUsers } from '../utils/profileLayoutSelector';
import { Donor } from '../types';
import { 
  UserIcon, 
  SparklesIcon, 
  CheckCircleIcon,
  XCircleIcon
} from '../constants';

const TestSelectiveRollout: React.FC = () => {
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  // Test donors - mix of Test3 users and regular users
  const testDonors = [
    // Test3 rollout users
    'Jeff Wernsing',
    'Sofia Borden',
    'Jack Simms',
    'Rachel Gideon',
    'Chris Milam',
    // Regular users (should use standard profile)
    'Joseph M. Banks',
    'Margaret Banks',
    'Tom Newhouse',
    'Sarah Johnson'
  ];

  const handleViewProfile = (donorName: string) => {
    const donor = getDonorProfileByName(donorName);
    if (donor) {
      setSelectedDonor(donor);
      setShowProfile(true);
    }
  };

  const rolloutUsers = getTest3RolloutUsers();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Selective Profile Rollout Test</h1>
              <p className="text-gray-600">Testing Test3 profile layout for specific users</p>
            </div>
          </div>
        </div>

        {/* Rollout Status */}
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Rollout Configuration</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-blue-900 mb-2">✅ Test3 Enhanced Profile Users:</h3>
              <div className="grid grid-cols-2 gap-2">
                {rolloutUsers.map(user => (
                  <div key={user} className="flex items-center gap-2 text-blue-700">
                    <CheckCircleIcon className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">{user}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-700 mb-2">📋 All Other Users:</h3>
              <p className="text-sm text-gray-600">Will continue using the standard production profile layout</p>
            </div>
          </div>
        </Card>

        {/* Test Donors Grid */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Donor Profiles</h2>
            <p className="text-gray-600 mb-6">Click any donor to view their profile and verify the correct layout is applied.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {testDonors.map(donorName => {
                const donor = getDonorProfileByName(donorName);
                const isTest3User = donor ? useTest3Layout(donor) : false;
                
                return (
                  <div 
                    key={donorName}
                    className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      isTest3User 
                        ? 'border-blue-300 bg-blue-50 hover:bg-blue-100' 
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => handleViewProfile(donorName)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-full ${
                        isTest3User ? 'bg-blue-600' : 'bg-gray-400'
                      }`}>
                        <UserIcon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm">{donorName}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          {isTest3User ? (
                            <>
                              <CheckCircleIcon className="w-3 h-3 text-green-600" />
                              <span className="text-xs text-green-700 font-medium">Test3 Layout</span>
                            </>
                          ) : (
                            <>
                              <XCircleIcon className="w-3 h-3 text-gray-500" />
                              <span className="text-xs text-gray-600">Standard Layout</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      className={`w-full text-xs ${
                        isTest3User 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-gray-600 hover:bg-gray-700 text-white'
                      }`}
                    >
                      View Profile
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Instructions */}
        <Card className="mt-6">
          <div className="p-6">
            <h3 className="font-medium text-gray-900 mb-3">🧪 Testing Instructions:</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>1. Blue Cards (Test3 Users):</strong> Should open with enhanced Test3 profile layout featuring Smart Bio generation, improved UX, and new features</p>
              <p><strong>2. Gray Cards (Standard Users):</strong> Should open with the current production profile layout</p>
              <p><strong>3. Verify Features:</strong> Test3 users should have access to the enhanced Smart Bio with Perplexity + FEC + Wealth data</p>
              <p><strong>4. Performance:</strong> Smart Bio generation should be faster due to parallel API calls and timeout handling</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Profile Modal */}
      <DonorProfileModal
        donor={selectedDonor}
        isOpen={showProfile}
        onClose={() => {
          setShowProfile(false);
          setSelectedDonor(null);
        }}
      />
    </div>
  );
};

export default TestSelectiveRollout;
