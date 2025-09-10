import React, { useState, useEffect } from 'react';
import { Donor } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import SmartTag from '../ui/SmartTag';
import CodesManager from '../profile/CodesManager';
import DonorProfileModal from '../ui/DonorProfileModal';
import { GiftModal } from '../profile/GiftModal';
import { generateMockDonorResearch, generateDonorResearch } from '../../utils/aiDonorResearch';
import { getDonorProfileByName } from '../../utils/mockDonorProfiles';
import PerplexityBioGenerator from '../profile/PerplexityBioGenerator';
import {
  SparklesIcon,
  ShieldCheckIcon,
  MailIcon,
  PhoneIcon,
  CalendarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  FireIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  UserGroupIcon,
  ChartBarIcon,
  BoltIcon,
  EyeIcon,
  HeartIcon,
  TrophyIcon,
  FlagIcon,
  ChevronDownIcon,
  ComputerDesktopIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  CurrencyDollarIcon,
  UserIcon,
  MapPinIcon,
  StarIcon,
  ClipboardDocumentIcon,
  AddressBookIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  LightBulbIcon,
  BrainIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  HomeIcon,
  SunIcon,
  BriefcaseIcon
} from '../../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface DonorProfileLayoutTest2Props {
  donor: Donor;
}

const StatCard: React.FC<{ label: string; value: string | number; }> = ({ label, value }) => (
    <div className="text-center">
        <p className="text-2xl font-bold text-text-primary">{value}</p>
        <p className="text-sm text-text-secondary">{label}</p>
    </div>
);

// Enhanced donor data interface for enriched data
interface EnrichedData {
  age?: number;
  gender?: string;
  householdIncome?: string;
  homeowner?: boolean;
  education?: string;
  maritalStatus?: string;
  voterRegistration?: string;
  party?: string;
  ethnicity?: string;
  politicalEngagement?: number;
  givingCapacity?: string;
  volunteerPropensity?: number;
  eventAttendancePropensity?: number;
  district?: string;
  county?: string;
  precinct?: string;
  dataSource?: string;
  lastUpdated?: string;
}

// Mock enriched data - in real app this would come from i360/L2/etc
const getEnrichedData = (donorId: string): EnrichedData | null => {
  // Simulate having enriched data for some donors
  const hasEnrichedData = Math.random() > 0.3; // 70% chance of having data
  if (!hasEnrichedData) return null;

  return {
    age: 45 + Math.floor(Math.random() * 30),
    gender: Math.random() > 0.5 ? 'Female' : 'Male',
    householdIncome: ['$50-75K', '$75-100K', '$100-150K', '$150-200K', '$200K+'][Math.floor(Math.random() * 5)],
    homeowner: Math.random() > 0.3,
    education: ['High School', 'Some College', 'Bachelor\'s', 'Master\'s', 'PhD'][Math.floor(Math.random() * 5)],
    maritalStatus: ['Single', 'Married', 'Divorced', 'Widowed'][Math.floor(Math.random() * 4)],
    voterRegistration: 'Active',
    party: ['Democrat', 'Republican', 'Independent', 'Unaffiliated'][Math.floor(Math.random() * 4)],
    politicalEngagement: Math.floor(Math.random() * 100),
    givingCapacity: ['Low', 'Medium', 'High', 'Very High'][Math.floor(Math.random() * 4)],
    volunteerPropensity: Math.floor(Math.random() * 100),
    eventAttendancePropensity: Math.floor(Math.random() * 100),
    district: `District ${Math.floor(Math.random() * 20) + 1}`,
    county: 'Travis County',
    precinct: `Precinct ${Math.floor(Math.random() * 100) + 1}`,
    dataSource: 'i360 Data',
    lastUpdated: '2024-01-15'
  };
};

const DonorProfileLayoutTest2: React.FC<DonorProfileLayoutTest2Props> = ({ donor }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'intelligence' | 'insights' | 'enriched' | 'fec-insights' | 'donations' | 'actions' | 'more'>('overview');
  const [activeMoreTab, setActiveMoreTab] = useState<'codes' | 'moves' | 'tasks' | 'notes' | 'events'>('codes');
  const [activeAITab, setActiveAITab] = useState<'insights' | 'bio'>('insights');
  const [showDialRModal, setShowDialRModal] = useState(false);
  const [showLookalikes, setShowLookalikes] = useState(false);
  const [aiResearch, setAiResearch] = useState<any>(null);
  const [isLoadingResearch, setIsLoadingResearch] = useState(false);
  const [showSpouseProfile, setShowSpouseProfile] = useState(false);
  const [selectedSpouse, setSelectedSpouse] = useState<Donor | null>(null);
  const [showGivingBreakdown, setShowGivingBreakdown] = useState(false);
  const [showSourcesModal, setShowSourcesModal] = useState(false);

  // Enhanced Lookalike Finder state
  const [lookalikeExpanded, setLookalikeExpanded] = useState(false);
  const [lookalikeFilters, setLookalikeFilters] = useState({
    states: [] as string[],
    counties: [] as string[],
    zipCodes: [] as string[],
    capacityLevel: [] as string[],
    engagementBehavior: [] as string[]
  });
  const [showAISuggested, setShowAISuggested] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedLookalikes, setSelectedLookalikes] = useState<any[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showAddressBookModal, setShowAddressBookModal] = useState(false);
  const [activeContactTab, setActiveContactTab] = useState<'addresses' | 'phones' | 'emails'>('addresses');
  const [fecComplianceAccepted, setFecComplianceAccepted] = useState(false);
  const [showFecComplianceModal, setShowFecComplianceModal] = useState(false);
  const [expandedCommittees, setExpandedCommittees] = useState<Set<string>>(new Set());
  const [showAllCommittees, setShowAllCommittees] = useState(false);
  const [committeeTransactionPages, setCommitteeTransactionPages] = useState<Record<string, number>>({});

  // Gift modal state
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [selectedGift, setSelectedGift] = useState<any>(null);
  const [giftModalMode, setGiftModalMode] = useState<'view' | 'add' | 'edit'>('view');
  const [isGivingOverviewExpanded, setIsGivingOverviewExpanded] = useState(false);

  const enrichedData = getEnrichedData(donor.id);

  // Gift modal handlers
  const handleViewGift = (gift: any) => {
    setSelectedGift(gift);
    setGiftModalMode('view');
    setShowGiftModal(true);
  };

  const handleAddGift = () => {
    setSelectedGift(null);
    setGiftModalMode('add');
    setShowGiftModal(true);
  };

  const handleEditGift = (gift: any) => {
    setSelectedGift(gift);
    setGiftModalMode('edit');
    setShowGiftModal(true);
  };

  const handleCloseGiftModal = () => {
    setShowGiftModal(false);
    setSelectedGift(null);
  };

  // Mock lookalike data
  const generateMockLookalikes = () => {
    const names = ['Sarah Mitchell', 'David Chen', 'Maria Rodriguez', 'James Wilson', 'Lisa Thompson', 'Robert Davis', 'Jennifer Lee', 'Michael Brown', 'Amanda Garcia', 'Christopher Taylor'];
    const states = ['FL', 'TX', 'CA', 'NY', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI'];
    const counties = ['Miami-Dade', 'Harris', 'Los Angeles', 'Cook', 'Maricopa', 'Orange', 'Kings', 'Wayne', 'Riverside', 'San Diego'];
    const capacityLevels = ['Low', 'Medium', 'High'];
    const engagementTypes = ['Event Attendee', 'Volunteer', 'Email Engaged', 'Social Media Active', 'Previous Donor'];

    return Array.from({ length: 423 }, (_, i) => ({
      id: i + 1,
      name: names[Math.floor(Math.random() * names.length)] + ` ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}.`,
      state: states[Math.floor(Math.random() * states.length)],
      county: counties[Math.floor(Math.random() * counties.length)],
      zipCode: String(Math.floor(Math.random() * 90000) + 10000),
      capacityLevel: capacityLevels[Math.floor(Math.random() * capacityLevels.length)],
      modeledCapacity: Math.floor(Math.random() * 5000) + 100,
      similarityScore: Math.floor(Math.random() * 30) + 70,
      engagementBehavior: engagementTypes[Math.floor(Math.random() * engagementTypes.length)],
      email: `${names[Math.floor(Math.random() * names.length)].toLowerCase().replace(' ', '.')}@email.com`,
      phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`
    }));
  };

  const allLookalikes = generateMockLookalikes();

  // Filter lookalikes based on current filters
  const getFilteredLookalikes = () => {
    return allLookalikes.filter(lookalike => {
      if (lookalikeFilters.states.length > 0 && !lookalikeFilters.states.includes(lookalike.state)) return false;
      if (lookalikeFilters.counties.length > 0 && !lookalikeFilters.counties.includes(lookalike.county)) return false;
      if (lookalikeFilters.capacityLevel.length > 0 && !lookalikeFilters.capacityLevel.includes(lookalike.capacityLevel)) return false;
      if (lookalikeFilters.engagementBehavior.length > 0 && !lookalikeFilters.engagementBehavior.includes(lookalike.engagementBehavior)) return false;
      return true;
    });
  };

  const filteredLookalikes = getFilteredLookalikes();
  const aiSuggestedLookalikes = allLookalikes.filter(l => l.similarityScore >= 85).slice(0, 25);

  // Load AI research on component mount
  useEffect(() => {
    const loadAiResearch = async () => {
      setIsLoadingResearch(true);
      try {
        // Use mock data for development, switch to real API when ready
        const research = await generateMockDonorResearch(donor);
        setAiResearch(research);
      } catch (error) {
        console.error('Failed to load AI research:', error);
      } finally {
        setIsLoadingResearch(false);
      }
    };

    loadAiResearch();
  }, [donor.id]);

  // Helper functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPerformanceStatus = () => {
    const capacity = donor.totalLifetimeGiving || 0;
    const predictedPotential = donor.predictedPotential || 50; // Default to 50% if not set
    const potential = (predictedPotential / 100) * 2000; // Estimated potential

    if (capacity > potential * 1.2) {
      return { type: 'over', message: 'Over-Performer: Giving 30% above modeled capacity', color: 'bg-orange-100 text-orange-800 border-orange-200' };
    } else if (capacity < potential * 0.6) {
      return { type: 'under', message: 'Under-Performer: 40% below modeled capacity', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    }
    return { type: 'normal', message: 'Performing within expected range', color: 'bg-green-100 text-green-800 border-green-200' };
  };

  // Gift readiness logic
  const getGiftReadiness = () => {
    // Joseph Banks specific - major donor with high engagement
    if (donor.name === 'Joseph M. Banks' || donor.name.includes('Joseph')) {
      return { window: 'Next 30 Days', color: 'text-green-600', days: '<30' };
    }

    // Mock logic based on donor characteristics - in real app this would be ML prediction
    const engagementScore = donor.engagementScore || 50;
    const daysSinceLastGift = Math.floor((Date.now() - new Date(donor.lastGiftDate || '2024-01-01').getTime()) / (1000 * 60 * 60 * 24));

    // Higher engagement and recent gifts = sooner readiness
    if (engagementScore > 80 && daysSinceLastGift < 60) {
      return { window: 'Next 30 Days', color: 'text-green-600', days: '<30' };
    } else if (engagementScore > 60 && daysSinceLastGift < 120) {
      return { window: 'Next 60 Days', color: 'text-blue-600', days: '31-60' };
    } else if (engagementScore > 40 && daysSinceLastGift < 180) {
      return { window: 'Next 90 Days', color: 'text-gray-600', days: '61-90' };
    } else {
      return { window: 'Long-Term 90+ Days', color: 'text-gray-400', days: '90+' };
    }
  };

  // Capacity messaging logic
  const getCapacityMessage = () => {
    const totalGiven = donor.givingOverview?.totalRaised || 0;
    const potential = 24500; // Using the potential amount from the UI

    // Handle edge case: no modeled capacity available
    if (potential === 0) {
      return {
        message: "No modeled capacity available.",
        textColor: "text-gray-600",
        icon: "InformationCircleIcon"
      };
    }

    // Calculate capacity percentage
    const capacityPercentage = Math.round((totalGiven / potential) * 100);

    // Apply thresholds and return appropriate message
    if (capacityPercentage === 0) {
      return {
        message: "Giving at 0% of capacity — no gifts this cycle.",
        textColor: "text-red-600",
        icon: "ExclamationTriangleIcon"
      };
    } else if (capacityPercentage >= 1 && capacityPercentage <= 70) {
      return {
        message: `Donor below capacity at ${capacityPercentage}% — eligible for upgrade.`,
        textColor: "text-orange-600",
        icon: "ExclamationTriangleIcon"
      };
    } else if (capacityPercentage >= 71 && capacityPercentage <= 89) {
      return {
        message: `Donor nearing full capacity at ${capacityPercentage}%.`,
        textColor: "text-gray-600",
        icon: null
      };
    } else if (capacityPercentage >= 90 && capacityPercentage <= 99) {
      return {
        message: `Donor at high-capacity utilization at ${capacityPercentage}%.`,
        textColor: "text-green-600",
        icon: null
      };
    } else { // 100%+
      return {
        message: `Donor giving at or above capacity at ${Math.min(capacityPercentage, 100)}%.`,
        textColor: "text-green-600",
        icon: "CheckCircleIcon"
      };
    }
  };

  const getSmartSuggestions = () => {
    const suggestions = [];
    const performance = getPerformanceStatus();
    const daysSinceLastGift = Math.floor((Date.now() - new Date(donor.lastGiftDate).getTime()) / (1000 * 60 * 60 * 24));

    // Fatigue/timing suggestions
    if (daysSinceLastGift < 14) {
      suggestions.push({
        icon: <ClockIcon className="w-4 h-4 text-orange-600" />,
        title: 'Recommend wait 7 days before next ask',
        description: 'Recent gift activity suggests donor may need cool-down period',
        action: 'Schedule follow-up',
        priority: 'medium'
      });
    }

    // Performance-based suggestions with enhanced context
    if (performance.type === 'under') {
      // Calculate suggested ask with proper fallbacks
      const avgGift = donor.averageGift || 100; // Fallback to $100 if no average
      const suggestedAsk = Math.round(avgGift * 1.15);
      const potentialIncrease = suggestedAsk - avgGift;

      // Get days since last gift for context
      const daysSinceLastGift = Math.floor((Date.now() - new Date(donor.lastGiftDate).getTime()) / (1000 * 60 * 60 * 24));

      // Create contextual description based on donor data
      let contextDescription = '';
      if (daysSinceLastGift > 180) {
        contextDescription = `Lapsed ${Math.floor(daysSinceLastGift / 30)} months - reactivation opportunity`;
      } else if (donor.giftCount > 10) {
        contextDescription = `Loyal donor (${donor.giftCount} gifts) giving below capacity`;
      } else {
        contextDescription = `New donor with ${formatCurrency(potentialIncrease)} upgrade potential`;
      }

      suggestions.push({
        icon: <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />,
        title: `Upgrade ask: ${formatCurrency(suggestedAsk)}`,
        description: contextDescription,
        action: 'Create targeted upgrade campaign',
        priority: 'high'
      });
    }

    // Channel suggestions
    if (donor.contactIntelligence?.preferredContactMethod === 'email') {
      suggestions.push({
        icon: <EnvelopeIcon className="w-4 h-4 text-blue-600" />,
        title: 'Push to MailChimp for year-end appeal',
        description: 'Email preference detected, high engagement via email campaigns',
        action: 'Add to email list',
        priority: 'medium'
      });
    }

    return suggestions.slice(0, 3); // Max 3 suggestions
  };

  const getGeneratedAskAmount = () => {
    // Calculate average gift with fallback
    const avgGift = donor.averageGift || (donor.totalLifetimeGiving && donor.giftCount ? donor.totalLifetimeGiving / donor.giftCount : 100);
    const baseAsk = avgGift * 1.1; // 10% increase as baseline
    const performance = getPerformanceStatus();

    if (performance.type === 'over') {
      return {
        amount: Math.round(avgGift), // Don't increase for over-performers
        explanation: 'Current giving above modeled capacity; maintain current level to avoid donor fatigue'
      };
    } else if (performance.type === 'under') {
      return {
        amount: Math.round(baseAsk * 1.15), // 15% increase for under-performers
        explanation: 'Below capacity; safe to upgrade by 15% based on wealth indicators'
      };
    }

    return {
      amount: Math.round(baseAsk),
      explanation: 'Based on average gift, giving capacity, and recent engagement patterns'
    };
  };

  // Helper functions from original profile
  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const formatLastContact = (date: string) => {
    const lastContact = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastContact.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  // Contact action handlers
  const handleQuickCall = () => {
    window.open(`tel:${donor.phone}`, '_self');
  };

  const handleQuickEmail = () => {
    const subject = `Follow-up: ${donor.name}`;
    const body = `Hi ${donor.name.split(' ')[0]},\n\nI hope this message finds you well. I wanted to follow up on our recent conversation...\n\nBest regards,\nYour Campaign Team`;
    window.open(`mailto:${donor.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_self');
  };

  const handleScheduleMeeting = () => {
    alert(`📅 Opening calendar to schedule meeting with ${donor.name}\n\nSuggested times based on AI analysis:\n${donor.contactIntelligence?.bestContactTimes?.join('\n') || 'Business hours'}\n\nPreferred method: ${donor.contactIntelligence?.preferredContactMethod || 'Phone'}`);
  };

  const handleDialRClick = () => {
    setShowDialRModal(true);
  };

  const handleTargetPathClick = () => {
    alert(`🎯 Sending ${donor.name} to TargetPath\n\nThis will create automated campaigns based on:\n• Donor profile and giving history\n• AI-suggested ask amount: ${askAmount.amount && !isNaN(askAmount.amount) ? formatCurrency(askAmount.amount) : '$2,500'}\n• Preferred communication channels\n• Optimal timing for outreach\n\nCampaign types: Email sequences, direct mail, and digital ads`);
  };

  const handleEmailSuggestion = () => {
    const suggestions = [
      'Thank you for your recent support - here\'s the impact you\'ve made',
      'Invitation to exclusive donor briefing on campaign progress',
      'Personal update from the candidate on key policy wins'
    ];
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    alert(`📧 Email Suggestion:\n\nSubject: ${randomSuggestion}\n\nThis suggestion is based on donor engagement patterns and current campaign priorities. Consider pushing to MailChimp for automated delivery.`);
  };

  const handleFindLookalikes = () => {
    setShowLookalikes(true);
  };

  // Get smart tags for this donor based on their profile
  const getSmartTags = () => {
    const tags = [];

    // Big Givers - donors who gave above $500 in last 12 months
    if (donor.totalLifetimeGiving > 500) {
      tags.push({ name: 'Big Givers', emoji: '💰', color: '#10B981' });
    }

    // Prime Persuadables - FL residents, Age 35-44, or high engagement
    if (donor.location?.includes('FL') || donor.engagementScore > 8 || donor.name.includes('Joseph')) {
      tags.push({ name: 'Prime Persuadables', emoji: '🎯', color: '#8B5CF6' });
    }

    // New & Rising Donors - recent first-time donors or upgrades
    if (donor.status === 'new' || donor.giftCount <= 3) {
      tags.push({ name: 'New & Rising Donors', emoji: '⚡', color: '#3B82F6' });
    }

    // Lapsed / At-Risk - haven't given recently
    const daysSinceLastGift = Math.floor((Date.now() - new Date(donor.lastGiftDate).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceLastGift > 180) {
      tags.push({ name: 'Lapsed / At-Risk', emoji: '🕒', color: '#EF4444' });
    }

    // Not Yet Registered to Vote - based on name hash for consistency
    const nameHash = donor.name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    if (nameHash % 5 === 0) { // 20% of donors consistently
      tags.push({ name: 'Not Yet Registered to Vote', emoji: '🚧', color: '#F59E0B' });
    }

    return tags;
  };

  const generateAISnapshot = () => {
    // Joseph Banks specific content - more concise but still useful
    if (donor.name === 'Joseph M. Banks' || donor.name.includes('Joseph')) {
      return "Cornerstone supporter & community leader. Consistent 3-year growth pattern, recent $5K gift shows strong commitment. Prefers in-person meetings, responds to policy briefings. Prime candidate for campaign advisory role.";
    }

    // Default content for other donors
    const performance = getPerformanceStatus();
    const daysSinceLastGift = Math.floor((Date.now() - new Date(donor.lastGiftDate).getTime()) / (1000 * 60 * 60 * 24));

    return `${donor.name} is a ${performance.type === 'over' ? 'highly engaged' : performance.type === 'under' ? 'high-potential' : 'consistent'} donor with ${donor.giftCount} lifetime gifts totaling ${formatCurrency(donor.totalLifetimeGiving)}. ${performance.type === 'over' ? 'Currently giving above capacity - focus on stewardship.' : performance.type === 'under' ? 'Significant untapped potential based on wealth indicators.' : 'Reliable supporter with steady giving pattern.'} Last gift was ${daysSinceLastGift} days ago. ${donor.contactIntelligence?.preferredContactMethod === 'email' ? 'Prefers email communication and responds well to policy updates.' : 'Phone outreach typically yields better engagement.'} ${donor.predictedPotential > 80 ? 'High likelihood of increased giving with proper cultivation.' : 'Maintain current engagement level with quarterly touchpoints.'}`;
  };

  const performance = getPerformanceStatus();
  const smartSuggestions = getSmartSuggestions();
  const askAmount = getGeneratedAskAmount();
  const aiSnapshot = generateAISnapshot();

  return (
    <div className="space-y-6">
      {/* Redesigned Header with Unified Contact + AI Block */}
      <Card>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Detailed Profile Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col h-full max-h-96">
            {/* Photo and Basic Info */}
            <div className="flex flex-col items-center text-center mb-4">
              <div className="relative mb-3">
                <img src={donor.photoUrl} alt={donor.name} className="w-20 h-20 rounded-full ring-3 ring-blue-100" />
                {donor.urgencyIndicators?.isHotLead && (
                  <div
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center cursor-help"
                    title="High Potential Donor"
                  >
                    <FireIcon className="w-3 h-3 text-white" />
                  </div>
                )}
                {performance.type === 'over' && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                    <TrendingUpIcon className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              <h2 className="text-lg font-bold text-gray-900 mb-1">{donor.name}</h2>
              <div className="text-xs text-gray-500 font-mono mb-2">
                {donor.pid || 'PID-2024-001847'}
              </div>

              {/* Smart Tags */}
              <div className="flex flex-wrap justify-center gap-1 mb-3">
                {getSmartTags().map((tag, index) => (
                  <SmartTag
                    key={index}
                    name={tag.name}
                    emoji={tag.emoji}
                    color={tag.color}
                    size="sm"
                    showAI={true}
                  />
                ))}
              </div>

              {/* Quick Actions - Unified Blue Style */}
              <div className="flex justify-center gap-3 mb-3">
                {/* Call */}
                <button
                  onClick={() => window.open(`tel:${donor.phone}`, '_self')}
                  className="w-8 h-8 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full flex items-center justify-center transition-colors shadow-sm border border-blue-100"
                  title={`Call ${donor.phone}`}
                >
                  <PhoneIcon className="w-4 h-4" />
                </button>

                {/* Email */}
                <button
                  onClick={() => window.open(`mailto:${donor.email}`, '_self')}
                  className="w-8 h-8 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full flex items-center justify-center transition-colors shadow-sm border border-blue-100"
                  title={`Email ${donor.email}`}
                >
                  <EnvelopeIcon className="w-4 h-4" />
                </button>

                {/* Note */}
                <button
                  onClick={() => {/* Add note functionality */}}
                  className="w-8 h-8 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full flex items-center justify-center transition-colors shadow-sm border border-blue-100"
                  title="Add Note"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>

                {/* Task */}
                <button
                  onClick={() => {/* Add task functionality */}}
                  className="w-8 h-8 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full flex items-center justify-center transition-colors shadow-sm border border-blue-100"
                  title="Create Task"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>

                {/* Add Gift */}
                <button
                  onClick={handleAddGift}
                  className="w-8 h-8 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full flex items-center justify-center transition-colors shadow-sm border border-blue-100"
                  title="Add Gift"
                >
                  <CurrencyDollarIcon className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Contact Info - Compact */}
            <div className="space-y-2 flex-1 overflow-y-auto min-h-0">
              {/* Professional Info - Left aligned like address */}
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <BriefcaseIcon className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs leading-tight">
                  <div className="font-medium text-gray-700">CEO of TechCorp Solutions</div>
                </div>
              </div>

              {/* Address - Compact */}
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPinIcon className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs leading-tight">
                  <div className="font-medium text-gray-700">987 Neighborhood Ave</div>
                  <div className="text-gray-600">Springfield, IL</div>
                </div>
              </div>

            </div>

            {/* Social & Actions - Compact */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-2 mt-1 flex-shrink-0">
              {/* Social Media - Compact */}
              <div className="flex items-center gap-0.5">
                {donor.socialMedia?.linkedin && (
                  <a
                    href={donor.socialMedia.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-gray-400 hover:text-blue-600 rounded transition-colors"
                    title="LinkedIn"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                    </svg>
                  </a>
                )}
                {donor.socialMedia?.twitter && (
                  <a
                    href={donor.socialMedia.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-gray-400 hover:text-blue-500 rounded transition-colors"
                    title="Twitter"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                )}
                {donor.socialMedia?.facebook && (
                  <a
                    href={donor.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-gray-400 hover:text-blue-600 rounded transition-colors"
                    title="Facebook"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 3.667h-3.533v7.98H9.101z"/>
                    </svg>
                  </a>
                )}
              </div>

              {/* Contact Details Icon */}
              <button
                onClick={() => setShowAddressBookModal(true)}
                className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="View details"
              >
                <UserIcon className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Activity Timeline - Middle Column */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col h-full max-h-80">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2 flex-shrink-0">
              <ClockIcon className="w-4 h-4" />
              Recent Activity
            </h3>
            <div className="space-y-2 flex-1 overflow-y-auto min-h-0">
              {(donor.activityTimeline || []).slice(0, 5).map((activity, index) => (
                <div key={activity.id} className="flex items-start gap-2 py-2 border-b border-gray-50 last:border-b-0">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.type === 'gift' ? 'bg-green-100 text-green-600' :
                    activity.type === 'call' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'email' ? 'bg-purple-100 text-purple-600' :
                    activity.type === 'event' ? 'bg-orange-100 text-orange-600' :
                    activity.type === 'meeting' ? 'bg-indigo-100 text-indigo-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {activity.type === 'gift' && <StarIcon className="w-3 h-3" />}
                    {activity.type === 'call' && <PhoneIcon className="w-3 h-3" />}
                    {activity.type === 'email' && <EnvelopeIcon className="w-3 h-3" />}
                    {activity.type === 'event' && <CalendarIcon className="w-3 h-3" />}
                    {activity.type === 'meeting' && <UserGroupIcon className="w-3 h-3" />}
                    {!['gift', 'call', 'email', 'event', 'meeting'].includes(activity.type) && <ClockIcon className="w-3 h-3" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-medium text-gray-900 truncate">
                          {activity.title}
                        </span>
                        {activity.amount && (
                          <span className="text-xs font-semibold text-green-600 flex-shrink-0">
                            {formatCurrency(activity.amount)}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    {activity.description && (
                      <p className="text-xs text-gray-600 leading-tight line-clamp-1 mb-0.5">
                        {activity.description}
                      </p>
                    )}
                    {activity.outcome && (
                      <p className="text-xs text-blue-600 font-medium line-clamp-1">
                        {activity.outcome}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {(donor.activityTimeline || []).length > 5 && (
              <div className="mt-2 pt-2 border-t border-gray-100 flex-shrink-0">
                <button className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                  <ClockIcon className="w-3 h-3" />
                  View full timeline ({(donor.activityTimeline || []).length} total)
                </button>
              </div>
            )}
          </div>

          {/* Tabular AI Insights - Right Two Columns */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4 flex flex-col h-full max-h-80">
              {/* Tab Header - Tabs as Main Title */}
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                {/* Tab Navigation as Main Header */}
                <div className="flex bg-white rounded-lg p-1 border border-blue-200">
                  <button
                    onClick={() => setActiveAITab('insights')}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeAITab === 'insights'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <SparklesIcon className="w-4 h-4" />
                    AI Insights
                  </button>
                  <button
                    onClick={() => setActiveAITab('bio')}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeAITab === 'bio'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <SparklesIcon className="w-4 h-4" />
                    AI Smart Bio
                  </button>
                </div>

                {/* Smart Segment Badge - only show if donor is in a segment */}
                {(donor.name === 'Joseph M. Banks' || donor.name.includes('Joseph')) && activeAITab === 'insights' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                    Level-Up List
                  </span>
                )}
              </div>

              {/* Tab Content */}
              <div className="flex-1 flex flex-col min-h-0">
                {activeAITab === 'insights' ? (
                  <>
                    {/* Three-Column Metrics */}
                    <div className="grid grid-cols-3 gap-6 mb-4 flex-shrink-0">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Total Given:</div>
                        <div className="text-2xl font-bold text-gray-900">
                          {formatCurrency(donor.givingOverview?.totalRaised || 15200)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Potential:</div>
                        <div className="text-2xl font-bold text-gray-700">$24,500</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Suggested Ask</div>
                        <div className="text-2xl font-bold text-green-600">$1,000</div>
                      </div>
                    </div>

                    {/* Capacity Bar */}
                    <div className="mb-4 flex-shrink-0">
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                          style={{ width: `${Math.min(Math.round(((donor.givingOverview?.totalRaised || 0) / 24500) * 100), 100)}%` }}
                        ></div>
                      </div>
                      {(() => {
                        const capacityInfo = getCapacityMessage();
                        const IconComponent = capacityInfo.icon === "ExclamationTriangleIcon" ? ExclamationTriangleIcon :
                                            capacityInfo.icon === "CheckCircleIcon" ? CheckCircleIcon :
                                            capacityInfo.icon === "InformationCircleIcon" ? ClockIcon : null;

                        return (
                          <div className={`text-sm flex items-center gap-2 ${capacityInfo.textColor}`}>
                            {IconComponent && <IconComponent className="w-4 h-4 flex-shrink-0" />}
                            <span>{capacityInfo.message}</span>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Gift Readiness */}
                    <div className="mb-4 flex-shrink-0">
                      {(() => {
                        const readiness = getGiftReadiness();
                        return (
                          <div className={`text-sm flex items-center gap-2 ${readiness.color}`}>
                            <ClockIcon className="w-4 h-4 flex-shrink-0" />
                            <span className="font-medium">Gift Readiness:</span>
                            <span>{readiness.window}</span>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-3 border-t border-blue-200 flex-shrink-0 mt-auto">
                      <Button
                        onClick={handleDialRClick}
                        className="flex-1 justify-center text-sm py-2"
                        variant="primary"
                      >
                        <PhoneIcon className="w-4 h-4 mr-2" />
                        Send to DialR
                      </Button>
                      <Button
                        onClick={handleTargetPathClick}
                        className="flex-1 justify-center text-sm py-2"
                        variant="primary"
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                          <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="12" cy="12" r="1"/>
                        </svg>
                        Send to TargetPath
                      </Button>
                    </div>
                  </>
                ) : (
                  /* AI Smart Bio Tab Content - Using actual PerplexityBioGenerator */
                  <div className="flex-1 overflow-y-auto min-h-0">
                    <style>{`
                      .perplexity-no-panel .bg-white.border.border-gray-200.rounded-lg.shadow-sm {
                        background: transparent !important;
                        border: none !important;
                        box-shadow: none !important;
                        border-radius: 0 !important;
                      }
                      .perplexity-no-panel .border-b.border-gray-100 {
                        border-color: rgba(59, 130, 246, 0.3) !important;
                      }
                      .perplexity-no-panel .text-text-primary {
                        color: rgb(30, 58, 138) !important;
                      }
                      .perplexity-no-panel .text-gray-900 {
                        color: rgb(30, 58, 138) !important;
                      }
                      .perplexity-no-panel .text-gray-700 {
                        color: rgb(55, 65, 81) !important;
                      }
                      .perplexity-no-panel .text-gray-600 {
                        color: rgb(75, 85, 99) !important;
                      }
                      .perplexity-no-panel .text-gray-500 {
                        color: rgb(107, 114, 128) !important;
                      }
                    `}</style>
                    <div className="perplexity-no-panel">
                      <PerplexityBioGenerator
                        donor={{
                          id: donor.id,
                          name: donor.name,
                          location: donor.address,
                          totalLifetimeGiving: donor.totalLifetimeGiving
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </Card>

      {/* Recurring Readiness Panel - Separate section below AI Insights */}
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BoltIcon className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-gray-700">Recurring Readiness</span>
            <div className="text-lg font-bold text-yellow-600">
              58%
            </div>
          </div>

          <div className="text-right">
            <span className="text-sm text-gray-600">Suggested monthly: </span>
            <span className="text-lg font-bold text-green-700">$125</span>
          </div>
        </div>
      </Card>

      {/* Enhanced Tabbed Navigation - WITHOUT AI Research Tab */}
      <Card>
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: SparklesIcon },
              { id: 'intelligence', label: 'Intelligence', icon: ChartBarIcon },
              { id: 'insights', label: 'Insights', icon: TrendingUpIcon },
              { id: 'enriched', label: 'Enhanced Data', icon: DocumentTextIcon },
              { id: 'fec-insights', label: 'FEC Insights', icon: ShieldCheckIcon },
              { id: 'donations', label: 'Donations', icon: CurrencyDollarIcon },
              { id: 'actions', label: 'Actions', icon: BoltIcon },
              { id: 'more', label: 'More', icon: ChevronDownIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-crimson-blue text-crimson-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content - Placeholder for now */}
        <div className="space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <SparklesIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Layout Test 2: Tabular AI Insights</h4>
            <p className="text-gray-600 text-sm mb-4">
              This test demonstrates the tabular AI Insights approach with "AI Insights" and "AI Smart Bio" tabs in the top panel.
            </p>
            <p className="text-gray-600 text-sm">
              The AI Research content has been moved from the lower tabs to the "AI Smart Bio" tab in the top AI panel.
              All other tabs remain unchanged from the original profile.
            </p>
          </div>
        </div>
      </Card>

      {/* Modals and other components would go here */}
      {showGiftModal && (
        <GiftModal
          gift={selectedGift}
          mode={giftModalMode}
          onClose={handleCloseGiftModal}
          onSave={(giftData) => {
            console.log('Gift saved:', giftData);
            handleCloseGiftModal();
          }}
        />
      )}

      {showDialRModal && (
        <DonorProfileModal
          isOpen={showDialRModal}
          onClose={() => setShowDialRModal(false)}
          title="Send to DialR"
          donor={donor}
        />
      )}

    </div>
  );
};

export default DonorProfileLayoutTest2;
