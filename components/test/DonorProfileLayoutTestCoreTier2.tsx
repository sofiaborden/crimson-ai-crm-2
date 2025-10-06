import React, { useState } from 'react';
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

  const handleDialRClick = () => {
    setShowDialRModal(true);
  };

  const handleDialRListSelection = (listName: string) => {
    alert(`✅ ${donor.name} added to ${listName}!\n\nDialR Integration:\n• Contact added to calling queue\n• Suggested ask amount: $2,500\n• Best contact time: Weekday afternoons\n• Preferred method: Phone\n\nThe donor will be available for calling in your DialR dashboard within 5 minutes.`);
    setShowDialRModal(false);
  };

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
            <div className="mb-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full w-[65%] bg-gradient-to-r from-red-400 via-purple-400 to-blue-400 rounded-full"></div>
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
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <PhoneIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Send to DialR</h3>
                  <p className="text-sm text-gray-600">Add {donor.name} to a calling list</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 mb-4 text-sm">
                  Select a DialR list to add this donor for phone outreach campaigns.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => handleDialRListSelection('My List')}
                    className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <StarIcon className="w-5 h-5 text-yellow-500" />
                    <div>
                      <div className="font-medium text-gray-900">My List</div>
                      <div className="text-sm text-gray-600">Your personal calling list</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleDialRListSelection('Major Donors List')}
                    className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <UserGroupIcon className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="font-medium text-gray-900">Major Donors List</div>
                      <div className="text-sm text-gray-600">High-value donor prospects</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleDialRListSelection('Q4 Campaign List')}
                    className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <PhoneIcon className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="font-medium text-gray-900">Q4 Campaign List</div>
                      <div className="text-sm text-gray-600">Year-end fundraising campaign</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDialRModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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

  // Quick Actions Toolbar Functions
  const handleCopyToClipboard = async () => {
    if (smartBioData) {
      const bioText = smartBioData.perplexityHeadlines.join(' ');
      const fullText = `${bioText}\n\n${smartBioData.wealthSummary ? `Wealth: ${smartBioData.wealthSummary}` : ''}`;

      try {
        await navigator.clipboard.writeText(fullText);
        console.log('✅ Bio copied to clipboard');
      } catch (error) {
        console.error('❌ Failed to copy to clipboard:', error);
      }
    }
  };

  // Generate Pulse Check insights based on donor data
  const getPulseCheckInsight = (donor: Donor) => {
    const insights = [
      {
        icon: TrendingUpIcon,
        text: "This donor is in your top 10% of likely re-engagers this quarter.",
        confidence: "Moderate",
        action: "Consider outreach before next campaign."
      },
      {
        icon: TrendingUpIcon,
        text: "Giving potential higher than 75% of similar supporters.",
        confidence: "Moderate", 
        action: "Consider mid-level upgrade approach."
      },
      {
        icon: TrendingUpIcon,
        text: "Recent engagement suggests high responsiveness to outreach.",
        confidence: "Moderate",
        action: "Schedule personalized contact within 3 weeks."
      }
    ];

    // Return a random insight for demo purposes
    return insights[Math.floor(Math.random() * insights.length)];
  };

  const insight = getPulseCheckInsight(donor);

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
                  ? 'bg-white shadow-sm text-crimson-blue'
                  : 'hover:bg-white/50 text-gray-600'
              }`}
            >
              <SparklesIcon className="w-3 h-3 inline mr-1" />
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
        ) : (
          <div>
            {smartBioData ? (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between p-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4" style={{ color: '#2f7fc3' }} />
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
                              style={{ backgroundColor: '#2f7fc3' }}
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
                      <div className="bg-blue-gray-50 border-l-4 pl-4 py-2 mb-3 rounded-r-md transition-all duration-200 hover:bg-blue-gray-100" style={{ borderLeftColor: '#2f7fc3' }}>
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
                          style={{ backgroundColor: '#e0f2fe', color: '#0277bd' }}
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
                          style={{ backgroundColor: '#2f7fc3' }}
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
                      <span className="text-xs text-gray-500">Generated {new Date(smartBioData.lastGenerated).toLocaleDateString()}</span>
                      <div className="flex items-center gap-2">
                        {/* Actions Dropdown */}
                        <div className="relative">
                          <button
                            onClick={() => setShowQuickActionsDropdown(!showQuickActionsDropdown)}
                            className="text-white text-xs rounded px-3 py-1 transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center gap-1"
                            style={{ backgroundColor: '#2f7fc3' }}
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
                                    handleCopyToClipboard();
                                    setShowQuickActionsDropdown(false);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors duration-150"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                  Copy
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
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{backgroundColor: '#2f7fc3'}}>
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
                    style={{background: 'linear-gradient(135deg, #2f7fc3 0%, #10b981 100%)'}}
                    onMouseEnter={(e) => !isGeneratingSmartBio && (e.currentTarget.style.background = 'linear-gradient(135deg, #1e6ba8 0%, #059669 100%)')}
                    onMouseLeave={(e) => !isGeneratingSmartBio && (e.currentTarget.style.background = 'linear-gradient(135deg, #2f7fc3 0%, #10b981 100%)')}
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

        {/* Upgrade CTA */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">
                Want to know this donor's potential to give, specific ask amount, and when to ask?
              </p>
              <p className="text-xs text-blue-700">
                Upgrade to Enterprise for detailed predictions.
              </p>
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
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{backgroundColor: '#2f7fc3'}}>
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
                  style={{ backgroundColor: '#2f7fc3' }}
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
