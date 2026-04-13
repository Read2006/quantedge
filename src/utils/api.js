export async function fetchFRED(series) {
  try {
    const r = await fetch(`/api/fred?series=${series}`);
    const d = await r.json();
    return d.observations || [];
  } catch { return []; }
}

export async function fetchCryptoMarkets() {
  try {
    const r = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,binancecoin,cardano,ripple&order=market_cap_desc&per_page=6&page=1&price_change_percentage=24h');
    return await r.json();
  } catch { return []; }
}

export async function fetchBTCHistory(days = 30) {
  try {
    const r = await fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}&interval=daily`);
    return await r.json();
  } catch { return null; }
}

export async function fetchCoinHistory(coinId, days = 30) {
  try {
    const r = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`);
    return await r.json();
  } catch { return null; }
}

export async function fetchFundingRates() {
  try {
    const r = await fetch('/api/funding');
    const d = await r.json();
    return d.funding || [];
  } catch { return []; }
}

export async function fetchFearGreed() {
  try {
    const r = await fetch('/api/feargreed');
    const d = await r.json();
    return d.data?.[0] || { value: '62', value_classification: 'Greed' };
  } catch { return { value: '62', value_classification: 'Greed' }; }
}

export async function fetchNews(query = '') {
  try {
    const r = await fetch(`/api/news?q=${encodeURIComponent(query)}`);
    const d = await r.json();
    return d.articles || [];
  } catch { return []; }
}

export function fmtNum(n, dec = 2) {
  return Number(n).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

export function fmtPct(n, dec = 2) {
  return (n >= 0 ? '+' : '') + Number(n).toFixed(dec) + '%';
}

export function nowStr() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor(diff / 60000);
  if (h > 0) return `${h}h ago`;
  if (m > 0) return `${m}m ago`;
  return 'just now';
}
