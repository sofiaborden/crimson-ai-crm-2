import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import { SparklesIcon, TrendingUpIcon, TrendingDownIcon, XMarkIcon, PhoneIcon, EnvelopeIcon, DocumentTextIcon } from '../../constants';
import DonorProfileModal from './DonorProfileModal';
import { getDonorProfileByName } from '../../utils/mockDonorProfiles';
import { Donor } from '../../types';

interface DonorScore {
  name: string;
  email: string;
  phone: string;
  donationLikelihood: number;
  suggestedAsk: number;
  lastGift: number;
  avgGift: number;
  daysSinceLastGift: number;
  totalGifts: number;
  factors: {
    recency: number;
    frequency: number;
    monetary: number;
    engagement: number;
  };
  insights: string[];
  nextBestAction: string;
}

interface PredictiveScoringProps {
  segmentId: string;
  segmentName: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const PredictiveScoring: React.FC<PredictiveScoringProps> = ({ segmentId, segmentName, isOpen = true, onClose }) => {
  const [viewMode, setViewMode] = useState<'detailed' | 'summary'>('detailed');
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [showDonorProfile, setShowDonorProfile] = useState(false);

  const handleDonorClick = (donorName: string) => {
    const donor = getDonorProfileByName(donorName);
    if (donor) {
      setSelectedDonor(donor);
      setShowDonorProfile(true);
    }
  };
  const mockScores: DonorScore[] = [
    {
      name: 'Joseph Banks',
      email: 'joseph.banks@email.com',
      phone: '(555) 456-7890',
      donationLikelihood: 92,
      suggestedAsk: 1500,
      lastGift: 1200,
      avgGift: 800,
      daysSinceLastGift: 45,
      totalGifts: 8,
      factors: {
        recency: 85,
        frequency: 90,
        monetary: 95,
        engagement: 88
      },
      insights: [
        'Consistent major donor with increasing gift sizes',
        'High email engagement (85% open rate)',
        'Lives in high-capacity ZIP code',
        'Responds well to personal calls'
      ],
      nextBestAction: 'Personal call with specific project proposal'
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '(555) 123-4567',
      donationLikelihood: 78,
      suggestedAsk: 350,
      lastGift: 250,
      avgGift: 180,
      daysSinceLastGift: 180,
      totalGifts: 12,
      factors: {
        recency: 45,
        frequency: 85,
        monetary: 70,
        engagement: 92
      },
      insights: [
        'Lapsed but historically loyal donor',
        'High social media engagement',
        'Prefers email communication',
        'Responds to emotional appeals'
      ],
      nextBestAction: 'Reactivation email with impact story'
    },
    {
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '(555) 234-5678',
      donationLikelihood: 65,
      suggestedAsk: 200,
      lastGift: 150,
      avgGift: 120,
      daysSinceLastGift: 90,
      totalGifts: 6,
      factors: {
        recency: 60,
        frequency: 55,
        monetary: 50,
        engagement: 75
      },
      insights: [
        'Growing donor with potential',
        'Young professional demographic',
        'Prefers online giving',
        'Responds to peer-to-peer campaigns'
      ],
      nextBestAction: 'Peer-to-peer campaign invitation'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 70) return <TrendingUpIcon className="w-4 h-4" />;
    return <TrendingDownIcon className="w-4 h-4" />;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Ask Amount Recommendations</h2>
            <p className="text-gray-600">
              {segmentName} - Personalized recommendations for each donor
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('detailed')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  viewMode === 'detailed' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                Detailed View
              </button>
              <button
                onClick={() => setViewMode('summary')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  viewMode === 'summary' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                Summary View
              </button>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </button>
            )}
          </div>
        </div>

        <div className="p-6 overflow-auto max-h-[75vh]">
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">$275</div>
              <div className="text-sm text-blue-700">Average Recommended Ask</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">89%</div>
              <div className="text-sm text-green-700">Avg Confidence Score</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">$68K</div>
              <div className="text-sm text-purple-700">Total Potential Revenue</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{mockScores.length}</div>
              <div className="text-sm text-orange-700">Donors Analyzed</div>
            </div>
          </div>

          {viewMode === 'detailed' ? (
            <div className="space-y-4">
              {mockScores.map((donor, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <button
                          onClick={() => handleDonorClick(donor.name)}
                          className="font-semibold text-lg text-blue-600 hover:text-blue-800 underline-offset-2 hover:underline transition-colors text-left"
                        >
                          {donor.name}
                        </button>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${getScoreColor(donor.donationLikelihood)}`}>
                          {getScoreIcon(donor.donationLikelihood)}
                          {donor.donationLikelihood}% likely to give
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Suggested Ask:</span>
                          <p className="text-green-600 font-bold">{formatCurrency(donor.suggestedAsk)}</p>
                        </div>
                        <div>
                          <span className="font-medium">Last Gift:</span>
                          <p>{formatCurrency(donor.lastGift)}</p>
                        </div>
                        <div>
                          <span className="font-medium">Avg Gift:</span>
                          <p>{formatCurrency(donor.avgGift)}</p>
                        </div>
                        <div>
                          <span className="font-medium">Days Since Last:</span>
                          <p>{donor.daysSinceLastGift} days</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {Object.entries(donor.factors).map(([factor, score]) => (
                      <div key={factor} className="text-center">
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          {factor}
                        </div>
                        <div className={`text-sm font-bold ${getScoreColor(score).split(' ')[0]}`}>
                          {score}%
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className={`h-2 rounded-full ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-4">
                    <h5 className="font-medium text-sm mb-2 flex items-center gap-1">
                      <SparklesIcon className="w-4 h-4 text-purple-500" />
                      AI Insights
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {donor.insights.map((insight, idx) => (
                        <div key={idx} className="text-xs text-gray-600 bg-gray-50 rounded px-2 py-1">
                          • {insight}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex-1">
                      <span className="text-sm font-medium text-purple-600">Next Best Action:</span>
                      <p className="text-sm text-gray-700">{donor.nextBestAction}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => window.open(`tel:${donor.phone}`, '_self')}
                        title="Call donor"
                      >
                        <PhoneIcon className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        onClick={() => window.open(`mailto:${donor.email}`, '_self')}
                        title="Email donor"
                      >
                        <EnvelopeIcon className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        onClick={() => console.log(`Generate script for ${donor.name}`)}
                        title="Generate script"
                      >
                        <DocumentTextIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-auto max-h-96">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Donor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Optimal Ask</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confidence</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Channel</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Action</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockScores.map((donor, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDonorClick(donor.name)}
                          className="font-medium text-blue-600 hover:text-blue-800 underline-offset-2 hover:underline transition-colors text-left"
                        >
                          {donor.name}
                        </button>
                        <div className="text-sm text-gray-500">{donor.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-lg font-bold text-green-600">{formatCurrency(donor.suggestedAsk)}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            donor.donationLikelihood >= 90 ? 'bg-green-500' :
                            donor.donationLikelihood >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                          <span className="font-medium">{donor.donationLikelihood}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          Email
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {donor.nextBestAction}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            onClick={() => window.open(`tel:${donor.phone}`, '_self')}
                            title="Call"
                          >
                            <PhoneIcon className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            onClick={() => window.open(`mailto:${donor.email}`, '_self')}
                            title="Email"
                          >
                            <EnvelopeIcon className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                            title="Script"
                          >
                            <DocumentTextIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              AI recommendations based on 50+ data points per donor, updated in real-time
            </div>
            <div className="flex gap-2">
              {onClose && (
                <Button variant="secondary" onClick={onClose}>
                  Close
                </Button>
              )}
              <Button variant="secondary">
                Export Recommendations
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Create Targeted Campaign
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Donor Profile Modal */}
      <DonorProfileModal
        donor={selectedDonor}
        isOpen={showDonorProfile}
        onClose={() => setShowDonorProfile(false)}
      />
    </div>
  );
};

export default PredictiveScoring;
