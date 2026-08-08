import React, { useState } from 'react';
import { Tractor, MapPin, Navigation, UserCheck, PlusCircle, Search, PhoneCall, ShieldCheck, Truck } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';

export const AgriPoolPage = () => {
  const [activeTab, setActiveTab] = useState('find'); // 'find' | 'offer'
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  // Mock Transport Ride Pool Data
  const rides = [
    {
      id: 1,
      farmerName: 'Farmer Suresh Kumar',
      phone: '+91 98765 43210',
      destination: 'Azadpur Mandi, Delhi NCR',
      spaceKg: 500,
      vehicle: 'Mahindra Bolero Pickup',
      departureTime: 'Today, 4:00 PM',
      fromLocation: 'Karnal Sector 4',
      pricePerKg: '₹1.5 / kg',
      verified: true,
    },
    {
      id: 2,
      farmerName: 'Farmer Rajesh Patel',
      phone: '+91 98123 76543',
      destination: 'Pune APMC Market',
      spaceKg: 1200,
      vehicle: 'Eicher 380 Tractor Trailer',
      departureTime: 'Tomorrow, 6:00 AM',
      fromLocation: 'Shirur Village',
      pricePerKg: '₹1.2 / kg',
      verified: true,
    },
    {
      id: 3,
      farmerName: 'Farmer Anita Devi',
      phone: '+91 97654 32109',
      destination: 'Jaipur Grain Market',
      spaceKg: 350,
      vehicle: 'Tata Ace Gold',
      departureTime: 'Today, 7:30 PM',
      fromLocation: 'Chomu Hub',
      pricePerKg: '₹1.8 / kg',
      verified: true,
    },
  ];

  const handleBookRide = (farmerName) => {
    setBookingSuccess(`Ride request sent to ${farmerName}! They will contact you shortly.`);
    setTimeout(() => {
      setBookingSuccess('');
    }, 4000);
  };

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB] font-body relative">
      <PageHeader title="Agri-Pool Transport Sharing" showBack={false} />

      <div className="flex-1 overflow-y-auto pb-8 space-y-4 p-4">
        {/* Actions Bar: Find a Ride vs Offer a Ride */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-200 shadow-xs font-heading">
          <button
            onClick={() => setActiveTab('find')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-[13px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'find'
                ? 'bg-[#2E7D32] text-white shadow-xs'
                : 'bg-transparent text-[#6B7280] hover:bg-gray-100'
            }`}
          >
            <Search size={16} />
            Find a Ride
          </button>

          <button
            onClick={() => setActiveTab('offer')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-[13px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'offer'
                ? 'bg-[#F57C00] text-white shadow-xs'
                : 'bg-transparent text-[#6B7280] hover:bg-gray-100'
            }`}
          >
            <PlusCircle size={16} />
            Offer a Ride
          </button>
        </div>

        {/* MAP AREA PLACEHOLDER */}
        <div className="w-full h-[180px] bg-emerald-900 rounded-2xl border-2 border-emerald-950 shadow-xs relative overflow-hidden flex flex-col justify-between p-4 text-white">
          {/* Map Grid Graphic Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#2E7D32_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

          {/* Top Row: Map Badges */}
          <div className="flex items-center justify-between relative z-10">
            <span className="bg-[#2E7D32] text-[#D8FF36] text-[11px] font-bold font-heading px-2.5 py-0.5 rounded-full border border-emerald-700 flex items-center gap-1">
              <Navigation size={12} className="animate-spin-slow" />
              Live Sector Map
            </span>
            <span className="bg-black/40 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-white/20">
              Radius: 25 km
            </span>
          </div>

          {/* Simulated Map Pins Visual */}
          <div className="relative z-10 flex items-center justify-around my-2">
            <div className="flex flex-col items-center animate-bounce">
              <div className="bg-[#F57C00] text-white p-1.5 rounded-full shadow-md border border-white">
                <Tractor size={18} />
              </div>
              <span className="text-[10px] font-extrabold bg-black/70 px-1.5 py-0.5 rounded-md mt-0.5">Suresh (500kg)</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-[#2E7D32] text-white p-1.5 rounded-full shadow-md border border-white">
                <Truck size={18} />
              </div>
              <span className="text-[10px] font-extrabold bg-black/70 px-1.5 py-0.5 rounded-md mt-0.5">Rajesh (1200kg)</span>
            </div>
          </div>

          {/* Map Bottom Information */}
          <p className="text-[11px] font-medium text-emerald-100 relative z-10 flex items-center gap-1">
            <MapPin size={13} className="text-[#F57C00]" /> 3 Active transport pools in your farming hub
          </p>
        </div>

        {/* Booking Notification Banner */}
        {bookingSuccess && (
          <div className="bg-emerald-50 text-[#2E7D32] border border-emerald-200 p-3 rounded-xl text-[13px] font-bold flex items-center gap-2 animate-fade-in">
            <UserCheck size={18} />
            <span>{bookingSuccess}</span>
          </div>
        )}

        {/* BOTTOM-SHEET STYLE RIDE LIST */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[17px] font-bold font-heading text-[#1F2937] flex items-center gap-1.5">
              Available Transport Pools
            </h3>
            <span className="text-[12px] font-semibold text-[#2E7D32] bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
              Shared Freight
            </span>
          </div>

          {/* RIDE CARDS */}
          {rides.map((ride) => (
            <div
              key={ride.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-xs p-4 space-y-3 hover:border-[#2E7D32] transition-all"
            >
              {/* Header: Farmer Name & Verification */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-[17px] font-extrabold font-heading text-[#1F2937]">
                      {ride.farmerName}
                    </h4>
                    {ride.verified && (
                      <ShieldCheck size={16} className="text-[#10B981]" title="Verified Farmer" />
                    )}
                  </div>
                  <p className="text-[12px] font-semibold text-[#6B7280]">
                    {ride.vehicle} • {ride.fromLocation}
                  </p>
                </div>

                <span className="bg-emerald-50 text-[#2E7D32] text-[13px] font-extrabold font-heading px-2.5 py-1 rounded-xl border border-emerald-200">
                  Space: {ride.spaceKg} kg
                </span>
              </div>

              {/* Destination & Departure info */}
              <div className="bg-[#F9FAFB] p-3 rounded-xl border border-gray-200/70 text-[13px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7280] font-medium">Destination:</span>
                  <strong className="text-[#1F2937] font-bold font-heading">{ride.destination}</strong>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[#6B7280]">Departure:</span>
                  <span className="text-[#F57C00] font-bold">{ride.departureTime}</span>
                </div>
              </div>

              {/* Action row */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[12px] font-bold text-[#6B7280]">
                  Rate: <strong className="text-[#1F2937]">{ride.pricePerKg}</strong>
                </span>

                <Button
                  variant="primary"
                  onClick={() => handleBookRide(ride.farmerName)}
                  className="py-1.5 px-4 text-[13px] flex items-center gap-1.5"
                >
                  <PhoneCall size={14} />
                  Book Space
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgriPoolPage;
