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
      <div className="w-full bg-[#FEF2F2] border border-[#EF4444]/30 rounded-2xl p-4 font-body relative shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-[#EF4444]/15 text-[#EF4444] rounded-xl shrink-0 mt-0.5 border border-[#EF4444]/20">
            <AlertTriangle size={22} strokeWidth={2.3} />
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[12px] font-bold text-[#EF4444] tracking-wide flex items-center gap-1 font-heading">
                <ShieldAlert size={14} />
                Irrigation Recommendation
              </span>
              <span className="text-[11px] font-extrabold text-[#EF4444] bg-[#EF4444]/15 px-2.5 py-0.5 rounded-full border border-[#EF4444]/30 font-heading uppercase">
                Pump OFF
              </span>
            </div>

            <h3 className="text-[17px] font-bold font-heading text-[#1F2937] leading-snug">
              {alertData.title}
            </h3>

            <p className="text-[14px] font-semibold text-[#EF4444]">
              {alertData.instruction}
            </p>

            <div className="mt-2.5 pt-2 border-t border-red-200/80 flex items-center justify-between text-[13px] font-semibold">
              <span className="text-[#6B7280]">Estimated electricity savings:</span>
              <span className="bg-[#2E7D32] text-white px-3 py-0.5 rounded-lg font-extrabold font-heading shadow-xs flex items-center gap-0.5">
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
    <div className="w-full bg-[#ECFDF5] border border-[#10B981]/30 rounded-2xl p-4 font-body relative shadow-xs">
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-[#10B981]/15 text-[#10B981] rounded-xl shrink-0 mt-0.5 border border-[#10B981]/20">
          <CheckCircle2 size={22} strokeWidth={2.3} />
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[12px] font-bold text-[#10B981] tracking-wide flex items-center gap-1 font-heading">
              <Droplets size={14} />
              Irrigation Recommendation
            </span>
            <span className="text-[11px] font-extrabold text-[#10B981] bg-[#10B981]/15 px-2.5 py-0.5 rounded-full border border-[#10B981]/30 font-heading uppercase">
              Pump Normal
            </span>
          </div>

          <h3 className="text-[17px] font-bold font-heading text-[#1F2937] leading-snug">
            {alertData.title}
          </h3>

          <p className="text-[14px] font-semibold text-[#10B981]">
            {alertData.instruction}
          </p>

          {alertData.recommendation && (
            <p className="text-[12px] text-[#6B7280] font-medium mt-1">
              💡 {alertData.recommendation}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IrrigationAlert;
