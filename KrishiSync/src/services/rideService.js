/**
 * Agri-Pool Transport Ride Sharing Service Layer
 * 
 * Data Interface:
 * {
 *   id: string,                 // e.g. 'ride_101'
 *   farmerName: string,         // e.g. 'Farmer Suresh Kumar'
 *   phone: string,              // e.g. '+91 98765 43210'
 *   destination: string,        // e.g. 'Azadpur Mandi, Delhi NCR'
 *   availableCapacity: number,  // e.g. 500 (in kg)
 *   location: string,           // e.g. 'Karnal Sector 4'
 *   vehicle: string,            // e.g. 'Mahindra Bolero Pickup'
 *   departureTime: string,      // e.g. 'Today, 4:00 PM'
 *   pricePerKg: string,         // e.g. '₹1.5 / kg'
 *   verified: boolean,          // true | false
 * }
 * 
 * Ready for Member 2 to integrate Google Maps / Leaflet Routing and Member 3 for backend endpoints.
 */

export const rideService = {
  /**
   * Get list of available transport pool rides.
   * @param {string} destinationFilter 
   * @returns {Promise<Array<object>>}
   */
  getAvailableRides: async (destinationFilter = '') => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const rides = [
          {
            id: 'ride_101',
            farmerName: 'Farmer Suresh Kumar',
            phone: '+91 98765 43210',
            destination: 'Azadpur Mandi, Delhi NCR',
            availableCapacity: 500,
            location: 'Karnal Sector 4',
            vehicle: 'Mahindra Bolero Pickup',
            departureTime: 'Today, 4:00 PM',
            pricePerKg: '₹1.5 / kg',
            verified: true,
          },
          {
            id: 'ride_102',
            farmerName: 'Farmer Rajesh Patel',
            phone: '+91 98123 76543',
            destination: 'Pune APMC Market',
            availableCapacity: 1200,
            location: 'Shirur Village',
            vehicle: 'Eicher 380 Tractor Trailer',
            departureTime: 'Tomorrow, 6:00 AM',
            pricePerKg: '₹1.2 / kg',
            verified: true,
          },
          {
            id: 'ride_103',
            farmerName: 'Farmer Anita Devi',
            phone: '+91 97654 32109',
            destination: 'Jaipur Grain Market',
            availableCapacity: 350,
            location: 'Chomu Hub',
            vehicle: 'Tata Ace Gold',
            departureTime: 'Today, 7:30 PM',
            pricePerKg: '₹1.8 / kg',
            verified: true,
          },
        ];

        if (destinationFilter) {
          resolve(rides.filter((r) => r.destination.toLowerCase().includes(destinationFilter.toLowerCase())));
        } else {
          resolve(rides);
        }
      }, 400);
    });
  },

  /**
   * Book space on an available transport pool ride.
   * @param {string} rideId 
   * @param {number} requestedKg 
   * @returns {Promise<{ success: boolean, message: string }>}
   */
  bookRideSpace: async (rideId, requestedKg = 100) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: `Booking request for ${requestedKg} kg sent to farmer!`,
        });
      }, 600);
    });
  },
};
