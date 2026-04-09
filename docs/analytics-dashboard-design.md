# Trading Analytics Dashboard — Design Spec
**Date:** 2026-04-09
**Author:** OpenWork
**Status:** Draft — awaiting user review

---

## 1. Concept & Vision

A prop trader futures dashboard that surfaces **everything you need to see in one place** — no clicking around, no exporting to Excel. Every number answers the question: *"What do I need to change?"*

The dashboard replaces vanity metrics with diagnostic ones. Every stat links to an action. The design is dense but scannable — a pilot's instrument panel, not a PowerPoint.

**Remove:** Trump Twitter Feed component and its rendering in `CommandCenterPage` (currently Lines 477-662 for the component, Line 2213 for the render).

---

## 2. What "All Stats" Means for a Prop Futures Trader

### Data Source
- **Journal trades** stored in `localStorage` as `journalTrades` (existing structure)
- Each trade has at minimum: `date`, `symbol`, `direction`, `pnl`, `setup`, `notes`
- Extend the analytics engine to compute stats from whatever fields are present

### Stats Architecture
Two-tier system:
1. **Snapshot cards** — single numbers (win rate %, total P&L, current streak)
2. **Trend charts** — sparklines and bar charts (equity curve, P&L by symbol, day-of-week heatmap)

---

## 3. Dashboard Layout

Replace the right column of `CommandCenterPage` (where the Trump feed and calendar currently live) with a unified **Stats Panel**. Keep the Calendar if desired, move Trump feed removal to the trash.

```
┌─────────────────────────────────────────────────────────────────────┐
│  COMMAND CENTER PAGE                                               │
│                                                                     │
│  ┌──────────────────────────┐  ┌──────────────────────────────────┐ │
│  │  LEFT COLUMN             │  │  RIGHT COLUMN                    │ │
│  │                          │  │                                   │ │
│  │  • Live Market Prices    │  │  • REMOVED: TrumpTwitterFeed      │ │
│  │  • Market Squawk Banner  │  │  • REMOVED: TrumpTwitterFeed render│ │
│  │  • Live P&L Widget      │  │                                   │ │
│  │  • Recent Trades List    │  │  NEW: TRADING STATS PANEL         │ │
│  │                          │  │  ┌─────────────────────────────┐  │ │
│  │                          │  │  │ TODAY'S SNAPSHOT            │  │ │
│  │                          │  │  │ P&L | Wins | Losses | Streak│  │ │
│  │                          │  │  └─────────────────────────────┘  │ │
│  │                          │  │  ┌─────────────────────────────┐  │ │
│  │                          │  │  │ PROP FIRM GUARDRAILS       │  │ │
│  │                          │  │  │ Daily Loss Limit % used    │  │ │
│  │                          │  │  └─────────────────────────────┘  │ │
│  │                          │  │  ┌─────────────────────────────┐  │ │
│  │                          │  │  │ EQUITY CURVE (30-day)     │  │ │
│  │                          │  │  └─────────────────────────────┘  │ │
│  │                          │  │  ┌────────────┐ ┌────────────┐  │ │
│  │                          │  │  │ WIN RATE    │ │ P&L/SYMBOL │  │ │
│  │                          │  │  │ PIE CHART   │ │ BAR CHART  │  │ │
│  │                          │  │  └────────────┘ └────────────┘  │ │
│  │                          │  │  ┌─────────────────────────────┐  │ │
│  │                          │  │  │ SESSION BREAKDOWN          │  │ │
│  │                          │  │  │ Morning | Afternoon | Night │  │ │
│  │                          │  │  └─────────────────────────────┘  │ │
│  │                          │  │  ┌─────────────────────────────┐  │ │
│  │                          │  │  │ DAY OF WEEK HEATMAP        │  │ │
│  │                          │  │  └─────────────────────────────┘  │ │
│  │                          │  │  ┌─────────────────────────────┐  │ │
│  │                          │  │  │ SETUP PERFORMANCE           │  │ │
│  │                          │  │  └─────────────────────────────┘  │ │
│  │                          │  │  ┌─────────────────────────────┐  │ │
│  │                          │  │  │ WIN/LOSS STREAK TRACKER     │  │ │
│  │                          │  │  └─────────────────────────────┘  │ │
│  │                          │  │  ┌─────────────────────────────┐  │ │
│  │                          │  │  │ GOAL PROGRESS BARS         │  │ │
│  │                          │  │  └─────────────────────────────┘  │ │
│  │                          │  │                                   │ │
│  └──────────────────────────┘  └──────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### Stats Panel Sections (in order)

#### A. Today's Snapshot (4 stat cards in a row)
| Stat | What it tells you |
|------|-------------------|
| Today's P&L | Did you make or lose money today? |
| Today's Wins | How many winners today? |
| Today's Losses | How many losers today? |
| Current Streak | W or L streak — are you in a pattern? |

#### B. Prop Firm Guardrails
- **Daily Loss Limit** — User sets a limit (e.g., $250). Show % used vs limit. Color-coded: green < 50%, yellow 50-80%, red > 80%.
- **Challenge Days Used** — Days since starting the challenge. Days remaining. Progress bar.
- **Max Drawdown** — How far below high watermark you are right now.

#### C. Equity Curve (30-day)
- Area chart, cumulative P&L over last 30 days
- High watermark line overlay
- Current equity highlighted
- If no trades in 7+ days, show "No trades this week — stay disciplined"

#### D. Win Rate + P&L by Symbol (side by side)
- Left: Win rate pie/donut (wins vs losses)
- Right: Horizontal bar chart — P&L per symbol (NQ, ES, YM, etc.) color-coded green/red

#### E. Session Breakdown
- **Morning** (8am–12pm), **Afternoon** (12pm–4pm), **Overnight** (4pm–8am)
- Each shows: trade count, P&L, win rate
- Highlight best and worst session with an icon

#### F. Day of Week Heatmap
- Mon–Fri grid
- Each cell: total P&L for that day of the week
- Color intensity = magnitude of P&L (dark green = big win, dark red = big loss)
- "Your best day: Wednesday. Worst day: Friday."

#### G. Setup Performance
- Table sorted by total P&L
- Columns: Setup name | Win Rate | Avg P&L | Total P&L | # Trades
- Top setup highlighted green, worst setup highlighted red
- If no setups tagged: show "Add setup tags to your journal to see this"

#### H. Win/Loss Streak Tracker
- Visual streak flame icons (🔥🔥🔥 for 3 in a row)
- Current streak vs max streak
- "After a loss: avg next trade P&L" — tracks emotional recovery
- "After a win: avg next trade P&L" — tracks overconfidence

#### I. Goal Progress
- Daily goal: X of $Y (user-configurable in settings)
- Weekly goal: X of $Y
- Monthly goal: X of $Y
- Progress bars with % and days remaining in period

#### J. Deeper Stats Row (collapsible "Show more")
| Stat | Description |
|------|-------------|
| Total P&L (all time) | Sum of all journal P&L |
| Win Rate % | Wins / total trades |
| Avg Winner | Mean P&L of winning trades |
| Avg Loser | Mean P&L of losing trades |
| Expectancy | (Win% × Avg Win) − (Loss% × Avg Loss) |
| Profit Factor | Total wins $ / Total losses $ |
| Best Trade | Biggest single win |
| Worst Trade | Biggest single loss |
| Total Trades | All time |
| Best Day | Highest P&L single day |
| Worst Day | Lowest P&L single day |
| Max Drawdown | Biggest peak-to-trough |
| Avg Risk/Reward | Avg winner / avg loser ratio |

---

## 4. Design Language

### Colors
- Match existing V3 Neon Glass theme (indigo/purple palette, NO gold)
- Stat cards: glass morphism with `rgba(99, 102, 241, 0.1)` background
- Positive numbers: `#22c55e` (green)
- Negative numbers: `#ef4444` (red)
- Neutral/warning: `#f59e0b` (amber)
- Prop firm guardrail: use the green/yellow/red traffic light system

### Typography
- Large stat numbers: 28–32px bold
- Labels: 11–12px uppercase tracking
- Section titles: 14px semibold with a small icon prefix

### Layout
- Stats panel: max-width 380px, scrollable on smaller screens
- Cards: 12px padding, 8px border-radius
- Charts: 100% width of their container, max 200px height
- Section spacing: 16px between sections

### Empty States
- If no journal trades: show "Start logging trades in your journal to see analytics"
- If partial data: show available stats, dim unavailable ones

---

## 5. Component Architecture

```
App.jsx (existing — modify)
├── CommandCenterPage
│   └── StatsPanel (NEW — wraps all analytics)
│       ├── StatCard (reusable)
│       ├── TodaySnapshot (4 StatCards)
│       ├── PropGuardrails
│       ├── EquityCurveChart
│       ├── WinRatePie + PnlBySymbol (side by side)
│       ├── SessionBreakdown
│       ├── DayOfWeekHeatmap
│       ├── SetupPerformance
│       ├── StreakTracker
│       ├── GoalProgress
│       └── DeeperStats (collapsible)
└── TrumpTwitterFeed (DELETE — component def + render)
```

---

## 6. Implementation Steps

1. **Remove TrumpTwitterFeed** — delete component definition (Lines 477–662) and render call (Line 2213)
2. **Create `computeStats(trades)` utility** — pure function that takes journal trades and returns all computed stats (win rate, expectancy, streaks, by-symbol, by-session, by-day, by-setup, goals, drawdown)
3. **Build `StatCard` component** — reusable glass card with icon, label, value, and optional trend indicator
4. **Build `StatsPanel`** — container that reads `journalTrades` from localStorage, computes stats, renders all sections
5. **Replace right column** in `CommandCenterPage` — put `StatsPanel` where the Trump feed currently lives, keep `DashboardCalendar` above it
6. **Add collapsible "Show more"** for deeper stats section
7. **Add goal settings** — store daily/weekly/monthly targets in localStorage, editable from Settings
8. **Add daily loss limit** — user sets this in Settings, shown as guardrail on dashboard
9. **Build DayOfWeekHeatmap** — CSS grid, 5 cells, color-coded
10. **Build SetupPerformance table** — sortable by any column
11. **Test** — verify no crashes when journal is empty, partial, or full

---

## 7. Error Handling

- If `journalTrades` is empty/null → show onboarding empty state
- If a trade is missing a field (e.g., no setup tag) → skip that field in relevant stats, don't crash
- If localStorage is unavailable → show stats from in-memory state only
- All chart data arrays must handle empty → show "No data" placeholder

---

## 8. Success Criteria

- [ ] Trump Twitter Feed completely removed from codebase
- [ ] Dashboard loads without any blank/error states
- [ ] Stats panel visible immediately on dashboard load
- [ ] All stats computed correctly from journal trades
- [ ] Charts render with real data (or empty state if no data)
- [ ] Prop firm guardrails update in real time as trades are logged
- [ ] App builds clean (`npm run build` passes)
