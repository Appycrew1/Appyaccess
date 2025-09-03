# AppyAccess Pro v3 (Planner + Data Addon)

This build merges your planner (v2) with a data addon that fetches UK **traffic** and **property** datasets via APIs/scraping with AI extraction.

## What’s included
- Planner with **Origin/Destination**, **Move date**, **Vehicle type**
- **Street View** (toggle origin/destination) + static image
- **Route map** with **traffic**, **ULEZ/LEZ/LLCS overlays** and **traffic event markers**
- **Property panel** (EPC, planning notes via AI, CPZ rules via AI)
- **AI analysis** uses move date + vehicle

## Setup
1. Copy `.env.example` -> `.env.local` and fill keys/URLs.
2. Install & run:
   ```bash
   npm i
   npm run dev
   ```
3. Deploy on Vercel (set the same env vars).

## Notes
- Respect third-party **T&Cs** and **robots.txt**.
- Provide **DATEX**, **City of London**, **ArcGIS layer URLs**; otherwise sources return empty.
- Provide **EPC token** for EPC data.
- AI extraction uses your OpenAI key; consider adding caching & council-specific adapters for reliability.
