import { useState, useEffect } from 'react';
import s from './NarrativeDetector.module.css';

const NARRATIVES = [
  {
    id: 'ai-boom',
    theme: 'AI Infrastructure Boom',
    momentum: 92,
    trend: 'accelerating',
    assets: ['NVDA', 'AMD', 'MSFT', 'GOOGL', 'TSM'],
    summary: 'AI chip demand and data center buildout narrative is dominating tech coverage. Institutional inflows into semiconductor names at multi-year highs.',
    sources: 12,
    sentiment: 'bullish',
    change: '+18% mentions this week',
  },
  {
    id: 'fed-pivot',
    theme: 'Fed Pivot Expectations',
    momentum: 78,
    trend: 'steady',
    assets: ['Gold', 'BTC', 'TLT', 'GLD'],
    summary: 'Rate cut narrative gaining ground as inflation data softens. Bond markets pricing in 2 cuts by year end. Gold and crypto historically benefit.',
    sources: 9,
    sentiment: 'bullish',
    change: '+9% mentions this week',
  },
  {
    id: 'china-risk',
    theme: 'China Geopolitical Risk',
    momentum: 65,
    trend: 'rising',
    assets: ['FXI', 'BABA', 'TSM', 'Oil'],
    summary: 'Taiwan tensions and trade war rhetoric increasing in financial media. Supply chain diversification narrative driving reshoring plays.',
    sources: 7,
    sentiment: 'bearish',
    change: '+24% mentions this week',
  },
  {
    id: 'oil-supply',
    theme: 'Oil Supply Squeeze',
    momentum: 58,
    trend: 'steady',
    assets: ['XOM', 'CVX', 'Oil', 'OXY'],
    summary: 'OPEC+ production cuts and Middle East tensions keeping energy elevated. Inflation implications being closely watched by Fed watchers.',
    sources: 6,
    sentiment: 'bullish',
    change: '+5% mentions this week',
  },
  {
    id: 'btc-etf',
    theme: 'Bitcoin Institutional Adoption',
    momentum: 84,
    trend: 'accelerating',
    assets: ['BTC', 'ETH', 'MSTR', 'COIN'],
    summary: 'ETF inflows remain strong. Corporate treasury adoption narrative building. Halving cycle thesis driving long-term accumulation by institutions.',
    sources: 11,
    sentiment: 'bullish',
    change: '+31% mentions this week',
  },
  {
    id: 'recession-fears',
    theme: 'Recession Risk Signal',
    momentum: 44,
    trend: 'fading',
    assets: ['Gold', 'TLT', 'VIX', 'USD'],
    summary: 'Hard landing fears fading as labor market holds up. Soft landing narrative now dominant. Defensive positioning being unwound by institutional players.',
    sources: 5,
    sentiment: 'neutral',
    change: '-12% mentions this week',
  },
];

const NEWS_FEED = [
  { time: '2h ago', headline: 'NVIDIA surpasses $2T market cap on AI infrastructure demand', asset: 'NVDA', sentiment: 'bullish', source: 'Reuters' },
  { time: '3h ago', headline: 'Fed minutes signal patience on rate cuts despite cooling inflation', asset: 'Gold', sentiment: 'neutral', source: 'Bloomberg' },
  { time: '4h ago', headline: 'Bitcoin ETF sees $840M inflow in single session — record week', asset: 'BTC', sentiment: 'bullish', source: 'CoinDesk' },
  { time: '5h ago', headline: 'OPEC+ confirms output cuts through Q3, oil holds above $85', asset: 'Oil', sentiment: 'bullish', source: 'FT' },
  { time: '6h ago', headline: 'Taiwan Strait tensions rise as military exercises resume', asset: 'TSM', sentiment: 'bearish', source: 'WSJ' },
  { time: '8h ago', headline: 'US jobs data beats estimates — labor market remains resilient', asset: 'USD', sentiment: 'neutral', source: 'CNBC' },
  { time: '10h ago', headline: 'Ethereum staking yields compress as institutional demand grows', asset: 'ETH', sentiment: 'neutral', source: 'The Block' },
  { time: '12h ago', headline: 'Goldman raises S&P 500 target citing AI productivity tailwinds', asset: 'SPY', sentiment: 'bullish', source: 'Goldman Sachs' },
];

const MomentumBar = ({ value, sentiment }) => {
  const color = sentiment === 'bullish' ? 'var(--green)' : sentiment === 'bearish' ? 'var(--red)' : 'var(--gold)';
  return (
    <div className={s.momentumWrap}>
      <div className={s.momentumTrack}>
        <div className={s.momentumFill} style={{ width: `${value}%`, background: color }}></div>
      </div>
      <span className={s.momentumVal} style={{ color }}>{value}</span>
    </div>
  );
};

const NarrativeDetector = () => {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? NARRATIVES : NARRATIVES.filter(n => n.sentiment === filter);

  return (
    <div className={s.wrap}>
      <div className={s.pageHdr}>
        <div>
          <div className={s.pageTitle}>Narrative Detector</div>
          <div className={s.pageSub}>AI-powered market storytelling — trending themes mapped to assets in real time</div>
        </div>
        <div className={s.filters}>
          {['all', 'bullish', 'bearish', 'neutral'].map(f => (
            <button key={f} className={`${s.filterBtn} ${filter === f ? s.active : ''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={s.alertBanner}>
        <span className={s.alertDot}></span>
        <strong>2 narratives accelerating</strong> — AI Infrastructure and Bitcoin Institutional Adoption momentum spiking this week. Assets likely to move: NVDA, BTC, COIN.
      </div>

      <div className={s.mainGrid}>
        <div className={s.narrativesList}>
          <div className={s.listHdr}>
            <span>Narrative</span>
            <span>Momentum</span>
          </div>
          {filtered.map(n => (
            <div
              key={n.id}
              className={`${s.narrativeCard} ${selected?.id === n.id ? s.selectedCard : ''}`}
              onClick={() => setSelected(selected?.id === n.id ? null : n)}
            >
              <div className={s.cardTop}>
                <div>
                  <div className={s.narrativeTheme}>{n.theme}</div>
                  <div className={s.narrativeMeta}>
                    <span className={`${s.trendBadge} ${s[n.trend]}`}>{n.trend}</span>
                    <span className={s.sourcesCount}>{n.sources} sources</span>
                    <span className={s.changeText}>{n.change}</span>
                  </div>
                </div>
                <span className={`${s.sentBadge} ${s[n.sentiment]}`}>{n.sentiment}</span>
              </div>
              <MomentumBar value={n.momentum} sentiment={n.sentiment} />
              {selected?.id === n.id && (
                <div className={s.expanded}>
                  <div className={s.expandedSummary}>{n.summary}</div>
                  <div className={s.assetsLabel}>Affected assets</div>
                  <div className={s.assetTags}>
                    {n.assets.map(a => (
                      <span key={a} className={s.assetTag}>{a}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={s.newsFeed}>
          <div className={s.panelHdr}>
            <div className={s.panelTitle}>Live news feed</div>
            <span className={s.panelTag}>AI-scored</span>
          </div>
          <div className={s.newsList}>
            {NEWS_FEED.map((n, i) => (
              <div key={i} className={s.newsItem}>
                <div className={s.newsTop}>
                  <span className={s.newsTime}>{n.time}</span>
                  <span className={s.newsSource}>{n.source}</span>
                  <span className={`${s.newsSent} ${s[n.sentiment]}`}>{n.sentiment}</span>
                </div>
                <div className={s.newsHeadline}>{n.headline}</div>
                <div className={s.newsAsset}>→ {n.asset}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NarrativeDetector;
