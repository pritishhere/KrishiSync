import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import Button from '../common/Button';

export const DashboardError = ({ onRetry }) => {
  return (
    <div className="w-full bg-[#FEF2F2] border border-[#EF4444]/30 rounded-2xl p-6 text-center shadow-xs flex flex-col items-center justify-center my-4 font-body">
      <div className="w-14 h-14 bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/20 rounded-2xl flex items-center justify-center mb-4 shadow-xs">
        <WifiOff size={28} strokeWidth={2.2} />
      </div>

      <h3 className="text-[18px] font-extrabold font-heading text-[#EF4444] tracking-tight mb-1">
        Unable to Load Weather
      </h3>

      <p className="text-[14px] font-medium text-gray-700 max-w-[280px] mb-5 leading-relaxed">
        Unable to load local weather. Please check your internet connection.
      </p>

      {onRetry && (
        <Button
          variant="danger"
          onClick={onRetry}
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} strokeWidth={2.2} />
          Retry Connection
        </Button>
      )}
    </div>
  );
};

export default DashboardError;
