import React, { useState, useMemo } from 'react';
import Card from './Card';
import Button from './Button';
import { XMarkIcon, MagnifyingGlassIcon, PhoneIcon, EnvelopeIcon, CalendarIcon, CurrencyDollarIcon } from '../../constants';
import DonorProfileModal from './DonorProfileModal';
import { getDonorProfileByName } from '../../utils/mockDonorProfiles';
import { Donor as DonorProfile } from '../../types';

interface Donor {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastGiftAmount: number;
  lastGiftDate: string;
  totalLifetimeGiving: number;
  giftCount: number;
  status: 'active' | 'lapsed' | 'major' | 'new';
  engagementScore: number;
  address: string;
  city: string;
  state: string;
  zip: string;
}

interface DonorListViewProps {
  segmentId: string;
  segmentName: string;
  isOpen: boolean;
  onClose: () => void;
}

// Sample donor data for different segments
const generateDonorData = (segmentId: string): Donor[] => {
  const baseData: Record<string, Partial<Donor>[]> = {
    'comeback-crew': [
      { name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '(555) 123-4567', lastGiftAmount: 150, lastGiftDate: '2023-03-15', totalLifetimeGiving: 850, giftCount: 6, status: 'lapsed', engagementScore: 65 },
      { name: 'Michael Chen', email: 'mchen@email.com', phone: '(555) 234-5678', lastGiftAmount: 75, lastGiftDate: '2023-02-20', totalLifetimeGiving: 425, giftCount: 4, status: 'lapsed', engagementScore: 58 },
      { name: 'Emily Rodriguez', email: 'emily.r@email.com', phone: '(555) 345-6789', lastGiftAmount: 200, lastGiftDate: '2023-01-10', totalLifetimeGiving: 1200, giftCount: 8, status: 'lapsed', engagementScore: 72 },
    ],
    'neighborhood-mvps': [
      { name: 'Robert Williams', email: 'rwilliams@email.com', phone: '(555) 456-7890', lastGiftAmount: 500, lastGiftDate: '2024-06-15', totalLifetimeGiving: 3500, giftCount: 12, status: 'major', engagementScore: 92 },
      { name: 'Jennifer Davis', email: 'jdavis@email.com', phone: '(555) 567-8901', lastGiftAmount: 750, lastGiftDate: '2024-05-20', totalLifetimeGiving: 4200, giftCount: 15, status: 'major', engagementScore: 88 },
      { name: 'David Thompson', email: 'dthompson@email.com', phone: '(555) 678-9012', lastGiftAmount: 300, lastGiftDate: '2024-07-01', totalLifetimeGiving: 2100, giftCount: 9, status: 'active', engagementScore: 85 },
    ],
    'quiet-giants': [
      { name: 'Margaret Foster', email: 'mfoster@email.com', phone: '(555) 789-0123', lastGiftAmount: 1000, lastGiftDate: '2023-12-15', totalLifetimeGiving: 8500, giftCount: 3, status: 'major', engagementScore: 45 },
      { name: 'James Patterson', email: 'jpatterson@email.com', phone: '(555) 890-1234', lastGiftAmount: 2500, lastGiftDate: '2023-08-10', totalLifetimeGiving: 12000, giftCount: 4, status: 'major', engagementScore: 38 },
    ]
  };

  const addresses = [
    { address: '123 Main St', city: 'Springfield', state: 'IL', zip: '62701' },
    { address: '456 Oak Ave', city: 'Madison', state: 'WI', zip: '53703' },
    { address: '789 Pine Rd', city: 'Austin', state: 'TX', zip: '73301' },
    { address: '321 Elm St', city: 'Portland', state: 'OR', zip: '97201' },
    { address: '654 Maple Dr', city: 'Denver', state: 'CO', zip: '80202' },
  ];

  const segmentData = baseData[segmentId] || baseData['comeback-crew'];
  
  return segmentData.map((donor, index) => ({
    id: `${segmentId}-${index}`,
    name: donor.name || 'Unknown Donor',
    email: donor.email || 'unknown@email.com',
    phone: donor.phone || '(555) 000-0000',
    lastGiftAmount: donor.lastGiftAmount || 50,
    lastGiftDate: donor.lastGiftDate || '2024-01-01',
    totalLifetimeGiving: donor.totalLifetimeGiving || 100,
    giftCount: donor.giftCount || 1,
    status: donor.status || 'active',
    engagementScore: donor.engagementScore || 50,
    ...addresses[index % addresses.length]
  }));
};

const DonorListView: React.FC<DonorListViewProps> = ({ segmentId, segmentName, isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Donor>('totalLifetimeGiving');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedDonor, setSelectedDonor] = useState<DonorProfile | null>(null);
  const [showDonorProfile, setShowDonorProfile] = useState(false);

  const handleDonorClick = (donorName: string) => {
    const donor = getDonorProfileByName(donorName);
    if (donor) {
      setSelectedDonor(donor);
      setShowDonorProfile(true);
    }
  };

  const donors = useMemo(() => generateDonorData(segmentId), [segmentId]);

  const filteredAndSortedDonors = useMemo(() => {
    let filtered = donors.filter(donor =>
      donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.phone.includes(searchTerm)
    );

    filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      return 0;
    });

    return filtered;
  }, [donors, searchTerm, sortField, sortDirection]);

  const handleSort = (field: keyof Donor) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      lapsed: 'bg-yellow-100 text-yellow-800',
      major: 'bg-purple-100 text-purple-800',
      new: 'bg-blue-100 text-blue-800'
    };
    return styles[status as keyof typeof styles] || styles.active;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Donor List: {segmentName}</h2>
            <p className="text-gray-600">{filteredAndSortedDonors.length} donors found</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search donors by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button variant="secondary" size="sm">
              <CurrencyDollarIcon className="w-4 h-4 mr-1" />
              Export CSV
            </Button>
          </div>
        </div>

        <div className="overflow-auto max-h-[60vh]">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}>
                  Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('lastGiftAmount')}>
                  Last Gift {sortField === 'lastGiftAmount' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('totalLifetimeGiving')}>
                  Lifetime Giving {sortField === 'totalLifetimeGiving' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('status')}>
                  Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedDonors.map((donor) => (
                <tr key={donor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <button
                        onClick={() => handleDonorClick(donor.name)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 underline-offset-2 hover:underline transition-colors text-left"
                      >
                        {donor.name}
                      </button>
                      <div className="text-sm text-gray-500">{donor.address}, {donor.city}, {donor.state} {donor.zip}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{donor.email}</div>
                    <div className="text-sm text-gray-500">{donor.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${donor.lastGiftAmount.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{new Date(donor.lastGiftDate).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${donor.totalLifetimeGiving.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{donor.giftCount} gifts</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(donor.status)}`}>
                      {donor.status}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">Score: {donor.engagementScore}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-1">
                      <button
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="Call donor"
                        onClick={() => window.open(`tel:${donor.phone}`, '_self')}
                      >
                        <PhoneIcon className="w-4 h-4" />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-900 p-1 rounded"
                        title="Email donor"
                        onClick={() => window.open(`mailto:${donor.email}`, '_self')}
                      >
                        <EnvelopeIcon className="w-4 h-4" />
                      </button>
                      <button
                        className="text-purple-600 hover:text-purple-900 p-1 rounded"
                        title="Schedule follow-up"
                      >
                        <CalendarIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Total Lifetime Value: <span className="font-semibold">${filteredAndSortedDonors.reduce((sum, donor) => sum + donor.totalLifetimeGiving, 0).toLocaleString()}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={onClose}>Close</Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Create Campaign for {filteredAndSortedDonors.length} Donors
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Donor Profile Modal */}
      <DonorProfileModal
        donor={selectedDonor}
        isOpen={showDonorProfile}
        onClose={() => setShowDonorProfile(false)}
      />
    </div>
  );
};

export default DonorListView;
