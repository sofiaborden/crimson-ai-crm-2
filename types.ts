
import { ReactNode } from 'react';

export type View = 'home' | 'profile' | 'compliance' | 'people' | 'fundraising' | 'treasury' | 'data-entry' | 'events' | 'more' | 'settings' | 'system' | 'search-demo' | 'donor-profile-demo' | 'layout-test' | 'layout-test-2' | 'layout-test-3';

export interface NavItem {
  id: View;
  label: string;
  icon: ReactNode;
  subItems?: NavItem[];
}

export interface Donor {
  id: string;
  pid: string; // Profile ID - unique CRM identifier
  name: string;
  photoUrl: string;
  email: string;
  phone: string;
  address: string;
  primaryAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country?: string;
  };
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  activityTimeline?: Array<{
    id: string;
    date: string;
    type: 'gift' | 'contact' | 'event' | 'email' | 'call' | 'meeting' | 'note' | 'campaign';
    title: string;
    description: string;
    amount?: number;
    outcome?: string;
    icon?: string;
    priority?: 'low' | 'medium' | 'high';
  }>;
  contactInfo: {
      home: string;
      work: string;
      email: string;
      website: string;
  };
  employment?: {
    employer: string;
    occupation: string;
    industry?: string;
  };
  spouse?: {
    name: string;
    email?: string;
  };
  aiBadges: string[];
  predictiveAsk: number;
  recurrencePrediction: string;
  suggestedAction: string;
  givingOverview: {
      totalRaised: number;
      consecutiveGifts: number;
      tier: string;
      topGifts: { name: string; value: number }[];
  };
  aiSnapshot: string;

  // Enhanced AI-powered fields
  contactIntelligence?: {
    lastContactDate: string;
    lastContactMethod: 'phone' | 'email' | 'text' | 'in-person' | 'event';
    lastContactOutcome: string;
    preferredContactMethod: 'phone' | 'email' | 'text' | 'in-person';
    bestContactTimes: string[];
    timezone: string;
    responsePattern: string;
    communicationNotes: string;

    // DialR integration fields
    dialrConnected?: boolean;
    callHistory?: Array<{
      date: string;
      outcome: 'soft-pledge' | 'hard-pledge' | 'cultivation' | 'refused' | 'no-answer' | 'callback';
      amount?: number;
      notes: string;
      duration?: number;
    }>;
    callSuccessRate?: number;

    // TargetPath integration fields
    targetPathConnected?: boolean;
    activeCampaigns?: Array<{
      id: string;
      name: string;
      type: 'email' | 'text' | 'call' | 'multi-channel';
      status: 'active' | 'paused' | 'completed';
      currentStep: number;
      totalSteps: number;
      nextAction?: {
        type: string;
        scheduledDate: string;
        description: string;
      };
    }>;

    // Multi-channel engagement metrics
    channelPerformance?: {
      phone: { successRate: number; avgResponseTime: string; };
      email: { openRate: number; clickRate: number; responseRate: number; };
      text: { readRate: number; responseRate: number; };
    };
  };

  urgencyIndicators?: {
    isHotLead: boolean;
    followUpDue: boolean;
    daysSinceLastContact: number;
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
    urgencyReason: string;
  };

  givingIntelligence?: {
    // Enhanced Capacity Analysis
    capacityScore: number; // 0-100 score
    capacityTrend: 'increasing' | 'stable' | 'declining';
    peerComparison: string;
    demographicPercentile: number; // e.g., 90 for "Top 10%"
    givingVsCapacity: number; // percentage above/below modeled capacity

    // Enhanced Upgrade/Recovery Opportunity
    upgradeOpportunity: {
      type: 'upgrade' | 'recovery' | 'monitor'; // upgrade = below capacity, recovery = lapsed, monitor = at/above capacity
      unrealizedPotential?: number; // amount below modeled capacity
      potential: number; // total potential amount
      confidence: number; // 0-100 confidence score
      timing: string;
      timingWindow: 'immediate' | 'next-30-days' | 'next-quarter' | 'next-year';
      status: 'below-capacity' | 'at-capacity' | 'above-capacity' | 'fatigue-risk';
      fatigueRisk?: boolean; // if giving above sustainable levels
    };

    // Enhanced Patterns & Triggers
    seasonalPatterns: Array<{
      pattern: string;
      confidence: number;
      historicalData: boolean; // based on actual donor history vs model
    }>;
    triggerEvents: Array<{
      trigger: string;
      likelihood: number; // model-predicted likelihood of response
      historicalResponse?: boolean; // has this donor actually responded to this trigger before
    }>;

    // Historical Response Data
    historicalTriggers?: string[]; // triggers this donor has actually responded to
  };

  relationshipMapping?: {
    spouse?: string;
    family: string[];
    professionalConnections: string[];
    mutualConnections: string[];
    influenceNetwork: string[];
    employerMatching?: boolean;
  };

  actionMetrics?: {
    emailEngagement: {
      openRate: number;
      clickRate: number;
      lastOpened: string;
    };
    eventHistory: Array<{
      name: string;
      date: string;
      attended: boolean;
      role?: string;
    }>;
    volunteerActivities: string[];
    websiteBehavior: {
      lastVisit: string;
      pagesViewed: number;
      timeSpent: number;
    };
    socialMediaEngagement: {
      platform: string;
      activity: string;
      lastEngagement: string;
    }[];
  };

  // Recurring Readiness Score fields
  recurringReadiness?: {
    probability: number; // 0-1 float
    confidence: number; // 0-1 float
    lastScoredAt: string; // datetime
    recommendedMonthlyAmount?: number; // optional float
    bucket: 'HIGH' | 'MED' | 'LOW'; // derived from probability
  };

  predictiveInsights?: {
    nextBestAction: {
      action: string;
      confidence: number;
      timing: string;
      expectedOutcome: string;
    };
    donationLikelihood: {
      next30Days: number;
      next60Days: number;
      next90Days: number;
    };
    churnRisk: {
      score: number;
      factors: string[];
      preventionStrategy: string;
    };
    upsellOpportunities: Array<{
      type: string;
      amount: number;
      confidence: number;
      timing: string;
    }>;
  };

  // FEC Insights - Compliance-only data (read-only, no solicitation use)
  fecInsights?: {
    // Contribution History Snapshot
    contributionHistory: {
      totalContributions: number;
      firstContributionDate: string;
      lastContributionDate: string;
      activeCycles: string[]; // e.g., ["2020", "2022", "2024"]
      totalAmount: number;
      // Summary totals for compliance tracking
      yearToDate: {
        amount: number;
        contributionCount: number;
        year: number;
      };
      cycleToDate: {
        amount: number;
        contributionCount: number;
        cycle: string; // e.g., "2024 Election Cycle"
        cycleStartDate: string;
      };
    };

    // Committees Supported (names only, no addresses/contact info)
    committeesSupported: Array<{
      committeeName: string;
      committeeType: 'candidate' | 'pac' | 'party' | 'super-pac';
      totalAmount: number;
      contributionCount: number;
      lastContribution: string;
      // Individual transactions for detailed view
      transactions: Array<{
        date: string;
        amount: number;
        reportPeriod: string; // e.g., "Q4 2023", "Pre-Primary 2024"
        filingDate: string;
        transactionId: string; // FEC transaction ID for reference
      }>;
    }>;

    // Giving Categories Breakdown
    givingCategories: {
      federalCandidates: number;
      pacs: number;
      partyCommittees: number;
      superPacs: number;
    };

    // Exclusivity Indicator
    exclusivityMetrics: {
      partyExclusivity: 'exclusive-democrat' | 'exclusive-republican' | 'bipartisan';
      exclusivityPercentage: number; // % of giving to one party
      crossoverContributions: number;
    };

    // Recent Activity Summary (top 5 most recent transactions)
    recentActivity: Array<{
      date: string;
      amount: number;
      committeeName: string;
      committeeType: 'candidate' | 'pac' | 'party' | 'super-pac';
      reportPeriod: string;
    }>;

    // Aggregate Benchmarks (safe for display)
    benchmarks: {
      nationalPercentile: number; // e.g., 95 for "Top 5%"
      categoryRanking: string; // e.g., "Top 10% of donors nationally"
      cycleComparison: string; // e.g., "Above average for this election cycle"
    };

    // Compliance metadata
    dataSource: 'FEC Public Records';
    lastUpdated: string;
    disclaimer: string;
  };
}