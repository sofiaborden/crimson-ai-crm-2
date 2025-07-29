import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { MapPinIcon, ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon } from '../../constants';

interface GeographicData {
  states: Array<{
    name: string;
    count: number;
    raised: number;
    strength: string;
  }>;
  counties: Array<{
    name: string;
    count: number;
    raised: number;
    strength: string;
    potential: string;
    strategy: string;
  }>;
  cities: Array<{
    name: string;
    count: number;
    raised: number;
    strength: string;
    potential: string;
    action: string;
    strategy: string;
  }>;
}

interface CompactGeographicIntelligenceProps {
  data: GeographicData;
  onSearchLocation: (locationType: string, locationName: string, count: number) => void;
}

const CompactGeographicIntelligence: React.FC<CompactGeographicIntelligenceProps> = ({ 
  data, 
  onSearchLocation 
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const LocationItem: React.FC<{
    item: any;
    index: number;
    type: 'state' | 'county' | 'city';
  }> = ({ item, index, type }) => (
    <div 
      className="flex items-center justify-between p-2 hover:bg-blue-50 rounded cursor-pointer group transition-colors"
      onClick={() => onSearchLocation(type, item.name, item.count)}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-xs font-medium text-gray-400 w-4">#{index + 1}</span>
        <div className="min-w-0 flex-1">
          <div className="font-medium text-gray-900 text-sm truncate">{item.name}</div>
          {item.strength && (
            <div className="text-xs text-blue-600 truncate">{item.strength}</div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-right">
          <div className="text-sm font-semibold text-crimson-blue">
            {item.count.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600">
            ${(item.raised / 1000000).toFixed(1)}M
          </div>
        </div>
        <MagnifyingGlassIcon className="w-3 h-3 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );

  return (
    <Card className="overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-5 h-5 text-crimson-blue" />
            <h3 className="text-lg font-semibold text-gray-900">Geographic Intelligence</h3>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onSearchLocation('all', 'all-locations', 0)}
            className="text-xs"
          >
            View All
          </Button>
        </div>

        {/* Compact Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div 
            className="bg-blue-50 p-3 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors group"
            onClick={() => toggleSection('states')}
          >
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{data.states.length}</div>
              <div className="text-xs text-gray-600">Top States</div>
              <div className="flex items-center justify-center mt-1">
                {expandedSection === 'states' ? (
                  <ChevronUpIcon className="w-3 h-3 text-blue-600" />
                ) : (
                  <ChevronDownIcon className="w-3 h-3 text-blue-600" />
                )}
              </div>
            </div>
          </div>

          <div 
            className="bg-green-50 p-3 rounded-lg cursor-pointer hover:bg-green-100 transition-colors group"
            onClick={() => toggleSection('counties')}
          >
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{data.counties.length}</div>
              <div className="text-xs text-gray-600">Counties</div>
              <div className="flex items-center justify-center mt-1">
                {expandedSection === 'counties' ? (
                  <ChevronUpIcon className="w-3 h-3 text-green-600" />
                ) : (
                  <ChevronDownIcon className="w-3 h-3 text-green-600" />
                )}
              </div>
            </div>
          </div>

          <div 
            className="bg-purple-50 p-3 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors group"
            onClick={() => toggleSection('cities')}
          >
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{data.cities.length}</div>
              <div className="text-xs text-gray-600">Markets</div>
              <div className="flex items-center justify-center mt-1">
                {expandedSection === 'cities' ? (
                  <ChevronUpIcon className="w-3 h-3 text-purple-600" />
                ) : (
                  <ChevronDownIcon className="w-3 h-3 text-purple-600" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Top 3 Quick View - Always Visible */}
        <div className="space-y-1 mb-3">
          <div className="text-xs font-medium text-gray-600 mb-2">🏆 Top Performers</div>
          {data.states.slice(0, 3).map((state, index) => (
            <div 
              key={state.name}
              className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-blue-50 cursor-pointer group transition-colors"
              onClick={() => onSearchLocation('state', state.name, state.count)}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-400">#{index + 1}</span>
                <span className="text-sm font-medium text-gray-900">{state.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-sm font-semibold text-crimson-blue">
                    {state.count.toLocaleString()}
                  </div>
                </div>
                <MagnifyingGlassIcon className="w-3 h-3 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>

        {/* Expandable Sections */}
        {expandedSection === 'states' && (
          <div className="border-t pt-3 space-y-1">
            <div className="text-xs font-medium text-blue-600 mb-2">All States</div>
            {data.states.map((state, index) => (
              <LocationItem key={state.name} item={state} index={index} type="state" />
            ))}
          </div>
        )}

        {expandedSection === 'counties' && (
          <div className="border-t pt-3 space-y-1">
            <div className="text-xs font-medium text-green-600 mb-2">Strategic Counties</div>
            {data.counties.map((county, index) => (
              <LocationItem key={county.name} item={county} index={index} type="county" />
            ))}
          </div>
        )}

        {expandedSection === 'cities' && (
          <div className="border-t pt-3 space-y-1">
            <div className="text-xs font-medium text-purple-600 mb-2">Fundraising Markets</div>
            {data.cities.map((city, index) => (
              <LocationItem key={city.name} item={city} index={index} type="city" />
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="border-t pt-3 mt-3">
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              size="xs" 
              className="flex-1"
              onClick={() => onSearchLocation('missing-address', 'missing-address', 0)}
            >
              Missing Addresses
            </Button>
            <Button 
              variant="secondary" 
              size="xs" 
              className="flex-1"
              onClick={() => onSearchLocation('swing-states', 'swing-states', 0)}
            >
              Swing States
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CompactGeographicIntelligence;
