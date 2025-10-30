import React, { useState, useRef, useEffect } from 'react';
import { SparklesIcon, PlusIcon, PencilIcon, TrashIcon, EyeIcon, ChatBubbleLeftRightIcon, EllipsisVerticalIcon, ChevronDownIcon, XMarkIcon, HeartIcon, FunnelIcon, PlayIcon, PauseIcon, CheckIcon, UserGroupIcon, ClockIcon, ExclamationTriangleIcon, ArrowPathIcon } from '../../constants';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import SmartTagFilters from './SmartTagFilters';
import TriggerTypeSelector from './TriggerTypeSelector';
import TriggerConfigModal from './TriggerConfigModal';

interface SmartTag {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  category: 'smart-tags' | 'flags' | 'keywords' | 'attributes' | 'clubs' | 'contact-flag' | 'membership' | 'volunteers' | 'board';
  processingType: 'static' | 'dynamic';
  filterDefinition: any;
  inclusionTrigger?: any;
  removalTrigger?: any;
  count: number;
  isActive: boolean;
  isInclusionCriteria: boolean;
  associatedFlows?: AssociatedFlow[];
  createdBy: string;
  createdDate: string;
}

interface AssociatedFlow {
  id: string;
  name: string;
  type: 'dynamic' | 'static';
  isActive: boolean;
  isAutoCreated: boolean;
}

interface SmartTagEditorProps {
  tag?: SmartTag | null;
  onClose: () => void;
  onSave: (tag: SmartTag) => void;
}

// Enhanced Smart Tag Editor with Tabbed Interface
const EnhancedSmartTagEditor: React.FC<SmartTagEditorProps> = ({ tag, onClose, onSave }) => {
  const [formData, setFormData] = useState<SmartTag>({
    id: tag?.id || Date.now().toString(),
    name: tag?.name || '',
    emoji: tag?.emoji || '🏷️',
    color: tag?.color || '#3B82F6',
    description: tag?.description || '',
    category: tag?.category || 'smart-tags',
    processingType: tag?.processingType || 'dynamic',
    filterDefinition: tag?.filterDefinition || [],
    inclusionTrigger: tag?.inclusionTrigger || null,
    removalTrigger: tag?.removalTrigger || null,
    count: tag?.count || 0,
    isActive: tag?.isActive || true,
    isInclusionCriteria: tag?.isInclusionCriteria || true,
    associatedFlows: tag?.associatedFlows || [],
    createdBy: tag?.createdBy || 'Current User',
    createdDate: tag?.createdDate || new Date().toISOString().split('T')[0]
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'add-people' | 'add-when' | 'remove-when' | 'summary'>('overview');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);

  // Workflow system state
  const [showInclusionTriggerSelector, setShowInclusionTriggerSelector] = useState(false);
  const [showRemovalTriggerSelector, setShowRemovalTriggerSelector] = useState(false);
  const [showInclusionTriggerConfig, setShowInclusionTriggerConfig] = useState(false);
  const [showRemovalTriggerConfig, setShowRemovalTriggerConfig] = useState(false);
  const [editingInclusionTrigger, setEditingInclusionTrigger] = useState<any>(null);
  const [editingRemovalTrigger, setEditingRemovalTrigger] = useState<any>(null);

  // Visual selector state
  const [showEmojiDropdown, setShowEmojiDropdown] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);

  // Refs for dropdowns
  const emojiDropdownRef = useRef<HTMLDivElement>(null);
  const colorDropdownRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: 'smart-tags', name: 'Smart Tags', color: 'blue' },
    { id: 'flags', name: 'Flags', color: 'red' },
    { id: 'keywords', name: 'Keywords', color: 'green' },
    { id: 'attributes', name: 'Attributes', color: 'purple' },
    { id: 'clubs', name: 'Clubs', color: 'orange' },
    { id: 'contact-flag', name: 'Contact Flags', color: 'pink' },
    { id: 'membership', name: 'Membership', color: 'indigo' },
    { id: 'volunteers', name: 'Volunteers', color: 'yellow' },
    { id: 'board', name: 'Board', color: 'gray' }
  ];

  const emojiOptions = ['💰', '🎯', '🚧', '⚡', '🕒', '🔥', '⭐', '🎪', '🎨', '🏆', '🎁', '🌟', '💎', '🚀', '🎊', '🎉', '🏷️', '📊', '👔', '🏥', '🏫', '🏢', '🎓', '🏛️', '🔍', '📌', '🤝'];
  const colorOptions = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ];

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab as any);
  };

  // Helper function to get color name
  const getColorName = (color: string) => {
    const colorMap: Record<string, string> = {
      '#3B82F6': 'Blue',
      '#10B981': 'Green',
      '#F59E0B': 'Yellow',
      '#EF4444': 'Red',
      '#8B5CF6': 'Purple',
      '#06B6D4': 'Cyan',
      '#84CC16': 'Lime',
      '#F97316': 'Orange',
      '#EC4899': 'Pink',
      '#6366F1': 'Indigo'
    };
    return colorMap[color] || 'Custom';
  };

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiDropdownRef.current && !emojiDropdownRef.current.contains(event.target as Node)) {
        setShowEmojiDropdown(false);
      }
      if (colorDropdownRef.current && !colorDropdownRef.current.contains(event.target as Node)) {
        setShowColorDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowExitWarning(true);
    } else {
      onClose();
    }
  };

  const confirmExit = () => {
    setShowExitWarning(false);
    onClose();
  };

  const cancelExit = () => {
    setShowExitWarning(false);
  };

  // Workflow system handlers
  const handleInclusionTriggerSelect = (triggerType: string) => {
    const newTrigger = {
      id: Date.now().toString(),
      type: triggerType,
      name: `New ${triggerType.charAt(0).toUpperCase() + triggerType.slice(1)} Trigger`,
      config: {},
      conditions: [],
      position: { x: 100, y: 100 }
    };

    setEditingInclusionTrigger(newTrigger);
    setShowInclusionTriggerSelector(false);
    setShowInclusionTriggerConfig(true);
  };

  const handleRemovalTriggerSelect = (triggerType: string) => {
    const newTrigger = {
      id: Date.now().toString(),
      type: triggerType,
      name: `New ${triggerType.charAt(0).toUpperCase() + triggerType.slice(1)} Trigger`,
      config: {},
      conditions: [],
      position: { x: 100, y: 100 }
    };

    setEditingRemovalTrigger(newTrigger);
    setShowRemovalTriggerSelector(false);
    setShowRemovalTriggerConfig(true);
  };

  const handleInclusionTriggerSave = (trigger: any) => {
    handleFormChange('inclusionTrigger', trigger);
    setShowInclusionTriggerConfig(false);
    setEditingInclusionTrigger(null);
  };

  const handleRemovalTriggerSave = (trigger: any) => {
    handleFormChange('removalTrigger', trigger);
    setShowRemovalTriggerConfig(false);
    setEditingRemovalTrigger(null);
  };

  const handleEditInclusionTrigger = () => {
    setEditingInclusionTrigger(formData.inclusionTrigger);
    setShowInclusionTriggerConfig(true);
  };

  const handleEditRemovalTrigger = () => {
    setEditingRemovalTrigger(formData.removalTrigger);
    setShowRemovalTriggerConfig(true);
  };

  // Helper function to check if a tab is complete
  const isTabComplete = (tab: string): boolean => {
    switch (tab) {
      case 'overview':
        return !!(formData.name && formData.emoji && formData.description);
      case 'add-people':
        return !!(formData.filterDefinition && formData.filterDefinition.length > 0);
      case 'add-when':
        return true; // Optional - can be complete without workflows
      case 'remove-when':
        return true; // Optional - can be complete without workflows
      case 'summary':
        return true; // Always complete
      default:
        return false;
    }
  };

  // Helper function to get tab status
  const getTabStatus = (tab: string): 'empty' | 'in-progress' | 'complete' => {
    if (isTabComplete(tab)) return 'complete';

    switch (tab) {
      case 'overview':
        return (formData.name || formData.emoji || formData.description) ? 'in-progress' : 'empty';
      case 'add-people':
        return (formData.filterDefinition && formData.filterDefinition.length > 0) ? 'complete' : 'empty';
      default:
        return 'empty';
    }
  };

  const handleFormChange = (field: string, value: any) => {
    console.log('Form change:', field, value);
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    onSave(formData);
    setHasUnsavedChanges(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          {/* Header with Pulse Heart Icon */}
          <div className="bg-gradient-to-r from-crimson-blue to-crimson-dark-blue text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg relative">
                  <SparklesIcon className="w-6 h-6 text-white" />
                  {/* Pulse Heart Icon */}
                  <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 animate-pulse">
                    <HeartIcon className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    {tag ? 'Edit Smart Tag' : 'Create Smart Tag'}
                  </h2>
                  <p className="text-crimson-accent-blue text-sm">Enhanced tabbed interface for comprehensive tag management</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-white hover:text-crimson-accent-blue transition-colors p-1 rounded-lg hover:bg-white hover:bg-opacity-10"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Tab Navigation with Progress Indicators */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex">
              {[
                { id: 'overview', name: 'Overview', icon: <SparklesIcon className="w-4 h-4" /> },
                { id: 'add-people', name: 'Add People', icon: <UserGroupIcon className="w-4 h-4" /> },
                { id: 'add-when', name: 'Add When', icon: <PlayIcon className="w-4 h-4" /> },
                { id: 'remove-when', name: 'Remove When', icon: <PauseIcon className="w-4 h-4" /> },
                { id: 'summary', name: 'Summary', icon: <CheckIcon className="w-4 h-4" /> }
              ].map((tab, index) => {
                const status = getTabStatus(tab.id);
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative ${
                      isActive
                        ? 'border-b-2 border-crimson-blue text-crimson-blue bg-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {tab.icon}
                    {tab.name}

                    {/* Progress Indicator */}
                    <div className="ml-2">
                      {status === 'complete' ? (
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckIcon className="w-2.5 h-2.5 text-white" />
                        </div>
                      ) : status === 'in-progress' ? (
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      ) : (
                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                      )}
                    </div>

                    {/* Step Arrow (except for last tab) */}
                    {index < 4 && (
                      <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        →
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tag Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleFormChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                        placeholder="e.g., Major Donors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleFormChange('description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                        placeholder="Describe what this tag represents..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleFormChange('category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Emoji and Color - Visual Dropdowns */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Emoji Dropdown */}
                      <div className="relative" ref={emojiDropdownRef}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Emoji</label>
                        <button
                          type="button"
                          onClick={() => setShowEmojiDropdown(!showEmojiDropdown)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue bg-white flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-lg">{formData.emoji}</span>
                            <span className="text-gray-700">
                              {formData.emoji}
                            </span>
                          </span>
                          <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${showEmojiDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {showEmojiDropdown && (
                          <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl z-[1000] p-3 max-w-xs">
                            <div className="grid grid-cols-6 gap-1.5 max-h-32 overflow-y-auto">
                              {emojiOptions.map((emoji) => (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => {
                                    handleFormChange('emoji', emoji);
                                    setShowEmojiDropdown(false);
                                  }}
                                  className={`w-7 h-7 rounded border flex items-center justify-center text-sm hover:bg-gray-50 transition-colors ${
                                    formData.emoji === emoji ? 'border-crimson-blue bg-crimson-blue bg-opacity-10' : 'border-gray-200'
                                  }`}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Color Dropdown */}
                      <div className="relative" ref={colorDropdownRef}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                        <button
                          type="button"
                          onClick={() => setShowColorDropdown(!showColorDropdown)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue bg-white flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded border border-gray-300"
                              style={{ backgroundColor: formData.color }}
                            ></div>
                            <span className="text-gray-700">
                              {getColorName(formData.color)}
                            </span>
                          </span>
                          <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${showColorDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {showColorDropdown && (
                          <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl z-[1000] p-3 max-w-xs">
                            <div className="grid grid-cols-5 gap-1.5">
                              {colorOptions.map((color) => (
                                <button
                                  key={color}
                                  type="button"
                                  onClick={() => {
                                    handleFormChange('color', color);
                                    setShowColorDropdown(false);
                                  }}
                                  className={`w-7 h-7 rounded border-2 transition-all ${
                                    formData.color === color ? 'border-gray-800 scale-105' : 'border-gray-200'
                                  }`}
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tag Preview */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                            style={{
                              backgroundColor: `${formData.color}20`,
                              border: `2px solid ${formData.color}30`
                            }}
                          >
                            {formData.emoji || '🏷️'}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {formData.name || 'Untitled Tag'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {categories.find(c => c.id === formData.category)?.name}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>



                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => handleFormChange('isActive', e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                        Active Tag
                      </label>
                    </div>
                  </div>
                </div>

                {/* Continue Button */}
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => handleTabChange('add-people')}
                    disabled={!isTabComplete('overview')}
                    className="bg-crimson-blue hover:bg-crimson-dark-blue disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Add People
                    <UserGroupIcon className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Add People Tab */}
            {activeTab === 'add-people' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <UserGroupIcon className="w-5 h-5 text-blue-600" />
                    <h3 className="font-medium text-blue-900">People Inclusion Criteria</h3>
                  </div>
                  <p className="text-sm text-blue-700">
                    Define the filter criteria to automatically include people in this tag.
                  </p>
                </div>

                {/* Debug info */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-xs">
                    <strong>Debug:</strong> filterDefinition = {JSON.stringify(formData.filterDefinition)}
                  </div>
                )}

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <SmartTagFilters
                    onFiltersChange={(filters) => {
                      console.log('SmartTagFilters onFiltersChange called with:', filters);
                      handleFormChange('filterDefinition', filters);
                    }}
                    initialFilters={formData.filterDefinition || []}
                    showRunNow={true}
                  />
                </div>

                {formData.filterDefinition && formData.filterDefinition.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckIcon className="w-5 h-5 text-green-600" />
                      <h4 className="font-medium text-green-900">Preview Results</h4>
                    </div>
                    <p className="text-sm text-green-700">
                      Estimated {Math.floor(Math.random() * 500) + 50} people will match these criteria.
                    </p>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => handleTabChange('overview')}
                  >
                    <SparklesIcon className="w-4 h-4 mr-2" />
                    Back to Overview
                  </Button>
                  <Button
                    onClick={() => handleTabChange('add-when')}
                    className="bg-crimson-blue hover:bg-crimson-dark-blue"
                  >
                    Continue to Add When
                    <PlayIcon className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Add When Tab */}
            {activeTab === 'add-when' && (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <PlayIcon className="w-5 h-5 text-green-600" />
                    <h3 className="font-medium text-green-900">Inclusion Triggers</h3>
                  </div>
                  <p className="text-sm text-green-700">
                    Create workflows that automatically add people to this tag when specific events occur.
                  </p>
                </div>

                <div className="space-y-4">
                  {formData.inclusionTrigger ? (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Inclusion Workflow</h4>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleEditInclusionTrigger}
                          >
                            <PencilIcon className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFormChange('inclusionTrigger', null)}
                          >
                            <TrashIcon className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Trigger Type:</strong> {formData.inclusionTrigger.type || 'Custom workflow'}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        <strong>Name:</strong> {formData.inclusionTrigger.name || 'Workflow configured'}
                      </div>
                      {formData.inclusionTrigger.config && Object.keys(formData.inclusionTrigger.config).length > 0 && (
                        <div className="text-sm text-gray-600 mt-1">
                          <strong>Configuration:</strong> {JSON.stringify(formData.inclusionTrigger.config, null, 2).slice(0, 100)}...
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <PlayIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No Inclusion Workflow</h4>
                      <p className="text-gray-600 mb-4">
                        Create a workflow to automatically add people to this tag based on specific triggers.
                      </p>
                      <Button
                        onClick={() => setShowInclusionTriggerSelector(true)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Create Inclusion Workflow
                      </Button>
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => handleTabChange('add-people')}
                  >
                    <UserGroupIcon className="w-4 h-4 mr-2" />
                    Back to Add People
                  </Button>
                  <Button
                    onClick={() => handleTabChange('remove-when')}
                    className="bg-crimson-blue hover:bg-crimson-dark-blue"
                  >
                    Continue to Remove When
                    <PauseIcon className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Remove When Tab */}
            {activeTab === 'remove-when' && (
              <div className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <PauseIcon className="w-5 h-5 text-red-600" />
                    <h3 className="font-medium text-red-900">Removal Triggers</h3>
                  </div>
                  <p className="text-sm text-red-700">
                    Create workflows that automatically remove people from this tag when specific events occur.
                  </p>
                </div>

                <div className="space-y-4">
                  {formData.removalTrigger ? (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Removal Workflow</h4>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleEditRemovalTrigger}
                          >
                            <PencilIcon className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFormChange('removalTrigger', null)}
                          >
                            <TrashIcon className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Trigger Type:</strong> {formData.removalTrigger.type || 'Custom workflow'}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        <strong>Name:</strong> {formData.removalTrigger.name || 'Workflow configured'}
                      </div>
                      {formData.removalTrigger.config && Object.keys(formData.removalTrigger.config).length > 0 && (
                        <div className="text-sm text-gray-600 mt-1">
                          <strong>Configuration:</strong> {JSON.stringify(formData.removalTrigger.config, null, 2).slice(0, 100)}...
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <PauseIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No Removal Workflow</h4>
                      <p className="text-gray-600 mb-4">
                        Create a workflow to automatically remove people from this tag based on specific triggers.
                      </p>
                      <Button
                        onClick={() => setShowRemovalTriggerSelector(true)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Create Removal Workflow
                      </Button>
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => handleTabChange('add-when')}
                  >
                    <PlayIcon className="w-4 h-4 mr-2" />
                    Back to Add When
                  </Button>
                  <Button
                    onClick={() => handleTabChange('summary')}
                    className="bg-crimson-blue hover:bg-crimson-dark-blue"
                  >
                    Review in Summary
                    <CheckIcon className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Summary Tab */}
            {activeTab === 'summary' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckIcon className="w-5 h-5 text-blue-600" />
                    <h3 className="font-medium text-blue-900">Configuration Summary</h3>
                  </div>
                  <p className="text-sm text-blue-700">
                    Review all settings before saving your Smart Tag.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Basic Information</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Name:</strong> {formData.name || 'Untitled Tag'}</div>
                        <div><strong>Category:</strong> {categories.find(c => c.id === formData.category)?.name}</div>
                        <div><strong>Processing:</strong> {formData.processingType === 'dynamic' ? 'Dynamic (Auto-updating)' : 'Static (Manual)'}</div>
                        <div><strong>Status:</strong> {formData.isActive ? 'Active' : 'Inactive'}</div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Description</h4>
                      <p className="text-sm text-gray-600">
                        {formData.description || 'No description provided'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Automation</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>Inclusion Criteria:</strong> {formData.filterDefinition && formData.filterDefinition.length > 0 ? 'Configured' : 'Not set'}
                        </div>
                        <div>
                          <strong>Inclusion Workflow:</strong> {formData.inclusionTrigger ? 'Configured' : 'Not set'}
                        </div>
                        <div>
                          <strong>Removal Workflow:</strong> {formData.removalTrigger ? 'Configured' : 'Not set'}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Expected Impact</h4>
                      <div className="text-sm text-gray-600">
                        <div>Expected people count: <strong>{Math.floor(Math.random() * 500) + 50}</strong></div>
                        <div className="mt-1 text-xs text-gray-500">
                          Based on current filter criteria and database size
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation and Save Buttons */}
                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => handleTabChange('remove-when')}
                  >
                    <PauseIcon className="w-4 h-4 mr-2" />
                    Back to Remove When
                  </Button>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckIcon className="w-4 h-4 mr-2" />
                      Save Smart Tag
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Inclusion Trigger Type Selector */}
      {showInclusionTriggerSelector && (
        <TriggerTypeSelector
          onSelect={handleInclusionTriggerSelect}
          onClose={() => setShowInclusionTriggerSelector(false)}
        />
      )}

      {/* Removal Trigger Type Selector */}
      {showRemovalTriggerSelector && (
        <TriggerTypeSelector
          onSelect={handleRemovalTriggerSelect}
          onClose={() => setShowRemovalTriggerSelector(false)}
        />
      )}

      {/* Inclusion Trigger Configuration Modal */}
      {showInclusionTriggerConfig && editingInclusionTrigger && (
        <TriggerConfigModal
          trigger={editingInclusionTrigger}
          onClose={() => {
            setShowInclusionTriggerConfig(false);
            setEditingInclusionTrigger(null);
          }}
          onSave={handleInclusionTriggerSave}
          availableFlows={[]}
        />
      )}

      {/* Removal Trigger Configuration Modal */}
      {showRemovalTriggerConfig && editingRemovalTrigger && (
        <TriggerConfigModal
          trigger={editingRemovalTrigger}
          onClose={() => {
            setShowRemovalTriggerConfig(false);
            setEditingRemovalTrigger(null);
          }}
          onSave={handleRemovalTriggerSave}
          availableFlows={[]}
        />
      )}

      {/* Exit Warning Modal */}
      {showExitWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <ExclamationTriangleIcon className="w-6 h-6 text-orange-500" />
                <h3 className="text-lg font-semibold text-gray-900">Unsaved Changes</h3>
              </div>
              <p className="text-gray-600 mb-6">
                You have unsaved changes. Are you sure you want to close this editor? Your changes will be lost.
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={cancelExit}
                >
                  Continue Editing
                </Button>
                <Button
                  onClick={confirmExit}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Discard Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const SmartTagsManager2: React.FC = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [editingTag, setEditingTag] = useState<SmartTag | null>(null);
  const [crimsonGPTPrompt, setCrimsonGPTPrompt] = useState('');
  const [isProcessingPrompt, setIsProcessingPrompt] = useState(false);

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Dropdown states
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Mock data for unified smart tags including all people codes (TEST version)
  const [smartTags, setSmartTags] = useState<SmartTag[]>([
    {
      id: '1',
      name: 'Big Givers',
      emoji: '💰',
      color: '#10B981',
      description: 'Donors who gave above $500 in the last 12 months',
      category: 'smart-tags',
      processingType: 'dynamic',
      filterDefinition: { totalGiving: { min: 500, period: '12months' } },
      inclusionTrigger: { totalGiving: { min: 500, period: '12months' } },
      count: 1247,
      isActive: true,
      isInclusionCriteria: true,
      associatedFlows: [
        {
          id: 'flow-1',
          name: 'Big Givers - Inclusion Flow',
          type: 'dynamic',
          isActive: true,
          isAutoCreated: true
        },
        {
          id: 'flow-2',
          name: 'Major Gift Stewardship',
          type: 'dynamic',
          isActive: true,
          isAutoCreated: false
        }
      ],
      createdBy: 'System',
      createdDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Prime Persuadables',
      emoji: '🎯',
      color: '#8B5CF6',
      description: 'FL residents, Age 35-44, moderate political engagement',
      category: 'smart-tags',
      processingType: 'dynamic',
      filterDefinition: { state: 'FL', ageRange: [35, 44], politicalEngagement: 'moderate' },
      inclusionTrigger: { state: 'FL', ageRange: [35, 44], politicalEngagement: 'moderate' },
      count: 892,
      isActive: true,
      isInclusionCriteria: true,
      associatedFlows: [
        {
          id: 'flow-3',
          name: 'Prime Persuadables - Inclusion Flow',
          type: 'dynamic',
          isActive: true,
          isAutoCreated: true
        }
      ],
      createdBy: 'System',
      createdDate: '2024-01-18'
    },
    {
      id: '3',
      name: 'Not Yet Registered to Vote',
      emoji: '🗳️',
      color: '#F59E0B',
      description: 'Individuals lacking voter registration data',
      category: 'smart-tags',
      processingType: 'dynamic',
      filterDefinition: { voterRegistration: { status: 'not_registered' } },
      inclusionTrigger: { voterRegistration: { status: 'not_registered' } },
      count: 456,
      isActive: true,
      isInclusionCriteria: true,
      associatedFlows: [
        {
          id: 'flow-4',
          name: 'Voter Registration Drive',
          type: 'dynamic',
          isActive: true,
          isAutoCreated: true
        }
      ],
      createdBy: 'System',
      createdDate: '2024-01-20'
    },
    {
      id: '4',
      name: 'New & Rising Donors',
      emoji: '⭐',
      color: '#EF4444',
      description: 'Recent donors showing increased giving patterns',
      category: 'smart-tags',
      processingType: 'dynamic',
      filterDefinition: { givingTrend: 'increasing', firstGiftDate: { within: '6months' } },
      inclusionTrigger: { givingTrend: 'increasing', firstGiftDate: { within: '6months' } },
      count: 234,
      isActive: true,
      isInclusionCriteria: true,
      associatedFlows: [],
      createdBy: 'System',
      createdDate: '2024-01-25'
    },
    {
      id: '5',
      name: 'Lapsed/At-Risk',
      emoji: '⚠️',
      color: '#F97316',
      description: 'Previously active donors showing declining engagement',
      category: 'smart-tags',
      processingType: 'dynamic',
      filterDefinition: { lastGiftDate: { before: '18months' }, previousGiving: { min: 100 } },
      inclusionTrigger: { lastGiftDate: { before: '18months' }, previousGiving: { min: 100 } },
      count: 678,
      isActive: true,
      isInclusionCriteria: false,
      associatedFlows: [
        {
          id: 'flow-5',
          name: 'Lapsed Donor Reactivation',
          type: 'dynamic',
          isActive: true,
          isAutoCreated: true
        }
      ],
      createdBy: 'System',
      createdDate: '2024-02-01'
    },
    // Example Flags
    {
      id: '6',
      name: 'VIP',
      emoji: '⭐',
      color: '#F59E0B',
      description: 'Major donor requiring special attention',
      category: 'flags',
      processingType: 'static',
      filterDefinition: {},
      count: 45,
      isActive: true,
      isInclusionCriteria: false,
      associatedFlows: [],
      createdBy: 'Admin',
      createdDate: '2024-01-20'
    },
    {
      id: '7',
      name: 'Board Member',
      emoji: '👔',
      color: '#3B82F6',
      description: 'Current or former board member',
      category: 'flags',
      processingType: 'static',
      filterDefinition: {},
      count: 23,
      isActive: true,
      isInclusionCriteria: false,
      associatedFlows: [],
      createdBy: 'Admin',
      createdDate: '2024-01-22'
    },
    // Example Keywords
    {
      id: '8',
      name: 'Healthcare',
      emoji: '🏥',
      color: '#10B981',
      description: 'Works in healthcare industry',
      category: 'keywords',
      processingType: 'static',
      filterDefinition: {},
      count: 156,
      isActive: true,
      isInclusionCriteria: false,
      associatedFlows: [],
      createdBy: 'User',
      createdDate: '2024-02-01'
    },
    // Example Attributes
    {
      id: '9',
      name: 'High Net Worth',
      emoji: '💎',
      color: '#8B5CF6',
      description: 'Estimated net worth over $1M',
      category: 'attributes',
      processingType: 'static',
      filterDefinition: {},
      count: 89,
      isActive: true,
      isInclusionCriteria: false,
      associatedFlows: [],
      createdBy: 'User',
      createdDate: '2024-02-05'
    }
  ]);

  // Category options for filtering
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'smart-tags', label: 'Smart Tags' },
    { value: 'flags', label: 'Flags' },
    { value: 'keywords', label: 'Keywords' },
    { value: 'attributes', label: 'Attributes' },
    { value: 'clubs', label: 'Clubs' },
    { value: 'contact-flag', label: 'Contact Flag' },
    { value: 'membership', label: 'Membership' },
    { value: 'volunteers', label: 'Volunteers' },
    { value: 'board', label: 'Board' }
  ];

  // Filter tags based on selected filters
  const filteredTags = smartTags.filter(tag => {
    const categoryMatch = categoryFilter === 'all' || tag.category === categoryFilter;
    const statusMatch = statusFilter === 'all' ||
      (statusFilter === 'active' && tag.isActive) ||
      (statusFilter === 'inactive' && !tag.isActive);
    return categoryMatch && statusMatch;
  });

  const handleCrimsonGPTPrompt = async () => {
    if (!crimsonGPTPrompt.trim()) return;

    setIsProcessingPrompt(true);

    // Simulate AI processing
    setTimeout(() => {
      setIsProcessingPrompt(false);
      setShowEditor(true);
      setCrimsonGPTPrompt('');
      // In real implementation, this would parse the prompt and pre-fill the editor
    }, 2000);
  };

  const handleEditTag = (tag: SmartTag) => {
    setEditingTag(tag);
    setShowEditor(true);
  };

  const handleDeleteTag = (tagId: string) => {
    if (confirm('Are you sure you want to delete this smart tag?')) {
      setSmartTags(tags => tags.filter(tag => tag.id !== tagId));
    }
  };

  const toggleTagStatus = (tagId: string) => {
    setSmartTags(tags =>
      tags.map(tag =>
        tag.id === tagId ? { ...tag, isActive: !tag.isActive } : tag
      )
    );
  };

  // Dropdown management
  const toggleDropdown = (tagId: string) => {
    setOpenDropdown(openDropdown === tagId ? null : tagId);
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown) {
        const dropdownElement = dropdownRefs.current[openDropdown];
        if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
          closeDropdown();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-crimson-blue bg-opacity-10 p-2 rounded-lg">
            <SparklesIcon className="w-6 h-6 text-crimson-blue" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              Smart Tags 2
              <Badge variant="warning" size="sm">TEST</Badge>
            </h3>
            <p className="text-sm text-gray-600">Unified system for all people codes and dynamic labels</p>
          </div>
        </div>
        <Button onClick={() => setShowEditor(true)} className="bg-crimson-blue hover:bg-crimson-dark-blue">
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Tag
        </Button>
      </div>

      {/* Filter Controls */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Category:</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="ml-auto text-sm text-gray-600">
            Showing {filteredTags.length} of {smartTags.length} tags
          </div>
        </div>
      </div>

      {/* CrimsonGPT Prompt Box */}
      <div className="bg-gradient-to-r from-crimson-blue to-crimson-dark-blue rounded-lg p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-white bg-opacity-20 p-2 rounded-lg">
            <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
          </div>
          <h4 className="font-semibold text-white text-lg">CrimsonGPT Smart Tag Creator</h4>
          <SparklesIcon className="w-5 h-5 text-crimson-accent-blue" />
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={crimsonGPTPrompt}
            onChange={(e) => setCrimsonGPTPrompt(e.target.value)}
            placeholder="Describe your ideal tag: 'Find all donors under 35 who gave more than $100 last year and live in Miami'"
            className="flex-1 px-4 py-3 bg-white bg-opacity-95 border-0 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:outline-none shadow-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleCrimsonGPTPrompt()}
          />
          <Button
            onClick={handleCrimsonGPTPrompt}
            disabled={!crimsonGPTPrompt.trim() || isProcessingPrompt}
            className="bg-white bg-opacity-20 hover:bg-white hover:bg-opacity-30 text-white border border-white border-opacity-30 hover:border-opacity-50 font-medium px-6 py-3 transition-all duration-200 backdrop-blur-sm"
          >
            {isProcessingPrompt ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              <>
                <SparklesIcon className="w-4 h-4 mr-2" />
                Create
              </>
            )}
          </Button>
        </div>
        <p className="text-sm text-white text-opacity-90 mt-3 leading-relaxed">
          CrimsonGPT will convert your description into smart filters and suggest a tag name and emoji.
        </p>
      </div>

      {/* Smart Tags List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h4 className="font-medium text-gray-900">Tags</h4>
          <p className="text-sm text-gray-600">All people codes and dynamic labels in one unified system</p>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredTags.map((tag) => (
            <div key={tag.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between gap-6">
                {/* Left Section - Tag Info */}
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-xl flex-shrink-0 relative"
                    style={{ backgroundColor: `${tag.color}20`, border: `2px solid ${tag.color}30` }}
                  >
                    {tag.emoji}
                    {/* Pulse Heart Indicator for Smart Tags */}
                    {tag.category === 'smart-tags' && (
                      <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 animate-pulse">
                        <HeartIcon className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    {/* Tag Name and Contact Count */}
                    <div className="flex items-center gap-3 mb-2">
                      <button
                        onClick={() => handleEditTag(tag)}
                        className="font-semibold text-gray-900 text-lg hover:text-crimson-blue transition-colors cursor-pointer text-left"
                      >
                        {tag.name}
                      </button>
                      <span className="text-sm text-gray-500">
                        {tag.count.toLocaleString()} contacts
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-3">{tag.description}</p>

                    {/* Badges Row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        className={`text-xs ${tag.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                      >
                        {tag.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge
                        className={`text-xs ${tag.processingType === 'dynamic' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}
                      >
                        {tag.processingType === 'dynamic' ? '⚡ Dynamic' : '📌 Static'}
                      </Badge>
                      <Badge
                        className="text-xs bg-purple-100 text-purple-800 capitalize"
                      >
                        {tag.category.replace('-', ' ')}
                      </Badge>
                      {tag.isInclusionCriteria && (
                        <Badge
                          className="text-xs bg-orange-100 text-orange-800"
                        >
                          🎯 Inclusion Criteria
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Section - Actions and Created Date */}
                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  {/* Actions Dropdown */}
                  <div className="relative" ref={(el) => (dropdownRefs.current[tag.id] = el)}>
                    <button
                      onClick={() => toggleDropdown(tag.id)}
                      className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue transition-colors"
                    >
                      Actions
                      <ChevronDownIcon className="w-4 h-4" />
                    </button>

                  {/* Dropdown Menu */}
                  {openDropdown === tag.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            console.log(`Viewing records for tag: ${tag.name}`);
                            closeDropdown();
                          }}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-crimson-blue hover:text-white transition-colors"
                        >
                          <EyeIcon className="w-4 h-4" />
                          View Records
                        </button>
                        <button
                          onClick={() => {
                            console.log(`Adding new criteria for tag: ${tag.name}`);
                            closeDropdown();
                          }}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-green-600 hover:text-white transition-colors"
                        >
                          <PlusIcon className="w-4 h-4" />
                          Add New Criteria
                        </button>
                        <button
                          onClick={() => {
                            toggleTagStatus(tag.id);
                            closeDropdown();
                          }}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <div className={`w-4 h-4 rounded-full ${tag.isActive ? 'bg-red-500' : 'bg-green-500'}`} />
                          {tag.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <div className="border-t border-gray-100 my-1" />
                        <button
                          onClick={() => {
                            handleEditTag(tag);
                            closeDropdown();
                          }}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white transition-colors"
                        >
                          <PencilIcon className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteTag(tag.id);
                            closeDropdown();
                          }}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Created Date */}
                <div className="text-xs text-gray-500">
                  Created {new Date(tag.createdDate).toLocaleDateString()}
                </div>
              </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Smart Tag Editor Modal */}
      {showEditor && (
        <EnhancedSmartTagEditor
          tag={editingTag}
          onClose={() => {
            setShowEditor(false);
            setEditingTag(null);
          }}
          onSave={(tag) => {
            if (editingTag) {
              setSmartTags(tags => tags.map(t => t.id === editingTag.id ? tag : t));
            } else {
              setSmartTags(tags => [...tags, { ...tag, id: Date.now().toString() }]);
            }
            setShowEditor(false);
            setEditingTag(null);
          }}
        />
      )}
    </div>
  );
};

export default SmartTagsManager2;
