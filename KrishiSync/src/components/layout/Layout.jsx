import React from 'react';
import TopBar from './TopBar';
import BottomNav from '../navigation/BottomNav';

const Layout = ({ children }) => (
  <div className="bg-[#1F2937] min-h-screen flex justify-center w-full font-sans">
    <div className="w-full max-w-md bg-[#F9FAFB] min-h-screen shadow-2xl flex flex-col relative overflow-hidden">
      <TopBar />
      <main className="flex-1 overflow-y-auto pb-6 custom-scrollbar">
        {children}
      </main>
      <BottomNav />
    </div>
  </div>
);
export default Layout;
