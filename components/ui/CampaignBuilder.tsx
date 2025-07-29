import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import { XMarkIcon, EnvelopeIcon, PhoneIcon, DocumentTextIcon, CalendarIcon, SparklesIcon } from '../../constants';

interface CampaignBuilderProps {
  segmentId: string;
  segmentName: string;
  donorCount: number;
  isOpen: boolean;
  onClose: () => void;
}

interface CampaignStep {
  id: string;
  type: 'email' | 'phone' | 'direct_mail' | 'social';
  delay: number;
  template: string;
  subject?: string;
}

const CampaignBuilder: React.FC<CampaignBuilderProps> = ({ 
  segmentId, 
  segmentName, 
  donorCount, 
  isOpen, 
  onClose 
}) => {
  const [campaignName, setCampaignName] = useState(`${segmentName} Campaign`);
  const [campaignType, setCampaignType] = useState<'single' | 'sequence'>('sequence');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [steps, setSteps] = useState<CampaignStep[]>([
    { id: '1', type: 'email', delay: 0, template: 'welcome', subject: 'We need your help!' }
  ]);

  const templates = {
    'comeback-crew': [
      { id: 'welcome_back', name: 'Welcome Back', subject: 'We miss you!', preview: 'Hi [Name], we noticed you haven\'t been active lately...' },
      { id: 'special_offer', name: 'Special Offer', subject: 'Exclusive opportunity for past supporters', preview: 'As a valued past supporter, we have a special opportunity...' },
      { id: 'impact_story', name: 'Impact Story', subject: 'See the difference you made', preview: 'Your previous support helped us achieve amazing results...' }
    ],
    'neighborhood-mvps': [
      { id: 'major_ask', name: 'Major Donor Ask', subject: 'Your leadership is needed', preview: 'As one of our most valued supporters...' },
      { id: 'exclusive_event', name: 'Exclusive Event', subject: 'You\'re invited to an exclusive briefing', preview: 'We\'d like to invite you to a special event...' },
      { id: 'personal_update', name: 'Personal Update', subject: 'A personal message from our candidate', preview: 'I wanted to reach out personally...' }
    ],
    'default': [
      { id: 'general_ask', name: 'General Ask', subject: 'Support our campaign', preview: 'We need your help to win this election...' },
      { id: 'volunteer', name: 'Volunteer Recruitment', subject: 'Join our team', preview: 'We\'re looking for dedicated volunteers...' },
      { id: 'event_invite', name: 'Event Invitation', subject: 'Join us for an important event', preview: 'You\'re invited to attend our upcoming event...' }
    ]
  };

  const currentTemplates = templates[segmentId as keyof typeof templates] || templates.default;

  const channelIcons = {
    email: EnvelopeIcon,
    phone: PhoneIcon,
    direct_mail: DocumentTextIcon,
    social: SparklesIcon
  };

  const addStep = () => {
    const newStep: CampaignStep = {
      id: Date.now().toString(),
      type: 'email',
      delay: 3,
      template: currentTemplates[0]?.id || 'general_ask',
      subject: 'Follow-up message'
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  const updateStep = (id: string, field: keyof CampaignStep, value: any) => {
    setSteps(steps.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const estimatedMetrics = {
    openRate: segmentId === 'comeback-crew' ? 22 : segmentId === 'neighborhood-mvps' ? 45 : 35,
    responseRate: segmentId === 'comeback-crew' ? 8 : segmentId === 'neighborhood-mvps' ? 25 : 15,
    expectedDonations: Math.floor(donorCount * (segmentId === 'comeback-crew' ? 0.08 : segmentId === 'neighborhood-mvps' ? 0.25 : 0.15)),
    estimatedRevenue: segmentId === 'comeback-crew' ? donorCount * 75 : segmentId === 'neighborhood-mvps' ? donorCount * 350 : donorCount * 125
  };

  const handleLaunchCampaign = () => {
    console.log('Launching campaign:', { campaignName, campaignType, steps });
    alert(`Campaign "${campaignName}" launched successfully!\n\nTargeting ${donorCount} donors\nEstimated revenue: $${estimatedMetrics.estimatedRevenue.toLocaleString()}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Campaign Builder</h2>
            <p className="text-gray-600">Create targeted campaigns for {segmentName} ({donorCount} donors)</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-auto max-h-[70vh]">
          {/* Campaign Setup */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Type</label>
              <select
                value={campaignType}
                onChange={(e) => setCampaignType(e.target.value as 'single' | 'sequence')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="single">Single Message</option>
                <option value="sequence">Multi-Step Sequence</option>
              </select>
            </div>
          </div>

          {/* Template Selection */}
          <Card title="Message Templates">
            <div className="grid grid-cols-1 gap-3">
              {currentTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedTemplate === template.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{template.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">Subject: {template.subject}</p>
                      <p className="text-sm text-gray-500 mt-2">{template.preview}</p>
                    </div>
                    <input
                      type="radio"
                      checked={selectedTemplate === template.id}
                      onChange={() => setSelectedTemplate(template.id)}
                      className="mt-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Campaign Steps */}
          {campaignType === 'sequence' && (
            <Card title="Campaign Sequence">
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const IconComponent = channelIcons[step.type];
                  return (
                    <div key={step.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">
                          {index + 1}
                        </div>
                        <IconComponent className="w-5 h-5 text-gray-600" />
                      </div>

                      <div className="flex-1 grid grid-cols-4 gap-3">
                        <select
                          value={step.type}
                          onChange={(e) => updateStep(step.id, 'type', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="email">Email</option>
                          <option value="phone">Phone Call</option>
                          <option value="direct_mail">Direct Mail</option>
                          <option value="social">Social Media</option>
                        </select>

                        <input
                          type="number"
                          value={step.delay}
                          onChange={(e) => updateStep(step.id, 'delay', parseInt(e.target.value))}
                          placeholder="Days delay"
                          className="px-3 py-2 border border-gray-300 rounded-lg"
                          min="0"
                        />

                        <select
                          value={step.template}
                          onChange={(e) => updateStep(step.id, 'template', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          {currentTemplates.map(template => (
                            <option key={template.id} value={template.id}>{template.name}</option>
                          ))}
                        </select>

                        <input
                          type="text"
                          value={step.subject || ''}
                          onChange={(e) => updateStep(step.id, 'subject', e.target.value)}
                          placeholder="Subject line"
                          className="px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      {steps.length > 1 && (
                        <button
                          onClick={() => removeStep(step.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}

                <Button
                  variant="secondary"
                  onClick={addStep}
                  className="w-full border-dashed"
                >
                  + Add Step
                </Button>
              </div>
            </Card>
          )}

          {/* Performance Estimates */}
          <Card title="Expected Performance">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{estimatedMetrics.openRate}%</div>
                <div className="text-sm text-blue-700">Open Rate</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{estimatedMetrics.responseRate}%</div>
                <div className="text-sm text-green-700">Response Rate</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{estimatedMetrics.expectedDonations}</div>
                <div className="text-sm text-purple-700">Expected Donations</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">${estimatedMetrics.estimatedRevenue.toLocaleString()}</div>
                <div className="text-sm text-orange-700">Est. Revenue</div>
              </div>
            </div>
          </Card>

          {/* Scheduling */}
          <Card title="Campaign Schedule">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  defaultValue={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>Eastern Time (ET)</option>
                  <option>Central Time (CT)</option>
                  <option>Mountain Time (MT)</option>
                  <option>Pacific Time (PT)</option>
                </select>
              </div>
            </div>
          </Card>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Campaign will reach {donorCount} donors with estimated revenue of ${estimatedMetrics.estimatedRevenue.toLocaleString()}
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={onClose}>Cancel</Button>
              <Button variant="secondary">Save Draft</Button>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleLaunchCampaign}
              >
                <SparklesIcon className="w-4 h-4 mr-1" />
                Launch Campaign
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignBuilder;
