import React from 'react';
import AppHeader from './AppHeader';
import MobileBottomNavigation from '../navigation/MobileBottomNavigation';

const MainContentLayout = ({ children }) => {
  return (
    <div className="bg-[#1F2937] min-h-screen flex justify-center w-full font-sans">
      {/* Desktop constraint wrapper maintaining max 480px width */}
      <div className="w-full max-w-[480px] bg-[#F9FAFB] min-h-screen shadow-2xl flex flex-col relative overflow-hidden">
        
        <AppHeader />
        
        {/* Main Content Area - Flex-1 ensures it takes remaining space, and overflow-y-auto enables internal scrolling */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative flex flex-col bg-[#F9FAFB]">
          {children}
        </main>
        
        <MobileBottomNavigation />
        
      </div>
    </div>
  );
};

export default MainContentLayout;
