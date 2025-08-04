import React, { useState } from 'react';
import { Donor } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import {
  SparklesIcon,
  MailIcon,
  PhoneIcon,
  CalendarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  FireIcon,
  TrendingUpIcon,
  UserGroupIcon,
  ChartBarIcon,
  BoltIcon,
  EyeIcon,
  HeartIcon,
  TrophyIcon,
  ComputerDesktopIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  CurrencyDollarIcon,
  UserIcon,
  MapPinIcon,
  StarIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  LightBulbIcon,
  BrainIcon,
  ChatBubbleLeftRightIcon
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
  const [activeTab, setActiveTab] = useState<'overview' | 'intelligence' | 'actions' | 'insights'>('overview');
  const [showDialRModal, setShowDialRModal] = useState(false);
  const [showLookalikes, setShowLookalikes] = useState(false);
  const enrichedData = getEnrichedData(donor.id);

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

    // Performance-based suggestions
    if (performance.type === 'under') {
      const suggestedAsk = Math.round(donor.averageGift * 1.15);
      suggestions.push({
        icon: <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />,
        title: `Increase ask to ${formatCurrency(suggestedAsk)}`,
        description: 'Based on capacity analysis and giving history',
        action: 'Create upgrade campaign',
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
  const handlePhoneClick = () => {
    window.open(`tel:${donor.phone}`, '_self');
  };

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

  const generateAISnapshot = () => {
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

  return (
    <div className="space-y-6">
      {/* Enhanced Header with New Features */}
      <Card>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Info with Enhanced Badges */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="relative">
              <img src={donor.photoUrl} alt={donor.name} className="w-24 h-24 rounded-full mb-3 ring-4 ring-crimson-blue/20" />
              {donor.urgencyIndicators?.isHotLead && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <FireIcon className="w-3 h-3 text-white" />
                </div>
              )}
              {performance.type === 'over' && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                  <TrendingUpIcon className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold text-text-primary">{donor.name}</h2>
            <button
              onClick={handlePhoneClick}
              className="text-blue-600 hover:text-blue-800 underline-offset-2 hover:underline transition-colors text-sm"
            >
              {donor.phone}
            </button>
            <p className="text-sm text-text-secondary">{donor.email}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {donor.aiBadges.slice(0, 2).map(badge => (
                <Badge key={badge} color="blue" className="text-xs">{badge}</Badge>
              ))}
              <Badge color={performance.type === 'over' ? 'orange' : performance.type === 'under' ? 'blue' : 'green'} className="text-xs">
                {performance.type === 'over' ? 'Over-Performer' : performance.type === 'under' ? 'High Potential' : 'Consistent'}
              </Badge>
              {donor.predictedPotential > 80 && (
                <Badge color="purple" className="text-xs">Expansion Opportunity</Badge>
              )}
            </div>
          </div>

          {/* Enhanced Quick Actions with DialR */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Contact Actions</h3>
            <div className="space-y-2">
              <Button
                onClick={handleQuickCall}
                className="w-full justify-start text-sm py-2"
                variant="primary"
              >
                <PhoneIcon className="w-4 h-4 mr-2" />
                Call Now
              </Button>
              <Button
                onClick={handleDialRClick}
                className="w-full justify-start text-sm py-2"
                variant="secondary"
              >
                <UserGroupIcon className="w-4 h-4 mr-2" />
                Send to DialR
              </Button>
              <Button
                onClick={handleEmailSuggestion}
                className="w-full justify-start text-sm py-2"
                variant="secondary"
              >
                <EnvelopeIcon className="w-4 h-4 mr-2" />
                Suggest Email
              </Button>
              <Button
                onClick={handleScheduleMeeting}
                className="w-full justify-start text-sm py-2"
                variant="secondary"
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                Schedule Meeting
              </Button>
            </div>
          </div>

          {/* AI-Generated Ask Amount */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">AI-Generated Ask</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-700">{formatCurrency(askAmount.amount)}</div>
              <div className="text-xs text-green-600 mt-1" title={askAmount.explanation}>
                {askAmount.explanation}
              </div>
            </div>
          </div>

          {/* Smart Suggestions Preview */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Top Suggestion</h3>
            {smartSuggestions.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  {smartSuggestions[0].icon}
                  <span className="font-medium text-blue-900 text-sm">{smartSuggestions[0].title}</span>
                </div>
                <p className="text-xs text-blue-700">{smartSuggestions[0].description}</p>
              </div>
            )}
          </div>
        </div>
      </Card>
      {/* Enhanced Tabbed Navigation */}
      <Card>
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: SparklesIcon },
              { id: 'intelligence', label: 'Intelligence', icon: ChartBarIcon },
              { id: 'actions', label: 'Actions', icon: BoltIcon },
              { id: 'insights', label: 'Insights', icon: TrendingUpIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
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
              {/* Giving Overview */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Giving Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-text-secondary">Total Raised</p>
                    <p className="text-2xl font-bold text-crimson-blue">${donor.givingOverview?.totalRaised?.toLocaleString() || donor.totalLifetimeGiving.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-text-secondary">Consecutive Gifts</p>
                    <p className="text-2xl font-bold text-green-600">{donor.givingOverview?.consecutiveGifts || donor.giftCount}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-text-secondary">Tier</p>
                    <p className="text-lg font-semibold text-orange-600">{donor.givingOverview?.tier || (donor.totalLifetimeGiving > 1000 ? 'Gold' : 'Silver')}</p>
                  </div>
                </div>

                {/* Performance Status */}
                <div className={`mt-4 p-3 rounded-lg border ${performance.color}`}>
                  <div className="flex items-center gap-2">
                    <TrendingUpIcon className="w-4 h-4" />
                    <span className="font-medium text-sm">{performance.message}</span>
                  </div>
                </div>
              </div>

              {/* Enriched Data Section */}
              {enrichedData && (
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Enriched Data ({enrichedData.dataSource})</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Age:</span>
                        <span className="ml-2 font-medium">{enrichedData.age}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Gender:</span>
                        <span className="ml-2 font-medium">{enrichedData.gender}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Income:</span>
                        <span className="ml-2 font-medium">{enrichedData.householdIncome}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Homeowner:</span>
                        <span className="ml-2 font-medium">{enrichedData.homeowner ? 'Yes' : 'No'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Education:</span>
                        <span className="ml-2 font-medium">{enrichedData.education}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Party:</span>
                        <span className="ml-2 font-medium">{enrichedData.party}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Giving Capacity:</span>
                        <span className="ml-2 font-medium">{enrichedData.givingCapacity}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Political Engagement:</span>
                        <span className="ml-2 font-medium">{enrichedData.politicalEngagement}%</span>
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-gray-500">
                      Data last updated: {enrichedData.lastUpdated}
                    </div>
                  </div>
                </div>
              )}

              {/* Lookalike Finder */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Lookalike Finder</h3>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <UserGroupIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h4 className="font-medium text-gray-900 mb-2">Find Similar Donors</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Use AI to find donors with similar demographics, giving patterns, and engagement behavior.
                  </p>
                  <Button onClick={handleFindLookalikes}>
                    <EyeIcon className="w-4 h-4 mr-2" />
                    Find Lookalikes
                  </Button>
                </div>
              </div>
          </div>
        )}

        {/* Intelligence Tab */}
        {activeTab === 'intelligence' && donor.contactIntelligence && donor.givingIntelligence && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Intelligence */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <PhoneIcon className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-text-primary">Contact Intelligence</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Communication Preferences</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Preferred Method:</span>
                      <span className="font-medium capitalize">{donor.contactIntelligence.preferredContactMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Response Pattern:</span>
                      <span className="font-medium">{donor.contactIntelligence.responsePattern}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Timezone:</span>
                      <span className="font-medium">{donor.contactIntelligence.timezone}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">Best Contact Times</h4>
                  <div className="space-y-1">
                    {donor.contactIntelligence.bestContactTimes.map((time, index) => (
                      <div key={index} className="text-sm text-green-800 bg-green-100 px-2 py-1 rounded">
                        {time}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Last Contact</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{formatLastContact(donor.contactIntelligence.lastContactDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Method:</span>
                      <span className="font-medium capitalize">{donor.contactIntelligence.lastContactMethod}</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-gray-600">Outcome:</span>
                      <p className="text-gray-800 mt-1">{donor.contactIntelligence.lastContactOutcome}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Giving Intelligence */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUpIcon className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-text-primary">Giving Intelligence</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-medium text-purple-900 mb-2">Capacity Analysis</h4>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-700">{donor.givingIntelligence.capacityScore}/100</div>
                      <div className="text-xs text-purple-600">Capacity Score</div>
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-purple-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${donor.givingIntelligence.capacityScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-purple-700 mt-2">{donor.givingIntelligence.peerComparison}</p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-medium text-orange-900 mb-2">Upgrade Opportunity</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-orange-700">Potential Amount:</span>
                      <span className="font-bold text-orange-800">${donor.givingIntelligence.upgradeOpportunity.potential.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-orange-700">Confidence:</span>
                      <span className="font-medium text-orange-800">{donor.givingIntelligence.upgradeOpportunity.confidence}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-orange-700">Timing:</span>
                      <span className="font-medium text-orange-800">{donor.givingIntelligence.upgradeOpportunity.timing}</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-orange-700">Strategy:</span>
                      <p className="text-orange-800 text-sm mt-1">{donor.givingIntelligence.upgradeOpportunity.strategy}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900 mb-2">Patterns & Triggers</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-yellow-700 text-sm font-medium">Seasonal Patterns:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {donor.givingIntelligence.seasonalPatterns.map((pattern, index) => (
                          <span key={index} className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                            {pattern}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-yellow-700 text-sm font-medium">Trigger Events:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {donor.givingIntelligence.triggerEvents.map((trigger, index) => (
                          <span key={index} className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                            {trigger}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions Tab */}
        {activeTab === 'actions' && donor.actionMetrics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Email Engagement */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MailIcon className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-text-primary">Email Engagement</h3>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-700">{donor.actionMetrics.emailEngagement.openRate}%</div>
                    <div className="text-xs text-blue-600">Open Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-700">{donor.actionMetrics.emailEngagement.clickRate}%</div>
                    <div className="text-xs text-blue-600">Click Rate</div>
                  </div>
                </div>
                <div className="text-sm text-blue-700">
                  <span className="font-medium">Last Opened:</span> {donor.actionMetrics.emailEngagement.lastOpened}
                </div>
              </div>
            </div>

            {/* Event History */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-text-primary">Event History</h3>
              </div>
              <div className="space-y-2">
                {donor.actionMetrics.eventHistory.map((event, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${
                    event.attended ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900">{event.name}</div>
                        <div className="text-sm text-gray-600">{event.date}</div>
                        {event.role && (
                          <div className="text-xs text-gray-500 mt-1">{event.role}</div>
                        )}
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        event.attended ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {event.attended ? 'Attended' : 'No Show'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && donor.predictiveInsights && (
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
    </div>
  );
};
export default DonorProfile;

