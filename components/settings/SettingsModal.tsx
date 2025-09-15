import React, { useState } from 'react';
import { XMarkIcon, SettingsIcon, UserGroupIcon, CurrencyDollarIcon, SparklesIcon, FlagIcon } from '../../constants';
import Button from '../ui/Button';
import SmartTagsManager from './SmartTagsManager';
import PeopleCodesManager from './PeopleCodesManager';
import FundraisingCodesManager from './FundraisingCodesManager';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSection?: 'people-codes' | 'fundraising-codes';
  initialSubSection?: 'smart-tags' | 'flags' | 'keywords' | 'attributes' | 'fund-codes' | 'source-codes';
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  initialSection = 'people-codes',
  initialSubSection = 'smart-tags'
}) => {
  const [activeSection, setActiveSection] = useState<'people-codes' | 'fundraising-codes'>(initialSection);
  const [activeSubSection, setActiveSubSection] = useState<'smart-tags' | 'flags' | 'keywords' | 'attributes' | 'fund-codes' | 'source-codes'>(initialSubSection);

  if (!isOpen) return null;

  const sections = [
    {
      id: 'people-codes',
      name: 'People Codes',
      icon: UserGroupIcon,
      subsections: [
        { id: 'smart-tags', name: 'Smart Tags', icon: SparklesIcon, aiPowered: true },
        { id: 'flags', name: 'Flags', icon: FlagIcon },
        { id: 'keywords', name: 'Keywords', icon: FlagIcon },
        { id: 'attributes', name: 'Attributes', icon: FlagIcon }
      ]
    },
    {
      id: 'fundraising-codes',
      name: 'Fundraising Codes',
      icon: CurrencyDollarIcon,
      subsections: [
        { id: 'fund-codes', name: 'Fund Codes', icon: FlagIcon },
        { id: 'source-codes', name: 'Source Codes', icon: FlagIcon }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-crimson-blue to-crimson-dark-blue text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <SettingsIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">CRM Settings</h2>
                <p className="text-crimson-accent-blue text-sm">Manage codes, tags, and system preferences</p>
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

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar Navigation */}
          <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              {sections.map((section) => (
                <div key={section.id} className="mb-6">
                  <button
                    onClick={() => {
                      setActiveSection(section.id as any);
                      setActiveSubSection(section.subsections[0].id as any);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors mb-3 ${
                      activeSection === section.id
                        ? 'bg-crimson-blue text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <section.icon className="w-5 h-5" />
                    <span className="font-medium">{section.name}</span>
                  </button>

                  {activeSection === section.id && (
                    <div className="ml-4 space-y-1">
                      {section.subsections.map((subsection) => (
                        <button
                          key={subsection.id}
                          onClick={() => setActiveSubSection(subsection.id as any)}
                          className={`w-full flex items-center gap-2 p-2 rounded-md text-left text-sm transition-colors ${
                            activeSubSection === subsection.id
                              ? 'bg-crimson-blue bg-opacity-10 text-crimson-blue border border-crimson-blue border-opacity-30'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <subsection.icon className="w-4 h-4" />
                          <span>{subsection.name}</span>
                          {subsection.aiPowered && (
                            <SparklesIcon className="w-3 h-3 text-crimson-accent-blue ml-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {activeSection === 'people-codes' && activeSubSection === 'smart-tags' && (
                <SmartTagsManager />
              )}
              {activeSection === 'people-codes' && activeSubSection === 'flags' && (
                <PeopleCodesManager type="flags" />
              )}
              {activeSection === 'people-codes' && activeSubSection === 'keywords' && (
                <PeopleCodesManager type="keywords" />
              )}
              {activeSection === 'people-codes' && activeSubSection === 'attributes' && (
                <PeopleCodesManager type="attributes" />
              )}
              {activeSection === 'fundraising-codes' && activeSubSection === 'fund-codes' && (
                <FundraisingCodesManager type="fund-codes" />
              )}
              {activeSection === 'fundraising-codes' && activeSubSection === 'source-codes' && (
                <FundraisingCodesManager type="source-codes" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
