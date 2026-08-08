import React from 'react';
import { Leaf, Globe } from 'lucide-react';

const AppHeader = () => {
  return (
    <header className="h-[64px] bg-[#FFFFFF] sticky top-0 z-40 flex items-center justify-between px-4 shrink-0 border-b border-gray-100 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="bg-[#2E7D32] p-1.5 rounded-lg">
          <Leaf className="text-white" size={24} />
        </div>
        <span className="text-[20px] font-bold text-[#1F2937] tracking-tight">KrishiSync</span>
      </div>
      
      {/* Language Selector */}
      <button className="flex items-center gap-1.5 px-3 py-2 rounded-[12px] bg-[#F3F4F6] text-[#1F2937] hover:bg-gray-200 transition-colors">
        <Globe size={18} className="text-[#2E7D32]" />
        <span className="text-[14px] font-bold">EN</span>
      </button>
    </header>
  );
};

export default AppHeader;
