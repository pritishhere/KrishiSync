import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import Button from '../common/Button';

export const DashboardError = ({ onRetry }) => {
  return (
    <div className="w-full bg-[#fef2f2] border border-[#fca5a5] rounded-md p-6 text-center shadow-sm flex flex-col items-center justify-center my-4 font-body">
      <div className="w-14 h-14 bg-[#fee2e2] text-[#991b1b] border border-[#fca5a5] rounded-md flex items-center justify-center mb-4 shadow-sm">
        <WifiOff size={28} strokeWidth={2.2} />
      </div>

      <h3 className="text-[18px] font-extrabold font-heading text-[#991b1b] tracking-tight mb-1">
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
