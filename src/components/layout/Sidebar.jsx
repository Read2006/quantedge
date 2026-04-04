import s from './Sidebar.module.css';

const NAV = [
  { id:'macro', label:'Macro Radar', num:'01' },
  { id:'correlations', label:'Correlations', num:'02' },
  { id:'smartmoney', label:'Smart Money', num:'03' },
  { id:'narratives', label:'Narratives', num:'04' },
  { id:'journal', label:'Trade Journal', num:'05' },
  { id:'whatmoved', label:'What Moved This?', num:'06' },
];

const Sidebar = ({ active, onNav, onAIOpen }) => (
  <aside className={s.sidebar}>
    <div className={s.section}>
      <div className={s.label}>Platform</div>
      {NAV.slice(0,4).map(n => (
        <div key={n.id} className={`${s.item} ${active===n.id?s.active:''}`} onClick={()=>onNav(n.id)}>
          <span className={s.num}>{n.num}</span>{n.label}
        </div>
      ))}
    </div>
    <div className={s.divider}/>
    <div className={s.section}>
      <div className={s.label}>Personal</div>
      {NAV.slice(4).map(n => (
        <div key={n.id} className={`${s.item} ${active===n.id?s.active:''}`} onClick={()=>onNav(n.id)}>
          <span className={s.num}>{n.num}</span>{n.label}
        </div>
      ))}
    </div>
    <div className={s.divider}/>
    <div className={s.section}>
      <div className={s.label}>Account</div>
      <div className={s.item}><span className={s.num}>—</span>Settings</div>
    </div>
    <div className={s.aiBtn} onClick={onAIOpen}>
      <div className={s.aiTop}><span className={s.aiDot}></span><span className={s.aiLabel}>QuantEdge AI</span></div>
      <div className={s.aiDesc}>Ask anything — markets, macro, personal finance</div>
    </div>
  </aside>
);
export default Sidebar;
