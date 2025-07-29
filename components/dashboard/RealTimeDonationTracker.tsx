import React, { useState, useEffect } from 'react';
import { CurrencyDollarIcon, TrophyIcon, FireIcon, SparklesIcon, ComputerDesktopIcon, PhoneIcon, CalendarIcon, MailIcon, ChevronLeftIcon, ChevronRightIcon } from '../../constants';
import DonorProfileModal from '../ui/DonorProfileModal';
import { getDonorProfileByName } from '../../utils/mockDonorProfiles';
import { Donor } from '../../types';

interface Donation {
  id: string;
  donor: string;
  amount: number;
  timeAgo: string;
  method: 'online' | 'phone' | 'event' | 'mail';
}

interface Goal {
  label: string;
  current: number;
  target: number;
  deadline: string;
  color: string;
}

const RealTimeDonationTracker: React.FC = () => {
  const [recentDonations, setRecentDonations] = useState<Donation[]>([
    { id: '1', donor: 'Sarah J.', amount: 250, timeAgo: '3 minutes ago', method: 'online' },
    { id: '2', donor: 'Michael R.', amount: 100, timeAgo: '12 minutes ago', method: 'phone' },
    { id: '3', donor: 'Jennifer L.', amount: 500, timeAgo: '28 minutes ago', method: 'event' },
    { id: '4', donor: 'David K.', amount: 75, timeAgo: '45 minutes ago', method: 'online' },
    { id: '5', donor: 'Lisa M.', amount: 1000, timeAgo: '1 hour ago', method: 'phone' },
  ]);

  const [goals] = useState<Goal[]>([
    { label: 'Today', current: 12750, target: 15000, deadline: 'End of day', color: 'bg-green-500' },
    { label: 'This Week', current: 67200, target: 85000, deadline: '3 days left', color: 'bg-blue-500' },
    { label: 'Monthly', current: 234500, target: 350000, deadline: '12 days left', color: 'bg-purple-500' },
  ]);

  const [celebrationVisible, setCelebrationVisible] = useState(false);
  const [newDonationAlert, setNewDonationAlert] = useState<Donation | null>(null);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [showDonorProfile, setShowDonorProfile] = useState(false);
  const [currentGoalIndex, setCurrentGoalIndex] = useState(0);

  const handleDonorClick = (donorName: string) => {
    const donor = getDonorProfileByName(donorName);
    if (donor) {
      setSelectedDonor(donor);
      setShowDonorProfile(true);
    }
  };

  const nextGoal = () => {
    setCurrentGoalIndex((prev) => (prev + 1) % goals.length);
  };

  const prevGoal = () => {
    setCurrentGoalIndex((prev) => (prev - 1 + goals.length) % goals.length);
  };

  // Simulate new donations
  useEffect(() => {
    const interval = setInterval(() => {
      const donors = ['Emma T.', 'James W.', 'Maria G.', 'Robert H.', 'Ashley P.', 'Kevin M.'];
      const amounts = [25, 50, 75, 100, 150, 200, 250, 300, 500, 1000];
      const methods: ('online' | 'phone' | 'event' | 'mail')[] = ['online', 'phone', 'event', 'mail'];
      
      const newDonation: Donation = {
        id: Date.now().toString(),
        donor: donors[Math.floor(Math.random() * donors.length)],
        amount: amounts[Math.floor(Math.random() * amounts.length)],
        timeAgo: 'Just now',
        method: methods[Math.floor(Math.random() * methods.length)]
      };

      setRecentDonations(prev => [newDonation, ...prev.slice(0, 4)]);
      setNewDonationAlert(newDonation);
      
      // Show celebration for large donations
      if (newDonation.amount >= 500) {
        setCelebrationVisible(true);
        setTimeout(() => setCelebrationVisible(false), 3000);
      }

      // Hide alert after 5 seconds
      setTimeout(() => setNewDonationAlert(null), 5000);
    }, 15000); // New donation every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'online': return <ComputerDesktopIcon className="w-5 h-5 text-blue-600" />;
      case 'phone': return <PhoneIcon className="w-5 h-5 text-green-600" />;
      case 'event': return <CalendarIcon className="w-5 h-5 text-purple-600" />;
      case 'mail': return <MailIcon className="w-5 h-5 text-orange-600" />;
      default: return <CurrencyDollarIcon className="w-5 h-5 text-green-600" />;
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'online': return 'bg-blue-100 text-blue-800';
      case 'phone': return 'bg-green-100 text-green-800';
      case 'event': return 'bg-purple-100 text-purple-800';
      case 'mail': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="relative">
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

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="bg-green-500 p-1.5 rounded-lg">
              <CurrencyDollarIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Live Donation Tracker</h2>
              <p className="text-xs text-gray-600">Real-time activity</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
            LIVE
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Compact Goal Progress */}
          <div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-2 text-sm">
              <TrophyIcon className="w-4 h-4 text-yellow-500" />
              Goal Progress
            </h3>
            <div className="space-y-2">
              {goals.map((goal, index) => {
                const percentage = getProgressPercentage(goal.current, goal.target);
                return (
                  <div key={index} className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-900">{goal.label}</span>
                      <span className="text-xs text-gray-500">{percentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${goal.color}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-gray-900">{formatCurrency(goal.current)}</span>
                      <span className="text-gray-500">of {formatCurrency(goal.target)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Donations Feed */}
          <div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-2 text-sm">
              <SparklesIcon className="w-4 h-4 text-blue-500" />
              Recent Donations
            </h3>
            <div className="bg-white rounded-lg border border-gray-200 max-h-48 overflow-y-auto">
              {recentDonations.map((donation, index) => (
                <div
                  key={donation.id}
                  className={`p-2 border-b border-gray-100 last:border-b-0 transition-all duration-300 ${
                    index === 0 ? 'bg-green-50 animate-fade-in' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-gray-50 rounded">
                        {getMethodIcon(donation.method)}
                      </div>
                      <div>
                        <button
                          onClick={() => handleDonorClick(donation.donor)}
                          className="font-medium text-blue-600 hover:text-blue-800 text-sm underline-offset-2 hover:underline transition-colors text-left"
                        >
                          {donation.donor}
                        </button>
                        <div className="text-xs text-gray-600">{donation.timeAgo}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600 text-sm">
                        {formatCurrency(donation.amount)}
                      </div>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${getMethodColor(donation.method)}`}>
                        {donation.method}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>

      {/* Donor Profile Modal */}
      <DonorProfileModal
        donor={selectedDonor}
        isOpen={showDonorProfile}
        onClose={() => setShowDonorProfile(false)}
      />
    </div>
  );
};

export default RealTimeDonationTracker;
