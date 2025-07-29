import { Donor } from '../types';

export const mockDonorProfiles: Record<string, Donor> = {
  'sarah-j': {
    id: 'sarah-j',
    name: 'Sarah Johnson',
    photoUrl: 'https://i.pravatar.cc/150?u=sarah-johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    address: '123 Oak Street, Springfield, IL 62701',
    contactInfo: {
      home: '(555) 123-4567',
      work: '(555) 123-4568',
      email: 'sarah.johnson@email.com',
      website: 'linkedin.com/in/sarahjohnson'
    },
    aiBadges: ['Major Donor', 'Consistent Giver', 'High Engagement'],
    predictiveAsk: 350,
    recurrencePrediction: 'Very Likely (85%)',
    suggestedAction: 'Personal thank you call within 48 hours',
    givingOverview: {
      totalRaised: 2850,
      consecutiveGifts: 6,
      tier: 'Gold Supporter',
      topGifts: [
        { name: 'Q1 2024', value: 250 },
        { name: 'Q4 2023', value: 300 },
        { name: 'Q3 2023', value: 200 },
        { name: 'Q2 2023', value: 150 },
        { name: 'Q1 2023', value: 175 }
      ]
    },
    aiSnapshot: 'Sarah is a dedicated supporter who has shown consistent growth in her giving pattern. She responds well to email communications and has a strong interest in education policy. Her giving frequency suggests she prefers quarterly contributions. Recent engagement data shows high email open rates and website visits during campaign updates.'
  },
  
  'michael-r': {
    id: 'michael-r',
    name: 'Michael Rodriguez',
    photoUrl: 'https://i.pravatar.cc/150?u=michael-rodriguez',
    email: 'michael.rodriguez@email.com',
    phone: '(555) 234-5678',
    address: '456 Pine Avenue, Chicago, IL 60601',
    contactInfo: {
      home: '(555) 234-5678',
      work: '(555) 234-5679',
      email: 'michael.rodriguez@email.com',
      website: 'twitter.com/mrodriguez'
    },
    aiBadges: ['Phone Responder', 'Event Attendee', 'Volunteer'],
    predictiveAsk: 125,
    recurrencePrediction: 'Likely (72%)',
    suggestedAction: 'Invite to upcoming town hall event',
    givingOverview: {
      totalRaised: 850,
      consecutiveGifts: 4,
      tier: 'Silver Supporter',
      topGifts: [
        { name: 'Dec 2023', value: 100 },
        { name: 'Oct 2023', value: 75 },
        { name: 'Aug 2023', value: 125 },
        { name: 'Jun 2023', value: 50 },
        { name: 'Apr 2023', value: 100 }
      ]
    },
    aiSnapshot: 'Michael is an engaged community member who prefers phone contact over email. He has attended 3 campaign events and volunteers occasionally. His giving pattern shows responsiveness to direct asks during events. He works in healthcare and is particularly interested in healthcare policy initiatives.'
  },

  'jennifer-l': {
    id: 'jennifer-l',
    name: 'Jennifer Liu',
    photoUrl: 'https://i.pravatar.cc/150?u=jennifer-liu',
    email: 'jennifer.liu@email.com',
    phone: '(555) 345-6789',
    address: '789 Maple Drive, Austin, TX 78701',
    contactInfo: {
      home: '(555) 345-6789',
      work: '(555) 345-6790',
      email: 'jennifer.liu@email.com',
      website: 'linkedin.com/in/jenniferliu'
    },
    aiBadges: ['Major Donor', 'Tech Professional', 'Monthly Giver'],
    predictiveAsk: 750,
    recurrencePrediction: 'Very Likely (91%)',
    suggestedAction: 'Upgrade to monthly sustaining donor program',
    givingOverview: {
      totalRaised: 4200,
      consecutiveGifts: 8,
      tier: 'Platinum Supporter',
      topGifts: [
        { name: 'Jan 2024', value: 500 },
        { name: 'Nov 2023', value: 600 },
        { name: 'Sep 2023', value: 400 },
        { name: 'Jul 2023', value: 350 },
        { name: 'May 2023', value: 500 }
      ]
    },
    aiSnapshot: 'Jennifer is a high-capacity donor working in tech with strong progressive values. She prefers digital communication and has set up automatic monthly donations. Her giving shows significant capacity for major gift solicitation. She is particularly passionate about climate change and technology policy.'
  },

  'david-k': {
    id: 'david-k',
    name: 'David Kim',
    photoUrl: 'https://i.pravatar.cc/150?u=david-kim',
    email: 'david.kim@email.com',
    phone: '(555) 456-7890',
    address: '321 Cedar Lane, Seattle, WA 98101',
    contactInfo: {
      home: '(555) 456-7890',
      work: '(555) 456-7891',
      email: 'david.kim@email.com',
      website: 'facebook.com/davidkim'
    },
    aiBadges: ['New Donor', 'Social Media Engaged', 'Young Professional'],
    predictiveAsk: 100,
    recurrencePrediction: 'Moderate (58%)',
    suggestedAction: 'Send welcome series and policy updates',
    givingOverview: {
      totalRaised: 225,
      consecutiveGifts: 2,
      tier: 'Bronze Supporter',
      topGifts: [
        { name: 'Feb 2024', value: 75 },
        { name: 'Jan 2024', value: 50 },
        { name: 'Dec 2023', value: 100 }
      ]
    },
    aiSnapshot: 'David is a new supporter who discovered the campaign through social media. He is a young professional in his late 20s with growing political engagement. His initial gifts show promise for cultivation into a regular donor. He is active on social platforms and shares campaign content frequently.'
  },

  'lisa-m': {
    id: 'lisa-m',
    name: 'Lisa Martinez',
    photoUrl: 'https://i.pravatar.cc/150?u=lisa-martinez',
    email: 'lisa.martinez@email.com',
    phone: '(555) 567-8901',
    address: '654 Birch Street, Denver, CO 80201',
    contactInfo: {
      home: '(555) 567-8901',
      work: '(555) 567-8902',
      email: 'lisa.martinez@email.com',
      website: 'instagram.com/lisamartinez'
    },
    aiBadges: ['Lapsed Donor', 'High Capacity', 'Reactivation Target'],
    predictiveAsk: 1200,
    recurrencePrediction: 'Uncertain (45%)',
    suggestedAction: 'Personal outreach with campaign update',
    givingOverview: {
      totalRaised: 3500,
      consecutiveGifts: 0,
      tier: 'Former Major Donor',
      topGifts: [
        { name: 'Mar 2023', value: 1000 },
        { name: 'Jan 2023', value: 500 },
        { name: 'Nov 2022', value: 750 },
        { name: 'Sep 2022', value: 600 },
        { name: 'Jul 2022', value: 650 }
      ]
    },
    aiSnapshot: 'Lisa was a major donor who has not contributed in over 10 months. She has high capacity and previous strong engagement. Her lapse may be due to communication preferences or policy concerns. Reactivation efforts should focus on personal touch and addressing any potential concerns about campaign direction.'
  },

  'joseph-banks': {
    id: 'joseph-banks',
    name: 'Joseph M. Banks',
    photoUrl: 'https://i.pravatar.cc/150?u=joseph-banks',
    email: 'joseph.banks@email.com',
    phone: '(555) 678-9012',
    address: '987 Neighborhood Ave, Springfield, IL 62702',
    contactInfo: {
      home: '(555) 678-9012',
      work: '(555) 678-9013',
      email: 'joseph.banks@email.com',
      website: 'linkedin.com/in/josephbanks'
    },
    aiBadges: ['Major Donor', 'Neighborhood MVP', 'Community Leader'],
    predictiveAsk: 5000,
    recurrencePrediction: 'Very Likely (92%)',
    suggestedAction: 'Schedule major gift meeting within 2 weeks',
    givingOverview: {
      totalRaised: 15200,
      consecutiveGifts: 12,
      tier: 'Diamond Supporter',
      topGifts: [
        { name: 'Q1 2024', value: 5000 },
        { name: 'Q4 2023', value: 2500 },
        { name: 'Q3 2023', value: 3000 },
        { name: 'Q2 2023', value: 2200 },
        { name: 'Q1 2023', value: 2500 }
      ]
    },
    aiSnapshot: 'Joseph is a cornerstone supporter and community leader in the Neighborhood MVPs segment. He has consistently increased his giving over the past 3 years and serves as an informal campaign ambassador in his community. His recent $5,000 gift demonstrates strong commitment. He prefers in-person meetings and responds well to policy briefings. Excellent candidate for campaign advisory role.',

    // Enhanced AI-powered fields
    contactIntelligence: {
      lastContactDate: '2024-01-15',
      lastContactMethod: 'phone',
      lastContactOutcome: 'Scheduled major gift meeting for next week',
      preferredContactMethod: 'phone',
      bestContactTimes: ['10:00 AM - 12:00 PM', '2:00 PM - 4:00 PM'],
      timezone: 'America/Chicago',
      responsePattern: 'Responds within 2 hours during business days',
      communicationNotes: 'Prefers detailed policy briefings. Appreciates personal touch.'
    },

    urgencyIndicators: {
      isHotLead: true,
      followUpDue: true,
      daysSinceLastContact: 3,
      urgencyLevel: 'high',
      urgencyReason: 'Major gift meeting scheduled - follow up on $10K ask'
    },

    givingIntelligence: {
      capacityScore: 95,
      seasonalPatterns: ['Q4 giving surge', 'Election year increases'],
      triggerEvents: ['Policy announcements', 'Community events', 'Personal milestones'],
      peerComparison: 'Gives 40% more than similar demographic',
      upgradeOpportunity: {
        potential: 10000,
        confidence: 88,
        timing: 'Next 30 days',
        strategy: 'Major gift proposal with community impact focus'
      }
    },

    relationshipMapping: {
      spouse: 'Margaret Banks',
      family: ['Joseph Banks Jr.', 'Sarah Banks-Wilson'],
      professionalConnections: ['Springfield Chamber of Commerce', 'Local Business Alliance'],
      mutualConnections: ['Patricia Williams', 'Robert Davis', 'City Council Member Johnson'],
      influenceNetwork: ['Neighborhood Association President', 'Community Foundation Board'],
      employerMatching: true
    },

    actionMetrics: {
      emailEngagement: {
        openRate: 85,
        clickRate: 45,
        lastOpened: '2024-01-14'
      },
      eventHistory: [
        { name: 'Town Hall Meeting', date: '2024-01-10', attended: true, role: 'VIP Guest' },
        { name: 'Policy Briefing', date: '2023-12-15', attended: true, role: 'Attendee' },
        { name: 'Community Fundraiser', date: '2023-11-20', attended: true, role: 'Host Committee' }
      ],
      volunteerActivities: ['Phone bank volunteer', 'Event host', 'Community outreach'],
      websiteBehavior: {
        lastVisit: '2024-01-14',
        pagesViewed: 12,
        timeSpent: 18
      },
      socialMediaEngagement: [
        { platform: 'Facebook', activity: 'Shared campaign post', lastEngagement: '2024-01-13' },
        { platform: 'LinkedIn', activity: 'Liked policy update', lastEngagement: '2024-01-12' }
      ]
    },

    predictiveInsights: {
      nextBestAction: {
        action: 'Schedule in-person major gift meeting',
        confidence: 92,
        timing: 'Within 7 days',
        expectedOutcome: '$10,000 commitment with monthly sustaining option'
      },
      donationLikelihood: {
        next30Days: 92,
        next60Days: 78,
        next90Days: 65
      },
      churnRisk: {
        score: 15,
        factors: ['Highly engaged', 'Consistent giver', 'Community leader'],
        preventionStrategy: 'Continue personal engagement and policy updates'
      },
      upsellOpportunities: [
        { type: 'Major Gift', amount: 10000, confidence: 88, timing: 'Next 30 days' },
        { type: 'Monthly Sustaining', amount: 500, confidence: 75, timing: 'Next 60 days' },
        { type: 'Legacy Giving', amount: 50000, confidence: 45, timing: 'Next 12 months' }
      ]
    }
  }
};

// Helper function to get donor profile by name
export const getDonorProfileByName = (name: string): Donor | null => {
  // Create a mapping of display names to profile keys
  const nameMapping: Record<string, string> = {
    'Sarah J.': 'sarah-j',
    'Sarah Johnson': 'sarah-j',
    'Michael R.': 'michael-r',
    'Michael Rodriguez': 'michael-r',
    'Jennifer L.': 'jennifer-l',
    'Jennifer Liu': 'jennifer-l',
    'David K.': 'david-k',
    'David Kim': 'david-k',
    'Lisa M.': 'lisa-m',
    'Lisa Martinez': 'lisa-m',
    'Joseph M. Banks': 'joseph-banks',
    'Joseph Banks': 'joseph-banks'
  };

  const profileKey = nameMapping[name];
  return profileKey ? mockDonorProfiles[profileKey] : null;
};
