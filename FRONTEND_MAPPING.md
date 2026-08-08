# Frontend → Backend Mapping

This document maps UI pages and components to backend endpoints and outlines required service functions.

## Login / Auth (`/login`)
- Page: `src/pages/Login/index.jsx` (already implemented)
- Service: `src/services/authService.js` (requestOtp, verifyOtp, login, register, updateProfile)
- Backend: `/api/auth/*`

## Dashboard (`/dashboard`)
- Page: components under `src/Components/dashboard/`
- Needs: authenticated fetches for user-specific data, recent mandi prices, quick actions

## Mandi Analyzer (`/mandi/analyze`)
- Page: new form to collect `crop`, `quantity`, and geolocation (or use `LocationTracker`)
- Service: `mandiService.analyze({ crop, quantity, lat, lng })` → POST `/api/mandimind/analyze`
- UI: show `recommendedMandi` and `otherOptions` with map/coordinates and export/share

## Advisory (`/advisory/smart-plan`)
- Page: `pages/advisory` to collect `lat,lng,crop,soil` and display `jalRakshak` + `farmShield` results
- Service: `advisoryService.getSmartPlan()` → POST `/api/advisory/smart-plan`

## Disease Scanner
- Component: `Scanner/DiseaseScanner.jsx` already exists — integrate with `/api/disease/*` endpoints

## AgriPool (Ride / Marketplace)
- Pages: `AgriPool` pages under `src/pages/Agripool/`
- Service: `agriPoolService.*` ↔ `/api/agri-pool/*`

## Twilio / Voice
- Background services to send alerts via `/api/twilio/*` and `/api/voice/*`. Used by controllers for notifications.

---

Next actions:
- 1) Implement `mandiService` and scaffold `/mandi/analyze` UI (high-impact hackathon feature).
- 2) Add animations/styles and polish UI theme across pages.
