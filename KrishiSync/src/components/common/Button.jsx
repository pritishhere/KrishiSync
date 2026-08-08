import React from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '', fullWidth = false, icon: Icon }) => {
  const baseStyle = "flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all active:scale-95 duration-200 ease-in-out";
  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-700 shadow-md",
    secondary: "bg-green-100 text-green-800 hover:bg-green-200",
    outline: "border-2 border-green-600 text-green-600 hover:bg-green-50",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100"
  };
  
  return (
    <button 
      onClick={onClick} 
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {Icon && <Icon size={20} />}
      {children}
    </button>
  );
};

export default Button;
