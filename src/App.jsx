import { useState } from 'react';
import Topbar from './components/layout/Topbar';
import Sidebar from './components/layout/Sidebar';
import MacroRadar from './components/modules/MacroRadar';
import Correlations from './components/modules/Correlations';
import SmartMoney from './components/modules/SmartMoney';
import ComingSoon from './components/modules/ComingSoon';
import AIChat from './components/modules/AIChat';
import s from './App.module.css';

const App = () => {
  const [theme, setTheme] = useState('dark');
  const [activeModule, setActiveModule] = useState('macro');
  const [aiOpen, setAiOpen] = useState(false);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'macro':        return <MacroRadar />;
      case 'correlations': return <Correlations />;
      case 'smartmoney':   return <SmartMoney />;
      case 'narratives':   return <ComingSoon moduleId="narratives" />;
      case 'journal':      return <ComingSoon moduleId="journal" />;
      case 'whatmoved':    return <ComingSoon moduleId="whatmoved" />;
      default:             return <MacroRadar />;
    }
  };

  return (
    <div className={s.app}>
      <Topbar theme={theme} onThemeToggle={toggleTheme} />
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
    </div>
  );
};

export default App;
