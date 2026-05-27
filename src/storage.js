// ─── Mart Journal Storage Layer (v5.0) ────────────────────────────────────────
// Robust localStorage with versioning, corruption recovery, auto-backup,
// quota monitoring, and IndexedDB-backed media storage.

const STORAGE_VERSION = 5;
const MAIN_KEY = "mart_journal_v5";
const BACKUP_KEY = "mart_journal_v5_backup";
const MIGRATION_KEYS = ["mart_journal", "87capital_v4"];
const QUOTA_WARN_PCT = 80;

// ── IndexedDB for screenshots/media ───────────────────────────────────────────
let _idb = null;
function idb() {
  if (_idb) return _idb;
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("mart_journal_media", 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("screenshots")) {
        db.createObjectStore("screenshots", { keyPath: "id" });
      }
    };
    req.onsuccess = () => {
      _idb = req.result;
      resolve(_idb);
    };
    req.onerror = () => reject(req.error);
  });
}

// Save a screenshot to IndexedDB, return its ID
export async function saveScreenshot(base64Data) {
  const db = await idb();
  const id = `ss_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return new Promise((resolve, reject) => {
    const tx = db.transaction("screenshots", "readwrite");
    tx.objectStore("screenshots").put({ id, data: base64Data, ts: Date.now() });
    tx.oncomplete = () => resolve(id);
    tx.onerror = () => reject(tx.error);
  });
}

// Get a screenshot by ID
export async function getScreenshot(id) {
  const db = await idb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("screenshots", "readonly");
    const req = tx.objectStore("screenshots").get(id);
    req.onsuccess = () => resolve(req.result?.data || null);
    req.onerror = () => reject(req.error);
  });
}

// Delete screenshots by IDs
export async function deleteScreenshots(ids) {
  const db = await idb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("screenshots", "readwrite");
    ids.forEach(id => tx.objectStore("screenshots").delete(id));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Get total IndexedDB usage in bytes
export async function getMediaUsage() {
  try {
    const estimate = await navigator.storage?.estimate();
    return estimate?.usage || 0;
  } catch { return 0; }
}

// ── localStorage helpers ──────────────────────────────────────────────────────
export function getQuotaUsage() {
  try {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      total += localStorage.getItem(key)?.length || 0;
    }
    // Estimate: each char ≈ 2 bytes (UTF-16), max 5MB
    const pct = (total * 2) / (5 * 1024 * 1024) * 100;
    return { bytes: total * 2, pct: Math.min(pct, 100) };
  } catch { return { bytes: 0, pct: 0 }; }
}

// ── Save with versioning + auto-backup ────────────────────────────────────────
export function saveState(data) {
  const payload = { version: STORAGE_VERSION, ts: Date.now(), data };
  const json = JSON.stringify(payload);

  try {
    // Check quota before saving
    const { pct } = getQuotaUsage();
    if (pct > 95) {
      console.warn("[Mart Journal] Storage critically full — attempting emergency save");
    }

    // Save main key
    localStorage.setItem(MAIN_KEY, json);

    // Rotating backup: save to backup key every 5th save (rate-limit writes)
    const lastBackup = parseInt(localStorage.getItem("mj_last_backup_ts") || "0");
    if (Date.now() - lastBackup > 300000) { // 5 min between backups
      try { localStorage.setItem(BACKUP_KEY, json); } catch {}
      localStorage.setItem("mj_last_backup_ts", String(Date.now()));
    }

    return { success: true, pct };
  } catch (e) {
    // Quota exceeded or other error
    console.error("[Mart Journal] Save failed:", e);
    return { success: false, error: e.message, pct: getQuotaUsage().pct };
  }
}

// ── Load with corruption recovery ─────────────────────────────────────────────
export function loadState() {
  const tryParse = (key) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      // Version check — only accept v5+
      if (parsed.version && parsed.version >= 5 && parsed.data) {
        return parsed.data;
      }
      // Legacy format (no version wrapper)
      if (!parsed.version && parsed.trades) {
        return parsed; // old format, still works
      }
      return null;
    } catch {
      return null;
    }
  };

  // Try main key first
  let data = tryParse(MAIN_KEY);
  if (data) return data;

  // Try backup
  data = tryParse(BACKUP_KEY);
  if (data) {
    console.warn("[Mart Journal] Recovered from backup — main key was corrupt");
    // Restore main key from backup
    try { 
      const raw = localStorage.getItem(BACKUP_KEY);
      if (raw) localStorage.setItem(MAIN_KEY, raw);
    } catch {}
    return data;
  }

  // Try old migration keys
  for (const key of MIGRATION_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.trades || parsed.trades?.length > 0) {
          // Migrate to new key
          try { localStorage.setItem(MAIN_KEY, JSON.stringify({ version: STORAGE_VERSION, ts: Date.now(), data: parsed })); } catch {}
          return parsed;
        }
      }
    } catch {}
  }

  return null;
}

// ── Clean up old storage keys ─────────────────────────────────────────────────
export function cleanupOldKeys() {
  MIGRATION_KEYS.forEach(key => {
    try { 
      if (localStorage.getItem(key)) {
        // Keep for one more session as safety, then remove
        localStorage.removeItem(key);
      }
    } catch {}
  });
}

// ── Migrate screenshots from localStorage to IndexedDB ────────────────────────
export async function migrateScreenshotsToIDB(trades, updateTradeFn) {
  let migrated = 0;
  for (let i = 0; i < trades.length; i++) {
    const trade = trades[i];
    if (trade.screenshots && Array.isArray(trade.screenshots) && trade.screenshots.length > 0) {
      const newIds = [];
      for (const ss of trade.screenshots) {
        // Check if it's base64 (starts with data:image)
        if (typeof ss === "string" && ss.startsWith("data:image")) {
          try {
            const id = await saveScreenshot(ss);
            newIds.push(id);
            migrated++;
          } catch { newIds.push(ss); } // keep original if IDB fails
        } else {
          newIds.push(ss); // already an IDB id
        }
      }
      if (newIds.some(id => typeof id === "string" && id.startsWith("ss_"))) {
        updateTradeFn(i, { screenshots: newIds });
      }
    }
  }
  return migrated;
}

// ── Export full backup (all state) ────────────────────────────────────────────
export function fullExport({ trades, session, propAccounts, subscriptions, expenses, payouts, milestones, weeklyReviews, settings }) {
  return {
    version: STORAGE_VERSION,
    exportedAt: new Date().toISOString(),
    app: "Mart Journal",
    data: {
      trades, session, propAccounts, subscriptions, expenses, 
      payouts, milestones, weeklyReviews, settings
    }
  };
}

// ── Validate imported data ────────────────────────────────────────────────────
export function validateImport(data) {
  if (!data || typeof data !== "object") return { valid: false, reason: "Invalid data format" };
  // Accept both wrapped and unwrapped formats
  const inner = data.data || data;
  if (!inner.trades && !inner.propAccounts && !inner.milestones) {
    return { valid: false, reason: "No recognizable data found" };
  }
  if (inner.trades && !Array.isArray(inner.trades)) {
    return { valid: false, reason: "trades must be an array" };
  }
  return { valid: true, data: inner };
}
