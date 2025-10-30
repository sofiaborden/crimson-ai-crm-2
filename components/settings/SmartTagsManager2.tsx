import React, { useState, useRef, useEffect } from 'react';
import { SparklesIcon, PlusIcon, PencilIcon, TrashIcon, EyeIcon, ChatBubbleLeftRightIcon, EllipsisVerticalIcon, ChevronDownIcon, XMarkIcon, HeartIcon, FunnelIcon, PlayIcon, PauseIcon, CheckIcon, UserGroupIcon, ClockIcon, ExclamationTriangleIcon, ArrowPathIcon } from '../../constants';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import SmartTagFilters from './SmartTagFilters';

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
    color: tag?.color || 'blue',
    description: tag?.description || '',
    category: tag?.category || 'smart-tags',
    processingType: tag?.processingType || 'dynamic',
    filterDefinition: tag?.filterDefinition || null,
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
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [pendingTab, setPendingTab] = useState<string | null>(null);

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

  const handleTabChange = (newTab: string) => {
    if (hasUnsavedChanges) {
      setShowUnsavedWarning(true);
      setPendingTab(newTab);
    } else {
      setActiveTab(newTab as any);
    }
  };

  const confirmTabChange = () => {
    if (pendingTab) {
      setActiveTab(pendingTab as any);
      setShowUnsavedWarning(false);
      setPendingTab(null);
      setHasUnsavedChanges(false);
    }
  };

  const cancelTabChange = () => {
    setShowUnsavedWarning(false);
    setPendingTab(null);
  };

  const handleFormChange = (field: string, value: any) => {
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
                onClick={onClose}
                className="text-white hover:text-crimson-accent-blue transition-colors p-1 rounded-lg hover:bg-white hover:bg-opacity-10"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex">
              {[
                { id: 'overview', name: 'Overview', icon: <SparklesIcon className="w-4 h-4" /> },
                { id: 'add-people', name: 'Add People', icon: <UserGroupIcon className="w-4 h-4" /> },
                { id: 'add-when', name: 'Add When', icon: <PlayIcon className="w-4 h-4" /> },
                { id: 'remove-when', name: 'Remove When', icon: <PauseIcon className="w-4 h-4" /> },
                { id: 'summary', name: 'Summary', icon: <CheckIcon className="w-4 h-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-crimson-blue text-crimson-blue bg-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  {tab.name}
                  {hasUnsavedChanges && activeTab === tab.id && (
                    <div className="w-2 h-2 bg-orange-500 rounded-full ml-1"></div>
                  )}
                </button>
              ))}
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Emoji</label>
                      <input
                        type="text"
                        value={formData.emoji}
                        onChange={(e) => handleFormChange('emoji', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                        placeholder="🏷️"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Processing Type</label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="processingType"
                            value="dynamic"
                            checked={formData.processingType === 'dynamic'}
                            onChange={(e) => handleFormChange('processingType', e.target.value)}
                            className="mr-2"
                          />
                          <div>
                            <div className="font-medium">Dynamic</div>
                            <div className="text-sm text-gray-600">Automatically updates as criteria change</div>
                          </div>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="processingType"
                            value="static"
                            checked={formData.processingType === 'static'}
                            onChange={(e) => handleFormChange('processingType', e.target.value)}
                            className="mr-2"
                          />
                          <div>
                            <div className="font-medium">Static</div>
                            <div className="text-sm text-gray-600">Fixed list, manually managed</div>
                          </div>
                        </label>
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

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <SmartTagFilters
                    filters={formData.filterDefinition || []}
                    onChange={(filters) => handleFormChange('filterDefinition', filters)}
                    showPreview={true}
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFormChange('inclusionTrigger', null)}
                        >
                          <TrashIcon className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Trigger:</strong> {formData.inclusionTrigger.type || 'Custom workflow'}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        <strong>Description:</strong> {formData.inclusionTrigger.description || 'Workflow configured'}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <PlayIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No Inclusion Workflow</h4>
                      <p className="text-gray-600 mb-4">
                        Create a workflow to automatically add people to this tag based on specific triggers.
                      </p>
                      <Button
                        onClick={() => handleFormChange('inclusionTrigger', { type: 'custom', description: 'New inclusion workflow' })}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Create Inclusion Workflow
                      </Button>
                    </div>
                  )}
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFormChange('removalTrigger', null)}
                        >
                          <TrashIcon className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Trigger:</strong> {formData.removalTrigger.type || 'Custom workflow'}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        <strong>Description:</strong> {formData.removalTrigger.description || 'Workflow configured'}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <PauseIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No Removal Workflow</h4>
                      <p className="text-gray-600 mb-4">
                        Create a workflow to automatically remove people from this tag based on specific triggers.
                      </p>
                      <Button
                        onClick={() => handleFormChange('removalTrigger', { type: 'custom', description: 'New removal workflow' })}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Create Removal Workflow
                      </Button>
                    </div>
                  )}
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
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {hasUnsavedChanges && (
                  <div className="flex items-center gap-2 text-orange-600 text-sm">
                    <ExclamationTriangleIcon className="w-4 h-4" />
                    <span>You have unsaved changes</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-crimson-blue hover:bg-crimson-dark-blue"
                >
                  {tag ? 'Update Tag' : 'Create Tag'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unsaved Changes Warning Modal */}
      {showUnsavedWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <ExclamationTriangleIcon className="w-6 h-6 text-orange-500" />
                <h3 className="text-lg font-semibold text-gray-900">Unsaved Changes</h3>
              </div>
              <p className="text-gray-600 mb-6">
                You have unsaved changes. Are you sure you want to switch tabs? Your changes will be lost.
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={cancelTabChange}
                >
                  Stay Here
                </Button>
                <Button
                  onClick={confirmTabChange}
                  className="bg-orange-600 hover:bg-orange-700"
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
  const [showCrimsonGPT, setShowCrimsonGPT] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock data for Smart Tags 2 (TEST version)
  const [smartTags, setSmartTags] = useState<SmartTag[]>([
    {
      id: '1',
      name: 'Major Donors',
      emoji: '💎',
      color: 'blue',
      description: 'Donors who have given $1,000+ in the past year',
      category: 'smart-tags',
      processingType: 'dynamic',
      filterDefinition: [{ field: 'totalGiving', operator: 'gte', value: 1000 }],
      count: 127,
      isActive: true,
      isInclusionCriteria: true,
      associatedFlows: [
        { id: 'flow1', name: 'Major Donor Stewardship', type: 'dynamic', isActive: true, isAutoCreated: true }
      ],
      createdBy: 'System',
      createdDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Lapsed Donors',
      emoji: '⏰',
      color: 'orange',
      description: 'Donors who haven\'t given in 18+ months',
      category: 'smart-tags',
      processingType: 'dynamic',
      filterDefinition: [{ field: 'lastGiftDate', operator: 'lt', value: '2022-06-01' }],
      count: 89,
      isActive: true,
      isInclusionCriteria: false,
      associatedFlows: [
        { id: 'flow2', name: 'Lapsed Donor Reactivation', type: 'dynamic', isActive: true, isAutoCreated: true }
      ],
      createdBy: 'John Smith',
      createdDate: '2024-02-01'
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Categories', count: smartTags.length },
    { id: 'smart-tags', name: 'Smart Tags', count: smartTags.filter(t => t.category === 'smart-tags').length },
    { id: 'flags', name: 'Flags', count: smartTags.filter(t => t.category === 'flags').length },
    { id: 'keywords', name: 'Keywords', count: smartTags.filter(t => t.category === 'keywords').length },
    { id: 'attributes', name: 'Attributes', count: smartTags.filter(t => t.category === 'attributes').length }
  ];

  const statusOptions = [
    { id: 'all', name: 'All Status', count: smartTags.length },
    { id: 'active', name: 'Active', count: smartTags.filter(t => t.isActive).length },
    { id: 'inactive', name: 'Inactive', count: smartTags.filter(t => !t.isActive).length }
  ];

  // Filter tags based on selected filters
  const filteredTags = smartTags.filter(tag => {
    const matchesCategory = selectedCategory === 'all' || tag.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' ||
      (selectedStatus === 'active' && tag.isActive) ||
      (selectedStatus === 'inactive' && !tag.isActive);
    const matchesSearch = searchTerm === '' ||
      tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tag.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesStatus && matchesSearch;
  });

  const closeDropdown = () => setOpenDropdown(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEditTag = (tag: SmartTag) => {
    setEditingTag(tag);
    setShowEditor(true);
    closeDropdown();
  };

  const handleSaveTag = (updatedTag: SmartTag) => {
    if (editingTag) {
      // Update existing tag
      setSmartTags(prev => prev.map(tag =>
        tag.id === editingTag.id ? { ...updatedTag, id: editingTag.id } : tag
      ));
    } else {
      // Add new tag
      setSmartTags(prev => [...prev, { ...updatedTag, id: Date.now().toString() }]);
    }
    setShowEditor(false);
    setEditingTag(null);
  };

  const handleDeleteTag = (tagId: string) => {
    setSmartTags(prev => prev.filter(tag => tag.id !== tagId));
    closeDropdown();
  };

  const handleCrimsonGPTSubmit = () => {
    if (crimsonGPTPrompt.trim()) {
      // Create a new tag based on the prompt
      const newTag: SmartTag = {
        id: Date.now().toString(),
        name: crimsonGPTPrompt.split(' ').slice(0, 3).join(' '),
        emoji: '🤖',
        color: 'purple',
        description: `AI-generated tag based on: "${crimsonGPTPrompt}"`,
        category: 'smart-tags',
        processingType: 'dynamic',
        filterDefinition: [],
        count: Math.floor(Math.random() * 100) + 10,
        isActive: true,
        isInclusionCriteria: true,
        associatedFlows: [],
        createdBy: 'CrimsonGPT',
        createdDate: new Date().toISOString().split('T')[0]
      };

      setSmartTags(prev => [...prev, newTag]);
      setCrimsonGPTPrompt('');
      setShowCrimsonGPT(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-lg">
            <SparklesIcon className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              Smart Tags 2
              <Badge variant="warning" size="sm">TEST</Badge>
            </h2>
            <p className="text-sm text-gray-600">Enhanced tabbed interface for comprehensive tag management</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowCrimsonGPT(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
            CrimsonGPT
          </Button>
          <Button
            onClick={() => {
              setEditingTag(null);
              setShowEditor(true);
            }}
            className="bg-crimson-blue hover:bg-crimson-dark-blue"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Tag
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-4 h-4 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-crimson-blue focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-crimson-blue focus:border-transparent"
            >
              {statusOptions.map(status => (
                <option key={status.id} value={status.id}>
                  {status.name} ({status.count})
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-crimson-blue focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Tags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTags.map((tag) => (
          <div key={tag.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{tag.emoji}</span>
                <div>
                  <h3 className="font-medium text-gray-900">{tag.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant={tag.isActive ? 'success' : 'secondary'}
                      size="sm"
                    >
                      {tag.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline" size="sm">
                      {tag.processingType === 'dynamic' ? 'Dynamic' : 'Static'}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpenDropdown(openDropdown === tag.id ? null : tag.id)}
                  className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <EllipsisVerticalIcon className="w-4 h-4 text-gray-500" />
                </button>
                {openDropdown === tag.id && (
                  <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[160px]">
                    <button
                      onClick={() => handleEditTag(tag)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <EyeIcon className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleEditTag(tag)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <PencilIcon className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTag(tag.id)}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Delete
                    </button>
                    {tag.associatedFlows && tag.associatedFlows.length > 0 && (
                      <button
                        onClick={closeDropdown}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <ArrowPathIcon className="w-4 h-4" />
                        View Associated Flows
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-3">{tag.description}</p>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{tag.count} people</span>
              <span>by {tag.createdBy}</span>
            </div>

            {tag.associatedFlows && tag.associatedFlows.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-500 mb-1">Associated Flows:</div>
                <div className="flex flex-wrap gap-1">
                  {tag.associatedFlows.map((flow) => (
                    <Badge key={flow.id} variant="outline" size="sm">
                      {flow.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTags.length === 0 && (
        <div className="text-center py-12">
          <SparklesIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tags found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
              ? 'Try adjusting your filters or search terms.'
              : 'Create your first Smart Tag to get started.'}
          </p>
          <Button
            onClick={() => {
              setEditingTag(null);
              setShowEditor(true);
            }}
            className="bg-crimson-blue hover:bg-crimson-dark-blue"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Smart Tag
          </Button>
        </div>
      )}

      {/* CrimsonGPT Modal */}
      {showCrimsonGPT && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">CrimsonGPT</h3>
                  <p className="text-sm text-gray-600">AI-powered Smart Tag creation</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe the tag you want to create:
                </label>
                <textarea
                  value={crimsonGPTPrompt}
                  onChange={(e) => setCrimsonGPTPrompt(e.target.value)}
                  placeholder="e.g., 'Create a tag for donors who gave more than $500 in the last 6 months'"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCrimsonGPT(false);
                    setCrimsonGPTPrompt('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCrimsonGPTSubmit}
                  disabled={!crimsonGPTPrompt.trim()}
                  className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                >
                  Generate Tag
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Smart Tag Editor Modal */}
      {showEditor && (
        <EnhancedSmartTagEditor
          tag={editingTag}
          onClose={() => {
            setShowEditor(false);
            setEditingTag(null);
          }}
          onSave={handleSaveTag}
        />
      )}
    </div>
  );
};

export default SmartTagsManager2;
