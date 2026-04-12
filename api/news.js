export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { q } = req.query;
  const key = process.env.NEWS_API_KEY;
  if (!key) return res.status(200).json({ articles: [] });
  try {
    const query = q || 'stock market crypto bitcoin fed inflation gold oil';
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${key}`;
    const r = await fetch(url);
    const data = await r.json();
    if (data.status !== 'ok') return res.status(200).json({ articles: [] });
    const articles = data.articles.map(a => ({
      title: a.title,
      source: a.source.name,
      url: a.url,
      publishedAt: a.publishedAt,
      description: a.description,
    }));
    res.setHeader('Cache-Control', 's-maxage=900');
    return res.status(200).json({ articles });
  } catch (e) {
    return res.status(200).json({ articles: [] });
  }
}