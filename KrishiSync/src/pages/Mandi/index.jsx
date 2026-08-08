import React, { useState, useEffect } from 'react';
import { MapPin, Truck, IndianRupee, Sparkles, Calculator, TrendingUp, Globe } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import { mandiService } from '../../services/mandiService';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0);
};

export const MandiPage = () => {
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [quantityKg, setQuantityKg] = useState(500);
  const [crops, setCrops] = useState([]);
  const [mandis, setMandis] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [coords] = useState({ lat: 22.5726, lng: 88.3639 }); // Kolkata Agro Zone

  useEffect(() => {
    mandiService.getCropsList().then(setCrops);
  }, []);

  const handleCalculate = React.useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const results = await mandiService.calculateMandiPrices(selectedCrop, quantityKg, coords);
      setMandis(results);
      if (results.length === 0) {
        setError('No real mandi data found for this crop today. Try another crop.');
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Failed to fetch mandi data. Please check backend & MANDI_API_KEY.');
      setMandis([]);
    }
  }, [selectedCrop, quantityKg, coords]);

  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  return (
    <div className="flex flex-col h-full bg-linear-to-br from-[#f0fdf4] via-[#ecfdf5] to-[#f8fafc] font-body">
      <PageHeader title="Mandi Decision & Profit Calculator" showBack={false} />

      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-8">
        <div className="ks-card ks-appear p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <span className="text-[13px] font-bold text-[#2E7D32] font-heading flex items-center gap-1.5">
              <Calculator size={16} /> MandiMind Net Revenue Engine
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <Globe size={11} /> Real Govt. Prices
            </span>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleCalculate(); }} className="space-y-3">
            <div>
              <label htmlFor="crop-select" className="block text-[13px] font-bold text-[#1F2937] mb-1 font-heading">
                Select Crop
              </label>
              <select
                id="crop-select"
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full bg-[#F9FAFB] border border-gray-300 text-[#1F2937] text-[14px] font-bold rounded-xl px-3.5 py-2.5 outline-none focus:border-[#2E7D32] focus-visible:ring-2 focus-visible:ring-[#2E7D32] cursor-pointer"
              >
                {crops.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>

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
                  className="w-full bg-[#F9FAFB] border border-gray-300 text-[#1F2937] text-[15px] font-bold rounded-xl px-3.5 py-2.5 pr-20 outline-none focus:border-[#2E7D32] focus-visible:ring-2 focus-visible:ring-[#2E7D32]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-extrabold text-[#6B7280] font-heading bg-gray-200 px-2 py-0.5 rounded-md pointer-events-none">
                  {((Number(quantityKg) || 0) / 100).toFixed(1)} Qtl
                </span>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={isLoading}
              className="mt-2 text-[15px] flex items-center justify-center gap-2"
            >
              <Sparkles size={18} />
              {isLoading ? 'Analyzing Mandis...' : 'Find Best Mandi'}
            </Button>
          </form>
        </div>

        {error && (
          <div className="bg-[#FEF2F2] border border-[#EF4444]/30 rounded-2xl p-4 text-[13px] font-semibold text-[#EF4444]">
            ⚠️ {error}
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[17px] font-bold font-heading text-[#1F2937] flex items-center gap-1.5">
              <TrendingUp size={17} className="text-[#2E7D32]" />
              Best Selling Mandis ({mandis.length})
            </h3>
            <span className="text-[12px] font-semibold text-[#6B7280]">Sorted by Net Revenue</span>
          </div>

          {mandis.map((mandi, idx) => (
            <div
              key={idx}
              className={`bg-white/90 rounded-2xl border ${
                mandi.isBest ? 'border-2 border-[#2E7D32] shadow-xl shadow-emerald-200/50' : 'border-gray-200 shadow-sm'
              } p-4 space-y-3 relative overflow-hidden hover:-translate-y-0.5 transition-transform duration-200`}
            >
              {mandi.isBest && (
                <div className="absolute top-0 right-0 bg-linear-to-r from-[#2E7D32] to-[#F57C00] text-white text-[10px] font-extrabold font-heading px-3 py-1 rounded-bl-xl uppercase tracking-wider shadow-md">
                  Highest Net Revenue ⭐
                </div>
              )}

              <div>
                <h4 className="text-[18px] font-extrabold font-heading text-[#1F2937] leading-snug">
                  {mandi.mandiName}
                </h4>
                <p className="text-[12px] font-semibold text-[#6B7280] flex items-center gap-1 mt-0.5">
                  <MapPin size={13} className="text-[#2E7D32] shrink-0" />
                  {mandi.location} • <strong className="text-[#1F2937]">{mandi.distance} away</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-[#F9FAFB] p-3 rounded-xl border border-gray-200/70 text-[12px]">
                <div>
                  <span className="text-[#6B7280] font-medium block">Market Rate:</span>
                  <strong className="text-[#1F2937] text-[14px] font-heading font-extrabold">
                    {formatCurrency(mandi.marketPricePerQtl)}{' '}
                    <span className="text-[11px] text-[#6B7280] font-normal">/ qtl</span>
                  </strong>
                </div>
                <div>
                  <span className="text-[#6B7280] font-medium flex items-center gap-1">
                    <Truck size={12} className="text-[#F57C00] shrink-0" /> Transport:
                  </span>
                  <strong className="text-[#EF4444] text-[14px] font-heading font-extrabold">
                    - {formatCurrency(mandi.transportCost)}
                  </strong>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-[13px] font-bold text-[#6B7280]">Final Net Revenue:</span>
                <span className="bg-emerald-50 text-[#2E7D32] text-[16px] font-extrabold font-heading px-3.5 py-1 rounded-xl border border-emerald-200 flex items-center gap-1 shadow-sm">
                  <IndianRupee size={16} />
                  {formatCurrency(mandi.netProfit)}
                </span>
              </div>
            </div>
          ))}

          {mandis.length === 0 && !error && !isLoading && (
            <div className="bg-white/80 rounded-2xl border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-[#2E7D32] mx-auto mb-3 border border-emerald-200">
                <TrendingUp size={28} />
              </div>
              <p className="text-[14px] font-semibold text-[#6B7280]">
                Enter crop & quantity to see real mandi comparison.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MandiPage;