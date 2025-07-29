import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import DonorProfileModal from '../components/ui/DonorProfileModal';
import { getDonorProfileByName } from '../utils/mockDonorProfiles';
import { Donor } from '../types';
import { 
  UserIcon, 
  SparklesIcon, 
  BrainIcon, 
  ChatBubbleLeftRightIcon,
  TrophyIcon,
  FireIcon,
  HeartIcon,
  TrendingUpIcon
} from '../constants';

const DonorProfileDemo: React.FC = () => {
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  // Sample donors for demo
  const sampleDonors = [
    {
      name: 'Joseph Banks',
      description: 'High-value donor with strong engagement',
      badges: ['Major Donor', 'Hot Lead', 'Loyal Supporter'],
      stats: { totalGiven: '$12,500', lastGift: '2 weeks ago', engagement: '94%' },
      aiInsights: 'Ready for $750 ask • Best time: Tue-Thu 2-4pm • 92% confidence',
      riskLevel: 'low',
      opportunity: 'high'
    },
    {
      name: 'Maria Rodriguez',
      description: 'Consistent monthly donor with upgrade potential',
      badges: ['Monthly Donor', 'Volunteer', 'Event Attendee'],
      stats: { totalGiven: '$3,200', lastGift: '1 week ago', engagement: '87%' },
      aiInsights: 'Upgrade opportunity detected • Suggest $150 monthly • 85% confidence',
      riskLevel: 'low',
      opportunity: 'medium'
    },
    {
      name: 'David Chen',
      description: 'New donor showing strong early engagement',
      badges: ['New Donor', 'High Engagement', 'Tech Professional'],
      stats: { totalGiven: '$850', lastGift: '3 days ago', engagement: '91%' },
      aiInsights: 'Strong potential • Consider personal meeting • 78% confidence',
      riskLevel: 'low',
      opportunity: 'high'
    },
    {
      name: 'Sarah Johnson',
      description: 'Lapsed donor with re-engagement signals',
      badges: ['Lapsed Donor', 'Comeback Crew', 'Previous Major'],
      stats: { totalGiven: '$8,900', lastGift: '8 months ago', engagement: '23%' },
      aiInsights: 'Re-engagement opportunity • Personal outreach needed • 67% confidence',
      riskLevel: 'high',
      opportunity: 'medium'
    }
  ];

  const handleViewProfile = (donorName: string) => {
    const donor = getDonorProfileByName(donorName);
    if (donor) {
      setSelectedDonor(donor);
      setShowProfile(true);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  const getOpportunityColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-purple-600 bg-purple-100';
      case 'medium': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="bg-crimson-blue/10 p-3 rounded-xl">
            <SparklesIcon className="w-8 h-8 text-crimson-blue" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Enhanced Donor Profiles</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Experience the next generation of donor relationship management with AI-powered insights, 
          predictive analytics, and intelligent recommendations.
        </p>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center p-6 hover:shadow-lg transition-shadow">
          <div className="bg-blue-100 p-3 rounded-xl w-fit mx-auto mb-4">
            <BrainIcon className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">AI Intelligence</h3>
          <p className="text-gray-600 text-sm">
            Real-time scoring, predictive analytics, and smart recommendations powered by machine learning.
          </p>
        </Card>

        <Card className="text-center p-6 hover:shadow-lg transition-shadow">
          <div className="bg-green-100 p-3 rounded-xl w-fit mx-auto mb-4">
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Communication Hub</h3>
          <p className="text-gray-600 text-sm">
            Complete interaction timeline with AI insights, outcome tracking, and smart follow-up recommendations.
          </p>
        </Card>

        <Card className="text-center p-6 hover:shadow-lg transition-shadow">
          <div className="bg-purple-100 p-3 rounded-xl w-fit mx-auto mb-4">
            <TrendingUpIcon className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Predictive Insights</h3>
          <p className="text-gray-600 text-sm">
            Optimal ask amounts, best contact times, and upgrade opportunities with confidence scores.
          </p>
        </Card>
      </div>

      {/* Sample Donors Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Try the Enhanced Profiles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sampleDonors.map((donor, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{donor.name}</h3>
                      <p className="text-sm text-gray-600">{donor.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className={`p-1 rounded-full ${getRiskColor(donor.riskLevel)}`}>
                      <div className="w-2 h-2 rounded-full bg-current"></div>
                    </div>
                    <div className={`p-1 rounded-full ${getOpportunityColor(donor.opportunity)}`}>
                      <TrophyIcon className="w-3 h-3" />
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {donor.badges.map((badge, badgeIndex) => (
                    <span 
                      key={badgeIndex}
                      className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full border border-blue-200"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-crimson-blue">{donor.stats.totalGiven}</div>
                    <div className="text-xs text-gray-600">Total Given</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{donor.stats.lastGift}</div>
                    <div className="text-xs text-gray-600">Last Gift</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{donor.stats.engagement}</div>
                    <div className="text-xs text-gray-600">Engagement</div>
                  </div>
                </div>

                {/* AI Insights */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 mb-4 border border-blue-200">
                  <div className="flex items-start gap-2">
                    <SparklesIcon className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-blue-900 mb-1">AI Recommendation</p>
                      <p className="text-xs text-blue-800">{donor.aiInsights}</p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  variant="primary" 
                  className="w-full font-medium"
                  onClick={() => handleViewProfile(donor.name)}
                >
                  View Enhanced Profile
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Overview */}
      <Card className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">What's New in Enhanced Profiles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-red-100 p-3 rounded-xl w-fit mx-auto mb-3">
              <FireIcon className="w-6 h-6 text-red-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Real-time Scoring</h4>
            <p className="text-sm text-gray-600">Live intelligence scores for capacity, engagement, and loyalty</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 p-3 rounded-xl w-fit mx-auto mb-3">
              <TrendingUpIcon className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Predictive Analytics</h4>
            <p className="text-sm text-gray-600">AI-powered predictions for giving likelihood and timing</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 p-3 rounded-xl w-fit mx-auto mb-3">
              <HeartIcon className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Relationship Intelligence</h4>
            <p className="text-sm text-gray-600">Deep insights into donor preferences and communication patterns</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 p-3 rounded-xl w-fit mx-auto mb-3">
              <SparklesIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Smart Actions</h4>
            <p className="text-sm text-gray-600">AI-generated scripts, optimal timing, and personalized recommendations</p>
          </div>
        </div>
      </Card>

      {/* Enhanced Donor Profile Modal */}
      <DonorProfileModal
        donor={selectedDonor}
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </div>
  );
};

export default DonorProfileDemo;
