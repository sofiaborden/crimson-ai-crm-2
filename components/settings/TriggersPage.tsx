import React, { useState } from 'react';
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon, PlayIcon, PauseIcon, DocumentDuplicateIcon } from '../../constants';
import Button from '../ui/Button';
import TriggerConfigModal from './TriggerConfigModal';
import FlowVisualBuilder from './FlowVisualBuilder';

interface Flow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  triggers: FlowTrigger[];
  createdAt: string;
  lastModified: string;
  totalExecutions: number;
  successRate: number;
}

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

const TriggersPage: React.FC = () => {
  const [flows, setFlows] = useState<Flow[]>([
    {
      id: '1',
      name: 'New Donor Welcome Journey',
      description: 'Automated workflow for new donors including welcome tasks and follow-up',
      status: 'active',
      triggers: [
        {
          id: 't1',
          type: 'gift',
          name: 'First Gift Received',
          config: {
            amountCondition: 'greater_than',
            amount: '0',
            giftType: 'first_time',
            actions: ['add-task', 'add-flag']
          },
          conditions: [
            {
              id: 'c1',
              field: 'donor_type',
              operator: 'equals',
              value: 'new',
              action: 'continue'
            }
          ],
          position: { x: 0, y: 0 },
          status: 'active'
        }
      ],
      createdAt: '2024-01-10',
      lastModified: '2024-01-12',
      totalExecutions: 45,
      successRate: 92
    },
    {
      id: '2',
      name: 'Lapsed Donor Re-engagement',
      description: 'Multi-channel approach to re-engage lapsed donors',
      status: 'active',
      triggers: [
        {
          id: 't3',
          type: 'dialr',
          name: 'Reconnect Call Campaign',
          config: {
            campaign: 'lapsed-donor-reconnect',
            script: 'reconnect-script',
            priority: 'normal'
          },
          position: { x: 0, y: 0 },
          status: 'active'
        },
        {
          id: 't4',
          type: 'mailchimp',
          name: 'Email Follow-up',
          config: {
            action: 'add',
            listId: 'lapsed-donors',
            tagName: 'Re-engagement Campaign'
          },
          position: { x: 0, y: 1 },
          status: 'active'
        }
      ],
      createdAt: '2024-01-08',
      lastModified: '2024-01-11',
      totalExecutions: 23,
      successRate: 78
    },
    {
      id: '3',
      name: 'Major Gift Stewardship',
      description: 'Comprehensive stewardship workflow for major gift donors',
      status: 'active',
      triggers: [
        {
          id: 't5',
          type: 'gift',
          name: 'Major Gift Received',
          config: {
            amount: '10000',
            giftType: 'major',
            threshold: 'above'
          },
          position: { x: 0, y: 0 },
          status: 'active'
        },
        {
          id: 't6',
          type: 'action',
          name: 'Stewardship Actions',
          config: {
            actionType: 'stewardship',
            priority: 'high',
            assignTo: 'major-gifts-team'
          },
          position: { x: 0, y: 1 },
          status: 'active'
        },
        {
          id: 't7',
          type: 'pledge',
          name: 'Pledge Follow-up',
          config: {
            amount: '25000',
            pledgeType: 'multi-year',
            paymentSchedule: 'annual'
          },
          position: { x: 0, y: 2 },
          status: 'active'
        }
      ],
      createdAt: '2024-01-05',
      lastModified: '2024-01-14',
      totalExecutions: 12,
      successRate: 95
    },
    {
      id: '4',
      name: 'Major Gift Stewardship Flow',
      description: 'Comprehensive stewardship workflow for major gift donors with multiple trigger conditions and actions',
      status: 'active',
      triggers: [
        {
          id: 't7',
          type: 'gift',
          name: 'Major Gift Received',
          config: {
            amountCondition: 'greater_than',
            amount: '10000',
            giftType: 'major_gift',
            actions: ['add-task', 'schedule-event', 'add-flag', 'send-to-dialr']
          },
          conditions: [
            {
              id: 'c3',
              field: 'giving_amount',
              operator: 'greater_than',
              value: '10000',
              action: 'continue'
            }
          ],
          position: { x: 0, y: 0 },
          status: 'active'
        },
        {
          id: 't8',
          type: 'action',
          name: 'Stewardship Action Completed',
          config: {
            actionType: 'custom',
            description: 'Stewardship meeting or call completed',
            actions: ['add-note', 'schedule-event']
          },
          conditions: [
            {
              id: 'c4',
              field: 'task_status',
              operator: 'equals',
              value: 'completed',
              action: 'continue'
            }
          ],
          position: { x: 0, y: 1 },
          status: 'active'
        },
        {
          id: 't9',
          type: 'pledge',
          name: 'Multi-Year Pledge Made',
          config: {
            pledgeAmount: '25000',
            paymentSchedule: 'annually',
            duration: '36',
            condition: 'pledge_made',
            actions: ['add-task', 'create-smart-segment', 'send-to-mailchimp']
          },
          position: { x: 0, y: 2 },
          status: 'active'
        }
      ],
      createdAt: '2024-01-08',
      lastModified: '2024-01-15',
      totalExecutions: 8,
      successRate: 100
    }
  ]);

  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'visual'>('list');
  const [showTriggerModal, setShowTriggerModal] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState<FlowTrigger | null>(null);
  const [showNewFlowModal, setShowNewFlowModal] = useState(false);

  const createNewFlow = () => {
    const newFlow: Flow = {
      id: Date.now().toString(),
      name: 'New Flow',
      description: 'Description for new flow',
      status: 'draft',
      triggers: [],
      createdAt: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      totalExecutions: 0,
      successRate: 0
    };
    setFlows(prev => [...prev, newFlow]);
    setSelectedFlow(newFlow);
    setViewMode('visual');
  };

  const duplicateFlow = (flow: Flow) => {
    const duplicatedFlow: Flow = {
      ...flow,
      id: Date.now().toString(),
      name: `${flow.name} (Copy)`,
      status: 'draft',
      totalExecutions: 0,
      successRate: 0,
      createdAt: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      triggers: flow.triggers.map(trigger => ({
        ...trigger,
        id: `${trigger.id}_copy_${Date.now()}`
      }))
    };
    setFlows(prev => [...prev, duplicatedFlow]);

    // Show success message
    alert(`"${flow.name}" has been copied successfully!`);
  };

  const toggleFlowStatus = (flowId: string) => {
    setFlows(prev => prev.map(flow => 
      flow.id === flowId 
        ? { ...flow, status: flow.status === 'active' ? 'inactive' : 'active' }
        : flow
    ));
  };

  const deleteFlow = (flowId: string) => {
    if (confirm('Are you sure you want to delete this flow?')) {
      setFlows(prev => prev.filter(flow => flow.id !== flowId));
      if (selectedFlow?.id === flowId) {
        setSelectedFlow(null);
      }
    }
  };

  const addTriggerToFlow = (type: string) => {
    if (!selectedFlow) return;

    const triggerNames: { [key: string]: string } = {
      task: 'Create Task',
      segment: 'Smart Segment Action',
      flag: 'Add Flag',
      keyword: 'Add Keyword',
      attribute: 'Update Attribute',
      note: 'Add Note',
      event: 'Schedule Event',
      dialr: 'DialR Campaign',
      targetpath: 'TargetPath Campaign',
      mailchimp: 'MailChimp Action',
      constantcontact: 'Constant Contact Action'
    };

    const newTrigger: FlowTrigger = {
      id: Date.now().toString(),
      type: type,
      name: triggerNames[type] || 'New Trigger',
      config: {},
      position: { x: 0, y: selectedFlow.triggers.length },
      status: 'inactive'
    };

    setEditingTrigger(newTrigger);
    setShowTriggerModal(true);
  };

  const saveTrigger = (trigger: FlowTrigger) => {
    if (!selectedFlow) return;

    const isNewTrigger = !selectedFlow.triggers.find(t => t.id === trigger.id);
    
    if (isNewTrigger) {
      setSelectedFlow(prev => prev ? {
        ...prev,
        triggers: [...prev.triggers, trigger]
      } : null);
      
      setFlows(prev => prev.map(flow => 
        flow.id === selectedFlow.id 
          ? { ...flow, triggers: [...flow.triggers, trigger] }
          : flow
      ));
    } else {
      setSelectedFlow(prev => prev ? {
        ...prev,
        triggers: prev.triggers.map(t => t.id === trigger.id ? trigger : t)
      } : null);
      
      setFlows(prev => prev.map(flow => 
        flow.id === selectedFlow.id 
          ? { ...flow, triggers: flow.triggers.map(t => t.id === trigger.id ? trigger : t) }
          : flow
      ));
    }
    
    setShowTriggerModal(false);
    setEditingTrigger(null);
  };

  const deleteTrigger = (triggerId: string) => {
    if (!selectedFlow) return;
    
    if (confirm('Are you sure you want to delete this trigger?')) {
      setSelectedFlow(prev => prev ? {
        ...prev,
        triggers: prev.triggers.filter(t => t.id !== triggerId)
      } : null);
      
      setFlows(prev => prev.map(flow => 
        flow.id === selectedFlow.id 
          ? { ...flow, triggers: flow.triggers.filter(t => t.id !== triggerId) }
          : flow
      ));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>;
      case 'inactive':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Inactive</span>;
      case 'draft':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Draft</span>;
      default:
        return null;
    }
  };

  if (selectedFlow && viewMode === 'visual') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              onClick={() => setSelectedFlow(null)}
            >
              ← Back to Flows
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{selectedFlow.name}</h1>
              <p className="text-gray-600">{selectedFlow.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => setViewMode('list')}
            >
              <EyeIcon className="w-4 h-4 mr-2" />
              List View
            </Button>
            {getStatusBadge(selectedFlow.status)}
          </div>
        </div>

        {/* Visual Flow Builder */}
        <FlowVisualBuilder
          triggers={selectedFlow.triggers}
          onTriggerEdit={(trigger) => {
            setEditingTrigger(trigger);
            setShowTriggerModal(true);
          }}
          onTriggerDelete={deleteTrigger}
          onAddTrigger={addTriggerToFlow}
        />

        {/* Trigger Configuration Modal */}
        {showTriggerModal && editingTrigger && (
          <TriggerConfigModal
            trigger={editingTrigger}
            onClose={() => {
              setShowTriggerModal(false);
              setEditingTrigger(null);
            }}
            onSave={saveTrigger}
            availableFlows={flows.filter(f => f.id !== selectedFlow.id)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donor Journey Triggers</h1>
          <p className="text-gray-600">Create automated workflows to engage donors at the right moments</p>
        </div>
        <Button
          onClick={createNewFlow}
          className="bg-crimson-blue hover:bg-crimson-dark-blue"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Create New Flow
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-semibold">⚡</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Flows</p>
              <p className="text-2xl font-semibold text-gray-900">{flows.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <PlayIcon className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Flows</p>
              <p className="text-2xl font-semibold text-gray-900">
                {flows.filter(f => f.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-semibold">📊</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Executions</p>
              <p className="text-2xl font-semibold text-gray-900">
                {flows.reduce((acc, flow) => acc + flow.totalExecutions, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 font-semibold">📈</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Success Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {flows.length > 0 ? Math.round(flows.reduce((acc, flow) => acc + flow.successRate, 0) / flows.length) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Flows Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Your Flows</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Flow Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Triggers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Executions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Success Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Modified
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {flows.map((flow) => (
                <tr key={flow.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{flow.name}</div>
                      <div className="text-sm text-gray-500">{flow.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(flow.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {flow.triggers.length} triggers
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {flow.totalExecutions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {flow.successRate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {flow.lastModified}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setSelectedFlow(flow);
                          setViewMode('visual');
                        }}
                      >
                        <EyeIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => toggleFlowStatus(flow.id)}
                      >
                        {flow.status === 'active' ? (
                          <PauseIcon className="w-4 h-4" />
                        ) : (
                          <PlayIcon className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => duplicateFlow(flow)}
                      >
                        <DocumentDuplicateIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => deleteFlow(flow.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {flows.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚡</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No flows created yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first automated donor journey flow to start engaging donors at the right moments.
          </p>
          <Button
            onClick={createNewFlow}
            className="bg-crimson-blue hover:bg-crimson-dark-blue"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Your First Flow
          </Button>
        </div>
      )}
    </div>
  );
};

export default TriggersPage;
