import React from 'react';

export default function MandiCartDoodle({ className = "w-16 h-16" }) {
  return (
    <div className={`relative inline-block ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-sm select-none"
      >
        {/* Grain Bags */}
        <path d="M 25 55 C 20 40, 45 35, 42 55 Z" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
        <path d="M 40 55 C 35 38, 60 32, 58 55 Z" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" />
        <path d="M 55 55 C 50 42, 75 36, 72 55 Z" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />

        {/* Cart Bed */}
        <rect x="18" y="55" width="64" height="8" rx="2" fill="#78350F" stroke="#451A03" strokeWidth="2" />

        {/* Cart Wheels (Animated Spin) */}
        <g transform="translate(32, 67)" className="animate-spin-slow origin-center">
          <circle cx="0" cy="0" r="14" fill="#F59E0B" stroke="#78350F" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="4" fill="#78350F" />
          <line x1="-14" y1="0" x2="14" y2="0" stroke="#78350F" strokeWidth="2" />
          <line x1="0" y1="-14" x2="0" y2="14" stroke="#78350F" strokeWidth="2" />
        </g>

        <g transform="translate(68, 67)" className="animate-spin-slow origin-center">
          <circle cx="0" cy="0" r="14" fill="#F59E0B" stroke="#78350F" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="4" fill="#78350F" />
          <line x1="-14" y1="0" x2="14" y2="0" stroke="#78350F" strokeWidth="2" />
          <line x1="0" y1="-14" x2="0" y2="14" stroke="#78350F" strokeWidth="2" />
        </g>

        {/* Floating Gold Coin */}
        <g transform="translate(50, 20)" className="animate-bounce">
          <circle cx="0" cy="0" r="8" fill="#FACC15" stroke="#EAB308" strokeWidth="2" />
          <text x="0" y="3.5" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#854D0E">₹</text>
        </g>
      </svg>
    </div>
  );
}
