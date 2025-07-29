
import React, { useState } from 'react';
import { ReactNode } from 'react';
import { NavItem, View } from '../../types';
import { HomeIcon, UsersIcon, FundraisingIcon, ComplianceIcon, TreasuryIcon, DataEntryIcon, CalendarIcon, MoreIcon, SettingsIcon, SystemIcon, ChevronRightIcon, SparklesIcon, ChevronDoubleRightIcon, ChevronDoubleLeftIcon, MagnifyingGlassIcon } from '../../constants';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

const NavLink: React.FC<{ item: NavItem; isActive: boolean; onClick: (id: View) => void; isCollapsed: boolean }> = ({ item, isActive, onClick, isCollapsed }) => {
  const activeClasses = 'bg-crimson-blue/10 text-crimson-blue';
  const inactiveClasses = 'text-slate-500 hover:bg-slate-100 hover:text-slate-800';

  return (
    <li>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onClick(item.id);
        }}
        className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-2.5 my-1 rounded-lg text-sm font-medium transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}
        title={isCollapsed ? item.label : undefined}
      >
        <div className={`flex items-center ${isCollapsed ? '' : 'gap-3'}`}>
          <span className={isActive ? 'text-crimson-blue' : 'text-slate-400'}>{item.icon}</span>
          {!isCollapsed && <span>{item.label}</span>}
        </div>
        {!isCollapsed && item.subItems && <ChevronRightIcon className="h-4 w-4" />}
      </a>
    </li>
  );
};


const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: <HomeIcon className="w-5 h-5" /> },
    { id: 'people', label: 'People', icon: <UsersIcon className="w-5 h-5" /> },
    { id: 'fundraising', label: 'Fundraising', icon: <FundraisingIcon className="w-5 h-5" /> },
    { id: 'compliance', label: 'Compliance', icon: <ComplianceIcon className="w-5 h-5" /> },
    { id: 'treasury', label: 'Treasury', icon: <TreasuryIcon className="w-5 h-5" /> },
    { id: 'data-entry', label: 'Data Entry', icon: <DataEntryIcon className="w-5 h-5" /> },
    { id: 'events', label: 'Event', icon: <CalendarIcon className="w-5 h-5" /> },
    { id: 'more', label: 'More', icon: <MoreIcon className="w-5 h-5" /> },
  ];

  const systemNavItems: NavItem[] = [
    { id: 'search-demo', label: 'Search Demo', icon: <MagnifyingGlassIcon className="w-5 h-5" /> },
    { id: 'donor-profile-demo', label: 'Enhanced Profiles', icon: <SparklesIcon className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-5 h-5" /> },
    { id: 'system', label: 'System', icon: <SystemIcon className="w-5 h-5" /> },
  ];

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-64'} bg-base-100 border-r border-base-300 flex flex-col p-4 transition-all duration-300 relative`}>
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-8 px-2`}>
        <div className="flex items-center gap-2">
          <SparklesIcon className="w-8 h-8 text-crimson-red"/>
          {!isCollapsed && <h1 className="text-xl font-bold text-crimson-dark-blue">Crimson</h1>}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center justify-center w-8 h-8 hover:bg-slate-100 rounded-lg transition-colors"
          title={isCollapsed ? "Expand menu" : "Collapse menu"}
        >
          {isCollapsed ? (
            <ChevronDoubleRightIcon className="w-4 h-4 text-slate-600" />
          ) : (
            <ChevronDoubleLeftIcon className="w-4 h-4 text-slate-600" />
          )}
        </button>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-1">
          {navItems.map(item => (
            <NavLink key={item.id} item={item} isActive={currentView === item.id} onClick={setView} isCollapsed={isCollapsed} />
          ))}
        </ul>
      </nav>
      <div>
        {!isCollapsed && (
          <div className="p-4 my-4 rounded-lg bg-gradient-to-br from-crimson-blue to-crimson-accent-blue text-white text-center">
            <SparklesIcon className="mx-auto h-8 w-8 mb-2" />
            <h4 className="font-bold">Crimson AI Studio</h4>
            <p className="text-xs mt-1 mb-3">Unlock powerful insights and streamline your fundraising.</p>
            <button className="bg-white/20 hover:bg-white/30 text-white font-semibold text-xs py-2 px-4 rounded-lg w-full">
                Upgrade Now
            </button>
          </div>
        )}
        <ul className="space-y-1 pt-4 border-t border-base-300">
          {systemNavItems.map(item => (
            <NavLink key={item.id} item={item} isActive={currentView === item.id} onClick={setView} isCollapsed={isCollapsed} />
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;