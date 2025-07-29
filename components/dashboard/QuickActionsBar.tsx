import React, { useState } from 'react';
import { PhoneIcon, MailIcon, MicrophoneIcon, BoltIcon, UsersIcon, CampaignIcon, HeartIcon, DocumentTextIcon } from '../../constants';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  hoverColor: string;
  action: () => void;
  badge?: string;
  urgent?: boolean;
}

const QuickActionsBar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const handleQuickCall = () => {
    // Simulate opening dialer with next high-priority contact
    alert('📞 Calling Joseph Banks (+1 202-555-0182)\n\nScript: "Hi Joseph, this is Sofia from the campaign. I hope you\'re doing well! I wanted to personally thank you for your continued support..."');
  };

  const handleBulkThankYou = () => {
    // Simulate bulk thank you action
    alert('✉️ Sending personalized thank you messages to 23 recent donors\n\nEstimated completion: 2 minutes\nTemplates: Event-specific, Major donor, First-time donor');
  };

  const handleEmergencyCampaign = () => {
    // Simulate emergency campaign launcher
    alert('🚨 Emergency Campaign Launcher\n\n• Deadline pressure campaign\n• Breaking news response\n• Rapid response fundraising\n• Crisis communication\n\nSelect campaign type to continue...');
  };

  const handleVoiceMemo = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingTime(0);
      // Simulate recording
      const interval = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 30) { // Auto-stop after 30 seconds for demo
            setIsRecording(false);
            clearInterval(interval);
            alert('🎤 Voice memo saved!\n\n"Remember to follow up with Sarah about the gala sponsorship opportunity. She seemed very interested in the VIP package."');
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setIsRecording(false);
      setRecordingTime(0);
      alert('🎤 Voice memo saved!');
    }
  };

  const handleSmartSegments = () => {
    alert('🎯 Smart Segments Ready\n\n• 47 new "High-Value Prospects" identified\n• "Lapsed Major Donors" segment updated\n• "Event Attendees" ready for follow-up\n\nView segments?');
  };

  const handleDonorHealth = () => {
    alert('❤️ Donor Health Check\n\n🔴 3 major donors at risk of lapsing\n🟡 12 donors showing decreased engagement\n🟢 23 donors showing increased interest\n\nView detailed report?');
  };

  const handleQuickReport = () => {
    alert('📊 Quick Report Generated\n\nToday\'s Performance:\n• 12 calls made\n• $2,750 raised\n• 89% goal completion\n• 3 new major donor prospects\n\nEmail full report?');
  };

  const quickActions: QuickAction[] = [
    {
      id: 'quick-call',
      title: 'Quick Call',
      description: 'Call next high-priority prospect',
      icon: <PhoneIcon className="w-5 h-5" />,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      action: handleQuickCall,
      badge: 'Joseph B.',
      urgent: true
    },
    {
      id: 'bulk-thanks',
      title: 'Bulk Thanks',
      description: 'Send thank you messages',
      icon: <HeartIcon className="w-5 h-5" />,
      color: 'bg-crimson-blue',
      hoverColor: 'hover:bg-crimson-dark-blue',
      action: handleBulkThankYou,
      badge: '23 pending'
    },
    {
      id: 'emergency-campaign',
      title: 'Emergency',
      description: 'Launch urgent campaign',
      icon: <BoltIcon className="w-5 h-5" />,
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      action: handleEmergencyCampaign,
      urgent: true
    },
    {
      id: 'voice-memo',
      title: isRecording ? `Recording ${recordingTime}s` : 'Voice Memo',
      description: isRecording ? 'Tap to stop recording' : 'Record quick note',
      icon: <MicrophoneIcon className={`w-5 h-5 ${isRecording ? 'animate-pulse' : ''}`} />,
      color: isRecording ? 'bg-red-500' : 'bg-blue-500',
      hoverColor: isRecording ? 'hover:bg-red-600' : 'hover:bg-blue-600',
      action: handleVoiceMemo
    },
    {
      id: 'smart-segments',
      title: 'Smart Segments',
      description: 'View AI-curated lists',
      icon: <UsersIcon className="w-5 h-5" />,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      action: handleSmartSegments,
      badge: '47 new'
    },
    {
      id: 'donor-health',
      title: 'Donor Health',
      description: 'Check engagement status',
      icon: <HeartIcon className="w-5 h-5" />,
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      action: handleDonorHealth,
      badge: '3 at risk'
    },
    {
      id: 'quick-report',
      title: 'Quick Report',
      description: 'Generate daily summary',
      icon: <DocumentTextIcon className="w-5 h-5" />,
      color: 'bg-indigo-500',
      hoverColor: 'hover:bg-indigo-600',
      action: handleQuickReport
    }
  ];

  // Get top 3 most important actions
  const topActions = quickActions.filter(action =>
    action.urgent || ['quick-call', 'bulk-thanks', 'voice-memo'].includes(action.id)
  ).slice(0, 3);

  const remainingActions = quickActions.filter(action =>
    !topActions.some(topAction => topAction.id === action.id)
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <BoltIcon className="w-4 h-4 text-yellow-500" />
          Quick Actions
        </h3>
        {remainingActions.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span>{isExpanded ? 'Less' : `+${remainingActions.length} more`}</span>
            <svg
              className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Always Visible Top Actions */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {topActions.map((action) => (
          <button
            key={action.id}
            onClick={action.action}
            className={`
              relative group ${action.color} ${action.hoverColor}
              text-white rounded-lg p-2 transition-all duration-200
              hover:scale-105 hover:shadow-md active:scale-95
              ${action.urgent ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}
            `}
          >
            <div className="flex flex-col items-center gap-1">
              {action.icon}
              <span className="text-xs font-medium text-center leading-tight">{action.title}</span>
              {action.badge && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full text-[10px] font-bold">
                  {action.badge}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Expandable Additional Actions */}
      {isExpanded && remainingActions.length > 0 && (
        <div className="border-t border-gray-200 pt-3">
          <div className="text-xs text-gray-600 mb-2">Additional Tools</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {remainingActions.map((action) => (
              <button
                key={action.id}
                onClick={action.action}
                className={`
                  relative group ${action.color} ${action.hoverColor}
                  text-white rounded-lg p-2 sm:p-3 transition-all duration-200
                  hover:scale-105 hover:shadow-lg active:scale-95 touch-manipulation
                  ${action.urgent ? 'ring-2 ring-yellow-400 ring-opacity-50 animate-pulse' : ''}
                `}
              >
                {/* Urgent indicator */}
                {action.urgent && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                )}

                {/* Badge */}
                {action.badge && (
                  <div className="absolute -top-2 -right-2 bg-white text-gray-800 text-xs px-2 py-1 rounded-full font-medium shadow-lg">
                    {action.badge}
                  </div>
                )}

                <div className="flex flex-col items-center text-center">
                  <div className="mb-2 group-hover:scale-110 transition-transform duration-200">
                    {action.icon}
                  </div>
                  <div className="text-xs sm:text-sm font-medium leading-tight">
                    {action.title}
                  </div>
                  <div className="text-xs opacity-90 mt-1 leading-tight hidden sm:block">
                    {action.description}
                  </div>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-200"></div>
              </button>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div>
                <div className="text-base font-bold text-gray-900">12</div>
                <div className="text-xs text-gray-600">Calls Today</div>
              </div>
              <div>
                <div className="text-base font-bold text-green-600">$2,750</div>
                <div className="text-xs text-gray-600">Raised Today</div>
              </div>
              <div>
                <div className="text-base font-bold text-blue-600">89%</div>
                <div className="text-xs text-gray-600">Goal Progress</div>
              </div>
              <div>
                <div className="text-base font-bold text-purple-600">23</div>
                <div className="text-xs text-gray-600">Hot Leads</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActionsBar;
