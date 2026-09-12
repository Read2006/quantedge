import { useState } from 'react';
import Topbar from './components/layout/Topbar';
import Sidebar from './components/layout/Sidebar';
import MacroRadar from './components/modules/MacroRadar';
import Correlations from './components/modules/Correlations';
import SmartMoney from './components/modules/SmartMoney';
import NarrativeDetector from './components/modules/NarrativeDetector';
import TradeJournal from './components/modules/TradeJournal';
import WhatMovedThis from './components/modules/WhatMovedThis';
import AIChat from './components/modules/AIChat';
import AlertsModal from './components/modules/AlertsModal';
import s from './App.module.css';

const App = () => {
  const [theme, setTheme] = useState('dark');
  const [activeModule, setActiveModule] = useState('macro');
  const [aiOpen, setAiOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'macro':        return <MacroRadar onSetAlert={() => setAlertsOpen(true)} />;
      case 'correlations': return <Correlations />;
      case 'smartmoney':   return <SmartMoney />;
      case 'narratives':   return <NarrativeDetector />;
      case 'journal':      return <TradeJournal />;
      case 'whatmoved':    return <WhatMovedThis />;
      default:             return <MacroRadar onSetAlert={() => setAlertsOpen(true)} />;
    }
  };

  return (
    <div className={s.app}>
      <Topbar theme={theme} onThemeToggle={toggleTheme} onSetAlert={() => setAlertsOpen(true)} />
      <div className={s.body}>
        <Sidebar active={activeModule} onNav={setActiveModule} onAIOpen={() => setAiOpen(true)} />
        <main className={s.main}>
          {renderModule()}
        </main>
      </div>
      <footer className={s.footer}>
        <span>All data is for informational purposes only. Not financial advice. Sources: FRED, CoinGecko.</span>
        <span className={s.footerBrand}>Nexura Solutions</span>
      </footer>
      {aiOpen && <AIChat onClose={() => setAiOpen(false)} />}
      {alertsOpen && <AlertsModal onClose={() => setAlertsOpen(false)} />}
    </div>
  );
};

export default App;
