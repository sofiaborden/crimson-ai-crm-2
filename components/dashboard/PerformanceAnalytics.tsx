import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { ChartBarIcon, ClockIcon, UserGroupIcon, CurrencyDollarIcon } from '../../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface AnalyticsData {
  segment: string;
  emoji: string;
  weeklyData: {
    week: string;
    contacts: number;
    responses: number;
    conversions: number;
    revenue: number;
    conversionRate: number;
    avgResponseTime: number;
  }[];
  bestPerformingDay: string;
  bestPerformingTime: string;
  topChannel: string;
  avgGiftTrend: 'up' | 'down' | 'stable';
}

const PerformanceAnalytics: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<'conversion' | 'revenue' | 'response' | 'efficiency'>('conversion');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const analyticsData: AnalyticsData[] = [
    {
      segment: 'Neighborhood MVPs',
      emoji: '🏆',
      weeklyData: [
        { week: 'Week 1', contacts: 25, responses: 18, conversions: 3, revenue: 7200, conversionRate: 12, avgResponseTime: 2.5 },
        { week: 'Week 2', contacts: 30, responses: 22, conversions: 4, revenue: 9600, conversionRate: 13.3, avgResponseTime: 2.1 },
        { week: 'Week 3', contacts: 28, responses: 20, conversions: 4, revenue: 8400, conversionRate: 14.3, avgResponseTime: 2.3 },
        { week: 'Week 4', contacts: 32, responses: 25, conversions: 5, revenue: 10800, conversionRate: 15.6, avgResponseTime: 1.9 }
      ],
      bestPerformingDay: 'Tuesday',
      bestPerformingTime: '10:00 AM',
      topChannel: 'Phone Call',
      avgGiftTrend: 'up'
    },
    {
      segment: 'Comeback Crew',
      emoji: '🔄',
      weeklyData: [
        { week: 'Week 1', contacts: 150, responses: 45, conversions: 6, revenue: 2100, conversionRate: 4.0, avgResponseTime: 4.2 },
        { week: 'Week 2', contacts: 180, responses: 54, conversions: 8, revenue: 2700, conversionRate: 4.4, avgResponseTime: 3.8 },
        { week: 'Week 3', contacts: 165, responses: 52, conversions: 8, revenue: 2520, conversionRate: 4.8, avgResponseTime: 3.5 },
        { week: 'Week 4', contacts: 200, responses: 68, conversions: 11, revenue: 3240, conversionRate: 5.5, avgResponseTime: 3.2 }
      ],
      bestPerformingDay: 'Tuesday',
      bestPerformingTime: '2:00 PM',
      topChannel: 'Email',
      avgGiftTrend: 'up'
    },
    {
      segment: 'Quiet Giants',
      emoji: '🤫',
      weeklyData: [
        { week: 'Week 1', contacts: 5, responses: 4, conversions: 1, revenue: 5000, conversionRate: 20, avgResponseTime: 1.5 },
        { week: 'Week 2', contacts: 4, responses: 3, conversions: 1, revenue: 6000, conversionRate: 25, avgResponseTime: 1.2 },
        { week: 'Week 3', contacts: 3, responses: 3, conversions: 1, revenue: 2500, conversionRate: 33.3, avgResponseTime: 1.8 },
        { week: 'Week 4', contacts: 6, responses: 5, conversions: 2, revenue: 9000, conversionRate: 33.3, avgResponseTime: 1.1 }
      ],
      bestPerformingDay: 'Wednesday',
      bestPerformingTime: '11:00 AM',
      topChannel: 'Personal Meeting',
      avgGiftTrend: 'up'
    }
  ];

  const getMetricData = (data: AnalyticsData[], metric: string) => {
    return data.map(segment => ({
      name: segment.segment,
      emoji: segment.emoji,
      data: segment.weeklyData.map(week => {
        switch (metric) {
          case 'conversion': return week.conversionRate;
          case 'revenue': return week.revenue;
          case 'response': return (week.responses / week.contacts) * 100;
          case 'efficiency': return week.revenue / week.contacts;
          default: return week.conversionRate;
        }
      })
    }));
  };

  const formatMetricValue = (value: number, metric: string) => {
    switch (metric) {
      case 'conversion':
      case 'response':
        return `${value.toFixed(1)}%`;
      case 'revenue':
        return `$${value.toLocaleString()}`;
      case 'efficiency':
        return `$${value.toFixed(0)}`;
      default:
        return value.toString();
    }
  };

  const getChartData = () => {
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    return weeks.map((week, weekIndex) => {
      const dataPoint: any = { week };
      analyticsData.forEach(segment => {
        const value = segment.weeklyData[weekIndex];
        switch (selectedMetric) {
          case 'conversion':
            dataPoint[segment.segment] = value.conversionRate;
            break;
          case 'revenue':
            dataPoint[segment.segment] = value.revenue;
            break;
          case 'response':
            dataPoint[segment.segment] = (value.responses / value.contacts) * 100;
            break;
          case 'efficiency':
            dataPoint[segment.segment] = value.revenue / value.contacts;
            break;
          default:
            dataPoint[segment.segment] = value.conversionRate;
        }
      });
      return dataPoint;
    });
  };

  const getSegmentColor = (segmentName: string) => {
    switch (segmentName) {
      case 'Neighborhood MVPs': return '#10b981'; // Green
      case 'Comeback Crew': return '#3b82f6'; // Blue
      case 'Quiet Giants': return '#8b5cf6'; // Purple
      default: return '#6b7280'; // Gray
    }
  };

  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case 'conversion': return 'Conversion Rate';
      case 'revenue': return 'Revenue';
      case 'response': return 'Response Rate';
      case 'efficiency': return 'Revenue per Contact';
      default: return 'Conversion Rate';
    }
  };

  const metricData = getMetricData(analyticsData, selectedMetric);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <ChartBarIcon className="w-6 h-6 text-purple-600" />
            Analytics
          </h2>
          <p className="text-text-secondary">Deep dive into conversion rates and trends</p>
        </div>
        <div className="flex gap-2">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Metric Selector */}
      <Card>
        <div className="flex flex-wrap gap-2 mb-4">
          {(['conversion', 'revenue', 'response', 'efficiency'] as const).map((metric) => (
            <Button
              key={metric}
              variant={selectedMetric === metric ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedMetric(metric)}
            >
              {getMetricLabel(metric)}
            </Button>
          ))}
        </div>

        {/* Performance Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">{getMetricLabel(selectedMetric)} Trends</h3>
            {selectedMetric === 'conversion' && (
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <span>Benchmarks:</span>
                <span className="text-green-600">15%+ Excellent</span>
                <span className="text-blue-600">10-15% Good</span>
                <span className="text-yellow-600">5-10% Fair</span>
                <span className="text-red-600">&lt;5% Needs Work</span>
              </div>
            )}
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="week"
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => formatMetricValue(value, selectedMetric)}
                />
                <Tooltip
                  formatter={(value: any, name: string) => [formatMetricValue(value, selectedMetric), name]}
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                {analyticsData.map((segment) => (
                  <Line
                    key={segment.segment}
                    type="monotone"
                    dataKey={segment.segment}
                    stroke={getSegmentColor(segment.segment)}
                    strokeWidth={3}
                    dot={{ fill: getSegmentColor(segment.segment), strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, stroke: getSegmentColor(segment.segment), strokeWidth: 2 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-200">
            {analyticsData.map((segment) => {
              const latestValue = segment.weeklyData[segment.weeklyData.length - 1];
              const previousValue = segment.weeklyData[segment.weeklyData.length - 2];
              const currentMetricValue = selectedMetric === 'conversion' ? latestValue.conversionRate :
                                      selectedMetric === 'revenue' ? latestValue.revenue :
                                      selectedMetric === 'response' ? (latestValue.responses / latestValue.contacts) * 100 :
                                      latestValue.revenue / latestValue.contacts;
              const previousMetricValue = selectedMetric === 'conversion' ? previousValue.conversionRate :
                                        selectedMetric === 'revenue' ? previousValue.revenue :
                                        selectedMetric === 'response' ? (previousValue.responses / previousValue.contacts) * 100 :
                                        previousValue.revenue / previousValue.contacts;
              const trend = currentMetricValue > previousMetricValue ? 'up' : currentMetricValue < previousMetricValue ? 'down' : 'stable';

              return (
                <div key={segment.segment} className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getSegmentColor(segment.segment) }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">{segment.segment}</span>
                  </div>
                  <div className="text-lg font-bold" style={{ color: getSegmentColor(segment.segment) }}>
                    {formatMetricValue(currentMetricValue, selectedMetric)}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                    {trend === 'up' && <span className="text-green-500">↗</span>}
                    {trend === 'down' && <span className="text-red-500">↘</span>}
                    {trend === 'stable' && <span className="text-gray-400">→</span>}
                    <span>vs last week</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Performance Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-green-50 border-green-200">
          <div className="flex items-center gap-3">
            <UserGroupIcon className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-green-600 font-medium">Best Conversion</p>
              <p className="text-xl font-bold text-green-800">50%</p>
              <p className="text-xs text-green-600">Quiet Giants</p>
            </div>
          </div>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3">
            <ClockIcon className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Avg Response Time</p>
              <p className="text-xl font-bold text-blue-800">2.1 hrs</p>
              <p className="text-xs text-blue-600">Across all segments</p>
            </div>
          </div>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <div className="flex items-center gap-3">
            <ChartBarIcon className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-sm text-purple-600 font-medium">Growth Rate</p>
              <p className="text-xl font-bold text-purple-800">+23%</p>
              <p className="text-xs text-purple-600">Month over month</p>
            </div>
          </div>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <div className="flex items-center gap-3">
            <CurrencyDollarIcon className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-sm text-orange-600 font-medium">Revenue/Contact</p>
              <p className="text-xl font-bold text-orange-800">$337</p>
              <p className="text-xs text-orange-600">Average efficiency</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Performance Table */}
      <Card title="📊 Detailed Performance Breakdown">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Segment</th>
                <th className="text-center py-3 px-4 font-semibold">Best Day</th>
                <th className="text-center py-3 px-4 font-semibold">Best Time</th>
                <th className="text-center py-3 px-4 font-semibold">Top Channel</th>
                <th className="text-center py-3 px-4 font-semibold">Avg Response</th>
                <th className="text-center py-3 px-4 font-semibold">Trend</th>
                <th className="text-center py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.map((segment, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{segment.emoji}</span>
                      <span className="font-medium">{segment.segment}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {segment.bestPerformingDay}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      {segment.bestPerformingTime}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                      {segment.topChannel}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-medium">
                      {segment.weeklyData[segment.weeklyData.length - 1].avgResponseTime}h
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${
                      segment.avgGiftTrend === 'up' ? 'bg-green-100 text-green-800' :
                      segment.avgGiftTrend === 'down' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {segment.avgGiftTrend === 'up' ? '📈 Up' : 
                       segment.avgGiftTrend === 'down' ? '📉 Down' : '➡️ Stable'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex gap-1 justify-center">
                      <Button variant="outline" size="sm">📊 Details</Button>
                      <Button size="sm">⚡ Optimize</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Actionable Insights */}
      <Card title="🎯 Actionable Insights">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-green-600">🚀 Optimization Opportunities</h4>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-green-50 rounded border border-green-200">
                <strong>Tuesday 10 AM:</strong> Schedule more Neighborhood MVP calls - 40% higher conversion
              </div>
              <div className="p-2 bg-blue-50 rounded border border-blue-200">
                <strong>Email timing:</strong> Comeback Crew responds best at 2 PM on weekdays
              </div>
              <div className="p-2 bg-purple-50 rounded border border-purple-200">
                <strong>Personal touch:</strong> Quiet Giants prefer in-person meetings (50% conversion)
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-orange-600">⚠️ Areas for Improvement</h4>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-orange-50 rounded border border-orange-200">
                <strong>Response time:</strong> Comeback Crew taking 3.2h avg - aim for under 2h
              </div>
              <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
                <strong>Weekend outreach:</strong> All segments show 60% lower response on weekends
              </div>
              <div className="p-2 bg-red-50 rounded border border-red-200">
                <strong>Follow-up gaps:</strong> 23% of initial contacts lack proper follow-up sequence
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PerformanceAnalytics;
