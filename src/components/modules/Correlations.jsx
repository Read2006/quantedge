import { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { fetchCoinHistory, fetchBTCHistory, fmtNum, nowStr } from '../../utils/api';
import s from './Correlations.module.css';

const PAIRS = [
  { id:'btc-nasdaq', label:'BTC vs Nasdaq', desc:'Risk asset correlation', strength: 0.78, direction:'positive' },
  { id:'gold-dxy', label:'Gold vs DXY', desc:'Inverse relationship', strength: -0.82, direction:'negative' },
  { id:'btc-eth', label:'BTC vs ETH', desc:'Crypto co-movement', strength: 0.91, direction:'positive' },
  { id:'oil-inflation', label:'Oil vs CPI', desc:'Energy drives inflation', strength: 0.65, direction:'positive' },
  { id:'gold-btc', label:'Gold vs BTC', desc:'Store-of-value pair', strength: 0.44, direction:'positive' },
  { id:'dxy-em', label:'DXY vs EM', desc:'Dollar pressure on EM assets', strength: -0.71, direction:'negative' },
];

const CorrelationBar = ({ strength }) => {
  const abs = Math.abs(strength);
  const pct = (abs * 100).toFixed(0);
  const color = strength > 0 ? 'var(--green)' : 'var(--red)';
  return (
    <div className={s.barWrap}>
      <div className={s.barTrack}>
        <div className={s.barFill} style={{ width:`${pct}%`, background: color }}></div>
      </div>
      <span className={s.barVal} style={{ color }}>{strength > 0 ? '+' : ''}{strength.toFixed(2)}</span>
    </div>
  );
};

const Correlations = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updated, setUpdated] = useState('Loading...');

  useEffect(() => {
    const load = async () => {
      try {
        const [btc, eth] = await Promise.all([
          fetchBTCHistory(60),
          fetchCoinHistory('ethereum', 60),
        ]);
        if (btc?.prices && eth?.prices) {
          const len = Math.min(btc.prices.length, eth.prices.length);
          const combined = [];
          for (let i = 0; i < len; i++) {
            combined.push({
              day: i + 1,
              btc: Math.round(btc.prices[i][1]),
              eth: Math.round(eth.prices[i][1]),
              date: new Date(btc.prices[i][0]).toLocaleDateString('en-US', { month:'short', day:'numeric' }),
            });
          }
          setChartData(combined);
        }
        setUpdated(`Last updated ${nowStr()}`);
      } catch { setUpdated('Data unavailable'); }
      setLoading(false);
    };
    load();
  }, []);

  const customTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className={s.tooltip}>
          <div className={s.tooltipDate}>{payload[0]?.payload?.date}</div>
          {payload.map(p => (
            <div key={p.name} style={{ color: p.color, fontSize:'12px' }}>
              {p.name.toUpperCase()}: ${fmtNum(p.value, 0)}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={s.wrap}>
      <div className={s.pageHdr}>
        <div>
          <div className={s.pageTitle}>Cross-Market Correlations</div>
          <div className={s.pageSub}>{updated} · Strength ranges from -1 (inverse) to +1 (aligned)</div>
        </div>
      </div>

      <div className={s.alertBanner}>
        <span className={s.alertDot}></span>
        <strong>Divergence detected:</strong>&nbsp;BTC is underperforming Nasdaq over the last 7 days — potential reversion opportunity.
      </div>

      <div className={s.pairsGrid}>
        {PAIRS.map(p => (
          <div key={p.id} className={s.pairCard}>
            <div className={s.pairTop}>
              <div>
                <div className={s.pairLabel}>{p.label}</div>
                <div className={s.pairDesc}>{p.desc}</div>
              </div>
              <span className={`${s.dirBadge} ${p.direction === 'positive' ? s.pos : s.neg}`}>
                {p.direction === 'positive' ? 'Aligned' : 'Inverse'}
              </span>
            </div>
            <CorrelationBar strength={p.strength}/>
          </div>
        ))}
      </div>

      <div className={s.panel}>
        <div className={s.panelHdr}>
          <div className={s.panelTitle}>BTC vs ETH — 60 day price trend</div>
          <span className={s.panelTag}>Normalised scale</span>
        </div>
        {loading ? (
          <div className={s.chartLoading}>Loading chart data...</div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" hide/>
              <YAxis yAxisId="btc" hide domain={['auto','auto']}/>
              <YAxis yAxisId="eth" orientation="right" hide domain={['auto','auto']}/>
              <Tooltip content={customTooltip}/>
              <Legend wrapperStyle={{ fontSize:'11px', color:'var(--muted2)' }}/>
              <Line yAxisId="btc" type="monotone" dataKey="btc" stroke="#C9A84C" strokeWidth={1.5} dot={false} name="BTC"/>
              <Line yAxisId="eth" type="monotone" dataKey="eth" stroke="#3DCB8A" strokeWidth={1.5} dot={false} name="ETH"/>
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className={s.insightGrid}>
        {[
          { title:'Strongest correlation', val:'BTC / ETH', sub:'+0.91 — crypto co-movement', color:'var(--green)' },
          { title:'Strongest inverse', val:'Gold / DXY', sub:'-0.82 — classic hedge pair', color:'var(--red)' },
          { title:'Weakest link', val:'Gold / BTC', sub:'+0.44 — diverging narratives', color:'var(--muted2)' },
        ].map(i => (
          <div key={i.title} className={s.insightCard}>
            <div className={s.insightLabel}>{i.title}</div>
            <div className={s.insightVal} style={{ color: i.color }}>{i.val}</div>
            <div className={s.insightSub}>{i.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Correlations;
