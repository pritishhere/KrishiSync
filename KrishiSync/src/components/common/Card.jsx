import React from 'react';

const Card = ({ children, className = '', title, action }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
    {(title || action) && (
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-50">
        {title && <h3 className="font-bold text-gray-800">{title}</h3>}
        {action && <div>{action}</div>}
      </div>
    )}
    <div className="p-4">
      {children}
    </div>
  </div>
);

export default Card;
