import React, { useState, useEffect } from 'react';
import { SparklesIcon, XMarkIcon, LightBulbIcon, BoltIcon, EyeIcon, CheckCircleIcon, ArrowPathIcon, CurrencyDollarIcon, UserGroupIcon, EnvelopeIcon } from '../../constants';

interface LiveInsight {
  id: string;
  icon: string;
  message: string;
  action?: string;
  priority: 'high' | 'medium' | 'low';
}

interface CrimsonGPTProps {
  isOpen: boolean;
  onClose: () => void;
}

const CrimsonGPTPanel: React.FC<CrimsonGPTProps> = ({ isOpen, onClose }) => {
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const liveInsights: LiveInsight[] = [
    {
      id: '1',
      icon: '🧩',
      message: 'You have 2,942 donors missing party data. Want to predict and fill now?',
      action: 'Fill Missing Data',
      priority: 'high'
    },
    {
      id: '2', 
      icon: '💡',
      message: 'Joseph Banks is ready for a $500 ask this month based on past giving.',
      action: 'View Profile',
      priority: 'high'
    },
    {
      id: '3',
      icon: '🔄',
      message: '12 donors are due to give again this month. Want to send reminders?',
      action: 'Send Reminders',
      priority: 'medium'
    },
    {
      id: '4',
      icon: '📈',
      message: 'Las Vegas market shows 23% higher response rates this week.',
      action: 'View Market',
      priority: 'medium'
    },
    {
      id: '5',
      icon: '⚡',
      message: 'Inner Circle segment has $47K untapped potential this quarter.',
      action: 'Create Campaign',
      priority: 'high'
    }
  ];

  const exampleQuestions = [
    "Which donors are ready for a new ask this month?",
    "Show me lapsed donors by state with $ potential.",
    "Who are my top upgrade candidates this quarter?",
    "Predict Joseph Banks' next likely donation amount.",
    "Who gave over $250 last cycle but hasn't given in 6 months?",
    "Find donors similar to my top 10 contributors.",
    "Which segments have the highest ROI potential?",
    "Show me donors with employer matching opportunities."
  ];

  const capabilities = [
    "Predictive ask amounts based on giving history",
    "Recurrence prediction (who is likely to give soon)",
    "Donor segmentation insights (e.g., top GOP donors in FL)",
    "Data health alerts (missing emails/phones)",
    "AI persona summaries for major donors",
    "Geographic market analysis and timing",
    "Upgrade opportunity identification",
    "Churn risk assessment and prevention"
  ];

  const limitations = [
    "CrimsonGPT uses your internal data only.",
    "Cannot send emails, call, or export directly (yet).",
    "Responses are as current as your last data sync.",
    "Be specific - may be inaccurate if questions are too vague.",
    "Limited to fundraising and donor management queries."
  ];

  useEffect(() => {
    if (isOpen) {
      const timer = setInterval(() => {
        setCurrentInsightIndex((prev) => (prev + 1) % liveInsights.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [isOpen, liveInsights.length]);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'smart-segment':
        setInputValue('Create a smart segment for high-value donors ready for upgrade');
        break;
      case 'ai-insights':
        setInputValue('Show me AI insights for my top 20 donors this month');
        break;
      case 'analyze-profile':
        setInputValue('Analyze Joseph Banks profile and suggest next best action');
        break;
      case 'data-health':
        setInputValue('Run a data health check and show missing information priorities');
        break;
    }
  };

  const handleExampleClick = (question: string) => {
    setInputValue(question);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      // Here you would integrate with your AI backend
      alert(`CrimsonGPT would process: "${inputValue}"\n\nThis would connect to your AI backend for real insights!`);
      setInputValue('');
    }
  };

  if (!isOpen) return null;

  const currentInsight = liveInsights[currentInsightIndex];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-crimson-blue to-crimson-accent-blue text-white">
          <div className="flex items-center gap-3">
            <SparklesIcon className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">CrimsonGPT Beta</h2>
              <p className="text-sm opacity-90">AI-powered fundraising intelligence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Live AI Insights Strip */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="text-2xl">{currentInsight.icon}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{currentInsight.message}</p>
              </div>
            </div>
            {currentInsight.action && (
              <button className="bg-crimson-blue text-white px-3 py-1 rounded text-xs font-medium hover:bg-crimson-dark-blue transition-colors">
                {currentInsight.action}
              </button>
            )}
          </div>
          <div className="flex gap-1 mt-2">
            {liveInsights.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentInsightIndex ? 'bg-crimson-blue w-8' : 'bg-gray-300 w-2'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Quick Actions */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                onClick={() => handleQuickAction('smart-segment')}
                className="flex items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors text-left"
              >
                <SparklesIcon className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-900">Create Smart Segment</span>
              </button>
              <button
                onClick={() => handleQuickAction('ai-insights')}
                className="flex items-center gap-2 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors text-left"
              >
                <LightBulbIcon className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium text-purple-900">View AI Insights</span>
              </button>
              <button
                onClick={() => handleQuickAction('analyze-profile')}
                className="flex items-center gap-2 p-3 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors text-left"
              >
                <EyeIcon className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-900">Analyze Donor Profile</span>
              </button>
              <button
                onClick={() => handleQuickAction('data-health')}
                className="flex items-center gap-2 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors text-left"
              >
                <CheckCircleIcon className="w-4 h-4 text-orange-600" />
                <span className="text-xs font-medium text-orange-900">Run Data Health Check</span>
              </button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Examples */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <LightBulbIcon className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">What Can I Ask?</h3>
              </div>
              <div className="space-y-2">
                {exampleQuestions.slice(0, 4).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(question)}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
                  >
                    "{question}"
                  </button>
                ))}
              </div>
            </div>

            {/* Capabilities */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BoltIcon className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">Capabilities</h3>
              </div>
              <div className="space-y-2">
                {capabilities.slice(0, 5).map((capability, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{capability}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Limitations */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <XMarkIcon className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-gray-900">Limitations</h3>
              </div>
              <div className="space-y-2">
                {limitations.map((limitation, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                    <span>{limitation}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weekly Insights Subscription */}
          <div className="mt-6 p-4 bg-gradient-to-r from-crimson-blue/10 to-crimson-accent-blue/10 rounded-lg border border-crimson-blue/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <EnvelopeIcon className="w-5 h-5 text-crimson-blue" />
                <div>
                  <h4 className="font-semibold text-gray-900">Weekly AI Insights</h4>
                  <p className="text-sm text-gray-600">Get personalized fundraising insights delivered to your inbox</p>
                </div>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isSubscribed}
                  onChange={(e) => setIsSubscribed(e.target.checked)}
                  className="rounded border-gray-300 text-crimson-blue focus:ring-crimson-blue"
                />
                <span className="text-sm font-medium text-gray-900">Subscribe</span>
              </label>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask CrimsonGPT about your donors, segments, or fundraising strategy..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-crimson-blue focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="px-6 py-3 bg-crimson-blue text-white rounded-lg font-medium hover:bg-crimson-dark-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Ask
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CrimsonGPTPanel;
