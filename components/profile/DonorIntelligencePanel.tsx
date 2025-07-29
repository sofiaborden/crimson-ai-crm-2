import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import {
  SparklesIcon,
  BrainIcon,
  TrendingUpIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  LightBulbIcon,
  FireIcon,
  HeartIcon,
  CalendarIcon,
  PhoneIcon,
  MailIcon
} from '../../constants';
import { RadialBarChart, RadialBar, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface DonorIntelligencePanelProps {
  donorId: string;
  donorName: string;
}

const ScoreGauge: React.FC<{
  score: number;
  label: string;
  color: string;
  maxScore?: number;
}> = ({ score, label, color, maxScore = 100 }) => {
  const data = [
    { name: 'score', value: score, fill: color },
    { name: 'remaining', value: maxScore - score, fill: '#f3f4f6' }
  ];

  return (
    <div className="text-center">
      <div className="relative w-24 h-24 mx-auto">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={data}>
            <RadialBar dataKey="value" cornerRadius={10} fill={color} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-900">{score}</span>
        </div>
      </div>
      <p className="text-sm font-medium text-gray-700 mt-2">{label}</p>
    </div>
  );
};

const PredictionCard: React.FC<{
  title: string;
  prediction: string;
  confidence: number;
  timeframe: string;
  action: string;
  icon: React.ReactNode;
  color: string;
}> = ({ title, prediction, confidence, timeframe, action, icon, color }) => (
  <div className={`bg-gradient-to-r ${color} rounded-xl p-4 border shadow-sm`}>
    <div className="flex items-start gap-3">
      <div className="bg-white p-2 rounded-lg shadow-sm">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-gray-900 text-sm mb-1">{title}</h4>
        <p className="text-sm text-gray-700 mb-2">{prediction}</p>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">{timeframe}</span>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">{confidence}% confident</span>
            <Button variant="secondary" size="xs">{action}</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const RiskAlert: React.FC<{
  type: 'churn' | 'opportunity' | 'engagement';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  action: string;
}> = ({ type, message, severity, action }) => {
  const getAlertColor = () => {
    switch (severity) {
      case 'critical': return 'bg-red-50 border-red-200 text-red-800';
      case 'high': return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'churn': return <ExclamationTriangleIcon className="w-4 h-4" />;
      case 'opportunity': return <TrendingUpIcon className="w-4 h-4" />;
      case 'engagement': return <HeartIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className={`rounded-lg p-3 border ${getAlertColor()}`}>
      <div className="flex items-start gap-2">
        {getIcon()}
        <div className="flex-1">
          <p className="text-sm font-medium mb-1">{message}</p>
          <Button variant="secondary" size="xs" className="text-xs">
            {action}
          </Button>
        </div>
      </div>
    </div>
  );
};

const DonorIntelligencePanel: React.FC<DonorIntelligencePanelProps> = ({ donorId, donorName }) => {
  const [activeView, setActiveView] = useState<'overview' | 'predictions' | 'risks' | 'optimization'>('overview');

  // Mock AI intelligence data
  const intelligenceScores = {
    givingCapacity: 87,
    engagementLevel: 92,
    churnRisk: 23,
    upgradeOpportunity: 78,
    responseRate: 85,
    loyaltyScore: 94
  };

  const predictions = [
    {
      title: "Next Gift Timing",
      prediction: "Likely to give again within 30-45 days",
      confidence: 89,
      timeframe: "Next 6 weeks",
      action: "Schedule Ask",
      icon: <CalendarIcon className="w-4 h-4 text-green-600" />,
      color: "from-green-50 to-emerald-50 border-green-200"
    },
    {
      title: "Optimal Ask Amount",
      prediction: "$750 - $1,200 range shows highest success probability",
      confidence: 84,
      timeframe: "Current capacity",
      action: "Generate Script",
      icon: <CurrencyDollarIcon className="w-4 h-4 text-blue-600" />,
      color: "from-blue-50 to-indigo-50 border-blue-200"
    },
    {
      title: "Communication Preference",
      prediction: "Phone calls on Tuesday-Thursday afternoons",
      confidence: 91,
      timeframe: "Based on response patterns",
      action: "Schedule Call",
      icon: <PhoneIcon className="w-4 h-4 text-purple-600" />,
      color: "from-purple-50 to-violet-50 border-purple-200"
    },
    {
      title: "Peer Influence",
      prediction: "Responds well to social proof and peer comparisons",
      confidence: 76,
      timeframe: "Messaging strategy",
      action: "Craft Message",
      icon: <UserGroupIcon className="w-4 h-4 text-orange-600" />,
      color: "from-orange-50 to-amber-50 border-orange-200"
    }
  ];

  const riskAlerts = [
    {
      type: 'engagement' as const,
      message: 'Email open rates declining over past 3 months',
      severity: 'medium' as const,
      action: 'Switch to phone outreach'
    },
    {
      type: 'opportunity' as const,
      message: 'Similar donors increased giving by 40% this quarter',
      severity: 'high' as const,
      action: 'Schedule upgrade conversation'
    },
    {
      type: 'churn' as const,
      message: 'No response to last 2 communications',
      severity: 'high' as const,
      action: 'Personal outreach needed'
    }
  ];

  const peerComparison = [
    { category: 'Giving Frequency', donor: 85, peers: 72 },
    { category: 'Response Rate', donor: 92, peers: 68 },
    { category: 'Engagement Score', donor: 88, peers: 75 },
    { category: 'Loyalty Index', donor: 94, peers: 81 }
  ];

  return (
    <div className="space-y-6">
      {/* Intelligence Overview Header */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-xl">
              <BrainIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">AI Donor Intelligence</h2>
              <p className="text-sm text-gray-600">Real-time insights for {donorName}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={activeView === 'overview' ? 'primary' : 'secondary'} 
              size="sm"
              onClick={() => setActiveView('overview')}
            >
              Overview
            </Button>
            <Button 
              variant={activeView === 'predictions' ? 'primary' : 'secondary'} 
              size="sm"
              onClick={() => setActiveView('predictions')}
            >
              Predictions
            </Button>
            <Button 
              variant={activeView === 'risks' ? 'primary' : 'secondary'} 
              size="sm"
              onClick={() => setActiveView('risks')}
            >
              Alerts
            </Button>
          </div>
        </div>

        {/* Intelligence Scores Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-6">
          <ScoreGauge score={intelligenceScores.givingCapacity} label="Giving Capacity" color="#10b981" />
          <ScoreGauge score={intelligenceScores.engagementLevel} label="Engagement" color="#3b82f6" />
          <ScoreGauge score={100 - intelligenceScores.churnRisk} label="Retention" color="#8b5cf6" />
          <ScoreGauge score={intelligenceScores.upgradeOpportunity} label="Upgrade Potential" color="#f59e0b" />
          <ScoreGauge score={intelligenceScores.responseRate} label="Response Rate" color="#06b6d4" />
          <ScoreGauge score={intelligenceScores.loyaltyScore} label="Loyalty Score" color="#ef4444" />
        </div>
      </Card>

      {/* Dynamic Content Based on Active View */}
      {activeView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Peer Comparison */}
          <Card>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Performance vs. Peers</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={peerComparison} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="donor" fill="#2f7fc3" name={donorName} />
                  <Bar dataKey="peers" fill="#94a3b8" name="Peer Average" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Quick Insights */}
          <Card>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Key Insights</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <TrendingUpIcon className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">High Engagement</p>
                  <p className="text-sm text-green-700">Above average response rates</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <LightBulbIcon className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Upgrade Opportunity</p>
                  <p className="text-sm text-blue-700">Ready for larger ask amount</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <HeartIcon className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-900">Loyal Supporter</p>
                  <p className="text-sm text-purple-700">Consistent giving pattern</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeView === 'predictions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {predictions.map((prediction, index) => (
            <PredictionCard key={index} {...prediction} />
          ))}
        </div>
      )}

      {activeView === 'risks' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-bold text-gray-900">Risk Alerts & Opportunities</h3>
          </div>
          {riskAlerts.map((alert, index) => (
            <RiskAlert key={index} {...alert} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DonorIntelligencePanel;
