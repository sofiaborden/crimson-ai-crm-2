import React, { useState, useEffect, useCallback, useRef } from 'react';
import { XMarkIcon, SparklesIcon, FlagIcon, FunnelIcon, EyeIcon, PlusIcon, ChevronDownIcon, ArrowPathIcon, UsersIcon, ArrowDownTrayIcon, DocumentTextIcon } from '../../constants';
import Button from '../ui/Button';
import FlowBadge from '../ui/FlowBadge';
import SmartTagFilters from './SmartTagFilters';
import ActionSelector from './ActionSelector';
import TriggerConfigModal from './TriggerConfigModal';

interface AssociatedFlow {
  id: string;
  name: string;
  type: 'dynamic' | 'static';
  isActive: boolean;
  isAutoCreated: boolean;
}

interface SmartTag {
  id?: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  category: 'smart-tags' | 'flags' | 'keywords' | 'attributes' | 'clubs' | 'contact-flag' | 'membership' | 'volunteers' | 'board';
  processingType: 'static' | 'dynamic';
  filterDefinition: any;
  inclusionTrigger?: any;
  removalTrigger?: any;
  count?: number;
  isActive: boolean;
  isInclusionCriteria: boolean;
  associatedFlows?: AssociatedFlow[];
  createdBy: string;
  createdDate: string;
}

interface SmartTagEditorProps {
  tag?: SmartTag | null;
  onClose: () => void;
  onSave: (tag: SmartTag) => void;
}

const SmartTagEditor: React.FC<SmartTagEditorProps> = ({ tag, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    emoji: '🏷️',
    color: '#3B82F6',
    description: '',
    category: 'smart-tags' as const,
    processingType: 'static' as const,
    filterDefinition: [],
    inclusionTrigger: null,
    removalTrigger: null,
    isActive: true,
    isInclusionCriteria: false,
    associatedFlows: [] as AssociatedFlow[]
  });
  const [showFilters, setShowFilters] = useState(false);
  const [previewCount, setPreviewCount] = useState(0);
  const [inclusionCount, setInclusionCount] = useState(0);
  const [removalCount, setRemovalCount] = useState(0);
  const [flowCounts, setFlowCounts] = useState<Record<string, number>>({});
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewTimeout, setPreviewTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showInclusionTrigger, setShowInclusionTrigger] = useState(false);
  const [showRemovalTrigger, setShowRemovalTrigger] = useState(false);
  const [showEmojiDropdown, setShowEmojiDropdown] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [showFlowsModal, setShowFlowsModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const emojiDropdownRef = useRef<HTMLDivElement>(null);
  const colorDropdownRef = useRef<HTMLDivElement>(null);

  const emojiOptions = ['💰', '🎯', '🚧', '⚡', '🕒', '🔥', '⭐', '🎪', '🎨', '🏆', '🎁', '🌟', '💎', '🚀', '🎊', '🎉', '🏷️', '📊', '👔', '🏥', '🏫', '🏢', '🎓', '🏛️', '🔍', '📌', '🤝'];
  const colorOptions = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ];

  // Mock data for preview modal
  const mockPreviewData = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '(555) 123-4567',
      location: 'Arlington, VA',
      totalGiving: 1500,
      lastGift: '2024-08-15',
      giftCount: 5
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      phone: '(555) 234-5678',
      location: 'Alexandria, VA',
      totalGiving: 750,
      lastGift: '2024-07-01',
      giftCount: 3
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'mchen@example.com',
      phone: '(703) 555-9876',
      location: 'Fairfax, VA',
      totalGiving: 1200,
      lastGift: '2024-05-20',
      giftCount: 8
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      phone: '(571) 555-0123',
      location: 'Reston, VA',
      totalGiving: 2000,
      lastGift: '2024-09-10',
      giftCount: 12
    },
    {
      id: '5',
      name: 'Robert Wilson',
      email: 'rwilson@example.com',
      phone: '(703) 555-4567',
      location: 'McLean, VA',
      totalGiving: 500,
      lastGift: '2024-06-30',
      giftCount: 2
    }
  ];

  const categoryOptions = [
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

  // Suggest emoji and color based on category
  const getSuggestedEmojiAndColor = (category: string) => {
    const suggestions = {
      'smart-tags': { emoji: '🎯', color: '#3B82F6' },
      'flags': { emoji: '🏷️', color: '#EF4444' },
      'keywords': { emoji: '🔍', color: '#10B981' },
      'attributes': { emoji: '⭐', color: '#F59E0B' },
      'clubs': { emoji: '🎪', color: '#8B5CF6' },
      'contact-flag': { emoji: '📌', color: '#06B6D4' },
      'membership': { emoji: '👔', color: '#84CC16' },
      'volunteers': { emoji: '🤝', color: '#F97316' },
      'board': { emoji: '🏛️', color: '#EC4899' }
    };
    return suggestions[category as keyof typeof suggestions] || { emoji: '🏷️', color: '#3B82F6' };
  };

  useEffect(() => {
    if (tag) {
      // Existing tag - use current values
      setFormData({
        name: tag.name,
        emoji: tag.emoji,
        color: tag.color,
        description: tag.description,
        category: tag.category,
        processingType: tag.processingType,
        filterDefinition: tag.filterDefinition,
        inclusionTrigger: tag.inclusionTrigger || null,
        removalTrigger: tag.removalTrigger || null,
        isActive: tag.isActive,
        isInclusionCriteria: tag.isInclusionCriteria,
        associatedFlows: tag.associatedFlows || []
      });
      // Load preview for existing tag
      setTimeout(() => handlePreview(), 500);
    } else {
      // New tag - apply suggestions based on default category
      const suggestions = getSuggestedEmojiAndColor('smart-tags');
      setFormData(prev => ({
        ...prev,
        emoji: suggestions.emoji,
        color: suggestions.color
      }));
    }
  }, [tag]);

  // Handle category change to suggest new emoji/color for new tags
  const handleCategoryChange = (newCategory: string) => {
    const suggestions = getSuggestedEmojiAndColor(newCategory);
    setFormData(prev => ({
      ...prev,
      category: newCategory as any,
      // Only suggest new emoji/color if this is a new tag (no existing tag)
      ...(tag ? {} : { emoji: suggestions.emoji, color: suggestions.color })
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Please enter a tag name');
      return;
    }

    const newTag: SmartTag = {
      ...formData,
      count: previewCount,
      createdBy: 'Current User',
      createdDate: new Date().toISOString()
    };

    onSave(newTag);
  };

  const handlePreview = async () => {
    setIsLoadingPreview(true);
    // Simulate API call to get count
    setTimeout(() => {
      const totalCount = Math.floor(Math.random() * 1000) + 100;
      const inclusionCountValue = Math.floor(Math.random() * 800) + 50;
      const removalCountValue = Math.floor(Math.random() * 200) + 10;

      setPreviewCount(totalCount);
      setInclusionCount(inclusionCountValue);
      setRemovalCount(removalCountValue);

      // Generate flow counts for associated flows
      if (formData.associatedFlows && formData.associatedFlows.length > 0) {
        const newFlowCounts: Record<string, number> = {};
        formData.associatedFlows.forEach(flow => {
          newFlowCounts[flow.id] = Math.floor(Math.random() * 300) + 20;
        });
        setFlowCounts(newFlowCounts);
      }

      setIsLoadingPreview(false);
    }, 1000);
  };

  const handleFiltersChange = useCallback((filters: any[]) => {
    setFormData(prev => ({ ...prev, filterDefinition: filters }));

    // Clear existing timeout
    if (previewTimeout) {
      clearTimeout(previewTimeout);
    }

    // Debounce the preview update to prevent infinite loops
    const newTimeout = setTimeout(() => {
      handlePreview();
    }, 500);

    setPreviewTimeout(newTimeout);
  }, [previewTimeout]);

  // Run Now functionality for filters
  const handleRunNow = useCallback(async (filters: any[]): Promise<number> => {
    // Simulate API call to execute filters and get count
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock calculation based on filter complexity
        const baseCount = 1000;
        const filterMultiplier = Math.max(0.1, 1 - (filters.length * 0.15));
        const randomVariation = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
        const count = Math.floor(baseCount * filterMultiplier * randomVariation);
        resolve(count);
      }, 1500); // Simulate network delay
    });
  }, []);

  const handleExportCSV = () => {
    // Create CSV content
    const headers = ['Name', 'Email', 'Phone', 'Location', 'Total Giving', 'Last Gift', 'Gift Count'];
    const csvContent = [
      headers.join(','),
      ...mockPreviewData.map(record => [
        record.name,
        record.email,
        record.phone,
        record.location,
        `$${record.totalGiving}`,
        record.lastGift,
        record.giftCount
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${formData.name || 'smart-tag'}-records.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = () => {
    // For demo purposes, we'll create a simple Excel-compatible CSV
    const headers = ['Name', 'Email', 'Phone', 'Location', 'Total Giving', 'Last Gift', 'Gift Count'];
    const csvContent = [
      headers.join('\t'), // Use tabs for Excel compatibility
      ...mockPreviewData.map(record => [
        record.name,
        record.email,
        record.phone,
        record.location,
        record.totalGiving,
        record.lastGift,
        record.giftCount
      ].join('\t'))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${formData.name || 'smart-tag'}-records.xlsx`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (previewTimeout) {
        clearTimeout(previewTimeout);
      }
    };
  }, [previewTimeout]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiDropdownRef.current && !emojiDropdownRef.current.contains(event.target as Node)) {
        setShowEmojiDropdown(false);
      }
      if (colorDropdownRef.current && !colorDropdownRef.current.contains(event.target as Node)) {
        setShowColorDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-crimson-blue to-crimson-dark-blue text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {tag ? 'Edit Smart Tag' : 'Create Smart Tag'}
                </h2>
                <p className="text-crimson-accent-blue text-sm">Define dynamic labels for your contacts</p>
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

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Tag Configuration */}
            <div className="space-y-6 relative">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FlagIcon className="w-5 h-5 text-crimson-blue" />
                  Tag Configuration
                </h3>

                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Big Givers, VIP Donor, Healthcare"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what this tag represents..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                    />
                  </div>

                  {/* Tag Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tag Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                    >
                      {categoryOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {!tag && (
                      <p className="text-xs text-gray-500 mt-1">
                        Emoji and color will be suggested based on category
                      </p>
                    )}
                  </div>

                  {/* Emoji and Color - Visual Dropdowns */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Emoji Dropdown */}
                    <div className="relative" ref={emojiDropdownRef}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Emoji</label>
                      <button
                        type="button"
                        onClick={() => setShowEmojiDropdown(!showEmojiDropdown)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue bg-white flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-lg">{formData.emoji}</span>
                          <span className="text-gray-700">
                            {formData.emoji === '💰' ? 'Money' : formData.emoji === '🎯' ? 'Target' : formData.emoji === '🚧' ? 'Construction' : formData.emoji === '⚡' ? 'Lightning' : formData.emoji === '🕒' ? 'Clock' : formData.emoji === '🔥' ? 'Fire' : formData.emoji === '⭐' ? 'Star' : formData.emoji === '🎪' ? 'Circus' : formData.emoji === '🎨' ? 'Art' : formData.emoji === '🏆' ? 'Trophy' : formData.emoji === '🎁' ? 'Gift' : formData.emoji === '🌟' ? 'Sparkle' : formData.emoji === '💎' ? 'Diamond' : formData.emoji === '🚀' ? 'Rocket' : formData.emoji === '🎊' ? 'Confetti' : formData.emoji === '🎉' ? 'Party' : formData.emoji === '🏷️' ? 'Tag' : formData.emoji === '📊' ? 'Chart' : formData.emoji === '👔' ? 'Business' : formData.emoji === '🏥' ? 'Hospital' : formData.emoji === '🏫' ? 'School' : formData.emoji === '🏢' ? 'Office' : formData.emoji === '🎓' ? 'Graduate' : formData.emoji === '🏛️' ? 'Government' : formData.emoji === '🔍' ? 'Search' : formData.emoji === '📌' ? 'Pin' : formData.emoji === '🤝' ? 'Handshake' : ''}
                          </span>
                        </span>
                        <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${showEmojiDropdown ? 'rotate-180' : ''}`} />
                      </button>

                      {showEmojiDropdown && (
                        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl z-[1000] p-3 max-w-xs">
                          <div className="grid grid-cols-6 gap-1.5 max-h-32 overflow-y-auto">
                            {emojiOptions.map((emoji) => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, emoji }));
                                  setShowEmojiDropdown(false);
                                }}
                                className={`w-7 h-7 rounded border flex items-center justify-center text-sm hover:bg-gray-50 transition-colors ${
                                  formData.emoji === emoji ? 'border-crimson-blue bg-crimson-blue bg-opacity-10' : 'border-gray-200'
                                }`}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Color Dropdown */}
                    <div className="relative" ref={colorDropdownRef}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                      <button
                        type="button"
                        onClick={() => setShowColorDropdown(!showColorDropdown)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue bg-white flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded border border-gray-300"
                            style={{ backgroundColor: formData.color }}
                          ></div>
                          <span className="text-gray-700">
                            {formData.color === '#3B82F6' ? 'Blue' : formData.color === '#10B981' ? 'Green' : formData.color === '#F59E0B' ? 'Yellow' : formData.color === '#EF4444' ? 'Red' : formData.color === '#8B5CF6' ? 'Purple' : formData.color === '#06B6D4' ? 'Cyan' : formData.color === '#84CC16' ? 'Lime' : formData.color === '#F97316' ? 'Orange' : formData.color === '#EC4899' ? 'Pink' : formData.color === '#6366F1' ? 'Indigo' : 'Custom'}
                          </span>
                        </span>
                        <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${showColorDropdown ? 'rotate-180' : ''}`} />
                      </button>

                      {showColorDropdown && (
                        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl z-[1000] p-3 max-w-xs">
                          <div className="grid grid-cols-5 gap-1.5">
                            {colorOptions.map((color) => (
                              <button
                                key={color}
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, color }));
                                  setShowColorDropdown(false);
                                }}
                                className={`w-7 h-7 rounded border-2 transition-all ${
                                  formData.color === color ? 'border-gray-800 scale-105' : 'border-gray-200'
                                }`}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Processing Type - Moved up for better space utilization */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Processing Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="processingType"
                          value="static"
                          checked={formData.processingType === 'static'}
                          onChange={(e) => setFormData(prev => ({ ...prev, processingType: e.target.value as any }))}
                          className="text-crimson-blue focus:ring-crimson-blue"
                        />
                        <div className="font-medium text-gray-900 text-sm">📌 Static Flow</div>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="processingType"
                          value="dynamic"
                          checked={formData.processingType === 'dynamic'}
                          onChange={(e) => setFormData(prev => ({ ...prev, processingType: e.target.value as any }))}
                          className="text-crimson-blue focus:ring-crimson-blue"
                        />
                        <div className="font-medium text-gray-900 text-sm">⚡ Dynamic Flow</div>
                      </label>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                        style={{
                          backgroundColor: formData.color + '20',
                          border: '2px solid ' + formData.color + '30'
                        }}
                      >
                        {formData.emoji}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{formData.name || 'Tag Name'}</div>
                        <div className="text-sm text-gray-600">{formData.description || 'Description'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Processing Type Explanation */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Processing Type</h4>
                    {formData.processingType === 'static' ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-lg">📌</span>
                          <span className="font-medium text-gray-900">Static Flow</span>
                        </div>
                        <div className="text-xs text-gray-600 pl-6">
                          Manual application - This tag will be manually applied to contacts. No automatic processing will occur.
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-lg">⚡</span>
                          <span className="font-medium text-gray-900">Dynamic Flow</span>
                        </div>
                        <div className="text-xs text-gray-600 pl-6">
                          Auto-processing - This tag will automatically add/remove contacts based on your criteria. Inclusion criteria determine who gets the tag, and removal criteria determine what happens when they no longer qualify.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Dynamic Flow Configuration */}
            <div className="space-y-6">
              {/* Overall Record Count Preview - Always Visible */}
              <div className="bg-gradient-to-r from-crimson-blue to-crimson-dark-blue rounded-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <UsersIcon className="w-5 h-5" />
                    Record Count Preview
                  </h3>
                  <Button
                    size="sm"
                    onClick={handlePreview}
                    disabled={isLoadingPreview}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-white border-opacity-30"
                  >
                    {isLoadingPreview ? (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Refresh
                      </div>
                    ) : (
                      'Refresh'
                    )}
                  </Button>
                </div>

                <button
                  onClick={() => setShowPreviewModal(true)}
                  disabled={isLoadingPreview || previewCount === 0}
                  className="w-full text-center py-4 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  <div className="text-3xl font-bold text-white mb-2">
                    {isLoadingPreview ? '...' : previewCount.toLocaleString()}
                  </div>
                  <div className="text-crimson-accent-blue text-sm">
                    {previewCount === 1 ? 'record matches' : 'records match'} this Smart Tag
                  </div>
                  {!isLoadingPreview && previewCount > 0 && (
                    <div className="text-xs text-white mt-2 flex items-center justify-center gap-1 opacity-80">
                      <EyeIcon className="w-3 h-3" />
                      Click to view and export records
                    </div>
                  )}
                </button>
              </div>

              {formData.processingType === 'dynamic' ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FunnelIcon className="w-5 h-5 text-crimson-blue" />
                    Dynamic Flow Configuration
                  </h3>

                  <div className="space-y-4">
                    {/* Inclusion Trigger Button */}
                    <div>
                      <Button
                        onClick={() => setShowInclusionTrigger(true)}
                        className="w-full bg-crimson-blue hover:bg-crimson-dark-blue text-white"
                      >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Set Inclusion Criteria
                      </Button>




                    </div>

                    {/* Removal Trigger Button */}
                    <div>
                      <Button
                        onClick={() => setShowRemovalTrigger(true)}
                        variant="secondary"
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Set Removal Criteria
                      </Button>
                      {formData.removalTrigger && (
                        <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <div className="text-sm text-gray-700">
                            ✓ Removal criteria configured
                          </div>
                          {!isLoadingPreview && (
                            <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                              <UsersIcon className="w-4 h-4" />
                              <span className="font-medium">{removalCount.toLocaleString()}</span>
                              <span>records meet removal criteria</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Associated Flow Counts */}
                    {formData.associatedFlows && formData.associatedFlows.length > 0 && !isLoadingPreview && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <h5 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
                          <ArrowPathIcon className="w-4 h-4" />
                          Associated Flow Counts
                        </h5>
                        <div className="space-y-1">
                          {formData.associatedFlows.map((flow) => (
                            <div key={flow.id} className="text-sm text-blue-700 flex items-center justify-between">
                              <span>{flow.name}:</span>
                              <span className="font-medium">{flowCounts[flow.id]?.toLocaleString() || '0'} records</span>
                            </div>
                          ))}
                        </div>

                        {/* View All Flows Button - Positioned with flow counts for better visual grouping */}
                        {tag && (
                          <button
                            onClick={() => setShowFlowsModal(true)}
                            className="mt-3 flex items-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded-lg transition-all duration-200 text-sm font-medium text-blue-800 w-full justify-center"
                          >
                            <ArrowPathIcon className="w-4 h-4" />
                            View All Flows: {formData.associatedFlows.length}
                          </button>
                        )}
                      </div>
                    )}


                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FunnelIcon className="w-5 h-5 text-crimson-blue" />
                    Static Configuration
                  </h3>


                </div>
              )}

              {/* Filter Configuration for Static Tags */}
              {formData.processingType === 'static' && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <FunnelIcon className="w-5 h-5 text-crimson-blue" />
                      Filter Criteria (Optional)
                    </h3>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </Button>
                  </div>

                  {showFilters && (
                    <div className="mb-4">
                      <SmartTagFilters
                        onFiltersChange={handleFiltersChange}
                        initialFilters={formData.filterDefinition}
                        onRunNow={handleRunNow}
                        showRunNow={true}
                      />
                    </div>
                  )}


                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-white">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-crimson-blue hover:bg-crimson-dark-blue">
            {tag ? 'Update Tag' : 'Create Tag'}
          </Button>
        </div>
      </div>

      {/* Inclusion Trigger Modal */}
      {showInclusionTrigger && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
            <div className="bg-gradient-to-r from-crimson-blue to-crimson-dark-blue text-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Set Inclusion Criteria</h3>
                <button
                  onClick={() => setShowInclusionTrigger(false)}
                  className="text-white hover:text-crimson-accent-blue transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Define the criteria that will automatically add contacts to this tag.
              </p>
              <SmartTagFilters
                onFiltersChange={(filters) => setFormData(prev => ({ ...prev, inclusionTrigger: filters }))}
                initialFilters={formData.inclusionTrigger || []}
                onRunNow={handleRunNow}
                showRunNow={true}
              />
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="secondary" onClick={() => setShowInclusionTrigger(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => setShowInclusionTrigger(false)}
                  className="bg-crimson-blue hover:bg-crimson-dark-blue"
                >
                  Save Criteria
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Removal Trigger Modal */}
      {showRemovalTrigger && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
            <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Set Removal Criteria</h3>
                <button
                  onClick={() => setShowRemovalTrigger(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Define what happens when contacts no longer meet the inclusion criteria.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    When contacts no longer meet inclusion criteria:
                  </label>
                  <select
                    value={formData.removalTrigger?.action || 'remove_code'}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      removalTrigger: { ...prev.removalTrigger, action: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                  >
                    <option value="remove_code">Remove Code</option>
                    <option value="mark_inactive">Mark Inactive</option>
                    <option value="mark_inactive_with_date">Mark Inactive with End Date</option>
                    <option value="add_action">Add Action</option>
                  </select>
                </div>

                {formData.removalTrigger?.action === 'add_action' && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-3">
                      Select an action to perform when contacts are removed from this tag:
                    </p>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        // This would open the ActionSelector
                        console.log('Open ActionSelector for removal trigger');
                      }}
                    >
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Add Action
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="secondary" onClick={() => setShowRemovalTrigger(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => setShowRemovalTrigger(false)}
                  className="bg-gray-600 hover:bg-gray-700"
                >
                  Save Criteria
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Associated Flows Modal */}
      {showFlowsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-crimson-blue to-crimson-dark-blue text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                    <ArrowPathIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Associated Flows</h2>
                    <p className="text-crimson-accent-blue text-sm">
                      Flows that use "{formData.name}" tag criteria
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowFlowsModal(false)}
                  className="text-white hover:text-crimson-accent-blue transition-colors p-1 rounded-lg hover:bg-white hover:bg-opacity-10"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
              {formData.associatedFlows && formData.associatedFlows.length > 0 ? (
                <div className="space-y-4">
                  {formData.associatedFlows.map((flow) => (
                    <div key={flow.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <FlowBadge
                          flowName={flow.name}
                          flowType={flow.type}
                          isActive={flow.isActive}
                          size="md"
                          showActions={false}
                        />
                        <div className="text-sm">
                          {flow.isAutoCreated && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Auto-created
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            console.log(`Viewing flow: ${flow.name}`);
                            // TODO: Implement flow view functionality
                          }}
                          className="text-xs"
                        >
                          <EyeIcon className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            console.log(`Editing flow: ${flow.name}`);
                            // TODO: Implement flow edit functionality
                          }}
                          className="text-xs"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ArrowPathIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No associated flows found for this tag.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Preview Records Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-crimson-blue to-crimson-dark-blue text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                    <UsersIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Preview Records</h2>
                    <p className="text-crimson-accent-blue text-sm">
                      {previewCount.toLocaleString()} records match "{formData.name || 'Smart Tag'}" criteria
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    onClick={handleExportCSV}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-white border-opacity-30"
                  >
                    <DocumentTextIcon className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleExportExcel}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-white border-opacity-30"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                    Export Excel
                  </Button>
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="text-white hover:text-crimson-accent-blue transition-colors p-1 rounded-lg hover:bg-white hover:bg-opacity-10"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Giving
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Gift
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gift Count
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockPreviewData.map((record, index) => (
                      <tr key={record.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{record.name}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">{record.email}</div>
                          <div className="text-sm text-gray-500">{record.phone}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">{record.location}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-green-600">
                            ${record.totalGiving.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">{record.lastGift}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">{record.giftCount}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Info */}
              <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-sm text-gray-600">
                  Showing 1 to {mockPreviewData.length} of {previewCount.toLocaleString()} records
                </div>
                <div className="text-sm text-gray-500">
                  This is a preview of the first {mockPreviewData.length} records. Export to see all records.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartTagEditor;
