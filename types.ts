
import { ReactNode } from 'react';

export type View = 'home' | 'profile' | 'compliance' | 'people' | 'fundraising' | 'treasury' | 'data-entry' | 'events' | 'more' | 'settings' | 'system' | 'search-demo' | 'donor-profile-demo';

export interface NavItem {
  id: View;
  label: string;
  icon: ReactNode;
  subItems?: NavItem[];
}

export interface Donor {
  id: string;
  name: string;
  photoUrl: string;
  email: string;
  phone: string;
  address: string;
  contactInfo: {
      home: string;
      work: string;
      email: string;
      website: string;
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
  };

  urgencyIndicators?: {
    isHotLead: boolean;
    followUpDue: boolean;
    daysSinceLastContact: number;
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
    urgencyReason: string;
  };

  givingIntelligence?: {
    capacityScore: number;
    seasonalPatterns: string[];
    triggerEvents: string[];
    peerComparison: string;
    upgradeOpportunity: {
      potential: number;
      confidence: number;
      timing: string;
      strategy: string;
    };
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
}