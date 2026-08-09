import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const LocationContext = createContext(null);

const DEFAULT_COORDS = { lat: 28.6139, lng: 77.2090 };
const DEFAULT_NAME = 'Delhi NCR Farming Hub';

export const LocationProvider = ({ children }) => {
  const [locationState, setLocationState] = useState({
    coords: DEFAULT_COORDS,
    locationName: DEFAULT_NAME,
    isLocating: false,
    hasPermission: false,
    locationError: null,
  });

  // Reverse geocoding helper via OpenStreetMap Nominatim API (Free, no key required)
  const fetchLocationName = useCallback(async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { 'User-Agent': 'KrishiSync-App' } }
      );
      if (response.ok) {
        const data = await response.json();
        const address = data.address || {};
        const city = address.city || address.town || address.village || address.suburb || address.county || address.state_district;
        const state = address.state || '';
        return city ? `${city}${state ? `, ${state}` : ''}` : DEFAULT_NAME;
      }
    } catch (_err) {
      console.warn('[LocationContext] Reverse geocoding notice:', _err.message);
    }
    return DEFAULT_NAME;
  }, []);

  // Request browser geolocation permission & coordinates
  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setLocationState((prev) => ({
        ...prev,
        locationError: 'Geolocation is not supported by your browser.',
        locationName: DEFAULT_NAME,
        coords: DEFAULT_COORDS,
      }));
      return;
    }

    setLocationState((prev) => ({ ...prev, isLocating: true, locationError: null }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = parseFloat(position.coords.latitude.toFixed(4));
        const lng = parseFloat(position.coords.longitude.toFixed(4));
        
        const locName = await fetchLocationName(lat, lng);

        setLocationState({
          coords: { lat, lng },
          locationName: locName,
          isLocating: false,
          hasPermission: true,
          locationError: null,
        });
      },
      (error) => {
        let msg = 'Unable to retrieve location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission denied. Using default farming sector.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location position unavailable. Using default farming sector.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out. Using default farming sector.';
        }

        setLocationState({
          coords: DEFAULT_COORDS,
          locationName: DEFAULT_NAME,
          isLocating: false,
          hasPermission: false,
          locationError: msg,
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [fetchLocationName]);

  // Request location automatically on initial mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return (
    <LocationContext.Provider
      value={{
        coords: locationState.coords,
        locationName: locationState.locationName,
        isLocating: locationState.isLocating,
        hasPermission: locationState.hasPermission,
        locationError: locationState.locationError,
        requestLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export default LocationContext;
