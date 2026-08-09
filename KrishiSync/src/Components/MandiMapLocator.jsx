import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Loader2, List, Store, RefreshCw, AlertTriangle } from 'lucide-react';

// ─── Fix default Leaflet marker icons broken by Vite bundling ───────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ─── Custom coloured marker icons ────────────────────────────────────────────
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const mandiIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

// ─── Haversine distance formula ───────────────────────────────────────────────
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Overpass API — fetch real vegetable wholesale markets near coords ────────
// Uses multiple OSM tags that represent vegetable/wholesale/agri markets.
// Tries with 15 km first, then expands to 40 km if too few results.
async function fetchNearbyMarkets(lat, lng, radiusM = 15000) {
  const query = `
    [out:json][timeout:30];
    (
      node["amenity"="marketplace"](around:${radiusM},${lat},${lng});
      way["amenity"="marketplace"](around:${radiusM},${lat},${lng});
      node["shop"="wholesale"](around:${radiusM},${lat},${lng});
      way["shop"="wholesale"](around:${radiusM},${lat},${lng});
      node["shop"="greengrocer"](around:${radiusM},${lat},${lng});
      node["shop"="farm"](around:${radiusM},${lat},${lng});
      node["shop"="vegetables"](around:${radiusM},${lat},${lng});
      node["landuse"="farmyard"]["name"](around:${radiusM},${lat},${lng});
      node["market"="yes"](around:${radiusM},${lat},${lng});
      node["market_type"~"vegetable|wholesale|agricultural",i](around:${radiusM},${lat},${lng});
    );
    out center tags;
  `;

  const endpoints = [
    'https://overpass-api.de/api/interpreter',
    'https://lz4.overpass-api.de/api/interpreter',
    'https://z.overpass-api.de/api/interpreter'
  ];

  let lastError;

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'data=' + encodeURIComponent(query),
      });

      if (!res.ok) throw new Error(`Overpass API error at ${endpoint}: ${res.status}`);
      const json = await res.json();
      return json.elements || [];
    } catch (e) {
      lastError = e;
      console.warn(`Failed to fetch from ${endpoint}, trying next...`, e);
    }
  }

  throw lastError;
}

// ─── Parse raw OSM elements into clean market objects ────────────────────────
function parseMarkets(elements, userLat, userLng) {
  const seen = new Set();
  const results = [];

  for (const el of elements) {
    // Get lat/lng — nodes have direct coords, ways have a 'center'
    const lat = el.lat ?? el.center?.lat;
    const lng = el.lon ?? el.center?.lon;
    if (!lat || !lng) continue;

    const tags = el.tags || {};
    const name = tags.name || tags['name:en'] || tags['name:hi'] || null;
    if (!name) continue; // skip unnamed blobs

    // Deduplicate by name+coords
    const key = `${name.toLowerCase().trim()}|${lat.toFixed(4)}|${lng.toFixed(4)}`;
    if (seen.has(key)) continue;
    seen.add(key);

    // Derive a human-readable type label
    const shopType = tags.shop || '';
    const amenity = tags.amenity || '';
    const marketType = tags.market_type || tags.market || '';
    let typeLabel = 'Market';
    if (shopType === 'wholesale') typeLabel = 'Wholesale Market';
    else if (shopType === 'greengrocer') typeLabel = 'Vegetable Retailer';
    else if (shopType === 'vegetables') typeLabel = 'Vegetable Shop';
    else if (shopType === 'farm') typeLabel = 'Farm Store';
    else if (amenity === 'marketplace') typeLabel = marketType ? `${marketType} Market` : 'Agricultural Market';
    else if (marketType) typeLabel = `${marketType} Market`;

    const address = [tags['addr:street'], tags['addr:city'], tags['addr:state']]
      .filter(Boolean).join(', ') || tags['addr:full'] || '';

    results.push({
      id: `${el.type}-${el.id}`,
      name,
      lat,
      lng,
      type: typeLabel,
      address,
      phone: tags.phone || tags['contact:phone'] || '',
      website: tags.website || tags['contact:website'] || '',
      openingHours: tags.opening_hours || '',
      distanceKm: haversineKm(userLat, userLng, lat, lng),
    });
  }

  return results.sort((a, b) => a.distanceKm - b.distanceKm);
}

// ─── Auto-fit bounds helper (inside MapContainer) ────────────────────────────
function BoundsFitter({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 1) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [40, 40] });
    } else if (positions.length === 1) {
      map.setView(positions[0], 13);
    }
  }, [positions, map]);
  return null;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MandiMapLocator() {
  const [userCoords, setUserCoords] = useState(null);
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingMarkets, setFetchingMarkets] = useState(false);
  const [error, setError] = useState('');
  const [radiusKm, setRadiusKm] = useState(15);
  const [totalFound, setTotalFound] = useState(0);

  // ── Fetch from Overpass with auto-expand if too few results ──────────────
  const loadMarkets = async (coords, radiusM, preserveError = false) => {
    setFetchingMarkets(true);
    if (!preserveError) setError('');
    try {
      let elements = await fetchNearbyMarkets(coords.lat, coords.lng, radiusM);
      let parsed = parseMarkets(elements, coords.lat, coords.lng);

      // If fewer than 3 named markets found, auto-expand to 40 km
      if (parsed.length < 3 && radiusM < 40000) {
        elements = await fetchNearbyMarkets(coords.lat, coords.lng, 40000);
        parsed = parseMarkets(elements, coords.lat, coords.lng);
        setRadiusKm(40);
      }

      setMarkets(parsed);
      setTotalFound(parsed.length);

      if (parsed.length === 0) {
        setError(prev => prev ? prev + ' | No markets found.' : 'No vegetable markets found within 40 km. Try a different location.');
      }
    } catch (e) {
      setError(prev => prev ? prev + ' | Data fetch failed.' : 'Could not fetch live market data. Check your internet connection.');
    } finally {
      setFetchingMarkets(false);
    }
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      const fallback = { lat: 22.5726, lng: 88.3639 };
      setUserCoords(fallback);
      setLoading(false);
      setError('Geolocation not supported (HTTP). Showing markets near Kolkata centre.');
      loadMarkets(fallback, 15000, true);
      return;
    }
    setLoading(true);
    setError('');
    setMarkets([]);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        setLoading(false);
        await loadMarkets(coords, 15000);
      },
      (err) => {
        // Fallback to Kolkata centre
        const fallback = { lat: 22.5726, lng: 88.3639 };
        setUserCoords(fallback);
        setLoading(false);
        const reason = err.code === 3 ? 'timed out' : 'permission denied';
        setError(`Location ${reason} — showing markets near Kolkata centre.`);
        loadMarkets(fallback, 15000, true);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleExpandRadius = () => {
    if (!userCoords) return;
    const next = radiusKm >= 40 ? 80 : 40;
    setRadiusKm(next);
    loadMarkets(userCoords, next * 1000);
  };

  const allPositions = userCoords
    ? [[userCoords.lat, userCoords.lng], ...markets.map((m) => [m.lat, m.lng])]
    : [];

  const isBusy = loading || fetchingMarkets;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* ── Header controls ── */}
      <div className="flex flex-col gap-2">
        <p className="text-xs text-gray-600 leading-relaxed">
          Finds <strong>real vegetable wholesale markets</strong> near your GPS location using live
          OpenStreetMap data — no API key required.
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            id="locate-mandis-btn"
            onClick={handleLocate}
            disabled={isBusy}
            className="flex-1 flex items-center justify-center gap-2.5 bg-green-800 hover:bg-green-900 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 shadow-md text-sm"
          >
            {isBusy ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                {loading ? 'Getting GPS…' : `Searching ${radiusKm} km radius…`}
              </>
            ) : (
              <>
                <MapPin size={15} />
                Locate Nearest Mandis (GPS)
              </>
            )}
          </button>

          {userCoords && !isBusy && (
            <button
              type="button"
              onClick={handleExpandRadius}
              title="Expand search radius"
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#2d5a27] text-[#2d5a27] text-xs font-bold rounded-md hover:bg-[#e8e0d5] transition-all shadow-sm"
            >
              <RefreshCw size={13} />
              Expand to {radiusKm >= 40 ? '80' : '40'} km
            </button>
          )}
        </div>

        {/* Status bar */}
        {userCoords && !isBusy && totalFound > 0 && (
          <p className="text-[11px] text-green-800 font-semibold bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
            <Store size={11} />
            Found <strong>{totalFound}</strong> vegetable/wholesale markets within <strong>{radiusKm} km</strong>
          </p>
        )}

        {error && (
          <p className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-start gap-1.5">
            <AlertTriangle size={12} className="mt-0.5 flex-shrink-0" />
            {error}
          </p>
        )}
      </div>

      {/* ── Split view: Map LEFT | List RIGHT ── */}
      {userCoords && (
        <div className="flex flex-col lg:flex-row gap-4 items-stretch">

          {/* LEFT — Map */}
          <div
            className="lg:flex-[3] rounded-md overflow-hidden border-2 border-[#e2dcd0] shadow-sm relative"
            style={{ minHeight: '420px' }}
          >
            {/* Fetching overlay */}
            {fetchingMarkets && (
              <div className="absolute inset-0 z-[999] bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                <Loader2 size={28} className="animate-spin text-green-800" />
                <p className="text-xs font-bold text-green-800">Fetching live market data…</p>
              </div>
            )}

            <MapContainer
              center={[userCoords.lat, userCoords.lng]}
              zoom={12}
              style={{ height: '100%', minHeight: '420px', width: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <BoundsFitter positions={allPositions} />

              {/* User marker */}
              <Marker position={[userCoords.lat, userCoords.lng]} icon={userIcon}>
                <Popup>
                  <div style={{ textAlign: 'center', padding: '4px' }}>
                    <strong style={{ color: '#2d5a27', display: 'block' }}>Your Location</strong>
                    <span style={{ fontSize: '11px', color: '#6b7280' }}>
                      {userCoords.lat.toFixed(5)}° N, {userCoords.lng.toFixed(5)}° E
                    </span>
                  </div>
                </Popup>
              </Marker>

              {/* Market markers */}
              {markets.map((m) => (
                <Marker key={m.id} position={[m.lat, m.lng]} icon={mandiIcon}>
                  <Popup minWidth={210}>
                    <div style={{ padding: '4px', lineHeight: '1.6' }}>
                      <strong style={{ color: '#5c4033', fontSize: '13px', display: 'block' }}>
                        {m.name}
                      </strong>
                      <span style={{ fontSize: '11px', color: '#6b7280', display: 'block' }}>
                        {m.type}
                      </span>
                      {m.address && (
                        <span style={{ fontSize: '10px', color: '#9ca3af', display: 'block' }}>
                          {m.address}
                        </span>
                      )}
                      {m.openingHours && (
                        <span style={{ fontSize: '10px', color: '#9ca3af', display: 'block' }}>
                          {m.openingHours}
                        </span>
                      )}
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#2d5a27', display: 'block', marginTop: '4px' }}>
                        {m.distanceKm.toFixed(1)} km away
                      </span>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'block', marginTop: '8px', textAlign: 'center',
                          background: '#2d5a27', color: 'white', fontSize: '11px',
                          fontWeight: 700, padding: '5px 10px', borderRadius: '6px',
                          textDecoration: 'none',
                        }}
                      >
                        Get Directions
                      </a>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* RIGHT — Sorted market list */}
          <div className="lg:flex-[2] flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: '420px' }}>
            <h4 className="text-xs font-extrabold text-[#166534] uppercase tracking-wider flex items-center gap-1.5">
              <List size={13} />
              {markets.length > 0
                ? `${markets.length} Markets — sorted by distance`
                : 'Nearby Vegetable Markets'}
            </h4>

            {fetchingMarkets &&
              [1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-100 rounded-md animate-pulse h-16 flex-shrink-0" />
              ))}

            {!fetchingMarkets && markets.map((m, idx) => (
              <div
                key={m.id}
                className="flex items-start gap-3 p-3 bg-white rounded-md border border-[#e2dcd0] shadow-sm hover:border-[#2d5a27] transition-all duration-200 flex-shrink-0"
              >
                <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-[#2d5a27] text-white text-[10px] font-black rounded-full">
                  {idx + 1}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold text-gray-900 m-0 leading-tight">{m.name}</p>
                  <p className="text-[11px] text-gray-500 m-0 mt-0.5">{m.type}</p>
                  {m.address && (
                    <p className="text-[10px] text-gray-400 m-0 truncate">{m.address}</p>
                  )}
                  {m.openingHours && (
                    <p className="text-[10px] text-emerald-700 m-0">🕐 {m.openingHours}</p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-xs font-black text-[#2d5a27] bg-[#f9f8f6] border border-[#e2dcd0] px-2 py-0.5 rounded-md whitespace-nowrap">
                    {m.distanceKm.toFixed(1)} km
                  </span>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-0.5"
                  >
                    <Navigation size={9} />
                    Directions
                  </a>
                </div>
              </div>
            ))}

            {!fetchingMarkets && markets.length > 0 && radiusKm < 80 && (
              <button
                onClick={handleExpandRadius}
                className="text-[11px] font-bold text-[#2d5a27] border border-dashed border-[#e2dcd0] rounded-md py-2 hover:bg-[#e8e0d5] transition-colors flex-shrink-0 flex items-center justify-center gap-1.5"
              >
                <RefreshCw size={11} />
                Show more — expand to {radiusKm >= 40 ? '80' : '40'} km
              </button>
            )}
          </div>
        </div>
      )}

      {/* Pre-locate idle state */}
      {!userCoords && !loading && (
        <div className="p-4 bg-[#f9f8f6] rounded-md border border-[#e2dcd0] text-center space-y-1">
          <p className="text-xs font-semibold text-[#2d5a27] m-0 flex items-center justify-center gap-1.5">
            <Store size={13} />
            GPS Signal: Ready to detect
          </p>
          <p className="text-[10px] text-gray-500 m-0">
            Live data from OpenStreetMap · No API key needed
          </p>
        </div>
      )}
    </div>
  );
}
