// @desc    Get REAL weather data from OpenWeatherMap
// @route   GET /api/data/weather?lat=22.57&lng=88.36
export const getWeather = async (req, res) => {
    try {
        const { lat, lng } = req.query;

        // Validation
        if (!lat || !lng) {
            return res.status(400).json({ success: false, message: 'Latitude and Longitude are required' });
        }

        const apiKey = process.env.WEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;

        const response = await fetch(url);
        const data = await response.json();

        // Check if API threw an error
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch weather data');
        }

        // Clean data format frontend ke liye
        const weatherData = {
            location: data.name,
            temperature: `${data.main.temp} °C`,
            condition: data.weather[0].main,
            description: data.weather[0].description,
            humidity: `${data.main.humidity}%`,
            windSpeed: `${(data.wind.speed * 3.6).toFixed(2)} km/h`, 
        };

        res.status(200).json({ success: true, data: weatherData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get REAL Mandi prices from Govt of India API (data.gov.in)
// @route   GET /api/data/mandi?state=West Bengal
export const getMandiPrices = async (req, res) => {
    try {
        const { state } = req.query;
        // Defaulting to West Bengal context unless frontend specifies otherwise
        const searchState = state || 'West Bengal'; 

        const apiKey = process.env.MANDI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ success: false, message: 'Mandi API key is missing in .env' });
        }

        // Real Government API Endpoint for Daily Mandi Prices
        const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json&filters[state]=${searchState}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error('Failed to fetch real Mandi data');
        }

        // Govt API bahot lamba data deti hai, humein sirf useful details filter karni hain
        const mandiData = data.records.map(record => ({
            crop: record.commodity,
            market: record.market,
            minPrice: `₹${record.min_price}`,
            maxPrice: `₹${record.max_price}`,
            modalPrice: `₹${record.modal_price}`,
            updateDate: record.arrival_date
        }));

        res.status(200).json({ success: true, count: mandiData.length, data: mandiData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};