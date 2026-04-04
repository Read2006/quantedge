const FRED_KEY = process.env.REACT_APP_FRED_API_KEY || 'DEMO_KEY';

export async function fetchFRED(series) {
  try {
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${series}&api_key=${FRED_KEY}&file_type=json&sort_order=desc&limit=12`;
    const r = await fetch(url);
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

export async function fetchGlobalCrypto() {
  try {
    const r = await fetch('https://api.coingecko.com/api/v3/global');
    return await r.json();
  } catch { return null; }
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
