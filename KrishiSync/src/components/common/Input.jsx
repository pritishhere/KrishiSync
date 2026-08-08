import React from 'react';
import { SmallText } from './Typography';
const Input = ({ label, type = "text", placeholder, value, onChange, error }) => (
  <div className="flex flex-col gap-1.5 w-full mb-4">
    {label && <label className="text-[16px] font-medium text-[#1F2937]">{label}</label>}
    <input 
      type={type} placeholder={placeholder} value={value} onChange={onChange}
      className={`min-h-[48px] px-4 py-3 bg-[#F3F4F6] rounded-[12px] border ${error ? 'border-[#EF4444]' : 'border-transparent'} focus:border-[#2E7D32] focus:bg-[#FFFFFF] focus:ring-2 focus:ring-[#2E7D32]/20 outline-none transition-all w-full text-[16px] text-[#1F2937] placeholder-[#6B7280]`}
    />
    {error && <SmallText className="text-[#EF4444]">{error}</SmallText>}
  </div>
);
export default Input;
