# Trading Analytics Dashboard — Implementation Plan

> **For agentic workers:** Execute tasks inline in this session. Check off each step as completed.

**Goal:** Remove Trump Twitter Feed from the dashboard and add a comprehensive Trading Stats Panel that surfaces all trading analytics from journal trades, answering "what do I need to change?"

**Architecture:** All new components and utilities live in `App.jsx`. Stats computed from `journalTrades` (localStorage key `87capital_v4` → `trades` array). Goals/daily loss limit stored in same localStorage state.

**Tech Stack:** React, recharts, localStorage, lucide-react icons.

---

## File Map

| Action | Location | Purpose |
|--------|----------|---------|
| Modify | `src/App.jsx:477-662` | DELETE: `TrumpTwitterFeed` component definition |
| Modify | `src/App.jsx:2213` | DELETE: `<TrumpTwitterFeed />` render call |
| Modify | `src/App.jsx:2210` | KEEP: `<DashboardCalendar />` — move it inside StatsPanel |
| Modify | `src/App.jsx` near line 860 | ADD: `computeStats(trades)` utility function |
| Modify | `src/App.jsx` near line 860 | ADD: `StatCard`, `StatsPanel`, `PropGuardrails`, `DayOfWeekHeatmap`, `SetupPerformance`, `SessionBreakdown`, `StreakTracker`, `GoalProgress`, `DeeperStats` components |
| Modify | `src/App.jsx` state section | ADD: `dailyGoal`, `weeklyGoal`, `monthlyGoal`, `dailyLossLimit` to state + localStorage |
| Modify | `src/App.jsx:SettingsPage` | ADD: goal and daily loss limit inputs |
| Modify | `src/App.jsx:CommandCenterPage` | REPLACE right column with `<StatsPanel trades={trades} />` |
| Modify | `src/App.jsx:SettingsPage` | ADD: link to stats/analytics section if needed |

---

## TASK 1: Delete TrumpTwitterFeed Component Definition

**File:** `src/App.jsx:477-662`

- [ ] **Step 1: Read the exact bounds of the TrumpTwitterFeed component**

Locate lines 477-662 in App.jsx and confirm the component starts at line 477 with `function TrumpTwitterFeed()` and ends at line 662 with its closing `}`.

- [ ] **Step 2: Delete the component**

Replace lines 477–662 with a blank line (or remove them entirely). The component should be gone from the codebase.

```javascript
// DELETE THIS ENTIRE BLOCK (lines 477-662):
function TrumpTwitterFeed() {
  const [tweets, setTweets] = useState([]);
  // ... all the logic ...
}
```

---

## TASK 2: Delete TrumpTwitterFeed Render Call

**File:** `src/App.jsx:2213`

- [ ] **Step 1: Read lines 2207-2215 to see exact context**

- [ ] **Step 2: Delete the render call**

Remove the line `<TrumpTwitterFeed />` at line 2213. The right column div at line 2207 should still contain `<DashboardCalendar />` only.

Before:
```jsx
<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
  <DashboardCalendar />      {/* Line 2210 */}
  <TrumpTwitterFeed />       {/* DELETE THIS LINE */}
</div>
```

After:
```jsx
<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
  <DashboardCalendar />
</div>
```

---

## TASK 3: Add Goals + Daily Loss Limit to App State + localStorage

**File:** `src/App.jsx` — find the state initialization section (around line 3777 where localStorage is read)

- [ ] **Step 1: Read the state initialization and localStorage save section**

Around line 3770-3792, find the `useState` calls and the `useEffect` that saves to localStorage.

- [ ] **Step 2: Add new state variables**

Add these four new pieces of state near the existing state declarations:

```javascript
const [dailyGoal, setDailyGoal] = useState(() => {
  const saved = localStorage.getItem("87capital_v4");
  if (saved) {
    const data = JSON.parse(saved);
    return data.dailyGoal || 250;
  }
  return 250;
});

const [weeklyGoal, setWeeklyGoal] = useState(() => {
  const saved = localStorage.getItem("87capital_v4");
  if (saved) {
    const data = JSON.parse(saved);
    return data.weeklyGoal || 1000;
  }
  return 1000;
});

const [monthlyGoal, setMonthlyGoal] = useState(() => {
  const saved = localStorage.getItem("87capital_v4");
  if (saved) {
    const data = JSON.parse(saved);
    return data.monthlyGoal || 4000;
  }
  return 4000;
});

const [dailyLossLimit, setDailyLossLimit] = useState(() => {
  const saved = localStorage.getItem("87capital_v4");
  if (saved) {
    const data = JSON.parse(saved);
    return data.dailyLossLimit || 250;
  }
  return 250;
});
```

- [ ] **Step 3: Update the localStorage save to include new fields**

Find the `localStorage.setItem` call that saves `87capital_v4`. It currently saves `{ trades, session, propAccounts, spiritualMode }`. Update it to:

```javascript
localStorage.setItem("87capital_v4", JSON.stringify({
  trades,
  session,
  propAccounts,
  spiritualMode,
  dailyGoal,
  weeklyGoal,
  monthlyGoal,
  dailyLossLimit,
}));
```

- [ ] **Step 4: Update the localStorage read to restore new fields**

Find the `localStorage.getItem` call that reads `87capital_v4`. It currently reads `{ trades, session, propAccounts, spiritualMode }`. Add the new fields:

```javascript
if (saved) {
  const data = JSON.parse(saved);
  if (data.trades) setTrades(data.trades);
  if (data.session) setSession(data.session);
  if (data.propAccounts) setPropAccounts(data.propAccounts);
  if (data.spiritualMode !== undefined) setSpiritualMode(data.spiritualMode);
  // ADD THESE:
  if (data.dailyGoal) setDailyGoal(data.dailyGoal);
  if (data.weeklyGoal) setWeeklyGoal(data.weeklyGoal);
  if (data.monthlyGoal) setMonthlyGoal(data.monthlyGoal);
  if (data.dailyLossLimit) setDailyLossLimit(data.dailyLossLimit);
}
```

---

## TASK 4: Add Goal Settings to SettingsPage

**File:** `src/App.jsx` — SettingsPage component (around line 3621)

- [ ] **Step 1: Read the SettingsPage to find a good insertion point**

Find the end of the settings fields (near the export section). Add goal inputs after the existing settings fields, before the export/import section.

- [ ] **Step 2: Add Goals section to SettingsPage**

Add a new collapsible section called "Trading Goals" with four number inputs:

```jsx
{/* ── TRADING GOALS ── */}
<div style={{ ...S.glassCard, marginTop: 16 }}>
  <div
    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
    onClick={() => setShowGoals(s => !s)}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Target size={16} style={{ color: C.primary }} />
      <span style={{ fontSize: 13, fontWeight: 600, color: C.text.primary }}>Trading Goals</span>
    </div>
    <ChevronDown size={16} style={{ color: C.text.muted, transform: showGoals ? "rotate(180deg)" : "none", transition: "0.2s" }} />
  </div>

  {showGoals && (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: C.text.muted }}>Daily Goal</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: "#22c55e", fontWeight: 700 }}>$</span>
          <input
            type="number"
            value={dailyGoal}
            onChange={e => setDailyGoal(Number(e.target.value))}
            style={S.input(120)}
          />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: C.text.muted }}>Weekly Goal</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: "#22c55e", fontWeight: 700 }}>$</span>
          <input
            type="number"
            value={weeklyGoal}
            onChange={e => setWeeklyGoal(Number(e.target.value))}
            style={S.input(120)}
          />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: C.text.muted }}>Monthly Goal</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: "#22c55e", fontWeight: 700 }}>$</span>
          <input
            type="number"
            value={monthlyGoal}
            onChange={e => setMonthlyGoal(Number(e.target.value))}
            style={S.input(120)}
          />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: C.text.muted }}>Daily Loss Limit</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: "#ef4444", fontWeight: 700 }}>$</span>
          <input
            type="number"
            value={dailyLossLimit}
            onChange={e => setDailyLossLimit(Number(e.target.value))}
            style={S.input(120)}
          />
        </div>
      </div>
    </div>
  )}
</div>
```

- [ ] **Step 3: Add `showGoals` state and `Target` icon to SettingsPage**

Add near the top of SettingsPage:
```javascript
const [showGoals, setShowGoals] = useState(false);
```

---

## TASK 5: Create `computeStats(trades)` Utility

**File:** `src/App.jsx` — add just before `LivePnlWidget` (around line 860)

- [ ] **Step 1: Add the computeStats utility function**

This is a pure function that takes an array of trade objects and returns all computed statistics. Add this block:

```javascript
// ─── ANALYTICS ENGINE ────────────────────────────────────────────────────────
function computeStats(trades) {
  if (!trades || trades.length === 0) {
    return {
      totalPnl: 0, winRate: 0, avgWinner: 0, avgLoser: 0,
      expectancy: 0, profitFactor: 0, bestTrade: 0, worstTrade: 0,
      totalTrades: 0, bestDay: 0, worstDay: 0, maxDrawdown: 0,
      currentStreak: 0, maxWinStreak: 0, maxLossStreak: 0,
      pnlBySymbol: {}, pnlBySession: {}, pnlByDayOfWeek: {},
      setupPerformance: [], todayStats: { pnl: 0, wins: 0, losses: 0 },
      dailyGoalProgress: 0, weeklyGoalProgress: 0, monthlyGoalProgress: 0,
      dailyLossLimitUsed: 0, highWatermark: 0, equityCurve: [],
    };
  }

  const wins = trades.filter(t => t.pnl > 0);
  const losses = trades.filter(t => t.pnl < 0);
  const totalPnl = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const winRate = trades.length > 0 ? (wins.length / trades.length) * 100 : 0;
  const avgWinner = wins.length > 0 ? wins.reduce((s, t) => s + t.pnl, 0) / wins.length : 0;
  const avgLoser = losses.length > 0 ? Math.abs(losses.reduce((s, t) => s + t.pnl, 0) / losses.length) : 0;
  const expectancy = trades.length > 0
    ? (winRate / 100 * avgWinner) - ((1 - winRate / 100) * avgLoser)
    : 0;
  const totalWins = wins.reduce((s, t) => s + t.pnl, 0);
  const totalLosses = Math.abs(losses.reduce((s, t) => s + t.pnl, 0));
  const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? Infinity : 0;
  const bestTrade = Math.max(...trades.map(t => t.pnl || 0));
  const worstTrade = Math.min(...trades.map(t => t.pnl || 0));

  // ── Streaks ──
  const sorted = [...trades].sort((a, b) => new Date(a.date) - new Date(b.date));
  let currentStreak = 0, maxWinStreak = 0, maxLossStreak = 0;
  let curRun = 0, curType = null, bestRun = 0, bestRunType = null;
  sorted.forEach(t => {
    const type = t.pnl > 0 ? "win" : "loss";
    if (type === curType) {
      curRun++;
    } else {
      if (curType === "win" && curRun > maxWinStreak) maxWinStreak = curRun;
      if (curType === "loss" && curRun > maxLossStreak) maxLossStreak = curRun;
      curRun = 1;
      curType = type;
    }
  });
  if (curType === "win" && curRun > maxWinStreak) maxWinStreak = curRun;
  if (curType === "loss" && curRun > maxLossStreak) maxLossStreak = curRun;
  // Current streak
  for (let i = sorted.length - 1; i >= 0; i--) {
    const type = sorted[i].pnl > 0 ? "win" : "loss";
    if (i === sorted.length - 1) {
      curType = type;
      currentStreak = 1;
    } else if (sorted[i].pnl > 0 === (sorted[sorted.length - 1].pnl > 0)) {
      currentStreak++;
    } else {
      break;
    }
  }

  // ── P&L by Symbol ──
  const pnlBySymbol = {};
  trades.forEach(t => {
    const sym = t.ticker || "Other";
    if (!pnlBySymbol[sym]) pnlBySymbol[sym] = 0;
    pnlBySymbol[sym] += t.pnl || 0;
  });

  // ── P&L by Session (morning/afternoon/overnight based on entry time in notes or date) ──
  const pnlBySession = { Morning: { pnl: 0, count: 0 }, Afternoon: { pnl: 0, count: 0 }, Overnight: { pnl: 0, count: 0 } };
  trades.forEach(t => {
    const d = new Date(t.date);
    const h = d.getHours();
    let session = "Overnight";
    if (h >= 8 && h < 12) session = "Morning";
    else if (h >= 12 && h < 16) session = "Afternoon";
    pnlBySession[session].pnl += t.pnl || 0;
    pnlBySession[session].count++;
  });

  // ── P&L by Day of Week ──
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const pnlByDayOfWeek = {};
  days.forEach(d => { pnlByDayOfWeek[d] = { pnl: 0, count: 0 }; });
  trades.forEach(t => {
    const d = new Date(t.date);
    const day = days[d.getDay()];
    pnlByDayOfWeek[day].pnl += t.pnl || 0;
    pnlByDayOfWeek[day].count++;
  });

  // ── Setup Performance ──
  const setupMap = {};
  trades.forEach(t => {
    const setup = t.entryModel || t.setup || "Untagged";
    if (!setupMap[setup]) setupMap[setup] = { wins: 0, losses: 0, pnl: 0, count: 0 };
    setupMap[setup].pnl += t.pnl || 0;
    setupMap[setup].count++;
    if (t.pnl > 0) setupMap[setup].wins++;
    else if (t.pnl < 0) setupMap[setup].losses++;
  });
  const setupPerformance = Object.entries(setupMap).map(([name, d]) => ({
    name,
    winRate: d.count > 0 ? (d.wins / d.count) * 100 : 0,
    avgPnl: d.count > 0 ? d.pnl / d.count : 0,
    totalPnl: d.pnl,
    count: d.count,
  })).sort((a, b) => b.totalPnl - a.totalPnl);

  // ── Today's Stats ──
  const today = new Date().toISOString().split("T")[0];
  const todayTrades = trades.filter(t => t.date && t.date.startsWith(today));
  const todayStats = {
    pnl: todayTrades.reduce((s, t) => s + (t.pnl || 0), 0),
    wins: todayTrades.filter(t => t.pnl > 0).length,
    losses: todayTrades.filter(t => t.pnl < 0).length,
  };

  // ── Best/Worst Day ──
  const byDay = {};
  trades.forEach(t => {
    const day = t.date || today;
    if (!byDay[day]) byDay[day] = 0;
    byDay[day] += t.pnl || 0;
  });
  const bestDay = Object.values(byDay).length > 0 ? Math.max(...Object.values(byDay)) : 0;
  const worstDay = Object.values(byDay).length > 0 ? Math.min(...Object.values(byDay)) : 0;

  // ── Max Drawdown ──
  let equity = 0, highWater = 0, maxDrawdown = 0;
  const equityCurve = [];
  sorted.forEach(t => {
    equity += t.pnl || 0;
    if (equity > highWater) highWater = equity;
    const dd = highWater - equity;
    if (dd > maxDrawdown) maxDrawdown = dd;
    equityCurve.push({ date: t.date, equity, pnl: t.pnl || 0 });
  });

  return {
    totalPnl, winRate, avgWinner, avgLoser,
    expectancy, profitFactor, bestTrade, worstTrade,
    totalTrades: trades.length,
    bestDay, worstDay, maxDrawdown,
    currentStreak, maxWinStreak, maxLossStreak,
    pnlBySymbol, pnlBySession, pnlByDayOfWeek,
    setupPerformance, todayStats,
    dailyGoalProgress: todayStats.pnl,
    weeklyGoalProgress: 0, // computed in component
    monthlyGoalProgress: 0, // computed in component
    dailyLossLimitUsed: Math.max(0, -todayStats.pnl),
    highWatermark: highWater,
    equityCurve,
  };
}
```

---

## TASK 6: Create Reusable `StatCard` Component

**File:** `src/App.jsx` — add after `computeStats` utility

- [ ] **Step 1: Add StatCard component**

```javascript
// ─── STAT CARD ─────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color = C.text.primary, trend }) {
  const isPositive = typeof value === "number" && value > 0;
  const isNegative = typeof value === "number" && value < 0;
  const displayColor = isPositive ? "#22c55e" : isNegative ? "#ef4444" : color;
  const prefix = typeof value === "number" && value > 0 ? "+" : "";

  return (
    <div style={{
      background: "rgba(99, 102, 241, 0.08)",
      border: "1px solid rgba(99, 102, 241, 0.2)",
      borderRadius: 10,
      padding: "12px 14px",
      display: "flex",
      flexDirection: "column",
      gap: 4,
      minWidth: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {icon && React.cloneElement(icon, { size: 13, style: { color: C.primary } })}
        <span style={{ fontSize: 10, fontWeight: 600, color: C.text.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {label}
        </span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: displayColor, lineHeight: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {typeof value === "number" ? `${prefix}$${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: value % 1 !== 0 ? 2 : 0 })}` : value}
      </div>
      {sub && <div style={{ fontSize: 10, color: C.text.muted }}>{sub}</div>}
    </div>
  );
}
```

---

## TASK 7: Create `StatsPanel` and All Analytics Sub-Components

**File:** `src/App.jsx` — add after `StatCard`

- [ ] **Step 1: Add all sub-components in one block**

Each component is defined as a standalone function. Add them all together:

```javascript
// ─── PROP GUARDRAILS ───────────────────────────────────────────────────────
function PropGuardrails({ trades, dailyLossLimit }) {
  const stats = computeStats(trades);
  const limitPct = dailyLossLimit > 0 ? (stats.dailyLossLimitUsed / dailyLossLimit) * 100 : 0;
  const limitColor = limitPct > 80 ? "#ef4444" : limitPct > 50 ? "#f59e0b" : "#22c55e";
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysIntoWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
  const daysLeftInWeek = 7 - daysIntoWeek;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <Shield size={13} style={{ color: C.primary }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: C.text.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Prop Guardrails</span>
      </div>

      {/* Daily Loss Limit */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.text.muted, marginBottom: 4 }}>
          <span>Daily Loss Used</span>
          <span style={{ color: limitColor, fontWeight: 600 }}>${stats.dailyLossLimitUsed.toFixed(0)} / ${dailyLossLimit}</span>
        </div>
        <div style={{ height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${Math.min(limitPct, 100)}%`, background: limitColor, borderRadius: 3, transition: "width 0.3s" }} />
        </div>
        {limitPct > 80 && (
          <div style={{ fontSize: 10, color: "#ef4444", marginTop: 3 }}>
            ⚠️ Stop trading — approaching daily limit
          </div>
        )}
      </div>

      {/* High Watermark */}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
        <span style={{ color: C.text.muted }}>High Watermark</span>
        <span style={{ color: "#22c55e", fontWeight: 600 }}>${stats.highWatermark.toFixed(0)}</span>
      </div>

      {/* Current Drawdown */}
      {stats.maxDrawdown > 0 && (
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
          <span style={{ color: C.text.muted }}>Max Drawdown</span>
          <span style={{ color: "#ef4444", fontWeight: 600 }}>${stats.maxDrawdown.toFixed(0)}</span>
        </div>
      )}

      {/* Days left in week */}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
        <span style={{ color: C.text.muted }}>Days Left This Week</span>
        <span style={{ color: C.text.secondary, fontWeight: 600 }}>{daysLeftInWeek}</span>
      </div>
    </div>
  );
}

// ─── DAY OF WEEK HEATMAP ────────────────────────────────────────────────────
function DayOfWeekHeatmap({ trades }) {
  const stats = computeStats(trades);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const dayKeys = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const maxAbs = Math.max(...dayKeys.map(k => Math.abs(stats.pnlByDayOfWeek[k]?.pnl || 0)), 1);

  const bestDay = dayKeys.reduce((best, k) => {
    const pnl = stats.pnlByDayOfWeek[k]?.pnl || 0;
    return pnl > (stats.pnlByDayOfWeek[best]?.pnl || 0) ? k : best;
  }, "Monday");
  const worstDay = dayKeys.reduce((worst, k) => {
    const pnl = stats.pnlByDayOfWeek[k]?.pnl || 0;
    return pnl < (stats.pnlByDayOfWeek[worst]?.pnl || 0) ? k : worst;
  }, "Monday");

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <Calendar size={13} style={{ color: C.primary }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: C.text.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>P&L by Day</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4 }}>
        {dayKeys.map((day, i) => {
          const pnl = stats.pnlByDayOfWeek[day]?.pnl || 0;
          const intensity = Math.abs(pnl) / maxAbs;
          const bg = pnl > 0
            ? `rgba(34, 197, 94, ${0.15 + intensity * 0.5})`
            : pnl < 0
            ? `rgba(239, 68, 68, ${0.15 + intensity * 0.5})`
            : "rgba(255,255,255,0.05)";
          return (
            <div key={day} style={{
              background: bg,
              borderRadius: 6,
              padding: "6px 4px",
              textAlign: "center",
              border: `1px solid ${pnl > 0 ? "rgba(34,197,94,0.3)" : pnl < 0 ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.1)"}`,
            }}>
              <div style={{ fontSize: 9, color: C.text.muted, marginBottom: 2 }}>{days[i]}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: pnl >= 0 ? "#22c55e" : "#ef4444" }}>
                {pnl > 0 ? "+" : ""}{pnl.toFixed(0)}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10, color: C.text.muted }}>
        <span>Best: <span style={{ color: "#22c55e" }}>{bestDay.slice(0, 3)}</span></span>
        <span>Worst: <span style={{ color: "#ef4444" }}>{worstDay.slice(0, 3)}</span></span>
      </div>
    </div>
  );
}

// ─── SETUP PERFORMANCE ──────────────────────────────────────────────────────
function SetupPerformance({ trades }) {
  const stats = computeStats(trades);

  if (stats.setupPerformance.length === 0) {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <Target size={13} style={{ color: C.primary }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: C.text.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Setup Performance</span>
        </div>
        <div style={{ fontSize: 12, color: C.text.muted, textAlign: "center", padding: "16px 0" }}>
          Add setup tags to your journal to see this
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <Target size={13} style={{ color: C.primary }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: C.text.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Setup Performance</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 140, overflowY: "auto" }}>
        {stats.setupPerformance.slice(0, 8).map((s, i) => (
          <div key={s.name} style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "5px 8px",
            background: i === 0 ? "rgba(34,197,94,0.08)" : i === stats.setupPerformance.length - 1 ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.03)",
            borderRadius: 6,
            border: `1px solid ${i === 0 ? "rgba(34,197,94,0.2)" : i === stats.setupPerformance.length - 1 ? "rgba(239,68,68,0.2)" : "transparent"}`,
          }}>
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.text.secondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</span>
              <span style={{ fontSize: 10, color: C.text.muted }}>{s.winRate.toFixed(0)}% WR · {s.count} trades</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: s.totalPnl >= 0 ? "#22c55e" : "#ef4444", flexShrink: 0 }}>
              {s.totalPnl >= 0 ? "+" : ""}{s.totalPnl.toFixed(0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SESSION BREAKDOWN ──────────────────────────────────────────────────────
function SessionBreakdown({ trades }) {
  const stats = computeStats(trades);
  const sessions = [
    { key: "Morning", label: "Morning", sub: "8am–12pm", icon: <Sun size={12} /> },
    { key: "Afternoon", label: "Afternoon", sub: "12pm–4pm", icon: <Sun size={12} /> },
    { key: "Overnight", label: "Overnight", sub: "4pm–8am", icon: <Moon size={12} /> },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <Clock size={13} style={{ color: C.primary }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: C.text.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Session Breakdown</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {sessions.map(s => {
          const data = stats.pnlBySession[s.key];
          const pnl = data?.pnl || 0;
          return (
            <div key={s.key} style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "6px 8px",
              background: "rgba(255,255,255,0.03)",
              borderRadius: 6,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: C.primary }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.text.secondary }}>{s.label}</div>
                  <div style={{ fontSize: 9, color: C.text.muted }}>{s.sub} · {data?.count || 0} trades</div>
                </div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: pnl >= 0 ? "#22c55e" : "#ef4444" }}>
                {pnl >= 0 ? "+" : ""}{pnl.toFixed(0)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── STREAK TRACKER ─────────────────────────────────────────────────────────
function StreakTracker({ trades }) {
  const stats = computeStats(trades);
  const streakEmoji = (n) => "🔥".repeat(Math.min(n, 5));
  const isWin = stats.currentStreak > 0 && trades.length > 0 && trades[trades.length - 1].pnl > 0;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <Flame size={13} style={{ color: C.primary }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: C.text.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Streaks</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        <div style={{ padding: "8px", background: "rgba(255,255,255,0.03)", borderRadius: 6, textAlign: "center" }}>
          <div style={{ fontSize: 9, color: C.text.muted, marginBottom: 2 }}>Current Streak</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: isWin ? "#22c55e" : "#ef4444" }}>
            {stats.currentStreak > 0 ? streakEmoji(stats.currentStreak) : "—"} {stats.currentStreak}
          </div>
          <div style={{ fontSize: 9, color: C.text.muted }}>{isWin ? "Wins" : "Losses"}</div>
        </div>
        <div style={{ padding: "8px", background: "rgba(255,255,255,0.03)", borderRadius: 6, textAlign: "center" }}>
          <div style={{ fontSize: 9, color: C.text.muted, marginBottom: 2 }}>Best Win Streak</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#22c55e" }}>{streakEmoji(stats.maxWinStreak)} {stats.maxWinStreak}</div>
          <div style={{ fontSize: 9, color: C.text.muted }}>consecutive</div>
        </div>
        <div style={{ padding: "8px", background: "rgba(255,255,255,0.03)", borderRadius: 6, textAlign: "center" }}>
          <div style={{ fontSize: 9, color: C.text.muted, marginBottom: 2 }}>Worst Loss Streak</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#ef4444" }}>{stats.maxLossStreak} ❌</div>
          <div style={{ fontSize: 9, color: C.text.muted }}>consecutive</div>
        </div>
        <div style={{ padding: "8px", background: "rgba(255,255,255,0.03)", borderRadius: 6, textAlign: "center" }}>
          <div style={{ fontSize: 9, color: C.text.muted, marginBottom: 2 }}>Profit Factor</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: stats.profitFactor >= 1 ? "#22c55e" : "#ef4444" }}>
            {stats.profitFactor === Infinity ? "∞" : stats.profitFactor.toFixed(2)}
          </div>
          <div style={{ fontSize: 9, color: C.text.muted }}>win/loss ratio</div>
        </div>
      </div>
    </div>
  );
}

// ─── GOAL PROGRESS ─────────────────────────────────────────────────────────
function GoalProgress({ trades, dailyGoal, weeklyGoal, monthlyGoal }) {
  const stats = computeStats(trades);
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const todayPnl = trades.filter(t => t.date === todayStr).reduce((s, t) => s + (t.pnl || 0), 0);
  const weekPnl = trades.filter(t => new Date(t.date) >= weekStart).reduce((s, t) => s + (t.pnl || 0), 0);
  const monthPnl = trades.filter(t => new Date(t.date) >= monthStart).reduce((s, t) => s + (t.pnl || 0), 0);

  const goals = [
    { label: "Daily", current: todayPnl, target: dailyGoal, color: todayPnl >= dailyGoal ? "#22c55e" : "#6366f1" },
    { label: "Weekly", current: weekPnl, target: weeklyGoal, color: weekPnl >= weeklyGoal ? "#22c55e" : "#6366f1" },
    { label: "Monthly", current: monthPnl, target: monthlyGoal, color: monthPnl >= monthlyGoal ? "#22c55e" : "#6366f1" },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <Target size={13} style={{ color: C.primary }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: C.text.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Goal Progress</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {goals.map(g => {
          const pct = g.target > 0 ? Math.min((g.current / g.target) * 100, 100) : 0;
          return (
            <div key={g.label}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
                <span style={{ color: C.text.muted }}>{g.label}</span>
                <span style={{ color: g.current >= g.target ? "#22c55e" : C.text.secondary, fontWeight: 600 }}>
                  ${g.current.toFixed(0)} / ${g.target}
                </span>
              </div>
              <div style={{ height: 5, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: g.color, borderRadius: 3, transition: "width 0.3s" }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── EQUITY CURVE CHART ──────────────────────────────────────────────────────
function EquityCurveChart({ trades }) {
  const stats = computeStats(trades);

  if (stats.equityCurve.length < 2) {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <TrendingUp size={13} style={{ color: C.primary }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: C.text.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Equity Curve (30d)</span>
        </div>
        <div style={{ fontSize: 12, color: C.text.muted, textAlign: "center", padding: "20px 0" }}>
          Log trades to see your equity curve
        </div>
      </div>
    );
  }

  const last30 = stats.equityCurve.slice(-30);
  const data = last30.map((d, i) => ({ name: i, equity: d.equity, pnl: d.pnl }));

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <TrendingUp size={13} style={{ color: C.primary }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: C.text.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Equity Curve (30d)</span>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="name" tick={false} stroke="rgba(255,255,255,0.2)" />
          <YAxis tickFormatter={v => `$${v}`} tick={{ fontSize: 9, fill: "rgba(255,255,255,0.4)" }} width={50} />
          <Tooltip
            formatter={(val) => [`$${val.toFixed(0)}`, "Equity"]}
            contentStyle={{ background: "#1e1b4b", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 8, fontSize: 11 }}
            labelStyle={{ color: C.text.muted }}
          />
          <Area type="monotone" dataKey="equity" stroke="#6366f1" fill="url(#eqGrad)" strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── DEEPER STATS (collapsible) ─────────────────────────────────────────────
function DeeperStats({ trades }) {
  const [expanded, setExpanded] = useState(false);
  const stats = computeStats(trades);

  const rows = [
    { label: "Total P&L", value: `$${stats.totalPnl.toFixed(0)}`, color: stats.totalPnl >= 0 ? "#22c55e" : "#ef4444" },
    { label: "Total Trades", value: stats.totalTrades },
    { label: "Win Rate", value: `${stats.winRate.toFixed(1)}%` },
    { label: "Avg Winner", value: `$${stats.avgWinner.toFixed(0)}`, color: "#22c55e" },
    { label: "Avg Loser", value: `$${stats.avgLoser.toFixed(0)}`, color: "#ef4444" },
    { label: "Expectancy", value: `$${stats.expectancy.toFixed(2)}/trade`, color: stats.expectancy >= 0 ? "#22c55e" : "#ef4444" },
    { label: "Profit Factor", value: stats.profitFactor === Infinity ? "∞" : stats.profitFactor.toFixed(2), color: stats.profitFactor >= 1 ? "#22c55e" : "#ef4444" },
    { label: "Best Trade", value: `$${stats.bestTrade.toFixed(0)}`, color: "#22c55e" },
    { label: "Worst Trade", value: `$${stats.worstTrade.toFixed(0)}`, color: "#ef4444" },
    { label: "Best Day", value: `$${stats.bestDay.toFixed(0)}`, color: "#22c55e" },
    { label: "Worst Day", value: `$${stats.worstDay.toFixed(0)}`, color: "#ef4444" },
    { label: "Max Drawdown", value: `$${stats.maxDrawdown.toFixed(0)}`, color: "#ef4444" },
    { label: "Avg Risk/Reward", value: stats.avgLoser > 0 ? `${(stats.avgWinner / stats.avgLoser).toFixed(2)}:1` : "N/A" },
  ];

  return (
    <div style={{ borderTop: "1px solid rgba(99,102,241,0.15)", paddingTop: 12, marginTop: 4 }}>
      <div
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", marginBottom: expanded ? 10 : 0 }}
        onClick={() => setExpanded(e => !e)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <BarChart3 size={13} style={{ color: C.primary }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: C.text.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>All Stats</span>
        </div>
        <ChevronDown size={13} style={{ color: C.text.muted, transform: expanded ? "rotate(180deg)" : "none", transition: "0.2s" }} />
      </div>
      {expanded && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px" }}>
          {rows.map(r => (
            <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <span style={{ fontSize: 11, color: C.text.muted }}>{r.label}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: r.color || C.text.secondary }}>{r.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── STATS PANEL ─────────────────────────────────────────────────────────────
function StatsPanel({ trades, dailyGoal, weeklyGoal, monthlyGoal, dailyLossLimit }) {
  const stats = computeStats(trades);

  if (!trades || trades.length === 0) {
    return (
      <div style={{
        background: "rgba(99, 102, 241, 0.05)",
        border: "1px dashed rgba(99, 102, 241, 0.3)",
        borderRadius: 12,
        padding: 24,
        textAlign: "center",
      }}>
        <Activity size={28} style={{ color: C.primary, margin: "0 auto 12px" }} />
        <div style={{ fontSize: 13, fontWeight: 600, color: C.text.secondary, marginBottom: 6 }}>Start Logging Trades</div>
        <div style={{ fontSize: 12, color: C.text.muted }}>Add trades to your journal to see your analytics here</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Today's Snapshot */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <Zap size={13} style={{ color: C.primary }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: C.text.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Today</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6 }}>
          <StatCard icon={<DollarSign size={11} />} label="P&L" value={stats.todayStats.pnl} />
          <StatCard icon={<TrendingUp size={11} />} label="Wins" value={stats.todayStats.wins} color="#22c55e" />
          <StatCard icon={<TrendingDown size={11} />} label="Losses" value={stats.todayStats.losses} color="#ef4444" />
          <StatCard
            icon={<Flame size={11} />}
            label="Streak"
            value={stats.currentStreak}
            sub={stats.currentStreak > 0 ? "Wins" : stats.currentStreak < 0 ? "Losses" : "None"}
          />
        </div>
      </div>

      {/* Equity Curve */}
      <EquityCurveChart trades={trades} />

      {/* Win Rate + P&L by Symbol side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* Win Rate Pie */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <PieChart size={13} style={{ color: C.primary }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: C.text.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Win Rate</span>
          </div>
          <div style={{ textAlign: "center" }}>
            <ResponsiveContainer width="100%" height={100}>
              <RePieChart>
                <Pie data={[{ name: "Wins", value: trades.filter(t => t.pnl > 0).length }, { name: "Losses", value: trades.filter(t => t.pnl <= 0).length }]} cx="50%" cy="50%" innerRadius={28} outerRadius={45} dataKey="value" startAngle={90} endAngle={-270}>
                  <Cell fill="#22c55e" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#1e1b4b", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 8, fontSize: 11 }}
                />
              </RePieChart>
            </ResponsiveContainer>
            <div style={{ fontSize: 22, fontWeight: 800, color: stats.winRate >= 50 ? "#22c55e" : "#ef4444" }}>{stats.winRate.toFixed(0)}%</div>
            <div style={{ fontSize: 10, color: C.text.muted }}>{trades.filter(t => t.pnl > 0).length}W / {trades.filter(t => t.pnl <= 0).length}L</div>
          </div>
        </div>

        {/* P&L by Symbol */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <BarChart3 size={13} style={{ color: C.primary }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: C.text.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>P&L by Symbol</span>
          </div>
          {Object.keys(stats.pnlBySymbol).length === 0 ? (
            <div style={{ fontSize: 11, color: C.text.muted, textAlign: "center", padding: "20px 0" }}>No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={Object.entries(stats.pnlBySymbol).map(([name, value]) => ({ name, value }))} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 9, fill: "rgba(255,255,255,0.4)" }} tickFormatter={v => `$${v}`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: C.text.muted }} width={30} />
                <Tooltip
                  formatter={(val) => [`$${val.toFixed(0)}`, "P&L"]}
                  contentStyle={{ background: "#1e1b4b", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 8, fontSize: 11 }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {Object.entries(stats.pnlBySymbol).map(([_, value], i) => (
                    <Cell key={i} fill={value >= 0 ? "#22c55e" : "#ef4444"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Session Breakdown */}
      <SessionBreakdown trades={trades} />

      {/* Day of Week */}
      <DayOfWeekHeatmap trades={trades} />

      {/* Setup Performance */}
      <SetupPerformance trades={trades} />

      {/* Streak Tracker */}
      <StreakTracker trades={trades} />

      {/* Goal Progress */}
      <GoalProgress trades={trades} dailyGoal={dailyGoal} weeklyGoal={weeklyGoal} monthlyGoal={monthlyGoal} />

      {/* Prop Guardrails */}
      <PropGuardrails trades={trades} dailyLossLimit={dailyLossLimit} />

      {/* Deeper Stats */}
      <DeeperStats trades={trades} />
    </div>
  );
}
```

---

## TASK 8: Update CommandCenterPage — Replace Right Column with StatsPanel

**File:** `src/App.jsx` — CommandCenterPage (around line 2207-2215)

- [ ] **Step 1: Read the exact current right column code (lines 2207-2215)**

- [ ] **Step 2: Replace the right column**

Update the right column to include DashboardCalendar on top, then StatsPanel below it. Replace this:

```jsx
<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
  <DashboardCalendar />
</div>
```

With this:

```jsx
<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
  <DashboardCalendar />
  <StatsPanel
    trades={trades}
    dailyGoal={dailyGoal}
    weeklyGoal={weeklyGoal}
    monthlyGoal={monthlyGoal}
    dailyLossLimit={dailyLossLimit}
  />
</div>
```

- [ ] **Step 3: Pass new props to CommandCenterPage**

Find the `CommandCenterPage` function signature (line ~2043). Add the new props:

```javascript
function CommandCenterPage({ trades, session, propAccounts, setPage, dailyGoal, weeklyGoal, monthlyGoal, dailyLossLimit }) {
```

- [ ] **Step 4: Update the call to CommandCenterPage**

Find where `CommandCenterPage` is rendered (around line where it says `<CommandCenterPage`). Add the new props:

```jsx
<CommandCenterPage
  trades={trades}
  session={session}
  propAccounts={propAccounts}
  setPage={setPage}
  dailyGoal={dailyGoal}
  weeklyGoal={weeklyGoal}
  monthlyGoal={monthlyGoal}
  dailyLossLimit={dailyLossLimit}
/>
```

---

## TASK 9: Add Moon icon import

**File:** `src/App.jsx` — imports section (line 10)

- [ ] **Step 1: Check if Moon is already imported**

Look at line 10. If `Moon` is not in the lucide-react import, add it:

```javascript
Sun, ArrowUpRight, ArrowDownRight, Search, Trash2, Bell, Check, Lock,
// ...
Moon  // add this
```

---

## TASK 10: Build & Verify

- [ ] **Step 1: Run the build**

```bash
cd /Users/grayhawkstudios/EightSevenHQ-V4 && npm run build
```

Expected: Clean build with no errors.

- [ ] **Step 2: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 3: Verify**

1. Dashboard loads without blank screen
2. No "TrumpTwitterFeed" anywhere in the file (`grep -n "TrumpTwitterFeed" src/App.jsx` should return nothing)
3. StatsPanel renders (even if empty state — "Start Logging Trades" message shows)
4. Stats computed correctly from existing journal trades
5. Goal settings appear in SettingsPage
6. All charts render (equity curve, win rate pie, P&L by symbol bar chart)

---

## Verification Checklist

- [ ] `grep -n "TrumpTwitterFeed" src/App.jsx` → no results
- [ ] `npm run build` → clean exit (exit code 0)
- [ ] Dashboard loads and shows StatsPanel
- [ ] Stats computed correctly (win rate, expectancy, etc.)
- [ ] Goal/daily loss limit inputs work in Settings
- [ ] No console errors on dashboard load
