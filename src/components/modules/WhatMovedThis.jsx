import { useState } from 'react';
import s from './WhatMovedThis.module.css';

const ASSET_DATA = {
  BTC: {
    price: '$83,420', change: '-2.4%', direction: 'down',
    reasons: [
      { type: 'macro', label: 'Fed hawkish signal', impact: 'high', detail: 'FOMC minutes showed fewer members supporting rate cuts — risk assets sold off across the board.', direction: 'bearish' },
      { type: 'onchain', label: 'Exchange inflows spike', impact: 'high', detail: '14,200 BTC moved to exchanges in 6 hours — historically precedes selling pressure.', direction: 'bearish' },
      { type: 'correlation', label: 'Nasdaq down 1.8%', impact: 'medium', detail: 'BTC/Nasdaq correlation at 0.78 — tech selloff dragged crypto lower.', direction: 'bearish' },
      { type: 'sentiment', label: 'Funding rates negative', impact: 'medium', detail: 'Perpetual futures funding flipped negative — shorts now paying longs.', direction: 'neutral' },
    ],
    verdict: 'Macro-driven move. Fed hawkishness + exchange inflows signal institutional de-risking. Not a fundamental shift — watch for support at $81,000.',
  },
  ETH: {
    price: '$1,842', change: '+1.2%', direction: 'up',
    reasons: [
      { type: 'onchain', label: 'ETF inflow $220M', impact: 'high', detail: 'Spot ETH ETF saw $220M net inflow — third consecutive day of institutional buying.', direction: 'bullish' },
      { type: 'narrative', label: 'Pectra upgrade hype', impact: 'medium', detail: 'Upcoming Ethereum upgrade generating developer and institutional buzz.', direction: 'bullish' },
      { type: 'correlation', label: 'Diverging from BTC', impact: 'medium', detail: 'ETH outperforming BTC — ETH/BTC ratio up 3.4% this week.', direction: 'bullish' },
    ],
    verdict: 'Demand-driven move. ETF inflows + upgrade narrative providing genuine buying pressure. Watch ETH/BTC ratio for continuation signal.',
  },
  GOLD: {
    price: '$2,318', change: '+0.8%', direction: 'up',
    reasons: [
      { type: 'macro', label: 'DXY weakening', impact: 'high', detail: 'Dollar index fell 0.4% — gold inversely correlated, making it cheaper for foreign buyers.', direction: 'bullish' },
      { type: 'macro', label: 'Real yields declining', impact: 'high', detail: 'TIPS yield fell 6bps — lower real yields reduce opportunity cost of holding gold.', direction: 'bullish' },
      { type: 'sentiment', label: 'Central bank buying', impact: 'medium', detail: 'China and India central banks continued accumulation in Q1 — structural demand.', direction: 'bullish' },
    ],
    verdict: 'Classic macro move. DXY weakness + real yield compression = textbook gold bullish setup. Trend intact above $2,280.',
  },
  NVDA: {
    price: '$886', change: '+4.2%', direction: 'up',
    reasons: [
      { type: 'narrative', label: 'AI infrastructure surge', impact: 'high', detail: 'Morgan Stanley raised price target citing hyperscaler capex guidance — MSFT + GOOGL both guided higher AI spend.', direction: 'bullish' },
      { type: 'macro', label: 'Tech sector rotation', impact: 'medium', detail: 'Institutional rotation into large-cap tech continued — sector saw $2.1B inflow.', direction: 'bullish' },
      { type: 'onchain', label: 'Options unusual activity', impact: 'medium', detail: '$900 strike calls saw 40x normal volume — smart money positioning for upside.', direction: 'bullish' },
    ],
    verdict: 'Narrative + fundamental move. AI capex cycle intact. Options flow suggests institutional upside positioning. Momentum favors bulls near-term.',
  },
};

const POPULAR = ['BTC', 'ETH', 'GOLD', 'NVDA'];

const ImpactDot = ({ level }) => {
  const color = level === 'high' ? 'var(--red)' : level === 'medium' ? 'var(--gold)' : 'var(--muted)';
  return <span className={s.impactDot} style={{ background: color }}></span>;
};

const WhatMovedThis = () => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [searched, setSearched] = useState(false);

  const search = (asset) => {
    const key = asset.toUpperCase();
    if (ASSET_DATA[key]) {
      setSelected({ asset: key, ...ASSET_DATA[key] });
      setSearched(true);
    } else {
      setSelected({ asset: key, notFound: true });
      setSearched(true);
    }
  };

  const handleSearch = () => {
    if (query.trim()) search(query.trim());
  };

  return (
    <div className={s.wrap}>
      <div className={s.pageHdr}>
        <div>
          <div className={s.pageTitle}>What Moved This?</div>
          <div className={s.pageSub}>Click any asset and instantly understand why it moved — news, macro, flows, and correlations</div>
        </div>
      </div>

      <div className={s.searchPanel}>
        <div className={s.searchRow}>
          <input
            className={s.searchInput}
            placeholder="Enter any asset — BTC, ETH, NVDA, Gold, Oil..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <button className={s.searchBtn} onClick={handleSearch}>Analyse</button>
        </div>
        <div className={s.popular}>
          <span className={s.popularLabel}>Popular:</span>
          {POPULAR.map(a => (
            <button key={a} className={s.popularBtn} onClick={() => { setQuery(a); search(a); }}>{a}</button>
          ))}
        </div>
      </div>

      {searched && selected && !selected.notFound && (
        <div className={s.resultWrap}>
          <div className={s.resultHdr}>
            <div>
              <div className={s.resultAsset}>{selected.asset}</div>
              <div className={s.resultPrice}>{selected.price}</div>
            </div>
            <div className={`${s.resultChange} ${selected.direction === 'up' ? s.up : s.down}`}>
              {selected.direction === 'up' ? '▲' : '▼'} {selected.change} today
            </div>
          </div>

          <div className={s.reasonsGrid}>
            <div className={s.reasonsList}>
              <div className={s.sectionLabel}>Why it moved</div>
              {selected.reasons.map((r, i) => (
                <div key={i} className={s.reasonCard}>
                  <div className={s.reasonTop}>
                    <div className={s.reasonLeft}>
                      <ImpactDot level={r.impact}/>
                      <span className={`${s.reasonType} ${s[r.type]}`}>{r.type}</span>
                      <span className={s.reasonLabel}>{r.label}</span>
                    </div>
                    <span className={`${s.dirBadge} ${s[r.direction]}`}>{r.direction}</span>
                  </div>
                  <div className={s.reasonDetail}>{r.detail}</div>
                </div>
              ))}
            </div>

            <div className={s.verdictPanel}>
              <div className={s.sectionLabel}>QuantEdge verdict</div>
              <div className={s.verdictCard}>
                <div className={s.verdictIcon}>QE</div>
                <div className={s.verdictText}>{selected.verdict}</div>
              </div>

              <div className={s.sectionLabel} style={{marginTop:'20px'}}>Impact key</div>
              <div className={s.impactKey}>
                {[['high','High impact'],['medium','Medium impact'],['low','Low impact']].map(([l,label])=>(
                  <div key={l} className={s.impactKeyRow}>
                    <ImpactDot level={l}/>
                    <span className={s.impactKeyLabel}>{label}</span>
                  </div>
                ))}
              </div>

              <div className={s.typeKey}>
                <div className={s.sectionLabel}>Signal types</div>
                {[['macro','Macro'],['onchain','On-chain'],['narrative','Narrative'],['correlation','Correlation'],['sentiment','Sentiment']].map(([t,label])=>(
                  <div key={t} className={s.typeKeyRow}>
                    <span className={`${s.reasonType} ${s[t]}`}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {searched && selected?.notFound && (
        <div className={s.notFound}>
          <div className={s.notFoundTitle}>No data for "{selected.asset}"</div>
          <div className={s.notFoundSub}>Try BTC, ETH, GOLD, or NVDA. More assets coming with live data wiring.</div>
        </div>
      )}

      {!searched && (
        <div className={s.emptyState}>
          <div className={s.emptyTitle}>Search any asset above</div>
          <div className={s.emptySub}>Get an instant breakdown of what's driving price — macro signals, on-chain data, narratives, and correlated moves all in one place.</div>
        </div>
      )}
    </div>
  );
};

export default WhatMovedThis;
