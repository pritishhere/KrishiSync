import React from 'react';

export const H1 = ({ children, className = '' }) => (
  <h1 className={`text-[24px] sm:text-[26px] font-extrabold font-heading text-[#1F2937] leading-tight tracking-tight ${className}`}>
    {children}
  </h1>
);

export const H2 = ({ children, className = '' }) => (
  <h2 className={`text-[18px] sm:text-[20px] font-bold font-heading text-[#1F2937] leading-snug tracking-tight ${className}`}>
    {children}
  </h2>
);

export const BodyText = ({ children, className = '' }) => (
  <p className={`text-[15px] font-medium font-body text-[#1F2937] leading-relaxed ${className}`}>
    {children}
  </p>
);

export const SmallText = ({ children, className = '' }) => (
  <span className={`text-[13px] font-semibold font-body text-[#6B7280] tracking-normal ${className}`}>
    {children}
  </span>
);
