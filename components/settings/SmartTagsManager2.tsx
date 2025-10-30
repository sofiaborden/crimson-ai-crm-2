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

const SmartTagsManager2: React.FC = () => {
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
      color: '#10b981',
      description: 'Donors who gave above $500 in the last 12 months',
      category: 'smart-tags',
      processingType: 'dynamic',
      filterDefinition: { minAmount: 500, timeframe: '12months' },
      count: 1247,
      isActive: true,
      isInclusionCriteria: true,
      associatedFlows: [
        { id: 'flow-1', name: 'Big Giver Welcome Series', type: 'dynamic', isActive: true, isAutoCreated: false },
        { id: 'flow-2', name: 'VIP Event Invitations', type: 'dynamic', isActive: true, isAutoCreated: false }
      ],
      createdBy: 'System',
      createdDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Prime Persuadables',
      emoji: '🎯',
      color: '#3b82f6',
      description: 'High-capacity donors with low engagement scores',
      category: 'smart-tags',
      processingType: 'dynamic',
      filterDefinition: { capacity: 'high', engagement: 'low' },
      count: 892,
      isActive: true,
      isInclusionCriteria: true,
      associatedFlows: [
        { id: 'flow-3', name: 'Engagement Boost Campaign', type: 'dynamic', isActive: true, isAutoCreated: true }
      ],
      createdBy: 'AI System',
      createdDate: '2024-01-20'
    },
    {
      id: '3',
      name: 'Board Members',
      emoji: '👔',
      color: '#8b5cf6',
      description: 'Current and former board members',
      category: 'board',
      processingType: 'static',
      filterDefinition: { role: 'board' },
      count: 24,
      isActive: true,
      isInclusionCriteria: false,
      createdBy: 'Sarah Johnson',
      createdDate: '2024-01-10'
    },
    {
      id: '4',
      name: 'Lapsed Donors',
      emoji: '⏰',
      color: '#f59e0b',
      description: 'Previously active donors who haven\'t given in 18+ months',
      category: 'smart-tags',
      processingType: 'dynamic',
      filterDefinition: { lastGift: '18months', previousGifts: 'yes' },
      count: 2156,
      isActive: true,
      isInclusionCriteria: true,
      associatedFlows: [
        { id: 'flow-4', name: 'Win-Back Campaign', type: 'dynamic', isActive: true, isAutoCreated: true }
      ],
      createdBy: 'AI System',
      createdDate: '2024-01-25'
    },
    {
      id: '5',
      name: 'Event Attendees',
      emoji: '🎪',
      color: '#ec4899',
      description: 'People who attended events in the last 6 months',
      category: 'attributes',
      processingType: 'dynamic',
      filterDefinition: { eventAttendance: '6months' },
      count: 567,
      isActive: true,
      isInclusionCriteria: false,
      createdBy: 'Mike Chen',
      createdDate: '2024-02-01'
    },
    {
      id: '6',
      name: 'Major Gift Prospects',
      emoji: '🏆',
      color: '#dc2626',
      description: 'High-capacity individuals identified for major gift cultivation',
      category: 'flags',
      processingType: 'static',
      filterDefinition: { capacity: 'major', cultivation: 'active' },
      count: 89,
      isActive: true,
      isInclusionCriteria: false,
      createdBy: 'Development Team',
      createdDate: '2024-01-05'
    }
  ]);

  // Category options for filtering
  const categoryOptions = [
    { value: 'all', label: 'All Categories', count: smartTags.length },
    { value: 'smart-tags', label: 'Smart Tags', count: smartTags.filter(t => t.category === 'smart-tags').length },
    { value: 'flags', label: 'Flags', count: smartTags.filter(t => t.category === 'flags').length },
    { value: 'keywords', label: 'Keywords', count: smartTags.filter(t => t.category === 'keywords').length },
    { value: 'attributes', label: 'Attributes', count: smartTags.filter(t => t.category === 'attributes').length },
    { value: 'clubs', label: 'Clubs', count: smartTags.filter(t => t.category === 'clubs').length },
    { value: 'contact-flag', label: 'Contact Flags', count: smartTags.filter(t => t.category === 'contact-flag').length },
    { value: 'membership', label: 'Membership', count: smartTags.filter(t => t.category === 'membership').length },
    { value: 'volunteers', label: 'Volunteers', count: smartTags.filter(t => t.category === 'volunteers').length },
    { value: 'board', label: 'Board', count: smartTags.filter(t => t.category === 'board').length }
  ];

  // Status options for filtering
  const statusOptions = [
    { value: 'all', label: 'All Status', count: smartTags.length },
    { value: 'active', label: 'Active', count: smartTags.filter(t => t.isActive).length },
    { value: 'inactive', label: 'Inactive', count: smartTags.filter(t => !t.isActive).length },
    { value: 'dynamic', label: 'Dynamic', count: smartTags.filter(t => t.processingType === 'dynamic').length },
    { value: 'static', label: 'Static', count: smartTags.filter(t => t.processingType === 'static').length }
  ];

  // Filter tags based on selected filters
  const filteredTags = smartTags.filter(tag => {
    const categoryMatch = categoryFilter === 'all' || tag.category === categoryFilter;
    const statusMatch = statusFilter === 'all' || 
      (statusFilter === 'active' && tag.isActive) ||
      (statusFilter === 'inactive' && !tag.isActive) ||
      (statusFilter === 'dynamic' && tag.processingType === 'dynamic') ||
      (statusFilter === 'static' && tag.processingType === 'static');
    
    return categoryMatch && statusMatch;
  });

  // Handle dropdown clicks
  const handleDropdownClick = (tagId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenDropdown(openDropdown === tagId ? null : tagId);
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown && dropdownRefs.current[openDropdown] && 
          !dropdownRefs.current[openDropdown]?.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

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
      const newTag = {
        ...updatedTag,
        id: Date.now().toString(),
        createdBy: 'Current User',
        createdDate: new Date().toISOString().split('T')[0]
      };
      setSmartTags(prev => [...prev, newTag]);
    }
    setShowEditor(false);
    setEditingTag(null);
  };

  const handleDeleteTag = (tagId: string) => {
    setSmartTags(prev => prev.filter(tag => tag.id !== tagId));
    closeDropdown();
  };

  const processCrimsonGPTPrompt = async () => {
    if (!crimsonGPTPrompt.trim()) return;
    
    setIsProcessingPrompt(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock response - in real implementation, this would call the AI service
    const mockTag: SmartTag = {
      id: Date.now().toString(),
      name: 'AI Generated Tag',
      emoji: '🤖',
      color: '#6366f1',
      description: `Generated from: "${crimsonGPTPrompt}"`,
      category: 'smart-tags',
      processingType: 'dynamic',
      filterDefinition: { aiGenerated: true, prompt: crimsonGPTPrompt },
      count: 0,
      isActive: true,
      isInclusionCriteria: true,
      createdBy: 'CrimsonGPT',
      createdDate: new Date().toISOString().split('T')[0]
    };
    
    setSmartTags(prev => [...prev, mockTag]);
    setCrimsonGPTPrompt('');
    setIsProcessingPrompt(false);
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
            <h3 className="text-xl font-semibold text-gray-900">Smart Tags 2</h3>
            <p className="text-sm text-gray-600">Enhanced unified system for all people codes and dynamic labels</p>
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
            onKeyDown={(e) => e.key === 'Enter' && processCrimsonGPTPrompt()}
          />
          <Button
            onClick={processCrimsonGPTPrompt}
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
                      <Badge variant="secondary" className="text-xs">
                        {tag.count.toLocaleString()} people
                      </Badge>
                      <Badge
                        variant={tag.processingType === 'dynamic' ? 'primary' : 'secondary'}
                        className="text-xs"
                      >
                        {tag.processingType}
                      </Badge>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                      {tag.description}
                    </p>

                    {/* Associated Flows */}
                    {tag.associatedFlows && tag.associatedFlows.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-500 mb-2">Associated Smart Flows:</p>
                        <div className="flex flex-wrap gap-2">
                          {tag.associatedFlows.map((flow) => (
                            <div
                              key={flow.id}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                            >
                              <div className={`w-1.5 h-1.5 rounded-full ${flow.isActive ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                              {flow.name}
                              {flow.isAutoCreated && (
                                <span className="text-blue-500 text-xs">🤖</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Created by {tag.createdBy}</span>
                      <span>•</span>
                      <span>{tag.createdDate}</span>
                      <span>•</span>
                      <span className="capitalize">{tag.category.replace('-', ' ')}</span>
                    </div>
                  </div>
                </div>

                {/* Right Section - Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="relative" ref={el => dropdownRefs.current[tag.id] = el}>
                    <button
                      onClick={(e) => handleDropdownClick(tag.id, e)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <EllipsisVerticalIcon className="w-5 h-5" />
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
                            onClick={() => handleEditTag(tag)}
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-crimson-blue hover:text-white transition-colors"
                          >
                            <PencilIcon className="w-4 h-4" />
                            Edit Tag
                          </button>
                          <button
                            onClick={() => handleDeleteTag(tag.id)}
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <TrashIcon className="w-4 h-4" />
                            Delete Tag
                          </button>
                        </div>
                      </div>
                    )}
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
          onSave={handleSaveTag}
        />
      )}
    </div>
  );
};

export default SmartTagsManager2;
