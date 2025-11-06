import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, MicrophoneIcon, SparklesIcon, FunnelIcon, BookmarkIcon, XMarkIcon, ChevronDownIcon, UserIcon, PhoneIcon, EnvelopeIcon, PlusIcon, SettingsIcon, ChatBubbleLeftRightIcon, ArrowPathIcon } from '../../constants';
import PeopleSearchActionsDropdown from './PeopleSearchActionsDropdown';
import CreateSmartSegmentModal from './CreateSmartSegmentModal';
import SearchFilters from './SearchFilters';
import ColumnCustomizer from '../ui/ColumnCustomizer';
import SortableHeader from '../ui/SortableHeader';
import SmartTag from '../ui/SmartTag';

interface SearchFilter {
  id: string;
  field: string;
  operator: string;
  value: string;
  label: string;
}

interface SearchResult {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  lastGift: string;
  totalGifts: number;
  lifetimeTotal: number;
  suggestedAsk: number;
  suggestedAction: string;
  party: string;
  tags: string[];
  smartTags?: Array<{
    name: string;
    emoji: string;
    color: string;
  }>;
  // Additional fields for column customization
  firstGiftDate?: string;
  highestGift?: number;
  highestGiftDate?: string;
  ctdTotal?: number;
  zip?: string;
  homePhone?: string;
  employer?: string;
  occupation?: string;
  mrc?: string;
  mrcDate?: string;
  firstGift?: number;
  middle?: string;
  suffix?: string;
  street?: string;
  city?: string;
  state?: string;
}

interface PeopleSearchProps {
  initialFilters?: SearchFilter[];
  searchContext?: string;
  onClose?: () => void;
  onSegmentClick?: (segmentId: string, segmentName: string) => void;
  filterSelectionMode?: boolean;
  onFiltersSelected?: (filters: SearchFilter[]) => void;
}

const PeopleSearch: React.FC<PeopleSearchProps> = ({
  initialFilters = [],
  searchContext,
  onClose,
  onSegmentClick,
  filterSelectionMode = false,
  onFiltersSelected
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilter[]>(initialFilters);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [selectedResults, setSelectedResults] = useState<string[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showCreateSegmentModal, setShowCreateSegmentModal] = useState(false);
  const [showColumnCustomizer, setShowColumnCustomizer] = useState(false);
  const [crimsonGPTPrompt, setCrimsonGPTPrompt] = useState('');
  const [isProcessingPrompt, setIsProcessingPrompt] = useState(false);
  const [sortConfig, setSortConfig] = useState<{key: string; direction: 'asc' | 'desc'} | null>(null);

  // Column configuration
  const [columns, setColumns] = useState([
    { id: 'name', label: 'Name', enabled: true, category: 'Basic Info' },
    { id: 'contact', label: 'Contact', enabled: true, category: 'Basic Info' },
    { id: 'lastGift', label: 'Last Gift', enabled: true, category: 'Giving History' },
    { id: 'lifetimeTotal', label: 'Total($)', enabled: true, category: 'Giving History' },
    { id: 'suggestedAsk', label: 'Suggested Ask', enabled: true, category: 'Giving History' },
    { id: 'suggestedAction', label: 'Suggested Action', enabled: true, category: 'Basic Info' },
    { id: 'party', label: 'Party', enabled: true, category: 'Political' },
    { id: 'actions', label: 'Actions', enabled: true, category: 'Basic Info' },
    // Additional columns from your requirements
    { id: 'firstGiftDate', label: 'First Gift Date', enabled: false, category: 'Giving History' },
    { id: 'highestGift', label: 'Highest $', enabled: false, category: 'Giving History' },
    { id: 'highestGiftDate', label: 'Highest $ Date', enabled: false, category: 'Giving History' },
    { id: 'totalGifts', label: '#Gifts', enabled: false, category: 'Giving History' },
    { id: 'ctdTotal', label: 'CTD $', enabled: false, category: 'Giving History' },
    { id: 'zip', label: 'Zip', enabled: false, category: 'Address' },
    { id: 'homePhone', label: 'Home#', enabled: false, category: 'Contact' },
    { id: 'email', label: 'Email', enabled: false, category: 'Contact' },
    { id: 'employer', label: 'Employer', enabled: false, category: 'Professional' },
    { id: 'occupation', label: 'Occupation', enabled: false, category: 'Professional' },
    { id: 'mrc', label: 'MRC', enabled: false, category: 'Professional' },
    { id: 'mrcDate', label: 'MRC Date', enabled: false, category: 'Professional' },
    { id: 'firstGift', label: 'First Gift', enabled: false, category: 'Giving History' },
    { id: 'middle', label: 'Middle', enabled: false, category: 'Name' },
    { id: 'suffix', label: 'Suffix', enabled: false, category: 'Name' },
    { id: 'street', label: 'Street', enabled: false, category: 'Address' },
    { id: 'city', label: 'City', enabled: false, category: 'Address' },
    { id: 'state', label: 'State', enabled: false, category: 'Address' }
  ]);

  // Helper function to generate smart tags for a result
  const generateSmartTags = (result: SearchResult) => {
    const tags = [];

    if (result.lifetimeTotal > 500) {
      tags.push({ name: 'Big Givers', emoji: '💰', color: '#10B981' });
    }

    if (result.party === 'Republican' && result.lifetimeTotal > 200) {
      tags.push({ name: 'Prime Persuadables', emoji: '🎯', color: '#8B5CF6' });
    }

    if (result.totalGifts <= 3) {
      tags.push({ name: 'New & Rising Donors', emoji: '⚡', color: '#3B82F6' });
    }

    // Mock logic for other tags
    const nameHash = result.firstName.length + result.lastName.length;
    if (nameHash % 5 === 0) {
      tags.push({ name: 'Not Yet Registered to Vote', emoji: '🚧', color: '#F59E0B' });
    }

    return tags;
  };

  // Sorting function
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort results based on current sort config
  const sortedResults = React.useMemo(() => {
    if (!sortConfig) return results;

    return [...results].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof SearchResult];
      const bValue = b[sortConfig.key as keyof SearchResult];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [results, sortConfig]);

  // Mock data for demonstration
  const mockResults: SearchResult[] = [
    {
      id: '1',
      firstName: 'Joseph',
      lastName: 'Banks',
      email: 'j.banks@example.com',
      phone: '(202) 555-0182',
      address: '123 Main St, Washington DC',
      lastGift: '2024-06-15',
      totalGifts: 12,
      lifetimeTotal: 8750,
      suggestedAsk: 1000,
      suggestedAction: 'Schedule major donor meeting',
      party: 'Republican',
      tags: ['Major Donor', 'VIP'],
      firstGiftDate: '2022-01-15',
      highestGift: 2500,
      highestGiftDate: '2024-06-15',
      ctdTotal: 5000,
      zip: '20001',
      homePhone: '(202) 555-0182',
      employer: 'Banks & Associates',
      occupation: 'Attorney',
      mrc: 'Legal Services',
      mrcDate: '2024-01-01',
      firstGift: 250,
      middle: 'M',
      suffix: '',
      street: '123 Main St',
      city: 'Washington',
      state: 'DC'
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.j@example.com',
      phone: '(555) 123-4567',
      address: '456 Oak Ave, Arlington VA',
      lastGift: '2024-07-01',
      totalGifts: 3,
      lifetimeTotal: 750,
      suggestedAsk: 500,
      suggestedAction: 'Send personalized thank you',
      party: 'Republican',
      tags: ['Active Voter'],
      firstGiftDate: '2024-01-15',
      highestGift: 300,
      highestGiftDate: '2024-07-01',
      ctdTotal: 750,
      zip: '22201',
      homePhone: '(555) 123-4567',
      employer: 'Johnson Marketing',
      occupation: 'Marketing Director',
      mrc: 'Marketing',
      mrcDate: '2024-01-01',
      firstGift: 150,
      middle: 'A',
      suffix: '',
      street: '456 Oak Ave',
      city: 'Arlington',
      state: 'VA'
    },
    {
      id: '3',
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'mchen@example.com',
      phone: '(703) 555-9876',
      address: '789 Pine Rd, Alexandria VA',
      lastGift: '2024-05-20',
      totalGifts: 8,
      lifetimeTotal: 1200,
      suggestedAsk: 750,
      suggestedAction: 'Invite to VIP event',
      party: 'Independent',
      tags: ['Recurring Donor'],
      firstGiftDate: '2023-03-10',
      highestGift: 400,
      highestGiftDate: '2024-05-20',
      ctdTotal: 800,
      zip: '22314',
      homePhone: '(703) 555-9876',
      employer: 'Tech Solutions Inc',
      occupation: 'Software Engineer',
      mrc: 'Technology',
      mrcDate: '2024-01-01',
      firstGift: 100,
      middle: 'L',
      suffix: '',
      street: '789 Pine Rd',
      city: 'Alexandria',
      state: 'VA'
    }
  ];

  const aiSuggestionsData = [
    "Show me donors in Texas who gave over $500 last year",
    "Find Republican women aged 45-64 in swing states",
    "Lapsed donors with high engagement scores",
    "Major donors missing email addresses"
  ];

  useEffect(() => {
    setAiSuggestions(aiSuggestionsData);
    // Add smart tags to mock results
    const resultsWithSmartTags = mockResults.map(result => ({
      ...result,
      smartTags: generateSmartTags(result)
    }));
    setResults(resultsWithSmartTags);
  }, []);

  const handleSearch = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const resultsWithSmartTags = mockResults.map(result => ({
        ...result,
        smartTags: generateSmartTags(result)
      }));
      setResults(resultsWithSmartTags);
      setIsLoading(false);
    }, 1000);
  };

  const addFilter = (field: string, operator: string, value: string) => {
    const newFilter: SearchFilter = {
      id: Date.now().toString(),
      field,
      operator,
      value,
      label: `${field} ${operator} ${value}`
    };
    setFilters([...filters, newFilter]);
  };

  const removeFilter = (filterId: string) => {
    setFilters(filters.filter(f => f.id !== filterId));
  };

  const handleAiSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    // Parse suggestion and add appropriate filters
    if (suggestion.includes('Texas')) {
      addFilter('State', 'equals', 'TX');
    }
    if (suggestion.includes('$500')) {
      addFilter('Gift Amount', '>=', '500');
    }
    if (suggestion.includes('Republican')) {
      addFilter('Party', 'equals', 'Republican');
    }
    if (suggestion.includes('women')) {
      addFilter('Gender', 'equals', 'Female');
    }
  };

  const handleCrimsonGPTPrompt = async () => {
    if (!crimsonGPTPrompt.trim()) return;

    setIsProcessingPrompt(true);

    // Simulate AI processing
    setTimeout(() => {
      // Parse the prompt and set as search query
      setSearchQuery(crimsonGPTPrompt);

      // Parse prompt and add appropriate filters (simplified logic)
      const prompt = crimsonGPTPrompt.toLowerCase();
      if (prompt.includes('texas')) {
        addFilter('State', 'equals', 'TX');
      }
      if (prompt.includes('california')) {
        addFilter('State', 'equals', 'CA');
      }
      if (prompt.includes('republican')) {
        addFilter('Party', 'equals', 'Republican');
      }
      if (prompt.includes('democrat')) {
        addFilter('Party', 'equals', 'Democrat');
      }
      if (prompt.includes('women') || prompt.includes('female')) {
        addFilter('Gender', 'equals', 'Female');
      }
      if (prompt.includes('men') || prompt.includes('male')) {
        addFilter('Gender', 'equals', 'Male');
      }

      // Extract dollar amounts
      const amountMatch = prompt.match(/\$(\d+)/);
      if (amountMatch) {
        addFilter('Gift Amount', '>=', amountMatch[1]);
      }

      setIsProcessingPrompt(false);
      setCrimsonGPTPrompt('');

      // Trigger search
      handleSearch();
    }, 2000);
  };

  const getResultsSummary = () => {
    const total = results.length;
    const avgGift = results.reduce((sum, r) => sum + r.totalGifts, 0) / total;
    const republicanPct = (results.filter(r => r.party === 'Republican').length / total) * 100;
    
    return {
      total,
      avgGift: avgGift.toFixed(0),
      republicanPct: republicanPct.toFixed(0)
    };
  };

  const summary = getResultsSummary();

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-crimson-blue p-2 rounded-lg">
            <MagnifyingGlassIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {filterSelectionMode ? 'Select People Filters' : 'People Search'}
            </h2>
            {searchContext && (
              <p className="text-sm text-gray-600">
                {filterSelectionMode ? `Filter Selection: ${searchContext}` : `Search Results: ${searchContext}`}
              </p>
            )}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, ID, or ask CrimsonGPT..."
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <button className="absolute right-3 top-3 p-0.5 text-gray-400 hover:text-crimson-blue transition-colors">
              <MicrophoneIcon className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-lg border transition-colors ${
              showFilters 
                ? 'bg-crimson-blue text-white border-crimson-blue' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <FunnelIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-crimson-blue text-white rounded-lg hover:bg-crimson-dark-blue transition-colors font-medium"
          >
            Search
          </button>
        </div>

        {/* CrimsonGPT Prompt Interface */}
        <div className="mt-4">
          <div className="bg-gradient-to-r from-crimson-blue to-crimson-dark-blue rounded-lg p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-white bg-opacity-20 p-1.5 rounded-lg">
                <ChatBubbleLeftRightIcon className="w-4 h-4 text-white" />
              </div>
              <h4 className="font-semibold text-white text-sm">CrimsonGPT People Search</h4>
              <SparklesIcon className="w-4 h-4 text-crimson-accent-blue" />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={crimsonGPTPrompt}
                onChange={(e) => setCrimsonGPTPrompt(e.target.value)}
                placeholder="Describe who you're looking for: 'Find all donors in Texas who gave over $500 last year'"
                className="flex-1 px-3 py-2 rounded-lg border-0 bg-white bg-opacity-90 text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-white focus:bg-white transition-all text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleCrimsonGPTPrompt()}
              />
              <button
                onClick={handleCrimsonGPTPrompt}
                disabled={!crimsonGPTPrompt.trim() || isProcessingPrompt}
                className="bg-white bg-opacity-20 hover:bg-white hover:bg-opacity-30 text-white border border-white border-opacity-30 px-4 py-2 rounded-lg transition-all text-sm font-medium"
              >
                {isProcessingPrompt ? (
                  <>
                    <ArrowPathIcon className="w-3 h-3 mr-1 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <ArrowPathIcon className="w-3 h-3 mr-1" />
                    Search
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-white text-opacity-90 mt-2 leading-relaxed">
              CrimsonGPT will parse your request and apply the right filters automatically.
            </p>
          </div>

          {/* Quick Suggestions */}
          {aiSuggestions.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-gray-600 mb-2">💡 Try these examples:</p>
              <div className="flex flex-wrap gap-2">
                {aiSuggestions.slice(0, 2).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleAiSuggestion(suggestion)}
                    className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      <SearchFilters
        filters={filters}
        onFiltersChange={setFilters}
        isVisible={showFilters}
        onToggleVisibility={() => setShowFilters(!showFilters)}
      />

      {/* Results Summary */}
      {results.length > 0 && (
        <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-crimson-blue">{summary.total.toLocaleString()}</div>
                <div className="text-xs text-gray-600">Total Records</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">${summary.avgGift}</div>
                <div className="text-xs text-gray-600">Avg Donation</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{summary.republicanPct}%</div>
                <div className="text-xs text-gray-600">Republican</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowColumnCustomizer(true)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                <SettingsIcon className="w-4 h-4 inline mr-2" />
                Columns
              </button>
              <button className="px-4 py-2 bg-crimson-blue text-white rounded-lg hover:bg-crimson-dark-blue transition-colors text-sm">
                <BookmarkIcon className="w-4 h-4 inline mr-2" />
                Save Search
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                <SparklesIcon className="w-4 h-4 inline mr-2" />
                Create Smart Segment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-crimson-blue mx-auto"></div>
            <p className="text-gray-600 mt-2">Searching...</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-crimson-blue text-white">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  <input type="checkbox" className="rounded" />
                </th>
                {columns.filter(col => col.enabled).map(column => (
                  <th key={column.id} className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    {column.id === 'actions' ? (
                      column.label
                    ) : (
                      <SortableHeader
                        label={column.label}
                        sortKey={column.id}
                        currentSort={sortConfig}
                        onSort={handleSort}
                        className="text-white hover:text-gray-200"
                      />
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedResults.map((result, index) => (
                <tr key={result.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-3">
                    <input type="checkbox" className="rounded" />
                  </td>
                  {columns.filter(col => col.enabled).map(column => (
                    <td key={column.id} className="px-3 py-3">
                      {column.id === 'name' && (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">
                              {result.firstName} {result.lastName}
                            </div>
                            <div className="flex flex-wrap gap-0.5 mt-0.5">
                              {result.smartTags?.slice(0, 2).map((tag, i) => (
                                <SmartTag
                                  key={i}
                                  name={tag.name}
                                  emoji={tag.emoji}
                                  color={tag.color}
                                  size="xs"
                                  showAI={false}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      {column.id === 'contact' && (
                        <div>
                          <div className="text-sm text-gray-900">{result.email}</div>
                          <div className="text-sm text-gray-600">{result.phone}</div>
                        </div>
                      )}
                      {column.id === 'lastGift' && (
                        <div className="text-sm text-gray-900">{result.lastGift}</div>
                      )}
                      {column.id === 'lifetimeTotal' && (
                        <div className="text-sm font-medium text-green-600">${result.lifetimeTotal.toLocaleString()}</div>
                      )}
                      {column.id === 'suggestedAsk' && (
                        <div className="text-sm font-medium text-blue-600">${result.suggestedAsk.toLocaleString()}</div>
                      )}
                      {column.id === 'suggestedAction' && (
                        <div className="text-sm text-gray-900">{result.suggestedAction}</div>
                      )}
                      {column.id === 'party' && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          result.party === 'Republican' ? 'bg-red-100 text-red-800' :
                          result.party === 'Democrat' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {result.party}
                        </span>
                      )}
                      {column.id === 'actions' && (
                        <div className="flex gap-1">
                          <button className="p-1 text-green-600 hover:bg-green-100 rounded" title="Call">
                            <PhoneIcon className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-blue-600 hover:bg-blue-100 rounded" title="Email">
                            <EnvelopeIcon className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-purple-600 hover:bg-purple-100 rounded" title="Add to List">
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {/* Additional columns */}
                      {column.id === 'firstGiftDate' && (
                        <div className="text-sm text-gray-900">{result.firstGiftDate || '—'}</div>
                      )}
                      {column.id === 'highestGift' && (
                        <div className="text-sm font-medium text-green-600">${result.highestGift?.toLocaleString() || '—'}</div>
                      )}
                      {column.id === 'highestGiftDate' && (
                        <div className="text-sm text-gray-900">{result.highestGiftDate || '—'}</div>
                      )}
                      {column.id === 'totalGifts' && (
                        <div className="text-sm text-gray-900">{result.totalGifts}</div>
                      )}
                      {column.id === 'ctdTotal' && (
                        <div className="text-sm font-medium text-green-600">${result.ctdTotal?.toLocaleString() || '—'}</div>
                      )}
                      {column.id === 'zip' && (
                        <div className="text-sm text-gray-900">{result.zip || '—'}</div>
                      )}
                      {column.id === 'homePhone' && (
                        <div className="text-sm text-gray-900">{result.homePhone || '—'}</div>
                      )}
                      {column.id === 'email' && (
                        <div className="text-sm text-gray-900">{result.email}</div>
                      )}
                      {column.id === 'employer' && (
                        <div className="text-sm text-gray-900">{result.employer || '—'}</div>
                      )}
                      {column.id === 'occupation' && (
                        <div className="text-sm text-gray-900">{result.occupation || '—'}</div>
                      )}
                      {column.id === 'mrc' && (
                        <div className="text-sm text-gray-900">{result.mrc || '—'}</div>
                      )}
                      {column.id === 'mrcDate' && (
                        <div className="text-sm text-gray-900">{result.mrcDate || '—'}</div>
                      )}
                      {column.id === 'firstGift' && (
                        <div className="text-sm font-medium text-green-600">${result.firstGift?.toLocaleString() || '—'}</div>
                      )}
                      {column.id === 'middle' && (
                        <div className="text-sm text-gray-900">{result.middle || '—'}</div>
                      )}
                      {column.id === 'suffix' && (
                        <div className="text-sm text-gray-900">{result.suffix || '—'}</div>
                      )}
                      {column.id === 'street' && (
                        <div className="text-sm text-gray-900">{result.street || '—'}</div>
                      )}
                      {column.id === 'city' && (
                        <div className="text-sm text-gray-900">{result.city || '—'}</div>
                      )}
                      {column.id === 'state' && (
                        <div className="text-sm text-gray-900">{result.state || '—'}</div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {filterSelectionMode
              ? `${filters.length} filter${filters.length !== 1 ? 's' : ''} configured`
              : `${results.length} records found`
            }
          </div>
          <div className="flex gap-2">
            {filterSelectionMode ? (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onFiltersSelected && onFiltersSelected(filters)}
                  className="px-4 py-2 bg-crimson-blue text-white rounded-lg hover:bg-crimson-dark-blue transition-colors text-sm"
                >
                  Apply Filters
                </button>
              </>
            ) : (
              <>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  Export
                </button>
                <PeopleSearchActionsDropdown
                  selectedCount={selectedResults.length}
                  totalCount={results.length}
                  onCreateSmartSegment={() => setShowCreateSegmentModal(true)}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Create Smart Segment Modal */}
      <CreateSmartSegmentModal
        isOpen={showCreateSegmentModal}
        onClose={() => setShowCreateSegmentModal(false)}
        searchCriteria={searchQuery || 'Current search results'}
        resultCount={results.length}
        onSegmentCreated={onSegmentClick}
      />

      {/* Column Customizer Modal */}
      <ColumnCustomizer
        isOpen={showColumnCustomizer}
        onClose={() => setShowColumnCustomizer(false)}
        columns={columns}
        onColumnsChange={setColumns}
        title="Customize People Search Columns"
      />
    </div>
  );
};

export default PeopleSearch;
