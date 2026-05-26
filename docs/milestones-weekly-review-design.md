# Milestones + Weekly Review System — Design Spec

**Date:** 2026-04-09
**Project:** 87Capital Trading OS (Prop Firm Hub)
**Status:** Draft for review

---

## 1. Concept & Vision

A celebration and tracking layer that sits on top of the trading journal. Milestones turn good habits and hard-earned wins into visible achievements — the kind of dopamine hit that keeps you showing up. The Weekly Review closes the loop every Sunday: honest reflection on last week, sharp focus for the week ahead. Everything auto-tracks from existing data where possible; manual additions are minimal.

---

## 2. Milestones

### 2a. Data & State

New state added to App root:
```js
const [milestones, setMilestones] = useState([]); // persisted to localStorage
const [weeklyReviews, setWeeklyReviews] = useState([]); // persisted to localStorage
```

`milestones` shape:
```js
{
  id: Date.now(),
  type: "trading" | "propfirm" | "habit" | "custom",
  label: string,
  description: string,
  achievedAt: ISOstring | null,
  target: number | null,   // e.g. 5 for "5 green days"
  current: number,          // tracked from journal/prop accounts
  icon: string,             // emoji or lucide icon name
}
```

`weeklyReviews` shape:
```js
{
  id: Date.now(),
  weekStart: "YYYY-MM-DD",  // Monday of the week
  grade: "A" | "B" | "C" | "D" | "F",
  wentWell: string,
  improve: string,
  nextWeekGoal: string,
  nextWeekAvoid: string,
  milestonesHit: number[],
}
```

### 2b. Milestone Definitions

**Trading Milestones (auto-computed from `trades`):**

| ID | Label | Description | Trigger |
|----|-------|-------------|---------|
| T1 | First Green Day | Closed a profitable day | `dailyPnl > 0` first time |
| T2 | 3-Day Green Streak | 3 consecutive profitable days | streak of 3 |
| T3 | 5-Day Green Streak | 5 consecutive profitable days | streak of 5 |
| T4 | 10-Day Green Streak | 10 consecutive profitable days | streak of 10 |
| T5 | 50% Win Rate | Hit 50% win rate | `winRate >= 50%` |
| T6 | 60% Win Rate | Hit 60% win rate | `winRate >= 60%` |
| T7 | 70% Win Rate | Hit 70% win rate | `winRate >= 70%` |
| T8 | First A+ Trade | First A+ graded trade | any trade with grade "A+" |
| T9 | Best Trade | Beat your all-time best | `bestTrade > previousBest` |
| T10 | $1K Profitable Week | $1,000+ profit in a calendar week | `weeklyPnl >= 1000` |
| T11 | $5K Profitable Month | $5,000+ profit in a calendar month | `monthlyPnl >= 5000` |
| T12 | $10K Profitable Month | $10,000+ profit in a calendar month | `monthlyPnl >= 10000` |
| T13 | 100 Trades Logged | 100 trades in journal | `trades.length >= 100` |
| T14 | 500 Trades Logged | 500 trades in journal | `trades.length >= 500` |
| T15 | Journal Streak 7 | Journaled 7 days in a row | 7 consecutive days with entries |
| T16 | Journal Streak 30 | Journaled 30 days in a row | 30 consecutive days |

**Prop Firm Milestones (auto-computed from `propAccounts` + `payouts`):**

| ID | Label | Description | Trigger |
|----|-------|-------------|---------|
| P1 | First Evaluation | Added first evaluation account | first `propAccounts` entry |
| P2 | First Funded | First account became funded | `account.status === "funded"` |
| P3 | 3 Funded Accounts | 3 simultaneous funded accounts | `fundedCount >= 3` |
| P4 | First Payout | Received first payout | first entry in `payouts` |
| P5 | $1K Total Payouts | $1,000 in total payouts | `totalPayouts >= 1000` |
| P6 | $5K Total Payouts | $5,000 in total payouts | `totalPayouts >= 5000` |
| P7 | $10K Total Payouts | $10,000 in total payouts | `totalPayouts >= 10000` |
| P8 | Net Profit Positive | Net profit goes positive | `netProfit > 0` |

**Habit Milestones (auto-computed from `trades` + weekly review history):**

| ID | Label | Description | Trigger |
|----|-------|-------------|---------|
| H1 | Pre-Session Planner | First pre-session plan written | first entry |
| H2 | 7-Day Journal Streak | Logged trades 7 days straight | 7 days with trades |
| H3 | 30-Day Journal Streak | Logged trades 30 days straight | 30 days |
| H4 | 90-Day Journal Streak | Logged trades 90 days straight | 90 days |
| H5 | Week Review Done | Completed first weekly review | first `weeklyReviews` entry |
| H6 | 4 Weeks Reviewed | Completed 4 weekly reviews | `weeklyReviews.length >= 4` |
| H7 | 12 Weeks Reviewed | Completed 12 weekly reviews | `weeklyReviews.length >= 12` |
| H8 | Zero B Trades | A whole week with no B trades | weekly B grade count = 0 |

### 2c. Milestone Detection

On every `trades` or `propAccounts` or `payouts` change, run `checkMilestones()` — a pure function that:
1. Loads existing `milestones` from state
2. Computes current values for all milestone types
3. Marks any newly achieved milestones (sets `achievedAt = now()`)
4. Returns updated milestones array
5. If any new milestone was achieved → show a brief toast: "🏆 Milestone unlocked: [label]"

Only newly achieved milestones get toast + `achievedAt` timestamp. Already-achieved milestones are never re-triggered.

### 2d. Milestones Dashboard Strip

**Location:** Bottom of `CommandCenterPage`, above the `TradePanel`
**Style:** Horizontal scrollable row of milestone badges
- **Unachieved:** dim, grey, shows icon + label + progress bar (e.g., "3/5 green days")
- **Achieved:** glowing accent border, accent color, shows checkmark + achieved date
- **On tap:** opens full `MilestonesPage`

Layout:
```
┌────────────────────────────────────────────────────────────────────────────┐
│ 🏆 MILESTONES                                        View All →             │
│ [✓ First Green Day] [✓ 50% WR] [○ 5-Day Streak 3/5] [✓ First Payout] ... │
└────────────────────────────────────────────────────────────────────────────┘
```

### 2e. Milestones Page (Full View)

Reached by tapping "View All" or from sidebar nav.

Layout:
- Hero header: "Your Achievements" + achieved count / total
- Three collapsible sections: Trading | Prop Firm | Habit
- Each section shows achievement cards with:
  - Icon + label
  - Description
  - Progress bar (if not achieved)
  - "Achieved [date]" badge (if achieved)
  - Subtle confetti burst animation on newly achieved items

Sidebar nav item: Trophy icon next to Analytics

---

## 3. Weekly Review System

### 3a. Auto-Detection Logic

On app load, check if:
1. Today is Monday (new week starts)
2. The last `weeklyReview.weekStart` is more than 7 days old
3. User has journaled in the past 7 days

If all true → show Weekly Review modal automatically.

### 3b. Weekly Review Modal

**Trigger:** Auto on app load (Monday visit) or manual "Week Review" button
**Style:** Full-screen modal, blurred backdrop, Ice Glass card centered

**Header:**
```
WEEK IN REVIEW
April 1–7, 2026
[Skip for now]                            [Submit Review →]
```

**Section 1: Grade the Week**
- Large A/B/C/D/F selector buttons
- Labels: A=Excellent B=Good C=Average D=Poor F=Failed
- Visual: selected grade gets accent glow

**Section 2: What Went Well**
- Textarea, 3-4 lines
- Placeholder: "The pre-session planning really helped today..."
- Character count

**Section 3: What to Improve**
- Textarea, 3-4 lines
- Placeholder: "I let one trade run too long and got emotional..."

**Section 4: Next Week's Focus**
- "Top Goal" — single line input
  - Placeholder: "e.g. Stick to my 2-trade rule"
- "What to Avoid" — single line input
  - Placeholder: "e.g. Adding to losing trades"

**Section 5: Milestone Moment**
- Shows any milestones achieved this week
- "🎉 [X milestones] hit this week!" with the list
- If none: "Keep pushing — you're building something real."

**Submit behavior:**
- Saves `weeklyReviews` to localStorage
- Triggers milestone check for H5, H6, H7 (week review streaks)
- Toast: "Week reviewed. Onward to next week."
- Modal closes

**Skip behavior:**
- Modal dismisses without saving
- Remembers skip — won't auto-prompt again for the same week

### 3c. Weekly Review Page

Accessible from sidebar nav (separate page) or from the Milestones page.

Shows:
- **Recent reviews** — last 4 weeks in a grid, grade badges, click to expand
- **Weekly P&L chart** — bar chart from trades, colored by profit/loss
- **Top stats for the week** — trades this week, win rate, best trade, worst trade
- **Habit check** — did you journal every day? Did you write pre-session plans?

---

## 4. Data Flow

```
trades / propAccounts / payouts change
       ↓
checkMilestones(newData, milestones)
       ↓
newMilestones[] returned
       ↓
setMilestones(newMilestones)
       ↓
if (newMilestones.length > 0)
  showMilestoneToast(newest)
  setPendingCelebration(newMilestones)  // for MilestonesPage
```

```
App load → isWeeklyReviewDue() → if true → show WeeklyReviewModal
WeeklyReviewModal submit → saveWeeklyReview(data) → checkMilestones() → milestone check for habit milestones
```

---

## 5. Sidebar Navigation

Add nav items:
- **Trophy** icon → MilestonesPage
- **Calendar** icon → Weekly Review (same as "Week Review" button, just a nav shortcut)

Both already in existing lucide-react imports.

---

## 6. Error Handling

- Milestone check is pure — wrapped in try/catch, never crashes app
- Weekly review modal skips gracefully if user has no trades (shows "No trades this week — review anyway?")
- If localStorage is full/corrupt, gracefully degrades — no milestones shown, no review prompt

---

## 7. Out of Scope (Future)

- Social sharing of milestones
- Custom milestone creation (Phase 2)
- Push notifications for weekly review reminders
- Milestone streaks / seasons

---

## 8. Summary

| Component | Where | Trigger |
|-----------|-------|---------|
| Milestone strip | Dashboard bottom | Always visible |
| Milestones page | Nav → Trophy | Full achievement board |
| Weekly Review modal | App load (Monday) | Auto on Monday visit |
| Weekly Review page | Nav → Calendar | Review history + stats |

Milestone detection runs silently on every data change. Weekly Review auto-prompts Monday mornings. Both layers build on existing data — no new manual entry required for most milestones.
