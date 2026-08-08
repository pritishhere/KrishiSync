import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../services/apiConfig';

export default function SmartIrrigation() {
  const [cropType, setCropType] = useState('wheat');
  const [soilType, setSoilType] = useState('loam');
  const [loading, setLoading] = useState(false);
  const [advisory, setAdvisory] = useState(null);

  const fetchAdvisory = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/irrigation/advisory?cropType=${cropType}&soilType=${soilType}`)
      .then((res) => res.json())
      .then((data) => {
        setAdvisory(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Irrigation fetch error:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAdvisory();
  }, [cropType, soilType]);

  return (
    <div className="w-full h-full flex flex-col justify-between space-y-3">
      <p className="text-xs text-gray-600">
        Evapotranspiration rules & weather data to schedule precise crop watering:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">Crop Type</label>
          <select
            value={cropType}
            onChange={(e) => setCropType(e.target.value)}
            className="w-full px-2.5 py-1.5 border border-gray-300 rounded-xl text-xs font-bold bg-white text-gray-900 focus:ring-2 focus:ring-[#166534] focus:outline-none"
          >
            <option value="wheat">🌾 Wheat (Gehun)</option>
            <option value="rice">🍚 Rice (Chawal)</option>
            <option value="cotton">🧵 Cotton (Kapas)</option>
            <option value="tomato">🍅 Tomato (Tamatar)</option>
            <option value="mustard">🌼 Mustard (Sarson)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">Soil Type</label>
          <select
            value={soilType}
            onChange={(e) => setSoilType(e.target.value)}
            className="w-full px-2.5 py-1.5 border border-gray-300 rounded-xl text-xs font-bold bg-white text-gray-900 focus:ring-2 focus:ring-[#166534] focus:outline-none"
          >
            <option value="loam">🌱 Loam Soil</option>
            <option value="clay">🧱 Clay Soil</option>
            <option value="sandy">🏖️ Sandy Soil</option>
            <option value="black">⛰️ Black Soil</option>
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={fetchAdvisory}
        className="w-full bg-[#166534] hover:bg-green-800 text-white font-bold py-2.5 px-4 rounded-xl transition shadow-sm text-xs flex items-center justify-center gap-2"
      >
        {loading ? '🌧️ Calculating Weather Data...' : '🔄 Refresh Weather & Water Advisory'}
      </button>

      {advisory && (
        <div className="bg-teal-50/80 p-3.5 rounded-xl border border-teal-200/90 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-extrabold text-teal-900">
              💧 Water Needed: {advisory.advisory?.waterVolumeLitersPerAcre?.toLocaleString()} L / Acre
            </span>
            <span className="px-2 py-0.5 rounded-full bg-teal-200 text-teal-900 text-[10px] font-bold">
              Irrigate: {advisory.advisory?.recommendation}
            </span>
          </div>

          <div className="text-[11px] text-gray-600 pt-1 border-t border-teal-200/60 flex justify-between">
            <span>⏰ Best Time: <strong>{advisory.advisory?.bestTime}</strong></span>
            <span>🌡️ {advisory.weather?.temp}°C | {advisory.weather?.description}</span>
          </div>
        </div>
      )}
    </div>
  );
}

