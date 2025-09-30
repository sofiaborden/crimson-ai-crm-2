import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, ArrowRightIcon, CheckIcon, XMarkIcon, CurrencyDollarIcon, ClipboardDocumentListIcon, BoltIcon } from '../../constants';
import Button from '../ui/Button';
import TriggerTypeSelector from './TriggerTypeSelector';

interface FlowTrigger {
  id: string;
  type: string;
  name: string;
  config: any;
  conditions?: FlowCondition[];
  position: { x: number; y: number };
  status?: 'active' | 'inactive' | 'error';
}

interface FlowCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
  action: 'continue' | 'branch' | 'end';
  branchTo?: string;
}

interface FlowVisualBuilderProps {
  triggers: FlowTrigger[];
  onTriggerEdit: (trigger: FlowTrigger) => void;
  onTriggerDelete: (triggerId: string) => void;
  onTriggerDuplicate: (trigger: FlowTrigger) => void;
  onAddTrigger: (type: string) => void;
  isReadOnly?: boolean;
  audienceFilters?: Array<{type: string, value: string, label: string}>;
  estimatedAudienceSize?: string;
}

const FlowVisualBuilder: React.FC<FlowVisualBuilderProps> = ({
  triggers,
  onTriggerEdit,
  onTriggerDelete,
  onTriggerDuplicate,
  onAddTrigger,
  isReadOnly = false,
  audienceFilters = [],
  estimatedAudienceSize = '0'
}) => {
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);
  const [showTriggerTypeSelector, setShowTriggerTypeSelector] = useState(false);

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'gift':
        return <CurrencyDollarIcon className="w-5 h-5" />;
      case 'pledge':
        return <ClipboardDocumentListIcon className="w-5 h-5" />;
      case 'action':
        return <BoltIcon className="w-5 h-5" />;
      case 'task':
        return <span className="text-lg">📋</span>;
      case 'segment':
        return <span className="text-lg">👥</span>;
      case 'flag':
        return <span className="text-lg">🏁</span>;
      case 'keyword':
        return <span className="text-lg">🏷️</span>;
      case 'attribute':
        return <span className="text-lg">📊</span>;
      case 'note':
        return <span className="text-lg">📝</span>;
      case 'event':
        return <span className="text-lg">📅</span>;
      case 'dialr':
        return <span className="text-lg">📞</span>;
      case 'targetpath':
        return <span className="text-lg">🎯</span>;
      case 'mailchimp':
        return <span className="text-lg">📧</span>;
      case 'constantcontact':
        return <span className="text-lg">✉️</span>;
      default:
        return <BoltIcon className="w-5 h-5" />;
    }
  };

  const getTriggerColor = (type: string) => {
    switch (type) {
      case 'gift': return 'bg-green-100 border-green-300 text-green-800';
      case 'pledge': return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'action': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'task': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'segment': return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'flag': return 'bg-green-100 border-green-300 text-green-800';
      case 'keyword': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'attribute': return 'bg-indigo-100 border-indigo-300 text-indigo-800';
      case 'note': return 'bg-gray-100 border-gray-300 text-gray-800';
      case 'event': return 'bg-red-100 border-red-300 text-red-800';
      case 'dialr': return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'targetpath': return 'bg-teal-100 border-teal-300 text-teal-800';
      case 'mailchimp': return 'bg-pink-100 border-pink-300 text-pink-800';
      case 'constantcontact': return 'bg-cyan-100 border-cyan-300 text-cyan-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getStatusIndicator = (status?: string) => {
    switch (status) {
      case 'active':
        return <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>;
      case 'error':
        return <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>;
      case 'inactive':
        return <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-400 rounded-full border-2 border-white"></div>;
      default:
        return null;
    }
  };

  const renderStartNode = () => (
    <div className="flex flex-col items-center">
      <div className="bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
        <div className="text-center">
          <div className="text-2xl">🚀</div>
          <div className="text-xs font-medium">Start</div>
        </div>
      </div>
      <div className="mt-2 text-sm font-medium text-gray-700">Flow Entry</div>
      <div className="text-xs text-gray-500">People enter here</div>
    </div>
  );

  const renderTriggerNode = (trigger: FlowTrigger, index: number) => {
    const isSelected = selectedTrigger === trigger.id;
    const hasConditions = trigger.conditions && trigger.conditions.length > 0;
    const conditionCount = trigger.conditions?.length || 0;
    const actionCount = trigger.conditions?.reduce((total, condition) =>
      total + (condition.actions?.length || 0), 0) || 0;

    // Handle legacy config.actions format
    const legacyActionCount = trigger.config?.actions?.length || 0;
    const totalActionCount = actionCount || legacyActionCount;
    
    return (
      <div key={trigger.id} className="flex flex-col items-center">
        <div
          className={`relative bg-white border-2 rounded-xl p-4 shadow-lg cursor-pointer transition-all duration-200 hover:shadow-xl min-w-[200px] group ${
            isSelected ? 'border-crimson-blue ring-2 ring-crimson-blue ring-opacity-50' : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setSelectedTrigger(isSelected ? null : trigger.id)}
        >
          {getStatusIndicator(trigger.status)}

          {/* Action Buttons - Show on hover */}
          {!isReadOnly && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTriggerEdit(trigger);
                }}
                className="w-6 h-6 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full flex items-center justify-center text-xs transition-colors"
                title="Edit Trigger"
              >
                ✏️
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTriggerDuplicate(trigger);
                }}
                className="w-6 h-6 bg-green-100 hover:bg-green-200 text-green-600 rounded-full flex items-center justify-center text-xs transition-colors"
                title="Copy Trigger"
              >
                📋
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTriggerDelete(trigger.id);
                }}
                className="w-6 h-6 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center text-xs transition-colors"
                title="Delete Trigger"
              >
                🗑️
              </button>
            </div>
          )}

          {/* Trigger Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTriggerColor(trigger.type)}`}>
              {getTriggerIcon(trigger.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate">{trigger.name}</h4>
              <p className="text-xs text-gray-500 capitalize">{trigger.type}</p>
            </div>
          </div>

          {/* Trigger Details */}
          <div className="space-y-2 text-sm">
            {trigger.type === 'task' && trigger.config?.subject && (
              <div className="text-gray-600">
                <span className="font-medium">Subject:</span> {trigger.config.subject}
              </div>
            )}
            {trigger.type === 'segment' && trigger.config?.segmentId && (
              <div className="text-gray-600">
                <span className="font-medium">Segment:</span> {trigger.config.segmentId}
              </div>
            )}
            {trigger.type === 'flag' && trigger.config?.flagName && (
              <div className="text-gray-600">
                <span className="font-medium">Flag:</span> {trigger.config.flagName}
              </div>
            )}
            {trigger.type === 'dialr' && trigger.config?.campaign && (
              <div className="text-gray-600">
                <span className="font-medium">Campaign:</span> {trigger.config.campaign}
              </div>
            )}
            {trigger.type === 'mailchimp' && trigger.config?.listId && (
              <div className="text-gray-600">
                <span className="font-medium">List:</span> {trigger.config.listId}
              </div>
            )}
            {trigger.type === 'gift' && trigger.config?.amount && (
              <div className="text-gray-600">
                <span className="font-medium">Amount:</span> ${trigger.config.amount}
              </div>
            )}
            {trigger.type === 'pledge' && trigger.config?.amount && (
              <div className="text-gray-600">
                <span className="font-medium">Amount:</span> ${trigger.config.amount}
              </div>
            )}
            {trigger.type === 'action' && trigger.config?.actionType && (
              <div className="text-gray-600">
                <span className="font-medium">Action:</span> {trigger.config.actionType}
              </div>
            )}

            {/* Show configured actions for legacy triggers */}
            {trigger.config?.actions && trigger.config.actions.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-xs font-medium text-gray-700 mb-2">Actions:</div>
                <div className="space-y-1">
                  {trigger.config.actions.slice(0, 2).map((actionId: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-green-600">
                      <span>⚡</span>
                      <span>{actionId.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</span>
                    </div>
                  ))}
                  {trigger.config.actions.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{trigger.config.actions.length - 2} more action{trigger.config.actions.length - 2 !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Show new condition-based actions */}
            {trigger.conditions && trigger.conditions.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-xs font-medium text-gray-700 mb-2">Actions:</div>
                <div className="space-y-1">
                  {trigger.conditions.slice(0, 2).map((condition, condIdx) => (
                    condition.actions && condition.actions.length > 0 && (
                      <div key={condIdx} className="space-y-1">
                        {condition.actions.slice(0, 2).map((action, actIdx) => (
                          <div key={actIdx} className="flex items-center gap-2 text-xs text-green-600">
                            <span>⚡</span>
                            <span>{action.type?.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Action'}</span>
                            {action.config?.subject && (
                              <span className="text-gray-500">: {action.config.subject}</span>
                            )}
                          </div>
                        ))}
                        {condition.actions.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{condition.actions.length - 2} more action{condition.actions.length - 2 !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    )
                  ))}
                  {trigger.conditions.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{trigger.conditions.length - 2} more condition{trigger.conditions.length - 2 !== 1 ? 's' : ''} with actions
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Conditions and Actions Summary */}
          {(conditionCount > 0 || totalActionCount > 0) && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs">
                {conditionCount > 0 && (
                  <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    <span className="font-medium">IF</span>
                    <span>{conditionCount}</span>
                  </div>
                )}
                {totalActionCount > 0 && (
                  <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <span className="font-medium">THEN</span>
                    <span>{totalActionCount}</span>
                  </div>
                )}
              </div>

              {/* Detailed condition/action preview when selected */}
              {isSelected && conditionCount > 0 && (
                <div className="mt-3 space-y-2">
                  <div className="text-xs font-medium text-gray-700">Detailed Rules:</div>
                  {trigger.conditions?.slice(0, 3).map((condition, idx) => (
                    <div key={idx} className="text-xs bg-gray-50 p-3 rounded-lg border-l-2 border-blue-200">
                      <div className="font-medium text-blue-700 mb-1">
                        IF: {condition.conditions?.length || 0} condition{(condition.conditions?.length || 0) !== 1 ? 's' : ''}
                      </div>
                      {condition.conditions?.slice(0, 2).map((cond, condIdx) => (
                        <div key={condIdx} className="text-gray-600 ml-2 mb-1">
                          • {cond.field} {cond.operator} {cond.value}
                        </div>
                      ))}
                      {(condition.conditions?.length || 0) > 2 && (
                        <div className="text-gray-500 ml-2 mb-2">
                          +{(condition.conditions?.length || 0) - 2} more condition{(condition.conditions?.length || 0) - 2 !== 1 ? 's' : ''}
                        </div>
                      )}
                      <div className="font-medium text-green-700 mt-2">
                        THEN: {condition.actions?.length || 0} action{(condition.actions?.length || 0) !== 1 ? 's' : ''}
                      </div>
                      {condition.actions?.slice(0, 2).map((action, actIdx) => (
                        <div key={actIdx} className="text-green-600 ml-2">
                          • {action.type?.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Action'}
                          {action.config?.subject && `: ${action.config.subject}`}
                        </div>
                      ))}
                      {(condition.actions?.length || 0) > 2 && (
                        <div className="text-gray-500 ml-2">
                          +{(condition.actions?.length || 0) - 2} more action{(condition.actions?.length || 0) - 2 !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  ))}
                  {(trigger.conditions?.length || 0) > 3 && (
                    <div className="text-xs text-gray-500 text-center py-2 bg-gray-50 rounded">
                      +{(trigger.conditions?.length || 0) - 3} more rule{(trigger.conditions?.length || 0) - 3 !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              )}

              {/* Legacy trigger detailed preview when selected */}
              {isSelected && conditionCount === 0 && legacyActionCount > 0 && (
                <div className="mt-3">
                  <div className="text-xs font-medium text-gray-700 mb-2">Configured Actions:</div>
                  <div className="text-xs bg-gray-50 p-3 rounded-lg border-l-2 border-green-200">
                    <div className="space-y-1">
                      {trigger.config.actions.slice(0, 4).map((action: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-green-600">
                          <span>⚡</span>
                          <span>{action.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</span>
                        </div>
                      ))}
                      {legacyActionCount > 4 && (
                        <div className="text-gray-500 pt-1">
                          +{legacyActionCount - 4} more action{legacyActionCount - 4 !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}


        </div>

        {/* Branching Logic Visualization */}
        {hasConditions && (
          <div className="mt-4 space-y-2">
            {trigger.conditions!.map((condition, condIndex) => (
              <div key={condition.id} className="flex items-center gap-2 text-xs">
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  If {condition.field} {condition.operator} {condition.value}
                </div>
                <ArrowRightIcon className="w-3 h-3 text-gray-400" />
                <div className={`px-2 py-1 rounded-full ${
                  condition.action === 'continue' ? 'bg-green-100 text-green-800' :
                  condition.action === 'branch' ? 'bg-purple-100 text-purple-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {condition.action === 'continue' ? 'Continue' :
                   condition.action === 'branch' ? `Branch to ${condition.branchTo}` :
                   'End Flow'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderConnectionLine = (index: number) => {
    if (index === triggers.length) return null;
    
    return (
      <div className="flex items-center justify-center py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-gray-300"></div>
          <ArrowRightIcon className="w-4 h-4 text-gray-400" />
          <div className="w-8 h-0.5 bg-gray-300"></div>
        </div>
      </div>
    );
  };

  const renderAddTriggerButton = () => (
    <div className="flex flex-col items-center">
      <button
        onClick={() => setShowTriggerTypeSelector(true)}
        className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-crimson-blue hover:bg-crimson-blue hover:bg-opacity-5 transition-all duration-200 min-w-[200px]"
        disabled={isReadOnly}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <PlusIcon className="w-5 h-5 text-gray-600" />
          </div>
          <div className="text-sm font-medium text-gray-700">Add Trigger</div>
          <div className="text-xs text-gray-500">Click to add new action</div>
        </div>
      </button>
    </div>
  );

  const renderEndNode = () => (
    <div className="flex flex-col items-center">
      <div className="bg-gray-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
        <div className="text-center">
          <div className="text-2xl">🏁</div>
          <div className="text-xs font-medium">End</div>
        </div>
      </div>
      <div className="mt-2 text-sm font-medium text-gray-700">Flow Complete</div>
      <div className="text-xs text-gray-500">Journey finished</div>
    </div>
  );

  return (
    <div className="bg-gray-50 rounded-lg p-8 min-h-[500px]">
      {/* Flow Header */}
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Visual Flow Builder</h3>
        <p className="text-sm text-gray-600">
          {isReadOnly ? 'View your donor journey workflow' : 'Design your donor journey workflow by adding and configuring triggers'}
        </p>
      </div>

      {/* Audience Overview */}
      {audienceFilters.length > 0 && (
        <div className="mb-8 bg-white rounded-lg p-4 border border-blue-200 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">👥</span>
              Target Audience
            </h4>
            <div className="text-sm text-blue-700 bg-blue-100 px-3 py-1 rounded-full font-medium">
              {estimatedAudienceSize} people
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {audienceFilters.map((filter, index) => (
              <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1 text-sm text-blue-800">
                {filter.label}
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-500 text-center">
            Flow will automatically apply to people matching these criteria
          </div>
        </div>
      )}

      {/* Flow Visualization */}
      <div className="flex flex-col items-center space-y-6">
        {/* Start Node */}
        {renderStartNode()}
        
        {/* Connection Line */}
        {triggers.length > 0 && renderConnectionLine(-1)}

        {/* Trigger Nodes */}
        {triggers.map((trigger, index) => (
          <React.Fragment key={trigger.id}>
            {renderTriggerNode(trigger, index)}
            {renderConnectionLine(index)}
          </React.Fragment>
        ))}

        {/* Add Trigger Button */}
        {!isReadOnly && renderAddTriggerButton()}
        
        {/* Connection Line to End */}
        {triggers.length > 0 && renderConnectionLine(triggers.length)}

        {/* End Node */}
        {triggers.length > 0 && renderEndNode()}
      </div>

      {/* Empty State */}
      {triggers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚡</div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No triggers configured</h4>
          <p className="text-gray-600 mb-6">Start building your donor journey by adding your first trigger</p>
          {!isReadOnly && (
            <Button
              onClick={() => setShowTriggerTypeSelector(true)}
              className="bg-crimson-blue hover:bg-crimson-dark-blue"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Your First Trigger
            </Button>
          )}
        </div>
      )}

      {/* Flow Statistics */}
      {triggers.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-crimson-blue">{triggers.length}</div>
              <div className="text-sm text-gray-600">Total Triggers</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-green-600">
                {triggers.filter(t => t.conditions && t.conditions.length > 0).length}
              </div>
              <div className="text-sm text-gray-600">Conditional Triggers</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-purple-600">
                {triggers.reduce((acc, t) => acc + (t.conditions?.length || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Conditions</div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 bg-white rounded-lg p-4 border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Trigger Conditions</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {[
            { type: 'gift', name: 'Gift Events', icon: '💰' },
            { type: 'pledge', name: 'Pledge Events', icon: '📋' },
            { type: 'action', name: 'Donor Actions', icon: '⚡' },
            { type: 'task', name: 'Task Events', icon: '📋' },
            { type: 'flag', name: 'Flag Changes', icon: '🏁' },
            { type: 'keyword', name: 'Keywords', icon: '🏷️' },
            { type: 'attribute', name: 'Attributes', icon: '📊' },
            { type: 'note', name: 'Notes', icon: '📝' }
          ].map((item) => (
            <div key={item.type} className="flex items-center gap-2">
              <span className="text-lg">{item.icon}</span>
              <span className="text-gray-700">{item.name}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            Each trigger condition can have multiple actions configured through the If/Then logic tab.
          </p>
        </div>
      </div>

      {/* Click outside to deselect */}
      {selectedTrigger && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setSelectedTrigger(null)}
        />
      )}

      {/* Trigger Type Selector Modal */}
      {showTriggerTypeSelector && (
        <TriggerTypeSelector
          onSelect={(type) => {
            setShowTriggerTypeSelector(false);
            onAddTrigger(type);
          }}
          onClose={() => setShowTriggerTypeSelector(false)}
        />
      )}
    </div>
  );
};

export default FlowVisualBuilder;
