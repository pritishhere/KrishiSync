import { useState, useEffect } from 'react';

export default function SmartIrrigation() {
  const [cropType, setCropType] = useState('wheat');
  const [soilType, setSoilType] = useState('loam');
  const [loading, setLoading] = useState(false);
  const [advisory, setAdvisory] = useState(null);

  const fetchAdvisory = () => {
    setLoading(true);
    fetch(`http://localhost:5000/api/irrigation/advisory?cropType=${cropType}&soilType=${soilType}`)
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

  const recColor = advisory?.advisory?.recommendation === 'YES' 
    ? '#15803d' 
    : advisory?.advisory?.recommendation === 'MODERATE' 
    ? '#b45309' 
    : '#b91c1c';

  return (
    <div style={{
      padding: '16px',
      backgroundColor: '#f0fdf4',
      borderRadius: '8px',
      border: '1px solid #bbf7d0',
      color: '#14532d'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, color: '#166534' }}>
          🌧️ Smart Irrigation Advisory Engine
        </h3>
        <button
          onClick={fetchAdvisory}
          style={{
            padding: '6px 12px',
            backgroundColor: '#166534',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600'
          }}
        >
          {loading ? 'Calculating...' : '🔄 Refresh Weather'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <label style={{ fontSize: '13px', fontWeight: '600' }}>
          Crop Type:
          <select
            value={cropType}
            onChange={(e) => setCropType(e.target.value)}
            style={{ marginLeft: '8px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          >
            <option value="wheat">🌾 Wheat (Gehun)</option>
            <option value="rice">🍚 Rice / Paddy (Chawal)</option>
            <option value="cotton">🧵 Cotton (Kapas)</option>
            <option value="tomato">🍅 Tomato (Tamatar)</option>
            <option value="mustard">🌼 Mustard (Sarson)</option>
          </select>
        </label>

        <label style={{ fontSize: '13px', fontWeight: '600' }}>
          Soil Type:
          <select
            value={soilType}
            onChange={(e) => setSoilType(e.target.value)}
            style={{ marginLeft: '8px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          >
            <option value="loam">🌱 Loam Soil (Optimal)</option>
            <option value="clay">🧱 Clay Soil (High retention)</option>
            <option value="sandy">🏖️ Sandy Soil (Fast drainage)</option>
            <option value="black">⛰️ Black Soil (Regur)</option>
          </select>
        </label>
      </div>

      {advisory && (
        <div style={{
          backgroundColor: '#ffffff',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #dcfce7',
          boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <span style={{
              padding: '6px 14px',
              borderRadius: '20px',
              backgroundColor: recColor,
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: '13px'
            }}>
              Irrigate Today: {advisory.advisory.recommendation}
            </span>
            <span style={{ fontSize: '13px', color: '#475569', fontWeight: '500' }}>
              Urgency: <strong>{advisory.advisory.urgency}</strong>
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '13px' }}>
            <div>
              <p style={{ margin: '4px 0', color: '#64748b' }}>Water Needed:</p>
              <p style={{ margin: 0, fontWeight: 'bold', fontSize: '15px', color: '#0f172a' }}>
                💧 {advisory.advisory.waterVolumeLitersPerAcre.toLocaleString()} Liters / Acre
              </p>
            </div>

            <div>
              <p style={{ margin: '4px 0', color: '#64748b' }}>Best Timing Window:</p>
              <p style={{ margin: 0, fontWeight: 'bold', fontSize: '13px', color: '#0f172a' }}>
                ⏰ {advisory.advisory.bestTime}
              </p>
            </div>

            <div>
              <p style={{ margin: '4px 0', color: '#64748b' }}>Live Weather ({advisory.weather.location}):</p>
              <p style={{ margin: 0, fontWeight: '500', color: '#334155' }}>
                🌡️ {advisory.weather.temp}°C | 💧 {advisory.weather.humidity}% Humidity | ☁️ {advisory.weather.description}
              </p>
            </div>
          </div>

          <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px dashed #e2e8f0', fontSize: '12px', color: '#334155' }}>
            <strong>💡 Agronomist AI Explanation:</strong> {advisory.advisory.reasons.join(' ')}
          </div>
        </div>
      )}
    </div>
  );
}
