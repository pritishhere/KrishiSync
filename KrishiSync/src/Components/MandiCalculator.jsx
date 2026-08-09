import React, { useState, useEffect, useCallback } from 'react';
import { mandiService } from '../services/mandiService';
import { MapPin, Loader2, AlertCircle } from 'lucide-react';

const CROPS = [
  { id: 'tomato', name: 'Tomato (टमाटर)', icon: '' },
  { id: 'wheat', name: 'Wheat (गेहूँ)', icon: '' },
  { id: 'rice', name: 'Rice (चावल)', icon: '' },
  { id: 'mustard', name: 'Mustard (सरसों)', icon: '' }
];

export default function MandiCalculator({ defaultMandi = "Kolkata Central Mandi", defaultPrice = 30, defaultDistance = 25 }) {
  const [quantity, setQuantity] = useState(100);
  const [cropType, setCropType] = useState('wheat');
  const [coords, setCoords] = useState(null);
  
  // Results from backend API
  const [estimateResults, setEstimateResults] = useState({
    mandiName: defaultMandi,
    distanceKm: defaultDistance,
    pricePerKg: defaultPrice,
    totalTransportCost: defaultDistance * 12 * Math.max(1, 100 / 100),
    grossRevenue: 100 * defaultPrice,
    netProfit: (100 * defaultPrice) - (defaultDistance * 12 * Math.max(1, 100 / 100))
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationStatus, setLocationStatus] = useState('pending'); // pending, detecting, detected, error

  // Debounce API calls when user types quantity or changes crop
  useEffect(() => {
    if (!coords) return;
    
    const timeoutId = setTimeout(() => {
      fetchEstimate(coords.lat, coords.lng, quantity, cropType);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [quantity, coords, cropType]);

  const fetchEstimate = async (lat, lng, harvestKg, selectedCrop) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await mandiService.fetchProfitEstimate({
        userLat: lat,
        userLng: lng,
        cropType: selectedCrop,
        harvestKg: harvestKg || 1 // Avoid 0
      });
      setEstimateResults(data);
    } catch (err) {
      console.warn("Failed to fetch estimate, using static fallback", err);
      setError('Live data unavailable. Showing estimates.');
      
      // Fallback calculation using known coordinates if possible
      const fallbackGross = harvestKg * defaultPrice;
      const fallbackTrans = defaultDistance * 12 * Math.max(1, harvestKg / 100);
      setEstimateResults({
        mandiName: defaultMandi,
        distanceKm: defaultDistance,
        pricePerKg: defaultPrice,
        totalTransportCost: Math.round(fallbackTrans),
        grossRevenue: fallbackGross,
        netProfit: fallbackGross - fallbackTrans
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetectLocation = () => {
    setLocationStatus('detecting');
    setError('');
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCoords({ lat, lng });
          setLocationStatus('detected');
          fetchEstimate(lat, lng, quantity, cropType);
        },
        (err) => {
          console.warn("Geolocation error:", err.message);
          setLocationStatus('error');
          setError('Location access denied. Using average distances.');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      const fallbackLat = 22.5726;
      const fallbackLng = 88.3639;
      setCoords({ lat: fallbackLat, lng: fallbackLng });
      setLocationStatus('detected');
      fetchEstimate(fallbackLat, fallbackLng, quantity, cropType);
      setError('Geolocation not supported. Using default location.');
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between space-y-4">
      {/* Location Bar */}
      {locationStatus !== 'detected' && (
        <button 
          onClick={handleDetectLocation}
          disabled={locationStatus === 'detecting'}
          className="w-full text-xs flex justify-center items-center gap-1.5 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold border border-blue-200 transition-colors"
        >
          {locationStatus === 'detecting' ? (
            <><Loader2 size={14} className="animate-spin" /> Detecting Location...</>
          ) : (
            <><MapPin size={14} /> Detect Location for Accurate Costs</>
          )}
        </button>
      )}

      {error && (
        <div className="text-[10px] text-red-600 bg-red-50 border border-red-100 p-1.5 rounded flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 bg-white rounded-md border border-[#e2dcd0]">
        <div>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Target Market</span>
          <span className="text-sm font-extrabold text-gray-900">{estimateResults.mandiName}</span>
        </div>
        <div className="flex gap-2 text-xs font-semibold">
          <span className="bg-[#f9f8f6] text-gray-700 px-2.5 py-1 rounded-md border border-[#e2dcd0] shadow-sm flex items-center gap-1">
            {isLoading ? <Loader2 size={12} className="animate-spin inline" /> : <><MapPin size={12} /> {estimateResults.distanceKm} km</>}
          </span>
          <span className="bg-[#2d5a27] text-white px-2.5 py-1 rounded-md shadow-sm">
            {isLoading ? <Loader2 size={12} className="animate-spin inline text-white" /> : `₹${estimateResults.pricePerKg}/kg`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
            Select Crop
          </label>
          <select
            value={cropType}
            onChange={(e) => setCropType(e.target.value)}
            className="w-full px-3.5 py-2 border border-[#e2dcd0] rounded-md font-bold text-sm bg-white text-gray-900 focus:ring-2 focus:ring-[#2d5a27] focus:outline-none shadow-sm"
          >
            {CROPS.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
            Harvest QTY (kg)
          </label>
          <input 
            type="number" 
            value={quantity} 
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full px-3.5 py-2 border border-[#e2dcd0] rounded-md font-bold text-sm bg-white text-gray-900 focus:ring-2 focus:ring-[#2d5a27] focus:outline-none shadow-sm"
          />
        </div>
      </div>

      <div className="p-4 bg-[#f9f8f6] rounded-md border border-[#e2dcd0] space-y-2 relative">
        {isLoading && (
           <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-md z-10 backdrop-blur-[1px]">
             <Loader2 size={24} className="text-[#2d5a27] animate-spin" />
           </div>
        )}
        <div className="flex justify-between text-xs text-gray-600">
          <span>Est. Gross Revenue:</span>
          <span className="font-bold text-gray-900">₹{Math.round(estimateResults.grossRevenue).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          <span>Est. Transport Cost:</span>
          <span className="font-bold text-red-600">- ₹{Math.round(estimateResults.totalTransportCost).toLocaleString()}</span>
        </div>
        <div className="border-t border-[#e2dcd0] pt-2 flex justify-between items-center">
          <span className="text-xs font-extrabold text-[#2d5a27] uppercase tracking-wider">Estimated Net Profit:</span>
          <span className="text-lg font-black text-[#2d5a27]">
            ₹{Math.round(estimateResults.netProfit).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}