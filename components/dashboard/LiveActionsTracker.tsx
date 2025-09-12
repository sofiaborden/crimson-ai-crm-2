import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import {
  BoltIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  UserIcon,
  ClockIcon,
  SparklesIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '../../constants';

interface Action {
  id: string;
  type: 'task' | 'call' | 'email' | 'event';
  person: string;
  action: string;
  timeAgo: string;
  status: 'completed' | 'created' | 'updated';
  tag: string;
}

interface LiveActionsTrackerProps {
  showPopoutButton?: boolean;
}

const LiveActionsTracker: React.FC<LiveActionsTrackerProps> = ({ showPopoutButton = false }) => {
  const [recentActions, setRecentActions] = useState<Action[]>([
    { id: '1', type: 'task', person: 'Joseph Banks', action: 'Task Created for 09/10/2026', timeAgo: '3 minutes ago', status: 'created', tag: 'Task' },
    { id: '2', type: 'call', person: 'Sofia Borden', action: 'Call Completed', timeAgo: '10 minutes ago', status: 'completed', tag: 'DialR' },
    { id: '3', type: 'email', person: 'Jeff Wernsing', action: 'Email Sent', timeAgo: '11 minutes ago', status: 'completed', tag: 'TargetPath' },
    { id: '4', type: 'event', person: 'Jon Smith', action: 'Event RSVP Updated to Yes', timeAgo: '12 minutes ago', status: 'updated', tag: 'Events' },
    { id: '5', type: 'task', person: 'Maria Rodriguez', action: 'Follow-up Task Created', timeAgo: '18 minutes ago', status: 'created', tag: 'Task' },
  ]);

  const [newActionAlert, setNewActionAlert] = useState<Action | null>(null);

  const getActionIcon = (type: Action['type']) => {
    switch (type) {
      case 'task':
        return <CheckCircleIcon className="w-3 h-3 text-blue-500" />;
      case 'call':
        return <PhoneIcon className="w-3 h-3 text-green-500" />;
      case 'email':
        return <EnvelopeIcon className="w-3 h-3 text-purple-500" />;
      case 'event':
        return <CalendarIcon className="w-3 h-3 text-orange-500" />;
      default:
        return <UserIcon className="w-3 h-3 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Action['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'created':
        return 'text-blue-600';
      case 'updated':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'Task':
        return 'bg-blue-100 text-blue-700';
      case 'DialR':
        return 'bg-green-100 text-green-700';
      case 'TargetPath':
        return 'bg-purple-100 text-purple-700';
      case 'Events':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handlePopoutClick = () => {
    // Open a new window with the actions tracker
    const popupWindow = window.open(
      '/actions-tracker-popup',
      'actionsTracker',
      'width=500,height=700,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no'
    );

    if (popupWindow) {
      // Write the actions tracker content to the new window
      popupWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Live Actions Tracker</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
            .pulse { animation: pulse 2s infinite; }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .fade-in { animation: fadeIn 0.5s ease-out; }
          </style>
        </head>
        <body class="bg-gray-50 p-4">
          <div class="bg-white rounded-lg shadow-lg p-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-blue-100 rounded-lg">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div>
                <h1 class="text-xl font-bold text-gray-900">Live Actions Tracker</h1>
                <p class="text-sm text-gray-600">Real-time activity monitoring</p>
              </div>
            </div>

            <div class="space-y-3">
              ${recentActions.map(action => `
                <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div class="p-1.5 bg-white rounded">
                    ${action.type === 'task' ? '<svg class="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>' :
                      action.type === 'call' ? '<svg class="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>' :
                      action.type === 'email' ? '<svg class="w-3 h-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>' :
                      '<svg class="w-3 h-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>'}
                  </div>
                  <div class="flex-1">
                    <div class="font-medium text-gray-900">${action.person} ${action.action}</div>
                    <div class="text-sm text-gray-500">${action.timeAgo}</div>
                  </div>
                  <div class="text-xs px-2 py-1 rounded-full ${action.tag === 'Task' ? 'bg-blue-100 text-blue-700' :
                    action.tag === 'DialR' ? 'bg-green-100 text-green-700' :
                    action.tag === 'TargetPath' ? 'bg-purple-100 text-purple-700' :
                    'bg-orange-100 text-orange-700'}">${action.tag}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <script>
            // Auto-refresh every 30 seconds
            setInterval(() => {
              window.location.reload();
            }, 30000);
          </script>
        </body>
        </html>
      `);
      popupWindow.document.close();
    }
  };

  // Simulate new actions
  useEffect(() => {
    const interval = setInterval(() => {
      const people = ['Emma T.', 'James W.', 'Maria G.', 'Robert H.', 'Ashley P.', 'Kevin M.'];
      const actionTypes: Action['type'][] = ['task', 'call', 'email', 'event'];
      const actions = [
        'Task Created for follow-up',
        'Call Completed',
        'Email Sent',
        'Event RSVP Updated',
        'Meeting Scheduled',
        'Note Added',
        'Contact Updated'
      ];
      const statuses: Action['status'][] = ['completed', 'created', 'updated'];
      const tags = ['Task', 'DialR', 'TargetPath', 'Events'];
      
      const type = actionTypes[Math.floor(Math.random() * actionTypes.length)];
      const newAction: Action = {
        id: Date.now().toString(),
        type,
        person: people[Math.floor(Math.random() * people.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        timeAgo: 'Just now',
        status: statuses[Math.floor(Math.random() * statuses.length)],
        tag: tags[Math.floor(Math.random() * tags.length)]
      };

      setRecentActions(prev => [newAction, ...prev.slice(0, 4)]);
      setNewActionAlert(newAction);
      
      // Hide alert after 5 seconds
      setTimeout(() => setNewActionAlert(null), 5000);
    }, 20000); // New action every 20 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-full">
      {/* New Action Alert - Toast Style */}
      {newActionAlert && (
        <div className="absolute top-0 right-0 z-40 transform translate-x-2 -translate-y-2">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce">
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-4 h-4" />
              <span className="text-sm font-medium">
                New: {newActionAlert.person} {newActionAlert.action}
              </span>
            </div>
          </div>
        </div>
      )}

      <Card className="h-full hover:shadow-lg transition-all duration-300">
        <div className="p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <BoltIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Live Actions Tracker</h3>
              <p className="text-xs text-gray-600">Real-time activity monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              <SparklesIcon className="w-3 h-3" />
              Live
            </div>
            {showPopoutButton && (
              <Button
                onClick={handlePopoutClick}
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <ArrowTopRightOnSquareIcon className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>



        {/* Recent Actions Feed */}
        <div className="flex-1 min-h-0">

          <div className="bg-white rounded-lg border border-blue-100 h-full overflow-y-auto">
            {recentActions.map((action, index) => (
              <div
                key={action.id}
                className={`p-2 border-b border-gray-100 last:border-b-0 transition-all duration-300 ${
                  index === 0 ? 'bg-blue-50 animate-fade-in' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-gray-50 rounded">
                      {getActionIcon(action.type)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {action.person} {action.action}
                      </div>
                      <div className="text-xs text-gray-500">{action.timeAgo}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getTagColor(action.tag)}`}>
                      {action.tag}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
    </div>
  );
};

export default LiveActionsTracker;
