import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { TrendingUpIcon, TrendingDownIcon, CurrencyDollarIcon, ChartBarIcon } from '../../constants';

interface SegmentROI {
  id: string;
  name: string;
  emoji: string;
  potential: number;
  raised: number;
  cost: number;
  roi: number;
  conversionRate: number;
  avgGift: number;
  contactsMade: number;
  totalContacts: number;
  campaignsLaunched: number;
  lastActivity: string;
  trend: 'up' | 'down' | 'stable';
  monthlyData: { month: string; raised: number; cost: number }[];
}

const ROITrackingDashboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedSegment, setSelectedSegment] = useState<string>('all');

  const segmentROIData: SegmentROI[] = [
    {
      id: 'neighborhood-mvps',
      name: 'Neighborhood MVPs',
      emoji: '🏆',
      potential: 68000,
      raised: 15200,
      cost: 2800,
      roi: 443,
      conversionRate: 22,
      avgGift: 1267,
      contactsMade: 12,
      totalContacts: 198,
      campaignsLaunched: 3,
      lastActivity: '2 hours ago',
      trend: 'up',
      monthlyData: [
        { month: 'Jan', raised: 8500, cost: 1200 },
        { month: 'Feb', raised: 12300, cost: 1800 },
        { month: 'Mar', raised: 15200, cost: 2800 }
      ]
    },
    {
      id: 'comeback-crew',
      name: 'Comeback Crew',
      emoji: '🔄',
      potential: 113000,
      raised: 8900,
      cost: 1500,
      roi: 593,
      conversionRate: 8,
      avgGift: 178,
      contactsMade: 50,
      totalContacts: 1571,
      campaignsLaunched: 2,
      lastActivity: '1 day ago',
      trend: 'up',
      monthlyData: [
        { month: 'Jan', raised: 2100, cost: 400 },
        { month: 'Feb', raised: 5600, cost: 900 },
        { month: 'Mar', raised: 8900, cost: 1500 }
      ]
    },
    {
      id: 'quiet-giants',
      name: 'Quiet Giants',
      emoji: '🤫',
      potential: 36000,
      raised: 12500,
      cost: 800,
      roi: 1463,
      conversionRate: 35,
      avgGift: 2500,
      contactsMade: 5,
      totalContacts: 14,
      campaignsLaunched: 1,
      lastActivity: '3 days ago',
      trend: 'stable',
      monthlyData: [
        { month: 'Jan', raised: 5000, cost: 200 },
        { month: 'Feb', raised: 7500, cost: 400 },
        { month: 'Mar', raised: 12500, cost: 800 }
      ]
    }
  ];

  const totalMetrics = {
    potential: segmentROIData.reduce((sum, seg) => sum + seg.potential, 0),
    raised: segmentROIData.reduce((sum, seg) => sum + seg.raised, 0),
    cost: segmentROIData.reduce((sum, seg) => sum + seg.cost, 0),
    roi: 0,
    conversionRate: 0
  };
  totalMetrics.roi = ((totalMetrics.raised - totalMetrics.cost) / totalMetrics.cost) * 100;
  totalMetrics.conversionRate = (segmentROIData.reduce((sum, seg) => sum + seg.contactsMade, 0) / segmentROIData.reduce((sum, seg) => sum + seg.totalContacts, 0)) * 100;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUpIcon className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDownIcon className="w-4 h-4 text-red-500" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const getROIColor = (roi: number) => {
    if (roi >= 400) return 'text-green-600 bg-green-100';
    if (roi >= 200) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <ChartBarIcon className="w-6 h-6 text-green-600" />
            ROI Tracking Dashboard
          </h2>
          <p className="text-text-secondary">Track actual revenue and return on investment for each segment</p>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'quarter', 'year'] as const).map((period) => (
            <Button
              key={period}
              variant={timeframe === period ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setTimeframe(period)}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Overall Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Raised</p>
              <p className="text-2xl font-bold text-blue-800">{formatCurrency(totalMetrics.raised)}</p>
              <p className="text-xs text-blue-600">of {formatCurrency(totalMetrics.potential)} potential</p>
            </div>
            <CurrencyDollarIcon className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Total ROI</p>
              <p className="text-2xl font-bold text-green-800">{totalMetrics.roi.toFixed(0)}%</p>
              <p className="text-xs text-green-600">Cost: {formatCurrency(totalMetrics.cost)}</p>
            </div>
            <TrendingUpIcon className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Conversion Rate</p>
              <p className="text-2xl font-bold text-purple-800">{totalMetrics.conversionRate.toFixed(1)}%</p>
              <p className="text-xs text-purple-600">Across all segments</p>
            </div>
            <ChartBarIcon className="w-8 h-8 text-purple-500" />
          </div>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Efficiency Score</p>
              <p className="text-2xl font-bold text-orange-800">A+</p>
              <p className="text-xs text-orange-600">Top 5% performance</p>
            </div>
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
              A+
            </div>
          </div>
        </Card>
      </div>

      {/* Segment Performance Table */}
      <Card title="Segment Performance Breakdown">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Segment</th>
                <th className="text-center py-3 px-4 font-semibold">Raised</th>
                <th className="text-center py-3 px-4 font-semibold">ROI</th>
                <th className="text-center py-3 px-4 font-semibold">Conversion</th>
                <th className="text-center py-3 px-4 font-semibold">Avg Gift</th>
                <th className="text-center py-3 px-4 font-semibold">Progress</th>
                <th className="text-center py-3 px-4 font-semibold">Trend</th>
                <th className="text-center py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {segmentROIData.map((segment) => (
                <tr key={segment.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{segment.emoji}</span>
                      <div>
                        <p className="font-medium">{segment.name}</p>
                        <p className="text-xs text-gray-500">{segment.campaignsLaunched} campaigns • {segment.lastActivity}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div>
                      <p className="font-bold text-green-600">{formatCurrency(segment.raised)}</p>
                      <p className="text-xs text-gray-500">of {formatCurrency(segment.potential)}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-sm font-bold ${getROIColor(segment.roi)}`}>
                      {segment.roi}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div>
                      <p className="font-medium">{segment.conversionRate}%</p>
                      <p className="text-xs text-gray-500">{segment.contactsMade}/{segment.totalContacts}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <p className="font-medium">{formatCurrency(segment.avgGift)}</p>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(segment.raised / segment.potential) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {((segment.raised / segment.potential) * 100).toFixed(1)}%
                    </p>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {getTrendIcon(segment.trend)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex gap-1 justify-center">
                      <Button variant="outline" size="sm">📊 Details</Button>
                      <Button size="sm">🚀 Optimize</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="🎯 Performance Insights">
          <div className="space-y-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                <strong>🏆 Top Performer:</strong> Quiet Giants with 1,463% ROI - focus more resources here!
              </p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>📈 Growth Opportunity:</strong> Comeback Crew has 92% untapped potential - increase outreach.
              </p>
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>⚡ Quick Win:</strong> Neighborhood MVPs need only 6 more conversions to hit 25% rate.
              </p>
            </div>
          </div>
        </Card>

        <Card title="📈 Monthly Trend">
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">+127%</p>
              <p className="text-sm text-gray-600">Revenue growth this month</p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <p className="font-bold">Jan</p>
                <p className="text-gray-600">{formatCurrency(15600)}</p>
              </div>
              <div>
                <p className="font-bold">Feb</p>
                <p className="text-gray-600">{formatCurrency(25400)}</p>
              </div>
              <div>
                <p className="font-bold">Mar</p>
                <p className="text-green-600 font-bold">{formatCurrency(36600)}</p>
              </div>
            </div>
            <Button className="w-full" variant="secondary">
              View Detailed Analytics
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ROITrackingDashboard;
