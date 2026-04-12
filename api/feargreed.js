export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const r = await fetch('https://api.alternative.me/fng/?limit=7');
    const data = await r.json();
    res.setHeader('Cache-Control', 's-maxage=3600');
    return res.status(200).json(data);
  } catch (e) {
    return res.status(200).json({
      data: [{ value: '62', value_classification: 'Greed', timestamp: Date.now() }]
    });
  }
}