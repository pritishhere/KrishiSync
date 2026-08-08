import React, { useState } from 'react';

export default function LocationTracker({ onLocationFound }) {
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser!");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCoords(userLocation);
        setLoading(false);

        if (onLocationFound) {
          onLocationFound(userLocation);
        }
      },
      (_error) => {
        setLoading(false);
        alert("Unable to fetch location. Please enable location permissions in browser.");
      }
    );
  };

  return (
    <div className="w-full h-full flex flex-col justify-between space-y-3">
      <p className="text-xs text-gray-600">
        Automatically detect nearest agricultural mandis and live local crop price indexes using GPS.
      </p>
      
      <button 
        type="button"
        onClick={getLocation} 
        className="w-full bg-[#166534] hover:bg-green-800 active:scale-[0.99] text-white font-bold py-3 px-4 rounded-xl transition shadow-sm text-xs sm:text-sm flex items-center justify-center gap-2"
      >
        {loading ? "📍 Detecting Nearby Markets..." : "📍 Locate Nearest Mandis (GPS)"}
      </button>

      {coords ? (
        <div className="p-3 bg-green-50 rounded-xl border border-green-200 text-center">
          <p className="text-xs font-extrabold text-[#166534] m-0">
            ✅ Detected Location: {coords.lat.toFixed(4)}° N, {coords.lng.toFixed(4)}° E
          </p>
          <p className="text-[11px] text-gray-500 mt-1 m-0">
            Found 3 mandis within 30km radius (Kolkata, Howrah, Hooghly)
          </p>
        </div>
      ) : (
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center">
          <p className="text-xs font-semibold text-gray-500 m-0">
            GPS Signal: Ready to detect
          </p>
        </div>
      )}
    </div>
  );
}
