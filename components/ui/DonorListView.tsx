import React, { useState, useMemo } from 'react';
import Card from './Card';
import Button from './Button';
import { XMarkIcon, MagnifyingGlassIcon, PhoneIcon, EnvelopeIcon, CalendarIcon, CurrencyDollarIcon, ChevronDownIcon, PlusIcon, FunnelIcon, SettingsIcon, ChartBarIcon, BrainIcon, ExclamationTriangleIcon, TrashIcon, EyeIcon, SparklesIcon, ClockIcon, CheckCircleIcon, TargetIcon } from '../../constants';
import DonorProfileModal from './DonorProfileModal';
import { getDonorProfileByName } from '../../utils/mockDonorProfiles';
import { Donor as DonorProfile } from '../../types';
import ActionsDropdown from './ActionsDropdown';

// Individual Donor Actions Dropdown Component
interface IndividualDonorActionsProps {
  donor: Donor;
  onRemove: (donorId: string) => void;
  onRestore: (donorId: string) => void;
  isRemoved: boolean;
}

const IndividualDonorActions: React.FC<IndividualDonorActionsProps> = ({ donor, onRemove, onRestore, isRemoved }) => {
  const [isOpen, setIsOpen] = useState(false);



  const handlePushToMailChimp = () => {
    console.log(`Pushing ${donor.name} to MailChimp`);
    alert(`📧 Pushing ${donor.name} to MailChimp...\n\nEmail: ${donor.email}\nSegment: Individual Contact`);
    setIsOpen(false);
  };

  const handleAddToDialR = () => {
    console.log(`Adding ${donor.name} to DialR`);
    alert(`📞 Adding ${donor.name} to DialR...\n\nPhone: ${donor.phone}\nSuggested Ask: $${donor.suggestedAskAmount.toLocaleString()}`);
    setIsOpen(false);
  };

  const handleSendToTargetPath = () => {
    console.log(`Sending ${donor.name} to TargetPath`);
    alert(`📍 Sending ${donor.name} to TargetPath...\n\nThis will create a new contact in your TargetPath account.\nEstimated completion: 15 seconds`);
    setIsOpen(false);
  };

  const handleRemoveFromList = () => {
    console.log(`Removing ${donor.name} from list`);
    onRemove(donor.id);
    setIsOpen(false);
  };

  const handleRestoreToList = () => {
    console.log(`Restoring ${donor.name} to list`);
    onRestore(donor.id);
    setIsOpen(false);
  };

  const actions = [
    {
      id: 'targetpath',
      label: 'Send to TargetPath',
      description: 'Export to TargetPath platform',
      icon: <TargetIcon className="w-4 h-4" />,
      action: handleSendToTargetPath
    },
    {
      id: 'mailchimp',
      label: 'Push to MailChimp',
      description: 'Add to email marketing list',
      icon: <EnvelopeIcon className="w-4 h-4" />,
      action: handlePushToMailChimp
    },
    {
      id: 'dialr',
      label: 'Add to DialR',
      description: 'Add to calling list',
      icon: <PhoneIcon className="w-4 h-4" />,
      action: handleAddToDialR
    },
    {
      id: 'remove-restore',
      label: isRemoved ? 'Restore to List' : 'Remove from List',
      description: isRemoved ? 'Add back to active donor list' : 'Remove from this segment (not applicable for follow-up)',
      icon: isRemoved ? <EyeIcon className="w-4 h-4" /> : <TrashIcon className="w-4 h-4" />,
      action: isRemoved ? handleRestoreToList : handleRemoveFromList,
      className: isRemoved ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'
    }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-crimson-blue focus:border-transparent shadow-sm transition-all duration-200"
      >
        Actions
        <ChevronDownIcon className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-[100] overflow-hidden">
          {actions.map((action, index) => (
            <button
              key={action.id}
              onClick={action.action}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors duration-150 ${
                index !== actions.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className={`flex-shrink-0 ${action.className || 'text-gray-500'}`}>
                {action.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${action.className || 'text-gray-900'}`}>{action.label}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface Donor {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastGiftAmount: number;
  lastGiftDate: string;
  totalLifetimeGiving: number;
  giftCount: number;
  status: 'active' | 'lapsed' | 'major' | 'new';
  engagementScore: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  predictedPotential: number; // Percentage (0-100)
  suggestedAskAmount: number; // Dollar amount
}

interface DonorListViewProps {
  segmentId: string;
  segmentName: string;
  isOpen: boolean;
  onClose: () => void;
  segmentData?: {
    potentialRevenue: number;
    inProgressRevenue: number;
    realizedRevenue: number;
    suggestedAction: string;
    trend?: 'up' | 'down' | 'stable';
    lastUpdated?: string;
  };
}

// Generate 10 diverse donors per segment with varied AI suggested actions
const generateDonorData = (segmentId: string): Donor[] => {
  const firstNames = ['Sarah', 'Michael', 'Emily', 'Robert', 'Jennifer', 'David', 'Margaret', 'James', 'Lisa', 'Christopher'];
  const lastNames = ['Johnson', 'Chen', 'Rodriguez', 'Williams', 'Davis', 'Thompson', 'Foster', 'Patterson', 'Anderson', 'Martinez'];
  const addresses = [
    { address: '123 Main St', city: 'Springfield', state: 'IL', zip: '62701' },
    { address: '456 Oak Ave', city: 'Madison', state: 'WI', zip: '53703' },
    { address: '789 Pine Rd', city: 'Austin', state: 'TX', zip: '73301' },
    { address: '321 Elm St', city: 'Portland', state: 'OR', zip: '97201' },
    { address: '654 Maple Dr', city: 'Denver', state: 'CO', zip: '80202' },
    { address: '987 Cedar Ln', city: 'Seattle', state: 'WA', zip: '98101' },
    { address: '147 Birch Way', city: 'Phoenix', state: 'AZ', zip: '85001' },
    { address: '258 Willow St', city: 'Miami', state: 'FL', zip: '33101' },
    { address: '369 Spruce Ave', city: 'Boston', state: 'MA', zip: '02101' },
    { address: '741 Aspen Rd', city: 'Atlanta', state: 'GA', zip: '30301' }
  ];

  // Define segment-specific characteristics to ensure variety in AI suggestions
  const segmentProfiles = {
    'comeback-crew': [
      { status: 'lapsed', engagementScore: 85, giftAmount: 150, giftCount: 6, lifetimeGiving: 850 }, // Call Recommended
      { status: 'lapsed', engagementScore: 45, giftAmount: 75, giftCount: 4, lifetimeGiving: 425 },   // Email Appeal
      { status: 'lapsed', engagementScore: 90, giftAmount: 200, giftCount: 8, lifetimeGiving: 1200 }, // Schedule Call
      { status: 'new', engagementScore: 60, giftAmount: 100, giftCount: 1, lifetimeGiving: 100 },     // Personalized Follow-up
      { status: 'lapsed', engagementScore: 75, giftAmount: 125, giftCount: 5, lifetimeGiving: 625 },  // Call Recommended
      { status: 'lapsed', engagementScore: 40, giftAmount: 50, giftCount: 3, lifetimeGiving: 300 },   // Email Appeal
      { status: 'lapsed', engagementScore: 95, giftAmount: 300, giftCount: 10, lifetimeGiving: 1800 }, // Schedule Call
      { status: 'new', engagementScore: 55, giftAmount: 75, giftCount: 1, lifetimeGiving: 75 },       // Personalized Follow-up
      { status: 'lapsed', engagementScore: 80, giftAmount: 175, giftCount: 7, lifetimeGiving: 950 },  // Call Recommended
      { status: 'lapsed', engagementScore: 35, giftAmount: 25, giftCount: 2, lifetimeGiving: 150 }    // Email Appeal
    ],
    'neighborhood-mvps': [
      { status: 'major', engagementScore: 92, giftAmount: 500, giftCount: 12, lifetimeGiving: 3500 }, // Schedule Call
      { status: 'major', engagementScore: 88, giftAmount: 750, giftCount: 15, lifetimeGiving: 4200 }, // Schedule Call
      { status: 'active', engagementScore: 85, giftAmount: 300, giftCount: 9, lifetimeGiving: 2100 }, // Call Recommended
      { status: 'new', engagementScore: 70, giftAmount: 250, giftCount: 1, lifetimeGiving: 250 },     // Personalized Follow-up
      { status: 'active', engagementScore: 90, giftAmount: 400, giftCount: 11, lifetimeGiving: 2800 }, // Schedule Call
      { status: 'active', engagementScore: 45, giftAmount: 200, giftCount: 8, lifetimeGiving: 1600 }, // Email Appeal
      { status: 'major', engagementScore: 95, giftAmount: 600, giftCount: 14, lifetimeGiving: 3800 }, // Schedule Call
      { status: 'new', engagementScore: 65, giftAmount: 350, giftCount: 1, lifetimeGiving: 350 },     // Personalized Follow-up
      { status: 'active', engagementScore: 87, giftAmount: 450, giftCount: 13, lifetimeGiving: 3200 }, // Call Recommended
      { status: 'active', engagementScore: 40, giftAmount: 150, giftCount: 6, lifetimeGiving: 1200 }  // Email Appeal
    ],
    'over-performers': [
      { status: 'major', engagementScore: 95, giftAmount: 800, giftCount: 18, lifetimeGiving: 6400 }, // Stewardship Call
      { status: 'major', engagementScore: 92, giftAmount: 650, giftCount: 15, lifetimeGiving: 5200 }, // Thank You Call
      { status: 'active', engagementScore: 88, giftAmount: 450, giftCount: 12, lifetimeGiving: 3600 }, // Recognition Event
      { status: 'major', engagementScore: 90, giftAmount: 750, giftCount: 16, lifetimeGiving: 6000 }, // Stewardship Call
      { status: 'active', engagementScore: 85, giftAmount: 400, giftCount: 10, lifetimeGiving: 3200 }, // Thank You Note
      { status: 'major', engagementScore: 93, giftAmount: 900, giftCount: 20, lifetimeGiving: 7200 }, // Personal Visit
      { status: 'active', engagementScore: 87, giftAmount: 500, giftCount: 14, lifetimeGiving: 4200 }, // Recognition Event
      { status: 'major', engagementScore: 89, giftAmount: 700, giftCount: 17, lifetimeGiving: 5600 }, // Stewardship Call
      { status: 'active', engagementScore: 86, giftAmount: 425, giftCount: 11, lifetimeGiving: 3400 }, // Thank You Call
      { status: 'major', engagementScore: 91, giftAmount: 825, giftCount: 19, lifetimeGiving: 6600 }  // Personal Visit
    ],
    'expansion-opportunities': [
      { status: 'active', engagementScore: 82, giftAmount: 150, giftCount: 8, lifetimeGiving: 1200 }, // Upgrade Ask
      { status: 'active', engagementScore: 78, giftAmount: 125, giftCount: 6, lifetimeGiving: 750 },  // Monthly Giving
      { status: 'active', engagementScore: 85, giftAmount: 200, giftCount: 10, lifetimeGiving: 2000 }, // Major Gift Ask
      { status: 'active', engagementScore: 80, giftAmount: 175, giftCount: 9, lifetimeGiving: 1575 }, // Upgrade Ask
      { status: 'active', engagementScore: 83, giftAmount: 160, giftCount: 7, lifetimeGiving: 1120 }, // Monthly Giving
      { status: 'active', engagementScore: 87, giftAmount: 225, giftCount: 11, lifetimeGiving: 2475 }, // Major Gift Ask
      { status: 'active', engagementScore: 79, giftAmount: 140, giftCount: 5, lifetimeGiving: 700 },  // Upgrade Ask
      { status: 'active', engagementScore: 84, giftAmount: 190, giftCount: 8, lifetimeGiving: 1520 }, // Monthly Giving
      { status: 'active', engagementScore: 81, giftAmount: 165, giftCount: 7, lifetimeGiving: 1155 }, // Upgrade Ask
      { status: 'active', engagementScore: 86, giftAmount: 210, giftCount: 9, lifetimeGiving: 1890 }  // Major Gift Ask
    ],
    'under-performers': [
      { status: 'lapsed', engagementScore: 35, giftAmount: 25, giftCount: 2, lifetimeGiving: 50 },   // Re-engagement
      { status: 'active', engagementScore: 40, giftAmount: 50, giftCount: 3, lifetimeGiving: 150 },  // Diagnostic Survey
      { status: 'lapsed', engagementScore: 30, giftAmount: 35, giftCount: 1, lifetimeGiving: 35 },   // Welcome Back
      { status: 'active', engagementScore: 45, giftAmount: 75, giftCount: 4, lifetimeGiving: 300 },  // Re-engagement
      { status: 'lapsed', engagementScore: 38, giftAmount: 40, giftCount: 2, lifetimeGiving: 80 },   // Diagnostic Survey
      { status: 'active', engagementScore: 42, giftAmount: 60, giftCount: 3, lifetimeGiving: 180 },  // Welcome Back
      { status: 'lapsed', engagementScore: 33, giftAmount: 30, giftCount: 1, lifetimeGiving: 30 },   // Re-engagement
      { status: 'active', engagementScore: 47, giftAmount: 85, giftCount: 5, lifetimeGiving: 425 },  // Diagnostic Survey
      { status: 'lapsed', engagementScore: 36, giftAmount: 45, giftCount: 2, lifetimeGiving: 90 },   // Welcome Back
      { status: 'active', engagementScore: 44, giftAmount: 70, giftCount: 4, lifetimeGiving: 280 }   // Re-engagement
    ],
    'audience-insights': [
      { status: 'active', engagementScore: 75, giftAmount: 200, giftCount: 8, lifetimeGiving: 1600 }, // Data Analysis
      { status: 'major', engagementScore: 85, giftAmount: 500, giftCount: 12, lifetimeGiving: 6000 }, // Trend Analysis
      { status: 'lapsed', engagementScore: 60, giftAmount: 100, giftCount: 4, lifetimeGiving: 400 },  // Behavior Study
      { status: 'active', engagementScore: 80, giftAmount: 300, giftCount: 10, lifetimeGiving: 3000 }, // Data Analysis
      { status: 'new', engagementScore: 70, giftAmount: 150, giftCount: 2, lifetimeGiving: 300 },     // Trend Analysis
      { status: 'active', engagementScore: 78, giftAmount: 250, giftCount: 9, lifetimeGiving: 2250 }, // Behavior Study
      { status: 'major', engagementScore: 88, giftAmount: 600, giftCount: 15, lifetimeGiving: 9000 }, // Data Analysis
      { status: 'active', engagementScore: 72, giftAmount: 180, giftCount: 6, lifetimeGiving: 1080 }, // Trend Analysis
      { status: 'lapsed', engagementScore: 65, giftAmount: 120, giftCount: 3, lifetimeGiving: 360 },  // Behavior Study
      { status: 'active', engagementScore: 82, giftAmount: 350, giftCount: 11, lifetimeGiving: 3850 } // Data Analysis
    ]
  };

  // Use comeback-crew profile as default for other segments
  const profiles = segmentProfiles[segmentId as keyof typeof segmentProfiles] || segmentProfiles['comeback-crew'];

  return Array.from({ length: 10 }, (_, index) => {
    const profile = profiles[index];
    const firstName = firstNames[index];
    const lastName = lastNames[index];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`;
    const phone = `(555) ${String(123 + index * 11).padStart(3, '0')}-${String(4567 + index * 111).slice(-4)}`;

    // Calculate predicted potential based on engagement and giving history
    const basePotential = Math.min(95, Math.max(15, profile.engagementScore + (Math.random() * 20 - 10)));
    const predictedPotential = Math.round(basePotential);

    // Calculate suggested ask amount based on giving history and potential
    const avgGift = profile.lifetimeGiving / profile.giftCount;
    const multiplier = predictedPotential > 80 ? 2.5 : predictedPotential > 60 ? 2.0 : 1.5;
    const suggestedAskAmount = Math.round(avgGift * multiplier / 25) * 25; // Round to nearest $25

    // Generate realistic last gift dates
    const daysAgo = profile.status === 'lapsed' ? 180 + Math.floor(Math.random() * 180) :
                   profile.status === 'new' ? Math.floor(Math.random() * 30) :
                   30 + Math.floor(Math.random() * 90);
    const lastGiftDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return {
      id: `${segmentId}-${index}`,
      name,
      email,
      phone,
      lastGiftAmount: profile.giftAmount,
      lastGiftDate,
      totalLifetimeGiving: profile.lifetimeGiving,
      giftCount: profile.giftCount,
      status: profile.status,
      engagementScore: profile.engagementScore,
      predictedPotential,
      suggestedAskAmount,
      ...addresses[index]
    };
  });
};

const DonorListView: React.FC<DonorListViewProps> = ({ segmentId, segmentName, isOpen, onClose, segmentData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Donor>('totalLifetimeGiving');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedDonor, setSelectedDonor] = useState<DonorProfile | null>(null);
  const [showDonorProfile, setShowDonorProfile] = useState(false);

  // Advanced filtering state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    donationFrequency: 'all',
    lastDonationDate: 'all',
    giftSizeRange: 'all',
    communicationPreference: 'all',
    engagementLevel: 'all',
    geography: 'all',
    status: 'all',
    suggestedAction: 'all'
  });

  // Removed donors tracking
  const [removedDonors, setRemovedDonors] = useState<Set<string>>(new Set());
  const [showRemovedDonors, setShowRemovedDonors] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const handleDonorClick = (donorName: string) => {
    // Try to get the specific donor profile, fallback to Joseph Banks
    let donor = getDonorProfileByName(donorName);
    if (!donor) {
      // Default to Joseph Banks profile for all donors
      donor = getDonorProfileByName('Joseph Banks');
    }
    if (donor) {
      setSelectedDonor(donor);
      setShowDonorProfile(true);
    }
  };

  const donors = useMemo(() => generateDonorData(segmentId), [segmentId]);

  // Get total count for each segment (from SegmentsDashboard data)
  const getSegmentTotalCount = (segmentId: string): number => {
    const segmentCounts: Record<string, number> = {
      'comeback-crew': 1571,
      'level-up-list': 578,
      'frequent-flyers': 346,
      'new-faces': 185,
      'neighborhood-mvps': 303,
      'first-gift-friends': 181,
      'quiet-giants': 7,
      'next-gift-predictors': 767,
      'over-performers': 234,
      'expansion-opportunities': 86,
      'under-performers': 1876,
      'audience-insights': 2196 // Total of all segments for insights view
    };
    return segmentCounts[segmentId] || 100;
  };

  const totalCount = getSegmentTotalCount(segmentId);

  const filteredAndSortedDonors = useMemo(() => {
    let filtered = donors.filter(donor => {
      // Filter by search term
      const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.phone.includes(searchTerm);

      // Filter by removed status
      const isRemoved = removedDonors.has(donor.id);
      const shouldShow = showRemovedDonors ? isRemoved : !isRemoved;

      return matchesSearch && shouldShow;
    });

    filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

    return filtered;
  }, [donors, searchTerm, sortField, sortDirection, removedDonors, showRemovedDonors]);

  const handleSort = (field: keyof Donor) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleRemoveDonor = (donorId: string) => {
    setRemovedDonors(prev => new Set([...prev, donorId]));
  };

  const handleRestoreDonor = (donorId: string) => {
    setRemovedDonors(prev => {
      const newSet = new Set(prev);
      newSet.delete(donorId);
      return newSet;
    });
  };

  // Generate AI suggested action based on donor data with better distribution
  const getSuggestedAction = (donor: Donor) => {
    const isHighPotential = donor.predictedPotential >= 80;
    const isLapsed = donor.status === 'lapsed';
    const isNewDonor = donor.status === 'new';
    const hasHighEngagement = donor.engagementScore >= 75;

    // Ensure variety by using donor index patterns
    const donorIndex = parseInt(donor.id.split('-')[1]) || 0;

    if (isNewDonor) {
      return {
        action: 'Personalized Follow-up',
        icon: <SparklesIcon className="w-3 h-3" />,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        reasoning: '• New donor status\n• 7-day cultivation window\n• Second gift opportunity'
      };
    } else if (isLapsed && hasHighEngagement) {
      return {
        action: 'Call Recommended',
        icon: <PhoneIcon className="w-3 h-3" />,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        reasoning: '• DialR shows phone success\n• Lapsed status needs personal touch\n• High engagement history'
      };
    } else if (isHighPotential && hasHighEngagement) {
      return {
        action: 'Schedule Call',
        icon: <CalendarIcon className="w-3 h-3" />,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        reasoning: `• High potential (${donor.predictedPotential}%)\n• Strong engagement score\n• Major gift opportunity`
      };
    } else {
      return {
        action: 'Email Appeal',
        icon: <EnvelopeIcon className="w-3 h-3" />,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        reasoning: '• Standard outreach approach\n• Email engagement preferred\n• Cost-effective method'
      };
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      lapsed: 'bg-yellow-100 text-yellow-800',
      major: 'bg-purple-100 text-purple-800',
      new: 'bg-blue-100 text-blue-800'
    };
    return styles[status as keyof typeof styles] || styles.active;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
        <div className="flex-shrink-0 flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Donor List: {segmentName}</h2>
            <p className="text-gray-600">{totalCount.toLocaleString()} donors found</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Progress Summary Section */}
        {segmentData && (
          <div className="flex-shrink-0 p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-green-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  ${segmentData.potentialRevenue.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                  <CurrencyDollarIcon className="w-4 h-4" />
                  Potential Revenue
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  ${segmentData.inProgressRevenue.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                  <ClockIcon className="w-4 h-4" />
                  In Progress
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1 flex items-center justify-center gap-2">
                  ${segmentData.realizedRevenue.toLocaleString()}
                  {segmentData.trend && (
                    <span className={`text-sm ${segmentData.trend === 'up' ? 'text-green-500' : segmentData.trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
                      {segmentData.trend === 'up' ? '↗️' : segmentData.trend === 'down' ? '↘️' : '➡️'}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                  <CheckCircleIcon className="w-4 h-4" />
                  Realized Revenue
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {Math.round((segmentData.realizedRevenue / segmentData.potentialRevenue) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Conversion Rate</div>
              </div>
            </div>

            {/* Monitor Fatigue Status - Show for over-performers segment */}
            {segmentId === 'over-performers' && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <ClockIcon className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-amber-900 mb-1">Monitor Fatigue Active</h4>
                      <p className="text-sm text-amber-800 mb-2">
                        Follow-up activities paused until <strong>Dec 15, 2024</strong> to prevent donor fatigue
                      </p>
                      <div className="text-xs text-amber-700">
                        Started: Dec 1, 2024 • Duration: 2 weeks • Contacts affected: {donorCount}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      alert('Monitor Fatigue settings:\n\n• Start: Dec 1, 2024\n• End: Dec 15, 2024\n• Duration: 2 weeks\n• Contacts: 234\n• Status: Active\n\nClick "Edit" to modify settings.');
                    }}
                    className="text-amber-700 hover:text-amber-900 text-sm font-medium underline-offset-2 hover:underline transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}

            {/* Suggested Action */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-start gap-3">
                <SparklesIcon className="w-5 h-5 text-crimson-blue mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">Recommended Action for This Segment</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{segmentData.suggestedAction}</p>
                  {segmentData.lastUpdated && (
                    <p className="text-xs text-gray-500 mt-2">Last updated: {segmentData.lastUpdated}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex-shrink-0 p-6 border-b border-gray-200">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search donors by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-crimson-blue focus:border-transparent shadow-sm transition-all duration-200"
            >
              <FunnelIcon className="w-4 h-4" />
              Advanced Targeting
              <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${showAdvancedFilters ? 'rotate-180' : ''}`} />
            </button>
            <button
              onClick={() => setShowRemovedDonors(!showRemovedDonors)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200 ${
                showRemovedDonors
                  ? 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <EyeIcon className="w-4 h-4" />
              {showRemovedDonors ? 'Show Active' : `Show Removed (${removedDonors.size})`}
            </button>
            <Button variant="secondary" size="sm">
              <CurrencyDollarIcon className="w-4 h-4 mr-1" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div className="flex-shrink-0 p-4 bg-gray-100 border-b-2 border-gray-300 shadow-inner">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-800 flex items-center gap-2">
                <FunnelIcon className="w-4 h-4" />
                Advanced Targeting Filters for {segmentName}
              </h3>
              <button
                onClick={() => setFilters({
                  donationFrequency: 'all',
                  lastDonationDate: 'all',
                  giftSizeRange: 'all',
                  communicationPreference: 'all',
                  engagementLevel: 'all',
                  geography: 'all',
                  status: 'all',
                  suggestedAction: 'all'
                })}
                className="text-xs text-gray-600 hover:text-gray-800 underline"
              >
                Clear All Filters
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Donation Frequency</label>
                <select
                  value={filters.donationFrequency}
                  onChange={(e) => setFilters({...filters, donationFrequency: e.target.value})}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-crimson-blue focus:border-transparent"
                >
                  <option value="all">All Frequencies</option>
                  <option value="monthly">Monthly Donors</option>
                  <option value="quarterly">Quarterly Donors</option>
                  <option value="annually">Annual Donors</option>
                  <option value="one-time">One-time Donors</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Last Donation</label>
                <select
                  value={filters.lastDonationDate}
                  onChange={(e) => setFilters({...filters, lastDonationDate: e.target.value})}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-crimson-blue focus:border-transparent"
                >
                  <option value="all">Any Time</option>
                  <option value="30-days">Last 30 Days</option>
                  <option value="90-days">Last 90 Days</option>
                  <option value="6-months">Last 6 Months</option>
                  <option value="1-year">Last Year</option>
                  <option value="over-1-year">Over 1 Year Ago</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Gift Size Range</label>
                <select
                  value={filters.giftSizeRange}
                  onChange={(e) => setFilters({...filters, giftSizeRange: e.target.value})}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-crimson-blue focus:border-transparent"
                >
                  <option value="all">All Gift Sizes</option>
                  <option value="under-50">Under $50</option>
                  <option value="50-100">$50 - $100</option>
                  <option value="100-250">$100 - $250</option>
                  <option value="250-500">$250 - $500</option>
                  <option value="500-1000">$500 - $1,000</option>
                  <option value="over-1000">Over $1,000</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-crimson-blue focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="lapsed">Lapsed</option>
                  <option value="major">Major Donor</option>
                  <option value="new">New Donor</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Communication Preference</label>
                <select
                  value={filters.communicationPreference}
                  onChange={(e) => setFilters({...filters, communicationPreference: e.target.value})}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-crimson-blue focus:border-transparent"
                >
                  <option value="all">All Preferences</option>
                  <option value="email">Email Preferred</option>
                  <option value="phone">Phone/Call Preferred</option>
                  <option value="text">Text/SMS Preferred</option>
                  <option value="mail">Direct Mail Preferred</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Engagement Level</label>
                <select
                  value={filters.engagementLevel}
                  onChange={(e) => setFilters({...filters, engagementLevel: e.target.value})}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-crimson-blue focus:border-transparent"
                >
                  <option value="all">All Engagement Levels</option>
                  <option value="high">High (Responds to calls/emails)</option>
                  <option value="medium">Medium (Occasional responses)</option>
                  <option value="low">Low (Rarely responds)</option>
                  <option value="none">No Recent Engagement</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Geography</label>
                <select
                  value={filters.geography}
                  onChange={(e) => setFilters({...filters, geography: e.target.value})}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-crimson-blue focus:border-transparent"
                >
                  <option value="all">All Locations</option>
                  <option value="local">Local (Within 50 miles)</option>
                  <option value="regional">Regional (Within state)</option>
                  <option value="national">National</option>
                  <option value="international">International</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Suggested Action</label>
                <select
                  value={filters.suggestedAction}
                  onChange={(e) => setFilters({...filters, suggestedAction: e.target.value})}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-crimson-blue focus:border-transparent"
                >
                  <option value="all">All Actions</option>
                  <option value="call">Call Recommended</option>
                  <option value="email">Email Appeal</option>
                  <option value="schedule">Schedule Call</option>
                  <option value="followup">Personalized Follow-up</option>
                </select>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-300">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-600">
                  Filters will refine the donor list below. Results update automatically.
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAdvancedFilters(false)}
                    className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      // Apply filters logic would go here
                      console.log('Applying filters to segment:', segmentName, filters);
                      alert(`Filters applied to ${segmentName}! In a real implementation, this would filter the donor data.`);
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-crimson-blue rounded hover:bg-crimson-dark-blue"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto min-h-0">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="w-[18%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}>
                  Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="w-[16%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="w-[10%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('lastGiftAmount')}>
                  Last Gift {sortField === 'lastGiftAmount' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="w-[12%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('totalLifetimeGiving')}>
                  Lifetime {sortField === 'totalLifetimeGiving' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="w-[12%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('suggestedAskAmount')}>
                  <div className="flex items-center gap-1">
                    Ask Amount
                    <BrainIcon className="w-3 h-3 text-purple-500 cursor-help" title="AI ask amount and potential score" />
                    {sortField === 'suggestedAskAmount' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </div>
                </th>
                <th className="w-[10%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('status')}>
                  <div className="flex items-center gap-1">
                    Status
                    <ExclamationTriangleIcon className="w-3 h-3 text-orange-500 cursor-help" title="Click for status insights and recommendations" />
                    {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </div>
                </th>
                <th className="w-[14%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    Suggested Action
                    <BrainIcon className="w-3 h-3 text-indigo-500 cursor-help" title="AI-generated outreach recommendations based on DialR data and donor behavior" />
                  </div>
                </th>
                <th className="w-[8%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedDonors.map((donor) => (
                <tr key={donor.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <button
                        onClick={() => handleDonorClick(donor.name)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 underline-offset-2 hover:underline transition-colors text-left truncate block w-full"
                      >
                        {donor.name}
                      </button>
                      <div className="text-xs text-gray-500 truncate">{donor.city}, {donor.state}</div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <a
                      href={`mailto:${donor.email}`}
                      className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors block truncate"
                    >
                      {donor.email}
                    </a>
                    <div>
                      <a
                        href={`tel:${donor.phone}`}
                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                      >
                        {donor.phone}
                      </a>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="text-sm font-medium text-gray-900">${donor.lastGiftAmount.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{new Date(donor.lastGiftDate).toLocaleDateString()}</div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="text-sm font-medium text-gray-900">${donor.totalLifetimeGiving.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{donor.giftCount} gifts</div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="group relative">
                      <div className="text-sm font-bold text-green-600 hover:text-green-700 cursor-help transition-colors">${donor.suggestedAskAmount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500 hover:text-purple-600 cursor-help transition-colors">{donor.predictedPotential}% potential</div>
                      <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-2 px-3 z-50 w-48 shadow-lg">
                        <div className="font-semibold mb-1">AI Ask: ${donor.suggestedAskAmount.toLocaleString()}</div>
                        <div className="whitespace-pre-line">• {donor.predictedPotential}% potential score{'\n'}• Last gift: ${donor.lastGiftAmount}{'\n'}• Avg gift: ${Math.round(donor.totalLifetimeGiving / donor.giftCount)}</div>
                        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="group relative">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-help hover:opacity-80 transition-opacity ${getStatusBadge(donor.status)}`}>
                        {donor.status}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">Score: {donor.engagementScore}</div>
                      <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-2 px-3 z-50 w-48 shadow-lg">
                        <div className="font-semibold mb-1">
                          {donor.status === 'lapsed' ? 'Lapsed Status' :
                           donor.status === 'active' ? 'Active Status' :
                           donor.status === 'major' ? 'Major Donor' :
                           'New Donor'}
                        </div>
                        <div className="whitespace-pre-line">
                          {donor.status === 'lapsed' ? '• No gift 6+ months\n• Personal outreach needed\n• Reactivation priority' :
                           donor.status === 'active' ? '• Recent giving activity\n• Continue stewardship\n• Upgrade opportunity' :
                           donor.status === 'major' ? '• High-value donor\n• VIP treatment\n• Major gift potential' :
                           '• First-time donor\n• Welcome series needed\n• Second gift focus'}
                        </div>
                        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    {(() => {
                      const suggestion = getSuggestedAction(donor);
                      return (
                        <div className="group relative">
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium cursor-help ${suggestion.color} ${suggestion.bgColor} hover:opacity-80 transition-opacity`}>
                            {suggestion.icon}
                            <span className="truncate">{suggestion.action}</span>
                          </div>
                          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-2 px-3 z-50 w-48 shadow-lg">
                            <div className="font-semibold mb-1">Why {suggestion.action}?</div>
                            <div className="whitespace-pre-line">{suggestion.reasoning}</div>
                            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                          </div>
                        </div>
                      );
                    })()}
                  </td>
                  <td className="px-3 py-3 text-sm font-medium relative overflow-visible">
                    <IndividualDonorActions
                      donor={donor}
                      onRemove={handleRemoveDonor}
                      onRestore={handleRestoreDonor}
                      isRemoved={removedDonors.has(donor.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="px-6 py-4 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{((currentPage - 1) * recordsPerPage) + 1}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * recordsPerPage, totalCount)}</span> of{' '}
              <span className="font-medium">{totalCount.toLocaleString()}</span> results
            </div>
            <div className="flex items-center space-x-2">
              <button
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex space-x-1">
                {[1, 2, 3, '...', Math.ceil(totalCount / recordsPerPage)].map((page, index) => (
                  <button
                    key={index}
                    className={`px-3 py-1 text-sm border rounded ${
                      page === currentPage
                        ? 'bg-crimson-blue text-white border-crimson-blue'
                        : 'border-gray-300 hover:bg-gray-50'
                    } ${page === '...' ? 'cursor-default hover:bg-white' : ''}`}
                    disabled={page === '...'}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                disabled={currentPage >= Math.ceil(totalCount / recordsPerPage)}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 p-6 border-t border-gray-200 bg-gray-50 overflow-visible">
          <div className="flex justify-between items-center overflow-visible">
            <div className="text-sm text-gray-600">
              <div>Total Lifetime Value: <span className="font-semibold">${filteredAndSortedDonors.reduce((sum, donor) => sum + donor.totalLifetimeGiving, 0).toLocaleString()}</span></div>
              <div className="mt-1">Avg Suggested Ask: <span className="font-semibold text-green-600">${Math.round(filteredAndSortedDonors.reduce((sum, donor) => sum + donor.suggestedAskAmount, 0) / filteredAndSortedDonors.length).toLocaleString()}</span></div>
            </div>
            <div className="flex gap-2 relative overflow-visible">
              <Button variant="secondary" onClick={onClose}>Close</Button>
              <div className="relative overflow-visible">
                <ActionsDropdown
                  segmentId={segmentId}
                  segmentName={`${segmentName} (${filteredAndSortedDonors.length} donors)`}
                  donorCount={filteredAndSortedDonors.length}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Donor Profile Modal */}
      <DonorProfileModal
        donor={selectedDonor}
        isOpen={showDonorProfile}
        onClose={() => setShowDonorProfile(false)}
      />
    </div>
  );
};

export default DonorListView;
