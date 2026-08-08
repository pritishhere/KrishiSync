# KrishiSync Backend API Spec (Discovered)

This file maps the backend endpoints discovered in `server/src` to help frontend integration.

## Auth
- **POST** `/api/auth/register`
  - Auth: none
  - Body: { phone, password, fullName }
  - Response: { _id, fullName, phone, token }

- **POST** `/api/auth/login`
  - Auth: none
  - Body: { phone, password }
  - Response: { _id, fullName, phone, token }

- **POST** `/api/auth/send-otp`
  - Auth: none
  - Body: { phoneNumber }
  - Response: { success, message, ... }

- **POST** `/api/auth/verify-otp`
  - Auth: none
  - Body: { phoneNumber, otp }
  - Response: { success, token?, user? }

- **PUT** `/api/auth/profile`
  - Auth: Bearer JWT (protect middleware)
  - Body: partial user profile
  - Response: updated profile object

## MandiMind
- **POST** `/api/mandimind/analyze`
  - Auth: Bearer JWT
  - Body: { crop, quantity, lat, lng }
  - Response: { success, totalAnalyzed, recommendedMandi, otherOptions }

## Advisory
- **POST** `/api/advisory/smart-plan`
  - Auth: Bearer JWT
  - Body: { lat, lng, crop, providedSoilMoisture? }
  - Response: { success, realTimeData, jalRakshak, farmShield }

## Other Routes (to inspect next)
- `/api/disease/*` — see `server/src/routes/diseaseRoutes.js`
- `/api/irrigation/*` — see `server/src/routes/irrigationRoutes.js`
- `/api/agri-pool/*` — see `server/src/routes/agriPoolRoutes.js`
- `/api/data/*` — see `server/src/routes/dataRoutes.js`
- `/api/voice/*`, `/api/twilio/*` — voice/sms integrations

---

Next: generate a detailed frontend mapping (service functions and expected UI flows) and scaffold pages/components accordingly.
