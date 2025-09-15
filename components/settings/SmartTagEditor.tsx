import React, { useState, useEffect, useCallback } from 'react';
import { XMarkIcon, SparklesIcon, FlagIcon, FunnelIcon, EyeIcon } from '../../constants';
import Button from '../ui/Button';
import SmartTagFilters from './SmartTagFilters';

interface SmartTag {
  id?: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  filterDefinition: any;
  count?: number;
  isActive: boolean;
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
    filterDefinition: [],
    isActive: true
  });
  const [showFilters, setShowFilters] = useState(false);
  const [previewCount, setPreviewCount] = useState(0);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewTimeout, setPreviewTimeout] = useState<NodeJS.Timeout | null>(null);

  const emojiOptions = ['💰', '🎯', '🚧', '⚡', '🕒', '🔥', '⭐', '🎪', '🎨', '🏆', '🎁', '🌟', '💎', '🚀', '🎊', '🎉', '🏷️', '📊'];
  const colorOptions = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ];

  useEffect(() => {
    if (tag) {
      setFormData({
        name: tag.name,
        emoji: tag.emoji,
        color: tag.color,
        description: tag.description,
        filterDefinition: tag.filterDefinition,
        isActive: tag.isActive
      });
    }
  }, [tag]);

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
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

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Tag Configuration */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FlagIcon className="w-5 h-5 text-crimson-blue" />
                  Tag Details
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tag Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Big Givers, Prime Persuadables"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of what this tag represents"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Emoji</label>
                      <div className="grid grid-cols-6 gap-2">
                        {emojiOptions.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => setFormData(prev => ({ ...prev, emoji }))}
                            className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center text-lg hover:bg-gray-100 transition-colors ${
                              formData.emoji === emoji ? 'border-crimson-blue bg-crimson-blue bg-opacity-10' : 'border-gray-300'
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                      <div className="grid grid-cols-5 gap-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color}
                            onClick={() => setFormData(prev => ({ ...prev, color }))}
                            className={`w-8 h-8 rounded-lg border-2 transition-all ${
                              formData.color === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                        style={{ backgroundColor: `${formData.color}20`, border: `2px solid ${formData.color}30` }}
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

            {/* Right Column - Filter Configuration */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <FunnelIcon className="w-5 h-5 text-crimson-blue" />
                    Filter Criteria
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
    </div>
  );
};

export default SmartTagEditor;
