import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import {
  CalendarIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  HeartIcon,
  ArrowTopRightOnSquareIcon,
  ArrowDownTrayIcon,
  SparklesIcon,
  TrendingUpIcon,
  ClockIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChevronDownIcon
} from '../../constants';

interface DailySummaryProps {
  className?: string;
}

interface ShareDropdownProps {
  onDownloadPNG: () => void;
  onEmailShare: () => void;
  onTextShare: () => void;
  isGeneratingImage: boolean;
}

const ShareDropdown: React.FC<ShareDropdownProps> = ({
  onDownloadPNG,
  onEmailShare,
  onTextShare,
  isGeneratingImage
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="sm"
        className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2"
      >
        <ArrowTopRightOnSquareIcon className="w-3 h-3" />
        Share
        <ChevronDownIcon className="w-3 h-3" />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="py-1">
              <button
                onClick={() => {
                  onDownloadPNG();
                  setIsOpen(false);
                }}
                disabled={isGeneratingImage}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
              >
                <ArrowDownTrayIcon className="w-4 h-4 text-gray-500" />
                {isGeneratingImage ? 'Generating PNG...' : 'Download PNG'}
              </button>

              <button
                onClick={() => {
                  onEmailShare();
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <EnvelopeIcon className="w-4 h-4 text-gray-500" />
                Email
              </button>

              <button
                onClick={() => {
                  onTextShare();
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <PhoneIcon className="w-4 h-4 text-gray-500" />
                Text
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export const DailySummary: React.FC<DailySummaryProps> = ({ className = '' }) => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Mock data - replace with real data from your API
  const yesterdayData = {
    totalRaised: 12500,
    donorCount: 86,
    topSource: { name: 'Online Gifts', percentage: 40 },
    newDonors: 23,
    largestGift: { amount: 2500, donor: 'J.S.' },
    avgGiftSize: 145,
    recurringGifts: { count: 12, amount: 1800 },
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  };

  const handleDownloadImage = async () => {
    setIsGeneratingImage(true);

    // Create actual PNG image
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (ctx) {
        canvas.width = 800;
        canvas.height = 600;

        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, 800, 600);
        gradient.addColorStop(0, '#f3e8ff');
        gradient.addColorStop(1, '#e0e7ff');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 600);

        // Title
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 28px Arial';
        ctx.fillText("Yesterday's Performance", 50, 60);

        // Date
        ctx.fillStyle = '#6b7280';
        ctx.font = '18px Arial';
        ctx.fillText(yesterdayData.date, 50, 90);

        // Main metrics in a grid
        const mainMetrics = [
          { label: 'Total Raised', value: `$${yesterdayData.totalRaised.toLocaleString()}`, x: 50, y: 150, color: '#059669' },
          { label: 'Donors', value: yesterdayData.donorCount.toString(), x: 300, y: 150, color: '#3b82f6' },
          { label: 'New Donors', value: yesterdayData.newDonors.toString(), x: 550, y: 150, color: '#8b5cf6' },
          { label: 'Largest Gift', value: `$${yesterdayData.largestGift.amount.toLocaleString()}`, x: 50, y: 280, color: '#f59e0b' },
          { label: 'Avg Gift Size', value: `$${yesterdayData.avgGiftSize}`, x: 300, y: 280, color: '#8b5cf6' },
          { label: 'Recurring Gifts', value: `${yesterdayData.recurringGifts.count}`, x: 550, y: 280, color: '#6366f1' }
        ];

        mainMetrics.forEach(metric => {
          // Background box
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fillRect(metric.x - 10, metric.y - 40, 200, 80);
          ctx.strokeStyle = '#e5e7eb';
          ctx.strokeRect(metric.x - 10, metric.y - 40, 200, 80);

          // Label
          ctx.fillStyle = '#374151';
          ctx.font = '14px Arial';
          ctx.fillText(metric.label, metric.x, metric.y - 15);

          // Value
          ctx.fillStyle = metric.color;
          ctx.font = 'bold 24px Arial';
          ctx.fillText(metric.value, metric.x, metric.y + 15);
        });

        // Additional insights
        ctx.fillStyle = '#374151';
        ctx.font = '16px Arial';
        ctx.fillText(`Top Source: ${yesterdayData.topSource.name} (${yesterdayData.topSource.percentage}%)`, 50, 420);
        ctx.fillText(`Recurring Total: $${yesterdayData.recurringGifts.amount.toLocaleString()}`, 50, 450);

        // Footer
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px Arial';
        ctx.fillText('Generated by CrimsonAI CRM', 50, 550);

        // Convert to blob and download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `yesterdays-performance-${new Date().toISOString().split('T')[0]}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        });
      }

      setIsGeneratingImage(false);
    }, 2000);
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Yesterday's Performance - ${yesterdayData.date}`);
    const body = encodeURIComponent(`Yesterday's Performance Summary

Total Raised: $${yesterdayData.totalRaised.toLocaleString()}
Donors: ${yesterdayData.donorCount}
New Donors: ${yesterdayData.newDonors}
Largest Gift: $${yesterdayData.largestGift.amount.toLocaleString()} from ${yesterdayData.largestGift.donor}
Average Gift Size: $${yesterdayData.avgGiftSize}
Recurring Gifts: ${yesterdayData.recurringGifts.count} gifts totaling $${yesterdayData.recurringGifts.amount.toLocaleString()}
Top Source: ${yesterdayData.topSource.name} (${yesterdayData.topSource.percentage}%)

Generated by CrimsonAI CRM`);

    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleTextShare = () => {
    const message = encodeURIComponent(`Yesterday's Performance: $${yesterdayData.totalRaised.toLocaleString()} raised from ${yesterdayData.donorCount} donors. ${yesterdayData.newDonors} new donors! Top source: ${yesterdayData.topSource.name} (${yesterdayData.topSource.percentage}%)`);
    window.open(`sms:?body=${message}`);
  };

  return (
    <Card className={`bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 h-full ${className}`}>
      <div className="p-4 h-full flex flex-col">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-100 rounded-lg">
              <CalendarIcon className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Yesterday's Performance</h3>
              <p className="text-xs text-gray-600">{yesterdayData.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
            <SparklesIcon className="w-3 h-3" />
            Daily Insights
          </div>
        </div>

        {/* Compact Main Metrics - 2x2 Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Total Raised */}
          <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-1 mb-1">
              <ArrowTrendingUpIcon className="w-3 h-3 text-green-600" />
              <span className="text-xs font-medium text-gray-600">Total Raised</span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              ${yesterdayData.totalRaised.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">
              {yesterdayData.donorCount} donors
            </div>
          </div>

          {/* New Donors */}
          <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-1 mb-1">
              <UsersIcon className="w-3 h-3 text-blue-600" />
              <span className="text-xs font-medium text-gray-600">New Donors</span>
            </div>
            <div className="text-lg font-bold text-blue-600">
              {yesterdayData.newDonors}
            </div>
            <div className="text-xs text-gray-500">
              first-time
            </div>
          </div>

          {/* Largest Gift */}
          <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-1 mb-1">
              <HeartIcon className="w-3 h-3 text-amber-600" />
              <span className="text-xs font-medium text-gray-600">Largest Gift</span>
            </div>
            <div className="text-lg font-bold text-amber-600">
              ${yesterdayData.largestGift.amount.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">
              from {yesterdayData.largestGift.donor}
            </div>
          </div>

          {/* Average Gift */}
          <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-1 mb-1">
              <TrendingUpIcon className="w-3 h-3 text-purple-600" />
              <span className="text-xs font-medium text-gray-600">Avg Gift</span>
            </div>
            <div className="text-lg font-bold text-purple-600">
              ${yesterdayData.avgGiftSize}
            </div>
            <div className="text-xs text-gray-500">
              per donation
            </div>
          </div>
        </div>

        {/* Compact Additional Insights */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Top Source */}
          <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-600">Top Source</span>
              <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                {yesterdayData.topSource.percentage}%
              </span>
            </div>
            <div className="text-sm font-semibold text-gray-900 mb-1">
              {yesterdayData.topSource.name}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${yesterdayData.topSource.percentage}%` }}
              ></div>
            </div>
          </div>

          {/* Recurring Gifts */}
          <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-1 mb-1">
              <ClockIcon className="w-3 h-3 text-indigo-600" />
              <span className="text-xs font-medium text-gray-600">Recurring</span>
            </div>
            <div className="text-sm font-semibold text-gray-900">
              {yesterdayData.recurringGifts.count} gifts
            </div>
            <div className="text-xs text-gray-500">
              ${yesterdayData.recurringGifts.amount.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Share Button with Dropdown */}
        <div className="mt-auto">
          <ShareDropdown
            onDownloadPNG={handleDownloadImage}
            onEmailShare={handleEmailShare}
            onTextShare={handleTextShare}
            isGeneratingImage={isGeneratingImage}
          />
        </div>
      </div>
    </Card>
  );
};

export default DailySummary;
