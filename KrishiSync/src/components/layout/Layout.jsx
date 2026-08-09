import React from 'react';
import TopBar from './TopBar';
import { Leaf } from 'lucide-react';

const Layout = ({ children }) => (
  <div className="bg-[#e8e0d5] min-h-screen flex justify-center w-full font-sans antialiased text-gray-900 overflow-x-hidden selection:bg-[#2d5a27] selection:text-white">
    <div className="w-full max-w-7xl bg-[#f9f8f6] min-h-screen flex flex-col relative overflow-hidden border-x border-[#e2dcd0]">
      <TopBar />
      <main className="flex-1 overflow-y-auto pb-12 custom-scrollbar relative z-10">
        {children}
      </main>

      <footer className="bg-white text-gray-700 py-8 px-6 sm:px-10 border-t border-[#e2dcd0] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#2d5a27]/10 border border-[#2d5a27]/20 rounded-md flex items-center justify-center text-[#2d5a27] font-black">
            <Leaf className="w-5 h-5" />
          </div>
          <span className="font-bold text-gray-900 text-base tracking-tight">
            Krishi<span className="text-[#2d5a27]">Sync</span>
          </span>
          <span className="text-gray-500 hidden sm:inline">| AI-Powered Precision Agriculture Platform</span>
        </div>
        <p className="m-0 text-gray-500 font-semibold">
          © 2026 KrishiSync. Empowering Indian Farmers.
        </p>
      </footer>
    </div>
  </div>
);
export default Layout;




