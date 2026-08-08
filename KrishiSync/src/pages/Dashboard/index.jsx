import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { weatherService } from '../../services/weatherService';
import { advisoryService } from '../../services/advisoryService';
import {
  WeatherCard,
  IrrigationAlert,
  QuickActionGrid,
  DashboardSkeleton,
  DashboardError,
} from '../../components/dashboard';
import { RefreshCw, MapPin, Droplets, Wind, ShieldAlert, Sparkles } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [weatherData, setWeatherData] = useState(null);
  const [irrigationData, setIrrigationData] = useState(null);
  const [advisory, setAdvisory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [cropType, setCropType] = useState('wheat');

  const farmerName = user?.name || user?.phoneNumber || user?.phone || 'Farmer';
  // Default coords (Kolkata Agro Zone) - could be replaced with user GPS later
  const defaultCoords = { lat: 22.5726, lng: 88.3639, lon: 88.3639 };

  const loadDashboardData = React.useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const [weather, advice, plan] = await Promise.all([
        weatherService.getWeatherData(defaultCoords).catch(() => null),
        weatherService.getIrrigationAdvice(cropType, 'loam', defaultCoords).catch(() => null),
        advisoryService.getSmartPlan(defaultCoords, cropType, 45).catch(() => null),
      ]);

      setWeatherData(weather);
      setIrrigationData(advice);
      setAdvisory(plan);
      setIsLoading(false);
    } catch {
      setIsError(true);
      setIsLoading(false);
    }
  }, [cropType]);

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cropType]);

  const rainExpected = advisory?.realTimeData?.rainProbability
    ? parseInt(advisory.realTimeData.rainProbability) > 50
    : false;

  return (
    <div className="p-4 space-y-5 pb-8 min-h-full font-body bg-linear-to-br from-[#f0fdf4] via-[#ecfdf5] to-[#f8fafc] relative">
      {/* Ambient glows */}
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-10 w-72 h-72 bg-lime-400/10 rounded-full blur-3xl pointer-events-none" />

      {isLoading ? (
        <DashboardSkeleton />
      ) : isError ? (
        <DashboardError onRetry={loadDashboardData} />
      ) : (
        <>
          <div className="relative z-10">
            <div className="flex justify-between items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#2E7D32] bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200 font-heading mb-2">
                  <Sparkles size={12} />
                  Live Backend Data
                </span>
                <h1 className="text-[26px] sm:text-[28px] font-extrabold font-heading text-[#1F2937] leading-tight tracking-tight">
                  Namaste, <span className="text-[#2E7D32]">{farmerName}</span> 🌾
                </h1>
              </div>

              <button
                onClick={loadDashboardData}
                className="p-2.5 bg-white hover:bg-gray-50 text-[#6B7280] rounded-xl border border-gray-200 shadow-sm transition-transform active:scale-95 cursor-pointer hover:border-[#2E7D32] hover:text-[#2E7D32]"
                title="Refresh Data"
              >
                <RefreshCw size={18} strokeWidth={2.2} />
              </button>
            </div>

            {/* Crop selector */}
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              {['wheat', 'rice', 'tomato', 'mustard', 'cotton'].map((c) => (
                <button
                  key={c}
                  onClick={() => setCropType(c)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-bold font-heading transition-all cursor-pointer border ${
                    cropType === c
                      ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-md shadow-emerald-200'
                      : 'bg-white text-[#6B7280] border-gray-200 hover:border-[#2E7D32] hover:text-[#2E7D32]'
                  }`}
                >
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Weather Card */}
          {weatherData && <WeatherCard weather={weatherData} />}

          {/* Advisory Highlights */}
          {advisory && (
            <div className="relative z-10 ks-card ks-appear p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-[#2E7D32] font-heading flex items-center gap-1.5">
                  <ShieldAlert size={16} />
                  FarmShield Smart Advisory
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold font-heading border ${
                    advisory.farmShield?.riskLevel === 'High'
                      ? 'bg-red-50 text-[#EF4444] border-red-200'
                      : 'bg-emerald-50 text-[#10B981] border-emerald-200'
                  }`}
                >
                  Risk: {advisory.farmShield?.riskLevel}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-emerald-50/70 rounded-xl p-2.5 border border-emerald-100">
                  <Droplets size={16} className="mx-auto text-[#2E7D32] mb-1" />
                  <p className="text-[10px] text-[#6B7280] font-semibold">Humidity</p>
                  <p className="text-[14px] font-extrabold text-[#1F2937] font-heading">
                    {advisory.realTimeData?.humidity}
                  </p>
                </div>
                <div className="bg-sky-50/70 rounded-xl p-2.5 border border-sky-100">
                  <Wind size={16} className="mx-auto text-sky-600 mb-1" />
                  <p className="text-[10px] text-[#6B7280] font-semibold">Rain Prob.</p>
                  <p className="text-[14px] font-extrabold text-[#1F2937] font-heading">
                    {advisory.realTimeData?.rainProbability}
                  </p>
                </div>
                <div className="bg-amber-50/70 rounded-xl p-2.5 border border-amber-100">
                  <MapPin size={16} className="mx-auto text-amber-600 mb-1" />
                  <p className="text-[10px] text-[#6B7280] font-semibold">Soil Moist.</p>
                  <p className="text-[14px] font-extrabold text-[#1F2937] font-heading">
                    {advisory.realTimeData?.soilMoisture}
                  </p>
                </div>
              </div>

              <div className="bg-[#2E7D32]/5 rounded-xl p-3 border border-emerald-100">
                <p className="text-[12px] font-semibold text-[#1F2937] leading-relaxed">
                  <span className="text-[#2E7D32] font-extrabold">💧 {advisory.jalRakshak?.action}</span>
                </p>
                {(advisory.farmShield?.alerts || []).map((a, i) => (
                  <p key={i} className="text-[12px] text-[#6B7280] mt-1 flex items-start gap-1">
                    <span className="text-amber-500 mt-0.5">⚠️</span>
                    {a}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Irrigation Alert */}
          {irrigationData && <IrrigationAlert rainExpected={rainExpected} data={irrigationData} />}

          <QuickActionGrid />
        </>
      )}
    </div>
  );
};

export default DashboardPage;
