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
  DocumentTextIcon
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

const DonorProfile: React.FC<DonorProfileProps> = ({ donor }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'intelligence' | 'actions' | 'insights'>('overview');

  // Helper functions
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

  return (
    <div className="space-y-6">
      {/* Action-Oriented Header */}
      <Card>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Info */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="relative">
              <img src={donor.photoUrl} alt={donor.name} className="w-24 h-24 rounded-full mb-3 ring-4 ring-crimson-blue/20" />
              {donor.urgencyIndicators?.isHotLead && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <FireIcon className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold text-text-primary">{donor.name}</h2>
            <p className="text-sm text-text-secondary">{donor.email}</p>
            <p className="text-sm text-text-secondary">{donor.phone}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {donor.aiBadges.slice(0, 2).map(badge => (
                <Badge key={badge} color="blue" className="text-xs">{badge}</Badge>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h3>
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
                onClick={handleQuickEmail}
                className="w-full justify-start text-sm py-2"
                variant="secondary"
              >
                <MailIcon className="w-4 h-4 mr-2" />
                Send Email
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

          {/* Contact Intelligence */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Contact Intelligence</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Last Contact:</span>
                <span className="font-medium">
                  {donor.contactIntelligence ? formatLastContact(donor.contactIntelligence.lastContactDate) : 'Unknown'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneIcon className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Prefers:</span>
                <span className="font-medium capitalize">
                  {donor.contactIntelligence?.preferredContactMethod || 'Phone'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Best Time:</span>
                <span className="font-medium text-xs">
                  {donor.contactIntelligence?.bestContactTimes?.[0] || 'Business hours'}
                </span>
              </div>
            </div>
          </div>

          {/* Urgency & Insights */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">AI Insights</h3>
            <div className="space-y-2">
              {donor.urgencyIndicators && (
                <div className={`px-3 py-2 rounded-lg border text-xs font-medium ${getUrgencyColor(donor.urgencyIndicators.urgencyLevel)}`}>
                  <div className="flex items-center gap-1">
                    <ExclamationTriangleIcon className="w-3 h-3" />
                    {donor.urgencyIndicators.urgencyLevel.toUpperCase()} PRIORITY
                  </div>
                  <div className="mt-1 text-xs opacity-90">
                    {donor.urgencyIndicators.urgencyReason}
                  </div>
                </div>
              )}

              {donor.predictiveInsights?.nextBestAction && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                  <div className="flex items-center gap-1 text-blue-800 text-xs font-medium">
                    <BoltIcon className="w-3 h-3" />
                    NEXT BEST ACTION
                  </div>
                  <div className="text-xs text-blue-700 mt-1">
                    {donor.predictiveInsights.nextBestAction.action}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    {donor.predictiveInsights.nextBestAction.confidence}% confidence
                  </div>
                </div>
              )}
            </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Giving Overview */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Giving Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-text-secondary">Total Raised</p>
                    <p className="text-2xl font-bold text-crimson-blue">${donor.givingOverview.totalRaised.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-text-secondary">Consecutive Gifts</p>
                    <p className="text-2xl font-bold text-green-600">{donor.givingOverview.consecutiveGifts}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-text-secondary">Tier</p>
                    <p className="text-lg font-semibold text-orange-600">{donor.givingOverview.tier}</p>
                  </div>
                </div>
                <div style={{ width: '100%', height: 250 }}>
                  <ResponsiveContainer>
                    <BarChart data={donor.givingOverview.topGifts} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${value/1000}k`} />
                      <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} cursor={{fill: 'rgba(47, 127, 195, 0.1)'}} />
                      <Bar dataKey="value" fill="#2f7fc3" barSize={40} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              {/* AI Snapshot */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <SparklesIcon className="w-5 h-5 text-crimson-blue" />
                  <h3 className="text-lg font-semibold text-text-primary">AI Snapshot</h3>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">{donor.aiSnapshot}</p>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 gap-3">
                  <Button onClick={handleQuickEmail} className="justify-start">
                    <MailIcon className="w-4 h-4 mr-2" /> Send Email
                  </Button>
                  <Button onClick={handleQuickCall} variant="secondary" className="justify-start">
                    <PhoneIcon className="w-4 h-4 mr-2" /> Call Now
                  </Button>
                  <Button onClick={handleScheduleMeeting} variant="secondary" className="justify-start">
                    <CalendarIcon className="w-4 h-4 mr-2" /> Schedule Meeting
                  </Button>
                  <Button variant="secondary" className="justify-start">
                    <DocumentTextIcon className="w-4 h-4 mr-2" /> Add Note
                  </Button>
                </div>
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

            {/* Website Behavior */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ComputerDesktopIcon className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-text-primary">Website Behavior</h3>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-purple-700">Last Visit:</span>
                    <span className="font-medium text-purple-800">{donor.actionMetrics.websiteBehavior.lastVisit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Pages Viewed:</span>
                    <span className="font-medium text-purple-800">{donor.actionMetrics.websiteBehavior.pagesViewed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Time Spent:</span>
                    <span className="font-medium text-purple-800">{donor.actionMetrics.websiteBehavior.timeSpent} minutes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media & Volunteer Activities */}
            <div className="space-y-4">
              {/* Social Media Engagement */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <HeartIcon className="w-5 h-5 text-pink-600" />
                  <h3 className="text-lg font-semibold text-text-primary">Social Media</h3>
                </div>
                <div className="space-y-2">
                  {donor.actionMetrics.socialMediaEngagement.map((social, index) => (
                    <div key={index} className="bg-pink-50 border border-pink-200 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-pink-900">{social.platform}</div>
                          <div className="text-sm text-pink-700">{social.activity}</div>
                        </div>
                        <div className="text-xs text-pink-600">{social.lastEngagement}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Volunteer Activities */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <UserGroupIcon className="w-5 h-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-text-primary">Volunteer Activities</h3>
                </div>
                <div className="space-y-1">
                  {donor.actionMetrics.volunteerActivities.map((activity, index) => (
                    <div key={index} className="bg-orange-50 border border-orange-200 rounded px-3 py-2">
                      <span className="text-orange-800 text-sm">{activity}</span>
                    </div>
                  ))}
                </div>
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

            {/* Donation Likelihood */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUpIcon className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-text-primary">Donation Likelihood</h3>
              </div>
              <div className="space-y-3">
                {[
                  { period: 'Next 30 Days', value: donor.predictiveInsights.donationLikelihood.next30Days, color: 'green' },
                  { period: 'Next 60 Days', value: donor.predictiveInsights.donationLikelihood.next60Days, color: 'blue' },
                  { period: 'Next 90 Days', value: donor.predictiveInsights.donationLikelihood.next90Days, color: 'purple' }
                ].map((item, index) => (
                  <div key={index} className={`bg-${item.color}-50 border border-${item.color}-200 rounded-lg p-3`}>
                    <div className="flex justify-between items-center">
                      <span className={`text-${item.color}-700 font-medium`}>{item.period}</span>
                      <span className={`text-${item.color}-800 font-bold`}>{item.value}%</span>
                    </div>
                    <div className={`w-full bg-${item.color}-200 rounded-full h-2 mt-2`}>
                      <div
                        className={`bg-${item.color}-600 h-2 rounded-full`}
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
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

            {/* Upsell Opportunities */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrophyIcon className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-text-primary">Upsell Opportunities</h3>
              </div>
              <div className="space-y-3">
                {donor.predictiveInsights.upsellOpportunities.map((opportunity, index) => (
                  <div key={index} className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-indigo-900">{opportunity.type}</div>
                        <div className="text-sm text-indigo-700">Timing: {opportunity.timing}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-indigo-800">${opportunity.amount.toLocaleString()}</div>
                        <div className="text-xs text-indigo-600">{opportunity.confidence}% confidence</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DonorProfile;