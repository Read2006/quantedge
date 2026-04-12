export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { series } = req.query;
  if (!series) return res.status(400).json({ error: 'series required' });
  const key = process.env.FRED_API_KEY || 'DEMO_KEY';
  const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${series}&api_key=${key}&file_type=json&sort_order=desc&limit=12`;
  try {
    const r = await fetch(url);
    const data = await r.json();
    res.setHeader('Cache-Control', 's-maxage=3600');
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}