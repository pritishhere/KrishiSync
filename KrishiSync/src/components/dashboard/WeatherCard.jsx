import React from 'react';
import { Sun, CloudRain, Droplets, Wind, MapPin, ArrowUpRight, Calendar } from 'lucide-react';

export const WeatherCard = ({ weather }) => {
  const defaultWeather = {
    temp: '28°C',
    condition: 'Partly Cloudy',
    humidity: '72%',
    location: 'Pune, Maharashtra',
    tomorrow: '80% Rain expected tomorrow',
    wind: '12 km/h',
    highLow: '31°C / 22°C',
    isRainy: true,
  };

  const data = weather || defaultWeather;

  return (
    <div className="w-full bg-[#2E7D32] text-white rounded-2xl p-5 relative overflow-hidden font-body shadow-md">
      {/* Decorative gradient overlay */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex justify-between items-center border-b border-white/20 pb-3 mb-4 relative z-10">
        <div className="flex items-center gap-1.5 text-[13px] font-semibold text-green-100">
          <MapPin size={15} className="text-[#F57C00]" />
          <span>{data.location}</span>
        </div>
        <span className="bg-white/20 backdrop-blur-xs text-white text-[12px] font-extrabold px-3 py-1 rounded-full font-heading border border-white/20">
          {data.condition}
        </span>
      </div>

      {/* Main Temperature & Weather Info */}
      <div className="grid grid-cols-12 gap-2 items-center my-1 relative z-10">
        {/* Main Temperature Readout */}
        <div className="col-span-7">
          <span className="text-[12px] font-medium text-green-100/90 block mb-0.5 font-heading">
            Current Weather
          </span>
          <div className="text-[48px] sm:text-[52px] font-extrabold leading-none text-white tracking-tight font-heading flex items-baseline gap-1">
            {data.temp}
          </div>
          <div className="text-[12px] font-medium text-green-100/90 mt-1">
            High / Low: <span className="text-white font-bold">{data.highLow}</span>
          </div>
        </div>

        {/* Weather Icon & Data Indicators */}
        <div className="col-span-5 flex flex-col items-end justify-between space-y-3">
          <div className="p-3 bg-white/15 backdrop-blur-xs border border-white/20 rounded-2xl text-white shadow-inner">
            {data.isRainy ? (
              <CloudRain size={36} strokeWidth={2.2} className="text-[#81D4FA]" />
            ) : (
              <Sun size={36} strokeWidth={2.2} className="text-[#FFD54F]" />
            )}
          </div>

          <div className="w-full space-y-1 text-right text-[12px] font-medium">
            <div className="flex items-center justify-end gap-1.5 text-green-100">
              <Droplets size={14} className="text-[#81D4FA]" />
              <span>Humidity: <strong className="text-white font-bold">{data.humidity}</strong></span>
            </div>
            <div className="flex items-center justify-end gap-1.5 text-green-100">
              <Wind size={14} className="text-[#B2DFDB]" />
              <span>Wind: <strong className="text-white font-bold">{data.wind}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Tomorrow Forecast Row */}
      <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-[13px] relative z-10">
        <div className="flex items-center gap-2 text-green-100 font-medium">
          <Calendar size={15} className="text-[#F57C00]" />
          <span>Forecast: <strong className="text-white font-bold">{data.tomorrow}</strong></span>
        </div>
        <ArrowUpRight size={16} className="text-white" />
      </div>
    </div>
  );
};

export default WeatherCard;
