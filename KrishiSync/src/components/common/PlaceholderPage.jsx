import React from 'react';

const PlaceholderPage = ({ title, description, icon: Icon, colorClass }) => (
  <div className="p-4 h-full flex flex-col">
    <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
    <p className="text-gray-500 mb-6">{description}</p>
    
    <div className={`flex-1 flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-gray-200 p-8 text-center`}>
      <div className={`p-6 rounded-full mb-4 ${colorClass}`}>
        <Icon size={48} />
      </div>
      <h3 className="text-lg font-bold text-gray-700 mb-2">Under Construction</h3>
      <p className="text-sm text-gray-500">
        This module is currently being built by the team.
      </p>
    </div>
  </div>
);

export default PlaceholderPage;
