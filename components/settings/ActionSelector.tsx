import React, { useState } from 'react';
import { XMarkIcon, PlusIcon, CheckIcon, ClipboardDocumentListIcon, CalendarIcon, DocumentTextIcon, BoltIcon, UserGroupIcon, FlagIcon, TagIcon, ChartBarIcon, PhoneIcon, EnvelopeIcon, MailIcon } from '../../constants';
import Button from '../ui/Button';

interface ActionType {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'tasks' | 'data' | 'communications';
  color: string;
}

interface ActionSelectorProps {
  onSelect: (type: string) => void;
  onClose: () => void;
  triggerType?: string;
}

const ActionSelector: React.FC<ActionSelectorProps> = ({ onSelect, onClose, triggerType }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'ClipboardDocumentListIcon':
        return <ClipboardDocumentListIcon className="w-6 h-6" />;
      case 'CalendarIcon':
        return <CalendarIcon className="w-6 h-6" />;
      case 'DocumentTextIcon':
        return <DocumentTextIcon className="w-6 h-6" />;
      case 'BoltIcon':
        return <BoltIcon className="w-6 h-6" />;
      case 'UserGroupIcon':
        return <UserGroupIcon className="w-6 h-6" />;
      case 'FlagIcon':
        return <FlagIcon className="w-6 h-6" />;
      case 'TagIcon':
        return <TagIcon className="w-6 h-6" />;
      case 'ChartBarIcon':
        return <ChartBarIcon className="w-6 h-6" />;
      case 'PhoneIcon':
        return <PhoneIcon className="w-6 h-6" />;
      case 'EnvelopeIcon':
        return <EnvelopeIcon className="w-6 h-6" />;
      case 'MailIcon':
        return <MailIcon className="w-6 h-6" />;
      case 'CheckIcon':
        return <CheckIcon className="w-6 h-6" />;
      default:
        return <span className="text-xl">{iconName}</span>;
    }
  };

  const actionTypes: ActionType[] = [
    // Task Actions
    {
      id: 'add-task',
      name: 'Add Task',
      description: 'Automatically create a task for a team member',
      icon: 'ClipboardDocumentListIcon',
      category: 'tasks',
      color: 'bg-blue-100 border-blue-300 text-blue-800'
    },
    {
      id: 'schedule-event',
      name: 'Schedule Event',
      description: 'Create a calendar event or meeting for a donor',
      icon: 'CalendarIcon',
      category: 'tasks',
      color: 'bg-red-100 border-red-300 text-red-800'
    },
    {
      id: 'add-note',
      name: 'Add Note',
      description: 'Append a custom note to the donor profile',
      icon: 'DocumentTextIcon',
      category: 'tasks',
      color: 'bg-gray-100 border-gray-300 text-gray-800'
    },
    {
      id: 'add-action',
      name: 'Add Action',
      description: 'Track a general action on the donor record',
      icon: 'BoltIcon',
      category: 'tasks',
      color: 'bg-yellow-100 border-yellow-300 text-yellow-800'
    },



    // Data Management Actions
    {
      id: 'apply-smart-tag',
      name: 'Apply Smart Tag',
      description: 'Apply a Smart Tag to matching contacts',
      icon: 'TagIcon',
      category: 'data',
      color: 'bg-crimson-100 border-crimson-300 text-crimson-800'
    },
    {
      id: 'create-smart-segment',
      name: 'Create Smart Segment',
      description: 'Add or remove donor from a Smart Segment',
      icon: 'UserGroupIcon',
      category: 'data',
      color: 'bg-purple-100 border-purple-300 text-purple-800'
    },
    {
      id: 'add-flag',
      name: 'Add Flag',
      description: 'Add a flag label to a donor profile',
      icon: 'FlagIcon',
      category: 'data',
      color: 'bg-green-100 border-green-300 text-green-800'
    },
    {
      id: 'add-keyword',
      name: 'Add Keyword',
      description: 'Tag a donor with a keyword for filtering',
      icon: 'TagIcon',
      category: 'data',
      color: 'bg-yellow-100 border-yellow-300 text-yellow-800'
    },
    {
      id: 'add-attribute',
      name: 'Add Attribute',
      description: 'Modify or update a custom attribute',
      icon: 'ChartBarIcon',
      category: 'data',
      color: 'bg-indigo-100 border-indigo-300 text-indigo-800'
    },

    // Communications & Integrations
    {
      id: 'send-to-dialr',
      name: 'Send to DialR',
      description: 'Add donor to a DialR phone campaign',
      icon: 'PhoneIcon',
      category: 'communications',
      color: 'bg-orange-100 border-orange-300 text-orange-800'
    },
    {
      id: 'send-to-targetpath',
      name: 'Send to TargetPath',
      description: 'Send donor to TargetPath for direct mail',
      icon: '📮',
      category: 'communications',
      color: 'bg-teal-100 border-teal-300 text-teal-800'
    },
    {
      id: 'send-to-mailchimp',
      name: 'Send to MailChimp',
      description: 'Sync donor with MailChimp for email marketing',
      icon: 'EnvelopeIcon',
      category: 'communications',
      color: 'bg-pink-100 border-pink-300 text-pink-800'
    },
    {
      id: 'send-to-constant-contact',
      name: 'Send to Constant Contact',
      description: 'Sync donor with Constant Contact email lists',
      icon: 'MailIcon',
      category: 'communications',
      color: 'bg-cyan-100 border-cyan-300 text-cyan-800'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Actions', icon: '⚡' },
    { id: 'tasks', name: 'Tasks & Events', icon: '📋' },
    { id: 'data', name: 'Data Management', icon: '📊' },
    { id: 'communications', name: 'Communications', icon: '📞' }
  ];

  const filteredActions = selectedCategory === 'all' 
    ? actionTypes 
    : actionTypes.filter(action => action.category === selectedCategory);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-crimson-blue to-crimson-dark-blue text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold">Add Action</h2>
                <p className="text-crimson-accent-blue text-sm">Choose what happens when this trigger condition is met</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="border-b border-gray-200 bg-gray-50 p-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-crimson-blue text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Action Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredActions.map((action) => (
              <button
                key={action.id}
                onClick={() => onSelect(action.id)}
                className="text-left p-4 border border-gray-200 rounded-lg hover:border-crimson-blue hover:bg-crimson-blue hover:bg-opacity-5 transition-all duration-200 group"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}>
                    {renderIcon(action.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 group-hover:text-crimson-blue transition-colors">
                      {action.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Select an action to configure what happens when your trigger condition is met
            </p>
            <Button
              onClick={onClose}
              variant="outline"
              className="text-gray-600 border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionSelector;
