import React, { useState } from 'react';
import { TrendingUp, MapPin, Truck, IndianRupee, Sparkles, Filter, Calculator } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';

export const MandiPage = () => {
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [quantityKg, setQuantityKg] = useState(500);
  const [isCalculated, setIsCalculated] = useState(true);

  const crops = [
    { id: 'wheat', name: 'Wheat (गेहूँ)', avgPriceQtl: 2275, icon: '🌾' },
    { id: 'paddy', name: 'Paddy / Rice (धान)', avgPriceQtl: 2183, icon: '🌾' },
    { id: 'potato', name: 'Potato (आलू)', avgPriceQtl: 1450, icon: '🥔' },
    { id: 'mustard', name: 'Mustard (सरसों)', avgPriceQtl: 5450, icon: '🌼' },
    { id: 'cotton', name: 'Cotton (कपास)', avgPriceQtl: 7100, icon: '☁️' },
  ];

  // Mock Mandi Market Data per Quintal (100 kg = 1 quintal)
  const mandiData = {
    wheat: [
      { id: 1, name: 'Azadpur Mandi', location: 'Delhi NCR', distanceKm: 18, pricePerQtl: 2350, transportCostPerKm: 25, isBest: true },
      { id: 2, name: 'Karnal Grain Market', location: 'Karnal, Haryana', distanceKm: 34, pricePerQtl: 2310, transportCostPerKm: 22, isBest: false },
      { id: 3, name: 'Pune APMC Market', location: 'Pune, MH', distanceKm: 52, pricePerQtl: 2250, transportCostPerKm: 18, isBest: false },
    ],
    paddy: [
      { id: 1, name: 'Karnal Mandi', location: 'Haryana', distanceKm: 22, pricePerQtl: 2240, transportCostPerKm: 20, isBest: true },
      { id: 2, name: 'Ambala Mandi', location: 'Punjab Border', distanceKm: 48, pricePerQtl: 2190, transportCostPerKm: 18, isBest: false },
    ],
    potato: [
      { id: 1, name: 'Agra APMC Market', location: 'Agra, UP', distanceKm: 15, pricePerQtl: 1520, transportCostPerKm: 20, isBest: true },
      { id: 2, name: 'Indore Mandi', location: 'MP', distanceKm: 65, pricePerQtl: 1480, transportCostPerKm: 15, isBest: false },
    ],
    mustard: [
      { id: 1, name: 'Bharatpur Mandi', location: 'Rajasthan', distanceKm: 28, pricePerQtl: 5600, transportCostPerKm: 25, isBest: true },
      { id: 2, name: 'Jaipur Grain Hub', location: 'Rajasthan', distanceKm: 70, pricePerQtl: 5510, transportCostPerKm: 18, isBest: false },
    ],
    cotton: [
      { id: 1, name: 'Rajkot APMC', location: 'Gujarat', distanceKm: 30, pricePerQtl: 7250, transportCostPerKm: 30, isBest: true },
      { id: 2, name: 'Yavatmal Mandi', location: 'Maharashtra', distanceKm: 85, pricePerQtl: 7050, transportCostPerKm: 20, isBest: false },
    ],
  };

  const activeCrop = crops.find((c) => c.id === selectedCrop) || crops[0];
  const mandis = mandiData[selectedCrop] || mandiData.wheat;

  // Calculate Net Profit: (Quantity in Qtl * Price/Qtl) - (Distance * Transport Cost/Km)
  const calculateMetrics = (mandi) => {
    const quintals = (Number(quantityKg) || 100) / 100;
    const grossRevenue = quintals * mandi.pricePerQtl;
    const transportCost = mandi.distanceKm * mandi.transportCostPerKm;
    const netProfit = grossRevenue - transportCost;
    return { grossRevenue, transportCost, netProfit };
  };

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB] font-body">
      <PageHeader title="Mandi Price & Profit Calculator" showBack={false} />

      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-8">
        {/* Calculator Control Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <span className="text-[13px] font-bold text-[#2E7D32] font-heading flex items-center gap-1.5">
              <Calculator size={16} /> Market Rates Calculator
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Live Mandi Feeds
            </span>
          </div>

          <div className="space-y-3">
            {/* Select Crop */}
            <div>
              <label htmlFor="crop-select" className="block text-[13px] font-bold text-[#1F2937] mb-1 font-heading">
                Select Crop
              </label>
              <select
                id="crop-select"
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full bg-[#F9FAFB] border border-gray-300 text-[#1F2937] text-[14px] font-bold rounded-xl px-3.5 py-2.5 outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] cursor-pointer"
              >
                {crops.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity in KG */}
            <div>
              <label htmlFor="quantity-kg" className="block text-[13px] font-bold text-[#1F2937] mb-1 font-heading">
                Quantity in KG
              </label>
              <div className="relative">
                <input
                  id="quantity-kg"
                  type="number"
                  min="50"
                  step="50"
                  value={quantityKg}
                  onChange={(e) => setQuantityKg(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-[#F9FAFB] border border-gray-300 text-[#1F2937] text-[15px] font-bold rounded-xl px-3.5 py-2.5 outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32]"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[12px] font-extrabold text-[#6B7280] font-heading bg-gray-200 px-2 py-0.5 rounded-md">
                  {((Number(quantityKg) || 0) / 100).toFixed(1)} Qtl
                </span>
              </div>
            </div>

            {/* Calculate CTA */}
            <Button
              variant="primary"
              fullWidth
              onClick={() => setIsCalculated(true)}
              className="mt-2 text-[15px] flex items-center justify-center gap-2"
            >
              <Sparkles size={18} />
              Calculate Best Price
            </Button>
          </div>
        </div>

        {/* Mandi Result Cards */}
        {isCalculated && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[17px] font-bold font-heading text-[#1F2937]">
                Best Selling Mandis ({mandis.length})
              </h3>
              <span className="text-[12px] font-semibold text-[#6B7280]">Sorted by Net Profit</span>
            </div>

            {mandis.map((mandi) => {
              const { grossRevenue, transportCost, netProfit } = calculateMetrics(mandi);

              return (
                <div
                  key={mandi.id}
                  className={`bg-white rounded-2xl border ${
                    mandi.isBest ? 'border-2 border-[#2E7D32] shadow-sm' : 'border-gray-200 shadow-xs'
                  } p-4 space-y-3 relative overflow-hidden`}
                >
                  {mandi.isBest && (
                    <div className="absolute top-0 right-0 bg-[#2E7D32] text-white text-[10px] font-extrabold font-heading px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                      Highest Profit ⭐
                    </div>
                  )}

                  {/* Mandi Name & Location */}
                  <div>
                    <h4 className="text-[18px] font-extrabold font-heading text-[#1F2937] leading-snug">
                      {mandi.name}
                    </h4>
                    <p className="text-[12px] font-semibold text-[#6B7280] flex items-center gap-1 mt-0.5">
                      <MapPin size={13} className="text-[#2E7D32]" />
                      {mandi.location} • <strong className="text-[#1F2937]">{mandi.distanceKm} km away</strong>
                    </p>
                  </div>

                  {/* Market Rate & Transport breakdown */}
                  <div className="grid grid-cols-2 gap-2 bg-[#F9FAFB] p-3 rounded-xl border border-gray-200/70 text-[12px]">
                    <div>
                      <span className="text-[#6B7280] font-medium block">Market Rate:</span>
                      <strong className="text-[#1F2937] text-[14px] font-heading font-extrabold">
                        ₹{mandi.pricePerQtl.toLocaleString()} <span className="text-[11px] text-[#6B7280] font-normal">/ qtl</span>
                      </strong>
                    </div>
                    <div>
                      <span className="text-[#6B7280] font-medium block flex items-center gap-1">
                        <Truck size={12} className="text-[#F57C00]" /> Transport Cost:
                      </span>
                      <strong className="text-[#EF4444] text-[14px] font-heading font-extrabold">
                        -₹{transportCost.toLocaleString()}
                      </strong>
                    </div>
                  </div>

                  {/* Net Profit Banner Badge */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-[13px] font-bold text-[#6B7280]">Final Net Profit:</span>
                    <span className="bg-emerald-50 text-[#2E7D32] text-[16px] font-extrabold font-heading px-3.5 py-1 rounded-xl border border-emerald-200 flex items-center gap-1 shadow-xs">
                      <IndianRupee size={16} />
                      ₹{Math.round(netProfit).toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MandiPage;
