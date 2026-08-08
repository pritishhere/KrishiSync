import { useState, useEffect } from 'react';

export default function DiseaseScanner() {
  const [selectedCrop, setSelectedCrop] = useState('tomato');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [samples, setSamples] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/disease/sample-cases')
      .then((res) => res.json())
      .then((data) => {
        if (data.samples) setSamples(data.samples);
      })
      .catch(() => {});
  }, []);

  const handleScan = (crop = selectedCrop) => {
    setLoading(true);
    fetch('http://localhost:5000/api/disease/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cropHint: crop })
    })
      .then((res) => res.json())
      .then((data) => {
        setResult(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Disease scan error:', err);
        setLoading(false);
      });
  };

  return (
    <div style={{
      padding: '16px',
      backgroundColor: '#fefce8',
      borderRadius: '8px',
      border: '1px solid #fef08a',
      color: '#713f12'
    }}>
      <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 12px 0', color: '#854d0e' }}>
        🔬 Plant.id AI Crop Leaf Disease Scanner
      </h3>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
        <label style={{ fontSize: '13px', fontWeight: '600' }}>
          Select Crop Sample:
          <select
            value={selectedCrop}
            onChange={(e) => {
              setSelectedCrop(e.target.value);
              handleScan(e.target.value);
            }}
            style={{ marginLeft: '8px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          >
            <option value="tomato">🍅 Tomato Leaf (Early Blight)</option>
            <option value="wheat">🌾 Wheat Leaf (Yellow Stripe Rust)</option>
            <option value="rice">🍚 Rice Leaf (Paddy Blast)</option>
            <option value="mustard">🌼 Mustard Leaf (Powdery Mildew)</option>
          </select>
        </label>

        <button
          onClick={() => handleScan(selectedCrop)}
          style={{
            padding: '6px 14px',
            backgroundColor: '#854d0e',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600'
          }}
        >
          {loading ? 'Analyzing Leaf...' : '🔍 Run Plant.id AI Diagnostics'}
        </button>
      </div>

      {result && (
        <div style={{
          backgroundColor: '#ffffff',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #fef08a',
          boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4 style={{ margin: 0, fontSize: '15px', color: '#991b1b', fontWeight: 'bold' }}>
              🦠 Identified Disease: {result.diseaseName}
            </h4>
            <span style={{
              padding: '4px 10px',
              borderRadius: '12px',
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              Confidence: {Math.round((result.confidence || 0.9) * 100)}%
            </span>
          </div>

          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 10px 0' }}>
            AI Source: <strong>{result.source}</strong>
          </p>

          <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              <strong style={{ color: '#15803d' }}>🌿 Recommended Organic Remedy:</strong>
              <p style={{ margin: '2px 0', color: '#334155' }}>{result.treatment.organic}</p>
            </div>

            <div>
              <strong style={{ color: '#b91c1c' }}>🧪 Chemical Treatment:</strong>
              <p style={{ margin: '2px 0', color: '#334155' }}>{result.treatment.chemical}</p>
            </div>

            <div>
              <strong style={{ color: '#0369a1' }}>🛡️ Preventive Action:</strong>
              <p style={{ margin: '2px 0', color: '#334155' }}>{result.prevention}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
