import React, { useState } from 'react';
import { XMarkIcon, CheckIcon, ClipboardDocumentListIcon, CurrencyDollarIcon, BoltIcon, CalendarIcon, UserIcon, FlagIcon, TagIcon, UserGroupIcon, ArrowPathIcon } from '../../constants';
import Button from '../ui/Button';

interface TriggerType {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'actions' | 'communications' | 'data' | 'integrations';
  color: string;
}

interface TriggerTypeSelectorProps {
  onSelect: (triggerType: string) => void;
  onClose: () => void;
}

const TriggerTypeSelector: React.FC<TriggerTypeSelectorProps> = ({ onSelect, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'CurrencyDollarIcon':
        return <CurrencyDollarIcon className="w-6 h-6" />;
      case 'ClipboardDocumentListIcon':
        return <ClipboardDocumentListIcon className="w-6 h-6" />;
      case 'BoltIcon':
        return <BoltIcon className="w-6 h-6" />;
      case 'CalendarIcon':
        return <CalendarIcon className="w-6 h-6" />;
      case 'UserIcon':
        return <UserIcon className="w-6 h-6" />;
      case 'FlagIcon':
        return <FlagIcon className="w-6 h-6" />;
      case 'TagIcon':
        return <TagIcon className="w-6 h-6" />;
      case 'CheckIcon':
        return <CheckIcon className="w-6 h-6" />;
      case 'UserGroupIcon':
        return <UserGroupIcon className="w-6 h-6" />;
      case 'ArrowPathIcon':
        return <ArrowPathIcon className="w-6 h-6" />;
      default:
        return <span className="text-xl">{iconName}</span>;
    }
  };

  const handleTriggerSelect = (triggerType: string) => {
    // Pass just the trigger type string
    onSelect(triggerType);
  };

  const triggerTypes: TriggerType[] = [
    // Audience-based Triggers
    {
      id: 'selected_audience',
      name: 'Selected Audience',
      description: 'Use the audience filter applied in the audience tab as trigger criteria',
      icon: 'UserGroupIcon',
      category: 'data',
      color: 'bg-crimson-100 border-crimson-300 text-crimson-800'
    },
    // Trigger Conditions
    {
      id: 'task',
      name: 'Task',
      description: 'Trigger when a task is created or completed',
      icon: 'CheckIcon',
      category: 'actions',
      color: 'bg-blue-100 border-blue-300 text-blue-800'
    },
    {
      id: 'event',
      name: 'Event',
      description: 'Trigger based on upcoming, completed, or scheduled events',
      icon: 'CalendarIcon',
      category: 'actions',
      color: 'bg-red-100 border-red-300 text-red-800'
    },
    {
      id: 'note',
      name: 'Note',
      description: 'Trigger when a new note is added to a profile',
      icon: 'UserIcon',
      category: 'actions',
      color: 'bg-gray-100 border-gray-300 text-gray-800'
    },

    {
      id: 'pledge',
      name: 'Pledge',
      description: 'Trigger when a new pledge is created or fulfilled',
      icon: 'ClipboardDocumentListIcon',
      category: 'actions',
      color: 'bg-purple-100 border-purple-300 text-purple-800'
    },
    {
      id: 'action',
      name: 'Action',
      description: 'Trigger based on donor interactions or tracked actions',
      icon: 'BoltIcon',
      category: 'actions',
      color: 'bg-yellow-100 border-yellow-300 text-yellow-800'
    },

    // Data Management
    {
      id: 'moves',
      name: 'Moves',
      description: 'Trigger based on moves management activities or status changes',
      icon: 'ArrowPathIcon',
      category: 'actions',
      color: 'bg-purple-100 border-purple-300 text-purple-800'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Triggers', icon: '⚡' },
    { id: 'actions', name: 'Actions & Events', icon: '🎯' },
    { id: 'data', name: 'Data Changes', icon: '📊' }
  ];

  const filteredTriggers = selectedCategory === 'all' 
    ? triggerTypes 
    : triggerTypes.filter(trigger => trigger.category === selectedCategory);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-crimson-blue to-crimson-dark-blue text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold">Choose Trigger Condition</h2>
                <p className="text-crimson-accent-blue text-sm">Select what event should activate this flow</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-crimson-accent-blue transition-colors p-1 rounded-lg hover:bg-white hover:bg-opacity-10"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'border-b-2 border-crimson-blue text-crimson-blue bg-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Trigger Types Grid */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTriggers.map((trigger) => (
              <div
                key={trigger.id}
                onClick={() => handleTriggerSelect(trigger.id)}
                className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-crimson-blue hover:shadow-lg transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${trigger.color} group-hover:scale-110 transition-transform`}>
                    {renderIcon(trigger.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 group-hover:text-crimson-blue transition-colors">
                      {trigger.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {trigger.description}
                    </p>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                    {trigger.category.replace('_', ' ')}
                  </span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <CheckIcon className="w-4 h-4 text-crimson-blue" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTriggers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No triggers found</h3>
              <p className="text-gray-600">Try selecting a different category to see more options.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-sm text-gray-600">
              {filteredTriggers.length} trigger type{filteredTriggers.length !== 1 ? 's' : ''} available
            </div>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TriggerTypeSelector;
