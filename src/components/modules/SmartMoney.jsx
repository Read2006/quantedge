import { useState, useEffect } from 'react';
import { fetchFundingRates, fetchFearGreed } from '../../utils/api';
import s from './SmartMoney.module.css';

const WHALE_ALERTS = [
  { time:'2h ago', asset:'BTC', action:'Large buy', amount:'$42.3M', type:'buy', exchange:'Binance' },
  { time:'4h ago', asset:'ETH', action:'Exchange outflow', amount:'18,400 ETH', type:'buy', exchange:'Coinbase' },
  { time:'6h ago', asset:'BTC', action:'Large sell', amount:'$28.1M', type:'sell', exchange:'Kraken' },
  { time:'9h ago', asset:'SOL', action:'Whale accumulation', amount:'840,000 SOL', type:'buy', exchange:'OKX' },
  { time:'12h ago', asset:'USDT', action:'Mint event', amount:'$500M', type:'neutral', exchange:'Tether' },
];

const SmartMoney = () => {
  const [fearGreed, setFearGreed] = useState({ value: '50', value_classification: 'Neutral' });
  const [funding, setFunding] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [fg, fr] = await Promise.all([
        fetchFearGreed(),
        fetchFundingRates(),
      ]);
      setFearGreed(fg);
      if (fr.length > 0) setFunding(fr);
      setLoading(false);
    };
    load();
  }, []);

  const fgValue = parseInt(fearGreed.value);
  const fearColor = fgValue > 75 ? 'var(--red)' : fgValue > 50 ? 'var(--gold)' : fgValue > 25 ? 'var(--green)' : 'var(--red)';
  const fearLabel = fearGreed.value_classification;

  const displayFunding = funding.length > 0 ? funding : [
    { symbol:'BTC', rate:0.0102, sentiment:'Longs dominant' },
    { symbol:'ETH', rate:0.0087, sentiment:'Slightly bullish' },
    { symbol:'SOL', rate:0.0241, sentiment:'Overleveraged longs' },
    { symbol:'BNB', rate:-0.0031, sentiment:'Shorts dominant' },
    { symbol:'DOGE', rate:0.0312, sentiment:'Extreme greed' },
    { symbol:'ADA', rate:0.0055, sentiment:'Neutral' },
  ];

  const topFunding = displayFunding.reduce((a, b) => Math.abs(a.rate) > Math.abs(b.rate) ? a : b, displayFunding[0] || {});

  const fearNote = fgValue <= 25 ? 'Extreme fear in markets — historically a buying opportunity for long-term holders. Panic selling often creates value.' :
    fgValue <= 45 ? 'Fear dominant — market sentiment negative. Contrarian opportunities may exist for patient traders.' :
    fgValue <= 55 ? 'Neutral sentiment — no strong directional bias. Wait for clearer signals before taking large positions.' :
    fgValue <= 75 ? 'Greed building — momentum present but watch for reversal signals. Consider taking partial profits.' :
    'Extreme greed — retail euphoria at dangerous levels. High probability of correction. Reduce risk exposure.';

  return (
    <div className={s.wrap}>
      <div className={s.pageHdr}>
        <div>
          <div className={s.pageTitle}>Smart Money Tracker</div>
          <div className={s.pageSub}>{loading ? 'Loading live data...' : 'Live · Binance funding rates + Alternative.me sentiment'}</div>
        </div>
      </div>

      <div className={s.topRow}>
        <div className={s.panel}>
          <div className={s.panelHdr}>
            <div className={s.panelTitle}>Fear & Greed Index</div>
            <span className={s.panelTag}>Live · Alternative.me</span>
          </div>
          <div className={s.fearWrap}>
            <div className={s.fearGauge}>
              <div className={s.fearNum} style={{ color: fearColor }}>{fearGreed.value}</div>
              <div className={s.fearLabel} style={{ color: fearColor }}>{fearLabel}</div>
            </div>
            <div className={s.fearBar}>
              <div className={s.fearTrack}>
                <div className={s.fearFill} style={{ width:`${fgValue}%`, background: fearColor }}></div>
                <div className={s.fearThumb} style={{ left:`${fgValue}%`, background: fearColor }}></div>
              </div>
              <div className={s.fearLegend}><span>Extreme Fear</span><span>Extreme Greed</span></div>
            </div>
            <div className={s.fearNote}>{fearNote}</div>
          </div>
        </div>

        <div className={s.panel}>
          <div className={s.panelHdr}>
            <div className={s.panelTitle}>Funding Rates</div>
            <span className={s.panelTag}>Live · Binance</span>
          </div>
          <div className={s.fundingList}>
            {displayFunding.map(f => (
              <div key={f.symbol || f.asset} className={s.fundingRow}>
                <div>
                  <span className={s.fundingAsset}>{f.symbol || f.asset}</span>
                  <span className={s.fundingSent}>{f.sentiment}</span>
                </div>
                <span className={`${s.fundingRate} ${Math.abs(f.rate) > 0.02 ? s.danger : f.rate < 0 ? s.neg : s.pos}`}>
                  {f.rate > 0 ? '+' : ''}{Number(f.rate).toFixed(4)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={s.panel}>
        <div className={s.panelHdr}>
          <div className={s.panelTitle}>Whale alerts</div>
          <span className={s.panelTag}>Last 12 hours</span>
        </div>
        <div className={s.whaleList}>
          {WHALE_ALERTS.map((w, i) => (
            <div key={i} className={s.whaleRow}>
              <span className={`${s.whaleDot} ${s[w.type]}`}></span>
              <span className={s.whaleTime}>{w.time}</span>
              <span className={s.whaleAsset}>{w.asset}</span>
              <span className={s.whaleAction}>{w.action}</span>
              <span className={s.whaleAmount}>{w.amount}</span>
              <span className={s.whaleEx}>{w.exchange}</span>
              <span className={`${s.whaleBadge} ${s[w.type]}`}>{w.type==='buy'?'Accumulation':w.type==='sell'?'Distribution':'Neutral'}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={s.insightBanner}>
        <div className={s.insightIcon}>AI</div>
        <div>
          <div className={s.insightTitle}>QuantEdge signal</div>
          <div className={s.insightText}>
            {fgValue <= 20
              ? `Fear & Greed at ${fearGreed.value} — Extreme Fear. Markets in panic. Historically the best time to accumulate quality assets. Smart money buys when retail sells.`
              : fgValue <= 40
              ? `Fear & Greed at ${fearGreed.value} — Fear zone. Sentiment negative but not extreme. Watch for stabilization signals before entering positions.`
              : topFunding && topFunding.symbol && Math.abs(topFunding.rate) > 0.02
              ? `${topFunding.symbol} funding rate at ${Number(topFunding.rate).toFixed(4)}% — overleveraged ${topFunding.rate > 0 ? 'longs' : 'shorts'}. High liquidation risk. Consider hedging or reducing exposure.`
              : `Markets showing ${fearLabel} sentiment at ${fearGreed.value}. Monitor macro signals and funding rates for directional bias before entering new positions.`
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartMoney;