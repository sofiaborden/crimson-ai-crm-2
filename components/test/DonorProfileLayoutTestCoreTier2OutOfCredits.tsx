import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import DonorProfileLayoutTest3 from './DonorProfileLayoutTest3';
import { Donor } from '../../types';
import {
  HeartIcon,
  TrendingUpIcon,
  InformationCircleIcon,
  SparklesIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '../../constants.tsx';

interface DonorProfileLayoutTestCoreTier2OutOfCreditsProps {
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

// Premium Upgrade Modal component
const PremiumUpgradeModal: React.FC<{ isOpen: boolean; onClose: () => void; onUpgrade: (tier: 'core' | 'growth' | 'enterprise') => void }> = ({ isOpen, onClose, onUpgrade }) => {
  const [selectedTier, setSelectedTier] = useState<'core' | 'growth' | 'enterprise'>('growth');
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(true);

  React.useEffect(() => {
    if (isOpen) {
      setIsOpening(true);
      setTimeout(() => setIsOpening(false), 100);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 400);
  };

  const handleUpgrade = () => {
    const selectedTierName = tiers.find(t => t.id === selectedTier)?.name;

    setIsClosing(true);
    setTimeout(() => {
      // Show confirmation
      if (selectedTier === 'core') {
        alert('Continuing with Free plan');
      } else {
        alert(`Successfully upgraded to ${selectedTierName} plan! Your new features are now active.`);
      }

      onUpgrade(selectedTier);
      onClose();
      setIsClosing(false);
    }, 400);
  };

  if (!isOpen) return null;

  const tiers = [
    {
      id: 'core' as const,
      name: 'Core',
      price: 'Free',
      color: 'gray',
      features: ['Crimson Filter', 'New Tags', 'FEC Data'],
      badge: null
    },
    {
      id: 'growth' as const,
      name: 'Growth',
      price: '$49/month',
      color: 'green',
      features: ['Everything in Core', 'CrimsonGPT', 'Smart Segments', 'Smart Tags', 'AI Insights (Aggregated)', 'Email Append (10K)'],
      badge: 'Most Popular'
    },
    {
      id: 'enterprise' as const,
      name: 'Enterprise',
      price: '$149/month',
      color: 'blue',
      features: ['Everything in Growth', 'AI Insights (Advanced)', 'Email Append (20K)', 'Priority Support', 'Custom Integrations'],
      badge: 'Best Value'
    }
  ];



  return createPortal(
    <>
      <style jsx>{`
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .modal-enter {
          animation: modalFadeIn 0.4s ease-out;
        }
      `}</style>
      <div className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 transition-all duration-300 ${isClosing ? 'opacity-0' : isOpening ? 'opacity-0' : 'opacity-100'}`}>
        <div className={`bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto transition-all duration-300 ease-out ${isClosing ? 'scale-95 opacity-0' : isOpening ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        {/* Header with Close Button */}
        <div className="flex justify-end p-4 pb-0">
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 md:px-8 pb-6 md:pb-8">
          <div className="text-center mb-6 md:mb-8">
            {/* Credits Alert */}
            <div className="inline-flex items-center gap-2 bg-orange-50 px-3 md:px-4 py-2 rounded-lg mb-4 md:mb-6 border border-orange-200">
              <SparklesIcon className="w-4 h-4 text-orange-600 flex-shrink-0" />
              <span className="text-xs md:text-sm font-medium text-orange-800">You've used all 5 free credits for this month</span>
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-tight px-2">
              Don't worry! Unlock unlimited AI insights and advanced donor intelligence today!
            </h3>
            <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 px-2">
              Transform donor engagement with data-driven insights
            </p>

            {/* Benefits */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs md:text-sm text-gray-600 mb-6 md:mb-8">
              <div className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>Instant access</span>
              </div>
            </div>
          </div>

          {/* Tier Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={`relative border-2 rounded-lg p-4 md:p-6 cursor-pointer transition-all min-h-[280px] flex flex-col ${
                  selectedTier === tier.id
                    ? tier.id === 'growth'
                      ? 'border-green-500 bg-green-50'
                      : tier.id === 'enterprise'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-400 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTier(tier.id)}
              >
                {tier.badge && (
                  <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    tier.id === 'growth' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                  }`}>
                    {tier.badge}
                  </div>
                )}

                <div className="text-center flex-1 flex flex-col">
                  <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">{tier.name}</h4>
                  <div className={`text-2xl md:text-3xl font-bold mb-3 md:mb-4 break-words ${
                    tier.id === 'core' ? 'text-black' :
                    tier.id === 'growth' ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {tier.price}
                  </div>

                  <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-600 text-left flex-1">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckIcon className="w-3 h-3 md:w-4 md:h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        <span className="break-words">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {selectedTier === tier.id && (
                  <div className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center ${
                    tier.id === 'core' ? 'bg-gray-500' :
                    tier.id === 'growth' ? 'bg-green-500' : 'bg-blue-500'
                  }`}>
                    <CheckIcon className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center pt-6 border-t border-gray-200">
            <button
              onClick={handleClose}
              className="px-6 md:px-8 py-3 text-gray-600 hover:text-gray-800 font-medium text-base md:text-lg transition-colors order-2 sm:order-1"
            >
              Maybe Later
            </button>
            <button
              onClick={handleUpgrade}
              className={`px-8 md:px-12 py-3 text-white rounded-xl font-bold text-base md:text-lg transition-all duration-200 hover:shadow-lg transform hover:scale-105 order-1 sm:order-2 ${
                selectedTier === 'core' ? 'bg-gray-500 hover:bg-gray-600' :
                selectedTier === 'growth' ? 'bg-green-600 hover:bg-green-700' :
                'bg-crimson-blue hover:bg-crimson-dark-blue'
              } shadow-md`}
            >
              {selectedTier === 'core' ? 'Continue with Free' : 'Confirm Upgrade'}
            </button>
          </div>
        </div>
        </div>
      </div>
    </>,
    document.body
  );
};

// Core Tier 2 - Out of Credits component
const CoreTier2OutOfCredits: React.FC<{ donor: Donor }> = ({ donor }) => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'insights' | 'bio'>('insights');
  const [currentTier, setCurrentTier] = useState<'core' | 'growth' | 'enterprise'>('core');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

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
      }
    ];
    return insights[0];
  };

  const insight = getPulseCheckInsight(donor);

  const handleViewNow = () => {
    setShowUpgradeModal(true);
  };

  const handleUpgrade = (selectedTier?: 'core' | 'growth' | 'enterprise') => {
    // If no tier specified, default to enterprise (for backward compatibility)
    const tier = selectedTier || 'enterprise';
    setCurrentTier(tier);
    setShowSuccessToast(true);

    // Auto-dismiss success toast after 4 seconds
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 4000);
  };

  // If upgraded, show the appropriate tier view
  if (currentTier !== 'core') {
    const tierNames = {
      growth: 'Growth',
      enterprise: 'Enterprise'
    };

    return (
      <div className="relative">
        {showSuccessToast && (
          <div className="absolute -top-2 -right-2 z-10">
            <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce">
              <div className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Upgrade successful! Welcome to {tierNames[currentTier]} tier.</span>
              </div>
            </div>
          </div>
        )}
        {/* Show upgraded tier features */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-4 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="text-center py-8">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              currentTier === 'growth' ? 'bg-green-100' : 'bg-blue-100'
            }`}>
              <CheckIcon className={`w-8 h-8 ${
                currentTier === 'growth' ? 'text-green-600' : 'text-blue-600'
              }`} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{tierNames[currentTier]} Upgrade Complete!</h3>
            <p className="text-gray-600 mb-4">You now have {currentTier === 'growth' ? 'enhanced' : 'unlimited'} access to AI insights and donor intelligence.</p>
            <div className={`rounded-lg p-4 ${
              currentTier === 'growth'
                ? 'bg-gradient-to-r from-green-50 to-emerald-50'
                : 'bg-gradient-to-r from-blue-50 to-indigo-50'
            }`}>
              <p className={`text-sm font-medium ${
                currentTier === 'growth' ? 'text-green-800' : 'text-blue-800'
              }`}>
                ✨ All {tierNames[currentTier]} features are now unlocked
              </p>
            </div>

            {/* Show current subscription level */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Current Plan</p>
              <p className={`font-semibold ${
                currentTier === 'growth' ? 'text-green-600' : 'text-blue-600'
              }`}>
                {tierNames[currentTier]} - ${currentTier === 'growth' ? '$49' : '$149'}/month
              </p>
            </div>
          </div>
        </div>
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
                    onClick={() => setShowUpgradeModal(true)}
                    className="text-white text-xs font-semibold py-2 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                    style={{background: 'linear-gradient(135deg, #2f7fc3 0%, #10b981 100%)'}}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'linear-gradient(135deg, #1e6ba8 0%, #059669 100%)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'linear-gradient(135deg, #2f7fc3 0%, #10b981 100%)')}
                  >
                    <SparklesIcon className="w-3 h-3 inline mr-1" />
                    Upgrade to Generate Bio
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
      
      {/* Premium Upgrade Modal */}
      <PremiumUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={handleUpgrade}
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

const DonorProfileLayoutTestCoreTier2OutOfCredits: React.FC<DonorProfileLayoutTestCoreTier2OutOfCreditsProps> = ({ donor }) => {
  return (
    <DonorProfileLayoutTest3 
      donor={donor} 
      customAIInsights={<CoreTier2OutOfCredits donor={donor} />}
    />
  );
};

export default DonorProfileLayoutTestCoreTier2OutOfCredits;
