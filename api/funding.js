export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const symbols = ['BTCUSDT','ETHUSDT','SOLUSDT','BNBUSDT','DOGEUSDT','ADAUSDT'];
  try {
    const results = await Promise.all(
      symbols.map(async (symbol) => {
        try {
          const r = await fetch(`https://fapi.binance.com/fapi/v1/fundingRate?symbol=${symbol}&limit=1`);
          const data = await r.json();
          const rate = data[0] ? parseFloat(data[0].fundingRate) : 0;
          return {
            symbol: symbol.replace('USDT',''),
            rate,
            sentiment: rate > 0.02 ? 'Overleveraged longs' : rate > 0.005 ? 'Slightly bullish' : rate < -0.005 ? 'Shorts dominant' : 'Neutral',
          };
        } catch {
          return { symbol: symbol.replace('USDT',''), rate: 0, sentiment: 'Unavailable' };
        }
      })
    );
    res.setHeader('Cache-Control', 's-maxage=300');
    return res.status(200).json({ funding: results });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}