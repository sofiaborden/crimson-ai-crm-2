import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, EnvelopeIcon, PhoneIcon, UsersIcon, XMarkIcon, TargetIcon } from '../../constants.tsx';

interface ActionsDropdownProps {
  segmentId: string;
  segmentName: string;
  donorCount: number;
}

const ActionsDropdown: React.FC<ActionsDropdownProps> = ({ segmentId, segmentName, donorCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDialRModal, setShowDialRModal] = useState(false);
  const [showMailChimpModal, setShowMailChimpModal] = useState(false);

  const [mailChimpStep, setMailChimpStep] = useState<'account' | 'list' | 'confirm'>('account');

  const actions = [
    {
      id: 'targetpath',
      label: 'Send to TargetPath',
      description: 'Export to TargetPath platform',
      icon: <TargetIcon className="w-4 h-4" />,
      action: () => {
        alert(`📍 Sending ${donorCount} contacts from "${segmentName}" to TargetPath...\n\nThis will create a new audience in your TargetPath account.\nEstimated completion: 45 seconds`);
        setIsOpen(false);
      }
    },
    {
      id: 'mailchimp',
      label: 'Push to MailChimp',
      description: 'Export to email marketing',
      icon: <EnvelopeIcon className="w-4 h-4" />,
      action: () => setShowMailChimpModal(true)
    },
    {
      id: 'dialr',
      label: 'Add to DialR',
      description: 'Create call list',
      icon: <PhoneIcon className="w-4 h-4" />,
      action: () => setShowDialRModal(true)
    },

  ];

  const handlePushToMailChimp = () => {
    console.log(`Pushing ${donorCount} contacts from ${segmentName} to MailChimp`);
    alert(`📧 Pushing ${donorCount} contacts to MailChimp...\n\nList name: "${segmentName}"\nEstimated completion: 30 seconds`);
    setIsOpen(false);
  };

  const handleDialRSelection = (assignmentType: string, targetName?: string) => {
    let message = '';

    switch (assignmentType) {
      case 'my-list':
        message = `📞 Adding ${donorCount} contacts to your personal DialR list...\n\nSegment: "${segmentName}"\nReady for dialing in 15 seconds`;
        break;
      case 'list-assignment':
        message = `📞 Assigning ${donorCount} contacts to DialR list...\n\nList: "${targetName}"\nSegment: "${segmentName}"\nAssignment complete!`;
        break;
      case 'user-assignment':
        message = `📞 Assigning ${donorCount} contacts to team member...\n\nAssigned to: ${targetName}\nSegment: "${segmentName}"\nNotification sent to user!`;
        break;
      default:
        message = `📞 Adding ${donorCount} contacts to DialR...\n\nSegment: "${segmentName}"`;
    }

    console.log(`DialR ${assignmentType}:`, { donorCount, segmentName, targetName });
    alert(message);

    // Reset form state
    setSelectedList('');
    setSelectedUser('');
    setShowDialRModal(false);
    setIsOpen(false);
  };

  // Mock existing organizational lists
  const existingLists = [
    'Major Donors 2024',
    'Monthly Sustainers',
    'Event Prospects',
    'Board Contacts',
    'VIP Supporters'
  ];

  // Mock users in the organization
  const organizationUsers = [
    { id: 'user1', name: 'Sarah Johnson', role: 'Development Director' },
    { id: 'user2', name: 'Mike Chen', role: 'Major Gifts Officer' },
    { id: 'user3', name: 'Emily Rodriguez', role: 'Campaign Manager' },
    { id: 'user4', name: 'David Kim', role: 'Volunteer Coordinator' },
    { id: 'user5', name: 'Lisa Thompson', role: 'Communications Lead' }
  ];

  // Mock MailChimp accounts
  const mailChimpAccounts = [
    { id: 'constant-contact', name: 'Constant Contact', type: 'Constant Contact', accounts: ['CMDI', 'Test'] },
    { id: 'mailchimp', name: 'Mailchimp', type: 'Mailchimp', accounts: ['CMDI Test 2', 'CMDI'] }
  ];

  // Available custom fields for MailChimp export
  const availableCustomFields = [
    'Formal Salutation',
    'Informal Salutation',
    'Spouse Name',
    'Street',
    'Address Line 1',
    'City',
    'State',
    'Zip',
    'Highest Gift',
    'Highest Gift Date',
    'CTD',
    'Most Recent Gift',
    'Most Recent Gift Date'
  ];

  const [selectedList, setSelectedList] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [listName, setListName] = useState('');
  const [updateType, setUpdateType] = useState('one-time');
  const [selectedCustomFields, setSelectedCustomFields] = useState<string[]>([]);
  const [showCustomFieldsDropdown, setShowCustomFieldsDropdown] = useState(false);
  const customFieldsRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (customFieldsRef.current && !customFieldsRef.current.contains(event.target as Node)) {
        setShowCustomFieldsDropdown(false);
      }
    };

    if (showCustomFieldsDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCustomFieldsDropdown]);



  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-crimson-blue focus:border-transparent shadow-sm transition-all duration-200"
        >
          Actions
          <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
            {actions.map((action, index) => (
              <button
                key={action.id}
                onClick={() => {
                  action.action();
                  if (action.id !== 'dialr') setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors duration-150 ${
                  index !== actions.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="flex-shrink-0 text-gray-500">
                  {action.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">{action.label}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* DialR Modal */}
      {showDialRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-base-300">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Add to DialR</h3>
                <p className="text-sm text-text-secondary mt-1">{donorCount} contacts from "{segmentName}"</p>
              </div>
              <button
                onClick={() => setShowDialRModal(false)}
                className="text-text-secondary hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-base-200"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Add to My List */}
              <button
                onClick={() => handleDialRSelection('my-list')}
                className="w-full flex items-center gap-3 p-4 border-2 border-crimson-blue bg-crimson-blue bg-opacity-5 rounded-lg hover:bg-crimson-blue hover:bg-opacity-10 transition-all duration-200"
              >
                <PhoneIcon className="w-5 h-5 text-crimson-blue" />
                <div className="text-left">
                  <div className="font-medium text-text-primary">Add to My List</div>
                  <div className="text-sm text-text-secondary">Add to your personal call list</div>
                </div>
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-base-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-base-100 text-text-secondary">or</span>
                </div>
              </div>

              {/* Assign to List */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-text-primary">Assign to List</label>
                <select
                  value={selectedList}
                  onChange={(e) => setSelectedList(e.target.value)}
                  className="w-full px-3 py-2 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-crimson-blue focus:border-transparent bg-base-100 text-text-primary"
                >
                  <option value="">Select a list...</option>
                  {existingLists.map((listName) => (
                    <option key={listName} value={listName}>{listName}</option>
                  ))}
                </select>
                {selectedList && (
                  <button
                    onClick={() => handleDialRSelection('list-assignment', selectedList)}
                    className="w-full px-4 py-2 bg-crimson-blue text-white rounded-lg hover:bg-crimson-dark-blue transition-colors duration-200 font-medium"
                  >
                    Assign to {selectedList}
                  </button>
                )}
              </div>

              {/* Assign to User */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-text-primary">Assign to User</label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full px-3 py-2 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-crimson-blue focus:border-transparent bg-base-100 text-text-primary"
                >
                  <option value="">Select a user...</option>
                  {organizationUsers.map((user) => (
                    <option key={user.id} value={user.id}>{user.name} - {user.role}</option>
                  ))}
                </select>
                {selectedUser && (
                  <button
                    onClick={() => {
                      const user = organizationUsers.find(u => u.id === selectedUser);
                      handleDialRSelection('user-assignment', user?.name);
                    }}
                    className="w-full px-4 py-2 bg-crimson-accent-blue text-white rounded-lg hover:bg-crimson-blue transition-colors duration-200 font-medium"
                  >
                    Assign to {organizationUsers.find(u => u.id === selectedUser)?.name}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MailChimp Modal */}
      {showMailChimpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-base-300">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  {mailChimpStep === 'account' && 'Select an Integration Account for New Email List'}
                  {mailChimpStep === 'list' && 'Add Email List'}
                  {mailChimpStep === 'confirm' && 'Confirm Export'}
                </h3>
                <p className="text-sm text-text-secondary mt-1">{donorCount} contacts from "{segmentName}"</p>
              </div>
              <div className="flex items-center gap-2">
                {mailChimpStep !== 'account' && (
                  <button
                    onClick={() => setMailChimpStep(mailChimpStep === 'list' ? 'account' : 'list')}
                    className="text-text-secondary hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-base-200"
                  >
                    ← Back
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowMailChimpModal(false);
                    setMailChimpStep('account');
                    setSelectedAccount('');
                    setListName('');
                    setSelectedCustomFields([]);
                    setShowCustomFieldsDropdown(false);
                  }}
                  className="text-text-secondary hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-base-200"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] overflow-x-visible">
              {mailChimpStep === 'account' && (
                <div className="space-y-4">
                  {mailChimpAccounts.map((provider) => (
                    <div key={provider.id} className="border border-base-300 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-crimson-blue rounded-lg flex items-center justify-center">
                          <EnvelopeIcon className="w-4 h-4 text-white" />
                        </div>
                        <h4 className="font-medium text-text-primary">{provider.name}</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {provider.accounts.map((account) => (
                          <button
                            key={account}
                            onClick={() => {
                              setSelectedAccount(`${provider.id}-${account}`);
                              setListName(`${segmentName} - ${new Date().toLocaleDateString()}`);
                              setMailChimpStep('list');
                            }}
                            className="p-3 border border-base-300 rounded-lg hover:border-crimson-blue hover:bg-crimson-blue hover:bg-opacity-5 transition-all duration-200 text-center"
                          >
                            <div className="font-medium text-text-primary">{account}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {mailChimpStep === 'list' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">List Name</label>
                    <input
                      type="text"
                      value={listName}
                      onChange={(e) => setListName(e.target.value)}
                      placeholder={`${segmentName} - ${new Date().toLocaleDateString()}`}
                      className="w-full px-3 py-2 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-crimson-blue focus:border-transparent bg-base-100 text-text-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Update Type</label>
                    <select
                      value={updateType}
                      onChange={(e) => setUpdateType(e.target.value)}
                      className="w-full px-3 py-2 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-crimson-blue focus:border-transparent bg-base-100 text-text-primary"
                    >
                      <option value="one-time">One-time: Send records from this search once</option>
                      <option value="sync">Sync: Keep list updated with matching records</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Custom Fields</label>
                    <div className="relative" ref={customFieldsRef}>
                      <button
                        type="button"
                        onClick={() => setShowCustomFieldsDropdown(!showCustomFieldsDropdown)}
                        className="w-full px-3 py-2 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-crimson-blue focus:border-transparent bg-base-100 text-text-primary text-left flex items-center justify-between"
                      >
                        <span className="text-gray-500">
                          {selectedCustomFields.length === 0
                            ? 'Select Custom Fields'
                            : `${selectedCustomFields.length} field${selectedCustomFields.length !== 1 ? 's' : ''} selected`
                          }
                        </span>
                        <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${showCustomFieldsDropdown ? 'rotate-180' : ''}`} />
                      </button>

                      {showCustomFieldsDropdown && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-base-300 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                          <div className="p-1">
                            {availableCustomFields.map((field) => (
                              <label key={field} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer transition-colors duration-150">
                                <input
                                  type="checkbox"
                                  checked={selectedCustomFields.includes(field)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedCustomFields([...selectedCustomFields, field]);
                                    } else {
                                      setSelectedCustomFields(selectedCustomFields.filter(f => f !== field));
                                    }
                                  }}
                                  className="w-4 h-4 text-crimson-blue border-gray-300 rounded focus:ring-crimson-blue focus:ring-2"
                                />
                                <span className="text-sm text-gray-700 select-none">{field}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary mt-1">Standard fields included: Name, Email, Phone, Address, Donation History</p>
                  </div>

                  <button
                    onClick={() => setMailChimpStep('confirm')}
                    disabled={!listName.trim()}
                    className="w-full px-4 py-2 bg-crimson-blue text-white rounded-lg hover:bg-crimson-dark-blue disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                  >
                    Save
                  </button>
                </div>
              )}

              {mailChimpStep === 'confirm' && (
                <div className="space-y-6">
                  <div className="bg-base-200 rounded-lg p-4">
                    <h4 className="font-medium text-text-primary mb-2">Export Summary</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">List Name:</span> {listName || `${segmentName} - ${new Date().toLocaleDateString()}`}</p>
                      <p><span className="font-medium">Contacts:</span> {donorCount.toLocaleString()}</p>
                      <p><span className="font-medium">Update Type:</span> {updateType === 'one-time' ? 'One-time export' : 'Synced list'}</p>
                      <p><span className="font-medium">Account:</span> {selectedAccount}</p>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-green-800">Ready to Export</h4>
                        <p className="text-sm text-green-700 mt-1">
                          Your segment will be exported to MailChimp with all donor information and contact details.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setMailChimpStep('list')}
                      className="flex-1 px-4 py-2 border border-base-300 text-text-primary rounded-lg hover:bg-base-200 transition-colors duration-200 font-medium"
                    >
                      Back to Edit
                    </button>
                    <button
                      onClick={() => {
                        const customFieldsText = selectedCustomFields.length > 0
                          ? `\nCustom Fields: ${selectedCustomFields.join(', ')}`
                          : '';
                        alert(`📧 Exporting ${donorCount} contacts to MailChimp...\n\nList: "${listName || `${segmentName} - ${new Date().toLocaleDateString()}`}"\nAccount: ${selectedAccount}${customFieldsText}\nEstimated completion: 45 seconds`);
                        setShowMailChimpModal(false);
                        setMailChimpStep('account');
                        setSelectedAccount('');
                        setListName('');
                        setSelectedCustomFields([]);
                        setShowCustomFieldsDropdown(false);
                        setIsOpen(false);
                      }}
                      className="flex-1 px-4 py-2 bg-crimson-blue text-white rounded-lg hover:bg-crimson-dark-blue transition-colors duration-200 font-medium"
                    >
                      Export to MailChimp
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActionsDropdown;