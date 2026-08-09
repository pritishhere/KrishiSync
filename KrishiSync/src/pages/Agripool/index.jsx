import React, { useState, useEffect } from 'react';
import { Map, Truck, Phone, User, ShieldCheck, Scale, MapPin, Sparkles, PlusCircle } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import { rideService } from '../../services/rideService';

export const AgriPoolPage = () => {
  const [rides, setRides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('find'); // 'find' or 'publish'

  // Default coords for fetching nearby rides (Kolkata Agro Zone)
  const userCoords = { lat: 22.5726, lng: 88.3639 };

  useEffect(() => {
    const fetchRides = async () => {
      setIsLoading(true);
      setError('');
      try {
        const availableRides = await rideService.getAvailableRides(userCoords);
        setRides(availableRides);
      } catch (err) {
        setError(err.message || 'Failed to load nearby rides. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    };

    if (view === 'find') {
      fetchRides();
    }
  }, [view]);

  const handleBookRide = async (rideId, farmerName) => {
    // This is a simulated booking as per rideService.js
    const result = await rideService.bookRideSpace(rideId);
    alert(result.message); // Using alert for simplicity, can be replaced with a toast notification
  };

  const renderRideCard = (ride) => (
    <div
      key={ride.id}
      className="ks-card ks-appear p-4 space-y-3 relative overflow-hidden"
    >
      {ride.verified && (
        <div className="absolute top-0 right-0 bg-[#2d5a27] text-white text-[10px] font-extrabold font-heading px-3 py-1 rounded-bl-md uppercase tracking-wider shadow-sm flex items-center gap-1">
          <ShieldCheck size={12} /> Verified Driver
        </div>
      )}
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-lg font-extrabold font-heading text-[#1F2937] leading-snug flex items-center gap-2">
            <User size={16} className="text-emerald-700" />
            {ride.farmerName}
          </h4>
          <p className="text-xs font-semibold text-gray-500 flex items-center gap-1 mt-1">
            <MapPin size={13} className="text-gray-400" />
            From: {ride.location}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-gray-500">Eco-Coins</span>
          <p className="font-extrabold text-emerald-600 font-heading text-sm flex items-center gap-1 justify-end">
            <Sparkles size={14} className="text-amber-500" /> {ride.ownerCoins}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 bg-[#f9f8f6] p-3 rounded-md border border-[#e2dcd0] text-xs">
        <div className="space-y-0.5">
          <span className="text-gray-500 font-medium flex items-center gap-1"><Scale size={12} /> Capacity</span>
          <strong className="text-gray-900 text-sm font-heading font-extrabold block">{ride.availableCapacity} kg</strong>
        </div>
        <div className="space-y-0.5">
          <span className="text-gray-500 font-medium flex items-center gap-1"><Truck size={12} /> Distance</span>
          <strong className="text-gray-900 text-sm font-heading font-extrabold block">{ride.distanceKm}</strong>
        </div>
        <div className="space-y-0.5 col-span-2">
          <span className="text-gray-500 font-medium flex items-center gap-1"><Map size={12} /> Destination</span>
          <strong className="text-gray-900 text-sm font-heading font-extrabold block">{ride.destination}</strong>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <a href={`tel:${ride.phone}`} className="flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-600 transition-colors">
          <Phone size={16} />
          <span>Call Driver</span>
        </a>
        <Button onClick={() => handleBookRide(ride.id, ride.farmerName)} variant="primary" className="text-sm py-2 px-4">
          Book Space
        </Button>
      </div>
    </div>
  );

  const renderFindView = () => (
    <>
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="ks-card p-4 space-y-3 border border-gray-200 animate-pulse">
              <div className="flex justify-between"><div className="h-5 bg-gray-200 rounded w-1/2"></div><div className="h-5 bg-gray-200 rounded w-1/4"></div></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="grid grid-cols-2 gap-3 pt-2"><div className="h-10 bg-gray-200 rounded-lg"></div><div className="h-10 bg-gray-200 rounded-lg"></div></div>
              <div className="flex justify-between pt-3 border-t border-gray-100 mt-2"><div className="h-8 bg-gray-200 rounded w-1/3"></div><div className="h-8 bg-gray-200 rounded-lg w-1/3"></div></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm font-semibold text-red-600">Error: {error}</div>
      ) : rides.length > 0 ? (
        <div className="space-y-4">{rides.map(renderRideCard)}</div>
      ) : (
        <div className="ks-card p-8 text-center border border-[#e2dcd0] rounded-md shadow-sm">
          <div className="w-16 h-16 bg-[#e8e0d5] rounded-md flex items-center justify-center text-[#2d5a27] mx-auto mb-3 border border-[#e2dcd0]"><Truck size={32} /></div>
          <h3 className="text-lg font-bold text-gray-900 font-heading">No Rides Found Nearby</h3>
          <p className="text-sm text-gray-500 mt-1">There are currently no available rides in your area. You can be the first to publish one!</p>
        </div>
      )}
    </>
  );

  const renderPublishView = () => (
    <div className="ks-card p-5 space-y-4">
        <h3 className="text-lg font-extrabold font-heading text-gray-800">Publish Your Ride</h3>
        <p className="text-sm text-gray-600">Help fellow farmers and earn by sharing your tractor or vehicle's empty space.</p>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
                <label htmlFor="capacity" className="block text-sm font-bold text-gray-700 mb-1 font-heading">Available Capacity (in KG)</label>
                <input type="number" id="capacity" placeholder="e.g., 500" className="w-full bg-[#f9f8f6] border border-[#e2dcd0] text-gray-900 font-bold rounded-md p-3 outline-none focus:border-[#2d5a27] focus-visible:ring-2 focus-visible:ring-[#2d5a27] shadow-sm" />
            </div>
            <div>
                <label htmlFor="destination" className="block text-sm font-bold text-gray-700 mb-1 font-heading">Destination Mandi</label>
                <input type="text" id="destination" placeholder="e.g., Sealdah Koley Market" className="w-full bg-[#f9f8f6] border border-[#e2dcd0] text-gray-900 font-bold rounded-md p-3 outline-none focus:border-[#2d5a27] focus-visible:ring-2 focus-visible:ring-[#2d5a27] shadow-sm" />
            </div>
            <Button type="submit" variant="primary" fullWidth className="text-base flex items-center justify-center gap-2">
                <PlusCircle size={18} />
                Publish Ride (Coming Soon)
            </Button>
        </form>
        <p className="text-xs text-center text-gray-500 pt-2 border-t border-gray-100">Your location will be automatically detected. Your ride will be visible to nearby farmers.</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#f9f8f6] font-body">
      <PageHeader title="Agri-Pool Transport" showBack={false} />

      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-8">
        <div className="relative rounded-md overflow-hidden shadow-sm border border-[#e2dcd0] h-48 bg-[#2d5a27] flex items-center justify-center text-[#e8e0d5]/80 flex-col p-4 text-center">
            <Map size={48} className="opacity-20"/>
            <p className="font-bold mt-2 text-white">Live Map of Nearby Rides</p>
            <span className="text-xs text-[#e8e0d5]">(Map Integration Coming Soon)</span>
        </div>

        <div className="grid grid-cols-2 gap-2 bg-[#e8e0d5] p-1 rounded-md border border-[#e2dcd0]">
            <button onClick={() => setView('find')} className={`py-2 px-4 rounded-md text-sm font-bold transition-all ${view === 'find' ? 'bg-white text-[#2d5a27] shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>Find a Ride</button>
            <button onClick={() => setView('publish')} className={`py-2 px-4 rounded-md text-sm font-bold transition-all ${view === 'publish' ? 'bg-white text-[#2d5a27] shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>Publish a Ride</button>
        </div>

        {view === 'find' ? renderFindView() : renderPublishView()}
      </div>
    </div>
  );
};

export default AgriPoolPage;