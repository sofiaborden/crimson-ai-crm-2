import React, { useState } from 'react';
import { ChevronDownIcon, XMarkIcon, PlusIcon, FunnelIcon } from '../../constants';

interface SearchFilter {
  id: string;
  field: string;
  operator: string;
  value: string;
  label: string;
}

interface SearchFiltersProps {
  filters: SearchFilter[];
  onFiltersChange: (filters: SearchFilter[]) => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

const filterFields = [
  { value: 'firstName', label: 'First Name' },
  { value: 'lastName', label: 'Last Name' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'address', label: 'Address' },
  { value: 'city', label: 'City' },
  { value: 'state', label: 'State' },
  { value: 'zip', label: 'ZIP Code' },
  { value: 'party', label: 'Political Party' },
  { value: 'voterStatus', label: 'Voter Status' },
  { value: 'donorStatus', label: 'Donor Status' },
  { value: 'totalGifts', label: 'Total Gifts' },
  { value: 'lastGiftDate', label: 'Last Gift Date' },
  { value: 'giftAmount', label: 'Gift Amount' },
  { value: 'employer', label: 'Employer' },
  { value: 'occupation', label: 'Occupation' },
  { value: 'age', label: 'Age' },
  { value: 'gender', label: 'Gender' },
  { value: 'tags', label: 'Tags' },
  { value: 'flags', label: 'Flags' },
  { value: 'clubs', label: 'Clubs' }
];

const operators = [
  { value: 'equals', label: 'Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'startsWith', label: 'Starts With' },
  { value: 'endsWith', label: 'Ends With' },
  { value: '>', label: 'Greater Than' },
  { value: '>=', label: 'Greater Than or Equal' },
  { value: '<', label: 'Less Than' },
  { value: '<=', label: 'Less Than or Equal' },
  { value: 'between', label: 'Between' },
  { value: 'isEmpty', label: 'Is Empty' },
  { value: 'isNotEmpty', label: 'Is Not Empty' },
  { value: 'in', label: 'In List' },
  { value: 'notIn', label: 'Not In List' }
];

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange,
  isVisible,
  onToggleVisibility
}) => {
  const [newFilter, setNewFilter] = useState({
    field: '',
    operator: 'equals',
    value: ''
  });

  const addFilter = () => {
    if (!newFilter.field || !newFilter.value) return;

    const fieldLabel = filterFields.find(f => f.value === newFilter.field)?.label || newFilter.field;
    const operatorLabel = operators.find(o => o.value === newFilter.operator)?.label || newFilter.operator;

    const filter: SearchFilter = {
      id: Date.now().toString(),
      field: newFilter.field,
      operator: newFilter.operator,
      value: newFilter.value,
      label: `${fieldLabel} ${operatorLabel} ${newFilter.value}`
    };

    onFiltersChange([...filters, filter]);
    setNewFilter({ field: '', operator: 'equals', value: '' });
  };

  const removeFilter = (filterId: string) => {
    onFiltersChange(filters.filter(f => f.id !== filterId));
  };

  const clearAllFilters = () => {
    onFiltersChange([]);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gray-50 border-t border-b border-gray-200 p-4">
      <div className="space-y-4">
        {/* Filter Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-gray-600" />
            <h3 className="font-medium text-gray-900">Advanced Filters</h3>
            {filters.length > 0 && (
              <span className="bg-crimson-blue text-white text-xs px-2 py-1 rounded-full">
                {filters.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {filters.length > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-gray-600 hover:text-red-600 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onToggleVisibility}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ChevronDownIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Applied Filters */}
        {filters.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Applied Filters:</p>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <div
                  key={filter.id}
                  className="flex items-center gap-2 bg-crimson-blue text-white px-3 py-1 rounded-full text-sm"
                >
                  <span>{filter.label}</span>
                  <button
                    onClick={() => removeFilter(filter.id)}
                    className="hover:bg-crimson-dark-blue rounded-full p-0.5 transition-colors"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Filter */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Add New Filter:</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Field</label>
              <select
                value={newFilter.field}
                onChange={(e) => setNewFilter({ ...newFilter, field: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue text-sm"
              >
                <option value="">Select field...</option>
                {filterFields.map((field) => (
                  <option key={field.value} value={field.value}>
                    {field.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Operator</label>
              <select
                value={newFilter.operator}
                onChange={(e) => setNewFilter({ ...newFilter, operator: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue text-sm"
              >
                {operators.map((operator) => (
                  <option key={operator.value} value={operator.value}>
                    {operator.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Value</label>
              <input
                type="text"
                value={newFilter.value}
                onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
                placeholder="Enter value..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue text-sm"
                onKeyPress={(e) => e.key === 'Enter' && addFilter()}
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={addFilter}
                disabled={!newFilter.field || !newFilter.value}
                className="w-full px-4 py-2 bg-crimson-blue text-white rounded-lg hover:bg-crimson-dark-blue transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium"
              >
                <PlusIcon className="w-4 h-4 inline mr-1" />
                Add Filter
              </button>
            </div>
          </div>
        </div>

        {/* Quick Filter Presets */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Quick Filters:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onFiltersChange([{
                id: 'preset-donors',
                field: 'donorStatus',
                operator: 'equals',
                value: 'true',
                label: 'Is Donor'
              }])}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs hover:bg-blue-200 transition-colors"
            >
              Donors Only
            </button>
            <button
              onClick={() => onFiltersChange([{
                id: 'preset-major',
                field: 'totalGifts',
                operator: '>=',
                value: '1000',
                label: 'Total Gifts >= $1,000'
              }])}
              className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs hover:bg-green-200 transition-colors"
            >
              Major Donors
            </button>
            <button
              onClick={() => onFiltersChange([{
                id: 'preset-republican',
                field: 'party',
                operator: 'equals',
                value: 'Republican',
                label: 'Party = Republican'
              }])}
              className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs hover:bg-red-200 transition-colors"
            >
              Republicans
            </button>
            <button
              onClick={() => onFiltersChange([{
                id: 'preset-missing-email',
                field: 'email',
                operator: 'isEmpty',
                value: '',
                label: 'Missing Email'
              }])}
              className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs hover:bg-yellow-200 transition-colors"
            >
              Missing Email
            </button>
            <button
              onClick={() => onFiltersChange([{
                id: 'preset-active-voters',
                field: 'voterStatus',
                operator: 'equals',
                value: 'Active',
                label: 'Active Voter'
              }])}
              className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs hover:bg-purple-200 transition-colors"
            >
              Active Voters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
