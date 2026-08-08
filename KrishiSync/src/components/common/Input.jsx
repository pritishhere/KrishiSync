import React from 'react';

const Input = ({ label, type = "text", placeholder, value, onChange }) => (
  <div className="flex flex-col gap-1 w-full mb-4">
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <input 
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all w-full text-lg"
    />
  </div>
);

export default Input;
