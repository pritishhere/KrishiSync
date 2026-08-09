import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, Droplets, IndianRupee } from 'lucide-react';

export const IrrigationAlert = ({ rainExpected = true, data }) => {
  const defaultRainData = {
    title: '80% Chance of rain tomorrow',
    instruction: 'Do not run the pump today.',
    savings: '₹500',
    details: 'Save power & prevent soil saturation.',
  };

  const defaultNoRainData = {
    title: 'Clear skies forecasted today',
    instruction: 'Proceed with normal watering schedule.',
    recommendation: 'Target 25-30 liters/sq meter in late afternoon',
  };

  const alertData = data || (rainExpected ? defaultRainData : defaultNoRainData);

    if (rainExpected) {
      return (
        <div className="w-full bg-[#fef2f2] border border-[#fca5a5] rounded-md p-4 font-body relative shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-[#fee2e2] text-[#991b1b] rounded-md shrink-0 mt-0.5 border border-[#fca5a5]">
              <AlertTriangle size={22} strokeWidth={2.3} />
            </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between gap-2">
                <span className="text-[12px] font-bold text-[#991b1b] tracking-wide flex items-center gap-1 font-heading">
                  <ShieldAlert size={14} />
                  Irrigation Recommendation
                </span>
                <span className="text-[11px] font-extrabold text-[#991b1b] bg-[#fee2e2] px-2.5 py-0.5 rounded-md border border-[#fca5a5] font-heading uppercase">
                  Pump OFF
                </span>
              </div>

            <h3 className="text-[17px] font-bold font-heading text-gray-900 leading-snug">
                {alertData.title}
              </h3>
  
              <p className="text-[14px] font-semibold text-[#991b1b]">
                {alertData.instruction}
              </p>

            <div className="mt-2.5 pt-2 border-t border-[#fca5a5] flex items-center justify-between text-[13px] font-semibold">
                <span className="text-gray-600">Estimated electricity savings:</span>
                <span className="bg-[#2d5a27] text-white px-3 py-0.5 rounded-md font-extrabold font-heading shadow-sm flex items-center gap-0.5">
                  <IndianRupee size={13} />
                  {alertData.savings || '₹500'}
                </span>
              </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f9f8f6] border border-[#e2dcd0] rounded-md p-4 font-body relative shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-[#e8e0d5] text-[#2d5a27] rounded-md shrink-0 mt-0.5 border border-[#e2dcd0]">
            <CheckCircle2 size={22} strokeWidth={2.3} />
          </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between gap-2">
              <span className="text-[12px] font-bold text-[#2d5a27] tracking-wide flex items-center gap-1 font-heading">
                <Droplets size={14} />
                Irrigation Recommendation
              </span>
              <span className="text-[11px] font-extrabold text-[#2d5a27] bg-[#e8e0d5] px-2.5 py-0.5 rounded-md border border-[#e2dcd0] font-heading uppercase">
                Pump Normal
              </span>
            </div>

          <h3 className="text-[17px] font-bold font-heading text-gray-900 leading-snug">
              {alertData.title}
            </h3>
  
            <p className="text-[14px] font-semibold text-[#2d5a27]">
              {alertData.instruction}
            </p>

          {alertData.recommendation && (
              <p className="text-[12px] text-gray-600 font-medium mt-1">
                {alertData.recommendation}
              </p>
            )}
        </div>
      </div>
    </div>
  );
};

export default IrrigationAlert;
