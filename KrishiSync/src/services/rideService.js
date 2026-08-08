/**
 * KrishiSync Agri-Pool Ride Service (Backend-Connected)
 * Consumes POST /api/rides, GET /api/rides/nearby, PUT /api/rides/:id/complete.
 */
import { apiFetch } from './apiConfig';

export const rideService = {
  /**
   * Find nearby available rides.
   * @param {{lng:number, lat:number, distance?:number}} coords
   */
  getAvailableRides: async (coords = { lng: 88.3639, lat: 22.5726, distance: 50 }) => {
    const { lng, lat, distance } = coords;
    const data = await apiFetch(`/api/rides/nearby?lng=${lng}&lat=${lat}&distance=${distance || 50}`);
    if (!data || !data.success) {
      throw new Error(data?.message || 'Failed to load nearby rides');
    }

    // Normalize backend ride objects into the UI's expected shape
    return (data.data || []).map((ride) => {
      const driver = ride.driverId || {};
      const [lon, la] = ride.startLocation?.coordinates || [lng, lat];
      return {
        id: ride._id,
        farmerName: driver.fullName || driver.name || 'Farmer',
        phone: driver.phone || '+91 Unknown',
        availableCapacity: ride.availableCapacity,
        distanceKm: ride.distance ? `${ride.distance} km` : 'Nearby',
        location: driver.farmLocation?.address || `Lat ${la?.toFixed?.(2) || la}, Lng ${lon?.toFixed?.(2) || lon}`,
        destination: 'Nearest Mandi / Farm Hub',
        departureTime: 'Flexible',
        pricePerKg: 'Shared',
        verified: Boolean(driver.isVerified),
        ownerCoins: driver.ecoPoints || 0,
      };
    });
  },

  /**
   * Create/publish a new ride (tractor owner).
   * @param {{longitude, latitude, availableCapacity}} ride
   */
  createRide: async ({ longitude, latitude, availableCapacity }) => {
    const data = await apiFetch('/api/rides', {
      method: 'POST',
      body: { longitude, latitude, availableCapacity },
    });
    return data;
  },

  /**
   * Complete a ride and receive gamification (Krishi Coins / CO2 saved).
   * @param {string} rideId
   */
  completeRide: async (rideId) => {
    const data = await apiFetch(`/api/rides/${rideId}/complete`, {
      method: 'PUT',
    });
    return data;
  },

  /**
   * Book space on a ride - backend doesn't have this endpoint;
   * we simulate a friendly confirmation until a booking API exists.
   */
  bookRideSpace: async (rideId, requestedKg = 100) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: `Booking request for ${requestedKg} kg sent to farmer!`,
        });
      }, 400);
    });
  },
};

export default rideService;
