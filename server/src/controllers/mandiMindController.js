// src/controllers/mandiMindController.js

// 🌍 Helper: Real GPS Haversine Formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return parseFloat((R * c).toFixed(2)); 
};

// 📍 NEW HELPER: Fetch REAL GPS coordinates from OpenStreetMap API (Free, No Key required)
const getRealCoordinates = async (marketName, districtName) => {
    try {
        // Search query for the API
        const query = `${marketName}, ${districtName}, West Bengal, India`;
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
        
        const response = await fetch(url, {
            headers: { 'User-Agent': 'KrishiSync-Hackathon-App' } // Required by Nominatim
        });
        const data = await response.json();

        if (data && data.length > 0) {
            return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        }
        return null;
    } catch (error) {
        console.error("Geocoding Error:", error.message);
        return null;
    }
};

// @desc    MandiMind - Find best mandi based on 100% Real Net Revenue
// @route   POST /api/mandimind/analyze
export const analyzeBestMandi = async (req, res) => {
    try {
        const { crop, quantity, lat, lng } = req.body; 

        if (!crop || !quantity || !lat || !lng) {
            return res.status(400).json({ success: false, message: 'Crop, quantity, lat, and lng are required' });
        }

        const apiKey = process.env.MANDI_API_KEY;
        // 1. Fetch REAL Prices from Govt of India
        const govtUrl = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json&filters[state]=West Bengal&filters[commodity]=${crop}`;
        
        const govtResponse = await fetch(govtUrl);
        const govtData = await govtResponse.json();

        if (!govtResponse.ok || !govtData.records || govtData.records.length === 0) {
            return res.status(404).json({ success: false, message: 'No real data found for this crop today.' });
        }

        // Govt data me bahot saari mandiyan aayengi. Geocoding API ko block hone se bachane ke liye hum sirf Top 5 Highest Price wali mandiyon ka distance check karenge
        const sortedByPrice = govtData.records.sort((a, b) => b.modal_price - a.modal_price).slice(0, 5);

        const transportRatePerKm = 25; // ₹25 per km
        let finalOptions = [];

        // 2. Loop through top markets and fetch REAL locations
        for (const record of sortedByPrice) {
            const coords = await getRealCoordinates(record.market, record.district);
            
            if (coords) {
                // 3. Real Distance Calculation
                const distance = calculateDistance(lat, lng, coords.lat, coords.lng);
                const transportCost = distance * transportRatePerKm;
                const sellingRevenue = record.modal_price * quantity;
                const netRevenue = sellingRevenue - transportCost;

                finalOptions.push({
                    district: record.district,
                    market: record.market,
                    realCoordinates: coords, // Exposing real fetched coords to prove it's not mock
                    pricePerQuintal: `₹${record.modal_price}`,
                    distance: `${distance} km`,
                    transportCost: `₹${transportCost.toFixed(2)}`,
                    sellingRevenue: `₹${sellingRevenue}`,
                    netRevenue: netRevenue > 0 ? netRevenue : 0
                });
            }
        }

        // 4. Sort by Best NET REVENUE (taking transport cost into account)
        finalOptions.sort((a, b) => b.netRevenue - a.netRevenue);

        // Formatting currency for UI
        const formattedOptions = finalOptions.map(m => ({
            ...m,
            netRevenue: `₹${m.netRevenue.toFixed(2)}`
        }));

        res.status(200).json({
            success: true,
            totalAnalyzed: formattedOptions.length,
            recommendedMandi: formattedOptions[0] || null, 
            otherOptions: formattedOptions.slice(1)
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};