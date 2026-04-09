const express = require('express');
const cors = require('cors');
const http = require('http');
const { WebSocketServer } = require('ws');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── TRADOVATE CONFIG ────────────────────────────────────────────────────────
// User sets these via Vercel env vars or .env file
const TRADOVATE_BASE_URL = process.env.TRADOVATE_DEMO_MODE === 'true'
  ? 'https://demo.tradovateapi.com/v1'
  : 'https://live.tradovateapi.com/v1';

const TRADOVATE_WS_URL = process.env.TRADOVATE_DEMO_MODE === 'true'
  ? 'wss://demo.tradovateapi.com/v1'
  : 'wss://live.tradovateapi.com/v1';

// ─── AUTH STATE ───────────────────────────────────────────────────────────────
let accessToken = null;
let tokenExpiry = 0;
let mdAccessToken = null;
let mdTokenExpiry = 0;

// Connected clients tracking
const connectedClients = new Set();

app.use(cors());
app.use(express.json());

// ─── HELPER: Format currency ─────────────────────────────────────────────────
function fmtUsd(val) {
  if (val == null) return '$0.00';
  const sign = val < 0 ? '-' : '';
  return `${sign}$${Math.abs(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ─── HELPER: Time ago ─────────────────────────────────────────────────────────
function getTimeAgo(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRADOVATE API FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

async function getAccessToken() {
  // Check if token is still valid (with 60s buffer)
  if (accessToken && Date.now() < tokenExpiry - 60000) {
    return accessToken;
  }

  const cid = process.env.TRADOVATE_CID;
  const sec = process.env.TRADOVATE_SECRET;
  const username = process.env.TRADOVATE_USERNAME;
  const password = process.env.TRADOVATE_PASSWORD;

  if (!cid || !sec || !username || !password) {
    throw new Error('Tradovate credentials not configured. Set TRADOVATE_CID, TRADOVATE_SECRET, TRADOVATE_USERNAME, TRADOVATE_PASSWORD env vars.');
  }

  const response = await fetch(`${TRADOVATE_BASE_URL}/auth/accesstokenrequest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: username,
      password: password,
      appId: 'TradingCommandCenter',
      appVersion: '1.0.0',
      cid: parseInt(cid, 10),
      sec: sec
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Tradovate auth failed: ${response.status} - ${error}`);
  }

  const data = await response.json();
  accessToken = data.accessToken;
  // Token is valid for ~24 hours, set expiry
  tokenExpiry = Date.now() + (data.mdAcsReqValidTimePeriod || 24 * 60 * 60 * 1000);
  mdAccessToken = data.mdAcsReqToken || accessToken;
  mdTokenExpiry = tokenExpiry;

  console.log('[Tradovate] Authenticated successfully, token expires in', 
    Math.round((tokenExpiry - Date.now()) / 60000), 'minutes');

  return accessToken;
}

async function tradovateRequest(endpoint, method = 'GET', body = null) {
  const token = await getAccessToken();
  const opts = {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
  if (body) opts.body = JSON.stringify(body);

  const response = await fetch(`${TRADOVATE_BASE_URL}${endpoint}`, opts);
  
  if (!response.ok) {
    const text = await response.text();
    console.error(`[Tradovate] ${method} ${endpoint} failed:`, response.status, text);
    throw new Error(`Tradovate API error: ${response.status} - ${text}`);
  }

  // Some endpoints return 200 with empty body
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// REST API ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    tradovate: {
      configured: !!(process.env.TRADOVATE_CID && process.env.TRADOVATE_SECRET && process.env.TRADOVATE_USERNAME && process.env.TRADOVATE_PASSWORD),
      mode: process.env.TRADOVATE_DEMO_MODE === 'true' ? 'demo' : 'live',
      authenticated: !!accessToken && Date.now() < tokenExpiry
    },
    connectedClients: connectedClients.size
  });
});

// ─── Auth: Get current user info ──────────────────────────────────────────────
app.get('/api/auth/me', async (req, res) => {
  try {
    const data = await tradovateRequest('/auth/me');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Accounts ─────────────────────────────────────────────────────────────────
app.get('/api/accounts', async (req, res) => {
  try {
    const accounts = await tradovateRequest('/account/list');
    
    // Enrich with cash balance
    const enriched = await Promise.all(accounts.map(async (acc) => {
      try {
        const balances = await tradovateRequest(`/cash-balance/list?accountId=${acc.id}`);
        const latestBalance = balances.length > 0 ? balances[balances.length - 1] : null;
        return {
          id: acc.id,
          name: acc.name,
          accountId: acc.accid,
          accountType: acc.accountType,
          active: acc.active,
          clearingHouse: acc.clearingHouseId,
          currency: acc.currency,
          cashBalance: latestBalance ? latestBalance.cashBalance : 0,
          availableBalance: latestBalance ? latestBalance.availableBalance : 0,
          totalBalance: latestBalance ? latestBalance.totalBalance : 0,
          margin: latestBalance ? latestBalance.margin : 0,
          unrealizedPnl: latestBalance ? latestBalance.unrealizedEtdPnl : 0,
          timestamp: latestBalance ? latestBalance.timestamp : null
        };
      } catch (e) {
        return {
          id: acc.id,
          name: acc.name,
          accountId: acc.accid,
          accountType: acc.accountType,
          active: acc.active,
          error: e.message
        };
      }
    }));

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Positions ────────────────────────────────────────────────────────────────
app.get('/api/positions', async (req, res) => {
  try {
    const positions = await tradovateRequest('/position/list');
    
    const enriched = positions.map(pos => ({
      id: pos.id,
      accountId: pos.accountId,
      contractId: pos.contractId,
      symbol: pos.symbol || pos.contractId, // Will be resolved via contract lookup
      netPrice: pos.netPrice,
      netQty: pos.netQty,
      longShort: pos.netQty > 0 ? 'Long' : 'Short',
      avgPrice: pos.netPrice,
      lastPrice: pos.lastPrice,
      markPrice: pos.markPrice,
      unrealizedPnl: pos.unrealizedPnl,
      realizedPnl: pos.realizedPnl,
      dailyPnl: pos.dailyPnl,
      timestamp: pos.timestamp
    }));

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Fills (Trade History) ────────────────────────────────────────────────────
app.get('/api/fills', async (req, res) => {
  try {
    const fills = await tradovateRequest('/fill/list');
    res.json(fills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Cash Balances ────────────────────────────────────────────────────────────
app.get('/api/balances', async (req, res) => {
  try {
    const balances = await tradovateRequest('/cash-balance/list');
    res.json(balances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Order List ───────────────────────────────────────────────────────────────
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await tradovateRequest('/order/list');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Dashboard Summary (aggregated) ──────────────────────────────────────────
app.get('/api/dashboard', async (req, res) => {
  try {
    const [accounts, positions] = await Promise.all([
      tradovateRequest('/account/list'),
      tradovateRequest('/position/list')
    ]);

    const totalBalance = accounts.reduce((sum, acc) => sum + (acc.cashBalance || 0), 0);
    const totalUnrealizedPnl = positions.reduce((sum, pos) => sum + (pos.unrealizedPnl || 0), 0);
    const totalDailyPnl = positions.reduce((sum, pos) => sum + (pos.dailyPnl || 0), 0);
    const openPositions = positions.filter(p => Math.abs(p.netQty) > 0);

    res.json({
      accounts: accounts.length,
      totalBalance,
      totalUnrealizedPnl,
      totalDailyPnl,
      openPositionsCount: openPositions.length,
      positions: openPositions.map(p => ({
        symbol: p.symbol || p.contractId,
        netQty: p.netQty,
        longShort: p.netQty > 0 ? 'Long' : 'Short',
        avgPrice: p.netPrice,
        lastPrice: p.lastPrice,
        unrealizedPnl: p.unrealizedPnl,
        dailyPnl: p.dailyPnl
      })),
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Contracts Lookup (for symbol resolution) ────────────────────────────────
app.get('/api/contracts/:id', async (req, res) => {
  try {
    const contract = await tradovateRequest(`/contract/item/${req.params.id}`);
    res.json(contract);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Disconnect (clear token) ─────────────────────────────────────────────────
app.post('/api/disconnect', (req, res) => {
  accessToken = null;
  tokenExpiry = 0;
  mdAccessToken = null;
  mdTokenExpiry = 0;
  res.json({ status: 'disconnected' });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TRUMP TWEETS (legacy - kept for compatibility)
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/api/trump-tweets', async (req, res) => {
  try {
    const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
    if (!TWITTER_BEARER_TOKEN) {
      return res.status(500).json({ 
        error: 'Twitter API token not configured',
        message: 'Please set TWITTER_BEARER_TOKEN environment variable'
      });
    }

    const response = await fetch(
      `https://api.twitter.com/2/users/25073877/tweets?max_results=10&tweet.fields=created_at`,
      { headers: { 'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}` } }
    );

    if (!response.ok) {
      return res.status(response.status).json(await response.json());
    }

    const data = await response.json();
    const tweets = data.data.map(tweet => ({
      id: tweet.id,
      text: tweet.text,
      created_at: tweet.created_at,
      timeAgo: getTimeAgo(new Date(tweet.created_at))
    }));
    res.json({ tweets });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tweets' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// WEBSOCKET SERVER FOR REAL-TIME UPDATES
// ═══════════════════════════════════════════════════════════════════════════════
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

// Periodically fetch data and push to connected clients
let dataInterval = null;

async function fetchAndBroadcast() {
  if (connectedClients.size === 0) return;
  if (!accessToken) {
    try {
      await getAccessToken();
    } catch (e) {
      console.error('[WS] Auth failed, skipping broadcast:', e.message);
      return;
    }
  }

  try {
    const [positions, accounts] = await Promise.all([
      tradovateRequest('/position/list'),
      tradovateRequest('/account/list')
    ]);

    // Get balances for all accounts
    const balances = await tradovateRequest('/cash-balance/list');

    const dashboard = {
      type: 'dashboard',
      data: {
        accounts: accounts.map(acc => ({
          id: acc.id,
          name: acc.name,
          accountId: acc.accid,
          active: acc.active
        })),
        positions: positions
          .filter(p => Math.abs(p.netQty) > 0)
          .map(p => ({
            id: p.id,
            accountId: p.accountId,
            symbol: p.symbol || p.contractId,
            netQty: p.netQty,
            longShort: p.netQty > 0 ? 'Long' : 'Short',
            avgPrice: p.netPrice,
            lastPrice: p.lastPrice,
            unrealizedPnl: p.unrealizedPnl,
            dailyPnl: p.dailyPnl
          })),
        totalBalance: balances.reduce((sum, b) => sum + (b.totalBalance || 0), 0),
        totalUnrealizedPnl: positions.reduce((sum, p) => sum + (p.unrealizedPnl || 0), 0),
        totalDailyPnl: positions.reduce((sum, p) => sum + (p.dailyPnl || 0), 0),
        lastUpdated: new Date().toISOString()
      }
    };

    const message = JSON.stringify(dashboard);
    connectedClients.forEach(client => {
      if (client.readyState === 1) { // OPEN
        client.send(message);
      }
    });
  } catch (error) {
    console.error('[WS] Broadcast error:', error.message);
  }
}

wss.on('connection', (ws) => {
  console.log('[WS] Client connected');
  connectedClients.add(ws);

  // Start polling if first client
  if (connectedClients.size === 1) {
    // Initial fetch
    fetchAndBroadcast();
    // Then poll every 5 seconds
    dataInterval = setInterval(fetchAndBroadcast, 5000);
  }

  ws.on('close', () => {
    console.log('[WS] Client disconnected');
    connectedClients.delete(ws);
    
    // Stop polling if no clients
    if (connectedClients.size === 0 && dataInterval) {
      clearInterval(dataInterval);
      dataInterval = null;
    }
  });

  ws.on('error', (err) => {
    console.error('[WS] Error:', err.message);
    connectedClients.delete(ws);
  });

  // Send initial connection message
  ws.send(JSON.stringify({ type: 'connected', message: 'Tradovate real-time feed active' }));
});

// ═══════════════════════════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════════════════════════
server.listen(PORT, () => {
  console.log(`[Server] Trading Command Center running on port ${PORT}`);
  console.log(`[Server] Tradovate mode: ${process.env.TRADOVATE_DEMO_MODE === 'true' ? 'DEMO' : 'LIVE'}`);
  console.log(`[Server] Tradovate API: ${TRADOVATE_BASE_URL}`);
  console.log(`[Server] WS endpoint: ws://localhost:${PORT}/ws`);
  console.log(`[Server] Credentials configured: ${!!(process.env.TRADOVATE_CID && process.env.TRADOVATE_SECRET)}`);
});