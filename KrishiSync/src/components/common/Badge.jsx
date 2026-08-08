import React from 'react';
const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: "bg-gray-100 text-[#6B7280]",
    success: "bg-[#10B981]/10 text-[#10B981]",
    warning: "bg-[#F57C00]/10 text-[#F57C00]",
    danger: "bg-[#EF4444]/10 text-[#EF4444]",
    primary: "bg-[#2E7D32]/10 text-[#2E7D32]"
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[14px] font-semibold ${variants[variant]}`}>
      {children}
    </span>
  );
};
export default Badge;
