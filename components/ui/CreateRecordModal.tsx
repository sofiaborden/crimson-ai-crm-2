import React, { useState } from 'react';
import { Donor } from '../../types';
import { mockDonorProfiles } from '../../utils/mockDonorProfiles';
import { useTest3Layout } from '../../utils/profileLayoutSelector';
import { XMarkIcon, UserIcon, PlusIcon } from '../../constants';
import Button from './Button';

interface CreateRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordCreated: (recordId: string) => void;
}

const CreateRecordModal: React.FC<CreateRecordModalProps> = ({ isOpen, onClose, onRecordCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    employer: '',
    occupation: ''
  });
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      // Generate a unique ID for the new record
      const recordId = `custom-${Date.now()}`;
      const pid = `CR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

      // Create new donor record with Test3 layout enabled
      const newDonor: Donor = {
        id: recordId,
        pid: pid,
        name: formData.name,
        photoUrl: `https://i.pravatar.cc/150?u=${encodeURIComponent(formData.name)}`,
        email: formData.email,
        phone: formData.phone || '(555) 000-0000',
        address: formData.address || 'Address not provided',
        primaryAddress: {
          street: formData.address || 'Address not provided',
          city: 'Unknown',
          state: 'Unknown',
          zip: '00000',
          country: 'USA'
        },
        contactInfo: {
          home: formData.phone || '(555) 000-0000',
          work: formData.phone || '(555) 000-0000',
          email: formData.email,
          website: `linkedin.com/in/${formData.name.toLowerCase().replace(/\s+/g, '')}`
        },
        employment: formData.employer && formData.occupation ? {
          employer: formData.employer,
          occupation: formData.occupation,
          industry: 'Unknown'
        } : undefined,
        aiBadges: ['New Record', 'Test Profile'],
        predictiveAsk: 500,
        recurrencePrediction: 'Unknown (New Record)',
        suggestedAction: 'Initial outreach and profile completion',
        givingOverview: {
          totalRaised: 0,
          consecutiveGifts: 0,
          tier: 'New Donor',
          topGifts: []
        },
        aiSnapshot: `${formData.name} is a newly created record. Additional information and giving history will be populated as engagement develops. Initial contact recommended to establish relationship and gather more detailed profile information.`,
        
        // Enhanced fields for Test3 compatibility
        contactIntelligence: {
          lastContactDate: new Date().toISOString().split('T')[0],
          lastContactMethod: 'email',
          lastContactOutcome: 'Record created - initial contact pending',
          preferredContactMethod: 'email',
          bestContactTimes: ['9:00 AM - 5:00 PM'],
          timezone: 'America/New_York',
          responsePattern: 'New record - pattern to be established',
          communicationNotes: 'Newly created record - no communication history yet'
        },

        wealthScreening: {
          estimatedCapacity: 10000,
          confidenceLevel: 'Low',
          lastUpdated: new Date().toISOString().split('T')[0],
          sources: ['Manual entry'],
          realEstateValue: 0,
          businessInterests: formData.employer ? [formData.employer] : [],
          investmentIndicators: [],
          philanthropicCapacity: {
            annualGivingCapacity: 1000,
            majorGiftCapacity: 5000,
            plannedGivingProspect: false
          }
        },

        predictiveModeling: {
          churnRisk: 'Unknown',
          churnScore: 50,
          lifetimeValuePrediction: 5000,
          nextGiftPrediction: {
            amount: 100,
            timing: 'Unknown',
            confidence: 25
          },
          upgradePotential: 'Unknown',
          recommendedAsk: 250,
          recommendedMonthlyAmount: 50,
          bucket: 'MEDIUM'
        },

        totalLifetimeGiving: 0,
        lastGiftAmount: 0,
        lastGiftDate: '',
        giftCount: 0,
        engagementScore: 25,
        urgencyIndicators: {
          isHotLead: false,
          hasRecentActivity: true,
          needsAttention: true
        },
        relationshipMapping: {
          family: [],
          professionalConnections: formData.employer ? [formData.employer] : [],
          mutualConnections: [],
          influenceNetwork: [],
          employerMatching: false
        },
        givingIntelligence: {
          capacityScore: 25,
          engagementLevel: 'New',
          preferredContactMethod: 'Email',
          bestContactTime: 'Business hours',
          givingMotivation: 'To be determined',
          responseToAsk: 'Unknown - new record',
          eventAttendance: 'No history',
          volunteerHistory: 'No history'
        }
      };

      // Add to mock profiles (in a real app, this would be an API call)
      (mockDonorProfiles as any)[recordId] = newDonor;

      console.log(`✅ New donor record created:`, {
        id: recordId,
        name: formData.name,
        willUseTest3Layout: true
      });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      onRecordCreated(recordId);
    } catch (error) {
      console.error('Error creating record:', error);
      alert('Error creating record. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-crimson-blue p-2 rounded-lg">
              <PlusIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Create New Record</h2>
              <p className="text-sm text-gray-600">Add a new donor profile with Test3 enhanced features</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-transparent"
                    placeholder="Enter address"
                  />
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employer
                  </label>
                  <input
                    type="text"
                    value={formData.employer}
                    onChange={(e) => handleInputChange('employer', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-transparent"
                    placeholder="Enter employer name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Occupation/Title
                  </label>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => handleInputChange('occupation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-transparent"
                    placeholder="Enter job title"
                  />
                </div>
              </div>
            </div>

            {/* Info Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <UserIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Enhanced Profile Features</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    This record will be created with Test3 enhanced features including Smart Bio generation, 
                    improved performance tracking, and advanced AI insights. You can test the Smart Bio 
                    functionality immediately after creation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isCreating}
              className="bg-crimson-blue hover:bg-crimson-dark-blue"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create Record
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRecordModal;
