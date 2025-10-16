import React, { useState } from 'react';
import { ArrowPathIcon, PlusIcon, PencilIcon, TrashIcon, EyeIcon, ChatBubbleLeftRightIcon, PlayIcon, PauseIcon, ClockIcon, DocumentDuplicateIcon, InformationCircleIcon, UserGroupIcon, CheckCircleIcon, ChartBarIcon } from '../../constants';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import SmartFlowEditor from './SmartFlowEditor';

interface SmartFlow {
  id: string;
  name: string;
  description: string;
  type: 'dynamic' | 'static';
  syncPeriod?: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  isActive: boolean;
  targetCount: number;
  completedCount: number;
  triggers: FlowTrigger[];
  audienceFilters?: Array<{type: string, value: string, label: string}>;
  estimatedAudienceSize?: string;
  createdBy: string;
  createdDate: string;
  lastRun?: string;
}

interface FlowTrigger {
  id: string;
  type: 'task' | 'segment' | 'flag' | 'keyword' | 'attribute' | 'note' | 'event' | 'dialr' | 'targetpath' | 'mailchimp' | 'gift' | 'pledge' | 'action' | 'selected_audience' | 'apply_smart_tag';
  name: string;
  config: any;
  conditions?: FlowCondition[];
}

interface FlowCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
  action: 'continue' | 'branch' | 'end';
  branchTo?: string;
}

const SmartFlowManager: React.FC = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [editingFlow, setEditingFlow] = useState<SmartFlow | null>(null);
  const [crimsonGPTPrompt, setCrimsonGPTPrompt] = useState('');
  const [isProcessingPrompt, setIsProcessingPrompt] = useState(false);

  // Mock data for Smart Flows
  const [smartFlows, setSmartFlows] = useState<SmartFlow[]>([
    {
      id: '1',
      name: 'New Donor Welcome Journey',
      description: 'Automated welcome sequence for first-time donors with personalized stewardship',
      type: 'dynamic',
      syncPeriod: 'realtime',
      isActive: true,
      targetCount: 156,
      completedCount: 89,
      audienceFilters: [
        { type: 'segment', value: 'new-donors', label: 'New Donors (Last 6 months)' },
        { type: 'smart_tag', value: 'new-rising-donors', label: 'New & Rising Donors' }
      ],
      estimatedAudienceSize: '156',
      triggers: [
        {
          id: '1',
          type: 'gift',
          name: 'First Gift Received',
          isActive: true,
          conditions: [
            {
              id: 'c1',
              conditions: [
                {
                  id: 'r1',
                  field: 'gift_amount',
                  operator: 'greater_than',
                  value: '0'
                }
              ],
              actions: [
                {
                  id: 'a1',
                  type: 'add_task',
                  config: {
                    title: 'Send welcome package to new donor',
                    assignedTo: 'development_director',
                    dueDate: '1_day',
                    priority: 'high',
                    description: 'Send personalized welcome package with impact report and thank you note'
                  }
                },
                {
                  id: 'a2',
                  type: 'send_to_mailchimp',
                  config: {
                    campaign: 'new_donor_welcome_series',
                    listName: 'New Donor Welcome',
                    tags: ['new-donor', 'welcome-series']
                  }
                },
                {
                  id: 'a3',
                  type: 'add_flag',
                  config: {
                    flagType: 'new_donor',
                    notes: 'First-time donor - requires special attention'
                  }
                }
              ]
            }
          ],
          position: { x: 100, y: 100 }
        }
      ],
      createdBy: 'Sarah Johnson',
      createdDate: '2024-01-15',
      lastRun: '2024-01-20 14:30'
    },
    {
      id: '2',
      name: 'Lapsed Donor Re-engagement',
      description: 'Win back donors who haven\'t given in 18+ months',
      type: 'dynamic',
      syncPeriod: 'weekly',
      isActive: true,
      targetCount: 342,
      completedCount: 127,
      triggers: [
        {
          id: '1',
          type: 'attribute',
          name: 'Donor Status Changed to Lapsed',
          config: {
            fieldName: 'donor_status',
            fieldValue: 'lapsed',
            actions: ['send-to-dialr', 'create-smart-segment', 'add-task']
          }
        }
      ],
      createdBy: 'Mike Chen',
      createdDate: '2024-01-10',
      lastRun: '2024-01-19 09:15'
    },
    {
      id: '3',
      name: 'Major Gift Prospect Pipeline',
      description: 'Systematic approach for major gift cultivation',
      type: 'static',
      isActive: false,
      targetCount: 45,
      completedCount: 12,
      triggers: [
        { id: '1', type: 'attribute', name: 'Wealth Rating', config: { value: 'A+' } },
        { id: '2', type: 'task', name: 'Research & Qualification', config: { assignTo: 'development-team' } },
        { id: '3', type: 'targetpath', name: 'Wealth Screening', config: { level: 'comprehensive' } }
      ],
      createdBy: 'Lisa Rodriguez',
      createdDate: '2024-01-08',
      lastRun: '2024-01-18 16:45'
    },
    {
      id: '4',
      name: 'Major Gift Stewardship Flow',
      description: 'Comprehensive stewardship workflow for major gift donors with multi-step cultivation',
      type: 'dynamic',
      syncPeriod: 'realtime',
      isActive: true,
      targetCount: 89,
      completedCount: 67,
      audienceFilters: [
        { type: 'segment', value: 'major-donors', label: 'Major Donors ($1000+)' },
        { type: 'smart_tag', value: 'big-givers', label: 'Big Givers' }
      ],
      estimatedAudienceSize: '89',
      triggers: [
        {
          id: '1',
          type: 'gift',
          name: 'Major Gift Received',
          isActive: true,
          conditions: [
            {
              id: 'c1',
              conditions: [
                {
                  id: 'r1',
                  field: 'gift_amount',
                  operator: 'greater_than',
                  value: '5000'
                },
                {
                  id: 'r2',
                  field: 'donor_segment',
                  operator: 'equals',
                  value: 'major_donors',
                  logicalOperator: 'AND'
                }
              ],
              actions: [
                {
                  id: 'a1',
                  type: 'add_task',
                  config: {
                    title: 'Schedule major gift stewardship meeting',
                    assignedTo: 'major_gifts_officer',
                    dueDate: '3_days',
                    priority: 'urgent',
                    description: 'Schedule in-person or virtual meeting to thank donor and discuss future opportunities'
                  }
                },
                {
                  id: 'a2',
                  type: 'schedule_event',
                  config: {
                    eventTitle: 'Major Gift Thank You Call',
                    eventType: 'call',
                    duration: '30_minutes',
                    scheduleTiming: '2_days'
                  }
                },
                {
                  id: 'a3',
                  type: 'send_to_dialr',
                  config: {
                    campaign: 'major_gift_stewardship',
                    assignedUser: 'development_director',
                    callScript: 'Thank you for your generous $[GIFT_AMOUNT] gift. We would love to share the impact of your support.'
                  }
                }
              ]
            }
          ],
          position: { x: 100, y: 100 }
        },
        {
          id: '2',
          type: 'task',
          name: 'Stewardship Meeting Completed',
          isActive: true,
          conditions: [
            {
              id: 'c2',
              conditions: [
                {
                  id: 'r3',
                  field: 'task_status',
                  operator: 'equals',
                  value: 'completed'
                }
              ],
              actions: [
                {
                  id: 'a4',
                  type: 'add_task',
                  config: {
                    title: 'Send impact report to major donor',
                    assignedTo: 'communications_manager',
                    dueDate: '1_week',
                    priority: 'medium',
                    description: 'Create and send personalized impact report showing how their gift is making a difference'
                  }
                },
                {
                  id: 'a5',
                  type: 'schedule_event',
                  config: {
                    eventTitle: 'Follow-up cultivation meeting',
                    eventType: 'meeting',
                    duration: '45_minutes',
                    scheduleTiming: '3_months'
                  }
                }
              ]
            }
          ],
          position: { x: 100, y: 200 }
        },
        {
          id: '3',
          type: 'pledge',
          name: 'Multi-Year Pledge Created',
          isActive: true,
          conditions: [
            {
              id: 'c3',
              conditions: [
                {
                  id: 'r4',
                  field: 'pledge_amount',
                  operator: 'greater_than',
                  value: '10000'
                }
              ],
              actions: [
                {
                  id: 'a6',
                  type: 'create_smart_segment',
                  config: {
                    segmentAction: 'add',
                    segmentName: 'Major Pledge Donors'
                  }
                },
                {
                  id: 'a7',
                  type: 'send_to_mailchimp',
                  config: {
                    campaign: 'major_pledge_stewardship',
                    listName: 'Major Pledge Donors',
                    tags: ['major-pledge', 'multi-year-commitment']
                  }
                }
              ]
            }
          ],
          position: { x: 100, y: 300 }
        }
      ],
      createdBy: 'David Park',
      createdDate: '2024-01-12',
      lastRun: '2024-01-20 11:20'
    },
    {
      id: '5',
      name: 'Lapsed Donor Re-engagement',
      description: 'Multi-touch campaign to re-engage donors who haven\'t given in 18+ months',
      type: 'dynamic',
      syncPeriod: 'weekly',
      isActive: true,
      targetCount: 342,
      completedCount: 127,
      audienceFilters: [
        { type: 'segment', value: 'lapsed-donors', label: 'Lapsed Donors' },
        { type: 'smart_tag', value: 'lapsed-at-risk', label: 'Lapsed/At-Risk' }
      ],
      estimatedAudienceSize: '342',
      triggers: [
        {
          id: '1',
          type: 'attribute',
          name: 'Lapsed Donor Identified',
          isActive: true,
          conditions: [
            {
              id: 'c1',
              conditions: [
                {
                  id: 'r1',
                  field: 'days_since_last_gift',
                  operator: 'greater_than',
                  value: '540'
                },
                {
                  id: 'r2',
                  field: 'lifetime_giving',
                  operator: 'greater_than',
                  value: '100',
                  logicalOperator: 'AND'
                }
              ],
              actions: [
                {
                  id: 'a1',
                  type: 'send_to_mailchimp',
                  config: {
                    campaign: 'lapsed_donor_reengagement_1',
                    listName: 'Lapsed Donor Re-engagement',
                    tags: ['lapsed-donor', 'reengagement-series', 'touch-1']
                  }
                },
                {
                  id: 'a2',
                  type: 'add_task',
                  config: {
                    title: 'Research lapsed donor for personalized outreach',
                    assignedTo: 'donor_relations_coordinator',
                    dueDate: '1_week',
                    priority: 'medium',
                    description: 'Review donor history and identify personalized re-engagement approach'
                  }
                }
              ]
            }
          ],
          position: { x: 100, y: 100 }
        },
        {
          id: '2',
          type: 'task',
          name: 'No Response After 2 Weeks',
          isActive: true,
          conditions: [
            {
              id: 'c2',
              conditions: [
                {
                  id: 'r3',
                  field: 'email_engagement',
                  operator: 'equals',
                  value: 'no_response'
                },
                {
                  id: 'r4',
                  field: 'days_since_email',
                  operator: 'greater_than',
                  value: '14',
                  logicalOperator: 'AND'
                }
              ],
              actions: [
                {
                  id: 'a3',
                  type: 'send_to_dialr',
                  config: {
                    campaign: 'lapsed_donor_phone_outreach',
                    assignedUser: 'development_associate',
                    callScript: 'Hi [NAME], we miss you! We wanted to reach out personally to share some exciting updates and see how you\'re doing.'
                  }
                },
                {
                  id: 'a4',
                  type: 'send_to_targetpath',
                  config: {
                    mailCampaign: 'lapsed_donor_direct_mail',
                    mailType: 'letter',
                    personalization: 'high'
                  }
                }
              ]
            }
          ],
          position: { x: 100, y: 200 }
        },
        {
          id: '3',
          type: 'gift',
          name: 'Re-engagement Gift Received',
          isActive: true,
          conditions: [
            {
              id: 'c3',
              conditions: [
                {
                  id: 'r5',
                  field: 'gift_received',
                  operator: 'equals',
                  value: 'true'
                }
              ],
              actions: [
                {
                  id: 'a5',
                  type: 'add_task',
                  config: {
                    title: 'Send personalized thank you to re-engaged donor',
                    assignedTo: 'development_director',
                    dueDate: '1_day',
                    priority: 'urgent',
                    description: 'Send heartfelt thank you acknowledging their return and renewed support'
                  }
                },
                {
                  id: 'a6',
                  type: 'create_smart_segment',
                  config: {
                    segmentAction: 'add',
                    segmentName: 'Re-engaged Donors'
                  }
                },
                {
                  id: 'a7',
                  type: 'add_flag',
                  config: {
                    flagType: 'reengaged_donor',
                    notes: 'Successfully re-engaged after lapse - monitor closely for retention'
                  }
                }
              ]
            }
          ],
          position: { x: 100, y: 300 }
        }
      ],
      createdBy: 'Maria Rodriguez',
      createdDate: '2024-01-18',
      lastRun: '2024-01-21 09:15'
    },
    // Auto-created flows from Smart Tags
    {
      id: 'flow-1',
      name: 'Big Givers - Inclusion Flow',
      description: 'Auto-created flow from Big Givers Smart Tag inclusion criteria',
      type: 'dynamic',
      syncPeriod: 'daily',
      isActive: true,
      targetCount: 1247,
      completedCount: 1247,
      audienceFilters: [
        { type: 'smart_tag_filter', value: 'big-givers-inclusion', label: 'Big Givers Inclusion Criteria' }
      ],
      estimatedAudienceSize: '1247',
      triggers: [
        {
          id: '1',
          type: 'selected_audience',
          name: 'Selected Audience',
          config: {
            audienceFilters: { totalGiving: { min: 500, period: '12months' } }
          },
          conditions: [
            {
              id: 'c1',
              conditions: [
                {
                  id: 'r1',
                  field: 'audience_match',
                  operator: 'equals',
                  value: 'true'
                }
              ],
              actions: [
                {
                  id: 'a1',
                  type: 'apply_smart_tag',
                  config: {
                    smartTagId: '1',
                    smartTagName: 'Big Givers',
                    useInclusionCriteria: true
                  }
                }
              ]
            }
          ]
        }
      ],
      createdBy: 'System',
      createdDate: '2024-01-15'
    },
    {
      id: 'flow-3',
      name: 'Prime Persuadables - Inclusion Flow',
      description: 'Auto-created flow from Prime Persuadables Smart Tag inclusion criteria',
      type: 'dynamic',
      syncPeriod: 'daily',
      isActive: true,
      targetCount: 892,
      completedCount: 892,
      audienceFilters: [
        { type: 'smart_tag_filter', value: 'prime-persuadables-inclusion', label: 'Prime Persuadables Inclusion Criteria' }
      ],
      estimatedAudienceSize: '892',
      triggers: [
        {
          id: '1',
          type: 'selected_audience',
          name: 'Selected Audience',
          config: {
            audienceFilters: { state: 'FL', ageRange: [35, 44], politicalEngagement: 'moderate' }
          },
          conditions: [
            {
              id: 'c1',
              conditions: [
                {
                  id: 'r1',
                  field: 'audience_match',
                  operator: 'equals',
                  value: 'true'
                }
              ],
              actions: [
                {
                  id: 'a1',
                  type: 'apply_smart_tag',
                  config: {
                    smartTagId: '2',
                    smartTagName: 'Prime Persuadables',
                    useInclusionCriteria: true
                  }
                }
              ]
            }
          ]
        }
      ],
      createdBy: 'System',
      createdDate: '2024-01-15'
    },
    {
      id: 'flow-4',
      name: 'New & Rising Donors - Inclusion Flow',
      description: 'Auto-created flow from New & Rising Donors Smart Tag inclusion criteria',
      type: 'dynamic',
      syncPeriod: 'daily',
      isActive: true,
      targetCount: 324,
      completedCount: 324,
      audienceFilters: [
        { type: 'smart_tag_filter', value: 'new-rising-donors-inclusion', label: 'New & Rising Donors Inclusion Criteria' }
      ],
      estimatedAudienceSize: '324',
      triggers: [
        {
          id: '1',
          type: 'selected_audience',
          name: 'Selected Audience',
          config: {
            audienceFilters: { firstGiftDate: { within: '6months' }, or: { upgradedGiving: true } }
          },
          conditions: [
            {
              id: 'c1',
              conditions: [
                {
                  id: 'r1',
                  field: 'audience_match',
                  operator: 'equals',
                  value: 'true'
                }
              ],
              actions: [
                {
                  id: 'a1',
                  type: 'apply_smart_tag',
                  config: {
                    smartTagId: '4',
                    smartTagName: 'New & Rising Donors',
                    useInclusionCriteria: true
                  }
                }
              ]
            }
          ]
        }
      ],
      createdBy: 'System',
      createdDate: '2024-01-15'
    },
    {
      id: 'flow-6',
      name: 'Lapsed / At-Risk - Inclusion Flow',
      description: 'Auto-created flow from Lapsed / At-Risk Smart Tag inclusion criteria',
      type: 'dynamic',
      syncPeriod: 'daily',
      isActive: false,
      targetCount: 678,
      completedCount: 0,
      audienceFilters: [
        { type: 'smart_tag_filter', value: 'lapsed-at-risk-inclusion', label: 'Lapsed / At-Risk Inclusion Criteria' }
      ],
      estimatedAudienceSize: '678',
      triggers: [
        {
          id: '1',
          type: 'selected_audience',
          name: 'Selected Audience',
          config: {
            audienceFilters: { lastGiftDate: { before: '18months' } }
          },
          conditions: [
            {
              id: 'c1',
              conditions: [
                {
                  id: 'r1',
                  field: 'audience_match',
                  operator: 'equals',
                  value: 'true'
                }
              ],
              actions: [
                {
                  id: 'a1',
                  type: 'apply_smart_tag',
                  config: {
                    smartTagId: '5',
                    smartTagName: 'Lapsed / At-Risk',
                    useInclusionCriteria: true
                  }
                }
              ]
            }
          ]
        }
      ],
      createdBy: 'System',
      createdDate: '2024-01-15'
    },
    {
      id: 'flow-8',
      name: 'Not Yet Registered to Vote - Inclusion Flow',
      description: 'Auto-created flow from Not Yet Registered to Vote Smart Tag inclusion criteria',
      type: 'dynamic',
      syncPeriod: 'daily',
      isActive: true,
      targetCount: 456,
      completedCount: 456,
      audienceFilters: [
        { type: 'smart_tag_filter', value: 'not-yet-registered-inclusion', label: 'Not Yet Registered to Vote Inclusion Criteria' }
      ],
      estimatedAudienceSize: '456',
      triggers: [
        {
          id: '1',
          type: 'selected_audience',
          name: 'Selected Audience',
          config: {
            audienceFilters: { voterRegistration: 'unregistered' }
          },
          conditions: [
            {
              id: 'c1',
              conditions: [
                {
                  id: 'r1',
                  field: 'audience_match',
                  operator: 'equals',
                  value: 'true'
                }
              ],
              actions: [
                {
                  id: 'a1',
                  type: 'apply_smart_tag',
                  config: {
                    smartTagId: '3',
                    smartTagName: 'Not Yet Registered to Vote',
                    useInclusionCriteria: true
                  }
                }
              ]
            }
          ]
        }
      ],
      createdBy: 'System',
      createdDate: '2024-01-15'
    }
  ]);

  const handleCrimsonGPTCreate = async () => {
    if (!crimsonGPTPrompt.trim()) return;
    
    setIsProcessingPrompt(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock response - in real app this would come from CrimsonGPT
    const mockFlow: Partial<SmartFlow> = {
      name: 'AI-Generated Flow',
      description: crimsonGPTPrompt,
      type: 'dynamic',
      syncPeriod: 'daily',
      isActive: false,
      triggers: [
        { id: '1', type: 'task', name: 'Follow-up Task', config: {} },
        { id: '2', type: 'flag', name: 'AI Generated Flag', config: {} }
      ]
    };
    
    setEditingFlow(mockFlow as SmartFlow);
    setShowEditor(true);
    setCrimsonGPTPrompt('');
    setIsProcessingPrompt(false);
  };

  const handleEditFlow = (flow: SmartFlow) => {
    setEditingFlow(flow);
    setShowEditor(true);
  };

  const handleDeleteFlow = (flowId: string) => {
    if (confirm('Are you sure you want to delete this Smart Flow?')) {
      setSmartFlows(flows => flows.filter(f => f.id !== flowId));
    }
  };

  const toggleFlowStatus = (flowId: string) => {
    setSmartFlows(flows =>
      flows.map(f =>
        f.id === flowId ? { ...f, isActive: !f.isActive } : f
      )
    );
  };

  const handleCopyFlow = (flow: SmartFlow) => {
    const copiedFlow: SmartFlow = {
      ...flow,
      id: Date.now().toString(),
      name: `${flow.name} (Copy)`,
      isActive: false,
      completedCount: 0,
      createdDate: new Date().toISOString().split('T')[0],
      lastRun: undefined
    };

    setSmartFlows(flows => [...flows, copiedFlow]);

    // Show success message or notification
    alert(`"${flow.name}" has been copied successfully!`);
  };

  const getSyncPeriodLabel = (period?: string) => {
    switch (period) {
      case 'realtime': return 'Real-time';
      case 'hourly': return 'Hourly';
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      default: return 'Static';
    }
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-crimson-blue bg-opacity-10 p-2 rounded-lg">
            <ArrowPathIcon className="w-6 h-6 text-crimson-blue" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold text-gray-900">Smart Flow</h3>
              <div className="group relative">
                <InformationCircleIcon className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                <div className="absolute top-full left-0 mt-2 w-80 px-4 py-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                      <span>Use Dynamic flows for ongoing automation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      <span>Static flows are perfect for one-time campaigns</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                      <span>Real-time sync provides instant processing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                      <span>Consider your team's capacity when setting triggers</span>
                    </div>
                  </div>
                  <div className="absolute bottom-full left-4 border-4 border-transparent border-b-gray-900"></div>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600">Automated donor journey workflows</p>
          </div>
        </div>
        <Button onClick={() => setShowEditor(true)} className="bg-crimson-blue hover:bg-crimson-dark-blue">
          <PlusIcon className="w-4 h-4 mr-2" />
          Create New Journey
        </Button>
      </div>

      {/* CrimsonGPT Prompt Box */}
      <div className="bg-gradient-to-r from-crimson-blue to-crimson-dark-blue rounded-lg p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-white bg-opacity-20 p-2 rounded-lg">
            <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
          </div>
          <h4 className="font-semibold text-white text-lg">CrimsonGPT Flow Creator</h4>
          <ArrowPathIcon className="w-5 h-5 text-crimson-accent-blue" />
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={crimsonGPTPrompt}
            onChange={(e) => setCrimsonGPTPrompt(e.target.value)}
            placeholder="Describe your donor journey: 'Create a welcome flow for new donors that sends a thank you email, schedules a call, and adds them to our newsletter'"
            className="flex-1 px-4 py-3 rounded-lg border-0 bg-white bg-opacity-90 text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-white focus:bg-white transition-all"
            onKeyPress={(e) => e.key === 'Enter' && handleCrimsonGPTCreate()}
          />
          <Button
            onClick={handleCrimsonGPTCreate}
            disabled={!crimsonGPTPrompt.trim() || isProcessingPrompt}
            className="bg-white bg-opacity-20 hover:bg-white hover:bg-opacity-30 text-white border border-white border-opacity-30 px-6"
          >
            {isProcessingPrompt ? (
              <>
                <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                Create
              </>
            )}
          </Button>
        </div>
        <p className="text-sm text-white text-opacity-90 mt-3 leading-relaxed">
          CrimsonGPT will design your donor journey workflow with smart triggers and automated actions.
        </p>
      </div>

      {/* Smart Flows List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h4 className="font-semibold text-gray-900">Smart Flows</h4>
          <p className="text-sm text-gray-600 mt-1">Automated workflows that guide your donor relationships</p>
        </div>

        <div className="divide-y divide-gray-100">
          {smartFlows.map((flow) => (
            <div key={flow.id} className="p-6 hover:bg-gray-50/50 transition-colors">
              {/* Header Row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h5 className="text-lg font-semibold text-gray-900">{flow.name}</h5>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`text-xs font-medium px-2.5 py-1 ${
                          flow.isActive
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                      >
                        {flow.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge className="text-xs font-medium px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200">
                        {flow.type === 'dynamic' ? getSyncPeriodLabel(flow.syncPeriod) : 'Static'}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{flow.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 ml-6">
                  <Button
                    size="sm"
                    className="bg-crimson-blue text-white hover:bg-crimson-dark-blue px-3 py-2 text-xs font-medium"
                  >
                    <EyeIcon className="w-4 h-4 mr-1.5" />
                    View Results
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => toggleFlowStatus(flow.id)}
                    className={`px-3 py-2 text-xs font-medium border ${
                      flow.isActive
                        ? 'text-orange-700 border-orange-200 hover:bg-orange-50'
                        : 'text-green-700 border-green-200 hover:bg-green-50'
                    }`}
                  >
                    {flow.isActive ? (
                      <>
                        <PauseIcon className="w-4 h-4 mr-1.5" />
                        Pause
                      </>
                    ) : (
                      <>
                        <PlayIcon className="w-4 h-4 mr-1.5" />
                        Activate
                      </>
                    )}
                  </Button>
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleEditFlow(flow)}
                      className="px-2.5 py-2 border-0 hover:bg-gray-100 rounded-r-none"
                      title="Edit Flow"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleCopyFlow(flow)}
                      className="px-2.5 py-2 border-0 border-l border-gray-200 hover:bg-gray-100 rounded-none"
                      title="Copy Journey"
                    >
                      <DocumentDuplicateIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleDeleteFlow(flow.id)}
                      className="px-2.5 py-2 border-0 border-l border-gray-200 hover:bg-red-50 text-red-600 rounded-l-none"
                      title="Delete Flow"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-4 gap-6 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <UserGroupIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{flow.targetCount}</div>
                    <div className="text-xs text-gray-500">Targeted</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{flow.completedCount}</div>
                    <div className="text-xs text-gray-500">Completed</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ChartBarIcon className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {Math.round((flow.completedCount / flow.targetCount) * 100)}%
                    </div>
                    <div className="text-xs text-gray-500">Success Rate</div>
                  </div>
                </div>

                {flow.lastRun && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ClockIcon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Last Run</div>
                      <div className="text-xs text-gray-500">{flow.lastRun}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Triggers Preview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h6 className="text-sm font-medium text-gray-900">Workflow Triggers</h6>
                  <span className="text-xs text-gray-500">{flow.triggers.length} trigger{flow.triggers.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {flow.triggers.slice(0, 4).map((trigger, index) => (
                    <div key={trigger.id} className="flex items-center gap-2">
                      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
                        <div className="w-2 h-2 bg-crimson-blue rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">{trigger.name}</span>
                      </div>
                      {index < Math.min(flow.triggers.length - 1, 3) && (
                        <ArrowPathIcon className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  ))}
                  {flow.triggers.length > 4 && (
                    <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-lg px-3 py-2">
                      <span className="text-sm text-gray-600">+{flow.triggers.length - 4} more</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Flow Editor Modal */}
      {showEditor && (
        <SmartFlowEditor
          flow={editingFlow}
          onClose={() => {
            setShowEditor(false);
            setEditingFlow(null);
          }}
          onSave={(flow) => {
            if (editingFlow && editingFlow.id) {
              setSmartFlows(flows => flows.map(f => f.id === editingFlow.id ? flow : f));
            } else {
              setSmartFlows(flows => [...flows, { ...flow, id: Date.now().toString() }]);
            }
            setShowEditor(false);
            setEditingFlow(null);
          }}
          onCopy={(flow) => {
            const copiedFlow: SmartFlow = {
              ...flow,
              id: Date.now().toString(),
              name: `${flow.name} (Copy)`,
              isActive: false,
              completedCount: 0,
              createdDate: new Date().toISOString().split('T')[0],
              lastRun: undefined
            };

            setSmartFlows(flows => [...flows, copiedFlow]);
            setShowEditor(false);
            setEditingFlow(null);

            // Show success message
            alert(`"${flow.name}" has been copied successfully!`);
          }}
        />
      )}
    </div>
  );
};

export default SmartFlowManager;
