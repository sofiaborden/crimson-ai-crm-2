
import React from 'react';
import { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { View } from '../../types';

interface MainLayoutProps {
  children: ReactNode;
  currentView: View;
  setView: (view: View) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, currentView, setView }) => {
  return (
    <div className="flex h-screen bg-base-200 font-sans text-text-primary">
      <Sidebar currentView={currentView} setView={setView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;