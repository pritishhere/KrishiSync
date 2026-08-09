import React from 'react';
import { ShieldCheck, CheckCircle2, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import Button from '../common/Button';

export const ResultCard = ({
  diseaseName = 'Late Blight',
  confidence = 98,
  recommendation = 'Remove affected leaves immediately. Apply copper-based fungicide every 7–10 days during humid weather.',
  imageUrl,
  onReset,
}) => {
  return (
    <div className="w-full bg-white rounded-md border border-[#e2dcd0] shadow-sm p-5 space-y-4 font-body">
      {/* Header Badge */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2 text-[#2d5a27] font-bold text-[13px] font-heading">
          <ShieldCheck size={18} className="text-[#2d5a27]" />
          <span>Diagnostic Result</span>
        </div>
        <span className="bg-[#e8e0d5] text-[#2d5a27] font-bold text-[12px] px-2.5 py-0.5 rounded-md border border-[#e2dcd0] font-heading">
          Match Found
        </span>
      </div>

      {/* Image & Disease Name Block */}
      <div className="flex gap-4 items-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Scanned crop"
            className="w-20 h-20 object-cover rounded-md border border-[#e2dcd0] shrink-0"
          />
        ) : (
          <div className="w-20 h-20 bg-[#f9f8f6] text-[#2d5a27] rounded-md flex items-center justify-center shrink-0 border border-[#e2dcd0]">
            <Sparkles size={32} />
          </div>
        )}

        <div className="flex-1 space-y-1">
          <h3 className="text-[20px] font-extrabold font-heading text-[#1F2937] leading-snug">
            {diseaseName}
          </h3>

          {/* Confidence Badge */}
          <div className="inline-flex items-center gap-1.5 bg-[#e8e0d5] text-[#2d5a27] text-[13px] font-bold px-2.5 py-1 rounded-md border border-[#e2dcd0]">
            <CheckCircle2 size={15} />
            <span>{confidence}% Confidence</span>
          </div>
        </div>
      </div>

      {/* Recommended Cure Section */}
      <div className="bg-[#F9FAFB] rounded-md p-4 border border-gray-200/80 space-y-1.5">
        <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#2d5a27] font-heading flex items-center gap-1.5">
          <AlertCircle size={15} />
          Recommended Cure
        </h4>
        <p className="text-[14px] font-medium text-[#1F2937] leading-relaxed">
          {recommendation}
        </p>
      </div>

      {/* Reset CTA */}
      {onReset && (
        <Button
          variant="primary"
          fullWidth
          onClick={onReset}
          className="mt-2 flex items-center justify-center gap-2"
        >
          <RefreshCw size={18} />
          Scan Another Plant
        </Button>
      )}
    </div>
  );
};

export default ResultCard;
