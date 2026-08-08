import AgriPoolRide from '../models/AgriPoolRide.js';

// @desc    Tractor Owner naya ride create karega
// @route   POST /api/rides
export const createRide = async (req, res) => {
    try {
        const { longitude, latitude, availableCapacity } = req.body;

        const ride = await AgriPoolRide.create({
            driverId: req.user._id, // Ye protect middleware se aayega
            startLocation: {
                type: 'Point',
                coordinates: [longitude, latitude] // Dhyan rakhna pehle Lng, fir Lat aata hai MongoDB mein
            },
            availableCapacity
        });

        res.status(201).json({ success: true, data: ride });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Farmer apne aas-paas (e.g., 5km) ki rides dhoondhega
// @route   GET /api/rides/nearby?lng=88.36&lat=22.57&distance=5
export const findNearbyRides = async (req, res) => {
    try {
        const { lng, lat, distance } = req.query; 

        if (!lng || !lat) {
            return res.status(400).json({ success: false, message: 'Please provide longitude and latitude' });
        }

        const maxDistanceInMeters = (distance || 5) * 1000; // Default 5km radius

        const rides = await AgriPoolRide.find({
            startLocation: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: maxDistanceInMeters
                }
            },
            status: 'OPEN'
        }).populate('driverId', 'fullName phone ecoPoints'); // Driver ki details bhi sath bhejenge

        res.status(200).json({ success: true, count: rides.length, data: rides });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Complete a ride and award Krishi-Coins & Calculate Carbon Saved
// @route   PUT /api/rides/:id/complete
export const completeRide = async (req, res) => {
    try {
        const ride = await AgriPoolRide.findById(req.params.id);

        if (!ride) {
            return res.status(404).json({ success: false, message: 'Ride not found' });
        }

        if (ride.status === 'COMPLETED') {
            return res.status(400).json({ success: false, message: 'Ride is already completed' });
        }

        ride.status = 'COMPLETED';
        await ride.save();

        // Magic: Carbon Calculation & Gamification
        // Assuming average ride saves 10 km of tractor driving. 
        // 1 km tractor driving = ~0.6 kg CO2 emission.
        const co2Saved = 10 * 0.6; 
        const earnedPoints = 50; // 50 Krishi Coins

        // Add points to the User
        const user = await req.user.constructor.findById(ride.driverId);
        user.ecoPoints += earnedPoints;
        await user.save();

        res.status(200).json({ 
            success: true, 
            message: 'Ride completed successfully!',
            gamification: {
                co2SavedKg: co2Saved,
                krishiCoinsEarned: earnedPoints,
                totalCoins: user.ecoPoints,
                badge: user.ecoPoints > 200 ? "🌱 Green Farmer" : "🚜 Smart Farmer"
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};