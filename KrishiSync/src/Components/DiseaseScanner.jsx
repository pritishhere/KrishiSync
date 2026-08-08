import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../services/apiConfig';
import { diseaseService } from '../services/diseaseService';

export default function DiseaseScanner() {
  const [selectedCrop, setSelectedCrop] = useState('tomato');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    // (Optional) preload sample cases — kept lightweight for quick UX
    fetch(`${API_BASE_URL}/api/disease/sample-cases`)
      .then((res) => res.json())
      .then((_data) => {})
      .catch(() => {});
  }, []);

  const [file, setFile] = useState(null);

  const handleScan = async (crop = selectedCrop) => {
    setLoading(true);
    try {
      if (file) {
        const form = new FormData();
        form.append('image', file);
        form.append('cropHint', crop);
        const data = await diseaseService.scanImage(form);
        setResult(data);
      } else {
        // Fallback: quick scan by crop hint
        const res = await fetch(`${API_BASE_URL}/api/disease/scan`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cropHint: crop }),
        });
        const data = await res.json();
        setResult(data);
      }
    } catch (err) {
      console.error('Disease scan error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between space-y-3">
      <p className="text-xs text-gray-600">
        AI computer vision analysis for crop leaf diagnostics and organic treatment recipes:
      </p>

      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
          Select Crop Sample:
        </label>
        <select
          value={selectedCrop}
          onChange={(e) => {
            setSelectedCrop(e.target.value);
            handleScan(e.target.value);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-bold bg-white text-gray-900 focus:ring-2 focus:ring-[#166534] focus:outline-none shadow-2xs"
        >
          <option value="tomato">🍅 Tomato Leaf (Early Blight)</option>
          <option value="wheat">🌾 Wheat Leaf (Yellow Stripe Rust)</option>
          <option value="rice">🍚 Rice Leaf (Paddy Blast)</option>
          <option value="mustard">🌼 Mustard Leaf (Powdery Mildew)</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Upload Leaf Image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files && e.target.files[0])}
          className="block w-full text-xs text-gray-700 file:bg-emerald-50 file:border-0 file:py-2 file:px-3 file:rounded-lg file:text-sm file:font-bold file:text-emerald-800"
        />
      </div>

      <button
        type="button"
        onClick={() => handleScan(selectedCrop)}
        className="w-full bg-[#166534] hover:bg-green-800 text-white font-bold py-2.5 px-4 rounded-xl transition shadow-sm text-xs flex items-center justify-center gap-2"
      >
        {loading ? '🔬 Analyzing Leaf Diagnostics...' : '🔍 Run Plant.id AI Diagnostics'}
      </button>

      {result && (
        <div className="bg-amber-50/80 p-3.5 rounded-xl border border-amber-200/90 space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-extrabold text-amber-900">
              🦠 Disease: {result.diseaseName}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 text-[10px] font-bold">
              {Math.round((result.confidence || 0.9) * 100)}% Match
            </span>
          </div>

          <div className="text-xs space-y-1.5 pt-1 border-t border-amber-200/60">
            <div>
              <span className="font-bold text-green-800 block">🌿 Organic Remedy:</span>
              <span className="text-gray-700">{result.treatment?.organic}</span>
            </div>
            <div>
              <span className="font-bold text-red-800 block">🧪 Chemical Treatment:</span>
              <span className="text-gray-700">{result.treatment?.chemical}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

