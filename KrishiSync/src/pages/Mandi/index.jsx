import React, { useState, useEffect } from 'react';
import { MapPin, Truck, IndianRupee, Sparkles, Calculator, TrendingUp, Globe } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import { mandiService } from '../../services/mandiService';
import MandiMapLocator from '../../Components/MandiMapLocator';

import MandiCartDoodle from '../../Components/doodles/MandiCartDoodle';

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
    <div className="flex flex-col h-full bg-linear-to-b from-[#f8faf6] via-[#f0f7ef] to-[#f8faf6] font-body min-h-screen">
      <PageHeader title="Mandi Decision & Net Profit Engine" showBack={false} />

      <div className="flex-1 p-4 sm:p-8 space-y-6 overflow-y-auto pb-12 max-w-7xl mx-auto w-full">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl border border-emerald-500/20">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 flex-wrap gap-3">
            <span className="text-xl font-black text-gray-900 font-heading flex items-center gap-3">
              <MandiCartDoodle className="w-10 h-10" /> MandiMind Net Revenue Engine
            </span>
            <span className="text-xs font-black text-emerald-800 bg-emerald-100/90 px-3.5 py-1.5 rounded-full border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
              <Globe size={14} className="text-emerald-600 animate-spin-slow" /> Real Govt. Prices
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
                className="w-full bg-[#f9f8f6] border border-[#e2dcd0] text-gray-900 text-[14px] font-bold rounded-md px-3.5 py-2.5 outline-none focus:border-[#2d5a27] focus-visible:ring-2 focus-visible:ring-[#2d5a27] cursor-pointer shadow-sm"
              >
                {crops.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
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
                  className="w-full bg-[#f9f8f6] border border-[#e2dcd0] text-gray-900 text-[15px] font-bold rounded-md px-3.5 py-2.5 pr-20 outline-none focus:border-[#2d5a27] focus-visible:ring-2 focus-visible:ring-[#2d5a27] shadow-sm"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-extrabold text-gray-600 font-heading bg-[#e8e0d5] px-2 py-0.5 rounded-md pointer-events-none border border-[#e2dcd0]">
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
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-[13px] font-semibold text-red-600">
            Error: {error}
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[17px] font-bold font-heading text-gray-900 flex items-center gap-1.5">
              <TrendingUp size={17} className="text-[#2d5a27]" />
              Best Selling Mandis ({mandis.length})
            </h3>
            <span className="text-[12px] font-semibold text-gray-600">Sorted by Net Revenue</span>
          </div>

          {mandis.map((mandi, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-md border ${
                mandi.isBest ? 'border-2 border-[#2d5a27]' : 'border-[#e2dcd0] shadow-sm'
              } p-4 space-y-3 relative overflow-hidden transition-transform duration-200`}
            >
              {mandi.isBest && (
                <div className="absolute top-0 right-0 bg-[#2d5a27] text-white text-[10px] font-extrabold font-heading px-3 py-1 rounded-bl-md uppercase tracking-wider shadow-sm">
                  Highest Net Revenue
                </div>
              )}

              <div>
                <h4 className="text-[18px] font-extrabold font-heading text-gray-900 leading-snug">
                  {mandi.mandiName}
                </h4>
                <p className="text-[12px] font-semibold text-gray-500 flex items-center gap-1 mt-0.5">
                  <MapPin size={13} className="text-[#2d5a27] shrink-0" />
                  {mandi.location} • <strong className="text-gray-900">{mandi.distance} away</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-[#f9f8f6] p-3 rounded-md border border-[#e2dcd0] text-[12px]">
                <div>
                  <span className="text-gray-600 font-medium block">Market Rate:</span>
                  <strong className="text-gray-900 text-[14px] font-heading font-extrabold">
                    {formatCurrency(mandi.marketPricePerQtl)}{' '}
                    <span className="text-[11px] text-gray-500 font-normal">/ qtl</span>
                  </strong>
                </div>
                <div>
                  <span className="text-gray-600 font-medium flex items-center gap-1">
                    <Truck size={12} className="text-[#5c4033] shrink-0" /> Transport:
                  </span>
                  <strong className="text-red-600 text-[14px] font-heading font-extrabold">
                    - {formatCurrency(mandi.transportCost)}
                  </strong>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#e2dcd0]">
                <span className="text-[13px] font-bold text-gray-600">Final Net Revenue:</span>
                <span className="bg-[#e8e0d5] text-[#2d5a27] text-[16px] font-extrabold font-heading px-3.5 py-1 rounded-md border border-[#e2dcd0] flex items-center gap-1 shadow-sm">
                  <IndianRupee size={16} />
                  {formatCurrency(mandi.netProfit)}
                </span>
              </div>
            </div>
          ))}

          {mandis.length === 0 && !error && !isLoading && (
            <div className="bg-white rounded-md border border-[#e2dcd0] p-8 text-center shadow-sm">
              <div className="w-16 h-16 bg-[#f9f8f6] rounded-md flex items-center justify-center text-[#2d5a27] mx-auto mb-3 border border-[#e2dcd0]">
                <TrendingUp size={28} />
              </div>
              <p className="text-[14px] font-semibold text-gray-600">
                Enter crop & quantity to see real mandi comparison.
              </p>
            </div>
          )}
        </div>

        {/* ── GPS Mandi Locator ── */}
        <div className="ks-card ks-appear p-5 bg-white border border-[#e2dcd0] rounded-md shadow-sm">
          <div className="flex items-center gap-2 pb-3 mb-3 border-b border-[#e2dcd0]">
            <span className="p-2 bg-[#f9f8f6] text-[#2d5a27] border border-[#e2dcd0] rounded-md flex items-center justify-center">
              <MapPin size={16} />
            </span>
            <div>
              <h3 className="text-[14px] font-extrabold text-gray-900 m-0 font-heading">GPS Mandi Locator</h3>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Interactive Map</span>
            </div>
          </div>
          <MandiMapLocator />
        </div>
      </div>
    </div>
  );
};

export default MandiPage;