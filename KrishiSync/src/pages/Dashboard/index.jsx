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
    <div className="p-4 space-y-5 pb-8 min-h-full font-body bg-[#f9f8f6] relative">

      {isLoading ? (
        <DashboardSkeleton />
      ) : isError ? (
        <DashboardError onRetry={loadDashboardData} />
      ) : (
        <>
          <div className="relative z-10">
            <div className="flex justify-between items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#2d5a27] bg-[#e8e0d5] px-2.5 py-0.5 rounded-md border border-[#e2dcd0] font-heading mb-2">
                  <Sparkles size={12} />
                  Live Backend Data
                </span>
                <h1 className="text-[26px] sm:text-[28px] font-extrabold font-heading text-gray-900 leading-tight tracking-tight">
                  Namaste, <span className="text-[#2d5a27]">{farmerName}</span>
                </h1>
              </div>

              <button
                onClick={loadDashboardData}
                className="p-2.5 bg-white hover:bg-gray-50 text-gray-500 rounded-md border border-[#e2dcd0] shadow-sm transition-transform active:scale-95 cursor-pointer hover:border-[#2d5a27] hover:text-[#2d5a27]"
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
                  className={`px-3 py-1.5 rounded-md text-[12px] font-bold font-heading transition-all cursor-pointer border ${
                    cropType === c
                      ? 'bg-[#2d5a27] text-white border-[#2d5a27] shadow-sm'
                      : 'bg-white text-gray-600 border-[#e2dcd0] hover:border-[#2d5a27] hover:text-[#2d5a27]'
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
            <div className="relative z-10 ks-card ks-appear p-4 space-y-3 shadow-sm border border-[#e2dcd0] rounded-md bg-white">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-[#2d5a27] font-heading flex items-center gap-1.5">
                  <ShieldAlert size={16} />
                  FarmShield Smart Advisory
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-extrabold font-heading border ${
                    advisory.farmShield?.riskLevel === 'High'
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : 'bg-[#e8e0d5] text-[#2d5a27] border-[#e2dcd0]'
                  }`}
                >
                  Risk: {advisory.farmShield?.riskLevel}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-[#f9f8f6] rounded-md p-2.5 border border-[#e2dcd0]">
                  <Droplets size={16} className="mx-auto text-[#2d5a27] mb-1" />
                  <p className="text-[10px] text-gray-600 font-semibold">Humidity</p>
                  <p className="text-[14px] font-extrabold text-gray-900 font-heading">
                    {advisory.realTimeData?.humidity}
                  </p>
                </div>
                <div className="bg-[#f9f8f6] rounded-md p-2.5 border border-[#e2dcd0]">
                  <Wind size={16} className="mx-auto text-sky-700 mb-1" />
                  <p className="text-[10px] text-gray-600 font-semibold">Rain Prob.</p>
                  <p className="text-[14px] font-extrabold text-gray-900 font-heading">
                    {advisory.realTimeData?.rainProbability}
                  </p>
                </div>
                <div className="bg-[#f9f8f6] rounded-md p-2.5 border border-[#e2dcd0]">
                  <MapPin size={16} className="mx-auto text-amber-700 mb-1" />
                  <p className="text-[10px] text-gray-600 font-semibold">Soil Moist.</p>
                  <p className="text-[14px] font-extrabold text-gray-900 font-heading">
                    {advisory.realTimeData?.soilMoisture}
                  </p>
                </div>
              </div>

              <div className="bg-[#f9f8f6] rounded-md p-3 border border-[#e2dcd0]">
                <p className="text-[12px] font-semibold text-gray-900 leading-relaxed">
                  <span className="text-[#2d5a27] font-extrabold">{advisory.jalRakshak?.action}</span>
                </p>
                {(advisory.farmShield?.alerts || []).map((a, i) => (
                  <p key={i} className="text-[12px] text-gray-600 mt-1 flex items-start gap-1">
                    <span className="text-amber-600 mt-0.5">!</span>
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
