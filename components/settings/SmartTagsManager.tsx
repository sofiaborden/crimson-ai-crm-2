import React, { useState } from 'react';
import { SparklesIcon, PlusIcon, PencilIcon, TrashIcon, EyeIcon, ChatBubbleLeftRightIcon } from '../../constants';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import SmartTagEditor from './SmartTagEditor';

interface SmartTag {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  filterDefinition: any;
  count: number;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
}

const SmartTagsManager: React.FC = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [editingTag, setEditingTag] = useState<SmartTag | null>(null);
  const [crimsonGPTPrompt, setCrimsonGPTPrompt] = useState('');
  const [isProcessingPrompt, setIsProcessingPrompt] = useState(false);

  // Mock data for the 5 universal smart tags
  const [smartTags, setSmartTags] = useState<SmartTag[]>([
    {
      id: '1',
      name: 'Big Givers',
      emoji: '💰',
      color: '#10B981',
      description: 'Donors who gave above $500 in the last 12 months',
      filterDefinition: { totalGiving: { min: 500, period: '12months' } },
      count: 1247,
      isActive: true,
      createdBy: 'System',
      createdDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Prime Persuadables',
      emoji: '🎯',
      color: '#8B5CF6',
      description: 'FL residents, Age 35-44, moderate political engagement',
      filterDefinition: { state: 'FL', ageRange: [35, 44], politicalEngagement: 'moderate' },
      count: 892,
      isActive: true,
      createdBy: 'System',
      createdDate: '2024-01-15'
    },
    {
      id: '3',
      name: 'Not Yet Registered to Vote',
      emoji: '🚧',
      color: '#F59E0B',
      description: 'Individuals lacking voter registration data',
      filterDefinition: { voterRegistration: 'unregistered' },
      count: 456,
      isActive: true,
      createdBy: 'System',
      createdDate: '2024-01-15'
    },
    {
      id: '4',
      name: 'New & Rising Donors',
      emoji: '⚡',
      color: '#3B82F6',
      description: 'First-time donors in last 6 months or recent upgrades',
      filterDefinition: { firstGiftDate: { within: '6months' }, or: { upgradedGiving: true } },
      count: 324,
      isActive: true,
      createdBy: 'System',
      createdDate: '2024-01-15'
    },
    {
      id: '5',
      name: 'Lapsed / At-Risk',
      emoji: '🕒',
      color: '#EF4444',
      description: 'Donors who haven\'t given in 18+ months',
      filterDefinition: { lastGiftDate: { before: '18months' } },
      count: 678,
      isActive: false,
      createdBy: 'System',
      createdDate: '2024-01-15'
    }
  ]);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-crimson-blue bg-opacity-10 p-2 rounded-lg">
            <SparklesIcon className="w-6 h-6 text-crimson-blue" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Smart Tags</h3>
            <p className="text-sm text-gray-600">AI-powered dynamic labels for your contacts</p>
          </div>
        </div>
        <Button onClick={() => setShowEditor(true)} className="bg-crimson-blue hover:bg-crimson-dark-blue">
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Smart Tag
        </Button>
      </div>

      {/* CrimsonGPT Prompt Box */}
      <div className="bg-gradient-to-r from-crimson-accent-blue bg-opacity-5 to-crimson-blue bg-opacity-5 border border-crimson-accent-blue border-opacity-30 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <ChatBubbleLeftRightIcon className="w-5 h-5 text-crimson-blue" />
          <h4 className="font-medium text-crimson-blue">CrimsonGPT Smart Tag Creator</h4>
          <SparklesIcon className="w-4 h-4 text-crimson-accent-blue" />
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={crimsonGPTPrompt}
            onChange={(e) => setCrimsonGPTPrompt(e.target.value)}
            placeholder="Describe your ideal tag: 'Find all donors under 35 who gave more than $100 last year and live in Miami'"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
            onKeyDown={(e) => e.key === 'Enter' && handleCrimsonGPTPrompt()}
          />
          <Button 
            onClick={handleCrimsonGPTPrompt}
            disabled={!crimsonGPTPrompt.trim() || isProcessingPrompt}
            className="bg-crimson-blue hover:bg-crimson-dark-blue"
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
        <p className="text-xs text-gray-600 mt-2">
          CrimsonGPT will convert your description into smart filters and suggest a tag name and emoji.
        </p>
      </div>

      {/* Smart Tags List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h4 className="font-medium text-gray-900">Active Smart Tags</h4>
          <p className="text-sm text-gray-600">Dynamic labels that automatically update based on your data</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {smartTags.map((tag) => (
            <div key={tag.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
                    style={{ backgroundColor: `${tag.color}20`, border: `2px solid ${tag.color}30` }}
                  >
                    {tag.emoji}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h5 className="font-semibold text-gray-900">{tag.name}</h5>
                      <Badge 
                        className={`text-xs ${tag.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                      >
                        {tag.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {tag.count.toLocaleString()} contacts
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{tag.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Created by {tag.createdBy} on {new Date(tag.createdDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => toggleTagStatus(tag.id)}
                    className="text-xs"
                  >
                    {tag.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleEditTag(tag)}
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleDeleteTag(tag.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Tag Editor Modal */}
      {showEditor && (
        <SmartTagEditor
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

export default SmartTagsManager;
