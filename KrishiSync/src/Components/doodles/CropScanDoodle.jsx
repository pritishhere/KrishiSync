import React from 'react';

export default function CropScanDoodle({ className = "w-16 h-16" }) {
  return (
    <div className={`relative inline-block ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-sm select-none"
      >
        {/* Leaf Doodle */}
        <path
          d="M 50 15 C 25 35, 20 70, 50 85 C 80 70, 75 35, 50 15 Z"
          fill="#4ADE80"
          stroke="#15803D"
          strokeWidth="2.5"
        />
        {/* Leaf Veins */}
        <path d="M 50 25 L 50 78 M 50 40 L 35 30 M 50 55 L 30 48 M 50 40 L 65 30 M 50 55 L 70 48" stroke="#166534" strokeWidth="2" strokeLinecap="round" />

        {/* Animated Laser Scanning Line */}
        <line
          x1="15"
          y1="25"
          x2="85"
          y2="25"
          stroke="#EF4444"
          strokeWidth="3"
          strokeLinecap="round"
          className="animate-scan-line"
        />

        {/* Pulse Aura Ring */}
        <circle cx="50" cy="50" r="38" stroke="#22C55E" strokeWidth="2" strokeDasharray="6 4" className="animate-spin-slow origin-center" opacity="0.6" />
      </svg>
    </div>
  );
}
