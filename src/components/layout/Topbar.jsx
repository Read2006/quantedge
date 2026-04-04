import Logo from '../ui/Logo';
import s from './Topbar.module.css';

const Topbar = ({ theme, onThemeToggle }) => (
  <header className={s.topbar}>
    <div className={s.logoWrap}>
      <Logo size={28}/>
      <div>
        <div className={s.wordmark}>Quant<span>Edge</span></div>
        <div className={s.sub}>by Nexura Solutions</div>
      </div>
    </div>
    <div className={s.right}>
      <div className={s.pillLive}><span className={s.liveDot}></span>Live data</div>
      <button className={s.pill} onClick={onThemeToggle}>{theme==='dark'?'Light mode':'Dark mode'}</button>
      <div className={s.avatar}>NS</div>
    </div>
  </header>
);
export default Topbar;
