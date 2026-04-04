const Logo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 42 42" fill="none">
    <polygon points="21,2 38,13 38,29 21,40 4,29 4,13" fill="#16130A" stroke="#7A6030" strokeWidth="1"/>
    <polygon points="21,7 33,14.5 33,27.5 21,35 9,27.5 9,14.5" fill="#1E1800" stroke="#C9A84C" strokeWidth="0.8"/>
    <polygon points="21,12 28,16.5 28,25.5 21,30 14,25.5 14,16.5" fill="#C9A84C"/>
    <polygon points="21,15 25,17.5 25,24.5 21,27 17,24.5 17,17.5" fill="#A8863A"/>
    <line x1="21" y1="12" x2="21" y2="30" stroke="#16130A" strokeWidth="0.8" opacity="0.6"/>
    <line x1="14" y1="16.5" x2="28" y2="25.5" stroke="#16130A" strokeWidth="0.8" opacity="0.6"/>
    <line x1="28" y1="16.5" x2="14" y2="25.5" stroke="#16130A" strokeWidth="0.8" opacity="0.6"/>
  </svg>
);
export default Logo;
