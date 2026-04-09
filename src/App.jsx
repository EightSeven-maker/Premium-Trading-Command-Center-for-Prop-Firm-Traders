import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  BarChart3, Calendar, BookOpen, Target, FileText, TrendingUp, TrendingDown,
  DollarSign, Activity, Brain, Shield, Settings, Play, Square, Edit3,
  Calculator, Quote, Timer, Zap, AlertTriangle, CheckCircle, Building,
  LayoutDashboard, Radio, Clock, Eye, X, Plus, ChevronRight, ChevronLeft, ChevronDown,
  Sun, ArrowUpRight, ArrowDownRight, Search, Trash2, Bell, Check, Lock,
  Briefcase, Globe, Star, Coffee, Flame, Crosshair, Camera, Save,
  ExternalLink, RefreshCw, Gauge, Award, MessageSquare, Send, CreditCard,
  Download, Upload, Sparkles, PieChart, TrendingUp as TrendingIcon, Filter, EyeOff, Moon
} from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart as RePieChart, Pie, Cell, BarChart, Bar,
  Legend
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
          <button onClick={() => window.location.reload()} style={{ marginTop: 20, padding: "12px 24px", background: "#6366f1", border: "none", borderRadius: 8, color: "white", cursor: "pointer" }}>
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── THEME & CONSTANTS ──────────────────────────────────────────────────────
// V3 NEON GLASS DESIGN SYSTEM (Restored)
const C = {
  bg: "#030712",
  bgCard: "rgba(17, 24, 39, 0.7)",
  bgCardAlt: "rgba(31, 41, 55, 0.5)",
  bgHover: "rgba(99, 102, 241, 0.1)",
  bgGlass: "rgba(17, 24, 39, 0.5)",
  border: "rgba(255, 255, 255, 0.08)",
  borderLight: "rgba(255, 255, 255, 0.15)",
  borderGlow: "rgba(99, 102, 241, 0.4)",
  // Primary Indigo/Purple
  accent: "#6366f1",
  accentLight: "#818cf8",
  accentGlow: "rgba(99, 102, 241, 0.25)",
  purple: "#a855f7",
  purpleGlow: "rgba(168, 85, 247, 0.2)",
  // Trading Colors
  green: "#10b981",
  greenLight: "#34d399",
  greenBg: "rgba(16, 185, 129, 0.1)",
  greenBorder: "rgba(16, 185, 129, 0.25)",
  greenGlow: "rgba(16, 185, 129, 0.15)",
  red: "#ef4444",
  redLight: "#f87171",
  redBg: "rgba(239, 68, 68, 0.1)",
  redBorder: "rgba(239, 68, 68, 0.25)",
  redGlow: "rgba(239, 68, 68, 0.15)",
  yellow: "#f59e0b",
  yellowBg: "rgba(245, 158, 11, 0.1)",
  orange: "#f97316",
  cyan: "#06b6d4",
  pink: "#ec4899",
  // Text
  text: "#f8fafc",
  textMuted: "#94a3b8",
  textDim: "#64748b",
  white: "#ffffff"
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

// ─── STYLES (V3 GLASS DESIGN) ───────────────────────────────────────────────
const S = {
  glassCard: {
    background: C.bgCard,
    backdropFilter: "blur(16px)",
    borderRadius: 20,
    border: `1px solid ${C.border}`,
    padding: 24,
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.4)",
    transition: "all 0.3s ease"
  },
  input: {
    background: "rgba(0, 0, 0, 0.3)",
    border: `1px solid ${C.border}`,
    borderRadius: 12,
    padding: "12px 16px",
    color: C.text,
    fontSize: 14,
    outline: "none",
    width: "100%",
    fontFamily: "Inter, sans-serif",
    transition: "all 0.2s ease"
  },
  btn: (variant = "primary", size = "md") => {
    const sizes = {
      xs: { padding: "4px 10px", fontSize: 11 },
      sm: { padding: "8px 14px", fontSize: 12 },
      md: { padding: "12px 20px", fontSize: 14 },
      lg: { padding: "16px 28px", fontSize: 16 }
    };
    const variants = {
      primary: { background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`, boxShadow: `0 4px 20px ${C.accentGlow}`, border: "none" },
      secondary: { background: C.bgCardAlt, border: `1px solid ${C.border}`, boxShadow: "none" },
      success: { background: `linear-gradient(135deg, ${C.green}, #059669)`, border: "none" },
      danger: { background: `linear-gradient(135deg, ${C.red}, #dc2626)`, border: "none" },
      ghost: { background: "transparent", border: `1px solid ${C.border}` },
      glass: { background: C.bgCardAlt, border: `1px solid ${C.border}`, color: C.text }
    };
    return {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      borderRadius: 12,
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
    padding: "4px 12px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 700,
    background: `${color}15`,
    color: color,
    border: `1px solid ${color}30`,
    boxShadow: glow ? `0 0 20px ${color}30` : "none"
  }),
  label: {
    fontSize: 11,
    fontWeight: 700,
    color: C.textDim,
    marginBottom: 8,
    display: "block",
    textTransform: "uppercase",
    letterSpacing: "0.08em"
  },
  grid: (cols, gap = 20) => ({ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap }),
  between: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  page: { padding: 32, maxWidth: 1400, margin: "0 auto" }
};

// ─── UTILITIES ───────────────────────────────────────────────────────────────
const fmt = (n) => (n >= 0 ? "+" : "") + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtUsd = (n) => "$" + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pnlColor = (n) => n >= 0 ? C.green : C.red;
const pnlBg = (n) => n >= 0 ? C.greenBg : C.redBg;
const today = () => new Date().toISOString().split("T")[0];
const gradeColor = (g) => g === "A+" || g === "A" ? C.green : g === "B+" || g === "B" ? C.yellow : C.red;
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
  
  const bgColor = toast.type === "success" ? C.green : toast.type === "error" ? C.red : toast.type === "warning" ? C.yellow : C.accent;
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
          background: `linear-gradient(90deg, ${isDanger ? C.red : color}, ${isDanger ? C.orange : color}80)`,
          borderRadius: 4, transition: "width 0.5s ease",
          boxShadow: `0 0 10px ${isDanger ? C.red : color}60`
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
      boxShadow: active ? `0 0 30px ${C.greenGlow}` : "none",
      borderColor: active ? C.greenBorder : C.border
    }}>
      <Timer size={20} color={active ? C.green : C.textDim} />
      <span style={{ fontSize: 20, fontWeight: 800, fontFamily: "monospace", color: active ? C.green : C.text }}>
        {format(elapsed)}
      </span>
      {active && <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, animation: "livePulse 1.5s ease-in-out infinite" }} />}
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
    if (sentiment === "bullish") return C.green;
    if (sentiment === "bearish") return C.red;
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
    if (impact === "High") return C.red;
    if (impact === "Medium") return C.yellow;
    return C.green;
  };

  const getSentimentColor = (sent) => {
    if (sent === "bullish") return C.green;
    if (sent === "bearish") return C.red;
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
          <Radio size={12} color={C.green} style={{ animation: "livePulse 1.5s infinite" }} />
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
    const win = sorted[i].pnl > 0;
    const lastWin = sorted[sorted.length - 1].pnl > 0;
    if (i === sorted.length - 1) { currentStreak = 1; }
    else if (win === lastWin) { currentStreak++; }
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
  const bestDay = Object.values(byDay).length > 0 ? Math.max(...Object.values(byDay)) : 0;
  const worstDay = Object.values(byDay).length > 0 ? Math.min(...Object.values(byDay)) : 0;

  // Max Drawdown + Equity Curve
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
    totalTrades: trades.length, bestDay, worstDay, maxDrawdown,
    currentStreak, maxWinStreak, maxLossStreak,
    pnlBySymbol, pnlBySession, pnlByDayOfWeek,
    setupPerformance, todayStats,
    dailyLossLimitUsed: Math.max(0, -(todayStats.pnl)),
    highWatermark: highWater, equityCurve,
  };
}

// ─── STAT CARD ─────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color }) {
  const isPositive = typeof value === "number" && value > 0;
  const isNegative = typeof value === "number" && value < 0;
  const displayColor = isPositive ? "#22c55e" : isNegative ? "#ef4444" : (color || C.text.secondary);
  const prefix = typeof value === "number" && value > 0 ? "+" : "";

  return (
    <div style={{
      background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.18)",
      borderRadius: 10, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 3, minWidth: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        {icon && React.cloneElement(icon, { size: 12, style: { color: C.accent } })}
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
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
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
          <Area type="monotone" dataKey="equity" stroke="#6366f1" fill="url(#eqGrad)" strokeWidth={2} dot={false} />
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
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: connected ? C.green : C.red }} />
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
        <div style={{ ...S.badge(C.red), display: "block", borderRadius: 12, padding: "12px 14px", marginBottom: 12 }}>
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
                    <span style={{ fontSize: 12, color: pos.netQty > 0 ? C.green : C.red }}>
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
            <div style={{ fontSize: 28, fontWeight: 800, color: Number(stats.wr) >= 50 ? C.green : C.red }}>{stats.wr}%</div>
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
      height: 60, background: C.bgCard, borderBottom: `1px solid ${C.border}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 24px", position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      backdropFilter: "blur(20px)"
    }}>
      {/* Logo - Original Style */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 900, fontSize: 16, color: C.white,
          boxShadow: `0 4px 16px ${C.accentGlow}`
        }}>87</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.text }}>EightSeven HQ</div>
          <div style={{ fontSize: 9, color: C.accentLight, fontWeight: 600, letterSpacing: "0.1em" }}>TRADING OS V4</div>
        </div>
      </div>

      {/* Session Status */}
      {session.active && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: 20,
          background: `${C.green}15`, border: `1px solid ${C.greenBorder}`,
          boxShadow: `0 0 20px ${C.greenGlow}`
        }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, animation: "livePulse 1.5s infinite" }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: C.green }}>LIVE</span>
          <span style={{ fontSize: 11, color: C.textMuted }}>{session.trades}/2 trades</span>
        </div>
      )}

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 10,
          background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`
        }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green }} />
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
  // Main quick actions
  const quickActions = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "presession", icon: Sun, label: "Pre-Session" },
    { id: "trading-floor", icon: Zap, label: "Active Session" },
    { id: "postsession", icon: Moon, label: "Post Session" },
  ];

  const navSections = [
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
    <div style={{
      width: collapsed ? 60 : 240, height: "calc(100vh - 60px)", position: "fixed", top: 60, left: 0,
      background: `linear-gradient(180deg, ${C.bgCard} 0%, rgba(3,7,18,0.95) 100%)`,
      backdropFilter: "blur(20px)", borderRight: `1px solid ${C.border}`,
      display: "flex", flexDirection: "column", padding: collapsed ? "16px 8px" : "16px 0", 
      overflowY: "auto", transition: "width 0.3s ease, padding 0.3s ease",
      zIndex: 100
    }}>
      {/* Minimize Button */}
      <button 
        onClick={onToggleCollapse}
        style={{
          display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-end",
          padding: "8px", marginBottom: 12, background: "transparent", border: "none", cursor: "pointer"
        }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: C.bgCardAlt, border: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          {collapsed ? (
            <ChevronRight size={16} color={C.textDim} />
          ) : (
            <ChevronLeft size={16} color={C.textDim} />
          )}
        </div>
      </button>

      {/* Quick Actions */}
      <div style={{ padding: collapsed ? "0" : "0 12px", marginBottom: 8 }}>
        {quickActions.map(item => {
          const active = page === item.id;
          const isActiveSession = item.id === "trading-floor" && session.active;
          return (
            <button 
              key={item.id} 
              onClick={() => setPage(item.id)} 
              title={collapsed ? item.label : ""}
              style={{
                display: "flex", alignItems: "center", gap: collapsed ? 0 : 12, 
                padding: collapsed ? "12px" : "12px 16px",
                width: "100%", border: "none", cursor: "pointer", fontFamily: "Inter",
                justifyContent: collapsed ? "center" : "flex-start",
                background: isActiveSession ? `linear-gradient(90deg, ${C.green}20, transparent)` : 
                             active ? `linear-gradient(90deg, ${C.accent}20, transparent)` : "transparent",
                color: isActiveSession ? C.green : active ? C.accentLight : C.textMuted,
                fontWeight: isActiveSession || active ? 700 : 500, fontSize: 13,
                borderLeft: isActiveSession ? `3px solid ${C.green}` : active ? `3px solid ${C.accent}` : "3px solid transparent",
                transition: "all 0.2s ease", textAlign: "left",
                borderRadius: 8, marginBottom: 4
              }}
            >
              <item.icon size={18} color={isActiveSession ? C.green : active ? C.accent : C.textDim} />
              {!collapsed && item.label}
              {isActiveSession && !collapsed && (
                <div style={{ marginLeft: "auto" }}>
                  <div style={{ 
                    width: 8, height: 8, borderRadius: "50%", background: C.green,
                    animation: "livePulse 1.5s infinite"
                  }} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {!collapsed && (
        <>
          <div style={{ height: 1, background: C.border, margin: "8px 20px" }} />

          {/* Other Sections */}
          {navSections.map((sec, si) => (
            <div key={sec.label} style={{ marginBottom: 16 }}>
              <div style={{
                fontSize: 10, fontWeight: 800, color: C.textDim, padding: "0 20px 8px",
                letterSpacing: "0.1em"
              }}>{sec.label}</div>
              {sec.items.map(item => {
                const active = page === item.id;
                return (
                  <button key={item.id} onClick={() => setPage(item.id)} style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "11px 20px",
                    width: "100%", border: "none", cursor: "pointer", fontFamily: "Inter",
                    background: active ? `linear-gradient(90deg, ${C.accent}20, transparent)` : "transparent",
                    color: active ? C.accentLight : C.textMuted,
                    fontWeight: active ? 700 : 500, fontSize: 13,
                    borderLeft: active ? `3px solid ${C.accent}` : "3px solid transparent",
                    transition: "all 0.2s ease", textAlign: "left"
                  }}>
                    <item.icon size={18} color={active ? C.accent : C.textDim} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          ))}
        </>
      )}
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
              <span style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 20, background: `${C.green}20`, border: `1px solid ${C.greenBorder}` }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, animation: "livePulse 1.5s infinite" }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: C.green }}>LIVE</span>
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
                color: pnl && !isNaN(parseFloat(pnl)) ? (parseFloat(pnl) >= 0 ? C.green : C.red) : C.text
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

            <MultiSelectDropdown label="News Day" options={NEWS_DAY} selected={newsDay} onChange={setNewsDay} placeholder="Select News Day..." />
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
          
          <label style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "16px", borderRadius: 12, background: followedPlan ? `${C.green}10` : "rgba(0,0,0,0.3)", border: `1px solid ${followedPlan ? C.greenBorder : C.border}`, marginBottom: 20, cursor: "pointer" }}>
            <input type="checkbox" checked={followedPlan} onChange={e => setFollowedPlan(e.target.checked)} style={{ width: 20, height: 20, accentColor: C.green, marginTop: 2 }} />
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
                  background: tradeMistakes.includes(opt) ? `${C.red}25` : "rgba(0,0,0,0.3)",
                  color: tradeMistakes.includes(opt) ? C.redLight : C.textDim,
                  border: `1px solid ${tradeMistakes.includes(opt) ? C.red : C.border}`
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
            color: data.change >= 0 ? C.green : C.red
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
        background: `linear-gradient(135deg, ${C.red}, #991b1b)`,
        border: `2px solid ${C.red}`,
        borderRadius: 16, padding: 20, boxShadow: `0 8px 32px ${C.red}60`
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
              background: C.white, color: C.red, fontWeight: 600, textAlign: "center", textDecoration: "none"
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
function CommandCenterPage({ trades, session, propAccounts, setPage, dailyGoal, weeklyGoal, monthlyGoal, dailyLossLimit }) {
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
                  color: isPositive ? C.green : C.red 
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
        />
      </div>
    </div>
  );
}

// ─── ANALYTICS HUB ──────────────────────────────────────────────────────────
function AnalyticsHub({ trades }) {
  const { totalPnl, winRate, avgWinner, avgLoser, expectancy, profitFactor } = useMemo(() => computeStats(trades), [trades]);
  const equityCurve = useMemo(() => computeStats(trades).equityCurve, [trades]);
  const highWatermark = useMemo(() => {
    let hw = 0;
    let peak = 0;
    trades.slice().sort((a,b) => new Date(a.date) - new Date(b.date)).forEach(t => {
      peak += t.pnl;
      if (peak > hw) hw = peak;
    });
    return hw;
  }, [trades]);

  const statCards = [
    { label: "Total P&L", value: totalPnl, fmt: fmt, color: pnlColor(totalPnl), prefix: "" },
    { label: "Win Rate", value: winRate, fmt: v => `${v}%`, color: winRate >= 50 ? C.green : winRate >= 40 ? C.yellow : C.red },
    { label: "Avg Winner", value: avgWinner, fmt: fmt, color: C.green },
    { label: "Avg Loser", value: avgLoser, fmt: v => `-${fmt(Math.abs(v))}`, color: C.red },
    { label: "Expectancy", value: expectancy, fmt: v => (v >= 0 ? "+" : "") + v.toFixed(2), color: pnlColor(expectancy) },
    { label: "Profit Factor", value: profitFactor, fmt: v => v.toFixed(2), color: profitFactor >= 1.5 ? C.green : profitFactor >= 1 ? C.yellow : C.red }
  ];

  return (
    <>
      {/* Hero Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
        {statCards.map((card, i) => (
          <AnimatedStatCard key={card.label} card={card} delay={i * 80} />
        ))}
      </div>

      {/* Equity Curve + Setup Performance */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ ...S.glassCard, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: C.text }}>Equity Curve</h3>
          {equityCurve.length === 0 ? (
            <div style={{ textAlign: "center", padding: 32, color: C.textDim, fontSize: 13 }}>No trade data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={equityCurve} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.accent} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={C.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: C.textDim }} tickFormatter={d => d.split("-")[2]} />
                <YAxis tick={{ fontSize: 10, fill: C.textDim }} tickFormatter={v => `$${v}`} width={55} />
                <Tooltip
                  contentStyle={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, fontSize: 12 }}
                  labelStyle={{ color: C.text }}
                  formatter={(val, name) => [name === "cumulative" ? fmt(val) : val, name === "cumulative" ? "Cumulative" : "Daily"]}
                />
                {highWatermark > 0 && (
                  <ReferenceLine y={highWatermark} stroke={C.yellow} strokeDasharray="5 5" label={{ value: `HWM $${fmtUsd(highWatermark)}`, position: "right", fontSize: 9, fill: C.yellow }} />
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
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ ...S.glassCard, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: C.text }}>Day Performance</h3>
          <DayOfWeekMiniHeatmap trades={trades} />
        </div>
        <div style={{ ...S.glassCard, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: C.text }}>Session Breakdown</h3>
          <SessionMiniBreakdown trades={trades} />
        </div>
      </div>
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
            <div style={{ padding: "8px 4px", borderRadius: 8, background: bgColor, border: `1px solid ${d.pnl >= 0 ? C.greenBorder : C.redBorder}` }}>
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
function TradePanel({ trades, activeSetupFilter, activeDayFilter, setActiveSetupFilter, setActiveDayFilter, onAddTrade }) {
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
              <div style={{ position: "absolute", top: -4, right: -4, width: 10, height: 10, borderRadius: "50%", background: C.green, animation: "pulseRing 0.8s ease-out" }} />
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
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 12, background: `${C.cyan}15`, border: `1px solid ${C.cyan}40`, animation: "fadeInScale 0.2s ease-out" }}>
          <Calendar size={12} color={C.cyan} />
          <span style={{ fontSize: 11, color: C.cyan, flex: 1 }}>Day: {dayNames[activeDayFilter]}</span>
          <button onClick={() => setActiveDayFilter(null)} style={{ background: "none", border: "none", cursor: "pointer", color: C.cyan, display: "flex", alignItems: "center" }}>
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
                        {t.direction === "Long" ? <ArrowUpRight size={16} color={C.green} /> : <ArrowDownRight size={16} color={C.red} />}
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
                        {t.mistake && <div style={{ display: "flex", gap: 8, alignItems: "center" }}><span style={{ fontSize: 10, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.06em" }}>Mistake</span><div style={{ ...S.badge(C.red) }}>{t.mistake}</div></div>}
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
function PropFirmsPage({ propAccounts, setPropAccounts, showToast }) {
  const [showAdd, setShowAdd] = useState(false);
  const [showConnect, setShowConnect] = useState(false);
  const [connectingFirm, setConnectingFirm] = useState(null);
  const [apiCredentials, setApiCredentials] = useState({ apiKey: "", apiSecret: "", accountId: "" });
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [livePositions, setLivePositions] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [newAccount, setNewAccount] = useState({ firm: "", name: "", balance: 50000, target: 55000, dailyLossLimit: 1000 });

  // Prop firm API configurations
  const propFirms = [
    { id: "tradeovate", name: "Tradeovate (NinjaTrader)", icon: "N", color: "#00AEFF", description: "Connect via NinjaTrader API" },
    { id: "topstep", name: "TopStepTrader", icon: "TS", color: "#FF6B35", description: "Connect your TST account" },
    { id: "apex", name: "ApexTrader", icon: "AP", color: "#00D4AA", description: "Connect Apex account" },
    { id: "ftmo", name: "FTMO", icon: "F", color: "#7B68EE", description: "Connect FTMO account" },
  ];

  // Connect to prop firm API
  const connectToFirm = async (firmId) => {
    if (!apiCredentials.apiKey || !apiCredentials.apiSecret) {
      showToast("Please enter API Key and Secret", "error");
      return;
    }

    setSyncing(true);
    
    // Simulate API connection (in production, this would call the actual API)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For demo, simulate connected account with live data
    const firm = propFirms.find(f => f.id === firmId);
    const newConnection = {
      id: Date.now(),
      firmId: firm.id,
      firmName: firm.name,
      firmColor: firm.color,
      accountId: apiCredentials.accountId || "DEMO-001",
      apiKey: apiCredentials.apiKey.slice(0, 8) + "...",
      connected: true,
      lastSync: new Date(),
      // Simulated live data
      balance: 52150.00,
      equity: 52380.50,
      openPnl: 230.50,
      marginUsed: 850.00,
      marginAvailable: 4150.00,
      todayPnl: 350.00,
      todayTrades: 3,
      status: "active"
    };
    
    setConnectedAccounts([...connectedAccounts, newConnection]);
    setSyncing(false);
    setShowConnect(false);
    setApiCredentials({ apiKey: "", apiSecret: "", accountId: "" });
    setConnectingFirm(null);
    showToast(`Connected to ${firm.name}!`, "success");
    
    // Start simulating live position updates
    simulateLiveUpdates(newConnection.id);
  };

  // Simulate live position updates
  const simulateLiveUpdates = (connectionId) => {
    const interval = setInterval(() => {
      setConnectedAccounts(prev => prev.map(acc => {
        if (acc.id === connectionId) {
          const pnlChange = (Math.random() - 0.5) * 50;
          return {
            ...acc,
            openPnl: acc.openPnl + pnlChange,
            equity: acc.equity + pnlChange,
            balance: acc.balance + pnlChange * 0.8,
            lastSync: new Date()
          };
        }
        return acc;
      }));
    }, 3000);
    
    return () => clearInterval(interval);
  };

  // Sync account data
  const syncAccount = async (accountId) => {
    setSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setConnectedAccounts(prev => prev.map(acc => 
      acc.id === accountId ? { ...acc, lastSync: new Date() } : acc
    ));
    setSyncing(false);
    showToast("Account synced!", "success");
  };

  // Disconnect account
  const disconnectAccount = (accountId) => {
    setConnectedAccounts(prev => prev.filter(acc => acc.id !== accountId));
    showToast("Account disconnected", "info");
  };

  const addAccount = () => {
    if (!newAccount.firm || !newAccount.name) {
      showToast("Please fill in firm and account name", "error");
      return;
    }
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

  return (
    <div style={{ ...S.page, animation: "fadeIn 0.4s ease-out" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Prop Firm Hub</h1>
          <p style={{ fontSize: 13, color: C.textMuted }}>Connect your prop firm accounts for live tracking</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => setShowConnect(true)} style={S.btn("primary")}>
            <Zap size={16} /> Connect Account
          </button>
          <button onClick={() => setShowAdd(true)} style={S.btn("ghost")}>
            <Plus size={16} /> Manual Add
          </button>
        </div>
      </div>

      <div style={{ ...S.glassCard, marginBottom: 20, background: `linear-gradient(135deg, ${C.accent}12, ${C.purple}06)` }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Your All-In-One Command Center</h2>
        <p style={{ color: C.textMuted, marginBottom: 18 }}>
          Stop juggling spreadsheets. We've built everything you need to make smarter trading decisions.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ padding: 14, borderRadius: 12, background: "rgba(0,0,0,0.22)", border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Visualize Your Vitals</div>
            <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.6 }}>
              The main dashboard gives you a live, at-a-glance view of your most critical metrics. Instantly see your total payouts, overall expenses, true net profit, and pass rate across all firms.
            </div>
          </div>

          <div style={{ padding: 14, borderRadius: 12, background: "rgba(0,0,0,0.22)", border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Manage Subscriptions</div>
            <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.6 }}>
              Stay on top of your recurring trading costs. Effortlessly track monthly or yearly subscriptions for platforms, data feeds, and trading communities.
            </div>
          </div>

          <div style={{ padding: 14, borderRadius: 12, background: "rgba(0,0,0,0.22)", border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Analyze Your ROI</div>
            <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.6 }}>
              Go beyond simple tracking. Compare your total payouts against your costs for each firm, helping you identify which evaluations are worth your focus.
            </div>
          </div>

          <div style={{ padding: 14, borderRadius: 12, background: "rgba(0,0,0,0.22)", border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Effortless Bookkeeping</div>
            <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.6 }}>
              Stop dreading tax time. With a single click, generate a professional PDF report for any year summarizing your total payouts and expenses.
            </div>
          </div>
        </div>
      </div>

      {/* Connected Accounts Summary */}
      {connectedAccounts.length > 0 && (
        <>
          <div style={{ ...S.glassCard, marginBottom: 20, padding: 20, background: `linear-gradient(135deg, ${C.accent}10, ${C.purple}05)` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.green, animation: "livePulse 1.5s infinite" }} />
                Live Connected Accounts
              </h3>
              <button onClick={() => connectedAccounts.forEach(a => syncAccount(a.id))} disabled={syncing} style={{ ...S.btn("ghost", "sm") }}>
                <RefreshCw size={14} style={{ animation: syncing ? "spin 1s linear infinite" : "none" }} /> Sync All
              </button>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>TOTAL EQUITY</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: C.text }}>{fmtUsd(totalEquity)}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>OPEN P&L</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: totalOpenPnl >= 0 ? C.green : C.red }}>{fmt(totalOpenPnl)}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>TODAY'S P&L</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: totalTodayPnl >= 0 ? C.green : C.red }}>{fmt(totalTodayPnl)}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>ACCOUNTS</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: C.accent }}>{connectedAccounts.length}</div>
              </div>
            </div>
          </div>

          {/* Connected Account Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: 20, marginBottom: 24 }}>
            {connectedAccounts.map(account => (
              <div key={account.id} style={{ ...S.glassCard, borderTop: `3px solid ${account.firmColor}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ 
                        width: 32, height: 32, borderRadius: 8, 
                        background: account.firmColor, display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, fontWeight: 800, color: C.white 
                      }}>
                        {account.firmName.split(" ")[0][0]}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{account.firmName}</div>
                        <div style={{ fontSize: 11, color: C.textMuted }}>{account.accountId}</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, animation: "livePulse 1.5s infinite" }} />
                    <span style={{ fontSize: 11, color: C.green }}>Live</span>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <div style={{ padding: 12, background: "rgba(0,0,0,0.2)", borderRadius: 10, textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>EQUITY</div>
                    <div style={{ fontSize: 18, fontWeight: 800 }}>{fmtUsd(account.equity)}</div>
                  </div>
                  <div style={{ padding: 12, background: "rgba(0,0,0,0.2)", borderRadius: 10, textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>OPEN P&L</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: account.openPnl >= 0 ? C.green : C.red }}>{fmt(account.openPnl)}</div>
                  </div>
                  <div style={{ padding: 12, background: "rgba(0,0,0,0.2)", borderRadius: 10, textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>TODAY</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: account.todayPnl >= 0 ? C.green : C.red }}>{fmt(account.todayPnl)}</div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                  <div style={{ fontSize: 11 }}>
                    <span style={{ color: C.textMuted }}>Margin Used: </span>
                    <span style={{ fontWeight: 600 }}>{fmtUsd(account.marginUsed)}</span>
                  </div>
                  <div style={{ fontSize: 11 }}>
                    <span style={{ color: C.textMuted }}>Available: </span>
                    <span style={{ fontWeight: 600, color: C.green }}>{fmtUsd(account.marginAvailable)}</span>
                  </div>
                </div>

                <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 12 }}>
                  Last sync: {account.lastSync.toLocaleTimeString()}
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => syncAccount(account.id)} disabled={syncing} style={{ ...S.btn("ghost", "sm"), flex: 1 }}>
                    <RefreshCw size={12} /> Sync
                  </button>
                  <button onClick={() => disconnectAccount(account.id)} style={{ ...S.btn("danger", "sm") }}>
                    <X size={12} /> Disconnect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Manual Accounts Section */}
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Manual Accounts</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 20 }}>
        {propAccounts.length === 0 ? (
          <div style={{ ...S.glassCard, padding: 40, gridColumn: "1/-1", textAlign: "center" }}>
            <Briefcase size={40} color={C.textDim} style={{ opacity: 0.3, marginBottom: 12 }} />
            <p style={{ color: C.textMuted }}>No manual accounts. Connect via API for live tracking.</p>
          </div>
        ) : propAccounts.map(account => {
          const startingBalance = account.startingBalance || 50000;
          const profitProgress = ((account.balance - startingBalance) / (account.target - startingBalance)) * 100;

          return (
            <div key={account.id} style={S.glassCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", marginBottom: 4 }}>{account.firm}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>{account.name}</h3>
                </div>
                <span style={S.badge(account.status === "funded" ? C.green : C.yellow)}>
                  {account.status === "funded" ? "Funded" : "Challenge"}
                </span>
              </div>

              <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                <div>
                  <div style={S.label}>Balance</div>
                  <div style={{ fontSize: 20, fontWeight: 800 }}>{fmtUsd(account.balance)}</div>
                </div>
                <div>
                  <div style={S.label}>Target</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: C.green }}>{fmtUsd(account.target)}</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => updateBalance(account.id, 500)} style={{ ...S.btn("success", "sm"), flex: 1 }}>
                  <Plus size={12} /> +$500
                </button>
                <button onClick={() => updateBalance(account.id, -100)} style={{ ...S.btn("danger", "sm"), flex: 1 }}>
                  <TrendingDown size={12} /> -$100
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Connect Account Modal */}
      {showConnect && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 3000, backdropFilter: "blur(8px)"
        }}>
          <div style={{ ...S.glassCard, padding: 32, width: 500, maxWidth: "95vw" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700 }}>Connect Prop Firm</h3>
              <button onClick={() => { setShowConnect(false); setConnectingFirm(null); }} style={S.btn("ghost", "sm")}><X size={18} /></button>
            </div>

            {!connectingFirm ? (
              <>
                <p style={{ color: C.textMuted, marginBottom: 20 }}>Select a prop firm to connect:</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {propFirms.map(firm => (
                    <button 
                      key={firm.id}
                      onClick={() => setConnectingFirm(firm)}
                      style={{
                        display: "flex", alignItems: "center", gap: 16, padding: 16,
                        background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`,
                        borderRadius: 12, cursor: "pointer", transition: "all 0.2s"
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = firm.color}
                      onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
                    >
                      <div style={{ 
                        width: 48, height: 48, borderRadius: 12, 
                        background: firm.color, display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 16, fontWeight: 800, color: C.white 
                      }}>
                        {firm.icon}
                      </div>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{firm.name}</div>
                        <div style={{ fontSize: 12, color: C.textMuted }}>{firm.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, padding: 12, background: "rgba(0,0,0,0.3)", borderRadius: 12 }}>
                  <div style={{ 
                    width: 40, height: 40, borderRadius: 10, 
                    background: connectingFirm.color, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 800, color: C.white 
                  }}>
                    {connectingFirm.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{connectingFirm.name}</div>
                    <div style={{ fontSize: 12, color: C.textMuted }}>Enter your API credentials</div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={S.label}>API Key</label>
                    <input 
                      type="password" 
                      value={apiCredentials.apiKey} 
                      onChange={e => setApiCredentials({ ...apiCredentials, apiKey: e.target.value })}
                      style={S.input} 
                      placeholder="Enter your API key" 
                    />
                  </div>
                  <div>
                    <label style={S.label}>API Secret</label>
                    <input 
                      type="password" 
                      value={apiCredentials.apiSecret} 
                      onChange={e => setApiCredentials({ ...apiCredentials, apiSecret: e.target.value })}
                      style={S.input} 
                      placeholder="Enter your API secret" 
                    />
                  </div>
                  <div>
                    <label style={S.label}>Account ID (optional)</label>
                    <input 
                      value={apiCredentials.accountId} 
                      onChange={e => setApiCredentials({ ...apiCredentials, accountId: e.target.value })}
                      style={S.input} 
                      placeholder="Leave blank for default" 
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                  <button onClick={() => setConnectingFirm(null)} style={{ ...S.btn("ghost", "md"), flex: 1 }}>
                    <ChevronLeft size={16} /> Back
                  </button>
                  <button onClick={() => connectToFirm(connectingFirm.id)} disabled={syncing} style={{ ...S.btn("primary", "md"), flex: 1 }}>
                    {syncing ? (
                      <><RefreshCw size={14} style={{ animation: "spin 1s linear infinite" }} /> Connecting...</>
                    ) : (
                      <><Zap size={14} /> Connect</>
                    )}
                  </button>
                </div>

                <p style={{ fontSize: 11, color: C.textMuted, marginTop: 16, textAlign: "center" }}>
                  Your API credentials are encrypted and stored locally.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Add Manual Account Modal */}
      {showAdd && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 2000, backdropFilter: "blur(8px)"
        }}>
          <div style={{ ...S.glassCard, padding: 32, width: 440 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Add Manual Account</h3>
              <button onClick={() => setShowAdd(false)} style={S.btn("ghost", "sm")}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Select label="Firm" value={newAccount.firm} onChange={v => setNewAccount({ ...newAccount, firm: v })} options={PROP_FIRMS} />
              <div>
                <label style={S.label}>Account Name</label>
                <input value={newAccount.name} onChange={e => setNewAccount({ ...newAccount, name: e.target.value })} style={S.input} placeholder="My MNQ Account" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={S.label}>Current Balance ($)</label>
                  <input type="number" value={newAccount.balance} onChange={e => setNewAccount({ ...newAccount, balance: Number(e.target.value) })} style={S.input} />
                </div>
                <div>
                  <label style={S.label}>Target ($)</label>
                  <input type="number" value={newAccount.target} onChange={e => setNewAccount({ ...newAccount, target: Number(e.target.value) })} style={S.input} />
                </div>
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
    if (impact === "High") return C.red;
    if (impact === "Medium") return C.yellow;
    return C.green;
  };

  const getSentimentColor = (sentiment) => {
    if (sentiment === "bullish") return C.green;
    if (sentiment === "bearish") return C.red;
    return C.yellow;
  };

  const getSentimentBg = (sentiment) => {
    if (sentiment === "bullish") return `${C.green}15`;
    if (sentiment === "bearish") return `${C.red}15`;
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
                        <div style={{ fontSize: 12, fontWeight: 700, color: C.green }}>{event.actual}</div>
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
                  border: `1px solid ${isToday ? C.accent : hasHighImpact ? C.red : C.border}`
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
              <div style={{ width: 12, height: 12, borderRadius: 3, background: C.red }} />
              <span style={{ fontSize: 11, color: C.textDim }}>High Impact</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: C.yellow }} />
              <span style={{ fontSize: 11, color: C.textDim }}>Medium Impact</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: C.green }} />
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
              background: step > i ? `linear-gradient(135deg, ${C.green}, #059669)` : step === i ? `linear-gradient(135deg, ${C.gold}, ${C.yellow})` : "rgba(0,0,0,0.4)",
              color: C.white, fontWeight: 700, fontSize: 14,
              border: step === i ? "none" : `1px solid ${C.border}`,
              boxShadow: step === i ? `0 0 30px ${C.goldGlow}` : "none",
              transition: "all 0.4s ease"
            }}>
              {step > i ? <Check size={18} /> : i + 1}
            </div>
            <span style={{ fontSize: 14, fontWeight: step === i ? 700 : 500, color: step === i ? C.text : C.textDim }}>{label}</span>
            {i < 2 && <div style={{ width: 60, height: 2, background: step > i ? C.green : C.border, marginLeft: 12 }} />}
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

      {/* Step 1: Analysis */}
      {step === 1 && (
        <div style={{ ...S.glassCard, maxWidth: 680, margin: "0 auto" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
            <Eye size={22} color={C.accent} /> Market Analysis
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <Select label="Daily Bias" value={analysis.bias} onChange={v => setAnalysis({ ...analysis, bias: v })} options={["Bullish", "Bearish", "Neutral"]} />
            <Select label="HTF Orderflow" value={analysis.htf} onChange={v => setAnalysis({ ...analysis, htf: v })} options={["Bullish", "Bearish", "Neutral", "Bar Code"]} />
            <Select label="MMXM Model" value={analysis.mmxm} onChange={v => setAnalysis({ ...analysis, mmxm: v })} options={["MMBM", "MMSM"]} />
            <Select label="News Day?" value={analysis.newsDay} onChange={v => setAnalysis({ ...analysis, newsDay: v })} options={["NO", "YES", "FOMC", "NFP"]} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={S.label}>Pre-Market Notes</label>
            <textarea value={analysis.notes} onChange={e => setAnalysis({ ...analysis, notes: e.target.value })}
              style={{ ...S.input, minHeight: 100, resize: "vertical" }} placeholder="Key levels, confluences..." />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => setStep(0)} style={S.btn("ghost")}><ChevronLeft size={16} /> Back</button>
            <button onClick={() => setStep(2)} style={{ ...S.btn("primary"), flex: 1, justifyContent: "center" }}>
              Commit to Rules <Lock size={16} />
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
                background: rulesChecked[i] ? `${C.green}10` : "rgba(0,0,0,0.3)",
                border: `1px solid ${rulesChecked[i] ? C.greenBorder : C.border}`, cursor: "pointer"
              }}>
                <input type="checkbox" checked={rulesChecked[i]}
                  onChange={e => { const c = [...rulesChecked]; c[i] = e.target.checked; setRulesChecked(c); }}
                  style={{ width: 18, height: 18, accentColor: C.green, marginTop: 2 }} />
                <span style={{ fontSize: 13, color: rulesChecked[i] ? C.text : C.textMuted }}>{rule}</span>
              </label>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => setStep(1)} style={S.btn("ghost")}><ChevronLeft size={16} /> Back</button>
            <button disabled={!allRulesChecked} onClick={() => { onStartSession(analysis); setPage("trading-floor"); }}
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
                      {t.direction === "Long" ? <ArrowUpRight size={18} color={C.green} /> : <ArrowDownRight size={18} color={C.red} />}
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
                      <div><div style={S.label}>Mistake</div><div style={{ fontSize: 14, fontWeight: 600, color: t.mistake ? C.red : C.textMuted }}>{t.mistake || "None"}</div></div>
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
                        <select value={editData.grade || ""} onChange={e => setEditData({ ...editData, grade: e.target.value })} style={S.input}>
                          <option value="">Select...</option>
                          {SETUP_GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={S.label}>Entry Model</label>
                        <select value={editData.entryModel || ""} onChange={e => setEditData({ ...editData, entryModel: e.target.value })} style={S.input}>
                          <option value="">Select...</option>
                          {ENTRY_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={S.label}>Mistake (if any)</label>
                        <select value={editData.mistake || ""} onChange={e => setEditData({ ...editData, mistake: e.target.value })} style={S.input}>
                          <option value="">None</option>
                          {MISTAKES.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
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
  const insights = trades.length < 3 ? [
    { icon: Brain, title: "Need More Data", text: "Log at least 3 trades for AI insights.", color: C.gold }
  ] : (() => {
    const wins = trades.filter(t => t.pnl > 0);
    const losses = trades.filter(t => t.pnl < 0);
    const wr = (wins.length / trades.length) * 100;
    const avgWin = wins.length ? wins.reduce((s, t) => s + t.pnl, 0) / wins.length : 0;
    const avgLoss = losses.length ? Math.abs(losses.reduce((s, t) => s + t.pnl, 0) / losses.length) : 0;
    const rr = avgLoss > 0 ? (avgWin / avgLoss).toFixed(2) : "—";
    
    const results = [];

    // Win Rate Insight
    results.push({
      icon: Target, color: wr >= 50 ? C.green : C.red,
      title: wr >= 50 ? "Solid Win Rate" : "Win Rate Needs Work",
      text: `Your win rate is ${wr.toFixed(1)}%. ${wr >= 50 ? "Keep filtering for A+ setups." : "Focus on quality over quantity."}`
    });

    // Risk/Reward Insight
    results.push({
      icon: TrendingUp, color: Number(rr) >= 2 ? C.green : C.yellow,
      title: Number(rr) >= 2 ? "Good Risk/Reward" : "Improve R:R Ratio",
      text: `Average R:R is 1:${rr}. ${Number(rr) >= 2 ? "Great job letting winners run!" : "Try to target at least 1:2."}`
    });

    // Mistake Pattern
    const mistakeCount = {};
    trades.forEach(t => {
      if (t.mistake) mistakeCount[t.mistake] = (mistakeCount[t.mistake] || 0) + 1;
    });
    if (Object.keys(mistakeCount).length > 0) {
      const topMistake = Object.entries(mistakeCount).sort((a, b) => b[1] - a[1])[0];
      results.push({
        icon: AlertTriangle, color: C.orange,
        title: "Watch Out For",
        text: `"${topMistake[0]}" is your most common mistake (${topMistake[1]} times). Focus on avoiding this.`
      });
    }

    // Session Count
    const tradeDays = [...new Set(trades.map(t => t.date))].length;
    if (tradeDays > 0) {
      const avgTradesPerDay = (trades.length / tradeDays).toFixed(1);
      results.push({
        icon: Activity, color: Number(avgTradesPerDay) <= 2 ? C.green : C.yellow,
        title: "Trading Frequency",
        text: `You average ${avgTradesPerDay} trades per day. ${Number(avgTradesPerDay) <= 2 ? "Good discipline!" : "Consider being more selective."}`
      });
    }

    return results;
  })();

  return (
    <div style={{ ...S.page, animation: "fadeIn 0.4s ease-out" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>AI Coach</h1>
      <p style={{ color: C.textMuted, marginBottom: 28 }}>Data-driven insights from your trading journal.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {insights.map((ins, i) => (
          <div key={i} style={{ ...S.glassCard, borderLeft: `4px solid ${ins.color}` }}>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12, background: `${ins.color}15`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <ins.icon size={24} color={ins.color} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{ins.title}</h3>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6 }}>{ins.text}</p>
              </div>
            </div>
          </div>
        ))}
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
    { name: "Wins", value: trades.filter(t => t.pnl > 0).length, color: C.green },
    { name: "Losses", value: trades.filter(t => t.pnl < 0).length, color: C.red }
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
        <MiniStat icon={Target} label="Win Rate" value={`${stats.wr}%`} color={Number(stats.wr) >= 50 ? C.green : C.red} />
        <MiniStat icon={TrendingUp} label="Avg Win" value={fmt(stats.avgWin)} color={C.green} />
        <MiniStat icon={TrendingDown} label="Avg Loss" value={fmt(-stats.avgLoss)} color={C.red} />
        <MiniStat icon={Award} label="Best Trade" value={fmt(stats.best)} color={C.gold} />
        <MiniStat icon={AlertTriangle} label="Worst Trade" value={fmt(stats.worst)} color={C.red} />
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
              <div style={{ width: 12, height: 12, borderRadius: 3, background: C.green }} />
              <span style={{ fontSize: 13, color: C.textMuted }}>Wins ({winLossData[0].value})</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: C.red }} />
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
                <Cell key={i} fill={entry.pnl >= 0 ? C.green : C.red} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
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
          <p style={{ color: C.textMuted, marginBottom: 18, fontSize: 13 }}>Restore from a JSON backup file.</p>
          <label style={{ ...S.btn("glass"), cursor: "pointer" }}>
            <Upload size={16} /> Choose Backup File
            <input type="file" accept=".json" onChange={importJSON} style={{ display: "none" }} />
          </label>
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
      }
    } catch (e) {}
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("87capital_v4", JSON.stringify({ trades, session, propAccounts, spiritualMode, dailyGoal, weeklyGoal, monthlyGoal, dailyLossLimit }));
  }, [trades, session, propAccounts, spiritualMode, dailyGoal, weeklyGoal, monthlyGoal, dailyLossLimit]);

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
      case "dashboard": return <CommandCenterPage trades={trades} session={session} propAccounts={propAccounts} setPage={setPage} dailyGoal={dailyGoal} weeklyGoal={weeklyGoal} monthlyGoal={monthlyGoal} dailyLossLimit={dailyLossLimit} />;
      case "prop-firms": return <PropFirmsPage propAccounts={propAccounts} setPropAccounts={setPropAccounts} showToast={showToast} />;
      case "news": return <NewsPage showToast={showToast} />;
      case "presession": return <PreSessionPage onStartSession={onStartSession} setPage={setPage} spiritualMode={spiritualMode} />;
      case "postsession": return <PostSessionPage setPage={setPage} showToast={showToast} trades={trades} onAddTrade={onAddTrade} spiritualMode={spiritualMode} />;
      case "journal": return <JournalPage trades={trades} onDeleteTrade={onDeleteTrade} onUpdateTrade={onUpdateTrade} showToast={showToast} />;
      case "analytics": return <AnalyticsPage trades={trades} />;
      case "ai": return <AICoachPage trades={trades} />;
      case "settings": return <SettingsPage trades={trades} setTrades={setTrades} propAccounts={propAccounts} showToast={showToast} spiritualMode={spiritualMode} setSpiritualMode={setSpiritualMode} dailyGoal={dailyGoal} setDailyGoal={setDailyGoal} weeklyGoal={weeklyGoal} setWeeklyGoal={setWeeklyGoal} monthlyGoal={monthlyGoal} setMonthlyGoal={setMonthlyGoal} dailyLossLimit={dailyLossLimit} setDailyLossLimit={setDailyLossLimit} />;
      default: return <CommandCenterPage trades={trades} session={session} propAccounts={propAccounts} setPage={setPage} dailyGoal={dailyGoal} weeklyGoal={weeklyGoal} monthlyGoal={monthlyGoal} dailyLossLimit={dailyLossLimit} />;
    }
  };

  return (
    <div style={{
      background: C.bg, color: C.text, fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif", minHeight: "100vh",
      backgroundImage: `radial-gradient(circle at 0% 0%, ${C.accentGlow} 0%, transparent 50%), radial-gradient(circle at 100% 100%, ${C.purpleGlow} 0%, transparent 50%)`
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
