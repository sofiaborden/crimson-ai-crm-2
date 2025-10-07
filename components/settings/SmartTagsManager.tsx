import React, { useState, useRef, useEffect } from 'react';
import { SparklesIcon, PlusIcon, PencilIcon, TrashIcon, EyeIcon, ChatBubbleLeftRightIcon, EllipsisVerticalIcon, ChevronDownIcon } from '../../constants';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import SmartTagEditor from './SmartTagEditor';

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

const SmartTagsManager: React.FC = () => {
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

  // Mock data for unified smart tags including all people codes
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
      createdDate: '2024-01-15'
    },
    {
      id: '3',
      name: 'Not Yet Registered to Vote',
      emoji: '🚧',
      color: '#F59E0B',
      description: 'Individuals lacking voter registration data',
      category: 'smart-tags',
      processingType: 'dynamic',
      filterDefinition: { voterRegistration: 'unregistered' },
      inclusionTrigger: { voterRegistration: 'unregistered' },
      count: 456,
      isActive: true,
      isInclusionCriteria: false,
      associatedFlows: [],
      createdBy: 'System',
      createdDate: '2024-01-15'
    },
    {
      id: '4',
      name: 'New & Rising Donors',
      emoji: '⚡',
      color: '#3B82F6',
      description: 'First-time donors in last 6 months or recent upgrades',
      category: 'smart-tags',
      processingType: 'dynamic',
      filterDefinition: { firstGiftDate: { within: '6months' }, or: { upgradedGiving: true } },
      inclusionTrigger: { firstGiftDate: { within: '6months' }, or: { upgradedGiving: true } },
      count: 324,
      isActive: true,
      isInclusionCriteria: true,
      associatedFlows: [
        {
          id: 'flow-4',
          name: 'New & Rising Donors - Inclusion Flow',
          type: 'dynamic',
          isActive: true,
          isAutoCreated: true
        },
        {
          id: 'flow-5',
          name: 'New Donor Welcome Journey',
          type: 'dynamic',
          isActive: true,
          isAutoCreated: false
        }
      ],
      createdBy: 'System',
      createdDate: '2024-01-15'
    },
    {
      id: '5',
      name: 'Lapsed / At-Risk',
      emoji: '🕒',
      color: '#EF4444',
      description: 'Donors who haven\'t given in 18+ months',
      category: 'smart-tags',
      processingType: 'dynamic',
      filterDefinition: { lastGiftDate: { before: '18months' } },
      inclusionTrigger: { lastGiftDate: { before: '18months' } },
      count: 678,
      isActive: false,
      isInclusionCriteria: true,
      associatedFlows: [
        {
          id: 'flow-6',
          name: 'Lapsed / At-Risk - Inclusion Flow',
          type: 'dynamic',
          isActive: false,
          isAutoCreated: true
        },
        {
          id: 'flow-7',
          name: 'Lapsed Donor Re-engagement',
          type: 'dynamic',
          isActive: true,
          isAutoCreated: false
        }
      ],
      createdBy: 'System',
      createdDate: '2024-01-15'
    },
    // Example Flags
    {
      id: '6',
      name: 'VIP Donor',
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
            <h3 className="text-xl font-semibold text-gray-900">Smart Tags</h3>
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
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                    style={{ backgroundColor: `${tag.color}20`, border: `2px solid ${tag.color}30` }}
                  >
                    {tag.emoji}
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
