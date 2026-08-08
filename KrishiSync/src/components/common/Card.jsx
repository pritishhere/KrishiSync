import React from 'react';

const Card = ({ children, className = '', padding = 'p-4 sm:p-5' }) => (
  <div className={`bg-[#FFFFFF] rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden ${className}`}>
    <div className={padding}>{children}</div>
  </div>
);

export default Card;
