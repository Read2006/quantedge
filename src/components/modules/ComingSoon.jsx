import s from './ComingSoon.module.css';

const MODULES = {
  narratives: {
    num: '04',
    title: 'Narrative Detector',
    desc: 'AI-powered market storytelling — scrape news, Twitter, and Reddit to detect trending market themes and map them to assets before the crowd catches on.',
    features: ['Real-time news NLP analysis','Reddit & Twitter sentiment scoring','Narrative-to-asset mapping (AI → NVDA, Oil crisis → XOM)','Momentum alerts when narratives accelerate'],
  },
  journal: {
    num: '05',
    title: 'Trade Journal',
    desc: 'Your personal trading analytics engine. Log trades, analyze patterns, and let ML surface insights about when and how you perform best.',
    features: ['Trade logging with strategy tags','Win rate by asset, timeframe, and market condition','Emotional trade detection','ML-powered performance insights'],
  },
  whatmoved: {
    num: '06',
    title: 'What Moved This?',
    desc: 'Click any asset and instantly get a full breakdown of why it moved — news, macro, correlated assets, and institutional flows all in one view.',
    features: ['One-click movement explanation','News + macro correlation engine','Institutional vs retail move classifier','Historical context comparison'],
  },
};

const ComingSoon = ({ moduleId }) => {
  const mod = MODULES[moduleId] || MODULES.narratives;
  return (
    <div className={s.wrap}>
      <div className={s.header}>
        <div className={s.num}>{mod.num}</div>
        <div className={s.title}>{mod.title}</div>
        <div className={s.badge}>Coming soon</div>
      </div>
      <div className={s.desc}>{mod.desc}</div>
      <div className={s.featureGrid}>
        {mod.features.map(f => (
          <div key={f} className={s.featureCard}>
            <span className={s.featureDot}></span>
            {f}
          </div>
        ))}
      </div>
      <div className={s.cta}>
        <div className={s.ctaText}>This module is being built. Stay tuned — it will be live in the next update.</div>
        <div className={s.ctaNote}>Powered by QuantEdge AI · Nexura Solutions</div>
      </div>
    </div>
  );
};
export default ComingSoon;
