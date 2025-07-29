import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, MicrophoneIcon, SparklesIcon, FunnelIcon, BookmarkIcon, XMarkIcon, ChevronDownIcon, UserIcon, PhoneIcon, EnvelopeIcon, PlusIcon } from '../../constants';
import SearchFilters from './SearchFilters';

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
  party: string;
  tags: string[];
}

interface PeopleSearchProps {
  initialFilters?: SearchFilter[];
  searchContext?: string;
  onClose?: () => void;
}

const PeopleSearch: React.FC<PeopleSearchProps> = ({ initialFilters = [], searchContext, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilter[]>(initialFilters);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [selectedResults, setSelectedResults] = useState<string[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

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
      totalGifts: 2500,
      party: 'Republican',
      tags: ['Major Donor', 'VIP']
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.j@example.com',
      phone: '(555) 123-4567',
      address: '456 Oak Ave, Arlington VA',
      lastGift: '2024-07-01',
      totalGifts: 750,
      party: 'Republican',
      tags: ['Active Voter']
    },
    {
      id: '3',
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'mchen@example.com',
      phone: '(703) 555-9876',
      address: '789 Pine Rd, Alexandria VA',
      lastGift: '2024-05-20',
      totalGifts: 1200,
      party: 'Independent',
      tags: ['Recurring Donor']
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
    setResults(mockResults);
  }, []);

  const handleSearch = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setResults(mockResults);
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
            <h2 className="text-lg font-bold text-gray-900">People Search</h2>
            {searchContext && (
              <p className="text-sm text-gray-600">Search Results: {searchContext}</p>
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

        {/* AI Suggestions */}
        {aiSuggestions.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-gray-600 mb-2">💡 Try asking CrimsonGPT:</p>
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
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Last Gift</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Total Gifts</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Party</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.map((result, index) => (
                <tr key={result.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{result.firstName} {result.lastName}</div>
                        <div className="flex gap-1 mt-1">
                          {result.tags.map((tag, i) => (
                            <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900">{result.email}</div>
                    <div className="text-sm text-gray-600">{result.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{result.lastGift}</td>
                  <td className="px-4 py-3 text-sm font-medium text-green-600">${result.totalGifts.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      result.party === 'Republican' ? 'bg-red-100 text-red-800' : 
                      result.party === 'Democrat' ? 'bg-blue-100 text-blue-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {result.party}
                    </span>
                  </td>
                  <td className="px-4 py-3">
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
                  </td>
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
            {results.length} records found
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              Export
            </button>
            <button className="px-4 py-2 bg-crimson-blue text-white rounded-lg hover:bg-crimson-dark-blue transition-colors text-sm">
              Bulk Actions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeopleSearch;
