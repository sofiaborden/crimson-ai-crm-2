import React, { useState } from 'react';
import { Donor } from '../../types';
import Badge from '../ui/Badge';
import { 
  ChevronRightIcon, 
  ChevronLeftIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  StarIcon
} from '../../constants';

interface CodesManagerProps {
  donor: Donor;
}

type CodeTab = 'flags' | 'keywords' | 'attributes';

const CodesManager: React.FC<CodesManagerProps> = ({ donor }) => {
  const [activeCodeTab, setActiveCodeTab] = useState<CodeTab>('flags');
  const [availableSearch, setAvailableSearch] = useState('');
  const [assignedSearch, setAssignedSearch] = useState('');
  const [includeInactive, setIncludeInactive] = useState(false);
  const [selectedAvailable, setSelectedAvailable] = useState<number[]>([]);
  const [selectedAssigned, setSelectedAssigned] = useState<number[]>([]);

  // Mock data - using state to allow actual movement
  const [availableFlags, setAvailableFlags] = useState([
    { id: 1, name: 'Bad Address', code: 'BAD', color: 'red' },
    { id: 2, name: 'Do Not Mail', code: 'DNM', color: 'red' },
    { id: 3, name: 'test', code: '1234', color: 'red' },
    { id: 4, name: 'List 1 Prospect', code: 'LIST1', color: 'orange' },
    { id: 5, name: 'TEST PRIORITY', code: 'TESTPRIO', color: 'red' }
  ]);

  const [assignedFlags, setAssignedFlags] = useState([
    { id: 6, name: 'Do Not Telephone', code: 'DNTELE', color: 'red', date: '6/27/19', star: true },
    { id: 7, name: 'Do Not Rent or Exchange', code: 'DNRE', color: 'red', date: '7/17/19', star: true },
    { id: 8, name: 'Earmarked', code: 'EAR', color: 'orange', date: '8/26/20', star: true },
    { id: 9, name: 'Biography Included', code: 'BIO', color: 'blue', date: '2/3/22', star: true },
    { id: 10, name: 'family', code: 'FAMILY', color: 'purple', date: '9/5/18', star: true }
  ]);

  const [availableKeywords, setAvailableKeywords] = useState([
    { id: 11, name: 'Data Master Prospect List', code: '(4/18/22)', color: 'purple' },
    { id: 12, name: 'Donor Prospect 5B Shilling', code: '(4/18/22)', color: 'purple' },
    { id: 13, name: 'Email Invite', code: '(4/18/22)', color: 'purple' },
    { id: 14, name: 'Event: War Room20 Invite', code: '(4/18/22)', color: 'purple' },
    { id: 15, name: 'Space Test', code: 'Space Test (9/23/20)', color: 'purple' }
  ]);

  const [assignedKeywords, setAssignedKeywords] = useState([
    { id: 16, name: 'DOOR TO DOOR', code: '(9/17/13)', color: 'purple' },
    { id: 17, name: 'Adamlist', code: '(3/28/18)', color: 'purple' },
    { id: 18, name: 'lv lx', code: '(12/7/20)', color: 'blue' },
    { id: 19, name: 'bc xvnfbfn', code: '(12/2/20)', color: 'blue' },
    { id: 20, name: 'COUNTY FAIR', code: '(9/17/13)', color: 'purple' }
  ]);

  const [availableAttributes, setAvailableAttributes] = useState([
    { id: 21, name: 'Confirmed Support', code: 'Delegate', color: 'cyan' },
    { id: 22, name: 'Form Requested', code: 'Delegate', color: 'cyan' },
    { id: 23, name: 'Not Supporting', code: 'Delegate', color: 'cyan' },
    { id: 24, name: 'Potential', code: 'Delegate', color: 'cyan' },
    { id: 25, name: 'Successfully Filed', code: 'Delegate', color: 'cyan' }
  ]);

  const [assignedAttributes, setAssignedAttributes] = useState([
    { id: 26, name: 'Event', code: '(3/25/25)', color: 'cyan', type: 'Volunteer' },
    { id: 27, name: 'Administrative', code: '(3/25/25)', color: 'cyan', type: 'Volunteer' }
  ]);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'red': return 'bg-red-500 text-white border-red-500';
      case 'orange': return 'bg-orange-500 text-white border-orange-500';
      case 'blue': return 'bg-blue-500 text-white border-blue-500';
      case 'purple': return 'bg-purple-500 text-white border-purple-500';
      case 'cyan': return 'bg-cyan-500 text-white border-cyan-500';
      case 'green': return 'bg-green-500 text-white border-green-500';
      default: return 'bg-gray-500 text-white border-gray-500';
    }
  };

  const getCurrentData = () => {
    switch (activeCodeTab) {
      case 'flags':
        return { available: availableFlags, assigned: assignedFlags };
      case 'keywords':
        return { available: availableKeywords, assigned: assignedKeywords };
      case 'attributes':
        return { available: availableAttributes, assigned: assignedAttributes };
      default:
        return { available: [], assigned: [] };
    }
  };

  const getCurrentSetters = () => {
    switch (activeCodeTab) {
      case 'flags':
        return {
          available: availableFlags,
          assigned: assignedFlags,
          setAvailable: setAvailableFlags,
          setAssigned: setAssignedFlags
        };
      case 'keywords':
        return {
          available: availableKeywords,
          assigned: assignedKeywords,
          setAvailable: setAvailableKeywords,
          setAssigned: setAssignedKeywords
        };
      case 'attributes':
        return {
          available: availableAttributes,
          assigned: assignedAttributes,
          setAvailable: setAvailableAttributes,
          setAssigned: setAssignedAttributes
        };
      default:
        return {
          available: [],
          assigned: [],
          setAvailable: () => {},
          setAssigned: () => {}
        };
    }
  };

  const { available, assigned } = getCurrentData();

  const moveToAssigned = () => {
    const { available: availableItems, setAvailable, setAssigned } = getCurrentSetters();

    // Find selected items
    const itemsToMove = availableItems.filter((item: any) => selectedAvailable.includes(item.id));

    if (itemsToMove.length === 0) {
      return;
    }

    // Add current date for newly assigned items
    const itemsWithDate = itemsToMove.map((item: any) => ({
      ...item,
      date: new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' }),
      star: true
    }));

    // Remove from available and add to assigned
    setAvailable((prev: any[]) => prev.filter((item: any) => !selectedAvailable.includes(item.id)));
    setAssigned((prev: any[]) => [...prev, ...itemsWithDate]);

    // Clear selection
    setSelectedAvailable([]);
  };

  const moveToAvailable = () => {
    const { assigned: assignedItems, setAvailable, setAssigned } = getCurrentSetters();

    // Find selected items
    const itemsToMove = assignedItems.filter((item: any) => selectedAssigned.includes(item.id));

    // Remove date and star when moving back to available
    const itemsWithoutDate = itemsToMove.map((item: any) => {
      const { date, star, ...itemWithoutDate } = item;
      return itemWithoutDate;
    });

    // Remove from assigned and add to available
    setAssigned((prev: any[]) => prev.filter((item: any) => !selectedAssigned.includes(item.id)));
    setAvailable((prev: any[]) => [...prev, ...itemsWithoutDate]);

    // Clear selection
    setSelectedAssigned([]);
  };

  const toggleAvailableSelection = (itemId: number) => {
    setSelectedAvailable(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleAssignedSelection = (itemId: number) => {
    setSelectedAssigned(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'flags', label: 'Flags' },
            { id: 'keywords', label: 'Keywords' },
            { id: 'attributes', label: 'Attributes' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCodeTab(tab.id as CodeTab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeCodeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Available Items - Left Side */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">
                Available {activeCodeTab.charAt(0).toUpperCase() + activeCodeTab.slice(1)}
              </h4>
              <div className="relative">
                <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search available ${activeCodeTab}...`}
                  value={availableSearch}
                  onChange={(e) => setAvailableSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="p-4 max-h-80 overflow-y-auto">
              <div className="space-y-2">
                {available.map((item: any) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                      selectedAvailable.includes(item.id)
                        ? 'bg-blue-100 border border-blue-300'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => toggleAvailableSelection(item.id)}
                  >
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${getColorClasses(item.color)}`}>
                        {item.code || item.name}
                      </Badge>
                      <span className="text-sm text-gray-700">{item.name}</span>
                      {item.code && item.code !== item.name && (
                        <span className="text-xs text-gray-500">{item.code}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Arrow Buttons - Center */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center gap-4">
          <button 
            onClick={moveToAssigned}
            disabled={selectedAvailable.length === 0}
            className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Move selected items to assigned"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
          <button 
            onClick={moveToAvailable}
            disabled={selectedAssigned.length === 0}
            className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Move selected items to available"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Assigned Items - Right Side */}
        <div className="lg:col-span-5">
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">
                    Assigned {activeCodeTab.charAt(0).toUpperCase() + activeCodeTab.slice(1)}
                  </h4>
                  {activeCodeTab === 'keywords' && (
                    <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg">
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="relative">
                  <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={`Search assigned ${activeCodeTab}...`}
                    value={assignedSearch}
                    onChange={(e) => setAssignedSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="p-4 max-h-80 overflow-y-auto">
                <div className="space-y-2">
                  {assigned.map((item: any) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                        selectedAssigned.includes(item.id)
                          ? 'bg-blue-100 border border-blue-300'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => toggleAssignedSelection(item.id)}
                    >
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs font-medium ${getColorClasses(item.color)}`}>
                          {activeCodeTab === 'flags' ? item.code : item.name}
                        </Badge>
                        {activeCodeTab === 'flags' && (
                          <span className="text-sm text-gray-700">{item.name}</span>
                        )}
                        {item.date && (
                          <span className="text-xs text-gray-500">({item.date})</span>
                        )}
                        {item.type && (
                          <span className="text-xs text-gray-500">- {item.type}</span>
                        )}
                      </div>
                      {item.star && <StarIcon className="w-3 h-3 text-orange-400 fill-current" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent section for attributes */}
            {activeCodeTab === 'attributes' && (
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h5 className="font-semibold text-gray-900">Recent</h5>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="includeInactive"
                          checked={includeInactive}
                          onChange={(e) => setIncludeInactive(e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="includeInactive" className="text-sm text-gray-600">
                          Include Inactive
                        </label>
                        <button className="text-blue-600 hover:text-blue-800 text-sm underline">
                          All
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="font-medium text-blue-600">Volunteer</span>
                      <span className="text-gray-500">- 4/6/20 - Present</span>
                      <span className="text-gray-600">Event</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="font-medium text-blue-600">Volunteer</span>
                      <span className="text-gray-500">- 5/24/23 - 3/23/25</span>
                      <span className="text-gray-600">Administrative</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodesManager;
