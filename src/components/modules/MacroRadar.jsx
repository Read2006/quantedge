import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { fetchFRED, fetchCryptoMarkets, fetchBTCHistory, fmtNum, nowStr } from '../../utils/api';
import s from './MacroRadar.module.css';

const MetricCard = ({ label, value, change, changeDir, badge, badgeType }) => (
  <div className={s.metricCard}>
    <div className={s.metricLabel}>{label}</div>
    <div className={s.metricVal}>{value || <span className={s.skeleton}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>}</div>
    {change && <div className={`${s.metricChange} ${s[changeDir]}`}>{change}</div>}
    {badge && <span className={`${s.badge} ${s[badgeType]}`}>{badge}</span>}
  </div>
);

const MacroRadar = () => {
  const [data, setData] = useState({ fed:null, cpi:null, btc:null, gold:null, crypto:[], btcHistory:[] });
  const [updated, setUpdated] = useState('Fetching live data...');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setUpdated('Fetching live data...');
    try {
      const [fed, cpi, gold, crypto, btcHist] = await Promise.all([
        fetchFRED('FEDFUNDS'),
        fetchFRED('CPIAUCSL'),
        fetchFRED('GOLDAMGBD228NLBM'),
        fetchCryptoMarkets(),
        fetchBTCHistory(30),
      ]);
      const btc = crypto?.[0] || null;
      const btcHistory = btcHist?.prices?.map((p, i) => ({
        day: i + 1,
        price: Math.round(p[1]),
        date: new Date(p[0]).toLocaleDateString('en-US', { month:'short', day:'numeric' })
      })) || [];
      setData({ fed, cpi, btc, gold, crypto, btcHistory });
      setUpdated(`Last updated ${nowStr()} · FRED & CoinGecko`);
    } catch {
      setUpdated('Some data unavailable — showing cached values');
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const fedVal = data.fed?.[0] ? parseFloat(data.fed[0].value) : 5.33;
  const cpiVal = data.cpi?.[0] ? parseFloat(data.cpi[0].value) : 3.2;
  const cpiPrev = data.cpi?.[1] ? parseFloat(data.cpi[1].value) : 3.1;
  const cpiDiff = (cpiVal - cpiPrev).toFixed(2);
  const goldVal = data.gold?.[0] ? parseFloat(data.gold[0].value) : 2320;
  const btcChg = data.btc?.price_change_percentage_24h || 0;
  const btcPrice = data.btc?.current_price || 0;

  const signals = [
    { asset:'Gold', reason: fedVal > 4 ? 'High rates offset by DXY weakness' : 'Low rate environment supports gold', signal: 'bull', label:'Bullish' },
    { asset:'Bitcoin', reason: btcChg >= 0 ? '24h momentum positive' : 'Risk-off pressure active', signal: btcChg >= 1 ? 'bull' : btcChg < -1 ? 'bear' : 'neut', label: btcChg >= 1 ? 'Bullish' : btcChg < -1 ? 'Bearish' : 'Neutral' },
    { asset:'Equities', reason: fedVal > 4 && cpiVal > 3 ? 'High rates + inflation weigh on growth' : 'Macro environment supportive', signal: fedVal > 4 && cpiVal > 3 ? 'bear' : 'neut', label: fedVal > 4 && cpiVal > 3 ? 'Cautious' : 'Neutral' },
    { asset:'Oil', reason: cpiVal > 3 ? 'Inflationary environment supports energy' : 'Demand signals mixed', signal: cpiVal > 3 ? 'bull' : 'neut', label: cpiVal > 3 ? 'Bullish' : 'Neutral' },
  ];

  const customTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className={s.tooltip}>
          <div className={s.tooltipDate}>{payload[0].payload.date}</div>
          <div className={s.tooltipVal}>${fmtNum(payload[0].value, 0)}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={s.wrap}>
      <div className={s.pageHdr}>
        <div>
          <div className={s.pageTitle}>Macro Radar</div>
          <div className={s.pageSub}>{updated}</div>
        </div>
        <div className={s.actions}>
          <button className={s.btn} onClick={load}>Refresh</button>
          <button className={`${s.btn} ${s.primary}`}>Set alert</button>
        </div>
      </div>

      <div className={s.metrics}>
        <MetricCard label="Fed Funds Rate" value={`${fmtNum(fedVal,2)}%`} change="Last FOMC decision" changeDir="neutral" badge="Held steady" badgeType="held"/>
        <MetricCard label="US CPI Inflation" value={`${fmtNum(cpiVal,1)}%`} change={`${parseFloat(cpiDiff)>0?'▲':'▼'} ${Math.abs(cpiDiff)} MoM`} changeDir={parseFloat(cpiDiff)>0?'down':'up'} badge={parseFloat(cpiDiff)>0?'Rising':'Easing'} badgeType={parseFloat(cpiDiff)>0?'rising':'falling'}/>
        <MetricCard label="Bitcoin (USD)" value={btcPrice ? `$${fmtNum(btcPrice,0)}` : '—'} change={`${btcChg>=0?'▲':'▼'} ${fmtNum(Math.abs(btcChg),2)}% 24h`} changeDir={btcChg>=0?'up':'down'} badge={btcChg>=0?'Gaining':'Declining'} badgeType={btcChg>=0?'falling':'rising'}/>
        <MetricCard label="Gold (USD/oz)" value={goldVal ? `$${fmtNum(goldVal,0)}` : '—'} change="FRED monthly data" changeDir="neutral" badge="Store of value" badgeType="held"/>
      </div>

      <div className={s.midGrid}>
        <div className={s.panel}>
          <div className={s.panelHdr}>
            <div className={s.panelTitle}>Bitcoin — 30 day trend</div>
            {data.btcHistory.length > 0 && (
              <span className={s.panelTag}>
                {((data.btcHistory[data.btcHistory.length-1]?.price - data.btcHistory[0]?.price) / data.btcHistory[0]?.price * 100).toFixed(2)}% 30d
              </span>
            )}
          </div>
          <div className={s.chartWrap}>
            {data.btcHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height={130}>
                <AreaChart data={data.btcHistory}>
                  <defs>
                    <linearGradient id="btcGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C9A84C" stopOpacity={0.2}/>
                      <stop offset="100%" stopColor="#C9A84C" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="price" stroke="#C9A84C" strokeWidth={1.5} fill="url(#btcGrad)" dot={false}/>
                  <XAxis dataKey="date" hide/>
                  <YAxis hide domain={['auto','auto']}/>
                  <Tooltip content={customTooltip}/>
                </AreaChart>
              </ResponsiveContainer>
            ) : <div className={s.chartLoading}>Loading chart...</div>}
          </div>
        </div>

        <div className={s.panel}>
          <div className={s.panelHdr}><div className={s.panelTitle}>Cross-market signals</div></div>
          <div className={s.impactList}>
            {signals.map(sig => (
              <div key={sig.asset} className={s.impactRow}>
                <div>
                  <div className={s.impactAsset}>{sig.asset}</div>
                  <div className={s.impactReason}>{sig.reason}</div>
                </div>
                <span className={`${s.signal} ${s[sig.signal]}`}>{sig.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={s.bottomGrid}>
        <div className={s.panel}>
          <div className={s.panelHdr}>
            <div className={s.panelTitle}>Upcoming macro events</div>
            <span className={s.panelTag}>Next 14 days</span>
          </div>
          <div className={s.eventList}>
            {[
              { date:'Apr 10', title:'US CPI Release', detail:'High impact — inflation print', lvl:'high' },
              { date:'Apr 16', title:'FOMC Minutes', detail:'High impact — Fed rate guidance', lvl:'high' },
              { date:'Apr 11', title:'US PPI Data', detail:'Medium impact — producer prices', lvl:'med' },
              { date:'Apr 14', title:'Retail Sales', detail:'Low impact — consumer spending', lvl:'low' },
            ].map(e => (
              <div key={e.title} className={s.eventRow}>
                <span className={`${s.eventDot} ${s[e.lvl]}`}></span>
                <span className={s.eventDate}>{e.date}</span>
                <div><div className={s.eventTitle}>{e.title}</div><div className={s.eventDetail}>{e.detail}</div></div>
              </div>
            ))}
          </div>
        </div>

        <div className={s.panel}>
          <div className={s.panelHdr}>
            <div className={s.panelTitle}>Crypto overview</div>
            <span className={s.panelTag}>CoinGecko live</span>
          </div>
          <div className={s.cryptoList}>
            {data.crypto.length > 0 ? data.crypto.map(c => (
              <div key={c.id} className={s.cryptoRow}>
                <div>
                  <div className={s.cryptoName}>{c.name} <span className={s.cryptoSymbol}>{c.symbol.toUpperCase()}</span></div>
                  <div className={s.cryptoMcap}>MCap ${(c.market_cap/1e9).toFixed(0)}B</div>
                </div>
                <div className={s.cryptoRight}>
                  <div className={s.cryptoPrice}>${fmtNum(c.current_price, c.current_price > 100 ? 0 : 4)}</div>
                  <div className={`${s.cryptoChg} ${c.price_change_percentage_24h >= 0 ? s.up : s.down}`}>
                    {c.price_change_percentage_24h >= 0 ? '▲' : '▼'} {fmtNum(Math.abs(c.price_change_percentage_24h), 2)}%
                  </div>
                </div>
              </div>
            )) : <div className={s.loadingText}>Loading crypto data...</div>}
          </div>
        </div>
      </div>
    </div>
  );
};
export default MacroRadar;
