// src/controllers/voiceController.js
import { GoogleGenerativeAI } from '@google/generative-ai';

// @desc    Hybrid Voice Assistant: Routes to Real APIs (Weather/Mandi) OR Gemini AI
// @route   POST /api/voice/ask
export const processVoiceQuery = async (req, res) => {
    try {
        const { text, lat, lng, lang = 'hi' } = req.body; 

        if (!text) {
            return res.status(400).json({ success: false, message: 'Voice text is required' });
        }

        const query = text.toLowerCase();
        let responseText = "";
        let answeredBy = ""; // To inform the frontend about the answer's source

        // 🧠 Intent 1: Irrigation / Weather (Keywords in English, Hindi & Bengali)
        const weatherKeywords = ['water', 'irrigate', 'pani', 'sinchai', 'rain', 'barish', 'jol', 'bristi', 'sech', 'জল', 'বৃষ্টি', 'সেচ'];
        const isWeatherQuery = weatherKeywords.some(kw => query.includes(kw));

        // 🧠 Intent 2: Mandi / Prices
        const mandiKeywords = ['price', 'mandi', 'daam', 'bechu', 'rate', 'dam', 'dor', 'bazar', 'bikri', 'দাম', 'দর', 'বাজার'];
        const isMandiQuery = mandiKeywords.some(kw => query.includes(kw));

        if (isWeatherQuery && lat && lng) {
            // ---> REAL API ROUTE (Weather)
            const apiKey = process.env.WEATHER_API_KEY;
            const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;
            const response = await fetch(url);
            
            if (response.ok) {
                const data = await response.json();
                const rainProbability = data.list[0].pop * 100;
                
                if (rainProbability > 50) {
                    const rainResponses = {
                        hi: `Kripya aaj khet mein pani na dein. Agle kuch ghanto mein barish hone ki ${rainProbability}% sambhavna hai.`,
                        bn: `Anugraha kore aaj khete jol deben na. Agami koyek ghontay bristi howar ${rainProbability}% sombhabona ache.`,
                        en: `Please do not irrigate today. There is a ${rainProbability}% chance of rain.`
                    };
                    responseText = rainResponses[lang] || rainResponses['hi'];
                } else {
                    const noRainResponses = {
                        hi: `Aap aaj khet mein pani de sakte hain. Mausam saaf rahega.`,
                        bn: `Apni aaj khete jol dite paren. Abaohawa porishkar thakbe.`,
                        en: `You can irrigate today. The weather will be clear.`
                    };
                    responseText = noRainResponses[lang] || noRainResponses['hi'];
                }
            } else {
                responseText = "Weather system down. Trying AI..."; // Fallback mechanism
            }
            answeredBy = "Krishi-App-System";
        } 
        
        else if (isMandiQuery) {
            // ---> APP FEATURE ROUTE (Mandi)
            const mandiResponses = {
                hi: "Fasal bechne ka sabse sahi daam jaan-ne ke liye, kripya app mein Mandi Mind feature kholen.",
                bn: "Fosol bikrir sothik dam jante, anugraha kore app e Mandi Mind feature ti khulun.",
                en: "To know the best selling price, please open the Mandi Mind feature in the app."
            };
            responseText = mandiResponses[lang] || mandiResponses['hi'];
            answeredBy = "Krishi-App-System";
        } 
        
        else {
            // ---> THE MAGIC: FALLBACK TO GEMINI AI
            // If the query is not about weather or mandi (e.g., "Why are potato leaves turning yellow?")
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const systemInstruction = `
            You are 'Krishi-AI', a smart agricultural expert assistant for the KrishiSync app. 
            Rules:
            1. Keep answers short, strictly under 3 sentences.
            2. Reply STRICTLY in this language code: '${lang}' ('hi'=Hindi, 'bn'=Bengali, 'en'=English). 
            3. Only answer farming, crop, and agriculture-related questions.
            `;

            const finalPrompt = `${systemInstruction}\n\nFarmer asks: "${text}"`;
            const result = await model.generateContent(finalPrompt);
            
            responseText = result.response.text();
            answeredBy = "Krishi-Gemini-AI";
        }

        res.status(200).json({
            success: true,
            language: lang,
            answeredBy: answeredBy,
            receivedQuery: text,
            reply: responseText
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};