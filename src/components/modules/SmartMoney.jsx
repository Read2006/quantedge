import { useState, useEffect } from 'react';
import s from './SmartMoney.module.css';

const FUNDING_DATA = [
  { asset:'BTC', rate:0.0102, sentiment:'Longs dominant' },
  { asset:'ETH', rate:0.0087, sentiment:'Slightly bullish' },
  { asset:'SOL', rate:0.0241, sentiment:'Overleveraged longs' },
  { asset:'BNB', rate:-0.0031, sentiment:'Shorts dominant' },
  { asset:'DOGE', rate:0.0312, sentiment:'Extreme greed' },
  { asset:'ADA', rate:0.0055, sentiment:'Neutral' },
];

const WHALE_ALERTS = [
  { time:'2h ago', asset:'BTC', action:'Large buy', amount:'$42.3M', type:'buy', exchange:'Binance' },
  { time:'4h ago', asset:'ETH', action:'Exchange outflow', amount:'18,400 ETH', type:'buy', exchange:'Coinbase' },
  { time:'6h ago', asset:'BTC', action:'Large sell', amount:'$28.1M', type:'sell', exchange:'Kraken' },
  { time:'9h ago', asset:'SOL', action:'Whale accumulation', amount:'840,000 SOL', type:'buy', exchange:'OKX' },
  { time:'12h ago', asset:'USDT', action:'Mint event', amount:'$500M', type:'neutral', exchange:'Tether' },
];

const SmartMoney = () => {
  const [fearGreed] = useState(62);

  useEffect(() => {}, []);

  const fearColor = fearGreed > 75 ? 'var(--red)' : fearGreed > 50 ? 'var(--gold)' : 'var(--green)';
  const fearLabel = fearGreed > 75 ? 'Extreme Greed' : fearGreed > 55 ? 'Greed' : fearGreed > 45 ? 'Neutral' : fearGreed > 25 ? 'Fear' : 'Extreme Fear';

  return (
    <div className={s.wrap}>
      <div className={s.pageHdr}>
        <div>
          <div className={s.pageTitle}>Smart Money Tracker</div>
          <div className={s.pageSub}>Institutional signals, whale movements, and retail sentiment</div>
        </div>
      </div>

      <div className={s.topRow}>
        <div className={s.panel}>
          <div className={s.panelHdr}><div className={s.panelTitle}>Fear & Greed Index</div></div>
          <div className={s.fearWrap}>
            <div className={s.fearGauge}>
              <div className={s.fearNum} style={{ color: fearColor }}>{fearGreed}</div>
              <div className={s.fearLabel} style={{ color: fearColor }}>{fearLabel}</div>
            </div>
            <div className={s.fearBar}>
              <div className={s.fearTrack}>
                <div className={s.fearFill} style={{ width:`${fearGreed}%`, background: fearColor }}></div>
                <div className={s.fearThumb} style={{ left:`${fearGreed}%`, background: fearColor }}></div>
              </div>
              <div className={s.fearLegend}><span>Extreme Fear</span><span>Extreme Greed</span></div>
            </div>
            <div className={s.fearNote}>Retail is greedy — historically a signal to be cautious.</div>
          </div>
        </div>

        <div className={s.panel}>
          <div className={s.panelHdr}><div className={s.panelTitle}>Funding Rates</div><span className={s.panelTag}>Perpetual futures</span></div>
          <div className={s.fundingList}>
            {FUNDING_DATA.map(f => (
              <div key={f.asset} className={s.fundingRow}>
                <div>
                  <span className={s.fundingAsset}>{f.asset}</span>
                  <span className={s.fundingSent}>{f.sentiment}</span>
                </div>
                <span className={`${s.fundingRate} ${f.rate > 0.02 ? s.danger : f.rate < 0 ? s.neg : s.pos}`}>
                  {f.rate > 0 ? '+' : ''}{(f.rate).toFixed(4)}%
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
              <span className={`${s.whaleBadge} ${s[w.type]}`}>{w.type === 'buy' ? 'Accumulation' : w.type === 'sell' ? 'Distribution' : 'Neutral'}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={s.insightBanner}>
        <div className={s.insightIcon}>AI</div>
        <div>
          <div className={s.insightTitle}>QuantEdge signal</div>
          <div className={s.insightText}>SOL funding rate is at 0.0241% — significantly above neutral. Overleveraged longs historically precede sharp corrections. Consider reducing long exposure or hedging.</div>
        </div>
      </div>
    </div>
  );
};
export default SmartMoney;
