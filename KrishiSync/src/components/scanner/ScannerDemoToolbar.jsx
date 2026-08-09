import React, { useState } from 'react';
import { Sparkles, SlidersHorizontal } from 'lucide-react';

export const ScannerDemoToolbar = ({ currentState, onStateSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const states = [
    { id: 'EMPTY', label: 'Empty' },
    { id: 'IMAGE_SELECTED', label: 'Selected' },
    { id: 'ANALYZING', label: 'Analyzing' },
    { id: 'SUCCESS', label: 'Success' },
    { id: 'ERROR', label: 'Error' },
    { id: 'NOT_A_PLANT', label: 'Not a Plant' },
  ];

  return (
    <div className="bg-[#f9f8f6] text-gray-900 rounded-md p-3 shadow-sm border border-[#e2dcd0] font-body">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[12px] font-bold text-gray-900 font-heading">
          <Sparkles size={15} className="text-[#2d5a27]" />
          <span>Hackathon Demo Switcher</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-[11px] font-bold bg-[#e8e0d5] text-[#2d5a27] px-3 py-1 rounded-md uppercase transition-transform active:scale-95 cursor-pointer flex items-center gap-1 font-heading shadow-sm"
        >
          <SlidersHorizontal size={12} />
          {isOpen ? 'Hide Controls' : 'Show Controls'}
        </button>
      </div>

      {isOpen && (
        <div className="mt-2.5 pt-2.5 border-t border-[#e2dcd0] space-y-2 text-[12px]">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">SCANNER STATE:</span>
            <span className="bg-white text-[#2d5a27] border border-[#e2dcd0] text-[11px] font-extrabold px-2 py-0.5 rounded-md font-heading">
              {currentState}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 font-heading">
            {states.map((st) => (
              <button
                key={st.id}
                onClick={() => onStateSelect(st.id)}
                className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all border border-[#e2dcd0] cursor-pointer ${
                  currentState === st.id
                    ? 'bg-[#2d5a27] text-white font-extrabold shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScannerDemoToolbar;
