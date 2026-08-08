# KrishiSync Frontend Integration & Team Blueprint

This document provides a concise, practical blueprint for Members 2, 3, and 4 to integrate backend APIs, maps, authentication, and external services into the KrishiSync frontend codebase.

---

## 1. Application Routes

| Route | Page Component | Purpose | Access Guard |
| :--- | :--- | :--- | :--- |
| `/login` | `src/pages/Login` | OTP Mobile Phone Authentication | Public |
| `/dashboard` | `src/pages/Dashboard` | Weather, Irrigation Recommendation & Quick Actions | Protected |
| `/scanner` | `src/pages/Scanner` | Crop Disease Detection & Treatment Advice | Protected |
| `/mandi` | `src/pages/Mandi` | Market Rates & Net Profit Calculator | Protected |
| `/agri-pool` | `src/pages/Agripool` | Freight & Transport Equipment Sharing | Protected |
| `/bot-guide` | `src/pages/Botguide` | Low-literacy SMS / WhatsApp AI Assistant Guide | Protected |

---

## 2. Key Components Hierarchy

- **Layout**: `src/components/layout/MainContentLayout.jsx` (Constrained 480px mobile-first container).
- **Header**: `src/components/layout/AppHeader.jsx` (Branding, Live status, Language selector).
- **Navigation**: `src/components/navigation/MobileBottomNavigation.jsx` (Sticky bottom tabs).
- **Common UI**: `Button.jsx`, `Card.jsx`, `Typography.jsx`, `Alert.jsx`, `PWAInstallPrompt.jsx`.
- **Feature Modules**:
  - `src/components/dashboard/`: `WeatherCard`, `IrrigationAlert`, `QuickActionGrid`, `DashboardSkeleton`, `DashboardError`.
  - `src/components/scanner/`: `ResultCard`, `ScannerDemoToolbar`.

---

## 3. Context & State Management

- **`AuthContext`** (`src/context/AuthContext.jsx`):
  - Manages session token (`token`), current user (`user`), and authentication state (`isAuthenticated`).
  - Exposes `requestOtp(phone)`, `verifyOtp(phone, otp)`, `login()`, `logout()`.
- **`AppContext`** (`src/context/AppContext.jsx`):
  - Top-level application provider wrapping `AuthProvider`.

---

## 4. Expected API Data Contracts (JSON Schemas)

### A. Weather Data Interface (`weatherService.js`)
```json
{
  "temperature": "28°C",
  "humidity": "72%",
  "condition": "Partly Cloudy",
  "precipitationProbability": "80%",
  "location": "Pune, Maharashtra",
  "tomorrowForecast": "80% Rain expected tomorrow",
  "highLow": "31°C / 22°C",
  "windSpeed": "12 km/h",
  "rainExpected": true
}
```

### B. Scanner Result Data Interface (`scannerService.js`)
```json
{
  "diseaseName": "Late Blight (Phytophthora infestans)",
  "confidence": 98,
  "recommendation": "Remove affected leaves immediately and apply copper-based fungicide every 7–10 days.",
  "isPlant": true,
  "error": null
}
```

### C. Mandi Result Data Interface (`mandiService.js`)
```json
[
  {
    "mandiName": "Azadpur Mandi",
    "distance": 18,
    "transportCost": 450,
    "netProfit": 10925,
    "marketPricePerQtl": 2350,
    "location": "Delhi NCR",
    "isBest": true
  }
]
```

### D. Transport Ride Data Interface (`rideService.js`)
```json
[
  {
    "id": "ride_101",
    "farmerName": "Farmer Suresh Kumar",
    "phone": "+91 98765 43210",
    "destination": "Azadpur Mandi, Delhi NCR",
    "availableCapacity": 500,
    "location": "Karnal Sector 4",
    "vehicle": "Mahindra Bolero Pickup",
    "departureTime": "Today, 4:00 PM",
    "pricePerKg": "₹1.5 / kg",
    "verified": true
  }
]
```

---

## 5. Service Functions Registry (`src/services/`)

All UI components consume business logic via service modules in `src/services/`:

- **`authService.js`**: `requestOtp(phone)`, `verifyOtp(phone, otp)`, `getStoredAuth()`, `logout()`.
- **`weatherService.js`**: `getWeatherData(location)`, `getIrrigationAdvice(rainExpected)`.
- **`scannerService.js`**: `analyzeCropImage(imageDataOrFile)`.
- **`mandiService.js`**: `getCropsList()`, `calculateMandiPrices(cropId, quantityKg)`.
- **`rideService.js`**: `getAvailableRides(destinationFilter)`, `bookRideSpace(rideId, requestedKg)`.
- **`botService.js`**: `getBotCommandsList()`, `getWhatsAppConfig()`.

---

## 6. How Member 2 Can Integrate Maps & GIS

1. Open `src/pages/Agripool/index.jsx` and `src/services/rideService.js`.
2. Replace the visual map placeholder element (`<div className="w-full h-[180px] bg-emerald-900...`>) with Google Maps JavaScript API (`@react-google-maps/api`) or Leaflet.
3. Map ride location coordinates (`latitude`, `longitude`) to dynamic Map Markers.
4. Update `rideService.getAvailableRides()` to perform spatial radius queries against MongoDB geospatial indexes (`$near` / `$geoWithin`).

---

## 7. How Member 3 Can Integrate Auth & Express Backend

1. **Authentication Integration**:
   - Open `src/services/authService.js`.
   - Replace simulated Promises with `axios` or `fetch` calls to backend auth routes:
     - `POST /api/auth/send-otp` -> payload: `{ phone }`
     - `POST /api/auth/verify-otp` -> payload: `{ phone, otp }` -> returns `{ token, user }`.
2. **Mandi & Pricing Integration**:
   - Open `src/services/mandiService.js`.
   - Connect `calculateMandiPrices()` to `GET /api/mandi/prices?crop=:cropId&quantity=:quantityKg`.
3. **Database Integration**:
   - Store users, mandi rates, and ride pools in MongoDB using standard Mongoose models.

---

## 8. How Member 4 Can Integrate Scanner, Weather & Twilio

1. **Plant.id AI Disease Scanner**:
   - Open `src/services/scannerService.js`.
   - Update `analyzeCropImage()` to send base64 or multipart form data to Plant.id API endpoint (`https://api.plant.id/v2/identify` or backend proxy `POST /api/scanner/identify`).
   - Map Plant.id JSON response:
     - `diseaseName` <- `response.suggestions[0].plant_name` / `health_assessment.diseases[0].name`
     - `confidence` <- `Math.round(response.suggestions[0].probability * 100)`
     - `recommendation` <- `response.health_assessment.diseases[0].treatment`
     - `isPlant` <- `response.is_plant`
2. **OpenWeather API Integration**:
   - Open `src/services/weatherService.js`.
   - Connect `getWeatherData()` to OpenWeather 5-day / 3-hour forecast endpoint (`https://api.openweathermap.org/data/2.5/forecast`).
3. **Twilio SMS & WhatsApp Assistant**:
   - Open `src/services/botService.js`.
   - Connect SMS/WhatsApp hotline to Twilio Programmable Messaging Webhook (`POST /api/bot/webhook`).
