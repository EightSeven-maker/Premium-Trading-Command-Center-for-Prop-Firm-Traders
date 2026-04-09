# Dashboard Redesign — Ice Glass Minimal with Interactivity

## Overview

Transform the Command Center dashboard from a static display into a living, breathing trading cockpit. Keep the professional, calm Ice Glass Minimal aesthetic but make every element respond to user input with purposeful, subtle motion.

## Layout

```
[ NQ / ES / YM Live Prices — ambient pulse glow ]
[ Market Squawk Ticker Banner ]
[ Personalized Header — "Good Morning, Karan" + Quote ]
─────────────────────────────────────────────────────
[ ANALYTICS HUB (left, 60%) ]    [ TRADE PANEL (right, 40%) ]
  6-stat hero strip (animated)       Streak + Today P&L badge
  Equity curve (interactive chart)    Recent trades list (8 trades)
  Setup performance table             Quick-add trade button
  Day-of-week heatmap
  Prop guardrails (goal progress)
─────────────────────────────────────────────────────
[ Footer: last synced, version ]
```

---

## Interactive Elements

### 1. Stat Cards — Number Count-Up on Load

Each of the 6 hero stat cards animates its value from 0 to the real value over 800ms using ease-out. Only runs once on mount. Cards:

| Card | Metric | Color Logic |
|------|--------|-------------|
| Total P&L | `fmt(stats.total)` | green if positive, red if negative |
| Win Rate | `${stats.wr}%` | green if ≥50%, amber if 40-49%, red if <40% |
| Avg Winner | `fmt(avgWin)` | always green |
| Avg Loser | `fmt(avgLoss)` | always red |
| Expectancy | `fmt(expectancy)` | green/red based on sign |
| Profit Factor | `profitFactor.toFixed(2)` | green if ≥1.5, amber if 1.0-1.5, red if <1.0 |

**Hover state:** Card lifts 4px with subtle shadow bloom. Border brightens.

### 2. Equity Curve Chart — Hover Tooltip

- Recharts `AreaChart` with gradient fill
- **On hover** anywhere on chart: vertical crosshair snaps to nearest data point, tooltip shows: Date, P&L for that day, cumulative total, vs. high watermark delta
- Tooltip styled as mini glass card matching theme
- High watermark line drawn as dashed horizontal line across chart
- Area gradient: `linear-gradient(135deg, accent 30%, accent10 100%)`

### 3. Setup Performance Table — Click to Filter

- Shows top 8 setups by P&L
- **Clickable rows:** clicking a row filters the Recent Trades panel to show only trades from that entry model
- Active filter shows as a dismissible pill at top of Recent Trades panel
- "Clear filter" button or click pill to remove
- Sortable columns: click header to sort asc/desc

### 4. Day-of-Week Heatmap — Hover Detail

- 5 cells (Mon–Fri)
- Hover shows tooltip: day name, P&L, # of trades, win rate for that day
- Click cell to filter Recent Trades to that day of week

### 5. Recent Trades — Click to Expand

- Each trade row is **clickable**
- Click expands an inline detail view below the row showing:
  - Full notes
  - Mistake tag
  - Grade badge
  - Entry model
  - Direction + contracts
- Smooth height animation (CSS `max-height` transition, 300ms ease)
- Only one trade can be expanded at a time
- Row background subtly highlights when expanded

### 6. Quick-Add Trade Button

- Floating action button in bottom-right of right panel
- `+` icon, glass style with accent glow
- **Hover:** glows and rotates 90° (like opening a door)
- Click opens the Add Trade modal (already exists)

### 7. Streak Badge — Pulse on Change

- Win streak badge pulses with a ring animation when streak increases
- PNL badge does the same when daily P&L crosses zero (win → loss or vice versa)

### 8. Price Tickers — Ambient + Interactive

- NQ/ES/YM cards show live price with subtle ambient glow
- Price **flashes** green/red on each tick update (fade from old color to green/red and back, 400ms)
- Hover shows a mini sparkline of last 10 price ticks

### 9. Goals Section — Animated Progress Bars

- Progress bars animate from 0 to current % on mount (600ms ease-out)
- When a goal is hit (>100%), bar pulses with success glow
- When approaching daily loss limit (>80%), bar turns amber/red with warning pulse

---

## Animation Specifications

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Page load sequence | Cards stagger in (100ms apart) | 800ms each | ease-out |
| Stat number count-up | 0 → value | 800ms | ease-out |
| Card hover lift | translateY(0 → -4px) + shadow | 200ms | ease-out |
| Card hover border | border-color brighten | 150ms | linear |
| Trade expand | max-height 0 → auto | 300ms | ease-out |
| Chart tooltip appear | opacity 0 → 1 | 150ms | ease-out |
| Price tick flash | background color flash | 400ms | ease-in-out |
| FAB hover | rotate(90deg) + glow | 200ms | ease-out |
| Streak pulse | ring scale + opacity | 600ms | ease-out |
| Progress bar | width 0 → % | 600ms | ease-out |
| Filter pill enter | scale(0.8 → 1) + fade | 200ms | spring |

---

## CSS Animation Keyframes (to add to App.jsx)

```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes countUp { /* handled in JS via rAF */ }

@keyframes hoverLift {
  from { transform: translateY(0); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
  to { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
}

@keyframes priceFlashGreen {
  0%, 100% { color: inherit; }
  50% { color: #22c55e; }
}

@keyframes priceFlashRed {
  0%, 100% { color: inherit; }
  50% { color: #ef4444; }
}

@keyframes pulseRing {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(1.6); opacity: 0; }
}

@keyframes glowRotate {
  0% { box-shadow: 0 0 8px accent, 0 0 16px accent40; }
  50% { box-shadow: 0 0 16px accent, 0 0 32px accent60; }
  100% { box-shadow: 0 0 8px accent, 0 0 16px accent40; }
}

@keyframes slideDown {
  from { opacity: 0; max-height: 0; }
  to { opacity: 1; max-height: 500px; }
}

@keyframes progressPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes fabHover {
  from { transform: rotate(0deg); }
  to { transform: rotate(90deg); }
}
```

---

## State Changes

New React state in `CommandCenterPage`:

- `expandedTradeIndex` — `null` | `number` — which trade is expanded
- `activeSetupFilter` — `string | null` — filters Recent Trades by entry model
- `activeDayFilter` — `number (0-4) | null` — filters Recent Trades by day-of-week
- `prevPrices` — tracks previous prices to detect direction of tick change

Filtered trades derived from base trades:
```js
const filteredTrades = useMemo(() => {
  let result = [...trades];
  if (activeSetupFilter) result = result.filter(t => t.entryModel === activeSetupFilter);
  if (activeDayFilter !== null) result = result.filter(t => new Date(t.date).getDay() === activeDayFilter);
  return result;
}, [trades, activeSetupFilter, activeDayFilter]);
```

---

## Remove

- `<LivePnlWidget />` — fully removed from CommandCenterPage
- Remove LivePnlWidget import and component definition

## File Changes

- `src/App.jsx` — major rewrite of `CommandCenterPage`, remove `LivePnlWidget`, add animations/CSS keyframes
- `server/index.js` — keep Tradovate API code (it'll be used later) but no need to call it from frontend for now
