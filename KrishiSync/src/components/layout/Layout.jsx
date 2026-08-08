import React from 'react';
import { useLocation } from 'react-router-dom';
import TopBar from './TopBar';
import BottomNav from '../navigation/BottomNav';

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavigation = ['/login'].includes(location.pathname);

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center w-full">
      {/* Mobile constraint wrapper for desktop viewing */}
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl flex flex-col relative overflow-hidden">
        {!hideNavigation && <TopBar />}
        
        <main className="flex-1 overflow-y-auto pb-4 custom-scrollbar bg-gray-50">
          {children}
        </main>
        
        {!hideNavigation && <BottomNav />}
      </div>
    </div>
  );
};

export default Layout;
