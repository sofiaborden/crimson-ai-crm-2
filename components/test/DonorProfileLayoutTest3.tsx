import React, { useState, useMemo } from 'react';
import { Donor } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import SmartTag from '../ui/SmartTag';
import { formatCurrency, formatPhone } from '../../utils/formatters';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon,
  ChartBarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  BoltIcon,
  ChevronDownIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  UserIcon,
  CalendarIcon,
  ClipboardDocumentIcon,
  FlagIcon,
  ArrowTrendingUpIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  ArrowTopRightOnSquareIcon,
  BriefcaseIcon,
  AddressBookIcon,
  CampaignIcon,
  PrinterIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  PencilIcon,
  MoreIcon,
  XMarkIcon
} from '../../constants';

interface DonorProfileLayoutTest3Props {
  donor: Donor;
}

const DonorProfileLayoutTest3: React.FC<DonorProfileLayoutTest3Props> = ({ donor }) => {
  // Tab state - updated to match existing donor profile tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'intelligence' | 'enriched' | 'donor-discovery' | 'fec-insights' | 'donations' | 'actions' | 'more'>('overview');
  const [activeMoreTab, setActiveMoreTab] = useState<'codes' | 'moves' | 'tasks' | 'notes' | 'events'>('tasks');
  const [activeAITab, setActiveAITab] = useState<'insights' | 'bio'>('insights');

  // Drag and drop state for sidebar panels
  const [panelOrder, setPanelOrder] = useState([
    'smartTags', 'contact', 'codes', 'experts', 'notes'
  ]);

  // Collapsible panels state
  const [collapsedPanels, setCollapsedPanels] = useState<Set<string>>(new Set());

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'personal' | 'contact' | 'address' | 'professional' | 'relationship'>('personal');
  const [isCodesModalOpen, setIsCodesModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    // Personal Information
    prefix: donor.prefix || 'Mr.',
    firstName: donor.firstName || 'Joseph',
    middleName: donor.middleName || 'M.',
    lastName: donor.lastName || 'Banks',
    suffix: donor.suffix || 'Sr.',
    preferredName: donor.preferredName || '',
    dateOfBirth: donor.dateOfBirth || '1/1/1969',
    gender: donor.gender || '',

    // Contact Details
    primaryEmail: donor.primaryEmail || 'joseph.banks@email.com',
    secondaryEmail: donor.secondaryEmail || '',
    homePhone: donor.homePhone || '(123) 456-7890',
    mobilePhone: donor.mobilePhone || '(724) 393-1999',
    workPhone: donor.workPhone || '(717) 888-9172',
    fax: donor.fax || '404.393.7654',

    // Address Information
    street: donor.primaryAddress?.street || '1909 E Bethany Home Rd',
    additionalAddressLine1: donor.primaryAddress?.additionalLine1 || '',
    additionalAddressLine2: donor.primaryAddress?.additionalLine2 || '',
    city: donor.primaryAddress?.city || 'Phoenix',
    state: donor.primaryAddress?.state || 'AZ',
    zipCode: donor.primaryAddress?.zipCode || '85016',
    addressType: donor.primaryAddress?.type || 'Home',

    // Professional Details
    jobTitle: donor.jobTitle || 'Chief Operating Officer',
    company: donor.company || 'Banks Financial Group',
    department: donor.department || '',
    industry: donor.industry || '',
    linkedinProfile: donor.linkedinProfile || '',
    website: donor.website || 'www.cmdi.com',

    // Relationship Information
    spouse: donor.spouse || 'Ellen',
    relationshipStatus: donor.relationshipStatus || '',

    // Social Media & Online Presence
    facebook: donor.facebook || 'https://www.facebook.com/cmdi.crimso',
    twitter: donor.twitter || 'https://twitter.com/CrimsonCRM',

    // Preferences
    communicationPreferences: donor.communicationPreferences || [],
    preferredContactMethod: donor.preferredContactMethod || 'Email',
    languagePreference: donor.languagePreference || 'English'
  });

  // Toggle panel collapse
  const togglePanelCollapse = (panelId: string) => {
    setCollapsedPanels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(panelId)) {
        newSet.delete(panelId);
      } else {
        newSet.add(panelId);
      }
      return newSet;
    });
  };

  // Edit modal handlers
  const handleEditClick = () => {
    setIsEditModalOpen(true);
    setActiveModalTab('personal'); // Reset to first tab when opening
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setActiveModalTab('personal'); // Reset tab when closing
  };

  const handleEditFormChange = (field: string, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditFormSave = () => {
    // In a real implementation, this would save to the backend
    console.log('Saving donor profile:', editFormData);
    setIsEditModalOpen(false);
    // You could update the donor object here or trigger a refetch
  };
  const [draggedPanel, setDraggedPanel] = useState<string | null>(null);

  // Drag and drop state for overview panels
  const [overviewPanelOrder, setOverviewPanelOrder] = useState([
    'aiInsights', 'recentActivity', 'givingSummary'
  ]);
  const [draggedOverviewPanel, setDraggedOverviewPanel] = useState<string | null>(null);

  // Helper functions
  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  };

  // Get smart tags for this donor based on their profile
  const getSmartTags = () => {
    const tags = [];

    // Big Givers - donors who gave above $500 in last 12 months
    if (donor.givingOverview?.totalRaised > 500) {
      tags.push({ name: 'Big Givers', emoji: '💰', color: '#10B981' });
    }

    // Prime Persuadables - FL residents, Age 35-44, or high engagement
    if (donor.primaryAddress?.state === 'FL' || donor.name.includes('Joseph')) {
      tags.push({ name: 'Prime Persuadables', emoji: '🎯', color: '#8B5CF6' });
    }

    // New & Rising Donors - recent first-time donors or upgrades
    if (donor.givingOverview?.consecutiveGifts <= 3) {
      tags.push({ name: 'New & Rising Donors', emoji: '⚡', color: '#3B82F6' });
    }

    return tags;
  };

  // Classification code color mapping (matching SmartTags light background pattern)
  const getCodeColorClasses = (color: string) => {
    switch (color) {
      case 'red': return 'bg-red-100 text-red-700 border-red-300';
      case 'orange': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'blue': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'purple': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'cyan': return 'bg-cyan-100 text-cyan-700 border-cyan-300';
      case 'green': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  // Get hex color values for SmartTags-style inline styling
  const getCodeHexColor = (color: string) => {
    switch (color) {
      case 'red': return '#ef4444';
      case 'orange': return '#f97316';
      case 'blue': return '#3b82f6';
      case 'purple': return '#8b5cf6';
      case 'cyan': return '#06b6d4';
      case 'green': return '#10b981';
      default: return '#6b7280';
    }
  };

  // Get classification codes for this donor (matching CodesManager data structure)
  const getClassificationCodes = () => {
    const codes = [];

    // Flags (red/orange colors)
    if (donor.givingOverview?.totalRaised > 1000) {
      codes.push({
        id: 'vip-1',
        code: 'VIP',
        name: 'VIP Donor',
        color: 'red',
        type: 'flag',
        date: '1/15/24',
        description: 'Major donor requiring special attention',
        star: true
      });
    }

    if (donor.name.includes('Joseph')) {
      codes.push({
        id: 'board-1',
        code: 'BOARD',
        name: 'Board Member',
        color: 'orange',
        type: 'flag',
        date: '1/1/24',
        description: 'Organization board member',
        star: true
      });
    }

    // Keywords (purple colors)
    if (donor.primaryAddress?.state === 'IL') {
      codes.push({
        id: 'local-1',
        code: 'LOCAL',
        name: 'Local Supporter',
        color: 'purple',
        type: 'keyword',
        date: '1/20/24',
        description: 'Local community supporter'
      });
    }

    // Attributes (cyan colors)
    if (donor.givingOverview?.consecutiveGifts > 2) {
      codes.push({
        id: 'recur-1',
        code: 'RECUR',
        name: 'Recurring Donor',
        color: 'cyan',
        type: 'attribute',
        date: '2/10/24',
        description: 'Consistent recurring donations'
      });
    }

    return codes.slice(0, 3); // Return most recent 3 codes
  };

  // Get all classification codes for modal (including additional samples)
  const getAllClassificationCodes = () => {
    return [
      ...getClassificationCodes(),
      // Additional sample codes for modal
      {
        id: 'vol-1',
        code: 'VOL',
        name: 'Volunteer',
        color: 'green',
        type: 'flag',
        date: '12/15/23',
        description: 'Active volunteer participant',
        star: true
      },
      {
        id: 'event-1',
        code: 'EVENT',
        name: 'Event Attendee',
        color: 'purple',
        type: 'keyword',
        date: '11/20/23',
        description: 'Regular event participant'
      },
      {
        id: 'corp-1',
        code: 'CORP',
        name: 'Corporate Executive',
        color: 'cyan',
        type: 'attribute',
        date: '2/1/24',
        description: 'Corporate leadership position'
      }
    ];
  };

  // Performance indicator logic
  const performance = useMemo(() => {
    const totalGiven = donor.givingOverview?.totalRaised || 0;
    const avgGift = totalGiven / (donor.givingOverview?.consecutiveGifts || 1);

    if (avgGift > 1000) return { type: 'over', color: 'orange' };
    if (avgGift > 500) return { type: 'meeting', color: 'green' };
    return { type: 'under', color: 'blue' };
  }, [donor]);

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, panelId: string) => {
    setDraggedPanel(panelId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetPanelId: string) => {
    e.preventDefault();
    if (!draggedPanel || draggedPanel === targetPanelId) return;

    const newOrder = [...panelOrder];
    const draggedIndex = newOrder.indexOf(draggedPanel);
    const targetIndex = newOrder.indexOf(targetPanelId);

    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedPanel);

    setPanelOrder(newOrder);
    setDraggedPanel(null);
  };

  const handleDragEnd = () => {
    setDraggedPanel(null);
  };

  // Overview panel drag handlers
  const handleOverviewDragStart = (e: React.DragEvent, panelId: string) => {
    setDraggedOverviewPanel(panelId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleOverviewDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleOverviewDrop = (e: React.DragEvent, targetPanelId: string) => {
    e.preventDefault();
    if (!draggedOverviewPanel || draggedOverviewPanel === targetPanelId) return;

    const newOrder = [...overviewPanelOrder];
    const draggedIndex = newOrder.indexOf(draggedOverviewPanel);
    const targetIndex = newOrder.indexOf(targetPanelId);

    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedOverviewPanel);

    setOverviewPanelOrder(newOrder);
    setDraggedOverviewPanel(null);
  };

  const handleOverviewDragEnd = () => {
    setDraggedOverviewPanel(null);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: SparklesIcon },
    { id: 'intelligence', label: 'Intelligence', icon: ChartBarIcon },
    { id: 'enriched', label: 'Enhanced Data', icon: DocumentTextIcon },
    { id: 'donor-discovery', label: 'Donor Discovery', icon: UserGroupIcon },
    { id: 'fec-insights', label: 'FEC Insights', icon: ShieldCheckIcon },
    { id: 'donations', label: 'Donations', icon: CurrencyDollarIcon },
    { id: 'actions', label: 'Actions', icon: BoltIcon },
    { id: 'more', label: 'More', icon: ChevronDownIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left - Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>People Search</span>
              <ChevronRightIcon className="w-4 h-4" />
              <span className="text-gray-900 font-medium">People Profile</span>
            </div>

            {/* Right - Actions */}
            <div className="flex items-center gap-3">
              <Button variant="secondary" size="sm" className="hover:text-gray-700" style={{ color: '#2f7fc3' }}>
                Back
              </Button>
              <Button variant="secondary" size="sm" className="text-red-600 hover:text-red-700">
                ✕
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row">
        {/* Left Sidebar - Modernized */}
        <div className="w-full lg:w-80 xl:w-96 bg-white border-r border-gray-200 lg:min-h-screen">
          {/* Profile Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="relative">
                <img
                  src={donor.photoUrl}
                  alt={donor.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl ring-2 shadow-sm transition-all duration-200 hover:shadow-md"
                  style={{ ringColor: '#2f7fc3', ringOpacity: 0.3 }}
                />
                <div className="absolute -top-1 -right-1">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-green-500 border-2 border-white shadow-sm" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 tracking-tight">{donor.name}</h1>
                <div className="text-xs text-gray-500 font-mono mb-2 bg-gray-100 px-2 py-1 rounded-md inline-block">
                  {donor.pid || 'PID-2024-001847'}
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="font-medium">Senior Software Engineer</div>
                  <div className="text-xs text-gray-500">at Microsoft Corporation</div>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex justify-center gap-2 sm:gap-3 mt-4 pb-2">
              {/* Note */}
              <button
                onClick={() => alert('Add note functionality')}
                className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full flex items-center justify-center transition-colors shadow-sm border border-blue-100"
                title="Add Note"
              >
                <PencilIcon className="w-4 h-4" />
              </button>

              {/* Email */}
              <button
                onClick={() => window.open(`mailto:${donor.primaryEmail || 'joseph.banks@email.com'}`, '_self')}
                className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full flex items-center justify-center transition-colors shadow-sm border border-blue-100"
                title={`Email ${donor.primaryEmail || 'joseph.banks@email.com'}`}
              >
                <EnvelopeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Call */}
              <button
                onClick={() => window.open(`tel:${donor.primaryPhone || '(555) 123-4567'}`, '_self')}
                className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full flex items-center justify-center transition-colors shadow-sm border border-blue-100"
                title={`Call ${formatPhone(donor.primaryPhone || '(555) 123-4567')}`}
              >
                <PhoneIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Task */}
              <button
                onClick={() => alert('Create task functionality')}
                className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full flex items-center justify-center transition-colors shadow-sm border border-blue-100"
                title="Create Task"
              >
                <PlusIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Meeting */}
              <button
                onClick={() => alert('Schedule meeting functionality')}
                className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full flex items-center justify-center transition-colors shadow-sm border border-blue-100"
                title="Schedule Meeting"
              >
                <CalendarIcon className="w-4 h-4" />
              </button>

              {/* More */}
              <button
                onClick={() => alert('More actions menu')}
                className="w-8 h-8 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full flex items-center justify-center transition-colors shadow-sm border border-blue-100"
                title="More Actions"
              >
                <MoreIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Draggable Sidebar Panels */}
          <div className="p-6 space-y-4">
            <DraggablePanelContainer
              panelOrder={panelOrder}
              draggedPanel={draggedPanel}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
              donor={donor}
              activeAITab={activeAITab}
              setActiveAITab={setActiveAITab}
              formatCurrency={formatCurrency}
              getSmartTags={getSmartTags}
              getClassificationCodes={getClassificationCodes}
              getAllClassificationCodes={getAllClassificationCodes}
              getCodeHexColor={getCodeHexColor}
              performance={performance}
              collapsedPanels={collapsedPanels}
              togglePanelCollapse={togglePanelCollapse}
              handleEditClick={handleEditClick}
              setIsCodesModalOpen={setIsCodesModalOpen}
            />
          </div>
        </div>

        {/* Right Main Content */}
        <div className="flex-1 min-w-0 w-full lg:w-auto">
          {/* Tab Navigation */}
          <div className="bg-white border-b border-gray-200">
            <nav className="flex overflow-x-auto px-4 sm:px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-gray-900'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                  style={activeTab === tab.id ? { borderBottomColor: '#2f7fc3', color: '#2f7fc3' } : {}}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-2 sm:p-4 pb-24 bg-gray-50">
            {activeTab === 'overview' && (
              <DraggableOverviewContainer
                panelOrder={overviewPanelOrder}
                draggedPanel={draggedOverviewPanel}
                onDragStart={handleOverviewDragStart}
                onDragOver={handleOverviewDragOver}
                onDrop={handleOverviewDrop}
                onDragEnd={handleOverviewDragEnd}
                donor={donor}
                activeAITab={activeAITab}
                setActiveAITab={setActiveAITab}
              />
            )}

            {activeTab === 'intelligence' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Contact Intelligence</h3>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <p className="text-gray-600">Contact intelligence and communication insights will be displayed here.</p>
                </div>
              </div>
            )}

            {activeTab === 'enriched' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Enhanced Data</h3>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <p className="text-gray-600">Enhanced donor data will be displayed here.</p>
                </div>
              </div>
            )}

            {activeTab === 'donor-discovery' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Donor Discovery</h3>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <p className="text-gray-600">Donor discovery and lookalike analysis will be displayed here.</p>
                </div>
              </div>
            )}

            {activeTab === 'fec-insights' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">FEC Insights</h3>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <p className="text-gray-600">FEC compliance and insights will be displayed here.</p>
                </div>
              </div>
            )}

            {activeTab === 'donations' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Donation History</h3>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <p className="text-gray-600">Donation history and gift management will be displayed here.</p>
                </div>
              </div>
            )}

            {activeTab === 'actions' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Actions & Campaigns</h3>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <p className="text-gray-600">Action items and campaign management will be displayed here.</p>
                </div>
              </div>
            )}

            {activeTab === 'more' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">More Options</h3>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <p className="text-gray-600">Additional options and settings will be displayed here.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Footer Action Menu */}
      <ActionFooter />

      {/* Edit Contact Info Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm sm:max-w-2xl lg:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-gray-50">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Edit Donor Profile</h3>
              <button
                onClick={handleEditModalClose}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex overflow-x-auto border-b bg-white">
              {[
                { id: 'personal', label: 'Personal', icon: '👤' },
                { id: 'contact', label: 'Contact', icon: '📞' },
                { id: 'address', label: 'Address', icon: '📍' },
                { id: 'professional', label: 'Professional', icon: '💼' },
                { id: 'relationship', label: 'Relationship', icon: '👥' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveModalTab(tab.id as any)}
                  className={`flex-1 min-w-0 px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    activeModalTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-1 sm:mr-2">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.slice(0, 4)}</span>
                </button>
              ))}
            </div>
            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-6">
              {/* Personal Information Tab */}
              {activeModalTab === 'personal' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prefix</label>
                      <select
                        value={editFormData.prefix}
                        onChange={(e) => handleEditFormChange('prefix', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="Mr.">Mr.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Ms.">Ms.</option>
                        <option value="Dr.">Dr.</option>
                        <option value="Prof.">Prof.</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        value={editFormData.firstName}
                        onChange={(e) => handleEditFormChange('firstName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                      <input
                        type="text"
                        value={editFormData.middleName}
                        onChange={(e) => handleEditFormChange('middleName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        value={editFormData.lastName}
                        onChange={(e) => handleEditFormChange('lastName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Suffix</label>
                      <input
                        type="text"
                        value={editFormData.suffix}
                        onChange={(e) => handleEditFormChange('suffix', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Sr., Jr., III, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Name</label>
                      <input
                        type="text"
                        value={editFormData.preferredName}
                        onChange={(e) => handleEditFormChange('preferredName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        value={editFormData.gender}
                        onChange={(e) => handleEditFormChange('gender', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={editFormData.dateOfBirth}
                      onChange={(e) => handleEditFormChange('dateOfBirth', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Contact Information Tab */}
              {activeModalTab === 'contact' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Primary Email</label>
                      <input
                        type="email"
                        value={editFormData.primaryEmail}
                        onChange={(e) => handleEditFormChange('primaryEmail', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Email</label>
                      <input
                        type="email"
                        value={editFormData.secondaryEmail}
                        onChange={(e) => handleEditFormChange('secondaryEmail', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Home Phone</label>
                      <input
                        type="tel"
                        value={editFormData.homePhone}
                        onChange={(e) => handleEditFormChange('homePhone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Phone</label>
                      <input
                        type="tel"
                        value={editFormData.mobilePhone}
                        onChange={(e) => handleEditFormChange('mobilePhone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Work Phone</label>
                      <input
                        type="tel"
                        value={editFormData.workPhone}
                        onChange={(e) => handleEditFormChange('workPhone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fax</label>
                      <input
                        type="tel"
                        value={editFormData.fax}
                        onChange={(e) => handleEditFormChange('fax', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                      <input
                        type="url"
                        value={editFormData.website}
                        onChange={(e) => handleEditFormChange('website', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="https://www.example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Contact Method</label>
                      <select
                        value={editFormData.preferredContactMethod}
                        onChange={(e) => handleEditFormChange('preferredContactMethod', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="Email">Email</option>
                        <option value="Phone">Phone</option>
                        <option value="Mail">Mail</option>
                        <option value="Text">Text</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                      <input
                        type="url"
                        value={editFormData.facebook}
                        onChange={(e) => handleEditFormChange('facebook', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="https://www.facebook.com/username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                      <input
                        type="url"
                        value={editFormData.twitter}
                        onChange={(e) => handleEditFormChange('twitter', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Address Information Tab */}
              {activeModalTab === 'address' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                    <select
                      value={editFormData.addressType}
                      onChange={(e) => handleEditFormChange('addressType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Mailing">Mailing</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      value={editFormData.street}
                      onChange={(e) => handleEditFormChange('street', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Address Line 1</label>
                    <input
                      type="text"
                      value={editFormData.additionalAddressLine1}
                      onChange={(e) => handleEditFormChange('additionalAddressLine1', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Apartment, suite, unit, building, floor, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Address Line 2</label>
                    <input
                      type="text"
                      value={editFormData.additionalAddressLine2}
                      onChange={(e) => handleEditFormChange('additionalAddressLine2', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        value={editFormData.city}
                        onChange={(e) => handleEditFormChange('city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        value={editFormData.state}
                        onChange={(e) => handleEditFormChange('state', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                      <input
                        type="text"
                        value={editFormData.zipCode}
                        onChange={(e) => handleEditFormChange('zipCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Professional Information Tab */}
              {activeModalTab === 'professional' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                      <input
                        type="text"
                        value={editFormData.jobTitle}
                        onChange={(e) => handleEditFormChange('jobTitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                      <input
                        type="text"
                        value={editFormData.company}
                        onChange={(e) => handleEditFormChange('company', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <input
                        type="text"
                        value={editFormData.department}
                        onChange={(e) => handleEditFormChange('department', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                      <input
                        type="text"
                        value={editFormData.industry}
                        onChange={(e) => handleEditFormChange('industry', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile</label>
                    <input
                      type="url"
                      value={editFormData.linkedinProfile}
                      onChange={(e) => handleEditFormChange('linkedinProfile', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="https://www.linkedin.com/in/username"
                    />
                  </div>
                </div>
              )}

              {/* Relationship Information Tab */}
              {activeModalTab === 'relationship' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Spouse/Partner</label>
                      <input
                        type="text"
                        value={editFormData.spouse}
                        onChange={(e) => handleEditFormChange('spouse', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Relationship Status</label>
                      <select
                        value={editFormData.relationshipStatus}
                        onChange={(e) => handleEditFormChange('relationshipStatus', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="">Select Status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                        <option value="Partnership">Partnership</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language Preference</label>
                    <select
                      value={editFormData.languagePreference}
                      onChange={(e) => handleEditFormChange('languagePreference', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t bg-gray-50">
              <button
                onClick={handleEditModalClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditFormSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Classification Codes Modal - Matching CodesManager Layout */}
      {isCodesModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">Classification Codes</h3>
              <button
                onClick={() => setIsCodesModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-4">
                <button className="py-3 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm">
                  Flags
                </button>
                <button className="py-3 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm">
                  Keywords
                </button>
                <button className="py-3 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm">
                  Attributes
                </button>
              </nav>
            </div>

            {/* Modal Content - Two Column Layout */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">

                {/* Available Codes - Left Column */}
                <div className="lg:col-span-2">
                  <div className="bg-white border border-gray-200 rounded-lg h-full flex flex-col">
                    <div className="p-4 border-b bg-gray-50">
                      <h4 className="font-medium text-gray-900 mb-2">Available Flags</h4>
                      <div className="relative">
                        <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search available flags..."
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                      <div className="space-y-2">
                        {/* Sample available codes */}
                        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <span
                              className="px-2.5 py-0.5 text-xs font-medium rounded-full"
                              style={{
                                backgroundColor: `${getCodeHexColor('red')}15`,
                                border: `1px solid ${getCodeHexColor('red')}40`,
                                color: getCodeHexColor('red')
                              }}
                            >
                              DNM
                            </span>
                            <span className="text-sm text-gray-700">Do Not Mail</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <span
                              className="px-2.5 py-0.5 text-xs font-medium rounded-full"
                              style={{
                                backgroundColor: `${getCodeHexColor('orange')}15`,
                                border: `1px solid ${getCodeHexColor('orange')}40`,
                                color: getCodeHexColor('orange')
                              }}
                            >
                              LIST1
                            </span>
                            <span className="text-sm text-gray-700">List 1 Prospect</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow Buttons - Center */}
                <div className="lg:col-span-1 flex flex-col items-center justify-center gap-4">
                  <button className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-3 rounded-lg transition-colors">
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                  <button className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-3 rounded-lg transition-colors">
                    <ChevronLeftIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Assigned Codes - Right Column */}
                <div className="lg:col-span-2">
                  <div className="bg-white border border-gray-200 rounded-lg h-full flex flex-col">
                    <div className="p-4 border-b bg-gray-50">
                      <h4 className="font-medium text-gray-900 mb-2">Assigned Flags</h4>
                      <div className="relative">
                        <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search assigned flags..."
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                      <div className="space-y-2">
                        {getAllClassificationCodes().map((code) => (
                          <div
                            key={code.id}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="px-2.5 py-0.5 text-xs font-medium rounded-full"
                                style={{
                                  backgroundColor: `${getCodeHexColor(code.color)}15`,
                                  border: `1px solid ${getCodeHexColor(code.color)}40`,
                                  color: getCodeHexColor(code.color)
                                }}
                              >
                                {code.code}
                              </span>
                              <span className="text-sm text-gray-700">{code.name}</span>
                              <span className="text-xs text-gray-500">({code.date})</span>
                            </div>
                            {code.star && <span className="text-orange-500">★</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
              <button
                onClick={() => setIsCodesModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => alert('Save changes functionality')}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Draggable Panel Container Component
interface DraggablePanelContainerProps {
  panelOrder: string[];
  draggedPanel: string | null;
  onDragStart: (e: React.DragEvent, panelId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetPanelId: string) => void;
  onDragEnd: () => void;
  donor: Donor;
  activeAITab: 'insights' | 'bio';
  setActiveAITab: (tab: 'insights' | 'bio') => void;
  formatCurrency: (amount: number) => string;
  getSmartTags: () => any[];
  getClassificationCodes: () => any[];
  getAllClassificationCodes: () => any[];
  getCodeHexColor: (color: string) => string;
  performance: any;
  collapsedPanels: Set<string>;
  togglePanelCollapse: (panelId: string) => void;
  handleEditClick: () => void;
  setIsCodesModalOpen: (open: boolean) => void;
}

const DraggablePanelContainer: React.FC<DraggablePanelContainerProps> = ({
  panelOrder,
  draggedPanel,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  donor,
  activeAITab,
  setActiveAITab,
  formatCurrency,
  getSmartTags,
  getClassificationCodes,
  getAllClassificationCodes,
  getCodeHexColor,
  performance,
  collapsedPanels,
  togglePanelCollapse,
  handleEditClick,
  setIsCodesModalOpen
}) => {
  const renderPanel = (panelId: string) => {
    const isDragging = draggedPanel === panelId;
    const baseClasses = `bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-3 cursor-move transition-all duration-300 shadow-sm hover:shadow-md ${
      isDragging ? 'opacity-50 scale-95 shadow-lg' : 'hover:bg-white hover:border-gray-300/60 hover:scale-[1.02]'
    }`;

    switch (panelId) {
      case 'smartTags':
        return (
          <div
            key={panelId}
            draggable
            onDragStart={(e) => onDragStart(e, panelId)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, panelId)}
            onDragEnd={onDragEnd}
            className={baseClasses}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => togglePanelCollapse('smartTags')}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Collapse Smart Tags"
                >
                  <ChevronDownIcon
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      collapsedPanels.has('smartTags') ? '-rotate-90' : ''
                    }`}
                  />
                </button>
                <h3 className="text-base font-semibold text-gray-900 tracking-tight flex items-center gap-1">
                  Smart Tags
                  <SparklesIcon className="w-3.5 h-3.5 text-purple-500" />
                  <SparklesIcon className="w-3.5 h-3.5 text-purple-500" />
                </h3>
              </div>
              <div className="flex items-center gap-1">
                {/* Action buttons can be added here in the future */}
              </div>
            </div>
            {!collapsedPanels.has('smartTags') && (
              <div className="flex flex-wrap gap-2">
                {getSmartTags().map((tag, index) => (
                  <SmartTag
                    key={index}
                    name={tag.name}
                    emoji={tag.emoji}
                    color={tag.color}
                    size="sm"
                    showAI={true}
                  />
                ))}
              </div>
            )}
          </div>
        );

      case 'contact':
        return (
          <div
            key={panelId}
            draggable
            onDragStart={(e) => onDragStart(e, panelId)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, panelId)}
            onDragEnd={onDragEnd}
            className={baseClasses}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => togglePanelCollapse('contact')}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Collapse Contact Info"
                >
                  <ChevronDownIcon
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      collapsedPanels.has('contact') ? '-rotate-90' : ''
                    }`}
                  />
                </button>
                <h3 className="text-sm font-semibold text-gray-900 tracking-tight">Contact Info</h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleEditClick}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit Contact Info"
                >
                  <PencilIcon className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </div>
            </div>
            {!collapsedPanels.has('contact') && (
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
                    <EnvelopeIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-medium hover:opacity-80 text-xs" style={{ color: '#2f7fc3' }}>
                    {donor.primaryEmail || 'joseph.banks@email.com'}
                  </span>
                </div>
                <div className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
                    <PhoneIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-medium hover:opacity-80 text-xs" style={{ color: '#2f7fc3' }}>
                    {formatPhone(donor.primaryPhone || '(555) 123-4567')}
                  </span>
                </div>
                <div className="flex items-start gap-2 py-1.5 px-2 rounded-lg hover:bg-gray-50/50 transition-colors">
                  <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center mt-0.5 border border-gray-200">
                    <MapPinIcon className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="text-gray-700 font-medium text-xs leading-relaxed">
                    <div>{donor.primaryAddress?.street || '987 Neighborhood Ave'}</div>
                    <div>
                      {donor.primaryAddress?.city || 'Springfield'}, {donor.primaryAddress?.state || 'IL'} {donor.primaryAddress?.zipCode || '62701'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'codes':
        return (
          <div
            key={panelId}
            draggable
            onDragStart={(e) => onDragStart(e, panelId)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, panelId)}
            onDragEnd={onDragEnd}
            className={baseClasses}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => togglePanelCollapse('codes')}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Collapse Codes"
                >
                  <ChevronDownIcon
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      collapsedPanels.has('codes') ? '-rotate-90' : ''
                    }`}
                  />
                </button>
                <h3 className="text-base font-semibold text-gray-900 tracking-tight">Codes</h3>
              </div>
              <div className="flex items-center gap-1">
                {/* Action buttons can be added here in the future */}
              </div>
            </div>
            {!collapsedPanels.has('codes') && (
              <div className="space-y-3">
                {getClassificationCodes().length > 0 ? (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {getClassificationCodes().map((code) => (
                        <div
                          key={code.id}
                          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-105"
                          style={{
                            backgroundColor: `${getCodeHexColor(code.color)}15`,
                            border: `1px solid ${getCodeHexColor(code.color)}40`,
                            color: getCodeHexColor(code.color)
                          }}
                          onClick={() => alert(`Clicked ${code.name} (${code.code})`)}
                          title={`${code.description} - Applied ${code.date}`}
                        >
                          <span className="font-medium">{code.code}</span>
                          {code.star && <span className="text-orange-500">★</span>}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setIsCodesModalOpen(true)}
                      className="text-xs font-medium transition-all duration-200 hover:opacity-80"
                      style={{ color: '#2f7fc3' }}
                    >
                      View All Codes
                    </button>
                  </>
                ) : (
                  <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    No classification codes applied
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'experts':
        return (
          <div
            key={panelId}
            draggable
            onDragStart={(e) => onDragStart(e, panelId)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, panelId)}
            onDragEnd={onDragEnd}
            className={baseClasses}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => togglePanelCollapse('experts')}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Collapse Assigned Experts"
                >
                  <ChevronDownIcon
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      collapsedPanels.has('experts') ? '-rotate-90' : ''
                    }`}
                  />
                </button>
                <h3 className="text-base font-semibold text-gray-900 tracking-tight">Assigned Experts</h3>
              </div>
              <div className="flex items-center gap-1">
                {/* Action buttons can be added here in the future */}
              </div>
            </div>
            {!collapsedPanels.has('experts') && (
              <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                    <UserIcon className="w-3 h-3 text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-indigo-900">Sarah Johnson</div>
                    <div className="text-xs text-indigo-600">Development Officer</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'notes':
        return (
          <div
            key={panelId}
            draggable
            onDragStart={(e) => onDragStart(e, panelId)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, panelId)}
            onDragEnd={onDragEnd}
            className={baseClasses}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => togglePanelCollapse('notes')}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Collapse Notes"
                >
                  <ChevronDownIcon
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      collapsedPanels.has('notes') ? '-rotate-90' : ''
                    }`}
                  />
                </button>
                <h3 className="text-base font-semibold text-gray-900 tracking-tight">Notes</h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Add Note"
                >
                  <PlusIcon className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </div>
            </div>
            {!collapsedPanels.has('notes') && (
              <div className="space-y-2">
                <div className="bg-yellow-50/70 border border-yellow-200/60 p-3 rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-yellow-100 rounded-lg flex items-center justify-center mt-0.5">
                      <ClipboardDocumentIcon className="w-3 h-3 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-yellow-900 mb-1">Recent Note</div>
                      <div className="text-sm text-yellow-800 leading-relaxed">Interested in major gift opportunity for new science building.</div>
                      <div className="text-xs text-yellow-600 mt-2 flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" />
                        Added 2 days ago
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );



      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      {panelOrder.map(renderPanel)}
    </div>
  );
};

// Draggable Overview Container Component
interface DraggableOverviewContainerProps {
  panelOrder: string[];
  draggedPanel: string | null;
  onDragStart: (e: React.DragEvent, panelId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetPanelId: string) => void;
  onDragEnd: () => void;
  donor: Donor;
  activeAITab: 'insights' | 'bio';
  setActiveAITab: (tab: 'insights' | 'bio') => void;
}

const DraggableOverviewContainer: React.FC<DraggableOverviewContainerProps> = ({
  panelOrder,
  draggedPanel,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  donor,
  activeAITab,
  setActiveAITab
}) => {
  const renderOverviewPanel = (panelId: string) => {
    const isDragging = draggedPanel === panelId;
    const baseClasses = `bg-white rounded-lg border border-gray-200 p-6 mb-6 cursor-move transition-all duration-200 ${
      isDragging ? 'opacity-50 scale-95' : 'hover:shadow-md'
    }`;

    switch (panelId) {
      case 'aiInsights':
        return (
          <div
            key={panelId}
            draggable
            onDragStart={(e) => onDragStart(e, panelId)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, panelId)}
            onDragEnd={onDragEnd}
            className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 cursor-move transition-all duration-200 hover:shadow-md"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(135deg, #2f7fc3 0%, #10b981 100%)' }}>
                  <SparklesIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    AI Insights
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-500">Level-Up List</span>
                  </div>
                </div>
              </div>
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setActiveAITab('insights')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                    activeAITab === 'insights'
                      ? 'bg-white shadow-sm'
                      : 'hover:bg-white/50'
                  }`}
                  style={{
                    color: activeAITab === 'insights' ? '#2f7fc3' : '#6b7280'
                  }}
                >
                  <SparklesIcon className="w-3 h-3 inline mr-1" style={{ color: '#2f7fc3' }} />
                  Insights
                </button>
                <button
                  onClick={() => setActiveAITab('bio')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                    activeAITab === 'bio'
                      ? 'bg-white shadow-sm'
                      : 'hover:bg-white/50'
                  }`}
                  style={{
                    color: activeAITab === 'bio' ? '#2f7fc3' : '#6b7280'
                  }}
                >
                  <SparklesIcon className="w-3 h-3 inline mr-1" style={{ color: '#2f7fc3' }} />
                  Smart Bio
                </button>
              </div>
            </div>

            {activeAITab === 'insights' && (
              <div className="space-y-3">
                {/* Compact 2-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Left Column: Giving Metrics */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-200 transition-all duration-200 hover:shadow-sm">
                        <div className="text-xs text-gray-600 mb-1">Total Given</div>
                        <div className="text-lg font-bold text-gray-900">$15,200</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-200 transition-all duration-200 hover:shadow-sm">
                        <div className="text-xs text-gray-600 mb-1">Potential</div>
                        <div className="text-lg font-bold text-gray-900">$24,500</div>
                      </div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-xl border border-green-200 transition-all duration-200 hover:shadow-sm">
                      <div className="text-xs text-gray-600 mb-1">Suggested Ask</div>
                      <div className="text-xl font-bold text-green-700">$1,000</div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="h-2 rounded-full" style={{width: '62%', background: `linear-gradient(to right, #2f7fc3, #10b981)`}}></div>
                    </div>
                  </div>

                  {/* Right Column: Insights & Actions */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200 transition-all duration-200 hover:shadow-sm">
                      <div className="w-4 h-4 bg-orange-500 rounded flex items-center justify-center flex-shrink-0">
                        <ExclamationTriangleIcon className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-700 text-xs font-medium">Below capacity at 62% - eligible for upgrade.</span>
                    </div>

                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200 transition-all duration-200 hover:shadow-sm">
                      <div className="w-4 h-4 bg-green-500 rounded flex items-center justify-center flex-shrink-0">
                        <ClockIcon className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-700 text-xs font-medium">Gift Readiness: Next 30 Days</span>
                    </div>

                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200 transition-all duration-200 hover:shadow-sm">
                      <div className="w-4 h-4 bg-yellow-500 rounded flex items-center justify-center flex-shrink-0">
                        <BoltIcon className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-700 text-xs font-medium">Recurring Readiness: 58% - Suggested Monthly $125</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      <button className="flex items-center justify-center gap-1 text-white text-xs font-medium py-2 px-2 rounded-lg transition-colors" style={{ backgroundColor: '#2f7fc3' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e6ba8'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2f7fc3'}>
                        <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                        DialR
                      </button>
                      <button className="flex items-center justify-center gap-1 text-white text-xs font-medium py-2 px-2 rounded-lg transition-colors" style={{ backgroundColor: '#2f7fc3' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e6ba8'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2f7fc3'}>
                        <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                        TargetPath
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeAITab === 'bio' && (
              <div className="rounded-xl p-4 border border-gray-200" style={{background: 'linear-gradient(135deg, #dbeafe 0%, #dcfce7 100%)'}}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{backgroundColor: '#2f7fc3'}}>
                    <SparklesIcon className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Smart Bio</h4>
                    <span className="text-xs text-gray-600">AI Research</span>
                  </div>
                </div>

                <div className="text-center py-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Generate an AI-researched donor bio</h3>
                  <p className="text-xs text-gray-600 mb-4">(2–3 sentences + giving summary)</p>
                  <button className="text-white text-xs font-semibold py-2 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg" style={{background: 'linear-gradient(135deg, #2f7fc3 0%, #10b981 100%)'}} onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #1e6ba8 0%, #059669 100%)'} onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #2f7fc3 0%, #10b981 100%)'}>
                    <SparklesIcon className="w-3 h-3 inline mr-1" />
                    Create Bio
                  </button>
                </div>
              </div>
            )}
            </div>
          </div>
        );

      case 'recentActivity':
        return (
          <div
            key={panelId}
            draggable
            onDragStart={(e) => onDragStart(e, panelId)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, panelId)}
            onDragEnd={onDragEnd}
            className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 cursor-move transition-all duration-200 hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <button className="text-sm font-medium transition-all duration-200 hover:opacity-80" style={{ color: '#2f7fc3' }}>
                  Show all
                </button>
              </div>

              <div className="space-y-3">
                {[
                  {
                    id: 1,
                    type: 'gift',
                    title: 'Major Gift Received:',
                    description: 'Contributed $1,000 to Q1 2024 Campaign',
                    amount: '$1,000',
                    date: 'Feb 14'
                  },
                  {
                    id: 2,
                    type: 'call',
                    title: 'DialR Call Completed:',
                    description: '$1,000 Pledge',
                    date: 'Feb 9'
                  },
                  {
                    id: 3,
                    type: 'event',
                    title: 'Event RSVP Updated:',
                    description: 'Arlington 09/20/2025: Yes',
                    date: 'Feb 9'
                  }
                ].map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 py-2 border-l-2 border-gray-100 pl-4 hover:border-blue-200 transition-colors">
                    <div className="w-4 h-4 bg-gray-200 rounded-full flex-shrink-0 mt-1"></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 leading-relaxed">
                            <span className="font-medium text-gray-700">{activity.title}</span>
                            {' '}
                            <span className="text-gray-600">{activity.description}</span>
                            {activity.amount && (
                              <>
                                {' '}
                                <span className="font-semibold" style={{ color: '#2f7fc3' }}>
                                  {activity.amount}
                                </span>
                              </>
                            )}
                          </p>
                        </div>
                        <div className="text-xs text-gray-400 ml-4 flex-shrink-0 mt-0.5">
                          {activity.date}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'givingSummary':
        return (
          <div
            key={panelId}
            draggable
            onDragStart={(e) => onDragStart(e, panelId)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, panelId)}
            onDragEnd={onDragEnd}
            className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 cursor-move transition-all duration-200 hover:shadow-md"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Giving Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200 transition-all duration-200 hover:shadow-sm">
                  <p className="text-xl font-bold" style={{ color: '#2f7fc3' }}>
                    ${donor.givingOverview?.totalRaised?.toLocaleString() || '15,200'}
                  </p>
                  <p className="text-sm text-gray-600">Total Lifetime Giving</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200 transition-all duration-200 hover:shadow-sm">
                  <p className="text-xl font-bold text-green-900">
                    {donor.givingOverview?.consecutiveGifts || 12}
                  </p>
                  <p className="text-sm text-green-700">Total Gifts</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200 transition-all duration-200 hover:shadow-sm">
                  <p className="text-xl font-bold text-purple-900">
                    ${donor.givingOverview?.averageGift?.toLocaleString() || '1,900'}
                  </p>
                  <p className="text-sm text-purple-700">Average Gift</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {panelOrder.map(renderOverviewPanel)}
    </div>
  );
};

// Action Footer Component
const ActionFooter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };



  const mainActions = [
    {
      name: 'Dupe checker',
      description: 'Check for duplicate donor records',
      icon: MagnifyingGlassIcon,
      action: () => console.log('Dupe checker')
    },
    {
      name: 'Relationships',
      description: 'View and manage donor relationships',
      icon: UserGroupIcon,
      action: () => console.log('Relationships')
    },
    {
      name: 'LookUp',
      description: 'Google, LinkedIn, Google Map, Zillow, FEC.gov, WealthEngine',
      icon: ArrowTopRightOnSquareIcon,
      action: () => console.log('LookUp')
    },
    {
      name: 'Save VCard',
      description: 'Export donor contact as VCard',
      icon: AddressBookIcon,
      action: () => console.log('Save VCard')
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Main Action Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-4">
          <div
            className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-4 min-w-[320px] max-h-[500px] overflow-y-auto"
          >
            <div className="space-y-2">
              {mainActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    action.action();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/20 rounded-2xl transition-all duration-300 group backdrop-blur-sm border border-transparent hover:border-white/20"
                >
                  <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-white/40 transition-all duration-300 shadow-lg">
                    <action.icon className="w-6 h-6 text-gray-700 group-hover:text-gray-900" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-base mb-1">{action.name}</div>
                    <div className="text-sm text-gray-600">{action.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Toggle Button */}
      <button
        onClick={toggleMenu}
        className={`w-14 h-14 rounded-full bg-gray-900 hover:bg-gray-800 border border-gray-700 flex items-center justify-center shadow-lg hover:shadow-xl transform transition-all duration-300 ${
          isOpen ? 'rotate-45 scale-110' : 'hover:scale-105'
        }`}
      >
        <span className="text-white text-2xl font-light">+</span>
      </button>

    </div>
  );
};

export default DonorProfileLayoutTest3;
