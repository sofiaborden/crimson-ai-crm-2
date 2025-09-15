import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import {
  CurrencyDollarIcon,
  BoltIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  ComputerDesktopIcon,
  MailIcon,
  SparklesIcon,
  ArrowTopRightOnSquareIcon,
  TrophyIcon
} from '../../constants';
import DonorProfileModal from '../ui/DonorProfileModal';
import { getDonorProfileByName } from '../../utils/mockDonorProfiles';
import { Donor } from '../../types';

interface LiveTrackerProps {
  showPopoutButton?: boolean;
}

interface Donation {
  id: string;
  donor: string;
  amount: number;
  method: 'online' | 'phone' | 'event' | 'mail';
  timestamp: Date;
  isNew?: boolean;
}

interface Action {
  id: string;
  type: 'task' | 'call' | 'email' | 'event';
  person: string;
  action: string;
  timeAgo: string;
  status: 'completed' | 'created' | 'updated';
  tag: string;
}

const LiveTracker: React.FC<LiveTrackerProps> = ({ showPopoutButton = true }) => {
  const [activeTab, setActiveTab] = useState<'donations' | 'actions'>('donations');
  const [recentDonations, setRecentDonations] = useState<Donation[]>([
    { id: '1', donor: 'Sarah Johnson', amount: 500, method: 'online', timestamp: new Date(Date.now() - 2 * 60 * 1000) },
    { id: '2', donor: 'Michael Chen', amount: 250, method: 'phone', timestamp: new Date(Date.now() - 5 * 60 * 1000) },
    { id: '3', donor: 'Emily Rodriguez', amount: 1000, method: 'event', timestamp: new Date(Date.now() - 8 * 60 * 1000) },
    { id: '4', donor: 'David Wilson', amount: 150, method: 'online', timestamp: new Date(Date.now() - 12 * 60 * 1000) },
    { id: '5', donor: 'Lisa Thompson', amount: 750, method: 'mail', timestamp: new Date(Date.now() - 15 * 60 * 1000) }
  ]);

  const [recentActions, setRecentActions] = useState<Action[]>([
    { id: '1', type: 'task', person: 'Joseph Banks', action: 'Task Created for 09/10/2026', timeAgo: '3 minutes ago', status: 'created', tag: 'Task' },
    { id: '2', type: 'call', person: 'Sofia Borden', action: 'Call Completed', timeAgo: '10 minutes ago', status: 'completed', tag: 'DialR' },
    { id: '3', type: 'email', person: 'Jeff Wernsing', action: 'Email Sent', timeAgo: '11 minutes ago', status: 'completed', tag: 'TargetPath' },
    { id: '4', type: 'event', person: 'Jon Smith', action: 'Event RSVP Updated to Yes', timeAgo: '12 minutes ago', status: 'updated', tag: 'Events' },
    { id: '5', type: 'task', person: 'Emma T.', action: 'Meeting Scheduled', timeAgo: '15 minutes ago', status: 'created', tag: 'Task' }
  ]);

  const [celebrationVisible, setCelebrationVisible] = useState(false);
  const [newDonationAlert, setNewDonationAlert] = useState<Donation | null>(null);
  const [newActionAlert, setNewActionAlert] = useState<Action | null>(null);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [showDonorProfile, setShowDonorProfile] = useState(false);

  const handleDonorClick = (donorName: string) => {
    const donor = getDonorProfileByName(donorName);
    if (donor) {
      setSelectedDonor(donor);
      setShowDonorProfile(true);
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'online':
        return <ComputerDesktopIcon className="w-3 h-3 text-blue-500" />;
      case 'phone':
        return <PhoneIcon className="w-3 h-3 text-green-500" />;
      case 'event':
        return <CalendarIcon className="w-3 h-3 text-purple-500" />;
      case 'mail':
        return <MailIcon className="w-3 h-3 text-orange-500" />;
      default:
        return <CurrencyDollarIcon className="w-3 h-3 text-gray-500" />;
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <div className="w-3 h-3 bg-blue-500 rounded-full"></div>;
      case 'call':
        return <PhoneIcon className="w-3 h-3 text-green-500" />;
      case 'email':
        return <EnvelopeIcon className="w-3 h-3 text-purple-500" />;
      case 'event':
        return <CalendarIcon className="w-3 h-3 text-orange-500" />;
      default:
        return <div className="w-3 h-3 bg-gray-500 rounded-full"></div>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return timestamp.toLocaleDateString();
  };

  // Simulate new donations
  useEffect(() => {
    const interval = setInterval(() => {
      const donors = ['Alex Thompson', 'Jennifer Lee', 'Robert Garcia', 'Amanda Davis', 'Christopher Brown'];
      const methods = ['online', 'phone', 'event', 'mail'] as const;
      const amounts = [50, 100, 150, 200, 250, 300, 500, 750, 1000, 1500, 2000];

      const newDonation: Donation = {
        id: Date.now().toString(),
        donor: donors[Math.floor(Math.random() * donors.length)],
        amount: amounts[Math.floor(Math.random() * amounts.length)],
        method: methods[Math.floor(Math.random() * methods.length)],
        timestamp: new Date(),
        isNew: true
      };

      setRecentDonations(prev => [newDonation, ...prev.slice(0, 9)]);
      setNewDonationAlert(newDonation);

      if (newDonation.amount >= 1000) {
        setCelebrationVisible(true);
        setTimeout(() => setCelebrationVisible(false), 3000);
      }

      setTimeout(() => {
        setNewDonationAlert(null);
        setRecentDonations(prev => prev.map(d => ({ ...d, isNew: false })));
      }, 5000);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

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
      {/* Celebration Animation */}
      {celebrationVisible && (
        <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="animate-bounce p-4 bg-green-500 rounded-full">
            <TrophyIcon className="w-8 h-8 text-white" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-lg animate-pulse"></div>
        </div>
      )}

      {/* New Donation Alert */}
      {newDonationAlert && (
        <div className="absolute top-0 right-0 z-40 transform translate-x-2 -translate-y-2">
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-slide-in-right">
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-4 h-4" />
              <span className="text-sm font-medium">
                New donation: {formatCurrency(newDonationAlert.amount)} from {newDonationAlert.donor}!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* New Action Alert */}
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
          {/* Header with Toggle */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${activeTab === 'donations' ? 'bg-green-100' : 'bg-blue-100'}`}>
                {activeTab === 'donations' ? (
                  <CurrencyDollarIcon className="w-4 h-4 text-green-600" />
                ) : (
                  <BoltIcon className="w-4 h-4 text-blue-600" />
                )}
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Live {activeTab === 'donations' ? 'Donation' : 'Actions'} Tracker
                </h3>
                <p className="text-xs text-gray-600">
                  Real-time {activeTab === 'donations' ? 'donation' : 'activity'} monitoring
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                activeTab === 'donations' ? 'text-green-600 bg-green-100' : 'text-blue-600 bg-blue-100'
              }`}>
                <SparklesIcon className="w-3 h-3" />
                Live
              </div>
              {showPopoutButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {}}
                  className="p-1.5"
                >
                  <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Toggle Buttons */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
            <button
              onClick={() => setActiveTab('donations')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'donations'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <CurrencyDollarIcon className="w-4 h-4" />
                Donations
              </div>
            </button>
            <button
              onClick={() => setActiveTab('actions')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'actions'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <BoltIcon className="w-4 h-4" />
                Actions
              </div>
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <div className="bg-white rounded-lg border border-gray-200 h-full overflow-y-auto max-h-full">
              {activeTab === 'donations' ? (
                // Donations Feed
                <div className="space-y-0 pb-4 h-full overflow-y-auto">
                  {recentDonations.map((donation, index) => (
                    <div
                      key={donation.id}
                      className={`p-2 border-b border-gray-100 last:border-b-0 transition-all duration-300 ${
                        index === 0 ? 'bg-green-50 animate-fade-in' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1 bg-gray-50 rounded">
                            {getMethodIcon(donation.method)}
                          </div>
                          <div>
                            <button
                              onClick={() => handleDonorClick(donation.donor)}
                              className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
                            >
                              {donation.donor}
                            </button>
                            <div className="text-xs text-gray-500">
                              {formatTime(donation.timestamp)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-green-600">
                            {formatCurrency(donation.amount)}
                          </div>
                          <div className={`text-xs px-2 py-0.5 rounded-full ${
                            donation.method === 'online' ? 'bg-blue-100 text-blue-700' :
                            donation.method === 'phone' ? 'bg-green-100 text-green-700' :
                            donation.method === 'event' ? 'bg-purple-100 text-purple-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {donation.method}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Actions Feed
                <div className="space-y-0 pb-4 h-full overflow-y-auto">
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
                            <div className="text-xs text-gray-500">
                              {action.timeAgo}
                            </div>
                          </div>
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          action.tag === 'Task' ? 'bg-blue-100 text-blue-700' :
                          action.tag === 'DialR' ? 'bg-green-100 text-green-700' :
                          action.tag === 'TargetPath' ? 'bg-purple-100 text-purple-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {action.tag}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Donor Profile Modal */}
      {showDonorProfile && selectedDonor && (
        <DonorProfileModal
          donor={selectedDonor}
          isOpen={showDonorProfile}
          onClose={() => {
            setShowDonorProfile(false);
            setSelectedDonor(null);
          }}
        />
      )}
    </div>
  );
};

export default LiveTracker;
