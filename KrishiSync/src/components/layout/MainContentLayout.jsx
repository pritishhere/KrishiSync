import React from 'react';
import AppHeader from './AppHeader';
import MobileBottomNavigation from '../navigation/MobileBottomNavigation';

const MainContentLayout = ({ children }) => {
  return (
    <div className="bg-[#111827] min-h-screen flex justify-center w-full font-heading">
      {/* Desktop constraint wrapper maintaining max 480px width */}
      <div className="w-full max-w-[480px] bg-[#F9FAFB] min-h-screen flex flex-col relative overflow-hidden shadow-2xl">
        
        <AppHeader />
        
        {/* Main Content Area - App Base #F9FAFB */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative flex flex-col bg-[#F9FAFB]">
          {children}
        </main>
        
        <MobileBottomNavigation />
        
      </div>
    </div>
  );
};

export default MainContentLayout;
