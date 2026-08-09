import React from 'react';
import { Sun, CloudRain, Droplets, Wind, MapPin, ArrowUpRight, Calendar } from 'lucide-react';

export const WeatherCard = ({ weather }) => {
  const defaultWeather = {
    temperature: '28°C',
    humidity: '72%',
    condition: 'Partly Cloudy',
    precipitationProbability: '80%',
    location: 'Pune, Maharashtra',
    tomorrowForecast: '80% Rain expected tomorrow',
    highLow: '31°C / 22°C',
    windSpeed: '12 km/h',
    rainExpected: true,
  };

  const data = weather || defaultWeather;
  const tempDisplay = data.temperature || data.temp || '28°C';
  const tomorrowDisplay = data.tomorrowForecast || data.tomorrow || '80% Rain expected tomorrow';
  const windDisplay = data.windSpeed || data.wind || '12 km/h';

  return (
    <div className="w-full bg-[#2d5a27] text-white rounded-md p-5 relative overflow-hidden font-body shadow-sm">

      {/* Top Header Row */}
      <div className="flex justify-between items-center border-b border-white/20 pb-3 mb-4 relative z-10">
        <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[#e8e0d5]">
          <MapPin size={15} className="text-[#e8e0d5]" />
          <span>{data.location}</span>
        </div>
        <span className="bg-white/20 text-white text-[12px] font-extrabold px-3 py-1 rounded-md font-heading border border-white/20">
          {data.condition}
        </span>
      </div>

      {/* Main Temperature & Weather Info */}
      <div className="grid grid-cols-12 gap-2 items-center my-1 relative z-10">
        {/* Main Temperature Readout */}
        <div className="col-span-7">
          <span className="text-[12px] font-medium text-[#e8e0d5] block mb-0.5 font-heading">
            Current Weather
          </span>
          <div className="text-[48px] sm:text-[52px] font-extrabold leading-none text-white tracking-tight font-heading flex items-baseline gap-1">
            {tempDisplay}
          </div>
          <div className="text-[12px] font-medium text-[#e8e0d5] mt-1">
            High / Low: <span className="text-white font-bold">{data.highLow}</span>
          </div>
        </div>

        {/* Weather Icon & Data Indicators */}
        <div className="col-span-5 flex flex-col items-end justify-between space-y-3">
          <div className="p-3 bg-white/10 border border-white/20 rounded-md text-white shadow-sm">
            {data.rainExpected ? (
              <CloudRain size={36} strokeWidth={2.2} className="text-white" />
            ) : (
              <Sun size={36} strokeWidth={2.2} className="text-white" />
            )}
          </div>

          <div className="w-full space-y-1 text-right text-[12px] font-medium">
            <div className="flex items-center justify-end gap-1.5 text-[#e8e0d5]">
              <Droplets size={14} className="text-white" />
              <span>Humidity: <strong className="text-white font-bold">{data.humidity}</strong></span>
            </div>
            <div className="flex items-center justify-end gap-1.5 text-[#e8e0d5]">
              <Wind size={14} className="text-white" />
              <span>Wind: <strong className="text-white font-bold">{windDisplay}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Tomorrow Forecast Row */}
      <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-[13px] relative z-10">
        <div className="flex items-center gap-2 text-[#e8e0d5] font-medium">
          <Calendar size={15} className="text-white" />
          <span>Forecast: <strong className="text-white font-bold">{tomorrowDisplay}</strong></span>
        </div>
        <ArrowUpRight size={16} className="text-white" />
      </div>
    </div>
  );
};

export default WeatherCard;
