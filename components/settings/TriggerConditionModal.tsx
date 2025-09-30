import React, { useState } from 'react';
import { XMarkIcon, CurrencyDollarIcon, ClipboardDocumentListIcon, BoltIcon } from '../../constants';
import Button from '../ui/Button';

interface TriggerConditionConfig {
  type: string;
  config: any;
}

interface TriggerConditionModalProps {
  triggerType: string;
  onClose: () => void;
  onSave: (conditionConfig: TriggerConditionConfig) => void;
}

const TriggerConditionModal: React.FC<TriggerConditionModalProps> = ({
  triggerType,
  onClose,
  onSave
}) => {
  const [conditionConfig, setConditionConfig] = useState<any>({});

  const updateConfig = (key: string, value: any) => {
    setConditionConfig((prev: any) => ({ ...prev, [key]: value }));
  };

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'gift':
        return <CurrencyDollarIcon className="w-6 h-6" />;
      case 'pledge':
        return <ClipboardDocumentListIcon className="w-6 h-6" />;
      case 'action':
        return <BoltIcon className="w-6 h-6" />;
      default:
        return <span className="text-2xl">⚡</span>;
    }
  };

  const getTriggerTitle = (type: string) => {
    switch (type) {
      case 'gift': return 'Gift Trigger';
      case 'pledge': return 'Pledge Trigger';
      case 'action': return 'Action Trigger';
      case 'task': return 'Task Trigger';
      case 'flag': return 'Flag Trigger';
      case 'keyword': return 'Keyword Trigger';
      case 'attribute': return 'Attribute Trigger';
      default: return 'Trigger';
    }
  };

  const handleSave = () => {
    onSave({
      type: triggerType,
      config: conditionConfig
    });
  };

  const renderConditionConfig = () => {
    switch (triggerType) {
      case 'gift':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gift Amount Condition</label>
              <select
                value={conditionConfig.amountCondition || 'greater_than'}
                onChange={(e) => updateConfig('amountCondition', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
              >
                <option value="greater_than">Greater than</option>
                <option value="less_than">Less than</option>
                <option value="equal_to">Equal to</option>
                <option value="between">Between</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($)</label>
              <input
                type="number"
                value={conditionConfig.amount || ''}
                onChange={(e) => updateConfig('amount', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                placeholder="e.g., 100"
                min="0"
                step="0.01"
              />
            </div>

            {conditionConfig.amountCondition === 'between' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Amount ($)</label>
                <input
                  type="number"
                  value={conditionConfig.maxAmount || ''}
                  onChange={(e) => updateConfig('maxAmount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                  placeholder="e.g., 500"
                  min="0"
                  step="0.01"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gift Type</label>
              <select
                value={conditionConfig.giftType || 'any'}
                onChange={(e) => updateConfig('giftType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
              >
                <option value="any">Any Gift</option>
                <option value="first_time">First-time Gift</option>
                <option value="recurring">Recurring Gift</option>
                <option value="major_gift">Major Gift</option>
                <option value="planned_gift">Planned Gift</option>
              </select>
            </div>
          </div>
        );

      case 'pledge':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pledge Amount ($)</label>
              <input
                type="number"
                value={conditionConfig.pledgeAmount || ''}
                onChange={(e) => updateConfig('pledgeAmount', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                placeholder="e.g., 1000"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Schedule</label>
              <select
                value={conditionConfig.paymentSchedule || 'monthly'}
                onChange={(e) => updateConfig('paymentSchedule', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
                <option value="one_time">One-time</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trigger Condition</label>
              <select
                value={conditionConfig.condition || 'pledge_made'}
                onChange={(e) => updateConfig('condition', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
              >
                <option value="pledge_made">When pledge is made</option>
                <option value="payment_due">When payment is due</option>
                <option value="payment_missed">When payment is missed</option>
                <option value="pledge_completed">When pledge is completed</option>
              </select>
            </div>
          </div>
        );

      case 'action':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Action Type</label>
              <select
                value={conditionConfig.actionType || 'custom'}
                onChange={(e) => updateConfig('actionType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
              >
                <option value="custom">Custom Action</option>
                <option value="meeting_completed">Meeting Completed</option>
                <option value="call_completed">Call Completed</option>
                <option value="email_sent">Email Sent</option>
                <option value="task_completed">Task Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Action Description</label>
              <textarea
                value={conditionConfig.description || ''}
                onChange={(e) => updateConfig('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                placeholder="Describe what action should trigger this flow..."
                rows={3}
              />
            </div>
          </div>
        );

      case 'task':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Task Event</label>
              <select
                value={conditionConfig.taskEvent || 'created'}
                onChange={(e) => updateConfig('taskEvent', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
              >
                <option value="created">Task Created</option>
                <option value="completed">Task Completed</option>
                <option value="overdue">Task Overdue</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Task Type Filter (Optional)</label>
              <select
                value={conditionConfig.taskTypeFilter || 'any'}
                onChange={(e) => updateConfig('taskTypeFilter', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
              >
                <option value="any">Any Task Type</option>
                <option value="Meeting">Meeting</option>
                <option value="Call">Call</option>
                <option value="Email">Email</option>
                <option value="Follow-up">Follow-up</option>
              </select>
            </div>
          </div>
        );

      case 'flag':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Flag Event</label>
              <select
                value={conditionConfig.flagEvent || 'added'}
                onChange={(e) => updateConfig('flagEvent', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
              >
                <option value="added">Flag Added</option>
                <option value="removed">Flag Removed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specific Flag (Optional)</label>
              <input
                type="text"
                value={conditionConfig.specificFlag || ''}
                onChange={(e) => updateConfig('specificFlag', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                placeholder="e.g., Major Donor, New Donor (leave blank for any flag)"
              />
            </div>
          </div>
        );

      case 'keyword':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Keyword Event</label>
              <select
                value={conditionConfig.keywordEvent || 'added'}
                onChange={(e) => updateConfig('keywordEvent', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
              >
                <option value="added">Keyword Added</option>
                <option value="removed">Keyword Removed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specific Keyword (Optional)</label>
              <input
                type="text"
                value={conditionConfig.specificKeyword || ''}
                onChange={(e) => updateConfig('specificKeyword', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                placeholder="e.g., VIP, Board Member (leave blank for any keyword)"
              />
            </div>
          </div>
        );

      case 'attribute':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Attribute Field</label>
              <input
                type="text"
                value={conditionConfig.attributeField || ''}
                onChange={(e) => updateConfig('attributeField', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                placeholder="e.g., donor_status, wealth_rating"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Change Type</label>
              <select
                value={conditionConfig.changeType || 'updated'}
                onChange={(e) => updateConfig('changeType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
              >
                <option value="updated">Field Updated</option>
                <option value="equals">Field Equals Value</option>
                <option value="changed_to">Field Changed To Value</option>
              </select>
            </div>

            {(conditionConfig.changeType === 'equals' || conditionConfig.changeType === 'changed_to') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Value</label>
                <input
                  type="text"
                  value={conditionConfig.targetValue || ''}
                  onChange={(e) => updateConfig('targetValue', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                  placeholder="e.g., active, lapsed, A+"
                />
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <p>Configuration options for {triggerType} will be implemented here.</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-crimson-blue to-crimson-dark-blue text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                {getTriggerIcon(triggerType)}
              </div>
              <div>
                <h2 className="text-xl font-semibold">Configure {getTriggerTitle(triggerType)}</h2>
                <p className="text-crimson-accent-blue text-sm">Set up when this trigger should activate</p>
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

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">⚡ Trigger Condition</h3>
              <p className="text-sm text-blue-800">
                Configure when this trigger should activate. This will determine what event starts your flow.
              </p>
            </div>

            {renderConditionConfig()}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-crimson-blue hover:bg-crimson-dark-blue"
            >
              Continue to Actions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TriggerConditionModal;
