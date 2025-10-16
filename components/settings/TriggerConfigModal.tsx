import React, { useState, useEffect } from 'react';
import { XMarkIcon, CalendarIcon, UserIcon, FlagIcon, ClockIcon, CheckIcon, ArrowRightIcon, CurrencyDollarIcon, ClipboardDocumentListIcon, BoltIcon, PlusIcon } from '../../constants';
import Button from '../ui/Button';
import ActionSelector from './ActionSelector';
import TaskEditSelector from './TaskEditSelector';

interface TriggerConfig {
  id: string;
  type: string;
  name: string;
  config: any;
  conditions?: TriggerCondition[];
}

interface TriggerCondition {
  id: string;
  conditions: ConditionRow[];
  actions: TriggerAction[];
}

interface ConditionRow {
  id: string;
  field: string;
  operator: string;
  value: string;
  logicalOperator?: 'AND' | 'OR'; // Used to connect to the next condition
}

interface TriggerAction {
  id: string;
  type: string;
  config: any;
}

interface TriggerConfigModalProps {
  trigger: TriggerConfig;
  onClose: () => void;
  onSave: (trigger: TriggerConfig) => void;
  availableFlows?: { id: string; name: string; }[];
}

const TriggerConfigModal: React.FC<TriggerConfigModalProps> = ({
  trigger,
  onClose,
  onSave,
  availableFlows = []
}) => {
  const [formData, setFormData] = useState(trigger);
  const [activeTab, setActiveTab] = useState<'basic' | 'conditions' | 'advanced'>('basic');
  const [showActionSelector, setShowActionSelector] = useState(false);
  const [showTaskEditSelector, setShowTaskEditSelector] = useState(false);
  const [triggerActions, setTriggerActions] = useState<string[]>(trigger.config.actions || []);
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [expandedAdvanced, setExpandedAdvanced] = useState<{[key: string]: boolean}>({});

  // Auto-create first condition when switching to If/Then Logic tab
  useEffect(() => {
    if (activeTab === 'conditions' && (!formData.conditions || formData.conditions.length === 0)) {
      addCondition();
    }
  }, [activeTab]);

  // Generate action preview text for compact display
  const getActionPreview = (action: TriggerAction) => {
    const config = action.config || {};
    switch (action.type) {
      case 'add_task':
      case 'add-task':
        return `📋 Create ${config.taskType || 'Task'} for ${config.assignedTo || 'User'}`;
      case 'schedule_event':
      case 'schedule-event':
        return `📅 Schedule ${config.eventType || 'Event'}: ${config.title || 'Untitled'}`;
      case 'send_to_dialr':
      case 'send-to-dialr':
        return `📞 Send to DialR: ${config.campaign || 'Campaign'}`;
      case 'send_to_targetpath':
      case 'send-to-targetpath':
        return `📮 Send to TargetPath: ${config.campaign || 'Mail Campaign'}`;
      case 'add_flag':
      case 'add-flag':
        return `🏁 Add Flag: ${config.flagType || 'Flag'}`;
      case 'create_smart_segment':
      case 'create-smart-segment':
        return `👥 ${config.segmentAction === 'remove' ? 'Remove from' : 'Add to'} ${config.segment || 'Segment'}`;
      case 'change_task_type':
      case 'change-task-type':
        return `🔄 Change Task Type to ${config.newTaskType || 'Type'}`;
      case 'reschedule_task':
      case 'reschedule-task':
        return `📅 Reschedule Task to ${config.newAssignee || 'User'}`;
      case 'complete_task':
      case 'complete-task':
        return `✅ Complete Task`;
      default:
        return `⚡ ${action.type.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`;
    }
  };

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'gift':
        return <CurrencyDollarIcon className="w-6 h-6" />;
      case 'pledge':
        return <ClipboardDocumentListIcon className="w-6 h-6" />;
      case 'action':
        return <BoltIcon className="w-6 h-6" />;
      case 'task':
        return <span className="text-2xl">📋</span>;
      case 'segment':
        return <span className="text-2xl">👥</span>;
      case 'flag':
        return <span className="text-2xl">🏁</span>;
      case 'dialr':
        return <span className="text-2xl">📞</span>;
      case 'mailchimp':
        return <span className="text-2xl">📧</span>;
      case 'selected_audience':
        return <span className="text-2xl">👥</span>;
      case 'apply_smart_tag':
        return <span className="text-2xl">🏷️</span>;
      default:
        return <span className="text-2xl">⚡</span>;
    }
  };

  const getTriggerTitle = (type: string) => {
    switch (type) {
      case 'gift': return 'Gift Trigger';
      case 'pledge': return 'Pledge Trigger';
      case 'action': return 'Action Trigger';
      case 'task': return 'Task';
      case 'segment': return 'Smart Segment';
      case 'flag': return 'Flag';
      case 'dialr': return 'DialR Campaign';
      case 'mailchimp': return 'MailChimp';
      case 'selected_audience': return 'Selected Audience';
      case 'apply_smart_tag': return 'Apply Smart Tag';
      default: return 'Trigger';
    }
  };

  const handleSave = () => {
    const updatedFormData = {
      ...formData,
      config: {
        ...formData.config,
        actions: triggerActions
      }
    };
    onSave(updatedFormData);
  };

  const updateConfig = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      config: { ...prev.config, [key]: value }
    }));
  };

  const addCondition = () => {
    // Smart defaults based on trigger type
    const getSmartDefaults = () => {
      switch (trigger.type) {
        case 'task':
          return { field: 'Task Type', operator: 'equals', value: 'Meeting' };
        case 'gift':
          return { field: 'Gift Amount', operator: 'greater_than', value: '100' };
        case 'pledge':
          return { field: 'Pledge Amount', operator: 'greater_than', value: '500' };
        case 'action':
          return { field: 'Action Type', operator: 'equals', value: 'Call' };
        default:
          return { field: '', operator: 'equals', value: '' };
      }
    };

    const defaults = getSmartDefaults();
    const newCondition: TriggerCondition = {
      id: Date.now().toString(),
      conditions: [{
        id: Date.now().toString() + '_row',
        field: defaults.field,
        operator: defaults.operator,
        value: defaults.value
      }],
      actions: []
    };

    setFormData(prev => ({
      ...prev,
      conditions: [...(prev.conditions || []), newCondition]
    }));
  };

  const addConditionRow = (conditionId: string) => {
    const newRow: ConditionRow = {
      id: Date.now().toString(),
      field: '',
      operator: 'equals',
      value: '',
      logicalOperator: 'AND'
    };

    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions?.map(condition =>
        condition.id === conditionId
          ? { ...condition, conditions: [...condition.conditions, newRow] }
          : condition
      ) || []
    }));
  };

  const removeConditionRow = (conditionId: string, rowId: string) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions?.map(condition =>
        condition.id === conditionId
          ? { ...condition, conditions: condition.conditions.filter(row => row.id !== rowId) }
          : condition
      ) || []
    }));
  };

  const updateConditionRow = (conditionId: string, rowId: string, updates: Partial<ConditionRow>) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions?.map(condition =>
        condition.id === conditionId
          ? {
              ...condition,
              conditions: condition.conditions.map(row =>
                row.id === rowId ? { ...row, ...updates } : row
              )
            }
          : condition
      ) || []
    }));
  };

  const addActionToCondition = (conditionId: string, actionType: string) => {
    const newAction: TriggerAction = {
      id: Date.now().toString(),
      type: actionType,
      config: {}
    };

    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions?.map(condition =>
        condition.id === conditionId
          ? { ...condition, actions: [...condition.actions, newAction] }
          : condition
      ) || []
    }));
  };

  const removeActionFromCondition = (conditionId: string, actionId: string) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions?.map(condition =>
        condition.id === conditionId
          ? { ...condition, actions: condition.actions.filter(action => action.id !== actionId) }
          : condition
      ) || []
    }));
  };

  const updateActionConfig = (conditionId: string, actionId: string, config: any) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions?.map(condition =>
        condition.id === conditionId
          ? {
              ...condition,
              actions: condition.actions.map(action =>
                action.id === actionId ? { ...action, config: { ...action.config, ...config } } : action
              )
            }
          : condition
      ) || []
    }));
  };

  const renderActionConfig = (action: TriggerAction, conditionId: string) => {
    const updateConfig = (updates: any) => updateActionConfig(conditionId, action.id, updates);

    switch (action.type) {
      case 'add_task':
      case 'add-task':
        return (
          <div className="space-y-4 mt-3 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-2 mb-3">
              <ClipboardDocumentListIcon className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-gray-900">Task Configuration</h4>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Task Type *</label>
                <select
                  value={action.config.taskType || ''}
                  onChange={(e) => updateConfig({ taskType: e.target.value })}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
                >
                  <option value="">Select task type...</option>
                  <option value="meeting">Meeting</option>
                  <option value="call">Call</option>
                  <option value="todo">To Do</option>
                  <option value="senator_call">Senator Call</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={action.config.priority || 'medium'}
                  onChange={(e) => updateConfig({ priority: e.target.value })}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Subject *</label>
              <input
                type="text"
                value={action.config.subject || ''}
                onChange={(e) => updateConfig({ subject: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
                placeholder="e.g., Follow up with major donor"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Assigned To *</label>
                <select
                  value={action.config.assignedTo || ''}
                  onChange={(e) => updateConfig({ assignedTo: e.target.value })}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
                >
                  <option value="">Select user...</option>
                  <option value="joseph_banks">Joseph Banks</option>
                  <option value="sofia_borden">Sofia Borden</option>
                  <option value="george_washington">George Washington</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={action.config.dueDate || ''}
                  onChange={(e) => updateConfig({ dueDate: e.target.value })}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Pledge Amount</label>
                <div className="relative">
                  <span className="absolute left-2 top-1 text-sm text-gray-500">$</span>
                  <input
                    type="number"
                    value={action.config.pledgeAmount || ''}
                    onChange={(e) => updateConfig({ pledgeAmount: e.target.value })}
                    className="w-full pl-6 pr-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Pledge Date</label>
                <input
                  type="date"
                  value={action.config.pledgeDate || ''}
                  onChange={(e) => updateConfig({ pledgeDate: e.target.value })}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={action.config.notes || ''}
                onChange={(e) => updateConfig({ notes: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
                rows={3}
                placeholder="Additional task details..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Attachment</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <ClipboardDocumentListIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-crimson-blue cursor-pointer hover:underline">
                      Choose file
                    </span>
                    <span> or drag and drop</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    PDF, DOC, DOCX, XLS, XLSX up to 10MB
                  </div>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      updateConfig({ attachment: file.name });
                    }
                  }}
                />
              </div>
              {action.config.attachment && (
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <ClipboardDocumentListIcon className="w-4 h-4" />
                  <span>{action.config.attachment}</span>
                  <button
                    onClick={() => updateConfig({ attachment: null })}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Advanced Settings */}
            <div className="border-t border-gray-200 pt-4">
              <button
                onClick={() => setExpandedAdvanced(prev => ({
                  ...prev,
                  [action.id]: !prev[action.id]
                }))}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-crimson-blue transition-colors"
              >
                <span className={`transform transition-transform ${expandedAdvanced[action.id] ? 'rotate-90' : ''}`}>
                  ▶
                </span>
                ⚙️ Advanced Settings
              </button>

              {expandedAdvanced[action.id] && (
                <div className="mt-3 space-y-3 p-3 bg-gray-50 rounded-lg border">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Execution Delay</label>
                      <select
                        value={action.config.executionDelay || 'immediate'}
                        onChange={(e) => updateConfig({ executionDelay: e.target.value })}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
                      >
                        <option value="immediate">Immediate</option>
                        <option value="5_minutes">5 Minutes</option>
                        <option value="1_hour">1 Hour</option>
                        <option value="1_day">1 Day</option>
                        <option value="1_week">1 Week</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Retry Logic</label>
                      <select
                        value={action.config.retryLogic || 'none'}
                        onChange={(e) => updateConfig({ retryLogic: e.target.value })}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
                      >
                        <option value="none">No Retry</option>
                        <option value="once">Retry Once</option>
                        <option value="twice">Retry Twice</option>
                        <option value="three_times">Retry 3 Times</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={action.config.sendNotification || false}
                        onChange={(e) => updateConfig({ sendNotification: e.target.checked })}
                        className="rounded border-gray-300 text-crimson-blue focus:ring-crimson-blue"
                      />
                      Send notification when task is created
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'schedule_event':
      case 'schedule-event':
        return (
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Event Title</label>
              <input
                type="text"
                value={action.config.title || ''}
                onChange={(e) => updateConfig({ title: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
                placeholder="e.g., Donor meeting"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Event Type</label>
              <select
                value={action.config.eventType || ''}
                onChange={(e) => updateConfig({ eventType: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
              >
                <option value="">Select type...</option>
                <option value="meeting">Meeting</option>
                <option value="call">Phone Call</option>
                <option value="event">Event</option>
                <option value="visit">Site Visit</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Duration</label>
              <select
                value={action.config.duration || '30'}
                onChange={(e) => updateConfig({ duration: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Schedule</label>
              <select
                value={action.config.schedule || ''}
                onChange={(e) => updateConfig({ schedule: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
              >
                <option value="">Select timing...</option>
                <option value="immediate">Immediate</option>
                <option value="1_day">Tomorrow</option>
                <option value="3_days">In 3 Days</option>
                <option value="1_week">Next Week</option>
                <option value="2_weeks">In 2 Weeks</option>
              </select>
            </div>
          </div>
        );

      case 'send_to_dialr':
      case 'send-to-dialr':
        return (
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Campaign</label>
              <select
                value={action.config.campaign || ''}
                onChange={(e) => updateConfig({ campaign: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
              >
                <option value="">Select campaign...</option>
                <option value="thank_you_calls">Thank You Calls</option>
                <option value="follow_up_calls">Follow Up Calls</option>
                <option value="major_gift_calls">Major Gift Calls</option>
                <option value="lapsed_donor_calls">Lapsed Donor Calls</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Assigned User</label>
              <select
                value={action.config.assignedUser || ''}
                onChange={(e) => updateConfig({ assignedUser: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
              >
                <option value="">Select user...</option>
                <option value="current_user">Current User</option>
                <option value="team_lead">Team Lead</option>
                <option value="call_center">Call Center</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Call Script Notes</label>
              <textarea
                value={action.config.scriptNotes || ''}
                onChange={(e) => updateConfig({ scriptNotes: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
                placeholder="Special notes for the call script..."
                rows={2}
              />
            </div>
          </div>
        );

      case 'send_to_targetpath':
      case 'send-to-targetpath':
        return (
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Mail Campaign</label>
              <select
                value={action.config.campaign || ''}
                onChange={(e) => updateConfig({ campaign: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
              >
                <option value="">Select campaign...</option>
                <option value="thank_you_letters">Thank You Letters</option>
                <option value="follow_up_mailers">Follow Up Mailers</option>
                <option value="major_gift_packets">Major Gift Packets</option>
                <option value="stewardship_reports">Stewardship Reports</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Mail Type</label>
              <select
                value={action.config.mailType || ''}
                onChange={(e) => updateConfig({ mailType: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
              >
                <option value="">Select type...</option>
                <option value="letter">Letter</option>
                <option value="postcard">Postcard</option>
                <option value="package">Package</option>
                <option value="brochure">Brochure</option>
              </select>
            </div>
          </div>
        );

      case 'add_flag':
      case 'add-flag':
        return (
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Flag Type</label>
              <select
                value={action.config.flagType || ''}
                onChange={(e) => updateConfig({ flagType: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
              >
                <option value="">Select flag...</option>
                <option value="major_donor">Major Donor</option>
                <option value="board_member">Board Member</option>
                <option value="volunteer">Volunteer</option>
                <option value="vip">VIP</option>
                <option value="do_not_call">Do Not Call</option>
                <option value="do_not_mail">Do Not Mail</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Flag Notes</label>
              <input
                type="text"
                value={action.config.notes || ''}
                onChange={(e) => updateConfig({ notes: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
                placeholder="Optional notes about this flag"
              />
            </div>
          </div>
        );

      case 'create_smart_segment':
      case 'create-smart-segment':
        return (
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Segment Action</label>
              <select
                value={action.config.segmentAction || 'add'}
                onChange={(e) => updateConfig({ segmentAction: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
              >
                <option value="add">Add to Segment</option>
                <option value="remove">Remove from Segment</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Segment</label>
              <select
                value={action.config.segment || ''}
                onChange={(e) => updateConfig({ segment: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
              >
                <option value="">Select segment...</option>
                <option value="major_donors">Major Donors</option>
                <option value="lapsed_donors">Lapsed Donors</option>
                <option value="new_donors">New Donors</option>
                <option value="monthly_donors">Monthly Donors</option>
                <option value="board_prospects">Board Prospects</option>
              </select>
            </div>
          </div>
        );

      case 'change_task_type':
      case 'change-task-type':
        return (
          <div className="space-y-3 mt-3 p-4 bg-orange-50 rounded-lg border">
            <div className="flex items-center gap-2 mb-3">
              <ClipboardDocumentListIcon className="w-5 h-5 text-orange-600" />
              <h4 className="font-medium text-gray-900">Change Task Type</h4>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">New Task Type *</label>
              <select
                value={action.config.newTaskType || ''}
                onChange={(e) => updateConfig({ newTaskType: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
              >
                <option value="">Select new task type...</option>
                <option value="meeting">Meeting</option>
                <option value="call">Call</option>
                <option value="todo">To Do</option>
                <option value="senator_call">Senator Call</option>
              </select>
            </div>
          </div>
        );

      case 'reschedule_task':
      case 'reschedule-task':
        return (
          <div className="space-y-3 mt-3 p-4 bg-teal-50 rounded-lg border">
            <div className="flex items-center gap-2 mb-3">
              <CalendarIcon className="w-5 h-5 text-teal-600" />
              <h4 className="font-medium text-gray-900">Reschedule Task</h4>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Reassign To *</label>
              <select
                value={action.config.newAssignee || ''}
                onChange={(e) => updateConfig({ newAssignee: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
              >
                <option value="">Select user...</option>
                <option value="joseph_banks">Joseph Banks</option>
                <option value="sofia_borden">Sofia Borden</option>
                <option value="george_washington">George Washington</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">New Due Date</label>
              <input
                type="date"
                value={action.config.newDueDate || ''}
                onChange={(e) => updateConfig({ newDueDate: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
              />
            </div>
          </div>
        );

      case 'complete_task':
      case 'complete-task':
        return (
          <div className="space-y-3 mt-3 p-4 bg-green-50 rounded-lg border">
            <div className="flex items-center gap-2 mb-3">
              <CheckIcon className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-gray-900">Complete Task</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Completion Date</label>
                <input
                  type="date"
                  value={action.config.completionDate || new Date().toISOString().split('T')[0]}
                  onChange={(e) => updateConfig({ completionDate: e.target.value })}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={action.config.markComplete || false}
                    onChange={(e) => updateConfig({ markComplete: e.target.checked })}
                    className="rounded border-gray-300 text-crimson-blue focus:ring-crimson-blue"
                  />
                  Mark as completed
                </label>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Completion Notes</label>
              <textarea
                value={action.config.completionNotes || ''}
                onChange={(e) => updateConfig({ completionNotes: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
                rows={2}
                placeholder="Optional completion notes..."
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="mt-3 p-3 bg-gray-50 rounded border">
            <p className="text-sm text-gray-600">
              Configuration options for {action.type.replace(/_/g, ' ')} will be available here.
            </p>
          </div>
        );
    }
  };



  const removeCondition = (conditionId: string) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions?.filter(c => c.id !== conditionId) || []
    }));
  };

  const renderBasicConfig = () => {
    // Check if any conditions have actions
    const hasActions = formData.conditions?.some(condition => condition.actions && condition.actions.length > 0);

    if (!hasActions) {
      return (
        <div className="text-center py-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-medium text-blue-900 mb-2">🎯 No Actions Configured</h3>
            <p className="text-sm text-blue-800 mb-4">
              Go to the "If/Then Logic" tab to create conditional rules and add actions that will be executed when conditions are met.
            </p>
            <Button
              onClick={() => setActiveTab('conditions')}
              size="sm"
              className="bg-crimson-blue hover:bg-crimson-dark-blue"
            >
              Configure If/Then Logic
            </Button>
          </div>
        </div>
      );
    }

    // Show configuration for the first action found in any condition
    const firstAction = formData.conditions?.find(condition => condition.actions && condition.actions.length > 0)?.actions[0];
    if (!firstAction) return null;

    const actionType = firstAction.type;

    switch (actionType) {
      case 'add_task':
        return (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-green-900 mb-2">📋 Add Task Configuration</h3>
              <p className="text-sm text-green-800">
                Configure the task that will be automatically created when this trigger activates.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Task Subject *</label>
              <input
                type="text"
                value={formData.config.subject || ''}
                onChange={(e) => updateConfig('subject', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                placeholder="e.g., Follow up with new donor"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Task Type</label>
              <select
                value={formData.config.type || 'Meeting'}
                onChange={(e) => updateConfig('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
              >
                <option value="Meeting">Meeting</option>
                <option value="Call">Call</option>
                <option value="Email">Email</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Research">Research</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={formData.config.priority || 'Medium Priority'}
                onChange={(e) => updateConfig('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
              >
                <option value="High Priority">High Priority</option>
                <option value="Medium Priority">Medium Priority</option>
                <option value="Low Priority">Low Priority</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                <select
                  value={formData.config.assignedTo || 'Current User'}
                  onChange={(e) => updateConfig('assignedTo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                >
                  <option value="Current User">Current User</option>
                  <option value="Sofia Amaya">Sofia Amaya</option>
                  <option value="Team Lead">Team Lead</option>
                  <option value="Development Director">Development Director</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due In</label>
                <select
                  value={formData.config.dueIn || '1_day'}
                  onChange={(e) => updateConfig('dueIn', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                >
                  <option value="immediate">Immediately</option>
                  <option value="1_day">1 Day</option>
                  <option value="3_days">3 Days</option>
                  <option value="1_week">1 Week</option>
                  <option value="custom">Custom Date</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={formData.config.notes || ''}
                onChange={(e) => updateConfig('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                placeholder="Additional notes about this task..."
              />
            </div>

          </div>
        );

      case 'schedule_event':
        return (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-red-900 mb-2">📅 Schedule Event Configuration</h3>
              <p className="text-sm text-red-800">
                Configure the event that will be automatically scheduled when this trigger activates.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
              <input
                type="text"
                value={formData.config.eventTitle || ''}
                onChange={(e) => updateConfig('eventTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                placeholder="e.g., Donor Cultivation Meeting"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
              <select
                value={formData.config.eventType || 'Meeting'}
                onChange={(e) => updateConfig('eventType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
              >
                <option value="Meeting">Meeting</option>
                <option value="Call">Phone Call</option>
                <option value="Event">Event</option>
                <option value="Appointment">Appointment</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                <select
                  value={formData.config.duration || '60'}
                  onChange={(e) => updateConfig('duration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                >
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Schedule For</label>
                <select
                  value={formData.config.scheduleFor || '1_week'}
                  onChange={(e) => updateConfig('scheduleFor', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                >
                  <option value="1_day">1 Day from now</option>
                  <option value="3_days">3 Days from now</option>
                  <option value="1_week">1 Week from now</option>
                  <option value="2_weeks">2 Weeks from now</option>
                </select>
              </div>
            </div>

          </div>
        );

      case 'create_smart_segment':
        return (
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-purple-900 mb-2">👥 Smart Segment Configuration</h3>
              <p className="text-sm text-purple-800">
                Configure how donors will be added to or removed from Smart Segments.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
              <select
                value={formData.config.action || 'add'}
                onChange={(e) => updateConfig('action', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
              >
                <option value="add">Add to Existing Segment</option>
                <option value="create">Create New Segment</option>
                <option value="remove">Remove from Segment</option>
              </select>
            </div>

            {formData.config.action === 'add' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Segment</label>
                <select
                  value={formData.config.segmentId || ''}
                  onChange={(e) => updateConfig('segmentId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                >
                  <option value="">Choose a segment...</option>
                  <option value="major-donors">Major Donors ($1000+)</option>
                  <option value="new-donors">New Donors</option>
                  <option value="lapsed-donors">Lapsed Donors</option>
                  <option value="monthly-givers">Monthly Givers</option>
                </select>
              </div>
            )}

            {formData.config.action === 'create' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Segment Name</label>
                <input
                  type="text"
                  value={formData.config.newSegmentName || ''}
                  onChange={(e) => updateConfig('newSegmentName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                  placeholder="e.g., Flow Generated Segment"
                />
              </div>
            )}
          </div>
        );

      case 'add_flag':
        return (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-green-900 mb-2">🏁 Add Flag Configuration</h3>
              <p className="text-sm text-green-800">
                Configure the flag that will be added to donor profiles when this trigger activates.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Flag Name</label>
              <input
                type="text"
                value={formData.config.flagName || ''}
                onChange={(e) => updateConfig('flagName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                placeholder="e.g., New Donor, VIP, Major Gift Prospect"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Flag Color</label>
              <select
                value={formData.config.flagColor || 'green'}
                onChange={(e) => updateConfig('flagColor', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
              >
                <option value="green">Green</option>
                <option value="blue">Blue</option>
                <option value="red">Red</option>
                <option value="yellow">Yellow</option>
                <option value="purple">Purple</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
              <select
                value={formData.config.action || 'add'}
                onChange={(e) => updateConfig('action', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
              >
                <option value="add">Add Flag</option>
                <option value="remove">Remove Flag</option>
              </select>
            </div>
          </div>
        );

      case 'send_to_dialr':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-blue-900 mb-2">📞 DialR Campaign Configuration</h3>
              <p className="text-sm text-blue-800">
                Configure which DialR campaign donors will be added to when this trigger activates.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Campaign</label>
              <select
                value={formData.config.campaign || ''}
                onChange={(e) => updateConfig('campaign', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
              >
                <option value="">Select Campaign...</option>
                <option value="new-donor-welcome">New Donor Welcome Calls</option>
                <option value="lapsed-donor-reconnect">Lapsed Donor Reconnect</option>
                <option value="major-gift-cultivation">Major Gift Cultivation</option>
                <option value="annual-fund-follow-up">Annual Fund Follow-up</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Call Script</label>
              <select
                value={formData.config.script || ''}
                onChange={(e) => updateConfig('script', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
              >
                <option value="">Select Script...</option>
                <option value="welcome-script">Welcome Script</option>
                <option value="thank-you-script">Thank You Script</option>
                <option value="cultivation-script">Cultivation Script</option>
                <option value="follow-up-script">Follow-up Script</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={formData.config.priority || 'normal'}
                onChange={(e) => updateConfig('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
              >
                <option value="high">High Priority</option>
                <option value="normal">Normal Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>
        );

      case 'send_to_mailchimp':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
              <select
                value={formData.config.action || 'add'}
                onChange={(e) => updateConfig('action', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
              >
                <option value="add">Add to List</option>
                <option value="remove">Remove from List</option>
                <option value="tag">Add Tag</option>
                <option value="campaign">Add to Campaign</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">MailChimp List</label>
              <select
                value={formData.config.listId || ''}
                onChange={(e) => updateConfig('listId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
              >
                <option value="">Select List...</option>
                <option value="newsletter">Newsletter Subscribers</option>
                <option value="donors">Donor Communications</option>
                <option value="events">Event Updates</option>
                <option value="major-gifts">Major Gift Prospects</option>
              </select>
            </div>

            {formData.config.action === 'tag' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tag Name</label>
                <input
                  type="text"
                  value={formData.config.tagName || ''}
                  onChange={(e) => updateConfig('tagName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                  placeholder="e.g., New Donor"
                />
              </div>
            )}
          </div>
        );



      default:
        return (
          <div className="text-center py-8">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="font-medium text-gray-900 mb-2">⚙️ Action Configuration</h3>
              <p className="text-sm text-gray-600 mb-4">
                Configuration options for this action type will be available once you select an action in the "If/Then Logic" tab.
              </p>
              <Button
                onClick={() => setActiveTab('conditions')}
                size="sm"
                className="bg-crimson-blue hover:bg-crimson-dark-blue"
              >
                Configure Actions
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-crimson-blue to-crimson-dark-blue text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                {getTriggerIcon(trigger.type)}
              </div>
              <div>
                <h2 className="text-xl font-semibold">Configure {getTriggerTitle(trigger.type)}</h2>
                <p className="text-crimson-accent-blue text-sm">Set up the details for this trigger</p>
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
              { id: 'basic', name: 'Basic Configuration', icon: <CheckIcon className="w-4 h-4" /> },
              { id: 'conditions', name: 'If/Then Logic', icon: <ArrowRightIcon className="w-4 h-4" /> },
              { id: 'advanced', name: 'Advanced Options', icon: <ClockIcon className="w-4 h-4" /> }
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
          {/* Basic Configuration Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trigger Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                  placeholder="Give this trigger a descriptive name"
                />
              </div>

              {renderBasicConfig()}
            </div>
          )}

          {/* If/Then Logic Tab */}
          {activeTab === 'conditions' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">🔀 If/Then Logic</h3>
                <p className="text-sm text-blue-800">
                  Create conditional rules: IF [condition] THEN [actions]. Each condition can have multiple actions.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Conditional Rules</h4>
                {formData.conditions && formData.conditions.length > 0 && (
                  <Button
                    onClick={addCondition}
                    size="sm"
                    className="bg-crimson-blue hover:bg-crimson-dark-blue"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add IF/THEN Rule
                  </Button>
                )}
              </div>

              {formData.conditions && formData.conditions.length > 0 ? (
                <div className="space-y-6">
                  {formData.conditions.map((condition, index) => (
                    <div key={condition.id} className="border-2 border-gray-200 rounded-lg p-4 bg-white">
                      {/* IF Section */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="font-medium text-blue-900 flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-bold">IF</span>
                            Rule {index + 1}
                          </h5>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => addConditionRow(condition.id)}
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <PlusIcon className="w-4 h-4 mr-1" />
                              Add Condition
                            </Button>
                            <Button
                              onClick={() => removeCondition(condition.id)}
                              size="sm"
                              variant="secondary"
                              className="text-red-600 hover:bg-red-50"
                            >
                              Remove Rule
                            </Button>
                          </div>
                        </div>

                        {/* Multiple Condition Rows */}
                        <div className="space-y-3">
                          {condition.conditions.map((row, rowIndex) => (
                            <div key={row.id}>
                              {/* Logical Operator (AND/OR) */}
                              {rowIndex > 0 && (
                                <div className="flex justify-center mb-2">
                                  <select
                                    value={condition.conditions[rowIndex - 1].logicalOperator || 'AND'}
                                    onChange={(e) => updateConditionRow(condition.id, condition.conditions[rowIndex - 1].id, { logicalOperator: e.target.value as 'AND' | 'OR' })}
                                    className="px-3 py-1 text-sm font-medium bg-white border border-gray-300 rounded-full focus:ring-1 focus:ring-crimson-blue"
                                  >
                                    <option value="AND">AND</option>
                                    <option value="OR">OR</option>
                                  </select>
                                </div>
                              )}

                              {/* Condition Row */}
                              <div className="grid grid-cols-4 gap-3 items-end">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Field</label>
                                  <select
                                    value={row.field}
                                    onChange={(e) => updateConditionRow(condition.id, row.id, { field: e.target.value })}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
                                  >
                                    <option value="">Select field...</option>
                                    {trigger.type === 'task' && (
                                      <>
                                        <option value="task_type">Task Type</option>
                                        <option value="task_status">Task Status</option>
                                        <option value="task_priority">Task Priority</option>
                                        <option value="scheduled_for">Scheduled For (Assigned User)</option>
                                        <option value="scheduled_by">Scheduled By (Creator)</option>
                                        <option value="pledge_amount">Pledge Amount</option>
                                        <option value="pledge_due_date">Pledge Due Date</option>
                                        <option value="due_date">Task Due Date</option>
                                        <option value="completion_date">Task Completion Date</option>
                                      </>
                                    )}
                                    {trigger.type === 'gift' && (
                                      <>
                                        <option value="gift_amount">Gift Amount</option>
                                        <option value="gift_type">Gift Type</option>
                                        <option value="gift_fund">Gift Fund</option>
                                      </>
                                    )}
                                    {trigger.type === 'pledge' && (
                                      <>
                                        <option value="pledge_amount">Pledge Amount</option>
                                        <option value="pledge_status">Pledge Status</option>
                                        <option value="payment_status">Payment Status</option>
                                      </>
                                    )}
                                    <option value="segment_membership">Segment Membership</option>
                                    <option value="flag_present">Flag Present</option>
                                    <option value="attribute_value">Attribute Value</option>
                                    <option value="giving_amount">Total Giving Amount</option>
                                    <option value="donor_segment">Donor Segment</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Operator</label>
                                  <select
                                    value={row.operator}
                                    onChange={(e) => updateConditionRow(condition.id, row.id, { operator: e.target.value })}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
                                  >
                                    <option value="equals">Equals</option>
                                    <option value="not_equals">Not Equals</option>
                                    <option value="greater_than">Greater Than</option>
                                    <option value="less_than">Less Than</option>
                                    <option value="greater_equal">Greater Than or Equal</option>
                                    <option value="less_equal">Less Than or Equal</option>
                                    <option value="contains">Contains</option>
                                    <option value="not_contains">Does Not Contain</option>
                                    <option value="exists">Exists</option>
                                    <option value="not_exists">Does Not Exist</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Value</label>
                                  {/* Task Type Field */}
                                  {row.field === 'task_type' && (
                                    <select
                                      value={row.value}
                                      onChange={(e) => updateConditionRow(condition.id, row.id, { value: e.target.value })}
                                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
                                    >
                                      <option value="">Select task type...</option>
                                      <option value="meeting">Meeting</option>
                                      <option value="call">Call</option>
                                      <option value="todo">To Do</option>
                                      <option value="senator_call">Senator Call</option>
                                    </select>
                                  )}

                                  {/* Scheduled For/By Fields */}
                                  {(row.field === 'scheduled_for' || row.field === 'scheduled_by') && (
                                    <select
                                      value={row.value}
                                      onChange={(e) => updateConditionRow(condition.id, row.id, { value: e.target.value })}
                                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
                                    >
                                      <option value="">Select user...</option>
                                      <option value="joseph_banks">Joseph Banks</option>
                                      <option value="sofia_borden">Sofia Borden</option>
                                      <option value="george_washington">George Washington</option>
                                    </select>
                                  )}

                                  {/* Pledge Amount Field */}
                                  {row.field === 'pledge_amount' && (
                                    <div className="relative">
                                      <span className="absolute left-2 top-1 text-sm text-gray-500">$</span>
                                      <input
                                        type="number"
                                        value={row.value}
                                        onChange={(e) => updateConditionRow(condition.id, row.id, { value: e.target.value })}
                                        className="w-full pl-6 pr-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                      />
                                    </div>
                                  )}

                                  {/* Date Fields */}
                                  {(row.field === 'pledge_due_date' || row.field === 'due_date' || row.field === 'completion_date') && (
                                    <input
                                      type="date"
                                      value={row.value}
                                      onChange={(e) => updateConditionRow(condition.id, row.id, { value: e.target.value })}
                                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
                                    />
                                  )}

                                  {/* Task Status Field */}
                                  {row.field === 'task_status' && (
                                    <select
                                      value={row.value}
                                      onChange={(e) => updateConditionRow(condition.id, row.id, { value: e.target.value })}
                                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
                                    >
                                      <option value="">Select status...</option>
                                      <option value="pending">Pending</option>
                                      <option value="in_progress">In Progress</option>
                                      <option value="completed">Completed</option>
                                      <option value="cancelled">Cancelled</option>
                                      <option value="need_thank_you">Need Thank You</option>
                                    </select>
                                  )}

                                  {/* Task Priority Field */}
                                  {row.field === 'task_priority' && (
                                    <select
                                      value={row.value}
                                      onChange={(e) => updateConditionRow(condition.id, row.id, { value: e.target.value })}
                                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
                                    >
                                      <option value="">Select priority...</option>
                                      <option value="low">Low</option>
                                      <option value="medium">Medium</option>
                                      <option value="high">High</option>
                                    </select>
                                  )}

                                  {/* Default Text Input for other fields */}
                                  {!['task_type', 'scheduled_for', 'scheduled_by', 'pledge_amount', 'pledge_due_date', 'due_date', 'completion_date', 'task_status', 'task_priority'].includes(row.field) && (
                                    <input
                                      type="text"
                                      value={row.value}
                                      onChange={(e) => updateConditionRow(condition.id, row.id, { value: e.target.value })}
                                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-crimson-blue"
                                      placeholder="Enter value..."
                                    />
                                  )}
                                </div>

                                <div>
                                  {condition.conditions.length > 1 && (
                                    <Button
                                      onClick={() => removeConditionRow(condition.id, row.id)}
                                      size="sm"
                                      variant="secondary"
                                      className="text-red-600 hover:bg-red-50"
                                    >
                                      Remove
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* THEN Section */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h6 className="font-medium text-green-900 flex items-center gap-2">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-bold">THEN</span>
                            Actions
                          </h6>
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => {
                                setSelectedAction(condition.id);
                                setShowActionSelector(true);
                              }}
                              size="sm"
                              className="bg-crimson-blue hover:bg-crimson-dark-blue"
                            >
                              <PlusIcon className="w-4 h-4 mr-1" />
                              Add Action
                            </Button>
                            {trigger.type === 'task' && (
                              <Button
                                onClick={() => {
                                  setSelectedAction(condition.id);
                                  setShowTaskEditSelector(true);
                                }}
                                size="sm"
                                className="bg-crimson-blue hover:bg-crimson-dark-blue"
                              >
                                <ClipboardDocumentListIcon className="w-4 h-4 mr-1" />
                                Edit Task
                              </Button>
                            )}
                          </div>
                        </div>

                        {condition.actions && condition.actions.length > 0 ? (
                          <div className="space-y-4">
                            {condition.actions.map((action, actionIndex) => (
                              <div key={action.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:border-crimson-blue hover:bg-crimson-blue hover:bg-opacity-5 transition-all duration-200 cursor-pointer group">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold group-hover:scale-110 transition-transform">
                                      {actionIndex + 1}
                                    </span>
                                    <div className="flex-1">
                                      <div className="font-medium text-gray-900 group-hover:text-crimson-blue transition-colors">
                                        {getActionPreview(action)}
                                      </div>
                                      <div className="text-xs text-gray-500 mt-1">
                                        Click to edit configuration
                                      </div>
                                    </div>
                                  </div>
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeActionFromCondition(condition.id, action.id);
                                    }}
                                    size="sm"
                                    variant="secondary"
                                    className="text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    Remove
                                  </Button>
                                </div>

                                {/* Inline Action Configuration */}
                                {renderActionConfig(action, condition.id)}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-gray-500">
                            <p className="text-sm">No actions configured for this condition</p>
                            <p className="text-xs mt-1">Click "Add Action" to configure what happens when this condition is met</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className="font-medium text-gray-900 mb-2">🚀 Ready to Create Your First Rule</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Let's set up your first IF/THEN rule to get started with Smart Flow automation.
                    </p>
                    <Button
                      onClick={addCondition}
                      size="sm"
                      className="bg-crimson-blue hover:bg-crimson-dark-blue"
                    >
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Create First IF/THEN Rule
                    </Button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Advanced Options Tab */}
          {activeTab === 'advanced' && (
            <div className="space-y-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">🎛️ Advanced Options</h3>
                <p className="text-sm text-gray-600">
                  Configure advanced settings for this trigger including delays, retries, and error handling.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Execution Delay</label>
                  <select
                    value={formData.config.delay || 'immediate'}
                    onChange={(e) => updateConfig('delay', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                  >
                    <option value="immediate">Immediate</option>
                    <option value="1_hour">1 Hour</option>
                    <option value="1_day">1 Day</option>
                    <option value="3_days">3 Days</option>
                    <option value="1_week">1 Week</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Retry on Failure</label>
                  <select
                    value={formData.config.retries || '0'}
                    onChange={(e) => updateConfig('retries', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                  >
                    <option value="0">No Retries</option>
                    <option value="1">1 Retry</option>
                    <option value="2">2 Retries</option>
                    <option value="3">3 Retries</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="skipWeekends"
                  checked={formData.config.skipWeekends || false}
                  onChange={(e) => updateConfig('skipWeekends', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="skipWeekends" className="text-sm text-gray-700">
                  Skip execution on weekends
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="logExecution"
                  checked={formData.config.logExecution !== false}
                  onChange={(e) => updateConfig('logExecution', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="logExecution" className="text-sm text-gray-700">
                  Log execution details for reporting
                </label>
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
              <Button
                onClick={handleSave}
                className="bg-crimson-blue hover:bg-crimson-dark-blue"
              >
                <CheckIcon className="w-4 h-4 mr-2" />
                Save Trigger
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Selector Modal */}
      {showActionSelector && selectedAction && (
        <ActionSelector
          onSelect={(actionType) => {
            addActionToCondition(selectedAction, actionType);
            setShowActionSelector(false);
            setSelectedAction('');
          }}
          onClose={() => {
            setShowActionSelector(false);
            setSelectedAction('');
          }}
        />
      )}

      {showTaskEditSelector && (
        <TaskEditSelector
          onSelect={(editType) => {
            addActionToCondition(selectedAction, editType);
            setShowTaskEditSelector(false);
            setSelectedAction('');
          }}
          onClose={() => {
            setShowTaskEditSelector(false);
            setSelectedAction('');
          }}
        />
      )}
    </div>
  );
};

export default TriggerConfigModal;
