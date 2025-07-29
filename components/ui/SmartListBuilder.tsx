import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import { XMarkIcon, PlusIcon, TrashIcon, ArrowDownTrayIcon, DocumentTextIcon } from '../../constants';

interface FilterRule {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface SmartListBuilderProps {
  segmentId: string;
  segmentName: string;
  isOpen: boolean;
  onClose: () => void;
}

const SmartListBuilder: React.FC<SmartListBuilderProps> = ({ segmentId, segmentName, isOpen, onClose }) => {
  const [listName, setListName] = useState(`${segmentName} Smart List`);
  const [filters, setFilters] = useState<FilterRule[]>([
    { id: '1', field: 'totalLifetimeGiving', operator: 'gte', value: '100' }
  ]);
  const [estimatedCount, setEstimatedCount] = useState(247);

  const fieldOptions = [
    { value: 'totalLifetimeGiving', label: 'Total Lifetime Giving' },
    { value: 'lastGiftAmount', label: 'Last Gift Amount' },
    { value: 'lastGiftDate', label: 'Last Gift Date' },
    { value: 'giftCount', label: 'Number of Gifts' },
    { value: 'engagementScore', label: 'Engagement Score' },
    { value: 'status', label: 'Donor Status' },
    { value: 'city', label: 'City' },
    { value: 'state', label: 'State' },
    { value: 'zip', label: 'ZIP Code' }
  ];

  const operatorOptions = {
    number: [
      { value: 'gte', label: 'Greater than or equal to' },
      { value: 'lte', label: 'Less than or equal to' },
      { value: 'eq', label: 'Equal to' },
      { value: 'between', label: 'Between' }
    ],
    text: [
      { value: 'contains', label: 'Contains' },
      { value: 'equals', label: 'Equals' },
      { value: 'startsWith', label: 'Starts with' }
    ],
    date: [
      { value: 'after', label: 'After' },
      { value: 'before', label: 'Before' },
      { value: 'between', label: 'Between' }
    ]
  };

  const getOperators = (field: string) => {
    if (['totalLifetimeGiving', 'lastGiftAmount', 'giftCount', 'engagementScore'].includes(field)) {
      return operatorOptions.number;
    }
    if (['lastGiftDate'].includes(field)) {
      return operatorOptions.date;
    }
    return operatorOptions.text;
  };

  const addFilter = () => {
    const newFilter: FilterRule = {
      id: Date.now().toString(),
      field: 'totalLifetimeGiving',
      operator: 'gte',
      value: ''
    };
    setFilters([...filters, newFilter]);
  };

  const removeFilter = (id: string) => {
    setFilters(filters.filter(f => f.id !== id));
  };

  const updateFilter = (id: string, field: keyof FilterRule, value: string) => {
    setFilters(filters.map(f => 
      f.id === id ? { ...f, [field]: value } : f
    ));
  };

  const exportOptions = [
    { format: 'csv', label: 'CSV (Excel)', icon: DocumentTextIcon },
    { format: 'pdf', label: 'PDF Report', icon: DocumentTextIcon },
    { format: 'mailchimp', label: 'MailChimp', icon: ArrowDownTrayIcon },
    { format: 'constantcontact', label: 'Constant Contact', icon: ArrowDownTrayIcon }
  ];

  const handleExport = (format: string) => {
    console.log(`Exporting ${estimatedCount} donors to ${format}`);
    // Simulate export
    alert(`Exporting ${estimatedCount} donors to ${format.toUpperCase()}...`);
  };

  const handleSaveList = () => {
    console.log('Saving smart list:', { listName, filters });
    alert(`Smart list "${listName}" saved successfully!`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Smart List Builder</h2>
            <p className="text-gray-600">Create dynamic, exportable donor lists with advanced filtering</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-auto max-h-[70vh]">
          {/* List Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">List Name</label>
            <input
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter list name..."
            />
          </div>

          {/* Filters */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filter Criteria</h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={addFilter}
                className="flex items-center gap-1"
              >
                <PlusIcon className="w-4 h-4" />
                Add Filter
              </Button>
            </div>

            <div className="space-y-3">
              {filters.map((filter, index) => (
                <div key={filter.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  {index > 0 && (
                    <span className="text-sm font-medium text-gray-500 w-12">AND</span>
                  )}
                  
                  <select
                    value={filter.field}
                    onChange={(e) => updateFilter(filter.id, 'field', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {fieldOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>

                  <select
                    value={filter.operator}
                    onChange={(e) => updateFilter(filter.id, 'operator', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {getOperators(filter.field).map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={filter.value}
                    onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
                    placeholder="Value..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />

                  {filters.length > 1 && (
                    <button
                      onClick={() => removeFilter(filter.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          <Card title="List Preview">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div>
                  <h4 className="font-semibold text-blue-900">Estimated Results</h4>
                  <p className="text-blue-700">{estimatedCount} donors match your criteria</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-blue-600">Est. Total Value</div>
                  <div className="text-lg font-bold text-blue-900">${(estimatedCount * 156).toLocaleString()}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Active Donors:</span>
                    <span className="font-medium">{Math.floor(estimatedCount * 0.6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lapsed Donors:</span>
                    <span className="font-medium">{Math.floor(estimatedCount * 0.3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Major Donors:</span>
                    <span className="font-medium">{Math.floor(estimatedCount * 0.1)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Avg. Gift Size:</span>
                    <span className="font-medium">$156</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg. Engagement:</span>
                    <span className="font-medium">72%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Response Rate:</span>
                    <span className="font-medium">18%</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Export Options */}
          <Card title="Export Options">
            <div className="grid grid-cols-2 gap-3">
              {exportOptions.map((option) => (
                <Button
                  key={option.format}
                  variant="secondary"
                  className="flex items-center justify-center gap-2 p-3"
                  onClick={() => handleExport(option.format)}
                >
                  <option.icon className="w-4 h-4" />
                  {option.label}
                </Button>
              ))}
            </div>
          </Card>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              This list will auto-update as new donors meet your criteria
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={onClose}>Cancel</Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSaveList}
              >
                Save Smart List
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartListBuilder;
