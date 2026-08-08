import React, { useState } from 'react';

export default function MandiCalculator({ mandiName = "Kolkata Central Mandi", cropPricePerKg = 30, distanceInKm = 25 }) {
  const [quantity, setQuantity] = useState(100);
  const fuelCostPerKm = 12;

  const grossRevenue = quantity * cropPricePerKg;
  const transportCost = distanceInKm * fuelCostPerKm;
  const netProfit = grossRevenue - transportCost;

  return (
    <div className="w-full h-full flex flex-col justify-between space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 bg-green-50/70 rounded-xl border border-green-100">
        <div>
          <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider block">Target Market</span>
          <span className="text-sm font-extrabold text-gray-900">{mandiName}</span>
        </div>
        <div className="flex gap-2 text-xs font-semibold">
          <span className="bg-white text-gray-700 px-2.5 py-1 rounded-md border border-gray-200 shadow-2xs">📍 {distanceInKm} km</span>
          <span className="bg-[#166534] text-white px-2.5 py-1 rounded-md shadow-2xs">₹{cropPricePerKg}/kg</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
          Enter Harvest Quantity (kg)
        </label>
        <input 
          type="number" 
          value={quantity} 
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full px-3.5 py-2 border border-gray-300 rounded-xl font-bold text-sm bg-white text-gray-900 focus:ring-2 focus:ring-[#166534] focus:outline-none shadow-2xs"
        />
      </div>

      <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200/80 space-y-2">
        <div className="flex justify-between text-xs text-gray-600">
          <span>Est. Gross Revenue:</span>
          <span className="font-bold text-gray-900">₹{grossRevenue.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          <span>Est. Transport Cost (₹12/km):</span>
          <span className="font-bold text-red-600">- ₹{transportCost.toLocaleString()}</span>
        </div>
        <div className="border-t border-green-200/80 pt-2 flex justify-between items-center">
          <span className="text-xs font-extrabold text-[#166534] uppercase tracking-wider">Estimated Net Profit:</span>
          <span className="text-lg font-black text-[#166534]">
            ₹{netProfit.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
