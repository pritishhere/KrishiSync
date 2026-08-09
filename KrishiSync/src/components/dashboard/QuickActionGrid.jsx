import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scan, TrendingUp, Tractor, Bot, ArrowUpRight } from 'lucide-react';

export const QuickActionGrid = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full space-y-3 font-body">
      {/* Section Header */}
      <div className="flex items-baseline justify-between px-1">
        <h2 className="text-[19px] font-extrabold font-heading text-gray-900 tracking-tight">
          Quick Services
        </h2>
        <span className="text-[12px] font-bold text-[#2d5a27] bg-[#e8e0d5] px-2.5 py-0.5 rounded-md border border-[#e2dcd0] font-heading">
          Tap to launch
        </span>
      </div>

      {/* Grid Layout */}
      <div className="space-y-3">
        {/* HERO FEATURE TILE: CROP HEALTH SCANNER */}
        <button
          onClick={() => navigate('/scanner')}
          className="w-full bg-white text-gray-900 p-5 rounded-md border-2 border-[#e2dcd0] shadow-sm text-left hover:border-[#2d5a27] transition-all duration-150 group cursor-pointer relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-extrabold text-[#2d5a27] bg-[#e8e0d5] px-2.5 py-0.5 rounded-md font-heading border border-[#e2dcd0]">
                Featured
              </span>
              <span className="text-[12px] font-semibold text-gray-500">
                AI Diagnostics
              </span>
            </div>
            <div className="p-2.5 bg-[#2d5a27] text-white rounded-md shadow-sm transition-transform">
              <Scan size={22} strokeWidth={2.3} />
            </div>
          </div>

          <h3 className="text-[21px] font-bold font-heading text-gray-900 tracking-tight mb-1 group-hover:text-[#2d5a27] transition-colors">
            Crop Health Scanner
          </h3>
          
          <p className="text-[13px] font-medium text-gray-600 mb-4 leading-relaxed">
            Instant leaf disease detection &amp; treatment recommendations.
          </p>

          <div className="flex items-center justify-between text-[13px] font-bold text-[#2d5a27] pt-3 border-t border-[#e2dcd0] font-heading">
            <span>Launch Camera Scanner</span>
            <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
        </button>

        {/* 3-COLUMN / GRID TILES */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* TILE 02: MANDI RATES */}
          <button
            onClick={() => navigate('/mandi')}
            className="bg-white text-gray-900 p-4 rounded-md border border-[#e2dcd0] shadow-sm text-left hover:border-[#5c4033] hover:shadow-sm transition-all duration-150 group cursor-pointer flex flex-col justify-between min-h-[135px]"
          >
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold bg-[#f9f8f6] text-[#5c4033] px-2.5 py-0.5 rounded-md border border-[#e2dcd0] font-heading">
                02
              </span>
              <div className="p-2 bg-[#5c4033] text-white rounded-md shadow-sm">
                <TrendingUp size={18} strokeWidth={2.3} />
              </div>
            </div>

            <div className="mt-3">
              <h4 className="text-[16px] font-bold font-heading text-gray-900 group-hover:text-[#5c4033] transition-colors">
                Mandi Rates
              </h4>
              <p className="text-[12px] font-medium text-gray-500 mt-0.5">
                Live market prices
              </p>
            </div>
          </button>

          {/* TILE 03: AGRI-POOL */}
          <button
            onClick={() => navigate('/agri-pool')}
            className="bg-white text-gray-900 p-4 rounded-md border border-[#e2dcd0] shadow-sm text-left hover:border-[#5c4033] hover:shadow-sm transition-all duration-150 group cursor-pointer flex flex-col justify-between min-h-[135px]"
          >
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold bg-[#f9f8f6] text-[#5c4033] px-2.5 py-0.5 rounded-md border border-[#e2dcd0] font-heading">
                03
              </span>
              <div className="p-2 bg-[#5c4033] text-white rounded-md shadow-sm">
                <Tractor size={18} strokeWidth={2.3} />
              </div>
            </div>

            <div className="mt-3">
              <h4 className="text-[16px] font-bold font-heading text-gray-900 group-hover:text-[#5c4033] transition-colors">
                Agri-Pool
              </h4>
              <p className="text-[12px] font-medium text-gray-500 mt-0.5">
                Equipment sharing
              </p>
            </div>
          </button>

          {/* TILE 04: BOT GUIDE */}
          <button
            onClick={() => navigate('/bot-guide')}
            className="bg-white text-gray-900 p-4 rounded-md border border-[#e2dcd0] shadow-sm text-left hover:border-[#2d5a27] hover:shadow-sm transition-all duration-150 group cursor-pointer flex flex-col justify-between min-h-[135px]"
          >
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold bg-[#e8e0d5] text-[#2d5a27] px-2.5 py-0.5 rounded-md border border-[#e2dcd0] font-heading">
                04
              </span>
              <div className="p-2 bg-[#2d5a27] text-white rounded-md shadow-sm">
                <Bot size={18} strokeWidth={2.3} />
              </div>
            </div>

            <div className="mt-3">
              <h4 className="text-[16px] font-bold font-heading text-gray-900 group-hover:text-[#2d5a27] transition-colors">
                Bot Guide
              </h4>
              <p className="text-[12px] font-medium text-gray-500 mt-0.5">
                AI Voice Advisor
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickActionGrid;
