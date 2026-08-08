import React from 'react';
const Card = ({ children, className = '', padding = 'p-4 sm:p-6' }) => (
  <div className={`bg-[#FFFFFF] rounded-[16px] shadow-sm border border-gray-100 overflow-hidden ${className}`}>
    <div className={padding}>{children}</div>
  </div>
);
export default Card;
