# Access Viewer Pro (Pre‑Survey)

A production-ready rebuild of the Access Viewer "Pre‑Survey" with polished UI/UX and AI integration.

## Features
- Google Places **Autocomplete** for Depot & Customer Address
- **Route map** and distance/ETA with Google Maps
- **Weather** lookup via Open‑Meteo (no API key required)
- **Risk checklist** + building/access inputs
- **AI analysis** (crew size, equipment, risks, recommendations) via OpenAI
- **PDF export** of the AI summary and key data
- Clean **Tailwind** UI; mobile-friendly

## Quick Start (Vercel or local)
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure env**
   - Copy `.env.example` to `.env.local` and set:
     - `OPENAI_API_KEY`
     - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (browser-restricted)
3. **Run dev**
   ```bash
   npm run dev
   ```
4. **Deploy to Vercel**
   - Push to GitHub, import in Vercel, set same env vars in Project Settings.

## Notes
- The Google Maps key must allow **Maps JavaScript API**, **Places API**, and **Directions API**.
- The OpenAI key is used **server-side** only via Next Route Handlers.
- No mock data; all results are live based on your inputs.
