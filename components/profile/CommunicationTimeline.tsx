import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import {
  PhoneIcon,
  MailIcon,
  CalendarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  EyeIcon
} from '../../constants';

interface CommunicationEvent {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'text' | 'event' | 'note';
  date: string;
  title: string;
  description: string;
  outcome: 'positive' | 'neutral' | 'negative' | 'no-response';
  followUpNeeded: boolean;
  attachments?: string[];
  duration?: string;
  responseTime?: string;
  aiInsights?: string;
}

interface CommunicationTimelineProps {
  donorName: string;
  events: CommunicationEvent[];
}

const EventIcon: React.FC<{ type: string; outcome: string }> = ({ type, outcome }) => {
  const getIcon = () => {
    switch (type) {
      case 'call': return <PhoneIcon className="w-4 h-4" />;
      case 'email': return <MailIcon className="w-4 h-4" />;
      case 'meeting': return <CalendarIcon className="w-4 h-4" />;
      case 'text': return <ChatBubbleLeftRightIcon className="w-4 h-4" />;
      case 'event': return <UserGroupIcon className="w-4 h-4" />;
      case 'note': return <DocumentTextIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  const getColor = () => {
    switch (outcome) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      case 'no-response': return 'text-gray-600 bg-gray-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className={`p-2 rounded-full ${getColor()}`}>
      {getIcon()}
    </div>
  );
};

const OutcomeIndicator: React.FC<{ outcome: string }> = ({ outcome }) => {
  const getOutcomeStyle = () => {
    switch (outcome) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-200';
      case 'negative': return 'bg-red-100 text-red-800 border-red-200';
      case 'no-response': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getOutcomeText = () => {
    switch (outcome) {
      case 'positive': return 'Positive';
      case 'negative': return 'Negative';
      case 'no-response': return 'No Response';
      default: return 'Neutral';
    }
  };

  return (
    <Badge className={`text-xs ${getOutcomeStyle()}`}>
      {getOutcomeText()}
    </Badge>
  );
};

const CommunicationTimeline: React.FC<CommunicationTimelineProps> = ({ donorName, events }) => {
  const [showAll, setShowAll] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CommunicationEvent | null>(null);

  // Mock communication events
  const mockEvents: CommunicationEvent[] = [
    {
      id: '1',
      type: 'call',
      date: '2024-01-15T14:30:00Z',
      title: 'Follow-up Call',
      description: 'Discussed upcoming campaign initiatives and thanked for previous support',
      outcome: 'positive',
      followUpNeeded: false,
      duration: '12 minutes',
      aiInsights: 'Donor expressed interest in voter outreach programs. Mentioned potential for increased giving.'
    },
    {
      id: '2',
      type: 'email',
      date: '2024-01-10T09:15:00Z',
      title: 'Campaign Update Newsletter',
      description: 'Monthly newsletter with campaign progress and upcoming events',
      outcome: 'neutral',
      followUpNeeded: false,
      responseTime: 'Opened within 2 hours',
      aiInsights: 'High engagement with voter registration content. Clicked through to volunteer signup.'
    },
    {
      id: '3',
      type: 'meeting',
      date: '2024-01-05T16:00:00Z',
      title: 'Coffee Meeting',
      description: 'In-person meeting to discuss campaign strategy and donor involvement',
      outcome: 'positive',
      followUpNeeded: true,
      duration: '45 minutes',
      aiInsights: 'Donor committed to hosting house party. Expressed willingness to increase giving level.'
    },
    {
      id: '4',
      type: 'email',
      date: '2023-12-20T11:30:00Z',
      title: 'Year-End Thank You',
      description: 'Personalized thank you message for 2023 contributions',
      outcome: 'positive',
      followUpNeeded: false,
      responseTime: 'Replied within 4 hours',
      aiInsights: 'Warm response. Mentioned looking forward to continued involvement in 2024.'
    },
    {
      id: '5',
      type: 'call',
      date: '2023-12-15T13:45:00Z',
      title: 'Pledge Follow-up',
      description: 'Called to follow up on pledge commitment and payment schedule',
      outcome: 'no-response',
      followUpNeeded: true,
      aiInsights: 'No answer. Voicemail left. Consider trying different time or method.'
    }
  ];

  const displayEvents = showAll ? mockEvents : mockEvents.slice(0, 3);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-3 rounded-xl">
            <ChatBubbleLeftRightIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Communication Timeline</h3>
            <p className="text-sm text-gray-600">Complete interaction history with {donorName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <PlusIcon className="w-4 h-4 mr-2" />
            Log Interaction
          </Button>
          <Button variant="primary" size="sm">
            Schedule Follow-up
          </Button>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {displayEvents.map((event, index) => (
          <div key={event.id} className="relative">
            {/* Timeline line */}
            {index < displayEvents.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
            )}
            
            {/* Event card */}
            <div className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <EventIcon type={event.type} outcome={event.outcome} />
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600">{formatDate(event.date)} • {getTimeAgo(event.date)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <OutcomeIndicator outcome={event.outcome} />
                    {event.followUpNeeded && (
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
                        Follow-up Needed
                      </Badge>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 mb-3">{event.description}</p>
                
                {/* Event details */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  {event.duration && (
                    <span className="flex items-center gap-1">
                      <ClockIcon className="w-3 h-3" />
                      {event.duration}
                    </span>
                  )}
                  {event.responseTime && (
                    <span className="flex items-center gap-1">
                      <CheckCircleIcon className="w-3 h-3" />
                      {event.responseTime}
                    </span>
                  )}
                </div>

                {/* AI Insights */}
                {event.aiInsights && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <EyeIcon className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-blue-900 mb-1">AI Insights</p>
                        <p className="text-xs text-blue-800">{event.aiInsights}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show more/less toggle */}
      {mockEvents.length > 3 && (
        <div className="text-center mt-6">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : `Show All ${mockEvents.length} Interactions`}
          </Button>
        </div>
      )}

      {/* Communication Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">85%</div>
            <div className="text-sm text-gray-600">Response Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">2.3</div>
            <div className="text-sm text-gray-600">Avg Response Time (hrs)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">12</div>
            <div className="text-sm text-gray-600">Total Interactions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">3</div>
            <div className="text-sm text-gray-600">Follow-ups Needed</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CommunicationTimeline;
