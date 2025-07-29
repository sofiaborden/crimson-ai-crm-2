import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import ActionButton from '../ui/ActionButton';
import SmartAlerts from '../ui/SmartAlerts';
import CallScriptGenerator from '../ui/CallScriptGenerator';
import PredictiveScoring from '../ui/PredictiveScoring';
import DonorListView from '../ui/DonorListView';
import SmartListBuilder from '../ui/SmartListBuilder';
import CampaignBuilder from '../ui/CampaignBuilder';
import {
  ArrowPathIcon,
  LightBulbIcon,
  ArrowPathRoundedSquareIcon,
  MapPinIcon,
  SparklesIcon,
  EyeIcon,
  ChartBarIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ArrowDownTrayIcon,
  ListBulletIcon,
  DocumentTextIcon,
  ClockIcon
} from '../../constants';

interface Segment {
  id: string;
  funName: string;
  originalName: string;
  description: string;
  count: number;
  potentialRevenue: number;
  suggestedAction: string;
  emoji: string;
}

const segments: Segment[] = [
  {
    id: 'comeback-crew',
    funName: 'Comeback Crew',
    originalName: 'Lapsed Donors',
    description: 'Launch call/text reactivation campaign.',
    count: 1571,
    potentialRevenue: 113000,
    suggestedAction: 'Launch call/text reactivation campaign.',
    icon: <ArrowPathIcon className="w-5 h-5" />
  },
  {
    id: 'level-up-list',
    funName: 'Level-Up List',
    originalName: 'Mid-Level Upgrade Candidates ($100–$500 avg gift)',
    description: 'Send upgrade ask emails & calls.',
    count: 578,
    potentialRevenue: 21300,
    suggestedAction: 'Send upgrade ask emails & calls.',
    icon: <LightBulbIcon className="w-5 h-5" />
  },
  {
    id: 'frequent-flyers',
    funName: 'Frequent Flyers',
    originalName: 'Small Dollar, High Frequency (5+ gifts)',
    description: 'Invite to monthly giving program.',
    count: 346,
    potentialRevenue: 9200,
    suggestedAction: 'Invite to monthly giving program.',
    icon: <ArrowPathRoundedSquareIcon className="w-5 h-5" />
  },
  {
    id: 'new-faces',
    funName: 'New Faces Welcome',
    originalName: 'New Donors (Last 90 Days)',
    description: 'Send welcome series + 2nd gift ask.',
    count: 185,
    potentialRevenue: 6500,
    suggestedAction: 'Send welcome series + 2nd gift ask.',
    emoji: '✨'
  },
  {
    id: 'neighborhood-mvps',
    funName: 'Neighborhood MVPs',
    originalName: 'Potential Major Donors by ZIP ($250+ avg gift)',
    description: 'Schedule major donor calls/events.',
    count: 303,
    potentialRevenue: 104000,
    suggestedAction: 'Schedule major donor calls/events.',
    icon: <MapPinIcon className="w-5 h-5" />
  },
  {
    id: 'first-gift-friends',
    funName: 'First Gift Friends',
    originalName: 'First-Time Donors',
    description: 'Send thank you + 2nd ask appeal.',
    count: 181,
    potentialRevenue: 5900,
    suggestedAction: 'Send thank you + 2nd ask appeal.',
    icon: <SparklesIcon className="w-5 h-5" />
  },
  {
    id: 'quiet-giants',
    funName: 'Quiet Giants',
    originalName: 'Low Engagement, High Capacity ($500+ avg, low # gifts)',
    description: 'Assign to gift officer for personalized outreach.',
    count: 7,
    potentialRevenue: 6000,
    suggestedAction: 'Assign to gift officer for personalized outreach.',
    icon: <EyeIcon className="w-5 h-5" />
  },
  {
    id: 'next-gift-predictors',
    funName: 'Next Gift Predictors',
    originalName: 'Recurrence Prediction Cohort (likely to give again soon)',
    description: 'Send renewal reminders + stewardship call.',
    count: 767,
    potentialRevenue: 14800,
    suggestedAction: 'Send renewal reminders + stewardship call.',
    icon: <ChartBarIcon className="w-5 h-5" />
  }
];

const SegmentsDashboard: React.FC = () => {
  const [showCallScript, setShowCallScript] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState({ id: '', name: '' });
  const [showPredictiveScoring, setShowPredictiveScoring] = useState(false);
  const [showDonorList, setShowDonorList] = useState(false);
  const [showSmartListBuilder, setShowSmartListBuilder] = useState(false);
  const [showCampaignBuilder, setShowCampaignBuilder] = useState(false);
  return (
    <div className="space-y-6">
      {/* Smart Alerts */}
      <SmartAlerts />

      <div>
        <h2 className="text-2xl font-bold text-text-primary">AI Curated Segments</h2>
        <p className="text-text-secondary">Smart donor segments powered by AI to maximize your fundraising impact.</p>
      </div>

      {/* Quick Actions Bar */}
      <Card className="bg-gradient-to-r from-crimson-blue to-crimson-red text-white">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              <SparklesIcon className="w-5 h-5" />
              Quick Actions
            </h3>
            <p className="text-sm opacity-90">Take immediate action on your highest-value segments</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ActionButton
              type="call"
              phoneNumber="+15551234567"
              className="bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 font-medium shadow-sm"
              size="sm"
            >
              <PhoneIcon className="w-4 h-4 mr-1" />
              Call Top 10 Major Donors
            </ActionButton>
            <ActionButton
              type="email"
              email="comeback-crew@campaign.com"
              subject="We Miss You! Come Back to Our Campaign"
              body="Hi there! We noticed you haven't been active lately and wanted to reach out..."
              className="bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 font-medium shadow-sm"
              size="sm"
            >
              <EnvelopeIcon className="w-4 h-4 mr-1" />
              Email Comeback Crew (1,571)
            </ActionButton>
            <Button
              className="bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 font-medium shadow-sm"
              size="sm"
              onClick={() => setShowPredictiveScoring(!showPredictiveScoring)}
            >
              <CurrencyDollarIcon className="w-4 h-4 mr-1" />
              Generate Ask Amounts
            </Button>
            <ActionButton
              type="export"
              className="bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 font-medium shadow-sm"
              size="sm"
            >
              <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
              Export All Segments
            </ActionButton>
          </div>
        </div>
      </Card>
      
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-base-300">
                <th className="text-left py-3 px-4 font-semibold text-text-primary">Segment</th>
                <th className="text-left py-3 px-4 font-semibold text-text-primary">Description</th>
                <th className="text-center py-3 px-4 font-semibold text-text-primary">Donor Count</th>
                <th className="text-center py-3 px-4 font-semibold text-text-primary">Potential Revenue</th>
                <th className="text-left py-3 px-4 font-semibold text-text-primary">Suggested Action</th>
                <th className="text-center py-3 px-4 font-semibold text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {segments.map((segment) => (
                <tr key={segment.id} className="border-b border-base-200 hover:bg-base-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="text-crimson-blue">{segment.icon}</div>
                      <div>
                        <h4 className="font-semibold text-text-primary">{segment.funName}</h4>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="group relative">
                      <p className="text-sm text-text-secondary cursor-help">
                        {segment.originalName}
                      </p>
                      <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-2 px-3 whitespace-nowrap z-10">
                        Based on donor behavior analysis including gift history, frequency, and engagement patterns
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="font-bold text-lg text-text-primary">{segment.count.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="group relative">
                      <span className="font-bold text-lg text-green-600 cursor-help">
                        ${segment.potentialRevenue.toLocaleString()}
                      </span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-2 px-3 whitespace-nowrap z-10">
                        Estimated: Avg gift × donor count × 20% conversion rate
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-text-secondary">{segment.suggestedAction}</p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="grid grid-cols-3 gap-1 max-w-xs mx-auto">
                      {/* Primary Actions Row */}
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex items-center justify-center gap-1 text-xs font-medium px-2 py-1"
                        title="View donor list with contact info"
                        onClick={() => {
                          setSelectedSegment({ id: segment.id, name: segment.funName });
                          setShowDonorList(true);
                        }}
                      >
                        <ListBulletIcon className="w-3 h-3" />
                        View List
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex items-center justify-center gap-1 text-xs font-medium px-2 py-1"
                        title="Create exportable smart list"
                        onClick={() => {
                          setSelectedSegment({ id: segment.id, name: segment.funName });
                          setShowSmartListBuilder(true);
                        }}
                      >
                        <DocumentTextIcon className="w-3 h-3" />
                        Smart List
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex items-center justify-center gap-1 text-xs font-medium px-2 py-1"
                        title="Launch targeted campaign"
                        onClick={() => {
                          setSelectedSegment({ id: segment.id, name: segment.funName });
                          setShowCampaignBuilder(true);
                        }}
                      >
                        <EnvelopeIcon className="w-3 h-3" />
                        Campaign
                      </Button>

                      {/* Secondary Actions Row */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center justify-center gap-1 text-xs font-medium px-2 py-1"
                        title="Get AI-suggested ask amounts"
                        onClick={() => {
                          setSelectedSegment({ id: segment.id, name: segment.funName });
                          setShowPredictiveScoring(true);
                        }}
                      >
                        <CurrencyDollarIcon className="w-3 h-3" />
                        Ask Amounts
                      </Button>
                      <ActionButton
                        type="calendar"
                        eventTitle={`Follow up with ${segment.funName}`}
                        eventDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()}
                        variant="outline"
                        size="sm"
                        className="flex items-center justify-center gap-1 text-xs font-medium px-2 py-1"
                        title="Schedule follow-up reminders"
                      >
                        <ClockIcon className="w-3 h-3" />
                        Schedule
                      </ActionButton>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center justify-center gap-1 text-xs font-medium px-2 py-1"
                        title="Generate AI call script"
                        onClick={() => {
                          setSelectedSegment({ id: segment.id, name: segment.funName });
                          setShowCallScript(true);
                        }}
                      >
                        <DocumentTextIcon className="w-3 h-3" />
                        Script
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Revenue Opportunity Tracker */}
      <Card title="Revenue Opportunity Tracker" className="bg-green-50 border-green-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <h4 className="text-2xl font-bold text-green-600">$280,700</h4>
            <p className="text-sm text-green-700">Total Potential</p>
          </div>
          <div className="text-center">
            <h4 className="text-2xl font-bold text-blue-600">$42,105</h4>
            <p className="text-sm text-blue-700">In Progress (15%)</p>
          </div>
          <div className="text-center">
            <h4 className="text-2xl font-bold text-orange-600">$238,595</h4>
            <p className="text-sm text-orange-700">Untapped (85%)</p>
          </div>
          <div className="text-center">
            <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
              <SparklesIcon className="w-4 h-4" />
              Start Campaign
            </Button>
          </div>
        </div>
        <div className="mt-4 bg-gray-200 rounded-full h-3">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full" style={{width: '15%'}}></div>
        </div>
        <p className="text-xs text-gray-600 mt-2">Progress: 15% of potential revenue being actively pursued</p>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Segment Performance" className="lg:col-span-2">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
              <div>
                <h5 className="font-semibold text-green-800">Highest Potential Revenue</h5>
                <p className="text-sm text-green-600">Comeback Crew - ~$113,000 potential</p>
              </div>
              <SparklesIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div>
                <h5 className="font-semibold text-blue-800">Major Gift Opportunity</h5>
                <p className="text-sm text-blue-600">Neighborhood MVPs - ~$104,000 potential</p>
              </div>
              <SparklesIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div>
                <h5 className="font-semibold text-purple-800">Largest Segment</h5>
                <p className="text-sm text-purple-600">Comeback Crew - 1,571 donors</p>
              </div>
              <SparklesIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div>
                <h5 className="font-semibold text-orange-800">High-Value, Low Volume</h5>
                <p className="text-sm text-orange-600">Quiet Giants - 7 donors, ~$6,000 potential</p>
              </div>
              <SparklesIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card title="Power Actions">
            <div className="space-y-3">
              <ActionButton
                type="email"
                email="all-segments@campaign.com"
                subject="Multi-Segment Campaign Launch"
                body="Launching coordinated campaign across all segments..."
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white flex items-center justify-center gap-2"
              >
                <SparklesIcon className="w-4 h-4" />
                Launch Multi-Segment Campaign
              </ActionButton>
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex items-center justify-center gap-2"
                onClick={() => setShowPredictiveScoring(!showPredictiveScoring)}
              >
                <CurrencyDollarIcon className="w-4 h-4" />
                Generate All Ask Amounts
              </Button>
              <ActionButton
                type="export"
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white flex items-center justify-center gap-2"
              >
                <PhoneIcon className="w-4 h-4" />
                Create Call Lists
              </ActionButton>
              <ActionButton
                type="export"
                variant="secondary"
                className="w-full flex items-center justify-center gap-2"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Export to Excel
              </ActionButton>
              <Button
                variant="secondary"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => {
                  setSelectedSegment({ id: 'all', name: 'All Segments' });
                  setShowCallScript(true);
                }}
              >
                <EnvelopeIcon className="w-4 h-4" />
                Email Templates
              </Button>
            </div>
          </Card>
          
          <Card title="AI Recommendations">
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-yellow-800"><strong>Priority Action:</strong> Call "Neighborhood MVPs" first - highest revenue per donor (~$343 each).</p>
                  </div>
                  <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs">Do It</Button>
                </div>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-blue-800"><strong>Best Timing:</strong> "Comeback Crew" shows 40% higher engagement on Tuesdays at 10 AM.</p>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs">Schedule</Button>
                </div>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-green-800"><strong>Smart Combo:</strong> Combine "First Gift Friends" + "New Faces Welcome" for 67% higher retention.</p>
                  </div>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs">Create</Button>
                </div>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-purple-800"><strong>Hot Lead:</strong> 3 "Quiet Giants" haven't been contacted in 6+ months. Immediate opportunity!</p>
                  </div>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs">Call Now</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Predictive Scoring */}
      {showPredictiveScoring && (
        <PredictiveScoring
          segmentId={selectedSegment.id || 'all'}
          segmentName={selectedSegment.name || 'All Segments'}
          isOpen={showPredictiveScoring}
          onClose={() => setShowPredictiveScoring(false)}
        />
      )}

      {/* Call Script Generator Modal */}
      <CallScriptGenerator
        segmentId={selectedSegment.id}
        segmentName={selectedSegment.name}
        isOpen={showCallScript}
        onClose={() => setShowCallScript(false)}
      />

      {/* Donor List View Modal */}
      {showDonorList && (
        <DonorListView
          segmentId={selectedSegment.id}
          segmentName={selectedSegment.name}
          isOpen={showDonorList}
          onClose={() => setShowDonorList(false)}
        />
      )}

      {/* Smart List Builder Modal */}
      {showSmartListBuilder && (
        <SmartListBuilder
          segmentId={selectedSegment.id}
          segmentName={selectedSegment.name}
          isOpen={showSmartListBuilder}
          onClose={() => setShowSmartListBuilder(false)}
        />
      )}

      {/* Campaign Builder Modal */}
      {showCampaignBuilder && (
        <CampaignBuilder
          segmentId={selectedSegment.id}
          segmentName={selectedSegment.name}
          isOpen={showCampaignBuilder}
          onClose={() => setShowCampaignBuilder(false)}
        />
      )}
    </div>
  );
};

export default SegmentsDashboard;
