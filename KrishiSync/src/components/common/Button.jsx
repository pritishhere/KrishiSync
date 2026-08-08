import React from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '', fullWidth = false, disabled = false, icon: Icon, type = 'button' }) => {
  const baseStyle = "flex items-center justify-center gap-2 min-h-[46px] px-5 py-2.5 rounded-xl text-[14px] font-bold font-heading transition-all duration-150 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32] focus-visible:ring-offset-2";
  
  const variants = {
    primary: "bg-[#2E7D32] text-white hover:bg-[#256628] shadow-sm",
    secondary: "bg-[#F57C00] text-white hover:bg-[#d66b00] shadow-sm",
    outline: "border-2 border-[#2E7D32] text-[#2E7D32] bg-white hover:bg-green-50 shadow-xs",
    ghost: "bg-transparent text-[#6B7280] hover:bg-gray-100 shadow-none",
    danger: "bg-[#EF4444] text-white hover:bg-red-600 shadow-sm"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {Icon && <Icon size={18} strokeWidth={2.2} className="shrink-0" />}
      {children}
    </button>
  );
};

export default Button;
