// src/controllers/advisoryController.js

// @desc    JalRakshak & FarmShield - Real Weather & Rule Based Advisory
// @route   POST /api/advisory/smart-plan
export const getSmartAdvisory = async (req, res) => {
    try {
        // Farmer input and location
        const { lat, lng, crop, providedSoilMoisture } = req.body;

        if (!lat || !lng) {
            return res.status(400).json({ success: false, message: 'Latitude and Longitude are required' });
        }

        // If the farmer doesn't have a sensor, we'll assume a default of 45% for logic testing
        const soilMoisture = providedSoilMoisture || 45; 
        const apiKey = process.env.WEATHER_API_KEY;

        // We are calling the "Forecast" API, not the current weather, to get the Rain Probability
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch weather forecast');
        }

        // Real Data Extraction (Forecast for the next 3 hours)
        const currentForecast = data.list[0];
        const temp = currentForecast.main.temp;
        const humidity = currentForecast.main.humidity;
        const rainProbability = currentForecast.pop * 100; // 'pop' is Probability of Precipitation (0 to 1)

        // ==========================================
        // 🧠 IMPLEMENTING RULES EXACTLY FROM YOUR PDF (Screenshot 3)
        // ==========================================
        
        let irrigationRecommendation = "Conditions are normal. Monitor soil moisture.";
        let warnings = [];

        // Rule 1: Do not irrigate (JalRakshak)
        if (rainProbability > 70 && soilMoisture > 50) {
            irrigationRecommendation = "Do not irrigate today. High chance of rain and sufficient soil moisture.";
        }
        
        // Rule 2: Irrigate today (JalRakshak)
        if (soilMoisture < 30 && rainProbability < 30) {
            irrigationRecommendation = "Irrigate today. Low soil moisture and no rain expected.";
        }

        // Rule 3: Fungal Risk (FarmShield)
        if (humidity > 80 && rainProbability > 60) {
            warnings.push("High fungal-risk conditions detected. Consider preventive fungicidal spray.");
        }

        // Rule 4: Water Stress (FarmShield)
        if (temp > 35 && soilMoisture < 30) {
            warnings.push("Extreme Water Stress Warning. High temperature and dry soil can damage crops.");
        }

        // Rule 5: When danger is detected (inside advisoryController.js)
if (warnings.length > 0) {
    console.log(`\n🚨 [SMS TRIGGERED TO ${req.user?.phone || 'FARMER'}]`);
    console.log(`💬 Message: "Farmer, there is a danger in your field. Please check the app."\n`);
}

        // Final Response Setup
        res.status(200).json({
            success: true,
            realTimeData: {
                location: data.city.name,
                temperature: `${temp} °C`,
                humidity: `${humidity}%`,
                rainProbability: `${rainProbability}%`,
                soilMoisture: `${soilMoisture}% (Input/Assumed)`
            },
            jalRakshak: {
                action: irrigationRecommendation
            },
            farmShield: {
                riskLevel: warnings.length > 0 ? "High" : "Low",
                alerts: warnings.length > 0 ? warnings : ["No immediate risks detected."]
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};