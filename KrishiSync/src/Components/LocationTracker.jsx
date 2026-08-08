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
      (error) => {
        setLoading(false);
        alert("Unable to fetch location. Please enable location permissions in Chrome.");
      }
    );
  };

  return (
    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg max-w-sm my-2">
      <button 
        onClick={getLocation} 
        className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition"
      >
        {loading ? "📍 Locating..." : "📍 Get Nearby Mandis (GPS)"}
      </button>

      {coords && (
        <p className="text-xs text-blue-800 mt-2 text-center">
          Location Found: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
        </p>
      )}
    </div>
  );
}