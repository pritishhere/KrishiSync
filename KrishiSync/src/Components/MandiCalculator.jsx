import React, { useState } from 'react';

export default function MandiCalculator({ mandiName = "Mandi A", cropPricePerKg = 25, distanceInKm = 15 }) {
  const [quantity, setQuantity] = useState(100);
  const fuelCostPerKm = 12;

  const grossRevenue = quantity * cropPricePerKg;
  const transportCost = distanceInKm * fuelCostPerKm;
  const netProfit = grossRevenue - transportCost;

  return (
    <div style={{
      padding: '16px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      backgroundColor: '#ffffff',
      maxWidth: '320px',
      color: '#1f2937'
    }}>
      <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0' }}>{mandiName}</h3>
      <p style={{ margin: '4px 0', fontSize: '14px' }}>Distance: {distanceInKm} km</p>
      <p style={{ margin: '4px 0', fontSize: '14px' }}>Price: ₹{cropPricePerKg} / kg</p>
      
      <div style={{ margin: '12px 0' }}>
        <label style={{ fontSize: '14px', fontWeight: '600' }}>Crop Quantity (kg): </label>
        <input 
          type="number" 
          value={quantity} 
          onChange={(e) => setQuantity(Number(e.target.value))}
          style={{
            padding: '4px 8px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            width: '80px',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            color: '#000000',
            marginLeft: '8px'
          }}
        />
      </div>

      <div style={{ padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
        <p style={{ fontSize: '12px', color: '#4b5563', margin: '0 0 4px 0' }}>Estimated Transport Cost: ₹{transportCost}</p>
        <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#15803d', margin: 0 }}>Real Net Profit: ₹{netProfit}</p>
      </div>
    </div>
  );
}