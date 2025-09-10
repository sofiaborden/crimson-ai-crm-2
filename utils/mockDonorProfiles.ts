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
    aiSnapshot: 'Sarah is a dedicated supporter who has shown consistent growth in her giving pattern. She responds well to email communications and has a strong interest in education policy. Her giving frequency suggests she prefers quarterly contributions. Recent engagement data shows high email open rates and website visits during campaign updates.',

    // Recurring Readiness Score
    recurringReadiness: {
      probability: 0.72, // 72%
      confidence: 0.89, // 89%
      lastScoredAt: '2024-08-19T08:30:00Z',
      recommendedMonthlyAmount: 45,
      bucket: 'HIGH'
    },

    // Enhanced AI-powered fields
    contactIntelligence: {
      lastContactDate: '19 months ago',
      lastContactMethod: 'phone',
      lastContactOutcome: 'Scheduled major gift meeting for next week',
      preferredContactMethod: 'phone',
      bestContactTimes: ['10:00 AM - 12:00 PM', '2:00 PM - 4:00 PM'],
      timezone: 'America/Chicago',
      responsePattern: 'Responds within 2 hours during business days',
      communicationNotes: 'Prefers direct communication, appreciates policy updates',

      // DialR integration
      dialrConnected: true,
      callHistory: [
        {
          date: '2024-08-17',
          outcome: 'soft-pledge',
          amount: 1000,
          notes: 'Interested in major gift opportunity, wants more details',
          duration: 12
        },
        {
          date: '2024-08-10',
          outcome: 'cultivation',
          notes: 'Discussed policy priorities, very engaged',
          duration: 8
        }
      ],
      callSuccessRate: 85,

      // TargetPath integration
      targetPathConnected: true,
      activeCampaigns: [
        {
          id: 'mg-followup-001',
          name: 'Major Gift Follow-up',
          type: 'multi-channel',
          status: 'active',
          currentStep: 2,
          totalSteps: 7,
          nextAction: {
            type: 'personal-call',
            scheduledDate: '2024-08-19T14:00:00Z',
            description: 'Follow up on $1,000 soft pledge commitment'
          }
        }
      ],

      // Multi-channel performance
      channelPerformance: {
        phone: { successRate: 85, avgResponseTime: '2 hours' },
        email: { openRate: 72, clickRate: 15, responseRate: 45 },
        text: { readRate: 95, responseRate: 60 }
      }
    },

    givingIntelligence: {
      // Enhanced Capacity Analysis
      capacityScore: 95,
      capacityTrend: 'stable',
      peerComparison: 'Gives 40% more than similar demographic',
      demographicPercentile: 90, // Top 10%
      givingVsCapacity: 40, // 40% above modeled capacity

      // Enhanced Upgrade Opportunity
      upgradeOpportunity: {
        type: 'monitor', // above capacity
        potential: 10000,
        confidence: 88,
        timing: 'Next 30 days',
        timingWindow: 'next-30-days',
        status: 'above-capacity',
        fatigueRisk: false
      },

      // Enhanced Patterns & Triggers
      seasonalPatterns: [
        { pattern: 'Q4 giving surge', confidence: 92, historicalData: true },
        { pattern: 'Election year increases', confidence: 85, historicalData: true }
      ],
      triggerEvents: [
        { trigger: 'Policy announcements', likelihood: 88, historicalResponse: true },
        { trigger: 'Community events', likelihood: 75, historicalResponse: true },
        { trigger: 'Personal milestones', likelihood: 65, historicalResponse: false }
      ],

      // Historical Response Data
      historicalTriggers: ['Policy announcements', 'Community events', 'Major campaign milestones']
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
    aiSnapshot: 'Michael is an engaged community member who prefers phone contact over email. He has attended 3 campaign events and volunteers occasionally. His giving pattern shows responsiveness to direct asks during events. He works in healthcare and is particularly interested in healthcare policy initiatives.',

    // Enhanced AI-powered fields
    contactIntelligence: {
      lastContactDate: '6 weeks ago',
      lastContactMethod: 'phone',
      lastContactOutcome: 'Confirmed attendance at upcoming event',
      preferredContactMethod: 'phone',
      bestContactTimes: ['6:00 PM - 8:00 PM', 'Saturday mornings'],
      timezone: 'America/Chicago',
      responsePattern: 'Usually responds within 24 hours, prefers evening calls',
      communicationNotes: 'Healthcare professional, interested in policy discussions'
    },

    givingIntelligence: {
      // Enhanced Capacity Analysis
      capacityScore: 72,
      capacityTrend: 'increasing',
      peerComparison: 'Gives consistently with peer group',
      demographicPercentile: 50, // Average
      givingVsCapacity: -25, // 25% below modeled capacity

      // Enhanced Upgrade Opportunity
      upgradeOpportunity: {
        type: 'upgrade', // below capacity
        unrealizedPotential: 300, // $300 below modeled capacity
        potential: 250,
        confidence: 75,
        timing: 'Next 60 days',
        timingWindow: 'next-quarter',
        status: 'below-capacity',
        fatigueRisk: false
      },

      // Enhanced Patterns & Triggers
      seasonalPatterns: [
        { pattern: 'Event-driven giving', confidence: 78, historicalData: true },
        { pattern: 'End-of-year increases', confidence: 65, historicalData: false }
      ],
      triggerEvents: [
        { trigger: 'Healthcare policy updates', likelihood: 82, historicalResponse: true },
        { trigger: 'Community events', likelihood: 70, historicalResponse: true },
        { trigger: 'Direct personal asks', likelihood: 85, historicalResponse: false }
      ],

      // Historical Response Data
      historicalTriggers: ['Healthcare policy updates', 'Community events']
    },

    actionMetrics: {
      emailEngagement: {
        openRate: 65,
        clickRate: 32,
        lastOpened: '2024-01-10'
      },
      eventHistory: [
        { name: 'Healthcare Policy Forum', date: '2023-12-08', attended: true, role: 'Attendee' },
        { name: 'Community Town Hall', date: '2023-10-15', attended: true, role: 'Volunteer' },
        { name: 'Fundraising Dinner', date: '2023-08-20', attended: true, role: 'Guest' }
      ],
      volunteerActivities: ['Event setup', 'Phone banking', 'Community canvassing'],
      websiteBehavior: {
        lastVisit: '2024-01-10',
        pagesViewed: 8,
        timeSpent: 12
      },
      socialMediaEngagement: [
        { platform: 'Twitter', activity: 'Retweeted policy update', lastEngagement: '2024-01-09' },
        { platform: 'Facebook', activity: 'Commented on event post', lastEngagement: '2024-01-07' }
      ]
    },

    predictiveInsights: {
      nextBestAction: {
        action: 'Invite to healthcare policy roundtable',
        confidence: 85,
        timing: 'Next 2 weeks',
        expectedOutcome: 'Event attendance and potential $150 contribution'
      },
      donationLikelihood: {
        next30Days: 68,
        next60Days: 82,
        next90Days: 75
      },
      churnRisk: {
        score: 25,
        factors: ['Event-dependent engagement', 'Moderate email response'],
        preventionStrategy: 'Maintain event invitations and personal phone contact'
      },
      upsellOpportunities: [
        { type: 'Event Sponsorship', amount: 250, confidence: 75, timing: 'Next 60 days' },
        { type: 'Monthly Giving', amount: 50, confidence: 60, timing: 'Next 90 days' }
      ]
    }
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
    aiSnapshot: 'Jennifer is a high-capacity donor working in tech with strong progressive values. She prefers digital communication and has set up automatic monthly donations. Her giving shows significant capacity for major gift solicitation. She is particularly passionate about climate change and technology policy.',

    // Enhanced AI-powered fields
    contactIntelligence: {
      lastContactDate: '3 weeks ago',
      lastContactMethod: 'email',
      lastContactOutcome: 'Expressed interest in major gift opportunity',
      preferredContactMethod: 'email',
      bestContactTimes: ['9:00 AM - 11:00 AM', '1:00 PM - 3:00 PM'],
      timezone: 'America/Chicago',
      responsePattern: 'Responds quickly to emails, prefers detailed information',
      communicationNotes: 'Tech professional, appreciates data-driven communications'
    },

    givingIntelligence: {
      capacityScore: 91,
      seasonalPatterns: ['Consistent monthly giving', 'Year-end bonuses'],
      triggerEvents: ['Tech policy updates', 'Climate initiatives', 'Major announcements'],
      peerComparison: 'Top 10% of tech professional donors',
      upgradeOpportunity: {
        potential: 2500,
        confidence: 85,
        timing: 'Next 45 days',
        strategy: 'Major gift proposal focused on technology and climate policy'
      }
    },

    actionMetrics: {
      emailEngagement: {
        openRate: 92,
        clickRate: 68,
        lastOpened: '2024-01-15'
      },
      eventHistory: [
        { name: 'Tech Policy Summit', date: '2024-01-05', attended: true, role: 'Speaker' },
        { name: 'Climate Action Forum', date: '2023-12-10', attended: true, role: 'Panelist' },
        { name: 'Digital Rights Conference', date: '2023-11-15', attended: true, role: 'Attendee' }
      ],
      volunteerActivities: ['Tech advisory board', 'Digital strategy consulting', 'Policy research'],
      websiteBehavior: {
        lastVisit: '2024-01-15',
        pagesViewed: 15,
        timeSpent: 25
      },
      socialMediaEngagement: [
        { platform: 'LinkedIn', activity: 'Shared policy article', lastEngagement: '2024-01-14' },
        { platform: 'Twitter', activity: 'Engaged with climate post', lastEngagement: '2024-01-13' }
      ]
    },

    predictiveInsights: {
      nextBestAction: {
        action: 'Present major gift opportunity for tech initiative',
        confidence: 88,
        timing: 'Next 3 weeks',
        expectedOutcome: '$2,500 commitment for technology policy program'
      },
      donationLikelihood: {
        next30Days: 95,
        next60Days: 88,
        next90Days: 82
      },
      churnRisk: {
        score: 8,
        factors: ['Highly engaged', 'Monthly donor', 'Leadership role'],
        preventionStrategy: 'Continue leadership engagement and policy updates'
      },
      upsellOpportunities: [
        { type: 'Major Gift', amount: 2500, confidence: 85, timing: 'Next 45 days' },
        { type: 'Monthly Increase', amount: 100, confidence: 78, timing: 'Next 30 days' },
        { type: 'Legacy Giving', amount: 25000, confidence: 55, timing: 'Next 6 months' }
      ]
    }
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
    aiSnapshot: 'David is a new supporter who discovered the campaign through social media. He is a young professional in his late 20s with growing political engagement. His initial gifts show promise for cultivation into a regular donor. He is active on social platforms and shares campaign content frequently.',

    // Enhanced AI-powered fields
    contactIntelligence: {
      lastContactDate: '2 weeks ago',
      lastContactMethod: 'email',
      lastContactOutcome: 'Opened welcome series, clicked policy links',
      preferredContactMethod: 'email',
      bestContactTimes: ['7:00 PM - 9:00 PM', 'Weekend afternoons'],
      timezone: 'America/Los_Angeles',
      responsePattern: 'Responds to emails within 48 hours, active on social media',
      communicationNotes: 'Young professional, prefers digital engagement and social sharing'
    },

    givingIntelligence: {
      capacityScore: 58,
      seasonalPatterns: ['Social media driven', 'Event-responsive'],
      triggerEvents: ['Social media campaigns', 'Peer sharing', 'Major news events'],
      peerComparison: 'Average for young professional demographic',
      upgradeOpportunity: {
        potential: 150,
        confidence: 65,
        timing: 'Next 90 days',
        strategy: 'Peer-to-peer campaign and social media engagement'
      }
    },

    actionMetrics: {
      emailEngagement: {
        openRate: 78,
        clickRate: 55,
        lastOpened: '2024-01-12'
      },
      eventHistory: [
        { name: 'Young Professionals Mixer', date: '2024-01-08', attended: true, role: 'Attendee' },
        { name: 'Virtual Policy Briefing', date: '2023-12-20', attended: true, role: 'Participant' }
      ],
      volunteerActivities: ['Social media sharing', 'Peer outreach'],
      websiteBehavior: {
        lastVisit: '2024-01-12',
        pagesViewed: 6,
        timeSpent: 8
      },
      socialMediaEngagement: [
        { platform: 'Facebook', activity: 'Shared campaign video', lastEngagement: '2024-01-11' },
        { platform: 'Instagram', activity: 'Story share', lastEngagement: '2024-01-10' },
        { platform: 'Twitter', activity: 'Retweeted policy post', lastEngagement: '2024-01-09' }
      ]
    },

    predictiveInsights: {
      nextBestAction: {
        action: 'Invite to young professionals event',
        confidence: 72,
        timing: 'Next 4 weeks',
        expectedOutcome: 'Event attendance and potential $100 contribution'
      },
      donationLikelihood: {
        next30Days: 45,
        next60Days: 62,
        next90Days: 58
      },
      churnRisk: {
        score: 35,
        factors: ['New donor', 'Social media dependent', 'Young demographic'],
        preventionStrategy: 'Maintain social media engagement and peer connections'
      },
      upsellOpportunities: [
        { type: 'Peer Campaign', amount: 150, confidence: 65, timing: 'Next 90 days' },
        { type: 'Monthly Giving', amount: 25, confidence: 45, timing: 'Next 6 months' }
      ]
    }
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
    aiSnapshot: 'Lisa was a major donor who has not contributed in over 10 months. She has high capacity and previous strong engagement. Her lapse may be due to communication preferences or policy concerns. Reactivation efforts should focus on personal touch and addressing any potential concerns about campaign direction.',

    // Enhanced AI-powered fields
    contactIntelligence: {
      lastContactDate: '8 months ago',
      lastContactMethod: 'email',
      lastContactOutcome: 'No response to last three outreach attempts',
      preferredContactMethod: 'phone',
      bestContactTimes: ['10:00 AM - 12:00 PM', '2:00 PM - 4:00 PM'],
      timezone: 'America/Denver',
      responsePattern: 'Previously responsive, now unresponsive to digital outreach',
      communicationNotes: 'Former major donor, may need personal phone call to re-engage'
    },

    givingIntelligence: {
      capacityScore: 85,
      seasonalPatterns: ['Previously gave quarterly', 'Year-end major gifts'],
      triggerEvents: ['Personal outreach', 'Major campaign milestones', 'Policy victories'],
      peerComparison: 'Was in top 5% of donors in her demographic',
      upgradeOpportunity: {
        potential: 1500,
        confidence: 45,
        timing: 'Requires reactivation first',
        strategy: 'Personal outreach to address concerns and rebuild relationship'
      }
    },

    actionMetrics: {
      emailEngagement: {
        openRate: 15,
        clickRate: 5,
        lastOpened: '2023-08-15'
      },
      eventHistory: [
        { name: 'Major Donor Reception', date: '2023-03-15', attended: true, role: 'VIP Guest' },
        { name: 'Policy Briefing', date: '2023-01-20', attended: true, role: 'Attendee' },
        { name: 'Fundraising Gala', date: '2022-11-10', attended: true, role: 'Table Host' }
      ],
      volunteerActivities: ['Former event host', 'Previous major donor committee'],
      websiteBehavior: {
        lastVisit: '2023-08-15',
        pagesViewed: 2,
        timeSpent: 3
      },
      socialMediaEngagement: [
        { platform: 'Instagram', activity: 'Last engagement', lastEngagement: '2023-07-20' }
      ]
    },

    predictiveInsights: {
      nextBestAction: {
        action: 'Personal phone call from campaign leadership',
        confidence: 67,
        timing: 'Within 2 weeks',
        expectedOutcome: 'Reestablish communication and understand concerns'
      },
      donationLikelihood: {
        next30Days: 25,
        next60Days: 45,
        next90Days: 55
      },
      churnRisk: {
        score: 75,
        factors: ['No recent gifts', 'Low email engagement', 'Unresponsive to outreach'],
        preventionStrategy: 'Personal outreach, address concerns, rebuild relationship'
      },
      upsellOpportunities: [
        { type: 'Reactivation Gift', amount: 500, confidence: 45, timing: 'After reengagement' },
        { type: 'Major Gift', amount: 1500, confidence: 30, timing: 'Long-term relationship rebuild' }
      ]
    }
  },

  'joseph-banks': {
    id: 'joseph-banks',
    pid: 'PID-2024-001847',
    name: 'Joseph M. Banks',
    photoUrl: 'https://i.pravatar.cc/150?u=joseph-banks',
    email: 'joseph.banks@email.com',
    phone: '(555) 678-9012',
    address: '987 Neighborhood Ave, Springfield, IL 62702',
    primaryAddress: {
      street: '987 Neighborhood Ave',
      city: 'Springfield',
      state: 'IL',
      zip: '62702',
      country: 'USA'
    },
    socialMedia: {
      linkedin: 'https://linkedin.com/in/josephbanks',
      twitter: 'https://twitter.com/jbanks_biz',
      facebook: 'https://facebook.com/joseph.banks.business'
    },
    activityTimeline: [
      {
        id: 'act-001',
        date: '2024-02-15',
        type: 'gift',
        title: 'Major Gift Received',
        description: 'Contributed $1,000 to Q1 2024 campaign',
        amount: 1000,
        icon: 'gift',
        priority: 'high'
      },
      {
        id: 'act-002',
        date: '2024-02-10',
        type: 'call',
        title: 'Follow-up Call',
        description: 'Discussed upcoming policy initiatives and campaign priorities',
        outcome: 'Positive - expressed interest in increased support',
        icon: 'phone',
        priority: 'medium'
      },
      {
        id: 'act-003',
        date: '2024-01-30',
        type: 'email',
        title: 'Policy Update Sent',
        description: 'Sent quarterly policy briefing and impact report',
        outcome: 'Opened and clicked through to full report',
        icon: 'email',
        priority: 'low'
      },
      {
        id: 'act-004',
        date: '2024-01-15',
        type: 'event',
        title: 'Business Leaders Breakfast',
        description: 'Attended Springfield Chamber breakfast event',
        outcome: 'Networked with other major donors, positive feedback',
        icon: 'calendar',
        priority: 'medium'
      },
      {
        id: 'act-005',
        date: '2023-12-31',
        type: 'gift',
        title: 'Year-End Gift',
        description: 'Year-end contribution for tax benefits',
        amount: 2500,
        icon: 'gift',
        priority: 'high'
      },
      {
        id: 'act-006',
        date: '2023-12-20',
        type: 'meeting',
        title: 'In-Person Meeting',
        description: 'Coffee meeting to discuss 2024 campaign strategy',
        outcome: 'Committed to continued major donor support',
        icon: 'users',
        priority: 'high'
      }
    ],
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

    // Recurring Readiness Score
    recurringReadiness: {
      probability: 0.58, // 58%
      confidence: 0.76, // 76%
      lastScoredAt: '2024-08-19T08:30:00Z',
      recommendedMonthlyAmount: 125,
      bucket: 'MED'
    },

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
      // Enhanced Capacity Analysis
      capacityScore: 95,
      capacityTrend: 'increasing',
      peerComparison: 'Gives 45% more than similar demographic',
      demographicPercentile: 92, // Top 8%
      givingVsCapacity: 45, // 45% above modeled capacity

      // Enhanced Upgrade Opportunity
      upgradeOpportunity: {
        type: 'monitor', // above capacity
        potential: 10000,
        confidence: 88,
        timing: 'Next 30 days',
        timingWindow: 'next-30-days',
        status: 'above-capacity',
        fatigueRisk: false
      },

      // Enhanced Patterns & Triggers
      seasonalPatterns: [
        { pattern: 'Q4 giving surge', confidence: 94, historicalData: true },
        { pattern: 'Election year increases', confidence: 89, historicalData: true },
        { pattern: 'Tax deadline giving', confidence: 72, historicalData: true }
      ],
      triggerEvents: [
        { trigger: 'Conservative policy announcements', likelihood: 92, historicalResponse: true },
        { trigger: 'Business community events', likelihood: 85, historicalResponse: true },
        { trigger: 'Tax policy updates', likelihood: 78, historicalResponse: true },
        { trigger: 'Chamber of Commerce events', likelihood: 70, historicalResponse: false }
      ],

      // Historical Response Data
      historicalTriggers: ['Conservative policy announcements', 'Business community events', 'Tax policy updates']
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
    },

    // FEC Insights - Compliance-only data (Republican donor example)
    fecInsights: {
      contributionHistory: {
        totalContributions: 52,
        firstContributionDate: '2016-05-20',
        lastContributionDate: '2024-02-15',
        activeCycles: ['2016', '2018', '2020', '2022', '2024'],
        totalAmount: 34750,
        // Summary totals for compliance tracking
        yearToDate: {
          amount: 2500, // 2024 contributions so far
          contributionCount: 3,
          year: 2024
        },
        cycleToDate: {
          amount: 8750, // 2023-2024 election cycle
          contributionCount: 12,
          cycle: '2024 Election Cycle',
          cycleStartDate: '2023-01-01'
        }
      },
      committeesSupported: [
        {
          committeeName: 'National Republican Congressional Committee',
          committeeType: 'party',
          totalAmount: 15000,
          contributionCount: 22,
          lastContribution: '2024-02-15',
          transactions: [
            { date: '2024-02-15', amount: 1000, reportPeriod: 'Q1 2024', filingDate: '2024-02-20', transactionId: 'SA11AI.123456' },
            { date: '2024-01-30', amount: 500, reportPeriod: 'Q1 2024', filingDate: '2024-02-20', transactionId: 'SA11AI.123457' },
            { date: '2023-12-31', amount: 2500, reportPeriod: 'Q4 2023', filingDate: '2024-01-15', transactionId: 'SA11AI.123458' },
            { date: '2023-11-15', amount: 1000, reportPeriod: 'Q4 2023', filingDate: '2024-01-15', transactionId: 'SA11AI.123459' },
            { date: '2023-10-20', amount: 750, reportPeriod: 'Q4 2023', filingDate: '2024-01-15', transactionId: 'SA11AI.123460' },
            { date: '2023-09-30', amount: 1000, reportPeriod: 'Q3 2023', filingDate: '2023-10-15', transactionId: 'SA11AI.123461' },
            { date: '2023-08-15', amount: 500, reportPeriod: 'Q3 2023', filingDate: '2023-10-15', transactionId: 'SA11AI.123462' }
          ]
        },
        {
          committeeName: 'Trump for President',
          committeeType: 'candidate',
          totalAmount: 8750,
          contributionCount: 14,
          lastContribution: '2023-10-30',
          transactions: [
            { date: '2023-10-30', amount: 1000, reportPeriod: 'Q4 2023', filingDate: '2023-11-15', transactionId: 'SA11AI.234567' },
            { date: '2023-09-15', amount: 2700, reportPeriod: 'Q3 2023', filingDate: '2023-10-15', transactionId: 'SA11AI.234568' },
            { date: '2023-06-30', amount: 1000, reportPeriod: 'Q2 2023', filingDate: '2023-07-15', transactionId: 'SA11AI.234569' },
            { date: '2023-03-31', amount: 1500, reportPeriod: 'Q1 2023', filingDate: '2023-04-15', transactionId: 'SA11AI.234570' },
            { date: '2022-12-15', amount: 2550, reportPeriod: 'Q4 2022', filingDate: '2023-01-15', transactionId: 'SA11AI.234571' }
          ]
        },
        {
          committeeName: 'Club for Growth Action',
          committeeType: 'super-pac',
          totalAmount: 5000,
          contributionCount: 5,
          lastContribution: '2023-12-20',
          transactions: [
            { date: '2023-12-20', amount: 2500, reportPeriod: 'Q4 2023', filingDate: '2024-01-20', transactionId: 'SA11AI.345678' },
            { date: '2023-06-15', amount: 1000, reportPeriod: 'Q2 2023', filingDate: '2023-07-20', transactionId: 'SA11AI.345679' },
            { date: '2022-10-31', amount: 1000, reportPeriod: 'Q4 2022', filingDate: '2022-11-20', transactionId: 'SA11AI.345680' },
            { date: '2022-03-15', amount: 500, reportPeriod: 'Q1 2022', filingDate: '2022-04-20', transactionId: 'SA11AI.345681' }
          ]
        },
        {
          committeeName: 'Republican National Committee',
          committeeType: 'party',
          totalAmount: 4000,
          contributionCount: 8,
          lastContribution: '2024-01-10',
          transactions: [
            { date: '2024-01-10', amount: 1000, reportPeriod: 'Q1 2024', filingDate: '2024-01-20', transactionId: 'SA11AI.456789' },
            { date: '2023-12-05', amount: 500, reportPeriod: 'Q4 2023', filingDate: '2024-01-15', transactionId: 'SA11AI.456790' },
            { date: '2023-09-20', amount: 750, reportPeriod: 'Q3 2023', filingDate: '2023-10-15', transactionId: 'SA11AI.456791' },
            { date: '2023-06-10', amount: 500, reportPeriod: 'Q2 2023', filingDate: '2023-07-15', transactionId: 'SA11AI.456792' },
            { date: '2023-03-15', amount: 1250, reportPeriod: 'Q1 2023', filingDate: '2023-04-15', transactionId: 'SA11AI.456793' }
          ]
        },
        {
          committeeName: 'American Conservative Union',
          committeeType: 'pac',
          totalAmount: 2000,
          contributionCount: 3,
          lastContribution: '2023-11-15',
          transactions: [
            { date: '2023-11-15', amount: 1000, reportPeriod: 'Q4 2023', filingDate: '2024-01-15', transactionId: 'SA11AI.567890' },
            { date: '2023-05-20', amount: 500, reportPeriod: 'Q2 2023', filingDate: '2023-07-15', transactionId: 'SA11AI.567891' },
            { date: '2022-11-30', amount: 500, reportPeriod: 'Q4 2022', filingDate: '2023-01-15', transactionId: 'SA11AI.567892' }
          ]
        }
      ],
      givingCategories: {
        federalCandidates: 8750,
        pacs: 2000,
        partyCommittees: 19000,
        superPacs: 5000
      },
      exclusivityMetrics: {
        partyExclusivity: 'exclusive-republican',
        exclusivityPercentage: 100,
        crossoverContributions: 0
      },

      // Recent Activity Summary (top 5 most recent transactions)
      recentActivity: [
        { date: '2024-02-15', amount: 1000, committeeName: 'National Republican Congressional Committee', committeeType: 'party', reportPeriod: 'Q1 2024' },
        { date: '2024-01-30', amount: 500, committeeName: 'National Republican Congressional Committee', committeeType: 'party', reportPeriod: 'Q1 2024' },
        { date: '2024-01-10', amount: 1000, committeeName: 'Republican National Committee', committeeType: 'party', reportPeriod: 'Q1 2024' },
        { date: '2023-12-31', amount: 2500, committeeName: 'National Republican Congressional Committee', committeeType: 'party', reportPeriod: 'Q4 2023' },
        { date: '2023-12-20', amount: 2500, committeeName: 'Club for Growth Action', committeeType: 'super-pac', reportPeriod: 'Q4 2023' }
      ],

      benchmarks: {
        nationalPercentile: 92,
        categoryRanking: 'Top 8% of donors nationally',
        cycleComparison: 'Above average for this election cycle'
      },
      dataSource: 'FEC Public Records',
      lastUpdated: '2024-02-20',
      disclaimer: 'This information is provided from public FEC filings for compliance, vetting, and benchmarking only. It may not be used for solicitation or commercial purposes (11 CFR §104.15).'
    }
  },

  'margaret-banks': {
    id: 'margaret-banks',
    pid: 'MB-2024-001',
    name: 'Margaret Banks',
    photoUrl: 'https://i.pravatar.cc/150?u=margaret-banks&gender=female',
    email: 'margaret.banks@email.com',
    phone: '(555) 678-9014',
    address: '456 Elm Street, Springfield, IL 62701',
    primaryAddress: {
      street: '456 Elm Street',
      city: 'Springfield',
      state: 'IL',
      zip: '62701',
      country: 'USA'
    },
    contactInfo: {
      home: '(555) 678-9014',
      work: '(555) 678-9015',
      email: 'margaret.banks@email.com',
      website: 'linkedin.com/in/margaretbanks'
    },
    aiBadges: ['Major Donor', 'Community Volunteer', 'Education Advocate'],
    predictiveAsk: 3500,
    recurrencePrediction: 'Very Likely (89%)',
    suggestedAction: 'Invite to education policy roundtable',
    givingOverview: {
      totalRaised: 8750,
      consecutiveGifts: 8,
      tier: 'Gold Supporter',
      topGifts: [
        { name: 'Q1 2024', value: 2500 },
        { name: 'Q4 2023', value: 1500 },
        { name: 'Q3 2023', value: 2000 },
        { name: 'Q2 2023', value: 1250 },
        { name: 'Q1 2023', value: 1500 }
      ]
    },
    aiSnapshot: 'Margaret is a dedicated education advocate and community volunteer who complements her husband Joseph\'s political engagement. She has a strong focus on education policy and children\'s welfare initiatives. Margaret prefers smaller, more intimate events and responds well to personal appeals about education funding. She has been instrumental in organizing community support for local school initiatives.',

    // Recurring Readiness Score
    recurringReadiness: {
      probability: 0.34, // 34%
      confidence: 0.68, // 68%
      lastScoredAt: '2024-08-19T08:30:00Z',
      recommendedMonthlyAmount: 25,
      bucket: 'LOW'
    },

    totalLifetimeGiving: 8750,
    lastGiftAmount: 2500,
    lastGiftDate: '2024-03-15',
    giftCount: 8,
    engagementScore: 87,
    urgencyIndicators: {
      isHotLead: false,
      hasRecentActivity: true,
      needsAttention: false
    },
    relationshipMapping: {
      spouse: 'Joseph M. Banks',
      family: ['Joseph Banks Jr.', 'Sarah Banks-Wilson'],
      professionalConnections: ['Springfield Education Foundation', 'Parent Teacher Association'],
      mutualConnections: ['Patricia Williams', 'Robert Davis', 'School Board Members'],
      influenceNetwork: ['Education Advocacy Group', 'Community Volunteer Network'],
      employerMatching: false
    },
    givingIntelligence: {
      capacityScore: 82,
      engagementLevel: 'High',
      preferredContactMethod: 'Email',
      bestContactTime: 'Weekday mornings',
      givingMotivation: 'Education and children\'s welfare',
      responseToAsk: 'Thoughtful consideration',
      eventAttendance: 'Selective - education focused',
      volunteerHistory: 'Active in school committees'
    }
  },

  'sofia-borden': {
    id: 'sofia-borden',
    pid: 'SB-2024-001',
    name: 'Sofia Borden',
    photoUrl: 'https://i.pravatar.cc/150?u=sofia-borden&gender=female',
    email: 'sofia.amaya87@gmail.com',
    phone: '(407) 555-0123',
    address: '9330 Oglethorpe Drive, Groveland, FL 34736',
    primaryAddress: {
      street: '9330 Oglethorpe Drive',
      city: 'Groveland',
      state: 'FL',
      zip: '34736',
      country: 'USA'
    },
    contactInfo: {
      home: '(407) 555-0123',
      work: '(407) 555-0124',
      email: 'sofia.amaya87@gmail.com',
      website: 'linkedin.com/in/sofiaborden'
    },
    aiBadges: ['Executive Leader', 'Tech Professional', 'Strategic Donor'],
    predictiveAsk: 2500,
    recurrencePrediction: 'Very Likely (88%)',
    suggestedAction: 'Schedule executive briefing on policy initiatives',
    givingOverview: {
      totalRaised: 7500,
      consecutiveGifts: 6,
      tier: 'Gold Supporter',
      topGifts: [
        { name: 'Q1 2024', value: 2000 },
        { name: 'Q4 2023', value: 1500 },
        { name: 'Q3 2023', value: 1250 },
        { name: 'Q2 2023', value: 1000 },
        { name: 'Q1 2023', value: 1750 }
      ]
    },
    aiSnapshot: 'Sofia is a dynamic CXO at CMDI with strong leadership experience in technology and business strategy. Based in Florida, she brings valuable executive perspective to policy discussions. Her giving pattern shows strategic, substantial contributions with strong growth potential. She prefers direct communication and responds well to high-level policy briefings.',

    recurringReadiness: {
      probability: 0.88,
      confidence: 0.91,
      lastScoredAt: '2024-03-01T10:00:00Z',
      recommendedMonthlyAmount: 200,
      bucket: 'HIGH'
    },

    totalLifetimeGiving: 7500,
    lastGiftAmount: 2000,
    lastGiftDate: '2024-03-10',
    giftCount: 6,
    engagementScore: 85,
    urgencyIndicators: {
      isHotLead: true,
      hasRecentActivity: true,
      needsAttention: false
    },
    relationshipMapping: {
      family: [],
      professionalConnections: ['CMDI', 'Florida Tech Executive Network'],
      mutualConnections: ['Rachel Gideon', 'Jeff Wernsing', 'Jack Simms', 'Tom Newhouse'],
      influenceNetwork: ['Tech Leadership Council', 'Florida Business Leaders'],
      employerMatching: true
    },
    givingIntelligence: {
      capacityScore: 92,
      engagementLevel: 'High',
      preferredContactMethod: 'Email',
      bestContactTime: 'Business hours',
      givingMotivation: 'Strategic policy impact',
      responseToAsk: 'Quick decision maker',
      eventAttendance: 'Executive briefings preferred',
      volunteerHistory: 'Board service and strategic advisory'
    }
  },

  'rachel-gideon': {
    id: 'rachel-gideon',
    pid: 'RG-2024-001',
    name: 'Rachel Gideon',
    photoUrl: 'https://i.pravatar.cc/150?u=rachel-gideon&gender=female',
    email: 'rachel.gideon@cmdi.com',
    phone: '(202) 555-0125',
    address: 'Washington, DC 20001',
    primaryAddress: {
      street: '1234 K Street NW',
      city: 'Washington',
      state: 'DC',
      zip: '20001',
      country: 'USA'
    },
    contactInfo: {
      home: '(202) 555-0125',
      work: '(202) 555-0126',
      email: 'rachel.gideon@cmdi.com',
      website: 'linkedin.com/in/rachelgideon'
    },
    aiBadges: ['Client Relations Expert', 'DC Professional', 'Relationship Builder'],
    predictiveAsk: 1500,
    recurrencePrediction: 'Likely (75%)',
    suggestedAction: 'Invite to DC networking event',
    givingOverview: {
      totalRaised: 4200,
      consecutiveGifts: 5,
      tier: 'Silver Supporter',
      topGifts: [
        { name: 'Q1 2024', value: 1000 },
        { name: 'Q4 2023', value: 800 },
        { name: 'Q3 2023', value: 900 },
        { name: 'Q2 2023', value: 750 },
        { name: 'Q1 2023', value: 750 }
      ]
    },
    aiSnapshot: 'Rachel is a skilled Director of Client Relations at CMDI, based in Washington DC. Her professional focus on relationship building translates well to political engagement. She has strong connections in the DC professional network and shows consistent giving patterns. She prefers in-person events and networking opportunities.',

    recurringReadiness: {
      probability: 0.75,
      confidence: 0.82,
      lastScoredAt: '2024-03-01T10:00:00Z',
      recommendedMonthlyAmount: 125,
      bucket: 'MED'
    },

    totalLifetimeGiving: 4200,
    lastGiftAmount: 1000,
    lastGiftDate: '2024-03-08',
    giftCount: 5,
    engagementScore: 78,
    urgencyIndicators: {
      isHotLead: false,
      hasRecentActivity: true,
      needsAttention: false
    },
    relationshipMapping: {
      family: [],
      professionalConnections: ['CMDI', 'DC Professional Network'],
      mutualConnections: ['Sofia Borden', 'Jeff Wernsing', 'Jack Simms', 'Tom Newhouse'],
      influenceNetwork: ['DC Business Council', 'Client Relations Association'],
      employerMatching: true
    },
    givingIntelligence: {
      capacityScore: 78,
      engagementLevel: 'High',
      preferredContactMethod: 'Phone',
      bestContactTime: 'Weekday afternoons',
      givingMotivation: 'Professional network influence',
      responseToAsk: 'Relationship-driven decisions',
      eventAttendance: 'Networking events preferred',
      volunteerHistory: 'Professional association leadership'
    }
  },

  'jeff-wernsing': {
    id: 'jeff-wernsing',
    pid: 'JW-2024-001',
    name: 'Jeff Wernsing',
    photoUrl: 'https://i.pravatar.cc/150?u=jeff-wernsing',
    email: 'jeff.wernsing@cmdi.com',
    phone: '(703) 555-0127',
    address: 'Arlington, VA 22201',
    primaryAddress: {
      street: '5678 Wilson Blvd',
      city: 'Arlington',
      state: 'VA',
      zip: '22201',
      country: 'USA'
    },
    contactInfo: {
      home: '(703) 555-0127',
      work: '(703) 555-0128',
      email: 'jeff.wernsing@cmdi.com',
      website: 'linkedin.com/in/jeffwernsing'
    },
    aiBadges: ['Compliance Expert', 'Senior Executive', 'Policy Advocate'],
    predictiveAsk: 3000,
    recurrencePrediction: 'Very Likely (85%)',
    suggestedAction: 'Invite to compliance policy roundtable',
    givingOverview: {
      totalRaised: 9200,
      consecutiveGifts: 7,
      tier: 'Gold Supporter',
      topGifts: [
        { name: 'Q1 2024', value: 2500 },
        { name: 'Q4 2023', value: 1800 },
        { name: 'Q3 2023', value: 1500 },
        { name: 'Q2 2023', value: 1200 },
        { name: 'Q1 2023', value: 2200 }
      ]
    },
    aiSnapshot: 'Jeff is a Senior Vice President of Compliance Services at CMDI, bringing deep expertise in regulatory matters and policy implementation. Based in Arlington, VA, he has strong connections in the DC metro compliance community. His giving pattern reflects strategic, substantial contributions with focus on governance and regulatory policy initiatives.',

    recurringReadiness: {
      probability: 0.85,
      confidence: 0.89,
      lastScoredAt: '2024-03-01T10:00:00Z',
      recommendedMonthlyAmount: 250,
      bucket: 'HIGH'
    },

    totalLifetimeGiving: 9200,
    lastGiftAmount: 2500,
    lastGiftDate: '2024-03-12',
    giftCount: 7,
    engagementScore: 88,
    urgencyIndicators: {
      isHotLead: true,
      hasRecentActivity: true,
      needsAttention: false
    },
    relationshipMapping: {
      family: [],
      professionalConnections: ['CMDI', 'DC Metro Compliance Network', 'Regulatory Affairs Association'],
      mutualConnections: ['Sofia Borden', 'Rachel Gideon', 'Jack Simms', 'Tom Newhouse'],
      influenceNetwork: ['Compliance Officers Network', 'Policy Implementation Council'],
      employerMatching: true
    },
    givingIntelligence: {
      capacityScore: 89,
      engagementLevel: 'Very High',
      preferredContactMethod: 'Email',
      bestContactTime: 'Business hours',
      givingMotivation: 'Regulatory policy and governance',
      responseToAsk: 'Analytical and thorough',
      eventAttendance: 'Policy-focused events',
      volunteerHistory: 'Regulatory advisory committees'
    }
  },

  'jack-simms': {
    id: 'jack-simms',
    pid: 'JS-2024-001',
    name: 'Jack Simms',
    photoUrl: 'https://i.pravatar.cc/150?u=jack-simms',
    email: 'jack.simms@cmdi.com',
    phone: '(555) 555-0129',
    address: 'McLean, VA 22102',
    primaryAddress: {
      street: '9876 Executive Drive',
      city: 'McLean',
      state: 'VA',
      zip: '22102',
      country: 'USA'
    },
    contactInfo: {
      home: '(555) 555-0129',
      work: '(555) 555-0130',
      email: 'jack.simms@cmdi.com',
      website: 'linkedin.com/in/jacksimms'
    },
    aiBadges: ['President', 'Executive Leader', 'Major Donor'],
    predictiveAsk: 5000,
    recurrencePrediction: 'Very Likely (95%)',
    suggestedAction: 'Schedule presidential briefing meeting',
    givingOverview: {
      totalRaised: 18500,
      consecutiveGifts: 10,
      tier: 'Diamond Supporter',
      topGifts: [
        { name: 'Q1 2024', value: 5000 },
        { name: 'Q4 2023', value: 3500 },
        { name: 'Q3 2023', value: 3000 },
        { name: 'Q2 2023', value: 2500 },
        { name: 'Q1 2023', value: 4500 }
      ]
    },
    aiSnapshot: 'Jack is the President of CMDI, providing executive leadership and strategic vision for the organization. His substantial giving history and consistent support demonstrate strong commitment to policy initiatives. As a senior executive, he brings valuable leadership perspective and has significant influence within professional networks.',

    recurringReadiness: {
      probability: 0.95,
      confidence: 0.96,
      lastScoredAt: '2024-03-01T10:00:00Z',
      recommendedMonthlyAmount: 500,
      bucket: 'HIGH'
    },

    totalLifetimeGiving: 18500,
    lastGiftAmount: 5000,
    lastGiftDate: '2024-03-15',
    giftCount: 10,
    engagementScore: 95,
    urgencyIndicators: {
      isHotLead: true,
      hasRecentActivity: true,
      needsAttention: false
    },
    relationshipMapping: {
      family: [],
      professionalConnections: ['CMDI', 'Executive Leadership Council', 'Business Roundtable'],
      mutualConnections: ['Sofia Borden', 'Rachel Gideon', 'Jeff Wernsing', 'Tom Newhouse'],
      influenceNetwork: ['CEO Network', 'Policy Leadership Forum'],
      employerMatching: true
    },
    givingIntelligence: {
      capacityScore: 98,
      engagementLevel: 'Exceptional',
      preferredContactMethod: 'Direct meeting',
      bestContactTime: 'Executive calendar',
      givingMotivation: 'Strategic policy leadership',
      responseToAsk: 'Executive decision maker',
      eventAttendance: 'High-level briefings and galas',
      volunteerHistory: 'Board leadership and strategic advisory'
    }
  },

  'tom-newhouse': {
    id: 'tom-newhouse',
    pid: 'TN-2024-001',
    name: 'Tom Newhouse',
    photoUrl: 'https://i.pravatar.cc/150?u=tom-newhouse',
    email: 'tom.newhouse@cmdi.com',
    phone: '(555) 555-0131',
    address: 'Reston, VA 20190',
    primaryAddress: {
      street: '1357 Technology Way',
      city: 'Reston',
      state: 'VA',
      zip: '20190',
      country: 'USA'
    },
    contactInfo: {
      home: '(555) 555-0131',
      work: '(555) 555-0132',
      email: 'tom.newhouse@cmdi.com',
      website: 'linkedin.com/in/tomnewhouse'
    },
    aiBadges: ['Vice President', 'Digital Innovation', 'Data Expert'],
    predictiveAsk: 3500,
    recurrencePrediction: 'Very Likely (90%)',
    suggestedAction: 'Invite to digital strategy briefing',
    givingOverview: {
      totalRaised: 12800,
      consecutiveGifts: 8,
      tier: 'Platinum Supporter',
      topGifts: [
        { name: 'Q1 2024', value: 3000 },
        { name: 'Q4 2023', value: 2500 },
        { name: 'Q3 2023', value: 2200 },
        { name: 'Q2 2023', value: 1800 },
        { name: 'Q1 2023', value: 3300 }
      ]
    },
    aiSnapshot: 'Tom is the Vice President of Digital & Data Products at CMDI, bringing cutting-edge expertise in digital transformation and data analytics. His role in digital innovation makes him particularly valuable for understanding modern campaign technologies and data-driven policy initiatives. Strong consistent giving pattern with growth trajectory.',

    recurringReadiness: {
      probability: 0.90,
      confidence: 0.93,
      lastScoredAt: '2024-03-01T10:00:00Z',
      recommendedMonthlyAmount: 350,
      bucket: 'HIGH'
    },

    totalLifetimeGiving: 12800,
    lastGiftAmount: 3000,
    lastGiftDate: '2024-03-14',
    giftCount: 8,
    engagementScore: 92,
    urgencyIndicators: {
      isHotLead: true,
      hasRecentActivity: true,
      needsAttention: false
    },
    relationshipMapping: {
      family: [],
      professionalConnections: ['CMDI', 'Digital Innovation Council', 'Data Analytics Association'],
      mutualConnections: ['Sofia Borden', 'Rachel Gideon', 'Jeff Wernsing', 'Jack Simms'],
      influenceNetwork: ['Tech VP Network', 'Digital Strategy Forum'],
      employerMatching: true
    },
    givingIntelligence: {
      capacityScore: 91,
      engagementLevel: 'Very High',
      preferredContactMethod: 'Email',
      bestContactTime: 'Flexible - tech-savvy',
      givingMotivation: 'Digital innovation and data policy',
      responseToAsk: 'Data-driven decision maker',
      eventAttendance: 'Tech and innovation focused',
      volunteerHistory: 'Digital strategy advisory'
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
    'Joseph Banks': 'joseph-banks',
    'Margaret Banks': 'margaret-banks',
    'Margaret M. Banks': 'margaret-banks',
    'Ellen Banks': 'margaret-banks',
    'Ms. Ellen Banks': 'margaret-banks',
    'Sofia Borden': 'sofia-borden',
    'Rachel Gideon': 'rachel-gideon',
    'Jeff Wernsing': 'jeff-wernsing',
    'Jack Simms': 'jack-simms',
    'Tom Newhouse': 'tom-newhouse'
  };

  const profileKey = nameMapping[name];
  return profileKey ? mockDonorProfiles[profileKey] : null;
};
