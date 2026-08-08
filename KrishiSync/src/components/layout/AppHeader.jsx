import React from 'react';
import { Leaf, Globe } from 'lucide-react';

const AppHeader = () => {
  return (
    <header className="h-[64px] bg-[#FFFFFF] sticky top-0 z-40 flex items-center justify-between px-4 shrink-0 border-b border-gray-200 shadow-xs font-body">
      {/* Brand Identity */}
      <div className="flex items-center gap-2.5">
        <div className="bg-[#2E7D32] p-1.5 rounded-xl shadow-xs">
          <Leaf className="text-white" size={22} strokeWidth={2.3} />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-[20px] font-extrabold font-heading tracking-tight text-[#1F2937]">
            Krishi<span className="text-[#2E7D32]">Sync</span>
          </span>
          <span className="text-[11px] font-bold text-[#10B981] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 hidden sm:inline-block">
            v2.4 Live
          </span>
        </div>
      </div>
      
      {/* Right Controls: System Status & Language */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#10B981] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          Online
        </span>

        <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#F9FAFB] text-[#1F2937] hover:bg-gray-100 transition-all border border-gray-200 text-[13px] font-bold cursor-pointer">
          <Globe size={16} className="text-[#2E7D32]" />
          <span>EN</span>
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
