import React, { useState, useEffect, useCallback, useRef } from 'react';
import { XMarkIcon, SparklesIcon, FlagIcon, FunnelIcon, EyeIcon, PlusIcon, ChevronDownIcon, ArrowPathIcon } from '../../constants';
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
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewTimeout, setPreviewTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showInclusionTrigger, setShowInclusionTrigger] = useState(false);
  const [showRemovalTrigger, setShowRemovalTrigger] = useState(false);
  const [showEmojiDropdown, setShowEmojiDropdown] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [showFlowsModal, setShowFlowsModal] = useState(false);
  const emojiDropdownRef = useRef<HTMLDivElement>(null);
  const colorDropdownRef = useRef<HTMLDivElement>(null);

  const emojiOptions = ['💰', '🎯', '🚧', '⚡', '🕒', '🔥', '⭐', '🎪', '🎨', '🏆', '🎁', '🌟', '💎', '🚀', '🎊', '🎉', '🏷️', '📊', '👔', '🏥', '🏫', '🏢', '🎓', '🏛️', '🔍', '📌', '🤝'];
  const colorOptions = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
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
      setPreviewCount(Math.floor(Math.random() * 1000) + 100);
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
                      <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="processingType"
                          value="static"
                          checked={formData.processingType === 'static'}
                          onChange={(e) => setFormData(prev => ({ ...prev, processingType: e.target.value as any }))}
                          className="text-crimson-blue focus:ring-crimson-blue"
                        />
                        <div>
                          <div className="font-medium text-gray-900 text-sm">📌 Static Flow</div>
                          <div className="text-xs text-gray-600">Manual application</div>
                        </div>
                      </label>
                      <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="processingType"
                          value="dynamic"
                          checked={formData.processingType === 'dynamic'}
                          onChange={(e) => setFormData(prev => ({ ...prev, processingType: e.target.value as any }))}
                          className="text-crimson-blue focus:ring-crimson-blue"
                        />
                        <div>
                          <div className="font-medium text-gray-900 text-sm">⚡ Dynamic Flow</div>
                          <div className="text-xs text-gray-600">Auto-processing</div>
                        </div>
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
                </div>
              </div>
            </div>

            {/* Right Column - Dynamic Flow Configuration */}
            <div className="space-y-6">
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

                      {/* View All Flows Badge - Only show if tag exists and has associated flows */}
                      {tag && formData.associatedFlows && formData.associatedFlows.length > 0 && (
                        <button
                          onClick={() => setShowFlowsModal(true)}
                          className="mt-2 flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all duration-200 text-sm font-medium text-blue-800 w-full justify-center"
                        >
                          <ArrowPathIcon className="w-4 h-4" />
                          View All Flows: {formData.associatedFlows.length}
                        </button>
                      )}
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
                        </div>
                      )}
                    </div>

                    {/* Info Box */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <div className="text-sm text-gray-700">
                        <strong>Dynamic Flow:</strong> This tag will automatically add/remove contacts based on your criteria.
                        Inclusion criteria determine who gets the tag, and removal criteria determine what happens when they no longer qualify.
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FunnelIcon className="w-5 h-5 text-crimson-blue" />
                    Static Configuration
                  </h3>

                  <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-gray-600">
                      <div className="text-lg mb-2">📌</div>
                      <div className="font-medium mb-1">Static Flow Selected</div>
                      <div className="text-sm">
                        This tag will be manually applied to contacts. No automatic processing will occur.
                      </div>
                    </div>
                  </div>
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
                      />
                    </div>
                  )}

                  {/* Preview Results */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <EyeIcon className="w-4 h-4" />
                        Preview Results
                      </h4>
                      <Button
                        size="sm"
                        onClick={handlePreview}
                        disabled={isLoadingPreview}
                        className="bg-crimson-blue hover:bg-crimson-dark-blue"
                      >
                        {isLoadingPreview ? (
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Loading...
                          </div>
                        ) : (
                          'Refresh'
                        )}
                      </Button>
                    </div>

                    <div className="text-center py-4">
                      <div className="text-2xl font-bold text-crimson-blue">
                        {isLoadingPreview ? '...' : previewCount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">contacts match this criteria</div>
                    </div>
                  </div>
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
    </div>
  );
};

export default SmartTagEditor;
