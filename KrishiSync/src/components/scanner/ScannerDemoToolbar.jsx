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
    <div className="bg-[#2E7D32] text-white rounded-2xl p-3 shadow-xs border border-green-700 font-body">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[12px] font-bold text-white font-heading">
          <Sparkles size={15} className="text-[#F57C00]" />
          <span>Hackathon Demo Switcher</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-[11px] font-bold bg-[#F57C00] text-white px-3 py-1 rounded-full uppercase transition-transform active:scale-95 cursor-pointer flex items-center gap-1 font-heading shadow-xs"
        >
          <SlidersHorizontal size={12} />
          {isOpen ? 'Hide Controls' : 'Show Controls'}
        </button>
      </div>

      {isOpen && (
        <div className="mt-2.5 pt-2.5 border-t border-green-600/80 space-y-2 text-[12px]">
          <div className="flex items-center justify-between">
            <span className="text-green-100 font-medium">SCANNER STATE:</span>
            <span className="bg-white text-[#2E7D32] text-[11px] font-extrabold px-2 py-0.5 rounded-md font-heading">
              {currentState}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 font-heading">
            {states.map((st) => (
              <button
                key={st.id}
                onClick={() => onStateSelect(st.id)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all border border-green-700 cursor-pointer ${
                  currentState === st.id
                    ? 'bg-[#F57C00] text-white font-extrabold shadow-xs'
                    : 'bg-green-800 text-green-100 hover:bg-green-700'
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
