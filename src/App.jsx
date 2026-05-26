import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  BarChart3, Calendar, BookOpen, Target, FileText, TrendingUp, TrendingDown,
  DollarSign, Activity, Brain, Shield, Settings, Play, Square, Edit3,
  Calculator, Quote, Timer, Zap, AlertTriangle, CheckCircle, Building,
  LayoutDashboard, Radio, Clock, Eye, X, Plus,  ChevronRight, ChevronLeft, ChevronDown, ChevronUp,
  Sun, ArrowUpRight, ArrowDownRight, Search, Trash2, Bell, Check, Lock,
  Briefcase, Globe, Star, Coffee, Flame, Crosshair, Camera, Save,
  ExternalLink, RefreshCw, Gauge, Award, MessageSquare, Send, CreditCard, Receipt,
   Download, Upload, Sparkles, PieChart, TrendingUp as TrendingIcon, Filter, EyeOff, Moon,
   Trophy, ClipboardCheck
} from "lucide-react";
import jsPDF from "jspdf";
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart as RePieChart, Pie, Cell, BarChart, Bar,
  Legend, ReferenceLine
} from "recharts";

// ─── ERROR BOUNDARY ─────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("Error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: "center", color: "#ef4444" }}>
          <h2>Something went wrong</h2>
          <pre style={{ textAlign: "left", background: "rgba(0,0,0,0.3)", padding: 20, borderRadius: 12, marginTop: 20, fontSize: 12, overflow: "auto" }}>
            {this.state.error?.toString()}
          </pre>
          <button onClick={() => window.location.reload()} style={{ marginTop: 20, padding: "12px 24px", background: "#b026ff", border: "none", borderRadius: 8, color: "white", cursor: "pointer", boxShadow: "0 0 20px rgba(176, 38, 255, 0.4)" }}>
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── THEME & CONSTANTS ──────────────────────────────────────────────────────
// V4.5 — Near-pure black / Blue primary / Warm stone neutrals
const C = {
  // Surfaces
  bg: "#000000",
  bgCard: "rgba(0, 0, 0, 0.6)",
  bgCardAlt: "rgba(0, 0, 0, 0.5)",
  bgHover: "rgba(255, 255, 255, 0.04)",
  bgGlass: "rgba(0, 0, 0, 0.5)",
  // Borders
  border: "rgba(87, 83, 78, 0.2)",
  borderLight: "rgba(87, 83, 78, 0.1)",
  borderGlow: "rgba(59, 130, 246, 0.15)",
  // Primary Blue (brand)
  accent: "#3b82f6",
  accentLight: "#60a5fa",
  accentGlow: "rgba(59, 130, 246, 0.25)",
  accentDark: "#2563eb",
  // Purple (subtle brand accent — neon edge glow)
  purple: "#8b5cf6",
  purpleGlow: "rgba(139, 92, 246, 0.1)",
  // Cream / Off-white (Topstep-style primary buttons)
  cream: "#f5f0e8",
  creamHover: "#ede6db",
  creamText: "#0c0a09",
  // Blue (restrained focus rings & link affordance)
  blue: "#3b82f6",
  blueLight: "#60a5fa",
  blueGlow: "rgba(59, 130, 246, 0.2)",
  blueRing: "rgba(59, 130, 246, 0.35)",
  // Semantic — emerald (positive) / amber (caution/loss)
  emerald: "#10b981",
  emeraldLight: "#34d399",
  emeraldBg: "rgba(16, 185, 129, 0.1)",
  emeraldBorder: "rgba(16, 185, 129, 0.2)",
  emeraldGlow: "rgba(16, 185, 129, 0.1)",
  amber: "#d97706",
  amberLight: "#f59e0b",
  amberBg: "rgba(217, 119, 6, 0.1)",
  amberBorder: "rgba(217, 119, 6, 0.2)",
  amberGlow: "rgba(217, 119, 6, 0.1)",
  // Warm accent (milestones, celebrations)
  gold: "#d97706",
  goldLight: "#f59e0b",
  goldBg: "rgba(217, 119, 6, 0.1)",
  goldBorder: "rgba(217, 119, 6, 0.2)",
  goldGlow: "rgba(217, 119, 6, 0.12)",
  // Text (warm stone palette)
  text: "#f5f5f4",
  textMuted: "#a8a29e",
  textDim: "#78716c",
  textOnPrimary: "#ffffff",
  white: "#ffffff",
  // Radii
  radiusInput: 10,
  radiusCard: 14,
  radiusBtn: 10,
  radiusModal: 18,
  radiusPill: 9999,
  // Shadows
  shadowCard: "0 1px 2px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.1)",
  shadowCardLg: "0 2px 4px rgba(0,0,0,0.2), 0 8px 16px rgba(0,0,0,0.15)",
  shadowBtn: "0 1px 2px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
  shadowGlow: "0 0 0 3px rgba(59,130,246,0.15), 0 8px 28px rgba(59,130,246,0.1)"
};

const QUOTES = [
  "Trade the chart, not your P&L.",
  "Consistency over intensity.",
  "Protect your capital first.",
  "The market rewards patience.",
  "Smart money leaves footprints.",
  "Your journal is your most profitable indicator.",
  "Every trade is a lesson waiting to be learned.",
  "Discipline beats intelligence."
];

const PROP_FIRMS = ["TopStepTrader", "ApexTrader", "ApexFutures", "MyFundedFX", "FTMO", "Blue Guardian", "Lux Trading", "The Funded Trader"];

const TICKERS = ["NQ", "ES", "YM", "RTY", "CL", "GC", "SI", "NG", "ZB", "ZN"];

// ─── NOTION JOURNAL FIELD OPTIONS ──────────────────────────────────────────
const HTF_ORDERFLOW = ["Bullish", "Bearish", "Neutral", "Bar Code"];
const MMXM_OPTIONS = ["MMBM", "MMSM"];
const MIDNIGHT_OPEN = ["Above (Premium)", "Below (Discount)"];
const NEWS_DAY = ["YES", "NO", "FOMC", "NFP", "CPI", "PMI", "Pre FOMC", "Trump", "PPI"];
const PRE_ARDAS = ["Yes", "No"];
const POST_ARDAS = ["Yes", "No", "Partial"];
const SMR_TIME = ["08:29", "08:30", "08:50", "08:55", "08:59", "09:00", "09:01", "09:20", "09:30", "09:45", "09:55", "10:00", "10:01", "10:45", "10:58", "11:00", "11:45", "12:00", "12:15", "13:30", "13:45", "13:50", "14:00", "14:10", "14:45", "14:50", "15:00"];
const TOI_TIME = ["08:30 Open", "08:50 - 9:10AM", "08:55 - 09:10", "09:20 - 9:40", "09:30 Open", "09:45-10:15AM", "10:00 - 10:30", "10:45-11:15 AM", "11:00 - 11:30", "11:45 - 12:15", "13:30", "13:45-14:15", "13:50-14:10PM", "14:00 - 14:30", "14:45 - 15:10", "15:00 - 15:30", "AM Silver Bullet", "PM Silver Bullet", "NYPM Macro", "Lunch Macro", "None", "Not in macro"];
const TRADE_TOOK = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+", "1 BE", "1 Loss", "1 Win", "2 BE", "2 Loss", "2 Win", "3 BE", "3 Loss", "3 Win", "4 BE", "4 Loss", "5 Loss", "2 Profit BE", "1 PBE", "Gambling"];
const LIQUIDITY_OPTIONS = ["LO LOW", "LO HIGH", "NYAM LOW", "NYAM HIGH", "NWOG", "PDH", "PDL", "PCH", "PCL", "PWH", "PWL", "Minor BSL", "Mid of Range", "50% of Range", "15min FVG", "5m FVG", "1st P FVG", "Asian Low", "Equal Highs", "ATH", "ATL", "Sellside", "Buyside", "Friday High", "Friday Low", "Oct 16 Liq"];

// Post Session Options
const EMOTIONS = ["Calm", "FOMO", "Anxious", "Angry", "Revenge", "Greedy", "Confident", "Confused", "Tired", "Focused", "Frustrated", "Peaceful", "Excited"];
const POST_TRADE_ACTIONS = ["Added to Winner", "Partial Exit", "Moved SL", "Widened SL", "Tightened SL", "Trailed SL", "Ignored Plan", "Followed Plan", "Early Exit", "Held Full", "Scaled In", "Scaled Out", "No Action"];
const SESSION_QUALITY = ["Excellent", "Good", "Average", "Poor", "Terrible"];
const MENTAL_STATE = ["10/10", "9/10", "8/10", "7/10", "6/10", "5/10", "4/10", "3/10", "2/10", "1/10"];
const ENERGY_LEVEL = ["Very High", "High", "Normal", "Low", "Very Low"];
const DISTRACTIONS = ["Phone", "Social Media", "Family", "News", "Other Charts", "Chat", "Food", "None"];

// Edit Trade options
const SETUP_GRADES = ["A+", "A", "B+", "B", "C", "D", "F"];
const ENTRY_MODELS = ["Unicorn", "FVG", "IFVG", "OB", "BRKR", "CISD", "Turtle Soup", "RTH Gap Fill"];
const MISTAKES = ["Overtrading", "Revenge Trading", "FOMO", "Ignored Stop Loss", "No Plan", "Wrong Direction", "Early Exit", "Held Too Long", "Size Too Big", "No Confluence", "Chasing Price", "News Fade", "Late Entry", "Green Bleed"];

const TRADING_RULES = [
  "Only trade during Kill Zones (NY AM 9:30-11:00, NY PM 13:30-15:00)",
  "Must have HTF PD Array confluence before entry",
  "Maximum 2 trades per session — no exceptions",
  "Minimum 1:2 Risk-to-Reward ratio required",
  "No trading on high-impact news without a plan",
  "Wait for SMT divergence confirmation",
  "Stop loss must be placed beyond swing structure",
  "Never move stop loss against your position",
  "If 2 consecutive losses — session is DONE",
  "Ardas before every session — mind must be clear"
];

// ─── STYLES (V4.5 — Near-black / Blue primary / Warm stone) ─────────────────
const S = {
  glassCard: {
    background: "rgba(0, 0, 0, 0.55)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: C.radiusCard,
    border: `1px solid ${C.border}`,
    boxShadow: C.shadowCard,
    transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)"
  },
  input: {
    background: "rgba(0, 0, 0, 0.5)",
    border: `1px solid ${C.border}`,
    borderRadius: C.radiusInput,
    padding: "10px 16px",
    color: C.text,
    fontSize: 14,
    outline: "none",
    width: "100%",
    fontFamily: "Inter, sans-serif",
    transition: "all 0.2s ease",
    boxShadow: "none"
  },
  inputFocus: {
    borderColor: C.blue,
    boxShadow: `0 0 0 2px ${C.blueRing}`
  },
  btn: (variant = "primary", size = "md") => {
    const sizes = {
      xs: { padding: "4px 10px", fontSize: 11 },
      sm: { padding: "8px 14px", fontSize: 12 },
      md: { padding: "10px 16px", fontSize: 14 },
      lg: { padding: "14px 24px", fontSize: 16 }
    };
    const variants = {
      primary: { background: C.cream, color: C.creamText, border: "none", fontWeight: 600, boxShadow: C.shadowBtn },
      secondary: { background: "rgba(5, 8, 16, 0.6)", border: `1px solid ${C.border}`, boxShadow: "none" },
      success: { background: `linear-gradient(135deg, ${C.emerald}, #047857)`, border: "none", boxShadow: `0 0 16px ${C.emeraldGlow}` },
      danger: { background: `linear-gradient(135deg, ${C.amber}, #78350f)`, border: "none" },
      ghost: { background: "transparent", border: `1px solid ${C.border}` },
      glass: { background: "rgba(0, 0, 0, 0.65)", border: `1px solid ${C.border}`, color: C.text, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }
    };
    return {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      borderRadius: C.radiusBtn,
      cursor: "pointer",
      fontWeight: 600,
      fontFamily: "Inter, sans-serif",
      color: C.white,
      transition: "all 0.2s ease",
      ...sizes[size],
      ...variants[variant]
    };
  },
  badge: (color, glow = false) => ({
    display: "inline-flex",
    alignItems: "center",
    padding: "3px 10px",
    borderRadius: C.radiusPill,
    fontSize: 11,
    fontWeight: 600,
    background: `${color}15`,
    color: color,
    border: `1px solid ${color}25`,
    boxShadow: glow ? `0 0 16px ${color}25` : "none"
  }),
  label: {
    fontSize: 11,
    fontWeight: 600,
    color: C.textDim,
    marginBottom: 8,
    display: "block",
    textTransform: "uppercase",
    letterSpacing: "0.06em"
  },
  grid: (cols, gap = 20) => ({ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap }),
  between: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  page: { padding: 32, maxWidth: 1400, margin: "0 auto" }
};

// ─── UTILITIES ───────────────────────────────────────────────────────────────
const fmt = (n) => (n >= 0 ? "+" : "") + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtUsd = (n) => "$" + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pnlColor = (n) => n >= 0 ? C.emerald : C.amber;
const pnlBg = (n) => n >= 0 ? C.emeraldBg : C.amberBg;
const today = () => new Date().toISOString().split("T")[0];
const gradeColor = (g) => g === "A+" || g === "A" ? C.emerald : g === "B+" || g === "B" ? C.amber : C.amber;
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

const getApiBaseUrl = () => {
  const fromEnv = (import.meta.env.VITE_API_BASE_URL || "").trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (typeof window === "undefined") return "";
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") return "http://localhost:3001";
  return "";
};

const getWsUrl = () => {
  const fromEnv = (import.meta.env.VITE_WS_URL || "").trim();
  if (fromEnv) return fromEnv;
  if (typeof window === "undefined") return "";
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") return "ws://localhost:3001/ws";
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/ws`;
};

// ─── TOAST SYSTEM ─────────────────────────────────────────────────────────────
function Toast({ toast, onDismiss }) {
  if (!toast) return null;
  
  const bgColor = toast.type === "success" ? C.emerald : toast.type === "error" ? C.amber : toast.type === "warning" ? C.yellow : C.accent;
  const textColor = toast.type === "success" || toast.type === "error" ? C.white : toast.type === "warning" ? C.bg : C.white;
  
  return (
    <div style={{
      position: "fixed",
      bottom: 24,
      right: 24,
      zIndex: 9999,
      animation: "slideInRight 0.3s ease-out"
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "16px 20px",
        borderRadius: 14,
        background: `linear-gradient(135deg, ${bgColor}, ${bgColor}dd)`,
        color: textColor,
        boxShadow: `0 8px 32px ${bgColor}40`,
        minWidth: 280,
        maxWidth: 400
      }}>
        {toast.type === "success" && <CheckCircle size={20} />}
        {toast.type === "error" && <AlertTriangle size={20} />}
        {toast.type === "warning" && <AlertTriangle size={20} />}
        {toast.type === "info" && <Bell size={20} />}
        <span style={{ fontWeight: 600, fontSize: 14, flex: 1 }}>{toast.message}</span>
        <button 
          onClick={onDismiss}
          style={{
            background: "transparent",
            border: "none",
            color: textColor,
            cursor: "pointer",
            padding: 4,
            opacity: 0.7,
            display: "flex",
            alignItems: "center"
          }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────
const Select = ({ label, value, onChange, options }) => (
  <div>
    {label && <label style={S.label}>{label}</label>}
    <select value={value} onChange={e => onChange(e.target.value)} style={{
      ...S.input, cursor: "pointer", appearance: "none",
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 12px center",
      paddingRight: 36
    }}>
      <option value="" style={{ background: C.bgCard }}>Select...</option>
      {options.map(o => <option key={o} value={o} style={{ background: C.bgCard }}>{o}</option>)}
    </select>
  </div>
);

const ChipSelect = ({ label, options, selected, onChange }) => (
  <div>
    {label && <label style={S.label}>{label}</label>}
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map(o => {
        const active = selected.includes(o);
        return (
          <button key={o} onClick={() => onChange(active ? selected.filter(s => s !== o) : [...selected, o])}
            style={{
              padding: "8px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer",
              background: active ? `${C.gold}25` : "rgba(0,0,0,0.3)",
              color: active ? C.goldLight : C.textDim,
              border: `1px solid ${active ? C.goldBorder : C.border}`,
              fontFamily: "Inter", transition: "all 0.2s ease"
            }}>
            {o}
          </button>
        );
      })}
    </div>
  </div>
);

const ProgressBar = ({ value, max, color = C.gold, showLabel = true }) => {
  const pct = clamp((value / max) * 100, 0, 100);
  const isDanger = pct >= 80;
  return (
    <div style={{ width: "100%" }}>
      {showLabel && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 11, color: C.textMuted }}>
          <span>{fmtUsd(value)}</span>
          <span>{fmtUsd(max)} ({pct.toFixed(1)}%)</span>
        </div>
      )}
      <div style={{ height: 8, background: "rgba(0,0,0,0.4)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{
          width: `${pct}%`, height: "100%",
          background: `linear-gradient(90deg, ${isDanger ? C.amber : color}, ${isDanger ? C.amber : color}80)`,
          borderRadius: 4, transition: "width 0.5s ease",
          boxShadow: `0 0 10px ${isDanger ? C.amber : color}60`
        }} />
      </div>
    </div>
  );
};

const MiniStat = ({ icon: Icon, label, value, color = C.gold }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 12, padding: "14px 18px",
    background: C.bgCardAlt, borderRadius: 14, border: `1px solid ${C.border}`
  }}>
    <div style={{
      width: 40, height: 40, borderRadius: 12,
      background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <Icon size={18} color={color} />
    </div>
    <div>
      <div style={{ fontSize: 10, color: C.textDim, textTransform: "uppercase", fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 800, color }}>{value}</div>
    </div>
  </div>
);

// ─── LOGO ────────────────────────────────────────────────────────────────────
function Logo({ size = 40 }) {
  return (
    <img 
      src="/logo-87capital.svg" 
      alt="87Capital" 
      style={{ width: size, height: size }}
      onError={(e) => {
        // Fallback to text logo if SVG not found
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'flex';
      }}
    />
  );
}

function TextLogo() {
  return (
    <div style={{
      display: "none", // Hidden by default, shown on error
      width: 40, height: 40, borderRadius: 12,
      background: `linear-gradient(135deg, ${C.gold}, ${C.yellow})`,
      alignItems: "center", justifyContent: "center",
      fontWeight: 900, fontSize: 14, color: C.bg,
      boxShadow: `0 4px 16px ${C.goldGlow}`
    }}>87</div>
  );
}

// ─── TRADINGVIEW WIDGET ─────────────────────────────────────────────────────
function TradingViewWidget({ symbol = "NASDAQ:MES1!" }) {
  return (
    <div style={{ height: "100%", width: "100%", borderRadius: 16, overflow: "hidden" }}>
      <iframe
        src={`https://www.tradingview.com/widgetembed/?symbol=${encodeURIComponent(symbol)}&interval=5&theme=dark&style=1&timezone=America%2FNew_York&hide_top_toolbar=false&hide_legend=false&save_image=true&studies=[]&height=100%25&width=100%25`}
        width="100%"
        height="100%"
        frameBorder="0"
        allowTransparency
        title="TradingView Chart"
        style={{ display: "block" }}
      />
    </div>
  );
}

// ─── SESSION TIMER ──────────────────────────────────────────────────────────
function SessionTimer({ startTime, active, onToggle }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!active || !startTime) return;
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(id);
  }, [active, startTime]);

  useEffect(() => {
    if (!active) setElapsed(0);
  }, [active]);

  const format = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      ...S.glassCard, padding: "12px 20px", display: "flex", alignItems: "center", gap: 14,
      boxShadow: active ? `0 0 30px ${C.emeraldGlow}` : "none",
      borderColor: active ? C.emeraldBorder : C.border
    }}>
      <Timer size={20} color={active ? C.emerald : C.textDim} />
      <span style={{ fontSize: 20, fontWeight: 800, fontFamily: "monospace", color: active ? C.emerald : C.text }}>
        {format(elapsed)}
      </span>
      {active && <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.emerald, animation: "livePulse 1.5s ease-in-out infinite" }} />}
      <button onClick={onToggle} style={S.btn("ghost", "sm")}>
        {active ? <Square size={14} /> : <Play size={14} />}
      </button>
    </div>
  );
}

// ─── ZEN QUOTE WIDGET ────────────────────────────────────────────────────────
function ZenQuote() {
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  return (
    <div style={{
      ...S.glassCard, padding: 20,
      background: `linear-gradient(135deg, ${C.goldBg}, ${C.accentGlow})`,
      borderColor: C.goldBorder
    }}>
      <Quote size={24} color={C.gold} style={{ marginBottom: 12 }} />
      <p style={{ fontSize: 14, fontStyle: "italic", color: C.textMuted, lineHeight: 1.7, margin: 0 }}>
        "{quote}"
      </p>
      <p style={{ fontSize: 11, color: C.textDim, marginTop: 12, marginBottom: 0 }}>— ICT Teaching</p>
    </div>
  );
}


// ─── MARKET SQUAWK TICKER ──────────────────────────────────────────────────
function MarketSquawkTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const newsItems = [
    { headline: "S&P 500 futures up 0.5% as investors await Fed decision", source: "CNBC", sentiment: "bullish" },
    { headline: "Oil prices surge 2% on Middle East tensions", source: "Reuters", sentiment: "volatile" },
    { headline: "Treasury yields fall as inflation data cools", source: "MarketWatch", sentiment: "bullish" },
    { headline: "Bitcoin breaks $95,000 resistance level", source: "CNBC", sentiment: "bullish" },
    { headline: "Euro strengthens after ECB rate decision", source: "Reuters", sentiment: "neutral" },
    { headline: "Gold hits new all-time high above $3,200", source: "MarketWatch", sentiment: "bullish" },
    { headline: "Tech stocks lead market rally", source: "CNBC", sentiment: "bullish" },
    { headline: "Volatility index drops to 3-month low", source: "Reuters", sentiment: "bullish" },
    { headline: "Dollar weakens on trade deficit data", source: "MarketWatch", sentiment: "bearish" },
    { headline: "Natural gas futures jump on cold weather forecast", source: "Reuters", sentiment: "volatile" },
  ];

  // Rotate news every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % newsItems.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const getSentimentColor = (sentiment) => {
    if (sentiment === "bullish") return C.emerald;
    if (sentiment === "bearish") return C.amber;
    return C.yellow;
  };

  const currentNews = newsItems[currentIndex];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{
        width: 8, height: 8, borderRadius: "50%",
        background: getSentimentColor(currentNews.sentiment),
        animation: "livePulse 1.5s infinite"
      }} />
      <span style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>
        {currentNews.headline}
      </span>
      <span style={{ 
        fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
        background: `${getSentimentColor(currentNews.sentiment)}20`,
        color: getSentimentColor(currentNews.sentiment)
      }}>
        {currentNews.source}
      </span>
    </div>
  );
}

// ─── DASHBOARD CALENDAR WIDGET ─────────────────────────────────────────────
function DashboardCalendar() {
  const [countdown, setCountdown] = useState({});
  const [currentNews, setCurrentNews] = useState(0);
  
  // Upcoming economic events
  const events = [
    { time: "08:30", currency: "USD", event: "Core CPI", impact: "High" },
    { time: "10:00", currency: "USD", event: "ISM PMI", impact: "High" },
    { time: "14:00", currency: "USD", event: "FOMC Minutes", impact: "Medium" },
    { time: "15:30", currency: "USD", event: "Oil Inventories", impact: "Low" },
  ];

  // Mini news headlines
  const newsItems = [
    { headline: "S&P futures up 0.5%", sentiment: "bullish" },
    { headline: "Oil surges 2% on tensions", sentiment: "volatile" },
    { headline: "Gold hits $3,200", sentiment: "bullish" },
    { headline: "Dollar weakens", sentiment: "bearish" },
    { headline: "Tech stocks lead rally", sentiment: "bullish" },
  ];

  // Countdown timer
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const newCountdown = {};
      
      events.forEach((event, i) => {
        const [h, m] = event.time.split(":").map(Number);
        const eventTime = new Date();
        eventTime.setHours(h, m, 0, 0);
        
        if (eventTime <= now) {
          newCountdown[i] = null;
          return;
        }
        
        const diff = eventTime - now;
        const hours = Math.floor(diff / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        
        newCountdown[i] = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
      });
      
      setCountdown(newCountdown);
    };
    
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  // News rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNews(prev => (prev + 1) % newsItems.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const getImpactColor = (impact) => {
    if (impact === "High") return C.amber;
    if (impact === "Medium") return C.yellow;
    return C.emerald;
  };

  const getSentimentColor = (sent) => {
    if (sent === "bullish") return C.emerald;
    if (sent === "bearish") return C.amber;
    return C.yellow;
  };

  return (
    <div style={S.glassCard}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
          <Calendar size={16} color={C.accent} /> Economic Calendar
        </h4>
        <span style={{ fontSize: 11, color: C.textDim }}>Today</span>
      </div>
      
      {/* Next Event Countdown */}
      {events.slice(0, 1).map((event, i) => countdown[i] && (
        <div key={i} style={{
          padding: 12, borderRadius: 10, marginBottom: 12,
          background: `${C.accent}15`, border: `1px solid ${C.accent}40`,
          textAlign: "center"
        }}>
          <div style={{ fontSize: 10, color: C.textDim, marginBottom: 4 }}>NEXT: {event.event}</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.accentLight }}>{countdown[i]}</div>
        </div>
      ))}
      
      {/* Events List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {events.map((event, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "8px 10px", borderRadius: 8,
            background: "rgba(0,0,0,0.2)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ 
                fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                background: getImpactColor(event.impact) + "20",
                color: getImpactColor(event.impact)
              }}>
                {event.impact}
              </span>
              <span style={{ fontSize: 12, fontWeight: 600 }}>{event.event}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: C.textDim }}>{event.currency}</span>
              <span style={{ 
                fontSize: 11, fontWeight: 700,
                color: countdown[i] ? C.accent : C.textDim
              }}>
                {countdown[i] || event.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Mini News Ticker */}
      <div style={{
        marginTop: 16, paddingTop: 12, borderTop: `1px solid ${C.border}`
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <Radio size={12} color={C.emerald} style={{ animation: "livePulse 1.5s infinite" }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: C.textDim }}>MARKET NEWS</span>
        </div>
        <div style={{
          fontSize: 12, color: C.text,
          display: "flex", alignItems: "center", gap: 6
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: getSentimentColor(newsItems[currentNews].sentiment)
          }} />
          {newsItems[currentNews].headline}
        </div>
      </div>
    </div>
  );
}

// ─── WIN STREAK BADGE ───────────────────────────────────────────────────────
function WinStreakBadge({ streak }) {
  if (streak < 2) return null;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 24,
      background: C.goldBg, border: `1px solid ${C.goldBorder}`,
      animation: "firePulse 1.5s ease-in-out infinite"
    }}>
      <Flame size={18} color={C.gold} />
      <span style={{ fontSize: 13, fontWeight: 700, color: C.gold }}>{streak} Day Win Streak</span>
    </div>
  );
}

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
      dailyLossLimitUsed: 0, highWatermark: 0, equityCurve: [],
      sharpeRatio: 0, sortinoRatio: 0, calmarRatio: 0, avgRR: 0,
      winLossRatio: 0, avgRMultiple: 0, largestWinningDay: 0, largestLosingDay: 0,
      avgTradeDuration: 0, profitDays: 0, lossDays: 0, totalDays: 0,
      profitDayPercent: 0, hourlyPnl: {}, monthlyPnl: {},
      pnlByHour: {}, pnlByMonth: {},
    };
  }

  const wins = trades.filter(t => t.pnl > 0);
  const losses = trades.filter(t => t.pnl < 0);
  const totalPnl = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const winRate = trades.length > 0 ? (wins.length / trades.length) * 100 : 0;
  const avgWinner = wins.length > 0 ? wins.reduce((s, t) => s + t.pnl, 0) / wins.length : 0;
  const avgLoser = losses.length > 0 ? Math.abs(losses.reduce((s, t) => s + t.pnl, 0) / losses.length) : 0;
  const winLossRatio = avgLoser > 0 ? avgWinner / avgLoser : 0;
  const expectancy = trades.length > 0
    ? (winRate / 100 * avgWinner) - ((1 - winRate / 100) * avgLoser)
    : 0;
  const totalWins = wins.reduce((s, t) => s + t.pnl, 0);
  const totalLosses = Math.abs(losses.reduce((s, t) => s + t.pnl, 0));
  const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? Infinity : 0;
  const bestTrade = Math.max(...trades.map(t => t.pnl || 0));
  const worstTrade = Math.min(...trades.map(t => t.pnl || 0));

  // R-Multiple: assume risk is average loser, or use trade.stop if available
  const avgRisk = avgLoser > 0 ? avgLoser : 1;
  const avgRMultiple = trades.length > 0
    ? trades.reduce((s, t) => s + ((t.pnl || 0) / avgRisk), 0) / trades.length
    : 0;
  // Average R:R (win/loss ratio normalized)
  const avgRR = avgLoser > 0 ? avgWinner / avgLoser : 0;

  // Streaks
  const sorted = [...trades].sort((a, b) => new Date(a.date) - new Date(b.date));
  let maxWinStreak = 0, maxLossStreak = 0, curRun = 0, curType = null;
  sorted.forEach(t => {
    const type = t.pnl > 0 ? "win" : "loss";
    if (type === curType) { curRun++; }
    else {
      if (curType === "win" && curRun > maxWinStreak) maxWinStreak = curRun;
      if (curType === "loss" && curRun > maxLossStreak) maxLossStreak = curRun;
      curRun = 1; curType = type;
    }
  });
  if (curType === "win" && curRun > maxWinStreak) maxWinStreak = curRun;
  if (curType === "loss" && curRun > maxLossStreak) maxLossStreak = curRun;
  // Current streak
  let currentStreak = 0;
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (i === sorted.length - 1) { currentStreak = 1; }
    else if ((sorted[i].pnl > 0) === (sorted[sorted.length - 1].pnl > 0)) { currentStreak++; }
    else { break; }
  }

  // P&L by Symbol
  const pnlBySymbol = {};
  trades.forEach(t => {
    const sym = t.ticker || "Other";
    pnlBySymbol[sym] = (pnlBySymbol[sym] || 0) + (t.pnl || 0);
  });

  // P&L by Session
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

  // P&L by Day of Week
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const pnlByDayOfWeek = {};
  days.forEach(d => { pnlByDayOfWeek[d] = { pnl: 0, count: 0 }; });
  trades.forEach(t => {
    const day = days[new Date(t.date).getDay()];
    pnlByDayOfWeek[day].pnl += t.pnl || 0;
    pnlByDayOfWeek[day].count++;
  });

  // Setup Performance
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
    name, winRate: d.count > 0 ? (d.wins / d.count) * 100 : 0,
    avgPnl: d.count > 0 ? d.pnl / d.count : 0,
    totalPnl: d.pnl, count: d.count,
  })).sort((a, b) => b.totalPnl - a.totalPnl);

  // Today's Stats
  const today = new Date().toISOString().split("T")[0];
  const todayTrades = trades.filter(t => t.date && t.date.startsWith(today));
  const todayStats = {
    pnl: todayTrades.reduce((s, t) => s + (t.pnl || 0), 0),
    wins: todayTrades.filter(t => t.pnl > 0).length,
    losses: todayTrades.filter(t => t.pnl < 0).length,
  };

  // Best/Worst Day
  const byDay = {};
  trades.forEach(t => { const day = t.date || today; byDay[day] = (byDay[day] || 0) + (t.pnl || 0); });
  const dayValues = Object.values(byDay);
  const bestDay = dayValues.length > 0 ? Math.max(...dayValues) : 0;
  const worstDay = dayValues.length > 0 ? Math.min(...dayValues) : 0;
  const largestWinningDay = bestDay;
  const largestLosingDay = worstDay;
  const profitDays = dayValues.filter(v => v > 0).length;
  const lossDays = dayValues.filter(v => v < 0).length;
  const totalDays = dayValues.length;

  // Max Drawdown + Equity Curve
  let equity = 0, highWater = 0, maxDrawdown = 0;
  let ddStart = 0, currentDD = 0, maxDDPer = 0;
  const equityCurve = [];
  sorted.forEach(t => {
    equity += t.pnl || 0;
    if (equity > highWater) {
      highWater = equity;
      currentDD = 0;
    } else {
      currentDD = highWater - equity;
    }
    if (currentDD > maxDrawdown) maxDrawdown = currentDD;
    if (highWater > 0) {
      const ddPct = (currentDD / highWater) * 100;
      if (ddPct > maxDDPer) maxDDPer = ddPct;
    }
    equityCurve.push({ date: t.date, equity, pnl: t.pnl || 0, highWatermark: highWater });
  });

  // Sharpe & Sortino Ratios (using daily returns)
  const dailyReturns = {};
  sorted.forEach(t => {
    const day = t.date;
    dailyReturns[day] = (dailyReturns[day] || 0) + (t.pnl || 0);
  });
  const returns = Object.values(dailyReturns);
  const meanReturn = returns.length > 0 ? returns.reduce((s, v) => s + v, 0) / returns.length : 0;
  const variance = returns.length > 0 ? returns.reduce((s, v) => s + Math.pow(v - meanReturn, 2), 0) / returns.length : 0;
  const stdDev = Math.sqrt(variance);
  // Downside deviation (Sortino)
  const downsideReturns = returns.filter(v => v < 0);
  const downsideVariance = downsideReturns.length > 0
    ? downsideReturns.reduce((s, v) => s + Math.pow(v - meanReturn, 2), 0) / returns.length
    : 0;
  const downsideDev = Math.sqrt(downsideVariance);
  const sharpeRatio = stdDev > 0 ? (meanReturn / stdDev) * Math.sqrt(252) : 0;
  const sortinoRatio = downsideDev > 0 ? (meanReturn / downsideDev) * Math.sqrt(252) : 0;
  // Calmar Ratio (CAGR / max drawdown) — simplified: total return / max drawdown
  const calmarRatio = maxDrawdown > 0 ? totalPnl / maxDrawdown : totalPnl > 0 ? Infinity : 0;

  // P&L by Hour
  const pnlByHour = {};
  for (let h = 0; h < 24; h++) pnlByHour[h] = { pnl: 0, count: 0, wins: 0, losses: 0 };
  trades.forEach(t => {
    const h = new Date(t.date).getHours();
    if (!pnlByHour[h]) pnlByHour[h] = { pnl: 0, count: 0, wins: 0, losses: 0 };
    pnlByHour[h].pnl += t.pnl || 0;
    pnlByHour[h].count++;
    if (t.pnl > 0) pnlByHour[h].wins++;
    else if (t.pnl < 0) pnlByHour[h].losses++;
  });

  // P&L by Month
  const pnlByMonth = {};
  trades.forEach(t => {
    const m = t.date ? t.date.substring(0, 7) : today.substring(0, 7);
    pnlByMonth[m] = (pnlByMonth[m] || 0) + (t.pnl || 0);
  });

  // Avg trade duration (if time data exists)
  const tradesWithTime = trades.filter(t => t.time);
  const avgTradeDuration = tradesWithTime.length > 0
    ? tradesWithTime.reduce((s, t) => s + (t.duration || 0), 0) / tradesWithTime.length
    : 0;

  return {
    totalPnl, winRate, avgWinner, avgLoser,
    expectancy, profitFactor, bestTrade, worstTrade,
    totalTrades: trades.length, bestDay, worstDay, maxDrawdown,
    currentStreak, maxWinStreak, maxLossStreak,
    pnlBySymbol, pnlBySession, pnlByDayOfWeek,
    setupPerformance, todayStats,
    dailyLossLimitUsed: Math.max(0, -(todayStats.pnl)),
    highWatermark: highWater, equityCurve,
    sharpeRatio, sortinoRatio, calmarRatio, avgRR,
    winLossRatio, avgRMultiple,
    largestWinningDay, largestLosingDay,
    avgTradeDuration, profitDays, lossDays, totalDays,
    profitDayPercent: totalDays > 0 ? (profitDays / totalDays) * 100 : 0,
    hourlyPnl: pnlByHour, monthlyPnl: pnlByMonth,
    pnlByHour, pnlByMonth,
    maxDrawdownPercent: maxDDPer,
  };
}

// ─── STAT CARD ─────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color }) {
  const isPositive = typeof value === "number" && value > 0;
  const isNegative = typeof value === "number" && value < 0;
  const displayColor = isPositive ? C.emerald : isNegative ? C.amber : (color || C.textDim);

  return (
    <div style={{
      background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`,
      borderRadius: C.radiusCard, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 4, minWidth: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {icon && React.cloneElement(icon, { size: 13, style: { color: C.accent } })}
        <span style={{ fontSize: 9, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
      </div>
      <div style={{ fontSize: 18, fontWeight: 800, color: displayColor, lineHeight: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {typeof value === "number" ? `${prefix}$${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: value % 1 !== 0 ? 2 : 0 })}` : value}
      </div>
      {sub && <div style={{ fontSize: 9, color: C.textMuted }}>{sub}</div>}
    </div>
  );
}

// ─── PROP GUARDRAILS ───────────────────────────────────────────────────────
function PropGuardrails({ trades, dailyLossLimit }) {
  const stats = computeStats(trades);
  const limitPct = dailyLossLimit > 0 ? (stats.dailyLossLimitUsed / dailyLossLimit) * 100 : 0;
  const limitColor = limitPct > 80 ? "#ef4444" : limitPct > 50 ? "#f59e0b" : "#22c55e";
  const today = new Date();
  const daysLeftInWeek = 7 - (today.getDay() === 0 ? 7 : today.getDay());

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Shield size={13} style={{ color: C.accent }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Prop Guardrails</span>
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.textMuted, marginBottom: 4 }}>
          <span>Daily Loss Used</span>
          <span style={{ color: limitColor, fontWeight: 700 }}>${stats.dailyLossLimitUsed.toFixed(0)} / ${dailyLossLimit}</span>
        </div>
        <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${Math.min(limitPct, 100)}%`, background: limitColor, borderRadius: 3, transition: "width 0.3s" }} />
        </div>
        {limitPct > 80 && (
          <div style={{ fontSize: 10, color: "#ef4444", marginTop: 3 }}>⚠️ Stop trading — limit approaching</div>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
        <span style={{ color: C.textMuted }}>High Watermark</span>
        <span style={{ color: "#22c55e", fontWeight: 700 }}>${stats.highWatermark.toFixed(0)}</span>
      </div>
      {stats.maxDrawdown > 0 && (
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
          <span style={{ color: C.textMuted }}>Max Drawdown</span>
          <span style={{ color: "#ef4444", fontWeight: 700 }}>${stats.maxDrawdown.toFixed(0)}</span>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
        <span style={{ color: C.textMuted }}>Days Left This Week</span>
        <span style={{ color: C.textMuted, fontWeight: 700 }}>{daysLeftInWeek}</span>
      </div>
    </div>
  );
}

// ─── DAY OF WEEK HEATMAP ────────────────────────────────────────────────────
function DayOfWeekHeatmap({ trades }) {
  const stats = computeStats(trades);
  const dayKeys = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const maxAbs = Math.max(...dayKeys.map(k => Math.abs(stats.pnlByDayOfWeek[k]?.pnl || 0)), 1);

  const bestDay = dayKeys.reduce((best, k) =>
    (stats.pnlByDayOfWeek[k]?.pnl || 0) > (stats.pnlByDayOfWeek[best]?.pnl || 0) ? k : best, "Monday");
  const worstDay = dayKeys.reduce((worst, k) =>
    (stats.pnlByDayOfWeek[k]?.pnl || 0) < (stats.pnlByDayOfWeek[worst]?.pnl || 0) ? k : worst, "Monday");

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <Calendar size={13} style={{ color: C.accent }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>P&L by Day</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4 }}>
        {dayKeys.map((day, i) => {
          const pnl = stats.pnlByDayOfWeek[day]?.pnl || 0;
          const intensity = Math.abs(pnl) / maxAbs;
          const bg = pnl > 0 ? `rgba(34,197,94,${0.1 + intensity * 0.55})`
            : pnl < 0 ? `rgba(239,68,68,${0.1 + intensity * 0.55})`
            : "rgba(255,255,255,0.04)";
          const border = pnl > 0 ? "rgba(34,197,94,0.25)" : pnl < 0 ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.08)";
          return (
            <div key={day} style={{ background: bg, borderRadius: 6, padding: "6px 3px", textAlign: "center", border: `1px solid ${border}` }}>
              <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 2 }}>{dayLabels[i]}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: pnl >= 0 ? "#22c55e" : "#ef4444" }}>
                {pnl > 0 ? "+" : ""}{pnl.toFixed(0)}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10, color: C.textMuted }}>
        <span>Best: <span style={{ color: "#22c55e" }}>{bestDay.slice(0, 3)}</span></span>
        <span>Worst: <span style={{ color: "#ef4444" }}>{worstDay.slice(0, 3)}</span></span>
      </div>
    </div>
  );
}

// ─── SETUP PERFORMANCE ────────────────────────────────────────────────────────
function SetupPerformance({ trades }) {
  const stats = computeStats(trades);

  if (stats.setupPerformance.length === 0) {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <Target size={13} style={{ color: C.accent }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Setup Performance</span>
        </div>
        <div style={{ fontSize: 12, color: C.textMuted, textAlign: "center", padding: "12px 0" }}>
          Add setup tags to your journal to see this
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <Target size={13} style={{ color: C.accent }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Setup Performance</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 120, overflowY: "auto" }}>
        {stats.setupPerformance.slice(0, 8).map((s, i) => (
          <div key={s.name} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "5px 8px", borderRadius: 6,
            background: i === 0 ? "rgba(34,197,94,0.06)" : i === stats.setupPerformance.length - 1 ? "rgba(239,68,68,0.06)" : "rgba(255,255,255,0.02)",
            border: `1px solid ${i === 0 ? "rgba(34,197,94,0.15)" : i === stats.setupPerformance.length - 1 ? "rgba(239,68,68,0.15)" : "transparent"}`,
          }}>
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</span>
              <span style={{ fontSize: 9, color: C.textMuted }}>{s.winRate.toFixed(0)}% WR · {s.count} trades</span>
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
    { key: "Morning", label: "Morning", sub: "8am–12pm", icon: <Sun size={11} /> },
    { key: "Afternoon", label: "Afternoon", sub: "12pm–4pm", icon: <Sun size={11} /> },
    { key: "Overnight", label: "Overnight", sub: "4pm–8am", icon: <Moon size={11} /> },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <Clock size={13} style={{ color: C.accent }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Session Breakdown</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {sessions.map(s => {
          const data = stats.pnlBySession[s.key];
          const pnl = data?.pnl || 0;
          return (
            <div key={s.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 8px", background: "rgba(255,255,255,0.02)", borderRadius: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: C.accent }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted }}>{s.label}</div>
                  <div style={{ fontSize: 9, color: C.textMuted }}>{s.sub} · {data?.count || 0} trades</div>
                </div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: pnl >= 0 ? "#22c55e" : "#ef4444" }}>{pnl >= 0 ? "+" : ""}{pnl.toFixed(0)}</span>
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
        <Flame size={13} style={{ color: C.accent }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Streaks</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {[
          { label: "Current", value: stats.currentStreak, sub: isWin ? "Wins" : "Losses", color: isWin ? "#22c55e" : "#ef4444", emoji: streakEmoji(stats.currentStreak) },
          { label: "Best Win", value: stats.maxWinStreak, sub: "consecutive", color: "#22c55e", emoji: streakEmoji(stats.maxWinStreak) },
          { label: "Worst Loss", value: stats.maxLossStreak, sub: "consecutive", color: "#ef4444", emoji: null },
          { label: "Profit Factor", value: stats.profitFactor === Infinity ? "∞" : stats.profitFactor.toFixed(2), sub: "win/loss ratio", color: stats.profitFactor >= 1 ? "#22c55e" : "#ef4444", emoji: null },
        ].map(item => (
          <div key={item.label} style={{ padding: "8px", background: "rgba(255,255,255,0.02)", borderRadius: 6, textAlign: "center" }}>
            <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 2 }}>{item.label}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: item.color }}>
              {item.emoji ? `${item.emoji} ${item.value}` : item.value}
            </div>
            <div style={{ fontSize: 9, color: C.textMuted }}>{item.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── GOAL PROGRESS ─────────────────────────────────────────────────────────
function GoalProgress({ trades, dailyGoal, weeklyGoal, monthlyGoal }) {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const weekStart = new Date(today); weekStart.setDate(today.getDate() - today.getDay() + 1);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const todayPnl = trades.filter(t => t.date === todayStr).reduce((s, t) => s + (t.pnl || 0), 0);
  const weekPnl = trades.filter(t => new Date(t.date) >= weekStart).reduce((s, t) => s + (t.pnl || 0), 0);
  const monthPnl = trades.filter(t => new Date(t.date) >= monthStart).reduce((s, t) => s + (t.pnl || 0), 0);

  const goals = [
    { label: "Daily", current: todayPnl, target: dailyGoal, color: todayPnl >= dailyGoal ? "#22c55e" : C.accent },
    { label: "Weekly", current: weekPnl, target: weeklyGoal, color: weekPnl >= weeklyGoal ? "#22c55e" : C.accent },
    { label: "Monthly", current: monthPnl, target: monthlyGoal, color: monthPnl >= monthlyGoal ? "#22c55e" : C.accent },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <Target size={13} style={{ color: C.accent }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Goal Progress</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {goals.map(g => {
          const pct = g.target > 0 ? Math.min((g.current / g.target) * 100, 100) : 0;
          return (
            <div key={g.label}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
                <span style={{ color: C.textMuted }}>{g.label}</span>
                <span style={{ color: g.current >= g.target ? "#22c55e" : C.textMuted, fontWeight: 700 }}>
                  ${g.current.toFixed(0)} / ${g.target}
                </span>
              </div>
              <div style={{ height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
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
          <TrendingUp size={13} style={{ color: C.accent }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Equity Curve</span>
        </div>
        <div style={{ fontSize: 12, color: C.textMuted, textAlign: "center", padding: "16px 0" }}>
          Log trades to see your equity curve
        </div>
      </div>
    );
  }

  const last30 = stats.equityCurve.slice(-30);
  const data = last30.map((d, i) => ({ name: i, equity: d.equity }));

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <TrendingUp size={13} style={{ color: C.accent }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Equity Curve</span>
      </div>
      <ResponsiveContainer width="100%" height={110}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b026ff" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#b026ff" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="name" tick={false} stroke="rgba(255,255,255,0.15)" />
          <YAxis tickFormatter={v => `$${v}`} tick={{ fontSize: 9, fill: "rgba(255,255,255,0.35)" }} width={48} />
          <Tooltip
            formatter={(val) => [`$${Number(val).toFixed(0)}`, "Equity"]}
            contentStyle={{ background: "#1e1b4b", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 8, fontSize: 11 }}
            labelStyle={{ color: C.textMuted }}
          />
          <Area type="monotone" dataKey="equity" stroke="#b026ff" fill="url(#eqGrad)" strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── DEEPER STATS ─────────────────────────────────────────────────────────────
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
    { label: "Avg R/R", value: stats.avgLoser > 0 ? `${(stats.avgWinner / stats.avgLoser).toFixed(2)}:1` : "N/A" },
  ];

  return (
    <div style={{ borderTop: "1px solid rgba(99,102,241,0.12)", paddingTop: 12 }}>
      <div
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", marginBottom: expanded ? 10 : 0 }}
        onClick={() => setExpanded(e => !e)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <BarChart3 size={13} style={{ color: C.accent }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>All Stats</span>
        </div>
        <ChevronDown size={13} style={{ color: C.textMuted, transform: expanded ? "rotate(180deg)" : "none", transition: "0.2s" }} />
      </div>
      {expanded && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px 12px" }}>
          {rows.map(r => (
            <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <span style={{ fontSize: 11, color: C.textMuted }}>{r.label}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: r.color || C.textMuted }}>{r.value}</span>
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
        background: "rgba(99,102,241,0.05)", border: "1px dashed rgba(99,102,241,0.3)",
        borderRadius: 12, padding: 28, textAlign: "center",
      }}>
        <Activity size={28} style={{ color: C.accent, margin: "0 auto 12px" }} />
        <div style={{ fontSize: 13, fontWeight: 600, color: C.textMuted, marginBottom: 6 }}>Start Logging Trades</div>
        <div style={{ fontSize: 12, color: C.textMuted }}>Add trades to your journal to see your analytics here</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Today's Snapshot */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <Zap size={13} style={{ color: C.accent }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Today</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6 }}>
          <StatCard icon={<DollarSign size={10} />} label="P&L" value={stats.todayStats.pnl} />
          <StatCard icon={<TrendingUp size={10} />} label="Wins" value={stats.todayStats.wins} color="#22c55e" />
          <StatCard icon={<TrendingDown size={10} />} label="Losses" value={stats.todayStats.losses} color="#ef4444" />
          <StatCard icon={<Flame size={10} />} label="Streak" value={stats.currentStreak} sub={stats.currentStreak > 0 ? "Wins" : stats.currentStreak < 0 ? "Losses" : "None"} />
        </div>
      </div>

      {/* Equity Curve */}
      <EquityCurveChart trades={trades} />

      {/* Win Rate + P&L by Symbol */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <PieChart size={13} style={{ color: C.accent }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Win Rate</span>
          </div>
          <div style={{ textAlign: "center" }}>
            <ResponsiveContainer width="100%" height={90}>
              <RePieChart>
                <Pie data={[{ name: "Wins", value: trades.filter(t => t.pnl > 0).length }, { name: "Losses", value: trades.filter(t => t.pnl <= 0).length }]} cx="50%" cy="50%" innerRadius={24} outerRadius={42} dataKey="value" startAngle={90} endAngle={-270}>
                  <Cell fill="#22c55e" /><Cell fill="#ef4444" />
                </Pie>
                <Tooltip contentStyle={{ background: "#1e1b4b", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 8, fontSize: 11 }} />
              </RePieChart>
            </ResponsiveContainer>
            <div style={{ fontSize: 20, fontWeight: 800, color: stats.winRate >= 50 ? "#22c55e" : "#ef4444" }}>{stats.winRate.toFixed(0)}%</div>
            <div style={{ fontSize: 9, color: C.textMuted }}>{trades.filter(t => t.pnl > 0).length}W / {trades.filter(t => t.pnl <= 0).length}L</div>
          </div>
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <BarChart3 size={13} style={{ color: C.accent }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>P&L / Symbol</span>
          </div>
          {Object.keys(stats.pnlBySymbol).length === 0 ? (
            <div style={{ fontSize: 11, color: C.textMuted, textAlign: "center", padding: "20px 0" }}>No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={90}>
              <BarChart data={Object.entries(stats.pnlBySymbol).map(([name, value]) => ({ name, value }))} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 9, fill: "rgba(255,255,255,0.35)" }} tickFormatter={v => `$${v}`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: C.textMuted }} width={28} />
                <Tooltip formatter={(val) => [`$${val.toFixed(0)}`, "P&L"]} contentStyle={{ background: "#1e1b4b", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {Object.entries(stats.pnlBySymbol).map(([_, v], i) => <Cell key={i} fill={v >= 0 ? "#22c55e" : "#ef4444"} />)}
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

function LivePnlWidget() {
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [data, setData] = useState({
    totalBalance: 0,
    totalUnrealizedPnl: 0,
    totalDailyPnl: 0,
    openPositionsCount: 0,
    positions: []
  });

  const wsRef = useRef(null);
  const pollRef = useRef(null);
  const apiBase = getApiBaseUrl();
  const wsUrl = getWsUrl();

  const fetchDashboard = async () => {
    try {
      const statusRes = await fetch(`${apiBase}/api/status`);
      const status = await statusRes.json();
      setConfigured(Boolean(status?.tradovate?.configured));

      if (!status?.tradovate?.configured) {
        setConnected(false);
        setLoading(false);
        return;
      }

      const dashRes = await fetch(`${apiBase}/api/dashboard`);
      if (!dashRes.ok) throw new Error("Failed to fetch live P&L");
      const dash = await dashRes.json();

      setData({
        totalBalance: dash.totalBalance || 0,
        totalUnrealizedPnl: dash.totalUnrealizedPnl || 0,
        totalDailyPnl: dash.totalDailyPnl || 0,
        openPositionsCount: dash.openPositionsCount || 0,
        positions: Array.isArray(dash.positions) ? dash.positions : []
      });
      setLastUpdated(dash.lastUpdated || new Date().toISOString());
      setConnected(true);
      setError("");
      setLoading(false);
    } catch (e) {
      setConnected(false);
      setLoading(false);
      setError(e.message || "Unable to load Tradovate data");
    }
  };

  useEffect(() => {
    fetchDashboard();

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === "dashboard" && payload.data) {
            setConfigured(true);
            setConnected(true);
            setLoading(false);
            setError("");
            setData({
              totalBalance: payload.data.totalBalance || 0,
              totalUnrealizedPnl: payload.data.totalUnrealizedPnl || 0,
              totalDailyPnl: payload.data.totalDailyPnl || 0,
              openPositionsCount: payload.data.positions?.length || 0,
              positions: Array.isArray(payload.data.positions) ? payload.data.positions : []
            });
            setLastUpdated(payload.data.lastUpdated || new Date().toISOString());
          }
        } catch {
          // Ignore malformed payloads
        }
      };

      ws.onerror = () => {
        if (!pollRef.current) pollRef.current = setInterval(fetchDashboard, 10000);
      };

      ws.onclose = () => {
        setConnected(false);
        if (!pollRef.current) pollRef.current = setInterval(fetchDashboard, 10000);
      };
    } catch {
      if (!pollRef.current) pollRef.current = setInterval(fetchDashboard, 10000);
    }

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  return (
    <div style={{ ...S.glassCard, marginTop: 20, marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
            <Gauge size={18} color={C.accent} />
            Live Tradovate P&L
          </h3>
          <div style={{ fontSize: 11, color: C.textDim, marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: connected ? C.emerald : C.amber }} />
            {configured ? (connected ? "Connected" : "Disconnected") : "Not configured"}
            {lastUpdated && ` • Updated ${new Date(lastUpdated).toLocaleTimeString()}`}
          </div>
        </div>
        <button onClick={fetchDashboard} style={S.btn("ghost", "sm")}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {!configured && (
        <div style={{ ...S.badge(C.yellow), display: "block", borderRadius: 12, padding: "12px 14px" }}>
          Tradovate backend is not configured. Add `TRADOVATE_USERNAME`, `TRADOVATE_PASSWORD`, `TRADOVATE_CID`, and `TRADOVATE_SECRET` to server env.
        </div>
      )}

      {error && configured && (
        <div style={{ ...S.badge(C.amber), display: "block", borderRadius: 12, padding: "12px 14px", marginBottom: 12 }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ color: C.textDim, fontSize: 13 }}>Loading live account data...</div>
      ) : configured && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
            <div style={{ ...S.glassCard, padding: 14 }}>
              <div style={{ fontSize: 10, color: C.textDim, marginBottom: 4 }}>TOTAL BALANCE</div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{fmtUsd(data.totalBalance)}</div>
            </div>
            <div style={{ ...S.glassCard, padding: 14 }}>
              <div style={{ fontSize: 10, color: C.textDim, marginBottom: 4 }}>OPEN P&L</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: pnlColor(data.totalUnrealizedPnl) }}>{fmt(data.totalUnrealizedPnl)}</div>
            </div>
            <div style={{ ...S.glassCard, padding: 14 }}>
              <div style={{ fontSize: 10, color: C.textDim, marginBottom: 4 }}>TODAY P&L</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: pnlColor(data.totalDailyPnl) }}>{fmt(data.totalDailyPnl)}</div>
            </div>
            <div style={{ ...S.glassCard, padding: 14 }}>
              <div style={{ fontSize: 10, color: C.textDim, marginBottom: 4 }}>OPEN POSITIONS</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.accentLight }}>{data.openPositionsCount}</div>
            </div>
          </div>

          {data.positions.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
              {data.positions.map((pos, idx) => (
                <div key={`${pos.symbol}-${idx}`} style={{
                  borderRadius: 12,
                  border: `1px solid ${C.border}`,
                  background: "rgba(0,0,0,0.22)",
                  padding: 12
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{pos.symbol}</span>
                    <span style={{ fontSize: 12, color: pos.netQty > 0 ? C.emerald : C.amber }}>
                      {pos.netQty > 0 ? "LONG" : "SHORT"} {Math.abs(pos.netQty)}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: C.textDim }}>Avg: {Number(pos.avgPrice || 0).toFixed(2)}</div>
                  <div style={{ fontSize: 11, color: C.textDim }}>Last: {Number(pos.lastPrice || 0).toFixed(2)}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, marginTop: 6, color: pnlColor(pos.unrealizedPnl || 0) }}>
                    {fmt(pos.unrealizedPnl || 0)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── SESSION SUMMARY MODAL ─────────────────────────────────────────────────
function SessionSummaryModal({ sessionData, onClose }) {
  if (!sessionData) return null;
  
  const { trades, stats, analysis } = sessionData;
  
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 3000, backdropFilter: "blur(12px)", animation: "fadeIn 0.3s ease-out"
    }}>
      <div style={{
        ...S.glassCard, padding: 32, width: 500, maxWidth: "90vw",
        border: `1px solid ${C.goldBorder}`,
        boxShadow: `0 0 60px ${C.goldGlow}`
      }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.gold}, ${C.yellow})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px"
          }}>
            <Award size={32} color={C.bg} />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: C.gold }}>Session Complete</h2>
          <p style={{ color: C.textMuted }}>Here's how your session went</p>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
          <div style={{ ...S.glassCard, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 10, color: C.textDim, textTransform: "uppercase", marginBottom: 4 }}>Trades</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: C.text }}>{trades.length}</div>
          </div>
          <div style={{ ...S.glassCard, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 10, color: C.textDim, textTransform: "uppercase", marginBottom: 4 }}>P&L</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: pnlColor(stats.total) }}>{fmt(stats.total)}</div>
          </div>
          <div style={{ ...S.glassCard, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 10, color: C.textDim, textTransform: "uppercase", marginBottom: 4 }}>Win Rate</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: Number(stats.wr) >= 50 ? C.emerald : C.amber }}>{stats.wr}%</div>
          </div>
        </div>
        
        {analysis && (
          <div style={{ marginBottom: 24, padding: 16, background: "rgba(0,0,0,0.2)", borderRadius: 12 }}>
            <div style={{ fontSize: 12, color: C.textDim, textTransform: "uppercase", marginBottom: 8 }}>Session Bias</div>
            <div style={{ display: "flex", gap: 16 }}>
              <span style={S.badge(C.accent)}>Bias: {analysis.bias || "—"}</span>
              <span style={S.badge(C.purple)}>HTF: {analysis.htf || "—"}</span>
            </div>
          </div>
        )}
        
        <button onClick={onClose} style={{ ...S.btn("primary", "lg"), width: "100%", justifyContent: "center" }}>
          <Check size={18} /> Acknowledge
        </button>
      </div>
    </div>
  );
}

// ─── TOP BAR ────────────────────────────────────────────────────────────────
function TopBar({ session, showToast }) {
  return (
    <div style={{
      height: 60, background: "rgba(0, 0, 0, 0.7)",
      borderBottom: `1px solid ${C.border}`,
      boxShadow: "0 1px 0 rgba(59, 130, 246, 0.06)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 24px", position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)"
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          width: 40, height: 40, borderRadius: C.radiusBtn,
          background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 900, fontSize: 16, color: C.white,
          boxShadow: C.shadowGlow
        }}>87</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.text }}>EightSeven HQ</div>
          <div style={{ fontSize: 9, color: C.accentLight, fontWeight: 600, letterSpacing: "0.1em" }}>TRADING OS V4.5</div>
        </div>
      </div>

      {/* Session Status */}
      {session.active && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: 20,
          background: `${C.emerald}15`, border: `1px solid ${C.emeraldBorder}`,
          boxShadow: `0 0 20px ${C.emeraldGlow}`
        }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.emerald, animation: "livePulse 1.5s infinite" }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: C.emerald }}>LIVE</span>
          <span style={{ fontSize: 11, color: C.textMuted }}>{session.trades}/2 trades</span>
        </div>
      )}

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 10,
          background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`
        }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.emerald }} />
          <span style={{ fontSize: 12, color: C.textMuted }}>Market Open</span>
        </div>
        <button style={S.btn("ghost", "sm")}>
          <Bell size={18} color={C.textMuted} />
        </button>
        <div style={{
          display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", borderRadius: 10,
          background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 800, color: C.white
          }}>KS</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>Karan</div>
            <div style={{ fontSize: 9, color: C.accentLight }}>30 Trades To Freedom</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── GURBANI VERSES ─────────────────────────────────────────────────────────
const GURBANI_VERSES = [
  "੧੦ ਜਿਤੁ ਜਲੁ ਥੀਵੈ ਮੈਲੈ ਤਿਤੁ ਝੂਕੈ ਜਗੁ || ਜਿਉ ਕੁਕੁ ਕਾਂਗਰੋ ਦੁਹੈ ਤਿਉ ਜਾਇ ਲਾਗਾ ਵਾਧੈ ਭਗੈ ||੧||",
  "ਹੁਕਮਿ ਰਜਾਈ ਚਲਾਇਆ ਮੇਰਾ ਆਪਿ ਅਵਲਾ ਆਪੇ ਅੰਤਿ ਆਪੇ ਆਪੇ ਜੀਵੈ ||",
  "ਮੈਂ ਕੁਛ ਕਰਨ ਦੀ ਤਾਕਤ ਨਹੀਂ ਰੱਖਦਾ, ਜਿਵੇਂ ਤੁਹਾਡੀ ਰਜ਼ਾ ਹੋਵੇ ਤਿਵੇਂ ਹੀ ਤੁਸੀਂ ਮੁਆਫ ਕਰੋ ||੧||",
  "ਸਭ ਸਿਸ ਮੈਲੇ ਹਰਿ ਕੈ ਨਾਮ ਤੇ ਪਵਿਤ੍ਰ ਹੋਇ ||",
  "ਜੇ ਹੋਵੈ ਪਰਾਈ ਕਿਸੈ ਤੁਮਾਰੀ ਜਾਣੈ ਮੇਰੀ ਖ਼ਾਬ || ਨਾਨਕ ਪਰਧਾਨੈ ਹੋਈਐ ਸਭ ਤੇ ਮਸਤਕ ਕਾਬ ||",
];

const ARDAS_VERSE = "ਅਸਾ ਜੋਰੁ ਨਾਹੀ ਜੇ ਕਿਛੁ ਕਰਿ ਹਮ ਸਾਕਹ ਜਿਉ ਭਾਵੈ ਤਿਵੈ ਬਖਸਿ ॥੧॥ ਰਹਾਉ ॥";

// ─── SIDEBAR ────────────────────────────────────────────────────────────────
function Sidebar({ page, setPage, session, collapsed, onToggleCollapse }) {
  const navGroups = [
    {
      label: "SESSION",
      items: [
        { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { id: "presession", icon: Sun, label: "Pre-Session" },
        { id: "trading-floor", icon: Zap, label: "Active Session" },
        { id: "postsession", icon: Moon, label: "Post Session" },
      ]
    },
    {
      label: "OPERATIONS",
      items: [
        { id: "prop-firms", icon: Briefcase, label: "Prop Firm HQ" },
        { id: "news", icon: Globe, label: "News & Calendar" },
        { id: "journal", icon: BookOpen, label: "Journal" },
      ]
    },
    {
      label: "ANALYSIS",
      items: [
        { id: "analytics", icon: BarChart3, label: "Analytics" },
        { id: "ai", icon: Brain, label: "AI Coach" },
        { id: "psychology", icon: Brain, label: "Psychology" },
      ]
    },
    {
      label: "TRACKING",
      items: [
        { id: "milestones", icon: Trophy, label: "Milestones" },
        { id: "weekly-review", icon: ClipboardCheck, label: "Weekly Review" },
      ]
    },
    {
      label: "SYSTEM",
      items: [
        { id: "settings", icon: Settings, label: "Settings" },
      ]
    }
  ];

  return (
    <div data-sidebar style={{
      width: collapsed ? 60 : 240, height: "calc(100vh - 60px)", position: "fixed", top: 60, left: 0,
      background: "rgba(0, 0, 0, 0.75)",
      backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
      borderRight: `1px solid ${C.border}`,
      display: "flex", flexDirection: "column", padding: collapsed ? "16px 8px" : "16px 0", 
      overflowY: "auto", transition: "width 0.3s ease, padding 0.3s ease",
      zIndex: 100
    }}>
      {/* Collapse Toggle */}
      <button 
        onClick={onToggleCollapse}
        style={{
          display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-end",
          padding: "8px", marginBottom: 12, background: "transparent", border: "none", cursor: "pointer"
        }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: "rgba(0,0,0,0.5)", border: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          {collapsed ? (
            <ChevronRight size={16} color={C.textDim} />
          ) : (
            <ChevronLeft size={16} color={C.textDim} />
          )}
        </div>
      </button>

      {navGroups.map((group, gi) => (
        <div key={group.label} style={{ marginBottom: gi < navGroups.length - 1 ? 8 : 0 }}>
          {!collapsed && (
            <div style={{
              fontSize: 10, fontWeight: 800, color: C.textDim, padding: "4px 20px 6px",
              letterSpacing: "0.12em"
            }}>{group.label}</div>
          )}
          {group.items.map(item => {
            const active = page === item.id;
            const isLive = item.id === "trading-floor" && session.active;
            return (
              <button key={item.id} onClick={() => setPage(item.id)} title={collapsed ? item.label : ""} style={{
                display: "flex", alignItems: "center", gap: collapsed ? 0 : 12, 
                padding: collapsed ? "12px" : "10px 20px",
                width: "100%", border: "none", cursor: "pointer", fontFamily: "Inter",
                justifyContent: collapsed ? "center" : "flex-start",
                background: isLive ? `linear-gradient(90deg, ${C.emerald}12, transparent)` : 
                             active ? `linear-gradient(90deg, ${C.accent}10, transparent)` : "transparent",
                color: isLive ? C.emerald : active ? C.accentLight : C.textMuted,
                fontWeight: isLive || active ? 600 : 500, fontSize: 13,
                borderLeft: isLive ? `2px solid ${C.emerald}` : active ? `2px solid ${C.accent}` : "2px solid transparent",
                transition: "all 0.2s ease", textAlign: "left",
                borderRadius: collapsed ? 8 : 0,
                position: "relative"
              }}>
                <item.icon size={18} color={isLive ? C.emerald : active ? C.accent : C.textDim} />
                {!collapsed && item.label}
                {isLive && !collapsed && (
                  <div style={{ marginLeft: "auto" }}>
                    <div style={{ 
                      width: 8, height: 8, borderRadius: "50%", background: C.emerald,
                      animation: "livePulse 1.5s infinite"
                    }} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── ACTIVE SESSION PAGE ────────────────────────────────────────────────────
function TradingFloorPage({ session, onAddTrade, setPage, showToast, trades }) {
  // Core fields
  const [symbol, setSymbol] = useState("MNQ");
  const [pnl, setPnl] = useState("");
  const [contracts, setContracts] = useState(1);
  const [entryModel, setEntryModel] = useState([]);
  const [setupGrade, setSetupGrade] = useState("");
  
  // ICT Fields
  const [htfOrderflow, setHtfOrderflow] = useState([]);
  const [liquidity, setLiquidity] = useState([]);
  const [mmxm, setMmxm] = useState([]);
  const [midnightOpen, setMidnightOpen] = useState([]);
  const [smr, setSmr] = useState([]);
  const [smrTime, setSmrTime] = useState([]);
  const [toi, setToi] = useState([]);
  const [tradeEntryTime, setTradeEntryTime] = useState([]);
  
  // Meta fields
  const [newsDay, setNewsDay] = useState([]);
  const [poi, setPoi] = useState("");
  const [learnings, setLearnings] = useState("");
  const [tradeTook, setTradeTook] = useState([]);
  const [notes, setNotes] = useState("");

  const toggleMultiSelect = (arr, setArr, value) => {
    setArr(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const submitTrade = () => {
    const pnlVal = parseFloat(pnl);
    if (pnl === "" || isNaN(pnlVal)) {
      showToast("Please enter P&L amount", "error");
      return;
    }
    
    onAddTrade({
      date: today(), 
      ticker: symbol, 
      pnl: pnlVal, 
      contracts,
      entryModel,
      setupGrade,
      htfOrderflow,
      liquidity,
      mmxm,
      midnightOpen,
      smr,
      smrTime,
      toi,
      tradeEntryTime,
      newsDay,
      poi,
      learnings,
      tradeTook,
      notes,
      postArdas,
      emotions,
      mentalState,
      energyLevel,
      sessionQuality,
      distractions,
      postTradeActions,
      sessionSummary,
      nextSessionFocus
    });
    
    // Reset form
    setPnl("");
    setContracts(1);
    setEntryModel([]);
    setSetupGrade("");
    setHtfOrderflow([]);
    setLiquidity([]);
    setMmxm([]);
    setMidnightOpen([]);
    setSmr([]);
    setSmrTime([]);
    setToi([]);
    setTradeEntryTime([]);
    setNewsDay([]);
    setPoi("");
    setLearnings("");
    setTradeTook([]);
    setNotes("");
    // Reset post session
    setPostArdas([]);
    setEmotions([]);
    setMentalState([]);
    setEnergyLevel([]);
    setSessionQuality([]);
    setDistractions([]);
    setPostTradeActions([]);
    setSessionSummary("");
    setNextSessionFocus("");
    showToast("Trade logged!", "success");
  };

  // Submit Post Session
  const submitPostSession = () => {
    onAddTrade({
      date: today(),
      isPostSession: true,
      postArdas,
      emotions,
      mentalState,
      energyLevel,
      sessionQuality,
      distractions,
      postTradeActions,
      sessionSummary,
      nextSessionFocus,
      // Also save trade data if any
      ticker: symbol,
      pnl: parseFloat(pnl) || 0,
      contracts,
      entryModel,
      setupGrade,
      htfOrderflow,
      liquidity,
      mmxm,
      midnightOpen,
      smr,
      smrTime,
      toi,
      tradeEntryTime,
      newsDay,
      poi,
      learnings,
      tradeTook,
      notes
    });
    // Reset post session fields
    setPostArdas([]);
    setEmotions([]);
    setMentalState([]);
    setEnergyLevel([]);
    setSessionQuality([]);
    setDistractions([]);
    setPostTradeActions([]);
    setSessionSummary("");
    setNextSessionFocus("");
    setActiveTab("log");
    showToast("Post session logged!", "success");
  };

  // Multi-select chip component
  const ChipSelect = ({ label, options, selected, onToggle }) => (
    <div style={{ marginBottom: 14 }}>
      <label style={S.label}>{label}</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {options.map(opt => (
          <button key={opt} onClick={() => onToggle(opt)} style={{
            padding: "5px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: "pointer",
            background: selected.includes(opt) ? `${C.accent}25` : "rgba(0,0,0,0.3)",
            color: selected.includes(opt) ? C.accentLight : C.textDim,
            border: `1px solid ${selected.includes(opt) ? C.accent : C.border}`,
            transition: "all 0.15s"
          }}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ ...S.page, animation: "fadeIn 0.4s ease-out" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, display: "flex", alignItems: "center", gap: 12 }}>
            Log Trade
            {session.active && (
              <span style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 20, background: `${C.emerald}20`, border: `1px solid ${C.emeraldBorder}` }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.emerald, animation: "livePulse 1.5s infinite" }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: C.emerald }}>LIVE</span>
              </span>
            )}
          </h1>
          <p style={{ fontSize: 13, color: C.textMuted }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        {!session.active && (
          <button onClick={() => setPage("presession")} style={S.btn("primary")}>
            <Play size={16} /> Start Session
          </button>
        )}
      </div>

      {/* Main Form */}
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={S.glassCard}>
          {/* Row 1: Ticker, P&L, Contracts */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div>
              <label style={S.label}>Ticker</label>
              <select value={symbol} onChange={e => setSymbol(e.target.value)} style={{ ...S.input, cursor: "pointer", appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 36 }}>
                {["MNQ", "NQ", "MES", "ES", "CL", "GC", "RTY", "EU", "SI", "BTC"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={S.label}>P&L ($)</label>
              <input type="number" value={pnl} onChange={e => setPnl(e.target.value)} style={{
                ...S.input, fontWeight: 700,
                color: pnl && !isNaN(parseFloat(pnl)) ? (parseFloat(pnl) >= 0 ? C.emerald : C.amber) : C.text
              }} placeholder="+/- amount" />
            </div>
            <div>
              <label style={S.label}>Contracts</label>
              <input type="number" value={contracts} onChange={e => setContracts(Number(e.target.value))} style={S.input} min="1" />
            </div>
          </div>

          {/* Row 2: Entry Model, Trade Setup */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <MultiSelectDropdown label="Entry Model (multi)" options={["Unicorn", "FVG", "IFVG", "OB", "BRKR", "CISD", "Turtle Soup", "RTH Gap Fill"]} selected={entryModel} onChange={setEntryModel} placeholder="Select Entry Model..." />
            <div>
              <label style={S.label}>Trade Setup</label>
              <select value={setupGrade} onChange={e => setSetupGrade(e.target.value)} style={S.input}>
                <option value="">Select...</option>
                {["A+", "A", "B+", "B", "C"].map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          {/* Section: ICT Analysis - All Multi-Select Dropdowns */}
          <div style={{ marginTop: 20, marginBottom: 16, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: C.accentLight, marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              ICT Analysis
            </h4>

            <MultiSelectDropdown label="HTF Orderflow" options={HTF_ORDERFLOW} selected={htfOrderflow} onChange={setHtfOrderflow} placeholder="Select HTF Orderflow..." />
            <MultiSelectDropdown label="MMXM" options={MMXM_OPTIONS} selected={mmxm} onChange={setMmxm} placeholder="Select MMXM..." />
            <MultiSelectDropdown label="Midnight Open" options={MIDNIGHT_OPEN} selected={midnightOpen} onChange={setMidnightOpen} placeholder="Select Midnight Open..." />
            <MultiSelectDropdown label="Liquidity" options={LIQUIDITY_OPTIONS} selected={liquidity} onChange={setLiquidity} placeholder="Select Liquidity..." />
            <MultiSelectDropdown label="SMR (SMT)" options={["NO", "Yes (Sentiment Momentum Trade)"]} selected={smr} onChange={setSmr} placeholder="Select SMR..." />
            <MultiSelectDropdown label="Trade Entry Time" options={SMR_TIME} selected={tradeEntryTime} onChange={setTradeEntryTime} placeholder="Select Entry Time..." />
            <MultiSelectDropdown label="SMR Time" options={SMR_TIME} selected={smrTime} onChange={setSmrTime} placeholder="Select SMR Time..." />
            <MultiSelectDropdown label="TOI (Time of Interest)" options={TOI_TIME} selected={toi} onChange={setToi} placeholder="Select TOI..." />
          </div>

          {/* Section: Session Info - All Multi-Select Dropdowns */}
          <div style={{ marginTop: 20, marginBottom: 16, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: C.accentLight, marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Session Info
            </h4>

            {/* News Day - Auto-detect based on today */}
            <div style={{ marginBottom: 14 }}>
              <label style={S.label}>Today is News Day</label>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 24, fontWeight: 700, color: C.yellow }}>
                  {(new Date().getDay() === 5) ? "NFP" : 
                   (new Date().getDate() >= 28 && new Date().getDate() <= 31) ? "Month End" : 
                   "NO"}
                </span>
                <span style={{ fontSize: 12, color: C.textMuted }}>
                  {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                </span>
              </div>
              <p style={{ fontSize: 11, color: C.textMuted, margin: "4px 0 0" }}>
                {new Date().getDay() === 5 ? "NFP Friday - higher volatility expected" : 
                 "Normal trading day"}
              </p>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={S.label}>POI</label>
              <input type="text" value={poi} onChange={e => setPoi(e.target.value)} style={S.input} placeholder="Point of Interest" />
            </div>
            <MultiSelectDropdown label="Trade Took (contracts)" options={TRADE_TOOK} selected={tradeTook} onChange={setTradeTook} placeholder="Select Trade Took..." />
            <div style={{ marginBottom: 14 }}>
              <label style={S.label}>Learnings</label>
              <textarea value={learnings} onChange={e => setLearnings(e.target.value)} style={{ ...S.input, minHeight: 60, resize: "vertical" }} placeholder="What did you learn from this trade?" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={S.label}>Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} style={{ ...S.input, minHeight: 60, resize: "vertical" }} placeholder="Any additional observations?" />
            </div>
          </div>

          <button onClick={submitTrade} style={{ ...S.btn("primary", "lg"), width: "100%", justifyContent: "center" }}>
            <Save size={16} /> Log Trade
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MULTI-SELECT DROPDOWN ─────────────────────────────────────────────────
function MultiSelectDropdown({ label, options, selected, onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = (opt) => {
    if (selected.includes(opt)) {
      onChange(selected.filter(v => v !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  return (
    <div style={{ marginBottom: 14 }}>
      <label style={S.label}>{label}</label>
      <div ref={ref} style={{ position: "relative" }}>
        <div onClick={() => setIsOpen(!isOpen)} style={{
          ...S.input, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
          minHeight: 42
        }}>
          <span style={{ color: selected.length ? C.text : C.textDim }}>
            {selected.length > 0 ? selected.join(", ") : placeholder || "Select..."}
          </span>
          <ChevronDown size={14} color={C.textDim} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "0.2s" }} />
        </div>
        {isOpen && (
          <div style={{
            position: "absolute", top: "100%", left: 0, right: 0, zIndex: 100,
            background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12,
            maxHeight: 200, overflowY: "auto", marginTop: 4,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
          }}>
            {options.map(opt => (
              <div key={opt} onClick={() => toggle(opt)} style={{
                padding: "10px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
                background: selected.includes(opt) ? C.bgHover : "transparent",
                color: selected.includes(opt) ? C.accentLight : C.text,
                transition: "all 0.15s"
              }}
              onMouseEnter={e => e.target.style.background = C.bgHover}
              onMouseLeave={e => e.target.style.background = selected.includes(opt) ? C.bgHover : "transparent"}
              >
                <div style={{
                  width: 16, height: 16, borderRadius: 4, border: `2px solid ${selected.includes(opt) ? C.accent : C.border}`,
                  background: selected.includes(opt) ? C.accent : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  {selected.includes(opt) && <Check size={10} color={C.white} />}
                </div>
                <span style={{ fontSize: 13 }}>{opt}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {selected.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
          {selected.map(s => (
            <span key={s} style={{
              padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600,
              background: `${C.accent}20`, color: C.accentLight, border: `1px solid ${C.accent}40`
            }}>
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── POST SESSION PAGE ────────────────────────────────────────────────────
function PostSessionPage({ setPage, showToast, trades, onAddTrade, spiritualMode = true }) {
  const [step, setStep] = useState(0);
  
  // Step 1: Opening reflection
  const [ardasDone, setArdasDone] = useState(false);
  
  // Step 2: Session Reflection
  const [sessionQuality, setSessionQuality] = useState("");
  const [mentalState, setMentalState] = useState("");
  const [energyLevel, setEnergyLevel] = useState("");
  const [emotions, setEmotions] = useState([]);
  const [distractions, setDistractions] = useState([]);
  
  // Step 3: Trade Actions
  const [followedPlan, setFollowedPlan] = useState(false);
  const [tradeMistakes, setTradeMistakes] = useState([]);
  const [whatWentWell, setWhatWentWell] = useState("");
  
  // Step 4: Gratitude
  const [gratitude, setGratitude] = useState("");
  const [nextSessionFocus, setNextSessionFocus] = useState("");

  const emotionOptions = ["Calm", "Focused", "Confident", "FOMO", "Anxious", "Angry", "Greedy", "Tired", "Peaceful", "Frustrated"];
  const mistakeOptions = ["Overtraded", "Revenge Trading", "Ignored Stop Loss", "Added to Loser", "Early Exit", "Late Entry", "No Trade Management", "Ignored Signals"];
  const distractionOptions = ["Phone", "Social Media", "Family", "News", "Other Charts", "Chat", "Food", "None"];

  const toggleItem = (arr, setArr, item) => {
    if (arr.includes(item)) {
      setArr(arr.filter(i => i !== item));
    } else {
      setArr([...arr, item]);
    }
  };

  const submitPostSession = () => {
    onAddTrade({
      date: today(),
      isPostSession: true,
      ardasDone,
      sessionQuality,
      mentalState,
      energyLevel,
      emotions,
      distractions,
      followedPlan,
      tradeMistakes,
      whatWentWell,
      gratitude,
      nextSessionFocus
    });
    showToast("Post session logged!", "success");
    setPage("dashboard");
  };

  return (
    <div style={{ ...S.page, animation: "fadeIn 0.4s ease-out" }}>
      {/* Progress Steps */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 32 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            width: step === i ? 40 : 12, height: 12, borderRadius: 6,
            background: step >= i ? `linear-gradient(135deg, ${C.accent}, ${C.purple})` : "rgba(255,255,255,0.1)",
            boxShadow: step === i ? `0 0 20px ${C.accentGlow}` : "none",
            transition: "all 0.3s ease"
          }} />
        ))}
      </div>

      {/* Step 0: Opening reflection */}
      {step === 0 && (
        <div style={{ ...S.glassCard, maxWidth: 580, margin: "0 auto", textAlign: "center", boxShadow: `0 0 60px ${C.accentGlow}`, border: `1px solid ${C.border}` }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.purple}30, ${C.accent}20)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px", animation: "float 3s ease-in-out infinite"
          }}>
            <Moon size={40} color={C.purple} />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>
            {spiritualMode ? "End With Gratitude" : "End With Reflection"}
          </h2>
          
          {spiritualMode && (
            <div style={{
              padding: 20, borderRadius: 14, background: `linear-gradient(135deg, ${C.purple}15, ${C.accent}10)`,
              border: `1px solid ${C.border}`, marginBottom: 24
            }}>
              <p style={{ fontFamily: "'Noto Sans Gurmukhi', sans-serif", fontSize: 18, color: C.text, lineHeight: 2, margin: 0 }}>
                ਅਸਾ ਜੋਰੁ ਨਾਹੀ ਜੇ ਕਿਛੁ ਕਰਿ ਹਮ ਸਾਕਹ ਜਿਉ ਭਾਵੈ ਤਿਵੈ ਬਖਸਿ ॥੧॥ ਰਹਾਉ ॥
              </p>
              <p style={{ fontSize: 12, color: C.textMuted, marginTop: 8, fontStyle: "italic" }}>
                I have no power to do anything at all. As it pleases You, You forgive us. ||1||Pause||
              </p>
            </div>
          )}
          
          <p style={{ color: C.textMuted, lineHeight: 1.8, marginBottom: 24 }}>
            {spiritualMode
              ? "Take a moment to give thanks. Reflect on your session with gratitude."
              : "Take a calm pause. Reflect on your session before moving forward."}
          </p>
          <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, cursor: "pointer", marginBottom: 24 }}>
            <input type="checkbox" checked={ardasDone} onChange={e => setArdasDone(e.target.checked)}
              style={{ width: 20, height: 20, accentColor: C.accent, cursor: "pointer" }} />
            <span style={{ fontWeight: 600 }}>{spiritualMode ? "I have completed my Ardas" : "I have completed my reflection"}</span>
          </label>
          <button disabled={!ardasDone} onClick={() => setStep(1)} style={{
            ...S.btn("primary", "lg"), width: "100%", opacity: ardasDone ? 1 : 0.4, cursor: ardasDone ? "pointer" : "not-allowed"
          }}>
            Continue <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Step 1: Session Quality */}
      {step === 1 && (
        <div style={{ ...S.glassCard, maxWidth: 680, margin: "0 auto" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
            <Star size={22} color={C.accent} /> Session Assessment
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <Select label="Session Quality" value={sessionQuality} onChange={setSessionQuality} options={["Excellent", "Good", "Average", "Poor", "Terrible"]} />
            <Select label="Mental State (1-10)" value={mentalState} onChange={setMentalState} options={["10", "9", "8", "7", "6", "5", "4", "3", "2", "1"]} />
            <Select label="Energy Level" value={energyLevel} onChange={setEnergyLevel} options={["Very High", "High", "Normal", "Low", "Very Low"]} />
          </div>
          
          {/* Emotions */}
          <div style={{ marginBottom: 20 }}>
            <label style={S.label}>Emotions During Session</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {emotionOptions.map(opt => (
                <button key={opt} onClick={() => toggleItem(emotions, setEmotions, opt)} style={{
                  padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer",
                  background: emotions.includes(opt) ? `${C.accent}25` : "rgba(0,0,0,0.3)",
                  color: emotions.includes(opt) ? C.accentLight : C.textDim,
                  border: `1px solid ${emotions.includes(opt) ? C.accent : C.border}`
                }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => setStep(0)} style={S.btn("ghost")}><ChevronLeft size={16} /> Back</button>
            <button onClick={() => setStep(2)} style={{ ...S.btn("primary"), flex: 1, justifyContent: "center" }}>
              Continue <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Trade Actions */}
      {step === 2 && (
        <div style={{ ...S.glassCard, maxWidth: 680, margin: "0 auto" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
            <Shield size={22} color={C.accent} /> Trade Discipline
          </h2>
          
          <label style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "16px", borderRadius: 12, background: followedPlan ? `${C.emerald}10` : "rgba(0,0,0,0.3)", border: `1px solid ${followedPlan ? C.emeraldBorder : C.border}`, marginBottom: 20, cursor: "pointer" }}>
            <input type="checkbox" checked={followedPlan} onChange={e => setFollowedPlan(e.target.checked)} style={{ width: 20, height: 20, accentColor: C.emerald, marginTop: 2 }} />
            <div>
              <span style={{ fontWeight: 600, fontSize: 14 }}>I followed my trading plan</span>
              <p style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Did you stick to your rules and methodology?</p>
            </div>
          </label>

          {/* Mistakes */}
          <div style={{ marginBottom: 20 }}>
            <label style={S.label}>Trading Mistakes (if any)</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {mistakeOptions.map(opt => (
                <button key={opt} onClick={() => toggleItem(tradeMistakes, setTradeMistakes, opt)} style={{
                  padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer",
                  background: tradeMistakes.includes(opt) ? `${C.amber}25` : "rgba(0,0,0,0.3)",
                  color: tradeMistakes.includes(opt) ? C.amberLight : C.textDim,
                  border: `1px solid ${tradeMistakes.includes(opt) ? C.amber : C.border}`
                }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* What Went Well */}
          <div style={{ marginBottom: 20 }}>
            <label style={S.label}>What Went Well</label>
            <textarea value={whatWentWell} onChange={e => setWhatWentWell(e.target.value)} style={{ ...S.input, minHeight: 80, resize: "vertical" }} placeholder="What did you do well today?" />
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => setStep(1)} style={S.btn("ghost")}><ChevronLeft size={16} /> Back</button>
            <button onClick={() => setStep(3)} style={{ ...S.btn("primary"), flex: 1, justifyContent: "center" }}>
              Continue <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Gratitude */}
      {step === 3 && (
        <div style={{ ...S.glassCard, maxWidth: 680, margin: "0 auto" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
            <Coffee size={22} color={C.accent} /> Gratitude & Focus
          </h2>
          
          <div style={{ marginBottom: 20 }}>
            <label style={S.label}>What are you grateful for today?</label>
            <textarea value={gratitude} onChange={e => setGratitude(e.target.value)} style={{ ...S.input, minHeight: 80, resize: "vertical" }} placeholder="List three things you're grateful for..." />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={S.label}>Next Session Focus</label>
            <textarea value={nextSessionFocus} onChange={e => setNextSessionFocus(e.target.value)} style={{ ...S.input, minHeight: 80, resize: "vertical" }} placeholder="What will you focus on next time?" />
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => setStep(2)} style={S.btn("ghost")}><ChevronLeft size={16} /> Back</button>
            <button onClick={submitPostSession} style={{ ...S.btn("success", "lg"), flex: 1, justifyContent: "center" }}>
              <Save size={18} /> Complete Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── LIVE MARKET DATA ──────────────────────────────────────────────────────
function LiveMarketTicker() {
  const [prices, setPrices] = useState({
    MNQ: { price: 18450.50, change: +25.75 },
    NQ: { price: 18200.25, change: +15.50 },
    ES: { price: 5120.75, change: -5.25 },
    RTY: { price: 2050.00, change: +8.50 },
    CL: { price: 78.45, change: -0.85 },
    GC: { price: 2345.80, change: +12.30 }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(ticker => {
          const tick = updated[ticker];
          const change = (Math.random() - 0.5) * 2;
          updated[ticker] = {
            price: tick.price + change,
            change: tick.change + change
          };
        });
        return updated;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8 }}>
      {Object.entries(prices).map(([ticker, data]) => (
        <div key={ticker} style={{
          display: "flex", alignItems: "center", gap: 10, padding: "10px 16px",
          background: C.bgCardAlt, borderRadius: 12, border: `1px solid ${C.border}`, minWidth: 120
        }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{ticker}</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>{data.price.toFixed(2)}</div>
          </div>
          <div style={{
            fontSize: 12, fontWeight: 600,
            color: data.change >= 0 ? C.emerald : C.amber
          }}>
            {data.change >= 0 ? "+" : ""}{data.change.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── TRUMP NEWS ALERT ──────────────────────────────────────────────────────
function NewsAlert({ alert, onDismiss }) {
  if (!alert) return null;
  
  return (
    <div style={{
      position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)",
      zIndex: 5000, animation: "slideDown 0.4s ease-out", maxWidth: 500, width: "90vw"
    }}>
      <div style={{
        background: `linear-gradient(135deg, ${C.amber}, #78350f)`,
        border: `2px solid ${C.amber}`,
        borderRadius: 16, padding: 20, boxShadow: `0 8px 32px ${C.amber}60`
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <AlertTriangle size={24} color={C.white} />
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              URGENT - TRUMP ALERT
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.white }}>{alert.source}</div>
          </div>
        </div>
        <p style={{ fontSize: 14, color: C.white, lineHeight: 1.6, marginBottom: 16 }}>
          {alert.message}
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button 
            onClick={onDismiss}
            style={{
              flex: 1, padding: "10px 20px", borderRadius: 10, border: "none",
              background: "rgba(255,255,255,0.2)", color: C.white, fontWeight: 600, cursor: "pointer"
            }}
          >
            Read & Dismiss
          </button>
          <a 
            href={alert.link} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              flex: 1, padding: "10px 20px", borderRadius: 10, border: "none",
              background: C.white, color: C.amber, fontWeight: 600, textAlign: "center", textDecoration: "none"
            }}
          >
            View on X
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── COMMAND CENTER PAGE ────────────────────────────────────────────────────
function CommandCenterPage({ trades, session, propAccounts, setPage, dailyGoal, weeklyGoal, monthlyGoal, dailyLossLimit, milestones, weeklyReviews }) {
  // ─── Interactive State ──────────────────────────────────────────────
  const [expandedTradeIndex, setExpandedTradeIndex] = useState(null);
  const [activeSetupFilter, setActiveSetupFilter] = useState(null);
  const [activeDayFilter, setActiveDayFilter] = useState(null);
  const [livePrices, setLivePrices] = useState({
    NQ: { price: 21550.25, change: +45.50, flash: null },
    ES: { price: 5845.75, change: +12.25, flash: null },
    YM: { price: 43850.00, change: -15.00, flash: null }
  });
  const [streakPulse, setStreakPulse] = useState(false);
  const prevStreakRef = useRef(0);

  // ─── Simulated live price updates ─────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setLivePrices(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(ticker => {
          const tick = updated[ticker];
          const change = (Math.random() - 0.5) * 10;
          const newChange = tick.change + change;
          const direction = change > 0 ? "up" : change < 0 ? "down" : null;
          updated[ticker] = {
            price: tick.price + change,
            change: newChange,
            flash: direction
          };
          // Clear flash after animation
          setTimeout(() => {
            setLivePrices(p => ({ ...p, [ticker]: { ...p[ticker], flash: null } }));
          }, 600);
        });
        return updated;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // ─── Streak pulse on increase ───────────────────────────────────────
  const stats = {
    total: trades.reduce((s, t) => s + t.pnl, 0),
    wins: trades.filter(t => t.pnl > 0).length,
    losses: trades.filter(t => t.pnl < 0).length,
    wr: trades.length ? ((trades.filter(t => t.pnl > 0).length / trades.length) * 100).toFixed(1) : 0,
    streak: (() => {
      const dailyPnl = {};
      trades.forEach(t => { dailyPnl[t.date] = (dailyPnl[t.date] || 0) + t.pnl; });
      const dates = Object.keys(dailyPnl).sort().reverse();
      let count = 0;
      for (const d of dates) { if (dailyPnl[d] > 0) count++; else break; }
      return count;
    })()
  };

  useEffect(() => {
    if (stats.streak > prevStreakRef.current) {
      setStreakPulse(true);
      setTimeout(() => setStreakPulse(false), 800);
    }
    prevStreakRef.current = stats.streak;
  }, [stats.streak]);

  // ─── Filtered trades ───────────────────────────────────────────────────
  const filteredTrades = useMemo(() => {
    let result = [...trades].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (activeSetupFilter) result = result.filter(t => t.entryModel === activeSetupFilter);
    if (activeDayFilter !== null) result = result.filter(t => new Date(t.date).getDay() === activeDayFilter);
    return result;
  }, [trades, activeSetupFilter, activeDayFilter]);

  const hasActiveFilter = activeSetupFilter !== null || activeDayFilter !== null;

  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

  return (
    <div style={{ ...S.page, animation: "fadeIn 0.4s ease-out" }}>
      {/* NQ, ES, YM Live Prices */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {["NQ", "ES", "YM"].map(ticker => {
          const data = livePrices[ticker];
          const isPositive = data.change >= 0;
          return (
            <div key={ticker} style={{
              flex: 1, padding: 16, borderRadius: 12,
              background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`,
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>{ticker}</div>
                <div style={{ fontSize: 11, color: C.textDim }}>E-mini {ticker === "NQ" ? "Nasdaq" : ticker === "ES" ? "S&P 500" : "Dow Jones"}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{data.price.toFixed(2)}</div>
                <div style={{ 
                  fontSize: 12, fontWeight: 600, 
                  color: isPositive ? C.emerald : C.amber 
                }}>
                  {isPositive ? "+" : ""}{data.change.toFixed(2)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Market Squawk Banner */}
      <div style={{
        ...S.glassCard, marginBottom: 24, padding: "12px 20px",
        background: `linear-gradient(90deg, ${C.bgCard}, ${C.accent}10, ${C.bgCard})`,
        border: `1px solid ${C.border}`
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "6px 12px", borderRadius: 8,
            background: `${C.accent}20`, border: `1px solid ${C.accent}40`
          }}>
            <Radio size={14} color={C.accent} style={{ animation: "livePulse 1.5s infinite" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: C.accentLight }}>SQUAWK</span>
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <MarketSquawkTicker />
          </div>
        </div>
      </div>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 6 }}>
            Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 17 ? "Afternoon" : "Evening"}, Karan
          </h1>
          <p style={{ fontSize: 14, color: C.textMuted, fontStyle: "italic" }}>"{quote}"</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {!session.active && (
            <button onClick={() => setPage("presession")} style={S.btn("primary")}>
              <Play size={16} /> Start Session
            </button>
          )}
          {session.active && (
            <button onClick={() => setPage("trading-floor")} style={S.btn("success")}>
              <Zap size={16} /> Trading Floor
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: "grid", gridTemplateColumns: "60% 40%", gap: 20 }}>
        <AnalyticsHub trades={trades} />
        <TradePanel
          trades={trades}
          activeSetupFilter={activeSetupFilter}
          activeDayFilter={activeDayFilter}
          setActiveSetupFilter={setActiveSetupFilter}
          setActiveDayFilter={setActiveDayFilter}
          onAddTrade={() => setPage("journal")}
          milestones={milestones}
        />
      </div>

      {/* ── Analytics Charts ─────────────────────────────────────── */}
      {trades.length > 0 && (
        <AnalyticsCharts trades={trades} />
      )}
    </div>
  );
}

// ─── ANALYTICS HUB ──────────────────────────────────────────────────────────
function AnalyticsHub({ trades, page }) {
  const stats = useMemo(() => computeStats(trades), [trades]);

  const statCards = [
    { label: "Total P&L", value: stats.totalPnl, fmt: fmt, color: pnlColor(stats.totalPnl) },
    { label: "Win Rate", value: stats.winRate, fmt: v => `${v}%`, color: stats.winRate >= 50 ? C.emerald : stats.winRate >= 40 ? C.yellow : C.amber },
    { label: "Avg Winner", value: stats.avgWinner, fmt: fmt, color: C.emerald },
    { label: "Avg Loser", value: stats.avgLoser, fmt: v => `-${fmt(Math.abs(v))}`, color: C.amber },
    { label: "Expectancy", value: stats.expectancy, fmt: v => (v >= 0 ? "+" : "") + v.toFixed(2), color: pnlColor(stats.expectancy) },
    { label: "Profit Factor", value: stats.profitFactor, fmt: v => v.toFixed(2), color: stats.profitFactor >= 1.5 ? C.emerald : stats.profitFactor >= 1 ? C.yellow : C.amber }
  ];

  const advancedCards = [
    { label: "Sharpe", value: stats.sharpeRatio, fmt: v => v.toFixed(2), color: stats.sharpeRatio >= 1 ? C.emerald : stats.sharpeRatio > 0 ? C.yellow : C.amber },
    { label: "Sortino", value: stats.sortinoRatio, fmt: v => v.toFixed(2), color: stats.sortinoRatio >= 1 ? C.emerald : stats.sortinoRatio > 0 ? C.yellow : C.amber },
    { label: "Calmar", value: stats.calmarRatio, fmt: v => v.toFixed(2), color: stats.calmarRatio >= 1 ? C.emerald : stats.calmarRatio > 0 ? C.yellow : C.amber },
    { label: "Avg R:R", value: stats.avgRR, fmt: v => `1:${v.toFixed(2)}`, color: stats.avgRR >= 2 ? C.emerald : stats.avgRR >= 1 ? C.yellow : C.amber },
    { label: "Max DD", value: stats.maxDrawdown, fmt: fmtUsd, color: C.amber },
    { label: "DD %", value: stats.maxDrawdownPercent, fmt: v => `${v.toFixed(1)}%`, color: stats.maxDrawdownPercent > 20 ? C.amber : stats.maxDrawdownPercent > 10 ? C.yellow : C.emerald },
    { label: "Profit Days", value: stats.profitDayPercent, fmt: v => `${v.toFixed(0)}%`, color: stats.profitDayPercent >= 50 ? C.emerald : C.amber },
    { label: "Best Day", value: stats.bestDay, fmt: fmt, color: C.emerald },
  ];

  return (
    <>
      {/* Hero Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: 8 }}>
        {statCards.map((card, i) => (
          <AnimatedStatCard key={card.label} card={card} delay={i * 80} />
        ))}
      </div>

      {/* Advanced Stat Cards */}
      {trades.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 10, marginBottom: 16 }}>
          {advancedCards.map((card, i) => (
            <AnimatedStatCard key={card.label} card={card} delay={(i + 6) * 60} />
          ))}
        </div>
      )}

      {/* Drawdown + Calendar */}
      <div style={{ display: "grid", gridTemplateColumns: trades.length > 0 ? "1fr 1fr" : "1fr", gap: 16, marginBottom: 16 }}>
        {trades.length > 0 && <DrawdownChart trades={trades} />}
        {trades.length > 0 && <HourOfDayChart trades={trades} />}
      </div>

      {/* Equity Curve + Setup Performance */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ ...S.glassCard, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: C.text }}>Equity Curve</h3>
          {stats.equityCurve.length === 0 ? (
            <div style={{ textAlign: "center", padding: 32, color: C.textDim, fontSize: 13 }}>No trade data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={stats.equityCurve} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.accent} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={C.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: C.textDim }} tickFormatter={d => d ? d.split("-")[2] : ""} />
                <YAxis tick={{ fontSize: 10, fill: C.textDim }} tickFormatter={v => `$${v}`} width={55} />
                <Tooltip
                  contentStyle={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, fontSize: 12 }}
                  labelStyle={{ color: C.text }}
                  formatter={(val, name) => [name === "cumulative" ? fmt(val) : val, name === "cumulative" ? "Cumulative" : "Daily"]}
                />
                {stats.highWatermark > 0 && (
                  <ReferenceLine y={stats.highWatermark} stroke={C.amber} strokeDasharray="5 5" label={{ value: `HWM $${fmtUsd(stats.highWatermark)}`, position: "right", fontSize: 9, fill: C.amber }} />
                )}
                <Area type="monotone" dataKey="cumulative" stroke={C.accent} fill="url(#eqGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div style={{ ...S.glassCard, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: C.text }}>Top Setups</h3>
          <SetupMiniTable trades={trades} />
        </div>
      </div>

      {/* Day of Week + More Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <div style={{ ...S.glassCard, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: C.text }}>Day Performance</h3>
          <DayOfWeekMiniHeatmap trades={trades} />
        </div>
        <div style={{ ...S.glassCard, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: C.text }}>Session Breakdown</h3>
          <SessionMiniBreakdown trades={trades} />
        </div>
      </div>

      {/* Calendar Heatmap */}
      {trades.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <CalendarHeatmap trades={trades} />
        </div>
      )}
    </>
  );
}

// ─── Animated Stat Card ────────────────────────────────────────────────────────
function AnimatedStatCard({ card, delay }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hovered, setHovered] = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    const target = card.value || 0;
    const isFloat = typeof target === "number" && !Number.isInteger(target);
    const start = performance.now();
    const duration = 900;

    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(target * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };

    setTimeout(() => { rafRef.current = requestAnimationFrame(animate); }, delay);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [card.value, delay]);

  const fmtVal = isNaN(displayValue) ? "—" : card.fmt(displayValue);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.bgCard,
        backdropFilter: "blur(16px)",
        borderRadius: 16,
        border: `1px solid ${hovered ? C.borderLight : C.border}`,
        padding: "16px 14px",
        cursor: "default",
        transition: "all 0.2s ease",
        animation: `fadeInUp 0.5s ease-out ${delay}ms both`,
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? `0 12px 32px rgba(0,0,0,0.5), 0 0 20px ${C.accentGlow}` : "0 4px 12px rgba(0,0,0,0.3)"
      }}
    >
      <div style={{ fontSize: 10, fontWeight: 700, color: C.textDim, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {card.label}
      </div>
      <div style={{ fontSize: 18, fontWeight: 800, color: card.color, animation: "countUp 0.4s ease-out" }}>
        {fmtVal}
      </div>
    </div>
  );
}

// ─── Setup Mini Table ─────────────────────────────────────────────────────────
function SetupMiniTable({ trades }) {
  const setups = useMemo(() => {
    const map = {};
    trades.forEach(t => {
      const key = t.entryModel || "Unknown";
      if (!map[key]) map[key] = { total: 0, wins: 0, count: 0 };
      map[key].total += t.pnl;
      map[key].wins += t.pnl > 0 ? 1 : 0;
      map[key].count++;
    });
    return Object.entries(map)
      .map(([name, v]) => ({ name, ...v, wr: v.count ? (v.wins / v.count * 100).toFixed(0) : 0 }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 6);
  }, [trades]);

  if (setups.length === 0) return <div style={{ color: C.textDim, fontSize: 12, textAlign: "center", padding: 16 }}>No data yet</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {setups.map(s => (
        <div key={s.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px", borderRadius: 8, background: "rgba(0,0,0,0.2)" }}>
          <div style={{ fontSize: 11, color: C.textMuted, maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ fontSize: 10, color: C.textDim }}>{s.wr}%</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: pnlColor(s.total), minWidth: 50, textAlign: "right" }}>{fmt(s.total)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Day of Week Mini Heatmap ─────────────────────────────────────────────────
function DayOfWeekMiniHeatmap({ trades }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const data = useMemo(() => {
    const map = Array(5).fill(null).map(() => ({ pnl: 0, count: 0 }));
    trades.forEach(t => {
      const d = new Date(t.date).getDay();
      if (d >= 1 && d <= 5) { map[d - 1].pnl += t.pnl; map[d - 1].count++; }
    });
    return map;
  }, [trades]);

  const maxAbs = Math.max(...data.map(d => Math.abs(d.pnl)), 1);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
      {data.map((d, i) => {
        const intensity = Math.abs(d.pnl) / maxAbs;
        const bgColor = d.pnl >= 0 ? `rgba(16,185,129,${0.1 + intensity * 0.5})` : `rgba(239,68,68,${0.1 + intensity * 0.5})`;
        return (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 9, color: C.textDim, marginBottom: 4 }}>{days[i]}</div>
            <div style={{ padding: "8px 4px", borderRadius: 8, background: bgColor, border: `1px solid ${d.pnl >= 0 ? C.emeraldBorder : C.amberBorder}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: pnlColor(d.pnl) }}>{d.count > 0 ? fmt(d.pnl) : "—"}</div>
              <div style={{ fontSize: 9, color: C.textDim }}>{d.count > 0 ? `${d.count} trades` : ""}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Session Mini Breakdown ───────────────────────────────────────────────────
function SessionMiniBreakdown({ trades }) {
  const sessions = useMemo(() => {
    const map = { Morning: 0, Afternoon: 0, Overnight: 0 };
    trades.forEach(t => {
      if (t.session === "Morning" || t.session === "morning") map.Morning += t.pnl;
      else if (t.session === "Afternoon" || t.session === "afternoon") map.Afternoon += t.pnl;
      else if (t.session === "Overnight" || t.session === "overnight") map.Overnight += t.pnl;
      else {
        const h = new Date(t.date + "T12:00:00").getHours();
        if (h < 12) map.Morning += t.pnl; else if (h < 17) map.Afternoon += t.pnl; else map.Overnight += t.pnl;
      }
    });
    return map;
  }, [trades]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {Object.entries(sessions).map(([name, pnl]) => (
        <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px", borderRadius: 8, background: "rgba(0,0,0,0.2)" }}>
          <div style={{ fontSize: 12, color: C.textMuted }}>{name}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: pnlColor(pnl) }}>{fmt(pnl)}</div>
        </div>
      ))}
    </div>
  );
}

// ─── TRADE PANEL ─────────────────────────────────────────────────────────────
function TradePanel({ trades, activeSetupFilter, activeDayFilter, setActiveSetupFilter, setActiveDayFilter, onAddTrade, milestones }) {
  const [expandedIdx, setExpandedIdx] = useState(null);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const displayedTrades = useMemo(() => {
    return [...trades].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [trades]);

  const todayPnl = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return trades.filter(t => t.date === today).reduce((s, t) => s + t.pnl, 0);
  }, [trades]);

  const currentStreak = useMemo(() => {
    const dailyPnl = {};
    trades.forEach(t => { dailyPnl[t.date] = (dailyPnl[t.date] || 0) + t.pnl; });
    const dates = Object.keys(dailyPnl).sort().reverse();
    let count = 0;
    for (const d of dates) { if (dailyPnl[d] > 0) count++; else break; }
    return count;
  }, [trades]);

  return (
    <>
      {/* Top Stats Strip */}
      <div style={{ ...S.glassCard, padding: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: C.textDim, marginBottom: 4, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Today P&L</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: pnlColor(todayPnl) }}>{fmt(todayPnl)}</div>
          </div>
          <div style={{ textAlign: "center", position: "relative" }}>
            {currentStreak > 0 && (
              <div style={{ position: "absolute", top: -4, right: -4, width: 10, height: 10, borderRadius: "50%", background: C.emerald, animation: "pulseRing 0.8s ease-out" }} />
            )}
            <div style={{ fontSize: 10, color: C.textDim, marginBottom: 4, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Win Streak</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.accent }}>{currentStreak} Days</div>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {activeSetupFilter !== null && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 12, background: `${C.accent}15`, border: `1px solid ${C.accent}40`, animation: "fadeInScale 0.2s ease-out" }}>
          <Filter size={12} color={C.accent} />
          <span style={{ fontSize: 11, color: C.accentLight, flex: 1 }}>Setup: {activeSetupFilter}</span>
          <button onClick={() => setActiveSetupFilter(null)} style={{ background: "none", border: "none", cursor: "pointer", color: C.accent, display: "flex", alignItems: "center" }}>
            <X size={12} />
          </button>
        </div>
      )}
      {activeDayFilter !== null && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 12, background: `${C.accent}15`, border: `1px solid ${C.accent}40`, animation: "fadeInScale 0.2s ease-out" }}>
          <Calendar size={12} color={C.accent} />
          <span style={{ fontSize: 11, color: C.accent, flex: 1 }}>Day: {dayNames[activeDayFilter]}</span>
          <button onClick={() => setActiveDayFilter(null)} style={{ background: "none", border: "none", cursor: "pointer", color: C.accent, display: "flex", alignItems: "center" }}>
            <X size={12} />
          </button>
        </div>
      )}

      {/* Recent Trades */}
      <div style={{ ...S.glassCard, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Recent Trades</h3>
          <button onClick={onAddTrade} style={S.btn("ghost", "sm")}>View All</button>
        </div>

        {displayedTrades.length === 0 ? (
          <div style={{ textAlign: "center", padding: 32, color: C.textDim }}>
            <TrendingUp size={36} style={{ opacity: 0.2, marginBottom: 12 }} />
            <p style={{ fontSize: 13 }}>No trades yet. Start a session!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {displayedTrades.slice(0, 8).map((t, i) => {
              const isExpanded = expandedIdx === i;
              return (
                <div key={i} style={{ borderRadius: 12, border: `1px solid ${isExpanded ? C.borderLight : C.border}`, background: isExpanded ? C.bgHover : "rgba(0,0,0,0.2)", overflow: "hidden", transition: "all 0.25s ease" }}>
                  {/* Row */}
                  <div
                    onClick={() => setExpandedIdx(isExpanded ? null : i)}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", cursor: "pointer" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: pnlBg(t.pnl), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {t.direction === "Long" ? <ArrowUpRight size={16} color={C.emerald} /> : <ArrowDownRight size={16} color={C.amber} />}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{t.ticker} — {t.direction}</div>
                        <div style={{ fontSize: 11, color: C.textDim }}>{t.date}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {t.grade && (
                        <div style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: `${gradeColor(t.grade)}20`, color: gradeColor(t.grade), border: `1px solid ${gradeColor(t.grade)}40` }}>
                          {t.grade}
                        </div>
                      )}
                      <span style={{ fontSize: 14, fontWeight: 800, color: pnlColor(t.pnl) }}>{fmt(t.pnl)}</span>
                      <ChevronRight size={14} color={C.textDim} style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }} />
                    </div>
                  </div>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div style={{ padding: "0 14px 14px", borderTop: `1px solid ${C.border}`, animation: "slideDownExpand 0.3s ease-out" }}>
                      <div style={{ paddingTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                        {t.notes && <div><span style={{ fontSize: 10, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.06em" }}>Notes</span><div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>{t.notes}</div></div>}
                        {t.mistake && <div style={{ display: "flex", gap: 8, alignItems: "center" }}><span style={{ fontSize: 10, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.06em" }}>Mistake</span><div style={{ ...S.badge(C.amber) }}>{t.mistake}</div></div>}
                        {t.entryModel && <div style={{ fontSize: 11, color: C.textMuted }}><span style={{ fontWeight: 600 }}>Setup:</span> {t.entryModel}</div>}
                        {t.contracts && <div style={{ fontSize: 11, color: C.textMuted }}><span style={{ fontWeight: 600 }}>Contracts:</span> {t.contracts}</div>}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Milestone Strip */}
      <MilestoneStrip milestones={milestones} onViewAll={() => setPage("milestones")} />

      {/* Quick-Add FAB */}
      <button
        onClick={onAddTrade}
        title="Add Trade"
        style={{
          width: 56, height: 56, borderRadius: "50%",
          background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`,
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 4px 20px ${C.accentGlow}`,
          alignSelf: "flex-end",
          transition: "all 0.2s ease"
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px) rotate(90deg)"; e.currentTarget.style.boxShadow = `0 8px 32px ${C.accentGlow}, 0 0 40px ${C.accentGlow}`; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) rotate(0deg)"; e.currentTarget.style.boxShadow = `0 4px 20px ${C.accentGlow}`; }}
      >
        <Plus size={22} color={C.white} />
      </button>
    </>
  );
}

// ─── PROP FIRMS PAGE ─────────────────────────────────────────────────────────
function PropFirmsPage({ propAccounts, setPropAccounts, showToast, subscriptions, setSubscriptions, expenses, setExpenses, payouts, setPayouts }) {
  const [showAdd, setShowAdd] = useState(false);
  const [showConnect, setShowConnect] = useState(false);
  const [connectingFirm, setConnectingFirm] = useState(null);
  const [apiCredentials, setApiCredentials] = useState({ apiKey: "", apiSecret: "", accountId: "" });
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [newAccount, setNewAccount] = useState({ firm: "", name: "", balance: 50000, target: 55000, dailyLossLimit: 1000 });

  // Bookkeeping tab state
  const [hqTab, setHqTab] = useState("subscriptions");
  const [editingSub, setEditingSub] = useState(null);
  const [showSubForm, setShowSubForm] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [showExpForm, setShowExpForm] = useState(false);
  const [editingPayout, setEditingPayout] = useState(null);
  const [showPayoutForm, setShowPayoutForm] = useState(false);
  const [bookYear, setBookYear] = useState(new Date().getFullYear().toString());
  const [pdfGenerating, setPdfGenerating] = useState(false);

  // Sub-form state
  const [subForm, setSubForm] = useState({ name: "", cost: "", billingCycle: "monthly", category: "platform", status: "active" });
  const [expForm, setExpForm] = useState({ name: "", amount: "", date: "", category: "fee", firm: "" });
  const [payoutForm, setPayoutForm] = useState({ firm: "", amount: "", date: new Date().toISOString().split("T")[0], account: "" });

  const propFirms = [
    { id: "tradeovate", name: "Tradeovate (NinjaTrader)", icon: "N", color: "#00AEFF", description: "Connect via NinjaTrader API" },
    { id: "topstep", name: "TopStepTrader", icon: "TS", color: "#FF6B35", description: "Connect your TST account" },
    { id: "apex", name: "ApexTrader", icon: "AP", color: "#00D4AA", description: "Connect Apex account" },
    { id: "ftmo", name: "FTMO", icon: "F", color: "#7B68EE", description: "Connect FTMO account" },
  ];

  // ── Computed Vitals ──────────────────────────────────────────────────────
  const totalPayouts = payouts.reduce((s, p) => s + Number(p.amount || 0), 0);
  const totalSubExpenses = subscriptions
    .filter(s => s.status === "active")
    .reduce((s, sub) => s + (sub.billingCycle === "yearly" ? Number(sub.cost) / 12 : Number(sub.cost)), 0);
  const totalOneTimeExpenses = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
  const totalExpenses = totalSubExpenses * 12 + totalOneTimeExpenses;
  const netProfit = totalPayouts - totalExpenses;
  const fundedCount = propAccounts.filter(a => a.status === "funded").length;
  const passRate = propAccounts.length > 0 ? ((fundedCount / propAccounts.length) * 100).toFixed(1) : "0.0";

  // ── Subscription CRUD ───────────────────────────────────────────────────
  const openSubForm = (sub = null) => {
    if (sub) {
      setEditingSub(sub.id);
      setSubForm({ name: sub.name, cost: sub.cost, billingCycle: sub.billingCycle, category: sub.category, status: sub.status });
    } else {
      setEditingSub(null);
      setSubForm({ name: "", cost: "", billingCycle: "monthly", category: "platform", status: "active" });
    }
    setShowSubForm(true);
  };
  const saveSub = () => {
    if (!subForm.name || !subForm.cost) { showToast("Name and cost required", "error"); return; }
    if (editingSub) {
      setSubscriptions(subscriptions.map(s => s.id === editingSub ? { ...s, ...subForm, cost: Number(subForm.cost) } : s));
    } else {
      setSubscriptions([...subscriptions, { ...subForm, cost: Number(subForm.cost), id: Date.now() }]);
    }
    setShowSubForm(false);
    showToast(editingSub ? "Subscription updated" : "Subscription added", "success");
  };
  const deleteSub = (id) => { setSubscriptions(subscriptions.filter(s => s.id !== id)); showToast("Subscription removed", "info"); };

  // ── Expense CRUD ────────────────────────────────────────────────────────
  const openExpForm = (exp = null) => {
    if (exp) {
      setEditingExp(exp.id);
      setExpForm({ name: exp.name, amount: exp.amount, date: exp.date, category: exp.category, firm: exp.firm || "" });
    } else {
      setEditingExp(null);
      setExpForm({ name: "", amount: "", date: new Date().toISOString().split("T")[0], category: "fee", firm: "" });
    }
    setShowExpForm(true);
  };
  const saveExp = () => {
    if (!expForm.name || !expForm.amount) { showToast("Name and amount required", "error"); return; }
    if (editingExp) {
      setExpenses(expenses.map(e => e.id === editingExp ? { ...e, ...expForm, amount: Number(expForm.amount) } : e));
    } else {
      setExpenses([...expenses, { ...expForm, amount: Number(expForm.amount), id: Date.now() }]);
    }
    setShowExpForm(false);
    showToast(editingExp ? "Expense updated" : "Expense added", "success");
  };
  const deleteExp = (id) => { setExpenses(expenses.filter(e => e.id !== id)); showToast("Expense removed", "info"); };

  // ── Payout CRUD ────────────────────────────────────────────────────────
  const openPayoutForm = (p = null) => {
    if (p) {
      setEditingPayout(p.id);
      setPayoutForm({ firm: p.firm, amount: p.amount, date: p.date, account: p.account || "" });
    } else {
      setEditingPayout(null);
      setPayoutForm({ firm: "", amount: "", date: new Date().toISOString().split("T")[0], account: "" });
    }
    setShowPayoutForm(true);
  };
  const savePayout = () => {
    if (!payoutForm.firm || !payoutForm.amount) { showToast("Firm and amount required", "error"); return; }
    if (editingPayout) {
      setPayouts(payouts.map(p => p.id === editingPayout ? { ...p, ...payoutForm, amount: Number(payoutForm.amount) } : p));
    } else {
      setPayouts([...payouts, { ...payoutForm, amount: Number(payoutForm.amount), id: Date.now() }]);
    }
    setShowPayoutForm(false);
    showToast(editingPayout ? "Payout updated" : "Payout added", "success");
  };
  const deletePayout = (id) => { setPayouts(payouts.filter(p => p.id !== id)); showToast("Payout removed", "info"); };

  // ── PDF Bookkeeping ────────────────────────────────────────────────────
  const generatePDF = () => {
    setPdfGenerating(true);
    setTimeout(() => {
      try {
        const doc = new jsPDF();
        const yearNum = parseInt(bookYear);
        const yearSubs = subscriptions.filter(s => s.year === yearNum || !s.year);
        const yearExps = expenses.filter(e => e.date && e.date.startsWith(bookYear));
        const yearPayouts = payouts.filter(p => p.date && p.date.startsWith(bookYear));

        const subTotal = yearSubs.reduce((s, sub) => s + (sub.billingCycle === "yearly" ? Number(sub.cost) : Number(sub.cost) * 12), 0);
        const expTotal = yearExps.reduce((s, e) => s + Number(e.amount || 0), 0);
        const payoutTotal = yearPayouts.reduce((s, p) => s + Number(p.amount || 0), 0);
        const net = payoutTotal - subTotal - expTotal;

        // Header
        doc.setFillColor(99, 102, 241); // C.accent
        doc.rect(0, 0, 220, 40, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("87Capital Trading OS", 14, 20);
        doc.setFontSize(13);
        doc.setFont("helvetica", "normal");
        doc.text(`Bookkeeping Report — ${bookYear}`, 14, 30);

        // Vitals
        let y = 52;
        doc.setTextColor(30, 30, 30);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("ANNUAL SUMMARY", 14, y);
        y += 10;
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        const vitals = [
          ["Total Payouts Received", `$${payoutTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}`],
          ["Total Subscriptions (year)", `$${subTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}`],
          ["Total Expenses", `$${expTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}`],
          ["NET PROFIT", `$${net.toLocaleString("en-US", { minimumFractionDigits: 2 })}`],
          ["Subscriptions Active", `${yearSubs.filter(s => s.status === "active").length}`],
          ["Payouts Received", `${yearPayouts.length}`],
        ];
        vitals.forEach(([label, val]) => {
          doc.setFont("helvetica", "normal");
          doc.text(label, 14, y);
          doc.setFont("helvetica", "bold");
          doc.text(val, 120, y);
          y += 8;
        });

        // Payouts
        if (yearPayouts.length > 0) {
          y += 8;
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.text("PAYOUTS", 14, y);
          y += 8;
          doc.setFontSize(9);
          doc.setFont("helvetica", "bold");
          doc.text("Date", 14, y); doc.text("Firm", 50, y); doc.text("Account", 110, y); doc.text("Amount", 160, y);
          y += 2;
          doc.setDrawColor(200);
          doc.line(14, y, 196, y); y += 6;
          doc.setFont("helvetica", "normal");
          yearPayouts.forEach(p => {
            doc.text(p.date || "—", 14, y);
            doc.text(p.firm || "—", 50, y);
            doc.text(p.account || "—", 110, y);
            doc.text(`$${Number(p.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}`, 160, y);
            y += 7;
            if (y > 270) { doc.addPage(); y = 20; }
          });
        }

        // Subscriptions
        if (yearSubs.length > 0) {
          y += 8;
          if (y > 250) { doc.addPage(); y = 20; }
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.text("SUBSCRIPTIONS", 14, y);
          y += 8;
          doc.setFontSize(9);
          doc.setFont("helvetica", "bold");
          doc.text("Name", 14, y); doc.text("Category", 70, y); doc.text("Billing", 120, y); doc.text("Annual Cost", 160, y);
          y += 2;
          doc.line(14, y, 196, y); y += 6;
          doc.setFont("helvetica", "normal");
          yearSubs.forEach(s => {
            const annual = s.billingCycle === "yearly" ? Number(s.cost) : Number(s.cost) * 12;
            doc.text(s.name || "—", 14, y);
            doc.text(s.category || "—", 70, y);
            doc.text(s.billingCycle || "—", 120, y);
            doc.text(`$${annual.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, 160, y);
            y += 7;
            if (y > 270) { doc.addPage(); y = 20; }
          });
        }

        // Expenses
        if (yearExps.length > 0) {
          y += 8;
          if (y > 250) { doc.addPage(); y = 20; }
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.text("EXPENSES", 14, y);
          y += 8;
          doc.setFontSize(9);
          doc.setFont("helvetica", "bold");
          doc.text("Date", 14, y); doc.text("Name", 50, y); doc.text("Category", 110, y); doc.text("Amount", 160, y);
          y += 2;
          doc.line(14, y, 196, y); y += 6;
          doc.setFont("helvetica", "normal");
          yearExps.forEach(e => {
            doc.text(e.date || "—", 14, y);
            doc.text(e.name || "—", 50, y);
            doc.text(e.category || "—", 110, y);
            doc.text(`$${Number(e.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}`, 160, y);
            y += 7;
            if (y > 270) { doc.addPage(); y = 20; }
          });
        }

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setTextColor(150);
          doc.text(`Generated by 87Capital Trading OS — ${new Date().toLocaleDateString()}`, 14, 287);
          doc.text(`Page ${i} of ${pageCount}`, 186, 287);
        }

        doc.save(`87capital-bookkeeping-${bookYear}.pdf`);
        showToast("PDF downloaded!", "success");
      } catch (err) {
        console.error(err);
        showToast("PDF generation failed", "error");
      }
      setPdfGenerating(false);
    }, 600);
  };

  // ── ROI per firm ────────────────────────────────────────────────────────
  const firmROI = useMemo(() => {
    const firms = {};
    payouts.forEach(p => {
      if (!firms[p.firm]) firms[p.firm] = { payouts: 0, subCost: 0, expCost: 0 };
      firms[p.firm].payouts += Number(p.amount || 0);
    });
    subscriptions.forEach(s => {
      s.firms && JSON.parse(s.firms).forEach(f => {
        if (!firms[f]) firms[f] = { payouts: 0, subCost: 0, expCost: 0 };
        const monthly = s.billingCycle === "yearly" ? Number(s.cost) / 12 : Number(s.cost);
        firms[f].subCost += monthly * 12;
      });
    });
    expenses.forEach(e => {
      if (e.firm) {
        if (!firms[e.firm]) firms[e.firm] = { payouts: 0, subCost: 0, expCost: 0 };
        firms[e.firm].expCost += Number(e.amount || 0);
      }
    });
    return Object.entries(firms).map(([name, data]) => ({
      name, ...data, roi: data.payouts - data.subCost - data.expCost
    })).sort((a, b) => b.roi - a.roi);
  }, [payouts, subscriptions, expenses]);

  const connectToFirm = async (firmId) => {
    if (!apiCredentials.apiKey || !apiCredentials.apiSecret) { showToast("Please enter API Key and Secret", "error"); return; }
    setSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const firm = propFirms.find(f => f.id === firmId);
    const newConnection = {
      id: Date.now(), firmId: firm.id, firmName: firm.name, firmColor: firm.color,
      accountId: apiCredentials.accountId || "DEMO-001",
      apiKey: apiCredentials.apiKey.slice(0, 8) + "...",
      connected: true, lastSync: new Date(),
      balance: 52150.00, equity: 52380.50, openPnl: 230.50,
      marginUsed: 850.00, marginAvailable: 4150.00, todayPnl: 350.00, todayTrades: 3, status: "active"
    };
    setConnectedAccounts([...connectedAccounts, newConnection]);
    setSyncing(false); setShowConnect(false);
    setApiCredentials({ apiKey: "", apiSecret: "", accountId: "" });
    setConnectingFirm(null);
    showToast(`Connected to ${firm.name}!`, "success");
  };

  const addAccount = () => {
    if (!newAccount.firm || !newAccount.name) { showToast("Please fill in firm and account name", "error"); return; }
    setPropAccounts([...propAccounts, { ...newAccount, id: Date.now(), status: "challenge", history: [] }]);
    setNewAccount({ firm: "", name: "", balance: 50000, target: 55000, dailyLossLimit: 1000 });
    setShowAdd(false);
    showToast("Prop account added successfully!", "success");
  };

  const updateBalance = (id, change) => {
    setPropAccounts(propAccounts.map(a => a.id === id ? { ...a, balance: a.balance + change } : a));
  };

  const totalEquity = connectedAccounts.reduce((s, a) => s + a.equity, 0);
  const totalOpenPnl = connectedAccounts.reduce((s, a) => s + a.openPnl, 0);
  const totalTodayPnl = connectedAccounts.reduce((s, a) => s + a.todayPnl, 0);

  const HQ_TABS = [
    { id: "subscriptions", label: "Subscriptions", icon: <CreditCard size={14} /> },
    { id: "expenses", label: "Expenses", icon: <Receipt size={14} /> },
    { id: "payouts", label: "Payouts", icon: <DollarSign size={14} /> },
    { id: "bookkeeping", label: "Bookkeeping", icon: <FileText size={14} /> },
  ];

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div style={{ ...S.page, animation: "fadeIn 0.4s ease-out" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Prop Firm Hub</h1>
          <p style={{ fontSize: 13, color: C.textMuted }}>Track accounts, costs, payouts & ROI</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => setShowConnect(true)} style={S.btn("primary")}><Zap size={16} /> Connect Account</button>
          <button onClick={() => setShowAdd(true)} style={S.btn("ghost")}><Plus size={16} /> Manual Add</button>
        </div>
      </div>

      {/* ── Vitals Strip ──────────────────────────────────────────────── */}
      <div style={{ ...S.glassCard, marginBottom: 20, background: `linear-gradient(135deg, ${C.accent}12, ${C.purple}06)`, padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
            <Activity size={15} color={C.accent} /> Your Vitals
          </h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16 }}>
          {[
            ["All-Time Payouts", fmtUsd(totalPayouts), C.emerald],
            ["Total Expenses", fmtUsd(totalExpenses), C.amber],
            ["Net Profit", fmtUsd(netProfit), netProfit >= 0 ? C.emerald : C.amber],
            ["Pass Rate", `${passRate}%`, C.accent],
            ["Monthly Subs", fmtUsd(totalSubExpenses), C.yellow],
            ["Funded Accounts", `${fundedCount} / ${propAccounts.length}`, C.accent],
          ].map(([label, val, color]) => (
            <div key={label} style={{ textAlign: "center", padding: "12px 8px", background: "rgba(0,0,0,0.2)", borderRadius: 12 }}>
              <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── HQ Tabs ─────────────────────────────────────────────────── */}
      <div style={{ ...S.glassCard, marginBottom: 20, padding: 20 }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 20, borderBottom: `1px solid ${C.border}`, paddingBottom: 14 }}>
          {HQ_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setHqTab(tab.id)}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
                borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13,
                transition: "all 0.2s",
                background: hqTab === tab.id ? `linear-gradient(135deg, ${C.accent}, ${C.purple})` : "rgba(0,0,0,0.25)",
                color: hqTab === tab.id ? C.white : C.textMuted,
                boxShadow: hqTab === tab.id ? `0 4px 16px ${C.accentGlow}` : "none",
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ── Subscriptions Tab ──────────────────────────────────────── */}
        {hqTab === "subscriptions" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: C.textMuted }}>
                Monthly cost: <span style={{ fontWeight: 700, color: C.yellow }}>{fmtUsd(totalSubExpenses)}</span>
                {" · "}Annual: <span style={{ fontWeight: 700, color: C.text }}>{fmtUsd(totalSubExpenses * 12)}</span>
              </div>
              <button onClick={() => openSubForm()} style={S.btn("primary", "sm")}><Plus size={13} /> Add</button>
            </div>
            {subscriptions.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: C.textMuted }}>
                <CreditCard size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                <p>No subscriptions yet. Add your trading platform costs.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {subscriptions.map(sub => {
                  const annual = sub.billingCycle === "yearly" ? Number(sub.cost) : Number(sub.cost) * 12;
                  return (
                    <div key={sub.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "rgba(0,0,0,0.2)", borderRadius: 12, border: `1px solid ${sub.status === "paused" ? C.yellow + "40" : C.border}` }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{sub.name}</div>
                        <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
                          {fmtUsd(sub.billingCycle === "yearly" ? Number(sub.cost) / 12 : Number(sub.cost))}/mo · {sub.billingCycle} · {sub.category} · Annual: {fmtUsd(annual)}
                        </div>
                      </div>
                      <span style={S.badge(sub.status === "active" ? C.emerald : C.yellow)}>{sub.status}</span>
                      <button onClick={() => openSubForm(sub)} style={S.btn("ghost", "sm")}><Edit3 size={12} /></button>
                      <button onClick={() => deleteSub(sub.id)} style={{ ...S.btn("danger", "sm"), padding: "6px 10px" }}><Trash2 size={12} /></button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Expenses Tab ──────────────────────────────────────────── */}
        {hqTab === "expenses" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: C.textMuted }}>
                Total one-time expenses: <span style={{ fontWeight: 700, color: C.amber }}>{fmtUsd(totalOneTimeExpenses)}</span>
              </div>
              <button onClick={() => openExpForm()} style={S.btn("primary", "sm")}><Plus size={13} /> Add</button>
            </div>
            {expenses.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: C.textMuted }}>
                <Receipt size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                <p>No expenses recorded. Log one-time costs here.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {expenses.map(exp => (
                  <div key={exp.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "rgba(0,0,0,0.2)", borderRadius: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{exp.name}</div>
                      <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
                        {exp.date} · {exp.category}{exp.firm ? ` · ${exp.firm}` : ""}
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, color: C.amber, fontSize: 14 }}>-{fmtUsd(Number(exp.amount))}</div>
                    <button onClick={() => openExpForm(exp)} style={S.btn("ghost", "sm")}><Edit3 size={12} /></button>
                    <button onClick={() => deleteExp(exp.id)} style={{ ...S.btn("danger", "sm"), padding: "6px 10px" }}><Trash2 size={12} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Payouts Tab ────────────────────────────────────────────── */}
        {hqTab === "payouts" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: C.textMuted }}>
                Total payouts: <span style={{ fontWeight: 700, color: C.emerald }}>{fmtUsd(totalPayouts)}</span> across {payouts.length} payout{payouts.length !== 1 ? "s" : ""}
              </div>
              <button onClick={() => openPayoutForm()} style={S.btn("primary", "sm")}><Plus size={13} /> Add</button>
            </div>
            {payouts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: C.textMuted }}>
                <DollarSign size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                <p>No payouts recorded yet. Add payouts as you receive them.</p>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[...payouts].sort((a, b) => (b.date || "").localeCompare(a.date || "")).map(p => (
                    <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "rgba(0,0,0,0.2)", borderRadius: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{p.firm}</div>
                        <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
                          {p.date}{p.account ? ` · ${p.account}` : ""}
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, color: C.emerald, fontSize: 14 }}>+{fmtUsd(Number(p.amount))}</div>
                      <button onClick={() => openPayoutForm(p)} style={S.btn("ghost", "sm")}><Edit3 size={12} /></button>
                      <button onClick={() => deletePayout(p.id)} style={{ ...S.btn("danger", "sm"), padding: "6px 10px" }}><Trash2 size={12} /></button>
                    </div>
                  ))}
                </div>
                {/* ROI Chart */}
                {firmROI.length > 0 && (
                  <div style={{ marginTop: 24 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: C.textMuted }}>ROI PER FIRM</h4>
                    <ResponsiveContainer width="100%" height={Math.max(120, firmROI.length * 40)}>
                      <BarChart data={firmROI} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
                        <XAxis type="number" tickFormatter={v => `$${v >= 0 ? "+" : ""}${v.toLocaleString()}`} tick={{ fill: C.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis type="category" dataKey="name" tick={{ fill: C.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                        <Tooltip formatter={(v) => [`$${v.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, "Net ROI"]} contentStyle={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, color: C.text }} />
                        <Bar dataKey="roi" radius={[0, 6, 6, 0]}>
                          {firmROI.map((entry, i) => (
                            <Cell key={i} fill={entry.roi >= 0 ? C.emerald : C.amber} fillOpacity={0.85} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Bookkeeping Tab ────────────────────────────────────────── */}
        {hqTab === "bookkeeping" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, padding: 16, background: "rgba(0,0,0,0.2)", borderRadius: 12 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Year Selection</div>
                <div style={{ fontSize: 12, color: C.textMuted }}>Generate a PDF for a specific tax year</div>
              </div>
              <select value={bookYear} onChange={e => setBookYear(e.target.value)} style={{ ...S.input, width: 140 }}>
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <button onClick={generatePDF} disabled={pdfGenerating} style={{ ...S.btn("primary", "md"), minWidth: 160 }}>
                {pdfGenerating ? <><RefreshCw size={13} style={{ animation: "spin 1s linear infinite" }} /> Generating...</> : <><Download size={13} /> Download PDF</>}
              </button>
            </div>

            {/* Year summary preview */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
              {(() => {
                const yearP = payouts.filter(p => p.date && p.date.startsWith(bookYear));
                const yearE = expenses.filter(e => e.date && e.date.startsWith(bookYear));
                const yearSubs = subscriptions;
                const yPayouts = yearP.reduce((s, p) => s + Number(p.amount || 0), 0);
                const ySubs = yearSubs.reduce((s, sub) => s + (sub.billingCycle === "yearly" ? Number(sub.cost) : Number(sub.cost) * 12), 0);
                const yExp = yearE.reduce((s, e) => s + Number(e.amount || 0), 0);
                const yNet = yPayouts - ySubs - yExp;
                return [
                  ["Payouts", yPayouts, C.emerald],
                  ["Subscriptions", ySubs, C.yellow],
                  ["Net Profit", yNet, yNet >= 0 ? C.emerald : C.amber],
                ].map(([label, val, color]) => (
                  <div key={label} style={{ padding: 16, background: "rgba(0,0,0,0.2)", borderRadius: 12, textAlign: "center" }}>
                    <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6, textTransform: "uppercase", fontWeight: 600 }}>{label}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color }}>{fmtUsd(val)}</div>
                  </div>
                ));
              })()}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div style={{ padding: 16, background: "rgba(0,0,0,0.2)", borderRadius: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10, color: C.textMuted }}>SUBSCRIPTIONS (annual)</div>
                {subscriptions.length === 0 ? (
                  <div style={{ fontSize: 12, color: C.textDim }}>No subscriptions</div>
                ) : subscriptions.map(s => (
                  <div key={s.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
                    <span>{s.name}</span>
                    <span style={{ color: C.yellow }}>{fmtUsd(s.billingCycle === "yearly" ? Number(s.cost) : Number(s.cost) * 12)}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: 16, background: "rgba(0,0,0,0.2)", borderRadius: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10, color: C.textMuted }}>TOP PAYOUTS THIS YEAR</div>
                {payouts.filter(p => p.date && p.date.startsWith(bookYear)).sort((a, b) => Number(b.amount) - Number(a.amount)).slice(0, 5).map(p => (
                  <div key={p.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
                    <span>{p.firm} <span style={{ color: C.textDim }}>{p.date}</span></span>
                    <span style={{ color: C.emerald }}>{fmtUsd(Number(p.amount))}</span>
                  </div>
                ))}
                {payouts.filter(p => p.date && p.date.startsWith(bookYear)).length === 0 && (
                  <div style={{ fontSize: 12, color: C.textDim }}>No payouts for {bookYear}</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Connected Accounts ──────────────────────────────────────────── */}
      {connectedAccounts.length > 0 && (
        <>
          <div style={{ ...S.glassCard, marginBottom: 20, padding: 20, background: `linear-gradient(135deg, ${C.accent}10, ${C.purple}05)` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.emerald, animation: "livePulse 1.5s infinite" }} />
                Live Connected Accounts
              </h3>
              <button onClick={() => connectedAccounts.forEach(a => setConnectedAccounts(prev => prev.map(acc => acc.id === a.id ? { ...acc, lastSync: new Date() } : acc)))} disabled={syncing} style={{ ...S.btn("ghost", "sm") }}>
                <RefreshCw size={14} style={{ animation: syncing ? "spin 1s linear infinite" : "none" }} /> Sync All
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
              {[["TOTAL EQUITY", fmtUsd(totalEquity), C.text], ["OPEN P&L", fmt(totalOpenPnl), totalOpenPnl >= 0 ? C.emerald : C.amber], ["TODAY'S P&L", fmt(totalTodayPnl), totalTodayPnl >= 0 ? C.emerald : C.amber], ["ACCOUNTS", connectedAccounts.length, C.accent]].map(([label, val, color]) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: 20, marginBottom: 24 }}>
            {connectedAccounts.map(account => (
              <div key={account.id} style={{ ...S.glassCard, borderTop: `3px solid ${account.firmColor}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: account.firmColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: C.white }}>{account.firmName.split(" ")[0][0]}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{account.firmName}</div>
                      <div style={{ fontSize: 11, color: C.textMuted }}>{account.accountId}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.emerald, animation: "livePulse 1.5s infinite" }} />
                    <span style={{ fontSize: 11, color: C.emerald }}>Live</span>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
                  {[["EQUITY", fmtUsd(account.equity)], ["OPEN P&L", fmt(account.openPnl), account.openPnl >= 0 ? C.emerald : C.amber], ["TODAY", fmt(account.todayPnl), account.todayPnl >= 0 ? C.emerald : C.amber]].map(([label, val, color]) => (
                    <div key={label} style={{ padding: 12, background: "rgba(0,0,0,0.2)", borderRadius: 10, textAlign: "center" }}>
                      <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>{label}</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: color || C.text }}>{val}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16, fontSize: 11 }}>
                  <div><span style={{ color: C.textMuted }}>Margin Used: </span><span style={{ fontWeight: 600 }}>{fmtUsd(account.marginUsed)}</span></div>
                  <div><span style={{ color: C.textMuted }}>Available: </span><span style={{ fontWeight: 600, color: C.emerald }}>{fmtUsd(account.marginAvailable)}</span></div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setConnectedAccounts(prev => prev.map(acc => acc.id === account.id ? { ...acc, lastSync: new Date() } : acc))} disabled={syncing} style={{ ...S.btn("ghost", "sm"), flex: 1 }}><RefreshCw size={12} /> Sync</button>
                  <button onClick={() => setConnectedAccounts(prev => prev.filter(acc => acc.id !== account.id))} style={{ ...S.btn("danger", "sm") }}><X size={12} /> Disconnect</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Manual Accounts */}
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Manual Accounts</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 20 }}>
        {propAccounts.length === 0 ? (
          <div style={{ ...S.glassCard, padding: 40, gridColumn: "1/-1", textAlign: "center" }}>
            <Briefcase size={40} color={C.textDim} style={{ opacity: 0.3, marginBottom: 12 }} />
            <p style={{ color: C.textMuted }}>No manual accounts. Connect via API for live tracking.</p>
          </div>
        ) : propAccounts.map(account => {
          const startingBalance = account.startingBalance || 50000;
          return (
            <div key={account.id} style={S.glassCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", marginBottom: 4 }}>{account.firm}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>{account.name}</h3>
                </div>
                <span style={S.badge(account.status === "funded" ? C.emerald : C.yellow)}>{account.status === "funded" ? "Funded" : "Challenge"}</span>
              </div>
              <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                <div><div style={S.label}>Balance</div><div style={{ fontSize: 20, fontWeight: 800 }}>{fmtUsd(account.balance)}</div></div>
                <div><div style={S.label}>Target</div><div style={{ fontSize: 20, fontWeight: 800, color: C.emerald }}>{fmtUsd(account.target)}</div></div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => updateBalance(account.id, 500)} style={{ ...S.btn("success", "sm"), flex: 1 }}><Plus size={12} /> +$500</button>
                <button onClick={() => updateBalance(account.id, -100)} style={{ ...S.btn("danger", "sm"), flex: 1 }}><TrendingDown size={12} /> -$100</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────── */}
      {/* Sub Form */}
      {showSubForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3000, backdropFilter: "blur(8px)" }}>
          <div style={{ ...S.glassCard, padding: 28, width: 460, maxWidth: "95vw" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>{editingSub ? "Edit Subscription" : "Add Subscription"}</h3>
              <button onClick={() => setShowSubForm(false)} style={S.btn("ghost", "sm")}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div><label style={S.label}>Name</label><input value={subForm.name} onChange={e => setSubForm({ ...subForm, name: e.target.value })} style={S.input} placeholder="e.g. Tradovate Pro" /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div><label style={S.label}>Cost</label><input type="number" value={subForm.cost} onChange={e => setSubForm({ ...subForm, cost: e.target.value })} style={S.input} placeholder="0.00" /></div>
                <div><label style={S.label}>Billing</label>
                  <select value={subForm.billingCycle} onChange={e => setSubForm({ ...subForm, billingCycle: e.target.value })} style={S.input}>
                    <option value="monthly">Monthly</option><option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div><label style={S.label}>Category</label>
                  <select value={subForm.category} onChange={e => setSubForm({ ...subForm, category: e.target.value })} style={S.input}>
                    <option value="platform">Platform</option><option value="data">Data Feed</option><option value="community">Community</option><option value="other">Other</option>
                  </select>
                </div>
                <div><label style={S.label}>Status</label>
                  <select value={subForm.status} onChange={e => setSubForm({ ...subForm, status: e.target.value })} style={S.input}>
                    <option value="active">Active</option><option value="paused">Paused</option>
                  </select>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
              <button onClick={() => setShowSubForm(false)} style={{ ...S.btn("ghost", "md"), flex: 1 }}>Cancel</button>
              <button onClick={saveSub} style={{ ...S.btn("primary", "md"), flex: 1 }}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Expense Form */}
      {showExpForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3000, backdropFilter: "blur(8px)" }}>
          <div style={{ ...S.glassCard, padding: 28, width: 460, maxWidth: "95vw" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>{editingExp ? "Edit Expense" : "Add Expense"}</h3>
              <button onClick={() => setShowExpForm(false)} style={S.btn("ghost", "sm")}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div><label style={S.label}>Name</label><input value={expForm.name} onChange={e => setExpForm({ ...expForm, name: e.target.value })} style={S.input} placeholder="e.g. Evaluation fee" /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div><label style={S.label}>Amount</label><input type="number" value={expForm.amount} onChange={e => setExpForm({ ...expForm, amount: e.target.value })} style={S.input} placeholder="0.00" /></div>
                <div><label style={S.label}>Date</label><input type="date" value={expForm.date} onChange={e => setExpForm({ ...expForm, date: e.target.value })} style={S.input} /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div><label style={S.label}>Category</label>
                  <select value={expForm.category} onChange={e => setExpForm({ ...expForm, category: e.target.value })} style={S.input}>
                    <option value="fee">Evaluation Fee</option><option value="subscription">Subscription</option><option value="tool">Trading Tool</option><option value="other">Other</option>
                  </select>
                </div>
                <div><label style={S.label}>Firm (optional)</label><input value={expForm.firm} onChange={e => setExpForm({ ...expForm, firm: e.target.value })} style={S.input} placeholder="e.g. FTMO" /></div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
              <button onClick={() => setShowExpForm(false)} style={{ ...S.btn("ghost", "md"), flex: 1 }}>Cancel</button>
              <button onClick={saveExp} style={{ ...S.btn("primary", "md"), flex: 1 }}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Payout Form */}
      {showPayoutForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3000, backdropFilter: "blur(8px)" }}>
          <div style={{ ...S.glassCard, padding: 28, width: 460, maxWidth: "95vw" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>{editingPayout ? "Edit Payout" : "Add Payout"}</h3>
              <button onClick={() => setShowPayoutForm(false)} style={S.btn("ghost", "sm")}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div><label style={S.label}>Firm</label><input value={payoutForm.firm} onChange={e => setPayoutForm({ ...payoutForm, firm: e.target.value })} style={S.input} placeholder="e.g. TopStepTrader" /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div><label style={S.label}>Amount</label><input type="number" value={payoutForm.amount} onChange={e => setPayoutForm({ ...payoutForm, amount: e.target.value })} style={S.input} placeholder="0.00" /></div>
                <div><label style={S.label}>Date</label><input type="date" value={payoutForm.date} onChange={e => setPayoutForm({ ...payoutForm, date: e.target.value })} style={S.input} /></div>
              </div>
              <div><label style={S.label}>Account (optional)</label><input value={payoutForm.account} onChange={e => setPayoutForm({ ...payoutForm, account: e.target.value })} style={S.input} placeholder="e.g. MNQ-12345" /></div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
              <button onClick={() => setShowPayoutForm(false)} style={{ ...S.btn("ghost", "md"), flex: 1 }}>Cancel</button>
              <button onClick={savePayout} style={{ ...S.btn("primary", "md"), flex: 1 }}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Connect Modal */}
      {showConnect && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3000, backdropFilter: "blur(8px)" }}>
          <div style={{ ...S.glassCard, padding: 32, width: 500, maxWidth: "95vw" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700 }}>Connect Prop Firm</h3>
              <button onClick={() => { setShowConnect(false); setConnectingFirm(null); }} style={S.btn("ghost", "sm")}><X size={18} /></button>
            </div>
            {!connectingFirm ? (
              <><p style={{ color: C.textMuted, marginBottom: 20 }}>Select a prop firm to connect:</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {propFirms.map(firm => (
                    <button key={firm.id} onClick={() => setConnectingFirm(firm)} style={{ display: "flex", alignItems: "center", gap: 16, padding: 16, background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`, borderRadius: 12, cursor: "pointer", transition: "all 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = firm.color} onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: firm.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: C.white }}>{firm.icon}</div>
                      <div style={{ textAlign: "left" }}><div style={{ fontSize: 14, fontWeight: 700 }}>{firm.name}</div><div style={{ fontSize: 12, color: C.textMuted }}>{firm.description}</div></div>
                    </button>
                  ))}
                </div></>
            ) : (
              <><div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, padding: 12, background: "rgba(0,0,0,0.3)", borderRadius: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: connectingFirm.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: C.white }}>{connectingFirm.icon}</div>
                <div><div style={{ fontSize: 14, fontWeight: 700 }}>{connectingFirm.name}</div><div style={{ fontSize: 12, color: C.textMuted }}>Enter your API credentials</div></div>
              </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div><label style={S.label}>API Key</label><input type="password" value={apiCredentials.apiKey} onChange={e => setApiCredentials({ ...apiCredentials, apiKey: e.target.value })} style={S.input} placeholder="Enter your API key" /></div>
                  <div><label style={S.label}>API Secret</label><input type="password" value={apiCredentials.apiSecret} onChange={e => setApiCredentials({ ...apiCredentials, apiSecret: e.target.value })} style={S.input} placeholder="Enter your API secret" /></div>
                  <div><label style={S.label}>Account ID (Optional)</label><input value={apiCredentials.accountId} onChange={e => setApiCredentials({ ...apiCredentials, accountId: e.target.value })} style={S.input} placeholder="Your account identifier" /></div>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                  <button onClick={() => { setConnectingFirm(null); setApiCredentials({ apiKey: "", apiSecret: "", accountId: "" }); }} style={{ ...S.btn("ghost", "md"), flex: 1 }}>Back</button>
                  <button onClick={() => connectToFirm(connectingFirm.id)} disabled={syncing} style={{ ...S.btn("primary", "md"), flex: 1 }}>{syncing ? "Connecting..." : "Connect"}</button>
                </div></>
            )}
          </div>
        </div>
      )}

      {/* Add Account Modal */}
      {showAdd && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3000, backdropFilter: "blur(8px)" }}>
          <div style={{ ...S.glassCard, padding: 32, width: 480, maxWidth: "95vw" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700 }}>Add Manual Account</h3>
              <button onClick={() => setShowAdd(false)} style={S.btn("ghost", "sm")}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Select label="Firm" value={newAccount.firm} onChange={v => setNewAccount({ ...newAccount, firm: v })} options={PROP_FIRMS} />
              <div><label style={S.label}>Account Name</label><input value={newAccount.name} onChange={e => setNewAccount({ ...newAccount, name: e.target.value })} style={S.input} placeholder="My MNQ Account" /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div><label style={S.label}>Current Balance ($)</label><input type="number" value={newAccount.balance} onChange={e => setNewAccount({ ...newAccount, balance: Number(e.target.value) })} style={S.input} /></div>
                <div><label style={S.label}>Target ($)</label><input type="number" value={newAccount.target} onChange={e => setNewAccount({ ...newAccount, target: Number(e.target.value) })} style={S.input} /></div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button onClick={() => setShowAdd(false)} style={{ ...S.btn("ghost", "md"), flex: 1 }}>Cancel</button>
              <button onClick={addAccount} style={{ ...S.btn("primary", "md"), flex: 1 }}>Add Account</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── NEWS PAGE ───────────────────────────────────────────────────────────────
function NewsPage({ showToast }) {
  const [newsBlocked, setNewsBlocked] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [countdown, setCountdown] = useState({});
  const [squawkNews, setSquawkNews] = useState([]);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [viewMode, setViewMode] = useState("list"); // "list" or "calendar"

  // Market Squawk headlines
  const marketNews = [
    { headline: "S&P 500 futures up 0.5% as investors await Fed decision", source: "CNBC", sentiment: "bullish", time: "2m ago" },
    { headline: "Oil prices surge 2% on Middle East tensions", source: "Reuters", sentiment: "volatile", time: "5m ago" },
    { headline: "Treasury yields fall as inflation data cools", source: "MarketWatch", sentiment: "bullish", time: "8m ago" },
    { headline: "Bitcoin breaks $95,000 resistance level", source: "CNBC", sentiment: "bullish", time: "12m ago" },
    { headline: "Euro strengthens after ECB rate decision", source: "Reuters", sentiment: "neutral", time: "15m ago" },
    { headline: "Gold hits new all-time high above $3,200", source: "MarketWatch", sentiment: "bullish", time: "18m ago" },
    { headline: "Tech stocks lead market rally", source: "CNBC", sentiment: "bullish", time: "22m ago" },
    { headline: "Volatility index drops to 3-month low", source: "Reuters", sentiment: "bullish", time: "25m ago" },
    { headline: "Dollar weakens on trade deficit data", source: "MarketWatch", sentiment: "bearish", time: "30m ago" },
    { headline: "Natural gas futures jump on cold weather forecast", source: "Reuters", sentiment: "volatile", time: "35m ago" },
  ];

  // Weekly calendar events (high impact)
  const weeklyEvents = [
    { day: "Mon", date: 14, events: [{ time: "08:30", event: "Core CPI", currency: "USD", impact: "High" }] },
    { day: "Tue", date: 15, events: [{ time: "09:00", event: "Retail Sales", currency: "USD", impact: "High" }] },
    { day: "Wed", date: 16, events: [{ time: "14:00", event: "FOMC Decision", currency: "USD", impact: "High" }, { time: "14:30", event: "Fed Press Conference", currency: "USD", impact: "Medium" }] },
    { day: "Thu", date: 17, events: [{ time: "08:30", event: "Jobless Claims", currency: "USD", impact: "Medium" }] },
    { day: "Fri", date: 18, events: [{ time: "09:45", event: "Flash PMI", currency: "USD", impact: "Medium" }, { time: "10:00", event: "Consumer Sentiment", currency: "USD", impact: "Medium" }] },
  ];

  // Economic calendar with countdown
  const economicEvents = [
    { time: "08:30", currency: "USD", event: "Core CPI", impact: "High", previous: "0.3%", forecast: "0.2%", actual: null },
    { time: "10:00", currency: "USD", event: "ISM Manufacturing PMI", impact: "High", previous: "46.8", forecast: "48.5", actual: null },
    { time: "14:00", currency: "USD", event: "FOMC Meeting Minutes", impact: "Medium", previous: "—", forecast: "—", actual: null },
    { time: "15:00", currency: "EUR", event: "ECB President Speech", impact: "Medium", previous: "—", forecast: "—", actual: null },
    { time: "15:30", currency: "USD", event: "Crude Oil Inventories", impact: "Low", previous: "-2.5M", forecast: "-1.8M", actual: null },
  ];

  // Auto-refresh squawk news every 45 seconds
  useEffect(() => {
    setSquawkNews(marketNews);
    const interval = setInterval(() => {
      setCurrentNewsIndex(prev => (prev + 1) % marketNews.length);
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  // Countdown timer for economic events
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const newCountdown = {};
      
      economicEvents.forEach((event, i) => {
        const [hours, minutes] = event.time.split(":").map(Number);
        const eventTime = new Date();
        eventTime.setHours(hours, minutes, 0, 0);
        
        if (eventTime <= now) {
          newCountdown[i] = null;
          return;
        }
        
        const diff = eventTime - now;
        const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
        const minsLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secsLeft = Math.floor((diff % (1000 * 60)) / 1000);
        
        if (hoursLeft > 0) {
          newCountdown[i] = `${hoursLeft}h ${minsLeft}m`;
        } else if (minsLeft > 0) {
          newCountdown[i] = `${minsLeft}m ${secsLeft}s`;
        } else {
          newCountdown[i] = `${secsLeft}s`;
        }
      });
      
      setCountdown(newCountdown);
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Request notification permission
  const enableNotifications = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        showToast("Notifications enabled! You'll be alerted before high-impact events.", "success");
      } else {
        showToast("Notifications blocked. Enable in browser settings.", "warning");
      }
    } else {
      showToast("Your browser doesn't support notifications.", "error");
    }
  };

  const getImpactColor = (impact) => {
    if (impact === "High") return C.amber;
    if (impact === "Medium") return C.yellow;
    return C.emerald;
  };

  const getSentimentColor = (sentiment) => {
    if (sentiment === "bullish") return C.emerald;
    if (sentiment === "bearish") return C.amber;
    return C.yellow;
  };

  const getSentimentBg = (sentiment) => {
    if (sentiment === "bullish") return `${C.emerald}15`;
    if (sentiment === "bearish") return `${C.amber}15`;
    return `${C.yellow}15`;
  };

  return (
    <div style={{ ...S.page, animation: "fadeIn 0.4s ease-out" }}>
      {/* Market Squawk Banner */}
      <div style={{
        ...S.glassCard, marginBottom: 20, padding: "12px 20px",
        background: `linear-gradient(90deg, ${C.bgCard}, ${C.accent}10, ${C.bgCard})`,
        border: `1px solid ${C.border}`
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "6px 12px", borderRadius: 8,
            background: `${C.accent}20`, border: `1px solid ${C.accent}40`
          }}>
            <Radio size={14} color={C.accent} style={{ animation: "livePulse 1.5s infinite" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: C.accentLight }}>SQUAWK</span>
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: getSentimentColor(squawkNews[currentNewsIndex]?.sentiment),
                animation: "livePulse 1.5s infinite"
              }} />
              <span style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>
                {squawkNews[currentNewsIndex]?.headline}
              </span>
              <span style={{ 
                fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                background: getSentimentBg(squawkNews[currentNewsIndex]?.sentiment),
                color: getSentimentColor(squawkNews[currentNewsIndex]?.sentiment)
              }}>
                {squawkNews[currentNewsIndex]?.source}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>News & Calendar</h1>
          <p style={{ fontSize: 13, color: C.textMuted }}>High-impact events that affect your trades</p>
        </div>
        
        {/* View Toggle */}
        <div style={{ display: "flex", gap: 8 }}>
          <button 
            onClick={() => setViewMode("list")}
            style={{
              padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 12,
              background: viewMode === "list" ? C.accent : "transparent",
              color: viewMode === "list" ? C.white : C.textMuted,
              border: `1px solid ${viewMode === "list" ? C.accent : C.border}`
            }}
          >
            List View
          </button>
          <button 
            onClick={() => setViewMode("calendar")}
            style={{
              padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 12,
              background: viewMode === "calendar" ? C.accent : "transparent",
              color: viewMode === "calendar" ? C.white : C.textMuted,
              border: `1px solid ${viewMode === "calendar" ? C.accent : C.border}`
            }}
          >
            Calendar View
          </button>
        </div>
      </div>

      {/* Notification Toggle */}
      <div style={{ ...S.glassCard, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>News Alerts</h4>
          <p style={{ fontSize: 12, color: C.textMuted, margin: 0 }}>Get notified before high-impact events</p>
        </div>
        <button onClick={enableNotifications} style={{
          ...S.btn(notificationsEnabled ? "success" : "ghost", "sm"),
          cursor: notificationsEnabled ? "default" : "pointer"
        }}>
          <Bell size={14} />
          {notificationsEnabled ? "Enabled" : "Enable Alerts"}
        </button>
      </div>

      {/* List View */}
      {viewMode === "list" && (
        <>
          {/* Events List with Countdown */}
          <div style={S.glassCard}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Today's Events</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {economicEvents.map((event, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 16, padding: 14, borderRadius: 12,
                  background: "rgba(0,0,0,0.2)", border: `1px solid ${C.border}`,
                  flexWrap: "wrap"
                }}>
                  {/* Countdown Badge */}
                  <div style={{
                    padding: "8px 12px", borderRadius: 10, textAlign: "center", minWidth: 80,
                    background: countdown[i] ? `${C.accent}15` : "rgba(0,0,0,0.3)",
                    border: `1px solid ${countdown[i] ? C.accent + "40" : C.border}`
                  }}>
                    <div style={{ fontSize: countdown[i] ? 12 : 14, fontWeight: 700, color: countdown[i] ? C.accentLight : C.text }}>
                      {countdown[i] || event.time}
                    </div>
                    {countdown[i] && (
                      <div style={{ fontSize: 9, color: C.textDim, marginTop: 2 }}>until release</div>
                    )}
                  </div>
                  
                  {/* Event Details */}
                  <div style={{ flex: 1, minWidth: 150 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{event.event}</div>
                    <div style={{ fontSize: 12, color: C.textMuted }}>{event.currency}</div>
                  </div>
                  
                  {/* Impact Badge */}
                  <span style={S.badge(getImpactColor(event.impact))}>{event.impact}</span>
                  
                  {/* Data */}
                  <div style={{ display: "flex", gap: 16, textAlign: "center" }}>
                    <div>
                      <div style={{ fontSize: 9, color: C.textDim, marginBottom: 2 }}>PREVIOUS</div>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{event.previous}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 9, color: C.textDim, marginBottom: 2 }}>FORECAST</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: C.accent }}>{event.forecast}</div>
                    </div>
                    {event.actual && (
                      <div>
                        <div style={{ fontSize: 9, color: C.textDim, marginBottom: 2 }}>ACTUAL</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: C.emerald }}>{event.actual}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Calendar View */}
      {viewMode === "calendar" && (
        <div style={S.glassCard}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>This Week</h3>
          
          {/* Weekly Calendar Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
            {weeklyEvents.map((day, i) => {
              const hasHighImpact = day.events.some(e => e.impact === "High");
              const isToday = day.date === new Date().getDate();
              
              return (
                <div key={i} style={{
                  padding: 16, borderRadius: 12, textAlign: "center",
                  background: isToday ? `${C.accent}15` : "rgba(0,0,0,0.2)",
                  border: `1px solid ${isToday ? C.accent : hasHighImpact ? C.amber : C.border}`
                }}>
                  <div style={{ fontSize: 11, color: C.textDim, marginBottom: 4, fontWeight: 600 }}>{day.day}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: isToday ? C.accent : C.text, marginBottom: 8 }}>{day.date}</div>
                  
                  {/* Events for this day */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {day.events.map((event, j) => (
                      <div key={j} style={{
                        padding: "6px 8px", borderRadius: 6,
                        background: `${getImpactColor(event.impact)}15`,
                        border: `1px solid ${getImpactColor(event.impact)}30`
                      }}>
                        <div style={{ fontSize: 10, color: getImpactColor(event.impact), fontWeight: 700 }}>{event.time}</div>
                        <div style={{ fontSize: 11, fontWeight: 600, marginTop: 2 }}>{event.event}</div>
                        <div style={{ fontSize: 9, color: C.textDim }}>{event.currency}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Legend */}
          <div style={{ display: "flex", gap: 16, marginTop: 20, justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: C.amber }} />
              <span style={{ fontSize: 11, color: C.textDim }}>High Impact</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: C.yellow }} />
              <span style={{ fontSize: 11, color: C.textDim }}>Medium Impact</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: C.emerald }} />
              <span style={{ fontSize: 11, color: C.textDim }}>Low Impact</span>
            </div>
          </div>
        </div>
      )}

      {/* Market News Feed */}
      <div style={{ ...S.glassCard, marginTop: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <Radio size={18} color={C.accent} /> Market News
          <span style={{ fontSize: 11, color: C.textDim, fontWeight: 400 }}>Auto-refreshes every 45s</span>
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {squawkNews.map((news, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: 12, padding: 12, borderRadius: 10,
              background: getSentimentBg(news.sentiment),
              border: `1px solid ${getSentimentColor(news.sentiment)}30`
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%", marginTop: 6,
                background: getSentimentColor(news.sentiment)
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{news.headline}</div>
                <div style={{ display: "flex", gap: 12, fontSize: 11, color: C.textDim }}>
                  <span style={{ fontWeight: 600 }}>{news.source}</span>
                  <span>{news.time}</span>
                  <span style={{ 
                    color: getSentimentColor(news.sentiment),
                    textTransform: "capitalize"
                  }}>
                    {news.sentiment}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PRE-SESSION PAGE ───────────────────────────────────────────────────────
function PreSessionPage({ onStartSession, setPage, spiritualMode = true }) {
  const [step, setStep] = useState(0);
  const [ardasDone, setArdasDone] = useState(false);
  const [analysis, setAnalysis] = useState({ bias: "", htf: "", mmxm: "", newsDay: "", notes: "" });
  const [chartScreenshot, setChartScreenshot] = useState(null);
  const [rulesChecked, setRulesChecked] = useState(TRADING_RULES.map(() => false));

  const allRulesChecked = rulesChecked.every(Boolean);
  const steps = [spiritualMode ? "Ardas" : "Center", "Analysis", "Commit"];

  return (
    <div style={{ ...S.page, animation: "fadeIn 0.4s ease-out" }}>
      {/* Progress */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 40 }}>
        {steps.map((label, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              background: step > i ? `linear-gradient(135deg, ${C.emerald}, #047857)` : step === i ? `linear-gradient(135deg, ${C.gold}, ${C.yellow})` : "rgba(0,0,0,0.4)",
              color: C.white, fontWeight: 700, fontSize: 14,
              border: step === i ? "none" : `1px solid ${C.border}`,
              boxShadow: step === i ? `0 0 30px ${C.goldGlow}` : "none",
              transition: "all 0.4s ease"
            }}>
              {step > i ? <Check size={18} /> : i + 1}
            </div>
            <span style={{ fontSize: 14, fontWeight: step === i ? 700 : 500, color: step === i ? C.text : C.textDim }}>{label}</span>
            {i < 2 && <div style={{ width: 60, height: 2, background: step > i ? C.emerald : C.border, marginLeft: 12 }} />}
          </div>
        ))}
      </div>

      {/* Step 0: Opening reflection */}
      {step === 0 && (
        <div style={{ ...S.glassCard, maxWidth: 580, margin: "0 auto", textAlign: "center", boxShadow: `0 0 60px ${C.accentGlow}`, border: `1px solid ${C.border}` }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.purple}30, ${C.accent}20)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px", animation: "float 3s ease-in-out infinite"
          }}>
            <Sun size={40} color={C.purple} />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>
            {spiritualMode ? "Begin With Ardas" : "Begin With Intention"}
          </h2>
          
          {spiritualMode && (
            <div style={{
              padding: 20, borderRadius: 14, background: `linear-gradient(135deg, ${C.purple}15, ${C.accent}10)`,
              border: `1px solid ${C.border}`, marginBottom: 24
            }}>
              <p style={{ fontFamily: "'Noto Sans Gurmukhi', sans-serif", fontSize: 18, color: C.text, lineHeight: 2, margin: 0 }}>
                ਅਸਾ ਜੋਰੁ ਨਾਹੀ ਜੇ ਕਿਛੁ ਕਰਿ ਹਮ ਸਾਕਹ ਜਿਉ ਭਾਵੈ ਤਿਵੈ ਬਖਸਿ ॥੧॥ ਰਹਾਉ ॥
              </p>
              <p style={{ fontSize: 12, color: C.textMuted, marginTop: 8, fontStyle: "italic" }}>
                I have no power to do anything at all. As it pleases You, You forgive us. ||1||Pause||
              </p>
            </div>
          )}
          
          <p style={{ color: C.textMuted, lineHeight: 1.8, marginBottom: 24 }}>
            {spiritualMode
              ? "Take a moment of stillness. Recite your Ardas, clear your mind, and surrender the outcome to Waheguru."
              : "Take a moment of stillness. Breathe, clear your mind, and commit to disciplined execution."}
          </p>
          <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, cursor: "pointer", marginBottom: 24 }}>
            <input type="checkbox" checked={ardasDone} onChange={e => setArdasDone(e.target.checked)}
              style={{ width: 20, height: 20, accentColor: C.accent, cursor: "pointer" }} />
            <span style={{ fontWeight: 600 }}>{spiritualMode ? "I have completed my Ardas" : "I am mentally centered"}</span>
          </label>
          <button disabled={!ardasDone} onClick={() => setStep(1)} style={{
            ...S.btn("primary", "lg"), width: "100%", opacity: ardasDone ? 1 : 0.4, cursor: ardasDone ? "pointer" : "not-allowed"
          }}>
            Continue <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Step 1: Analysis + Trading Plan */}
      {step === 1 && (
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ ...S.glassCard, padding: 24, marginBottom: 20 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
              <Eye size={22} color={C.accent} /> Market Analysis
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <Select label="Daily Bias" value={analysis.bias} onChange={v => setAnalysis({ ...analysis, bias: v })} options={["Bullish", "Bearish", "Neutral"]} />
              <Select label="HTF Orderflow" value={analysis.htf} onChange={v => setAnalysis({ ...analysis, htf: v })} options={["Bullish", "Bearish", "Neutral", "Bar Code", "MMBM", "MMSM", "Consolidation"]} />
              <Select label="MMXM Model" value={analysis.mmxm} onChange={v => setAnalysis({ ...analysis, mmxm: v })} options={["MMBM", "MMSM"]} />
              <Select label="News Day?" value={analysis.newsDay} onChange={v => setAnalysis({ ...analysis, newsDay: v })} options={["NO", "YES", "FOMC", "NFP", "CPI", "PPI"]} />
            </div>
          </div>

          {/* Trading Plan Card */}
          <div style={{ ...S.glassCard, padding: 24, marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Target size={18} color={C.accent} /> Today's Trading Plan
            </h3>
            
            {/* Key Levels */}
            <div style={{ marginBottom: 20 }}>
              <label style={S.label}>Key Levels</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { key: "pdh", label: "PDH (Prev Day High)" },
                  { key: "pdl", label: "PDL (Prev Day Low)" },
                  { key: "pwh", label: "PWH (Prev Week High)" },
                  { key: "pwl", label: "PWL (Prev Week Low)" },
                  { key: "asianHigh", label: "Asian Range High" },
                  { key: "asianLow", label: "Asian Range Low" },
                ].map(field => (
                  <div key={field.key}>
                    <input
                      value={analysis[field.key] || ""}
                      onChange={e => setAnalysis({ ...analysis, [field.key]: e.target.value })}
                      style={{ ...S.input, fontSize: 12 }}
                      placeholder={field.label}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Setups to Watch */}
            <div style={{ marginBottom: 20 }}>
              <label style={S.label}>Setups to Watch</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["FVG", "IFVG", "OB", "BRKR", "CISD", "Turtle Soup", "RTH Gap", "Liquidity Grab", "SMT", "Order Block"].map(setup => {
                  const selected = (analysis.setups || []).includes(setup);
                  return (
                    <button key={setup} onClick={() => {
                      const current = analysis.setups || [];
                      setAnalysis({ ...analysis, setups: selected ? current.filter(s => s !== setup) : [...current, setup] });
                    }} style={{
                      padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer",
                      background: selected ? `${C.accent}20` : "rgba(0,0,0,0.3)",
                      color: selected ? C.accentLight : C.textMuted,
                      border: `1px solid ${selected ? C.accent : C.border}`,
                      fontFamily: "Inter", transition: "all 0.2s"
                    }}>
                      {setup}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Kill Zones */}
            <div style={{ marginBottom: 20 }}>
              <label style={S.label}>Kill Zones to Trade</label>
              <div style={{ display: "flex", gap: 8 }}>
                {[["NY AM (9:30-11:00)", "nyam"], ["NY PM (13:30-15:00)", "nypm"], ["London (3:00-5:00)", "london"], ["Asian (7PM-3AM)", "asian"]].map(([label, key]) => (
                  <button key={key} onClick={() => {
                    const current = analysis.killZones || [];
                    setAnalysis({ ...analysis, killZones: current.includes(key) ? current.filter(z => z !== key) : [...current, key] });
                  }} style={{
                    flex: 1, padding: "10px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer",
                    background: (analysis.killZones || []).includes(key) ? `${C.accent}20` : "rgba(0,0,0,0.3)",
                    color: (analysis.killZones || []).includes(key) ? C.accentLight : C.textMuted,
                    border: `1px solid ${(analysis.killZones || []).includes(key) ? C.accent : C.border}`,
                    fontFamily: "Inter", textAlign: "center"
                  }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Risk Management */}
            <div style={{ marginBottom: 20 }}>
              <label style={S.label}>Risk Management</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 10, color: C.textDim, marginBottom: 4 }}>Max Risk Per Trade ($)</div>
                  <input type="number" value={analysis.maxRisk || ""} onChange={e => setAnalysis({ ...analysis, maxRisk: e.target.value })}
                    style={{ ...S.input, fontSize: 12 }} placeholder="$" />
                </div>
                <div>
                  <div style={{ fontSize: 10, color: C.textDim, marginBottom: 4 }}>Max Contracts</div>
                  <input type="number" value={analysis.maxContracts || ""} onChange={e => setAnalysis({ ...analysis, maxContracts: e.target.value })}
                    style={{ ...S.input, fontSize: 12 }} placeholder="1" />
                </div>
                <div>
                  <div style={{ fontSize: 10, color: C.textDim, marginBottom: 4 }}>Daily Loss Limit ($)</div>
                  <input type="number" value={analysis.dailyLimit || ""} onChange={e => setAnalysis({ ...analysis, dailyLimit: e.target.value })}
                    style={{ ...S.input, fontSize: 12 }} placeholder="$" />
                </div>
              </div>
            </div>
          </div>

          {/* Chart Screenshot */}
          <div style={{ ...S.glassCard, padding: 24, marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <Camera size={16} color={C.accent} /> Chart Snapshot
            </h3>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <label style={{
                display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 10,
                background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`, cursor: "pointer",
                fontSize: 13, color: C.textMuted, transition: "all 0.2s"
              }}>
                <Camera size={16} color={C.accent} />
                <span>{chartScreenshot ? "Change Screenshot" : "Upload Screenshot"}</span>
                <input type="file" accept="image/*" style={{ display: "none" }}
                  onChange={e => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = ev => setChartScreenshot(ev.target.result);
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
              {chartScreenshot && (
                <button onClick={() => setChartScreenshot(null)}
                  style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${C.amber}40`, background: `${C.amber}15`, color: C.amber, fontSize: 12, cursor: "pointer" }}>
                  <X size={14} /> Remove
                </button>
              )}
            </div>
            {chartScreenshot && (
              <div style={{ marginTop: 12, borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}`, maxWidth: 480 }}>
                <img src={chartScreenshot} alt="Chart" style={{ width: "100%", display: "block" }} />
              </div>
            )}
          </div>

          {/* Pre-Market Notes */}
          <div style={{ ...S.glassCard, padding: 24, marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <FileText size={16} color={C.accent} /> Pre-Market Notes
            </h3>
            <textarea
              value={analysis.notes || ""}
              onChange={e => setAnalysis({ ...analysis, notes: e.target.value })}
              style={{ ...S.input, minHeight: 120, resize: "vertical" }}
              placeholder="Key levels to watch, confluences, anticipated scenarios, alternative paths..."
            />
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => setStep(0)} style={S.btn("ghost")}><ChevronLeft size={16} /> Back</button>
            <button onClick={() => setStep(2)} style={{ ...S.btn("primary"), flex: 1, justifyContent: "center" }}>
              Review Rules & Commit <Lock size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Rules */}
      {step === 2 && (
        <div style={{ ...S.glassCard, maxWidth: 680, margin: "0 auto" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
            <Shield size={22} color={C.accent} /> Rule Commitment
          </h2>
          <p style={{ color: C.textDim, marginBottom: 24 }}>Check each rule to confirm.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
            {TRADING_RULES.map((rule, i) => (
              <label key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px", borderRadius: 12,
                background: rulesChecked[i] ? `${C.emerald}10` : "rgba(0,0,0,0.3)",
                border: `1px solid ${rulesChecked[i] ? C.emeraldBorder : C.border}`, cursor: "pointer"
              }}>
                <input type="checkbox" checked={rulesChecked[i]}
                  onChange={e => { const c = [...rulesChecked]; c[i] = e.target.checked; setRulesChecked(c); }}
                  style={{ width: 18, height: 18, accentColor: C.emerald, marginTop: 2 }} />
                <span style={{ fontSize: 13, color: rulesChecked[i] ? C.text : C.textMuted }}>{rule}</span>
              </label>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => setStep(1)} style={S.btn("ghost")}><ChevronLeft size={16} /> Back</button>
            <button disabled={!allRulesChecked} onClick={() => { onStartSession({ ...analysis, chartScreenshot }); setPage("trading-floor"); }}
              style={{ ...S.btn("success", "lg"), flex: 1, justifyContent: "center", opacity: allRulesChecked ? 1 : 0.4, cursor: allRulesChecked ? "pointer" : "not-allowed" }}>
              <Play size={18} /> Begin Trading
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── JOURNAL PAGE ───────────────────────────────────────────────────────────
function JournalPage({ trades, onDeleteTrade, onUpdateTrade, showToast }) {
  const [search, setSearch] = useState("");
  const [filterTicker, setFilterTicker] = useState("");
  const [filterDirection, setFilterDirection] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const filtered = trades.filter(t => {
    if (filterTicker && t.ticker !== filterTicker) return false;
    if (filterDirection && t.direction !== filterDirection) return false;
    if (dateFrom && t.date < dateFrom) return false;
    if (dateTo && t.date > dateTo) return false;
    if (search && !JSON.stringify(t).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const startEdit = (trade, idx) => {
    setEditingId(idx);
    setEditData({ ...trade });
  };

  const saveEdit = (idx) => {
    onUpdateTrade(idx, editData);
    setEditingId(null);
    showToast("Trade updated successfully!", "success");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  return (
    <div style={{ ...S.page, animation: "fadeIn 0.4s ease-out" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Trade Journal</h1>
        <span style={S.badge(C.gold)}>{filtered.length} trades</span>
      </div>

      {/* Enhanced Filters */}
      <div style={{ ...S.glassCard, marginBottom: 20, padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Filter size={16} color={C.gold} />
          <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Filters</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 12 }}>
          <div style={{ position: "relative" }}>
            <Search size={16} color={C.textDim} style={{ position: "absolute", left: 14, top: 14 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search trades..."
              style={{ ...S.input, paddingLeft: 40 }} />
          </div>
          <select value={filterTicker} onChange={e => setFilterTicker(e.target.value)} style={S.input}>
            <option value="">All Tickers</option>
            {TICKERS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={filterDirection} onChange={e => setFilterDirection(e.target.value)} style={S.input}>
            <option value="">All Directions</option>
            <option value="Long">Long</option>
            <option value="Short">Short</option>
          </select>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={S.input} placeholder="From" />
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={S.input} placeholder="To" />
        </div>
        {(filterTicker || filterDirection || dateFrom || dateTo) && (
          <button onClick={() => { setFilterTicker(""); setFilterDirection(""); setDateFrom(""); setDateTo(""); }}
            style={{ ...S.btn("ghost", "sm"), marginTop: 12 }}>
            <X size={14} /> Clear Filters
          </button>
        )}
      </div>

      {/* Trades */}
      {filtered.length === 0 ? (
        <div style={{ ...S.glassCard, textAlign: "center", padding: 80, color: C.textDim }}>
          <BookOpen size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
          <p>No trades found.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.slice().reverse().map((t, i) => {
            const isExpanded = expandedId === i;
            const isEditing = editingId === i;
            const tradeIdx = trades.indexOf(t);
            
            return (
              <div key={i} style={{ ...S.glassCard, padding: 0, overflow: "hidden" }}>
                {/* Header Row */}
                <div onClick={() => !isEditing && setExpandedId(isExpanded ? null : i)}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", cursor: isEditing ? "default" : "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: pnlBg(t.pnl), display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {t.direction === "Long" ? <ArrowUpRight size={18} color={C.emerald} /> : <ArrowDownRight size={18} color={C.amber} />}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>{t.ticker} — {t.direction}</div>
                      <div style={{ fontSize: 12, color: C.textDim }}>{t.date}</div>
                    </div>
                    {t.grade && (
                      <span style={{ ...S.badge(gradeColor(t.grade)), marginLeft: 8 }}>Grade: {t.grade}</span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: pnlColor(t.pnl) }}>{fmt(t.pnl)}</span>
                    {isEditing ? (
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => saveEdit(tradeIdx)} style={S.btn("success", "sm")}>
                          <Check size={14} /> Save
                        </button>
                        <button onClick={cancelEdit} style={S.btn("ghost", "sm")}>
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); startEdit(t, i); }} style={S.btn("ghost", "sm")}>
                          <Edit3 size={14} />
                        </button>
                        {isExpanded ? <ChevronLeft size={18} color={C.textDim} /> : <ChevronRight size={18} color={C.textDim} />}
                      </>
                    )}
                  </div>
                </div>

                {/* Expanded/Edit View */}
                {isExpanded && !isEditing && (
                  <div style={{ padding: "0 20px 20px", borderTop: `1px solid ${C.border}` }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, padding: "16px 0" }}>
                      <div><div style={S.label}>Contracts</div><div style={{ fontSize: 14, fontWeight: 600 }}>{t.contracts || "—"}</div></div>
                      <div><div style={S.label}>Grade</div><div style={{ fontSize: 14, fontWeight: 600, color: gradeColor(t.grade) }}>{t.grade || "—"}</div></div>
                      <div><div style={S.label}>Entry Model</div><div style={{ fontSize: 14, fontWeight: 600 }}>{t.entryModel || "—"}</div></div>
                      <div><div style={S.label}>Mistake</div><div style={{ fontSize: 14, fontWeight: 600, color: t.mistake ? C.amber : C.textMuted }}>{t.mistake || "None"}</div></div>
                    </div>
                    {t.notes && (
                      <div style={{ marginTop: 12, padding: 12, background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
                        <div style={S.label}>Notes</div>
                        <p style={{ fontSize: 13, color: C.textMuted, margin: 0 }}>{t.notes}</p>
                      </div>
                    )}
                    <button onClick={() => onDeleteTrade(tradeIdx)} style={{ ...S.btn("danger", "sm"), marginTop: 16 }}>
                      <Trash2 size={14} /> Delete Trade
                    </button>
                  </div>
                )}

                {/* Edit View */}
                {isEditing && (
                  <div style={{ padding: "0 20px 20px", borderTop: `1px solid ${C.border}` }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, padding: "16px 0" }}>
                      <div>
                        <label style={S.label}>Grade</label>
                        <input list="grade-options" value={editData.grade || ""} onChange={e => setEditData({ ...editData, grade: e.target.value })} style={S.input} placeholder="Select or type..." />
                        <datalist id="grade-options">{SETUP_GRADES.map(g => <option key={g} value={g} />)}</datalist>
                      </div>
                      <div>
                        <label style={S.label}>Entry Model</label>
                        <input list="entrymodel-options" value={editData.entryModel || ""} onChange={e => setEditData({ ...editData, entryModel: e.target.value })} style={S.input} placeholder="Select or type..." />
                        <datalist id="entrymodel-options">{ENTRY_MODELS.map(m => <option key={m} value={m} />)}</datalist>
                      </div>
                      <div>
                        <label style={S.label}>Mistake (if any)</label>
                        <input list="mistake-options" value={editData.mistake || ""} onChange={e => setEditData({ ...editData, mistake: e.target.value })} style={S.input} placeholder="Select or type..." />
                        <datalist id="mistake-options">{MISTAKES.map(m => <option key={m} value={m} />)}</datalist>
                      </div>
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <label style={S.label}>Notes</label>
                      <textarea value={editData.notes || ""} onChange={e => setEditData({ ...editData, notes: e.target.value })}
                        style={{ ...S.input, minHeight: 80, resize: "vertical" }} placeholder="Add notes about this trade..." />
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      <button onClick={() => saveEdit(tradeIdx)} style={S.btn("success", "sm")}>
                        <Check size={14} /> Save Changes
                      </button>
                      <button onClick={cancelEdit} style={S.btn("ghost", "sm")}>
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── AI COACH PAGE ─────────────────────────────────────────────────────────
function AICoachPage({ trades }) {
  const stats = useMemo(() => trades.length >= 3 ? computeStats(trades) : null, [trades]);

  const insights = useMemo(() => {
    if (!stats || trades.length < 3) {
      return [{
        icon: Brain, title: "Need More Data", text: "Log at least 3 trades for AI insights.",
        color: C.gold, tip: "Start journaling your trades to unlock personalized coaching."
      }];
    }

    const wins = trades.filter(t => t.pnl > 0);
    const losses = trades.filter(t => t.pnl < 0);
    const wr = stats.winRate;
    const avgWin = stats.avgWinner;
    const avgLoss = stats.avgLoser;
    const rr = avgLoss > 0 ? (avgWin / avgLoss).toFixed(2) : "—";
    const results = [];

    // 1. Win Rate & Profit Factor
    results.push({
      icon: Target,
      color: wr >= 50 ? C.emerald : C.amber,
      title: wr >= 50 ? `Solid ${wr.toFixed(0)}% Win Rate` : `${wr.toFixed(0)}% Win Rate — Can Improve`,
      text: `You've won ${wins.length}/${trades.length} trades. Profit factor: ${stats.profitFactor.toFixed(2)}. ${wr >= 50 ? "Great consistency!" : "Focus on higher-probability setups."}`,
      metric: `${wr.toFixed(0)}%`,
      tip: wr >= 50 ? "You're winning more than you lose. Now work on increasing winner size." : "Try filtering for only A+ setups with 3+ confluences."
    });

    // 2. Risk/Reward
    results.push({
      icon: TrendingUp,
      color: Number(rr) >= 2 ? C.emerald : Number(rr) >= 1 ? C.yellow : C.amber,
      title: Number(rr) >= 2 ? `1:${rr} Avg R:R — Excellent` : `1:${rr} Avg R:R — Needs Work`,
      text: `Your average win is ${fmt(avgWin)} vs average loss of ${fmt(avgLoss)}. ${Number(rr) >= 2 ? "You're letting winners run!" : "Target at least 1:2 risk-to-reward."}`,
      metric: `1:${rr}`,
      tip: Number(rr) >= 2 ? "Great! Now maintain this discipline across all trades." : "Set a minimum 1:2 R:R before entry. Use hard take-profit levels."
    });

    // 3. Sharpe Ratio
    if (stats.sharpeRatio !== 0) {
      results.push({
        icon: Gauge,
        color: stats.sharpeRatio >= 1 ? C.emerald : stats.sharpeRatio > 0 ? C.yellow : C.amber,
        title: stats.sharpeRatio >= 1 ? `${stats.sharpeRatio.toFixed(2)} Sharpe — Strong` : `${stats.sharpeRatio.toFixed(2)} Sharpe`,
        text: `Risk-adjusted returns. ${stats.sharpeRatio >= 1 ? "Above 1.0 is professional grade. Keep it up!" : "Below 1.0 means returns aren't compensating risk well."}`,
        metric: stats.sharpeRatio.toFixed(2),
        tip: stats.sharpeRatio < 1 ? "Cut losses faster and avoid oversized positions to improve risk-adjusted returns." : "Excellent — you're being compensated for the risk you take."
      });
    }

    // 4. Best/Worst Day of Week
    const dayPnl = { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0 };
    const dayCount = { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0 };
    trades.forEach(t => {
      if (t.date) {
        const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date(t.date).getDay()];
        if (dayPnl[dayName] !== undefined) {
          dayPnl[dayName] += t.pnl || 0;
          dayCount[dayName]++;
        }
      }
    });
    const bestDay = Object.entries(dayPnl).filter(([_, v]) => dayCount[_] > 0).sort((a, b) => b[1] - a[1])[0];
    const worstDay = Object.entries(dayPnl).filter(([_, v]) => dayCount[_] > 0).sort((a, b) => a[1] - b[1])[0];
    if (bestDay) {
      results.push({
        icon: Calendar,
        color: C.emerald,
        title: `Best Day: ${bestDay[0]}`,
        text: `You've made ${fmt(bestDay[1])} on ${bestDay[0]}s across ${dayCount[bestDay[0]]} sessions. ${worstDay ? `Avoid heavy trading on ${worstDay[0]}s (${fmt(worstDay[1])}).` : ""}`,
        metric: fmt(bestDay[1]),
        tip: `Focus your best setups on ${bestDay[0]}s. If ${worstDay && worstDay[0]} is bad, consider lighter sizing.`
      });
    }

    // 5. Mistake Pattern
    const mistakeCount = {};
    trades.forEach(t => {
      if (t.mistake) mistakeCount[t.mistake] = (mistakeCount[t.mistake] || 0) + 1;
    });
    if (Object.keys(mistakeCount).length > 0) {
      const sortedMistakes = Object.entries(mistakeCount).sort((a, b) => b[1] - a[1]);
      const topMistake = sortedMistakes[0];
      const mistakePnl = {};
      trades.forEach(t => {
        if (t.mistake) mistakePnl[t.mistake] = (mistakePnl[t.mistake] || 0) + (t.pnl || 0);
      });
      results.push({
        icon: AlertTriangle,
        color: C.amber,
        title: `Top Mistake: "${topMistake[0]}" (${topMistake[1]}x)`,
        text: `This mistake cost you ~${fmt(Math.abs(mistakePnl[topMistake[0]] || 0))} total. ${sortedMistakes.length > 1 ? `Also watch: ${sortedMistakes.slice(1, 3).map(([m, c]) => `${m} (${c}x)`).join(", ")}.` : ""}`,
        metric: `${topMistake[1]}x`,
        tip: `Set a rule: if you catch yourself "${topMistake[0]}", close the terminal for 30 min. Pre-commit to this.`
      });
    }

    // 6. Best Setup Performance
    const bestSetup = stats.setupPerformance?.[0];
    if (bestSetup && bestSetup.count >= 2) {
      results.push({
        icon: Crosshair,
        color: bestSetup.totalPnl >= 0 ? C.emerald : C.amber,
        title: `Top Setup: ${bestSetup.name}`,
        text: `${bestSetup.name}: ${bestSetup.count} trades, ${fmt(bestSetup.totalPnl)} total, ${bestSetup.winRate.toFixed(0)}% WR. ${bestSetup.totalPnl > 0 ? "Keep running this setup!" : "Consider avoiding this setup."}`,
        metric: fmt(bestSetup.totalPnl),
        tip: bestSetup.totalPnl > 0 ? `Double down on ${bestSetup.name} — it's your edge.` : `Re-evaluate your ${bestSetup.name} criteria or stop taking it.`
      });
    }

    // 7. Most Profitable Hour
    const hourlyEntries = Object.entries(stats.pnlByHour || {}).filter(([_, d]) => d.count > 0);
    if (hourlyEntries.length > 0) {
      const bestHour = hourlyEntries.sort((a, b) => b[1].pnl - a[1].pnl)[0];
      results.push({
        icon: Clock,
        color: bestHour[1].pnl >= 0 ? C.emerald : C.amber,
        title: `Best Hour: ${bestHour[0]}:00`,
        text: `${bestHour[0]}:00 — ${fmt(bestHour[1].pnl)} from ${bestHour[1].count} trades (${bestHour[1].wins}W / ${bestHour[1].losses}L).`,
        metric: fmt(bestHour[1].pnl),
        tip: `Prioritize trading during ${bestHour[0]}:00–${Number(bestHour[0]) + 1}:00. That's your edge window.`
      });
    }

    // 8. Drawdown Warning
    if (stats.maxDrawdownPercent > 15) {
      results.push({
        icon: TrendingDown,
        color: C.amber,
        title: `${stats.maxDrawdownPercent.toFixed(0)}% Max Drawdown — Warning`,
        text: `Your account has drawn down ${stats.maxDrawdownPercent.toFixed(0)}% from peak (${fmtUsd(stats.maxDrawdown)}). ${stats.maxDrawdownPercent > 25 ? "This is critical. Consider reducing position size." : "Keep an eye on this."}`,
        metric: `${stats.maxDrawdownPercent.toFixed(0)}%`,
        tip: "Set a hard daily loss limit. If you hit it, walk away. No exceptions."
      });
    }

    return results;
  }, [trades, stats]);

  const [activeTab, setActiveTab] = useState("insights");
  const [customQuestion, setCustomQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  const askAI = () => {
    if (!customQuestion.trim()) return;
    const stats = computeStats(trades);
    const context = `Trading stats: ${trades.length} trades, ${fmt(stats.totalPnl)} total P&L, ${stats.winRate.toFixed(0)}% WR, ${fmt(stats.avgWinner)} avg win, ${fmt(stats.avgLoser)} avg loss, ${stats.sharpeRatio.toFixed(2)} Sharpe, ${stats.maxDrawdownPercent.toFixed(0)}% max DD, ${stats.profitFactor.toFixed(2)} PF. Best hour: ${Object.entries(stats.pnlByHour).filter(([_, d]) => d.count > 0).sort((a, b) => b[1].pnl - a[1].pnl)[0]?.[0] || "N/A"}:00.`;
    
    // Generate response based on common questions
    const q = customQuestion.toLowerCase();
    if (q.includes("improve") || q.includes("better")) {
      setAiResponse(`Based on your ${trades.length} trades:\n\n• Your top mistake is "${Object.entries(trades.reduce((a, t) => (t.mistake ? {...a, [t.mistake]: (a[t.mistake]||0)+1} : a), {})).sort((a, b) => b[1] - a[1])[0]?.[0] || "none"}". Fix this first.\n• Your win rate is ${stats.winRate.toFixed(0)}%. Target 60%+ by being more selective.\n• Your avg R:R is 1:${stats.avgRR.toFixed(2)}. Target 1:2+.\n• Your Sharpe is ${stats.sharpeRatio.toFixed(2)} (1.0+ is professional).\n\nFocus on eliminating your top mistake and only taking setups with 3+ confluences.`);
    } else if (q.includes("mistake") || q.includes("wrong")) {
      const mistakeData = Object.entries(trades.reduce((a, t) => (t.mistake ? {...a, [t.mistake]: (a[t.mistake]||0)+1} : a), {})).sort((a, b) => b[1] - a[1]);
      setAiResponse(`Your mistake breakdown:\n${mistakeData.map(([m, c]) => `• ${m}: ${c} times (${(c/trades.length*100).toFixed(0)}% of trades)`).join("\n")}\n\nTip: Pick ONE mistake to eliminate this week. Track it daily.`);
    } else if (q.includes("best") || q.includes("setup") || q.includes("strategy")) {
      const bestSetup = stats.setupPerformance?.[0];
      if (bestSetup) {
        setAiResponse(`Your most profitable setup is "${bestSetup.name}":\n• ${bestSetup.count} trades\n• ${fmt(bestSetup.totalPnl)} total P&L\n• ${bestSetup.winRate.toFixed(0)}% win rate\n• ${fmt(bestSetup.avgPnl)} avg per trade\n\nConsider focusing exclusively on this setup for the next 10 trades.`);
      } else {
        setAiResponse("You haven't logged enough setup data yet. Start tagging your trades with entry models for personalized insights.");
      }
    } else if (q.includes("session") || q.includes("day") || q.includes("time")) {
      const bestHour = Object.entries(stats.pnlByHour).filter(([_, d]) => d.count > 0).sort((a, b) => b[1].pnl - a[1].pnl)[0];
      const dayPnl = {Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0};
      trades.forEach(t => { if (t.date) { const d = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date(t.date).getDay()]; if (dayPnl[d] !== undefined) dayPnl[d] += t.pnl||0; }});
      const bestDay = Object.entries(dayPnl).filter(([_, v]) => v !== 0).sort((a, b) => b[1] - a[1])[0];
      setAiResponse(`Best trading hour: ${bestHour?.[0] || "N/A"}:00 (${fmt(bestHour?.[1].pnl || 0)})\nBest day of week: ${bestDay?.[0] || "N/A"} (${fmt(bestDay?.[1] || 0)})\n\nSchedule your most important trades during these peak windows.`);
    } else {
      setAiResponse(`Here's your snapshot:\n\n📊 ${trades.length} total trades\n💰 ${fmt(stats.totalPnl)} total P&L\n🎯 ${stats.winRate.toFixed(0)}% win rate\n📈 ${stats.sharpeRatio.toFixed(2)} Sharpe ratio\n⬇️ ${stats.maxDrawdownPercent.toFixed(0)}% max drawdown\n💡 Best setup: ${stats.setupPerformance?.[0]?.name || "N/A"}\n⏰ Best hour: ${Object.entries(stats.pnlByHour).filter(([_, d]) => d.count > 0).sort((a, b) => b[1].pnl - a[1].pnl)[0]?.[0] || "N/A"}:00`);
    }
  };

  return (
    <div style={{ ...S.page, animation: "fadeIn 0.4s ease-out" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>AI Coach</h1>
      <p style={{ color: C.textMuted, marginBottom: 28 }}>Actionable insights from your trading data. Ask questions, find patterns, improve.</p>

      {/* Tab Bar */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "rgba(0,0,0,0.3)", padding: 4, borderRadius: C.radiusBtn, width: "fit-content" }}>
        {["insights", "ask"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: "10px 20px", borderRadius: 8, border: "none", cursor: "pointer",
            background: activeTab === tab ? C.accent : "transparent",
            color: activeTab === tab ? "#fff" : C.textMuted, fontWeight: 600, fontSize: 13,
            fontFamily: "Inter", transition: "all 0.2s"
          }}>
            {tab === "insights" ? "🎯 Auto Insights" : "💬 Ask AI"}
          </button>
        ))}
      </div>

      {activeTab === "insights" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Summary Banner */}
          {trades.length >= 3 && (
            <div style={{ ...S.glassCard, padding: 20, background: `linear-gradient(135deg, ${C.accent}08, ${C.accentDark}05)`, borderLeft: `3px solid ${C.accent}` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 4 }}>Performance Summary</div>
                  <div style={{ fontSize: 20, fontWeight: 800 }}>{fmt(stats.totalPnl)} <span style={{ fontSize: 13, fontWeight: 600, color: C.textMuted }}>across {trades.length} trades</span></div>
                </div>
                <div style={{ display: "flex", gap: 20 }}>
                  {[
                    { label: "Win Rate", value: `${stats.winRate.toFixed(0)}%`, color: stats.winRate >= 50 ? C.emerald : C.amber },
                    { label: "Sharpe", value: stats.sharpeRatio.toFixed(2), color: stats.sharpeRatio >= 1 ? C.emerald : C.amber },
                    { label: "Profit Factor", value: stats.profitFactor.toFixed(2), color: stats.profitFactor >= 1.5 ? C.emerald : C.amber },
                    { label: "Max DD", value: `${stats.maxDrawdownPercent.toFixed(0)}%`, color: stats.maxDrawdownPercent > 20 ? C.amber : C.emerald },
                  ].map(m => (
                    <div key={m.label} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 10, color: C.textDim, textTransform: "uppercase", marginBottom: 2 }}>{m.label}</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: m.color }}>{m.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {insights.map((ins, i) => (
            <div key={i} style={{ ...S.glassCard, borderLeft: `3px solid ${ins.color}`, padding: 20 }}>
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10, background: `${ins.color}12`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <ins.icon size={22} color={ins.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{ins.title}</div>
                    {ins.metric && (
                      <div style={{ fontSize: 20, fontWeight: 800, color: ins.color }}>{ins.metric}</div>
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6, marginBottom: 8 }}>{ins.text}</div>
                  <div style={{ fontSize: 12, padding: "8px 12px", borderRadius: 8, background: `${ins.color}08`, border: `1px solid ${ins.color}15`, color: ins.color }}>
                    💡 {ins.tip}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Ask AI Tab */
        <div style={{ ...S.glassCard, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Ask About Your Trading</h3>
          <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 16 }}>Try: "How can I improve?" or "What's my best setup?" or "Where do I make mistakes?"</p>
          <div style={{ display: "flex", gap: 12 }}>
            <input value={customQuestion} onChange={e => setCustomQuestion(e.target.value)}
              onKeyDown={e => e.key === "Enter" && askAI()}
              style={{ ...S.input, flex: 1 }} placeholder="Ask anything about your trading data..."
            />
            <button onClick={askAI} style={S.btn("primary")}><Send size={16} /> Ask</button>
          </div>
          {aiResponse && (
            <div style={{
              marginTop: 16, padding: 16, borderRadius: C.radiusCard,
              background: `linear-gradient(135deg, ${C.accent}08, ${C.accentDark}05)`,
              border: `1px solid ${C.border}`, fontSize: 13, color: C.text, lineHeight: 1.8, whiteSpace: "pre-wrap"
            }}>
              {aiResponse}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── ANALYTICS CHARTS (embedded in dashboard) ───────────────────────────────
function AnalyticsCharts({ trades }) {
  const winLossData = [
    { name: "Wins", value: trades.filter(t => t.pnl > 0).length, color: C.emerald },
    { name: "Losses", value: trades.filter(t => t.pnl < 0).length, color: C.amber }
  ];
  const pnlByTicker = TICKERS.map(ticker => ({
    ticker,
    pnl: trades.filter(t => t.ticker === ticker).reduce((s, t) => s + t.pnl, 0)
  })).filter(d => trades.some(t => t.ticker === d.ticker));

  return (
    <div style={{ marginTop: 24 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: C.text }}>
        Performance Breakdown
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Win/Loss Donut */}
        <div style={{ ...S.glassCard, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: C.text }}>Win Rate</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RePieChart>
              <Pie
                data={winLossData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
              >
                {winLossData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: C.emerald }} />
              <span style={{ fontSize: 12, color: C.textMuted }}>Wins ({winLossData[0].value})</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: C.amber }} />
              <span style={{ fontSize: 12, color: C.textMuted }}>Losses ({winLossData[1].value})</span>
            </div>
          </div>
        </div>

        {/* P&L by Ticker */}
        <div style={{ ...S.glassCard, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: C.text }}>P&L by Ticker</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={pnlByTicker}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="ticker" stroke={C.textDim} fontSize={12} />
              <YAxis stroke={C.textDim} fontSize={11} tickFormatter={v => `$${v}`} />
              <Tooltip
                contentStyle={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8 }}
                formatter={(val) => [`$${Number(val).toLocaleString()}`, "P&L"]}
              />
              <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                {pnlByTicker.map((entry, i) => (
                  <Cell key={i} fill={entry.pnl >= 0 ? C.emerald : C.amber} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ─── ANALYTICS PAGE ────────────────────────────────────────────────────────
function AnalyticsPage({ trades }) {
  // Calculate chart data
  const pnlByDate = (() => {
    const dailyPnl = {};
    trades.forEach(t => {
      dailyPnl[t.date] = (dailyPnl[t.date] || 0) + t.pnl;
    });
    return Object.entries(dailyPnl)
      .map(([date, pnl]) => ({ date, pnl }))
      .sort((a, b) => a.date > b.date ? 1 : -1)
      .slice(-30); // Last 30 days
  })();

  const cumulativePnl = pnlByDate.reduce((acc, item, i) => {
    const prev = i > 0 ? acc[i - 1].cumulative : 0;
    acc.push({ date: item.date, cumulative: prev + item.pnl });
    return acc;
  }, []);

  const winLossData = [
    { name: "Wins", value: trades.filter(t => t.pnl > 0).length, color: C.emerald },
    { name: "Losses", value: trades.filter(t => t.pnl < 0).length, color: C.amber }
  ];

  const pnlByTicker = TICKERS.map(ticker => ({
    ticker,
    pnl: trades.filter(t => t.ticker === ticker).reduce((s, t) => s + t.pnl, 0)
  })).filter(d => trades.some(t => t.ticker === d.ticker));

  const stats = {
    total: trades.reduce((s, t) => s + t.pnl, 0),
    wr: trades.length ? ((trades.filter(t => t.pnl > 0).length / trades.length) * 100).toFixed(1) : 0,
    avgWin: trades.filter(t => t.pnl > 0).reduce((s, t) => s + t.pnl, 0) / Math.max(1, trades.filter(t => t.pnl > 0).length),
    avgLoss: Math.abs(trades.filter(t => t.pnl < 0).reduce((s, t) => s + t.pnl, 0) / Math.max(1, trades.filter(t => t.pnl < 0).length)),
    best: Math.max(...trades.map(t => t.pnl)),
    worst: Math.min(...trades.map(t => t.pnl))
  };

  if (trades.length === 0) {
    return (
      <div style={{ ...S.page, animation: "fadeIn 0.4s ease-out" }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 28 }}>Analytics</h1>
        <div style={{ ...S.glassCard, textAlign: "center", padding: 80, color: C.textDim }}>
          <BarChart3 size={56} style={{ opacity: 0.3, marginBottom: 16 }} />
          <p>Analytics dashboard coming soon. Log some trades to see your stats!</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...S.page, animation: "fadeIn 0.4s ease-out" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 28 }}>Analytics</h1>

      {/* Stats Overview */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16, marginBottom: 24 }}>
        <MiniStat icon={DollarSign} label="Total P&L" value={fmt(stats.total)} color={pnlColor(stats.total)} />
        <MiniStat icon={Target} label="Win Rate" value={`${stats.wr}%`} color={Number(stats.wr) >= 50 ? C.emerald : C.amber} />
        <MiniStat icon={TrendingUp} label="Avg Win" value={fmt(stats.avgWin)} color={C.emerald} />
        <MiniStat icon={TrendingDown} label="Avg Loss" value={fmt(-stats.avgLoss)} color={C.amber} />
        <MiniStat icon={Award} label="Best Trade" value={fmt(stats.best)} color={C.gold} />
        <MiniStat icon={AlertTriangle} label="Worst Trade" value={fmt(stats.worst)} color={C.amber} />
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Equity Curve */}
        <div style={S.glassCard}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Equity Curve</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={cumulativePnl}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="date" stroke={C.textDim} fontSize={11} />
              <YAxis stroke={C.textDim} fontSize={11} />
              <Tooltip
                contentStyle={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8 }}
                labelStyle={{ color: C.text }}
              />
              <Area type="monotone" dataKey="cumulative" stroke={C.gold} fill={C.goldGlow} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Win/Loss Pie */}
        <div style={S.glassCard}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Win Rate</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RePieChart>
              <Pie
                data={winLossData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {winLossData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: C.emerald }} />
              <span style={{ fontSize: 13, color: C.textMuted }}>Wins ({winLossData[0].value})</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: C.amber }} />
              <span style={{ fontSize: 13, color: C.textMuted }}>Losses ({winLossData[1].value})</span>
            </div>
          </div>
        </div>
      </div>

      {/* P&L by Ticker */}
      <div style={S.glassCard}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>P&L by Ticker</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={pnlByTicker}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="ticker" stroke={C.textDim} />
            <YAxis stroke={C.textDim} />
            <Tooltip
              contentStyle={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8 }}
            />
            <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
              {pnlByTicker.map((entry, i) => (
                <Cell key={i} fill={entry.pnl >= 0 ? C.emerald : C.amber} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pivot Grid */}
      <div style={{ marginTop: 24 }}>
        <PivotGrid trades={trades} />
      </div>
    </div>
  );
}

// ─── CALENDAR HEATMAP ─────────────────────────────────────────────────────────
function CalendarHeatmap({ trades, months = 3 }) {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setMonth(startDate.getMonth() - months);

  // Build day P&L map
  const dayPnl = {};
  trades.forEach(t => {
    if (t.date) {
      dayPnl[t.date] = (dayPnl[t.date] || 0) + (t.pnl || 0);
    }
  });

  // Generate days grid
  const days = [];
  const d = new Date(startDate);
  while (d <= now) {
    const key = d.toISOString().split("T")[0];
    const pnl = dayPnl[key] || 0;
    const hasTrade = key in dayPnl;
    days.push({ date: key, pnl, hasTrade, day: d.getDate(), month: d.getMonth() });
    d.setDate(d.getDate() + 1);
  }

  // Group by month
  const months_display = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const byMonth = {};
  days.forEach(day => {
    const m = `${day.date.substring(0,7)}-${day.month}`;
    if (!byMonth[m]) byMonth[m] = { month: day.month, label: months_display[day.month], days: [] };
    byMonth[m].days.push(day);
  });

  const getColor = (pnl, hasTrade) => {
    if (!hasTrade) return "transparent";
    if (pnl > 0) return `rgba(16, 185, 129, ${Math.min(0.9, 0.2 + Math.abs(pnl) / 500)})`;
    if (pnl < 0) return `rgba(217, 119, 6, ${Math.min(0.9, 0.2 + Math.abs(pnl) / 500)})`;
    return C.border;
  };

  return (
    <div style={{ ...S.glassCard, padding: 20 }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        <Calendar size={14} color={C.accent} /> Trading Calendar
      </h3>
      <div style={{ display: "flex", gap: 24, overflowX: "auto", paddingBottom: 8 }}>
        {Object.entries(byMonth).map(([key, month]) => (
          <div key={key} style={{ minWidth: 200 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>{month.label}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
              {["S","M","T","W","T","F","S"].map(d => (
                <div key={d} style={{ fontSize: 8, color: C.textDim, textAlign: "center", marginBottom: 2 }}>{d}</div>
              ))}
              {/* Padding for first day of month */}
              {Array(new Date(month.days[0].date).getDay()).fill(null).map((_, i) => (
                <div key={`pad-${i}`} />
              ))}
              {month.days.map(day => (
                <div
                  key={day.date}
                  title={`${day.date}: ${day.hasTrade ? fmt(day.pnl) : "No trades"}`}
                  style={{
                    width: "100%", aspectRatio: 1, borderRadius: 4,
                    background: getColor(day.pnl, day.hasTrade),
                    border: `1px solid ${day.hasTrade ? "transparent" : C.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9, fontWeight: day.hasTrade ? 600 : 400,
                    color: day.hasTrade ? C.text : C.textDim,
                    cursor: "pointer"
                  }}
                >
                  {day.day}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 12, fontSize: 10, color: C.textDim }}>
        <span>Less</span>
        <div style={{ width: 12, height: 12, borderRadius: 2, background: C.emeraldBg, border: `1px solid ${C.emeraldBorder}` }} />
        <div style={{ width: 12, height: 12, borderRadius: 2, background: `rgba(16, 185, 129, 0.5)`, border: `1px solid ${C.emeraldBorder}` }} />
        <div style={{ width: 12, height: 12, borderRadius: 2, background: `rgba(16, 185, 129, 0.8)`, border: `1px solid ${C.emeraldBorder}` }} />
        <span>More</span>
        <span style={{ marginLeft: 8 }}>|</span>
        <div style={{ width: 12, height: 12, borderRadius: 2, background: C.amberBg, border: `1px solid ${C.amberBorder}` }} />
        <div style={{ width: 12, height: 12, borderRadius: 2, background: `rgba(217, 119, 6, 0.5)`, border: `1px solid ${C.amberBorder}` }} />
        <div style={{ width: 12, height: 12, borderRadius: 2, background: `rgba(217, 119, 6, 0.8)`, border: `1px solid ${C.amberBorder}` }} />
      </div>
    </div>
  );
}

// ─── HOUR OF DAY CHART ────────────────────────────────────────────────────────
function HourOfDayChart({ trades }) {
  const hourlyData = useMemo(() => {
    const hData = {};
    for (let h = 0; h < 24; h++) hData[h] = { hour: h, pnl: 0, count: 0, wins: 0, losses: 0 };
    trades.forEach(t => {
      const h = new Date(t.date).getHours();
      if (!hData[h]) hData[h] = { hour: h, pnl: 0, count: 0, wins: 0, losses: 0 };
      hData[h].pnl += t.pnl || 0;
      hData[h].count++;
      if (t.pnl > 0) hData[h].wins++;
      else if (t.pnl < 0) hData[h].losses++;
    });
    return Object.values(hData).filter(d => d.count > 0);
  }, [trades]);

  if (hourlyData.length === 0) return null;

  const marketHours = ["8:00","9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00"];

  return (
    <div style={{ ...S.glassCard, padding: 20 }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        <Clock size={14} color={C.accent} /> P&L by Hour
      </h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={hourlyData}>
          <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
          <XAxis dataKey="hour" tick={{ fontSize: 10, fill: C.textDim }} tickFormatter={h => `${h}:00`} />
          <YAxis tick={{ fontSize: 10, fill: C.textDim }} tickFormatter={v => `$${v}`} width={50} />
          <Tooltip
            contentStyle={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11 }}
            labelStyle={{ color: C.text }}
            formatter={(val, name) => [fmt(val), name === "pnl" ? "P&L" : val]}
          />
          <Bar dataKey="pnl" radius={[3, 3, 0, 0]}>
            {hourlyData.map((entry, i) => (
              <Cell key={i} fill={entry.pnl >= 0 ? C.emerald : C.amber} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── DRAWNDOWN CHART ──────────────────────────────────────────────────────────
function DrawdownChart({ trades }) {
  const ddData = useMemo(() => {
    if (!trades.length) return [];
    const sorted = [...trades].sort((a, b) => new Date(a.date) - new Date(b.date));
    let equity = 0, highWater = 0;
    return sorted.map(t => {
      equity += t.pnl || 0;
      if (equity > highWater) highWater = equity;
      const drawdown = highWater > 0 ? ((highWater - equity) / highWater) * 100 : 0;
      return { date: t.date, drawdown: -Math.abs(drawdown) };
    });
  }, [trades]);

  if (ddData.length === 0) return null;

  return (
    <div style={{ ...S.glassCard, padding: 20 }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        <TrendingDown size={14} color={C.accent} /> Drawdown %
      </h3>
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={ddData}>
          <defs>
            <linearGradient id="ddGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={C.amber} stopOpacity={0.3} />
              <stop offset="95%" stopColor={C.amber} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
          <XAxis dataKey="date" tick={{ fontSize: 8, fill: C.textDim }} tickFormatter={d => d ? d.split("-").slice(1).join("/") : ""} />
          <YAxis tick={{ fontSize: 8, fill: C.textDim }} tickFormatter={v => `${v.toFixed(1)}%`} width={45} domain={["auto", 0]} />
          <Tooltip
            contentStyle={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11 }}
            formatter={(val) => [`${val.toFixed(1)}%`, "Drawdown"]}
          />
          <Area type="monotone" dataKey="drawdown" stroke={C.amber} fill="url(#ddGrad)" strokeWidth={1.5} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── PIVOT GRID ───────────────────────────────────────────────────────────────
function PivotGrid({ trades }) {
  const dimensions = [
    { key: "ticker", label: "Symbol" },
    { key: "direction", label: "Direction" },
    { key: "grade", label: "Grade" },
    { key: "entryModel", label: "Setup" },
    { key: "mistake", label: "Mistake" },
    { key: "emotion", label: "Emotion" },
  ];
  const [rowDim, setRowDim] = useState("ticker");
  const [colDim, setColDim] = useState("direction");
  const [metric, setMetric] = useState("pnl");

  const gridData = useMemo(() => {
    const matrix = {};
    trades.forEach(t => {
      const rowVal = t[rowDim] || "Other";
      const colVal = t[colDim] || "Other";
      if (!matrix[rowVal]) matrix[rowVal] = {};
      if (!matrix[rowVal][colVal]) matrix[rowVal][colVal] = { pnl: 0, count: 0, wins: 0, losses: 0 };
      matrix[rowVal][colVal].pnl += t.pnl || 0;
      matrix[rowVal][colVal].count++;
      if (t.pnl > 0) matrix[rowVal][colVal].wins++;
      else if (t.pnl < 0) matrix[rowVal][colVal].losses++;
    });
    return matrix;
  }, [trades, rowDim, colDim]);

  const colValues = useMemo(() => {
    const vals = new Set();
    trades.forEach(t => {
      const v = t[colDim] || "Other";
      vals.add(v);
    });
    return [...vals];
  }, [trades, colDim]);

  const metricValue = (cell) => {
    if (!cell) return "—";
    switch (metric) {
      case "pnl": return cell.pnl;
      case "count": return cell.count;
      case "winRate": return cell.count > 0 ? (cell.wins / cell.count) * 100 : 0;
      case "avgPnl": return cell.count > 0 ? cell.pnl / cell.count : 0;
      default: return cell.pnl;
    }
  };

  const metricLabel = (v) => {
    if (v === "—") return v;
    switch (metric) {
      case "pnl": return fmt(v);
      case "count": return v;
      case "winRate": return `${v.toFixed(0)}%`;
      case "avgPnl": return fmt(v);
      default: return fmt(v);
    }
  };

  if (trades.length === 0) {
    return (
      <div style={{ ...S.glassCard, padding: 24, textAlign: "center" }}>
        <BarChart3 size={32} style={{ opacity: 0.3, marginBottom: 12 }} />
        <div style={{ color: C.textDim, fontSize: 13 }}>Log trades to use the Pivot Grid</div>
      </div>
    );
  }

  return (
    <div style={{ ...S.glassCard, padding: 20 }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        <BarChart3 size={14} color={C.accent} /> Pivot Grid
        <span style={{ fontSize: 11, fontWeight: 400, color: C.textMuted }}>— Cross-filter your trades</span>
      </h3>

      {/* Controls */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, color: C.textDim }}>Rows:</span>
          <select value={rowDim} onChange={e => setRowDim(e.target.value)}
            style={{ ...S.input, padding: "6px 10px", fontSize: 12, width: "auto" }}>
            {dimensions.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, color: C.textDim }}>Columns:</span>
          <select value={colDim} onChange={e => setColDim(e.target.value)}
            style={{ ...S.input, padding: "6px 10px", fontSize: 12, width: "auto" }}>
            {dimensions.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, color: C.textDim }}>Metric:</span>
          <select value={metric} onChange={e => setMetric(e.target.value)}
            style={{ ...S.input, padding: "6px 10px", fontSize: 12, width: "auto" }}>
            <option value="pnl">P&L</option>
            <option value="count">Count</option>
            <option value="winRate">Win Rate %</option>
            <option value="avgPnl">Avg P&L</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr>
              <th style={{ padding: "8px 12px", textAlign: "left", borderBottom: `1px solid ${C.border}`, color: C.textDim, fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}>
                {dimensions.find(d => d.key === rowDim)?.label}
              </th>
              {colValues.map(col => (
                <th key={col} style={{ padding: "8px 12px", textAlign: "right", borderBottom: `1px solid ${C.border}`, color: C.textDim, fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}>
                  {col}
                </th>
              ))}
              <th style={{ padding: "8px 12px", textAlign: "right", borderBottom: `1px solid ${C.border}`, color: C.accent, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(gridData).map(([rowVal, cols]) => {
              const total = Object.values(cols).reduce((s, c) => ({
                pnl: s.pnl + c.pnl, count: s.count + c.count,
                wins: s.wins + c.wins, losses: s.losses + c.losses
              }), { pnl: 0, count: 0, wins: 0, losses: 0 });
              return (
                <tr key={rowVal}>
                  <td style={{ padding: "6px 12px", borderBottom: `1px solid ${C.border}`, fontWeight: 600, whiteSpace: "nowrap" }}>
                    {rowVal}
                  </td>
                  {colValues.map(col => {
                    const cell = cols[col];
                    const val = metricValue(cell);
                    return (
                      <td key={col} style={{
                        padding: "6px 12px", borderBottom: `1px solid ${C.border}`,
                        textAlign: "right", fontWeight: 600,
                        color: typeof val === "number" ? (val >= 0 ? C.emerald : C.amber) : C.textDim
                      }}>
                        {metricLabel(val)}
                      </td>
                    );
                  })}
                  <td style={{
                    padding: "6px 12px", borderBottom: `1px solid ${C.border}`,
                    textAlign: "right", fontWeight: 700,
                    color: typeof metricValue(total) === "number" ? (metricValue(total) >= 0 ? C.emerald : C.amber) : C.textDim
                  }}>
                    {metricLabel(metricValue(total))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── PSYCHOLOGY DASHBOARD ─────────────────────────────────────────────────────
function PsychologyDashboard({ trades }) {
  // Extract emotional data from trade notes and post-session data
  const psychData = useMemo(() => {
    const emotionMap = {};
    const mistakeMap = {};
    let disciplineScore = 0;
    let totalWithData = 0;

    trades.forEach(t => {
      // Track emotions if stored
      if (t.emotion) {
        emotionMap[t.emotion] = (emotionMap[t.emotion] || 0) + 1;
      }
      // Track mistakes
      if (t.mistake) {
        mistakeMap[t.mistake] = (mistakeMap[t.mistake] || 0) + 1;
      }
      // Discipline: followedPlan field
      if (t.followedPlan !== undefined) {
        disciplineScore += t.followedPlan ? 1 : 0;
        totalWithData++;
      }
    });

    const topEmotions = Object.entries(emotionMap).sort((a, b) => b[1] - a[1]);
    const topMistakes = Object.entries(mistakeMap).sort((a, b) => b[1] - a[1]);
    const disciplinePct = totalWithData > 0 ? (disciplineScore / totalWithData) * 100 : 0;

    // Calculate emotion impact on P&L
    const emotionPnl = {};
    trades.forEach(t => {
      if (t.emotion && t.pnl) {
        emotionPnl[t.emotion] = (emotionPnl[t.emotion] || 0) + t.pnl;
      }
    });

    return { topEmotions, topMistakes, disciplinePct, emotionPnl, totalWithData, totalTrades: trades.length };
  }, [trades]);

  if (trades.length === 0) {
    return (
      <div style={{ ...S.glassCard, padding: 24, textAlign: "center" }}>
        <Brain size={32} style={{ opacity: 0.3, marginBottom: 12 }} />
        <div style={{ color: C.textDim, fontSize: 13 }}>Log trades to see your psychology patterns</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ ...S.glassCard, padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <Brain size={14} color={C.accent} /> Trading Psychology
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div style={{ padding: 16, borderRadius: C.radiusCard, background: "rgba(0,0,0,0.3)", textAlign: "center" }}>
            <div style={{ fontSize: 10, color: C.textDim, marginBottom: 4 }}>Discipline Score</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: psychData.disciplinePct >= 80 ? C.emerald : psychData.disciplinePct >= 50 ? C.yellow : C.amber }}>
              {psychData.totalWithData > 0 ? `${psychData.disciplinePct.toFixed(0)}%` : "—"}
            </div>
            <div style={{ fontSize: 10, color: C.textDim, marginTop: 4 }}>followed plan</div>
          </div>
          <div style={{ padding: 16, borderRadius: C.radiusCard, background: "rgba(0,0,0,0.3)", textAlign: "center" }}>
            <div style={{ fontSize: 10, color: C.textDim, marginBottom: 4 }}>Journaling</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: C.accent }}>{trades.length}</div>
            <div style={{ fontSize: 10, color: C.textDim, marginTop: 4 }}>total trades logged</div>
          </div>
          <div style={{ padding: 16, borderRadius: C.radiusCard, background: "rgba(0,0,0,0.3)", textAlign: "center" }}>
            <div style={{ fontSize: 10, color: C.textDim, marginBottom: 4 }}>Unique Mistakes</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: psychData.topMistakes.length > 0 ? C.amber : C.emerald }}>
              {psychData.topMistakes.length || 0}
            </div>
            <div style={{ fontSize: 10, color: C.textDim, marginTop: 4 }}>patterns detected</div>
          </div>
        </div>

        {/* Top Emotions */}
        {psychData.topEmotions.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={S.label}>Emotional State Breakdown</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {psychData.topEmotions.slice(0, 5).map(([emotion, count]) => {
                const pnl = psychData.emotionPnl[emotion] || 0;
                return (
                  <div key={emotion} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", borderRadius: 8, background: "rgba(0,0,0,0.2)" }}>
                    <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{emotion}</div>
                    <div style={{ fontSize: 11, color: C.textMuted }}>{count}x</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: pnl >= 0 ? C.emerald : C.amber }}>
                      {fmt(pnl)}
                    </div>
                    <div style={{ width: 80, height: 4, borderRadius: 2, background: C.border }}>
                      <div style={{ width: `${(count / psychData.topEmotions[0][1]) * 100}%`, height: "100%", borderRadius: 2, background: pnl >= 0 ? C.emerald : C.amber }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Top Mistakes */}
        {psychData.topMistakes.length > 0 && (
          <div>
            <div style={S.label}>Most Common Mistakes</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {psychData.topMistakes.slice(0, 5).map(([mistake, count]) => (
                <div key={mistake} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", borderRadius: 8, background: `${C.amber}08` }}>
                  <AlertTriangle size={14} color={C.amber} />
                  <div style={{ flex: 1, fontSize: 13 }}>{mistake}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.amber }}>{count}x</div>
                  <div style={{ width: 60, height: 4, borderRadius: 2, background: C.border }}>
                    <div style={{ width: `${(count / psychData.topMistakes[0][1]) * 100}%`, height: "100%", borderRadius: 2, background: C.amber }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mindset Tips */}
      <div style={{ ...S.glassCard, padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <Sparkles size={14} color={C.accent} /> Mindset Tips
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {psychData.disciplinePct < 80 && (
            <div style={{ padding: "10px 14px", borderRadius: 8, background: `${C.amber}08`, border: `1px solid ${C.amber}15`, fontSize: 12, color: C.textMuted }}>
              💡 Your discipline score is {psychData.disciplinePct.toFixed(0)}%. Try pre-committing to your rules before each session.
            </div>
          )}
          {psychData.topMistakes.length > 0 && (
            <div style={{ padding: "10px 14px", borderRadius: 8, background: `${C.amber}08`, border: `1px solid ${C.amber}15`, fontSize: 12, color: C.textMuted }}>
              🎯 Focus on eliminating 1 mistake per week. Your top mistake "{psychData.topMistakes[0]?.[0]}" occurs {psychData.topMistakes[0]?.[1]} times.
            </div>
          )}
          {psychData.topEmotions.length > 0 && (
            <div style={{ padding: "10px 14px", borderRadius: 8, background: `${C.accent}08`, border: `1px solid ${C.accent}15`, fontSize: 12, color: C.textMuted }}>
              🧠 Your most common emotion is "{psychData.topEmotions[0]?.[0]}". {psychData.emotionPnl[psychData.topEmotions[0]?.[0]] >= 0 ? "This state works for you!" : "Try centering before your next trade."}
            </div>
          )}
          {psychData.totalWithData === 0 && (
            <div style={{ padding: "10px 14px", borderRadius: 8, background: `${C.accent}08`, border: `1px solid ${C.accent}15`, fontSize: 12, color: C.textMuted }}>
              📝 Log your emotional state and whether you followed your plan in the Post-Session to unlock psychology insights.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SETTINGS PAGE ──────────────────────────────────────────────────────────
function SettingsPage({ trades, setTrades, propAccounts, showToast, spiritualMode, setSpiritualMode, dailyGoal, setDailyGoal, weeklyGoal, setWeeklyGoal, monthlyGoal, setMonthlyGoal, dailyLossLimit, setDailyLossLimit }) {
  const [showGoals, setShowGoals] = useState(false);
  const exportCSV = () => {
    const headers = ["date", "ticker", "direction", "contracts", "pnl", "grade", "mistake", "notes", "entryModel"];
    const rows = trades.map(t => headers.map(h => t[h] || ""));
    const csv = [headers.join(","), ...rows.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `87capital-trades-${today()}.csv`;
    a.click();
    showToast(`Exported ${trades.length} trades to CSV`, "success");
  };

  const exportJSON = () => {
    const data = {
      version: "4.0",
      exportedAt: new Date().toISOString(),
      trader: "Karan Singh",
      journey: "30 Trades To Freedom",
      trades,
      propAccounts
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `87capital-backup-${today()}.json`;
    a.click();
    showToast("Full backup exported successfully!", "success");
  };

  // ── CSV Import ──────────────────────────────────────────────────────────────
  // Parses "30 Trades to Freedom" journal CSVs into app trade format
  const importCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        let raw = event.target.result;
        // Strip BOM
        if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
        const lines = raw.split(/\r?\n/).filter(l => l.trim());

        if (lines.length < 2) {
          showToast("CSV file is empty or invalid", "error");
          return;
        }

        // Parse header — normalize column names
        const headers = parseCSVLine(lines[0]).map(h => h.trim().replace(/^"|"$/g, "").toLowerCase());
        // Column index map (case-insensitive lookup)
        const col = {};
        headers.forEach((h, i) => { col[h] = i; });

        const parseDate = (str) => {
          if (!str || !str.trim()) return null;
          const cleaned = str.trim().replace(/^"|"$/g, "").trim();
          // Handle "April 2, 2026" format
          const months = { january: 0, february: 1, march: 2, april: 3, may: 4, june: 5, july: 6, august: 7, september: 8, october: 9, november: 10, december: 11 };
          const match = cleaned.match(/^([A-Za-z]+)\s+(\d+),?\s+(\d{4})$/);
          if (match) {
            const m = months[match[1].toLowerCase()];
            if (m !== undefined) {
              const d = new Date(Number(match[3]), m, Number(match[2]));
              return d.toISOString().split("T")[0];
            }
          }
          // Fallback: try native Date parsing
          const fallback = new Date(cleaned);
          return isNaN(fallback) ? null : fallback.toISOString().split("T")[0];
        };

        const toNum = (str) => {
          if (!str || !str.trim()) return null;
          const cleaned = str.trim().replace(/^"|"$/g, "").replace(/[$,]/g, "").trim();
          const n = parseFloat(cleaned);
          return isNaN(n) ? null : n;
        };

        const toArray = (str) => {
          if (!str || !str.trim()) return [];
          return str.split(",").map(s => s.trim()).filter(Boolean);
        };

        const get = (row, key) => {
          const idx = col[key];
          if (idx === undefined || idx >= row.length) return "";
          return (row[idx] || "").trim().replace(/^"|"$/g, "");
        };

        const trades = [];
        for (let i = 1; i < lines.length; i++) {
          const row = parseCSVLine(lines[i]);
          if (row.length < 3) continue;

          // Skip "NO Trade" rows
          const name = get(row, "name");
          if (name && name.toLowerCase().includes("no trade")) continue;

          const pnl = toNum(get(row, "profit/loss") || get(row, "pnl"));
          if (pnl === null) continue; // Skip rows without P&L

          const gradeRaw = get(row, "trade setup") || get(row, "grade");
          const grade = gradeRaw ? gradeRaw.split(",")[0].trim() : "";

          const trade = {
            id: `import_${Date.now()}_${i}`,
            date: parseDate(get(row, "date")) || new Date().toISOString().split("T")[0],
            ticker: get(row, "ticker") || "MNQ",
            pnl,
            contracts: toNum(get(row, "contract size")) || 1,
            direction: "",
            entryModel: toArray(get(row, "entry model") || get(row, "entrymodel")).join(", "),
            grade,
            htfOrderflow: toArray(get(row, "htf orderflow") || get(row, "htforderflow")),
            mmxm: toArray(get(row, "mmxm")),
            smr: toArray(get(row, "smr time") || get(row, "smrtime")),
            smrTime: get(row, "smr time") || get(row, "smrtime"),
            liquidity: toArray(get(row, "liquidity")),
            poi: get(row, "poi"),
            toi: get(row, "toi"),
            smt: get(row, "smt"),
            newsDay: get(row, "news day") || get(row, "newsday"),
            mistake: get(row, "trade took") || get(row, "tradetook"),
            notes: get(row, "summry") || get(row, "learnings") || get(row, "summary") || get(row, "notes") || "",
          };

          trades.push(trade);
        }

        if (trades.length === 0) {
          showToast("No valid trades found in CSV", "error");
          return;
        }

        // Merge with existing trades (dedupe by date + ticker + pnl)
        setTrades(prev => {
          const merged = [...prev];
          trades.forEach(t => {
            // Simple dedupe: skip if same date + ticker + pnl already exists
            const dup = merged.find(m => m.date === t.date && m.ticker === t.ticker && m.pnl === t.pnl);
            if (!dup) merged.push(t);
          });
          return merged;
        });
        showToast(`Imported ${trades.length} trade${trades.length !== 1 ? "s" : ""}!`, "success");
      } catch (err) {
        console.error("CSV import error:", err);
        showToast("Failed to parse CSV: " + err.message, "error");
      }
    };
    reader.readAsText(file);
  };

  // ── Robust CSV line parser (handles quoted commas) ──────────────────────────
  function parseCSVLine(line) {
    const result = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  }

  const importJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.trades) {
          setTrades(data.trades);
          showToast(`Imported ${data.trades.length} trades!`, "success");
        } else {
          showToast("Invalid backup file", "error");
        }
      } catch (err) {
        showToast("Failed to parse backup file", "error");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ ...S.page, animation: "fadeIn 0.4s ease-out" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 28 }}>Settings</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ ...S.glassCard, gridColumn: "1/-1" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
            <Sparkles size={20} color={C.accent} /> Experience Settings
          </h3>
          <label style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            padding: 14,
            borderRadius: 12,
            background: "rgba(0,0,0,0.25)",
            border: `1px solid ${C.border}`,
            cursor: "pointer"
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Spiritual Mode</div>
              <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>
                Show Ardas and Gurmukhi guidance in pre/post session flows.
              </div>
            </div>
            <input
              type="checkbox"
              checked={spiritualMode}
              onChange={e => setSpiritualMode(e.target.checked)}
              style={{ width: 20, height: 20, accentColor: C.accent, cursor: "pointer" }}
            />
          </label>
        </div>

        {/* Trading Goals */}
        <div style={{ ...S.glassCard, gridColumn: "1/-1" }}>
          <div
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
            onClick={() => setShowGoals(s => !s)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Target size={18} color={C.accent} />
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Trading Goals</h3>
            </div>
            <ChevronDown size={16} style={{ color: C.textMuted, transform: showGoals ? "rotate(180deg)" : "none", transition: "0.2s" }} />
          </div>

          {showGoals && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "rgba(34,197,94,0.08)", borderRadius: 8, border: "1px solid rgba(34,197,94,0.2)" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#22c55e" }}>Daily Goal</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>Target P&L per trading day</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ color: "#22c55e", fontWeight: 700 }}>$</span>
                  <input
                    type="number"
                    value={dailyGoal}
                    onChange={e => setDailyGoal(Number(e.target.value))}
                    style={{ ...S.input(100), background: "rgba(0,0,0,0.3)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e", fontWeight: 700 }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "rgba(99,102,241,0.08)", borderRadius: 8, border: "1px solid rgba(99,102,241,0.2)" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.accent }}>Weekly Goal</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>Target P&L per week</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ color: C.accent, fontWeight: 700 }}>$</span>
                  <input
                    type="number"
                    value={weeklyGoal}
                    onChange={e => setWeeklyGoal(Number(e.target.value))}
                    style={{ ...S.input(100), background: "rgba(0,0,0,0.3)", border: "1px solid rgba(99,102,241,0.3)", color: C.accent, fontWeight: 700 }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "rgba(168,85,247,0.08)", borderRadius: 8, border: "1px solid rgba(168,85,247,0.2)" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#a855f7" }}>Monthly Goal</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>Target P&L per month</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ color: "#a855f7", fontWeight: 700 }}>$</span>
                  <input
                    type="number"
                    value={monthlyGoal}
                    onChange={e => setMonthlyGoal(Number(e.target.value))}
                    style={{ ...S.input(100), background: "rgba(0,0,0,0.3)", border: "1px solid rgba(168,85,247,0.3)", color: "#a855f7", fontWeight: 700 }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "rgba(239,68,68,0.08)", borderRadius: 8, border: "1px solid rgba(239,68,68,0.2)" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#ef4444" }}>Daily Loss Limit</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>Stop trading if losses reach this</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ color: "#ef4444", fontWeight: 700 }}>$</span>
                  <input
                    type="number"
                    value={dailyLossLimit}
                    onChange={e => setDailyLossLimit(Number(e.target.value))}
                    style={{ ...S.input(100), background: "rgba(0,0,0,0.3)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", fontWeight: 700 }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Export Data */}
        <div style={S.glassCard}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
            <Download size={20} color={C.gold} /> Export Data
          </h3>
          <p style={{ color: C.textMuted, marginBottom: 18, fontSize: 13 }}>Download your trading data for backup or analysis.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button onClick={exportCSV} style={S.btn("primary")}>
              <Download size={16} /> Export Trades (CSV)
            </button>
            <button onClick={exportJSON} style={S.btn("glass")}>
              <Download size={16} /> Export Full Backup (JSON)
            </button>
          </div>
        </div>

        {/* Import Data */}
        <div style={S.glassCard}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
            <Upload size={20} color={C.gold} /> Import Data
          </h3>
          <p style={{ color: C.textMuted, marginBottom: 14, fontSize: 13 }}>Restore from a JSON backup or import trades from a CSV journal.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <label style={{ ...S.btn("glass"), cursor: "pointer" }}>
              <Upload size={16} /> Import from CSV (Journal)
              <input type="file" accept=".csv" onChange={importCSV} style={{ display: "none" }} />
            </label>
            <label style={{ ...S.btn("glass"), cursor: "pointer" }}>
              <Upload size={16} /> Restore JSON Backup
              <input type="file" accept=".json" onChange={importJSON} style={{ display: "none" }} />
            </label>
          </div>
        </div>

        {/* About */}
        <div style={{ ...S.glassCard, gridColumn: "1/-1" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>About</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            <Logo size={48} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.gold }}>87Capital Trading OS</div>
              <div style={{ fontSize: 12, color: C.textMuted }}>Version 4.0 — Built for Karan Singh</div>
            </div>
          </div>
          <p style={{ color: C.textMuted, lineHeight: 1.7, fontSize: 13 }}>
            "30 Trades To Freedom" — A trading command center built with discipline, ICT methodology, and Waheguru's blessing.
            Track your trades, analyze your performance, and trade with purpose.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── MILESTONE HELPERS ─────────────────────────────────────────────────────

// Pure function: given current data + existing milestones, returns updated milestones
function checkMilestones({ trades, propAccounts, payouts, weeklyReviews, existingMilestones }) {
  try {
    const now = new Date().toISOString();
    const existing = existingMilestones || [];
    const getOrCreate = (id, def) => existing.find(m => m.id === id) || { id, ...def, achievedAt: null, current: 0 };

    // Compute trade stats
    const wins = trades.filter(t => t.pnl > 0);
    const winRate = trades.length ? (wins.length / trades.length) * 100 : 0;
    const bestTrade = trades.length ? Math.max(...trades.map(t => t.pnl)) : 0;
    const dailyPnl = {};
    trades.forEach(t => { dailyPnl[t.date] = (dailyPnl[t.date] || 0) + t.pnl; });
    const sortedDates = Object.keys(dailyPnl).sort();
    const weeklyPnl = {};
    sortedDates.forEach(d => {
      const weekStart = getWeekStart(new Date(d));
      weeklyPnl[weekStart] = (weeklyPnl[weekStart] || 0) + dailyPnl[d];
    });
    const monthlyPnl = {};
    sortedDates.forEach(d => {
      const month = d.substring(0, 7);
      monthlyPnl[month] = (monthlyPnl[month] || 0) + dailyPnl[d];
    });
    // Streak: consecutive profitable days ending on most recent date
    let greenStreak = 0;
    for (let i = sortedDates.length - 1; i >= 0; i--) {
      if (dailyPnl[sortedDates[i]] > 0) greenStreak++;
      else break;
    }
    // Journal streak: consecutive days with at least one trade
    const tradeDates = [...new Set(trades.map(t => t.date))].sort();
    let journalStreak = 0;
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().split("T")[0];
    if (tradeDates.includes(today) || tradeDates.includes(yStr)) {
      for (let i = tradeDates.length - 1; i >= 0; i--) {
        const prev = tradeDates[i];
        const prevDate = new Date(prev);
        const expected = new Date(tradeDates[i + 1] || prev);
        expected.setDate(expected.getDate() + 1);
        if (prev === expected.toISOString().split("T")[0] || i === tradeDates.length - 1) journalStreak++;
        else break;
      }
    }

    // Prop firm stats
    const fundedCount = propAccounts.filter(a => a.status === "funded").length;
    const totalPayouts = payouts.reduce((s, p) => s + (p.amount || 0), 0);
    const netProfit = totalPayouts - (propAccounts.reduce((s, a) => s + (a.balance || 0), 0) * 0.01);

    // Week start helper
    function getWeekStart(date) {
      const d = new Date(date);
      const day = d.getDay();
      const diff = (day === 0 ? -6 : 1 - day);
      d.setDate(d.getDate() + diff);
      return d.toISOString().split("T")[0];
    }
    const thisWeekStart = getWeekStart(new Date());
    const thisMonth = new Date().toISOString().substring(0, 7);

    const updated = [
      // ── Trading ──────────────────────────────────────────────
      { ...getOrCreate("T1", { type: "trading", label: "First Green Day", description: "Closed a profitable day", target: 1, icon: "🌱", category: "Trading" }),
        current: wins.length },
      { ...getOrCreate("T2", { type: "trading", label: "3-Day Green Streak", description: "3 consecutive profitable days", target: 3, icon: "🔥", category: "Trading" }),
        current: Math.min(greenStreak, 3) },
      { ...getOrCreate("T3", { type: "trading", label: "5-Day Green Streak", description: "5 consecutive profitable days", target: 5, icon: "💎", category: "Trading" }),
        current: Math.min(greenStreak, 5) },
      { ...getOrCreate("T4", { type: "trading", label: "10-Day Green Streak", description: "10 consecutive profitable days", target: 10, icon: "👑", category: "Trading" }),
        current: Math.min(greenStreak, 10) },
      { ...getOrCreate("T5", { type: "trading", label: "50% Win Rate", description: "Hit 50% win rate", target: 50, icon: "📊", category: "Trading" }),
        current: Math.round(winRate) },
      { ...getOrCreate("T6", { type: "trading", label: "60% Win Rate", description: "Hit 60% win rate", target: 60, icon: "📈", category: "Trading" }),
        current: Math.round(winRate) },
      { ...getOrCreate("T7", { type: "trading", label: "70% Win Rate", description: "Hit 70% win rate", target: 70, icon: "🚀", category: "Trading" }),
        current: Math.round(winRate) },
      { ...getOrCreate("T8", { type: "trading", label: "First A+ Trade", description: "First A+ graded trade", target: 1, icon: "⭐", category: "Trading" }),
        current: trades.filter(t => t.grade === "A+").length },
      { ...getOrCreate("T9", { type: "trading", label: "Best Trade", description: "Beat your all-time best", target: 1, icon: "🏅", category: "Trading" }),
        current: bestTrade },
      { ...getOrCreate("T10", { type: "trading", label: "$1K Profitable Week", description: "$1,000+ profit in a week", target: 1000, icon: "💰", category: "Trading" }),
        current: Math.max(...Object.values(weeklyPnl), 0) },
      { ...getOrCreate("T11", { type: "trading", label: "$5K Profitable Month", description: "$5,000+ profit in a month", target: 5000, icon: "📊", category: "Trading" }),
        current: Math.max(...Object.values(monthlyPnl), 0) },
      { ...getOrCreate("T12", { type: "trading", label: "$10K Profitable Month", description: "$10,000+ profit in a month", target: 10000, icon: "🏆", category: "Trading" }),
        current: Math.max(...Object.values(monthlyPnl), 0) },
      { ...getOrCreate("T13", { type: "trading", label: "100 Trades Logged", description: "100 trades in journal", target: 100, icon: "📓", category: "Trading" }),
        current: trades.length },
      { ...getOrCreate("T14", { type: "trading", label: "500 Trades Logged", description: "500 trades in journal", target: 500, icon: "📚", category: "Trading" }),
        current: trades.length },
      { ...getOrCreate("T15", { type: "trading", label: "Journal Streak 7", description: "Journaled 7 days in a row", target: 7, icon: "✍️", category: "Trading" }),
        current: journalStreak },
      { ...getOrCreate("T16", { type: "trading", label: "Journal Streak 30", description: "Journaled 30 days in a row", target: 30, icon: "📅", category: "Trading" }),
        current: journalStreak },
      // ── Prop Firm ───────────────────────────────────────────
      { ...getOrCreate("P1", { type: "propfirm", label: "First Evaluation", description: "Added first evaluation account", target: 1, icon: "🏦", category: "Prop Firm" }),
        current: propAccounts.length },
      { ...getOrCreate("P2", { type: "propfirm", label: "First Funded", description: "First account became funded", target: 1, icon: "✅", category: "Prop Firm" }),
        current: fundedCount },
      { ...getOrCreate("P3", { type: "propfirm", label: "3 Funded Accounts", description: "3 simultaneous funded accounts", target: 3, icon: "🌟", category: "Prop Firm" }),
        current: fundedCount },
      { ...getOrCreate("P4", { type: "propfirm", label: "First Payout", description: "Received first payout", target: 1, icon: "💸", category: "Prop Firm" }),
        current: payouts.length },
      { ...getOrCreate("P5", { type: "propfirm", label: "$1K Total Payouts", description: "$1,000 in total payouts", target: 1000, icon: "💵", category: "Prop Firm" }),
        current: totalPayouts },
      { ...getOrCreate("P6", { type: "propfirm", label: "$5K Total Payouts", description: "$5,000 in total payouts", target: 5000, icon: "💴", category: "Prop Firm" }),
        current: totalPayouts },
      { ...getOrCreate("P7", { type: "propfirm", label: "$10K Total Payouts", description: "$10,000 in total payouts", target: 10000, icon: "💰", category: "Prop Firm" }),
        current: totalPayouts },
      { ...getOrCreate("P8", { type: "propfirm", label: "Net Profit Positive", description: "Net profit goes positive", target: 1, icon: "📈", category: "Prop Firm" }),
        current: netProfit > 0 ? 1 : 0 },
      // ── Habit ────────────────────────────────────────────────
      { ...getOrCreate("H1", { type: "habit", label: "Pre-Session Planner", description: "First pre-session plan written", target: 1, icon: "🧘", category: "Habit" }),
        current: propAccounts.length > 0 || trades.length > 0 ? 1 : 0 },
      { ...getOrCreate("H2", { type: "habit", label: "7-Day Journal Streak", description: "Logged trades 7 days straight", target: 7, icon: "📆", category: "Habit" }),
        current: journalStreak },
      { ...getOrCreate("H3", { type: "habit", label: "30-Day Journal Streak", description: "Logged trades 30 days straight", target: 30, icon: "🗓️", category: "Habit" }),
        current: journalStreak },
      { ...getOrCreate("H4", { type: "habit", label: "90-Day Journal Streak", description: "Logged trades 90 days straight", target: 90, icon: "🏅", category: "Habit" }),
        current: journalStreak },
      { ...getOrCreate("H5", { type: "habit", label: "Week Review Done", description: "Completed first weekly review", target: 1, icon: "📝", category: "Habit" }),
        current: weeklyReviews.length },
      { ...getOrCreate("H6", { type: "habit", label: "4 Weeks Reviewed", description: "Completed 4 weekly reviews", target: 4, icon: "📖", category: "Habit" }),
        current: weeklyReviews.length },
      { ...getOrCreate("H7", { type: "habit", label: "12 Weeks Reviewed", description: "Completed 12 weekly reviews", target: 12, icon: "🎓", category: "Habit" }),
        current: weeklyReviews.length },
      { ...getOrCreate("H8", { type: "habit", label: "Zero B Trades", description: "A whole week with no B trades", target: 1, icon: "🎯", category: "Habit" }),
        current: 0 },
    ];

    // Mark achievements
    return updated.map(m => {
      const wasAchieved = !!existing.find(e => e.id === m.id && e.achievedAt);
      const isAchieved = m.target !== null && m.current >= m.target;
      if (isAchieved && !wasAchieved) {
        return { ...m, achievedAt: now };
      }
      return m;
    });
  } catch (e) {
    return existingMilestones || [];
  }
}

// ─── MILESTONE STRIP ────────────────────────────────────────────────────────
function MilestoneStrip({ milestones = [], onViewAll }) {
  if (!milestones || milestones.length === 0) return null;
  const achieved = milestones.filter(m => m.achievedAt);
  const top = milestones.slice(0, 6);
  return (
    <div style={{ ...S.glassCard, padding: 16, marginTop: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Trophy size={16} color={C.yellow} />
          <span style={{ fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Milestones
          </span>
          <span style={{ fontSize: 10, color: C.textDim }}>{achieved.length}/{milestones.length}</span>
        </div>
        <button onClick={onViewAll} style={{ background: "none", border: "none", cursor: "pointer", color: C.accentLight, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
          View All <ChevronRight size={12} />
        </button>
      </div>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
        {top.map(m => {
          const done = !!m.achievedAt;
          const pct = m.target ? Math.min(100, Math.round((m.current / m.target) * 100)) : 0;
          return (
            <div key={m.id} style={{
              flexShrink: 0, minWidth: 120,
              padding: "10px 12px", borderRadius: 12,
              border: `1px solid ${done ? C.yellow + "60" : C.border}`,
              background: done ? `${C.yellow}10` : "rgba(0,0,0,0.2)",
              boxShadow: done ? `0 0 12px ${C.yellow}30` : "none",
            }}>
              <div style={{ fontSize: 16, marginBottom: 4 }}>{m.icon}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: done ? C.yellow : C.textMuted, marginBottom: done ? 4 : 6, lineHeight: 1.2 }}>
                {m.label}
              </div>
              {done ? (
                <div style={{ fontSize: 9, color: C.emerald }}>✓ Achieved</div>
              ) : (
                <>
                  <div style={{ height: 3, borderRadius: 2, background: C.border, overflow: "hidden", marginBottom: 3 }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: C.accent, borderRadius: 2, transition: "width 0.3s ease" }} />
                  </div>
                  <div style={{ fontSize: 9, color: C.textDim }}>{pct}%</div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MILESTONES PAGE ─────────────────────────────────────────────────────────
function MilestonesPage({ milestones = [], trades, propAccounts, payouts, weeklyReviews, setPage }) {
  const categories = ["Trading", "Prop Firm", "Habit"];
  const grouped = categories.map(cat => ({
    cat,
    items: (milestones || []).filter(m => m.category === cat)
  }));

  return (
    <div style={{ ...S.page, animation: "fadeIn 0.4s ease-out" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>🏆 Your Achievements</h1>
          <p style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>
            {milestones.filter(m => m.achievedAt).length} of {milestones.length} milestones unlocked
          </p>
        </div>
        <button onClick={() => setPage("dashboard")} style={{ ...S.btn("ghost", "sm") }}>
          ← Back
        </button>
      </div>

      {grouped.map(({ cat, items }) => (
        <div key={cat} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
            {cat}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
            {items.map(m => {
              const done = !!m.achievedAt;
              const pct = m.target ? Math.min(100, Math.round((m.current / m.target) * 100)) : 0;
              return (
                <div key={m.id} style={{
                  ...S.glassCard, padding: 20,
                  border: done ? `1px solid ${C.yellow}50` : `1px solid ${C.border}`,
                  boxShadow: done ? `0 0 20px ${C.yellow}20` : "none",
                  transition: "all 0.3s ease"
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: done ? `${C.yellow}20` : C.bgCardAlt,
                      border: done ? `1px solid ${C.yellow}50` : `1px solid ${C.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 22, flexShrink: 0,
                      boxShadow: done ? `0 0 16px ${C.yellow}40` : "none"
                    }}>
                      {done ? <Trophy size={20} color={C.yellow} /> : m.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: done ? C.yellow : C.text, marginBottom: 4 }}>
                        {m.label}
                      </div>
                      <div style={{ fontSize: 11, color: C.textDim, lineHeight: 1.4 }}>
                        {m.description}
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 14 }}>
                    {done ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.emerald }} />
                        <span style={{ fontSize: 11, color: C.emerald, fontWeight: 600 }}>
                          Achieved {m.achievedAt ? new Date(m.achievedAt).toLocaleDateString() : ""}
                        </span>
                      </div>
                    ) : (
                      <>
                        <div style={{ height: 4, borderRadius: 2, background: C.border, overflow: "hidden", marginBottom: 6 }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${C.accent}, ${C.purple})`, borderRadius: 2, transition: "width 0.4s ease" }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 10, color: C.textDim }}>
                            {typeof m.current === "number" && m.target > 1 ? `${m.current} / ${m.target}` : `${pct}%`}
                          </span>
                          <span style={{ fontSize: 10, color: C.textDim }}>
                            {typeof m.current === "number" && m.target > 1 ? `${pct}%` : ""}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── WEEKLY REVIEW MODAL ─────────────────────────────────────────────────────
function WeeklyReviewModal({ trades, milestones, weeklyReviews, onClose, onSubmit }) {
  const [grade, setGrade] = useState("");
  const [wentWell, setWentWell] = useState("");
  const [improve, setImprove] = useState("");
  const [nextGoal, setNextGoal] = useState("");
  const [nextAvoid, setNextAvoid] = useState("");

  // Compute week range
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6);
  const fmt = d => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const weekRange = `${fmt(monday)}–${fmt(sunday)}, ${today.getFullYear()}`;

  // Week stats
  const weekTrades = trades.filter(t => {
    const d = new Date(t.date);
    return d >= monday && d <= today;
  });
  const weekPnl = weekTrades.reduce((s, t) => s + t.pnl, 0);
  const weekWr = weekTrades.length ? ((weekTrades.filter(t => t.pnl > 0).length / weekTrades.length) * 100).toFixed(0) : 0;
  const weekBest = weekTrades.length ? Math.max(...weekTrades.map(t => t.pnl)) : 0;
  const weekWorst = weekTrades.length ? Math.min(...weekTrades.map(t => t.pnl)) : 0;

  // Milestones this week
  const thisWeekStart = monday.toISOString().split("T")[0];
  const milestonesThisWeek = (milestones || []).filter(m => m.achievedAt && m.achievedAt >= thisWeekStart);

  const gradeInfo = { A: { color: C.emerald, label: "Excellent" }, B: { color: C.accent, label: "Good" }, C: { color: C.yellow, label: "Average" }, D: { color: C.amber, label: "Poor" }, F: { color: C.amber, label: "Failed" } };

  const handleSubmit = () => {
    if (!grade) return;
    onSubmit({
      id: Date.now(),
      weekStart: thisWeekStart,
      grade,
      wentWell,
      improve,
      nextWeekGoal: nextGoal,
      nextWeekAvoid: nextAvoid,
      milestonesHit: milestonesThisWeek.map(m => m.id),
      weekPnl, weekWr, weekTrades: weekTrades.length
    });
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
      padding: 16, animation: "fadeIn 0.3s ease-out"
    }}>
      <div style={{
        width: "100%", maxWidth: 640, maxHeight: "90vh", overflowY: "auto",
        background: C.bgCard, borderRadius: 24, border: `1px solid ${C.border}`,
        padding: 32, boxShadow: `0 24px 64px rgba(0,0,0,0.6)`
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>📋 Week in Review</h2>
            <p style={{ fontSize: 13, color: C.textMuted }}>{weekRange}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.textDim, padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {/* Week Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24, padding: 16, borderRadius: 14, background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}` }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: weekPnl >= 0 ? C.emerald : C.amber }}>{weekTrades.length}</div>
            <div style={{ fontSize: 10, color: C.textDim }}>Trades</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: weekPnl >= 0 ? C.emerald : C.amber }}>{weekWr}%</div>
            <div style={{ fontSize: 10, color: C.textDim }}>Win Rate</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: weekPnl >= 0 ? C.emerald : C.amber }}>
              {weekPnl >= 0 ? "+" : ""}{weekPnl.toLocaleString()}
            </div>
            <div style={{ fontSize: 10, color: C.textDim }}>P&L</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.yellow }}>{weekBest > 0 ? "+" : ""}{weekBest}</div>
            <div style={{ fontSize: 10, color: C.textDim }}>Best Trade</div>
          </div>
        </div>

        {/* Grade */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 10 }}>
            Grade the Week
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            {["A", "B", "C", "D", "F"].map(g => {
              const info = gradeInfo[g];
              const active = grade === g;
              return (
                <button key={g} onClick={() => setGrade(g)} style={{
                  flex: 1, padding: "12px 8px", borderRadius: 12, border: `2px solid ${active ? info.color : C.border}`,
                  background: active ? `${info.color}20` : "transparent", cursor: "pointer",
                  transition: "all 0.2s ease", boxShadow: active ? `0 0 16px ${info.color}40` : "none"
                }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: active ? info.color : C.textDim }}>{g}</div>
                  <div style={{ fontSize: 9, color: active ? info.color : C.textDim, marginTop: 2 }}>{info.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Went Well */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 8 }}>
            What Went Well
          </label>
          <textarea value={wentWell} onChange={e => setWentWell(e.target.value)} rows={3} style={{
            ...S.input, resize: "none", lineHeight: 1.6
          }} placeholder="The pre-session planning really helped today..." />
        </div>

        {/* Improve */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 8 }}>
            What to Improve
          </label>
          <textarea value={improve} onChange={e => setImprove(e.target.value)} rows={3} style={{
            ...S.input, resize: "none", lineHeight: 1.6
          }} placeholder="I let one trade run too long and got emotional..." />
        </div>

        {/* Next Week */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 8 }}>
              Next Week's Goal
            </label>
            <input value={nextGoal} onChange={e => setNextGoal(e.target.value)} style={S.input} placeholder="Stick to my 2-trade rule" />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 8 }}>
              What to Avoid
            </label>
            <input value={nextAvoid} onChange={e => setNextAvoid(e.target.value)} style={S.input} placeholder="Adding to losing trades" />
          </div>
        </div>

        {/* Milestone Moment */}
        {milestonesThisWeek.length > 0 ? (
          <div style={{ padding: 16, borderRadius: 14, background: `${C.yellow}10`, border: `1px solid ${C.yellow}40`, marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.yellow, marginBottom: 8 }}>
              🎉 {milestonesThisWeek.length} milestone{milestonesThisWeek.length > 1 ? "s" : ""} hit this week!
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {milestonesThisWeek.map(m => (
                <span key={m.id} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 20, background: `${C.yellow}20`, color: C.yellow }}>
                  {m.icon} {m.label}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ padding: 16, borderRadius: 14, background: C.bgCardAlt, border: `1px solid ${C.border}`, marginBottom: 24, textAlign: "center" }}>
            <p style={{ fontSize: 12, color: C.textDim }}>Keep pushing — you're building something real.</p>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onClose} style={{ ...S.btn("ghost"), flex: 1 }}>
            Skip for now
          </button>
          <button
            onClick={handleSubmit}
            disabled={!grade}
            style={{
              ...S.btn("primary"), flex: 2, opacity: grade ? 1 : 0.5,
              cursor: grade ? "pointer" : "not-allowed"
            }}
          >
            Submit Review →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── WEEKLY REVIEW PAGE ──────────────────────────────────────────────────────
function WeeklyReviewPage({ trades, weeklyReviews, setPage }) {
  const gradeColors = { A: C.emerald, B: C.accent, C: C.yellow, D: C.amber, F: C.amber };
  const recent = [...(weeklyReviews || [])].reverse().slice(0, 12);
  const [expanded, setExpanded] = useState(null);

  // Weekly P&L from trades
  const weeklyData = useMemo(() => {
    const byWeek = {};
    trades.forEach(t => {
      const d = new Date(t.date);
      const day = d.getDay();
      const monday = new Date(d);
      monday.setDate(d.getDate() - ((day + 6) % 7));
      const key = monday.toISOString().split("T")[0];
      byWeek[key] = (byWeek[key] || 0) + t.pnl;
    });
    return Object.entries(byWeek)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-8)
      .map(([week, pnl]) => ({ week: week.substring(5), pnl }));
  }, [trades]);

  return (
    <div style={{ ...S.page, animation: "fadeIn 0.4s ease-out" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>📅 Weekly Reviews</h1>
          <p style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>
            {weeklyReviews.length} review{weeklyReviews.length !== 1 ? "s" : ""} completed
          </p>
        </div>
        <button onClick={() => setPage("dashboard")} style={{ ...S.btn("ghost", "sm") }}>
          ← Back
        </button>
      </div>

      {/* Weekly P&L Chart */}
      {weeklyData.length > 0 && (
        <div style={{ ...S.glassCard, marginBottom: 28 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Weekly P&L</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="week" stroke={C.textDim} fontSize={11} />
              <YAxis stroke={C.textDim} fontSize={11} />
              <Tooltip contentStyle={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8 }} labelStyle={{ color: C.text }} />
              <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                {weeklyData.map((d, i) => (
                  <Cell key={i} fill={d.pnl >= 0 ? C.emerald : C.amber} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Review Grid */}
      {recent.length === 0 ? (
        <div style={{ ...S.glassCard, textAlign: "center", padding: 60, color: C.textDim }}>
          <Calendar size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
          <p style={{ fontSize: 14 }}>No reviews yet. Complete your first weekly review!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {recent.map(r => {
            const isOpen = expanded === r.id;
            const weekStart = r.weekStart ? new Date(r.weekStart) : null;
            const weekEnd = weekStart ? new Date(weekStart) : null;
            if (weekEnd) weekEnd.setDate(weekEnd.getDate() + 6);
            const dateRange = weekStart ? `${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${weekEnd ? weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}` : "";
            return (
              <div key={r.id} style={{ ...S.glassCard, padding: 20, cursor: "pointer", transition: "all 0.2s ease" }} onClick={() => setExpanded(isOpen ? null : r.id)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                      background: `${gradeColors[r.grade]}20`, border: `1px solid ${gradeColors[r.grade]}50`,
                      fontSize: 16, fontWeight: 900, color: gradeColors[r.grade]
                    }}>
                      {r.grade}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: C.textDim }}>{dateRange}</div>
                      {r.weekTrades !== undefined && (
                        <div style={{ fontSize: 10, color: C.textDim }}>{r.weekTrades} trades · {r.weekWr}% WR · {r.weekPnl >= 0 ? "+" : ""}{r.weekPnl?.toLocaleString()}</div>
                      )}
                    </div>
                  </div>
                  {isOpen ? <ChevronDown size={14} color={C.textDim} /> : <ChevronUp size={14} color={C.textDim} />}
                </div>
                {isOpen && (
                  <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10, animation: "slideDownExpand 0.2s ease-out" }}>
                    {r.wentWell && (
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: C.emerald, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>What Went Well</div>
                        <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>{r.wentWell}</div>
                      </div>
                    )}
                    {r.improve && (
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: C.amber, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>To Improve</div>
                        <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>{r.improve}</div>
                      </div>
                    )}
                    {r.nextWeekGoal && (
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Next Goal</div>
                        <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>{r.nextWeekGoal}</div>
                      </div>
                    )}
                    {r.nextWeekAvoid && (
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: C.amber, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Avoid</div>
                        <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>{r.nextWeekAvoid}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── ROOT APP ───────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [trades, setTrades] = useState([]);
  const [session, setSession] = useState({ active: false, startTime: null, trades: 0, analysis: null });
  const [propAccounts, setPropAccounts] = useState([]);
  const [spiritualMode, setSpiritualMode] = useState(true);
  const [toast, setToast] = useState(null);
  const [lastSessionData, setLastSessionData] = useState(null);
  const [showSessionSummary, setShowSessionSummary] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(() => {
    try {
      const saved = localStorage.getItem("87capital_v4");
      if (saved) { const d = JSON.parse(saved); if (d.dailyGoal) return d.dailyGoal; }
    } catch(e) {}
    return 250;
  });
  const [weeklyGoal, setWeeklyGoal] = useState(() => {
    try {
      const saved = localStorage.getItem("87capital_v4");
      if (saved) { const d = JSON.parse(saved); if (d.weeklyGoal) return d.weeklyGoal; }
    } catch(e) {}
    return 1000;
  });
  const [monthlyGoal, setMonthlyGoal] = useState(() => {
    try {
      const saved = localStorage.getItem("87capital_v4");
      if (saved) { const d = JSON.parse(saved); if (d.monthlyGoal) return d.monthlyGoal; }
    } catch(e) {}
    return 4000;
  });
  const [dailyLossLimit, setDailyLossLimit] = useState(() => {
    try {
      const saved = localStorage.getItem("87capital_v4");
      if (saved) { const d = JSON.parse(saved); if (d.dailyLossLimit) return d.dailyLossLimit; }
    } catch(e) {}
    return 250;
  });
  const [subscriptions, setSubscriptions] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [weeklyReviews, setWeeklyReviews] = useState([]);
  const [showWeeklyReview, setShowWeeklyReview] = useState(false);

  // Toast helper - defined first to avoid closure issues
  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("87capital_v4");
      if (saved) {
        const data = JSON.parse(saved);
        if (data.trades) setTrades(data.trades);
        if (data.session) setSession(data.session);
        if (data.propAccounts) setPropAccounts(data.propAccounts);
        if (typeof data.spiritualMode === "boolean") setSpiritualMode(data.spiritualMode);
        if (data.dailyGoal) setDailyGoal(data.dailyGoal);
        if (data.weeklyGoal) setWeeklyGoal(data.weeklyGoal);
        if (data.monthlyGoal) setMonthlyGoal(data.monthlyGoal);
        if (data.dailyLossLimit) setDailyLossLimit(data.dailyLossLimit);
        if (data.subscriptions) setSubscriptions(data.subscriptions);
        if (data.expenses) setExpenses(data.expenses);
        if (data.payouts) setPayouts(data.payouts);
        if (data.milestones) setMilestones(data.milestones);
        if (data.weeklyReviews) setWeeklyReviews(data.weeklyReviews);
        if (data.weeklyReviews && data.weeklyReviews.length > 0) {
          const last = data.weeklyReviews[data.weeklyReviews.length - 1];
          const lastWeekStart = last.weekStart ? new Date(last.weekStart) : null;
          const today = new Date();
          const dayOfWeek = today.getDay();
          const isMonday = dayOfWeek === 1;
          const lastWeekMonday = new Date(today);
          lastWeekMonday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
          lastWeekMonday.setHours(0,0,0,0);
          if (isMonday && (!lastWeekStart || new Date(lastWeekStart) < lastWeekMonday)) {
            setShowWeeklyReview(true);
          }
        }
      }
    } catch (e) {}
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("87capital_v4", JSON.stringify({ trades, session, propAccounts, spiritualMode, dailyGoal, weeklyGoal, monthlyGoal, dailyLossLimit, subscriptions, expenses, payouts, milestones, weeklyReviews }));
  }, [trades, session, propAccounts, spiritualMode, dailyGoal, weeklyGoal, monthlyGoal, dailyLossLimit, subscriptions, expenses, payouts, milestones, weeklyReviews]);

  // ── Initialize + detect milestones — runs whenever data changes ─────────────────
  useEffect(() => {
    // checkMilestones is a pure function that handles init (empty existing) and update
    const updated = checkMilestones({ trades, propAccounts, payouts, weeklyReviews, existingMilestones: milestones });
    const newOnes = updated.filter(u => {
      const old = milestones.find(m => m.id === u.id);
      return u.achievedAt && (!old || !old.achievedAt);
    });
    if (newOnes.length > 0) {
      setMilestones(updated);
      newOnes.forEach(m => showToast(`🏆 Milestone unlocked: ${m.label}`, "success"));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trades.length, propAccounts.length, payouts.length, weeklyReviews.length]);

  const onWeeklyReviewSubmit = useCallback((review) => {
    setWeeklyReviews(prev => [...prev, review]);
    setShowWeeklyReview(false);
    showToast("Week reviewed. Onward to next week.", "success");
  }, []);

  const onStartSession = (analysis) => {
    setSession({ active: true, startTime: Date.now(), trades: 0, analysis });
    showToast("Session started! Trade with discipline.", "success");
  };

  const onEndSession = () => {
    const sessionTrades = trades.filter(t => t.date === today());
    const stats = {
      total: sessionTrades.reduce((s, t) => s + t.pnl, 0),
      wr: sessionTrades.length ? ((sessionTrades.filter(t => t.pnl > 0).length / sessionTrades.length) * 100).toFixed(1) : 0
    };
    
    setLastSessionData({ trades: sessionTrades, stats, analysis: session.analysis });
    setShowSessionSummary(true);
    setSession({ active: false, startTime: null, trades: 0, analysis: null });
  };

  const onAddTrade = (trade) => {
    setTrades(prev => [...prev, trade]);
    setSession(s => ({ ...s, trades: s.trades + 1 }));
  };

  const onDeleteTrade = (idx) => setTrades(prev => prev.filter((_, i) => i !== idx));

  const onUpdateTrade = (idx, updatedTrade) => {
    setTrades(prev => prev.map((t, i) => i === idx ? { ...t, ...updatedTrade } : t));
  };

  const renderPage = () => {
    switch (page) {
      case "trading-floor": return <TradingFloorPage session={session} onAddTrade={onAddTrade} setPage={setPage} showToast={showToast} trades={trades} />;
      case "dashboard": return <CommandCenterPage trades={trades} session={session} propAccounts={propAccounts} setPage={setPage} dailyGoal={dailyGoal} weeklyGoal={weeklyGoal} monthlyGoal={monthlyGoal} dailyLossLimit={dailyLossLimit} milestones={milestones} weeklyReviews={weeklyReviews} />;
      case "prop-firms": return <PropFirmsPage propAccounts={propAccounts} setPropAccounts={setPropAccounts} showToast={showToast} subscriptions={subscriptions} setSubscriptions={setSubscriptions} expenses={expenses} setExpenses={setExpenses} payouts={payouts} setPayouts={setPayouts} />;
      case "news": return <NewsPage showToast={showToast} />;
      case "presession": return <PreSessionPage onStartSession={onStartSession} setPage={setPage} spiritualMode={spiritualMode} />;
      case "postsession": return <PostSessionPage setPage={setPage} showToast={showToast} trades={trades} onAddTrade={onAddTrade} spiritualMode={spiritualMode} />;
      case "journal": return <JournalPage trades={trades} onDeleteTrade={onDeleteTrade} onUpdateTrade={onUpdateTrade} showToast={showToast} />;
      case "analytics": return <AnalyticsPage trades={trades} />;
      case "psychology": return <PsychologyDashboard trades={trades} />;
      case "ai": return <AICoachPage trades={trades} />;
      case "settings": return <SettingsPage trades={trades} setTrades={setTrades} propAccounts={propAccounts} showToast={showToast} spiritualMode={spiritualMode} setSpiritualMode={setSpiritualMode} dailyGoal={dailyGoal} setDailyGoal={setDailyGoal} weeklyGoal={weeklyGoal} setWeeklyGoal={setWeeklyGoal} monthlyGoal={monthlyGoal} setMonthlyGoal={setMonthlyGoal} dailyLossLimit={dailyLossLimit} setDailyLossLimit={setDailyLossLimit} />;
      case "milestones": return <MilestonesPage milestones={milestones} trades={trades} propAccounts={propAccounts} payouts={payouts} weeklyReviews={weeklyReviews} setPage={setPage} />;
      case "weekly-review": return <WeeklyReviewPage trades={trades} weeklyReviews={weeklyReviews} setPage={setPage} />;
      default: return <CommandCenterPage trades={trades} session={session} propAccounts={propAccounts} setPage={setPage} dailyGoal={dailyGoal} weeklyGoal={weeklyGoal} monthlyGoal={monthlyGoal} dailyLossLimit={dailyLossLimit} milestones={milestones} weeklyReviews={weeklyReviews} />;
    }
  };

  return (
    <div style={{
      background: C.bg, color: C.text, fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif", minHeight: "100vh",
      backgroundImage: `radial-gradient(circle at 0% 0%, ${C.accentGlow} 0%, transparent 65%), radial-gradient(circle at 100% 100%, ${C.purpleGlow} 0%, transparent 65%)`
    }}>
      <TopBar session={session} />
      <Sidebar 
        page={page} 
        setPage={setPage} 
        session={session} 
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main style={{ marginLeft: sidebarCollapsed ? 60 : 240, marginTop: 60, minHeight: "calc(100vh - 60px)", transition: "margin-left 0.3s ease" }}>
        <ErrorBoundary>
          {renderPage()}
        </ErrorBoundary>
      </main>
      
      {/* Session End Button */}
      {session.active && (
        <button
          onClick={onEndSession}
          style={{
            position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
            ...S.btn("danger")
          }}
        >
          <Square size={16} /> End Session
        </button>
      )}
      
      {/* Session Summary Modal */}
      {showSessionSummary && (
        <SessionSummaryModal 
          sessionData={lastSessionData} 
          onClose={() => setShowSessionSummary(false)} 
        />
      )}
      
      {/* Toast */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Weekly Review Modal */}
      {showWeeklyReview && (
        <WeeklyReviewModal
          trades={trades}
          milestones={milestones}
          weeklyReviews={weeklyReviews}
          onClose={() => setShowWeeklyReview(false)}
          onSubmit={onWeeklyReviewSubmit}
        />
      )}
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInScale { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
        @keyframes livePulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.1); } }
        @keyframes firePulse { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.3); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideDown { from { transform: translateX(-50%) translateY(-100%); opacity: 0; } to { transform: translateX(-50%) translateY(0); opacity: 1; } }
        @keyframes scrollLeft { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes countUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes hoverLift { from { transform: translateY(0px); box-shadow: 0 4px 12px rgba(0,0,0,0.3); } to { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.5); } }
        @keyframes priceFlashGreen { 0% { color: inherit; } 30% { color: #22c55e; } 100% { color: inherit; } }
        @keyframes priceFlashRed { 0% { color: inherit; } 30% { color: #ef4444; } 100% { color: inherit; } }
        @keyframes pulseRing { 0% { transform: scale(1); opacity: 0.8; box-shadow: 0 0 0 0 rgba(99,102,241,0.4); } 70% { transform: scale(1.3); opacity: 0; box-shadow: 0 0 0 12px rgba(99,102,241,0); } 100% { transform: scale(1.3); opacity: 0; } }
        @keyframes fabHover { from { transform: rotate(0deg); } to { transform: rotate(90deg); } }
        @keyframes slideDownExpand { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 500px; } }
        @keyframes progressFill { from { width: 0%; } to { width: var(--progress-width, 0%); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes ambientGlow { 0%, 100% { box-shadow: 0 0 20px rgba(99,102,241,0.1); } 50% { box-shadow: 0 0 40px rgba(99,102,241,0.25); } }
        @keyframes borderPulse { 0%, 100% { border-color: rgba(255,255,255,0.08); } 50% { border-color: rgba(99,102,241,0.3); } }
        * { scrollbar-width: thin; scrollbar-color: ${C.border} transparent; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 10px; }
        body { margin: 0; }
        select option { background: ${C.bgCard}; }
        input[type="number"]::-webkit-inner-spin-button { opacity: 0.5; }
        
        /* High-DPI Optimization */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        }
        
        /* Small Screen / Tablet */
        @media (max-width: 1024px) {
          main { margin-left: 0 !important; }
          [data-sidebar] { transform: translateX(-100%); transition: transform 0.3s ease; }
          [data-sidebar].open { transform: translateX(0); }
        }
        
        /* Mobile */
        @media (max-width: 768px) {
          main { margin-left: 0 !important; margin-top: 50px !important; padding: 16px; }
          .mobile-nav { display: block !important; }
          h1 { font-size: 20px !important; }
          .glass-card { padding: 16px !important; border-radius: 12px !important; }
          .btn-lg { padding: 12px 20px !important; font-size: 14px !important; }
          input, select, textarea { font-size: 16px !important; /* Prevents zoom on iOS */ }
          .grid-2 { grid-template-columns: 1fr !important; }
          .stat-card { padding: 12px !important; }
        }
        
        /* Very Small Mobile */
        @media (max-width: 480px) {
          main { padding: 12px !important; }
          h1 { font-size: 18px !important; }
          h2 { font-size: 16px !important; }
          h3 { font-size: 14px !important; }
          .badge { font-size: 10px !important; padding: 3px 8px !important; }
          .btn { padding: 10px 16px !important; font-size: 13px !important; }
        }
        
        /* Touch-friendly targets for mobile */
        @media (pointer: coarse) {
          button, a, [role="button"] { min-height: 44px; min-width: 44px; }
          input, select, textarea { min-height: 44px; }
        }
      `}</style>
    </div>
  );
}
