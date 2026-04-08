import { useState, useEffect, useRef } from "react";
import {
  BarChart3, Calendar, BookOpen, Target, FileText, TrendingUp, TrendingDown,
  DollarSign, Activity, Brain, Shield, Settings, Play, Square, Edit3,
  Calculator, Quote, Timer, Zap, AlertTriangle, CheckCircle, Building,
  LayoutDashboard, Radio, Clock, Eye, X, Plus, ChevronRight, ChevronLeft,
  Sun, ArrowUpRight, ArrowDownRight, Search, Trash2, Bell, Check, Lock,
  Briefcase, Globe, Star, Coffee, Flame, Crosshair, Camera, Save,
  ExternalLink, RefreshCw, Gauge, Award, MessageSquare, Send, CreditCard,
  Download, Upload, Sparkles, PieChart, TrendingUp as TrendingIcon, Filter, EyeOff
} from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart as RePieChart, Pie, Cell, BarChart, Bar,
  Legend
} from "recharts";

// ─── THEME & CONSTANTS ──────────────────────────────────────────────────────
// Original V4 Theme: Dark Purple/Indigo
const C = {
  bg: "#030712",
  bgCard: "rgba(17, 24, 39, 0.8)",
  bgCardAlt: "rgba(31, 41, 55, 0.6)",
  border: "rgba(255, 255, 255, 0.08)",
  borderLight: "rgba(255, 255, 255, 0.15)",
  // Primary Indigo/Purple
  accent: "#6366f1",
  accentLight: "#818cf8",
  accentGlow: "rgba(99, 102, 241, 0.25)",
  purple: "#a855f7",
  purpleGlow: "rgba(139, 92, 246, 0.2)",
  // Gold (kept for special accents)
  gold: "#fbbf24",
  goldLight: "#fcd34d",
  goldBg: "rgba(251, 191, 36, 0.08)",
  goldBorder: "rgba(251, 191, 36, 0.2)",
  goldGlow: "rgba(251, 191, 36, 0.25)",
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

const TICKERS = ["MNQ", "NQ", "MES", "ES", "CL", "GC", "RTY"];
const TRADE_DIRECTION = ["Long", "Short"];
const SETUP_GRADES = ["A+", "A", "B+", "B", "C", "F"];
const ENTRY_MODELS = ["ICT Silver Bullet", "FVG", "OB", "Breaker Block", "Liquidity Sweep", "Order Flow", "Smart Money"];
const TOI_MACRO = ["Bullish", "Bearish", "Neutral", "Chop", "Trending"];
const SMT_DIVERGENCE = ["None", "Bullish", "Bearish"];
const MISTAKES = ["Overtrading", "Moved Stop", "FOMO Entry", "No Setup", "Early Exit", "Late Entry", "Wrong Size", "Revenge Trade", "Ignored Plan", "No Patience", "Ignored HTF", "Chased"];
const LIQUIDITY_TARGETS = ["PDH", "PDL", "PCH", "PCL", "PWH", "PWL", "NYAM LOW", "NYAM HIGH", "LONDON LOW", "LONDON HIGH", "EQ LEVEL"];
const NEWS_IMPACT = ["Low", "Medium", "High"];
const PROP_FIRMS = ["TopStepTrader", "ApexTrader", "ApexFutures", "MyFundedFX", "FTMO", "Blue Guardian", "Lux Trading", "The Funded Trader"];

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

// ─── STYLES ─────────────────────────────────────────────────────────────────
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
    fontFamily: "Inter, sans-serif"
  },
  btn: (variant = "primary", size = "md") => {
    const sizes = {
      xs: { padding: "4px 10px", fontSize: 11 },
      sm: { padding: "6px 14px", fontSize: 12 },
      md: { padding: "10px 20px", fontSize: 13 },
      lg: { padding: "14px 28px", fontSize: 15 }
    };
    const variants = {
      primary: { background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`, border: "none", boxShadow: `0 4px 20px ${C.accentGlow}`, color: C.white },
      success: { background: `linear-gradient(135deg, ${C.green}, #059669)`, border: "none", color: C.white },
      danger: { background: `linear-gradient(135deg, ${C.red}, #dc2626)`, border: "none", color: C.white },
      warning: { background: `linear-gradient(135deg, ${C.yellow}, #d97706)`, border: "none", color: C.white },
      ghost: { background: "transparent", border: `1px solid ${C.border}`, color: C.text },
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
    boxShadow: glow ? `0 0 12px ${color}40` : "none"
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
  page: { padding: 24 }
};

// ─── UTILITIES ───────────────────────────────────────────────────────────────
const fmt = (n) => (n >= 0 ? "+" : "") + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtUsd = (n) => "$" + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pnlColor = (n) => n >= 0 ? C.green : C.red;
const pnlBg = (n) => n >= 0 ? C.greenBg : C.redBg;
const today = () => new Date().toISOString().split("T")[0];
const gradeColor = (g) => g === "A+" || g === "A" ? C.green : g === "B+" || g === "B" ? C.yellow : C.red;
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

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

// ─── SIDEBAR ────────────────────────────────────────────────────────────────
function Sidebar({ page, setPage, session }) {
  // Main quick actions - order: Dashboard, Pre-Session, Active Session
  const quickActions = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "presession", icon: Sun, label: "Pre-Session" },
    { id: "trading-floor", icon: Zap, label: "Active Session" },
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
      width: 240, height: "calc(100vh - 60px)", position: "fixed", top: 60, left: 0,
      background: `linear-gradient(180deg, ${C.bgCard} 0%, rgba(3,7,18,0.95) 100%)`,
      backdropFilter: "blur(20px)", borderRight: `1px solid ${C.border}`,
      display: "flex", flexDirection: "column", padding: "16px 0", overflowY: "auto"
    }}>
      {/* Quick Actions - Always Visible */}
      <div style={{ padding: "0 12px", marginBottom: 8 }}>
        {quickActions.map(item => {
          const active = page === item.id;
          const isActiveSession = item.id === "trading-floor" && session.active;
          return (
            <button key={item.id} onClick={() => setPage(item.id)} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
              width: "100%", border: "none", cursor: "pointer", fontFamily: "Inter",
              background: isActiveSession ? `linear-gradient(90deg, ${C.green}20, transparent)` : 
                           active ? `linear-gradient(90deg, ${C.accent}20, transparent)` : "transparent",
              color: isActiveSession ? C.green : active ? C.accentLight : C.textMuted,
              fontWeight: isActiveSession || active ? 700 : 500, fontSize: 13,
              borderLeft: isActiveSession ? `3px solid ${C.green}` : active ? `3px solid ${C.accent}` : "3px solid transparent",
              transition: "all 0.2s ease", textAlign: "left",
              borderRadius: 8, marginBottom: 4
            }}>
              <item.icon size={18} color={isActiveSession ? C.green : active ? C.accent : C.textDim} />
              {item.label}
              {isActiveSession && (
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
    </div>
  );
}

// ─── ACTIVE SESSION PAGE ────────────────────────────────────────────────────
function TradingFloorPage({ session, onAddTrade, setPage, showToast, trades }) {
  const [symbol, setSymbol] = useState("MNQ");
  const [direction, setDirection] = useState("Long");
  const [entryModel, setEntryModel] = useState("");
  const [setupGrade, setSetupGrade] = useState("");
  const [entryPrice, setEntryPrice] = useState("");
  const [exitPrice, setExitPrice] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [pnl, setPnl] = useState("");
  const [toiMacro, setToiMacro] = useState("");
  const [contracts, setContracts] = useState(1);
  const [smtDivergence, setSmtDivergence] = useState("None");
  const [liqTargets, setLiqTargets] = useState([]);
  const [mistake, setMistake] = useState("");
  const [notes, setNotes] = useState("");

  const toggleLiqTarget = (target) => {
    setLiqTargets(prev => 
      prev.includes(target) ? prev.filter(t => t !== target) : [...prev, target]
    );
  };

  const submitTrade = () => {
    const pnlVal = parseFloat(pnl);
    
    if (pnl === "" || isNaN(pnlVal)) {
      showToast("Please enter P&L amount", "error");
      return;
    }
    
    onAddTrade({
      date: today(), ticker: symbol, direction, contracts, pnl: pnlVal, 
      entryModel, setupGrade, entryPrice, exitPrice, stopLoss,
      toiMacro, smtDivergence, liqTargets, mistake, notes
    });
    // Reset form
    setPnl("");
    setEntryModel("");
    setSetupGrade("");
    setEntryPrice("");
    setExitPrice("");
    setStopLoss("");
    setToiMacro("");
    setSmtDivergence("None");
    setLiqTargets([]);
    setMistake("");
    setNotes("");
    showToast("Trade logged!", "success");
  };

  // Get today's trades
  const todayTrades = trades.filter(t => t.date === today());
  const sessionStats = {
    total: todayTrades.reduce((s, t) => s + t.pnl, 0),
    wins: todayTrades.filter(t => t.pnl > 0).length,
    losses: todayTrades.filter(t => t.pnl < 0).length,
    wr: todayTrades.length ? ((todayTrades.filter(t => t.pnl > 0).length / todayTrades.length) * 100).toFixed(0) : 0
  };

  return (
    <div style={{ ...S.page, animation: "fadeIn 0.4s ease-out" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, display: "flex", alignItems: "center", gap: 12 }}>
            Active Session
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

      {/* Live Market Ticker */}
      <div style={{ ...S.glassCard, marginBottom: 24 }}>
        <LiveMarketTicker />
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Left: Trade Log Form */}
        <div style={S.glassCard}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
            <Calculator size={20} color={C.accent} /> Log Trade
          </h3>

          {/* Row 1: Ticker, Direction */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div>
              <label style={S.label}>Ticker</label>
              <select value={symbol} onChange={e => setSymbol(e.target.value)} style={{ ...S.input, cursor: "pointer", appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 36 }}>
                {TICKERS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={S.label}>Direction</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <button onClick={() => setDirection("Long")} style={{
                  padding: "10px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 12,
                  background: direction === "Long" ? `linear-gradient(135deg, ${C.green}, #059669)` : "rgba(0,0,0,0.3)",
                  color: direction === "Long" ? C.white : C.textMuted,
                  border: `1px solid ${direction === "Long" ? C.green : C.border}`
                }}>Long</button>
                <button onClick={() => setDirection("Short")} style={{
                  padding: "10px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 12,
                  background: direction === "Short" ? `linear-gradient(135deg, ${C.red}, #dc2626)` : "rgba(0,0,0,0.3)",
                  color: direction === "Short" ? C.white : C.textMuted,
                  border: `1px solid ${direction === "Short" ? C.red : C.border}`
                }}>Short</button>
              </div>
            </div>
          </div>

          {/* Row 2: Entry Model, Setup Grade */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div>
              <label style={S.label}>Entry Model</label>
              <select value={entryModel} onChange={e => setEntryModel(e.target.value)} style={S.input}>
                <option value="">Select...</option>
                {ENTRY_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label style={S.label}>Setup Grade</label>
              <select value={setupGrade} onChange={e => setSetupGrade(e.target.value)} style={S.input}>
                <option value="">Select...</option>
                {SETUP_GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          {/* Row 3: Entry Price, Exit Price, Stop Loss */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div>
              <label style={S.label}>Entry Price</label>
              <input type="number" value={entryPrice} onChange={e => setEntryPrice(e.target.value)} style={S.input} placeholder="0.00" step="0.25" />
            </div>
            <div>
              <label style={S.label}>Exit Price</label>
              <input type="number" value={exitPrice} onChange={e => setExitPrice(e.target.value)} style={S.input} placeholder="0.00" step="0.25" />
            </div>
            <div>
              <label style={S.label}>Stop Loss</label>
              <input type="number" value={stopLoss} onChange={e => setStopLoss(e.target.value)} style={S.input} placeholder="0.00" step="0.25" />
            </div>
          </div>

          {/* Row 4: P&L, TOI/Macro */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div>
              <label style={S.label}>P&L ($)</label>
              <input type="number" value={pnl} onChange={e => setPnl(e.target.value)} style={{
                ...S.input, fontWeight: 700,
                color: pnl && !isNaN(parseFloat(pnl)) ? (parseFloat(pnl) >= 0 ? C.green : C.red) : C.text
              }} placeholder="+/- amount" />
            </div>
            <div>
              <label style={S.label}>TOI / Macro</label>
              <select value={toiMacro} onChange={e => setToiMacro(e.target.value)} style={S.input}>
                <option value="">Select...</option>
                {TOI_MACRO.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          {/* Row 5: Contracts, SMT Divergence */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div>
              <label style={S.label}>Contracts</label>
              <input type="number" value={contracts} onChange={e => setContracts(Number(e.target.value))} style={S.input} min="1" />
            </div>
            <div>
              <label style={S.label}>SMT Divergence</label>
              <select value={smtDivergence} onChange={e => setSmtDivergence(e.target.value)} style={S.input}>
                {SMT_DIVERGENCE.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          {/* Liquidity Targets */}
          <div style={{ marginBottom: 14 }}>
            <label style={S.label}>Liquidity Targets</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {LIQUIDITY_TARGETS.map(target => (
                <button key={target} onClick={() => toggleLiqTarget(target)} style={{
                  padding: "6px 10px", borderRadius: 8, fontSize: 10, fontWeight: 600, cursor: "pointer",
                  background: liqTargets.includes(target) ? `${C.accent}25` : "rgba(0,0,0,0.3)",
                  color: liqTargets.includes(target) ? C.accentLight : C.textDim,
                  border: `1px solid ${liqTargets.includes(target) ? C.accent : C.border}`,
                  transition: "all 0.2s"
                }}>
                  {target}
                </button>
              ))}
            </div>
          </div>

          {/* Mistakes */}
          <div style={{ marginBottom: 14 }}>
            <label style={S.label}>Mistakes (if any)</label>
            <select value={mistake} onChange={e => setMistake(e.target.value)} style={S.input}>
              <option value="">None</option>
              {MISTAKES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 16 }}>
            <label style={S.label}>Trade Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} style={{ ...S.input, minHeight: 60, resize: "vertical" }} placeholder="What did you observe?" />
          </div>

          {/* Screenshot Upload */}
          <div style={{ marginBottom: 16 }}>
            <label style={S.label}>Screenshot</label>
            <label style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "16px", borderRadius: 12, border: `2px dashed ${C.border}`,
              cursor: "pointer", color: C.textMuted, transition: "all 0.2s",
              background: "rgba(0,0,0,0.2)"
            }}>
              <Camera size={20} />
              <span style={{ fontSize: 13 }}>Click to upload chart screenshot</span>
              <input type="file" accept="image/*" style={{ display: "none" }} />
            </label>
          </div>

          <button onClick={submitTrade} style={{ ...S.btn("primary", "lg"), width: "100%", justifyContent: "center" }}>
            <Save size={16} /> Log Trade
          </button>
        </div>

        {/* Right: Stats & Today's Trades */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Session Stats */}
          {session.active && (
            <div style={S.glassCard}>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Session Stats</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                <div style={{ textAlign: "center", padding: 12, background: "rgba(0,0,0,0.2)", borderRadius: 10 }}>
                  <div style={{ fontSize: 10, color: C.textDim, marginBottom: 4 }}>Trades</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: C.text }}>{session.trades}/2</div>
                </div>
                <div style={{ textAlign: "center", padding: 12, background: "rgba(0,0,0,0.2)", borderRadius: 10 }}>
                  <div style={{ fontSize: 10, color: C.textDim, marginBottom: 4 }}>P&L</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: pnlColor(sessionStats.total) }}>{fmt(sessionStats.total)}</div>
                </div>
                <div style={{ textAlign: "center", padding: 12, background: "rgba(0,0,0,0.2)", borderRadius: 10 }}>
                  <div style={{ fontSize: 10, color: C.textDim, marginBottom: 4 }}>Win Rate</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: Number(sessionStats.wr) >= 50 ? C.green : C.red }}>{sessionStats.wr}%</div>
                </div>
                <div style={{ textAlign: "center", padding: 12, background: "rgba(0,0,0,0.2)", borderRadius: 10 }}>
                  <div style={{ fontSize: 10, color: C.textDim, marginBottom: 4 }}>Bias</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.accent }}>{session.analysis?.bias || "—"}</div>
                </div>
              </div>
            </div>
          )}

          {/* Today's Trades */}
          <div style={S.glassCard}>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Today's Trades</h4>
            {todayTrades.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: C.textDim }}>
                <TrendingUp size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                <p>No trades logged today</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {todayTrades.slice().reverse().map((t, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "12px 14px", borderRadius: 10, background: "rgba(0,0,0,0.2)",
                    border: `1px solid ${C.border}`
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: pnlBg(t.pnl),
                        display: "flex", alignItems: "center", justifyContent: "center"
                      }}>
                        {t.direction === "Long" ? <ArrowUpRight size={16} color={C.green} /> : <ArrowDownRight size={16} color={C.red} />}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{t.ticker}</div>
                        <div style={{ fontSize: 11, color: C.textDim }}>{t.direction}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 800, color: pnlColor(t.pnl) }}>{fmt(t.pnl)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
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
function CommandCenterPage({ trades, session, propAccounts, setPage }) {
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

  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

  return (
    <div style={{ ...S.page, animation: "fadeIn 0.4s ease-out" }}>
      {/* Live Market Ticker */}
      <div style={{ ...S.glassCard, marginBottom: 24, padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, animation: "livePulse 1.5s infinite" }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Live Futures</span>
        </div>
        <LiveMarketTicker />
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
          <WinStreakBadge streak={stats.streak} />
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

      {/* Stats */}
      <div style={S.grid(4, 16)}>
        <MiniStat icon={DollarSign} label="Total P&L" value={fmt(stats.total)} color={pnlColor(stats.total)} />
        <MiniStat icon={Target} label="Win Rate" value={`${stats.wr}%`} color={Number(stats.wr) >= 50 ? C.green : C.red} />
        <MiniStat icon={Flame} label="Win Streak" value={`${stats.streak} Days`} color={C.gold} />
        <MiniStat icon={Briefcase} label="Prop Balance" value={fmtUsd(propAccounts.reduce((s, a) => s + a.balance, 0))} color={C.purple} />
      </div>

      {/* Main Content */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginTop: 24 }}>
        {/* Recent Trades */}
        <div style={S.glassCard}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Recent Trades</h3>
            <button onClick={() => setPage("journal")} style={S.btn("ghost", "sm")}>View All</button>
          </div>
          {trades.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: C.textDim }}>
              <TrendingUp size={40} style={{ opacity: 0.2, marginBottom: 12 }} />
              <p>No trades yet. Start a session!</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {trades.slice(-5).reverse().map((t, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px 16px", borderRadius: 12, background: "rgba(0,0,0,0.2)", border: `1px solid ${C.border}`
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: pnlBg(t.pnl), display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {t.direction === "Long" ? <ArrowUpRight size={18} color={C.green} /> : <ArrowDownRight size={18} color={C.red} />}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{t.ticker} — {t.direction}</div>
                      <div style={{ fontSize: 12, color: C.textDim }}>{t.date}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 800, color: pnlColor(t.pnl) }}>{fmt(t.pnl)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <ZenQuote />
          <div style={S.glassCard}>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Quick Actions</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button onClick={() => setPage("trading-floor")} style={{ ...S.btn("glass", "md"), justifyContent: "flex-start" }}>
                <TrendingUp size={16} /> Open Charts
              </button>
              <button onClick={() => setPage("prop-firms")} style={{ ...S.btn("glass", "md"), justifyContent: "flex-start" }}>
                <Briefcase size={16} /> Check Prop Accounts
              </button>
              <button onClick={() => setPage("news")} style={{ ...S.btn("glass", "md"), justifyContent: "flex-start" }}>
                <Globe size={16} /> View News
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PROP FIRMS PAGE ─────────────────────────────────────────────────────────
function PropFirmsPage({ propAccounts, setPropAccounts, showToast }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newAccount, setNewAccount] = useState({ firm: "", name: "", balance: 50000, target: 55000, dailyLossLimit: 1000 });

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

  return (
    <div style={{ ...S.page, animation: "fadeIn 0.4s ease-out" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Prop Firm Tracker</h1>
          <p style={{ fontSize: 13, color: C.textMuted }}>Track your funded accounts and progress</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={S.btn("primary")}>
          <Plus size={16} /> Add Account
        </button>
      </div>

      {/* Summary */}
      <div style={S.grid(4, 16)}>
        <MiniStat icon={Briefcase} label="Total Accounts" value={propAccounts.length} color={C.gold} />
        <MiniStat icon={DollarSign} label="Total Balance" value={fmtUsd(propAccounts.reduce((s, a) => s + a.balance, 0))} color={C.green} />
        <MiniStat icon={TrendingUp} label="Total Profit" value={fmtUsd(propAccounts.reduce((s, a) => s + (a.balance - a.startingBalance || a.balance - 50000), 0))} color={C.gold} />
        <MiniStat icon={Shield} label="Active Challenges" value={propAccounts.filter(a => a.status === "challenge").length} color={C.purple} />
      </div>

      {/* Account Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 20, marginTop: 24 }}>
        {propAccounts.length === 0 ? (
          <div style={{ ...S.glassCard, padding: 60, gridColumn: "1/-1", textAlign: "center" }}>
            <Briefcase size={48} color={C.textDim} style={{ opacity: 0.3, marginBottom: 16 }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No Accounts Yet</h3>
            <p style={{ color: C.textMuted, marginBottom: 20 }}>Add your first funded account to start tracking.</p>
            <button onClick={() => setShowAdd(true)} style={S.btn("primary")}>
              <Plus size={16} /> Add Account
            </button>
          </div>
        ) : propAccounts.map(account => {
          const startingBalance = account.startingBalance || 50000;
          const profitProgress = ((account.balance - startingBalance) / (account.target - startingBalance)) * 100;
          const ddUsed = ((account.dailyLossLimit - (account.balance * 0.1)) / account.dailyLossLimit) * 100;
          const isDanger = ddUsed > 70;

          return (
            <div key={account.id} style={S.glassCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 10, color: C.textDim, textTransform: "uppercase", marginBottom: 4 }}>{account.firm}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700 }}>{account.name}</h3>
                </div>
                <span style={S.badge(account.status === "funded" ? C.green : C.yellow)}>
                  {account.status === "funded" ? "Funded" : "Challenge"}
                </span>
              </div>

              <div style={{ display: "flex", gap: 20, marginBottom: 16 }}>
                <div>
                  <div style={S.label}>Balance</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: C.text }}>{fmtUsd(account.balance)}</div>
                </div>
                <div>
                  <div style={S.label}>Target</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: C.green }}>{fmtUsd(account.target)}</div>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <ProgressBar value={account.balance} max={account.target} color={C.green} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div style={{ padding: 12, background: "rgba(0,0,0,0.2)", borderRadius: 10, textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: C.textDim, marginBottom: 4 }}>Profit</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: account.balance > startingBalance ? C.green : C.red }}>
                    {fmt(account.balance - startingBalance)}
                  </div>
                </div>
                <div style={{ padding: 12, background: "rgba(0,0,0,0.2)", borderRadius: 10, textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: C.textDim, marginBottom: 4 }}>Progress</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.gold }}>{profitProgress.toFixed(1)}%</div>
                </div>
                <div style={{ padding: 12, background: "rgba(0,0,0,0.2)", borderRadius: 10, textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: C.textDim, marginBottom: 4 }}>DD Left</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: isDanger ? C.red : C.yellow }}>
                    {Math.max(0, 100 - ddUsed).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => updateBalance(account.id, 500)} style={{ ...S.btn("success", "sm"), flex: 1 }}>
                  <Plus size={12} /> Profit
                </button>
                <button onClick={() => updateBalance(account.id, -100)} style={{ ...S.btn("danger", "sm"), flex: 1 }}>
                  <TrendingDown size={12} /> DD
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Account Modal */}
      {showAdd && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 2000, backdropFilter: "blur(8px)"
        }}>
          <div style={{ ...S.glassCard, padding: 32, width: 440 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Add Prop Account</h3>
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

  const newsEvents = [
    { time: "08:30", currency: "USD", event: "Core CPI", impact: "High", previous: "0.3%", forecast: "0.2%" },
    { time: "10:00", currency: "USD", event: "ISM Manufacturing PMI", impact: "High", previous: "46.8", forecast: "48.5" },
    { time: "14:00", currency: "USD", event: "FOMC Meeting Minutes", impact: "Medium", previous: "—", forecast: "—" },
    { time: "15:00", currency: "EUR", event: "ECB President Speech", impact: "Medium", previous: "—", forecast: "—" },
  ];

  const getImpactColor = (impact) => {
    if (impact === "High") return C.red;
    if (impact === "Medium") return C.yellow;
    return C.green;
  };

  return (
    <div style={{ ...S.page, animation: "fadeIn 0.4s ease-out" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>News Calendar</h1>
          <p style={{ fontSize: 13, color: C.textMuted }}>High-impact events that affect your trades</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: C.textMuted }}>Auto-block on High Impact</span>
          <button onClick={() => setNewsBlocked(!newsBlocked)} style={{
            width: 56, height: 30, borderRadius: 15, cursor: "pointer",
            background: newsBlocked ? C.green : C.bgCard,
            border: `1px solid ${newsBlocked ? C.green : C.border}`,
            display: "flex", alignItems: "center", padding: 4,
            transition: "all 0.2s"
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: "50%", background: C.white,
              transition: "transform 0.2s",
              transform: newsBlocked ? "translateX(26px)" : "translateX(0)"
            }} />
          </button>
        </div>
      </div>

      {/* Notification Toggle */}
      <div style={{ ...S.glassCard, marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>News Alerts</h4>
          <p style={{ fontSize: 12, color: C.textMuted, margin: 0 }}>Get notified 15 minutes before high-impact events</p>
        </div>
        <button onClick={enableNotifications} style={{
          ...S.btn(notificationsEnabled ? "success" : "ghost", "sm"),
          cursor: notificationsEnabled ? "default" : "pointer"
        }}>
          <Bell size={14} />
          {notificationsEnabled ? "Enabled" : "Enable Alerts"}
        </button>
      </div>

      {/* Weekly Overview */}
      <div style={{ ...S.glassCard, marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>This Week</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
          {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, i) => (
            <div key={day} style={{
              padding: 16, borderRadius: 12, textAlign: "center",
              background: i === 2 ? `${C.red}15` : "rgba(0,0,0,0.2)",
              border: `1px solid ${i === 2 ? C.red : C.border}`
            }}>
              <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>{day}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: i === 2 ? C.red : C.text }}>
                {i === 2 ? 3 : i === 3 ? 2 : 0}
              </div>
              <div style={{ fontSize: 10, color: C.textDim }}>high impact</div>
            </div>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div style={S.glassCard}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Today's Events</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {newsEvents.map((event, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 16, padding: 14, borderRadius: 12,
              background: "rgba(0,0,0,0.2)", border: `1px solid ${C.border}`
            }}>
              <div style={{
                width: 56, textAlign: "center",
                padding: "8px 0", borderRadius: 10,
                background: `${getImpactColor(event.impact)}15`,
                border: `1px solid ${getImpactColor(event.impact)}30`
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{event.time}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{event.event}</div>
                <div style={{ fontSize: 12, color: C.textMuted }}>{event.currency}</div>
              </div>
              <span style={S.badge(getImpactColor(event.impact))}>{event.impact}</span>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: C.textDim }}>Previous: {event.previous}</div>
                <div style={{ fontSize: 11, color: C.textDim }}>Forecast: {event.forecast}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PRE-SESSION PAGE ───────────────────────────────────────────────────────
function PreSessionPage({ onStartSession, setPage }) {
  const [step, setStep] = useState(0);
  const [ardasDone, setArdasDone] = useState(false);
  const [analysis, setAnalysis] = useState({ bias: "", htf: "", mmxm: "", newsDay: "", notes: "" });
  const [rulesChecked, setRulesChecked] = useState(TRADING_RULES.map(() => false));

  const allRulesChecked = rulesChecked.every(Boolean);
  const steps = ["Ardas", "Analysis", "Commit"];

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

      {/* Step 0: Ardas */}
      {step === 0 && (
        <div style={{ ...S.glassCard, maxWidth: 580, margin: "0 auto", textAlign: "center", boxShadow: `0 0 60px ${C.goldBg}`, border: `1px solid ${C.goldBorder}` }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.gold}20, ${C.yellow}10)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px", animation: "float 3s ease-in-out infinite"
          }}>
            <Sun size={40} color={C.gold} />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Begin With Ardas</h2>
          <p style={{ color: C.textMuted, lineHeight: 1.8, marginBottom: 24 }}>
            Take a moment of stillness. Recite your Ardas, clear your mind, and surrender the outcome to Waheguru.
          </p>
          <div style={{
            padding: 20, borderRadius: 14, background: C.goldBg, border: `1px solid ${C.goldBorder}`,
            marginBottom: 24, fontStyle: "italic", color: C.textMuted
          }}>
            "Dhan Guru Nanak, Dhan Guru Nanak..."<br />
            Focus your mind. Release attachment to profit or loss.
          </div>
          <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, cursor: "pointer", marginBottom: 24 }}>
            <input type="checkbox" checked={ardasDone} onChange={e => setArdasDone(e.target.checked)}
              style={{ width: 20, height: 20, accentColor: C.gold, cursor: "pointer" }} />
            <span style={{ fontWeight: 600 }}>I have completed my Ardas</span>
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
            <Eye size={22} color={C.gold} /> Market Analysis
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
            <Shield size={22} color={C.gold} /> Rule Commitment
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
function SettingsPage({ trades, setTrades, propAccounts, showToast }) {
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
  const [toast, setToast] = useState(null);
  const [lastSessionData, setLastSessionData] = useState(null);
  const [showSessionSummary, setShowSessionSummary] = useState(false);
  const [newsAlert, setNewsAlert] = useState(null);

  // Simulated Trump News Alerts
  const trumpAlerts = [
    { source: "TRUTH Social", message: "Big tariff announcement coming tomorrow. Get ready!", link: "https://truthsocial.com" },
    { source: "TRUMP", message: "Markets will be GREAT again! Fed should cut rates NOW.", link: "https://truthsocial.com" },
    { source: "X - @realDonaldTrump", message: "China trade deal is dead. New tariffs incoming!", link: "https://x.com/realDonaldTrump" },
    { source: "BREAKING - Trump", message: "Just spoke with Xi. Big announcement coming this week!", link: "https://truthsocial.com" },
    { source: "TRUTH Social", message: "The Fed is our enemy. Interest rates should be ZERO!", link: "https://truthsocial.com" }
  ];

  // Show random news alert every 2-5 minutes (simulated)
  useEffect(() => {
    const showAlert = () => {
      if (!newsAlert) {
        const randomAlert = trumpAlerts[Math.floor(Math.random() * trumpAlerts.length)];
        setNewsAlert(randomAlert);
        showToast("URGENT: Trump Alert Received!", "warning");
      }
    };

    // Show first alert after 30 seconds for demo
    const timer = setTimeout(showAlert, 30000);
    return () => clearTimeout(timer);
  }, []);

  // Toast helper
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
      }
    } catch (e) {}
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("87capital_v4", JSON.stringify({ trades, session, propAccounts }));
  }, [trades, session, propAccounts]);

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
      case "dashboard": return <CommandCenterPage trades={trades} session={session} propAccounts={propAccounts} setPage={setPage} />;
      case "prop-firms": return <PropFirmsPage propAccounts={propAccounts} setPropAccounts={setPropAccounts} showToast={showToast} />;
      case "news": return <NewsPage showToast={showToast} />;
      case "presession": return <PreSessionPage onStartSession={onStartSession} setPage={setPage} />;
      case "journal": return <JournalPage trades={trades} onDeleteTrade={onDeleteTrade} onUpdateTrade={onUpdateTrade} showToast={showToast} />;
      case "analytics": return <AnalyticsPage trades={trades} />;
      case "ai": return <AICoachPage trades={trades} />;
      case "settings": return <SettingsPage trades={trades} setTrades={setTrades} propAccounts={propAccounts} showToast={showToast} />;
      default: return <CommandCenterPage trades={trades} session={session} propAccounts={propAccounts} setPage={setPage} />;
    }
  };

  return (
    <div style={{
      background: C.bg, color: C.text, fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif", minHeight: "100vh",
      backgroundImage: `radial-gradient(circle at 0% 0%, ${C.accentGlow} 0%, transparent 50%), radial-gradient(circle at 100% 100%, ${C.purpleGlow} 0%, transparent 50%)`
    }}>
      <TopBar session={session} />
      <Sidebar page={page} setPage={setPage} session={session} />
      <main style={{ marginLeft: 240, marginTop: 60, minHeight: "calc(100vh - 60px)" }}>
        {renderPage()}
      </main>
      
      {/* Trump News Alert Popup */}
      <NewsAlert alert={newsAlert} onDismiss={() => setNewsAlert(null)} />
      
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
        @keyframes livePulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.1); } }
        @keyframes firePulse { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.3); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideDown { from { transform: translateX(-50%) translateY(-100%); opacity: 0; } to { transform: translateX(-50%) translateY(0); opacity: 1; } }
        * { scrollbar-width: thin; scrollbar-color: ${C.border} transparent; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 10px; }
        body { margin: 0; }
        select option { background: ${C.bgCard}; }
        input[type="number"]::-webkit-inner-spin-button { opacity: 0.5; }
      `}</style>
    </div>
  );
}
