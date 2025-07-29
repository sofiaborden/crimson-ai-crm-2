
import React, { useState } from 'react';
import { BellIcon, MailIcon, SparklesIcon } from '../../constants';
import CrimsonGPTPanel from '../ui/CrimsonGPTPanel';

const Header: React.FC = () => {
  const [showCrimsonGPT, setShowCrimsonGPT] = useState(false);

  return (
    <>
      <CrimsonGPTPanel
        isOpen={showCrimsonGPT}
        onClose={() => setShowCrimsonGPT(false)}
      />
    <header className="bg-base-100/80 backdrop-blur-lg border-b border-base-300 sticky top-0 z-10">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-4">
          <div className="relative w-96">
            <input
              type="text"
              placeholder="Quick People Search"
              className="bg-base-200 border border-slate-200 rounded-lg w-full pl-4 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-crimson-blue"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowCrimsonGPT(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-crimson-blue rounded-lg shadow-sm hover:bg-crimson-dark-blue transition-colors"
          >
            <SparklesIcon />
            <span>CrimsonGPT Beta</span>
          </button>

          <div className="flex items-center gap-2">
             <button className="p-2 rounded-full hover:bg-base-200 text-slate-500 relative">
               <MailIcon className="w-6 h-6" />
             </button>
             <button className="p-2 rounded-full hover:bg-base-200 text-slate-500 relative">
               <BellIcon className="w-6 h-6" />
               <span className="absolute top-1 right-1.5 flex h-2.5 w-2.5">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crimson-red opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-crimson-red"></span>
               </span>
             </button>
             <div className="h-8 w-px bg-slate-200 mx-2"></div>
             <button className="flex items-center gap-2">
                 <img
                    src="https://i.pravatar.cc/150?u=sofia"
                    alt="User"
                    className="w-9 h-9 rounded-full border-2 border-white shadow"
                />
             </button>
          </div>
        </div>
      </div>
    </header>
    </>
  );
};

export default Header;