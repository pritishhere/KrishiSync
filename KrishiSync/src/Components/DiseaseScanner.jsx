import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, ImageIcon, X, Loader2, AlertTriangle, CheckCircle2, Leaf, FlaskConical, ShieldCheck, Zap, Info, Bug, Search, ExternalLink } from 'lucide-react';
import { API_BASE_URL } from '../services/apiConfig';
import { diseaseService } from '../services/diseaseService';

export default function DiseaseScanner() {
  const [selectedCrop, setSelectedCrop] = useState('tomato');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [scanError, setScanError] = useState('');

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Preload sample cases silently
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/disease/sample-cases`).catch(() => {});
  }, []);

  // ── Dropzone config ────────────────────────────────────────────────────────
  const onDrop = useCallback((acceptedFiles) => {
    const img = acceptedFiles[0];
    if (!img) return;
    setFile(img);
    setPreview(URL.createObjectURL(img));
    setResult(null);
    setScanError('');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [], 'image/gif': [] },
    maxFiles: 1,
    multiple: false,
  });

  const handleRemoveFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setResult(null);
    setScanError('');
  };

  // ── Main scan handler ──────────────────────────────────────────────────────
  // If an image is uploaded → send it as multipart (real Plant.id scan)
  // Otherwise → crop-hint fallback (simulation)
  const handleScan = async (crop = selectedCrop) => {
    if (!file) {
      setScanError('Please upload a leaf image to run diagnostics.');
      return;
    }

    setIsScanning(true);
    setResult(null);
    setScanError('');

    try {
      const form = new FormData();
      form.append('image', file);
      form.append('cropHint', crop);
      const data = await diseaseService.scanImage(form);
      setResult(data);
    } catch (err) {
      console.error('Disease scan error:', err);
      setScanError(
        err.message?.includes('fetch')
          ? 'Cannot reach the backend server. Make sure it is running on port 5000.'
          : err.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setIsScanning(false);
    }
  };

  // Confidence as a 0–100 integer
  const confidencePct = result
    ? result.confidence <= 1
      ? Math.round(result.confidence * 100)
      : Math.round(result.confidence)
    : 0;

  const isRealAPI = result?.source?.includes('Plant.id');

  return (
    <div className="w-full h-full flex flex-col space-y-3">
      <p className="text-xs text-gray-600">
        AI computer vision analysis for crop leaf diagnostics and organic treatment recipes:
      </p>

      {/* ── Crop selector (used as fallback hint only when no image) ── */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
          Select Crop Sample
        </label>
        <select
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md text-xs font-bold bg-[#f9f8f6] text-gray-900 focus:ring-2 focus:ring-[#2d5a27] focus:outline-none shadow-sm transition-opacity border-[#e2dcd0]`}
        >
          <option value="tomato">Tomato Leaf</option>
          <option value="wheat">Wheat Leaf</option>
          <option value="rice">Rice Leaf</option>
          <option value="mustard">Mustard Leaf</option>
        </select>
      </div>

      {/* ── Drag-and-drop image upload ── */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
          Upload Leaf Image {file && <span className="text-green-700 normal-case font-semibold">(ready to scan)</span>}
        </label>

        {preview ? (
          // Selected / preview state
          <div className="rounded-md border border-[#2d5a27] bg-[#f9f8f6] overflow-hidden">
            <img src={preview} alt="Selected leaf" className="w-full h-36 object-cover" />
            <div className="flex items-center justify-between px-3 py-1.5 bg-white/90 border-t border-green-200">
              <span className="text-[11px] font-semibold text-gray-700 truncate max-w-[80%]">
                <ImageIcon size={11} className="inline mr-1 text-green-700" />
                {file?.name}
              </span>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="flex items-center gap-1 text-[11px] font-bold text-red-500 hover:text-red-700 transition-colors"
                aria-label="Remove selected image"
              >
                <X size={13} />
                Remove
              </button>
            </div>
          </div>
        ) : (
          // Default / drag-active state
          <div
            {...getRootProps()}
            className={`flex flex-col items-center justify-center gap-2 p-5 rounded-md border-2 border-dashed cursor-pointer transition-all duration-200 select-none ${
              isDragActive
                ? 'border-[#2d5a27] bg-[#e8e0d5] scale-[1.01]'
                : 'border-[#e2dcd0] bg-[#f9f8f6] hover:border-[#2d5a27] hover:bg-[#e8e0d5]/30'
            }`}
          >
            <input {...getInputProps()} id="leaf-image-dropzone" />
            <UploadCloud
              size={28}
              className={isDragActive ? 'text-[#2d5a27] animate-bounce' : 'text-gray-400'}
            />
            <p className="text-[11px] font-semibold text-center text-gray-600 leading-snug">
              {isDragActive
                ? 'Drop the leaf image here…'
                : 'Drag & drop a leaf image here, or click to select'}
            </p>
            <span className="text-[10px] text-gray-400 font-medium">JPG, PNG, WEBP · single file</span>
          </div>
        )}
      </div>

      {/* ── Error banner ── */}
      {scanError && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-[11px] font-semibold text-red-700">
          <AlertTriangle size={14} className="mt-0.5 flex-shrink-0 text-red-500" />
          <span>{scanError}</span>
        </div>
      )}

      {/* ── Scan button ── */}
      <button
        type="button"
        disabled={isScanning}
        onClick={() => handleScan(selectedCrop)}
        className="w-full bg-[#2d5a27] hover:bg-[#1a3816] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-2.5 px-4 rounded-md transition shadow-sm text-xs flex items-center justify-center gap-2"
      >
        {isScanning ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Analyzing Leaf Diagnostics…
          </>
        ) : (
          <>
            <Search size={14} /> Run Plant.id AI Diagnostics
          </>
        )}
      </button>

      {/* ── Dynamic result card ── */}
      {result && !scanError && (
        <div className={`rounded-md border overflow-hidden ${
          result.isHealthy
            ? 'bg-[#f9f8f6] border-[#e2dcd0]'
            : 'bg-amber-50/80 border-amber-200'
        }`}>
          {/* ── Low-confidence / retake warning ── */}
          {result.lowConfidenceFromAPI && (
            <div className="flex items-start gap-2 bg-orange-50 border-b border-orange-200 px-3 py-2 text-[11px] font-semibold text-orange-700">
              <AlertTriangle size={13} className="mt-0.5 flex-shrink-0" />
              <span>
                Image quality too low for a confident diagnosis
                {result.apiTopProbability
                  ? ` (API top match: ${Math.round(result.apiTopProbability * 100)}%)`
                  : ''}
                . Please retake with better lighting &amp; a close-up leaf focus.
                Showing crop-matched simulation instead.
              </span>
            </div>
          )}

          {/* ── Header ── */}
          <div className="flex items-start justify-between px-3.5 pt-3 pb-2 border-b border-amber-200/60">
            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-center gap-1.5 mb-0.5">
                {isRealAPI ? (
                  <Zap size={11} className="text-green-700 flex-shrink-0" />
                ) : (
                  <CheckCircle2 size={11} className="text-amber-600 flex-shrink-0" />
                )}
                <span className={`text-[9px] font-black uppercase tracking-widest ${
                  isRealAPI ? 'text-green-700' : 'text-amber-600'
                }`}>
                  {isRealAPI ? 'Plant.id Live API' : 'Simulation Mode'}
                </span>
              </div>
              <span className={`text-xs font-extrabold leading-tight flex items-center gap-1 ${
                result.isHealthy ? 'text-[#2d5a27]' : 'text-amber-900'
              }`}>
                {result.isHealthy ? <CheckCircle2 size={14} /> : <Bug size={14} />} {result.diseaseName}
              </span>
              {result.cause && (
                <span className="text-[10px] text-gray-500 italic">Cause: {result.cause}</span>
              )}
            </div>

            {/* Colour-coded confidence badge */}
            <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
              confidencePct >= 70
                ? 'bg-green-100 text-green-800 border border-green-300'
                : confidencePct >= 40
                  ? 'bg-amber-200/80 text-amber-900'
                  : 'bg-red-100 text-red-700 border border-red-300'
            }`}>
              {confidencePct}% Match
            </span>
          </div>

          <div className="px-3.5 pb-3 pt-2 space-y-2 text-xs">
            {/* Symptoms */}
            {result.symptoms?.length > 0 && (
              <div>
                <span className="font-bold text-amber-800 flex items-center gap-1 mb-1">
                  <AlertTriangle size={11} /> Symptoms:
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-gray-700">
                  {result.symptoms.map((s, i) => (
                    <li key={i} className="leading-snug">{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Organic remedy */}
            {result.treatment?.organic && (
              <div>
                <span className="font-bold text-green-800 flex items-center gap-1 mb-0.5">
                  <Leaf size={11} /> Organic Remedy:
                </span>
                <span className="text-gray-700">{result.treatment.organic}</span>
              </div>
            )}

            {/* Chemical treatment — hidden for healthy plants */}
            {result.treatment?.chemical && !result.isHealthy && (
              <div>
                <span className="font-bold text-red-800 flex items-center gap-1 mb-0.5">
                  <FlaskConical size={11} /> Chemical Treatment:
                </span>
                <span className="text-gray-700">{result.treatment.chemical}</span>
              </div>
            )}

            {/* Prevention */}
            {result.prevention && (
              <div className="pt-1 border-t border-amber-200/60">
                <span className="font-bold text-blue-800 flex items-center gap-1 mb-0.5">
                  <ShieldCheck size={11} /> Prevention:
                </span>
                <span className="text-gray-700">{result.prevention}</span>
              </div>
            )}

            {/* Reference link */}
            {result.referenceUrl && (
              <a
                href={result.referenceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-blue-600 hover:underline flex items-center gap-1 mt-1"
              >
                <ExternalLink size={10} /> Read more on Plant.id
              </a>
            )}

            {/* Expert disclaimer — always shown for disease results */}
            {!result.isHealthy && (
              <div className="mt-2 pt-2 border-t border-amber-200/60 flex items-start gap-1.5 bg-amber-100/60 rounded-lg px-2 py-1.5">
                <AlertTriangle size={11} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-800 font-semibold leading-snug">
                  Always confirm with a local agronomist before applying chemical treatments.
                  Wrong remedies can damage crops further.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
