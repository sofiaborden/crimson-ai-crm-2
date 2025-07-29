import React from 'react';
import { XMarkIcon } from '../../constants';
import PeopleSearch from './PeopleSearch';
import PledgesSearch from './PledgesSearch';

interface SearchFilter {
  id: string;
  field: string;
  operator: string;
  value: string;
  label: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchType: 'people' | 'money' | 'events' | 'pledges';
  initialFilters?: SearchFilter[];
  searchContext?: string;
}

const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  searchType,
  initialFilters = [],
  searchContext
}) => {
  if (!isOpen) return null;

  const renderSearchComponent = () => {
    switch (searchType) {
      case 'people':
        return (
          <PeopleSearch
            initialFilters={initialFilters}
            searchContext={searchContext}
            onClose={onClose}
          />
        );
      case 'pledges':
        return (
          <PledgesSearch
            initialFilters={initialFilters}
            searchContext={searchContext}
            onClose={onClose}
          />
        );
      case 'money':
        // TODO: Implement MoneySearch component
        return (
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Money Search</h3>
            <p className="text-gray-600">Money search component coming soon...</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-crimson-blue text-white rounded-lg hover:bg-crimson-dark-blue transition-colors"
            >
              Close
            </button>
          </div>
        );
      case 'events':
        // TODO: Implement EventsSearch component
        return (
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Events Search</h3>
            <p className="text-gray-600">Events search component coming soon...</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-crimson-blue text-white rounded-lg hover:bg-crimson-dark-blue transition-colors"
            >
              Close
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-7xl mx-auto">
          {renderSearchComponent()}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
