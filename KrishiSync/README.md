<div align="center">

# KrishiSync
**Empowering farmers with real-time AI agronomy, geospatial market intelligence, and smart diagnostics.**

[![Live Web App](https://img.shields.io/badge/Live%20Web%20App-krishisync--frontend.onrender.com-brightgreen?style=for-the-badge&logo=render)](https://krishisync-frontend.onrender.com)
[![Backend API](https://img.shields.io/badge/Backend%20API-krishisync--9k1s.onrender.com-blue?style=for-the-badge&logo=render)](https://krishisync-9k1s.onrender.com)

![Hackathon Project](https://img.shields.io/badge/Hackathon-Project-brightgreen?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=Leaflet&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### 🌐 Live Deployment
- **Frontend App:** [https://krishisync-frontend.onrender.com](https://krishisync-frontend.onrender.com)
- **Backend API:** [https://krishisync-9k1s.onrender.com](https://krishisync-9k1s.onrender.com)

</div>

---

## 🚨 The Problem

Small and marginal farmers face unpredictable yields due to poor access to real-time crop-health monitoring, inefficient water and fertilizer use, and generic (non-hyperlocal) weather advisories. Many also lose income to middlemen because they lack visibility into real-time mandi (market) prices when deciding where and when to sell their produce.

## 💡 The Solution

**KrishiSync** is a smart advisory platform designed specifically for smallholder farmers. It combines image diagnostics, AI-driven insights, and geospatial data to provide real-time, hyperlocal recommendations on irrigation, fertilization, and pest control. By integrating live mandi price comparisons and offline-capable advisory channels, KrishiSync bridges the information gap, ensuring farmers achieve higher yields and fair market compensation.

---

## ✨ Key Features

- **🗣️ Voice-Activated AI Agronomist**  
  Integrated with the Google Gemini SDK and the browser's native Web Speech API. Farmers can speak their queries directly to the platform and receive localized, expert advice in real-time, bypassing literacy barriers.

- **📍 Interactive Geospatial Mandi Locator**  
  Uses `react-leaflet` and HTML5 Geolocation to render an interactive map of nearby crop markets. It calculates distances via the Haversine formula and fetches dynamic crop prices and transport costs to provide farmers with accurate profit estimations before they leave the farm.

- **🔬 Real-Time Plant.id Diagnostics**  
  Features a modern drag-and-drop (`react-dropzone`) image scanner wired to the official Plant.id computer vision API. It detects crop diseases from uploaded leaf photos and suggests targeted organic or chemical remedies instantly.

- **💧 Smart Irrigation Alerts**  
  Provides weather and soil-based water management advisories to optimize resource usage and prevent crop stress.

- **📱 Omnichannel PWA & Twilio Bot (Demo)**  
  Operates as an offline-capable Progressive Web App with SMS/WhatsApp bot integrations tailored for 2G network areas. *(Note: This is currently a demo feature due to Twilio premium constraints).*

---

## 🛠️ Tech Stack Breakdown

- **Frontend:** React.js, Vite, Tailwind CSS, React-Leaflet, React-Dropzone, Lucide Icons
- **Backend:** Node.js, Express.js, Multer *(for image parsing)*
- **Database:** MongoDB / Mongoose
- **APIs & Integrations:** Google Gemini API, Plant.id API, Twilio API, Web Speech API, Geolocation API

---

## 🚀 Local Setup & Installation

Follow these steps to get KrishiSync running on your local machine.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/krishisync.git
cd krishisync
```

### 2. Install Dependencies
You need to install dependencies for both the client (React) and the server (Node.js).

```bash
# Install client dependencies
cd KrishiSync
npm install

# Install server dependencies
cd ../server
npm install
cd ..
```

### 3. Environment Variables
Create a `.env` file in the `/server` directory and add the following required keys:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
PLANT_ID_API_KEY=your_plant_id_api_key
# Optional: Twilio credentials for the demo bot
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
```

### 4. Run the Development Servers
Start both the Vite frontend and the Express backend concurrently. You can open two separate terminals.

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd KrishiSync
npm run dev
```

Your app should now be running locally at `http://localhost:5173`.

---
<div align="center">
<i>Built with ❤️ for Indian Farmers.</i>
</div>
