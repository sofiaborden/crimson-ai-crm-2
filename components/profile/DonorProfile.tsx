import React, { useState, useEffect } from 'react';
import { Donor } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import SmartTag from '../ui/SmartTag';
import CodesManager from './CodesManager';
import DonorProfileModal from '../ui/DonorProfileModal';
import { GiftModal } from './GiftModal';
import { generateMockDonorResearch, generateDonorResearch } from '../../utils/aiDonorResearch';
import { getDonorProfileByName } from '../../utils/mockDonorProfiles';
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

interface DonorProfileProps {
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

const DonorProfile: React.FC<DonorProfileProps> = ({ donor }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'intelligence' | 'insights' | 'enriched' | 'fec-insights' | 'donations' | 'actions' | 'more'>('overview');
  const [activeMoreTab, setActiveMoreTab] = useState<'codes' | 'moves' | 'tasks' | 'notes' | 'events'>('codes');
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

  // Generate detailed AI suggested actions for donor profile (from original)
  const getDetailedSuggestedActions = (donor: Donor) => {
    const hasPhoneEngagement = donor.engagementScore > 7 || donor.totalLifetimeGiving > 1000;
    const isHighPotential = donor.predictedPotential >= 80;
    const isLapsed = donor.status === 'lapsed';
    const isNewDonor = donor.status === 'new';
    const hasRecentGift = new Date(donor.lastGiftDate) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const isHighValue = donor.totalLifetimeGiving > 2000;

    const actions = [];

    if (isLapsed && hasPhoneEngagement) {
      actions.push({
        icon: <PhoneIcon className="w-4 h-4 text-blue-600" />,
        title: 'Recommended Immediate Call',
        description: 'DialR indicates this donor typically engages via phone calls.',
        reasoning: 'DialR data shows successful prior phone engagements. Lapsed status requires immediate personal outreach.',
        priority: 'high'
      });
    }

    if (isHighPotential || isHighValue) {
      actions.push({
        icon: <EnvelopeIcon className="w-4 h-4 text-purple-600" />,
        title: 'Follow-up Email Campaign',
        description: `Send personalized ${donor.totalLifetimeGiving > 1000 ? 'impact report' : 'education update'} to align with donor interests.`,
        reasoning: `High ${isHighPotential ? 'potential score (' + donor.predictedPotential + '%)' : 'lifetime giving ($' + donor.totalLifetimeGiving.toLocaleString() + ')'} indicates opportunity for targeted communication.`,
        priority: 'medium'
      });
    }

    if (donor.giftCount >= 4 || hasRecentGift) {
      actions.push({
        icon: <CalendarIcon className="w-4 h-4 text-green-600" />,
        title: 'Quarterly Check-in Schedule',
        description: 'Schedule recurring quarterly outreach to maintain consistent giving relationship.',
        reasoning: `${donor.giftCount >= 4 ? 'Multiple gifts (' + donor.giftCount + ')' : 'Recent gift activity'} indicates engaged donor requiring regular stewardship.`,
        priority: 'low'
      });
    }

    if (isNewDonor) {
      actions.push({
        icon: <SparklesIcon className="w-4 h-4 text-orange-600" />,
        title: 'New Donor Welcome Series',
        description: 'Implement 7-day welcome sequence with impact stories and second gift ask.',
        reasoning: 'New donor status requires immediate cultivation within optimal 7-day conversion window.',
        priority: 'high'
      });
    }

    return actions;
  };

  const performance = getPerformanceStatus();
  const smartSuggestions = getSmartSuggestions();
  const askAmount = getGeneratedAskAmount();
  const aiSnapshot = generateAISnapshot();

  // Helper functions for FEC committee management
  const toggleCommitteeExpansion = (committeeName: string) => {
    const newExpanded = new Set(expandedCommittees);
    if (newExpanded.has(committeeName)) {
      newExpanded.delete(committeeName);
    } else {
      newExpanded.add(committeeName);
      // Initialize pagination for this committee if not already set
      if (!committeeTransactionPages[committeeName]) {
        setCommitteeTransactionPages(prev => ({ ...prev, [committeeName]: 1 }));
      }
    }
    setExpandedCommittees(newExpanded);
  };

  const getTransactionPage = (committeeName: string) => {
    return committeeTransactionPages[committeeName] || 1;
  };

  const setTransactionPage = (committeeName: string, page: number) => {
    setCommitteeTransactionPages(prev => ({ ...prev, [committeeName]: page }));
  };

  const getPagedTransactions = (transactions: any[], page: number, pageSize: number = 5) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return transactions.slice(startIndex, endIndex);
  };

  const getTotalPages = (totalItems: number, pageSize: number = 5) => {
    return Math.ceil(totalItems / pageSize);
  };

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

          {/* Compact AI Insights */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4 flex flex-col h-full max-h-80">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2 flex-shrink-0">
                <SparklesIcon className="w-4 h-4" />
                AI Insights
              </h3>

              <div className="flex-1 flex flex-col min-h-0">
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
                  <div className="text-sm text-green-600">+ 885 upgrade · 58%</div>
                </div>
              </div>

                {/* Capacity Bar */}
                <div className="mb-4 flex-shrink-0">
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                      style={{ width: '60%' }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600">Giving at 60% of potential capacity</div>
                </div>



                {/* Status and Segment */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 flex-shrink-0">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 w-fit">
                    Level-Up List
                  </span>
                  <div className="flex items-center gap-2 text-sm text-orange-700">
                    <ExclamationTriangleIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Donor below capacity — eligible for upgrade</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3 border-t border-blue-200 flex-shrink-0">
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


            </div>
          </div>


        </div>
      </Card>

      {/* Recurring Readiness - Separate Widget */}
      {donor.recurringReadiness && (
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <BoltIcon className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Recurring Readiness</span>
              </div>

              <Badge className="bg-green-100 text-green-800 border-green-200 text-xs px-2 py-1">ML Model</Badge>

              <div
                className={`text-lg font-bold ${
                  donor.recurringReadiness.bucket === 'HIGH' ? 'text-green-600' :
                  donor.recurringReadiness.bucket === 'MED' ? 'text-yellow-600' :
                  'text-gray-500'
                }`}
                title="Calculated by our Recurrence Probability model using giving history and look-alike donor patterns."
              >
                {Math.round(donor.recurringReadiness.probability * 100)}%
              </div>

              <div className="text-xs text-gray-600 bg-yellow-100 px-2 py-1 rounded">Medium</div>

              <span className="text-sm text-gray-600">Modeled readiness to convert to a recurring gift.</span>
            </div>

            <div className="flex items-center gap-4">
              {donor.recurringReadiness.recommendedMonthlyAmount && (
                <div className="text-right">
                  <span className="text-sm text-gray-600">Suggested monthly: </span>
                  <span className="text-lg font-bold text-green-700">
                    ${donor.recurringReadiness.recommendedMonthlyAmount}
                  </span>
                </div>
              )}
              <div className="text-xs text-gray-500">
                Last updated {new Date(donor.recurringReadiness.lastScoredAt).toLocaleDateString()} • Confidence: {Math.round(donor.recurringReadiness.confidence * 100)}%
              </div>
              <button className="text-xs text-blue-600 hover:text-blue-800 underline">Refresh</button>
            </div>
          </div>
        </Card>
      )}

      {/* Enhanced Tabbed Navigation */}
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

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Collapsible Giving Overview Section */}
            <div className="bg-gradient-to-r from-crimson-blue to-crimson-dark-blue rounded-xl text-white overflow-hidden">
              {/* Minimized Header - Always Visible */}
              <div
                className="flex items-center justify-between p-6 cursor-pointer hover:bg-white hover:bg-opacity-5 transition-colors"
                onClick={() => setIsGivingOverviewExpanded(!isGivingOverviewExpanded)}
              >
                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-3xl font-bold">
                      ${donor.givingOverview?.totalRaised?.toLocaleString() || donor.totalLifetimeGiving.toLocaleString()}
                    </div>
                    <div className="text-crimson-accent-blue text-lg font-medium">
                      Total Raised (CTD) | {donor.givingOverview?.consecutiveGifts || donor.giftCount} Gifts
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">$8,785.01</div>
                    <div className="text-crimson-accent-blue text-sm">Spouse: Ms. Ellen Banks</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <ChevronDownIcon
                    className={`w-6 h-6 text-white transition-transform duration-200 ${
                      isGivingOverviewExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Expanded Details - Collapsible */}
              {isGivingOverviewExpanded && (
                <div className="px-6 pb-6 border-t border-white border-opacity-20">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {/* Primary CTD Cycle Breakdown */}
                    <div>
                      <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Cycle Breakdown</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium">P2024</span>
                          <span className="text-white">$3,750</span>
                          <span className="text-crimson-accent-blue text-sm">($450 Excessive)</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium">G2024</span>
                          <span className="text-white">$474.56</span>
                          <span className="text-crimson-accent-blue text-sm">($2,825.44 Remaining)</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium">G2022</span>
                          <span className="text-white">$230</span>
                          <span className="text-crimson-accent-blue text-sm">($2,670 Remaining)</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium">CDUIT</span>
                          <span className="text-white">$25</span>
                          <span className="text-crimson-accent-blue text-sm">$25</span>
                        </div>
                      </div>
                    </div>

                    {/* Giving Overview Stats */}
                    <div className="bg-white bg-opacity-10 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Giving Overview</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="text-white font-medium">$100</div>
                          <div className="text-crimson-accent-blue text-sm">First Gift (6/20/16)</div>
                        </div>
                        <div>
                          <div className="text-white font-medium">$2.22</div>
                          <div className="text-crimson-accent-blue text-sm">Latest Gift (4/1/25)</div>
                        </div>
                        <div>
                          <div className="text-white font-medium">$3,750</div>
                          <div className="text-crimson-accent-blue text-sm">Highest Gift (3/30/23)</div>
                        </div>
                        <div>
                          <div className="text-white font-medium">$927.64</div>
                          <div className="text-crimson-accent-blue text-sm">Average Gift</div>
                        </div>
                      </div>
                    </div>

                    {/* Spouse Details */}
                    <div className="bg-white bg-opacity-10 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Spouse Details</h4>
                      <div className="mb-3">
                        <div className="text-2xl font-bold text-white">$8,785.01</div>
                        <div className="text-crimson-accent-blue text-sm">Ms. Ellen Banks</div>
                        <div className="text-white text-sm">Total Raised (CTD) | 18 Gifts</div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-white">P2016</span>
                          <span className="text-white">$85</span>
                          <span className="text-crimson-accent-blue">($2,615 Remaining)</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-white">C-PAC</span>
                          <span className="text-white">$</span>
                          <span className="text-crimson-accent-blue">($5,000 Remaining)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Main Overview Layout - 3/4 left, 1/4 right */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Column - Donation Summary (3/4 width) */}
              <div className="lg:col-span-3 space-y-6">
                {/* Enhanced Giving Overview */}
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Donation Summary</h3>

                  {/* Compact Metrics Row - All 6 Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                    {/* Total Raised Card - Clickable */}
                    <div
                      className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200 cursor-pointer hover:shadow-md transition-shadow text-center"
                      onClick={() => setShowGivingBreakdown(true)}
                    >
                      <p className="text-xs text-blue-700 font-medium mb-1">Total Raised</p>
                      <p className="text-lg font-bold text-blue-900">${donor.givingOverview?.totalRaised?.toLocaleString() || donor.totalLifetimeGiving.toLocaleString()}</p>
                      <p className="text-xs text-blue-600 mt-1">{donor.givingOverview?.consecutiveGifts || donor.giftCount} total gifts</p>
                    </div>

                    {/* Unrealized Potential - Corrected Calculation */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200 text-center">
                      <p className="text-xs text-purple-700 font-medium mb-1">Unrealized Potential</p>
                      <p className="text-lg font-bold text-purple-900">
                        ${(24500 - (donor.givingOverview?.totalRaised || donor.totalLifetimeGiving)).toLocaleString()}
                      </p>
                      <p className="text-xs text-purple-600 mt-1">Gap to modeled capacity</p>
                    </div>

                    {/* Consecutive Gifts with Cycles */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border border-green-200 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <p className="text-xs text-green-700 font-medium">Consecutive Gifts</p>
                        {(donor.givingOverview?.consecutiveGifts || donor.giftCount) > 5 ? (
                          <ArrowTrendingUpIcon className="w-3 h-3 text-green-600" title="Positive momentum" />
                        ) : (
                          <TrendingDownIcon className="w-3 h-3 text-orange-500" title="Needs attention" />
                        )}
                      </div>
                      <p className="text-lg font-bold text-green-900">{donor.givingOverview?.consecutiveGifts || donor.giftCount} Cycles</p>
                      <p className="text-xs text-green-600 mt-1">Since 2008</p>
                    </div>

                    {/* Soft Credits */}
                    <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-3 rounded-lg border border-teal-200 text-center">
                      <p className="text-xs text-teal-700 font-medium mb-1">Soft Credits</p>
                      <p className="text-lg font-bold text-teal-900">$5,030</p>
                      <p className="text-xs text-teal-600 mt-1">2 gifts attributed</p>
                    </div>

                    {/* Pledges */}
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-3 rounded-lg border border-indigo-200 text-center">
                      <p className="text-xs text-indigo-700 font-medium mb-1">Open Pledges</p>
                      <p className="text-lg font-bold text-indigo-900">$2,500</p>
                      <p className="text-xs text-indigo-600 mt-1">1 outstanding pledge</p>
                    </div>

                    {/* Tier Level */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-lg border border-orange-200 text-center">
                      <p className="text-xs text-orange-700 font-medium mb-1">Tier Level</p>
                      <p className="text-sm font-bold text-orange-900">{donor.givingOverview?.tier || (donor.totalLifetimeGiving > 1000 ? 'Diamond Supporter' : 'Gold')}</p>
                    </div>
                  </div>

                  {/* Enhanced Spouse & Family Information */}
                  {donor.relationshipMapping?.spouse && (
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg border border-gray-200 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <UserGroupIcon className="w-4 h-4 text-gray-600" />
                          <h4 className="font-medium text-gray-900">Family Information</h4>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-700">
                            <span className="font-medium">Spouse:</span>{' '}
                            <button
                              className="text-crimson-blue hover:text-crimson-dark-blue underline font-medium"
                              onClick={() => {
                                const spouseProfile = getDonorProfileByName(donor.relationshipMapping?.spouse || '');
                                if (spouseProfile) {
                                  setSelectedSpouse(spouseProfile);
                                  setShowSpouseProfile(true);
                                }
                              }}
                            >
                              {donor.relationshipMapping.spouse}
                            </button>
                          </div>
                          <div className="text-xs text-gray-600 bg-white px-2 py-1 rounded border">
                            Total Given: $8,750 • 8 gifts
                          </div>
                        </div>
                        {donor.relationshipMapping.family && donor.relationshipMapping.family.length > 0 && (
                          <div className="text-sm text-gray-700 pt-2 border-t border-gray-200">
                            <span className="font-medium">Family:</span> {donor.relationshipMapping.family.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Performance Status */}
                  <div className={`p-4 rounded-lg border ${performance.color}`}>
                    <div className="flex items-center gap-2">
                      <TrendingUpIcon className="w-5 h-5" />
                      <span className="font-medium">{performance.message}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - AI Snapshot (1/4 width) */}
              <div className="lg:col-span-1">
                <div className="sticky top-6 space-y-6">
                  {/* Quick CTD Reference */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <CurrencyDollarIcon className="w-4 h-4 text-crimson-blue" />
                      <h4 className="font-semibold text-gray-900 text-sm">Cycle-to-Date</h4>
                    </div>
                    <div className="text-center mb-3">
                      <div className="text-xl font-bold text-crimson-blue">$4,225</div>
                      <div className="text-xs text-crimson-blue">46 gifts</div>
                    </div>
                    <div className="border-t border-gray-100 pt-3">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">$2</div>
                        <div className="text-xs text-crimson-blue">Most Recent</div>
                        <div className="text-xs text-gray-500">04/01/2025</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <BrainIcon className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-text-primary">AI Research</h3>
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs">Live</Badge>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="bg-white p-2 rounded-full shadow-sm flex-shrink-0">
                        <SparklesIcon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {isLoadingResearch ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600"></div>
                            <p className="text-gray-600 text-xs">Researching...</p>
                          </div>
                        ) : (
                          <p className="text-gray-800 leading-relaxed text-sm">
                            {aiResearch?.summary || donor.aiSnapshot || aiSnapshot}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-purple-200">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-purple-700 font-medium">Confidence:</span>
                        <span className="text-purple-900 font-semibold">{aiResearch?.confidence || 94}%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-purple-700 font-medium">Updated:</span>
                        <span className="text-purple-900">{new Date().toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        {!isLoadingResearch && (
                          <button
                            onClick={() => {
                              setIsLoadingResearch(true);
                              generateMockDonorResearch(donor).then(setAiResearch).finally(() => setIsLoadingResearch(false));
                            }}
                            className="text-xs text-purple-600 hover:text-purple-800 underline"
                          >
                            Refresh
                          </button>
                        )}
                        <button
                          onClick={() => setShowSourcesModal(true)}
                          className="text-xs text-purple-600 hover:text-purple-800 underline"
                        >
                          Sources ({aiResearch?.sources?.length || 5})
                        </button>
                      </div>
                    </div>
                  </div>


                </div>
              </div>
            </div>
          </div>
        )}

        {/* Intelligence Tab */}
        {activeTab === 'intelligence' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Intelligence */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <PhoneIcon className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-text-primary">Contact Intelligence</h3>
                </div>
                {donor.contactIntelligence && (
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors">
                      DialR
                    </button>
                    <button className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors">
                      TargetPath
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                {donor.contactIntelligence ? (
                  <>
                    {/* Communication Preferences */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-3">Communication Preferences</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 block">Preferred Method:</span>
                          <span className="font-medium capitalize flex items-center gap-1">
                            {donor.contactIntelligence.preferredContactMethod === 'phone' && <PhoneIcon className="w-3 h-3" />}
                            {donor.contactIntelligence.preferredContactMethod === 'email' && <EnvelopeIcon className="w-3 h-3" />}
                            {donor.contactIntelligence.preferredContactMethod === 'text' && <ChatBubbleLeftRightIcon className="w-3 h-3" />}
                            {donor.contactIntelligence.preferredContactMethod}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 block">Timezone:</span>
                          <span className="font-medium">{donor.contactIntelligence.timezone}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-600 block">Response Pattern:</span>
                          <span className="font-medium">{donor.contactIntelligence.responsePattern}</span>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity & Call History */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-green-900">Recent Activity</h4>
                        <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
                          DialR Connected
                        </span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-2 bg-white rounded border">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium">Call - Soft Pledge</span>
                            <span className="text-xs text-gray-500">{formatLastContact(donor.contactIntelligence.lastContactDate)}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-green-700">$1,000</div>
                            <div className="text-xs text-gray-500">Pledged</div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 bg-white p-2 rounded border">
                          <strong>Outcome:</strong> {donor.contactIntelligence.lastContactOutcome}
                        </div>
                      </div>
                    </div>

                    {/* Best Contact Times */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <h4 className="font-medium text-amber-900 mb-2">Optimal Contact Windows</h4>
                      <div className="flex flex-wrap gap-2">
                        {donor.contactIntelligence.bestContactTimes.map((time, index) => (
                          <div key={index} className="text-sm text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                            {time}
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-xs text-amber-700">
                        <ClockIcon className="w-3 h-3 inline mr-1" />
                        Based on call success rates and response patterns
                      </div>
                    </div>

                    {/* Multi-Channel Engagement */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-medium text-purple-900 mb-3">Multi-Channel Engagement</h4>
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="bg-white p-2 rounded border">
                          <PhoneIcon className="w-4 h-4 mx-auto text-blue-600 mb-1" />
                          <div className="text-xs font-medium">Calls</div>
                          <div className="text-sm text-gray-600">85% Success</div>
                        </div>
                        <div className="bg-white p-2 rounded border">
                          <EnvelopeIcon className="w-4 h-4 mx-auto text-green-600 mb-1" />
                          <div className="text-xs font-medium">Email</div>
                          <div className="text-sm text-gray-600">72% Open</div>
                        </div>
                        <div className="bg-white p-2 rounded border">
                          <ChatBubbleLeftRightIcon className="w-4 h-4 mx-auto text-purple-600 mb-1" />
                          <div className="text-xs font-medium">Text</div>
                          <div className="text-sm text-gray-600">95% Read</div>
                        </div>
                      </div>
                    </div>

                    {/* Active Campaigns */}
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-indigo-900">Active Campaigns</h4>
                        <span className="text-xs text-indigo-700 bg-indigo-100 px-2 py-1 rounded">
                          TargetPath
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-white rounded border">
                          <div>
                            <div className="text-sm font-medium">Major Gift Follow-up</div>
                            <div className="text-xs text-gray-500">3-touch sequence • Day 2 of 7</div>
                          </div>
                          <div className="text-xs text-indigo-600 font-medium">In Progress</div>
                        </div>
                        <div className="text-xs text-gray-600">
                          Next: Personal call scheduled for tomorrow at 2:00 PM
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                    <div className="flex justify-center gap-4 mb-4">
                      <PhoneIcon className="w-8 h-8 text-gray-400" />
                      <EnvelopeIcon className="w-8 h-8 text-gray-400" />
                      <ChatBubbleLeftRightIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-sm mb-2">Contact intelligence data not available</p>
                    <p className="text-gray-500 text-xs mb-4">Connect DialR and TargetPath to start collecting interaction data</p>
                    <div className="flex justify-center gap-2">
                      <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                        Connect DialR
                      </button>
                      <button className="px-4 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">
                        Setup TargetPath
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Giving Intelligence */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUpIcon className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-text-primary">Giving Intelligence</h3>
              </div>
              <div className="space-y-4">
                {donor.givingIntelligence ? (
                  <>
                    {/* Enhanced Capacity Analysis */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-medium text-purple-900 mb-3">Capacity Analysis</h4>

                      {/* Score with Trend */}
                      <div className="flex items-center gap-4 mb-3">
                        <div className="text-center">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-purple-700">{donor.givingIntelligence.capacityScore}/100</span>
                            {donor.givingIntelligence.capacityTrend === 'increasing' && (
                              <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" title="Improving vs last year" />
                            )}
                            {donor.givingIntelligence.capacityTrend === 'declining' && (
                              <TrendingDownIcon className="w-5 h-5 text-red-600" title="Declining vs last year" />
                            )}
                            {donor.givingIntelligence.capacityTrend === 'stable' && (
                              <span className="text-gray-500 text-sm">→</span>
                            )}
                          </div>
                          <div className="text-xs text-purple-600">
                            {donor.givingIntelligence.capacityTrend === 'increasing' && '↗ improving vs last year'}
                            {donor.givingIntelligence.capacityTrend === 'declining' && '↘ declining vs last year'}
                            {donor.givingIntelligence.capacityTrend === 'stable' && '→ stable vs last year'}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="w-full bg-purple-200 rounded-full h-3">
                            <div
                              className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                              style={{ width: `${donor.givingIntelligence.capacityScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Benchmark Comparison */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-white p-3 rounded border">
                          <div className="text-purple-700 font-medium">
                            {donor.givingIntelligence.givingVsCapacity > 0 ? '+' : ''}{donor.givingIntelligence.givingVsCapacity}% vs modeled capacity
                          </div>
                          <div className="text-purple-600 text-xs mt-1">
                            {donor.givingIntelligence.peerComparison}
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded border">
                          <div className="text-purple-700 font-medium">
                            Top {100 - donor.givingIntelligence.demographicPercentile}% of peers
                          </div>
                          <div className="text-purple-600 text-xs mt-1">
                            Demographic ranking
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Upgrade/Recovery Opportunity */}
                    <div className={`rounded-lg p-4 ${
                      donor.givingIntelligence.upgradeOpportunity.status === 'below-capacity'
                        ? 'bg-blue-50 border border-blue-200'
                        : donor.givingIntelligence.upgradeOpportunity.status === 'above-capacity'
                        ? 'bg-orange-50 border border-orange-200'
                        : 'bg-yellow-50 border border-yellow-200'
                    }`}>
                      <h4 className={`font-medium mb-3 ${
                        donor.givingIntelligence.upgradeOpportunity.status === 'below-capacity'
                          ? 'text-blue-900'
                          : donor.givingIntelligence.upgradeOpportunity.status === 'above-capacity'
                          ? 'text-orange-900'
                          : 'text-yellow-900'
                      }`}>
                        {donor.givingIntelligence.upgradeOpportunity.type === 'upgrade' && 'Upgrade Opportunity'}
                        {donor.givingIntelligence.upgradeOpportunity.type === 'recovery' && 'Recovery Opportunity'}
                        {donor.givingIntelligence.upgradeOpportunity.type === 'monitor' && 'Capacity Monitoring'}
                      </h4>

                      {/* Unrealized Potential (for below capacity donors) */}
                      {donor.givingIntelligence.upgradeOpportunity.unrealizedPotential && (
                        <div className="bg-white p-3 rounded border mb-3">
                          <div className="flex justify-between items-center">
                            <span className="text-blue-700 font-medium">Unrealized Potential:</span>
                            <span className="font-bold text-blue-800">
                              ${donor.givingIntelligence.upgradeOpportunity.unrealizedPotential.toLocaleString()}
                            </span>
                          </div>
                          <div className="text-xs text-blue-600 mt-1">
                            Amount below modeled capacity
                          </div>
                        </div>
                      )}

                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-white p-3 rounded border">
                          <div className={`font-bold text-lg ${
                            donor.givingIntelligence.upgradeOpportunity.status === 'below-capacity'
                              ? 'text-blue-800'
                              : donor.givingIntelligence.upgradeOpportunity.status === 'above-capacity'
                              ? 'text-orange-800'
                              : 'text-yellow-800'
                          }`}>
                            ${donor.givingIntelligence.upgradeOpportunity.potential.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-600">
                            {donor.givingIntelligence.upgradeOpportunity.type === 'upgrade' ? 'Upgrade Potential' : 'Total Potential'}
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded border">
                          <div className={`font-bold text-lg ${
                            donor.givingIntelligence.upgradeOpportunity.status === 'below-capacity'
                              ? 'text-blue-800'
                              : donor.givingIntelligence.upgradeOpportunity.status === 'above-capacity'
                              ? 'text-orange-800'
                              : 'text-yellow-800'
                          }`}>
                            {donor.givingIntelligence.upgradeOpportunity.confidence}%
                          </div>
                          <div className="text-xs text-gray-600">Confidence</div>
                        </div>
                      </div>

                      {/* Timing and Status */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-3 rounded border">
                          <div className={`font-medium ${
                            donor.givingIntelligence.upgradeOpportunity.status === 'below-capacity'
                              ? 'text-blue-700'
                              : donor.givingIntelligence.upgradeOpportunity.status === 'above-capacity'
                              ? 'text-orange-700'
                              : 'text-yellow-700'
                          }`}>
                            {donor.givingIntelligence.upgradeOpportunity.timing}
                          </div>
                          <div className="text-xs text-gray-600">Timing Window</div>
                        </div>
                        <div className="bg-white p-3 rounded border">
                          <div className={`font-medium ${
                            donor.givingIntelligence.upgradeOpportunity.status === 'below-capacity'
                              ? 'text-blue-700'
                              : donor.givingIntelligence.upgradeOpportunity.status === 'above-capacity'
                              ? 'text-orange-700'
                              : 'text-yellow-700'
                          }`}>
                            {donor.givingIntelligence.upgradeOpportunity.status === 'below-capacity' && 'Below capacity'}
                            {donor.givingIntelligence.upgradeOpportunity.status === 'at-capacity' && 'At capacity'}
                            {donor.givingIntelligence.upgradeOpportunity.status === 'above-capacity' && 'Above capacity'}
                            {donor.givingIntelligence.upgradeOpportunity.status === 'fatigue-risk' && 'Fatigue risk'}
                          </div>
                          <div className="text-xs text-gray-600">
                            {donor.givingIntelligence.upgradeOpportunity.status === 'above-capacity' && 'Monitor for fatigue'}
                            {donor.givingIntelligence.upgradeOpportunity.status === 'below-capacity' && 'Upgrade opportunity'}
                            {donor.givingIntelligence.upgradeOpportunity.status === 'at-capacity' && 'Maintain engagement'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Patterns & Triggers */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-3">Patterns & Triggers</h4>

                      {/* Seasonal Patterns */}
                      <div className="mb-4">
                        <span className="text-green-700 text-sm font-medium">Seasonal Patterns:</span>
                        <div className="space-y-2 mt-2">
                          {donor.givingIntelligence.seasonalPatterns.map((pattern, index) => (
                            <div key={index} className="bg-white p-2 rounded border flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-green-800">{pattern.pattern}</span>
                                {pattern.historicalData && (
                                  <CheckCircleIcon className="w-4 h-4 text-green-600" title="Based on actual donor history" />
                                )}
                              </div>
                              <div className="text-xs text-green-600">
                                {pattern.confidence}% confidence
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Trigger Events */}
                      <div className="mb-4">
                        <span className="text-green-700 text-sm font-medium">Trigger Events:</span>
                        <div className="space-y-2 mt-2">
                          {donor.givingIntelligence.triggerEvents.map((trigger, index) => (
                            <div key={index} className="bg-white p-2 rounded border flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-green-800">{trigger.trigger}</span>
                                {trigger.historicalResponse && (
                                  <CheckCircleIcon className="w-4 h-4 text-green-600" title="Donor has responded to this trigger before" />
                                )}
                              </div>
                              <div className="text-xs text-green-600">
                                {trigger.likelihood}% likelihood
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Historical Response */}
                      {donor.givingIntelligence.historicalTriggers && donor.givingIntelligence.historicalTriggers.length > 0 && (
                        <div>
                          <span className="text-green-700 text-sm font-medium">Historical Response:</span>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {donor.givingIntelligence.historicalTriggers.map((trigger, index) => (
                              <span key={index} className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded border border-green-300">
                                ✓ {trigger}
                              </span>
                            ))}
                          </div>
                          <div className="text-xs text-green-600 mt-1">
                            Triggers this donor has actually responded to in the past
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                    <TrendingUpIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">Giving intelligence data not available</p>
                    <p className="text-gray-500 text-xs mt-1">Data will be populated as giving patterns are analyzed</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}



        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-6">

            {donor.predictiveInsights ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Next Best Action */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <BoltIcon className="w-5 h-5 text-yellow-600" />
                  <h3 className="text-lg font-semibold text-text-primary">Next Best Action</h3>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="space-y-3">
                    <div>
                      <div className="font-medium text-yellow-900">Recommended Action</div>
                      <div className="text-yellow-800 mt-1">{donor.predictiveInsights.nextBestAction.action}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-yellow-700">Confidence</div>
                      <div className="text-lg font-bold text-yellow-800">{donor.predictiveInsights.nextBestAction.confidence}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-yellow-700">Timing</div>
                      <div className="text-lg font-bold text-yellow-800">{donor.predictiveInsights.nextBestAction.timing}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-yellow-700">Expected Outcome</div>
                    <div className="text-yellow-800 mt-1">{donor.predictiveInsights.nextBestAction.expectedOutcome}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Churn Risk */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-semibold text-text-primary">Churn Risk Analysis</h3>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-red-700">{donor.predictiveInsights.churnRisk.score}%</div>
                  <div className="text-sm text-red-600">Churn Risk Score</div>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm font-medium text-red-700">Risk Factors:</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {donor.predictiveInsights.churnRisk.factors.map((factor, index) => (
                        <span key={index} className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-red-700">Prevention Strategy:</div>
                    <div className="text-red-800 text-sm mt-1">{donor.predictiveInsights.churnRisk.preventionStrategy}</div>
                  </div>
                </div>
              </div>
            </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <LightBulbIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Predictive Insights Coming Soon</h4>
                <p className="text-gray-600 text-sm">
                  Advanced AI-powered insights and recommendations will be available as more data is collected and analyzed.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Enriched Data Tab */}
        {activeTab === 'enriched' && (
          <div className="space-y-6">
            {enrichedData ? (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-text-primary">Enriched Data</h3>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">{enrichedData.dataSource}</Badge>
                </div>

                {/* AI Snapshot for Enhanced Data */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <SparklesIcon className="w-5 h-5 text-blue-600" />
                    <h4 className="text-lg font-semibold text-blue-900">AI Snapshot</h4>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">Enhanced Analysis</Badge>
                  </div>

                  <div className="prose prose-sm text-blue-800 leading-relaxed">
                    <p className="mb-3">
                      <strong>{donor.name}</strong> is a {enrichedData.age}-year-old {enrichedData.gender?.toLowerCase()}
                      {enrichedData.homeowner ? ' homeowner' : ' renter'} with {enrichedData.education?.toLowerCase()} education
                      and an estimated household income of {enrichedData.householdIncome}.
                    </p>

                    <p className="mb-3">
                      <strong>Political Profile:</strong> Registered {enrichedData.party} voter with {enrichedData.politicalEngagement}%
                      political engagement score. Shows {enrichedData.volunteerPropensity}% volunteer propensity and
                      {enrichedData.eventAttendancePropensity}% likelihood to attend events.
                    </p>

                    <p className="mb-0">
                      <strong>Fundraising Insights:</strong> Classified as {enrichedData.givingCapacity} giving capacity.
                      {enrichedData.politicalEngagement && enrichedData.politicalEngagement > 70 ?
                        ' High political engagement suggests strong potential for political giving and advocacy involvement.' :
                        ' Moderate political engagement indicates potential for targeted outreach and cultivation.'
                      }
                      {enrichedData.volunteerPropensity && enrichedData.volunteerPropensity > 60 ?
                        ' Strong volunteer propensity makes them an excellent candidate for event participation and hands-on involvement.' :
                        ''
                      }
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-blue-200">
                    <div className="text-xs text-blue-600">
                      Analysis generated from {enrichedData.dataSource} • Last updated {enrichedData.lastUpdated}
                    </div>
                    <button className="text-xs text-blue-600 hover:text-blue-800 underline">
                      Refresh Analysis
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Demographics */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      Demographics
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Age:</span>
                        <span className="font-medium">{enrichedData.age}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gender:</span>
                        <span className="font-medium">{enrichedData.gender}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Household Income:</span>
                        <span className="font-medium">{enrichedData.householdIncome}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Homeowner:</span>
                        <span className="font-medium">{enrichedData.homeowner ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Education:</span>
                        <span className="font-medium">{enrichedData.education}</span>
                      </div>
                    </div>
                  </div>

                  {/* Political & Giving Profile */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <CurrencyDollarIcon className="w-4 h-4" />
                      Political & Giving Profile
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Party Affiliation:</span>
                        <span className="font-medium">{enrichedData.party}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Giving Capacity:</span>
                        <span className="font-medium">{enrichedData.givingCapacity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Political Engagement:</span>
                        <span className="font-medium">{enrichedData.politicalEngagement}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Volunteer Propensity:</span>
                        <span className="font-medium">{enrichedData.volunteerPropensity}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Event Attendance:</span>
                        <span className="font-medium">{enrichedData.eventAttendancePropensity}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <div className="flex items-center gap-2 text-blue-800 text-sm">
                    <ClockIcon className="w-4 h-4" />
                    <span className="font-medium">Data last updated:</span>
                    <span>{enrichedData.lastUpdated}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Enriched Data Not Available</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Detailed demographic and political data will be populated from external data sources.
                </p>
                <Button variant="secondary">
                  <SparklesIcon className="w-4 h-4 mr-2" />
                  Request Data Enrichment
                </Button>
              </div>
            )}

            {/* Enhanced Lookalike Finder */}
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <UserGroupIcon className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-text-primary">Lookalike Finder</h3>
                <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">i360 Data</Badge>
              </div>

              {!lookalikeExpanded ? (
                // Collapsed State
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                  <div className="text-center">
                    <UserGroupIcon className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {allLookalikes.length.toLocaleString()} potential lookalike donors identified
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Find donors with similar demographics, giving patterns, and engagement behavior using i360 data.
                    </p>
                    <Button onClick={() => setLookalikeExpanded(true)} className="mr-3">
                      <EyeIcon className="w-4 h-4 mr-2" />
                      View & Filter
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setShowAISuggested(true);
                        setLookalikeExpanded(true);
                      }}
                    >
                      <SparklesIcon className="w-4 h-4 mr-2" />
                      AI Suggested List ({aiSuggestedLookalikes.length})
                    </Button>
                  </div>
                </div>
              ) : (
                // Expanded State
                <div className="bg-white border border-gray-200 rounded-lg">
                  {/* Filter Controls */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">Filter Lookalikes</h4>
                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          variant={showAISuggested ? "primary" : "secondary"}
                          onClick={() => setShowAISuggested(!showAISuggested)}
                        >
                          <SparklesIcon className="w-4 h-4 mr-1" />
                          AI Suggested ({aiSuggestedLookalikes.length})
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setLookalikeExpanded(false)}
                        >
                          Collapse
                        </Button>
                      </div>
                    </div>

                    {!showAISuggested && (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Geography Filters */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Geography</label>
                          <select
                            className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value && !lookalikeFilters.states.includes(value)) {
                                setLookalikeFilters(prev => ({
                                  ...prev,
                                  states: [...prev.states, value]
                                }));
                              }
                            }}
                          >
                            <option value="">Select State</option>
                            <option value="FL">Florida</option>
                            <option value="TX">Texas</option>
                            <option value="CA">California</option>
                            <option value="NY">New York</option>
                            <option value="IL">Illinois</option>
                          </select>
                        </div>

                        {/* Capacity Level */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Capacity Level</label>
                          <select
                            className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value && !lookalikeFilters.capacityLevel.includes(value)) {
                                setLookalikeFilters(prev => ({
                                  ...prev,
                                  capacityLevel: [...prev.capacityLevel, value]
                                }));
                              }
                            }}
                          >
                            <option value="">Select Capacity</option>
                            <option value="Low">Low ($100-500)</option>
                            <option value="Medium">Medium ($500-2000)</option>
                            <option value="High">High ($2000+)</option>
                          </select>
                        </div>

                        {/* Engagement Behavior */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Engagement</label>
                          <select
                            className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value && !lookalikeFilters.engagementBehavior.includes(value)) {
                                setLookalikeFilters(prev => ({
                                  ...prev,
                                  engagementBehavior: [...prev.engagementBehavior, value]
                                }));
                              }
                            }}
                          >
                            <option value="">Select Behavior</option>
                            <option value="Event Attendee">Event Attendee</option>
                            <option value="Volunteer">Volunteer</option>
                            <option value="Email Engaged">Email Engaged</option>
                            <option value="Social Media Active">Social Media Active</option>
                          </select>
                        </div>

                        {/* Clear Filters */}
                        <div className="flex items-end">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setLookalikeFilters({
                              states: [],
                              counties: [],
                              zipCodes: [],
                              capacityLevel: [],
                              engagementBehavior: []
                            })}
                            className="w-full"
                          >
                            Clear Filters
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Results Count */}
                    <div className="mt-4 text-sm text-gray-600">
                      Currently showing <span className="font-semibold text-gray-900">
                        {showAISuggested ? aiSuggestedLookalikes.length : filteredLookalikes.length}
                      </span> of <span className="font-semibold text-gray-900">
                        {allLookalikes.length.toLocaleString()}
                      </span> potential lookalikes.
                    </div>
                  </div>

                  {/* Preview Table */}
                  <div className="p-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 px-3 font-medium text-gray-700">
                              <input type="checkbox" className="mr-2" />
                              Name
                            </th>
                            <th className="text-left py-2 px-3 font-medium text-gray-700">Location</th>
                            <th className="text-left py-2 px-3 font-medium text-gray-700">Capacity</th>
                            <th className="text-left py-2 px-3 font-medium text-gray-700">Similarity</th>
                            <th className="text-left py-2 px-3 font-medium text-gray-700">Engagement</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(showAISuggested ? aiSuggestedLookalikes : filteredLookalikes)
                            .slice(0, 10)
                            .map((lookalike, index) => (
                            <tr key={lookalike.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-2 px-3">
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    className="mr-2"
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedLookalikes(prev => [...prev, lookalike]);
                                      } else {
                                        setSelectedLookalikes(prev => prev.filter(l => l.id !== lookalike.id));
                                      }
                                    }}
                                  />
                                  <div>
                                    <div className="font-medium text-gray-900">{lookalike.name}</div>
                                    <div className="text-xs text-gray-500">{lookalike.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-2 px-3">
                                <div className="text-gray-900">{lookalike.county}, {lookalike.state}</div>
                                <div className="text-xs text-gray-500">{lookalike.zipCode}</div>
                              </td>
                              <td className="py-2 px-3">
                                <div className="font-medium text-gray-900">${lookalike.modeledCapacity.toLocaleString()}</div>
                                <div className="text-xs text-gray-500">{lookalike.capacityLevel}</div>
                              </td>
                              <td className="py-2 px-3">
                                <div className="flex items-center">
                                  <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                                    <div
                                      className="bg-green-600 h-2 rounded-full"
                                      style={{ width: `${lookalike.similarityScore}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-medium">{lookalike.similarityScore}%</span>
                                </div>
                              </td>
                              <td className="py-2 px-3">
                                <Badge
                                  className="text-xs"
                                  color={lookalike.engagementBehavior === 'Volunteer' ? 'green' : 'blue'}
                                >
                                  {lookalike.engagementBehavior}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Export and Action Buttons */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        {selectedLookalikes.length} selected
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary">
                          <DocumentTextIcon className="w-4 h-4 mr-1" />
                          Export CSV
                        </Button>
                        <Button size="sm" variant="secondary">
                          <EnvelopeIcon className="w-4 h-4 mr-1" />
                          Push to MailChimp
                        </Button>
                        <Button size="sm" variant="secondary">
                          <PhoneIcon className="w-4 h-4 mr-1" />
                          Push to DialR
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setShowConfirmationModal(true)}
                          disabled={selectedLookalikes.length === 0}
                        >
                          Next ({selectedLookalikes.length})
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FEC Insights Tab */}
        {activeTab === 'fec-insights' && (
          <div className="space-y-6">
            {/* Compact Compliance Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded p-2 mb-4">
              <div className="flex items-center gap-2">
                <ExclamationTriangleIcon className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <div className="flex-1">
                  <span className="text-xs font-medium text-amber-900">FEC Data – Compliance Use Only</span>
                  <span className="text-xs text-amber-800 ml-2">
                    Public FEC data for compliance/vetting only. Not for solicitation (11 CFR §104.15).
                  </span>
                </div>
                <a
                  href="https://www.fec.gov/help-candidates-and-committees/filing-reports/contributor-information/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber-700 underline hover:text-amber-900 whitespace-nowrap"
                >
                  Learn More
                </a>
              </div>
            </div>

            {donor.fecInsights ? (
              <>
                {/* AI Snapshot for FEC Data */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <SparklesIcon className="w-5 h-5 text-amber-600" />
                    <h4 className="text-lg font-semibold text-amber-900">AI Snapshot</h4>
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">FEC Analysis</Badge>
                  </div>

                  <div className="prose prose-sm text-amber-800 leading-relaxed">
                    <p className="mb-3">
                      <strong>{donor.name}</strong> has contributed <strong>${donor.fecInsights.contributionHistory.totalAmount.toLocaleString()}</strong>
                      across {donor.fecInsights.contributionHistory.totalContributions} federal contributions,
                      supporting {donor.fecInsights.committeesSupported.length} different committees
                      from {new Date(donor.fecInsights.contributionHistory.firstContributionDate).getFullYear()}
                      to {new Date(donor.fecInsights.contributionHistory.lastContributionDate).getFullYear()}.
                    </p>

                    <p className="mb-3">
                      <strong>Recent Activity:</strong> In {donor.fecInsights.contributionHistory.yearToDate.year},
                      they've contributed ${donor.fecInsights.contributionHistory.yearToDate.amount.toLocaleString()}
                      ({donor.fecInsights.contributionHistory.yearToDate.contributionCount} contributions).
                      Current cycle total: ${donor.fecInsights.contributionHistory.cycleToDate.amount.toLocaleString()}.
                    </p>

                    <p className="mb-0">
                      <strong>Giving Pattern:</strong>
                      {(() => {
                        const avgPerContribution = donor.fecInsights.contributionHistory.totalAmount / donor.fecInsights.contributionHistory.totalContributions;
                        const isHighVolume = donor.fecInsights.contributionHistory.totalContributions > 20;
                        const isHighValue = avgPerContribution > 1000;
                        const isRecent = donor.fecInsights.contributionHistory.yearToDate.amount > 0;

                        if (isHighVolume && isHighValue) {
                          return ' High-volume, high-value donor with strong federal giving history. Excellent prospect for major gift solicitation.';
                        } else if (isHighVolume) {
                          return ' Frequent contributor with consistent federal giving pattern. Good candidate for sustained engagement and upgrade opportunities.';
                        } else if (isHighValue) {
                          return ' Selective but generous contributor. Focus on relationship building and targeted major gift asks.';
                        } else if (isRecent) {
                          return ' Active contributor with recent federal giving. Good timing for cultivation and engagement.';
                        } else {
                          return ' Historical federal contributor. Consider reactivation strategies and renewed engagement.';
                        }
                      })()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-amber-200">
                    <div className="text-xs text-amber-600">
                      Analysis based on public FEC filings • Last updated {new Date(donor.fecInsights.lastUpdated).toLocaleDateString()}
                    </div>
                    <button className="text-xs text-amber-600 hover:text-amber-800 underline">
                      Refresh Analysis
                    </button>
                  </div>
                </div>

                {/* Contribution History Snapshot */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-900">Contribution History Snapshot</h3>
                  </div>

                  {/* Summary Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {/* Historical Totals */}
                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                      <div className="text-2xl font-bold text-blue-800">
                        ${donor.fecInsights.contributionHistory.totalAmount.toLocaleString()}
                      </div>
                      <div className="text-sm text-blue-600">Total Federal Contributions</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                      <div className="text-2xl font-bold text-blue-800">
                        {donor.fecInsights.contributionHistory.totalContributions}
                      </div>
                      <div className="text-sm text-blue-600">Total Contributions</div>
                    </div>

                    {/* Current Activity - Combined YTD */}
                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                      <div className="text-2xl font-bold text-blue-800">
                        ${donor.fecInsights.contributionHistory.yearToDate.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-blue-600">
                        YTD {donor.fecInsights.contributionHistory.yearToDate.year}
                        <span className="text-blue-500 ml-1">
                          ({donor.fecInsights.contributionHistory.yearToDate.contributionCount} contributions)
                        </span>
                      </div>
                    </div>

                    {/* Cycle Activity - Combined */}
                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                      <div className="text-2xl font-bold text-blue-800">
                        ${donor.fecInsights.contributionHistory.cycleToDate.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-blue-600">
                        {donor.fecInsights.contributionHistory.cycleToDate.cycle}
                        <span className="text-blue-500 ml-1">
                          ({donor.fecInsights.contributionHistory.cycleToDate.contributionCount} contributions)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Active Cycles and Period Info */}
                  <div className="bg-white p-3 rounded border border-blue-200 mb-4">
                    <div className="text-sm text-blue-700">
                      <span className="font-medium">Active Cycles:</span> {donor.fecInsights.contributionHistory.activeCycles.join(', ')}
                      <span className="text-blue-600 ml-4">
                        <span className="font-medium">Period:</span> {new Date(donor.fecInsights.contributionHistory.firstContributionDate).getFullYear()} - {new Date(donor.fecInsights.contributionHistory.lastContributionDate).getFullYear()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity Summary */}
                {donor.fecInsights.recentActivity && (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <ClockIcon className="w-5 h-5 text-indigo-600" />
                      <h3 className="text-lg font-semibold text-indigo-900">Recent Federal Activity</h3>
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">Last 5 Transactions</span>
                    </div>

                    <div className="space-y-2">
                      {donor.fecInsights.recentActivity.map((transaction, index) => (
                        <div key={index} className="bg-white p-3 rounded-lg border border-indigo-200 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-sm font-medium text-indigo-900">
                              {new Date(transaction.date).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-indigo-700">
                              {transaction.committeeName}
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              transaction.committeeType === 'candidate' ? 'bg-blue-100 text-blue-700' :
                              transaction.committeeType === 'pac' ? 'bg-purple-100 text-purple-700' :
                              transaction.committeeType === 'party' ? 'bg-green-100 text-green-700' :
                              'bg-orange-100 text-orange-700'
                            }`}>
                              {transaction.committeeType.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-indigo-800">${transaction.amount.toLocaleString()}</div>
                            <div className="text-xs text-indigo-600">{transaction.reportPeriod}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Enhanced Committees Supported */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <UserGroupIcon className="w-5 h-5 text-green-600" />
                      <h3 className="text-lg font-semibold text-green-900">Committees Supported</h3>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {donor.fecInsights.committeesSupported.length} Committees
                      </span>
                    </div>
                    {donor.fecInsights.committeesSupported.length > 5 && (
                      <button
                        onClick={() => setShowAllCommittees(!showAllCommittees)}
                        className="text-sm text-green-600 hover:text-green-800 underline"
                      >
                        {showAllCommittees ? 'Show Top 5' : 'View All'}
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {(showAllCommittees ? donor.fecInsights.committeesSupported : donor.fecInsights.committeesSupported.slice(0, 5))
                      .map((committee, index) => (
                      <div key={index} className="bg-white rounded-lg border border-green-200 overflow-hidden">
                        {/* Committee Summary */}
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-green-900">{committee.committeeName}</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                committee.committeeType === 'candidate' ? 'bg-blue-100 text-blue-700' :
                                committee.committeeType === 'pac' ? 'bg-purple-100 text-purple-700' :
                                committee.committeeType === 'party' ? 'bg-green-100 text-green-700' :
                                'bg-orange-100 text-orange-700'
                              }`}>
                                {committee.committeeType.toUpperCase()}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-green-800">${committee.totalAmount.toLocaleString()}</div>
                              <div className="text-xs text-green-600">{committee.contributionCount} contributions</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-green-700">
                              Last contribution: {new Date(committee.lastContribution).toLocaleDateString()}
                            </div>
                            <button
                              onClick={() => toggleCommitteeExpansion(committee.committeeName)}
                              className="text-sm text-green-600 hover:text-green-800 underline flex items-center gap-1"
                            >
                              {expandedCommittees.has(committee.committeeName) ? 'Hide' : 'View'} Transactions
                              <ChevronDownIcon className={`w-4 h-4 transition-transform ${
                                expandedCommittees.has(committee.committeeName) ? 'rotate-180' : ''
                              }`} />
                            </button>
                          </div>
                        </div>

                        {/* Expanded Transaction Details with Pagination */}
                        {expandedCommittees.has(committee.committeeName) && committee.transactions && (
                          <div className="border-t border-green-200 bg-green-25">
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-medium text-green-800">Individual Transactions</h4>
                                <div className="text-xs text-green-600">
                                  {committee.transactions.length} of {committee.contributionCount} total transactions
                                </div>
                              </div>

                              {/* Compact Paginated Transaction List */}
                              <div className="space-y-1">
                                {getPagedTransactions(
                                  committee.transactions,
                                  getTransactionPage(committee.committeeName)
                                ).map((transaction, txIndex) => (
                                  <div key={txIndex} className="bg-white p-2 rounded border border-green-100 text-xs">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center">
                                        <div className="font-medium text-green-900 w-16 text-right">
                                          ${transaction.amount.toLocaleString()}
                                        </div>
                                        <div className="text-green-700 w-24 text-center ml-4">
                                          {new Date(transaction.date).toLocaleDateString()}
                                        </div>
                                        <div className="text-green-600 w-20 text-center ml-4">
                                          {transaction.reportPeriod}
                                        </div>
                                      </div>
                                      <div className="text-right text-green-600">
                                        <div>Filed: {new Date(transaction.filingDate).toLocaleDateString()}</div>
                                        <div className="text-gray-500">ID: {transaction.transactionId}</div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Pagination Controls */}
                              {committee.transactions.length > 5 && (
                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-green-200">
                                  <div className="text-xs text-green-600">
                                    Page {getTransactionPage(committee.committeeName)} of {getTotalPages(committee.transactions.length)}
                                    {' '}• Showing {getPagedTransactions(committee.transactions, getTransactionPage(committee.committeeName)).length} of {committee.transactions.length} transactions
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => setTransactionPage(
                                        committee.committeeName,
                                        Math.max(1, getTransactionPage(committee.committeeName) - 1)
                                      )}
                                      disabled={getTransactionPage(committee.committeeName) === 1}
                                      className="px-2 py-1 text-xs bg-white border border-green-300 rounded text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      Previous
                                    </button>

                                    {/* Page Numbers */}
                                    <div className="flex items-center gap-1">
                                      {Array.from({ length: getTotalPages(committee.transactions.length) }, (_, i) => i + 1)
                                        .filter(page => {
                                          const currentPage = getTransactionPage(committee.committeeName);
                                          return page === 1 || page === getTotalPages(committee.transactions.length) ||
                                                 Math.abs(page - currentPage) <= 1;
                                        })
                                        .map((page, index, array) => (
                                          <React.Fragment key={page}>
                                            {index > 0 && array[index - 1] !== page - 1 && (
                                              <span className="text-xs text-green-500">...</span>
                                            )}
                                            <button
                                              onClick={() => setTransactionPage(committee.committeeName, page)}
                                              className={`px-2 py-1 text-xs rounded ${
                                                getTransactionPage(committee.committeeName) === page
                                                  ? 'bg-green-600 text-white'
                                                  : 'bg-white border border-green-300 text-green-700 hover:bg-green-50'
                                              }`}
                                            >
                                              {page}
                                            </button>
                                          </React.Fragment>
                                        ))
                                      }
                                    </div>

                                    <button
                                      onClick={() => setTransactionPage(
                                        committee.committeeName,
                                        Math.min(getTotalPages(committee.transactions.length), getTransactionPage(committee.committeeName) + 1)
                                      )}
                                      disabled={getTransactionPage(committee.committeeName) === getTotalPages(committee.transactions.length)}
                                      className="px-2 py-1 text-xs bg-white border border-green-300 rounded text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      Next
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Giving Categories & Exclusivity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Giving Categories */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <ChartBarIcon className="w-5 h-5 text-purple-600" />
                      <h3 className="text-lg font-semibold text-purple-900">Giving Categories</h3>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white rounded border border-purple-200">
                        <span className="text-purple-700">Federal Candidates</span>
                        <span className="font-bold text-purple-800">${donor.fecInsights.givingCategories.federalCandidates.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded border border-purple-200">
                        <span className="text-purple-700">PACs</span>
                        <span className="font-bold text-purple-800">${donor.fecInsights.givingCategories.pacs.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded border border-purple-200">
                        <span className="text-purple-700">Party Committees</span>
                        <span className="font-bold text-purple-800">${donor.fecInsights.givingCategories.partyCommittees.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded border border-purple-200">
                        <span className="text-purple-700">Super PACs</span>
                        <span className="font-bold text-purple-800">${donor.fecInsights.givingCategories.superPacs.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Exclusivity Metrics */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FlagIcon className="w-5 h-5 text-orange-600" />
                      <h3 className="text-lg font-semibold text-orange-900">Exclusivity Analysis</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded border border-orange-200">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-orange-800 mb-1">
                            {donor.fecInsights.exclusivityMetrics.exclusivityPercentage}%
                          </div>
                          <div className="text-sm text-orange-600">
                            {donor.fecInsights.exclusivityMetrics.partyExclusivity === 'exclusive-democrat' ? 'Democratic' :
                             donor.fecInsights.exclusivityMetrics.partyExclusivity === 'exclusive-republican' ? 'Republican' :
                             'Bipartisan'} Giving
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded border border-orange-200">
                        <div className="text-sm text-orange-700">
                          <span className="font-medium">Party Exclusivity:</span> {
                            donor.fecInsights.exclusivityMetrics.partyExclusivity === 'exclusive-democrat' ? 'Exclusively Democratic' :
                            donor.fecInsights.exclusivityMetrics.partyExclusivity === 'exclusive-republican' ? 'Exclusively Republican' :
                            'Bipartisan Contributor'
                          }
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded border border-orange-200">
                        <div className="text-sm text-orange-700">
                          <span className="font-medium">Crossover Contributions:</span> {donor.fecInsights.exclusivityMetrics.crossoverContributions}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Aggregate Benchmarks */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrophyIcon className="w-5 h-5 text-yellow-600" />
                    <h3 className="text-lg font-semibold text-yellow-900">Aggregate Benchmarks</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-yellow-200 text-center">
                      <div className="text-2xl font-bold text-yellow-800 mb-1">
                        Top {100 - donor.fecInsights.benchmarks.nationalPercentile}%
                      </div>
                      <div className="text-sm text-yellow-600">National Ranking</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-yellow-200 text-center">
                      <div className="text-lg font-bold text-yellow-800 mb-1">
                        {donor.fecInsights.benchmarks.categoryRanking}
                      </div>
                      <div className="text-sm text-yellow-600">Category Ranking</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-yellow-200 text-center">
                      <div className="text-lg font-bold text-yellow-800 mb-1">
                        Above Average
                      </div>
                      <div className="text-sm text-yellow-600">Cycle Comparison</div>
                    </div>
                  </div>

                  <div className="mt-4 bg-white p-3 rounded border border-yellow-200">
                    <div className="text-sm text-yellow-700">
                      <span className="font-medium">Cycle Analysis:</span> {donor.fecInsights.benchmarks.cycleComparison}
                    </div>
                  </div>
                </div>

                {/* Data Source & Compliance */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Data Source:</span> {donor.fecInsights.dataSource}
                    </div>
                    <div>
                      <span className="font-medium">Last Updated:</span> {new Date(donor.fecInsights.lastUpdated).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <ShieldCheckIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No FEC Data Available</h3>
                <p className="text-gray-600 mb-4">
                  No federal contribution records found for this donor in public FEC filings.
                </p>
                <div className="text-sm text-gray-500">
                  This could mean the donor has not made federal political contributions above reporting thresholds,
                  or their contributions are not yet reflected in the public database.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Donations Tab */}
        {activeTab === 'donations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
                <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                  12 Donations
                </Badge>
              </div>
              <Button size="sm" variant="secondary" onClick={handleAddGift}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Gift
              </Button>
            </div>

            {/* CTD Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-crimson-blue to-crimson-dark-blue text-white rounded-lg p-4">
                <div className="text-2xl font-bold mb-1">$4,225</div>
                <div className="text-sm text-crimson-accent-blue">Cycle-to-Date Total</div>
                <div className="text-xs text-white opacity-80 mt-1">46 gifts this cycle</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-800 mb-1">$12,750</div>
                <div className="text-sm text-green-600">Lifetime Total</div>
                <div className="text-xs text-green-700 mt-1">All-time giving</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-800 mb-1">$927.64</div>
                <div className="text-sm text-blue-600">Average Gift</div>
                <div className="text-xs text-blue-700 mt-1">Current cycle</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-800 mb-1">$3,750</div>
                <div className="text-sm text-purple-600">Highest Gift</div>
                <div className="text-xs text-purple-700 mt-1">3/30/23 (P2024)</div>
              </div>
            </div>

            {/* Cycle Breakdown */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Cycle Breakdown</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-900">P2024</span>
                      <span className="text-sm text-gray-600 ml-2">Primary</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">$3,750</div>
                      <div className="text-sm text-red-600">$450 Excessive</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-900">G2024</span>
                      <span className="text-sm text-gray-600 ml-2">General</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">$474.56</div>
                      <div className="text-sm text-green-600">$2,825.44 Remaining</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-900">G2022</span>
                      <span className="text-sm text-gray-600 ml-2">General</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">$230</div>
                      <div className="text-sm text-green-600">$2,670 Remaining</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-900">CDUIT</span>
                      <span className="text-sm text-gray-600 ml-2">Committee</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">$25</div>
                      <div className="text-sm text-gray-500">—</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction List */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-600 uppercase tracking-wide">
                  <div className="col-span-2">MID</div>
                  <div className="col-span-1">Check #</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-2">Amount</div>
                  <div className="col-span-2">Method</div>
                  <div className="col-span-2">Fund</div>
                  <div className="col-span-1">Source</div>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {[
                  { mid: '461646', check: '1255', date: '1/23/23', amount: '$500', method: 'CH', fund: 'C-PAC', source: 'Housefile' },
                  { mid: '458932', check: '1189', date: '12/15/22', amount: '$1,000', method: 'CC', fund: 'General', source: 'Event' },
                  { mid: '455721', check: '1098', date: '11/03/22', amount: '$250', method: 'CH', fund: 'C-PAC', source: 'Mail' },
                  { mid: '452108', check: '987', date: '9/28/22', amount: '$2,500', method: 'CH', fund: 'General', source: 'Major Gift' },
                  { mid: '448765', check: '876', date: '8/15/22', amount: '$100', method: 'Online', fund: 'C-PAC', source: 'Website' }
                ].map((transaction, index) => (
                  <div
                    key={index}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleViewGift(transaction)}
                  >
                    <div className="grid grid-cols-12 gap-4 text-sm">
                      <div className="col-span-2 font-medium text-blue-600 hover:text-blue-800">{transaction.mid}</div>
                      <div className="col-span-1 text-gray-600">#{transaction.check}</div>
                      <div className="col-span-2 text-gray-900">{transaction.date}</div>
                      <div className="col-span-2 font-semibold text-green-600">{transaction.amount}</div>
                      <div className="col-span-2">
                        <Badge className="bg-gray-100 text-gray-800 border-gray-200 text-xs">
                          {transaction.method}
                        </Badge>
                      </div>
                      <div className="col-span-2 text-gray-600">{transaction.fund}</div>
                      <div className="col-span-1">
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                          {transaction.source}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing 1-5 of 12 transactions
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="secondary" disabled>
                  Previous
                </Button>
                <Button size="sm" variant="secondary">
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Actions Tab */}
        {activeTab === 'actions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BoltIcon className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Action History</h3>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                  9 Actions
                </Badge>
              </div>
              <Button size="sm" variant="secondary">
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Action
              </Button>
            </div>

            {/* Action Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="text-xl font-bold text-blue-800 mb-1">3</div>
                <div className="text-sm text-blue-600">Volunteer</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-xl font-bold text-green-800 mb-1">2</div>
                <div className="text-sm text-green-600">Phone Calls</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                <div className="text-xl font-bold text-purple-800 mb-1">3</div>
                <div className="text-sm text-purple-600">Events</div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                <div className="text-xl font-bold text-orange-800 mb-1">1</div>
                <div className="text-sm text-orange-600">Other</div>
              </div>
            </div>

            {/* Actions List */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-600 uppercase tracking-wide">
                  <div className="col-span-3">Category</div>
                  <div className="col-span-3">Action</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Notes</div>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {[
                  { category: 'Volunteer', action: 'Booth', date: '5/4/23', status: 'Completed', notes: 'Went well', hours: '5' },
                  { category: 'Volunteer', action: 'Booth', date: '3/30/23', status: 'Completed', notes: '', hours: '3' },
                  { category: 'Volunteer', action: 'Booth', date: '3/16/23', status: 'Completed', notes: '', hours: '4' },
                  { category: 'Event', action: 'Event Host', date: '1/30/23', status: 'Completed', notes: '', hours: '' },
                  { category: 'Voter Outreach', action: 'Phone Calls', date: '11/16/20', status: 'Completed', notes: 'Went well', hours: '' },
                  { category: 'Volunteer', action: 'Set-up', date: '7/8/20', status: 'Completed', notes: '', hours: '2' },
                  { category: 'Voter Outreach', action: 'Phone Calls', date: '7/15/20', status: 'Completed', notes: '', hours: '' },
                  { category: 'Volunteer', action: 'Check-in', date: '6/23/20', status: 'Completed', notes: '', hours: '3' }
                ].map((action, index) => (
                  <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="grid grid-cols-12 gap-4 text-sm">
                      <div className="col-span-3">
                        <Badge className={`text-xs ${
                          action.category === 'Volunteer' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          action.category === 'Event' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                          action.category === 'Voter Outreach' ? 'bg-green-100 text-green-800 border-green-200' :
                          'bg-gray-100 text-gray-800 border-gray-200'
                        }`}>
                          {action.category}
                        </Badge>
                      </div>
                      <div className="col-span-3 font-medium text-gray-900">{action.action}</div>
                      <div className="col-span-2 text-gray-600">{action.date}</div>
                      <div className="col-span-2">
                        <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                          {action.status}
                        </Badge>
                      </div>
                      <div className="col-span-2 text-gray-600 text-xs">{action.notes}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing 1-8 of 9 actions
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="secondary" disabled>
                  Previous
                </Button>
                <Button size="sm" variant="secondary" disabled>
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* More Tab */}
        {activeTab === 'more' && (
          <div className="space-y-6">
            {/* Sub-tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'codes', label: 'Codes', icon: FlagIcon },
                  { id: 'moves', label: 'Moves Management', icon: TrendingUpIcon },
                  { id: 'tasks', label: 'Tasks', icon: ClipboardDocumentIcon },
                  { id: 'notes', label: 'Notes', icon: DocumentTextIcon },
                  { id: 'events', label: 'Events', icon: CalendarIcon }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveMoreTab(tab.id as any)}
                    className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeMoreTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Codes Sub-tab */}
            {activeMoreTab === 'codes' && (
              <CodesManager donor={donor} />
            )}

            {/* Moves Management Sub-tab */}
            {activeMoreTab === 'moves' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <TrendingUpIcon className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Moves Management</h3>
                </div>

                {/* Current Move */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-blue-900">Current Move</h4>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">Active</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm"><span className="font-medium">Subject:</span> New Major Donor</div>
                    <div className="text-sm"><span className="font-medium">Stage:</span> 3. Stewardship</div>
                    <div className="text-sm"><span className="font-medium">Proposal Amount:</span> $5,600</div>
                    <div className="text-sm"><span className="font-medium">Manager:</span> Sofia Amaya</div>
                    <div className="text-sm"><span className="font-medium">Due Date:</span> 1/14/2023</div>
                  </div>
                </div>

                {/* Move Progress */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">Move Progress</h4>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { stage: '1. Discovery', count: 1, active: false },
                      { stage: '2. Cultivation', count: 0, active: false },
                      { stage: '3. Stewardship', count: 2, active: true },
                      { stage: '4. Engage', count: 0, active: false },
                      { stage: '5. Complete', count: 0, active: false }
                    ].map((stage, index) => (
                      <div key={index} className={`text-center p-3 rounded-lg border ${
                        stage.active ? 'bg-blue-100 border-blue-300' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className={`text-sm font-medium ${stage.active ? 'text-blue-800' : 'text-gray-600'}`}>
                          {stage.stage}
                        </div>
                        <div className={`text-lg font-bold ${stage.active ? 'text-blue-900' : 'text-gray-700'}`}>
                          {stage.count}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tasks & Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Open Tasks (1)</h4>
                      <Button size="sm" variant="secondary">
                        <PlusIcon className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="p-3 bg-gray-50 rounded border">
                        <div className="text-sm font-medium">Make ask at local event</div>
                        <div className="text-xs text-gray-600">To Do | Ask: $10,000</div>
                        <div className="text-xs text-gray-600">Due Date: 10/31/23</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Notes (0)</h4>
                      <Button size="sm" variant="secondary">
                        <PlusIcon className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-sm text-gray-500 text-center py-4">
                      No notes yet
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tasks Sub-tab */}
            {activeMoreTab === 'tasks' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardDocumentIcon className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Tasks</h3>
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs">
                      10 Total
                    </Badge>
                  </div>
                  <Button size="sm" variant="secondary">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </div>

                {/* Task Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <div className="text-xl font-bold text-yellow-800 mb-1">1</div>
                    <div className="text-sm text-yellow-600">Open</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <div className="text-xl font-bold text-blue-800 mb-1">0</div>
                    <div className="text-sm text-blue-600">In Progress</div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-xl font-bold text-green-800 mb-1">9</div>
                    <div className="text-sm text-green-600">Completed</div>
                  </div>
                </div>

                {/* Tasks List */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                    <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-600 uppercase tracking-wide">
                      <div className="col-span-1">Done</div>
                      <div className="col-span-2">Due</div>
                      <div className="col-span-2">For</div>
                      <div className="col-span-2">By</div>
                      <div className="col-span-2">Type</div>
                      <div className="col-span-2">Priority</div>
                      <div className="col-span-1">Subject</div>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {[
                      { done: false, due: '9/29/26', for: 'Sofia Amaya', by: 'Charles Logan', type: 'Meeting', priority: 'High', subject: 'Test 123' },
                      { done: true, due: '5/28/25', for: 'Brooke Taylor', by: 'Brooke Taylor', type: 'Call', priority: 'Low', subject: 'Call sheet' },
                      { done: true, due: '5/10/25', for: 'Brooke Taylor', by: 'Brooke Taylor', type: 'Call', priority: 'High', subject: 'Follow Up Call' },
                      { done: true, due: '6/8/24', for: 'Brooke Taylor', by: 'Brooke Taylor', type: 'Call', priority: 'Low', subject: 'Follow up' }
                    ].map((task, index) => (
                      <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div className="grid grid-cols-12 gap-4 text-sm">
                          <div className="col-span-1">
                            <input
                              type="checkbox"
                              checked={task.done}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              readOnly
                            />
                          </div>
                          <div className="col-span-2 text-gray-900">{task.due}</div>
                          <div className="col-span-2 text-gray-600">{task.for}</div>
                          <div className="col-span-2 text-gray-600">{task.by}</div>
                          <div className="col-span-2">
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                              {task.type}
                            </Badge>
                          </div>
                          <div className="col-span-2">
                            <Badge className={`text-xs ${
                              task.priority === 'High' ? 'bg-red-100 text-red-800 border-red-200' :
                              task.priority === 'Low' ? 'bg-gray-100 text-gray-800 border-gray-200' :
                              'bg-yellow-100 text-yellow-800 border-yellow-200'
                            }`}>
                              {task.priority}
                            </Badge>
                          </div>
                          <div className="col-span-1 text-gray-900 font-medium">{task.subject}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notes Sub-tab */}
            {activeMoreTab === 'notes' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DocumentTextIcon className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
                    <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                      0 Notes
                    </Badge>
                  </div>
                  <Button size="sm" variant="secondary">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Note
                  </Button>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Notes Yet</h3>
                  <p className="text-gray-600 mb-4">
                    Start documenting interactions and important information about this donor.
                  </p>
                  <Button size="sm">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add First Note
                  </Button>
                </div>
              </div>
            )}

            {/* Events Sub-tab */}
            {activeMoreTab === 'events' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Events</h3>
                    <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 text-xs">
                      3 Events
                    </Badge>
                  </div>
                  <Button size="sm" variant="secondary">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Event
                  </Button>
                </div>

                {/* Look-alike Feature */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-white p-3 rounded-full shadow-sm">
                      <SparklesIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-purple-900 mb-2">Find Look-alikes for Upcoming Events</h4>
                      <p className="text-purple-800 text-sm mb-3">
                        Discover donors with similar profiles who might be interested in events this donor is attending.
                      </p>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        <EyeIcon className="w-4 h-4 mr-2" />
                        Find Similar Donors
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Events List */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                    <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-600 uppercase tracking-wide">
                      <div className="col-span-3">Event Name</div>
                      <div className="col-span-2">Date</div>
                      <div className="col-span-2">Type</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-2">Role</div>
                      <div className="col-span-1">Actions</div>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {[
                      { name: 'Annual Gala 2023', date: '10/15/23', type: 'Fundraiser', status: 'Attended', role: 'Guest' },
                      { name: 'Town Hall Meeting', date: '8/22/23', type: 'Community', status: 'Registered', role: 'Attendee' },
                      { name: 'Volunteer Appreciation', date: '6/10/23', type: 'Recognition', status: 'Attended', role: 'Honoree' }
                    ].map((event, index) => (
                      <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div className="grid grid-cols-12 gap-4 text-sm">
                          <div className="col-span-3 font-medium text-gray-900">{event.name}</div>
                          <div className="col-span-2 text-gray-600">{event.date}</div>
                          <div className="col-span-2">
                            <Badge className={`text-xs ${
                              event.type === 'Fundraiser' ? 'bg-green-100 text-green-800 border-green-200' :
                              event.type === 'Community' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                              'bg-purple-100 text-purple-800 border-purple-200'
                            }`}>
                              {event.type}
                            </Badge>
                          </div>
                          <div className="col-span-2">
                            <Badge className={`text-xs ${
                              event.status === 'Attended' ? 'bg-green-100 text-green-800 border-green-200' :
                              'bg-yellow-100 text-yellow-800 border-yellow-200'
                            }`}>
                              {event.status}
                            </Badge>
                          </div>
                          <div className="col-span-2 text-gray-600">{event.role}</div>
                          <div className="col-span-1">
                            <Button size="sm" variant="secondary">
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing 1-3 of 3 events
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="secondary" disabled>
                      Previous
                    </Button>
                    <Button size="sm" variant="secondary" disabled>
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </Card>

      {/* DialR Modal */}
      {showDialRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Send to DialR</h3>
              <p className="text-sm text-gray-600 mb-4">
                Add {donor.name} to a DialR list for phone outreach.
              </p>
              <div className="space-y-3">
                <Button className="w-full justify-start">
                  <StarIcon className="w-4 h-4 mr-2" />
                  My List
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <UserGroupIcon className="w-4 h-4 mr-2" />
                  Major Donors List
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <PhoneIcon className="w-4 h-4 mr-2" />
                  Follow-up Calls
                </Button>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="secondary" onClick={() => setShowDialRModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={() => setShowDialRModal(false)} className="flex-1">
                  Add to List
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lookalikes Modal */}
      {showLookalikes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Similar Donors Found</h3>
              <p className="text-sm text-gray-600 mt-1">5 donors with similar profiles to {donor.name}</p>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="space-y-3">
                {['Sarah Mitchell', 'David Chen', 'Maria Rodriguez', 'James Wilson', 'Lisa Thompson'].map((name, index) => (
                  <div key={name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{name}</div>
                      <div className="text-sm text-gray-600">
                        {Math.floor(Math.random() * 20) + 80}% similarity • ${Math.floor(Math.random() * 1000) + 500} avg gift
                      </div>
                    </div>
                    <Button size="sm" variant="secondary">View Profile</Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="secondary" onClick={() => setShowLookalikes(false)} className="flex-1">
                  Close
                </Button>
                <Button className="flex-1">
                  Create Segment from Lookalikes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Lookalike Import</h3>

              <div className="space-y-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Import Summary</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <div>Records to add: <span className="font-semibold">{selectedLookalikes.length}</span></div>
                    <div>Total available: <span className="font-semibold">{allLookalikes.length.toLocaleString()}</span></div>
                    <div>Data source: <span className="font-semibold">i360</span></div>
                    {lookalikeFilters.states.length > 0 && (
                      <div>States: <span className="font-semibold">{lookalikeFilters.states.join(', ')}</span></div>
                    )}
                    {lookalikeFilters.capacityLevel.length > 0 && (
                      <div>Capacity: <span className="font-semibold">{lookalikeFilters.capacityLevel.join(', ')}</span></div>
                    )}
                    {lookalikeFilters.engagementBehavior.length > 0 && (
                      <div>Engagement: <span className="font-semibold">{lookalikeFilters.engagementBehavior.join(', ')}</span></div>
                    )}
                    {showAISuggested && (
                      <div>Filter: <span className="font-semibold">AI Suggested (85%+ similarity)</span></div>
                    )}
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">Important Notice</p>
                      <p>Lookalike data is modeled by i360 and may require additional validation. These records represent potential donors with similar characteristics to your existing donor base.</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms-agreement"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 mr-3"
                  />
                  <label htmlFor="terms-agreement" className="text-sm text-gray-700">
                    I confirm these records are modeled donor lookalikes provided by i360 and may require further validation. I agree to the{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                      terms and conditions
                    </a>.
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowConfirmationModal(false);
                    setTermsAccepted(false);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // Handle the import logic here
                    alert(`Successfully added ${selectedLookalikes.length} lookalike donors to your CRM database!`);
                    setShowConfirmationModal(false);
                    setSelectedLookalikes([]);
                    setTermsAccepted(false);
                    setLookalikeExpanded(false);
                  }}
                  disabled={!termsAccepted}
                  className="flex-1"
                >
                  Confirm & Add
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Contact Information Modal */}
      {showAddressBookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[85vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b bg-gray-50">
              <div className="flex items-center gap-3">
                <UserIcon className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                  <p className="text-sm text-gray-600">{donor.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddressBookModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="flex">
              {/* Tab Navigation */}
              <div className="w-48 bg-gray-50 border-r border-gray-200 p-4">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveContactTab('addresses')}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeContactTab === 'addresses'
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <MapPinIcon className="w-4 h-4" />
                    Addresses
                  </button>
                  <button
                    onClick={() => setActiveContactTab('phones')}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeContactTab === 'phones'
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <PhoneIcon className="w-4 h-4" />
                    Phone Numbers
                  </button>
                  <button
                    onClick={() => setActiveContactTab('emails')}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeContactTab === 'emails'
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <EnvelopeIcon className="w-4 h-4" />
                    Email Addresses
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="flex-1 p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
                {/* Addresses Tab */}
                {activeContactTab === 'addresses' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-lg font-medium text-gray-900">Address Information</h4>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                        <PlusIcon className="w-4 h-4" />
                        Add Address
                      </button>
                    </div>

                    {/* Primary Home Address */}
                    <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <HomeIcon className="w-5 h-5 text-blue-600" />
                          <span className="font-semibold text-blue-900">Primary Home</span>
                          <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full font-medium">Primary</span>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 mb-3">
                        <p className="font-medium">987 Neighborhood Ave</p>
                        <p>Springfield, IL 62702</p>
                        <p>United States</p>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Created by Import Module • 2/12/2020 10:09:24</span>
                        <span className="text-green-600 font-medium">✓ Verified</span>
                      </div>
                    </div>

                    {/* Business Address */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <BriefcaseIcon className="w-5 h-5 text-gray-600" />
                          <span className="font-semibold text-gray-900">Business</span>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 mb-3">
                        <p className="font-medium">Springfield Business Center</p>
                        <p>1233 Commerce Drive, Suite 400</p>
                        <p>Springfield, IL 62701</p>
                        <p>United States</p>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Created by Manual Entry • 3/15/2023 14:22:15</span>
                        <span className="text-yellow-600 font-medium">⚠ Needs Verification</span>
                      </div>
                    </div>

                    {/* Seasonal Address */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <SunIcon className="w-5 h-5 text-orange-600" />
                          <span className="font-semibold text-gray-900">Seasonal (Winter)</span>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 mb-3">
                        <p className="font-medium">Sunny Shores Resort Community</p>
                        <p>4625 43rd Place Northwest</p>
                        <p>Washington, DC 20016</p>
                        <p>United States</p>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Created by Import Module • 11/8/2022 09:45:33</span>
                        <span className="text-green-600 font-medium">✓ Verified</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Phone Numbers Tab */}
                {activeContactTab === 'phones' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-lg font-medium text-gray-900">Phone Numbers</h4>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                        <PlusIcon className="w-4 h-4" />
                        Add Phone
                      </button>
                    </div>

                    {/* Primary Phone */}
                    <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <PhoneIcon className="w-5 h-5 text-blue-600" />
                          <span className="font-semibold text-blue-900">Primary Mobile</span>
                          <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full font-medium">Primary</span>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Call">
                            <PhoneIcon className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 mb-3">
                        <p className="font-medium text-lg">(555) 678-9012</p>
                        <p className="text-gray-600">Mobile • Can receive SMS</p>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Last called: Feb 10, 2024 • Outcome: Positive</span>
                        <span className="text-green-600 font-medium">✓ Verified</span>
                      </div>
                    </div>

                    {/* Work Phone */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <BriefcaseIcon className="w-5 h-5 text-gray-600" />
                          <span className="font-semibold text-gray-900">Work</span>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Call">
                            <PhoneIcon className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 mb-3">
                        <p className="font-medium text-lg">(555) 678-9013</p>
                        <p className="text-gray-600">Office • Best time: 9 AM - 5 PM</p>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Last called: Jan 15, 2024 • Outcome: Left voicemail</span>
                        <span className="text-green-600 font-medium">✓ Verified</span>
                      </div>
                    </div>

                    {/* Home Phone */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <HomeIcon className="w-5 h-5 text-gray-600" />
                          <span className="font-semibold text-gray-900">Home</span>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Call">
                            <PhoneIcon className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 mb-3">
                        <p className="font-medium text-lg">(555) 678-9014</p>
                        <p className="text-gray-600">Landline • Best time: Evenings after 6 PM</p>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Last called: Dec 20, 2023 • Outcome: Connected</span>
                        <span className="text-yellow-600 font-medium">⚠ Needs Verification</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Email Addresses Tab */}
                {activeContactTab === 'emails' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-lg font-medium text-gray-900">Email Addresses</h4>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                        <PlusIcon className="w-4 h-4" />
                        Add Email
                      </button>
                    </div>

                    {/* Primary Email */}
                    <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <EnvelopeIcon className="w-5 h-5 text-blue-600" />
                          <span className="font-semibold text-blue-900">Primary Email</span>
                          <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full font-medium">Primary</span>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Send Email">
                            <EnvelopeIcon className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 mb-3">
                        <p className="font-medium text-lg">joseph.banks@email.com</p>
                        <p className="text-gray-600">Personal • High engagement rate (85%)</p>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Last email: Jan 30, 2024 • Opened: Yes • Clicked: Yes</span>
                        <span className="text-green-600 font-medium">✓ Verified</span>
                      </div>
                    </div>

                    {/* Work Email */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <BriefcaseIcon className="w-5 h-5 text-gray-600" />
                          <span className="font-semibold text-gray-900">Work Email</span>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Send Email">
                            <EnvelopeIcon className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 mb-3">
                        <p className="font-medium text-lg">j.banks@springfieldbusiness.com</p>
                        <p className="text-gray-600">Business • Moderate engagement rate (62%)</p>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Last email: Dec 15, 2023 • Opened: Yes • Clicked: No</span>
                        <span className="text-green-600 font-medium">✓ Verified</span>
                      </div>
                    </div>

                    {/* Alternative Email */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <EnvelopeIcon className="w-5 h-5 text-gray-600" />
                          <span className="font-semibold text-gray-900">Alternative</span>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Send Email">
                            <EnvelopeIcon className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 mb-3">
                        <p className="font-medium text-lg">jbanks.community@gmail.com</p>
                        <p className="text-gray-600">Community activities • Low engagement rate (23%)</p>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Last email: Nov 8, 2023 • Opened: No • Clicked: No</span>
                        <span className="text-yellow-600 font-medium">⚠ Needs Verification</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sources Modal */}
      {showSourcesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <DocumentTextIcon className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Research Sources</h3>
                <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs">
                  {aiResearch?.sources?.length || 5} Sources
                </Badge>
              </div>
              <button
                onClick={() => setShowSourcesModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                {(aiResearch?.sources || [
                  'Public Records Database',
                  'Social Media Analysis',
                  'Campaign Finance Data (FEC)',
                  'Property Records',
                  'AI Analysis & Pattern Recognition'
                ]).map((source, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-purple-600">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1">{source}</div>
                      <div className="text-sm text-gray-600">
                        {index === 0 && "Voter registration, address history, and demographic data"}
                        {index === 1 && "LinkedIn, Twitter, and Facebook activity analysis"}
                        {index === 2 && "Federal Election Commission contribution records"}
                        {index === 3 && "Property ownership and assessed values"}
                        {index === 4 && "Machine learning models for donor behavior prediction"}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">Last updated: {new Date().toLocaleDateString()}</span>
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded">Verified</span>
                      </div>
                    </div>
                    <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                      View
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <ShieldCheckIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-blue-900 mb-1">Data Privacy & Compliance</div>
                    <div className="text-sm text-blue-800">
                      All data sources comply with applicable privacy laws and regulations.
                      Information is aggregated from publicly available sources and used solely for legitimate campaign purposes.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowSourcesModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
                Export Sources
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spouse Profile Modal */}
      <DonorProfileModal
        donor={selectedSpouse}
        isOpen={showSpouseProfile}
        onClose={() => setShowSpouseProfile(false)}
      />

      {/* Giving Breakdown Modal */}
      {showGivingBreakdown && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Giving History Breakdown</h3>
              <button
                onClick={() => setShowGivingBreakdown(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-gray-600">First Gift</p>
                  <p className="font-semibold text-gray-900">Jan 2008</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Last Gift</p>
                  <p className="font-semibold text-gray-900">Mar 2024</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Highest Gift</p>
                  <p className="font-semibold text-green-600">$5,000</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Average Gift</p>
                  <p className="font-semibold text-blue-600">$1,267</p>
                </div>
              </div>

              {/* Year by Year Breakdown */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Year-by-Year Totals</h4>
                <div className="space-y-2">
                  {[
                    { year: '2024', amount: 5000, gifts: 1 },
                    { year: '2023', amount: 4200, gifts: 3 },
                    { year: '2022', amount: 3500, gifts: 2 },
                    { year: '2021', amount: 2500, gifts: 2 },
                    { year: '2020', amount: 0, gifts: 0 },
                    { year: '2019', amount: 0, gifts: 0 },
                    { year: '2018', amount: 0, gifts: 0 },
                    { year: '2017', amount: 0, gifts: 0 },
                    { year: '2016', amount: 0, gifts: 0 },
                    { year: '2015', amount: 0, gifts: 0 },
                    { year: '2014', amount: 0, gifts: 0 },
                    { year: '2013', amount: 0, gifts: 0 },
                    { year: '2012', amount: 0, gifts: 0 },
                    { year: '2011', amount: 0, gifts: 0 },
                    { year: '2010', amount: 0, gifts: 0 },
                    { year: '2009', amount: 0, gifts: 0 },
                    { year: '2008', amount: 0, gifts: 0 }
                  ].map((yearData) => (
                    <div key={yearData.year} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <span className="font-medium text-gray-900">{yearData.year}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">{yearData.gifts} gifts</span>
                        <span className="font-semibold text-gray-900">
                          {yearData.amount > 0 ? `$${yearData.amount.toLocaleString()}` : '—'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gift Modal */}
      <GiftModal
        isOpen={showGiftModal}
        onClose={handleCloseGiftModal}
        gift={selectedGift}
        mode={giftModalMode}
      />
    </div>
  );
};
export default DonorProfile;

