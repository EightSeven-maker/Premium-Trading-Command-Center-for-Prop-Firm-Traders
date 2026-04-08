# EightSeven HQ V4 - Ultimate Trading Command Center

A professional-grade trading platform combining journal tracking, prop firm management, news intelligence, and TradingView integration.

## V4 Features

### Core Trading
- **TradingView Charts** - Embedded live charts with full TradingView functionality
- **Trading Panel** - Quick order entry, position sizing, session tracking
- **Pre-Session Flow** - Ardas, Market Analysis, Rule Commitment
- **Trade Journal** - Full logging with search, filters, and detailed entries

### Prop Firm Management
- **Multi-Account Tracking** - Track multiple funded/challenge accounts
- **Progress Monitoring** - Visual progress bars to targets
- **Drawdown Tracking** - Real-time DD percentage with alerts
- **Quick Updates** - Add profit/drawdown with one click

### News Intelligence
- **Forex Factory Calendar** - High/Medium/Low impact events
- **Auto-Block Toggle** - Automatically pause trading during high-impact news
- **Weekly Overview** - Quick view of upcoming high-impact events

### Smart Features
- **AI Coach** - Data-driven insights from your journal
- **Notifications** - Trade alerts, streak updates, warnings
- **Local Storage** - All data persists in browser

## Deploy to Netlify

### GitHub + Netlify
```bash
cd EightSevenHQ-V4
git init
git add .
git commit -m "EightSeven HQ V4"
# Push to GitHub, then connect to Netlify
```

Netlify Settings:
- Build command: `npm run build`
- Publish directory: `dist`

### Drag & Drop
```bash
npm install
npm run build
# Drag dist folder to Netlify
```

## Tech Stack
- React 18
- Vite
- Recharts
- Lucide React
- TradingView Widget

---

*Built for Karan Singh's "30 Trades To Freedom" journey.*
