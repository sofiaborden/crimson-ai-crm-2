import React from 'react';
import { Donor } from '../../types';
import DonorProfile from '../profile/DonorProfile';
import { XMarkIcon } from '../../constants';

interface DonorProfileModalProps {
  donor: Donor | null;
  isOpen: boolean;
  onClose: () => void;
}

const DonorProfileModal: React.FC<DonorProfileModalProps> = ({ donor, isOpen, onClose }) => {
  if (!isOpen || !donor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Donor Profile</h2>
            <p className="text-sm text-gray-600">{donor.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          <DonorProfile donor={donor} />
        </div>
      </div>
    </div>
  );
};

export default DonorProfileModal;
