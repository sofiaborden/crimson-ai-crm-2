import React from 'react';
import { CalendarIcon, TrendingUpIcon } from '../../constants';

const SeasonalInsights = () => {
  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 10 || month <= 1) return 'holiday';
    if (month >= 8 && month <= 10) return 'election';
    return 'standard';
  };

  const seasonalInsights = {
    holiday: {
      icon: '🎄',
      trend: 'Holiday Giving Season',
      insights: [
        'Major donors give 40% more in December',
        'Year-end tax considerations drive urgency',
        'Family/legacy messaging performs best'
      ]
    },
    election: {
      icon: '🗳️', 
      trend: 'Election Cycle Peak',
      insights: [
        'Small-dollar donors increase frequency by 65%',
        'Urgency messaging drives immediate action',
        'Policy-focused appeals outperform by 30%'
      ]
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <CalendarIcon className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-blue-900">
          {seasonalInsights[getCurrentSeason()]?.icon} {seasonalInsights[getCurrentSeason()]?.trend}
        </h3>
      </div>
      <ul className="space-y-1 text-sm text-blue-800">
        {seasonalInsights[getCurrentSeason()]?.insights.map((insight, i) => (
          <li key={i} className="flex items-start gap-2">
            <TrendingUpIcon className="w-3 h-3 mt-1 text-blue-600" />
            {insight}
          </li>
        ))}
      </ul>
    </div>
  );
};