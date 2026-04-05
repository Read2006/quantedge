import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import s from './TradeJournal.module.css';

const TRADES = [
  { id:1, date:'Apr 03', asset:'BTC', type:'Long', entry:81200, exit:84500, size:0.5, pnl:1650, pnlPct:4.07, strategy:'Breakout', emotion:'Confident', duration:'2d' },
  { id:2, date:'Apr 01', asset:'ETH', type:'Long', entry:1820, exit:1790, size:2, pnl:-60, pnlPct:-1.65, strategy:'Dip buy', emotion:'Fearful', duration:'4h' },
  { id:3, date:'Mar 29', asset:'NVDA', type:'Long', entry:840, exit:902, size:10, pnl:620, pnlPct:7.38, strategy:'Momentum', emotion:'Confident', duration:'3d' },
  { id:4, date:'Mar 27', asset:'SOL', type:'Short', entry:148, exit:141, size:20, pnl:140, pnlPct:4.73, strategy:'Funding rate fade', emotion:'Calm', duration:'6h' },
  { id:5, date:'Mar 25', asset:'BTC', type:'Long', entry:87000, exit:83000, size:0.3, pnl:-1200, pnlPct:-4.60, strategy:'FOMO', emotion:'Excited', duration:'1h' },
  { id:6, date:'Mar 22', asset:'AAPL', type:'Long', entry:172, exit:178, size:30, pnl:180, pnlPct:3.49, strategy:'Earnings play', emotion:'Calm', duration:'5d' },
  { id:7, date:'Mar 20', asset:'Gold', type:'Long', entry:2180, exit:2240, size:2, pnl:120, pnlPct:2.75, strategy:'Macro hedge', emotion:'Calm', duration:'7d' },
  { id:8, date:'Mar 18', asset:'DOGE', type:'Long', entry:0.142, exit:0.121, size:5000, pnl:-105, pnlPct:-14.79, strategy:'FOMO', emotion:'Excited', duration:'2h' },
];

const MONTHLY_PNL = [
  { month:'Oct', pnl:1200 }, { month:'Nov', pnl:-340 }, { month:'Dec', pnl:2100 },
  { month:'Jan', pnl:880 }, { month:'Feb', pnl:-620 }, { month:'Mar', pnl:1695 }, { month:'Apr', pnl:1590 },
];

const STRATEGY_DATA = [
  { name:'Breakout', wins:8, losses:2 }, { name:'Momentum', wins:6, losses:3 },
  { name:'Dip buy', wins:4, losses:5 }, { name:'FOMO', wins:1, losses:6 },
  { name:'Macro hedge', wins:7, losses:1 },
];

const TradeJournal = () => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ asset:'', type:'Long', entry:'', exit:'', size:'', strategy:'', emotion:'Calm', notes:'' });

  const totalPnl = TRADES.reduce((a, t) => a + t.pnl, 0);
  const wins = TRADES.filter(t => t.pnl > 0).length;
  const winRate = ((wins / TRADES.length) * 100).toFixed(0);
  const avgWin = (TRADES.filter(t=>t.pnl>0).reduce((a,t)=>a+t.pnl,0)/wins).toFixed(0);
  const losses = TRADES.filter(t => t.pnl < 0);
  const avgLoss = losses.length ? (losses.reduce((a,t)=>a+t.pnl,0)/losses.length).toFixed(0) : 0;

  const customTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      const val = payload[0].value;
      return (
        <div className={s.tooltip}>
          <div style={{ color: val >= 0 ? 'var(--green)' : 'var(--red)', fontWeight:600, fontSize:'13px' }}>
            {val >= 0 ? '+' : ''}${val}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={s.wrap}>
      <div className={s.pageHdr}>
        <div>
          <div className={s.pageTitle}>Trade Journal</div>
          <div className={s.pageSub}>Your personal trading analytics engine — know yourself before the market</div>
        </div>
        <button className={s.addBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Log trade'}
        </button>
      </div>

      {showForm && (
        <div className={s.formPanel}>
          <div className={s.formTitle}>Log a new trade</div>
          <div className={s.formGrid}>
            <div className={s.formField}>
              <label>Asset</label>
              <input placeholder="BTC, ETH, AAPL..." value={form.asset} onChange={e=>setForm({...form,asset:e.target.value})}/>
            </div>
            <div className={s.formField}>
              <label>Direction</label>
              <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                <option>Long</option><option>Short</option>
              </select>
            </div>
            <div className={s.formField}>
              <label>Entry price</label>
              <input type="number" placeholder="0.00" value={form.entry} onChange={e=>setForm({...form,entry:e.target.value})}/>
            </div>
            <div className={s.formField}>
              <label>Exit price</label>
              <input type="number" placeholder="0.00" value={form.exit} onChange={e=>setForm({...form,exit:e.target.value})}/>
            </div>
            <div className={s.formField}>
              <label>Size</label>
              <input type="number" placeholder="0" value={form.size} onChange={e=>setForm({...form,size:e.target.value})}/>
            </div>
            <div className={s.formField}>
              <label>Strategy</label>
              <input placeholder="Breakout, Dip buy..." value={form.strategy} onChange={e=>setForm({...form,strategy:e.target.value})}/>
            </div>
            <div className={s.formField}>
              <label>Emotion</label>
              <select value={form.emotion} onChange={e=>setForm({...form,emotion:e.target.value})}>
                <option>Calm</option><option>Confident</option><option>Fearful</option><option>Excited</option><option>Frustrated</option>
              </select>
            </div>
            <div className={s.formField} style={{gridColumn:'span 2'}}>
              <label>Notes</label>
              <input placeholder="What was your thesis?" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/>
            </div>
          </div>
          <button className={s.saveBtn}>Save trade</button>
        </div>
      )}

      <div className={s.statsRow}>
        {[
          { label:'Total P&L', value:`${totalPnl>=0?'+':''}$${totalPnl.toLocaleString()}`, color: totalPnl>=0?'var(--green)':'var(--red)' },
          { label:'Win rate', value:`${winRate}%`, color:'var(--text)' },
          { label:'Avg win', value:`+$${avgWin}`, color:'var(--green)' },
          { label:'Avg loss', value:`$${avgLoss}`, color:'var(--red)' },
          { label:'Total trades', value:TRADES.length, color:'var(--text)' },
        ].map(stat => (
          <div key={stat.label} className={s.statCard}>
            <div className={s.statLabel}>{stat.label}</div>
            <div className={s.statVal} style={{ color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className={s.chartsRow}>
        <div className={s.panel}>
          <div className={s.panelHdr}><div className={s.panelTitle}>Monthly P&L</div></div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={MONTHLY_PNL}>
              <XAxis dataKey="month" tick={{ fontSize:11, fill:'var(--muted)' }} axisLine={false} tickLine={false}/>
              <YAxis hide/>
              <Tooltip content={customTooltip}/>
              <Bar dataKey="pnl" radius={[3,3,0,0]}>
                {MONTHLY_PNL.map((entry, i) => (
                  <Cell key={i} fill={entry.pnl >= 0 ? 'var(--green)' : 'var(--red)'} opacity={0.8}/>
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={s.panel}>
          <div className={s.panelHdr}><div className={s.panelTitle}>Win rate by strategy</div></div>
          <div className={s.strategyList}>
            {STRATEGY_DATA.map(st => {
              const wr = ((st.wins/(st.wins+st.losses))*100).toFixed(0);
              return (
                <div key={st.name} className={s.stratRow}>
                  <span className={s.stratName}>{st.name}</span>
                  <div className={s.stratBar}>
                    <div className={s.stratFill} style={{ width:`${wr}%`, background: wr>=60?'var(--green)':wr>=40?'var(--gold)':'var(--red)' }}></div>
                  </div>
                  <span className={s.stratPct} style={{ color: wr>=60?'var(--green)':wr>=40?'var(--gold)':'var(--red)' }}>{wr}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={s.insightBanner}>
        <div className={s.insightIcon}>AI</div>
        <div>
          <div className={s.insightTitle}>QuantEdge AI insight</div>
          <div className={s.insightText}>Your FOMO trades have a <strong>14% win rate</strong> vs your calm/confident trades at <strong>78%</strong>. You lose 6x more when trading emotionally. Consider a pre-trade checklist before entering any position.</div>
        </div>
      </div>

      <div className={s.panel}>
        <div className={s.panelHdr}>
          <div className={s.panelTitle}>Trade history</div>
          <span className={s.panelTag}>{TRADES.length} trades</span>
        </div>
        <div className={s.tradeTable}>
          <div className={s.tableHdr}>
            <span>Date</span><span>Asset</span><span>Type</span><span>Entry</span><span>Exit</span><span>P&L</span><span>Strategy</span><span>Emotion</span>
          </div>
          {TRADES.map(t => (
            <div key={t.id} className={s.tableRow}>
              <span className={s.tdMuted}>{t.date}</span>
              <span className={s.tdBold}>{t.asset}</span>
              <span className={`${s.typeBadge} ${t.type==='Long'?s.long:s.short}`}>{t.type}</span>
              <span className={s.tdMuted}>${t.entry.toLocaleString()}</span>
              <span className={s.tdMuted}>${t.exit.toLocaleString()}</span>
              <span className={t.pnl>=0?s.tdGreen:s.tdRed}>{t.pnl>=0?'+':''}${t.pnl.toLocaleString()} <span className={s.tdPct}>({t.pnlPct>=0?'+':''}{t.pnlPct}%)</span></span>
              <span className={s.stratTag}>{t.strategy}</span>
              <span className={s.tdMuted}>{t.emotion}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TradeJournal;
