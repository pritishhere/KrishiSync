import React from 'react';
const IconButton = ({ onClick, icon: Icon, variant = 'ghost', className = '', disabled = false }) => {
  const baseStyle = "flex items-center justify-center min-h-[48px] min-w-[48px] p-3 rounded-[12px] transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-[#2E7D32] text-white",
    ghost: "bg-transparent text-[#6B7280] hover:bg-gray-100 hover:text-[#1F2937]"
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      <Icon size={24} />
    </button>
  );
};
export default IconButton;
