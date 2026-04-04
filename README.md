# QuantEdge
**Professional multi-market trading intelligence platform — by Nexura Solutions**

## What's included
- **Module 01 — Macro Radar**: Live Fed rates, CPI, Gold (FRED API) + Bitcoin price & chart, crypto overview (CoinGecko)
- **Module 02 — Correlations**: Cross-market correlation engine with live BTC/ETH chart
- **Module 03 — Smart Money**: Whale alerts, funding rates, Fear & Greed index
- **Module 04 — Narratives**: UI ready, data coming soon
- **Module 05 — Trade Journal**: UI ready, data coming soon
- **Module 06 — What Moved This?**: UI ready, data coming soon
- **QuantEdge AI**: Fully functional chatbot powered by Claude API

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure API keys
```bash
cp .env.example .env
```
Then open `.env` and add:
- `REACT_APP_ANTHROPIC_API_KEY` — get from https://console.anthropic.com
- `REACT_APP_FRED_API_KEY` — free from https://fred.stlouisfed.org/docs/api/api_key.html (optional, DEMO_KEY works)

### 3. Run locally
```bash
npm start
```
Opens at http://localhost:3000

---

## Deploy to Vercel

### Option A — GitHub + Vercel (recommended)
1. Push this folder to a GitHub repo
2. Go to https://vercel.com → New Project → Import your repo
3. Add environment variables in Vercel dashboard (same keys from .env)
4. Click Deploy — done. Auto-deploys on every push.

### Option B — Vercel CLI
```bash
npm install -g vercel
vercel
```
Follow the prompts. Add env vars when asked.

---

## Deploy to Netlify
```bash
npm run build
```
Then drag the `build/` folder to https://app.netlify.com/drop

Add env vars in Netlify → Site Settings → Environment Variables.

---

## Project structure
```
src/
  components/
    layout/       → Topbar, Sidebar
    modules/      → MacroRadar, Correlations, SmartMoney, ComingSoon, AIChat
    ui/           → Logo
  styles/         → globals.css
  utils/          → api.js (FRED + CoinGecko helpers)
  App.jsx         → Root component, routing, theme
  index.js        → Entry point
```

---

## Built by Nexura Solutions
