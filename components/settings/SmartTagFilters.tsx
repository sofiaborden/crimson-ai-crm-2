import React, { useState, useEffect } from 'react';
import { PlusIcon, XMarkIcon, CalendarIcon } from '../../constants';
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

  const filterFields = [
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
