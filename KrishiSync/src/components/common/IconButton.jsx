import React from 'react';

const IconButton = ({ onClick, icon: Icon, variant = 'ghost', className = '', disabled = false, title = '' }) => {
  const baseStyle = "flex items-center justify-center min-h-[40px] min-w-[40px] p-2 rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-[#166534] text-white",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900"
  };
  if (!Icon) return null;
  return (
    <button 
      type="button" 
      onClick={onClick} 
      disabled={disabled} 
      title={title} 
      className={`${baseStyle} ${variants[variant] || variants.ghost} ${className}`}
    >
      <Icon size={20} />
    </button>
  );
};

export default IconButton;

