import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scan, TrendingUp, Tractor, Bot, ArrowUpRight } from 'lucide-react';

export const QuickActionGrid = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full space-y-3 font-body">
      {/* Section Header */}
      <div className="flex items-baseline justify-between px-1">
        <h2 className="text-[19px] font-extrabold font-heading text-[#1F2937] tracking-tight">
          Quick Services
        </h2>
        <span className="text-[12px] font-bold text-[#2E7D32] bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200 font-heading">
          Tap to launch
        </span>
      </div>

      {/* Grid Layout */}
      <div className="space-y-3">
        {/* HERO FEATURE TILE: CROP HEALTH SCANNER */}
        <button
          onClick={() => navigate('/scanner')}
          className="w-full bg-[#FFFFFF] text-[#1F2937] p-5 rounded-2xl border-2 border-[#2E7D32]/30 shadow-xs text-left hover:border-[#2E7D32] transition-all duration-150 group cursor-pointer relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-extrabold text-white bg-[#2E7D32] px-2.5 py-0.5 rounded-full font-heading">
                Featured
              </span>
              <span className="text-[12px] font-semibold text-[#6B7280]">
                AI Diagnostics
              </span>
            </div>
            <div className="p-2.5 bg-[#2E7D32] text-white rounded-xl shadow-xs group-hover:scale-110 transition-transform">
              <Scan size={22} strokeWidth={2.3} />
            </div>
          </div>

          <h3 className="text-[21px] font-bold font-heading text-[#1F2937] tracking-tight mb-1 group-hover:text-[#2E7D32] transition-colors">
            Crop Health Scanner
          </h3>
          
          <p className="text-[13px] font-medium text-[#6B7280] mb-4 leading-relaxed">
            Instant leaf disease detection &amp; treatment recommendations.
          </p>

          <div className="flex items-center justify-between text-[13px] font-bold text-[#2E7D32] pt-3 border-t border-gray-100 font-heading">
            <span>Launch Camera Scanner</span>
            <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
        </button>

        {/* 3-COLUMN / GRID TILES */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* TILE 02: MANDI RATES */}
          <button
            onClick={() => navigate('/mandi')}
            className="bg-[#FFFFFF] text-[#1F2937] p-4 rounded-2xl border border-gray-200 shadow-xs text-left hover:border-[#F57C00] hover:shadow-sm transition-all duration-150 group cursor-pointer flex flex-col justify-between min-h-[135px]"
          >
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold bg-amber-50 text-[#F57C00] px-2.5 py-0.5 rounded-full border border-amber-200 font-heading">
                02
              </span>
              <div className="p-2 bg-[#F57C00] text-white rounded-xl shadow-xs">
                <TrendingUp size={18} strokeWidth={2.3} />
              </div>
            </div>

            <div className="mt-3">
              <h4 className="text-[16px] font-bold font-heading text-[#1F2937] group-hover:text-[#F57C00] transition-colors">
                Mandi Rates
              </h4>
              <p className="text-[12px] font-medium text-[#6B7280] mt-0.5">
                Live market prices
              </p>
            </div>
          </button>

          {/* TILE 03: AGRI-POOL */}
          <button
            onClick={() => navigate('/agri-pool')}
            className="bg-[#FFFFFF] text-[#1F2937] p-4 rounded-2xl border border-gray-200 shadow-xs text-left hover:border-[#F57C00] hover:shadow-sm transition-all duration-150 group cursor-pointer flex flex-col justify-between min-h-[135px]"
          >
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold bg-amber-50 text-[#F57C00] px-2.5 py-0.5 rounded-full border border-amber-200 font-heading">
                03
              </span>
              <div className="p-2 bg-[#F57C00] text-white rounded-xl shadow-xs">
                <Tractor size={18} strokeWidth={2.3} />
              </div>
            </div>

            <div className="mt-3">
              <h4 className="text-[16px] font-bold font-heading text-[#1F2937] group-hover:text-[#F57C00] transition-colors">
                Agri-Pool
              </h4>
              <p className="text-[12px] font-medium text-[#6B7280] mt-0.5">
                Equipment sharing
              </p>
            </div>
          </button>

          {/* TILE 04: BOT GUIDE */}
          <button
            onClick={() => navigate('/bot-guide')}
            className="bg-[#FFFFFF] text-[#1F2937] p-4 rounded-2xl border border-gray-200 shadow-xs text-left hover:border-[#2E7D32] hover:shadow-sm transition-all duration-150 group cursor-pointer flex flex-col justify-between min-h-[135px]"
          >
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full border border-purple-200 font-heading">
                04
              </span>
              <div className="p-2 bg-purple-600 text-white rounded-xl shadow-xs">
                <Bot size={18} strokeWidth={2.3} />
              </div>
            </div>

            <div className="mt-3">
              <h4 className="text-[16px] font-bold font-heading text-[#1F2937] group-hover:text-[#2E7D32] transition-colors">
                Bot Guide
              </h4>
              <p className="text-[12px] font-medium text-[#6B7280] mt-0.5">
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
