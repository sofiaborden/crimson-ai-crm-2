import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, MicrophoneIcon, SparklesIcon, FunnelIcon, BookmarkIcon, XMarkIcon, UserIcon, PhoneIcon, EnvelopeIcon, PlusIcon, CalendarIcon, CurrencyDollarIcon, ClockIcon, CheckCircleIcon, ExclamationTriangleIcon } from '../../constants';
import SearchFilters from './SearchFilters';

interface SearchFilter {
  id: string;
  field: string;
  operator: string;
  value: string;
  label: string;
}

interface PledgeResult {
  id: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  pledgeAmount: number;
  amountPaid: number;
  amountOutstanding: number;
  pledgeDate: string;
  dueDate: string;
  status: 'Outstanding' | 'Paid' | 'Overdue' | 'Partial';
  paymentSchedule: string;
  campaign: string;
  notes: string;
}

interface PledgesSearchProps {
  initialFilters?: SearchFilter[];
  searchContext?: string;
  onClose?: () => void;
}

const PledgesSearch: React.FC<PledgesSearchProps> = ({ initialFilters = [], searchContext, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilter[]>(initialFilters);
  const [results, setResults] = useState<PledgeResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [selectedResults, setSelectedResults] = useState<string[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  // Mock pledge data for demonstration
  const mockResults: PledgeResult[] = [
    {
      id: '1',
      donorName: 'Joseph Banks',
      donorEmail: 'j.banks@example.com',
      donorPhone: '(202) 555-0182',
      pledgeAmount: 5000,
      amountPaid: 2500,
      amountOutstanding: 2500,
      pledgeDate: '2024-03-15',
      dueDate: '2024-12-31',
      status: 'Outstanding',
      paymentSchedule: 'Quarterly',
      campaign: 'Annual Gala 2024',
      notes: 'Prefers quarterly payments'
    },
    {
      id: '2',
      donorName: 'Sarah Johnson',
      donorEmail: 'sarah.j@example.com',
      donorPhone: '(555) 123-4567',
      pledgeAmount: 2500,
      amountPaid: 0,
      amountOutstanding: 2500,
      pledgeDate: '2024-06-01',
      dueDate: '2024-08-15',
      status: 'Overdue',
      paymentSchedule: 'Lump Sum',
      campaign: 'Summer Appeal',
      notes: 'Follow up needed'
    },
    {
      id: '3',
      donorName: 'Michael Chen',
      donorEmail: 'mchen@example.com',
      donorPhone: '(703) 555-9876',
      pledgeAmount: 1200,
      amountPaid: 600,
      amountOutstanding: 600,
      pledgeDate: '2024-05-20',
      dueDate: '2024-11-20',
      status: 'Partial',
      paymentSchedule: 'Monthly',
      campaign: 'Building Fund',
      notes: 'Monthly auto-pay setup'
    }
  ];

  const aiSuggestionsData = [
    "Show me overdue pledges from this quarter",
    "Find large pledges over $1000 that are outstanding",
    "Pledges due in the next 30 days",
    "Donors with multiple outstanding pledges"
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
    if (suggestion.includes('overdue')) {
      addFilter('Status', 'equals', 'Overdue');
    }
    if (suggestion.includes('$1000')) {
      addFilter('Pledge Amount', '>=', '1000');
    }
    if (suggestion.includes('30 days')) {
      addFilter('Due Date', 'within', '30 days');
    }
  };

  const getResultsSummary = () => {
    const total = results.length;
    const totalOutstanding = results.reduce((sum, r) => sum + r.amountOutstanding, 0);
    const overdue = results.filter(r => r.status === 'Overdue').length;
    
    return {
      total,
      totalOutstanding,
      overdue
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Outstanding': return 'bg-blue-100 text-blue-800';
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      case 'Partial': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Outstanding': return <ClockIcon className="w-4 h-4" />;
      case 'Paid': return <CheckCircleIcon className="w-4 h-4" />;
      case 'Overdue': return <ExclamationTriangleIcon className="w-4 h-4" />;
      case 'Partial': return <CurrencyDollarIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  const summary = getResultsSummary();

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-crimson-blue p-2 rounded-lg">
            <CurrencyDollarIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Pledges Search</h2>
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
              placeholder="Search pledges by donor, campaign, amount, or ask CrimsonGPT..."
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
                <div className="text-2xl font-bold text-crimson-blue">{summary.total}</div>
                <div className="text-xs text-gray-600">Total Pledges</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">${summary.totalOutstanding.toLocaleString()}</div>
                <div className="text-xs text-gray-600">Outstanding</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">{summary.overdue}</div>
                <div className="text-xs text-gray-600">Overdue</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-crimson-blue text-white rounded-lg hover:bg-crimson-dark-blue transition-colors text-sm">
                <BookmarkIcon className="w-4 h-4 inline mr-2" />
                Save Search
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                <SparklesIcon className="w-4 h-4 inline mr-2" />
                Follow Up Campaign
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
            <p className="text-gray-600 mt-2">Searching pledges...</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-crimson-blue text-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Donor</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Pledge Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Outstanding</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Due Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Campaign</th>
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
                        <div className="font-medium text-gray-900">{result.donorName}</div>
                        <div className="text-sm text-gray-600">{result.donorEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">${result.pledgeAmount.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Paid: ${result.amountPaid.toLocaleString()}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-bold text-red-600">${result.amountOutstanding.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">{result.paymentSchedule}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900">{result.dueDate}</div>
                    <div className="text-xs text-gray-600">
                      <CalendarIcon className="w-3 h-3 inline mr-1" />
                      {result.pledgeDate}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${getStatusColor(result.status)}`}>
                      {getStatusIcon(result.status)}
                      {result.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900">{result.campaign}</div>
                    {result.notes && (
                      <div className="text-xs text-gray-600">{result.notes}</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="p-1 text-green-600 hover:bg-green-100 rounded" title="Call">
                        <PhoneIcon className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-blue-600 hover:bg-blue-100 rounded" title="Email">
                        <EnvelopeIcon className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-purple-600 hover:bg-purple-100 rounded" title="Payment Reminder">
                        <CalendarIcon className="w-4 h-4" />
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
            {results.length} pledges found • ${summary.totalOutstanding.toLocaleString()} outstanding
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              Export
            </button>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm">
              Send Reminders
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

export default PledgesSearch;
