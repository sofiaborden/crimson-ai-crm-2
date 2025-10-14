import React, { useState, useEffect } from 'react';
import DonorProfileLayoutTest3 from './DonorProfileLayoutTest3';
import { Donor } from '../../types';
import {
  HeartIcon,
  TrendingUpIcon,
  InformationCircleIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
  PhoneIcon,
  StarIcon,
  UserGroupIcon
} from '../../constants.tsx';

interface DonorProfileLayoutTestCoreTier2Props {
  donor: Donor;
}

// Enhanced Smart Bio Component interfaces and data
interface SmartBioData {
  perplexityHeadlines: string[];
  wealthSummary: string;
  sources: Array<{ name: string; url: string }>;
  perplexityCitations: Array<{ title: string; url: string }>;
  confidence: 'High' | 'Medium' | 'Low';
  lastGenerated: string;
}

// Wealth mapping based on i360 WEALTHFINDER_CODE
const WEALTH_MAPPING = {
  'A': { range: '$1.2M–$1.8M', tier: 'Top Wealth Tier: A', median: '$1.8M' },
  'B': { range: '$900k–$1.2M', tier: 'Wealth Tier: B', median: '$1.2M' },
  'C': { range: '$800k–$900k', tier: 'Wealth Tier: C', median: '$900k' },
  'D': { range: '$700k–$800k', tier: 'Wealth Tier: D', median: '$800k' },
  'E': { range: '$600k–$700k', tier: 'Wealth Tier: E', median: '$700k' },
  'F': { range: '$400k–$600k', tier: 'Wealth Tier: F', median: '$500k' },
  'G': { range: '$300k–$400k', tier: 'Wealth Tier: G', median: '$400k' },
  'H': { range: '$200k–$300k', tier: 'Wealth Tier: H', median: '$300k' },
  'I': { range: '$180k–$200k', tier: 'Wealth Tier: I', median: '$200k' },
  'J': { range: '$160k–$180k', tier: 'Wealth Tier: J', median: '$180k' },
  'K': { range: '$140k–$160k', tier: 'Wealth Tier: K', median: '$160k' },
  'L': { range: '$120k–$140k', tier: 'Wealth Tier: L', median: '$140k' },
  'M': { range: '$100k–$120k', tier: 'Wealth Tier: M', median: '$120k' },
  'N': { range: '$80k–$100k', tier: 'Wealth Tier: N', median: '$100k' },
  'O': { range: '$60k–$80k', tier: 'Wealth Tier: O', median: '$80k' },
  'P': { range: '$30k–$60k', tier: 'Wealth Tier: P', median: '$60k' },
  'Q': { range: '$20k–$30k', tier: 'Wealth Tier: Q', median: '$30k' },
  'R': { range: '$10k–$20k', tier: 'Wealth Tier: R', median: '$20k' },
  'S': { range: '$2k–$10k', tier: 'Wealth Tier: S', median: '$10k' },
  'T': { range: 'Below $10k', tier: 'Lowest Wealth Tier: T', median: '$2k' }
};

// Mock wealth data for existing profiles
const getMockWealthCode = (donorName: string): string | null => {
  if (donorName.includes('Joseph') || donorName.includes('Banks')) return 'A';
  if (donorName.includes('Sofia') || donorName.includes('Amaya')) return 'B';
  if (donorName.includes('Brooke') || donorName.includes('Taylor')) return 'C';
  if (donorName.includes('Charles') || donorName.includes('Logan')) return 'D';
  if (donorName.includes('Jeff') || donorName.includes('Wernsing')) return 'C';
  return Math.random() > 0.3 ? ['A', 'B', 'C', 'D', 'E', 'F'][Math.floor(Math.random() * 6)] : null;
};



// Upgrade Modal component
const UpgradeModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-lg font-bold text-gray-900">Upgrade Your Plan</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-6">You have used your 5 free credits for the month. Would you like to upgrade?</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Growth Tier</h3>
              <p className="text-2xl font-bold text-green-600 mb-2">$49/month</p>
              <ul className="text-sm text-gray-600 space-y-1 mb-4">
                <li>• CRM-based predictions (~65% accuracy)</li>
                <li>• 50 AI insights per month</li>
                <li>• Basic donor scoring</li>
                <li>• Email support</li>
              </ul>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                Choose Growth
              </button>
            </div>

            <div className="border border-blue-500 rounded-lg p-4 bg-blue-50">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">Enterprise</h3>
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">Recommended</span>
              </div>
              <p className="text-2xl font-bold text-blue-600 mb-2">$149/month</p>
              <ul className="text-sm text-gray-600 space-y-1 mb-4">
                <li>• Enhanced with national data (~80% accuracy)</li>
                <li>• Unlimited AI insights</li>
                <li>• Advanced donor scoring & wealth data</li>
                <li>• Priority support</li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Choose Enterprise
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Generate Perplexity headlines using backend API route
const generatePerplexityHeadlines = async (donor: Donor): Promise<{headlines: string[], citations: Array<{title: string, url: string}>}> => {
  try {
    console.log('🔍 Generating bio for:', donor.name, 'at', donor.employment?.employer || 'Unknown employer');

    // Call our backend API server instead of Perplexity directly
    const response = await fetch('http://localhost:3000/api/generate-bio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: donor.name,
        occupation: donor.employment?.occupation,
        employer: donor.employment?.employer,
        location: donor.primaryAddress ? `${donor.primaryAddress.city}, ${donor.primaryAddress.state}` : donor.address,
        email: donor.email,
        industry: donor.employment?.industry
      })
    });

    console.log('🔍 Backend API Response Status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('🔍 Backend API Error:', errorData);
      throw new Error(errorData.error || `Backend API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('🔍 Backend API Success:', data);

    if (data.success && data.headlines && data.headlines.length > 0) {
      console.log('✅ Successfully generated headlines via backend API');
      console.log('✅ Citations received:', data.citations ? data.citations.length : 0);
      return {
        headlines: data.headlines,
        citations: data.citations || []
      };
    } else {
      throw new Error('No headlines returned from backend API');
    }

  } catch (error) {
    console.error('❌ Perplexity API error:', error);
    console.log('🔄 Using fallback headlines due to API error');

    // Return realistic fallback data based on employment information
    if (donor.employment) {
      const fallbackHeadlines = [
        `${donor.name} serves as ${donor.employment.occupation} at ${donor.employment.employer}.`,
        `Professional with experience in ${donor.employment.industry || 'their field'}.`,
        `Based in ${donor.primaryAddress?.city || 'their location'} with established career background.`
      ];
      console.log('🔄 Employment-based fallback:', fallbackHeadlines);
      return { headlines: fallbackHeadlines, citations: [] };
    }

    // Generic fallback for profiles without employment data
    const genericFallback = [
      `${donor.name} is a professional with established community connections.`,
      `Active in their local area with potential for civic engagement.`,
      `Profile available for further research and outreach opportunities.`
    ];
    console.log('🔄 Generic fallback:', genericFallback);
    return { headlines: genericFallback, citations: [] };
  }
};

// Generate wealth summary from i360 data
const generateWealthSummary = (donor: Donor): string => {
  const wealthCode = getMockWealthCode(donor.name);

  if (!wealthCode || !WEALTH_MAPPING[wealthCode as keyof typeof WEALTH_MAPPING]) {
    return '';
  }

  const wealthData = WEALTH_MAPPING[wealthCode as keyof typeof WEALTH_MAPPING];
  return `Estimated wealth: ${wealthData.range} (${wealthData.tier})`;
};

// Enterprise AI Insights component (based on the image)
const EnterpriseAIInsights: React.FC<{ donor: Donor }> = ({ donor }) => {
  const [activeTab, setActiveTab] = useState<'insights' | 'bio'>('insights');
  const [showDialRModal, setShowDialRModal] = useState(false);
  const [showDialRTooltip, setShowDialRTooltip] = useState(false);
  const [selectedList, setSelectedList] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  const handleDialRClick = () => {
    setShowDialRModal(true);
  };

  const handleDialRSelection = (assignmentType: string, targetName?: string) => {
    let message = '';

    switch (assignmentType) {
      case 'my-list':
        message = `📞 Adding ${donor.name} to your personal DialR list...\n\nReady for dialing in 15 seconds`;
        break;
      case 'list-assignment':
        message = `📞 Assigning ${donor.name} to DialR list...\n\nList: "${targetName}"\nAssignment complete!`;
        break;
      case 'user-assignment':
        message = `📞 Assigning ${donor.name} to team member...\n\nAssigned to: ${targetName}\nNotification sent to user!`;
        break;
      default:
        message = `📞 Adding ${donor.name} to DialR...`;
    }

    console.log(`DialR ${assignmentType}:`, { donor: donor.name, targetName });
    alert(message);

    // Reset form state
    setSelectedList('');
    setSelectedUser('');
    setShowDialRModal(false);
  };

  // Mock existing organizational lists
  const existingLists = [
    'Major Donors 2024',
    'Monthly Sustainers',
    'Event Prospects',
    'Board Contacts',
    'VIP Supporters'
  ];

  // Mock team members
  const teamMembers = [
    'Sarah Johnson',
    'Mike Chen',
    'Emily Rodriguez',
    'David Kim',
    'Lisa Thompson'
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-4 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Custom CSS for pulse animation */}
      <style jsx>{`
        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          25% {
            transform: scale(1.15);
            opacity: 1;
          }
          50% {
            transform: scale(1);
            opacity: 0.9;
          }
          75% {
            transform: scale(1.08);
            opacity: 1;
          }
        }
        .pulse-heart {
          animation: heartbeat 1.5s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>

      {/* Header with Pulse Check and Enterprise badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HeartIcon className="w-5 h-5 text-red-500 pulse-heart" />
          <h3 className="text-lg font-semibold text-gray-900">Pulse Check</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
            Enterprise
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Insights/Bio Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                activeTab === 'insights'
                  ? 'bg-white shadow-sm text-crimson-blue'
                  : 'hover:bg-white/50 text-gray-600'
              }`}
            >
              <SparklesIcon className="w-3 h-3 inline mr-1" />
              Insights
            </button>
            <button
              onClick={() => setActiveTab('bio')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                activeTab === 'bio'
                  ? 'bg-white shadow-sm text-crimson-blue'
                  : 'hover:bg-white/50 text-gray-600'
              }`}
            >
              <SparklesIcon className="w-3 h-3 inline mr-1" />
              Smart Bio
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'insights' ? (
          <>
            {/* Estimated Wealth */}
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Estimated Wealth: $800k-$900k</h4>
            </div>

            {/* Four Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-lg font-bold text-gray-900">$15,200</div>
                <div className="text-xs text-gray-600">Total Given (CTD)</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-200">
                <div className="text-lg font-bold text-blue-600">$24,500</div>
                <div className="text-xs text-blue-600">Potential (CTD)</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-200">
                <div className="text-lg font-bold text-blue-600">$1,000</div>
                <div className="text-xs text-blue-600">Max Ask</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-200">
                <div className="text-sm font-bold text-blue-600">Next 30 Days</div>
                <div className="text-xs text-blue-600">Gift Readiness</div>
              </div>
            </div>

            {/* Progress Bar - 65% filled */}
            <div className="mb-4 relative group">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden cursor-help">
                <div
                  className="h-full w-[65%] rounded-full"
                  style={{ background: 'linear-gradient(to right, #2563eb, #ef4444)' }}
                ></div>
              </div>
              {/* Custom Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                The donor has given $15,200 of their estimated $24,500 capacity.
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <ExclamationTriangleIcon className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-gray-700">Below capacity at 62% - eligible for upgrade.</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Level - Up List</span>
              </div>
            </div>
          </>
        ) : (
          <div className="py-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-crimson-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Enhanced Smart Bio</h4>
              <p className="text-sm text-gray-600 mb-4">
                Get a complete donor snapshot with intelligence you can act on. See what matters most: recent news, issue alignment, and wealth signals.
              </p>
              <button className="px-6 py-3 bg-crimson-blue text-white text-sm font-semibold rounded-lg hover:bg-crimson-dark-blue transition-colors shadow-md hover:shadow-lg">
                <SparklesIcon className="w-4 h-4 inline mr-2" />
                Generate Enhanced Bio
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DialR Button */}
      <div className="flex justify-end">
        <div className="relative">
          <button
            onClick={handleDialRClick}
            onMouseEnter={() => setShowDialRTooltip(true)}
            onMouseLeave={() => setShowDialRTooltip(false)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
          >
            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
            DialR
          </button>
          {showDialRTooltip && (
            <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
              Send to DialR
            </div>
          )}
        </div>
      </div>

      {/* DialR Modal */}
      {showDialRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Add to DialR</h3>
                  <p className="text-sm text-gray-600 mt-1">1 contact from "Pulse Check Insights"</p>
                </div>
                <button
                  onClick={() => setShowDialRModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 mb-4 text-sm">
                  Select a DialR list to add this donor for phone outreach campaigns.
                </p>

                <div className="space-y-3">
                  {/* Add to My List - Blue bordered section */}
                  <button
                    onClick={() => handleDialRSelection('my-list')}
                    className="w-full p-4 border-2 border-blue-500 rounded-lg hover:bg-blue-50 transition-colors text-left mb-4"
                  >
                    <div className="flex items-center gap-3">
                      <PhoneIcon className="w-6 h-6 text-blue-500" />
                      <div>
                        <div className="text-lg font-medium text-gray-900">Add to My List</div>
                        <div className="text-sm text-gray-600">Add to your personal call list</div>
                      </div>
                    </div>
                  </button>

                  {/* Or divider */}
                  <div className="text-center text-gray-500 text-sm mb-4">or</div>

                  {/* Assign to List */}
                  <div className="mb-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Assign to List</h4>
                    <select
                      value={selectedList}
                      onChange={(e) => setSelectedList(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a list...</option>
                      {existingLists.map((list) => (
                        <option key={list} value={list}>{list}</option>
                      ))}
                    </select>
                    {selectedList && (
                      <button
                        onClick={() => handleDialRSelection('list-assignment', selectedList)}
                        className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Assign to {selectedList}
                      </button>
                    )}
                  </div>

                  {/* Assign to User */}
                  <div className="mb-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Assign to User</h4>
                    <select
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a user...</option>
                      {teamMembers.map((member) => (
                        <option key={member} value={member}>{member}</option>
                      ))}
                    </select>
                    {selectedUser && (
                      <button
                        onClick={() => handleDialRSelection('user-assignment', selectedUser)}
                        className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Assign to {selectedUser}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Cancel button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setShowDialRModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Core Tier 2 - Pulse Check component
const CoreTier2PulseCheck: React.FC<{ donor: Donor }> = ({ donor }) => {
  const [showUpgradeTooltip, setShowUpgradeTooltip] = useState(false);
  const [credits, setCredits] = useState(5);
  const [showEnterprise, setShowEnterprise] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'insights' | 'bio'>('insights');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Smart Bio state
  const [smartBioData, setSmartBioData] = useState<SmartBioData | null>(null);
  const [isGeneratingSmartBio, setIsGeneratingSmartBio] = useState(false);
  const [showSmartBioConfirmModal, setShowSmartBioConfirmModal] = useState(false);
  const [smartBioError, setSmartBioError] = useState('');
  const [showCitationsModal, setShowCitationsModal] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [originalBioText, setOriginalBioText] = useState<string[]>([]);
  const [editedBioText, setEditedBioText] = useState<string[]>([]);
  const [showQuickActionsDropdown, setShowQuickActionsDropdown] = useState(false);

  // Citation management state
  const [permanentlyHiddenCitations, setPermanentlyHiddenCitations] = useState<Set<string>>(new Set());
  const [sessionHiddenCitations, setSessionHiddenCitations] = useState<Set<string>>(new Set());
  const [showHiddenSources, setShowHiddenSources] = useState(false);
  const [showHideCitationModal, setShowHideCitationModal] = useState(false);
  const [citationToHide, setCitationToHide] = useState<{title: string; url: string} | null>(null);

  // User feedback system state
  const [feedbackGiven, setFeedbackGiven] = useState<'positive' | 'negative' | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [showFeedbackToast, setShowFeedbackToast] = useState(false);

  // DialR state
  const [showDialRModal, setShowDialRModal] = useState(false);
  const [showDialRTooltip, setShowDialRTooltip] = useState(false);
  const [selectedList, setSelectedList] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  // Load permanently hidden citations from localStorage on component mount
  useEffect(() => {
    const savedHiddenCitations = localStorage.getItem(`hiddenCitations_${donor.id}`);
    if (savedHiddenCitations) {
      try {
        const hiddenUrls = JSON.parse(savedHiddenCitations);
        setPermanentlyHiddenCitations(new Set(hiddenUrls));
      } catch (error) {
        console.error('Failed to load hidden citations:', error);
      }
    }
  }, [donor.id]);

  // Enhanced Smart Bio generation with multiple data sources
  const generateEnhancedSmartBio = async () => {
    setIsGeneratingSmartBio(true);
    setSmartBioError('');

    try {
      // Run all API calls in parallel with timeout handling
      const [perplexityHeadlines, wealthSummary] = await Promise.allSettled([
        generatePerplexityHeadlines(donor),
        Promise.resolve(generateWealthSummary(donor)) // Wrap sync function in Promise
      ]);

      // Extract results with fallbacks for failed promises
      const perplexityResult = perplexityHeadlines.status === 'fulfilled'
        ? perplexityHeadlines.value
        : { headlines: [`${donor.name} is a political donor with available public records.`], citations: [] };

      const headlines = perplexityResult.headlines;
      const citations = perplexityResult.citations;

      const wealth = wealthSummary.status === 'fulfilled'
        ? wealthSummary.value
        : '';

      // Compile sources
      const sources = [
        { name: 'Perplexity', url: 'https://www.perplexity.ai' },
        ...(wealth ? [{ name: 'i360 Internal Data', url: '#' }] : [])
      ];

      const bioData: SmartBioData = {
        perplexityHeadlines: headlines,
        wealthSummary: wealth,
        sources,
        perplexityCitations: citations,
        confidence: 'High',
        lastGenerated: new Date().toISOString()
      };

      setSmartBioData(bioData);
      setOriginalBioText(headlines);
      setEditedBioText(headlines);
    } catch (error) {
      console.error('Failed to generate enhanced smart bio:', error);
      setSmartBioError(error instanceof Error ? error.message : 'Failed to generate bio. Please try again.');
    } finally {
      setIsGeneratingSmartBio(false);
      setShowSmartBioConfirmModal(false);
    }
  };

  // Bio Review Process Functions
  const handleEditBio = () => {
    setIsEditingBio(true);
    console.log('✏️ Editing bio');
  };

  const handleResetBio = () => {
    setEditedBioText(originalBioText);
    if (smartBioData) {
      const updatedBioData = {
        ...smartBioData,
        perplexityHeadlines: originalBioText
      };
      setSmartBioData(updatedBioData);
    }
    console.log('🔄 Bio reset to original Perplexity content');
  };

  // User feedback functions
  const handlePositiveFeedback = () => {
    if (feedbackGiven) return; // Prevent multiple submissions

    setFeedbackGiven('positive');
    setShowFeedbackToast(true);

    // Store feedback data
    const feedbackData = {
      donorId: donor.id,
      timestamp: new Date().toISOString(),
      feedbackType: 'positive',
      bioGenerated: smartBioData?.lastGenerated
    };

    // Save to localStorage for localhost testing
    const existingFeedback = JSON.parse(localStorage.getItem('smartBioFeedback') || '[]');
    existingFeedback.push(feedbackData);
    localStorage.setItem('smartBioFeedback', JSON.stringify(existingFeedback));

    console.log('✅ Positive feedback recorded:', feedbackData);

    // Auto-dismiss toast after 3 seconds
    setTimeout(() => setShowFeedbackToast(false), 3000);
  };

  const handleNegativeFeedback = () => {
    if (feedbackGiven) return; // Prevent multiple submissions

    setFeedbackGiven('negative');
    setShowFeedbackModal(true);
  };

  const submitNegativeFeedback = () => {
    // Store feedback data
    const feedbackData = {
      donorId: donor.id,
      timestamp: new Date().toISOString(),
      feedbackType: 'negative',
      comment: feedbackComment,
      bioGenerated: smartBioData?.lastGenerated
    };

    // Save to localStorage for localhost testing
    const existingFeedback = JSON.parse(localStorage.getItem('smartBioFeedback') || '[]');
    existingFeedback.push(feedbackData);
    localStorage.setItem('smartBioFeedback', JSON.stringify(existingFeedback));

    console.log('📝 Negative feedback recorded:', feedbackData);

    setShowFeedbackModal(false);
    setFeedbackComment('');
    setShowFeedbackToast(true);

    // Auto-dismiss toast after 3 seconds
    setTimeout(() => setShowFeedbackToast(false), 3000);
  };

  // Citation management functions
  const getVisibleCitations = () => {
    if (!smartBioData?.perplexityCitations) return [];
    return smartBioData.perplexityCitations.filter(citation =>
      !permanentlyHiddenCitations.has(citation.url) &&
      !sessionHiddenCitations.has(citation.url)
    );
  };

  const getHiddenCitations = () => {
    if (!smartBioData?.perplexityCitations) return [];
    return smartBioData.perplexityCitations.filter(citation =>
      permanentlyHiddenCitations.has(citation.url) ||
      sessionHiddenCitations.has(citation.url)
    );
  };

  const handleHideCitation = (citation: {title: string; url: string}) => {
    setCitationToHide(citation);
    setShowHideCitationModal(true);
  };

  const confirmHideCitation = (permanent: boolean) => {
    if (!citationToHide) return;

    if (permanent) {
      const newHiddenCitations = new Set(permanentlyHiddenCitations);
      newHiddenCitations.add(citationToHide.url);
      setPermanentlyHiddenCitations(newHiddenCitations);

      // Save to localStorage
      localStorage.setItem(
        `hiddenCitations_${donor.id}`,
        JSON.stringify(Array.from(newHiddenCitations))
      );
    } else {
      const newSessionHidden = new Set(sessionHiddenCitations);
      newSessionHidden.add(citationToHide.url);
      setSessionHiddenCitations(newSessionHidden);
    }

    setShowHideCitationModal(false);
    setCitationToHide(null);
  };

  const handleCopyToClipboard = () => {
    if (!smartBioData) return;

    const bioText = smartBioData.perplexityHeadlines.join('\n\n');
    const wealthText = smartBioData.wealthSummary ? `\n\n${smartBioData.wealthSummary}` : '';
    const fullText = bioText + wealthText;

    navigator.clipboard.writeText(fullText).then(() => {
      console.log('📋 Bio copied to clipboard');
    });
  };

  const handleSaveEditedBio = () => {
    if (smartBioData) {
      const updatedBioData = {
        ...smartBioData,
        perplexityHeadlines: editedBioText
      };
      setSmartBioData(updatedBioData);
      setIsEditingBio(false);
      console.log('✅ Edited bio saved:', editedBioText);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingBio(false);
    setEditedBioText(smartBioData?.perplexityHeadlines || []);
    console.log('❌ Edit cancelled');
  };

  // Generate Pulse Check insights based on donor data
  const getPulseCheckInsight = (donor: Donor) => {
    // Return single static insight message
    return {
      icon: TrendingUpIcon,
      text: "This donor is in your top 10% of likely re-engagers this quarter.",
      confidence: "Moderate",
      action: "Consider outreach before next campaign."
    };
  };

  const insight = getPulseCheckInsight(donor);

  // DialR handlers
  const handleDialRClick = () => {
    setShowDialRModal(true);
  };

  const handleDialRSelection = (assignmentType: string, targetName?: string) => {
    let message = '';

    switch (assignmentType) {
      case 'my-list':
        message = `📞 Adding ${donor.name} to your personal DialR list...\n\nReady for dialing in 15 seconds`;
        break;
      case 'list-assignment':
        message = `📞 Assigning ${donor.name} to DialR list...\n\nList: "${targetName}"\nAssignment complete!`;
        break;
      case 'user-assignment':
        message = `📞 Assigning ${donor.name} to team member...\n\nAssigned to: ${targetName}\nNotification sent to user!`;
        break;
      default:
        message = `📞 Adding ${donor.name} to DialR...`;
    }

    console.log(`DialR ${assignmentType}:`, { donor: donor.name, targetName });
    alert(message);

    // Reset form state
    setSelectedList('');
    setSelectedUser('');
    setShowDialRModal(false);
  };

  // Mock existing organizational lists
  const existingLists = [
    'Major Donors 2024',
    'Monthly Sustainers',
    'Event Prospects',
    'Board Contacts',
    'VIP Supporters'
  ];

  // Mock team members
  const teamMembers = [
    'Sarah Johnson',
    'Mike Chen',
    'Emily Rodriguez',
    'David Kim',
    'Lisa Thompson'
  ];

  const handleViewNow = () => {
    if (credits > 0) {
      setIsTransitioning(true);
      setCredits(credits - 1);

      // Smooth transition animation
      setTimeout(() => {
        setShowEnterprise(true);
        setShowToast(true);
        setIsTransitioning(false);

        // Auto-dismiss toast after 3.5 seconds
        setTimeout(() => {
          setShowToast(false);
        }, 3500);
      }, 200);
    } else {
      setShowUpgradeModal(true);
    }
  };

  // If showing Enterprise view, render the Enterprise AI Insights
  if (showEnterprise) {
    return (
      <div className={`transition-all duration-400 ease-out ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="relative">
          {showToast && (
            <div className="absolute -top-2 -right-2 z-10">
              <div className="bg-crimson-blue text-white px-3 py-2 rounded-lg shadow-lg animate-bounce">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">{`1 credit used, ${credits} remaining`}</span>
                </div>
              </div>
            </div>
          )}
          <EnterpriseAIInsights donor={donor} />
        </div>
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
        />
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-4 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Custom CSS for pulse animation */}
      <style jsx>{`
        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          25% {
            transform: scale(1.15);
            opacity: 1;
          }
          50% {
            transform: scale(1);
            opacity: 0.9;
          }
          75% {
            transform: scale(1.08);
            opacity: 1;
          }
        }
        .pulse-heart {
          animation: heartbeat 1.5s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>

      {/* Header with Pulse Check and Core badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HeartIcon className="w-5 h-5 text-red-500 pulse-heart" />
          <h3 className="text-lg font-semibold text-gray-900">Pulse Check</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
            Core
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Insights/Bio Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                activeTab === 'insights'
                  ? 'bg-white shadow-sm text-crimson-blue'
                  : 'hover:bg-white/50 text-gray-600'
              }`}
            >
              <SparklesIcon className="w-3 h-3 inline mr-1" />
              Insights
            </button>
            <button
              onClick={() => setActiveTab('bio')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                activeTab === 'bio'
                  ? 'bg-white shadow-sm'
                  : 'hover:bg-white/50 text-gray-600'
              }`}
              style={{
                color: activeTab === 'bio' ? '#2563eb' : '#6b7280'
              }}
            >
              <SparklesIcon className="w-3 h-3 inline mr-1" style={{ color: '#2563eb' }} />
              Smart Bio
            </button>
          </div>
          <div
            className="relative"
            onMouseEnter={() => setShowUpgradeTooltip(true)}
            onMouseLeave={() => setShowUpgradeTooltip(false)}
          >
            <InformationCircleIcon className="w-4 h-4 text-gray-400 cursor-help" />
            {showUpgradeTooltip && (
              <div className="absolute right-0 top-6 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-10">
                <div className="font-medium mb-1">Pulse Check</div>
                <div className="text-gray-300">
                  Core tier provides basic engagement insights. Upgrade for detailed predictions,
                  specific ask amounts, and optimal timing recommendations.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'insights' ? (
          <>
            <div className="flex items-start gap-3">
              <insight.icon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-gray-900 font-medium mb-1">{insight.text}</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-600">Confidence:</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {insight.confidence}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Suggested Action:</span> {insight.action}
                </p>
              </div>
            </div>


          </>
        ) : (
          <div>
            {smartBioData ? (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between p-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4" style={{ color: '#2563eb' }} />
                    <h3 className="text-base font-semibold text-gray-900">Enhanced Smart Bio</h3>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">{smartBioData.confidence}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowSmartBioConfirmModal(true)}
                      disabled={isGeneratingSmartBio}
                      className="text-xs text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Refresh
                    </button>
                  </div>
                </div>

                {/* Bio Content */}
                <div className="p-4">
                  <div className="prose prose-sm max-w-none">
                    {/* Headlines - with editing capability */}
                    <div className="mb-3">
                      {isEditingBio ? (
                        <div className="space-y-2">
                          {editedBioText.map((headline, index) => (
                            <textarea
                              key={index}
                              value={headline}
                              onChange={(e) => {
                                const newText = [...editedBioText];
                                newText[index] = e.target.value;
                                setEditedBioText(newText);
                              }}
                              className="w-full p-2 text-sm border border-gray-300 rounded resize-none"
                              rows={2}
                            />
                          ))}
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={handleSaveEditedBio}
                              className="px-3 py-1 text-white text-xs rounded transition-all duration-200 hover:shadow-md hover:scale-105"
                              style={{ backgroundColor: '#2563eb' }}
                            >
                              Save Changes
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-3 py-1 bg-gray-500 text-white text-xs rounded transition-all duration-200 hover:bg-gray-600 hover:shadow-md hover:scale-105"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="transition-opacity duration-300 ease-out">
                          {smartBioData.perplexityHeadlines.map((headline, index) => (
                            <p key={index} className="text-gray-900 text-sm mb-2 transition-all duration-200" style={{ lineHeight: '1.6' }}>
                              {headline}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Wealth Summary */}
                    {smartBioData.wealthSummary && (
                      <div className="bg-blue-gray-50 border-l-4 pl-4 py-2 mb-3 rounded-r-md transition-all duration-200 hover:bg-blue-gray-100" style={{ borderLeftColor: '#2563eb' }}>
                        <p className="text-gray-700 text-sm font-medium">
                          {smartBioData.wealthSummary}
                        </p>
                      </div>
                    )}

                    {/* Sources and Edit/Reset buttons positioned below wealth info */}
                    <div className="flex items-center justify-between mb-3">
                      {/* Sources Button - Bottom Left */}
                      {smartBioData.perplexityCitations && smartBioData.perplexityCitations.length > 0 ? (
                        <button
                          onClick={() => setShowCitationsModal(true)}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md hover:scale-105"
                          style={{ backgroundColor: '#2563eb', color: 'white' }}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          Sources ({smartBioData.perplexityCitations.length})
                        </button>
                      ) : (
                        <div></div>
                      )}

                      {/* Edit and Reset Icon Buttons - Bottom Right */}
                      <div className="flex items-center gap-2">
                        {/* Edit Icon Button */}
                        <button
                          onClick={handleEditBio}
                          className="p-1.5 rounded-md transition-all duration-200 hover:shadow-md hover:scale-105 group relative"
                          style={{ backgroundColor: '#2563eb' }}
                          title="Edit"
                        >
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>

                        {/* Reset Icon Button */}
                        <button
                          onClick={handleResetBio}
                          className="p-1.5 bg-gray-500 rounded-md transition-all duration-200 hover:bg-gray-600 hover:shadow-md hover:scale-105 group relative"
                          title="Reset"
                        >
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio Actions - Timestamp and Actions Dropdown */}
                {!isEditingBio && (
                  <div className="px-4 py-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500">Generated {new Date(smartBioData.lastGenerated).toLocaleDateString()}</span>

                        {/* Feedback Buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={handlePositiveFeedback}
                            disabled={feedbackGiven !== null}
                            className={`p-1 rounded transition-colors ${
                              feedbackGiven === 'positive'
                                ? 'text-blue-600 bg-blue-100'
                                : feedbackGiven === null
                                  ? 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                                  : 'text-gray-300 cursor-not-allowed'
                            }`}
                            title="This bio was helpful"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L9 7m5 3v4M9 7H7l-1.5-1.5M9 7v10l-1.5 1.5" />
                            </svg>
                          </button>
                          <button
                            onClick={handleNegativeFeedback}
                            disabled={feedbackGiven !== null}
                            className={`p-1 rounded transition-colors ${
                              feedbackGiven === 'negative'
                                ? 'text-red-600 bg-red-100'
                                : feedbackGiven === null
                                  ? 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                                  : 'text-gray-300 cursor-not-allowed'
                            }`}
                            title="This bio needs improvement"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L15 17m-7-3V6l1.5-1.5M15 17h2l1.5 1.5M15 17v-10l1.5-1.5" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Actions Dropdown */}
                        <div className="relative">
                          <button
                            onClick={() => setShowQuickActionsDropdown(!showQuickActionsDropdown)}
                            className="text-white text-xs rounded px-3 py-1 transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center gap-1"
                            style={{ backgroundColor: '#2563eb' }}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                            Actions
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>

                          {showQuickActionsDropdown && (
                            <div className="absolute right-0 bottom-full mb-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                              <div className="py-1">
                                <button
                                  onClick={() => {
                                    setShowSmartBioConfirmModal(true);
                                    setShowQuickActionsDropdown(false);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors duration-150"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                  </svg>
                                  Refresh
                                </button>
                                <button
                                  onClick={() => {
                                    console.log('Report Issue clicked');
                                    setShowQuickActionsDropdown(false);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors duration-150"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                  </svg>
                                  Report Issue
                                </button>
                                <button
                                  onClick={() => {
                                    handleCopyToClipboard();
                                    setShowQuickActionsDropdown(false);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors duration-150"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                  Copy Bio
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-xl p-4 border border-gray-200" style={{background: 'linear-gradient(135deg, #dbeafe 0%, #dcfce7 100%)'}}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{backgroundColor: '#2563eb'}}>
                    <SparklesIcon className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Enhanced Smart Bio</h4>
                  </div>
                </div>

                <div className="text-center py-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Get a complete donor snapshot with intelligence you can act on.</h3>
                  <p className="text-xs text-gray-600 mb-4">See what matters most: recent news, issue alignment, and<br />wealth signals, summarized for action.</p>
                  <button
                    onClick={() => setShowSmartBioConfirmModal(true)}
                    disabled={isGeneratingSmartBio}
                    className="text-white text-xs font-semibold py-2 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
                    style={{backgroundColor: '#2563eb'}}
                    onMouseEnter={(e) => !isGeneratingSmartBio && (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                    onMouseLeave={(e) => !isGeneratingSmartBio && (e.currentTarget.style.backgroundColor = '#2563eb')}
                  >
                    {isGeneratingSmartBio ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white inline-block mr-1"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="w-3 h-3 inline mr-1" />
                        Create Enhanced Bio
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Upgrade CTA with Preview Cards - Only show on Pulse Check (insights) tab */}
        {activeTab === 'insights' && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="font-medium text-blue-900 mb-1" style={{ fontSize: '0.8rem' }}>
                ⚠️ You're missing out on the top-performing ask windows for this donor. Unlock specific ask timing, ranges, and gift likelihood — powered by CrimsonPulse AI.
              </p>
            </div>
            <div className="flex items-center gap-3 ml-4">
              {/* Preview Cards */}
              <div className="flex gap-2">
                {/* Max Ask Preview Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-3 min-w-[135px] text-center">
                  <div className="text-lg font-bold text-blue-600" style={{
                    filter: 'blur(4px)',
                    userSelect: 'none'
                  }}>
                    $2,500
                  </div>
                  <div className="text-xs text-blue-600">Max Ask</div>
                </div>

                {/* Gift Readiness Preview Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-3 min-w-[135px] text-center">
                  <div className="text-lg font-bold text-blue-600" style={{
                    filter: 'blur(4px)',
                    userSelect: 'none'
                  }}>
                    Next 14 Days
                  </div>
                  <div className="text-xs text-blue-600">Gift Readiness</div>
                </div>
              </div>

              <button
                onClick={handleViewNow}
                className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                View Now
              </button>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Toast and Upgrade Modal */}
      {showToast && (
        <Toast
          message={`1 credit used, ${credits} remaining`}
          onClose={() => setShowToast(false)}
        />
      )}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />

      {/* Enhanced Smart Bio Confirmation Modal */}
      {showSmartBioConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{backgroundColor: '#2563eb'}}>
                  <SparklesIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Generate Enhanced Smart Bio</h3>
                </div>
              </div>

              <div className="mb-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <ExclamationTriangleIcon className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Cost Confirmation</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    This will generate a comprehensive donor bio using AI research. Estimated cost: <strong>~$0.02</strong>
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowSmartBioConfirmModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={generateEnhancedSmartBio}
                  disabled={isGeneratingSmartBio}
                  className="flex-1 px-4 py-2 text-white rounded-lg transition-all duration-200 hover:shadow-lg disabled:opacity-50"
                  style={{ backgroundColor: '#2563eb' }}
                  onMouseEnter={(e) => !isGeneratingSmartBio && (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                  onMouseLeave={(e) => !isGeneratingSmartBio && (e.currentTarget.style.backgroundColor = '#2563eb')}
                >
                  {isGeneratingSmartBio ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    'Generate Bio'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DialR Modal - Smart Segments Pattern */}
      {showDialRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Add to DialR</h3>
                  <p className="text-sm text-gray-600 mt-1">1 contact from "Pulse Check Insights"</p>
                </div>
                <button
                  onClick={() => setShowDialRModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 mb-4 text-sm">
                  Select a DialR list to add this donor for phone outreach campaigns.
                </p>

                <div className="space-y-3">
                  {/* Add to My List - Blue bordered section */}
                  <button
                    onClick={() => handleDialRSelection('my-list')}
                    className="w-full p-4 border-2 border-blue-500 rounded-lg hover:bg-blue-50 transition-colors text-left mb-4"
                  >
                    <div className="flex items-center gap-3">
                      <PhoneIcon className="w-6 h-6 text-blue-500" />
                      <div>
                        <div className="text-lg font-medium text-gray-900">Add to My List</div>
                        <div className="text-sm text-gray-600">Add to your personal call list</div>
                      </div>
                    </div>
                  </button>

                  {/* Or divider */}
                  <div className="text-center text-gray-500 text-sm mb-4">or</div>

                  {/* Assign to List */}
                  <div className="mb-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Assign to List</h4>
                    <select
                      value={selectedList}
                      onChange={(e) => setSelectedList(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a list...</option>
                      {existingLists.map((list) => (
                        <option key={list} value={list}>{list}</option>
                      ))}
                    </select>
                    {selectedList && (
                      <button
                        onClick={() => handleDialRSelection('list-assignment', selectedList)}
                        className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Assign to {selectedList}
                      </button>
                    )}
                  </div>

                  {/* Assign to User */}
                  <div className="mb-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Assign to User</h4>
                    <select
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a user...</option>
                      {teamMembers.map((member) => (
                        <option key={member} value={member}>{member}</option>
                      ))}
                    </select>
                    {selectedUser && (
                      <button
                        onClick={() => handleDialRSelection('user-assignment', selectedUser)}
                        className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Assign to {selectedUser}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Cancel button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setShowDialRModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Toast */}
      {showFeedbackToast && (
        <div className="fixed top-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L9 7m5 3v4M9 7H7l-1.5-1.5M9 7v10l-1.5 1.5" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Thank you for your feedback!</h4>
              <p className="text-xs text-gray-600">Your input helps us improve the Smart Bio feature.</p>
            </div>
          </div>
        </div>
      )}

      {/* Negative Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Help us improve</h3>
              <p className="text-sm text-gray-600 mb-4">
                What could be better about this Smart Bio? Your feedback helps us improve our AI research.
              </p>
              <textarea
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                placeholder="Tell us what could be improved..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    setShowFeedbackModal(false);
                    setFeedbackComment('');
                    setFeedbackGiven(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitNegativeFeedback}
                  disabled={!feedbackComment.trim()}
                  className="flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50"
                  style={{ backgroundColor: '#2563eb' }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Citations Modal */}
      {showCitationsModal && smartBioData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Sources ({getVisibleCitations().length} visible{getHiddenCitations().length > 0 ? `, ${getHiddenCitations().length} hidden` : ''})
                </h3>
                <button
                  onClick={() => setShowCitationsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {getVisibleCitations().length > 0 ? (
                <div className="space-y-4">
                  {getVisibleCitations().map((citation, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-2">{citation.title}</h4>
                          <a
                            href={citation.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 break-all"
                          >
                            {citation.url}
                          </a>
                        </div>
                        <button
                          onClick={() => handleHideCitation(citation)}
                          className="ml-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Hide this citation"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No citations available</p>
                </div>
              )}

              {getHiddenCitations().length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowHiddenSources(!showHiddenSources)}
                    className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    {showHiddenSources ? 'Hide' : 'Show'} {getHiddenCitations().length} hidden source{getHiddenCitations().length !== 1 ? 's' : ''}
                  </button>

                  {showHiddenSources && (
                    <div className="mt-4 space-y-3">
                      {getHiddenCitations().map((citation, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50 opacity-60">
                          <h4 className="font-medium text-gray-700 mb-1 text-sm">{citation.title}</h4>
                          <a
                            href={citation.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-500 hover:text-gray-700 break-all"
                          >
                            {citation.url}
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hide Citation Modal */}
      {showHideCitationModal && citationToHide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hide Citation</h3>
              <p className="text-sm text-gray-600 mb-6">
                How would you like to hide "{citationToHide.title}"?
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => confirmHideCitation(false)}
                  className="w-full px-4 py-2 text-sm font-medium text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors"
                >
                  Hide for this session only
                </button>
                <button
                  onClick={() => confirmHideCitation(true)}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Hide permanently
                </button>
                <button
                  onClick={() => {
                    setShowHideCitationModal(false);
                    setCitationToHide(null);
                  }}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DonorProfileLayoutTestCoreTier2: React.FC<DonorProfileLayoutTestCoreTier2Props> = ({ donor }) => {
  return (
    <DonorProfileLayoutTest3
      donor={donor}
      customAIInsights={<CoreTier2PulseCheck donor={donor} />}
    />
  );
};

export default DonorProfileLayoutTestCoreTier2;
