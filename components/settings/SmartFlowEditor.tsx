import React, { useState, useEffect } from 'react';
import { XMarkIcon, ArrowPathIcon, PlusIcon, FunnelIcon, EyeIcon, PlayIcon, CheckIcon, PencilIcon, TrashIcon, DocumentDuplicateIcon, BoltIcon } from '../../constants';
import Button from '../ui/Button';
import SmartTagFilters from './SmartTagFilters';
import FlowVisualBuilder from './FlowVisualBuilder';
import TriggerConfigModal from './TriggerConfigModal';
import TriggerTypeSelector from './TriggerTypeSelector';

interface SmartFlow {
  id?: string;
  name: string;
  description: string;
  type: 'dynamic' | 'static';
  syncPeriod?: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  isActive: boolean;
  targetCount?: number;
  completedCount?: number;
  triggers: FlowTrigger[];
  audienceFilters?: Array<{type: string, value: string, label: string}>;
  estimatedAudienceSize?: string;
  filterDefinition?: any;
  createdBy: string;
  createdDate: string;
}

interface FlowTrigger {
  id: string;
  type: 'task' | 'segment' | 'flag' | 'keyword' | 'attribute' | 'note' | 'event' | 'dialr' | 'targetpath' | 'mailchimp';
  name: string;
  config: any;
  conditions?: FlowCondition[];
  position: { x: number; y: number };
}

interface FlowCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
  actions: FlowAction[];
}

interface FlowAction {
  id: string;
  type: string;
  config: any;
}

interface SmartFlowEditorProps {
  flow?: SmartFlow | null;
  onClose: () => void;
  onSave: (flow: SmartFlow) => void;
  onCopy?: (flow: SmartFlow) => void;
}

const SmartFlowEditor: React.FC<SmartFlowEditorProps> = ({ flow, onClose, onSave, onCopy }) => {
  const [formData, setFormData] = useState<SmartFlow>({
    name: flow?.name || '',
    description: flow?.description || '',
    type: flow?.type || 'dynamic',
    syncPeriod: flow?.syncPeriod || 'daily',
    isActive: flow?.isActive || false,
    triggers: flow?.triggers || [],
    audienceFilters: flow?.audienceFilters || [],
    estimatedAudienceSize: flow?.estimatedAudienceSize || '0',
    filterDefinition: flow?.filterDefinition || null,
    createdBy: flow?.createdBy || 'Current User',
    createdDate: flow?.createdDate || new Date().toISOString().split('T')[0]
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'targeting' | 'triggers' | 'preview'>('basic');
  const [showTriggerModal, setShowTriggerModal] = useState(false);
  const [showTriggerTypeSelector, setShowTriggerTypeSelector] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState<FlowTrigger | null>(null);
  const [triggerViewMode, setTriggerViewMode] = useState<'list' | 'visual'>('list');
  const [previewCount, setPreviewCount] = useState(0);

  const triggerTypes = [
    { id: 'task', name: 'Task', icon: '📋', description: 'Create tasks for team members' },
    { id: 'segment', name: 'Smart Segment', icon: '👥', description: 'Add to or create segments' },
    { id: 'flag', name: 'Flag', icon: '🏁', description: 'Apply flags for categorization' },
    { id: 'keyword', name: 'Keyword', icon: '🏷️', description: 'Add keywords for tracking' },
    { id: 'attribute', name: 'Attribute', icon: '📊', description: 'Set custom attributes' },
    { id: 'note', name: 'Note', icon: '📝', description: 'Add notes to records' },
    { id: 'event', name: 'Event', icon: '📅', description: 'Schedule events or meetings' },
    { id: 'dialr', name: 'DialR Campaign', icon: '📞', description: 'Add to calling campaigns' },
    { id: 'targetpath', name: 'TargetPath', icon: '🎯', description: 'Wealth screening requests' },
    { id: 'mailchimp', name: 'MailChimp', icon: '📧', description: 'Email marketing automation' }
  ];

  const syncPeriods = [
    { id: 'realtime', name: 'Real-time', description: 'Instant processing (higher cost)' },
    { id: 'hourly', name: 'Hourly', description: 'Process every hour' },
    { id: 'daily', name: 'Daily', description: 'Process once per day' },
    { id: 'weekly', name: 'Weekly', description: 'Process weekly on Mondays' },
    { id: 'monthly', name: 'Monthly', description: 'Process on the 1st of each month' }
  ];

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Please enter a flow name');
      return;
    }

    onSave({
      ...formData,
      targetCount: previewCount,
      completedCount: 0
    });
  };

  const handleCopy = () => {
    if (!onCopy) return;

    const copiedFlow = {
      ...formData,
      name: `${formData.name} (Copy)`,
      isActive: false, // Copies should start inactive
      targetCount: previewCount,
      completedCount: 0,
      createdDate: new Date().toISOString().split('T')[0]
    };

    onCopy(copiedFlow);
  };

  const addTrigger = (type: string) => {
    const newTrigger: FlowTrigger = {
      id: Date.now().toString(),
      type: type as any,
      name: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Trigger`,
      config: {},
      conditions: [],
      position: { x: 100 + formData.triggers.length * 200, y: 100 }
    };

    setFormData(prev => ({
      ...prev,
      triggers: [...prev.triggers, newTrigger]
    }));

    setEditingTrigger(newTrigger);
    setShowTriggerModal(true);
  };

  const updateTrigger = (updatedTrigger: FlowTrigger) => {
    setFormData(prev => ({
      ...prev,
      triggers: prev.triggers.map(t => t.id === updatedTrigger.id ? updatedTrigger : t)
    }));
  };

  const removeTrigger = (triggerId: string) => {
    setFormData(prev => ({
      ...prev,
      triggers: prev.triggers.filter(t => t.id !== triggerId)
    }));
  };

  const addAudienceFilter = (filterType: string, filterValue: string, filterLabel: string) => {
    const newFilter = {
      type: filterType,
      value: filterValue,
      label: filterLabel
    };

    setFormData(prev => ({
      ...prev,
      audienceFilters: [...(prev.audienceFilters || []), newFilter],
      estimatedAudienceSize: calculateEstimatedSize([...(prev.audienceFilters || []), newFilter])
    }));
  };

  const removeAudienceFilter = (index: number) => {
    setFormData(prev => {
      const newFilters = prev.audienceFilters?.filter((_, i) => i !== index) || [];
      return {
        ...prev,
        audienceFilters: newFilters,
        estimatedAudienceSize: calculateEstimatedSize(newFilters)
      };
    });
  };

  const calculateEstimatedSize = (filters: any[]) => {
    // Mock calculation - in real app this would call an API
    if (filters.length === 0) return '0';

    let baseSize = 5000; // Base donor count
    filters.forEach(filter => {
      switch (filter.type) {
        case 'segment':
          if (filter.value === 'major-donors') baseSize = Math.floor(baseSize * 0.15);
          else if (filter.value === 'new-donors') baseSize = Math.floor(baseSize * 0.25);
          else if (filter.value === 'lapsed-donors') baseSize = Math.floor(baseSize * 0.30);
          break;
        case 'giving_amount':
          if (filter.value === '1000+') baseSize = Math.floor(baseSize * 0.20);
          else if (filter.value === '500+') baseSize = Math.floor(baseSize * 0.35);
          break;
        case 'time_period':
          if (filter.value === 'this_cycle') baseSize = Math.floor(baseSize * 0.60);
          break;
      }
    });

    return baseSize.toLocaleString();
  };

  const toggleTriggerStatus = (triggerId: string) => {
    setFormData(prev => ({
      ...prev,
      triggers: prev.triggers.map(trigger =>
        trigger.id === triggerId
          ? { ...trigger, isActive: trigger.isActive !== false ? false : true }
          : trigger
      )
    }));
  };

  const duplicateTrigger = (originalTrigger: FlowTrigger) => {
    const duplicatedTrigger: FlowTrigger = {
      ...originalTrigger,
      id: Date.now().toString(),
      name: `${originalTrigger.name} (Copy)`,
      position: {
        x: originalTrigger.position.x + 50,
        y: originalTrigger.position.y + 50
      }
    };

    setFormData(prev => ({
      ...prev,
      triggers: [...prev.triggers, duplicatedTrigger]
    }));
  };

  const renderTriggerSummary = (trigger: FlowTrigger) => {
    if (!trigger.conditions || trigger.conditions.length === 0) {
      return `${trigger.type.charAt(0).toUpperCase() + trigger.type.slice(1)} trigger with no conditions configured`;
    }

    const conditionSummaries = trigger.conditions.map(condition => {
      if (!condition.conditions || condition.conditions.length === 0) {
        return 'Empty condition';
      }

      const conditionTexts = condition.conditions.map((row, index) => {
        const operator = row.operator === 'equals' ? '=' :
                        row.operator === 'greater_than' ? '>' :
                        row.operator === 'less_than' ? '<' :
                        row.operator === 'contains' ? 'contains' : row.operator;

        const prefix = index > 0 ? ` ${condition.conditions[index - 1].logicalOperator || 'AND'} ` : '';
        return `${prefix}${row.field} ${operator} "${row.value}"`;
      }).join('');

      const actionCount = condition.actions ? condition.actions.length : 0;
      const actionText = actionCount > 0 ?
        `THEN ${condition.actions.map(a => a.type.replace(/_/g, ' ')).join(', ')}` :
        'THEN (no actions)';

      return `IF ${conditionTexts} ${actionText}`;
    });

    return conditionSummaries.join(' | ');
  };

  const handleFiltersChange = (filters: any[]) => {
    setFormData(prev => ({
      ...prev,
      filterDefinition: filters
    }));
    
    // Simulate preview count calculation
    const mockCount = Math.floor(Math.random() * 500) + 50;
    setPreviewCount(mockCount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-crimson-blue to-crimson-dark-blue text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <ArrowPathIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {flow ? 'Edit Smart Flow' : 'Create Smart Flow'}
                </h2>
                <p className="text-crimson-accent-blue text-sm">Design automated donor journey workflows</p>
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
              { id: 'basic', name: 'Overview', icon: <ArrowPathIcon className="w-4 h-4" /> },
              { id: 'targeting', name: 'Audience', icon: <FunnelIcon className="w-4 h-4" /> },
              { id: 'triggers', name: 'Flow Triggers', icon: <PlayIcon className="w-4 h-4" /> },
              { id: 'preview', name: 'Preview & Test', icon: <EyeIcon className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-crimson-blue text-crimson-blue bg-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Basic Settings Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Flow Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                      placeholder="e.g., New Donor Welcome Journey"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                      placeholder="Describe what this flow accomplishes..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Flow Type</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="type"
                          value="dynamic"
                          checked={formData.type === 'dynamic'}
                          onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                          className="mr-2"
                        />
                        <div>
                          <div className="font-medium">Dynamic Flow</div>
                          <div className="text-sm text-gray-600">Automatically processes new matches</div>
                        </div>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="type"
                          value="static"
                          checked={formData.type === 'static'}
                          onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                          className="mr-2"
                        />
                        <div>
                          <div className="font-medium">Static Flow</div>
                          <div className="text-sm text-gray-600">One-time processing of current matches</div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {formData.type === 'dynamic' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sync Period</label>
                      <select
                        value={formData.syncPeriod}
                        onChange={(e) => setFormData(prev => ({ ...prev, syncPeriod: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                      >
                        {syncPeriods.map((period) => (
                          <option key={period.id} value={period.id}>
                            {period.name} - {period.description}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}



                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="mr-2"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                      Activate flow immediately after saving
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Audience Tab */}
          {activeTab === 'targeting' && (
            <div className="space-y-6">
              {/* Active Filters Display */}
              {formData.audienceFilters && formData.audienceFilters.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-blue-900 flex items-center gap-2">
                      <FunnelIcon className="w-5 h-5 text-blue-600" />
                      Active Audience Filters
                    </h3>
                    <div className="text-sm text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                      Estimated {formData.estimatedAudienceSize || '1,247'} donors match
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.audienceFilters.map((filter, index) => (
                      <div key={index} className="flex items-center gap-2 bg-white border border-blue-200 rounded-lg px-3 py-2">
                        <span className="text-sm font-medium text-gray-900">{filter.label}</span>
                        <button
                          onClick={() => removeAudienceFilter(index)}
                          className="text-gray-400 hover:text-red-500 ml-1"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="text-xs text-blue-600">
                    Filters are combined using AND logic. All conditions must be met for donors to be included.
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FunnelIcon className="w-5 h-5 text-crimson-blue" />
                  Add Audience Filters
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Define who should be included in this flow using Smart Segments, Smart Tags, or custom filters.
                </p>

                {/* Quick Filter Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-purple-600 font-semibold text-sm">S</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Smart Segment</h4>
                        <p className="text-xs text-gray-600">Use existing segment</p>
                      </div>
                    </div>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue text-sm"
                      onChange={(e) => {
                        if (e.target.value) {
                          const option = e.target.options[e.target.selectedIndex];
                          addAudienceFilter('segment', e.target.value, option.text);
                          e.target.value = '';
                        }
                      }}
                    >
                      <option value="">Select a Smart Segment...</option>
                      <option value="major-donors">Major Donors ($1000+)</option>
                      <option value="new-donors">New Donors (Last 6 months)</option>
                      <option value="lapsed-donors">Lapsed Donors</option>
                      <option value="monthly-givers">Monthly Recurring Givers</option>
                      <option value="high-capacity">High Capacity Prospects</option>
                    </select>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">T</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Smart Tag</h4>
                        <p className="text-xs text-gray-600">Filter by tags</p>
                      </div>
                    </div>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue text-sm"
                      onChange={(e) => {
                        if (e.target.value) {
                          const option = e.target.options[e.target.selectedIndex];
                          addAudienceFilter('smart_tag', e.target.value, option.text);
                          e.target.value = '';
                        }
                      }}
                    >
                      <option value="">Select a Smart Tag...</option>
                      <option value="big-givers">Big Givers</option>
                      <option value="prime-persuadables">Prime Persuadables</option>
                      <option value="not-yet-registered">Not Yet Registered</option>
                      <option value="new-rising-donors">New & Rising Donors</option>
                      <option value="lapsed-at-risk">Lapsed/At-Risk</option>
                    </select>
                  </div>
                </div>



                {/* Advanced Filters */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Advanced Filters</h4>
                  <SmartTagFilters
                    onFiltersChange={handleFiltersChange}
                    initialFilters={formData.filterDefinition || []}
                  />
                </div>

                {previewCount > 0 && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <EyeIcon className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Preview: {previewCount} people match your criteria
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Flow Triggers Tab */}
          {activeTab === 'triggers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Flow Triggers</h3>
                  <p className="text-sm text-gray-600">Define what actions happen when people enter this flow</p>
                </div>
                <div className="flex items-center gap-4">
                  {/* View Toggle */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setTriggerViewMode('list')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        triggerViewMode === 'list'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      List View
                    </button>
                    <button
                      onClick={() => setTriggerViewMode('visual')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        triggerViewMode === 'visual'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Visual Diagram
                    </button>
                  </div>
                  <Button
                    onClick={() => setShowTriggerTypeSelector(true)}
                    className="bg-crimson-blue hover:bg-crimson-dark-blue"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Trigger
                  </Button>
                </div>
              </div>

              {/* List View */}
              {triggerViewMode === 'list' && (
                <>
                  {formData.triggers && formData.triggers.length > 0 ? (
                    <div className="space-y-4">
                      {formData.triggers.map((trigger, index) => (
                        <div key={trigger.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                                    {index + 1}
                                  </span>
                                  <span className="font-medium text-gray-900 capitalize">
                                    {trigger.type} Trigger
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => toggleTriggerStatus(trigger.id)}
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      trigger.isActive !== false
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-600'
                                    }`}
                                  >
                                    {trigger.isActive !== false ? 'Active' : 'Inactive'}
                                  </button>
                                </div>
                              </div>

                              <div className="text-sm text-gray-600 mb-3">
                                {renderTriggerSummary(trigger)}
                              </div>

                              {trigger.conditions && trigger.conditions.length > 0 && (
                                <div className="text-xs text-gray-500">
                                  {trigger.conditions.length} condition{trigger.conditions.length !== 1 ? 's' : ''} configured
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2 ml-4">
                              <Button
                                onClick={() => {
                                  setEditingTrigger(trigger);
                                  setShowTriggerModal(true);
                                }}
                                size="sm"
                                variant="secondary"
                                className="text-blue-600 hover:bg-blue-50"
                              >
                                <PencilIcon className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                onClick={() => duplicateTrigger(trigger)}
                                size="sm"
                                variant="secondary"
                                className="text-green-600 hover:bg-green-50"
                              >
                                <DocumentDuplicateIcon className="w-4 h-4 mr-1" />
                                Copy
                              </Button>
                              <Button
                                onClick={() => removeTrigger(trigger.id)}
                                size="sm"
                                variant="secondary"
                                className="text-red-600 hover:bg-red-50"
                              >
                                <TrashIcon className="w-4 h-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <BoltIcon className="w-6 h-6 text-gray-400" />
                      </div>
                      <h3 className="font-medium text-gray-900 mb-2">No triggers configured</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Add triggers to define what happens when people enter this flow
                      </p>
                      <Button
                        onClick={() => setShowTriggerTypeSelector(true)}
                        className="bg-crimson-blue hover:bg-crimson-dark-blue"
                      >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add Your First Trigger
                      </Button>
                    </div>
                  )}
                </>
              )}

              {/* Visual Diagram View */}
              {triggerViewMode === 'visual' && (
                <FlowVisualBuilder
                  triggers={formData.triggers}
                  onTriggerEdit={(trigger) => {
                    setEditingTrigger(trigger);
                    setShowTriggerModal(true);
                  }}
                  onTriggerDelete={removeTrigger}
                  onTriggerDuplicate={duplicateTrigger}
                  onAddTrigger={addTrigger}
                  audienceFilters={formData.audienceFilters}
                  estimatedAudienceSize={formData.estimatedAudienceSize}
                />
              )}
            </div>
          )}

          {/* Preview & Test Tab */}
          {activeTab === 'preview' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <PlayIcon className="w-5 h-5 text-crimson-blue" />
                  Flow Summary
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Flow Name</label>
                      <p className="text-gray-900">{formData.name || 'Untitled Flow'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Type</label>
                      <p className="text-gray-900 capitalize">
                        {formData.type} {formData.type === 'dynamic' && `(${formData.syncPeriod})`}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Target Audience</label>
                      <p className="text-gray-900">{previewCount} people match your criteria</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Triggers</label>
                      <p className="text-gray-900">{formData.triggers.length} triggers configured</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <p className="text-gray-900">{formData.isActive ? 'Will activate immediately' : 'Will remain inactive'}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">🚀 Ready to Launch?</h4>
                  <p className="text-sm text-blue-800">
                    Your flow is configured and ready to go. Click "Save Flow" to create your automated donor journey.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <div className="flex items-center gap-3">
              {flow && onCopy && (
                <Button
                  variant="secondary"
                  onClick={handleCopy}
                  className="flex items-center gap-2"
                >
                  <DocumentDuplicateIcon className="w-4 h-4" />
                  Copy Journey
                </Button>
              )}
              <Button
                onClick={handleSave}
                className="bg-crimson-blue hover:bg-crimson-dark-blue"
              >
                {flow ? 'Update Flow' : 'Save Flow'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Trigger Type Selector Modal */}
      {showTriggerTypeSelector && (
        <TriggerTypeSelector
          onSelect={(type) => {
            addTrigger(type);
            setShowTriggerTypeSelector(false);
          }}
          onClose={() => setShowTriggerTypeSelector(false)}
        />
      )}

      {/* Trigger Configuration Modal */}
      {showTriggerModal && editingTrigger && (
        <TriggerConfigModal
          trigger={editingTrigger}
          onClose={() => {
            setShowTriggerModal(false);
            setEditingTrigger(null);
          }}
          onSave={(trigger) => {
            updateTrigger(trigger);
            setShowTriggerModal(false);
            setEditingTrigger(null);
          }}
        />
      )}
    </div>
  );
};



export default SmartFlowEditor;
