import React, { useState } from 'react';
import { XMarkIcon, ClipboardDocumentListIcon, CalendarIcon, CheckIcon } from '../../constants';

interface TaskEditType {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  color: string;
}

interface TaskEditSelectorProps {
  onSelect: (type: string) => void;
  onClose: () => void;
}

const TaskEditSelector: React.FC<TaskEditSelectorProps> = ({ onSelect, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'ClipboardDocumentListIcon':
        return <ClipboardDocumentListIcon className="w-6 h-6" />;
      case 'CalendarIcon':
        return <CalendarIcon className="w-6 h-6" />;
      case 'CheckIcon':
        return <CheckIcon className="w-6 h-6" />;
      default:
        return <span className="text-xl">{iconName}</span>;
    }
  };

  const taskEditTypes: TaskEditType[] = [
    {
      id: 'change-task-type',
      name: 'Change Task Type',
      description: 'Modify the type of the existing task',
      icon: 'ClipboardDocumentListIcon',
      category: 'task-editing',
      color: 'bg-blue-100 border-blue-300 text-blue-800'
    },
    {
      id: 'reschedule-task',
      name: 'Reschedule Task',
      description: 'Reassign task to a different user',
      icon: 'CalendarIcon',
      category: 'task-editing',
      color: 'bg-red-100 border-red-300 text-red-800'
    },
    {
      id: 'complete-task',
      name: 'Complete Task',
      description: 'Mark task as completed with date',
      icon: 'CheckIcon',
      category: 'task-editing',
      color: 'bg-green-100 border-green-300 text-green-800'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Task Actions', icon: '✏️' }
  ];

  const filteredActions = selectedCategory === 'all'
    ? taskEditTypes
    : taskEditTypes.filter(action => action.category === selectedCategory);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-crimson-blue to-crimson-dark-blue text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <span className="text-2xl">✏️</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold">Edit Task</h2>
                <p className="text-crimson-accent-blue text-sm">Choose how to modify the existing task that triggered this flow</p>
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

        {/* Category Tabs */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-crimson-blue text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
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
            {filteredActions.map((editType) => (
              <button
                key={editType.id}
                onClick={() => onSelect(editType.id)}
                className="text-left p-4 border border-gray-200 rounded-lg hover:border-crimson-blue hover:bg-crimson-blue hover:bg-opacity-5 transition-all duration-200 group"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${editType.color} group-hover:scale-110 transition-transform`}>
                    {renderIcon(editType.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 group-hover:text-crimson-blue transition-colors">
                      {editType.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {editType.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Select an action to configure what happens when your trigger condition is met
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskEditSelector;
