import React from 'react';
const Button = ({ children, onClick, variant = 'primary', className = '', fullWidth = false, disabled = false, icon: Icon }) => {
  const baseStyle = "flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-[12px] text-[16px] font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:scale-100";
  const variants = {
    primary: "bg-[#2E7D32] text-white hover:bg-[#1f5c24] shadow-sm",
    secondary: "bg-[#F57C00] text-white hover:bg-[#d66b00] shadow-sm",
    outline: "border-2 border-[#2E7D32] text-[#2E7D32] bg-transparent hover:bg-[#eaf4eb]",
    ghost: "bg-transparent text-[#6B7280] hover:bg-gray-100",
    danger: "bg-[#EF4444] text-white hover:bg-red-700"
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}>
      {Icon && <Icon size={20} />}
      {children}
    </button>
  );
};
export default Button;
