import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Mic,
  RefreshCw,
  AlertTriangle,
  FileQuestion,
  Sparkles,
  Loader2,
  Scan,
  CheckCircle2,
} from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import { ResultCard, ScannerDemoToolbar } from '../../components/scanner';

export const ScannerPage = () => {
  // State Machine: EMPTY | IMAGE_SELECTED | ANALYZING | SUCCESS | ERROR | NOT_A_PLANT
  const [scanState, setScanState] = useState('EMPTY');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState('');

  // Future Plant.id API response parameters structure (Member 4 will connect later)
  const [scanResult, setScanResult] = useState({
    diseaseName: 'Late Blight (Phytophthora infestans)',
    confidence: 98,
    recommendation: 'Remove affected leaves immediately and follow treatment. Apply copper-based fungicide every 7–10 days during humid weather.',
    isPlant: true,
    error: null,
  });

  const fileInputRef = useRef(null);

  // Handle File Selection (Camera / Gallery Upload)
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setScanState('IMAGE_SELECTED');
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger Native Camera / File Input
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Simulate Disease Analysis
  const handleStartAnalysis = () => {
    setScanState('ANALYZING');
    setTimeout(() => {
      if (scanResult.error) {
        setScanState('ERROR');
      } else if (!scanResult.isPlant) {
        setScanState('NOT_A_PLANT');
      } else {
        setScanState('SUCCESS');
      }
    }, 1800);
  };

  // Reset to EMPTY state
  const handleReset = () => {
    setSelectedImage(null);
    setScanState('EMPTY');
    setVoiceNotice('');
  };

  // Simulate Voice Command Action
  const handleVoiceCommand = () => {
    setIsListening(true);
    setVoiceNotice('Listening... Say "Capture Crop" or "Upload Photo"');
    setTimeout(() => {
      setIsListening(false);
      setVoiceNotice('Voice trigger detected! Opening camera...');
      setTimeout(() => {
        triggerFileInput();
      }, 500);
    }, 1500);
  };

  // Handle Demo Toolbar State Selection
  const handleDemoStateSelect = (newState) => {
    setScanState(newState);
    if (newState === 'IMAGE_SELECTED' && !selectedImage) {
      setSelectedImage('https://images.unsplash.com/photo-1592417817098-8f3d6eb247a3?q=80&w=600&auto=format&fit=crop');
    }
    if (newState === 'SUCCESS') {
      setScanResult({
        diseaseName: 'Late Blight (Phytophthora infestans)',
        confidence: 98,
        recommendation: 'Remove affected leaves immediately and follow treatment. Apply copper-based fungicide every 7–10 days during humid weather.',
        isPlant: true,
        error: null,
      });
    } else if (newState === 'ERROR') {
      setScanResult((prev) => ({ ...prev, error: 'Analysis failed. Please try a clearer photo.' }));
    } else if (newState === 'NOT_A_PLANT') {
      setScanResult((prev) => ({ ...prev, isPlant: false, error: null }));
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB] font-body">
      <PageHeader title="Crop Health Scanner" showBack={false} />

      {/* Hidden File Input for Native Camera & Gallery Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        className="hidden"
        id="crop-image-input"
        aria-label="Upload crop leaf photo"
      />

      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-8">
        {/* Hackathon Interactive Demo Switcher */}
        <ScannerDemoToolbar
          currentState={scanState}
          onStateSelect={handleDemoStateSelect}
        />

        {/* STATE 1: EMPTY STATE */}
        {scanState === 'EMPTY' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 flex flex-col items-center text-center space-y-5 my-2">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-[#2E7D32] border-2 border-green-200/80 shadow-inner my-2">
              <Scan size={48} strokeWidth={2} />
            </div>

            <div className="space-y-1.5 max-w-[320px]">
              <h2 className="text-[22px] font-extrabold font-heading text-[#1F2937] tracking-tight">
                Instant Crop Disease Detection
              </h2>
              <p className="text-[14px] font-medium text-[#6B7280] leading-relaxed">
                Take a photo or upload an image of an unhealthy leaf to instantly identify diseases &amp; get recommended treatment cures.
              </p>
            </div>

            {voiceNotice && (
              <div className="bg-emerald-50 text-[#2E7D32] border border-emerald-200 px-3 py-1.5 rounded-xl text-[12px] font-semibold flex items-center gap-1.5">
                <Mic size={14} className={isListening ? 'animate-pulse text-[#F57C00]' : ''} />
                <span>{voiceNotice}</span>
              </div>
            )}

            <div className="w-full space-y-3 pt-2">
              <Button
                variant="primary"
                fullWidth
                onClick={triggerFileInput}
                className="text-[15px] py-3.5 flex items-center justify-center gap-2"
              >
                <Camera size={20} />
                Take Photo / Upload
              </Button>

              <Button
                variant="outline"
                fullWidth
                onClick={handleVoiceCommand}
                disabled={isListening}
                className="text-[14px] flex items-center justify-center gap-2"
              >
                <Mic size={18} className={isListening ? 'text-[#F57C00] animate-bounce' : 'text-[#2E7D32]'} />
                {isListening ? 'Listening...' : 'Use Voice Command'}
              </Button>
            </div>
          </div>
        )}

        {/* STATE 2: IMAGE_SELECTED STATE */}
        {scanState === 'IMAGE_SELECTED' && selectedImage && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-[#2E7D32] font-heading flex items-center gap-1">
                <CheckCircle2 size={16} /> Image Selected
              </span>
              <button
                onClick={triggerFileInput}
                className="text-[12px] font-bold text-[#F57C00] hover:underline flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F57C00] rounded-md px-1"
                aria-label="Replace selected photo"
              >
                <Upload size={13} /> Replace Photo
              </button>
            </div>

            <div className="w-full aspect-4/3 rounded-xl border border-gray-200 overflow-hidden relative bg-black/5">
              <img
                src={selectedImage}
                alt="Selected crop preview"
                className="w-full h-full object-cover max-w-full"
              />
            </div>

            <Button
              variant="primary"
              fullWidth
              onClick={handleStartAnalysis}
              className="text-[16px] py-3.5 flex items-center justify-center gap-2"
            >
              <Sparkles size={20} />
              Analyze Disease
            </Button>
          </div>
        )}

        {/* STATE 3: ANALYZING STATE */}
        {scanState === 'ANALYZING' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 flex flex-col items-center text-center space-y-5">
            {selectedImage && (
              <div className="w-full max-w-[280px] aspect-square rounded-2xl border-2 border-[#2E7D32] overflow-hidden relative shadow-md">
                <img
                  src={selectedImage}
                  alt="Analyzing crop"
                  className="w-full h-full object-cover max-w-full"
                />
                <div className="absolute inset-x-0 h-1 bg-[#D8FF36] shadow-[0_0_15px_#D8FF36] animate-pulse top-1/2" />
                <div className="absolute inset-0 bg-[#2E7D32]/10 backdrop-contrast-125" />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-[#2E7D32] font-heading font-extrabold text-[18px]">
                <Loader2 size={24} className="animate-spin text-[#2E7D32]" />
                <span>Analyzing your plant...</span>
              </div>
              <p className="text-[13px] font-medium text-[#6B7280]">
                Detecting leaf lesions, spot patterns, and crop health indicators.
              </p>
            </div>

            <Button variant="primary" disabled fullWidth className="opacity-60 cursor-not-allowed">
              Processing...
            </Button>
          </div>
        )}

        {/* STATE 4: SUCCESS STATE */}
        {scanState === 'SUCCESS' && (
          <ResultCard
            diseaseName={scanResult.diseaseName}
            confidence={scanResult.confidence}
            recommendation={scanResult.recommendation}
            imageUrl={selectedImage}
            onReset={handleReset}
          />
        )}

        {/* STATE 5: ERROR STATE */}
        {scanState === 'ERROR' && (
          <div className="bg-[#FEF2F2] rounded-2xl border border-[#EF4444]/30 p-6 text-center space-y-4 font-body shadow-xs">
            <div className="w-16 h-16 bg-[#EF4444]/15 text-[#EF4444] rounded-2xl flex items-center justify-center mx-auto border border-[#EF4444]/20 shadow-xs">
              <AlertTriangle size={32} strokeWidth={2.2} />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-[20px] font-extrabold font-heading text-[#EF4444] tracking-tight">
                Analysis Failed
              </h3>
              <p className="text-[14px] font-medium text-[#1F2937] leading-relaxed max-w-[280px] mx-auto">
                Analysis failed. Please try a clearer photo with good lighting and centered leaf focus.
              </p>
            </div>

            <div className="pt-2">
              <Button
                variant="danger"
                fullWidth
                onClick={handleReset}
                className="flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} />
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* STATE 6: NOT_A_PLANT STATE */}
        {scanState === 'NOT_A_PLANT' && (
          <div className="bg-[#FFF8F0] rounded-2xl border border-[#F57C00]/30 p-6 text-center space-y-4 font-body shadow-xs">
            <div className="w-16 h-16 bg-[#F57C00]/15 text-[#F57C00] rounded-2xl flex items-center justify-center mx-auto border border-[#F57C00]/20 shadow-xs">
              <FileQuestion size={32} strokeWidth={2.2} />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-[20px] font-extrabold font-heading text-[#1F2937] tracking-tight">
                No Plant Detected
              </h3>
              <p className="text-[14px] font-medium text-[#6B7280] leading-relaxed max-w-[280px] mx-auto">
                No plant detected in image. Please ensure a clear crop leaf is focused in the frame.
              </p>
            </div>

            <div className="pt-2">
              <Button
                variant="secondary"
                fullWidth
                onClick={handleReset}
                className="flex items-center justify-center gap-2"
              >
                <Camera size={18} />
                Upload New Photo
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScannerPage;
