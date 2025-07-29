import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { 
  LightBulbIcon, 
  ChevronDownIcon, 
  ChevronUpIcon, 
  MagnifyingGlassIcon,
  FlagIcon,
  HashtagIcon,
  UserGroupIcon
} from '../../constants';

interface IntelligenceData {
  flags: Array<{
    name: string;
    count: number;
    color: string;
    action: string;
    strategy: string;
  }>;
  keywords: Array<{
    name: string;
    count: number;
    color: string;
    type: string;
    action: string;
    strategy: string;
  }>;
  clubs: Array<{
    name: string;
    count: number;
    color: string;
    avgDonation: number;
    potential: string;
    action: string;
    strategy: string;
  }>;
}

interface CompactIntelligenceCategoriesProps {
  data: IntelligenceData;
  onSearchCategory: (categoryType: string, categoryName: string, count: number) => void;
}

const CompactIntelligenceCategories: React.FC<CompactIntelligenceCategoriesProps> = ({ 
  data, 
  onSearchCategory 
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const CategoryItem: React.FC<{
    item: any;
    index: number;
    type: 'flag' | 'keyword' | 'club';
  }> = ({ item, index, type }) => (
    <div 
      className="flex items-center justify-between p-2 hover:bg-blue-50 rounded cursor-pointer group transition-colors"
      onClick={() => onSearchCategory(type, item.name, item.count)}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-xs font-medium text-gray-400 w-4">#{index + 1}</span>
        <Badge className={`${item.color} text-xs`}>{item.name}</Badge>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-right">
          <div className="text-sm font-semibold text-crimson-blue">
            {item.count.toLocaleString()}
          </div>
          {type === 'club' && (
            <div className="text-xs text-gray-600">
              Avg: ${item.avgDonation.toLocaleString()}
            </div>
          )}
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
            <LightBulbIcon className="w-5 h-5 text-crimson-blue" />
            <h3 className="text-lg font-semibold text-gray-900">Intelligence Categories</h3>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onSearchCategory('all', 'all-categories', 0)}
            className="text-xs"
          >
            View All
          </Button>
        </div>

        {/* Compact Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div 
            className="bg-red-50 p-3 rounded-lg cursor-pointer hover:bg-red-100 transition-colors group"
            onClick={() => toggleSection('flags')}
          >
            <div className="text-center">
              <FlagIcon className="w-4 h-4 text-red-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-red-600">{data.flags.length}</div>
              <div className="text-xs text-gray-600">Data Flags</div>
              <div className="flex items-center justify-center mt-1">
                {expandedSection === 'flags' ? (
                  <ChevronUpIcon className="w-3 h-3 text-red-600" />
                ) : (
                  <ChevronDownIcon className="w-3 h-3 text-red-600" />
                )}
              </div>
            </div>
          </div>

          <div 
            className="bg-purple-50 p-3 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors group"
            onClick={() => toggleSection('keywords')}
          >
            <div className="text-center">
              <HashtagIcon className="w-4 h-4 text-purple-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-purple-600">{data.keywords.length}</div>
              <div className="text-xs text-gray-600">Keywords</div>
              <div className="flex items-center justify-center mt-1">
                {expandedSection === 'keywords' ? (
                  <ChevronUpIcon className="w-3 h-3 text-purple-600" />
                ) : (
                  <ChevronDownIcon className="w-3 h-3 text-purple-600" />
                )}
              </div>
            </div>
          </div>

          <div 
            className="bg-green-50 p-3 rounded-lg cursor-pointer hover:bg-green-100 transition-colors group"
            onClick={() => toggleSection('clubs')}
          >
            <div className="text-center">
              <UserGroupIcon className="w-4 h-4 text-green-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-green-600">{data.clubs.length}</div>
              <div className="text-xs text-gray-600">Networks</div>
              <div className="flex items-center justify-center mt-1">
                {expandedSection === 'clubs' ? (
                  <ChevronUpIcon className="w-3 h-3 text-green-600" />
                ) : (
                  <ChevronDownIcon className="w-3 h-3 text-green-600" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Top 3 Quick View - Always Visible */}
        <div className="space-y-1 mb-3">
          <div className="text-xs font-medium text-gray-600 mb-2">🎯 Top Opportunities</div>
          {data.flags.slice(0, 3).map((flag, index) => (
            <div 
              key={flag.name}
              className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-blue-50 cursor-pointer group transition-colors"
              onClick={() => onSearchCategory('flag', flag.name, flag.count)}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-xs font-medium text-gray-400">#{index + 1}</span>
                <Badge className={`${flag.color} text-xs`}>{flag.name}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm font-semibold text-crimson-blue">
                  {flag.count.toLocaleString()}
                </div>
                <MagnifyingGlassIcon className="w-3 h-3 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>

        {/* Expandable Sections */}
        {expandedSection === 'flags' && (
          <div className="border-t pt-3 space-y-1">
            <div className="text-xs font-medium text-red-600 mb-2">Data Quality & Opportunities</div>
            {data.flags.map((flag, index) => (
              <CategoryItem key={flag.name} item={flag} index={index} type="flag" />
            ))}
          </div>
        )}

        {expandedSection === 'keywords' && (
          <div className="border-t pt-3 space-y-1">
            <div className="text-xs font-medium text-purple-600 mb-2">Political Engagement</div>
            {data.keywords.map((keyword, index) => (
              <CategoryItem key={keyword.name} item={keyword} index={index} type="keyword" />
            ))}
          </div>
        )}

        {expandedSection === 'clubs' && (
          <div className="border-t pt-3 space-y-1">
            <div className="text-xs font-medium text-green-600 mb-2">Donor Networks</div>
            {data.clubs.map((club, index) => (
              <CategoryItem key={club.name} item={club} index={index} type="club" />
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="border-t pt-3 mt-3">
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="secondary" 
              size="xs"
              onClick={() => onSearchCategory('high-value', 'high-value-prospects', 0)}
            >
              High-Value Prospects
            </Button>
            <Button 
              variant="secondary" 
              size="xs"
              onClick={() => onSearchCategory('engagement', 'high-engagement', 0)}
            >
              High Engagement
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CompactIntelligenceCategories;
