import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  WeatherCard,
  IrrigationAlert,
  QuickActionGrid,
  DashboardSkeleton,
  DashboardError,
} from '../../components/dashboard';
import { Sparkles, SlidersHorizontal, RefreshCw } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  
  // Interactive demo states for hackathon presentation
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [rainExpected, setRainExpected] = useState(true);
  const [showDemoToolbar, setShowDemoToolbar] = useState(false);

  // Dynamic farmer name resolution from backend user data
  const farmerName = user?.name || user?.phone || 'Farmer';

  const handleRetry = () => {
    setIsLoading(true);
    setIsError(false);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="p-4 space-y-5 pb-8 min-h-full font-body bg-[#F9FAFB]">
      {/* Hackathon Interactive Demo Controls */}
      <div className="bg-[#2E7D32] text-white rounded-2xl p-3 shadow-sm border border-green-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[12px] font-bold text-white font-heading">
            <Sparkles size={15} className="text-[#F57C00]" />
            <span>Hackathon Demo Switcher</span>
          </div>
          <button
            onClick={() => setShowDemoToolbar(!showDemoToolbar)}
            className="text-[11px] font-bold bg-[#F57C00] text-white px-3 py-1 rounded-full uppercase transition-transform active:scale-95 cursor-pointer flex items-center gap-1 font-heading shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Toggle Demo Controls Toolbar"
          >
            <SlidersHorizontal size={12} />
            {showDemoToolbar ? 'Hide Controls' : 'Show Controls'}
          </button>
        </div>

        {showDemoToolbar && (
          <div className="mt-2.5 pt-2.5 border-t border-green-600/80 space-y-2 text-[12px]">
            {/* View State Controls */}
            <div className="flex items-center justify-between">
              <span className="text-green-100 font-medium">View State:</span>
              <div className="flex items-center gap-1 font-heading">
                <button
                  onClick={() => { setIsLoading(false); setIsError(false); }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    !isLoading && !isError ? 'bg-white text-[#2E7D32]' : 'bg-green-800 text-green-200'
                  }`}
                >
                  Loaded
                </button>
                <button
                  onClick={() => { setIsLoading(true); setIsError(false); }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    isLoading ? 'bg-[#F57C00] text-white' : 'bg-green-800 text-green-200'
                  }`}
                >
                  Loading
                </button>
                <button
                  onClick={() => { setIsError(true); setIsLoading(false); }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    isError ? 'bg-[#EF4444] text-white' : 'bg-green-800 text-green-200'
                  }`}
                >
                  Error
                </button>
              </div>
            </div>

            {/* Irrigation State Controls */}
            <div className="flex items-center justify-between">
              <span className="text-green-100 font-medium">Irrigation Alert:</span>
              <div className="flex items-center gap-1 font-heading">
                <button
                  onClick={() => setRainExpected(true)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    rainExpected ? 'bg-[#EF4444] text-white' : 'bg-green-800 text-green-200'
                  }`}
                >
                  Rain Expected
                </button>
                <button
                  onClick={() => setRainExpected(false)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    !rainExpected ? 'bg-[#10B981] text-white' : 'bg-green-800 text-green-200'
                  }`}
                >
                  Clear Skies
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Render Skeletons during Loading State */}
      {isLoading ? (
        <DashboardSkeleton />
      ) : isError ? (
        <DashboardError onRetry={handleRetry} />
      ) : (
        <>
          {/* GREETING HERO HEADER */}
          <div className="pt-1">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-[26px] sm:text-[28px] font-extrabold font-heading text-[#1F2937] leading-tight tracking-tight">
                  Namaste, <span className="text-[#2E7D32]">{farmerName}</span>
                </h1>
              </div>

              <button
                onClick={handleRetry}
                className="p-2.5 bg-white hover:bg-gray-100 text-[#6B7280] rounded-xl border border-gray-200 shadow-xs transition-transform active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32]"
                title="Refresh Weather Data"
                aria-label="Refresh Dashboard Data"
              >
                <RefreshCw size={18} strokeWidth={2.2} />
              </button>
            </div>
          </div>

          {/* WEATHER CARD */}
          <WeatherCard />

          {/* IRRIGATION ALERT */}
          <IrrigationAlert rainExpected={rainExpected} />

          {/* QUICK ACTION GRID */}
          <QuickActionGrid />
        </>
      )}
    </div>
  );
};

export default DashboardPage;
