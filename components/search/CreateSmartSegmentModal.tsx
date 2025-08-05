import React, { useState } from 'react';
import { XMarkIcon, SparklesIcon, ClockIcon, ArrowPathIcon } from '../../constants';

interface CreateSmartSegmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchCriteria: string;
  resultCount: number;
}

const CreateSmartSegmentModal: React.FC<CreateSmartSegmentModalProps> = ({
  isOpen,
  onClose,
  searchCriteria,
  resultCount
}) => {
  const [segmentName, setSegmentName] = useState('');
  const [description, setDescription] = useState('');
  const [isOneTime, setIsOneTime] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!segmentName.trim()) {
      alert('Please enter a segment name');
      return;
    }

    setIsCreating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    alert(`✅ Smart Segment Created!\n\nName: ${segmentName}\nType: ${isOneTime ? 'One-time' : 'Dynamic'}\nRecords: ${resultCount.toLocaleString()}\n\nYour segment has been saved and is now available in the Smart Segments section.`);
    
    setIsCreating(false);
    onClose();
    
    // Reset form
    setSegmentName('');
    setDescription('');
    setIsOneTime(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-crimson-blue" />
            <h3 className="text-lg font-semibold text-gray-900">Create Smart Segment</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Search Summary */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-blue-900">Search Results</span>
            </div>
            <p className="text-sm text-blue-800">
              {resultCount.toLocaleString()} records found
            </p>
            {searchCriteria && (
              <p className="text-xs text-blue-600 mt-1">
                Criteria: {searchCriteria}
              </p>
            )}
          </div>

          {/* Segment Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Segment Name *
            </label>
            <input
              type="text"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
              placeholder="Enter a descriptive name for your segment"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-crimson-blue focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional: Describe the purpose of this segment"
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-crimson-blue focus:border-transparent"
            />
          </div>

          {/* Segment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Segment Type
            </label>
            <div className="space-y-3">
              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  isOneTime 
                    ? 'border-crimson-blue bg-crimson-blue bg-opacity-5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setIsOneTime(true)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    isOneTime ? 'border-crimson-blue' : 'border-gray-300'
                  }`}>
                    {isOneTime && <div className="w-2 h-2 bg-crimson-blue rounded-full"></div>}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900">One-time List</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Static list of current search results. Won't update automatically.
                    </p>
                  </div>
                </div>
              </div>

              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  !isOneTime 
                    ? 'border-crimson-blue bg-crimson-blue bg-opacity-5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setIsOneTime(false)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    !isOneTime ? 'border-crimson-blue' : 'border-gray-300'
                  }`}>
                    {!isOneTime && <div className="w-2 h-2 bg-crimson-blue rounded-full"></div>}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <ArrowPathIcon className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900">Dynamic Segment</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Automatically updates when new records match your search criteria.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={isCreating || !segmentName.trim()}
              className="flex-1 px-4 py-2 bg-crimson-blue text-white rounded-lg hover:bg-crimson-dark-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-4 h-4" />
                  Create Segment
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSmartSegmentModal;
