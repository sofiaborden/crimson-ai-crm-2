import React, { useState } from 'react';
import {
  ChevronDownIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  PrinterIcon,
  MapPinIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  UserGroupIcon,
  XMarkIcon,
  SparklesIcon,
  TargetIcon
} from '../../constants';

interface PeopleSearchActionsDropdownProps {
  selectedCount: number;
  totalCount: number;
  onCreateSmartSegment: () => void;
}

const PeopleSearchActionsDropdown: React.FC<PeopleSearchActionsDropdownProps> = ({ 
  selectedCount, 
  totalCount, 
  onCreateSmartSegment 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showMassAppendModal, setShowMassAppendModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showMailMergeModal, setShowMailMergeModal] = useState(false);

  const actions = [
    {
      id: 'targetpath',
      label: 'Send to TargetPath',
      description: 'Export to TargetPath platform',
      icon: <TargetIcon className="w-4 h-4" />,
      action: () => {
        const count = selectedCount > 0 ? selectedCount : totalCount;
        alert(`📍 Sending ${count} contacts to TargetPath...\n\nThis will create a new audience in your TargetPath account.\nEstimated completion: 45 seconds`);
        setIsOpen(false);
      }
    },
    {
      id: 'export-channel',
      label: 'Export by Channel',
      description: 'Export contacts by communication preference',
      icon: <ArrowDownTrayIcon className="w-4 h-4" />,
      action: () => setShowExportModal(true)
    },
    {
      id: 'mass-append',
      label: 'Mass Append',
      description: 'Append data to selected records',
      icon: <PlusIcon className="w-4 h-4" />,
      action: () => setShowMassAppendModal(true)
    },
    {
      id: 'print',
      label: 'Print',
      description: 'Create printable call sheets',
      icon: <PrinterIcon className="w-4 h-4" />,
      action: () => handlePrint()
    },
    {
      id: 'map-it',
      label: 'Map It',
      description: 'View contacts on map',
      icon: <MapPinIcon className="w-4 h-4" />,
      action: () => setShowMapModal(true)
    },
    {
      id: 'mail-merge',
      label: 'Mail Merge',
      description: 'Create personalized documents',
      icon: <DocumentTextIcon className="w-4 h-4" />,
      action: () => setShowMailMergeModal(true)
    },
    {
      id: 'email-list',
      label: 'Create Email List',
      description: 'Export to email marketing platform',
      icon: <EnvelopeIcon className="w-4 h-4" />,
      action: () => handleCreateEmailList()
    },
    {
      id: 'profile-series',
      label: 'Profile Series',
      description: 'Browse profiles one by one',
      icon: <UserGroupIcon className="w-4 h-4" />,
      action: () => handleProfileSeries()
    },
    {
      id: 'smart-segment',
      label: 'Create Smart Segment',
      description: 'Save as reusable segment',
      icon: <SparklesIcon className="w-4 h-4" />,
      action: onCreateSmartSegment
    }
  ];

  const handlePrint = () => {
    // Create printable call sheets
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Call Sheets - ${selectedCount || totalCount} Contacts</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .call-sheet { page-break-after: always; border: 1px solid #ccc; padding: 20px; margin-bottom: 20px; }
              .header { background: #f5f5f5; padding: 10px; margin-bottom: 15px; }
              .contact-info { margin-bottom: 15px; }
              .notes-section { border-top: 1px solid #eee; padding-top: 15px; }
              @media print { .call-sheet { page-break-after: always; } }
            </style>
          </head>
          <body>
            <h1>Call Sheets - ${new Date().toLocaleDateString()}</h1>
            ${Array.from({ length: Math.min(selectedCount || totalCount, 10) }, (_, i) => `
              <div class="call-sheet">
                <div class="header">
                  <h2>Contact ${i + 1}</h2>
                  <p>Call Date: ___________  Time: ___________</p>
                </div>
                <div class="contact-info">
                  <p><strong>Name:</strong> Sample Contact ${i + 1}</p>
                  <p><strong>Phone:</strong> (555) 123-${String(i).padStart(4, '0')}</p>
                  <p><strong>Email:</strong> contact${i + 1}@example.com</p>
                  <p><strong>Last Gift:</strong> $${(Math.random() * 500 + 50).toFixed(0)}</p>
                </div>
                <div class="notes-section">
                  <p><strong>Call Notes:</strong></p>
                  <div style="border: 1px solid #ddd; height: 100px; margin-top: 10px;"></div>
                  <p style="margin-top: 15px;"><strong>Follow-up Required:</strong> ☐ Yes ☐ No</p>
                  <p><strong>Next Contact Date:</strong> ___________</p>
                </div>
              </div>
            `).join('')}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
    setIsOpen(false);
  };

  const handleCreateEmailList = () => {
    alert('📧 Creating email list...\n\nThis will export selected contacts to your email marketing platform (MailChimp/Constant Contact).');
    setIsOpen(false);
  };

  const handleProfileSeries = () => {
    alert('👥 Profile Series\n\nThis will open a modal allowing you to browse through each contact profile one by one.');
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-crimson-blue text-white rounded-lg hover:bg-crimson-dark-blue transition-colors text-sm font-medium"
        >
          Actions
          <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
            <div className="p-3 border-b border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-600">
                {selectedCount > 0 ? `${selectedCount} selected` : `All ${totalCount} results`}
              </p>
            </div>
            {actions.map((action, index) => (
              <button
                key={action.id}
                onClick={() => {
                  action.action();
                  if (!['export-channel', 'mass-append', 'map-it', 'mail-merge'].includes(action.id)) {
                    setIsOpen(false);
                  }
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

      {/* Export by Channel Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Export by Channel</h3>
              <button onClick={() => setShowExportModal(false)}>
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <button className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <div className="font-medium">📧 Email Contacts</div>
                  <div className="text-sm text-gray-600">Export contacts with email addresses</div>
                </button>
                <button className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <div className="font-medium">📞 Phone Contacts</div>
                  <div className="text-sm text-gray-600">Export contacts with phone numbers</div>
                </button>
                <button className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <div className="font-medium">📮 Mail Contacts</div>
                  <div className="text-sm text-gray-600">Export contacts with mailing addresses</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mass Append Modal */}
      {showMassAppendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Mass Append</h3>
              <button onClick={() => setShowMassAppendModal(false)}>
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">Add data to all selected records:</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
                  <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Enter tag name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                  <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2" rows={3} placeholder="Enter note"></textarea>
                </div>
                <button className="w-full bg-crimson-blue text-white py-2 rounded-lg hover:bg-crimson-dark-blue">
                  Apply to {selectedCount || totalCount} Records
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map It Modal */}
      {showMapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Contact Map</h3>
              <button onClick={() => setShowMapModal(false)}>
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPinIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Interactive map showing {selectedCount || totalCount} contacts</p>
                  <p className="text-sm text-gray-500 mt-2">Map integration coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mail Merge Modal */}
      {showMailMergeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Mail Merge</h3>
              <button onClick={() => setShowMailMergeModal(false)}>
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>Thank You Letter</option>
                  <option>Donation Request</option>
                  <option>Event Invitation</option>
                  <option>Custom Template</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Output Format</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>PDF</option>
                  <option>Word Document</option>
                  <option>Print Ready</option>
                </select>
              </div>
              <button className="w-full bg-crimson-blue text-white py-2 rounded-lg hover:bg-crimson-dark-blue">
                Generate for {selectedCount || totalCount} Contacts
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PeopleSearchActionsDropdown;
