import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { CurrencyDollarIcon, TrophyIcon, FireIcon, SparklesIcon, ComputerDesktopIcon, PhoneIcon, CalendarIcon, MailIcon, ChevronLeftIcon, ChevronRightIcon, ArrowTopRightOnSquareIcon } from '../../constants';
import DonorProfileModal from '../ui/DonorProfileModal';
import { getDonorProfileByName } from '../../utils/mockDonorProfiles';
import { Donor } from '../../types';

interface RealTimeDonationTrackerProps {
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

const RealTimeDonationTracker: React.FC<RealTimeDonationTrackerProps> = ({ showPopoutButton = true }) => {
  const [recentDonations, setRecentDonations] = useState<Donation[]>([
    { id: '1', donor: 'Sarah Johnson', amount: 500, method: 'online', timestamp: new Date(Date.now() - 2 * 60 * 1000) },
    { id: '2', donor: 'Michael Chen', amount: 250, method: 'phone', timestamp: new Date(Date.now() - 5 * 60 * 1000) },
    { id: '3', donor: 'Emily Rodriguez', amount: 1000, method: 'event', timestamp: new Date(Date.now() - 8 * 60 * 1000) },
    { id: '4', donor: 'David Wilson', amount: 150, method: 'online', timestamp: new Date(Date.now() - 12 * 60 * 1000) },
    { id: '5', donor: 'Lisa Thompson', amount: 750, method: 'mail', timestamp: new Date(Date.now() - 15 * 60 * 1000) }
  ]);

  const [celebrationVisible, setCelebrationVisible] = useState(false);
  const [newDonationAlert, setNewDonationAlert] = useState<Donation | null>(null);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [showDonorProfile, setShowDonorProfile] = useState(false);

  const handleDonorClick = (donorName: string) => {
    const donor = getDonorProfileByName(donorName);
    if (donor) {
      setSelectedDonor(donor);
      setShowDonorProfile(true);
    }
  };

  const handlePopoutClick = () => {
    const popupWindow = window.open(
      '',
      'donationTracker',
      'width=800,height=600,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no'
    );

    if (popupWindow) {
      popupWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Live Donation Tracker</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-50 p-4">
          <div class="bg-white rounded-lg shadow-lg p-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-green-100 rounded-lg">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-900">Live Donation Tracker</h1>
                <p class="text-gray-600">Real-time donation monitoring</p>
              </div>
            </div>
            <div id="donation-feed" class="space-y-3 max-h-96 overflow-y-auto">
              <p class="text-center text-gray-500 py-8">Loading live donations...</p>
            </div>
          </div>
          <script>
            // Auto-refresh every 30 seconds
            setInterval(() => {
              location.reload();
            }, 30000);
          </script>
        </body>
        </html>
      `);
      popupWindow.document.close();
    }
  };

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

      <Card className="h-full hover:shadow-lg transition-all duration-300">
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-green-100 rounded-lg">
                <CurrencyDollarIcon className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Live Donation Tracker</h3>
                <p className="text-xs text-gray-600">Real-time donation activity</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></div>
                Live
              </div>
              {showPopoutButton && (
                <Button
                  onClick={handlePopoutClick}
                  variant="outline"
                  size="sm"
                  className="border-green-200 text-green-700 hover:bg-green-50"
                >
                  <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Recent Donations Feed */}
          <div className="flex-1 min-h-0">

            <div className="bg-white rounded-lg border border-green-100 h-full overflow-y-auto">
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
                          className="font-medium text-gray-900 hover:text-blue-600 transition-colors text-sm"
                        >
                          {donation.donor}
                        </button>
                        <div className="text-xs text-gray-500">
                          {donation.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
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
      </Card>

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
