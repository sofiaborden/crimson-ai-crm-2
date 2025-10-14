import React, { useState, useEffect } from 'react';
import { PlusIcon, XMarkIcon, CalendarIcon, SparklesIcon, ChatBubbleLeftRightIcon } from '../../constants';
import Button from '../ui/Button';

interface SmartTagFilter {
  id: string;
  field: string;
  operator: string;
  value: string;
  value2?: string; // For "between" operations
  label: string;
}

interface SmartTagFiltersProps {
  onFiltersChange: (filters: SmartTagFilter[]) => void;
  initialFilters?: SmartTagFilter[];
}

const SmartTagFilters: React.FC<SmartTagFiltersProps> = ({
  onFiltersChange,
  initialFilters = []
}) => {
  const [filters, setFilters] = useState<SmartTagFilter[]>(initialFilters);
  const [newFilter, setNewFilter] = useState({
    field: '',
    operator: '',
    value: '',
    value2: ''
  });

  // CrimsonGPT state
  const [crimsonGPTPrompt, setCrimsonGPTPrompt] = useState('');
  const [isProcessingPrompt, setIsProcessingPrompt] = useState(false);
  const [showCrimsonGPT, setShowCrimsonGPT] = useState(false);

  const filterFields = [
    { value: 'smartTags', label: 'Smart Tags', type: 'select' },
    { value: 'totalGiving', label: 'Total Giving', type: 'currency' },
    { value: 'giftCount', label: 'Number of Gifts', type: 'number' },
    { value: 'lastGiftDate', label: 'Last Gift Date', type: 'date' },
    { value: 'firstGiftDate', label: 'First Gift Date', type: 'date' },
    { value: 'averageGift', label: 'Average Gift Amount', type: 'currency' },
    { value: 'largestGift', label: 'Largest Gift Amount', type: 'currency' },
    { value: 'state', label: 'State', type: 'text' },
    { value: 'city', label: 'City', type: 'text' },
    { value: 'zipCode', label: 'ZIP Code', type: 'text' },
    { value: 'age', label: 'Age', type: 'number' },
    { value: 'gender', label: 'Gender', type: 'select' },
    { value: 'party', label: 'Political Party', type: 'select' },
    { value: 'voterStatus', label: 'Voter Registration', type: 'select' },
    { value: 'occupation', label: 'Occupation', type: 'text' },
    { value: 'employer', label: 'Employer', type: 'text' },
    { value: 'email', label: 'Email Address', type: 'text' },
    { value: 'phone', label: 'Phone Number', type: 'text' }
  ];

  const getOperatorsForField = (field: string) => {
    const fieldInfo = filterFields.find(f => f.value === field);
    if (!fieldInfo) return [];

    switch (fieldInfo.type) {
      case 'currency':
      case 'number':
        return [
          { value: 'equals', label: 'equals' },
          { value: '>', label: 'greater than' },
          { value: '>=', label: 'greater than or equal to' },
          { value: '<', label: 'less than' },
          { value: '<=', label: 'less than or equal to' },
          { value: 'between', label: 'between' }
        ];

      case 'date':
        return [
          { value: 'on', label: 'on' },
          { value: 'before', label: 'on or before' },
          { value: 'after', label: 'on or after' },
          { value: 'between', label: 'between' },
          { value: 'within', label: 'within last' }
        ];

      case 'select':
        return [
          { value: 'equals', label: 'equals' },
          { value: 'notEquals', label: 'does not equal' }
        ];

      case 'text':
      default:
        return [
          { value: 'equals', label: 'equals' },
          { value: 'contains', label: 'contains' },
          { value: 'startsWith', label: 'starts with' },
          { value: 'endsWith', label: 'ends with' },
          { value: 'isEmpty', label: 'is empty' },
          { value: 'isNotEmpty', label: 'is not empty' }
        ];
    }
  };

  const operators = getOperatorsForField(newFilter.field);

  useEffect(() => {
    console.log('Filters changed:', filters);
    onFiltersChange(filters);
  }, [filters]);

  // CrimsonGPT natural language processing
  const handleCrimsonGPTPrompt = async () => {
    if (!crimsonGPTPrompt.trim()) return;

    setIsProcessingPrompt(true);

    // Simulate AI processing - in real implementation, this would call CrimsonGPT API
    setTimeout(() => {
      const parsedFilters = parseNaturalLanguageQuery(crimsonGPTPrompt);

      // Add parsed filters to existing filters
      const newFilters = [...filters, ...parsedFilters];
      setFilters(newFilters);

      setIsProcessingPrompt(false);
      setCrimsonGPTPrompt('');
      setShowCrimsonGPT(false);
    }, 2000);
  };

  // Parse natural language queries into filter objects
  const parseNaturalLanguageQuery = (query: string): SmartTagFilter[] => {
    const parsedFilters: SmartTagFilter[] = [];
    const lowerQuery = query.toLowerCase();

    // Smart Tag detection
    if (lowerQuery.includes('big givers')) {
      parsedFilters.push({
        id: Date.now().toString() + '_1',
        field: 'smartTags',
        operator: 'contains',
        value: 'Big Givers',
        label: 'Smart Tag contains Big Givers'
      });
    }

    if (lowerQuery.includes('prime persuadables')) {
      parsedFilters.push({
        id: Date.now().toString() + '_2',
        field: 'smartTags',
        operator: 'contains',
        value: 'Prime Persuadables',
        label: 'Smart Tag contains Prime Persuadables'
      });
    }

    if (lowerQuery.includes('new & rising') || lowerQuery.includes('new and rising')) {
      parsedFilters.push({
        id: Date.now().toString() + '_3',
        field: 'smartTags',
        operator: 'contains',
        value: 'New & Rising Donors',
        label: 'Smart Tag contains New & Rising Donors'
      });
    }

    if (lowerQuery.includes('lapsed') || lowerQuery.includes('at-risk')) {
      parsedFilters.push({
        id: Date.now().toString() + '_4',
        field: 'smartTags',
        operator: 'contains',
        value: 'Lapsed/At-Risk',
        label: 'Smart Tag contains Lapsed/At-Risk'
      });
    }

    if (lowerQuery.includes('not yet registered') || lowerQuery.includes('unregistered')) {
      parsedFilters.push({
        id: Date.now().toString() + '_5',
        field: 'smartTags',
        operator: 'contains',
        value: 'Not Yet Registered',
        label: 'Smart Tag contains Not Yet Registered'
      });
    }

    // Geographic filters
    const stateMatch = lowerQuery.match(/in\s+(california|ca|florida|fl|texas|tx|new york|ny|georgia|ga)/);
    if (stateMatch) {
      const stateMap: { [key: string]: string } = {
        'california': 'CA', 'ca': 'CA',
        'florida': 'FL', 'fl': 'FL',
        'texas': 'TX', 'tx': 'TX',
        'new york': 'NY', 'ny': 'NY',
        'georgia': 'GA', 'ga': 'GA'
      };
      const state = stateMap[stateMatch[1]];
      if (state) {
        parsedFilters.push({
          id: Date.now().toString() + '_geo',
          field: 'state',
          operator: 'equals',
          value: state,
          label: `State equals ${state}`
        });
      }
    }

    // Amount filters
    const amountMatch = lowerQuery.match(/(\$?\d+)\+?/);
    if (amountMatch && (lowerQuery.includes('gave') || lowerQuery.includes('donated') || lowerQuery.includes('over'))) {
      const amount = amountMatch[1].replace('$', '');
      parsedFilters.push({
        id: Date.now().toString() + '_amount',
        field: 'totalGiving',
        operator: '>=',
        value: amount,
        label: `Total Giving >= $${amount}`
      });
    }

    // Time-based filters
    if (lowerQuery.includes('last year') || lowerQuery.includes('2023')) {
      parsedFilters.push({
        id: Date.now().toString() + '_time',
        field: 'lastGiftDate',
        operator: 'within',
        value: '12 months',
        label: 'Last Gift within 12 months'
      });
    }

    if (lowerQuery.includes('last 30 days') || lowerQuery.includes('this month')) {
      parsedFilters.push({
        id: Date.now().toString() + '_time2',
        field: 'lastGiftDate',
        operator: 'within',
        value: '30 days',
        label: 'Last Gift within 30 days'
      });
    }

    return parsedFilters;
  };

  const addFilter = () => {
    console.log('Add filter clicked', newFilter);

    if (!newFilter.field || !newFilter.operator) {
      console.log('Missing field or operator');
      return;
    }

    // Validate required values
    const needsValue = !['isEmpty', 'isNotEmpty'].includes(newFilter.operator);
    const needsValue2 = newFilter.operator === 'between';

    if (needsValue && !newFilter.value) {
      console.log('Missing required value');
      return;
    }
    if (needsValue2 && !newFilter.value2) {
      console.log('Missing second value for between');
      return;
    }

    const fieldLabel = filterFields.find(f => f.value === newFilter.field)?.label || newFilter.field;
    const operatorLabel = operators.find(o => o.value === newFilter.operator)?.label || newFilter.operator;

    let displayValue = newFilter.value;
    if (newFilter.operator === 'between' && newFilter.value2) {
      displayValue = `${newFilter.value} and ${newFilter.value2}`;
    }

    const filter: SmartTagFilter = {
      id: Date.now().toString(),
      field: newFilter.field,
      operator: newFilter.operator,
      value: newFilter.value,
      value2: newFilter.value2 || undefined,
      label: needsValue ? `${fieldLabel} ${operatorLabel} ${displayValue}` : `${fieldLabel} ${operatorLabel}`
    };

    console.log('Adding filter:', filter);
    setFilters([...filters, filter]);
    setNewFilter({ field: '', operator: '', value: '', value2: '' });
  };

  const removeFilter = (filterId: string) => {
    setFilters(filters.filter(f => f.id !== filterId));
  };

  const clearAllFilters = () => {
    setFilters([]);
  };

  const isFilterValid = () => {
    if (!newFilter.field || !newFilter.operator) return false;

    // No value needed for these operators
    if (['isEmpty', 'isNotEmpty'].includes(newFilter.operator)) return true;

    // Single value required
    if (!newFilter.value) return false;

    // Between operator needs both values
    if (newFilter.operator === 'between' && !newFilter.value2) return false;

    // Within operator for dates needs both value and time unit
    if (newFilter.operator === 'within' && (!newFilter.value || !newFilter.value2)) return false;

    return true;
  };

  const getValueInput = () => {
    const fieldInfo = filterFields.find(f => f.value === newFilter.field);
    const operator = newFilter.operator;

    if (operator === 'isEmpty' || operator === 'isNotEmpty') {
      return null; // No value needed for these operators
    }

    if (!fieldInfo) return null;

    // Handle "between" operator with two inputs
    if (operator === 'between') {
      if (fieldInfo.type === 'date') {
        return (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="date"
                value={newFilter.value}
                onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <input
                type="date"
                value={newFilter.value2}
                onChange={(e) => setNewFilter({ ...newFilter, value2: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
        );
      } else {
        return (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="number"
                placeholder="Min"
                value={newFilter.value}
                onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Max"
                value={newFilter.value2}
                onChange={(e) => setNewFilter({ ...newFilter, value2: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
        );
      }
    }

    // Handle "within" operator for dates
    if (operator === 'within' && fieldInfo.type === 'date') {
      return (
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Number"
            value={newFilter.value}
            onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          <select
            value={newFilter.value2 || 'days'}
            onChange={(e) => setNewFilter({ ...newFilter, value2: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="days">days</option>
            <option value="weeks">weeks</option>
            <option value="months">months</option>
            <option value="years">years</option>
          </select>
        </div>
      );
    }

    // Handle select fields
    if (fieldInfo.type === 'select') {
      const options = getSelectOptions(newFilter.field);
      return (
        <select
          value={newFilter.value}
          onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="">Select...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    // Handle date fields
    if (fieldInfo.type === 'date') {
      return (
        <input
          type="date"
          value={newFilter.value}
          onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
      );
    }

    // Handle numeric fields
    if (fieldInfo.type === 'number' || fieldInfo.type === 'currency') {
      const placeholder = fieldInfo.type === 'currency' ? 'Enter amount...' : 'Enter number...';
      return (
        <div className="relative">
          {fieldInfo.type === 'currency' && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">$</span>
            </div>
          )}
          <input
            type="number"
            placeholder={placeholder}
            value={newFilter.value}
            onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
              fieldInfo.type === 'currency' ? 'pl-8' : ''
            }`}
          />
        </div>
      );
    }

    // Handle text fields
    return (
      <input
        type="text"
        placeholder="Enter value..."
        value={newFilter.value}
        onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
      />
    );
  };

  const getSelectOptions = (field: string) => {
    switch (field) {
      case 'smartTags':
        return [
          { value: 'Big Givers', label: 'Big Givers' },
          { value: 'Prime Persuadables', label: 'Prime Persuadables' },
          { value: 'New & Rising Donors', label: 'New & Rising Donors' },
          { value: 'Lapsed/At-Risk', label: 'Lapsed/At-Risk' },
          { value: 'Not Yet Registered', label: 'Not Yet Registered' }
        ];
      case 'gender':
        return [
          { value: 'Male', label: 'Male' },
          { value: 'Female', label: 'Female' }
        ];
      case 'party':
        return [
          { value: 'Republican', label: 'Republican' },
          { value: 'Democrat', label: 'Democrat' },
          { value: 'Independent', label: 'Independent' },
          { value: 'Other', label: 'Other' }
        ];
      case 'voterStatus':
        return [
          { value: 'Registered', label: 'Registered' },
          { value: 'Not Registered', label: 'Not Registered' },
          { value: 'Unknown', label: 'Unknown' }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">Filter Criteria</h4>
        {filters.length > 0 && (
          <Button size="sm" variant="secondary" onClick={clearAllFilters}>
            Clear All
          </Button>
        )}
      </div>

      {/* CrimsonGPT Natural Language Filter */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-white bg-opacity-20 p-2 rounded-lg">
            <ChatBubbleLeftRightIcon className="w-4 h-4 text-white" />
          </div>
          <h4 className="font-semibold text-white text-sm">CrimsonGPT Natural Language Filter</h4>
          <SparklesIcon className="w-4 h-4 text-blue-200" />
        </div>

        {!showCrimsonGPT ? (
          <button
            onClick={() => setShowCrimsonGPT(true)}
            className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            Use Natural Language to Add Filters
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={crimsonGPTPrompt}
                onChange={(e) => setCrimsonGPTPrompt(e.target.value)}
                placeholder="e.g., 'Show me Big Givers in California who gave over $500 last year'"
                className="flex-1 px-3 py-2 bg-white bg-opacity-90 border border-white border-opacity-30 rounded-lg text-gray-900 placeholder-gray-500 text-sm focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleCrimsonGPTPrompt()}
              />
              <button
                onClick={handleCrimsonGPTPrompt}
                disabled={!crimsonGPTPrompt.trim() || isProcessingPrompt}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {isProcessingPrompt ? 'Processing...' : 'Apply'}
              </button>
              <button
                onClick={() => {
                  setShowCrimsonGPT(false);
                  setCrimsonGPTPrompt('');
                }}
                className="px-3 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Example queries */}
            <div className="text-xs text-blue-100">
              <p className="mb-1">Try examples like:</p>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setCrimsonGPTPrompt('Show me Big Givers in Florida')}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 px-2 py-1 rounded text-white transition-colors"
                >
                  "Big Givers in Florida"
                </button>
                <button
                  onClick={() => setCrimsonGPTPrompt('Prime Persuadables who gave over $200')}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 px-2 py-1 rounded text-white transition-colors"
                >
                  "Prime Persuadables over $200"
                </button>
                <button
                  onClick={() => setCrimsonGPTPrompt('Lapsed donors in the last 30 days')}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 px-2 py-1 rounded text-white transition-colors"
                >
                  "Lapsed donors last 30 days"
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Filters */}
      {filters.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Active Filters:</p>
          <div className="space-y-2">
            {filters.map((filter) => (
              <div
                key={filter.id}
                className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-3 py-2"
              >
                <span className="text-sm text-blue-800">{filter.label}</span>
                <button
                  onClick={() => removeFilter(filter.id)}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Filter */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm font-medium text-gray-700 mb-3">Add New Filter:</p>
        <div className="grid grid-cols-1 gap-3">
          {/* Field Selection */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Field</label>
            <select
              value={newFilter.field}
              onChange={(e) => setNewFilter({ field: e.target.value, operator: '', value: '', value2: '' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">Select field...</option>
              {filterFields.map((field) => (
                <option key={field.value} value={field.value}>
                  {field.label}
                </option>
              ))}
            </select>
          </div>

          {/* Operator Selection */}
          {newFilter.field && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Condition</label>
              <select
                value={newFilter.operator}
                onChange={(e) => setNewFilter({ ...newFilter, operator: e.target.value, value: '', value2: '' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select condition...</option>
                {operators.map((operator) => (
                  <option key={operator.value} value={operator.value}>
                    {operator.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Value Input */}
          {newFilter.field && newFilter.operator && newFilter.operator !== 'isEmpty' && newFilter.operator !== 'isNotEmpty' && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Value</label>
              {getValueInput()}
            </div>
          )}

          {/* Add Button */}
          {newFilter.field && newFilter.operator && (
            <div className="pt-2">
              <Button
                onClick={addFilter}
                size="sm"
                disabled={!isFilterValid()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <PlusIcon className="w-4 h-4 mr-1" />
                Add Filter
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Filter Presets */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Quick Filters:</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              const filter: SmartTagFilter = {
                id: Date.now().toString(),
                field: 'totalGiving',
                operator: '>=',
                value: '500',
                label: 'Total Giving >= $500'
              };
              setFilters([...filters, filter]);
            }}
            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs hover:bg-green-200 transition-colors"
          >
            Major Donors ($500+)
          </button>
          <button
            onClick={() => {
              const filter: SmartTagFilter = {
                id: Date.now().toString(),
                field: 'giftCount',
                operator: '>=',
                value: '3',
                label: 'Gift Count >= 3'
              };
              setFilters([...filters, filter]);
            }}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs hover:bg-blue-200 transition-colors"
          >
            Repeat Donors (3+ gifts)
          </button>
          <button
            onClick={() => {
              const filter: SmartTagFilter = {
                id: Date.now().toString(),
                field: 'lastGiftDate',
                operator: 'within',
                value: '12 months',
                label: 'Last Gift within 12 months'
              };
              setFilters([...filters, filter]);
            }}
            className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs hover:bg-purple-200 transition-colors"
          >
            Recent Donors
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartTagFilters;
