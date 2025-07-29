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
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  StarIcon
} from '../../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, CartesianGrid } from 'recharts';

interface EnhancedDonorProfileProps {
  donor: Donor;
}

const AIInsightCard: React.FC<{
  title: string;
  insight: string;
  confidence: number;
  action?: string;
  icon: React.ReactNode;
  color: string;
}> = ({ title, insight, confidence, action, icon, color }) => (
  <div className={`bg-gradient-to-r ${color} rounded-xl p-4 border shadow-sm hover:shadow-md transition-all duration-300`}>
    <div className="flex items-start gap-3">
      <div className="bg-white p-2 rounded-lg shadow-sm">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-gray-900 text-sm">{title}</h4>
          <div className="flex items-center gap-1">
            <StarIcon className="w-3 h-3 text-yellow-500" />
            <span className="text-xs font-semibold text-gray-700">{confidence}%</span>
          </div>
        </div>
        <p className="text-sm text-gray-700 mb-3 leading-relaxed">{insight}</p>
        {action && (
          <Button variant="secondary" size="xs" className="font-medium">
            {action}
          </Button>
        )}
      </div>
    </div>
  </div>
);

const QuickActionButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  badge?: string;
}> = ({ icon, label, onClick, variant = 'secondary', badge }) => (
  <div className="relative">
    <Button
      variant={variant}
      size="sm"
      onClick={onClick}
      className="flex items-center gap-2 w-full justify-center font-medium"
    >
      {icon}
      {label}
    </Button>
    {badge && (
      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
        {badge}
      </div>
    )}
  </div>
);

const MetricCard: React.FC<{
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'stable';
  color?: string;
  subtitle?: string;
}> = ({ label, value, trend, color = 'text-gray-900', subtitle }) => (
  <div className="text-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-center gap-1 mb-1">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      {trend && (
        <TrendingUpIcon className={`w-4 h-4 ${
          trend === 'up' ? 'text-green-500' : 
          trend === 'down' ? 'text-red-500 rotate-180' : 
          'text-gray-400'
        }`} />
      )}
    </div>
    <p className="text-sm font-medium text-gray-600">{label}</p>
    {subtitle && (
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    )}
  </div>
);

const EnhancedDonorProfile: React.FC<EnhancedDonorProfileProps> = ({ donor }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'intelligence' | 'actions' | 'insights'>('overview');

  // Mock AI insights data
  const aiInsights = [
    {
      title: "Optimal Ask Amount",
      insight: "Based on giving history and peer analysis, suggest $750 for next ask",
      confidence: 92,
      action: "Generate Ask Script",
      icon: <CurrencyDollarIcon className="w-4 h-4 text-green-600" />,
      color: "from-green-50 to-emerald-50 border-green-200"
    },
    {
      title: "Best Contact Time",
      insight: "Tuesday-Thursday, 2-4 PM shows highest response rates",
      confidence: 87,
      action: "Schedule Call",
      icon: <ClockIcon className="w-4 h-4 text-blue-600" />,
      color: "from-blue-50 to-indigo-50 border-blue-200"
    },
    {
      title: "Engagement Risk",
      insight: "No contact in 45 days. Risk of disengagement increasing",
      confidence: 78,
      action: "Send Follow-up",
      icon: <ExclamationTriangleIcon className="w-4 h-4 text-orange-600" />,
      color: "from-orange-50 to-amber-50 border-orange-200"
    },
    {
      title: "Upgrade Opportunity",
      insight: "Similar donors increased giving by 40% after personal meeting",
      confidence: 85,
      action: "Schedule Meeting",
      icon: <TrophyIcon className="w-4 h-4 text-purple-600" />,
      color: "from-purple-50 to-violet-50 border-purple-200"
    }
  ];

  // Mock giving history data
  const givingHistory = [
    { month: 'Jan', amount: 250, interactions: 3 },
    { month: 'Feb', amount: 0, interactions: 1 },
    { month: 'Mar', amount: 500, interactions: 4 },
    { month: 'Apr', amount: 250, interactions: 2 },
    { month: 'May', amount: 750, interactions: 5 },
    { month: 'Jun', amount: 0, interactions: 1 }
  ];

  const handleQuickCall = () => {
    alert(`📞 Calling ${donor.name}\n\nAI Suggested Script:\n"Hi ${donor.name.split(' ')[0]}, this is Sofia from the campaign. I hope you're doing well! I wanted to follow up on our conversation about the upcoming election. Based on your previous support, I think you'd be interested in our new voter outreach initiative..."\n\nSuggested ask: $${donor.predictiveAsk.toLocaleString()}`);
  };

  const handleQuickEmail = () => {
    alert(`✉️ AI-Generated Email Draft:\n\nSubject: Your impact in action - see what your support accomplished\n\nHi ${donor.name.split(' ')[0]},\n\nI hope this finds you well! I wanted to share some exciting updates on how your generous support has been making a real difference...\n\n[Personalized content based on donor interests and giving history]\n\nBest regards,\nSofia`);
  };

  const handleScheduleMeeting = () => {
    alert(`📅 Smart Scheduling Assistant:\n\nBest times for ${donor.name}:\n• Tuesday, 2:00 PM - 4:00 PM (87% response rate)\n• Wednesday, 10:00 AM - 12:00 PM (82% response rate)\n• Thursday, 3:00 PM - 5:00 PM (79% response rate)\n\nPreferred location: Coffee meeting (based on past preferences)\nSuggested agenda: Discuss upcoming initiatives, thank for past support, explore increased engagement`);
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header with AI Insights */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-crimson-blue to-blue-600 text-white p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Profile Info */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="relative">
                <img 
                  src={donor.photoUrl} 
                  alt={donor.name} 
                  className="w-24 h-24 rounded-full mb-3 ring-4 ring-white/30 shadow-lg" 
                />
                {donor.urgencyIndicators?.isHotLead && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                    <FireIcon className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  {donor.givingIntelligence?.capacityScore || 85}% Match
                </div>
              </div>
              <h2 className="text-xl font-bold">{donor.name}</h2>
              <p className="text-blue-100">{donor.email}</p>
              <p className="text-blue-100">{donor.phone}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {donor.aiBadges.slice(0, 3).map(badge => (
                  <Badge key={badge} className="bg-white/20 text-white border-white/30 text-xs">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Key Metrics */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard
                  label="Total Given"
                  value={`$${donor.givingOverview.totalRaised.toLocaleString()}`}
                  trend="up"
                  color="text-white"
                />
                <MetricCard
                  label="Avg Gift"
                  value={`$${Math.round(donor.givingOverview.totalRaised / donor.givingOverview.consecutiveGifts)}`}
                  trend="stable"
                  color="text-white"
                />
                <MetricCard
                  label="Engagement"
                  value="87%"
                  trend="up"
                  color="text-white"
                  subtitle="vs peers"
                />
                <MetricCard
                  label="Next Ask"
                  value={`$${donor.predictiveAsk.toLocaleString()}`}
                  color="text-white"
                  subtitle="AI suggested"
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <h3 className="font-semibold text-white/90 text-sm">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <QuickActionButton
                  icon={<PhoneIcon className="w-4 h-4" />}
                  label="Call"
                  onClick={handleQuickCall}
                  variant="secondary"
                />
                <QuickActionButton
                  icon={<MailIcon className="w-4 h-4" />}
                  label="Email"
                  onClick={handleQuickEmail}
                  variant="secondary"
                />
                <QuickActionButton
                  icon={<CalendarIcon className="w-4 h-4" />}
                  label="Meeting"
                  onClick={handleScheduleMeeting}
                  variant="secondary"
                />
                <QuickActionButton
                  icon={<BellIcon className="w-4 h-4" />}
                  label="Remind"
                  onClick={() => alert('Setting smart reminder...')}
                  variant="secondary"
                  badge="3"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* AI Insights Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <SparklesIcon className="w-5 h-5 text-crimson-blue" />
          <h3 className="text-lg font-bold text-gray-900">AI-Powered Insights</h3>
          <Badge className="bg-green-100 text-green-800 border-green-200">Live</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiInsights.map((insight, index) => (
            <AIInsightCard key={index} {...insight} />
          ))}
        </div>
      </div>

      {/* Enhanced Giving History */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Giving Journey</h3>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">6 Months</Button>
            <Button variant="secondary" size="sm">1 Year</Button>
            <Button variant="primary" size="sm">All Time</Button>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={givingHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#2f7fc3" 
                strokeWidth={3}
                dot={{ fill: '#2f7fc3', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#2f7fc3', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default EnhancedDonorProfile;
