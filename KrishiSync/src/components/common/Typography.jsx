import React from 'react';
export const H1 = ({ children, className = '' }) => <h1 className={`text-[24px] font-bold text-[#1F2937] leading-tight ${className}`}>{children}</h1>;
export const H2 = ({ children, className = '' }) => <h2 className={`text-[18px] font-semibold text-[#1F2937] leading-snug ${className}`}>{children}</h2>;
export const BodyText = ({ children, className = '' }) => <p className={`text-[16px] font-normal text-[#1F2937] ${className}`}>{children}</p>;
export const SmallText = ({ children, className = '' }) => <span className={`text-[14px] font-medium text-[#6B7280] ${className}`}>{children}</span>;
